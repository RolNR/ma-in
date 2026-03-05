'use server'

import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { generatePassword } from '@/lib/utils'

type CreateClientState =
  | { status: 'idle' }
  | { status: 'success'; password: string; clientId: number }
  | { status: 'error'; message: string }

export async function createClient(
  prevState: CreateClientState,
  formData: FormData,
): Promise<CreateClientState> {
  const companyName = formData.get('companyName') as string
  const email = formData.get('email') as string
  const contactName = formData.get('contactName') as string | null
  const rfc = formData.get('rfc') as string | null
  const phone = formData.get('phone') as string | null

  if (!companyName?.trim()) return { status: 'error', message: 'El nombre de la empresa es requerido.' }
  if (!email?.trim()) return { status: 'error', message: 'El email es requerido.' }

  const normalizedEmail = email.trim().toLowerCase()

  // Verificar duplicado antes de entrar a la transacción
  const [existingUser, existingClient] = await Promise.all([
    db.user.findUnique({ where: { email: normalizedEmail }, select: { id: true } }),
    db.client.findFirst({ where: { email: normalizedEmail }, select: { id: true } }),
  ])
  if (existingUser || existingClient) {
    return { status: 'error', message: 'Ya existe un cliente o usuario con ese email.' }
  }

  const password = generatePassword(10)
  const passwordHash = await bcrypt.hash(password, 10)

  try {
    const result = await db.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: {
          companyName: companyName.trim(),
          email: normalizedEmail,
          contactName: contactName?.trim() || null,
          rfc: rfc?.trim() || null,
          phone: phone?.trim() || null,
        },
      })

      await tx.user.create({
        data: {
          name: contactName?.trim() || companyName.trim(),
          email: normalizedEmail,
          passwordHash,
          role: 'client',
          clientId: client.id,
        },
      })

      return client
    })

    revalidatePath('/admin/clientes')
    return { status: 'success', password, clientId: result.id }
  } catch (error: unknown) {
    console.error('[createClient]', error)
    return { status: 'error', message: 'Error al crear el cliente. Intenta de nuevo.' }
  }
}

// ─── Reset password ───────────────────────────────────────────────────────────

export type ResetPasswordState =
  | { status: 'idle' }
  | { status: 'success'; password: string }
  | { status: 'error'; message: string }

export async function resetClientPassword(
  prevState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const userId = parseInt(formData.get('userId') as string)
  if (!userId || isNaN(userId)) return { status: 'error', message: 'ID de usuario inválido.' }

  const password = generatePassword(10)
  const passwordHash = await bcrypt.hash(password, 10)

  try {
    await db.user.update({ where: { id: userId }, data: { passwordHash } })
    return { status: 'success', password }
  } catch (error) {
    console.error('[resetClientPassword]', error)
    return { status: 'error', message: 'Error al regenerar la contraseña.' }
  }
}

type UpdateClientState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string }

export async function updateClient(
  prevState: UpdateClientState,
  formData: FormData,
): Promise<UpdateClientState> {
  const id = parseInt(formData.get('id') as string)
  const companyName = formData.get('companyName') as string
  const contactName = formData.get('contactName') as string | null
  const rfc = formData.get('rfc') as string | null
  const phone = formData.get('phone') as string | null

  if (!id || isNaN(id)) return { status: 'error', message: 'ID inválido.' }
  if (!companyName?.trim()) return { status: 'error', message: 'El nombre de la empresa es requerido.' }

  try {
    await db.client.update({
      where: { id },
      data: {
        companyName: companyName.trim(),
        contactName: contactName?.trim() || null,
        rfc: rfc?.trim() || null,
        phone: phone?.trim() || null,
      },
    })

    revalidatePath(`/admin/clientes/${id}`)
    revalidatePath('/admin/clientes')
    return { status: 'success' }
  } catch (error) {
    console.error('[updateClient]', error)
    return { status: 'error', message: 'Error al actualizar el cliente.' }
  }
}

export async function toggleClientActive(id: number, active: boolean) {
  await db.$transaction(async (tx) => {
    await tx.client.update({ where: { id }, data: { active } })
    await tx.user.updateMany({ where: { clientId: id }, data: { active } })
  })
  revalidatePath(`/admin/clientes/${id}`)
  revalidatePath('/admin/clientes')
}
