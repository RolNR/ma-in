import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero } from '@/components/sections'
import { Card, Button } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { TrackingForm } from '@/components/forms'
import { divisionDetails } from '@/data/divisions'
import { companyStats } from '@/data/services'
import { ROUTES, DIVISION_NAV } from '@/lib/constants'
import { MapPin, Bell, Clock, Layers, Building2, Send } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Logistik - Logística y Rastreo',
  description: 'Soluciones de logística integral y rastreo en tiempo real. Transporte terrestre, paquetería express, almacenaje y distribución a nivel nacional.',
}

const featureIcons = {
  'map-pin': MapPin,
  bell: Bell,
  clock: Clock,
  layers: Layers,
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

          <div className="text-center mt-16">
            <Link href={ROUTES.logistik.process}>
              <Button variant="outline">
                Conocer más del proceso
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              💰 Ahorra hasta 15% vs. la competencia
            </div>
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
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="section-padding bg-gradient-to-br from-primary to-primary-600">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-accent" />
                </div>
                <span className="text-accent font-semibold">Para empresas</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Manejas alto volumen de envíos?
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Obtén precios preferenciales y atención personalizada para tu empresa.
                Cuéntanos sobre tu operación y te contactaremos con una propuesta a tu medida.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-white/90">
                  <span className="w-2 h-2 bg-accent rounded-full" />
                  Tarifas especiales por volumen
                </li>
                <li className="flex items-center gap-2 text-white/90">
                  <span className="w-2 h-2 bg-accent rounded-full" />
                  Ejecutivo de cuenta dedicado
                </li>
                <li className="flex items-center gap-2 text-white/90">
                  <span className="w-2 h-2 bg-accent rounded-full" />
                  Facturación consolidada
                </li>
                <li className="flex items-center gap-2 text-white/90">
                  <span className="w-2 h-2 bg-accent rounded-full" />
                  Recolecciones programadas
                </li>
              </ul>
            </div>

            <Card className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Solicita tu cotización empresarial
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la empresa *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    placeholder="Tu empresa S.A. de C.V."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de envíos *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Ej: 100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frecuencia *
                    </label>
                    <select
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    >
                      <option value="">Seleccionar</option>
                      <option value="diario">Diarios</option>
                      <option value="semanal">Semanales</option>
                      <option value="mensual">Mensuales</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de envíos *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  >
                    <option value="">Seleccionar</option>
                    <option value="nacional">Nacional</option>
                    <option value="internacional">Internacional</option>
                    <option value="ambos">Nacional e Internacional</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono de contacto *
                    </label>
                    <input
                      type="tel"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="55 1234 5678"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="contacto@empresa.com"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full" rightIcon={<Send className="w-5 h-5" />}>
                  Solicitar cotización
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Al enviar este formulario aceptas nuestro aviso de privacidad.
                </p>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Tracking Section */}
      <section id="rastrear" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Rastrea tu envío
            </h2>
            <p className="text-gray-600 mb-8">
              Ingresa tu número de guía para conocer el estado actual de tu paquete.
            </p>

            <Card className="p-6 md:p-8 text-left">
              <TrackingForm />
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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

      {/* Stats + CTA */}
      <section className="bg-primary py-16">
        <div className="container-custom">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {companyStats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-white/80 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="border-t border-white/20 pt-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Comienza a enviar hoy</h2>
                <p className="mt-2 text-white/80">
                  Contáctanos y descubre por qué confían en MA-IN Logistik.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href={ROUTES.support.contact}>
                  <Button variant="secondary" size="lg">
                    Contactar
                  </Button>
                </Link>
                <Link href={ROUTES.logistik.trackShipment}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:!text-primary"
                  >
                    Rastrear envío
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
