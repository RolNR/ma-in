import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ShipmentTimeline } from '@/components/admin/ShipmentTimeline'
import { UpdateStatusForm } from '@/components/admin/UpdateStatusForm'
import { ArrowLeft } from 'lucide-react'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function GuiaDetailPage({ params }: PageProps) {
  const { id } = await params

  const shipment = await db.shipment.findUnique({
    where: { id },
    include: {
      carrier: { select: { name: true } },
      client: { select: { id: true, companyName: true } },
      createdByUser: { select: { name: true } },
      events: {
        include: { user: { select: { name: true } } },
        orderBy: { occurredAt: 'desc' },
      },
    },
  })

  if (!shipment) notFound()

  const rows: [string, string | null | undefined][] = [
    ['Remitente', shipment.senderName],
    ['Ciudad origen', [shipment.originCity, shipment.originState].filter(Boolean).join(', ')],
    ['Destinatario', shipment.recipientName],
    ['Ciudad destino', [shipment.destCity, shipment.destState].filter(Boolean).join(', ')],
    ['C.P. destino', shipment.destPostal],
    ['Contenido', shipment.content],
    ['Peso', shipment.weight ? `${shipment.weight} kg` : null],
    ['Fecha envío', new Date(shipment.shipmentDate).toLocaleDateString('es-MX', { dateStyle: 'long' })],
    ['Creado por', shipment.createdByUser?.name],
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/guias" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Guías
        </Link>
        <div className="flex items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-mono">{shipment.trackingCode}</h1>
            <p className="text-gray-500 mt-1">{shipment.carrier.name}</p>
            {shipment.client && (
              <Link href={`/admin/clientes/${shipment.client.id}`} className="text-sm text-primary-600 hover:underline">
                {shipment.client.companyName}
              </Link>
            )}
          </div>
          <div className="ml-auto">
            <StatusBadge status={shipment.status as ShipmentStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Datos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Detalles del envío</h2>
            <dl className="space-y-3">
              {rows.map(([label, value]) =>
                value ? (
                  <div key={label} className="flex gap-4">
                    <dt className="text-sm text-gray-500 w-36 shrink-0">{label}</dt>
                    <dd className="text-sm text-gray-900 font-medium">{value}</dd>
                  </div>
                ) : null,
              )}
            </dl>
          </div>
        </div>

        {/* Sidebar: update status + timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Actualizar status</h2>
            <UpdateStatusForm shipmentId={shipment.id} currentStatus={shipment.status} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Historial</h2>
            <ShipmentTimeline events={shipment.events} />
          </div>
        </div>
      </div>
    </div>
  )
}
