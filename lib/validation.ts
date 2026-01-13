/**
 * Esquemas de validación para formularios
 */

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Funciones de validación base
export const validators = {
  required: (value: string, fieldName: string): ValidationError | null => {
    if (!value || value.trim() === '') {
      return { field: fieldName, message: `${fieldName} es requerido` }
    }
    return null
  },

  email: (value: string): ValidationError | null => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value && !emailRegex.test(value)) {
      return { field: 'email', message: 'Ingresa un email válido' }
    }
    return null
  },

  phone: (value: string): ValidationError | null => {
    if (!value) return null
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length > 0 && cleaned.length !== 10 && !(cleaned.length === 12 && cleaned.startsWith('52'))) {
      return { field: 'phone', message: 'Ingresa un teléfono válido (10 dígitos)' }
    }
    return null
  },

  minLength: (value: string, min: number, fieldName: string): ValidationError | null => {
    if (value && value.trim().length < min) {
      return { field: fieldName, message: `${fieldName} debe tener al menos ${min} caracteres` }
    }
    return null
  },

  maxLength: (value: string, max: number, fieldName: string): ValidationError | null => {
    if (value && value.trim().length > max) {
      return { field: fieldName, message: `${fieldName} no puede exceder ${max} caracteres` }
    }
    return null
  },

  trackingNumber: (value: string): ValidationError | null => {
    if (!value || value.trim() === '') {
      return { field: 'trackingNumber', message: 'El número de guía es requerido' }
    }
    // Formato esperado: letras y números, mínimo 8 caracteres
    const trackingRegex = /^[A-Za-z0-9]{8,}$/
    if (!trackingRegex.test(value.trim())) {
      return { field: 'trackingNumber', message: 'Ingresa un número de guía válido' }
    }
    return null
  },

  postalCode: (value: string): ValidationError | null => {
    if (!value) return null
    const postalRegex = /^\d{5}$/
    if (!postalRegex.test(value)) {
      return { field: 'postalCode', message: 'Código postal inválido (5 dígitos)' }
    }
    return null
  },
}

// Esquema de validación para formulario de contacto
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: ValidationError[] = []

  const nameRequired = validators.required(data.name, 'Nombre')
  if (nameRequired) errors.push(nameRequired)

  const emailRequired = validators.required(data.email, 'Email')
  if (emailRequired) errors.push(emailRequired)
  else {
    const emailValid = validators.email(data.email)
    if (emailValid) errors.push(emailValid)
  }

  if (data.phone) {
    const phoneValid = validators.phone(data.phone)
    if (phoneValid) errors.push(phoneValid)
  }

  const subjectRequired = validators.required(data.subject, 'Asunto')
  if (subjectRequired) errors.push(subjectRequired)

  const messageRequired = validators.required(data.message, 'Mensaje')
  if (messageRequired) errors.push(messageRequired)
  else {
    const messageMin = validators.minLength(data.message, 10, 'Mensaje')
    if (messageMin) errors.push(messageMin)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Esquema de validación para formulario de cotización
export interface QuoteFormData {
  name: string
  email: string
  phone: string
  company?: string
  originCity: string
  originPostalCode: string
  destinationCity: string
  destinationPostalCode: string
  packageType: string
  weight: string
  dimensions?: string
  description?: string
}

export function validateQuoteForm(data: QuoteFormData): ValidationResult {
  const errors: ValidationError[] = []

  const nameRequired = validators.required(data.name, 'Nombre')
  if (nameRequired) errors.push(nameRequired)

  const emailRequired = validators.required(data.email, 'Email')
  if (emailRequired) errors.push(emailRequired)
  else {
    const emailValid = validators.email(data.email)
    if (emailValid) errors.push(emailValid)
  }

  const phoneRequired = validators.required(data.phone, 'Teléfono')
  if (phoneRequired) errors.push(phoneRequired)
  else {
    const phoneValid = validators.phone(data.phone)
    if (phoneValid) errors.push(phoneValid)
  }

  const originCityRequired = validators.required(data.originCity, 'Ciudad de origen')
  if (originCityRequired) errors.push(originCityRequired)

  const originPostalRequired = validators.required(data.originPostalCode, 'CP origen')
  if (originPostalRequired) errors.push(originPostalRequired)
  else {
    const originPostalValid = validators.postalCode(data.originPostalCode)
    if (originPostalValid) errors.push(originPostalValid)
  }

  const destCityRequired = validators.required(data.destinationCity, 'Ciudad de destino')
  if (destCityRequired) errors.push(destCityRequired)

  const destPostalRequired = validators.required(data.destinationPostalCode, 'CP destino')
  if (destPostalRequired) errors.push(destPostalRequired)
  else {
    const destPostalValid = validators.postalCode(data.destinationPostalCode)
    if (destPostalValid) errors.push(destPostalValid)
  }

  const packageRequired = validators.required(data.packageType, 'Tipo de paquete')
  if (packageRequired) errors.push(packageRequired)

  const weightRequired = validators.required(data.weight, 'Peso')
  if (weightRequired) errors.push(weightRequired)

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Esquema de validación para rastreo
export interface TrackingFormData {
  trackingNumber: string
}

export function validateTrackingForm(data: TrackingFormData): ValidationResult {
  const errors: ValidationError[] = []

  const trackingValid = validators.trackingNumber(data.trackingNumber)
  if (trackingValid) errors.push(trackingValid)

  return {
    isValid: errors.length === 0,
    errors,
  }
}
