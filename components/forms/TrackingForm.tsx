'use client'

import { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { validateTrackingForm } from '@/lib/validation'
import {
  Search, Package, Truck, CheckCircle2, AlertCircle,
  XCircle, Clock, Navigation, Zap, RefreshCw,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface TrackingEvent {
  status: string
  description: string | null
  location: string | null
  occurredAt: string
}

interface TrackingResult {
  trackingCode: string
  status: string
  guideType: string | null
  sender: string | null
  receivedBy: string | null
  originCity: string | null
  destCity: string | null
  content: string | null
  date: string
  carrier: string
  events: TrackingEvent[]
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error' | 'not-found'

// ─── Status config ────────────────────────────────────────────────────────────

interface FlowStatus {
  key: string
  label: string
  description: string
  Icon: LucideIcon
  activeClasses: string
  badge: string
  connector: string
}

const FLOW: FlowStatus[] = [
  {
    key: 'PENDIENTE',
    label: 'Pendiente',
    description: 'Guía generada, en espera de recolección.',
    Icon: Clock,
    activeClasses: 'bg-gray-500 text-white',
    badge: 'bg-gray-100 text-gray-700',
    connector: 'bg-gray-300',
  },
  {
    key: 'EN_RUTA',
    label: 'En ruta',
    description: 'Tu paquete está en camino al destino.',
    Icon: Truck,
    activeClasses: 'bg-blue-500 text-white',
    badge: 'bg-blue-100 text-blue-700',
    connector: 'bg-blue-300',
  },
  {
    key: 'EN_PROCESO_ENTREGA',
    label: 'En proceso de entrega',
    description: 'El paquete está siendo entregado.',
    Icon: Navigation,
    activeClasses: 'bg-amber-500 text-white',
    badge: 'bg-amber-100 text-amber-700',
    connector: 'bg-amber-300',
  },
  {
    key: 'ENTREGADO',
    label: 'Entregado',
    description: 'Paquete entregado exitosamente.',
    Icon: CheckCircle2,
    activeClasses: 'bg-green-500 text-white',
    badge: 'bg-green-100 text-green-700',
    connector: 'bg-green-300',
  },
]

interface TerminalStatus {
  label: string
  description: string
  Icon: LucideIcon
  badge: string
  alertBg: string
  alertBorder: string
  alertText: string
}

const TERMINAL: Record<string, TerminalStatus> = {
  ERRONEA: {
    label: 'Envío con incidencia',
    description: 'El envío presentó una incidencia. Contáctanos para más información.',
    Icon: AlertCircle,
    badge: 'bg-red-100 text-red-700',
    alertBg: 'bg-red-50',
    alertBorder: 'border-red-200',
    alertText: 'text-red-700',
  },
  CADUCADA: {
    label: 'Guía caducada',
    description: 'Esta guía ha caducado y ya no está vigente.',
    Icon: XCircle,
    badge: 'bg-gray-100 text-gray-600',
    alertBg: 'bg-gray-50',
    alertBorder: 'border-gray-200',
    alertText: 'text-gray-600',
  },
  SIN_UTILIZAR: {
    label: 'Sin utilizar',
    description: 'Esta guía fue generada pero no se ha utilizado.',
    Icon: Package,
    badge: 'bg-gray-100 text-gray-600',
    alertBg: 'bg-gray-50',
    alertBorder: 'border-gray-200',
    alertText: 'text-gray-600',
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function InfoGrid({ result }: { result: TrackingResult }) {
  const items = [
    { label: 'Origen', value: result.originCity },
    { label: 'Destino', value: result.destCity },
    { label: 'Remitente', value: result.sender },
    { label: 'Recibe', value: result.receivedBy },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
      {items.map(({ label, value }) => (
        <div key={label}>
          <p className="text-xs text-gray-500 mb-0.5">{label}</p>
          <p className="text-sm font-medium text-gray-900 truncate">{value || '—'}</p>
        </div>
      ))}
    </div>
  )
}

function Timeline({ currentStatus }: { currentStatus: string }) {
  const currentIdx = FLOW.findIndex(s => s.key === currentStatus)

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-5">Seguimiento del envío</h3>
      {FLOW.map((step, idx) => {
        const isCompleted = idx < currentIdx
        const isCurrent = idx === currentIdx
        const isLast = idx === FLOW.length - 1
        const StepIcon = step.Icon

        return (
          <div key={step.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                isCompleted || isCurrent ? step.activeClasses : 'bg-gray-100 text-gray-400'
              } ${isCurrent ? 'ring-4 ring-offset-1 ring-current ring-opacity-20' : ''}`}>
                <StepIcon className="w-4 h-4" />
              </div>
              {!isLast && (
                <div className={`w-0.5 h-8 mt-0.5 ${isCompleted ? step.connector : 'bg-gray-200'}`} />
              )}
            </div>
            <div className={`pt-1.5 ${isLast ? 'pb-0' : 'pb-2'}`}>
              <p className={`text-sm font-semibold ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.label}
                {isCurrent && (
                  <span className="ml-2 text-xs font-normal bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                    Estado actual
                  </span>
                )}
              </p>
              <p className={`text-xs mt-0.5 ${isCompleted || isCurrent ? 'text-gray-500' : 'text-gray-300'}`}>
                {step.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function EventHistory({ events }: { events: TrackingEvent[] }) {
  if (events.length === 0) return null

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Historial de movimientos</h3>
      <ol className="relative border-l-2 border-gray-200 space-y-5 pl-5">
        {events.map((event, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[25px] top-0.5 w-3 h-3 rounded-full bg-primary-500 border-2 border-white ring-2 ring-primary-100" />
            <p className="text-xs text-gray-400 mb-0.5">
              {new Date(event.occurredAt).toLocaleString('es-MX', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
            <p className="text-sm font-medium text-gray-800">
              {event.status.replace(/_/g, ' ')}
            </p>
            {event.description && (
              <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
            )}
            {event.location && (
              <p className="text-xs text-gray-400 mt-0.5">{event.location}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function TrackingForm() {
  const [trackingNumber, setTrackingNumber] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [status, setStatus] = useState<FormStatus>('idle')
  const [result, setResult] = useState<TrackingResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const validation = validateTrackingForm({ trackingNumber })
    if (!validation.isValid) {
      setFormError(validation.errors[0].message)
      return
    }

    setStatus('loading')

    try {
      const res = await fetch(`/api/track?trackingNumber=${encodeURIComponent(trackingNumber.trim())}`)
      if (res.status === 404) { setStatus('not-found'); return }
      if (!res.ok) { setStatus('error'); return }
      const data = await res.json()
      if (data.found && data.shipment) { setResult(data.shipment); setStatus('success') }
      else setStatus('not-found')
    } catch {
      setStatus('error')
    }
  }

  const handleReset = () => {
    setTrackingNumber('')
    setResult(null)
    setStatus('idle')
    setFormError(null)
  }

  const flowStatus = result ? FLOW.find(s => s.key === result.status) : null
  const terminalStatus = result ? TERMINAL[result.status] : null
  const isExpress = result?.guideType?.toLowerCase().includes('express')

  return (
    <div>
      {/* Search form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Ingresa tu código de rastreo"
              value={trackingNumber}
              onChange={(e) => { setTrackingNumber(e.target.value); setFormError(null) }}
              error={formError || undefined}
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
        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Hubo un error al buscar el envío. Por favor intenta de nuevo.</p>
        </div>
      )}

      {/* Not found state */}
      {status === 'not-found' && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <Package className="w-14 h-14 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Envío no encontrado</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto">
            No encontramos información para{' '}
            <strong className="text-gray-700">{trackingNumber}</strong>.
            Verifica que el código sea correcto.
          </p>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="w-4 h-4 mr-1.5" /> Intentar de nuevo
          </Button>
        </div>
      )}

      {/* Results */}
      {status === 'success' && result && (
        <div className="space-y-4">
          {/* Header card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Código de rastreo</p>
                <p className="text-lg font-bold text-gray-900 font-mono">{result.trackingCode}</p>
                <p className="text-xs text-gray-400 mt-0.5">{result.carrier}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {result.guideType && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                    isExpress ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isExpress && <Zap className="w-3 h-3" />}
                    {result.guideType}
                  </span>
                )}
                {flowStatus && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${flowStatus.badge}`}>
                    <flowStatus.Icon className="w-3 h-3" />
                    {flowStatus.label}
                  </span>
                )}
                {terminalStatus && (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${terminalStatus.badge}`}>
                    <terminalStatus.Icon className="w-3 h-3" />
                    {terminalStatus.label}
                  </span>
                )}
              </div>
            </div>

            <InfoGrid result={result} />

            {(result.content || result.date) && (
              <div className="flex flex-wrap gap-6 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                {result.content && (
                  <span>Contenido: <span className="text-gray-700">{result.content}</span></span>
                )}
                {result.date && (
                  <span>Fecha: <span className="text-gray-700">{formatDate(result.date)}</span></span>
                )}
              </div>
            )}
          </div>

          {/* Timeline or terminal state */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-6">
            {flowStatus ? (
              <Timeline currentStatus={result.status} />
            ) : terminalStatus ? (
              <div className={`flex items-start gap-3 p-4 rounded-xl border ${terminalStatus.alertBg} ${terminalStatus.alertBorder}`}>
                <terminalStatus.Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${terminalStatus.alertText}`} />
                <div>
                  <p className={`text-sm font-semibold ${terminalStatus.alertText}`}>{terminalStatus.label}</p>
                  <p className={`text-xs mt-1 ${terminalStatus.alertText} opacity-80`}>{terminalStatus.description}</p>
                </div>
              </div>
            ) : null}

            {result.events.length > 0 && (
              <div className="border-t border-gray-100 pt-5">
                <EventHistory events={result.events} />
              </div>
            )}
          </div>

          {/* Reset */}
          <div className="flex justify-center pt-1">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Rastrear otro envío
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
