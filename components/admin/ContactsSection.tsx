'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createContact, deleteContact } from '@/lib/actions/contacts'
import { Plus, Trash2, User, X, Loader2 } from 'lucide-react'

export interface ContactItem {
  id: number
  name: string
  nickname: string | null
  street: string | null
  city: string | null
  state: string | null
  postal: string | null
  phone: string | null
}

interface Props {
  clientId: number
  contacts: ContactItem[]
}

const inputClass = 'w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
const labelClass = 'block text-xs font-medium text-gray-600 mb-1'

export function ContactsSection({ clientId, contacts: initial }: Props) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  function handleAdd(formData: FormData) {
    setError('')
    startTransition(async () => {
      const result = await createContact(clientId, formData)
      if (result.status === 'error') {
        setError(result.message)
      } else {
        setShowForm(false)
        router.refresh()
      }
    })
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteContact(id, clientId)
      router.refresh()
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Contactos frecuentes
        </h2>
        <button
          onClick={() => { setShowForm(v => !v); setError('') }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {showForm
            ? <><X className="w-3.5 h-3.5" /> Cancelar</>
            : <><Plus className="w-3.5 h-3.5" /> Agregar</>
          }
        </button>
      </div>

      {showForm && (
        <form action={handleAdd} className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Nombre <span className="text-red-500">*</span></label>
              <input name="name" required className={inputClass} placeholder="Nombre completo" />
            </div>
            <div>
              <label className={labelClass}>Alias (opcional)</label>
              <input name="nickname" className={inputClass} placeholder="Ej: Almacén Norte" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Calle y número</label>
              <input name="street" className={inputClass} placeholder="Av. Reforma 123, Col. Centro" />
            </div>
            <div>
              <label className={labelClass}>Código postal</label>
              <input name="postal" className={inputClass} placeholder="62000" maxLength={10} />
            </div>
            <div>
              <label className={labelClass}>Ciudad</label>
              <input name="city" className={inputClass} placeholder="Cuernavaca" />
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <input name="state" className={inputClass} placeholder="Morelos" />
            </div>
            <div>
              <label className={labelClass}>Teléfono</label>
              <input name="phone" className={inputClass} placeholder="777 100 0000" />
            </div>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50 transition-colors"
          >
            {isPending
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Plus className="w-3.5 h-3.5" />
            }
            Guardar contacto
          </button>
        </form>
      )}

      {initial.length === 0 && !showForm ? (
        <p className="text-sm text-gray-400">Sin contactos guardados. Agrega remitentes o destinatarios frecuentes para agilizar la creación de guías.</p>
      ) : (
        <div className="divide-y divide-gray-50">
          {initial.map(c => (
            <div key={c.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4 text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {c.name}
                  {c.nickname && (
                    <span className="ml-1.5 text-xs text-gray-400 font-normal">({c.nickname})</span>
                  )}
                </p>
                {(c.street || c.city) && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {[c.street, c.city, c.state, c.postal].filter(Boolean).join(', ')}
                  </p>
                )}
                {c.phone && <p className="text-xs text-gray-400 mt-0.5">{c.phone}</p>}
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                disabled={isPending}
                className="p-1.5 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40"
                title="Eliminar contacto"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
