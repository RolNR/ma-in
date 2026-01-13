export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
}

export interface Stat {
  id: string
  value: string
  label: string
  icon: string
}

// Servicios principales de logística
export const logisticServices: Service[] = [
  {
    id: 'transporte-terrestre',
    title: 'Transporte Terrestre',
    description: 'Servicio de transporte por carretera a nivel nacional con unidades modernas y seguimiento GPS en tiempo real.',
    icon: 'truck',
    features: [
      'Cobertura a nivel nacional',
      'Unidades con GPS',
      'Seguro de carga incluido',
      'Entregas programadas',
    ],
  },
  {
    id: 'paqueteria-express',
    title: 'Paquetería Express',
    description: 'Envíos urgentes con entrega al siguiente día hábil en las principales ciudades del país.',
    icon: 'zap',
    features: [
      'Entrega día siguiente',
      'Recolección a domicilio',
      'Notificaciones en tiempo real',
      'Comprobante de entrega digital',
    ],
  },
  {
    id: 'carga-consolidada',
    title: 'Carga Consolidada',
    description: 'Optimiza tus costos de envío compartiendo espacio de transporte con otras cargas.',
    icon: 'layers',
    features: [
      'Ahorro hasta 40%',
      'Rutas optimizadas',
      'Ideal para volúmenes pequeños',
      'Salidas programadas',
    ],
  },
  {
    id: 'almacenaje',
    title: 'Almacenaje y Distribución',
    description: 'Bodegas estratégicamente ubicadas para almacenar y distribuir tu mercancía eficientemente.',
    icon: 'warehouse',
    features: [
      'Bodegas climatizadas',
      'Control de inventario',
      'Cross-docking',
      'Picking y packing',
    ],
  },
  {
    id: 'ultima-milla',
    title: 'Última Milla',
    description: 'Entrega directa al consumidor final con opciones flexibles y alta tasa de éxito.',
    icon: 'home',
    features: [
      'Entregas en ventanas horarias',
      'Intentos múltiples',
      'Puntos de entrega alternativos',
      'Confirmación con foto',
    ],
  },
  {
    id: 'logistica-inversa',
    title: 'Logística Inversa',
    description: 'Gestión integral de devoluciones, recolecciones y procesamiento de retornos.',
    icon: 'refresh-cw',
    features: [
      'Recolección de devoluciones',
      'Inspección de productos',
      'Reintegración a inventario',
      'Reportes detallados',
    ],
  },
]

// Estadísticas de la empresa
export const companyStats: Stat[] = [
  {
    id: 'years',
    value: '15+',
    label: 'Años de experiencia',
    icon: 'calendar',
  },
  {
    id: 'shipments',
    value: '1M+',
    label: 'Envíos mensuales',
    icon: 'package',
  },
  {
    id: 'coverage',
    value: '32',
    label: 'Estados con cobertura',
    icon: 'map',
  },
  {
    id: 'clients',
    value: '5,000+',
    label: 'Clientes activos',
    icon: 'users',
  },
]

// Beneficios generales
export const benefits = [
  {
    id: 'confiabilidad',
    title: 'Confiabilidad',
    description: 'Más del 98% de entregas exitosas en tiempo y forma.',
    icon: 'shield-check',
  },
  {
    id: 'tecnologia',
    title: 'Tecnología',
    description: 'Plataforma digital moderna con rastreo en tiempo real.',
    icon: 'cpu',
  },
  {
    id: 'atencion',
    title: 'Atención Personalizada',
    description: 'Ejecutivos dedicados para cada cliente empresarial.',
    icon: 'headphones',
  },
  {
    id: 'flexibilidad',
    title: 'Flexibilidad',
    description: 'Soluciones adaptadas a las necesidades de cada cliente.',
    icon: 'settings',
  },
]

// Tipos de paquete para cotización
export const packageTypes = [
  { id: 'sobre', label: 'Sobre / Documento', maxWeight: 1 },
  { id: 'paquete-chico', label: 'Paquete pequeño', maxWeight: 5 },
  { id: 'paquete-mediano', label: 'Paquete mediano', maxWeight: 20 },
  { id: 'paquete-grande', label: 'Paquete grande', maxWeight: 70 },
  { id: 'tarima', label: 'Tarima / Pallet', maxWeight: 500 },
]

// Ciudades principales para cobertura
export const mainCities = [
  { name: 'Ciudad de México', state: 'CDMX', deliveryTime: '1-2 días' },
  { name: 'Guadalajara', state: 'Jalisco', deliveryTime: '1-2 días' },
  { name: 'Monterrey', state: 'Nuevo León', deliveryTime: '1-2 días' },
  { name: 'Puebla', state: 'Puebla', deliveryTime: '1-2 días' },
  { name: 'Querétaro', state: 'Querétaro', deliveryTime: '1-2 días' },
  { name: 'Mérida', state: 'Yucatán', deliveryTime: '2-3 días' },
  { name: 'Tijuana', state: 'Baja California', deliveryTime: '2-3 días' },
  { name: 'León', state: 'Guanajuato', deliveryTime: '1-2 días' },
  { name: 'Cancún', state: 'Quintana Roo', deliveryTime: '2-3 días' },
  { name: 'Cuernavaca', state: 'Morelos', deliveryTime: '1 día' },
]
