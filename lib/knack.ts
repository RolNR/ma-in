/**
 * Cliente API de Knack para rastreo de envíos
 *
 * Objeto: object_2 (Guías)
 * Búsqueda por: field_98 (Código de rastreo)
 */

const KNACK_APP_ID = process.env.NEXT_PUBLIC_KNACK_APP_ID || ''
const KNACK_API_KEY = process.env.KNACK_API_KEY || ''
const KNACK_API_BASE = 'https://api.knack.com/v1'

const SHIPMENT_OBJECT = 'object_2'

const FIELDS = {
  trackingCode: 'field_98',    // Código de rastreo
  status: 'field_101',         // Estatus
  guideType: 'field_103',      // Tipo guía (ECONOMY / EXPRESS)
  sender: 'field_104',         // Remitente
  receivedBy: 'field_15',      // Recibido por
  originAddress: 'field_100',  // Dirección remitente
  destAddress: 'field_99',     // Dirección consignatario
  content: 'field_97',         // Contenido
  date: 'field_43',            // Fecha
  carrier: 'field_94',         // Carrier
} as const

export interface KnackShipment {
  id: string
  trackingCode: string
  status: string
  guideType: string
  sender: string
  receivedBy: string
  originCity: string
  destCity: string
  content: string
  date: string
  carrier: string
}

interface KnackRecord {
  id: string
  [key: string]: unknown
}

interface KnackResponse {
  total_pages: number
  current_page: number
  total_records: number
  records: KnackRecord[]
}

function getHeaders(): HeadersInit {
  return {
    'X-Knack-Application-Id': KNACK_APP_ID,
    'X-Knack-REST-API-Key': KNACK_API_KEY,
    'Content-Type': 'application/json',
  }
}

function getRawValue(fieldValue: unknown): string {
  if (fieldValue === null || fieldValue === undefined) return ''
  if (typeof fieldValue === 'string') return fieldValue
  if (typeof fieldValue === 'object' && fieldValue !== null) {
    const obj = fieldValue as Record<string, unknown>
    if ('raw' in obj) return String(obj.raw ?? '')
    if ('formatted' in obj) return String(obj.formatted ?? '')
  }
  return String(fieldValue)
}

function getAddressCity(fieldValue: unknown): string {
  if (fieldValue === null || fieldValue === undefined) return ''
  if (typeof fieldValue === 'object' && fieldValue !== null) {
    const obj = fieldValue as Record<string, unknown>
    const city = obj.city ? String(obj.city) : ''
    const state = obj.state ? String(obj.state) : ''
    if (city && state) return `${city}, ${state}`
    return city || state || ''
  }
  return ''
}

function getDateFormatted(fieldValue: unknown): string {
  if (fieldValue === null || fieldValue === undefined) return ''
  if (typeof fieldValue === 'string') return fieldValue
  if (typeof fieldValue === 'object' && fieldValue !== null) {
    const obj = fieldValue as Record<string, unknown>
    if ('date_formatted' in obj) return String(obj.date_formatted ?? '')
    if ('date' in obj) return String(obj.date ?? '')
  }
  return String(fieldValue)
}

function mapRecordToShipment(record: KnackRecord): KnackShipment {
  return {
    id: record.id,
    trackingCode: getRawValue(record[FIELDS.trackingCode]),
    status: getRawValue(record[FIELDS.status]),
    guideType: getRawValue(record[FIELDS.guideType]),
    sender: getRawValue(record[FIELDS.sender]),
    receivedBy: getRawValue(record[FIELDS.receivedBy]),
    originCity: getAddressCity(record[`${FIELDS.originAddress}_raw`]),
    destCity: getAddressCity(record[`${FIELDS.destAddress}_raw`]),
    content: getRawValue(record[FIELDS.content]),
    date: getDateFormatted(record[`${FIELDS.date}_raw`]),
    carrier: getRawValue(record[FIELDS.carrier]),
  }
}

/**
 * Busca un envío por código de rastreo en Knack
 */
export async function searchShipmentByTrackingNumber(
  trackingCode: string
): Promise<KnackShipment | null> {
  const filters = encodeURIComponent(
    JSON.stringify({
      match: 'and',
      rules: [
        {
          field: FIELDS.trackingCode,
          operator: 'is',
          value: trackingCode,
        },
      ],
    })
  )

  const url = `${KNACK_API_BASE}/objects/${SHIPMENT_OBJECT}/records?filters=${filters}&rows_per_page=1`

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Knack API error: ${response.status} - ${errorText}`)
  }

  const data: KnackResponse = await response.json()

  if (data.records.length === 0) {
    return null
  }

  return mapRecordToShipment(data.records[0])
}
