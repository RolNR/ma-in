import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatDateOnly } from '@/lib/utils'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

export const runtime = 'nodejs'

const STATUS_LABELS: Record<ShipmentStatus, string> = {
  PENDIENTE:           'Pendiente',
  EN_RUTA:             'En ruta',
  EN_PROCESO_ENTREGA:  'En proceso de entrega',
  ENTREGADO:           'Entregado',
  ERRONEA:             'Errónea',
  CADUCADA:            'Caducada',
  SIN_UTILIZAR:        'Sin utilizar',
  CANCELADA:           'Cancelada',
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status   = searchParams.get('status') || ''
  const q        = searchParams.get('q') || ''
  const archived = searchParams.get('archived') === '1'

  const where = {
    archived,
    ...(status ? { status: status as ShipmentStatus } : {}),
    ...(q ? {
      OR: [
        { trackingCode:  { contains: q, mode: 'insensitive' as const } },
        { folioInterno:  { contains: q, mode: 'insensitive' as const } },
        { senderName:    { contains: q, mode: 'insensitive' as const } },
        { recipientName: { contains: q, mode: 'insensitive' as const } },
        { destCity:      { contains: q, mode: 'insensitive' as const } },
      ],
    } : {}),
  }

  const shipments = await db.shipment.findMany({
    where,
    select: {
      trackingCode:   true,
      guideType:      true,
      carrier:        { select: { name: true } },
      client:         { select: { companyName: true } },
      status:         true,
      senderName:     true,
      originCity:     true,
      originState:    true,
      recipientName:  true,
      destCity:       true,
      destState:      true,
      destPostal:     true,
      content:        true,
      weight:         true,
      shipmentDate:   true,
      folioInterno:   true,
      externalGuideNo:true,
      receivedBy:     true,
      createdByUser:  { select: { name: true } },
      createdAt:      true,
    },
    orderBy: { shipmentDate: 'desc' },
  })

  const rows = shipments.map((s, i) => ({
    '#':               i + 1,
    'Código':          s.trackingCode,
    'Tipo':            s.guideType ?? '',
    'Carrier':         s.carrier.name,
    'Cliente':         s.client?.companyName ?? '',
    'Status':          STATUS_LABELS[s.status],
    'Remitente':       s.senderName ?? '',
    'Ciudad origen':   [s.originCity, s.originState].filter(Boolean).join(', '),
    'Destinatario':    s.recipientName ?? '',
    'Ciudad destino':  [s.destCity, s.destState].filter(Boolean).join(', '),
    'CP destino':      s.destPostal ?? '',
    'Contenido':       s.content ?? '',
    'Peso (kg)':       s.weight ? Number(s.weight) : '',
    'Fecha envío':     formatDateOnly(s.shipmentDate, { day: '2-digit', month: '2-digit', year: 'numeric' }),
    'Folio interno':   s.folioInterno ?? '',
    'Guía externa':    s.externalGuideNo ?? '',
    'Recibido por':    s.receivedBy ?? '',
    'Creado por':      s.createdByUser?.name ?? '',
    'Fecha creación':  s.createdAt.toLocaleDateString('es-MX', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' }),
  }))

  const ws = XLSX.utils.json_to_sheet(rows)

  // Auto column widths
  const keys = Object.keys(rows[0] ?? {})
  ws['!cols'] = keys.map(key => ({
    wch: Math.max(key.length, ...rows.map(r => String(r[key as keyof typeof r] ?? '').length)) + 2,
  }))

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Guías')

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const filename = `guias-${new Date().toISOString().slice(0, 10)}.xlsx`

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
