import { NextRequest, NextResponse } from 'next/server'
import { searchShipmentByTrackingNumber } from '@/lib/knack'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const trackingNumber = searchParams.get('trackingNumber')

  if (!trackingNumber) {
    return NextResponse.json(
      { error: 'Se requiere un número de guía' },
      { status: 400 }
    )
  }

  if (trackingNumber.length < 3) {
    return NextResponse.json(
      { error: 'El número de guía debe tener al menos 3 caracteres' },
      { status: 400 }
    )
  }

  try {
    const shipment = await searchShipmentByTrackingNumber(trackingNumber)

    if (!shipment) {
      return NextResponse.json(
        { error: 'Envío no encontrado', found: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      found: true,
      shipment,
    })
  } catch (error) {
    console.error('Error searching shipment:', error)
    return NextResponse.json(
      { error: 'Error al consultar el servicio de rastreo' },
      { status: 500 }
    )
  }
}
