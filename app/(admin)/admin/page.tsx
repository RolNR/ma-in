import { db } from '@/lib/db'
import { StatsCard } from '@/components/admin/StatsCard'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { ActivityChart } from '@/components/admin/ActivityChart'
import { StatusDonut } from '@/components/admin/StatusDonut'
import { Package, TrendingUp, CheckCircle, Truck, ArrowRight, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'
import { formatDateOnly } from '@/lib/utils'

export const metadata = { title: 'Dashboard' }

function toDateKey(d: Date) {
  return d.toISOString().slice(0, 10)
}

// Días sin movimiento a partir de los cuales una guía se considera estancada
const STALE_DAYS: Partial<Record<ShipmentStatus, number>> = {
  PENDIENTE:          5,
  EN_RUTA:            3,
  EN_PROCESO_ENTREGA: 2,
}

async function getStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(now.getDate() - 29)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  const staleConditions = Object.entries(STALE_DAYS).map(([status, days]) => ({
    status: status as ShipmentStatus,
    archived: false,
    updatedAt: { lt: new Date(now.getTime() - days * 86_400_000) },
  }))

  const [total, thisMonth, byStatus, dailyRaw, inTransit, topClientsRaw, staleShipments] = await Promise.all([
    db.shipment.count(),
    db.shipment.count({ where: { shipmentDate: { gte: startOfMonth } } }),
    db.shipment.groupBy({ by: ['status'], _count: { id: true } }),
    db.shipment.groupBy({
      by: ['shipmentDate'],
      _count: { id: true },
      where: { shipmentDate: { gte: thirtyDaysAgo } },
      orderBy: { shipmentDate: 'asc' },
    }),
    db.shipment.findMany({
      where: { status: { in: ['EN_RUTA', 'EN_PROCESO_ENTREGA'] } },
      select: {
        id: true,
        trackingCode: true,
        destCity: true,
        destState: true,
        status: true,
        shipmentDate: true,
        client: { select: { companyName: true } },
      },
      orderBy: { shipmentDate: 'desc' },
      take: 10,
    }),
    db.shipment.groupBy({
      by: ['clientId'],
      _count: { id: true },
      where: { clientId: { not: null }, shipmentDate: { gte: startOfMonth } },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    }),
    db.shipment.findMany({
      where: { OR: staleConditions },
      select: {
        id: true,
        trackingCode: true,
        status: true,
        updatedAt: true,
        shipmentDate: true,
        client: { select: { companyName: true } },
        destCity: true,
      },
      orderBy: { updatedAt: 'asc' },
      take: 8,
    }),
  ])

  // Client names
  const clientIds = topClientsRaw.map(c => c.clientId).filter(Boolean) as number[]
  const clients = clientIds.length
    ? await db.client.findMany({ where: { id: { in: clientIds } }, select: { id: true, companyName: true } })
    : []
  const clientMap = Object.fromEntries(clients.map(c => [c.id, c.companyName]))

  // Build 30-day activity array (fill missing days with 0)
  const dailyMap = Object.fromEntries(
    dailyRaw.map(d => [toDateKey(new Date(d.shipmentDate)), d._count.id]),
  )
  const activityData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now)
    d.setDate(now.getDate() - (29 - i))
    const key = toDateKey(d)
    return {
      date: d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
      guías: dailyMap[key] ?? 0,
    }
  })

  const statusMap = Object.fromEntries(byStatus.map(s => [s.status, s._count.id]))
  const inTransitCount = (statusMap['EN_RUTA'] ?? 0) + (statusMap['EN_PROCESO_ENTREGA'] ?? 0)

  // Calculate days stale for each shipment
  const staleWithDays = staleShipments.map(s => ({
    ...s,
    daysStale: Math.floor((now.getTime() - s.updatedAt.getTime()) / 86_400_000),
  }))

  return {
    total,
    thisMonth,
    inTransitCount,
    delivered: statusMap['ENTREGADO'] ?? 0,
    statusData: (
      ['PENDIENTE', 'EN_RUTA', 'EN_PROCESO_ENTREGA', 'ENTREGADO', 'ERRONEA', 'CADUCADA', 'SIN_UTILIZAR', 'CANCELADA'] as const
    ).map(s => ({ status: s, count: statusMap[s] ?? 0 })),
    activityData,
    inTransit,
    topClients: topClientsRaw.map(c => ({
      name:  clientMap[c.clientId!] ?? '—',
      count: c._count.id,
    })),
    staleShipments: staleWithDays,
  }
}

