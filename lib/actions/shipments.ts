'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

type CreateShipmentState =
  | { status: 'idle' }
  | { status: 'error'; message: string }

export async function createShipment(
  prevState: CreateShipmentState,
  formData: FormData,
): Promise<CreateShipmentState> {
  const session = await auth()
  if (!session) return { status: 'error', message: 'No autenticado.' }

  const trackingCode = (formData.get('trackingCode') as string)?.trim().toUpperCase()
  const carrierId = parseInt(formData.get('carrierId') as string)
  const status = (formData.get('status') as ShipmentStatus) || 'PENDIENTE'
  const clientId = formData.get('clientId') ? parseInt(formData.get('clientId') as string) : null

  const senderName = (formData.get('senderName') as string)?.trim() || null
  const originCity = (formData.get('originCity') as string)?.trim() || null
  const originState = (formData.get('originState') as string)?.trim() || null

  const recipientName = (formData.get('recipientName') as string)?.trim() || null
  const destCity = (formData.get('destCity') as string)?.trim() || null
  const destState = (formData.get('destState') as string)?.trim() || null
  const destPostal = (formData.get('destPostal') as string)?.trim() || null

  const content = (formData.get('content') as string)?.trim() || null
  const weight = formData.get('weight') ? parseFloat(formData.get('weight') as string) : null
  const shipmentDate = formData.get('shipmentDate')
    ? new Date(formData.get('shipmentDate') as string)
    : new Date()

  if (!trackingCode) return { status: 'error', message: 'El código de guía es requerido.' }
  if (!carrierId || isNaN(carrierId)) return { status: 'error', message: 'Selecciona un carrier.' }

  try {
    const existing = await db.shipment.findUnique({ where: { trackingCode } })
    if (existing) return { status: 'error', message: 'Ya existe una guía con ese código de rastreo.' }

    const createdBy = parseInt(session.user.id)

    const shipment = await db.$transaction(async (tx) => {
      const s = await tx.shipment.create({
        data: {
          trackingCode,
          carrierId,
          clientId,
          createdBy,
          status,
          senderName,
          originCity,
          originState,
          recipientName,
          destCity,
          destState,
          destPostal,
          content,
          weight: weight ?? undefined,
          shipmentDate,
        },
      })

      if (status !== 'PENDIENTE') {
        await tx.shipmentEvent.create({
          data: {
            shipmentId: s.id,
            status,
            description: 'Guía creada',
            updatedBy: createdBy,
          },
        })
      }

      return s
    })

    redirect(`/admin/guias/${shipment.id}`)
  } catch (error: unknown) {
    // Re-throw Next.js redirect/notFound errors
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
