import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero, CTA } from '@/components/sections'
import { Card, Button } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { GoogleMap } from '@/components/common'
import { ROUTES, LOCATION, COMPANY, SCHEDULE } from '@/lib/constants'
import { MapPin, Clock, Phone, Mail, Car, Bus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ubicación',
  description: `Visítanos en ${LOCATION.fullAddress}. Consulta horarios y cómo llegar.`,
}

export default function LocationPage() {
  return (
    <>
      <Hero
        title="Nuestra Ubicación"
        subtitle="Centro de Soporte"
        description="Visítanos en nuestras oficinas en Cuernavaca, Morelos."
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Soporte', href: ROUTES.support.main },
            { label: 'Ubicación' },
          ]}
        />
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <GoogleMap />
        </div>
      </section>

      {/* How to get there */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Cómo llegar?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">En auto</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Desde la autopista México-Cuernavaca, toma la salida hacia Lomas de Vista Hermosa.
                Continúa por Av. San Diego hasta llegar al número 426.
                Contamos con estacionamiento disponible para clientes.
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Bus className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">En transporte público</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Toma cualquier ruta que pase por Av. San Diego.
                Baja en la parada de Lomas de Vista Hermosa.
                Camina 2 cuadras hacia el norte hasta el número 426.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact summary */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Dirección</h3>
              <p className="text-gray-600 text-sm">
                {LOCATION.address}<br />
                {LOCATION.colony}<br />
                {LOCATION.postalCode} {LOCATION.city}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Horario</h3>
              <p className="text-gray-600 text-sm">
                Lunes a Viernes<br />
                {SCHEDULE.weekdays.morning.open} - {SCHEDULE.weekdays.morning.close}<br />
                {SCHEDULE.weekdays.afternoon.open} - {SCHEDULE.weekdays.afternoon.close}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Phone className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Contacto</h3>
              <p className="text-gray-600 text-sm">
                <a href={`tel:${COMPANY.phone}`} className="hover:text-primary">
                  {COMPANY.phone}
                </a>
                <br />
                <a href={`mailto:${COMPANY.email}`} className="hover:text-primary">
                  {COMPANY.email}
                </a>
              </p>
            </Card>
          </div>
        </div>
      </section>

      <CTA
        title="¿Prefieres que te contactemos?"
        description="Déjanos tus datos y nos comunicamos contigo."
        primaryAction={{
          label: 'Ir a contacto',
          href: ROUTES.support.contact,
        }}
        variant="minimal"
        background="primary"
      />
    </>
  )
}
