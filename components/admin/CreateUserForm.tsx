'use client'

import { useState } from 'react'
import { createUser } from '@/lib/actions/users'
import { Loader2, Copy, Check, Eye, EyeOff } from 'lucide-react'

type UIState = 'idle' | 'loading' | 'success' | 'error'

export function CreateUserForm() {
  const [formKey, setFormKey]   = useState(0)
  const [uiState, setUiState]   = useState<UIState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [showPass, setShowPass] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUiState('loading')
    setErrorMsg('')
    setNewPassword('')

    const result = await createUser(new FormData(e.currentTarget))

    if (result.status === 'success') {
      setNewPassword(result.password ?? '')
      setUiState('success')
      setFormKey(k => k + 1) // remount form fields → limpia los inputs
    } else {
      setErrorMsg(result.message)
      setUiState('error')
    }
  }

  function copyPassword() {
    navigator.clipboard.writeText(newPassword)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <form key={formKey} onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input
          name="name"
          required
          placeholder="Nombre completo"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
        <input
          name="email"
          type="email"
          required
          placeholder="usuario@ejemplo.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
        <select
          name="role"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="operator">Operador</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      {uiState === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{errorMsg}</p>
      )}

      {uiState === 'success' && newPassword && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
          <p className="text-xs font-semibold text-green-800">Usuario creado. Contraseña temporal:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-sm font-mono bg-white border border-green-200 rounded px-2 py-1 text-green-900">
              {showPass ? newPassword : '••••••••••'}
            </code>
            <button type="button" onClick={() => setShowPass(v => !v)} className="text-green-600 hover:text-green-800">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button type="button" onClick={copyPassword} className="text-green-600 hover:text-green-800">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-green-700">Comparte esta contraseña con el usuario. Podrá cambiarla después.</p>
        </div>
      )}

      <button
        type="submit"
        disabled={uiState === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
      >
        {uiState === 'loading' ? <><Loader2 className="w-4 h-4 animate-spin" /> Creando...</> : 'Crear usuario'}
      </button>
    </form>
  )
}
