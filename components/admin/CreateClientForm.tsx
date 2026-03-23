'use client'

import { useFormState } from 'react-dom'
import { createClient } from '@/lib/actions/clients'
import Link from 'next/link'
import { useState, useRef } from 'react'
import { Copy, Check } from 'lucide-react'
import { CPInput } from './CPInput'

const initialState = { status: 'idle' as const }

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

function PasswordSuccess({ password, clientId }: { password: string; clientId: number }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="rounded-xl border-2 border-green-400 bg-green-50 p-6 text-center space-y-4">
      <div className="text-green-700 font-semibold text-lg">¡Cliente creado exitosamente!</div>
      <p className="text-sm text-green-800">
        Comparte esta contraseña con el cliente. <strong>Solo se muestra una vez.</strong>
      </p>

      <div className="bg-white border border-green-300 rounded-lg px-6 py-4 flex items-center justify-between gap-4">
        <span className="font-mono text-2xl font-bold text-gray-900 tracking-widest select-all">{password}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>

      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        ⚠️ Guarda esta contraseña ahora. No podrás verla de nuevo.
      </p>

      <Link
        href={`/admin/clientes/${clientId}`}
        className="inline-block mt-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm transition-colors"
      >
        Ver perfil del cliente
      </Link>
    </div>
  )
}

export function CreateClientForm() {
  const [state, formAction] = useFormState(createClient, initialState)
  const cityRef  = useRef<HTMLInputElement>(null)
  const stateRef = useRef<HTMLInputElement>(null)

  if (state.status === 'success') {
    return <PasswordSuccess password={state.password} clientId={state.clientId} />
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>
            Empresa <span className="text-red-500">*</span>
          </label>
          <input name="companyName" required className={inputClass} placeholder="Nombre comercial (ej. Qualitas Aguascalientes)" />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Razón social</label>
          <input name="legalName" className={inputClass} placeholder="Razón social para facturación (ej. Interdependientes SA de CV)" />
          <p className="text-xs text-gray-400 mt-1">Se usa para vincular guías del excel maestro a este cliente.</p>
        </div>

        <div>
          <label className={labelClass}>
            Email <span className="text-red-500">*</span>
          </label>
          <input name="email" type="email" required className={inputClass} placeholder="contacto@empresa.com" />
          <p className="text-xs text-gray-400 mt-1">Será el usuario de acceso al portal.</p>
        </div>

        <div>
          <label className={labelClass}>Nombre de contacto</label>
          <input name="contactName" className={inputClass} placeholder="Nombre completo" />
        </div>

        <div>
          <label className={labelClass}>RFC</label>
          <input name="rfc" className={inputClass} placeholder="XAXX010101000" maxLength={13} />
        </div>

        <div>
          <label className={labelClass}>Teléfono</label>
          <input name="phone" type="tel" className={inputClass} placeholder="55 1234 5678" />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Calle y número</label>
          <input name="street" className={inputClass} placeholder="Av. Reforma 123, Col. Centro" />
        </div>

        <div>
          <label className={labelClass}>
            C.P.
            <span className="ml-1 text-xs text-primary-500">→ autorrellena ciudad y estado</span>
          </label>
          <CPInput name="postal" cityRef={cityRef} stateRef={stateRef} />
        </div>

        <div>
          <label className={labelClass}>Ciudad</label>
          <input ref={cityRef} name="city" className={inputClass} placeholder="Ciudad" />
        </div>

        <div>
          <label className={labelClass}>Estado</label>
          <input ref={stateRef} name="state" className={inputClass} placeholder="Estado" />
        </div>
      </div>

      {state.status === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.message}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm transition-colors"
        >
          Crear cliente
        </button>
        <a
          href="/admin/clientes"
          className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}
