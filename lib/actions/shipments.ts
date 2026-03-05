'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { customAlphabet } from 'nanoid'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

// Alfanumérico sin caracteres confusos (0/O, 1/I)
const genCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 12)

export type CreateShipmentState =
  | { status: 'idle' }
  | { status: 'error'; message: string }
  | { status: 'success'; count: number; batchId?: string; firstId?: string }

function str(fd: FormData, key: string): string | null {
  return (fd.get(key) as string)?.trim() || null
}

export async function createShipment(
  prevState: CreateShipmentState,
  formData: FormData,
): Promise<CreateShipmentState> {
  const session = await auth()
  if (!session) return { status: 'error', message: 'No autenticado.' }

  const carrierId = parseInt(formData.get('carrierId') as string)
  if (!carrierId || isNaN(carrierId)) return { status: 'error', message: 'Selecciona un carrier.' }

  const quantity = Math.min(50, Math.max(1, parseInt(formData.get('quantity') as string || '1')))
  const status: ShipmentStatus = 'PENDIENTE'
  const clientId = formData.get('clientId') ? parseInt(formData.get('clientId') as string) : null
  const createdBy = parseInt(session.user.id)

  const data = {
    carrierId,
    clientId,
    createdBy,
    status,
    guideType:      str(formData, 'guideType'),
    senderName:     str(formData, 'senderName'),
    originStreet:   str(formData, 'originStreet'),
    originCity:     str(formData, 'originCity'),
    originState:    str(formData, 'originState'),
    originPostal:   str(formData, 'originPostal'),
    recipientName:  str(formData, 'recipientName'),
    destStreet:     str(formData, 'destStreet'),
    destCity:       str(formData, 'destCity'),
    destState:      str(formData, 'destState'),
    destPostal:     str(formData, 'destPostal'),
    destAbbr:       str(formData, 'destAbbr'),
    content:        str(formData, 'content'),
    weight:         formData.get('weight') ? parseFloat(formData.get('weight') as string) : undefined,
    shipmentDate:   formData.get('shipmentDate') ? new Date(formData.get('shipmentDate') as string) : new Date(),
  }

  // Generar códigos únicos
  async function uniqueCode(): Promise<string> {
    for (let i = 0; i < 10; i++) {
      const code = genCode()
      const exists = await db.shipment.findUnique({ where: { trackingCode: code } })
      if (!exists) return code
    }
    throw new Error('No se pudo generar un código único.')
  }

  try {
    if (quantity === 1) {
      const trackingCode = await uniqueCode()
      const shipment = await db.$transaction(async (tx) => {
        const s = await tx.shipment.create({ data: { ...data, trackingCode } })
        if (status !== 'PENDIENTE') {
          await tx.shipmentEvent.create({
            data: { shipmentId: s.id, status, description: 'Guía creada', updatedBy: createdBy },
          })
        }
        return s
      })
      redirect(`/admin/guias/${shipment.id}`)
    }

    // Lote (quantity > 1)
    const codes = await Promise.all(Array.from({ length: quantity }, () => uniqueCode()))

    const batch = await db.$transaction(async (tx) => {
      const b = await tx.batch.create({
        data: { clientId, createdBy, guideCount: quantity },
      })
      await tx.shipment.createMany({
        data: codes.map(trackingCode => ({ ...data, trackingCode, batchId: b.id })),
      })
      if (status !== 'PENDIENTE') {
        const created = await tx.shipment.findMany({
          where: { batchId: b.id },
          select: { id: true },
        })
        await tx.shipmentEvent.createMany({
          data: created.map(s => ({
            shipmentId: s.id,
            status,
            description: 'Guía creada',
            updatedBy: createdBy,
          })),
        })
      }
      return b
    })

    revalidatePath('/admin/guias')
    return { status: 'success', count: quantity, batchId: batch.id }
  } catch (error: unknown) {
    if ((error as { digest?: string }).digest) throw error
    console.error('[createShipment]', error)
    return { status: 'error', message: 'Error al crear la guía. Intenta de nuevo.' }
  }
}

type UpdateStatusState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export async function updateShipmentStatus(
  shipmentId: string,
  status: ShipmentStatus,
  description?: string,
): Promise<UpdateStatusState> {
  const session = await auth()
  if (!session) return { status: 'error', message: 'No autenticado.' }

  const updatedBy = parseInt(session.user.id)

  try {
    await db.$transaction(async (tx) => {
      await tx.shipment.update({ where: { id: shipmentId }, data: { status } })
      await tx.shipmentEvent.create({
        data: {
          shipmentId,
          status,
          description: description?.trim() || null,
          updatedBy,
        },
      })
    })

    revalidatePath(`/admin/guias/${shipmentId}`)
    return { status: 'success' }
  } catch (error) {
    console.error('[updateShipmentStatus]', error)
    return { status: 'error', message: 'Error al actualizar el status.' }
  }
}
