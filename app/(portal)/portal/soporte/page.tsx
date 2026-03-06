import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Phone, Mail, MessageCircle, Clock } from 'lucide-react'
import { COMPANY, SCHEDULE } from '@/lib/constants'

export const metadata = { title: 'Soporte — Portal MA-IN' }

export default async function PortalSoportePage() {
  const session = await auth()
  if (!session?.user.clientId) redirect('/login')

  return (
    <div className="p-6 md:p-8 max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Soporte</h1>
        <p className="text-gray-500 mt-1">¿Tienes alguna duda? Contáctanos directamente.</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        <a
          href={`https://wa.me/${COMPANY.whatsapp.replace(/\D/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">WhatsApp</p>
            <p className="text-sm text-gray-500">{COMPANY.whatsapp}</p>
          </div>
        </a>

        <a
          href={`tel:${COMPANY.phone}`}
          className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Teléfono</p>
            <p className="text-sm text-gray-500">{COMPANY.phone}</p>
          </div>
        </a>

        <a
          href={`mailto:${COMPANY.email}`}
          className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Correo</p>
            <p className="text-sm text-gray-500">{COMPANY.email}</p>
          </div>
        </a>
      </div>

      <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-500">
        <Clock className="w-4 h-4 shrink-0 mt-0.5 text-gray-400" />
        {SCHEDULE.formatted}
      </div>
    </div>
  )
}
