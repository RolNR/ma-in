'use server'

import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
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
  const legalName = formData.get('legalName') as string | null
  const email = formData.get('email') as string
  const contactName = formData.get('contactName') as string | null
  const rfc = formData.get('rfc') as string | null
  const phone = formData.get('phone') as string | null
  const street = formData.get('street') as string | null
  const city = formData.get('city') as string | null
  const state = formData.get('state') as string | null
  const postal = formData.get('postal') as string | null

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
          legalName: legalName?.trim() || null,
          email: normalizedEmail,
          contactName: contactName?.trim() || null,
          rfc: rfc?.trim() || null,
          phone: phone?.trim() || null,
          street: street?.trim() || null,
          city: city?.trim() || null,
          state: state?.trim() || null,
          postal: postal?.trim() || null,
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
  const legalName = formData.get('legalName') as string | null
  const contactName = formData.get('contactName') as string | null
  const rfc = formData.get('rfc') as string | null
  const phone = formData.get('phone') as string | null
  const street = formData.get('street') as string | null
  const city = formData.get('city') as string | null
  const state = formData.get('state') as string | null
  const postal = formData.get('postal') as string | null

  if (!id || isNaN(id)) return { status: 'error', message: 'ID inválido.' }
  if (!companyName?.trim()) return { status: 'error', message: 'El nombre de la empresa es requerido.' }

  try {
    await db.client.update({
      where: { id },
      data: {
        companyName: companyName.trim(),
        legalName: legalName?.trim() || null,
        contactName: contactName?.trim() || null,
        rfc: rfc?.trim() || null,
        phone: phone?.trim() || null,
        street: street?.trim() || null,
        city: city?.trim() || null,
        state: state?.trim() || null,
        postal: postal?.trim() || null,
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

export async function deleteClient(id: number): Promise<{ status: 'success' } | { status: 'error'; message: string }> {
  const session = await auth()
  if (!session) return { status: 'error', message: 'No autenticado.' }
  if (session.user.role !== 'admin') return { status: 'error', message: 'Sin permisos.' }

  try {
    await db.$transaction(async (tx) => {
      await tx.contact.deleteMany({ where: { clientId: id } })
      await tx.user.deleteMany({ where: { clientId: id } })
      await tx.shipment.updateMany({ where: { clientId: id }, data: { clientId: null } })
      await tx.batch.updateMany({ where: { clientId: id }, data: { clientId: null } })
      await tx.client.delete({ where: { id } })
    })
    revalidatePath('/admin/clientes')
    return { status: 'success' }
  } catch (error) {
    console.error('[deleteClient]', error)
    return { status: 'error', message: 'Error al eliminar el cliente.' }
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

// ─── Import from Knack CSV ────────────────────────────────────────────────────

export interface ClientImportRow {
  companyName: string
  name: string
  email: string
  passwordHash: string
}

export type ImportClientsState =
  | { status: 'idle' }
  | { status: 'success'; imported: number; skipped: number; errors: number }
  | { status: 'error'; message: string }

export async function importClients(
  prevState: ImportClientsState,
  formData: FormData,
): Promise<ImportClientsState> {
  const session = await auth()
  if (!session || session.user.role !== 'admin') {
    return { status: 'error', message: 'Sin permisos.' }
  }

  const rawJson = formData.get('rowsJson') as string
  if (!rawJson) return { status: 'error', message: 'No se recibieron datos.' }

  let rows: ClientImportRow[]
  try {
    rows = JSON.parse(rawJson)
  } catch {
    return { status: 'error', message: 'Error al procesar los datos.' }
  }

  if (!rows.length) return { status: 'error', message: 'No hay filas válidas para importar.' }

  // Bulk-check existing emails in User + Client tables
  const emails = rows.map(r => r.email)
  const [existingUsers, existingClients] = await Promise.all([
    db.user.findMany({ where: { email: { in: emails } }, select: { email: true } }),
    db.client.findMany({ where: { email: { in: emails } }, select: { email: true } }),
  ])
  const existingEmails = new Set([
    ...existingUsers.map(u => u.email),
    ...existingClients.map(c => c.email).filter(Boolean) as string[],
  ])

  const toImport = rows.filter(r => !existingEmails.has(r.email))
  const skipped = rows.length - toImport.length

  if (!toImport.length) {
    revalidatePath('/admin/clientes')
    return { status: 'success', imported: 0, skipped, errors: 0 }
  }

  let imported = 0
  let errors = 0

  for (const row of toImport) {
    try {
      await db.$transaction(async (tx) => {
        const client = await tx.client.create({
          data: {
            companyName: row.companyName,
            email: row.email,
            contactName: row.name || null,
          },
        })
        await tx.user.create({
          data: {
            name: row.name || row.companyName,
            email: row.email,
            passwordHash: row.passwordHash,
            role: 'client',
            clientId: client.id,
          },
        })
      })
      imported++
    } catch {
      errors++
    }
  }

  revalidatePath('/admin/clientes')
  return { status: 'success', imported, skipped, errors }
}
