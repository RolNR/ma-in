'use client'

import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart,
} from 'recharts'

interface Props {
  data: { date: string; guías: number }[]
}

export function ActivityChart({ data }: Props) {
  const hasData = data.some(d => d.guías > 0)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
        Actividad
      </h2>
      <p className="text-xs text-gray-400 mb-5">Guías creadas — últimos 30 días</p>

      {hasData ? (
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
            <defs>
              <linearGradient id="colorGuias" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#138A6F" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#138A6F" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
              labelStyle={{ color: '#6b7280', marginBottom: 4 }}
            />
            <Area
              type="monotone"
              dataKey="guías"
              stroke="#138A6F"
              strokeWidth={2}
              fill="url(#colorGuias)"
              dot={false}
              activeDot={{ r: 4, fill: '#138A6F' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[210px] text-gray-400 text-sm">
          Sin actividad en los últimos 30 días
        </div>
      )}
    </div>
  )
}
