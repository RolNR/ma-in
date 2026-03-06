'use client'

import { useState } from 'react'
import { changeOwnPassword } from '@/lib/actions/users'
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

type UIState = 'idle' | 'loading' | 'success' | 'error'

export function ChangePasswordForm() {
  const [uiState, setUiState] = useState<UIState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [formKey, setFormKey] = useState(0)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const current = fd.get('currentPassword') as string
    const next    = fd.get('newPassword') as string
    const confirm = fd.get('confirmPassword') as string

    if (next !== confirm) {
      setErrorMsg('Las contraseñas nuevas no coinciden.')
      setUiState('error')
      return
    }

    setUiState('loading')
    setErrorMsg('')
    const result = await changeOwnPassword(current, next)

    if (result.status === 'success') {
      setUiState('success')
      setFormKey(k => k + 1)
    } else {
      setErrorMsg(result.message)
      setUiState('error')
    }
  }

  return (
    <form key={formKey} onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
        <div className="relative">
          <input
            name="currentPassword"
            type={showCurrent ? 'text' : 'password'}
            required
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button type="button" onClick={() => setShowCurrent(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
        <div className="relative">
          <input
            name="newPassword"
            type={showNew ? 'text' : 'password'}
            required
            minLength={8}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button type="button" onClick={() => setShowNew(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Mínimo 8 caracteres</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar nueva contraseña</label>
        <input
          name="confirmPassword"
          type="password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {uiState === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{errorMsg}</p>
      )}
      {uiState === 'success' && (
        <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Contraseña actualizada correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={uiState === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
      >
        {uiState === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</> : 'Cambiar contraseña'}
      </button>
    </form>
  )
}
