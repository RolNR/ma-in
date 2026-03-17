import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs'
export const maxDuration = 30

// PENDIENTE sin movimiento por 30 días → CADUCADA automáticamente
const AUTO_EXPIRE_DAYS = 30

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  const expireCutoff = new Date(now.getTime() - AUTO_EXPIRE_DAYS * 86_400_000)

  try {
    const toExpire = await db.shipment.findMany({
      where: { status: 'PENDIENTE', archived: false, updatedAt: { lt: expireCutoff } },
      select: { id: true },
    })

    let expired = 0
    if (toExpire.length > 0) {
      const ids = toExpire.map(s => s.id)
      await db.$transaction([
        db.shipment.updateMany({ where: { id: { in: ids } }, data: { status: 'CADUCADA' } }),
        db.shipmentEvent.createMany({
          data: ids.map(shipmentId => ({
            shipmentId,
            status: 'CADUCADA',
            description: `Guía expirada automáticamente tras ${AUTO_EXPIRE_DAYS} días sin movimiento.`,
          })),
        }),
      ])
      expired = ids.length
    }

    return NextResponse.json({ ok: true, expired, runAt: now.toISOString() })
  } catch (error) {
    console.error('[cron/stale-check]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
