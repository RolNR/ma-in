import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ShipmentTimeline } from '@/components/admin/ShipmentTimeline'
import { ArrowLeft } from 'lucide-react'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

interface PageProps {
  params: Promise<{ trackingCode: string }>
}

export default async function PortalGuiaDetailPage({ params }: PageProps) {
  const session = await auth()
  if (!session?.user.clientId) redirect('/login')

  const clientId = session.user.clientId
  const { trackingCode } = await params

  const shipment = await db.shipment.findFirst({
    where: { trackingCode, clientId },
    include: {
      carrier: { select: { name: true } },
      events: {
        include: { user: { select: { name: true } } },
        orderBy: { occurredAt: 'desc' },
      },
    },
  })

  if (!shipment) notFound()

  const rows: [string, string | null | undefined][] = [
    ['Código de rastreo', shipment.trackingCode],
    ['Carrier', shipment.carrier.name],
    ['Fecha de envío', new Date(shipment.shipmentDate).toLocaleDateString('es-MX', { dateStyle: 'long' })],
    ['Remitente', shipment.senderName],
    ['Ciudad origen', [shipment.originCity, shipment.originState].filter(Boolean).join(', ')],
    ['Destinatario', shipment.recipientName],
    ['Ciudad destino', [shipment.destCity, shipment.destState].filter(Boolean).join(', ')],
    ['C.P. destino', shipment.destPostal],
    ['Contenido', shipment.content],
    ['Peso', shipment.weight ? `${shipment.weight} kg` : null],
  ]

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/portal/guias" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Mis guías
        </Link>
        <div className="flex items-start gap-4">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-mono break-all">{shipment.trackingCode}</h1>
            <p className="text-gray-500 mt-1">{shipment.carrier.name}</p>
          </div>
          <div className="ml-auto shrink-0">
            <StatusBadge status={shipment.status as ShipmentStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Datos del envío */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Detalles del envío</h2>
            <dl className="space-y-3">
              {rows.map(([label, value]) => (
                value ? (
                  <div key={label} className="flex gap-4">
                    <dt className="text-sm text-gray-500 w-36 shrink-0">{label}</dt>
                    <dd className="text-sm text-gray-900 font-medium">{value}</dd>
                  </div>
                ) : null
              ))}
            </dl>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Historial</h2>
          <ShipmentTimeline events={shipment.events} />
        </div>
      </div>
    </div>
  )
}
