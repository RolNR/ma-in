import type { Metadata } from 'next'
import { Hero } from '@/components/sections'
import { Card } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { TrackingForm } from '@/components/forms'
import { ROUTES, COMPANY } from '@/lib/constants'
import { Phone, Mail, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Rastrear Envío',
  description: 'Rastrea tu paquete en tiempo real. Ingresa tu código de rastreo y conoce el estado actual de tu envío.',
}

export default function TrackShipmentPage() {
  return (
    <>
      <Hero
        title="Rastrear Envío"
        subtitle="MA-IN Logistik"
        description="Ingresa tu código de rastreo para conocer el estado de tu paquete."
        size="lg"
      />

      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Logistik', href: ROUTES.logistik.main },
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
                  <li>• Tu código de rastreo lo encuentras en tu comprobante de envío</li>
                  <li>• El estado se actualiza conforme avanza tu paquete</li>
                  <li>• Hay dos tipos de guía: Express y Economy</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