export default async function DashboardPage() {
  const {
    total, thisMonth, inTransitCount, delivered,
    statusData, activityData, inTransit, topClients, staleShipments,
  } = await getStats()

  const topMax = topClients[0]?.count || 1

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Resumen de operaciones</p>
      </div>

      {/* ── Alertas de guías estancadas ────────────────────────── */}
      {staleShipments.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <h2 className="text-sm font-semibold text-amber-800">
              {staleShipments.length} {staleShipments.length === 1 ? 'guía estancada' : 'guías estancadas'}
            </h2>
            <span className="text-xs text-amber-600 ml-1">— sin actualización por más días de lo esperado</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {staleShipments.map(s => (
              <Link
                key={s.id}
                href={`/admin/guias/${s.id}`}
                className="flex items-center justify-between bg-white border border-amber-100 rounded-lg px-3 py-2.5 hover:border-amber-300 transition-colors group"
              >
                <div className="min-w-0">
                  <p className="font-mono text-sm font-semibold text-amber-800 group-hover:underline truncate">
                    {s.trackingCode}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {s.client?.companyName ?? 'Sin cliente'}
                    {s.destCity ? ` · ${s.destCity}` : ''}
                    {' · '}{formatDateOnly(s.shipmentDate)}
                  </p>
                </div>
                <span className="ml-3 shrink-0 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                  {s.daysStale}d
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Stat cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard label="Total guías"  value={total}          icon={Package}     />
        <StatsCard label="Este mes"     value={thisMonth}      icon={TrendingUp}  />
        <StatsCard label="En tránsito"  value={inTransitCount} icon={Truck}       />
        <StatsCard label="Entregadas"   value={delivered}      icon={CheckCircle} />
      </div>

      {/* ── Charts row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart data={activityData} />
        </div>
        <div>
          <StatusDonut data={statusData} />
        </div>
      </div>

      {/* ── Operativo + Top clientes ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* En tránsito */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">En tránsito</h2>
              <p className="text-xs text-gray-400 mt-0.5">Guías EN_RUTA y EN_PROCESO_ENTREGA</p>
            </div>
            <Link
              href="/admin/guias?status=EN_RUTA"
              className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {inTransit.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">Sin guías en tránsito</p>
          ) : (
            <div className="space-y-2">
              {inTransit.map(s => (
                <Link
                  key={s.id}
                  href={`/admin/guias/${s.id}`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-sm text-primary-700 font-medium group-hover:underline truncate">
                      {s.trackingCode}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {s.client?.companyName ?? 'Sin cliente'}
                      {s.destCity ? ` · ${s.destCity}` : ''}
                    </p>
                  </div>
                  <StatusBadge status={s.status as ShipmentStatus} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Top clientes del mes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Top clientes</h2>
            <p className="text-xs text-gray-400 mt-0.5">Guías generadas este mes</p>
          </div>

          {topClients.length === 0 ? (
            <p className="text-gray-400 text-sm py-8 text-center">Sin datos este mes</p>
          ) : (
            <div className="mt-5 space-y-4">
              {topClients.map((c, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-700 font-medium truncate max-w-[75%]">{c.name}</p>
                    <span className="text-sm font-bold text-gray-900">{c.count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${Math.round((c.count / topMax) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
