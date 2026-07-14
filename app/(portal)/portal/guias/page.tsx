import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'
import { formatDateOnly } from '@/lib/utils'

export const metadata = { title: 'Mis Guías — MA-IN' }

const PAGE_SIZE = 20

interface PageProps {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>
}

export default async function PortalGuiasPage({ searchParams }: PageProps) {
  const session = await auth()
  if (!session?.user.clientId) redirect('/login')

  const clientId = session.user.clientId
  const params = await searchParams
  const status = params.status || ''
  const q = params.q || ''
  const page = Math.max(1, parseInt(params.page || '1'))

  const where = {
    clientId,
    ...(status ? { status: status as ShipmentStatus } : {}),
    ...(q ? { trackingCode: { contains: q, mode: 'insensitive' as const } } : {}),
  }

  const [shipments, total] = await Promise.all([
    db.shipment.findMany({
      where,
      include: { carrier: { select: { name: true } } },
      orderBy: { shipmentDate: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.shipment.count({ where }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  function buildHref(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams()
    if (status) p.set('status', status)
    if (q) p.set('q', q)
    p.set('page', String(page))
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) p.set(k, v); else p.delete(k)
    })
    return `/portal/guias?${p.toString()}`
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-5 md:mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis guías</h1>
        <p className="text-gray-500 mt-1">{total} resultado{total !== 1 ? 's' : ''}</p>
      </div>

      {/* Filtros */}
      <form method="GET" action="/portal/guias" className="flex flex-col sm:flex-row flex-wrap gap-2 md:gap-3 mb-5 md:mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por código..."
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 sm:w-56 w-full"
        />
        <select
          name="status"
          defaultValue={status}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-auto"
        >
          <option value="">Todos los status</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_RUTA">En ruta</option>
          <option value="EN_PROCESO_ENTREGA">En proceso</option>
          <option value="ENTREGADO">Entregado</option>
          <option value="ERRONEA">Errónea</option>
          <option value="CADUCADA">Caducada</option>
          <option value="SIN_UTILIZAR">Sin utilizar</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 sm:flex-none px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Filtrar
          </button>
          {(status || q) && (
            <Link
              href="/portal/guias"
              className="flex-1 sm:flex-none text-center px-4 py-2 text-gray-600 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Limpiar
            </Link>
          )}
        </div>
      </form>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {shipments.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">Sin guías registradas</p>
            <p className="text-sm mt-1">Contacta a MA-IN para registrar tus envíos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Código</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">Carrier</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">Remitente</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">Destino</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <Link
                        href={`/portal/guias/${s.trackingCode}`}
                        className="font-mono text-primary-700 font-medium hover:underline"
                      >
                        {s.trackingCode}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-700 hidden sm:table-cell">{s.carrier.name}</td>
                    <td className="py-3 px-4 text-gray-700 hidden md:table-cell">{s.senderName ?? '—'}</td>
                    <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">
                      {[s.destCity, s.destState].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={s.status as Parameters<typeof StatusBadge>[0]['status']} />
                    </td>
                    <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                      {formatDateOnly(s.shipmentDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">Página {page} de {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={buildHref({ page: String(page - 1) })} className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" /> Anterior
              </Link>
            )}
            {page < totalPages && (
              <Link href={buildHref({ page: String(page + 1) })} className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Siguiente <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
