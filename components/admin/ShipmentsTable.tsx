'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StatusBadge } from './StatusBadge'
import { Package, ChevronRight, ChevronDown, Archive, ArchiveRestore, Trash2, Loader2, AlertTriangle, X } from 'lucide-react'
import { bulkArchiveShipments, bulkDeleteShipments, bulkUpdateStatus } from '@/lib/actions/shipments'
import { formatDateOnly } from '@/lib/utils'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

interface Shipment {
  id: string
  trackingCode: string
  batchId: string | null
  carrier: { name: string }
  client: { companyName: string } | null
  senderName: string | null
  destCity: string | null
  destState: string | null
  status: string
  archived: boolean
  shipmentDate: Date
}

interface ShipmentsTableProps {
  shipments: Shipment[]
  isAdmin: boolean
  showArchived?: boolean
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

const cell = 'py-3 px-4'

// ─── Batch row ────────────────────────────────────────────────────────────────

interface BatchRowProps {
  batch: Extract<Row, { type: 'batch' }>
  selected: Set<string>
  onToggleBatch: (ids: string[]) => void
  onToggleOne: (id: string) => void
}

function BatchRow({ batch, selected, onToggleBatch, onToggleOne }: BatchRowProps) {
  const [open, setOpen] = useState(false)
  const first = batch.shipments[0]
  const dest = [first.destCity, first.destState].filter(Boolean).join(', ') || '—'
  const date = formatDateOnly(first.shipmentDate)
  const batchIds = batch.shipments.map(s => s.id)
  const allChecked = batchIds.every(id => selected.has(id))
  const someChecked = batchIds.some(id => selected.has(id))
  const Chevron = open ? ChevronDown : ChevronRight

  return (
    <>
      <tr className="bg-primary-50 hover:bg-primary-100 transition-colors">
        <td className={`${cell} w-10`} onClick={e => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={allChecked}
            ref={el => { if (el) el.indeterminate = someChecked && !allChecked }}
            onChange={() => onToggleBatch(batchIds)}
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          />
        </td>
        <td
          className={`${cell} font-medium text-primary-700 cursor-pointer select-none`}
          onClick={() => setOpen(o => !o)}
        >
          <div className="flex items-center gap-2">
            <Chevron className="w-4 h-4 shrink-0" />
            <Package className="w-4 h-4 shrink-0" />
            <span>Lote · {batch.shipments.length} guías</span>
          </div>
        </td>
        <td className={`${cell} text-gray-700`}>{first.carrier.name}</td>
        <td className={`${cell} text-gray-700`}>{first.client?.companyName ?? '—'}</td>
        <td className={`${cell} text-gray-700`}>{first.senderName ?? '—'}</td>
        <td className={`${cell} text-gray-500`}>{dest}</td>
        <td className={cell}><StatusBadge status={first.status as ShipmentStatus} /></td>
        <td className={`${cell} text-gray-500`}>{date}</td>
      </tr>

      {open && batch.shipments.map(s => (
        <tr key={s.id} className="bg-primary-50/40 hover:bg-primary-50 border-l-2 border-primary-300 transition-colors">
          <td className={`${cell} w-10`}>
            <input
              type="checkbox"
              checked={selected.has(s.id)}
              onChange={() => onToggleOne(s.id)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
            />
          </td>
          <td className={`${cell} pl-10 font-mono text-primary-700 font-medium`}>
            <Link href={`/admin/guias/${s.id}`} className="hover:underline">{s.trackingCode}</Link>
          </td>
          <td className={`${cell} text-gray-700`}>{s.carrier.name}</td>
          <td className={`${cell} text-gray-700`}>{s.client?.companyName ?? '—'}</td>
          <td className={`${cell} text-gray-700`}>{s.senderName ?? '—'}</td>
          <td className={`${cell} text-gray-500`}>{[s.destCity, s.destState].filter(Boolean).join(', ') || '—'}</td>
          <td className={cell}><StatusBadge status={s.status as ShipmentStatus} /></td>
          <td className={`${cell} text-gray-500`}>{formatDateOnly(s.shipmentDate)}</td>
        </tr>
      ))}
    </>
  )
}

// ─── Bulk action bar ──────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: ShipmentStatus; label: string }[] = [
  { value: 'PENDIENTE',           label: 'Pendiente' },
  { value: 'EN_RUTA',             label: 'En ruta' },
  { value: 'EN_PROCESO_ENTREGA',  label: 'En proceso de entrega' },
  { value: 'ENTREGADO',           label: 'Entregado' },
  { value: 'ERRONEA',             label: 'Errónea' },
  { value: 'CADUCADA',            label: 'Caducada' },
  { value: 'SIN_UTILIZAR',        label: 'Sin utilizar' },
]

interface BulkBarProps {
  count: number
  isAdmin: boolean
  showArchived: boolean
  onArchive: () => void
  onDelete: () => void
  onStatusChange: (status: ShipmentStatus) => void
  onClear: () => void
  isPending: boolean
  confirmDelete: boolean
  onConfirmDelete: () => void
  onCancelDelete: () => void
  error: string
}

function BulkBar({
  count, isAdmin, showArchived,
  onArchive, onDelete, onStatusChange, onClear,
  isPending, confirmDelete, onConfirmDelete, onCancelDelete, error,
}: BulkBarProps) {
  const [selectedStatus, setSelectedStatus] = useState<ShipmentStatus>('ENTREGADO')

  return (
    <div className="px-4 py-3 bg-primary-50 border-b border-primary-100 flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-primary-700">{count} guía{count !== 1 ? 's' : ''} seleccionada{count !== 1 ? 's' : ''}</span>

      {!confirmDelete && (
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {error && <span className="text-xs text-red-600">{error}</span>}

          {/* Cambiar status masivo */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as ShipmentStatus)}
              disabled={isPending}
              className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-40"
            >
              {STATUS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button
              onClick={() => onStatusChange(selectedStatus)}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-40 transition-colors"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              Aplicar
            </button>
          </div>

          <div className="w-px h-5 bg-gray-300" />

          <button
            onClick={onArchive}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : showArchived ? <ArchiveRestore className="w-3.5 h-3.5" /> : <Archive className="w-3.5 h-3.5" />}
            {showArchived ? 'Restaurar' : 'Archivar'}
          </button>
          {isAdmin && (
            <button
              onClick={onDelete}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 disabled:opacity-40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Eliminar
            </button>
          )}
          <button onClick={onClear} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {confirmDelete && (
        <div className="flex items-center gap-3 ml-auto flex-wrap">
          <span className="text-xs text-red-700 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Se eliminarán {count} guía{count !== 1 ? 's' : ''} y todo su historial. Esta acción no se puede deshacer.
          </span>
          <button
            onClick={onCancelDelete}
            disabled={isPending}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmDelete}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 transition-colors"
          >
            {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Sí, eliminar
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ShipmentsTable({ shipments, isAdmin, showArchived = false }: ShipmentsTableProps) {
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const allIds = shipments.map(s => s.id)
  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id))
  const someSelected = selected.size > 0

  function toggleOne(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleBatch(ids: string[]) {
    const allIn = ids.every(id => selected.has(id))
    setSelected(prev => {
      const next = new Set(prev)
      ids.forEach(id => allIn ? next.delete(id) : next.add(id))
      return next
    })
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(allIds))
  }

  function clearSelection() {
    setSelected(new Set())
    setConfirmDelete(false)
    setError('')
  }

  function handleBulkStatusChange(status: ShipmentStatus) {
    setError('')
    startTransition(async () => {
      const result = await bulkUpdateStatus(Array.from(selected), status)
      if (result.status === 'error') {
        setError(result.message)
      } else {
        clearSelection()
        router.refresh()
      }
    })
  }

  function handleBulkArchive() {
    setError('')
    startTransition(async () => {
      const result = await bulkArchiveShipments(Array.from(selected), !showArchived)
      if (result.status === 'error') {
        setError(result.message)
      } else {
        clearSelection()
        router.refresh()
      }
    })
  }

  function handleBulkDelete() {
    setError('')
    startTransition(async () => {
      const result = await bulkDeleteShipments(Array.from(selected))
      if (result.status === 'error') {
        setError(result.message)
        setConfirmDelete(false)
      } else {
        clearSelection()
        router.refresh()
      }
    })
  }

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
    <>
      {someSelected && (
        <BulkBar
          count={selected.size}
          isAdmin={isAdmin}
          showArchived={showArchived}
          onStatusChange={handleBulkStatusChange}
          onArchive={handleBulkArchive}
          onDelete={() => setConfirmDelete(true)}
          onClear={clearSelection}
          isPending={isPending}
          confirmDelete={confirmDelete}
          onConfirmDelete={handleBulkDelete}
          onCancelDelete={() => setConfirmDelete(false)}
          error={error}
        />
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={el => { if (el) el.indeterminate = someSelected && !allSelected }}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                />
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Código</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Carrier</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Cliente</th>
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
                  <td className={`${cell} w-10`}>
                    <input
                      type="checkbox"
                      checked={selected.has(row.shipment.id)}
                      onChange={() => toggleOne(row.shipment.id)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  </td>
                  <td className={`${cell} font-mono text-primary-700 font-medium`}>
                    <Link href={`/admin/guias/${row.shipment.id}`} className="hover:underline">
                      {row.shipment.trackingCode}
                    </Link>
                  </td>
                  <td className={`${cell} text-gray-700`}>{row.shipment.carrier.name}</td>
                  <td className={`${cell} text-gray-700`}>{row.shipment.client?.companyName ?? '—'}</td>
                  <td className={`${cell} text-gray-700`}>{row.shipment.senderName ?? '—'}</td>
                  <td className={`${cell} text-gray-500`}>{[row.shipment.destCity, row.shipment.destState].filter(Boolean).join(', ') || '—'}</td>
                  <td className={cell}><StatusBadge status={row.shipment.status as ShipmentStatus} /></td>
                  <td className={`${cell} text-gray-500`}>{formatDateOnly(row.shipment.shipmentDate)}</td>
                </tr>
              ) : (
                <BatchRow
                  key={row.batchId}
                  batch={row}
                  selected={selected}
                  onToggleBatch={toggleBatch}
                  onToggleOne={toggleOne}
                />
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
