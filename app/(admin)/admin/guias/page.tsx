import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { ShipmentsTable } from '@/components/admin/ShipmentsTable'
import { ChevronLeft, ChevronRight, Plus, Archive, Download } from 'lucide-react'
import Link from 'next/link'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

export const metadata = { title: 'Guías' }

const PAGE_SIZE = 20

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string; page?: string; archived?: string }>
}

export default async function GuiasPage({ searchParams }: PageProps) {
  const [params, session] = await Promise.all([searchParams, auth()])
  const isAdmin = session?.user.role === 'admin'
  const status   = params.status   || ''
  const q        = params.q        || ''
  const page     = Math.max(1, parseInt(params.page || '1'))
  const showArchived = params.archived === '1'

  const where = {
    archived: showArchived ? true : false,
    ...(status ? { status: status as ShipmentStatus } : {}),
    ...(q
      ? {
          OR: [
            { trackingCode: { contains: q, mode: 'insensitive' as const } },
            { folioInterno: { contains: q, mode: 'insensitive' as const } },
            { senderName: { contains: q, mode: 'insensitive' as const } },
            { recipientName: { contains: q, mode: 'insensitive' as const } },
            { destCity: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  }

  const [shipments, total] = await Promise.all([
    db.shipment.findMany({
      where,
      select: {
        id: true,
        trackingCode: true,
        batchId: true,
        senderName: true,
        destCity: true,
        destState: true,
        status: true,
        archived: true,
        shipmentDate: true,
        carrier: { select: { name: true } },
        client: { select: { companyName: true } },
      },
      orderBy: { shipmentDate: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.shipment.count({ where }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const exportParams = new URLSearchParams()
  if (status) exportParams.set('status', status)
  if (q) exportParams.set('q', q)
  if (showArchived) exportParams.set('archived', '1')
  const exportHref = `/api/admin/guias/export?${exportParams.toString()}`

  function buildHref(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams()
    if (status) p.set('status', status)
    if (q) p.set('q', q)
    if (showArchived) p.set('archived', '1')
    p.set('page', String(page))
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) p.set(k, v); else p.delete(k)
    })
    return `/admin/guias?${p.toString()}`
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Guías {showArchived && <span className="text-amber-600">· Archivadas</span>}
          </h1>
          <p className="text-gray-500 mt-1">{total} resultados</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={exportHref}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            title={`Exportar ${total} guías a Excel`}
          >
            <Download className="w-4 h-4" /> Excel
          </a>
          <Link
            href={showArchived ? '/admin/guias' : '/admin/guias?archived=1'}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              showArchived
                ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Archive className="w-4 h-4" />
            {showArchived ? 'Ver activas' : 'Ver archivadas'}
          </Link>
          {!showArchived && (
            <Link
              href="/admin/guias/nueva"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Nueva guía
            </Link>
          )}
        </div>
      </div>

      {/* Filtros */}
      <form method="GET" action="/admin/guias" className="flex flex-wrap gap-3 mb-6">
        {showArchived && <input type="hidden" name="archived" value="1" />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar código, empresa, ciudad..."
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
        />

        <select
          key={`status-${status}`}
          name="status"
          defaultValue={status}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">Todos los status</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_RUTA">En ruta</option>
          <option value="EN_PROCESO_ENTREGA">En proceso</option>
          <option value="ENTREGADO">Entregado</option>
          <option value="ERRONEA">Errónea</option>
          <option value="CADUCADA">Caducada</option>
          <option value="SIN_UTILIZAR">Sin utilizar</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Filtrar
        </button>

        {(status || q) && (
          <Link
            href={showArchived ? '/admin/guias?archived=1' : '/admin/guias'}
            className="px-4 py-2 text-gray-600 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </Link>
        )}
      </form>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ShipmentsTable shipments={shipments} isAdmin={isAdmin} showArchived={showArchived} />
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">Página {page} de {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={buildHref({ page: String(page - 1) })}
                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={buildHref({ page: String(page + 1) })}
                className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
