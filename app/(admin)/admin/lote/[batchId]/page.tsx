import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { UpdateStatusForm } from '@/components/admin/UpdateStatusForm'
import { BatchActions } from '@/components/admin/BatchActions'
import Link from 'next/link'
import { ArrowLeft, Layers, Printer } from 'lucide-react'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

interface PageProps {
  params: Promise<{ batchId: string }>
}

export default async function LoteDetailPage({ params }: PageProps) {
  const { batchId } = await params
  const session = await auth()

  const batch = await db.batch.findUnique({
    where: { id: batchId },
    include: {
      client: { select: { id: true, companyName: true } },
      user:   { select: { name: true } },
      shipments: {
        orderBy: { trackingCode: 'asc' },
        select: {
          id: true,
          trackingCode: true,
          recipientName: true,
          destCity: true,
          destState: true,
          destAbbr: true,
          status: true,
        },
      },
    },
  })

  if (!batch || batch.shipments.length === 0) notFound()

  // Use first shipment as reference for UpdateStatusForm
  const firstShipment = batch.shipments[0]

  // Most common status in batch (for default selected)
  const statusCount: Record<string, number> = {}
  for (const s of batch.shipments) {
    statusCount[s.status] = (statusCount[s.status] ?? 0) + 1
  }
  const dominantStatus = Object.entries(statusCount).sort((a, b) => b[1] - a[1])[0][0] as ShipmentStatus

  const createdDate = batch.createdAt.toLocaleDateString('es-MX', { dateStyle: 'long' })

  return (
    <div className="p-8 space-y-6">

      {/* Header */}
      <div>
        <Link href="/admin/guias" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Guías
        </Link>
        <div className="flex items-start gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-6 h-6 text-primary-600" />
                Lote · {batch.shipments.length} guías
              </h1>
            </div>
            <p className="text-gray-500 mt-1">Creado el {createdDate} por {batch.user?.name ?? '—'}</p>
            {batch.client && (
              <Link href={`/admin/clientes/${batch.client.id}`} className="text-sm text-primary-600 hover:underline">
                {batch.client.companyName}
              </Link>
            )}
          </div>
          <div className="ml-auto">
            <Link
              href={`/imprimir/lote/${batchId}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" /> Imprimir lote
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Lista de guías */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Guías en este lote</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {batch.shipments.map(s => (
                <div key={s.id} className="flex items-center gap-3 px-6 py-3">
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
                    <span className="text-xs font-bold text-primary-400 w-8 text-right">{s.destAbbr}</span>
                  )}
                  <StatusBadge status={s.status as ShipmentStatus} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar — actualizar lote */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Actualizar lote</h2>
            <p className="text-xs text-gray-400 mb-4">Aplica el nuevo status a todas las guías del lote.</p>
            <UpdateStatusForm
              shipmentId={firstShipment.id}
              currentStatus={dominantStatus}
              batchId={batchId}
              batchSize={batch.shipments.length}
              forceBatch
            />
          </div>

          {session?.user.role === 'admin' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Zona de riesgo</h2>
              <p className="text-xs text-gray-400 mb-4">
                Útil si esta importación tuvo un error y necesitas revertirla.
              </p>
              <BatchActions batchId={batchId} guideCount={batch.shipments.length} />
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
