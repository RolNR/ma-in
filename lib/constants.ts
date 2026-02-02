/**
 * Constantes globales de la aplicación MA-IN
 */

// Información de la empresa
export const COMPANY = {
  name: 'MA-IN',
  fullName: 'Grupo MA-IN',
  tagline: 'Soluciones integrales de logística',
  description: 'Empresa mexicana líder en soluciones de logística, rastreo, empaque y comercio.',
  email: 'contacto@ma-in.mx',
  phone: '+52 777 123 4567',
  whatsapp: '+52 777 123 4567',
} as const

// Ubicación física
export const LOCATION = {
  address: 'Av. San Diego 426, zona 1',
  colony: 'Lomas de Vista Hermosa',
  postalCode: '62290',
  city: 'Cuernavaca',
  state: 'Morelos',
  country: 'México',
  fullAddress: 'Av. San Diego 426, zona 1, Lomas de Vista Hermosa, 62290 Cuernavaca, Morelos, México',
  coordinates: {
    lat: 18.9261,
    lng: -99.2214,
  },
} as const

// Horarios de atención
export const SCHEDULE = {
  weekdays: {
    morning: { open: '08:00', close: '14:00' },
    afternoon: { open: '16:00', close: '19:00' },
  },
  saturday: null,
  sunday: null,
  formatted: 'Lunes a viernes de 8:00 a 14:00 y de 16:00 a 19:00',
} as const

// Rutas de navegación
export const ROUTES = {
  home: '/',
  // Divisiones
  logistik: {
    main: '/logistik',
    services: '/logistik/services',
    coverage: '/logistik/coverage',
    process: '/logistik/process',
    trackShipment: '/logistik/track-shipment',
  },
  pack: {
    main: '/pack',
    catalog: '/pack/catalog',
    featured: '/pack/featured',
    solutions: '/pack/solutions',
  },
  market: {
    main: '/market',
  },
  // Soporte
  support: {
    main: '/support',
    faq: '/support/faq',
    location: '/support/location',
    contact: '/support/contact',
  },
  // Legal
  privacy: '/privacy',
  terms: '/terms',
} as const

// Colores corporativos
export const COLORS = {
  primary: '#138A6F',
  accent: '#E1C357',
  light: '#FFFFFF',
  dark: '#1F2937',
} as const

// Navegación principal
export const MAIN_NAV = [
  { label: 'Inicio', href: ROUTES.home },
  { label: 'Logistik', href: ROUTES.logistik.main },
  { label: 'Pack', href: ROUTES.pack.main },
  { label: 'Market', href: ROUTES.market.main },
  { label: 'Soporte', href: ROUTES.support.main },
] as const

// Navegación de divisiones
export const DIVISION_NAV = {
  logistik: [
    { label: 'Proceso', href: ROUTES.logistik.process },
    { label: 'Rastrear envío', href: ROUTES.logistik.trackShipment },
  ],
  pack: [
    { label: 'Catálogo', href: ROUTES.pack.catalog },
    { label: 'Destacados', href: ROUTES.pack.featured },
    { label: 'Soluciones', href: ROUTES.pack.solutions },
  ],
} as const

// Navegación de soporte
export const SUPPORT_NAV = [
  { label: 'Preguntas frecuentes', href: ROUTES.support.faq },
  { label: 'Ubicación', href: ROUTES.support.location },
  { label: 'Contacto', href: ROUTES.support.contact },
] as const

// Navegación del footer
export const FOOTER_NAV = {
  divisiones: [
    { label: 'Logistik', href: ROUTES.logistik.main },
    { label: 'Pack', href: ROUTES.pack.main },
    { label: 'Market', href: ROUTES.market.main },
  ],
  soporte: [
    { label: 'FAQ', href: ROUTES.support.faq },
    { label: 'Ubicación', href: ROUTES.support.location },
    { label: 'Contacto', href: ROUTES.support.contact },
  ],
  legal: [
    { label: 'Aviso de privacidad', href: ROUTES.privacy },
    { label: 'Términos y condiciones', href: ROUTES.terms },
  ],
} as const

// Redes sociales
export const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://facebook.com/grupo.main', icon: 'facebook' },
  { name: 'Instagram', href: 'https://instagram.com/grupo.main', icon: 'instagram' },
] as const
