'use server'

import { sendContactEmail, sendContactAutoReply } from '@/lib/email'
import { validateContactForm, type ContactFormData } from '@/lib/validation'

export async function submitContactForm(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  const validation = validateContactForm(data)
  if (!validation.isValid) {
    return { success: false, error: validation.errors[0]?.message ?? 'Datos inválidos' }
  }

  try {
    await Promise.all([sendContactEmail(data), sendContactAutoReply(data)])
    return { success: true }
  } catch (err) {
    console.error('[contact] Error al enviar correo:', err)
    return { success: false, error: 'Error al enviar el mensaje. Inténtalo de nuevo.' }
  }
}
