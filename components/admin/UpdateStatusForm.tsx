'use client'

import { useState } from 'react'
import { updateShipmentStatus, updateBatchStatus } from '@/lib/actions/shipments'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'
import { Loader2, Layers } from 'lucide-react'

const STATUS_OPTIONS: { value: ShipmentStatus; label: string }[] = [
  { value: 'PENDIENTE',           label: 'Pendiente' },
  { value: 'EN_RUTA',             label: 'En ruta' },
  { value: 'EN_PROCESO_ENTREGA',  label: 'En proceso de entrega' },
  { value: 'ENTREGADO',           label: 'Entregado' },
  { value: 'ERRONEA',             label: 'Errónea' },
  { value: 'CADUCADA',            label: 'Caducada' },
  { value: 'SIN_UTILIZAR',        label: 'Sin utilizar' },
]

interface Props {
  shipmentId: string
  currentStatus: ShipmentStatus
  batchId?: string
  batchSize?: number
  /** When true, batch update is always active (no checkbox shown) */
  forceBatch?: boolean
}

type UIState = 'idle' | 'loading' | 'success' | 'error'

export function UpdateStatusForm({ shipmentId, currentStatus, batchId, batchSize, forceBatch }: Props) {
  const [selected, setSelected] = useState<ShipmentStatus>(currentStatus)
  const [uiState, setUiState]   = useState<UIState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [applyToBatch, setApplyToBatch] = useState(forceBatch ?? false)

  const isSame = selected === currentStatus

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isSame) return
    setUiState('loading')
    const description = (e.currentTarget.elements.namedItem('description') as HTMLTextAreaElement).value

    const result = applyToBatch && batchId
      ? await updateBatchStatus(batchId, selected, description)
      : await updateShipmentStatus(shipmentId, selected, description)

    if (result.status === 'success') {
      setUiState('success')
      setTimeout(() => setUiState('idle'), 3000)
    } else {
      setErrorMsg(result.status === 'error' ? result.message : 'Error desconocido.')
      setUiState('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo status</label>
        <select
          name="status"
          value={selected}
          onChange={e => { setSelected(e.target.value as ShipmentStatus); setUiState('idle') }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {STATUS_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {isSame && (
          <p className="text-xs text-amber-600 mt-1">Este es el status actual de la guía.</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción <span className="text-gray-400">(opcional)</span>
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="Ej: Paquete en sucursal de distribución..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      {/* Batch toggle — only shown when guide belongs to a batch and forceBatch is not set */}
      {batchId && batchSize && batchSize > 1 && !forceBatch && (
        <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-lg border border-primary-100 bg-primary-50 hover:bg-primary-100 transition-colors">
          <input
            type="checkbox"
            checked={applyToBatch}
            onChange={e => setApplyToBatch(e.target.checked)}
            className="mt-0.5 accent-primary-600"
          />
          <span className="text-sm text-primary-800 leading-snug">
            <span className="font-semibold flex items-center gap-1 mb-0.5">
              <Layers className="w-3.5 h-3.5" /> Actualizar todo el lote
            </span>
            <span className="text-primary-600 text-xs">
              Aplica este status a las {batchSize} guías del lote.
            </span>
          </span>
        </label>
      )}

      {uiState === 'success' && (
        <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
          {applyToBatch ? `Lote actualizado correctamente.` : 'Status actualizado correctamente.'}
        </p>
      )}
      {uiState === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={uiState === 'loading' || isSame}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
      >
        {uiState === 'loading'
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
          : applyToBatch ? `Actualizar lote (${batchSize})` : 'Actualizar status'}
      </button>
    </form>
  )
}
