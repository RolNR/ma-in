'use server'

import * as XLSX from 'xlsx'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

export type ImportState =
  | { status: 'idle' }
  | { status: 'success'; total: number; imported: number; skipped: number; errors: number; matched: number }
  | { status: 'error'; message: string }

function toDate(val: unknown): Date {
  if (val instanceof Date) return val
  if (typeof val === 'number') return new Date(Math.round((val - 25569) * 86400 * 1000))
  return new Date()
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

// ─── Maestro Estafeta (Excel) ─────────────────────────────────────────────────

export async function importShipments(
  _prevState: ImportState,
  formData: FormData,
): Promise<ImportState> {
  const session = await auth()
  if (!session?.user) return { status: 'error', message: 'No autorizado.' }

  const file = formData.get('file') as File | null

  if (!file || file.size === 0) return { status: 'error', message: 'Selecciona un archivo.' }
  if (!/\.(xlsx|xls)$/i.test(file.name))
    return { status: 'error', message: 'El archivo debe ser .xlsx o .xls.' }

  // Carrier del archivo maestro (Estafeta); fallback al primero activo
  const carrier = await db.carrier.findFirst({
    where: { OR: [{ code: 'EST' }, { active: true }] },
    orderBy: { id: 'asc' },
    select: { id: true },
  })
  if (!carrier) return { status: 'error', message: 'No hay carriers registrados en el sistema.' }
  const carrierId = carrier.id

  // Parse Excel — normalizar headers para eliminar espacios en nombre de columna
  let rows: Record<string, unknown>[]
  try {
    const buffer = await file.arrayBuffer()
    const wb = XLSX.read(new Uint8Array(buffer), { type: 'array', cellDates: true })
    const ws = wb.Sheets[wb.SheetNames[0]]
    const rawData = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 }) as unknown[][]
    if (rawData.length < 2) return { status: 'error', message: 'El archivo no tiene datos.' }
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
    return { status: 'error', message: 'No se pudo leer el archivo. Verifica que sea un Excel válido.' }
  }

  if (rows.length === 0) return { status: 'error', message: 'El archivo está vacío.' }

  // Lookup de clientes: companyName.toUpperCase() → id
  const clients = await db.client.findMany({ where: { active: true }, select: { id: true, companyName: true } })
  const clientMap = new Map<string, number>(
    clients.map(c => [c.companyName.trim().toUpperCase(), c.id]),
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

  // Mapear filas a registros de envío
  const toInsert: {
    trackingCode: string; carrierId: number; clientId: number | null
    folioInterno: string | null; guideType: string | null; externalGuideNo: string | null
    senderName: string | null; destCity: string | null; status: ShipmentStatus
    receivedBy: string | null; content: string | null; weight: number | null
    overweight: number | null; shipmentDate: Date; carrierMetadata: object; createdBy: number
  }[] = []

  let errorCount = 0
  let skippedExisting = 0
  let matchedCount = 0
  const seenTCs = new Set<string>()

  for (const row of rows) {
    const trackingCode = str(row['COD DE RASTREO'])
    if (!trackingCode) { errorCount++; continue }
    if (existingSet.has(trackingCode)) { skippedExisting++; continue }
    if (seenTCs.has(trackingCode)) continue // duplicado intra-archivo
    seenTCs.add(trackingCode)

    const senderName = str(row['NOMBRE CORTO DE ORIGEN'])
    const clientId = senderName ? (clientMap.get(senderName.toUpperCase()) ?? null) : null
    if (clientId) matchedCount++

    toInsert.push({
      trackingCode,
      carrierId,
      clientId,
      folioInterno: str(row['FOLIO INTERNO']),
      guideType: str(row['TIPO DE SERVICIO']),
      externalGuideNo: str(row['NUM GUIA']),
      senderName,
      destCity: str(row['DESTINO']),
      status: normalizeStatus(row['STATUS']),
      receivedBy: str(row['RECIBIDO DESTINO']),
      content: str(row['CONTENIDO']),
      weight: num(row['PESO MAIN']),
      overweight: num(row['SOBREPESO MAIN']),
      shipmentDate: toDate(row['FECHA']),
      carrierMetadata: {
        statusOriginal: str(row['STATUS']),
        pesoEstafeta: num(row['PESO ESTAFETA']),
        sobrepesoEstafeta: num(row['SOBREPESO ESTAFETA']),
        seguro: num(row['SEGURO']),
        precioGuia: num(row['PRECIO DE GUIA']),
        combustible: num(row['CARGO X COMBUSTIBLE']),
        precioSobrepeso: num(row['PRECIO SOBREPESO']),
        subtotal: num(row['SUBTOTAL']),
      },
      createdBy: parseInt(session.user.id),
    })
  }

  try {
    const result = await db.shipment.createMany({ data: toInsert, skipDuplicates: true })
    const intraDups = toInsert.length - result.count

    await db.csvImport.create({
      data: {
        carrierId,
        importedBy: parseInt(session.user.id),
        filename: file.name,
        totalRows: rows.length,
        okRows: result.count,
        errorRows: errorCount + skippedExisting + intraDups,
        status: result.count > 0 ? 'completed' : 'partial',
      },
    })

    revalidatePath('/admin/guias')

    return {
      status: 'success',
      total: rows.length,
      imported: result.count,
      skipped: skippedExisting + intraDups,
      errors: errorCount,
      matched: matchedCount,
    }
  } catch (error) {
    console.error('[importShipments]', error)
    return { status: 'error', message: 'Error al importar. Intenta de nuevo.' }
  }
}
