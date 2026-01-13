import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero, CTA } from '@/components/sections'
import { Card, Button, Badge } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { divisionDetails } from '@/data/divisions'
import { products, productCategories, getFeaturedProducts, formatPrice } from '@/data/products'
import { ROUTES } from '@/lib/constants'
import {
  ShoppingCart,
  Package,
  Truck,
  CreditCard,
  FileText,
  Box,
  ArrowRight,
  Star,
  Tag,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Market - Tienda en Línea',
  description: 'Compra empaques, suministros y más en nuestra tienda en línea. Envío a todo México.',
}

export default function MarketPage() {
  const { hero, categories } = divisionDetails.market
  const featuredProducts = getFeaturedProducts().slice(0, 8)

  return (
    <>
      <Hero
        title={hero.title}
        subtitle="MA-IN Market"
        description={hero.subtitle}
        primaryAction={{
          label: 'Ver productos',
          href: '#productos',
        }}
        secondaryAction={{
          label: 'Ver ofertas',
          href: '#ofertas',
        }}
      />

      <div className="container-custom py-4">
        <Breadcrumb items={[{ label: 'Market' }]} />
      </div>

      {/* Benefits bar */}
      <section className="bg-gray-50 py-6">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Envío gratis</p>
                <p className="text-sm text-gray-500">En compras mayores a $500</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Pago seguro</p>
                <p className="text-sm text-gray-500">Múltiples métodos de pago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Facturación</p>
                <p className="text-sm text-gray-500">CFDI disponible</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Mayoreo</p>
                <p className="text-sm text-gray-500">Precios especiales</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Categorías
            </h2>
            <p className="text-gray-600">
              Explora nuestro catálogo por categoría
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={ROUTES.pack.catalog}>
                <Card hover className="p-4 text-center h-full">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {category.count} productos
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="productos" className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Productos destacados
              </h2>
              <p className="text-gray-600">
                Los más vendidos esta semana
              </p>
            </div>
            <Link href={ROUTES.pack.catalog}>
              <Button variant="outline" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Ver todo
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} hover className="overflow-hidden group">
                <div className="relative h-48 bg-white flex items-center justify-center">
                  <Box className="w-16 h-16 text-gray-300" />
                  {product.originalPrice && (
                    <Badge variant="error" className="absolute top-3 right-3">
                      Oferta
                    </Badge>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= 4 ? 'text-accent fill-accent' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-lg font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through ml-1">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    <Button variant="primary" size="sm">
                      <ShoppingCart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Offers section */}
      <section id="ofertas" className="section-padding">
        <div className="container-custom">
          <Card className="p-8 md:p-12 bg-gradient-to-r from-primary to-primary-600 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-6 h-6" />
                  <span className="font-medium">Ofertas especiales</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Hasta 30% de descuento
                </h2>
                <p className="text-white/80 mb-6">
                  En productos seleccionados. Aprovecha nuestras ofertas especiales en empaques y materiales de empaque.
                </p>
                <Link href={ROUTES.pack.catalog}>
                  <Button variant="secondary" size="lg">
                    Ver ofertas
                  </Button>
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-6xl font-bold">30%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Coming soon notice */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <Card className="max-w-2xl mx-auto p-8 text-center border-2 border-dashed border-gray-300">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tienda en línea próximamente
            </h2>
            <p className="text-gray-600 mb-6">
              Estamos trabajando en la integración completa de nuestra tienda en línea.
              Mientras tanto, puedes explorar nuestro catálogo y contactarnos para realizar tu compra.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={ROUTES.pack.catalog}>
                <Button variant="primary">
                  Ver catálogo
                </Button>
              </Link>
              <Link href={ROUTES.support.contact}>
                <Button variant="outline">
                  Contactar para comprar
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <CTA
        title="¿Compras para empresa?"
        description="Solicita una cotización con precios especiales para volumen."
        primaryAction={{
          label: 'Solicitar cotización',
          href: ROUTES.support.contact,
        }}
        variant="minimal"
        background="primary"
      />
    </>
  )
}
