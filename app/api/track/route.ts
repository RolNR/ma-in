import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const trackingNumber = request.nextUrl.searchParams.get('trackingNumber')

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
    const shipment = await db.shipment.findUnique({
      where: { trackingCode: trackingNumber },
      select: {
        trackingCode: true,
        status:       true,
        guideType:    true,
        senderName:   true,
        originCity:   true,
        originState:  true,
        recipientName: true,
        destZone:     true,
        destCity:     true,
        destState:    true,
        destAbbr:     true,
        content:      true,
        receivedBy:   true,
        shipmentDate: true,
        carrier: {
          select: { name: true },
        },
        events: {
          orderBy: { occurredAt: 'desc' },
          select: {
            status:      true,
            description: true,
            location:    true,
            occurredAt:  true,
          },
        },
      },
    })

    if (!shipment) {
      return NextResponse.json(
        { error: 'Envío no encontrado', found: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      found: true,
      shipment: {
        trackingCode:  shipment.trackingCode,
        status:        shipment.status,
        guideType:     shipment.guideType,
        sender:        shipment.senderName,
        originCity:    [shipment.originCity, shipment.originState].filter(Boolean).join(', '),
        destCity:      shipment.destZone ?? [shipment.destCity, shipment.destState].filter(Boolean).join(', '),
        destAbbr:      shipment.destAbbr,
        receivedBy:    shipment.receivedBy,
        content:       shipment.content,
        date:          shipment.shipmentDate,
        carrier:       shipment.carrier.name,
        events:        shipment.events,
      },
    })
  } catch (error) {
    console.error('Error searching shipment:', error)
    return NextResponse.json(
      { error: 'Error al consultar el servicio de rastreo' },
      { status: 500 }
    )
  }
}
