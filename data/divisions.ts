import { ROUTES } from '@/lib/constants'

export interface Division {
  id: string
  name: string
  tagline: string
  description: string
  icon: string
  href: string
  color: string
  features: string[]
}

export const divisions: Division[] = [
  {
    id: 'logistic',
    name: 'MA-IN Logistic',
    tagline: 'Soluciones de logística integral',
    description: 'Servicios de transporte y distribución a nivel nacional con la mejor cobertura y tiempos de entrega garantizados.',
    icon: 'truck',
    href: ROUTES.logistic.main,
    color: 'primary',
    features: [
      'Cobertura nacional',
      'Entregas programadas',
      'Almacenaje y distribución',
      'Logística inversa',
    ],
  },
  {
    id: 'track',
    name: 'MA-IN Track',
    tagline: 'Rastreo en tiempo real',
    description: 'Sistema de rastreo inteligente para monitorear tus envíos en tiempo real desde cualquier dispositivo.',
    icon: 'map-pin',
    href: ROUTES.track.main,
    color: 'primary',
    features: [
      'Rastreo en tiempo real',
      'Notificaciones automáticas',
      'Historial de envíos',
      'API de integración',
    ],
  },
  {
    id: 'pack',
    name: 'MA-IN Pack',
    tagline: 'Empaques profesionales',
    description: 'Soluciones de empaque y embalaje para proteger tus productos durante el transporte.',
    icon: 'package',
    href: ROUTES.pack.main,
    color: 'primary',
    features: [
      'Empaques personalizados',
      'Materiales ecológicos',
      'Soluciones industriales',
      'Venta mayoreo y menudeo',
    ],
  },
  {
    id: 'market',
    name: 'MA-IN Market',
    tagline: 'Tienda en línea',
    description: 'Compra empaques, suministros de oficina y más en nuestra tienda en línea con envío a todo México.',
    icon: 'shopping-cart',
    href: ROUTES.market.main,
    color: 'accent',
    features: [
      'Catálogo extenso',
      'Precios competitivos',
      'Envío a todo México',
      'Facturación electrónica',
    ],
  },
]

