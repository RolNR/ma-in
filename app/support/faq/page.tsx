import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero, CTA } from '@/components/sections'
import { Card, Button } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { FAQ } from '@/components/common'
import { ROUTES } from '@/lib/constants'
import { HelpCircle, MessageSquare } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes',
  description: 'Encuentra respuestas a las preguntas más frecuentes sobre envíos, rastreo, empaques, pagos y más.',
}

export default function FAQPage() {
  return (
    <>
      <Hero
        title="Preguntas Frecuentes"
        subtitle="Centro de Soporte"
        description="Encuentra respuestas rápidas a las dudas más comunes."
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Soporte', href: ROUTES.support.main },
            { label: 'FAQ' },
          ]}
        />
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* FAQ Component */}
            <div className="lg:col-span-2">
              <FAQ showCategories showSearch />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <HelpCircle className="w-10 h-10 text-primary mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">
                  ¿No encontraste tu respuesta?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Si no encontraste la información que buscas, contáctanos y te ayudaremos.
                </p>
                <Link href={ROUTES.support.contact}>
                  <Button variant="primary" className="w-full">
                    Contactar soporte
                  </Button>
                </Link>
              </Card>

              <Card className="p-6 bg-primary text-white">
                <MessageSquare className="w-10 h-10 mb-4" />
                <h3 className="font-semibold mb-2">
                  Chat en línea
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Próximamente podrás chatear en vivo con nuestro equipo de soporte.
                </p>
                <Button
                  variant="secondary"
                  className="w-full"
                  disabled
                >
                  Próximamente
                </Button>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Temas populares
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href={ROUTES.logistik.trackShipment}
                      className="text-primary hover:underline text-sm"
                    >
                      ¿Cómo rastreo mi paquete?
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={ROUTES.logistik.coverage}
                      className="text-primary hover:underline text-sm"
                    >
                      ¿Cuál es la cobertura?
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={ROUTES.pack.catalog}
                      className="text-primary hover:underline text-sm"
                    >
                      ¿Qué empaques venden?
                    </Link>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <CTA
        title="¿Necesitas ayuda personalizada?"
        description="Nuestro equipo está listo para asistirte con cualquier consulta."
        primaryAction={{
          label: 'Contactar',
          href: ROUTES.support.contact,
        }}
        variant="minimal"
        background="light"
      />
    </>
  )
}
