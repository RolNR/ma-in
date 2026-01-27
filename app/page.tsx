import Link from 'next/link'
import { Hero, DivisionCard, Stats, CTA } from '@/components/sections'
import { Button } from '@/components/ui'
import { divisions } from '@/data/divisions'
import { companyStats, benefits } from '@/data/services'
import { ROUTES } from '@/lib/constants'
import {
  ShieldCheck,
  Cpu,
  Headphones,
  Settings,
  ArrowRight,
  Truck,
  Package,
  MapPin,
} from 'lucide-react'

const benefitIcons = {
  'shield-check': ShieldCheck,
  cpu: Cpu,
  headphones: Headphones,
  settings: Settings,
}

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        title="Soluciones integrales de logística para tu negocio"
        subtitle="MA-IN Logística"
        description="Conectamos tu empresa con todo México. Servicios de transporte, rastreo, empaque y comercio electrónico en una sola plataforma."
        primaryAction={{
          label: 'Conocer servicios',
          href: ROUTES.logistik.services,
        }}
        secondaryAction={{
          label: 'Rastrear paquete',
          href: ROUTES.logistik.trackShipment,
        }}
        size="lg"
      />

      {/* Quick Actions */}
      <section className="relative z-10 -mt-8">
        <div className="container-custom">
          <div className="bg-white rounded-2xl shadow-xl p-6 grid md:grid-cols-3 gap-4">
            <Link
              href={ROUTES.logistik.trackShipment}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  Rastrear envío
                </h3>
                <p className="text-sm text-gray-500">Ingresa tu guía</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href={ROUTES.logistik.services}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  Nuestros servicios
                </h3>
                <p className="text-sm text-gray-500">Ver opciones</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href={ROUTES.pack.catalog}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-accent-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                  Comprar empaques
                </h3>
                <p className="text-sm text-gray-500">Ver catálogo</p>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </section>

      {/* Divisions Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">Nuestras divisiones</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitas en un solo lugar
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tres divisiones especializadas trabajando juntas para ofrecer
              soluciones completas de logística y comercio.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {divisions.map((division) => (
              <DivisionCard
                key={division.id}
                division={division}
                variant="featured"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Stats stats={companyStats} variant="dark" />

      {/* Benefits Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">¿Por qué elegirnos?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              La confianza de miles de clientes
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefitIcons[benefit.icon as keyof typeof benefitIcons] || ShieldCheck

              return (
                <div
                  key={benefit.id}
                  className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTA
        title="¿Listo para optimizar tu logística?"
        description="Contáctanos hoy y descubre cómo podemos ayudar a tu negocio a crecer con nuestras soluciones de transporte, rastreo y empaque."
        primaryAction={{
          label: 'Contactar',
          href: ROUTES.support.contact,
        }}
        secondaryAction={{
          label: 'Ver servicios',
          href: ROUTES.logistik.services,
        }}
        variant="centered"
        background="gradient"
      />
    </>
  )
}
