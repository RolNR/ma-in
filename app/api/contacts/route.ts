import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const clientId = parseInt(searchParams.get('clientId') ?? '')
  if (isNaN(clientId)) return NextResponse.json([])

  const contacts = await db.contact.findMany({
    where: { clientId },
    orderBy: { name: 'asc' },
    select: {
      id: true, name: true, nickname: true,
      street: true, city: true, state: true, postal: true, phone: true,
    },
  })

  return NextResponse.json(contacts)
}
