export interface FAQItem {
  id: number
  category: string
  question: string
  answer: string
}

export interface FAQCategory {
  id: string
  name: string
  icon: string
}

export const faqCategories: FAQCategory[] = [
  { id: 'envios', name: 'Envíos y Logística', icon: 'truck' },
  { id: 'rastreo', name: 'Rastreo de Paquetes', icon: 'map-pin' },
  { id: 'empaques', name: 'Empaques y Productos', icon: 'package' },
  { id: 'pagos', name: 'Pagos y Facturación', icon: 'credit-card' },
  { id: 'cuenta', name: 'Mi Cuenta', icon: 'user' },
  { id: 'general', name: 'General', icon: 'help-circle' },
]

export const faqData: FAQItem[] = [
  // Envíos y Logística
  {
    id: 1,
    category: 'envios',
    question: '¿Cuál es el tiempo de entrega para envíos nacionales?',
    answer: 'Los tiempos de entrega varían según el destino. Para las principales ciudades (CDMX, Monterrey, Guadalajara) ofrecemos entrega en 1-2 días hábiles. Para el resto del país, los tiempos oscilan entre 3-5 días hábiles dependiendo de la zona.',
  },
  {
    id: 2,
    category: 'envios',
    question: '¿Ofrecen servicio de recolección a domicilio?',
    answer: 'Sí, ofrecemos servicio de recolección a domicilio sin costo adicional en zonas urbanas. Puedes programar tu recolección al momento de generar tu guía o llamando a nuestro centro de atención.',
  },
  {
    id: 3,
    category: 'envios',
    question: '¿Qué zonas tienen cobertura?',
    answer: 'Contamos con cobertura en los 32 estados de la República Mexicana, con más de 500 ciudades y 10,000 puntos de entrega. Consulta nuestra sección de cobertura para verificar tu código postal.',
  },
  {
    id: 4,
    category: 'envios',
    question: '¿Cuál es el peso y tamaño máximo que puedo enviar?',
    answer: 'Para paquetería express, el peso máximo es de 70 kg y las dimensiones máximas son 150 cm x 100 cm x 100 cm. Para envíos más grandes, contamos con servicios de carga consolidada y fleteo.',
  },
  {
    id: 5,
    category: 'envios',
    question: '¿Qué artículos están prohibidos para envío?',
    answer: 'Están prohibidos: sustancias peligrosas, materiales inflamables, armas, drogas ilegales, animales vivos, dinero en efectivo, y artículos perecederos sin empaque adecuado. Consulta nuestra lista completa de restricciones.',
  },

  // Rastreo de Paquetes
  {
    id: 6,
    category: 'rastreo',
    question: '¿Cómo puedo rastrear mi paquete?',
    answer: 'Puedes rastrear tu paquete ingresando tu número de guía en la sección Track de nuestro sitio web. También puedes rastrear por email si proporcionaste tu correo al generar la guía.',
  },
  {
    id: 7,
    category: 'rastreo',
    question: '¿Con qué frecuencia se actualiza la información de rastreo?',
    answer: 'La información de rastreo se actualiza en tiempo real. Cada vez que tu paquete pasa por un punto de control o cambia de estatus, la información se refleja inmediatamente en el sistema.',
  },
  {
    id: 8,
    category: 'rastreo',
    question: '¿Puedo recibir notificaciones del estado de mi envío?',
    answer: 'Sí, al generar tu guía puedes activar notificaciones por email o SMS. Recibirás alertas automáticas cuando tu paquete sea recolectado, llegue a centros de distribución y sea entregado.',
  },
  {
    id: 9,
    category: 'rastreo',
    question: '¿Qué significa cada estatus de rastreo?',
    answer: '"Guía generada" significa que el envío está registrado. "Recolectado" indica que ya recogimos el paquete. "En tránsito" significa que está en camino al destino. "En reparto" indica que salió a entrega. "Entregado" confirma la entrega exitosa.',
  },

  // Empaques y Productos
  {
    id: 10,
    category: 'empaques',
    question: '¿Qué tipos de empaques venden?',
    answer: 'Ofrecemos una amplia variedad: cajas de cartón en todas las medidas, sobres acolchados, bolsas de mensajería, material de relleno (burbuja, espuma, papel kraft), cintas de empaque, etiquetas, y empaques ecológicos.',
  },
  {
    id: 11,
    category: 'empaques',
    question: '¿Venden empaques personalizados?',
    answer: 'Sí, ofrecemos servicio de empaques personalizados con tu logo o diseño. El pedido mínimo varía según el tipo de producto. Contacta a nuestro equipo de ventas para cotización.',
  },
  {
    id: 12,
    category: 'empaques',
    question: '¿Cuál es el pedido mínimo para empaques?',
    answer: 'Para compras en línea no hay pedido mínimo. Para empaques personalizados, el mínimo varía: cajas desde 100 piezas, bolsas desde 500 piezas, cintas desde 12 rollos.',
  },
  {
    id: 13,
    category: 'empaques',
    question: '¿Ofrecen empaques ecológicos?',
    answer: 'Sí, contamos con una línea completa de empaques ecológicos: cajas de cartón reciclado, relleno de papel kraft, bolsas biodegradables, cinta de papel kraft, y más opciones sustentables.',
  },

  // Pagos y Facturación
  {
    id: 14,
    category: 'pagos',
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencia bancaria, depósito en OXXO, y PayPal. Para clientes empresariales ofrecemos líneas de crédito.',
  },
  {
    id: 15,
    category: 'pagos',
    question: '¿Cómo solicito mi factura?',
    answer: 'Al realizar tu compra, selecciona la opción "Requiero factura" e ingresa tus datos fiscales. La factura se enviará automáticamente a tu correo en un plazo máximo de 24 horas.',
  },
  {
    id: 16,
    category: 'pagos',
    question: '¿Puedo solicitar factura después de mi compra?',
    answer: 'Sí, puedes solicitar tu factura hasta 7 días después de tu compra. Envía tu ticket de compra y datos fiscales a facturacion@ma-in.mx o solicítala desde tu cuenta.',
  },
  {
    id: 17,
    category: 'pagos',
    question: '¿Ofrecen crédito para empresas?',
    answer: 'Sí, ofrecemos líneas de crédito para clientes empresariales con volumen recurrente. Contacta a nuestro equipo comercial para conocer los requisitos y beneficios.',
  },

  // Mi Cuenta
  {
    id: 18,
    category: 'cuenta',
    question: '¿Cómo creo una cuenta?',
    answer: 'Puedes crear una cuenta desde el botón "Registrarse" en la parte superior de nuestro sitio. Solo necesitas tu email, nombre y crear una contraseña. También puedes registrarte con tu cuenta de Google.',
  },
  {
    id: 19,
    category: 'cuenta',
    question: '¿Cuáles son los beneficios de tener cuenta?',
    answer: 'Con una cuenta puedes: guardar direcciones frecuentes, ver historial de envíos, generar guías más rápido, acumular puntos para descuentos, y acceder a precios preferenciales.',
  },
  {
    id: 20,
    category: 'cuenta',
    question: '¿Olvidé mi contraseña, cómo la recupero?',
    answer: 'En la página de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?". Ingresa tu email registrado y te enviaremos un enlace para restablecer tu contraseña.',
  },

  // General
  {
    id: 21,
    category: 'general',
    question: '¿Cuál es el horario de atención?',
    answer: 'Nuestro horario de atención es de lunes a viernes de 8:00 a 14:00 y de 16:00 a 19:00. Los sábados atendemos de 9:00 a 14:00. Domingos y días festivos no laboramos.',
  },
  {
    id: 22,
    category: 'general',
    question: '¿Cómo puedo contactarlos?',
    answer: 'Puedes contactarnos por: teléfono al (777) 123-4567, WhatsApp al mismo número, email a contacto@ma-in.mx, o visitarnos en nuestras oficinas en Cuernavaca, Morelos.',
  },
  {
    id: 23,
    category: 'general',
    question: '¿Tienen sucursales físicas?',
    answer: 'Nuestra oficina principal está en Av. San Diego 426, Lomas de Vista Hermosa, Cuernavaca, Morelos. Además contamos con puntos de recepción en las principales ciudades del país.',
  },
  {
    id: 24,
    category: 'general',
    question: '¿Ofrecen servicio de atención al cliente?',
    answer: 'Sí, contamos con un equipo de atención al cliente disponible en horario de oficina. También puedes usar nuestro chat en línea o enviarnos un mensaje por WhatsApp para respuesta rápida.',
  },
]

export function getFAQByCategory(categoryId: string): FAQItem[] {
  return faqData.filter(item => item.category === categoryId)
}

export function searchFAQ(query: string): FAQItem[] {
  const normalizedQuery = query.toLowerCase().trim()
  return faqData.filter(
    item =>
      item.question.toLowerCase().includes(normalizedQuery) ||
      item.answer.toLowerCase().includes(normalizedQuery)
  )
}
