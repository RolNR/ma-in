'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, Package, LogOut, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PortalSidebarProps {
  user: { name: string; email: string; companyName: string }
}

const navItems = [
  { label: 'Dashboard', href: '/portal', icon: LayoutDashboard },
  { label: 'Mis guías', href: '/portal/guias', icon: Package },
]

const showCreateShipment = process.env.NEXT_PUBLIC_PORTAL_CREATE_SHIPMENT === 'true'

export function PortalSidebar({ user }: PortalSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white border-r border-gray-200 shrink-0">
      {/* Logo + empresa */}
      <div className="px-6 py-5 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Portal Cliente</p>
        <p className="text-lg font-bold text-gray-900 mt-0.5">MA-IN</p>
        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-700 rounded-full truncate max-w-full">
          {user.companyName}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/portal' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}

        {showCreateShipment && (
          <span className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 cursor-not-allowed">
            <Plus className="w-4 h-4" />
            Nueva guía
            <span className="ml-auto text-xs bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">Pronto</span>
          </span>
        )}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="mb-3 px-1">
          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
