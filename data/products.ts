export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  category: string
  inStock: boolean
  featured: boolean
  specifications?: Record<string, string>
}

export interface ProductCategory {
  id: string
  name: string
  description: string
  icon: string
  image: string
}

export const productCategories: ProductCategory[] = [
  {
    id: 'cajas',
    name: 'Cajas de Cartón',
    description: 'Cajas corrugadas en diferentes medidas para envío y almacenaje.',
    icon: 'box',
    image: '/images/categories/cajas.jpg',
  },
  {
    id: 'sobres',
    name: 'Sobres y Bolsas',
    description: 'Sobres de seguridad, bolsas de mensajería y sobres acolchados.',
    icon: 'mail',
    image: '/images/categories/sobres.jpg',
  },
  {
    id: 'relleno',
    name: 'Material de Relleno',
    description: 'Plástico burbuja, espuma, papel kraft y más para protección.',
    icon: 'layers',
    image: '/images/categories/relleno.jpg',
  },
  {
    id: 'cintas',
    name: 'Cintas Adhesivas',
    description: 'Cintas de empaque, sellado y seguridad.',
    icon: 'tape',
    image: '/images/categories/cintas.jpg',
  },
  {
    id: 'etiquetas',
    name: 'Etiquetas',
    description: 'Etiquetas térmicas, adhesivas y de envío.',
    icon: 'tag',
    image: '/images/categories/etiquetas.jpg',
  },
  {
    id: 'ecologicos',
    name: 'Ecológicos',
    description: 'Empaques biodegradables y reciclables.',
    icon: 'leaf',
    image: '/images/categories/ecologicos.jpg',
  },
]

