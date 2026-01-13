'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { MAIN_NAV, COMPANY, ROUTES } from '@/lib/constants'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-transparent py-4'
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg',
              isScrolled ? 'bg-primary text-white' : 'bg-white text-primary'
            )}>
              MA
            </div>
            <span className={cn(
              'font-bold text-xl transition-colors',
              isScrolled ? 'text-gray-900' : 'text-white'
            )}>
              {COMPANY.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {MAIN_NAV.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? isScrolled
                        ? 'bg-primary-100 text-primary'
                        : 'bg-white/20 text-white'
                      : isScrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-white/90 hover:bg-white/10'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href={ROUTES.track.trackShipment}>
              <Button
                variant={isScrolled ? 'outline' : 'ghost'}
                size="sm"
                className={cn(
                  !isScrolled && 'text-white border-white/50 hover:bg-white/10'
                )}
              >
                Rastrear envío
              </Button>
            </Link>
            <Link href={ROUTES.support.contact}>
              <Button variant={isScrolled ? 'primary' : 'secondary'} size="sm">
                Contactar
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className={cn(
              'lg:hidden p-2 rounded-lg transition-colors',
              isScrolled
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-white hover:bg-white/10'
            )}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 overflow-hidden',
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <nav className="container-custom py-4">
          <div className="flex flex-col gap-1">
            {MAIN_NAV.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-3 rounded-lg text-base font-medium transition-colors',
                    isActive
                      ? 'bg-primary-100 text-primary'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4 flex flex-col gap-2">
            <Link href={ROUTES.track.trackShipment}>
              <Button variant="outline" className="w-full">
                Rastrear envío
              </Button>
            </Link>
            <Link href={ROUTES.support.contact}>
              <Button variant="primary" className="w-full">
                Contactar
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
