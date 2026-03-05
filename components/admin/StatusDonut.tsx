'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const COLORS: Record<string, string> = {
  PENDIENTE:           '#94a3b8',
  EN_RUTA:             '#3b82f6',
  EN_PROCESO_ENTREGA:  '#f59e0b',
  ENTREGADO:           '#22c55e',
  ERRONEA:             '#ef4444',
  CADUCADA:            '#f97316',
  SIN_UTILIZAR:        '#d1d5db',
}

const LABELS: Record<string, string> = {
  PENDIENTE:           'Pendiente',
  EN_RUTA:             'En ruta',
  EN_PROCESO_ENTREGA:  'En proceso',
  ENTREGADO:           'Entregado',
  ERRONEA:             'Errónea',
  CADUCADA:            'Caducada',
  SIN_UTILIZAR:        'Sin utilizar',
}

interface Props {
  data: { status: string; count: number }[]
}

export function StatusDonut({ data }: Props) {
  const chartData = data
    .filter(d => d.count > 0)
    .map(d => ({
      name:  LABELS[d.status] ?? d.status,
      value: d.count,
      color: COLORS[d.status] ?? '#94a3b8',
    }))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
        Por status
      </h2>
      <p className="text-xs text-gray-400 mb-2">Distribución actual</p>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={95}
              dataKey="value"
              paddingAngle={2}
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              formatter={(value) => [(value as number).toLocaleString()]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[250px] text-gray-400 text-sm">
          Sin datos aún
        </div>
      )}
    </div>
  )
}
