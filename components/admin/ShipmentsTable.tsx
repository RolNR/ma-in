import Link from 'next/link'
import { StatusBadge } from './StatusBadge'

interface Shipment {
  id: string
  trackingCode: string
  carrier: { name: string }
  senderName: string | null
  destCity: string | null
  destState: string | null
  status: string
  shipmentDate: Date
}

interface ShipmentsTableProps {
  shipments: Shipment[]
}

export function ShipmentsTable({ shipments }: ShipmentsTableProps) {
  if (shipments.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium">Sin guías registradas</p>
        <p className="text-sm mt-1">Importa un CSV o crea una guía manualmente.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Código</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Carrier</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Remitente</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Destino</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600">Fecha</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {shipments.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 font-mono text-primary-700 font-medium">
                {s.trackingCode}
              </td>
              <td className="py-3 px-4 text-gray-700">{s.carrier.name}</td>
              <td className="py-3 px-4 text-gray-700">{s.senderName ?? '—'}</td>
              <td className="py-3 px-4 text-gray-500">
                {[s.destCity, s.destState].filter(Boolean).join(', ') || '—'}
              </td>
              <td className="py-3 px-4">
                <StatusBadge status={s.status as Parameters<typeof StatusBadge>[0]['status']} />
              </td>
              <td className="py-3 px-4 text-gray-500">
                {new Date(s.shipmentDate).toLocaleDateString('es-MX')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
