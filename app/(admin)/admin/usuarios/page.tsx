import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { UserCard } from '@/components/admin/UserCard'
import { CreateUserForm } from '@/components/admin/CreateUserForm'
import { UserCog } from 'lucide-react'

export const metadata = { title: 'Usuarios' }

export default async function UsuariosPage() {
  const session = await auth()
  if (session?.user.role !== 'admin') redirect('/admin')

  const users = await db.user.findMany({
    where: { role: { in: ['admin', 'operator'] } },
    orderBy: [{ active: 'desc' }, { name: 'asc' }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      client: { select: { companyName: true } },
    },
  })

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-3">
        <UserCog className="w-6 h-6 text-primary-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500 mt-0.5">{users.length} usuarios registrados</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Lista */}
        <div className="lg:col-span-2 space-y-3">
          {users.map(u => (
            <UserCard key={u.id} user={u} />
          ))}
        </div>

        {/* Crear usuario */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Nuevo usuario</h2>
          <CreateUserForm />
        </div>

      </div>
    </div>
  )
}
