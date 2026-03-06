'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteClient } from '@/lib/actions/clients'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'

export function DeleteClientButton({ clientId }: { clientId: number }) {
  const router = useRouter()
  const [confirm, setConfirm] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    setError('')
    startTransition(async () => {
      const result = await deleteClient(clientId)
      if (result.status === 'error') {
        setError(result.message)
      } else {
        router.push('/admin/clientes')
      }
    })
  }

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
      >
        <Trash2 className="w-4 h-4" /> Eliminar cliente
      </button>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          Se eliminarán el cliente, sus usuarios y contactos. Las guías quedarán sin cliente asignado.
          <strong> Esta acción no se puede deshacer.</strong>
        </span>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={() => setConfirm(false)}
          disabled={isPending}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 transition-colors"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Sí, eliminar
        </button>
      </div>
    </div>
  )
}
