'use server'

import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

type Result = { status: 'success' } | { status: 'error'; message: string }

function str(fd: FormData, key: string): string | null {
  return (fd.get(key) as string)?.trim() || null
}

export async function createContact(clientId: number | null, formData: FormData): Promise<Result> {
  const session = await auth()
  if (!session) return { status: 'error', message: 'No autenticado.' }

  const name = str(formData, 'name')
  if (!name) return { status: 'error', message: 'El nombre es requerido.' }

  await db.contact.create({
    data: {
      clientId: clientId ?? null,
      name,
      nickname: str(formData, 'nickname'),
      street:   str(formData, 'street'),
      city:     str(formData, 'city'),
      state:    str(formData, 'state'),
      postal:   str(formData, 'postal'),
      phone:    str(formData, 'phone'),
    },
  })

  if (clientId) revalidatePath(`/admin/clientes/${clientId}`)
  return { status: 'success' }
}

export async function deleteContact(id: number, clientId: number | null): Promise<Result> {
  const session = await auth()
  if (!session) return { status: 'error', message: 'No autenticado.' }

  await db.contact.delete({ where: { id } })

  if (clientId) revalidatePath(`/admin/clientes/${clientId}`)
  return { status: 'success' }
}
