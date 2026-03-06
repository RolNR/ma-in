'use server'

import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { customAlphabet } from 'nanoid'
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import type { UserRole } from '@/lib/generated/prisma/client'

const genPassword = customAlphabet('abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789', 10)

type ActionResult =
  | { status: 'success'; password?: string }
  | { status: 'error'; message: string }

async function requireAdmin(): Promise<{ ok: true } | { ok: false; error: ActionResult }> {
  const session = await auth()
  if (!session) return { ok: false, error: { status: 'error', message: 'No autenticado.' } }
  if (session.user.role !== 'admin') return { ok: false, error: { status: 'error', message: 'Sin permisos.' } }
  return { ok: true }
}

export async function createUser(formData: FormData): Promise<ActionResult> {
  const check = await requireAdmin()
  if (!check.ok) return check.error

  const name  = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const role  = (formData.get('role') as UserRole)

  if (!name || !email || !role) return { status: 'error', message: 'Todos los campos son obligatorios.' }

  const existing = await db.user.findUnique({ where: { email }, select: { id: true } })
  if (existing) return { status: 'error', message: 'Ya existe un usuario con ese correo.' }

  const password = genPassword()
  const passwordHash = await bcrypt.hash(password, 10)

  await db.user.create({ data: { name, email, passwordHash, role } })
  revalidatePath('/admin/usuarios')
  return { status: 'success', password }
}

export async function resetUserPassword(userId: number): Promise<ActionResult> {
  const check = await requireAdmin()
  if (!check.ok) return check.error

  const password = genPassword()
  const passwordHash = await bcrypt.hash(password, 10)
  await db.user.update({ where: { id: userId }, data: { passwordHash } })
  return { status: 'success', password }
}

export async function toggleUserActive(userId: number): Promise<ActionResult> {
  const check = await requireAdmin()
  if (!check.ok) return check.error

  const user = await db.user.findUnique({ where: { id: userId }, select: { active: true } })
  if (!user) return { status: 'error', message: 'Usuario no encontrado.' }

  await db.user.update({ where: { id: userId }, data: { active: !user.active } })
  revalidatePath('/admin/usuarios')
  return { status: 'success' }
}

export async function changeOwnPassword(
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult> {
  const session = await auth()
  if (!session) return { status: 'error', message: 'No autenticado.' }

  const userId = parseInt(session.user.id)
  const user = await db.user.findUnique({ where: { id: userId }, select: { passwordHash: true } })
  if (!user) return { status: 'error', message: 'Usuario no encontrado.' }

  const valid = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!valid) return { status: 'error', message: 'La contraseña actual es incorrecta.' }

  if (newPassword.length < 8) return { status: 'error', message: 'La nueva contraseña debe tener al menos 8 caracteres.' }

  const passwordHash = await bcrypt.hash(newPassword, 10)
  await db.user.update({ where: { id: userId }, data: { passwordHash } })
  return { status: 'success' }
}

export async function changeUserRole(userId: number, role: UserRole): Promise<ActionResult> {
  const check = await requireAdmin()
  if (!check.ok) return check.error

  await db.user.update({ where: { id: userId }, data: { role } })
  revalidatePath('/admin/usuarios')
  return { status: 'success' }
}

export async function deleteUser(userId: number): Promise<ActionResult> {
  const check = await requireAdmin()
  if (!check.ok) return check.error

  await db.user.delete({ where: { id: userId } })
  revalidatePath('/admin/usuarios')
  return { status: 'success' }
}
