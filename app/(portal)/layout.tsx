import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { PortalSidebar } from '@/components/portal'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const clientId = session.user.clientId
  if (!clientId) redirect('/admin')

  const client = await db.client.findUnique({
    where: { id: clientId },
    select: { companyName: true },
  })

  if (!client) redirect('/login')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PortalSidebar
        user={{
          name: session.user.name,
          email: session.user.email,
          companyName: client.companyName,
        }}
      />
      <div className="flex-1 overflow-y-auto pt-14 md:pt-0 pb-16 md:pb-0">
        {children}
      </div>
    </div>
  )
}
