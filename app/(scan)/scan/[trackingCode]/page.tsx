import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { ScanForm } from './ScanForm'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

interface PageProps {
  params: Promise<{ trackingCode: string }>
}

const STATUS_LABELS: Partial<Record<ShipmentStatus, string>> = {
  EN_PROCESO_ENTREGA: 'En proceso de entrega',
  ENTREGADO: 'Entregado',
  ERRONEA: 'Errónea',
}

export default async function ScanPage({ params }: PageProps) {
  const { trackingCode } = await params

  const shipment = await db.shipment.findUnique({
    where: { trackingCode },
    select: {
      id: true,
      trackingCode: true,
      status: true,
      recipientName: true,
      destStreet: true,
      destCity: true,
      destState: true,
      destPostal: true,
      destAbbr: true,
      content: true,
      weight: true,
      receivedBy: true,
      carrier: { select: { name: true } },
    },
  })

  if (!shipment) notFound()

  const destAddr = [
    shipment.destStreet,
    shipment.destCity,
    shipment.destState,
    shipment.destPostal ? `CP ${shipment.destPostal}` : null,
  ].filter(Boolean).join(', ')

  const mapsUrl = destAddr
    ? `https://maps.google.com/?q=${encodeURIComponent(destAddr)}`
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-700 text-white px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-200">MA-IN · Entrega</p>
        <p className="text-lg font-bold font-mono mt-0.5">{shipment.trackingCode}</p>
        <p className="text-sm text-primary-200">{shipment.carrier.name}</p>
      </div>

      {/* Info destino */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Consignatario</p>
            <p className="text-base font-semibold text-gray-900">{shipment.recipientName || '—'}</p>
            {destAddr && <p className="text-sm text-gray-500 mt-0.5 leading-snug">{destAddr}</p>}
            {shipment.content && (
              <p className="text-xs text-gray-400 mt-1">{shipment.content}{shipment.weight ? ` · ${shipment.weight} kg` : ''}</p>
            )}
          </div>
          {shipment.destAbbr && (
            <span className="text-3xl font-black text-primary-300 shrink-0">{shipment.destAbbr}</span>
          )}
        </div>

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary-600 hover:text-primary-800"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Cómo llegar
          </a>
        )}
      </div>

      {/* Estado actual */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Estado actual</p>
        <p className="text-sm font-semibold text-gray-700 mt-0.5">
          {STATUS_LABELS[shipment.status as ShipmentStatus] ?? shipment.status.replace(/_/g, ' ')}
        </p>
      </div>

      {/* Scan form */}
      <ScanForm
        shipmentId={shipment.id}
        currentStatus={shipment.status as ShipmentStatus}
        currentReceivedBy={shipment.receivedBy}
      />
    </div>
  )
}
