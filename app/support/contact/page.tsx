import type { Metadata } from 'next'
import { Hero } from '@/components/sections'
import { Card } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { ContactForm } from '@/components/forms'
import { ROUTES, COMPANY, LOCATION, SCHEDULE } from '@/lib/constants'
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Contáctanos para cualquier consulta sobre envíos, cotizaciones o soporte.',
}

export default function ContactPage() {
  return (
    <>
      <Hero
        title="Contáctanos"
        subtitle="Centro de Soporte"
        description="Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos pronto."
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Soporte', href: ROUTES.support.main },
            { label: 'Contacto' },
          ]}
        />
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Envíanos un mensaje
                  </h2>
                </div>
                <ContactForm />
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Phone */}
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Teléfono</h3>
                    <a
                      href={`tel:${COMPANY.phone}`}
                      className="text-primary hover:underline"
                    >
                      {COMPANY.phone}
                    </a>
                  </div>
                </div>
              </Card>

              {/* Email */}
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <a
                      href={`mailto:${COMPANY.email}`}
                      className="text-primary hover:underline"
                    >
                      {COMPANY.email}
                    </a>
                  </div>
                </div>
              </Card>

              {/* Address */}
              <Card className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Dirección</h3>
                    <p className="text-gray-600 text-sm">
                      {LOCATION.address}<br />
                      {LOCATION.colony}<br />
                      {LOCATION.postalCode} {LOCATION.city}, {LOCATION.state}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Schedule */}
              <Card className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Horario</h3>
                    <p className="text-gray-600 text-sm">
                      <span className="font-medium">Lunes a Viernes</span><br />
                      {SCHEDULE.weekdays.morning.open} - {SCHEDULE.weekdays.morning.close}<br />
                      {SCHEDULE.weekdays.afternoon.open} - {SCHEDULE.weekdays.afternoon.close}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Response time */}
              <Card className="p-6 bg-primary text-white">
                <h3 className="font-semibold mb-2">
                  Tiempo de respuesta
                </h3>
                <p className="text-white/80 text-sm">
                  Respondemos todos los mensajes en menos de 24 horas hábiles.
                  Para consultas urgentes, llámanos directamente.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
