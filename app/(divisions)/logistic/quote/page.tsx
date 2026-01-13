import type { Metadata } from 'next'
import { Hero } from '@/components/sections'
import { Card } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { QuoteForm } from '@/components/forms'
import { ROUTES, COMPANY } from '@/lib/constants'
import { Phone, Mail, Clock, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cotizar Envío',
  description: 'Solicita una cotización gratuita para tu envío. Respuesta en menos de 24 horas.',
}

export default function QuotePage() {
  return (
    <>
      <Hero
        title="Cotiza tu envío"
        subtitle="MA-IN Logistic"
        description="Completa el formulario y recibe tu cotización en menos de 24 horas."
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Logistic', href: ROUTES.logistic.main },
            { label: 'Cotización' },
          ]}
        />
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Solicitar cotización
                </h2>
                <QuoteForm />
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Why choose us */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  ¿Por qué cotizar con nosotros?
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      Precios competitivos y transparentes
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      Cobertura en todo México
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      Rastreo en tiempo real incluido
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      Seguro de carga incluido
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">
                      Sin costos ocultos
                    </span>
                  </li>
                </ul>
              </Card>

              {/* Contact info */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  ¿Prefieres contactarnos directamente?
                </h3>
                <div className="space-y-4">
                  <a
                    href={`tel:${COMPANY.phone}`}
                    className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium">{COMPANY.phone}</p>
                    </div>
                  </a>

                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="flex items-center gap-3 text-gray-600 hover:text-primary transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{COMPANY.email}</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Horario de atención</p>
                      <p className="font-medium text-sm">Lun-Vie: 8:00-14:00 y 16:00-19:00</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Response time */}
              <Card className="p-6 bg-primary text-white">
                <Clock className="w-8 h-8 mb-3" />
                <h3 className="font-semibold mb-2">
                  Respuesta rápida
                </h3>
                <p className="text-white/80 text-sm">
                  Nos comprometemos a responder tu solicitud en menos de 24 horas hábiles.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
