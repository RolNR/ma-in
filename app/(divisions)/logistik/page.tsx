import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero, Stats, CTA } from '@/components/sections'
import { Card, Button } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { TrackingForm } from '@/components/forms'
import { divisionDetails } from '@/data/divisions'
import { companyStats } from '@/data/services'
import { ROUTES, DIVISION_NAV } from '@/lib/constants'
import { ArrowRight, MapPin, Bell, Clock, Layers, Code, BarChart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Logistik - Logística y Rastreo',
  description: 'Soluciones de logística integral y rastreo en tiempo real. Transporte terrestre, paquetería express, almacenaje y distribución a nivel nacional.',
}

const featureIcons = {
  'map-pin': MapPin,
  bell: Bell,
  clock: Clock,
  layers: Layers,
  code: Code,
  'bar-chart': BarChart,
}

export default function LogistikPage() {
  const { hero, services, process, trackingFeatures } = divisionDetails.logistik

  return (
    <>
      {/* Hero */}
      <Hero
        title={hero.title}
        subtitle="MA-IN Logistik"
        description={hero.subtitle}
        primaryAction={{
          label: 'Rastrear envío',
          href: '#rastrear',
        }}
        secondaryAction={{
          label: 'Ver cobertura',
          href: ROUTES.logistik.coverage,
        }}
      />

      {/* Breadcrumb */}
      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Logistik' },
          ]}
        />
      </div>

      {/* Quick Nav */}
      <section className="pb-8">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3">
            {DIVISION_NAV.logistik.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="outline" size="sm">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">Nuestros servicios</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Soluciones de logística para cada necesidad
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Desde paquetería express hasta distribución masiva, tenemos el servicio perfecto para tu negocio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => (
              <Card key={service.id} hover className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-primary rounded" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href={ROUTES.logistik.services}>
              <Button variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Ver todos los servicios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tracking Section */}
      <section id="rastrear" className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-primary font-medium mb-2">Rastreo de envíos</p>
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

      {/* Tracking Features */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">Tecnología</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Rastreo avanzado
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestra plataforma de rastreo te mantiene informado en todo momento.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trackingFeatures.map((feature) => {
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
        </div>
      </section>

      {/* Process */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">¿Cómo funciona?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Proceso simple y eficiente
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {process.map((step) => (
              <div key={step.step} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href={ROUTES.logistik.process}>
              <Button variant="outline">
                Conocer más del proceso
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <Stats stats={companyStats} variant="dark" />

      {/* CTA */}
      <CTA
        title="Comienza a enviar hoy"
        description="Contáctanos y descubre por qué miles de empresas confían en MA-IN Logistik."
        primaryAction={{
          label: 'Contactar',
          href: ROUTES.support.contact,
        }}
        secondaryAction={{
          label: 'Rastrear envío',
          href: ROUTES.logistik.trackShipment,
        }}
        variant="default"
        background="primary"
      />
    </>
  )
}
