import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { StatsCard } from '@/components/admin/StatsCard'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Package, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'

export const metadata = { title: 'Mi Panel — MA-IN' }

export default async function PortalDashboardPage() {
  const session = await auth()
  if (!session?.user.clientId) redirect('/login')

  const clientId = session.user.clientId

  const [total, byStatus, recentShipments] = await Promise.all([
    db.shipment.count({ where: { clientId } }),
    db.shipment.groupBy({ by: ['status'], where: { clientId }, _count: { id: true } }),
    db.shipment.findMany({
      where: { clientId },
      include: { carrier: { select: { name: true } } },
      orderBy: { shipmentDate: 'desc' },
      take: 5,
    }),
  ])

  const statusCount = Object.fromEntries(byStatus.map((s) => [s.status, s._count.id]))

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mi Panel</h1>
        <p className="text-gray-500 mt-1">Resumen de tus envíos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatsCard label="Total guías" value={total} icon={Package} />
        <StatsCard label="En ruta" value={statusCount['EN_RUTA'] ?? 0} icon={TrendingUp} />
        <StatsCard label="Entregadas" value={statusCount['ENTREGADO'] ?? 0} icon={CheckCircle} />
        <StatsCard label="Erróneas" value={statusCount['ERRONEA'] ?? 0} icon={AlertCircle} />
      </div>

      {/* Últimas guías */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">Últimas guías</h2>
          <Link href="/portal/guias" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Ver todas
          </Link>
        </div>
        {recentShipments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No tienes guías registradas aún.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Código</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">Carrier</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden sm:table-cell">Destino</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 hidden md:table-cell">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentShipments.map((s) => (
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
                    <td className="py-3 px-4 text-gray-500 hidden sm:table-cell">
                      {[s.destCity, s.destState].filter(Boolean).join(', ') || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={s.status as Parameters<typeof StatusBadge>[0]['status']} />
                    </td>
                    <td className="py-3 px-4 text-gray-500 hidden md:table-cell">
                      {new Date(s.shipmentDate).toLocaleDateString('es-MX')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
