import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero, Features, CTA } from '@/components/sections'
import { Card, Button } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { TrackingForm } from '@/components/forms'
import { divisionDetails } from '@/data/divisions'
import { ROUTES, DIVISION_NAV } from '@/lib/constants'
import { ArrowRight, MapPin, Bell, Clock, Code, BarChart, Layers } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Track - Rastreo de Envíos',
  description: 'Rastrea tus envíos en tiempo real. Conoce la ubicación exacta de tus paquetes y recibe notificaciones automáticas.',
}

const featureIcons = {
  'map-pin': MapPin,
  bell: Bell,
  clock: Clock,
  layers: Layers,
  code: Code,
  'bar-chart': BarChart,
}

export default function TrackPage() {
  const { hero, features } = divisionDetails.track

  return (
    <>
      <Hero
        title={hero.title}
        subtitle="MA-IN Track"
        description={hero.subtitle}
        primaryAction={{
          label: 'Rastrear ahora',
          href: '#rastrear',
        }}
        secondaryAction={{
          label: 'Generar guía',
          href: ROUTES.track.createGuide,
        }}
      />

      <div className="container-custom py-4">
        <Breadcrumb items={[{ label: 'Track' }]} />
      </div>

      {/* Quick Nav */}
      <section className="pb-8">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3">
            {DIVISION_NAV.track.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="outline" size="sm">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Tracking Section */}
      <section id="rastrear" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Rastrea tu envío
              </h2>
              <p className="text-gray-600">
                Ingresa tu número de guía para conocer el estado actual de tu paquete.
              </p>
            </div>

            <Card className="p-6 md:p-8">
              <TrackingForm />
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">Características</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tecnología de rastreo avanzada
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestra plataforma de rastreo te mantiene informado en todo momento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = featureIcons[feature.icon as keyof typeof featureIcons] || MapPin

              return (
                <Card key={feature.id} hover className="p-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <Link href={ROUTES.track.features}>
              <Button variant="outline" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Ver todas las características
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CTA
        title="¿Necesitas generar una guía?"
        description="Crea tu guía de envío en minutos y comienza a rastrear tu paquete."
        primaryAction={{
          label: 'Generar guía',
          href: ROUTES.track.createGuide,
        }}
        variant="minimal"
        background="primary"
      />
    </>
  )
}
