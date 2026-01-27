import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero, CTA } from '@/components/sections'
import { Card, Button } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { divisionDetails } from '@/data/divisions'
import { ROUTES } from '@/lib/constants'
import {
  FileText,
  Truck,
  MapPin,
  Package,
  CheckCircle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Proceso de Envío',
  description: 'Conoce el proceso paso a paso para enviar tu paquete con MA-IN Logistik.',
}

const processIcons = [FileText, Package, Truck, MapPin]

export default function ProcessPage() {
  const { process } = divisionDetails.logistik

  return (
    <>
      <Hero
        title="Proceso de Envío"
        subtitle="MA-IN Logistik"
        description="Un proceso simple y transparente para que tus envíos lleguen a tiempo."
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Logistik', href: ROUTES.logistik.main },
            { label: 'Proceso' },
          ]}
        />
      </div>

      {/* Process Steps */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {process.map((step, index) => {
              const Icon = processIcons[index] || Package
              const isLast = index === process.length - 1

              return (
                <div key={step.step} className="relative">
                  <div className="flex gap-6 md:gap-8">
                    {/* Step indicator */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white z-10">
                        <Icon className="w-8 h-8" />
                      </div>
                      {!isLast && (
                        <div className="w-0.5 h-full bg-primary-200 my-2" />
                      )}
                    </div>

                    {/* Content */}
                    <Card className="flex-1 p-6 mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-primary-100 text-primary text-sm font-bold rounded-full">
                          Paso {step.step}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {step.description}
                      </p>

                      {step.step === 1 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-3">
                            Para cotizar necesitas:
                          </p>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              Código postal de origen y destino
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              Peso y dimensiones del paquete
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              Tipo de contenido
                            </li>
                          </ul>
                          <Link href={ROUTES.support.contact} className="mt-4 inline-block">
                            <Button variant="primary" size="sm">
                              Contactar para cotizar
                            </Button>
                          </Link>
                        </div>
                      )}

                      {step.step === 2 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600">
                            Opciones de recolección:
                          </p>
                          <ul className="space-y-2 mt-2">
                            <li className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              Recolección a domicilio (sin costo adicional)
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              Entrega en sucursal MA-IN
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              Puntos de recepción autorizados
                            </li>
                          </ul>
                        </div>
                      )}

                      {step.step === 3 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-3">
                            Durante el transporte puedes:
                          </p>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              Rastrear en tiempo real
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              Recibir notificaciones automáticas
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              Contactar a soporte 24/7
                            </li>
                          </ul>
                          <Link href={ROUTES.logistik.trackShipment} className="mt-4 inline-block">
                            <Button variant="outline" size="sm">
                              Rastrear envío
                            </Button>
                          </Link>
                        </div>
                      )}

                      {step.step === 4 && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-sm text-gray-600 mb-3">
                            Al momento de la entrega:
                          </p>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              Confirmación con firma digital
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              Foto de evidencia de entrega
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              Notificación inmediata al remitente
                            </li>
                          </ul>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <CTA
        title="¿Listo para enviar?"
        description="Contáctanos para comenzar."
        primaryAction={{
          label: 'Contactar',
          href: ROUTES.support.contact,
        }}
        variant="centered"
        background="gradient"
      />
    </>
  )
}
