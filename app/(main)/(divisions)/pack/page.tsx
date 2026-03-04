import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero, CTA } from '@/components/sections'
import { Card, Button } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { divisionDetails } from '@/data/divisions'
import { productCategories, getFeaturedProducts, formatPrice } from '@/data/products'
import { ROUTES, DIVISION_NAV } from '@/lib/constants'
import { ArrowRight, Package, Box, Tag, Leaf } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pack - Empaques y Embalaje',
  description: 'Soluciones de empaque profesional: cajas, sobres, material de relleno y empaques ecológicos.',
}

export default function PackPage() {
  const { hero, categories } = divisionDetails.pack
  const featuredProducts = getFeaturedProducts().slice(0, 4)

  return (
    <>
      <Hero
        title={hero.title}
        subtitle="MA-IN Pack"
        description={hero.subtitle}
        primaryAction={{
          label: 'Ver catálogo',
          href: ROUTES.pack.catalog,
        }}
        secondaryAction={{
          label: 'Soluciones empresariales',
          href: ROUTES.pack.solutions,
        }}
      />

      <div className="container-custom py-4">
        <Breadcrumb items={[{ label: 'Pack' }]} />
      </div>

      {/* Quick Nav */}
      <section className="pb-8">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3">
            {DIVISION_NAV.pack.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="outline" size="sm">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">Categorías</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Encuentra el empaque perfecto
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Desde cajas de cartón hasta materiales ecológicos, tenemos todo lo que necesitas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`${ROUTES.pack.catalog}?category=${category.id}`}>
                <Card hover className="p-6 h-full">
                  <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <Package className="w-16 h-16 text-gray-300" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href={ROUTES.pack.catalog}>
              <Button variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Ver catálogo completo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">Destacados</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Productos más vendidos
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} hover className="overflow-hidden">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  <Box className="w-16 h-16 text-gray-300" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href={ROUTES.pack.featured}>
              <Button variant="outline" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Ver todos los destacados
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-primary text-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Tag className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Precios mayoreo</h3>
              <p className="text-white/80">
                Descuentos especiales por volumen para tu negocio.
              </p>
            </div>
            <div className="text-center">
              <Leaf className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Opciones ecológicas</h3>
              <p className="text-white/80">
                Materiales biodegradables y reciclables disponibles.
              </p>
            </div>
            <div className="text-center">
              <Package className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Personalización</h3>
              <p className="text-white/80">
                Empaques con tu marca y diseño personalizado.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTA
        title="¿Necesitas empaques para tu negocio?"
        description="Contáctanos para conocer nuestros precios especiales para empresas."
        primaryAction={{
          label: 'Solicitar cotización',
          href: ROUTES.support.contact,
        }}
        secondaryAction={{
          label: 'Ver soluciones',
          href: ROUTES.pack.solutions,
        }}
        variant="default"
        background="light"
      />
    </>
  )
}
