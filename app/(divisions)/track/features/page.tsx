import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero, CTA } from '@/components/sections'
import { Card, Button } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { divisionDetails } from '@/data/divisions'
import { ROUTES } from '@/lib/constants'
import {
  MapPin,
  Bell,
  Clock,
  Layers,
  Code,
  BarChart,
  CheckCircle,
  Smartphone,
  Mail,
  Shield,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Características de Rastreo',
  description: 'Conoce todas las características de nuestro sistema de rastreo: tiempo real, notificaciones, API y más.',
}

const featureIcons = {
  'map-pin': MapPin,
  bell: Bell,
  clock: Clock,
  layers: Layers,
  code: Code,
  'bar-chart': BarChart,
}

const additionalFeatures = [
  {
    icon: Smartphone,
    title: 'Acceso móvil',
    description: 'Rastrea desde cualquier dispositivo: celular, tablet o computadora.',
  },
  {
    icon: Mail,
    title: 'Notificaciones por email',
    description: 'Recibe actualizaciones automáticas en tu correo electrónico.',
  },
  {
    icon: Shield,
    title: 'Datos seguros',
    description: 'Tu información está protegida con encriptación de nivel bancario.',
  },
]

export default function FeaturesPage() {
  const { features } = divisionDetails.track

  return (
    <>
      <Hero
        title="Características del Sistema de Rastreo"
        subtitle="MA-IN Track"
        description="Tecnología avanzada para que siempre sepas dónde está tu envío."
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Track', href: ROUTES.track.main },
            { label: 'Características' },
          ]}
        />
      </div>

      {/* Main features */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Características principales
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Nuestro sistema de rastreo está diseñado para darte visibilidad completa de tus envíos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => {
              const Icon = featureIcons[feature.icon as keyof typeof featureIcons] || MapPin

              return (
                <Card key={feature.id} className="p-6 md:p-8">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional features */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Más características
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium">Para desarrolladores</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                API de Rastreo
              </h2>
              <p className="text-gray-600 mb-6">
                Integra nuestro sistema de rastreo directamente en tu plataforma con nuestra API RESTful.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Documentación completa</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Webhooks para notificaciones</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Sandbox para pruebas</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-gray-700">Soporte técnico dedicado</span>
                </li>
              </ul>
              <Link href={ROUTES.support.contact}>
                <Button variant="primary">
                  Solicitar acceso a la API
                </Button>
              </Link>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 text-sm">
              <pre className="text-green-400 overflow-x-auto">
                <code>{`// Ejemplo de consulta de rastreo
fetch('https://api.ma-in.mx/v1/tracking/MAIN123456', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(res => res.json())
.then(data => {
  console.log(data.status)     // "IN_TRANSIT"
  console.log(data.location)   // "Querétaro, QRO"
  console.log(data.events)     // [...]
})`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      <CTA
        title="¿Listo para rastrear tu envío?"
        description="Ingresa tu número de guía y conoce el estado actual de tu paquete."
        primaryAction={{
          label: 'Rastrear ahora',
          href: ROUTES.track.trackShipment,
        }}
        variant="centered"
        background="gradient"
      />
    </>
  )
}
