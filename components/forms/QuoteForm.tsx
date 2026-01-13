'use client'

import { useState } from 'react'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { validateQuoteForm, type QuoteFormData } from '@/lib/validation'
import { packageTypes } from '@/data/services'
import { CheckCircle, AlertCircle, Package } from 'lucide-react'

interface QuoteFormProps {
  onSuccess?: () => void
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export function QuoteForm({ onSuccess }: QuoteFormProps) {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    originCity: '',
    originPostalCode: '',
    destinationCity: '',
    destinationPostalCode: '',
    packageType: '',
    weight: '',
    dimensions: '',
    description: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<FormStatus>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

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

    const validation = validateQuoteForm(formData)

    if (!validation.isValid) {
      const errorMap: Record<string, string> = {}
      validation.errors.forEach((error) => {
        errorMap[error.field.toLowerCase().replace(/\s+/g, '')] = error.message
      })
      setErrors(errorMap)
      return
    }

    setStatus('loading')

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStatus('success')
      onSuccess?.()
    } catch {
      setStatus('error')
    }
  }

  const packageOptions = packageTypes.map((pkg) => ({
    value: pkg.id,
    label: `${pkg.label} (hasta ${pkg.maxWeight} kg)`,
  }))

  if (status === 'success') {
    return (
      <div className="text-center py-12 px-6 bg-green-50 rounded-xl">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          ¡Solicitud recibida!
        </h3>
        <p className="text-gray-600 mb-6">
          Hemos recibido tu solicitud de cotización. Te contactaremos en las próximas 24 horas con tu presupuesto.
        </p>
        <Button variant="primary" onClick={() => setStatus('idle')}>
          Solicitar otra cotización
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>Hubo un error al enviar la solicitud. Por favor intenta de nuevo.</p>
        </div>
      )}

      {/* Contact info section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">1</span>
          Datos de contacto
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
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
            label="Empresa (opcional)"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Nombre de tu empresa"
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
          <Input
            label="Teléfono *"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(000) 000-0000"
            error={errors.teléfono}
            disabled={status === 'loading'}
          />
        </div>
      </div>

      {/* Origin section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">2</span>
          Origen del envío
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Ciudad de origen *"
            name="originCity"
            value={formData.originCity}
            onChange={handleChange}
            placeholder="Ej: Ciudad de México"
            error={errors.ciudaddeorigen}
            disabled={status === 'loading'}
          />
          <Input
            label="Código postal origen *"
            name="originPostalCode"
            value={formData.originPostalCode}
            onChange={handleChange}
            placeholder="Ej: 06600"
            error={errors.cporigen}
            disabled={status === 'loading'}
          />
        </div>
      </div>

      {/* Destination section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">3</span>
          Destino del envío
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Ciudad de destino *"
            name="destinationCity"
            value={formData.destinationCity}
            onChange={handleChange}
            placeholder="Ej: Guadalajara"
            error={errors.ciudaddedestino}
            disabled={status === 'loading'}
          />
          <Input
            label="Código postal destino *"
            name="destinationPostalCode"
            value={formData.destinationPostalCode}
            onChange={handleChange}
            placeholder="Ej: 44100"
            error={errors.cpdestino}
            disabled={status === 'loading'}
          />
        </div>
      </div>

      {/* Package section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm">4</span>
          Información del paquete
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Tipo de paquete *"
            name="packageType"
            value={formData.packageType}
            onChange={handleChange}
            options={packageOptions}
            placeholder="Selecciona el tipo"
            error={errors.tipodepaquete}
            disabled={status === 'loading'}
          />
          <Input
            label="Peso aproximado (kg) *"
            name="weight"
            type="number"
            min="0.1"
            step="0.1"
            value={formData.weight}
            onChange={handleChange}
            placeholder="Ej: 5"
            error={errors.peso}
            disabled={status === 'loading'}
          />
          <Input
            label="Dimensiones (opcional)"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            placeholder="Largo x Ancho x Alto (cm)"
            helperText="Ej: 30x20x15"
            disabled={status === 'loading'}
          />
        </div>
        <div className="mt-4">
          <Textarea
            label="Descripción del contenido (opcional)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe brevemente qué contiene el paquete"
            disabled={status === 'loading'}
            rows={3}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">* Campos requeridos</p>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={status === 'loading'}
          leftIcon={<Package className="w-5 h-5" />}
        >
          Solicitar cotización
        </Button>
      </div>
    </form>
  )
}
