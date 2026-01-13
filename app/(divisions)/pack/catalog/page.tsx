import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero } from '@/components/sections'
import { Card, Button, Badge } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { products, productCategories, formatPrice } from '@/data/products'
import { ROUTES } from '@/lib/constants'
import { Box, ShoppingCart, Filter } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Catálogo de Empaques',
  description: 'Explora nuestro catálogo completo de empaques: cajas, sobres, material de relleno y más.',
}

export default function CatalogPage() {
  return (
    <>
      <Hero
        title="Catálogo de Empaques"
        subtitle="MA-IN Pack"
        description="Encuentra el empaque perfecto para tu producto."
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb
          items={[
            { label: 'Pack', href: ROUTES.pack.main },
            { label: 'Catálogo' },
          ]}
        />
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-900">Categorías</h3>
                </div>
                <ul className="space-y-2">
                  <li>
                    <button className="w-full text-left px-3 py-2 rounded-lg bg-primary-100 text-primary font-medium">
                      Todas las categorías
                    </button>
                  </li>
                  {productCategories.map((category) => (
                    <li key={category.id}>
                      <button className="w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Products grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">{products.length}</span> productos
                </p>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Ordenar por: Relevancia</option>
                  <option>Precio: Menor a mayor</option>
                  <option>Precio: Mayor a menor</option>
                  <option>Nombre: A-Z</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} hover className="overflow-hidden group">
                    <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                      <Box className="w-16 h-16 text-gray-300" />
                      {product.featured && (
                        <Badge variant="secondary" className="absolute top-3 left-3">
                          Destacado
                        </Badge>
                      )}
                      {product.originalPrice && (
                        <Badge variant="error" className="absolute top-3 right-3">
                          Oferta
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-primary font-medium mb-1">
                        {productCategories.find(c => c.id === product.category)?.name}
                      </p>
                      <h3 className="font-medium text-gray-900 mb-1 group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through ml-2">
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

              {/* Pagination placeholder */}
              <div className="flex justify-center mt-8 gap-2">
                <Button variant="outline" size="sm" disabled>
                  Anterior
                </Button>
                <Button variant="primary" size="sm">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
