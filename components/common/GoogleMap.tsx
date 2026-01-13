'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { LOCATION, SCHEDULE, COMPANY } from '@/lib/constants'
import { MapPin, Clock, Phone, ExternalLink } from 'lucide-react'

interface GoogleMapProps {
  lat?: number
  lng?: number
  zoom?: number
  className?: string
  showInfo?: boolean
}

export function GoogleMap({
  lat = LOCATION.coordinates.lat,
  lng = LOCATION.coordinates.lng,
  zoom = 15,
  className,
  showInfo = true,
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      setError('API key de Google Maps no configurada')
      return
    }

    // Check if the script is already loaded
    if (window.google?.maps) {
      initMap()
      return
    }

    // Load Google Maps script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMap`
    script.async = true
    script.defer = true

    // Define callback
    ;(window as unknown as Record<string, () => void>).initGoogleMap = () => {
      initMap()
    }

    script.onerror = () => {
      setError('Error al cargar Google Maps')
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup
      delete (window as unknown as Record<string, () => void>).initGoogleMap
    }
  }, [lat, lng, zoom])

  const initMap = () => {
    if (!mapRef.current || !window.google) return

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    })

    // Add marker
    new window.google.maps.Marker({
      position: { lat, lng },
      map,
      title: COMPANY.name,
      animation: window.google.maps.Animation.DROP,
    })

    setMapLoaded(true)
  }

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

  // Fallback iframe when API key is not available
  const FallbackMap = () => (
    <iframe
      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.5!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDU1JzM0LjAiTiA5OcKwMTMnMTcuMCJX!5e0!3m2!1ses!2smx!4v1234567890`}
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Ubicación MA-IN"
    />
  )

  return (
    <div className={cn('grid md:grid-cols-2 gap-6', className)}>
      {/* Map */}
      <div className="relative rounded-xl overflow-hidden shadow-lg h-[300px] md:h-[400px]">
        {error ? (
          <FallbackMap />
        ) : (
          <>
            <div ref={mapRef} className="w-full h-full" />
            {!mapLoaded && (
              <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            )}
          </>
        )}
      </div>

      {/* Info panel */}
      {showInfo && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Visítanos
          </h3>

          <div className="space-y-6">
            {/* Address */}
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Dirección</h4>
                <p className="text-gray-600 text-sm">
                  {LOCATION.address}<br />
                  {LOCATION.colony}<br />
                  {LOCATION.postalCode} {LOCATION.city}, {LOCATION.state}
                </p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-2 hover:underline"
                >
                  Ver en Google Maps
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Horario</h4>
                <div className="text-gray-600 text-sm space-y-1">
                  <p>
                    <span className="font-medium">Lunes a Viernes:</span>
                  </p>
                  <p className="pl-4">
                    Mañana: {SCHEDULE.weekdays.morning.open} - {SCHEDULE.weekdays.morning.close}
                  </p>
                  <p className="pl-4">
                    Tarde: {SCHEDULE.weekdays.afternoon.open} - {SCHEDULE.weekdays.afternoon.close}
                  </p>
                  <p className="text-gray-500 mt-2">
                    Sábados, domingos y festivos: Cerrado
                  </p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Teléfono</h4>
                <a
                  href={`tel:${COMPANY.phone}`}
                  className="text-primary font-medium hover:underline"
                >
                  {COMPANY.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Type declaration for Google Maps
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (
          element: HTMLElement,
          options: Record<string, unknown>
        ) => unknown
        Marker: new (options: Record<string, unknown>) => unknown
        Animation: {
          DROP: number
          BOUNCE: number
        }
      }
    }
  }
}
