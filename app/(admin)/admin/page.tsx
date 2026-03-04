import { db } from '@/lib/db'
import { StatsCard } from '@/components/admin/StatsCard'
import { Package, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react'

export const metadata = { title: 'Dashboard' }

async function getStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [total, thisMonth, byStatus, byCarrier] = await Promise.all([
    db.shipment.count(),
    db.shipment.count({ where: { shipmentDate: { gte: startOfMonth } } }),
    db.shipment.groupBy({ by: ['status'], _count: { id: true } }),
    db.shipment.groupBy({
      by: ['carrierId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),
  ])

  // Carrier names
  const carriers = await db.carrier.findMany({ select: { id: true, name: true } })
  const carrierMap = Object.fromEntries(carriers.map((c) => [c.id, c.name]))

  return { total, thisMonth, byStatus, byCarrier, carrierMap }
}

export default async function DashboardPage() {
  const { total, thisMonth, byStatus, byCarrier, carrierMap } = await getStats()

  const statusCount = Object.fromEntries(
    byStatus.map((s) => [s.status, s._count.id]),
  )

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Resumen de operaciones</p>
      </div>

      {/* Totales */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">General</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatsCard label="Total guías" value={total} icon={Package} />
          <StatsCard label="Este mes" value={thisMonth} icon={TrendingUp} />
          <StatsCard label="Entregadas" value={statusCount['ENTREGADO'] ?? 0} icon={CheckCircle} />
          <StatsCard label="Erróneas" value={statusCount['ERRONEA'] ?? 0} icon={AlertCircle} />
        </div>
      </section>

      {/* Por status */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Por status</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {(['PENDIENTE', 'EN_RUTA', 'EN_PROCESO_ENTREGA', 'ENTREGADO', 'ERRONEA', 'CADUCADA', 'SIN_UTILIZAR'] as const).map((s) => (
            <StatsCard key={s} label={s.replace(/_/g, ' ')} value={statusCount[s] ?? 0} />
          ))}
        </div>
      </section>

      {/* Por carrier */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Por carrier</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
          {byCarrier.map((c) => (
            <StatsCard key={c.carrierId} label={carrierMap[c.carrierId] ?? c.carrierId} value={c._count.id} />
          ))}
          {byCarrier.length === 0 && (
            <p className="text-gray-400 text-sm col-span-full">Sin datos aún</p>
          )}
        </div>
      </section>
    </div>
  )
}
