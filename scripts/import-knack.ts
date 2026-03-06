/**
 * Migración única: importar guías desde exportación CSV de Knack.
 * Uso: dotenv -e .env.local -- tsx scripts/import-knack.ts <ruta-al-csv>
 * Eliminar este archivo después de usar.
 */

import fs from 'fs'
import path from 'path'
import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// ─── DB ───────────────────────────────────────────────────────────────────────

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) })

// ─── Types ────────────────────────────────────────────────────────────────────

type ShipmentStatus = 'ENTREGADO' | 'ERRONEA' | 'CADUCADA' | 'SIN_UTILIZAR' | 'EN_PROCESO_ENTREGA' | 'EN_RUTA'

interface KnackRow {
  trackingCode: string
  guideType: string | null
  usuario: string | null
  senderName: string | null
  originStreet: string | null
  originCity: string | null
  originState: string | null
  originPostal: string | null
  folioInterno: string | null
  externalGuideNo: string | null
  carrierName: string | null
  destAbbr: string | null
  receivedBy: string | null
  destStreet: string | null
  destCity: string | null
  destState: string | null
  destPostal: string | null
  content: string | null
  weight: number | null
  overweight: number | null
  statusRaw: string
  fecha: string | null
  seguro: number | null
  precio: number | null
  combustible: number | null
  precioSB: number | null
  subtotal: number | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeStatus(raw: unknown): ShipmentStatus {
  const s = String(raw ?? '').trim().toUpperCase()
  if (s === 'CONFIRMADO') return 'ENTREGADO'
  if (s === 'PENDIENTE') return 'PENDIENTE'
  return 'EN_RUTA' // EN_TRANSITO, RECOLECTADO POR MA-IN, y cualquier otro
}

function parseLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current.trim())
  return fields
}

function s(v: string, max?: number): string | null {
  const t = v.trim()
  if (!t) return null
  return max && t.length > max ? t.slice(0, max) : t
}

// Title case: "CIUDAD DE MÉXICO" → "Ciudad De México"
function tc(v: string, max?: number): string | null {
  const t = v.trim()
  if (!t) return null
  const out = t.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
  return max && out.length > max ? out.slice(0, max) : out
}
function n(v: string): number | null { const x = parseFloat(v); return isNaN(x) ? null : x }
function parseDate(raw: string): Date {
  const d = new Date(raw.trim())
  return isNaN(d.getTime()) ? new Date() : d
}

// ─── CSV Parser ───────────────────────────────────────────────────────────────

