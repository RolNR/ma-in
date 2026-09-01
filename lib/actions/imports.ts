'use server'

import * as XLSX from 'xlsx'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

export type ImportState =
  | { status: 'idle' }
  | { status: 'success'; total: number; imported: number; skipped: number; errors: number; matched: number; batchId: string | null }
  | { status: 'error'; message: string }

export type PreviewRowIssue = 'sin_codigo' | 'ya_existe' | 'duplicado_archivo' | 'sin_cliente'

export interface PreviewRow {
  trackingCode: string | null
  company: string | null
  destination: string | null
  status: string | null
  date: string
  issue: PreviewRowIssue | null
}

export type PreviewState =
  | { status: 'idle' }
  | {
      status: 'ready'
      total: number
      toImport: number
      skippedExisting: number
      intraDups: number
      withoutCode: number
      matched: number
      unmatchedOrigins: string[]
      sampleOk: PreviewRow[]
      sampleIssues: PreviewRow[]
    }
  | { status: 'error'; message: string }

function toDate(val: unknown): Date {
  if (val instanceof Date) return val
  if (typeof val === 'number') return new Date(Math.round((val - 25569) * 86400 * 1000))
  return new Date()
}

function fmtDate(val: unknown): string {
  return toDate(val).toLocaleDateString('es-MX')
}

function normalizeStatus(raw: unknown): ShipmentStatus {
  const s = String(raw ?? '').trim().toUpperCase()
  if (['ENTREGADO', 'ENTREDAGO'].includes(s)) return 'ENTREGADO'
  if (
    s.startsWith('ERRONEA') ||
    ['RETORNO', 'DEVOLUCION A REMITENTE', 'SE GENERA GUIA DE REEMPLAZO'].includes(s)
  )
    return 'ERRONEA'
  if (s === 'CADUCADA') return 'CADUCADA'
  if (s === 'CANCELADA') return 'CANCELADA'
  if (['SIN UTILIZAR', 'NO SE UTILIZO'].includes(s)) return 'SIN_UTILIZAR'
  if (
    s.includes('EN PROCESO DE ENTREGA') ||
    s.includes('DISPONIBLE EN OFICINA') ||
    s.includes('INTENTO DE LLAMADA') ||
    s.includes('GARANTIA DE ENTREGA') ||
    s.includes('ENVIO EN PROCESO')
  )
    return 'EN_PROCESO_ENTREGA'
  return 'EN_RUTA'
}

function str(val: unknown): string | null {
  const s = String(val ?? '').trim()
  return s || null
}

function num(val: unknown): number | null {
  const n = parseFloat(String(val ?? ''))
  return isNaN(n) ? null : n
}

// ─── Parseo + validación compartidos entre preview y confirmación ─────────────
// Única fuente de verdad: tanto previewImportShipments como importShipments
// corren exactamente esta misma lógica, así el preview nunca puede divergir
// de lo que realmente se va a escribir en la base de datos.

interface ParsedRecord {
  trackingCode: string
  clientId: number | null
  folioInterno: string | null
  guideType: string | null
  externalGuideNo: string | null
  senderName: string | null
  destCity: string | null
  status: ShipmentStatus
  receivedBy: string | null
  content: string | null
  weight: number | null
  overweight: number | null
  shipmentDate: Date
  carrierMetadata: object
}

interface ParseResult {
  carrierId: number
  totalRows: number
  toInsert: ParsedRecord[]
  matchedCount: number
  errorCount: number
  skippedExisting: number
  intraDups: number
  unmatchedOrigins: string[]
  sampleOk: PreviewRow[]
  sampleIssues: PreviewRow[]
}

const SAMPLE_LIMIT = 12

