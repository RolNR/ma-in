'use server'

import { sendTravelEmail, sendTravelAutoReply, type TravelEmailData } from '@/lib/email'

function validate(data: TravelEmailData): string | null {
  if (!data.name.trim()) return 'El nombre es requerido'
  if (!data.phone.trim()) return 'El teléfono es requerido'
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return 'Ingresa un email válido'
  if (!data.routeType) return 'Selecciona un tipo de ruta'
  if (!data.passengers || Number(data.passengers) < 1)
    return 'Ingresa el número de personas'
  return null
}

export async function submitTravelForm(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const data: TravelEmailData = {
    name: (formData.get('name') as string) ?? '',
    phone: (formData.get('phone') as string) ?? '',
    email: (formData.get('email') as string) ?? '',
    routeType: (formData.get('routeType') as string) ?? '',
    passengers: (formData.get('passengers') as string) ?? '',
    destination: (formData.get('destination') as string) ?? '',
    date: (formData.get('date') as string) ?? '',
    comments: (formData.get('comments') as string) ?? '',
  }

  const error = validate(data)
  if (error) return { success: false, error }

  try {
    await Promise.all([sendTravelEmail(data), sendTravelAutoReply(data)])
    return { success: true }
  } catch (err) {
    console.error('[travel] Error al enviar correo:', err)
    return { success: false, error: 'Error al enviar la solicitud. Inténtalo de nuevo.' }
  }
}
