'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { archiveShipment, deleteShipment } from '@/lib/actions/shipments'
import { Archive, ArchiveRestore, Trash2, Loader2, AlertTriangle } from 'lucide-react'

interface Props {
  shipmentId: string
  archived: boolean
  isAdmin: boolean
  trackingCode: string
}

export function ShipmentActions({ shipmentId, archived, isAdmin, trackingCode }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')

  function handleArchive() {
    setError('')
    startTransition(async () => {
      const result = await archiveShipment(shipmentId, !archived)
      if (result.status === 'error') setError(result.message)
    })
  }

  function handleDelete() {
    setError('')
    startTransition(async () => {
      const result = await deleteShipment(shipmentId)
      if (result.status === 'success') {
        router.push('/admin/guias')
      } else {
        setError(result.status === 'error' ? result.message : 'Error desconocido.')
        setConfirmDelete(false)
      }
    })
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {/* Archive / Restore */}
      <button
        onClick={handleArchive}
        disabled={isPending}
        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {isPending
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : archived
            ? <ArchiveRestore className="w-4 h-4" />
            : <Archive className="w-4 h-4" />
        }
        {archived ? 'Restaurar guía' : 'Archivar guía'}
      </button>

      {/* Delete — admin only */}
      {isAdmin && !confirmDelete && (
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={isPending}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Eliminar guía
        </button>
      )}

      {/* Delete confirmation */}
      {isAdmin && confirmDelete && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-2">
          <p className="text-xs text-red-700 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Eliminarás permanentemente la guía <span className="font-mono font-bold">{trackingCode}</span> y todo su historial. Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              disabled={isPending}
              className="flex-1 py-1.5 text-xs font-medium rounded-md border border-gray-300 text-gray-600 hover:bg-white transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="flex-1 py-1.5 text-xs font-medium rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 transition-colors flex items-center justify-center gap-1"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Sí, eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
