'use client'

import { useFormState } from 'react-dom'
import { useState } from 'react'
import { resetClientPassword } from '@/lib/actions/clients'
import { KeyRound, Copy, Check } from 'lucide-react'

export function ResetPasswordButton({ userId }: { userId: number }) {
  const [state, formAction] = useFormState(resetClientPassword, { status: 'idle' })
  const [copied, setCopied] = useState(false)

  function handleCopy(pwd: string) {
    navigator.clipboard.writeText(pwd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (state.status === 'success') {
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-amber-700">
          Nueva contraseña — solo se muestra una vez:
        </p>
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <span className="font-mono text-lg font-bold text-gray-900 select-all tracking-widest">
            {state.password}
          </span>
          <button
            type="button"
            onClick={() => handleCopy(state.password)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-gray-300 rounded-lg hover:bg-white transition-colors"
          >
            {copied
              ? <><Check className="w-3.5 h-3.5 text-green-600" /> Copiado</>
              : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
          </button>
        </div>
      </div>
    )
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="userId" value={userId} />
      {state.status === 'error' && (
        <p className="text-xs text-red-600 mb-2">{state.message}</p>
      )}
      <button
        type="submit"
        className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <KeyRound className="w-4 h-4" />
        Regenerar contraseña
      </button>
    </form>
  )
}
