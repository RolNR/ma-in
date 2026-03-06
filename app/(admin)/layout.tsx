import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Sidebar } from '@/components/admin/Sidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')
  if (session.user.role === 'client') redirect('/portal')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={{ name: session.user.name, email: session.user.email, role: session.user.role }} />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