async function parseAndValidate(
  file: File | null,
  carrierId: number | null,
): Promise<ParseResult | { error: string }> {
  if (!file || file.size === 0) return { error: 'Selecciona un archivo.' }
  if (!/\.(xlsx|xls)$/i.test(file.name))
    return { error: 'El archivo debe ser .xlsx o .xls.' }
  if (!carrierId) return { error: 'Selecciona la paquetería del archivo.' }

  const carrier = await db.carrier.findFirst({ where: { id: carrierId, active: true }, select: { id: true } })
  if (!carrier) return { error: 'La paquetería seleccionada no es válida.' }

  // Parse Excel — normalizar headers para eliminar espacios en nombre de columna
  let rows: Record<string, unknown>[]
  try {
    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(new Uint8Array(buffer), { type: 'array', cellDates: true })
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rawData = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 }) as unknown[][]
    if (rawData.length < 2) return { error: 'El archivo no tiene datos.' }
    const headers = (rawData[0] as unknown[]).map(h => String(h ?? '').trim())
    rows = rawData
      .slice(1)
      .map(row => {
        const obj: Record<string, unknown> = {}
        headers.forEach((h, i) => { obj[h] = (row as unknown[])[i] ?? null })
        return obj
      })
      .filter(r => Object.values(r).some(v => v !== null && v !== ''))
  } catch {
    return { error: 'No se pudo leer el archivo. Verifica que sea un Excel válido.' }
  }

  if (rows.length === 0) return { error: 'El archivo está vacío.' }

  // Lookup de clientes: legalName (razón social) → id, con fallback a companyName
  const clients = await db.client.findMany({
    where: { active: true },
    select: { id: true, companyName: true, legalName: true },
  })
  const clientMap = new Map<string, number>(
    clients.map(c => [(c.legalName ?? c.companyName).trim().toUpperCase(), c.id])
  )

  // Tracking codes ya existentes en DB
  const allTCs = rows
    .map(r => str(r['COD DE RASTREO']))
    .filter((tc): tc is string => Boolean(tc))
  const existing = await db.shipment.findMany({
    where: { trackingCode: { in: allTCs } },
    select: { trackingCode: true },
  })
  const existingSet = new Set(existing.map(s => s.trackingCode))

  const toInsert: ParsedRecord[] = []
  const sampleOk: PreviewRow[] = []
  const sampleIssues: PreviewRow[] = []
  const seenTCs = new Set<string>()
  const unmatchedOriginsSet = new Set<string>()
  const unmatchedOrigins: string[] = []

  let errorCount = 0
  let skippedExisting = 0
  let intraDups = 0
  let matchedCount = 0

  for (const row of rows) {
    const trackingCode = str(row['COD DE RASTREO'])
    const senderName = str(row['NOMBRE CORTO DE ORIGEN'])
    const destination = str(row['DESTINO'])
    const rawStatus = str(row['STATUS'])
    const previewBase = { trackingCode, company: senderName, destination, status: rawStatus, date: fmtDate(row['FECHA']) }

    if (!trackingCode) {
      errorCount++
      if (sampleIssues.length < SAMPLE_LIMIT) sampleIssues.push({ ...previewBase, issue: 'sin_codigo' })
      continue
    }
    if (existingSet.has(trackingCode)) {
      skippedExisting++
      if (sampleIssues.length < SAMPLE_LIMIT) sampleIssues.push({ ...previewBase, issue: 'ya_existe' })
      continue
    }
    if (seenTCs.has(trackingCode)) {
      intraDups++
      if (sampleIssues.length < SAMPLE_LIMIT) sampleIssues.push({ ...previewBase, issue: 'duplicado_archivo' })
      continue
    }
    seenTCs.add(trackingCode)

    const clientId = senderName ? (clientMap.get(senderName.toUpperCase()) ?? null) : null
    if (clientId) {
      matchedCount++
    } else if (senderName) {
      const key = senderName.toUpperCase()
      if (!unmatchedOriginsSet.has(key)) {
        unmatchedOriginsSet.add(key)
        unmatchedOrigins.push(senderName)
      }
    }

    // Algunos remitentes no envían PESO MAIN/SOBREPESO MAIN — se usa el peso
    // reportado por el carrier como fallback para no perder el dato.
    const pesoEstafeta = num(row['PESO ESTAFETA'])
    const sobrepesoEstafeta = num(row['SOBREPESO ESTAFETA'])

    toInsert.push({
      trackingCode,
      clientId,
      folioInterno: str(row['FOLIO INTERNO']),
      guideType: str(row['TIPO DE SERVICIO']),
      externalGuideNo: str(row['NUM GUIA']) ?? trackingCode,
      senderName,
      destCity: destination,
      status: normalizeStatus(row['STATUS']),
      receivedBy: str(row['RECIBIDO DESTINO']),
      content: str(row['CONTENIDO']),
      weight: num(row['PESO MAIN']) ?? pesoEstafeta,
      overweight: num(row['SOBREPESO MAIN']) ?? sobrepesoEstafeta,
      shipmentDate: toDate(row['FECHA']),
      carrierMetadata: {
        statusOriginal: rawStatus,
        pesoEstafeta,
        sobrepesoEstafeta,
        seguro: num(row['SEGURO']),
        precioGuia: num(row['PRECIO DE GUIA']),
        combustible: num(row['CARGO X COMBUSTIBLE']),
        precioSobrepeso: num(row['PRECIO SOBREPESO']),
        subtotal: num(row['SUBTOTAL']),
      },
    })

    if (sampleOk.length < SAMPLE_LIMIT) {
      sampleOk.push({ ...previewBase, issue: clientId ? null : 'sin_cliente' })
    }
  }

  return {
    carrierId,
    totalRows: rows.length,
    toInsert,
    matchedCount,
    errorCount,
    skippedExisting,
    intraDups,
    unmatchedOrigins,
    sampleOk,
    sampleIssues,
  }
}

