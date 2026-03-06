'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Package,
  Upload,
  Users,
  UserCog,
  LogOut,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard',    href: '/admin',          icon: LayoutDashboard },
  { label: 'Guías',        href: '/admin/guias',    icon: Package },
  { label: 'Importar CSV', href: '/admin/importar', icon: Upload },
  { label: 'Clientes',     href: '/admin/clientes', icon: Users },
  { label: 'Usuarios',     href: '/admin/usuarios', icon: UserCog, adminOnly: true },
]

interface SidebarProps {
  user: { name: string; email: string; role: string }
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const isAdmin = user.role === 'admin'

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 min-h-screen bg-gray-900 text-white shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-700">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Panel Admin</p>
          <p className="text-lg font-bold text-white mt-0.5">MA-IN</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, href, icon: Icon, adminOnly }) => {
            if (adminOnly && !isAdmin) return null
            const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
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

        {/* User info + role badge + actions */}
        <div className="px-4 py-4 border-t border-gray-700">
          <Link href="/admin/perfil" className="flex items-start gap-2 mb-3 px-1 rounded-lg hover:bg-gray-800 py-1.5 transition-colors group">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate group-hover:text-primary-300 transition-colors">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
              <span className={cn(
                'inline-block mt-1 text-xs font-semibold px-1.5 py-0.5 rounded capitalize',
                isAdmin ? 'bg-primary-700 text-primary-100' : 'bg-gray-700 text-gray-300'
              )}>
                {user.role}
              </span>
            </div>
            <Settings className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300 mt-1 shrink-0 transition-colors" />
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Mobile top header ── */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-gray-900 flex items-center justify-between px-4">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest leading-none">Panel Admin</p>
          <p className="text-sm font-bold text-white">MA-IN</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Salir
        </button>
      </header>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-gray-900 border-t border-gray-700 flex">
        {navItems.map(({ label, href, icon: Icon, adminOnly }) => {
          if (adminOnly && !isAdmin) return null
          const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors',
                isActive ? 'text-primary-400' : 'text-gray-500 hover:text-gray-300',
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'text-primary-400')} />
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
