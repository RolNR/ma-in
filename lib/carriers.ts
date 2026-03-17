// URL base de rastreo por nombre de carrier
// MA-IN omitido — es carrier propio, no tiene rastreo externo
export const CARRIER_TRACKING_URLS: Record<string, string> = {
  'DHL':      'https://www.dhl.com/mx-es/home/tracking.html?tracking-id=',
  'FedEx':    'https://www.fedex.com/fedextrack/?trknbr=',
  'Estafeta': 'https://www.estafeta.com/herramientas/rastreo?wayBillType=1&wayBill=',
  'UPS':      'https://www.ups.com/track?loc=es_MX&tracknum=',
}

/**
 * Devuelve la URL de rastreo del carrier externo, o null si no aplica.
 * No aplica cuando: el carrier es MA-IN, no hay guía externa, o el carrier no está en el mapa.
 */
export function getCarrierTrackingUrl(
  carrierName: string,
  externalGuideNo: string | null | undefined,
): string | null {
  if (!externalGuideNo) return null
  const base = CARRIER_TRACKING_URLS[carrierName]
  return base ? `${base}${encodeURIComponent(externalGuideNo)}` : null
}
