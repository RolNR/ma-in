import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface HeroProps {
  title: string
  subtitle?: string
  description?: string
  primaryAction?: {
    label: string
    href: string
  }
  secondaryAction?: {
    label: string
    href: string
  }
  variant?: 'default' | 'centered' | 'split'
  size?: 'sm' | 'md' | 'lg'
  backgroundImage?: string
  overlay?: boolean
  children?: React.ReactNode
}

export function Hero({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default',
  size = 'md',
  backgroundImage,
  overlay = true,
  children,
}: HeroProps) {
  const sizes = {
    sm: 'py-16 md:py-20',
    md: 'py-20 md:py-28',
    lg: 'py-24 md:py-36',
  }

  const variants = {
    default: 'text-left',
    centered: 'text-center',
    split: 'text-left',
  }

  return (
    <section
      className={cn(
        'relative gradient-hero text-white overflow-hidden',
        sizes[size]
      )}
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      {/* Overlay */}
      {(overlay || backgroundImage) && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-700/90 to-primary-500/80" />
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        <div
          className={cn(
            'max-w-3xl',
            variant === 'centered' && 'mx-auto',
            variants[variant]
          )}
        >
          {subtitle && (
            <p className="text-accent font-medium mb-4 animate-fade-in">
              {subtitle}
            </p>
          )}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-slide-up">
            {title}
          </h1>

          {description && (
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl animate-slide-up">
              {description}
            </p>
          )}

          {(primaryAction || secondaryAction) && (
            <div
              className={cn(
                'flex flex-wrap gap-4',
                variant === 'centered' && 'justify-center'
              )}
            >
              {primaryAction && (
                <Link href={primaryAction.href}>
                  <Button variant="secondary" size="lg">
                    {primaryAction.label}
                  </Button>
                </Link>
              )}
              {secondaryAction && (
                <Link href={secondaryAction.href}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-primary"
                  >
                    {secondaryAction.label}
                  </Button>
                </Link>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </section>
  )
}
