'use client'

import { useState } from 'react'
import { Button } from '@/components/ui'
import { Send, CheckCircle } from 'lucide-react'

const fieldClass =
  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-sm'

export function TravelContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 800)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">¡Mensaje enviado!</h3>
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
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo *
          </label>
          <input required type="text" className={fieldClass} placeholder="Tu nombre" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono *
          </label>
          <input required type="tel" className={fieldClass} placeholder="55 1234 5678" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo electrónico *
        </label>
        <input required type="email" className={fieldClass} placeholder="tu@correo.com" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de ruta *
          </label>
          <select required className={fieldClass}>
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
            type="number"
            min="1"
            className={fieldClass}
            placeholder="Ej: 8"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Destino de interés
        </label>
        <select className={fieldClass}>
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
        <input type="date" className={fieldClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Comentarios o preguntas
        </label>
        <textarea
          rows={3}
          className={fieldClass}
          placeholder="Cuéntanos más sobre lo que necesitas..."
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={loading}
        rightIcon={<Send className="w-4 h-4" />}
      >
        {loading ? 'Enviando…' : 'Solicitar información y costos'}
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
