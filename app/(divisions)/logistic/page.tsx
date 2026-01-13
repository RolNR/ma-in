import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero, Features, Stats, CTA } from '@/components/sections'
import { Card, Button } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { divisionDetails } from '@/data/divisions'
import { logisticServices, companyStats } from '@/data/services'
import { ROUTES, DIVISION_NAV } from '@/lib/constants'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Logistic - Servicios de Logística y Transporte',
  description: 'Soluciones de logística integral: transporte terrestre, paquetería express, almacenaje y distribución a nivel nacional.',
}

export default function LogisticPage() {
  const { hero, services, process } = divisionDetails.logistic

  return (
    <>
      {/* Hero */}
      <Hero
        title={hero.title}
        subtitle="MA-IN Logistic"
        description={hero.subtitle}
        primaryAction={{
          label: 'Solicitar cotización',
          href: ROUTES.logistic.quote,
        }}
        secondaryAction={{
          label: 'Ver cobertura',
          href: ROUTES.logistic.coverage,
        }}
      />

      {/* Breadcrumb */}
      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Logistic' },
          ]}
        />
      </div>

      {/* Quick Nav */}
      <section className="pb-8">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3">
            {DIVISION_NAV.logistic.map((item) => (
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
            <Link href={ROUTES.logistic.services}>
              <Button variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Ver todos los servicios
              </Button>
            </Link>
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
            {process.map((step, index) => (
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
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href={ROUTES.logistic.process}>
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
        description="Solicita una cotización sin compromiso y descubre por qué miles de empresas confían en MA-IN Logistic."
        primaryAction={{
          label: 'Cotizar ahora',
          href: ROUTES.logistic.quote,
        }}
        secondaryAction={{
          label: 'Contactar',
          href: ROUTES.support.contact,
        }}
        variant="default"
        background="primary"
      />
    </>
  )
}
