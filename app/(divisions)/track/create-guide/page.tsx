import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero, CTA } from '@/components/sections'
import { Card, Button } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { ROUTES } from '@/lib/constants'
import {
  FileText,
  Package,
  CreditCard,
  Printer,
  CheckCircle,
  ArrowRight,
  Clock,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Generar Guía',
  description: 'Genera tu guía de envío en minutos. Proceso simple y rápido para comenzar a enviar.',
}

const steps = [
  {
    icon: FileText,
    title: 'Ingresa los datos',
    description: 'Completa la información del remitente, destinatario y paquete.',
  },
  {
    icon: Package,
    title: 'Selecciona el servicio',
    description: 'Elige el tipo de envío que mejor se adapte a tus necesidades.',
  },
  {
    icon: CreditCard,
    title: 'Realiza el pago',
    description: 'Paga de forma segura con tarjeta, transferencia o en efectivo.',
  },
  {
    icon: Printer,
    title: 'Imprime tu guía',
    description: 'Descarga e imprime tu guía lista para pegar en tu paquete.',
  },
]

export default function CreateGuidePage() {
  return (
    <>
      <Hero
        title="Genera tu guía de envío"
        subtitle="MA-IN Track"
        description="Crea tu guía en minutos y comienza a enviar. Proceso 100% en línea."
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Track', href: ROUTES.track.main },
            { label: 'Generar guía' },
          ]}
        />
      </div>

      {/* Process steps */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Generar tu guía es rápido y sencillo. Sigue estos 4 pasos.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <Card key={index} className="p-6 text-center relative">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <span className="absolute top-4 right-4 w-8 h-8 bg-primary-100 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {step.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coming soon notice */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <Clock className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Próximamente
            </h2>
            <p className="text-gray-600 mb-6">
              Estamos trabajando para habilitarte la generación de guías en línea.
              Mientras tanto, puedes cotizar tu envío y contactarnos para generar tu guía.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.logistic.quote}>
                <Button variant="primary">
                  Cotizar envío
                </Button>
              </Link>
              <Link href={ROUTES.support.contact}>
                <Button variant="outline">
                  Contactar
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Beneficios de generar tu guía en línea
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6">
              <CheckCircle className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Disponible 24/7
              </h3>
              <p className="text-sm text-gray-600">
                Genera guías cualquier día a cualquier hora, sin depender de horarios de oficina.
              </p>
            </Card>

            <Card className="p-6">
              <CheckCircle className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Proceso rápido
              </h3>
              <p className="text-sm text-gray-600">
                En menos de 5 minutos tienes tu guía lista para imprimir y pegar.
              </p>
            </Card>

            <Card className="p-6">
              <CheckCircle className="w-10 h-10 text-primary mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">
                Rastreo automático
              </h3>
              <p className="text-sm text-gray-600">
                Tu guía queda registrada automáticamente para rastreo en tiempo real.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <CTA
        title="¿Tienes dudas sobre el proceso?"
        description="Nuestro equipo está listo para ayudarte a realizar tu envío."
        primaryAction={{
          label: 'Contactar soporte',
          href: ROUTES.support.contact,
        }}
        variant="minimal"
        background="primary"
      />
    </>
  )
}
