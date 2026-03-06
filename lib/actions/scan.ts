'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

export type ScanResult =
  | { status: 'success' }
  | { status: 'error'; message: string }

export async function updateFromScan(
  shipmentId: string,
  newStatus: ShipmentStatus,
  receivedBy: string | null,
  description: string | null,
  signatureDataUrl: string | null,
  photoDataUrl: string | null,
): Promise<ScanResult> {
  try {
    await db.$transaction(async (tx) => {
      await tx.shipment.update({
        where: { id: shipmentId },
        data: {
          status: newStatus,
          ...(receivedBy ? { receivedBy } : {}),
        },
      })

      await tx.shipmentEvent.create({
        data: {
          shipmentId,
          status: newStatus,
          description: description?.trim() || null,
          updatedBy: null, // public action, no session
        },
      })

      if (signatureDataUrl) {
        await tx.shipmentEvidence.create({
          data: { shipmentId, type: 'signature', fileUrl: signatureDataUrl },
        })
      }

      if (photoDataUrl) {
        await tx.shipmentEvidence.create({
          data: { shipmentId, type: 'photo', fileUrl: photoDataUrl },
        })
      }
    })

    revalidatePath(`/admin/guias/${shipmentId}`)
    return { status: 'success' }
  } catch (error) {
    console.error('[updateFromScan]', error)
    return { status: 'error', message: 'Error al guardar. Intenta de nuevo.' }
  }
}
