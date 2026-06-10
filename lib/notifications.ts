import { db } from '@/lib/db'
import {
  sendShipmentCreatedEmail,
  sendShipmentStatusEmail,
  type StagnantShipmentRow,
} from '@/lib/email'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

export async function notifyShipmentCreated(shipmentId: string): Promise<void> {
  try {
    const shipment = await db.shipment.findUnique({
      where: { id: shipmentId },
      select: {
        trackingCode: true,
        recipientName: true,
        destCity: true,
        destState: true,
        shipmentDate: true,
        carrier: { select: { name: true } },
        client: { select: { companyName: true, email: true } },
      },
    })

    if (!shipment?.client?.email) return

    await sendShipmentCreatedEmail({
      clientEmail: shipment.client.email,
      clientName: shipment.client.companyName,
      trackingCode: shipment.trackingCode,
      recipientName: shipment.recipientName,
      destCity: shipment.destCity,
      destState: shipment.destState,
      shipmentDate: shipment.shipmentDate,
      carrierName: shipment.carrier.name,
    })
  } catch (err) {
    console.error('[notify] shipmentCreated:', err)
  }
}

export async function notifyShipmentStatus(
  shipmentId: string,
  prevStatus: ShipmentStatus,
): Promise<void> {
  try {
    const shipment = await db.shipment.findUnique({
      where: { id: shipmentId },
      select: {
        trackingCode: true,
        status: true,
        recipientName: true,
        destCity: true,
        destState: true,
        receivedBy: true,
        client: { select: { companyName: true, email: true } },
      },
    })

    if (!shipment?.client?.email) return

    await sendShipmentStatusEmail({
      clientEmail: shipment.client.email,
      clientName: shipment.client.companyName,
      trackingCode: shipment.trackingCode,
      prevStatus,
      newStatus: shipment.status,
      recipientName: shipment.recipientName,
      destCity: shipment.destCity,
      destState: shipment.destState,
      receivedBy: shipment.receivedBy,
    })
  } catch (err) {
    console.error('[notify] shipmentStatus:', err)
  }
}

export async function getStagnantShipments(dayThreshold = 3): Promise<StagnantShipmentRow[]> {
  const since = new Date(Date.now() - dayThreshold * 24 * 60 * 60 * 1000)

  const shipments = await db.shipment.findMany({
    where: {
      status: { in: ['PENDIENTE', 'EN_RUTA', 'EN_PROCESO_ENTREGA'] },
      archived: false,
      createdAt: { lt: since },
      events: { none: { occurredAt: { gte: since } } },
    },
    select: {
      id: true,
      trackingCode: true,
      status: true,
      createdAt: true,
      client: { select: { companyName: true } },
      events: {
        orderBy: { occurredAt: 'desc' },
        take: 1,
        select: { occurredAt: true },
      },
    },
    orderBy: { createdAt: 'asc' },
    take: 100,
  })

  const now = Date.now()
  return shipments.map((s) => {
    const lastActivity = s.events[0]?.occurredAt ?? s.createdAt
    const daysStagnant = Math.floor((now - lastActivity.getTime()) / (1000 * 60 * 60 * 24))
    return {
      id: s.id,
      trackingCode: s.trackingCode,
      clientName: s.client?.companyName ?? '—',
      status: s.status,
      daysStagnant,
    }
  })
}
