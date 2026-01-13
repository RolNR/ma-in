'use client'

import { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { validateTrackingForm } from '@/lib/validation'
import {
  Search,
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'

interface TrackingEvent {
  date: string
  time: string
  status: string
  location: string
  description: string
}

interface TrackingResult {
  trackingNumber: string
  status: string
  statusLabel: string
  origin: string
  destination: string
  estimatedDelivery: string
  events: TrackingEvent[]
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error' | 'not-found'

// Mock tracking data for demonstration
const mockTrackingData: TrackingResult = {
  trackingNumber: 'MAIN123456',
  status: 'IN_TRANSIT',
  statusLabel: 'En tránsito',
  origin: 'Ciudad de México, CDMX',
  destination: 'Guadalajara, Jalisco',
  estimatedDelivery: '15 de enero, 2026',
  events: [
    {
      date: '12 Ene 2026',
      time: '14:30',
      status: 'IN_TRANSIT',
      location: 'Querétaro, Querétaro',
      description: 'Paquete en tránsito hacia destino',
    },
    {
      date: '12 Ene 2026',
      time: '08:15',
      status: 'DEPARTED',
      location: 'Ciudad de México, CDMX',
      description: 'Paquete salió del centro de distribución',
    },
    {
      date: '11 Ene 2026',
      time: '16:45',
      status: 'ARRIVED',
      location: 'Ciudad de México, CDMX',
      description: 'Paquete llegó al centro de distribución',
    },
    {
      date: '11 Ene 2026',
      time: '10:00',
      status: 'PICKED_UP',
      location: 'Ciudad de México, CDMX',
      description: 'Paquete recolectado',
    },
    {
      date: '10 Ene 2026',
      time: '18:30',
      status: 'CREATED',
      location: 'En línea',
      description: 'Guía generada',
    },
  ],
}

const statusIcons: Record<string, typeof Package> = {
  CREATED: Package,
  PICKED_UP: Truck,
  ARRIVED: MapPin,
  DEPARTED: Truck,
  IN_TRANSIT: Truck,
  OUT_FOR_DELIVERY: Truck,
  DELIVERED: CheckCircle,
}

const statusColors: Record<string, string> = {
  CREATED: 'bg-gray-100 text-gray-600',
  PICKED_UP: 'bg-blue-100 text-blue-600',
  ARRIVED: 'bg-blue-100 text-blue-600',
  DEPARTED: 'bg-blue-100 text-blue-600',
  IN_TRANSIT: 'bg-yellow-100 text-yellow-600',
  OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-600',
  DELIVERED: 'bg-green-100 text-green-600',
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo: only return results for specific tracking numbers
      if (trackingNumber.toUpperCase().startsWith('MAIN')) {
        setResult({
          ...mockTrackingData,
          trackingNumber: trackingNumber.toUpperCase(),
        })
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

  return (
    <div>
      {/* Search form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Ingresa tu número de guía"
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
        <p className="mt-2 text-sm text-gray-500">
          Ejemplo: MAIN123456
        </p>
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
            No encontramos información para el número de guía <strong>{trackingNumber}</strong>.
            Verifica que el número sea correcto.
          </p>
          <Button variant="outline" onClick={handleReset}>
            Intentar de nuevo
          </Button>
        </div>
      )}

      {/* Results */}
      {status === 'success' && result && (
        <div className="space-y-6">
          {/* Summary card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Número de guía</p>
                <p className="text-xl font-bold text-gray-900">{result.trackingNumber}</p>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusColors[result.status]}`}>
                <Truck className="w-5 h-5" />
                <span className="font-medium">{result.statusLabel}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Origen</p>
                <p className="font-medium text-gray-900">{result.origin}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Destino</p>
                <p className="font-medium text-gray-900">{result.destination}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Entrega estimada</p>
                <p className="font-medium text-primary">{result.estimatedDelivery}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Historial de movimientos
            </h3>

            <div className="space-y-0">
              {result.events.map((event, index) => {
                const Icon = statusIcons[event.status] || Package
                const isFirst = index === 0

                return (
                  <div key={index} className="flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isFirst ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {index < result.events.length - 1 && (
                        <div className="w-0.5 h-full min-h-[40px] bg-gray-200 my-2" />
                      )}
                    </div>

                    {/* Event content */}
                    <div className={`pb-6 ${isFirst ? '' : 'opacity-70'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-500">{event.date}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{event.time}</span>
                      </div>
                      <p className={`font-medium ${isFirst ? 'text-gray-900' : 'text-gray-700'}`}>
                        {event.description}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </p>
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
