import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ShipmentTimeline } from '@/components/admin/ShipmentTimeline'
import { UpdateStatusForm } from '@/components/admin/UpdateStatusForm'
import { ShipmentActions } from '@/components/admin/ShipmentActions'
import { EvidenceGallery } from '@/components/admin/EvidenceGallery'
import { ArrowLeft, Printer, MapPin, Package, CalendarDays, User, Building2, ArrowRight, Layers, ArchiveIcon, Navigation } from 'lucide-react'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

interface PageProps {
  params: Promise<{ id: string }>
}

function DetailRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  )
}

export default async function GuiaDetailPage({ params }: PageProps) {
  const { id } = await params
  const session = await auth()
  const isAdmin = session?.user.role === 'admin'

  const shipment = await db.shipment.findUnique({
    where: { id },
    include: {
      carrier:      { select: { name: true } },
      client:       { select: { id: true, companyName: true } },
      createdByUser:{ select: { name: true } },
      events: {
        include: { user: { select: { name: true } } },
        orderBy: { occurredAt: 'desc' },
      },
      evidence: {
        orderBy: { capturedAt: 'asc' },
      },
    },
  })

  if (!shipment) notFound()

  // Fetch sibling guides if this guide belongs to a batch
  const batchSiblings = shipment.batchId
    ? await db.shipment.findMany({
        where: { batchId: shipment.batchId, NOT: { id: shipment.id } },
        select: {
          id: true,
          trackingCode: true,
          recipientName: true,
          destCity: true,
          destAbbr: true,
          status: true,
        },
        orderBy: { trackingCode: 'asc' },
      })
    : []

  const batchSize = batchSiblings.length + 1 // siblings + this guide

  const originAddr = [shipment.originStreet, shipment.originCity, shipment.originState, shipment.originPostal ? `CP ${shipment.originPostal}` : null].filter(Boolean).join(', ')
  const destAddr   = [shipment.destStreet,   shipment.destCity,   shipment.destState,   shipment.destPostal   ? `CP ${shipment.destPostal}`   : null].filter(Boolean).join(', ')
  const mapsUrl    = destAddr ? `https://maps.google.com/?q=${encodeURIComponent(destAddr)}` : null

  return (
    <div className="p-8 space-y-6">

      {/* ── Archived banner ────────────────────────────────────── */}
      {shipment.archived && (
        <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          <ArchiveIcon className="w-4 h-4 shrink-0" />
          Esta guía está archivada.
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────── */}
      <div>
        <Link href="/admin/guias" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Guías
        </Link>
        <div className="flex items-start gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 font-mono">{shipment.trackingCode}</h1>
              {shipment.guideType && (
                <span className="text-xs font-bold uppercase tracking-widest bg-gray-900 text-white px-2.5 py-1 rounded-md">
                  {shipment.guideType}
                </span>
              )}
              {shipment.batchId && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-md">
                  <Layers className="w-3 h-3" /> Lote · {batchSize} guías
                </span>
              )}
            </div>
            <p className="text-gray-500 mt-1">{shipment.carrier.name}</p>
            {shipment.client && (
              <Link href={`/admin/clientes/${shipment.client.id}`} className="text-sm text-primary-600 hover:underline">
                {shipment.client.companyName}
              </Link>
            )}
          </div>
          <div className="ml-auto flex items-center gap-3 flex-wrap">
            <StatusBadge status={shipment.status as ShipmentStatus} />
            {shipment.batchId && (
              <Link
                href={`/imprimir/lote/${shipment.batchId}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 border border-primary-300 text-primary-700 text-sm font-medium rounded-lg hover:bg-primary-50 transition-colors"
              >
                <Layers className="w-4 h-4" /> Imprimir lote
              </Link>
            )}
            <Link
              href={`/imprimir/${shipment.id}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" /> Imprimir guía
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main column ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Ruta */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Ruta
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-start">
              {/* Origen */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Remitente</p>
                <p className="font-semibold text-gray-900">{shipment.senderName || '—'}</p>
                {originAddr && <p className="text-sm text-gray-500 leading-snug">{originAddr}</p>}
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center pt-8 sm:pt-6">
                <ArrowRight className="w-5 h-5 text-gray-300" />
              </div>

              {/* Destino */}
              <div className="bg-primary-50 rounded-lg p-4 space-y-1 relative">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Consignatario</p>
                <p className="font-semibold text-gray-900">{shipment.recipientName || '—'}</p>
                {destAddr && <p className="text-sm text-gray-500 leading-snug">{destAddr}</p>}
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-800 font-medium mt-1"
                  >
                    <Navigation className="w-3 h-3" /> Cómo llegar
                  </a>
                )}
                {shipment.destAbbr && (
                  <span className="absolute top-3 right-3 text-2xl font-black text-primary-300">
                    {shipment.destAbbr}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Paquete + Clasificación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Paquete
              </h2>
              <div className="space-y-4">
                <DetailRow label="Contenido" value={shipment.content} />
                <DetailRow label="Peso" value={shipment.weight ? `${shipment.weight} kg` : null} />
                <DetailRow label="Sobrepeso" value={shipment.overweight ? `${shipment.overweight} kg` : null} />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" /> Clasificación
              </h2>
              <div className="space-y-4">
                <DetailRow label="Fecha de envío" value={new Date(shipment.shipmentDate).toLocaleDateString('es-MX', { dateStyle: 'long' })} />
                <DetailRow label="Folio interno"  value={shipment.folioInterno} />
                <DetailRow label="Núm. guía ext." value={shipment.externalGuideNo} />
                <DetailRow label="Recibido por"   value={shipment.receivedBy} />
                <div className="flex items-center gap-1.5 pt-1">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    Creado por <span className="font-medium text-gray-600">{shipment.createdByUser?.name ?? '—'}</span>
                  </span>
                </div>
                {shipment.client && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    <Link href={`/admin/clientes/${shipment.client.id}`} className="text-xs text-primary-600 hover:underline font-medium">
                      {shipment.client.companyName}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Batch siblings ───────────────────────────────────── */}
          {batchSiblings.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Otras guías del lote
              </h2>
              <div className="divide-y divide-gray-50">
                {batchSiblings.map(s => (
                  <div key={s.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <Link
                      href={`/admin/guias/${s.id}`}
                      className="font-mono text-sm font-semibold text-primary-700 hover:underline min-w-[9rem]"
                    >
                      {s.trackingCode}
                    </Link>
                    <span className="text-sm text-gray-600 flex-1 truncate">
                      {s.recipientName || '—'}
                      {s.destCity && <span className="text-gray-400"> · {s.destCity}</span>}
                    </span>
                    {s.destAbbr && (
                      <span className="text-xs font-bold text-primary-400 w-6 text-right">{s.destAbbr}</span>
                    )}
                    <StatusBadge status={s.status as ShipmentStatus} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <EvidenceGallery evidence={shipment.evidence} />

        </div>

        {/* ── Sidebar ──────────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Actualizar status</h2>
            <UpdateStatusForm
              shipmentId={shipment.id}
              currentStatus={shipment.status as ShipmentStatus}
              batchId={shipment.batchId ?? undefined}
              batchSize={shipment.batchId ? batchSize : undefined}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Historial</h2>
            <ShipmentTimeline events={shipment.events} />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Acciones</h2>
            <ShipmentActions
              shipmentId={shipment.id}
              archived={shipment.archived}
              isAdmin={isAdmin}
              trackingCode={shipment.trackingCode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
