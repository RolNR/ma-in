import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero, CTA } from '@/components/sections'
import { Card, Button } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { logisticServices } from '@/data/services'
import { ROUTES } from '@/lib/constants'
import {
  Truck,
  Zap,
  Layers,
  Home,
  RefreshCw,
  MapPin,
  CheckCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Servicios de Logística',
  description: 'Conoce nuestros servicios de logística: transporte terrestre, paquetería express, carga consolidada, almacenaje y más.',
}

const iconMap = {
  truck: Truck,
  zap: Zap,
  layers: Layers,
  home: Home,
  warehouse: Home,
  'refresh-cw': RefreshCw,
  'map-pin': MapPin,
}

export default function ServicesPage() {
  return (
    <>
      <Hero
        title="Servicios de Logística"
        subtitle="MA-IN Logistik"
        description="Descubre nuestra gama completa de servicios de transporte y distribución diseñados para impulsar tu negocio."
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Logistik', href: ROUTES.logistik.main },
            { label: 'Servicios' },
          ]}
        />
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-8">
            {logisticServices.map((service, index) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap] || Truck

              return (
                <Card
                  key={service.id}
                  className={`p-8 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
                >
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className={index % 2 === 0 ? '' : 'md:order-2'}>
                      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {service.title}
                      </h2>
                      <p className="text-gray-600 mb-6">
                        {service.description}
                      </p>
                      <ul className="space-y-3 mb-6">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Link href={ROUTES.support.contact}>
                        <Button variant="primary">
                          Contactar
                        </Button>
                      </Link>
                    </div>
                    <div className={`bg-gray-100 rounded-xl h-64 flex items-center justify-center ${index % 2 === 0 ? '' : 'md:order-1'}`}>
                      <Icon className="w-24 h-24 text-gray-300" />
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <CTA
        title="¿Necesitas un servicio personalizado?"
        description="Contáctanos y diseñamos una solución a la medida de tu negocio."
        primaryAction={{
          label: 'Contactar',
          href: ROUTES.support.contact,
        }}
        variant="minimal"
        background="primary"
      />
    </>
  )
}
