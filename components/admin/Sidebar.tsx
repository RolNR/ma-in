'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Package,
  Upload,
  Users,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  disabled?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Guías', href: '/admin/guias', icon: Package },
  { label: 'Importar CSV', href: '/admin/importar', icon: Upload, disabled: true },
  { label: 'Clientes', href: '/admin/clientes', icon: Users },
]

interface SidebarProps {
  user: { name: string; email: string }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-gray-900 text-white shrink-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Panel Admin</p>
        <p className="text-lg font-bold text-white mt-0.5">MA-IN</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon, disabled }) => {
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))

          if (disabled) {
            return (
              <span
                key={href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 cursor-not-allowed"
              >
                <Icon className="w-4 h-4" />
                {label}
                <span className="ml-auto text-xs bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">Pronto</span>
              </span>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white',
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-4 border-t border-gray-700">
        <div className="mb-3 px-1">
          <p className="text-sm font-medium text-white truncate">{user.name}</p>
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
