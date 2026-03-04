'use client'

import { useFormState } from 'react-dom'
import { updateClient } from '@/lib/actions/clients'

interface EditClientFormProps {
  client: {
    id: number
    companyName: string
    contactName: string | null
    rfc: string | null
    phone: string | null
  }
}

const initialState = { status: 'idle' as const }

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

export function EditClientForm({ client }: EditClientFormProps) {
  const [state, formAction] = useFormState(updateClient, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={client.id} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>
            Empresa <span className="text-red-500">*</span>
          </label>
          <input
            name="companyName"
            required
            defaultValue={client.companyName}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Nombre de contacto</label>
          <input
            name="contactName"
            defaultValue={client.contactName ?? ''}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>RFC</label>
          <input
            name="rfc"
            defaultValue={client.rfc ?? ''}
            maxLength={13}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Teléfono</label>
          <input
            name="phone"
            type="tel"
            defaultValue={client.phone ?? ''}
            className={inputClass}
          />
        </div>
      </div>

      {state.status === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.message}</p>
      )}
      {state.status === 'success' && (
        <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">Cambios guardados.</p>
      )}

      <button
        type="submit"
        className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm transition-colors"
      >
        Guardar cambios
      </button>
    </form>
  )
}