// ─── Preview — solo lectura, no escribe nada en la base de datos ──────────────

export async function previewImportShipments(
  _prevState: PreviewState,
  formData: FormData,
): Promise<PreviewState> {
  const session = await auth()
  if (!session?.user) return { status: 'error', message: 'No autorizado.' }

  const carrierId = Number(formData.get('carrierId')) || null
  const result = await parseAndValidate(formData.get('file') as File | null, carrierId)
  if ('error' in result) return { status: 'error', message: result.error }

  return {
    status: 'ready',
    total: result.totalRows,
    toImport: result.toInsert.length,
    skippedExisting: result.skippedExisting,
    intraDups: result.intraDups,
    withoutCode: result.errorCount,
    matched: result.matchedCount,
    unmatchedOrigins: result.unmatchedOrigins,
    sampleOk: result.sampleOk,
    sampleIssues: result.sampleIssues,
  }
}

// ─── Confirmación — re-valida el mismo archivo y escribe en la base de datos ──
// Cada corrida crea un Batch propio: agrupa las guías importadas para poder
// identificarlas y, si algo sale mal, eliminarlas juntas desde /admin/lote/[id].

export async function importShipments(
  _prevState: ImportState,
  formData: FormData,
): Promise<ImportState> {
  const session = await auth()
  if (!session?.user) return { status: 'error', message: 'No autorizado.' }

  const carrierIdInput = Number(formData.get('carrierId')) || null
  const result = await parseAndValidate(formData.get('file') as File | null, carrierIdInput)
  if ('error' in result) return { status: 'error', message: result.error }

  const { carrierId, totalRows, toInsert, matchedCount, errorCount, skippedExisting, intraDups } = result
  const filename = (formData.get('file') as File).name
  const createdBy = parseInt(session.user.id)

  try {
    const { batchId, imported } = await db.$transaction(async (tx) => {
      if (toInsert.length === 0) return { batchId: null as string | null, imported: 0 }

      const batch = await tx.batch.create({
        data: { createdBy, description: `Importación ${filename}`.slice(0, 200) },
        select: { id: true },
      })

      const insertResult = await tx.shipment.createMany({
        data: toInsert.map(r => ({ ...r, carrierId, createdBy, batchId: batch.id })),
        skipDuplicates: true,
      })

      await tx.batch.update({ where: { id: batch.id }, data: { guideCount: insertResult.count } })

      return { batchId: batch.id, imported: insertResult.count }
    })

    const raceSkipped = toInsert.length - imported

    await db.csvImport.create({
      data: {
        carrierId,
        importedBy: createdBy,
        filename,
        totalRows,
        okRows: imported,
        errorRows: errorCount + skippedExisting + intraDups + raceSkipped,
        status: imported > 0 ? 'completed' : 'partial',
        batchId,
      },
    })

    revalidatePath('/admin/guias')
    if (batchId) revalidatePath(`/admin/lote/${batchId}`)

    return {
      status: 'success',
      total: totalRows,
      imported,
      skipped: skippedExisting + intraDups + raceSkipped,
      errors: errorCount,
      matched: matchedCount,
      batchId,
    }
  } catch (error) {
    console.error('[importShipments]', error)
    return { status: 'error', message: 'Error al importar. Intenta de nuevo.' }
  }
}
