import { NextRequest, NextResponse } from 'next/server'
import { getStagnantShipments } from '@/lib/notifications'
import { sendStagnantShipmentAlert } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const stagnant = await getStagnantShipments(3)

    if (stagnant.length === 0) {
      return NextResponse.json({ ok: true, sent: false, message: 'Sin guías estancadas.' })
    }

    await sendStagnantShipmentAlert(stagnant)

    return NextResponse.json({ ok: true, sent: true, count: stagnant.length })
  } catch (err) {
    console.error('[cron/stagnant]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
