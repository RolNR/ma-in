'use client'

import { useState } from 'react'
import Link from 'next/link'
import { StatusBadge } from './StatusBadge'
import { Package, ChevronRight, ChevronDown } from 'lucide-react'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

interface Shipment {
  id: string
  trackingCode: string
  batchId: string | null
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

// ─── Row types ────────────────────────────────────────────────────────────────

type Row =
  | { type: 'individual'; shipment: Shipment }
  | { type: 'batch'; batchId: string; shipments: Shipment[] }

function buildRows(shipments: Shipment[]): Row[] {
  const rows: Row[] = []
  const seen = new Set<string>()
  for (const s of shipments) {
    if (s.batchId) {
      if (!seen.has(s.batchId)) {
        seen.add(s.batchId)
        rows.push({ type: 'batch', batchId: s.batchId, shipments: shipments.filter(x => x.batchId === s.batchId) })
      }
    } else {
      rows.push({ type: 'individual', shipment: s })
    }
  }
  return rows
}

// ─── Shared cell styles ───────────────────────────────────────────────────────

const cell = 'py-3 px-4'

// ─── Batch row ────────────────────────────────────────────────────────────────

function BatchRow({ batch }: { batch: Extract<Row, { type: 'batch' }> }) {
  const [open, setOpen] = useState(false)
  const first = batch.shipments[0]
  const dest = [first.destCity, first.destState].filter(Boolean).join(', ') || '—'
  const date = new Date(first.shipmentDate).toLocaleDateString('es-MX')
  const Chevron = open ? ChevronDown : ChevronRight

  return (
    <>
      {/* Batch header row */}
      <tr
        className="bg-primary-50 hover:bg-primary-100 transition-colors cursor-pointer select-none"
        onClick={() => setOpen(o => !o)}
      >
        <td className={`${cell} font-medium text-primary-700`}>
          <div className="flex items-center gap-2">
            <Chevron className="w-4 h-4 shrink-0" />
            <Package className="w-4 h-4 shrink-0" />
            <span>Lote · {batch.shipments.length} guías</span>
          </div>
        </td>
        <td className={`${cell} text-gray-700`}>{first.carrier.name}</td>
        <td className={`${cell} text-gray-700`}>{first.senderName ?? '—'}</td>
        <td className={`${cell} text-gray-500`}>{dest}</td>
        <td className={cell}>
          <StatusBadge status={first.status as ShipmentStatus} />
        </td>
        <td className={`${cell} text-gray-500`}>{date}</td>
      </tr>

      {/* Expanded individual rows */}
      {open && batch.shipments.map(s => (
        <tr key={s.id} className="bg-primary-50/40 hover:bg-primary-50 border-l-2 border-primary-300 transition-colors">
          <td className={`${cell} pl-10 font-mono text-primary-700 font-medium`}>
            <Link href={`/admin/guias/${s.id}`} className="hover:underline">
              {s.trackingCode}
            </Link>
          </td>
          <td className={`${cell} text-gray-700`}>{s.carrier.name}</td>
          <td className={`${cell} text-gray-700`}>{s.senderName ?? '—'}</td>
          <td className={`${cell} text-gray-500`}>
            {[s.destCity, s.destState].filter(Boolean).join(', ') || '—'}
          </td>
          <td className={cell}>
            <StatusBadge status={s.status as ShipmentStatus} />
          </td>
          <td className={`${cell} text-gray-500`}>
            {new Date(s.shipmentDate).toLocaleDateString('es-MX')}
          </td>
        </tr>
      ))}
    </>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ShipmentsTable({ shipments }: ShipmentsTableProps) {
  if (shipments.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium">Sin guías registradas</p>
        <p className="text-sm mt-1">Importa un CSV o crea una guía manualmente.</p>
      </div>
    )
  }

  const rows = buildRows(shipments)

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
          {rows.map((row, i) =>
            row.type === 'individual' ? (
              <tr key={row.shipment.id} className="hover:bg-gray-50 transition-colors">
                <td className={`${cell} font-mono text-primary-700 font-medium`}>
                  <Link href={`/admin/guias/${row.shipment.id}`} className="hover:underline">
                    {row.shipment.trackingCode}
                  </Link>
                </td>
                <td className={`${cell} text-gray-700`}>{row.shipment.carrier.name}</td>
                <td className={`${cell} text-gray-700`}>{row.shipment.senderName ?? '—'}</td>
                <td className={`${cell} text-gray-500`}>
                  {[row.shipment.destCity, row.shipment.destState].filter(Boolean).join(', ') || '—'}
                </td>
                <td className={cell}>
                  <StatusBadge status={row.shipment.status as ShipmentStatus} />
                </td>
                <td className={`${cell} text-gray-500`}>
                  {new Date(row.shipment.shipmentDate).toLocaleDateString('es-MX')}
                </td>
              </tr>
            ) : (
              <BatchRow key={row.batchId} batch={row} />
            )
          )}
        </tbody>
      </table>
    </div>
  )
}
