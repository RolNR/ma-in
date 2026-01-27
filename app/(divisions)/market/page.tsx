import type { Metadata } from 'next'
import Image from 'next/image'
import { COMPANY } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Market - Menú Digital',
  description: 'Escanea el código QR para ver nuestro menú y productos disponibles.',
}

export default function MarketPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="container-custom py-16">
        <div className="max-w-lg mx-auto text-center">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/logo.svg"
              alt={COMPANY.name}
              width={120}
              height={70}
              className="h-16 w-auto mx-auto"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            MA-IN Market
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-10">
            Escanea el código QR para ver nuestro menú
          </p>

          {/* QR Placeholder */}
          <div className="inline-flex flex-col items-center">
            <div className="w-64 h-64 border-4 border-dashed border-gray-300 rounded-2xl flex items-center justify-center bg-white">
              <div className="text-center px-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-400">
                  Código QR del menú
                </p>
                <p className="text-xs text-gray-300 mt-1">
                  Configurar URL del PDF
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Apunta la cámara de tu teléfono al código QR
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
