import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero, CTA } from '@/components/sections'
import { Card, Button } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { divisionDetails } from '@/data/divisions'
import { ROUTES } from '@/lib/constants'
import {
  ShoppingBag,
  Factory,
  UtensilsCrossed,
  Pill,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Soluciones de Empaque',
  description: 'Soluciones de empaque especializadas para e-commerce, industria, alimentos y sector farmacéutico.',
}

const solutionIcons = {
  'shopping-bag': ShoppingBag,
  factory: Factory,
  utensils: UtensilsCrossed,
  pill: Pill,
}

const solutionDetails = {
  ecommerce: {
    benefits: [
      'Cajas personalizadas con tu marca',
      'Materiales de relleno optimizados',
      'Sobres de seguridad',
      'Cintas de empaque con logo',
      'Integración con plataformas',
    ],
  },
  industrial: {
    benefits: [
      'Empaques de alta resistencia',
      'Soluciones para carga pesada',
      'Tarimas y contenedores',
      'Protección contra humedad',
      'Empaque para exportación',
    ],
  },
  alimentos: {
    benefits: [
      'Materiales grado alimenticio',
      'Empaques térmicos',
      'Bolsas herméticas',
      'Cumplimiento normativo',
      'Opciones biodegradables',
    ],
  },
  farmaceutico: {
    benefits: [
      'Estándares de higiene',
      'Cajas con sello de seguridad',
      'Control de temperatura',
      'Trazabilidad garantizada',
      'Cumplimiento regulatorio',
    ],
  },
}

export default function SolutionsPage() {
  const { solutions } = divisionDetails.pack

  return (
    <>
      <Hero
        title="Soluciones de Empaque por Industria"
        subtitle="MA-IN Pack"
        description="Cada industria tiene necesidades únicas. Conoce nuestras soluciones especializadas."
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Pack', href: ROUTES.pack.main },
            { label: 'Soluciones' },
          ]}
        />
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="space-y-12">
            {solutions.map((solution, index) => {
              const Icon = solutionIcons[solution.icon as keyof typeof solutionIcons] || ShoppingBag
              const details = solutionDetails[solution.id as keyof typeof solutionDetails]
              const isEven = index % 2 === 0

              return (
                <Card key={solution.id} className="p-0 overflow-hidden">
                  <div className={`grid md:grid-cols-2 ${isEven ? '' : 'md:grid-flow-dense'}`}>
                    {/* Image/Icon area */}
                    <div className={`h-64 md:h-auto bg-gray-100 flex items-center justify-center ${isEven ? '' : 'md:col-start-2'}`}>
                      <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="w-16 h-16 text-primary" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className={`p-8 ${isEven ? '' : 'md:col-start-1 md:row-start-1'}`}>
                      <span className="text-primary font-medium text-sm">
                        Solución especializada
                      </span>
                      <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-3">
                        {solution.title}
                      </h2>
                      <p className="text-gray-600 mb-6">
                        {solution.description}
                      </p>

                      {details && (
                        <ul className="space-y-3 mb-6">
                          {details.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                              <span className="text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <Link href={ROUTES.support.contact}>
                        <Button variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                          Solicitar información
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Custom solutions */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Tu industria no está en la lista?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Diseñamos soluciones de empaque personalizadas para cualquier necesidad.
            Cuéntanos sobre tu proyecto y crearemos la solución perfecta.
          </p>
          <Link href={ROUTES.support.contact}>
            <Button variant="primary" size="lg">
              Contactar a un especialista
            </Button>
          </Link>
        </div>
      </section>

      <CTA
        title="Empaques personalizados con tu marca"
        description="Impresión de logo, colores corporativos y diseños exclusivos para tu empresa."
        primaryAction={{
          label: 'Ver opciones de personalización',
          href: ROUTES.support.contact,
        }}
        variant="minimal"
        background="primary"
      />
    </>
  )
}
