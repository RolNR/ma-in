import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero, CTA } from '@/components/sections'
import { Card, Button, Badge } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { getFeaturedProducts, productCategories, formatPrice } from '@/data/products'
import { ROUTES } from '@/lib/constants'
import { Box, Star, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Productos Destacados',
  description: 'Conoce nuestros productos más vendidos y mejor valorados en empaques y embalaje.',
}

export default function FeaturedPage() {
  const featuredProducts = getFeaturedProducts()

  return (
    <>
      <Hero
        title="Productos Destacados"
        subtitle="MA-IN Pack"
        description="Los productos más populares y mejor valorados por nuestros clientes."
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Pack', href: ROUTES.pack.main },
            { label: 'Destacados' },
          ]}
        />
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <Card key={product.id} hover className="overflow-hidden group relative">
                {/* Ranking badge */}
                <div className="absolute top-3 left-3 z-10 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">
                    {index + 1}
                  </span>
                </div>

                <div className="relative h-52 bg-gray-100 flex items-center justify-center">
                  <Box className="w-20 h-20 text-gray-300" />
                  {product.originalPrice && (
                    <Badge variant="error" className="absolute top-3 right-3">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>

                <div className="p-5">
                  {/* Rating placeholder */}
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= 4 ? 'text-accent fill-accent' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">(4.0)</span>
                  </div>

                  <p className="text-xs text-primary font-medium mb-1">
                    {productCategories.find(c => c.id === product.category)?.name}
                  </p>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href={ROUTES.pack.catalog}>
              <Button variant="outline" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Ver catálogo completo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CTA
        title="¿Buscas algo específico?"
        description="Contáctanos y te ayudamos a encontrar el empaque perfecto para tu producto."
        primaryAction={{
          label: 'Contactar',
          href: ROUTES.support.contact,
        }}
        variant="minimal"
        background="primary"
      />
    </>
  )
}
