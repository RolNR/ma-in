import { auth } from '@/lib/auth'
import { ChangePasswordForm } from '@/components/admin/ChangePasswordForm'
import { UserCircle } from 'lucide-react'

export const metadata = { title: 'Mi perfil' }

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrador',
  operator: 'Operador',
  client: 'Cliente',
}

export default async function PerfilPage() {
  const session = await auth()
  const user = session!.user

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-3">
        <UserCircle className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">Mi perfil</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-lg font-bold text-primary-700">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600 capitalize">
                {ROLE_LABELS[user.role] ?? user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Cambiar contraseña */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Cambiar contraseña</h2>
          <ChangePasswordForm />
        </div>

      </div>
    </div>
  )
}
