'use client'

import { useState } from 'react'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { validateContactForm, type ContactFormData } from '@/lib/validation'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface ContactFormProps {
  onSuccess?: () => void
}

const subjectOptions = [
  { value: 'general', label: 'Consulta general' },
  { value: 'cotizacion', label: 'Cotización de servicios' },
  { value: 'soporte', label: 'Soporte técnico' },
  { value: 'facturacion', label: 'Facturación' },
  { value: 'otro', label: 'Otro' },
]

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<FormStatus>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const validation = validateContactForm(formData)

    if (!validation.isValid) {
      const errorMap: Record<string, string> = {}
      validation.errors.forEach((error) => {
        errorMap[error.field.toLowerCase()] = error.message
      })
      setErrors(errorMap)
      return
    }

    setStatus('loading')

    try {
      // Simulate API call - Replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In production, this would be:
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // })
      // if (!response.ok) throw new Error('Error al enviar')

      setStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
      onSuccess?.()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12 px-6 bg-green-50 rounded-xl">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Mensaje enviado!
        </h3>
        <p className="text-gray-600 mb-6">
          Gracias por contactarnos. Te responderemos a la brevedad posible.
        </p>
        <Button variant="primary" onClick={() => setStatus('idle')}>
          Enviar otro mensaje
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>Hubo un error al enviar el mensaje. Por favor intenta de nuevo.</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="Nombre completo *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tu nombre"
          error={errors.nombre}
          disabled={status === 'loading'}
        />

        <Input
          label="Correo electrónico *"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          error={errors.email}
          disabled={status === 'loading'}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="Teléfono (opcional)"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(000) 000-0000"
          error={errors.phone}
          disabled={status === 'loading'}
        />

        <Select
          label="Asunto *"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          options={subjectOptions}
          placeholder="Selecciona un asunto"
          error={errors.asunto}
          disabled={status === 'loading'}
        />
      </div>

      <Textarea
        label="Mensaje *"
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Escribe tu mensaje aquí... (mínimo 10 caracteres)"
        error={errors.mensaje}
        disabled={status === 'loading'}
        rows={5}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          * Campos requeridos
        </p>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={status === 'loading'}
        >
          Enviar mensaje
        </Button>
      </div>
    </form>
  )
}
