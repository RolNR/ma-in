import Link from 'next/link'
import { db } from '@/lib/db'
import { ChevronLeft, ChevronRight, Plus, CheckCircle, XCircle } from 'lucide-react'

export const metadata = { title: 'Clientes' }

const PAGE_SIZE = 20

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function ClientesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const q = params.q || ''
  const page = Math.max(1, parseInt(params.page || '1'))

  const where = q
    ? {
        OR: [
          { companyName: { contains: q, mode: 'insensitive' as const } },
          { rfc: { contains: q, mode: 'insensitive' as const } },
        ],
      }
    : {}

  const [clients, total] = await Promise.all([
    db.client.findMany({
      where,
      include: { _count: { select: { shipments: true } } },
      orderBy: { companyName: 'asc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.client.count({ where }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  function buildHref(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    p.set('page', String(page))
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) p.set(k, v); else p.delete(k)
    })
    return `/admin/clientes?${p.toString()}`
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-500 mt-1">{total} cliente{total !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/clientes/nuevo"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo cliente
        </Link>
      </div>

      {/* Filtros */}
      <form method="GET" action="/admin/clientes" className="flex flex-wrap gap-3 mb-6">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar empresa o RFC..."
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-72"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Buscar
        </button>
        {q && (
          <Link
            href="/admin/clientes"
            className="px-4 py-2 text-gray-600 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </Link>
        )}
      </form>

      {/* Tabla */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {clients.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">Sin clientes registrados</p>
            <p className="text-sm mt-1">Crea el primer cliente empresarial.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Empresa</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">RFC</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Guías</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Estado</th>
                  <th className="py-3 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {clients.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{c.companyName}</td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-xs">{c.rfc ?? '—'}</td>
                    <td className="py-3 px-4 text-gray-500">{c.email ?? '—'}</td>
                    <td className="py-3 px-4 text-gray-700 font-medium">{c._count.shipments}</td>
                    <td className="py-3 px-4">
                      {c.active ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
                          <CheckCircle className="w-3.5 h-3.5" /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
                          <XCircle className="w-3.5 h-3.5" /> Inactivo
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/admin/clientes/${c.id}`}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Ver →
                      </Link>
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
