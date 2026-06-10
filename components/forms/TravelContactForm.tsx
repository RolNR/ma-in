'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui'
import { submitTravelForm } from '@/lib/actions/travel'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

const fieldClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm'

export function TravelContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await submitTravelForm(formData)
      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error ?? 'Error al enviar la solicitud.')
      }
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">¡Solicitud enviada!</h3>
        <p className="text-gray-600 max-w-sm">
          Recibimos tu solicitud. Un asesor de MA-IN Travel se pondrá en contacto
          contigo en menos de 24 horas.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          Enviar otra consulta
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo *
          </label>
          <input
            required
            name="name"
            type="text"
            className={fieldClass}
            placeholder="Tu nombre"
            disabled={isPending}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input
            required
            name="phone"
            type="tel"
            className={fieldClass}
            placeholder="55 1234 5678"
            disabled={isPending}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico *
        </label>
        <input
          required
          name="email"
          type="email"
          className={fieldClass}
          placeholder="tu@correo.com"
          disabled={isPending}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de ruta *
          </label>
          <select required name="routeType" className={fieldClass} disabled={isPending}>
            <option value="">Seleccionar</option>
            <option value="corporativo">Ruta Corporativa</option>
            <option value="familiar">Ruta Familiar</option>
            <option value="aifa">Cuernavaca ↔ AIFA</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            No. de personas *
          </label>
          <input
            required
            name="passengers"
            type="number"
            min="1"
            className={fieldClass}
            placeholder="Ej: 8"
            disabled={isPending}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Destino de interés
        </label>
        <select name="destination" className={fieldClass} disabled={isPending}>
          <option value="">Cualquier destino / aún no lo sé</option>
          <option value="san-miguel">San Miguel de Allende</option>
          <option value="guanajuato">Guanajuato</option>
          <option value="puebla">Puebla</option>
          <option value="veracruz">Veracruz</option>
          <option value="oaxaca">Oaxaca</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha tentativa
        </label>
        <input
          name="date"
          type="date"
          className={fieldClass}
          disabled={isPending}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comentarios o preguntas
        </label>
        <textarea
          name="comments"
          rows={3}
          className={fieldClass}
          placeholder="Cuéntanos más sobre lo que necesitas..."
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isPending}
        rightIcon={<Send className="w-4 h-4" />}
      >
        {isPending ? 'Enviando…' : 'Solicitar información y costos'}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Al enviar aceptas nuestro{' '}
        <a href="/privacy" className="underline hover:text-primary">
          aviso de privacidad
        </a>
        .
      </p>
    </form>
  )
}
