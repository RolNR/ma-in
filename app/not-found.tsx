'use client'

import Link from 'next/link'
import { Button } from '@/components/ui'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="container-custom text-center">
        <div className="max-w-md mx-auto">
          {/* 404 Number */}
          <div className="text-9xl font-bold text-primary/10 mb-4">
            404
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Página no encontrada
          </h1>

          <p className="text-gray-600 mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
            Verifica la URL o regresa a la página principal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" leftIcon={<Home className="w-5 h-5" />}>
                Ir al inicio
              </Button>
            </Link>
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="w-5 h-5" />}
              onClick={() => window.history.back()}
            >
              Volver atrás
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
