'use client'

import { useState, useTransition } from 'react'
import { toggleUserActive, resetUserPassword, changeUserRole } from '@/lib/actions/users'
import { UserCheck, UserX, RefreshCw, Copy, Check, Eye, EyeOff } from 'lucide-react'
import type { UserRole } from '@/lib/generated/prisma/client'
import { cn } from '@/lib/utils'

interface UserData {
  id: number
  name: string
  email: string
  role: UserRole
  active: boolean
  createdAt: Date
  client: { companyName: string } | null
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  operator: 'Operador',
  client: 'Cliente',
}

export function UserCard({ user }: { user: UserData }) {
  const [isPending, startTransition] = useTransition()
  const [newPassword, setNewPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleToggleActive() {
    startTransition(async () => { await toggleUserActive(user.id) })
  }

  function handleResetPassword() {
    startTransition(async () => {
      const result = await resetUserPassword(user.id)
      if (result.status === 'success' && result.password) {
        setNewPassword(result.password)
        setShowPass(false)
      }
    })
  }

  function handleRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const role = e.target.value as UserRole
    startTransition(async () => { await changeUserRole(user.id, role) })
  }

  function copyPassword() {
    navigator.clipboard.writeText(newPassword)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn(
      'bg-white rounded-xl shadow-sm border p-4 transition-opacity',
      user.active ? 'border-gray-100' : 'border-gray-200 opacity-60',
      isPending && 'opacity-50 pointer-events-none'
    )}>
      <div className="flex items-start gap-3">
        {/* Avatar inicial */}
        <div className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
          user.active ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'
        )}>
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            {!user.active && (
              <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Inactivo</span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
          {user.client && (
            <p className="text-xs text-gray-400">{user.client.companyName}</p>
          )}
        </div>

        {/* Role selector */}
        <select
          defaultValue={user.role}
          onChange={handleRoleChange}
          disabled={user.role === 'client'}
          className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="admin">Admin</option>
          <option value="operator">Operador</option>
          {user.role === 'client' && <option value="client">Cliente</option>}
        </select>
      </div>

      {/* Password reset result */}
      {newPassword && (
        <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <code className="flex-1 text-xs font-mono text-green-900">
            {showPass ? newPassword : '••••••••••'}
          </code>
          <button type="button" onClick={() => setShowPass(v => !v)} className="text-green-600">
            {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button type="button" onClick={copyPassword} className="text-green-600">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
        <button
          onClick={handleResetPassword}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Resetear contraseña
        </button>
        <div className="flex-1" />
        <button
          onClick={handleToggleActive}
          className={cn(
            'flex items-center gap-1.5 text-xs font-medium transition-colors',
            user.active ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'
          )}
        >
          {user.active
            ? <><UserX className="w-3.5 h-3.5" /> Desactivar</>
            : <><UserCheck className="w-3.5 h-3.5" /> Activar</>
          }
        </button>
      </div>
    </div>
  )
}
