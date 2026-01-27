'use client'

import { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { validateTrackingForm } from '@/lib/validation'
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  Zap,
  Clock,
} from 'lucide-react'

interface TrackingResult {
  trackingCode: string
  status: string
  guideType: string
  sender: string
  receivedBy: string
  originCity: string
  destCity: string
  content: string
  date: string
  carrier: string
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error' | 'not-found'

const STATUSES = [
  {
    key: 'RECOLECTADO POR MA-IN',
    label: 'Recolectado por MA-IN',
    description: 'Paquete recolectado y en camino a centro de distribución.',
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-600',
    badgeBg: 'bg-blue-100 text-blue-700',
  },
  {
    key: 'EN_TRANSITO',
    label: 'En tránsito',
    description: 'Tu paquete está en ruta hacia la ciudad de destino.',
    icon: Truck,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500',
    badgeBg: 'bg-yellow-100 text-yellow-700',
  },
  {
    key: 'CONFIRMADO',
    label: 'Confirmado',
    description: 'La entrega ha sido confirmada exitosamente.',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-600',
    badgeBg: 'bg-green-100 text-green-700',
  },
]

function getStatusIndex(status: string): number {
  return STATUSES.findIndex((s) => s.key === status)
}

function getStatusInfo(status: string) {
  return STATUSES.find((s) => s.key === status) || STATUSES[0]
}

export function TrackingForm() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [result, setResult] = useState<TrackingResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const validation = validateTrackingForm({ trackingNumber })

    if (!validation.isValid) {
      setError(validation.errors[0].message)
      return
    }

    setStatus('loading')

    try {
      const response = await fetch(
        `/api/track?trackingNumber=${encodeURIComponent(trackingNumber.trim())}`
      )

      if (response.status === 404) {
        setStatus('not-found')
        return
      }

      if (!response.ok) {
        setStatus('error')
        return
      }

      const data = await response.json()

      if (data.found && data.shipment) {
        setResult(data.shipment)
        setStatus('success')
      } else {
        setStatus('not-found')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleReset = () => {
    setTrackingNumber('')
    setResult(null)
    setStatus('idle')
    setError(null)
  }

  const currentStatusIndex = result ? getStatusIndex(result.status) : -1
  const currentStatusInfo = result ? getStatusInfo(result.status) : null

  return (
    <div>
      {/* Search form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Ingresa tu código de rastreo"
              value={trackingNumber}
              onChange={(e) => {
                setTrackingNumber(e.target.value)
                setError(null)
              }}
              error={error || undefined}
              leftIcon={<Search className="w-5 h-5" />}
              disabled={status === 'loading'}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={status === 'loading'}
            className="sm:w-auto w-full"
          >
            Rastrear
          </Button>
        </div>
      </form>

      {/* Error state */}
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>Hubo un error al buscar el envío. Por favor intenta de nuevo.</p>
        </div>
      )}

      {/* Not found state */}
      {status === 'not-found' && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Envío no encontrado
          </h3>
          <p className="text-gray-600 mb-6">
            No encontramos información para el código <strong>{trackingNumber}</strong>.
            Verifica que sea correcto.
          </p>
          <Button variant="outline" onClick={handleReset}>
            Intentar de nuevo
          </Button>
        </div>
      )}

      {/* Results */}
      {status === 'success' && result && currentStatusInfo && (
        <div className="space-y-6">
          {/* Header with tracking code, status badge, and guide type */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Código de rastreo</p>
                <p className="text-xl font-bold text-gray-900">{result.trackingCode}</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Guide type badge */}
                {result.guideType && (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                    result.guideType === 'EXPRESS'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {result.guideType === 'EXPRESS' ? (
                      <Zap className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                    {result.guideType === 'EXPRESS' ? 'Express' : 'Economy'}
                  </div>
                )}
                {/* Status badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${currentStatusInfo.badgeBg}`}>
                  <currentStatusInfo.icon className="w-5 h-5" />
                  <span className="font-medium">{currentStatusInfo.label}</span>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Origen</p>
                <p className="font-medium text-gray-900">{result.originCity || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Destino</p>
                <p className="font-medium text-gray-900">{result.destCity || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Remitente</p>
                <p className="font-medium text-gray-900">{result.sender || '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Recibe</p>
                <p className="font-medium text-gray-900">{result.receivedBy || '—'}</p>
              </div>
            </div>

            {(result.content || result.date) && (
              <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-6">
                {result.content && (
                  <div>
                    <p className="text-sm text-gray-500">Contenido</p>
                    <p className="text-sm text-gray-700">{result.content}</p>
                  </div>
                )}
                {result.date && (
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="text-sm text-gray-700">{result.date}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Vertical Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Seguimiento del envío
            </h3>
            <div className="relative">
              {STATUSES.map((step, index) => {
                const isCompleted = index <= currentStatusIndex
                const isCurrent = index === currentStatusIndex
                const isLast = index === STATUSES.length - 1
                const StepIcon = step.icon

                return (
                  <div key={step.key} className="relative flex gap-4">
                    {/* Vertical line + circle */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? `${step.bgColor} text-white`
                            : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-opacity-30 ring-current' : ''}`}
                      >
                        <StepIcon className="w-5 h-5" />
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 h-full min-h-[3rem] ${
                            index < currentStatusIndex
                              ? 'bg-green-300'
                              : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
                      <p
                        className={`font-semibold ${
                          isCompleted ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`text-sm mt-1 ${
                          isCompleted ? 'text-gray-600' : 'text-gray-300'
                        }`}
                      >
                        {step.description}
                      </p>
                      {isCurrent && (
                        <span className="inline-block mt-2 text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          Estado actual
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleReset}>
              Rastrear otro envío
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
