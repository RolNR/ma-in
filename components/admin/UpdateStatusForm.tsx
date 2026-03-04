'use client'

import { useState } from 'react'
import { updateShipmentStatus } from '@/lib/actions/shipments'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

const STATUS_OPTIONS: { value: ShipmentStatus; label: string }[] = [
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'EN_RUTA', label: 'En ruta' },
  { value: 'EN_PROCESO_ENTREGA', label: 'En proceso de entrega' },
  { value: 'ENTREGADO', label: 'Entregado' },
  { value: 'ERRONEA', label: 'Errónea' },
  { value: 'CADUCADA', label: 'Caducada' },
  { value: 'SIN_UTILIZAR', label: 'Sin utilizar' },
]

interface UpdateStatusFormProps {
  shipmentId: string
  currentStatus: ShipmentStatus
}

type UIState = 'idle' | 'loading' | 'success' | 'error'

export function UpdateStatusForm({ shipmentId, currentStatus }: UpdateStatusFormProps) {
  const [uiState, setUiState] = useState<UIState>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUiState('loading')
    const form = e.currentTarget
    const status = (form.elements.namedItem('status') as HTMLSelectElement).value as ShipmentStatus
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement).value

    const result = await updateShipmentStatus(shipmentId, status, description)
    if (result.status === 'success') {
      setUiState('success')
      setTimeout(() => setUiState('idle'), 3000)
    } else if (result.status === 'error') {
      setErrorMessage(result.message)
      setUiState('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Nuevo status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={currentStatus}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Descripción <span className="text-gray-400">(opcional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          placeholder="Ej: Paquete en sucursal de distribución..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      {uiState === 'success' && (
        <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">Status actualizado correctamente.</p>
      )}
      {uiState === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={uiState === 'loading'}
        className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-medium rounded-lg text-sm transition-colors"
      >
        {uiState === 'loading' ? 'Guardando...' : 'Actualizar status'}
      </button>
    </form>
  )
}