export const products: Product[] = [
  // Cajas
  {
    id: 'caja-20x20x20',
    name: 'Caja de Cartón 20x20x20 cm',
    description: 'Caja de cartón corrugado de pared simple, ideal para envíos pequeños.',
    price: 12.50,
    image: '/images/products/caja-20.jpg',
    category: 'cajas',
    inStock: true,
    featured: true,
    specifications: {
      Material: 'Cartón corrugado',
      Grosor: 'Pared simple',
      Peso: '200g',
      Resistencia: '23 kg',
    },
  },
  {
    id: 'caja-30x30x30',
    name: 'Caja de Cartón 30x30x30 cm',
    description: 'Caja de cartón corrugado mediana, perfecta para paquetería.',
    price: 18.00,
    image: '/images/products/caja-30.jpg',
    category: 'cajas',
    inStock: true,
    featured: true,
    specifications: {
      Material: 'Cartón corrugado',
      Grosor: 'Pared simple',
      Peso: '350g',
      Resistencia: '32 kg',
    },
  },
  {
    id: 'caja-40x40x40',
    name: 'Caja de Cartón 40x40x40 cm',
    description: 'Caja de cartón corrugado grande para envíos de mayor volumen.',
    price: 28.00,
    image: '/images/products/caja-40.jpg',
    category: 'cajas',
    inStock: true,
    featured: false,
    specifications: {
      Material: 'Cartón corrugado',
      Grosor: 'Doble pared',
      Peso: '600g',
      Resistencia: '45 kg',
    },
  },
  {
    id: 'caja-60x40x40',
    name: 'Caja de Cartón 60x40x40 cm',
    description: 'Caja extra grande para mudanzas y envíos voluminosos.',
    price: 45.00,
    image: '/images/products/caja-60.jpg',
    category: 'cajas',
    inStock: true,
    featured: false,
  },

  // Sobres
  {
    id: 'sobre-seguridad-s',
    name: 'Sobre de Seguridad Pequeño',
    description: 'Sobre con adhesivo de seguridad, tamaño carta.',
    price: 3.50,
    image: '/images/products/sobre-s.jpg',
    category: 'sobres',
    inStock: true,
    featured: true,
  },
  {
    id: 'sobre-seguridad-m',
    name: 'Sobre de Seguridad Mediano',
    description: 'Sobre con adhesivo de seguridad, tamaño oficio.',
    price: 5.00,
    image: '/images/products/sobre-m.jpg',
    category: 'sobres',
    inStock: true,
    featured: false,
  },
  {
    id: 'sobre-burbuja',
    name: 'Sobre Acolchado con Burbuja',
    description: 'Sobre con interior de plástico burbuja para protección extra.',
    price: 8.50,
    image: '/images/products/sobre-burbuja.jpg',
    category: 'sobres',
    inStock: true,
    featured: true,
  },
  {
    id: 'bolsa-mensajeria',
    name: 'Bolsa de Mensajería 30x40',
    description: 'Bolsa de polietileno para mensajería con cierre adhesivo.',
    price: 2.80,
    image: '/images/products/bolsa-mensajeria.jpg',
    category: 'sobres',
    inStock: true,
    featured: false,
  },

  // Material de relleno
  {
    id: 'burbuja-rollo',
    name: 'Plástico Burbuja (Rollo 50m)',
    description: 'Rollo de plástico burbuja de 50cm de ancho x 50m de largo.',
    price: 180.00,
    originalPrice: 220.00,
    image: '/images/products/burbuja.jpg',
    category: 'relleno',
    inStock: true,
    featured: true,
  },
  {
    id: 'papel-kraft',
    name: 'Papel Kraft (Rollo 10kg)',
    description: 'Rollo de papel kraft de 60cm de ancho, ideal para envolver.',
    price: 95.00,
    image: '/images/products/kraft.jpg',
    category: 'relleno',
    inStock: true,
    featured: false,
  },
  {
    id: 'espuma-chips',
    name: 'Chips de Espuma (Bolsa 100L)',
    description: 'Chips de espuma para relleno y protección de productos.',
    price: 120.00,
    image: '/images/products/espuma.jpg',
    category: 'relleno',
    inStock: true,
    featured: false,
  },

  // Cintas
  {
    id: 'cinta-empaque',
    name: 'Cinta de Empaque Transparente',
    description: 'Cinta adhesiva transparente 48mm x 100m.',
    price: 25.00,
    image: '/images/products/cinta-trans.jpg',
    category: 'cintas',
    inStock: true,
    featured: true,
  },
  {
    id: 'cinta-empaque-cafe',
    name: 'Cinta de Empaque Café',
    description: 'Cinta adhesiva café 48mm x 100m.',
    price: 22.00,
    image: '/images/products/cinta-cafe.jpg',
    category: 'cintas',
    inStock: true,
    featured: false,
  },
  {
    id: 'cinta-fragil',
    name: 'Cinta Frágil',
    description: 'Cinta con leyenda "FRÁGIL" para productos delicados.',
    price: 35.00,
    image: '/images/products/cinta-fragil.jpg',
    category: 'cintas',
    inStock: true,
    featured: false,
  },

  // Etiquetas
  {
    id: 'etiqueta-termica',
    name: 'Etiquetas Térmicas 10x15 (500 pzas)',
    description: 'Rollo de 500 etiquetas térmicas para impresora.',
    price: 85.00,
    image: '/images/products/etiquetas.jpg',
    category: 'etiquetas',
    inStock: true,
    featured: true,
  },
  {
    id: 'etiqueta-envio',
    name: 'Etiquetas de Envío A6 (100 pzas)',
    description: 'Etiquetas adhesivas tamaño A6 para guías de envío.',
    price: 45.00,
    image: '/images/products/etiquetas-envio.jpg',
    category: 'etiquetas',
    inStock: true,
    featured: false,
  },

  // Ecológicos
  {
    id: 'caja-eco',
    name: 'Caja Ecológica 30x30x30',
    description: 'Caja de cartón 100% reciclado, certificada FSC.',
    price: 22.00,
    image: '/images/products/caja-eco.jpg',
    category: 'ecologicos',
    inStock: true,
    featured: true,
  },
  {
    id: 'relleno-papel',
    name: 'Relleno de Papel Reciclado (5kg)',
    description: 'Tiras de papel reciclado para relleno de cajas.',
    price: 65.00,
    image: '/images/products/relleno-papel.jpg',
    category: 'ecologicos',
    inStock: true,
    featured: false,
  },
  {
    id: 'cinta-papel-kraft',
    name: 'Cinta de Papel Kraft',
    description: 'Cinta adhesiva de papel kraft biodegradable.',
    price: 38.00,
    image: '/images/products/cinta-kraft.jpg',
    category: 'ecologicos',
    inStock: true,
    featured: false,
  },
]

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(product => product.category === categoryId)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured)
}

export function getProductById(productId: string): Product | undefined {
  return products.find(product => product.id === productId)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(price)
}
