import type { Metadata } from 'next'
import { Hero, CTA } from '@/components/sections'
import { Card } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { divisionDetails } from '@/data/divisions'
import { mainCities } from '@/data/services'
import { ROUTES } from '@/lib/constants'
import { MapPin, Truck, Clock, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cobertura Nacional',
  description: 'Cobertura en los 32 estados de México. Conoce nuestras rutas principales y tiempos de entrega.',
}

export default function CoveragePage() {
  const { coverage } = divisionDetails.logistik

  return (
    <>
      <Hero
        title="Cobertura Nacional"
        subtitle="MA-IN Logistik"
        description="Llegamos a todo México con la red de distribución más extensa del país."
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Logistik', href: ROUTES.logistik.main },
            { label: 'Cobertura' },
          ]}
        />
      </div>

      {/* Stats */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {coverage.states}
              </div>
              <p className="text-gray-600">Estados con cobertura</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Truck className="w-7 h-7 text-primary" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {coverage.cities}+
              </div>
              <p className="text-gray-600">Ciudades</p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                {coverage.deliveryPoints.toLocaleString()}+
              </div>
              <p className="text-gray-600">Puntos de entrega</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Cities */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Principales destinos
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tiempos de entrega estimados para las ciudades más importantes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mainCities.map((city) => (
              <Card key={city.name} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-gray-900">{city.name}</p>
                    <p className="text-sm text-gray-500">{city.state}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-primary-100 text-primary text-sm font-medium rounded-full">
                  {city.deliveryTime}
                </span>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Routes */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Rutas principales
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestras rutas más frecuentes con salidas diarias.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="p-6">
              <ul className="space-y-4">
                {coverage.mainRoutes.map((route, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-gray-700">{route}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      <CTA
        title="¿Tu destino no aparece en la lista?"
        description="Contáctanos para verificar la cobertura en tu zona."
        primaryAction={{
          label: 'Verificar cobertura',
          href: ROUTES.support.contact,
        }}
        variant="minimal"
        background="primary"
      />
    </>
  )
}
