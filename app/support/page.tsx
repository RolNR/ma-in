import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero } from '@/components/sections'
import { Card, Button } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { ROUTES, COMPANY, SUPPORT_NAV } from '@/lib/constants'
import {
  HelpCircle,
  MapPin,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  ArrowRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Soporte',
  description: 'Centro de ayuda MA-IN. Encuentra respuestas, ubicación y formas de contacto.',
}

const supportSections = [
  {
    title: 'Preguntas frecuentes',
    description: 'Encuentra respuestas a las dudas más comunes sobre envíos, rastreo, empaques y más.',
    icon: HelpCircle,
    href: ROUTES.support.faq,
    cta: 'Ver FAQ',
  },
  {
    title: 'Ubicación',
    description: 'Visítanos en nuestras oficinas. Consulta dirección, horarios y cómo llegar.',
    icon: MapPin,
    href: ROUTES.support.location,
    cta: 'Ver ubicación',
  },
  {
    title: 'Contacto',
    description: 'Envíanos un mensaje y te responderemos a la brevedad posible.',
    icon: MessageSquare,
    href: ROUTES.support.contact,
    cta: 'Contactar',
  },
]

export default function SupportPage() {
  return (
    <>
      <Hero
        title="Centro de Soporte"
        subtitle="MA-IN Soporte"
        description="Estamos aquí para ayudarte. Encuentra respuestas, ubicación y formas de contacto."
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb items={[{ label: 'Soporte' }]} />
      </div>

      {/* Main sections */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-6">
            {supportSections.map((section) => (
              <Link key={section.href} href={section.href}>
                <Card hover className="p-6 h-full group">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4">
                    <section.icon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {section.description}
                  </p>
                  <span className="inline-flex items-center text-primary font-medium">
                    {section.cta}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick contact */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Contacto rápido
            </h2>
            <p className="text-gray-600">
              ¿Prefieres contactarnos directamente?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Teléfono</h3>
              <a
                href={`tel:${COMPANY.phone}`}
                className="text-primary hover:underline"
              >
                {COMPANY.phone}
              </a>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <a
                href={`mailto:${COMPANY.email}`}
                className="text-primary hover:underline"
              >
                {COMPANY.email}
              </a>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Horario</h3>
              <p className="text-gray-600 text-sm">
                Lun-Vie: 8:00-14:00<br />
                y 16:00-19:00
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Accesos rápidos
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href={ROUTES.track.trackShipment}>
              <Button variant="outline">
                Rastrear envío
              </Button>
            </Link>
            <Link href={ROUTES.logistic.quote}>
              <Button variant="outline">
                Cotizar envío
              </Button>
            </Link>
            <Link href={ROUTES.pack.catalog}>
              <Button variant="outline">
                Ver catálogo
              </Button>
            </Link>
            <Link href={ROUTES.support.faq}>
              <Button variant="outline">
                Preguntas frecuentes
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
