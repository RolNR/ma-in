import type { Metadata } from 'next'
import { Hero } from '@/components/sections'
import { Card } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { TrackingForm } from '@/components/forms'
import { ROUTES, COMPANY } from '@/lib/constants'
import { divisionDetails } from '@/data/divisions'
import { Phone, Mail, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Rastrear Envío',
  description: 'Rastrea tu paquete en tiempo real. Ingresa tu número de guía y conoce el estado actual de tu envío.',
}

export default function TrackShipmentPage() {
  const { trackingStatuses } = divisionDetails.track

  return (
    <>
      <Hero
        title="Rastrear Envío"
        subtitle="MA-IN Track"
        description="Ingresa tu número de guía para conocer la ubicación exacta de tu paquete."
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Track', href: ROUTES.track.main },
            { label: 'Rastrear envío' },
          ]}
        />
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main tracking area */}
            <div className="lg:col-span-2">
              <Card className="p-6 md:p-8">
                <TrackingForm />
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status guide */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Guía de estatus
                </h3>
                <ul className="space-y-3">
                  {trackingStatuses.map((status) => (
                    <li key={status.code} className="flex items-center gap-3">
                      <span
                        className={`w-3 h-3 rounded-full bg-${status.color}-500`}
                        style={{
                          backgroundColor:
                            status.color === 'gray'
                              ? '#6b7280'
                              : status.color === 'blue'
                              ? '#3b82f6'
                              : status.color === 'yellow'
                              ? '#eab308'
                              : status.color === 'orange'
                              ? '#f97316'
                              : status.color === 'green'
                              ? '#22c55e'
                              : '#ef4444',
                        }}
                      />
                      <span className="text-sm text-gray-600">
                        {status.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Help */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-900">
                    ¿Necesitas ayuda?
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Si tienes problemas para rastrear tu paquete o necesitas información adicional, contáctanos.
                </p>
                <div className="space-y-3">
                  <a
                    href={`tel:${COMPANY.phone}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {COMPANY.phone}
                  </a>
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    {COMPANY.email}
                  </a>
                </div>
              </Card>

              {/* Tips */}
              <Card className="p-6 bg-primary-50 border border-primary-100">
                <h3 className="font-semibold text-primary-700 mb-3">
                  Consejos
                </h3>
                <ul className="space-y-2 text-sm text-primary-600">
                  <li>• Tu número de guía tiene mínimo 8 caracteres</li>
                  <li>• Comienza con las letras MAIN</li>
                  <li>• Los resultados se actualizan en tiempo real</li>
                  <li>• Puedes rastrear múltiples guías</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