function parseCSV(filePath: string): KnackRow[] {
  const text = fs.readFileSync(filePath, 'utf-8')
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  if (lines.length < 2) return []

  const headers = parseLine(lines[0]).map(h => h.replace(/^"|"$/g, '').trim())
  const get = (cols: string[], key: string) => { const i = headers.indexOf(key); return i >= 0 ? (cols[i] ?? '') : '' }

  const rows: KnackRow[] = []
  for (const line of lines.slice(1).filter(l => l.trim())) {
    const cols = parseLine(line)
    const trackingCode = s(get(cols, 'Código de rastreo'))
    if (!trackingCode) continue

    rows.push({
      trackingCode,
      guideType:      tc(get(cols, 'Tipo guía')),
      usuario:        s(get(cols, 'Usuario')),           // usado para matching, sin title case
      senderName:     tc(get(cols, 'Remitente')),
      originStreet:   tc(get(cols, 'Dirección remitente : Street 1')),
      originCity:     tc(get(cols, 'Dirección remitente : City')),
      originState:    tc(get(cols, 'Dirección remitente : State')),
      originPostal:   s(get(cols, 'Dirección remitente : Zip'), 10),
      folioInterno:   s(get(cols, 'Folio Interno')),     // código, sin title case
      externalGuideNo: s(get(cols, 'Número de guía')),  // código, sin title case
      carrierName:    s(get(cols, 'Carrier')),           // usado para matching, sin title case
      destAbbr:       s(get(cols, 'Siglas destino'), 10),
      receivedBy:     tc(get(cols, 'Recibido por')),
      destStreet:     tc(get(cols, 'Dirección consignatario : Street 1')),
      destCity:       tc(get(cols, 'Dirección consignatario : City')),
      destState:      tc(get(cols, 'Dirección consignatario : State')),
      destPostal:     s(get(cols, 'Dirección consignatario : Zip'), 10),
      content:        tc(get(cols, 'Contenido')),
      weight:         n(get(cols, 'Peso paquete')),
      overweight:     n(get(cols, 'Sobrepeso')),
      statusRaw:      get(cols, 'Estatus'),
      fecha:          s(get(cols, 'Fecha')),
      seguro:         n(get(cols, 'Seguro')),
      precio:         n(get(cols, 'Precio')),
      combustible:    n(get(cols, 'Cargo x comb')),
      precioSB:       n(get(cols, 'Precio SB')),
      subtotal:       n(get(cols, 'Subtotal')),
    })
  }
  return rows
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Uso: dotenv -e .env.local -- tsx scripts/import-knack.ts <ruta-al-csv>')
    process.exit(1)
  }

  const absolutePath = path.resolve(filePath)
  if (!fs.existsSync(absolutePath)) {
    console.error(`Archivo no encontrado: ${absolutePath}`)
    process.exit(1)
  }

  console.log(`Leyendo: ${absolutePath}`)
  const rows = parseCSV(absolutePath)
  console.log(`${rows.length} filas con código de rastreo`)

  const [carriers, clients] = await Promise.all([
    db.carrier.findMany({ select: { id: true, name: true, code: true } }),
    db.client.findMany({ select: { id: true, companyName: true } }),
  ])

  const carrierMap = new Map<string, number>()
  carriers.forEach(c => {
    carrierMap.set(c.name.trim().toUpperCase(), c.id)
    carrierMap.set(c.code.trim().toUpperCase(), c.id)
  })
  const clientMap = new Map<string, number>(clients.map(c => [c.companyName.trim().toUpperCase(), c.id]))
  // Aliases: nombre en Knack → nombre en sistema
  const knackAliases: Record<string, string> = { 'ECOMMERCE MAIN': 'ENVÍO PÚBLICO' }
  for (const [alias, target] of Object.entries(knackAliases)) {
    const id = clientMap.get(target)
    if (id) clientMap.set(alias, id)
  }

  const fallbackCarrierId = carriers.find(c => c.code === 'MAIN')?.id ?? carriers[0]?.id
  if (!fallbackCarrierId) { console.error('No hay carriers en la DB.'); process.exit(1) }

  const adminUser = await db.user.findFirst({ where: { role: 'admin' }, select: { id: true } })
  if (!adminUser) { console.error('No se encontró usuario admin.'); process.exit(1) }

  // Filtrar tracking codes ya existentes
  const existing = await db.shipment.findMany({
    where: { trackingCode: { in: rows.map(r => r.trackingCode) } },
    select: { trackingCode: true },
  })
  const existingSet = new Set(existing.map(e => e.trackingCode))

  const toInsert = []
  let skipped = 0
  let matched = 0
  const seen = new Set<string>()

  for (const row of rows) {
    if (existingSet.has(row.trackingCode)) { skipped++; continue }
    if (seen.has(row.trackingCode)) continue
    seen.add(row.trackingCode)

    const carrierId = (row.carrierName ? carrierMap.get(row.carrierName.trim().toUpperCase()) : undefined) ?? fallbackCarrierId
    const clientId = row.usuario ? (clientMap.get(row.usuario.trim().toUpperCase()) ?? null) : null
    if (clientId) matched++

    toInsert.push({
      trackingCode:    row.trackingCode,
      carrierId,
      clientId,
      createdBy:       adminUser.id,
      guideType:       row.guideType,
      folioInterno:    row.folioInterno,
      externalGuideNo: row.externalGuideNo,
      senderName:      row.senderName,
      originStreet:    row.originStreet,
      originCity:      row.originCity,
      originState:     row.originState,
      originPostal:    row.originPostal,
      destAbbr:        row.destAbbr,
      receivedBy:      row.receivedBy,
      destStreet:      row.destStreet,
      destCity:        row.destCity,
      destState:       row.destState,
      destPostal:      row.destPostal,
      content:         row.content,
      weight:          row.weight,
      overweight:      row.overweight,
      status:          normalizeStatus(row.statusRaw),
      shipmentDate:    row.fecha ? parseDate(row.fecha) : new Date(),
      carrierMetadata: {
        statusOriginal: row.statusRaw,
        seguro:         row.seguro,
        precio:         row.precio,
        combustible:    row.combustible,
        precioSB:       row.precioSB,
        subtotal:       row.subtotal,
      },
    })
  }

  console.log(`A importar: ${toInsert.length} | Ya existían: ${skipped} | Matches a cliente: ${matched}`)

  if (!toInsert.length) {
    console.log('Nada que importar.')
    await db.$disconnect()
    return
  }

  const result = await db.shipment.createMany({ data: toInsert, skipDuplicates: true })
  console.log(`✓ ${result.count} guías importadas`)

  await db.csvImport.create({
    data: {
      carrierId:    fallbackCarrierId,
      importedBy:   adminUser.id,
      filename:     path.basename(filePath),
      totalRows:    rows.length,
      okRows:       result.count,
      errorRows:    skipped,
      status:       result.count > 0 ? 'completed' : 'partial',
    },
  })

  await db.$disconnect()
}

main().catch(async err => {
  console.error(err)
  await db.$disconnect()
  process.exit(1)
})
