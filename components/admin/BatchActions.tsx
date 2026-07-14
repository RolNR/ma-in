'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteBatch } from '@/lib/actions/shipments'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'

interface Props {
  batchId: string
  guideCount: number
}

export function BatchActions({ batchId, guideCount }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')

  function handleDelete() {
    setError('')
    startTransition(async () => {
      const result = await deleteBatch(batchId)
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

      {!confirmDelete && (
        <button
          onClick={() => setConfirmDelete(true)}
          disabled={isPending}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Trash2 className="w-4 h-4" /> Eliminar lote completo
        </button>
      )}

      {confirmDelete && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 space-y-2">
          <p className="text-xs text-red-700 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            Eliminarás permanentemente las <span className="font-bold">{guideCount}</span> guías de este lote y todo su historial. Esta acción no se puede deshacer.
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
              Sí, eliminar lote
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