export const divisionDetails = {
  logistic: {
    hero: {
      title: 'Logística integral para tu negocio',
      subtitle: 'Conectamos tu empresa con todo México a través de soluciones de transporte confiables y eficientes.',
    },
    services: [
      {
        id: 'transporte-terrestre',
        title: 'Transporte Terrestre',
        description: 'Servicio de transporte por carretera a nivel nacional con seguimiento en tiempo real.',
        icon: 'truck',
      },
      {
        id: 'paqueteria',
        title: 'Paquetería Express',
        description: 'Envíos urgentes con entrega al siguiente día hábil en las principales ciudades.',
        icon: 'package',
      },
      {
        id: 'consolidado',
        title: 'Carga Consolidada',
        description: 'Optimiza costos compartiendo espacio de transporte con otros envíos.',
        icon: 'boxes',
      },
      {
        id: 'almacenaje',
        title: 'Almacenaje',
        description: 'Bodegas estratégicamente ubicadas para almacenar y distribuir tu mercancía.',
        icon: 'warehouse',
      },
      {
        id: 'distribucion',
        title: 'Distribución Última Milla',
        description: 'Entrega directa al consumidor final en zonas urbanas y suburbanas.',
        icon: 'map-pin',
      },
      {
        id: 'logistica-inversa',
        title: 'Logística Inversa',
        description: 'Gestión de devoluciones y recolección de productos.',
        icon: 'refresh-cw',
      },
    ],
    coverage: {
      states: 32,
      cities: 500,
      deliveryPoints: 10000,
      mainRoutes: [
        'Ciudad de México - Monterrey',
        'Ciudad de México - Guadalajara',
        'Ciudad de México - Cancún',
        'Monterrey - Tijuana',
        'Guadalajara - Mérida',
      ],
    },
    process: [
      {
        step: 1,
        title: 'Cotización',
        description: 'Solicita una cotización con los datos de tu envío.',
      },
      {
        step: 2,
        title: 'Recolección',
        description: 'Programamos la recolección en tu domicilio o punto de origen.',
      },
      {
        step: 3,
        title: 'Transporte',
        description: 'Tu paquete viaja de forma segura con rastreo en tiempo real.',
      },
      {
        step: 4,
        title: 'Entrega',
        description: 'Entregamos en el destino con confirmación de recepción.',
      },
    ],
  },
  track: {
    hero: {
      title: 'Rastrea tus envíos en tiempo real',
      subtitle: 'Conoce la ubicación exacta de tus paquetes y recibe notificaciones automáticas de cada movimiento.',
    },
    features: [
      {
        id: 'tiempo-real',
        title: 'Rastreo en Tiempo Real',
        description: 'Visualiza la ubicación exacta de tu envío en cualquier momento.',
        icon: 'map-pin',
      },
      {
        id: 'notificaciones',
        title: 'Notificaciones Automáticas',
        description: 'Recibe alertas por email o SMS en cada etapa del envío.',
        icon: 'bell',
      },
      {
        id: 'historial',
        title: 'Historial Completo',
        description: 'Consulta el historial detallado de todos tus envíos.',
        icon: 'clock',
      },
      {
        id: 'multienvio',
        title: 'Multi-envío',
        description: 'Rastrea múltiples paquetes simultáneamente.',
        icon: 'layers',
      },
      {
        id: 'api',
        title: 'API de Integración',
        description: 'Integra el rastreo directamente en tu sistema.',
        icon: 'code',
      },
      {
        id: 'reportes',
        title: 'Reportes y Analytics',
        description: 'Obtén reportes detallados de rendimiento de envíos.',
        icon: 'bar-chart',
      },
    ],
    trackingStatuses: [
      { code: 'CREATED', label: 'Guía generada', color: 'gray' },
      { code: 'PICKED_UP', label: 'Recolectado', color: 'blue' },
      { code: 'IN_TRANSIT', label: 'En tránsito', color: 'yellow' },
      { code: 'OUT_FOR_DELIVERY', label: 'En camino', color: 'orange' },
      { code: 'DELIVERED', label: 'Entregado', color: 'green' },
      { code: 'RETURNED', label: 'Devuelto', color: 'red' },
    ],
  },
  pack: {
    hero: {
      title: 'Soluciones de empaque profesional',
      subtitle: 'Protege tus productos con empaques de alta calidad diseñados para cada necesidad.',
    },
    categories: [
      {
        id: 'cajas',
        name: 'Cajas de Cartón',
        description: 'Cajas en todas las medidas para envío y almacenaje.',
        image: '/images/pack/cajas.jpg',
      },
      {
        id: 'sobres',
        name: 'Sobres y Bolsas',
        description: 'Sobres acolchados, bolsas de mensajería y más.',
        image: '/images/pack/sobres.jpg',
      },
      {
        id: 'relleno',
        name: 'Material de Relleno',
        description: 'Espuma, papel kraft, plástico burbuja.',
        image: '/images/pack/relleno.jpg',
      },
      {
        id: 'cintas',
        name: 'Cintas y Etiquetas',
        description: 'Cintas adhesivas, de empaque y etiquetas.',
        image: '/images/pack/cintas.jpg',
      },
      {
        id: 'especiales',
        name: 'Empaques Especiales',
        description: 'Soluciones para productos frágiles o especiales.',
        image: '/images/pack/especiales.jpg',
      },
      {
        id: 'ecologicos',
        name: 'Empaques Ecológicos',
        description: 'Materiales biodegradables y reciclables.',
        image: '/images/pack/ecologicos.jpg',
      },
    ],
    solutions: [
      {
        id: 'ecommerce',
        title: 'E-commerce',
        description: 'Soluciones completas para tiendas en línea.',
        icon: 'shopping-bag',
      },
      {
        id: 'industrial',
        title: 'Industrial',
        description: 'Empaques para el sector manufacturero.',
        icon: 'factory',
      },
      {
        id: 'alimentos',
        title: 'Alimentos',
        description: 'Empaques seguros para productos alimenticios.',
        icon: 'utensils',
      },
      {
        id: 'farmaceutico',
        title: 'Farmacéutico',
        description: 'Empaques con estándares sanitarios.',
        icon: 'pill',
      },
    ],
  },
  market: {
    hero: {
      title: 'Tu tienda de empaques en línea',
      subtitle: 'Encuentra todo lo que necesitas para embalar y enviar tus productos con los mejores precios.',
    },
    categories: [
      { id: 'empaques', name: 'Empaques', count: 150 },
      { id: 'cintas', name: 'Cintas', count: 45 },
      { id: 'etiquetas', name: 'Etiquetas', count: 60 },
      { id: 'relleno', name: 'Material de relleno', count: 35 },
      { id: 'oficina', name: 'Suministros de oficina', count: 80 },
      { id: 'limpieza', name: 'Limpieza', count: 40 },
    ],
  },
}

export type DivisionId = 'logistic' | 'track' | 'pack' | 'market'
