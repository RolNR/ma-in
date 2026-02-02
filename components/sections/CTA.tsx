import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface CTAProps {
  title: string
  description?: string
  primaryAction: {
    label: string
    href: string
  }
  secondaryAction?: {
    label: string
    href: string
  }
  variant?: 'default' | 'centered' | 'minimal'
  background?: 'primary' | 'accent' | 'light' | 'gradient'
}

export function CTA({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default',
  background = 'primary',
}: CTAProps) {
  const backgrounds = {
    primary: 'bg-primary text-white',
    accent: 'bg-accent text-gray-900',
    light: 'bg-gray-50 text-gray-900',
    gradient: 'gradient-hero text-white',
  }

  const buttonVariants = {
    primary: { primary: 'secondary' as const, secondary: 'outline' as const },
    accent: { primary: 'primary' as const, secondary: 'outline' as const },
    light: { primary: 'primary' as const, secondary: 'outline' as const },
    gradient: { primary: 'secondary' as const, secondary: 'outline' as const },
  }

  if (variant === 'minimal') {
    return (
      <section className={cn('py-12', backgrounds[background])}>
        <div className="container-custom flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
            {description && (
              <p className={cn(
                'mt-2',
                background === 'primary' || background === 'gradient'
                  ? 'text-white/80'
                  : 'text-gray-600'
              )}>
                {description}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href={primaryAction.href}>
              <Button variant={buttonVariants[background].primary} size="lg">
                {primaryAction.label}
              </Button>
            </Link>
            {secondaryAction && (
              <Link href={secondaryAction.href}>
                <Button
                  variant={buttonVariants[background].secondary}
                  size="lg"
                  className={cn(
                    background === 'primary' || background === 'gradient'
                      ? 'border-white text-white hover:bg-white hover:!text-primary'
                      : ''
                  )}
                >
                  {secondaryAction.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'centered') {
    return (
      <section className={cn('section-padding', backgrounds[background])}>
        <div className="container-custom text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {description && (
            <p className={cn(
              'text-lg mb-8',
              background === 'primary' || background === 'gradient'
                ? 'text-white/80'
                : 'text-gray-600'
            )}>
              {description}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={primaryAction.href}>
              <Button variant={buttonVariants[background].primary} size="lg">
                {primaryAction.label}
              </Button>
            </Link>
            {secondaryAction && (
              <Link href={secondaryAction.href}>
                <Button
                  variant={buttonVariants[background].secondary}
                  size="lg"
                  className={cn(
                    background === 'primary' || background === 'gradient'
                      ? 'border-white text-white hover:bg-white hover:!text-primary'
                      : ''
                  )}
                >
                  {secondaryAction.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Default variant
  return (
    <section className={cn('section-padding', backgrounds[background])}>
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {description && (
              <p className={cn(
                'text-lg',
                background === 'primary' || background === 'gradient'
                  ? 'text-white/80'
                  : 'text-gray-600'
              )}>
                {description}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href={primaryAction.href}>
              <Button variant={buttonVariants[background].primary} size="lg">
                {primaryAction.label}
              </Button>
            </Link>
            {secondaryAction && (
              <Link href={secondaryAction.href}>
                <Button
                  variant={buttonVariants[background].secondary}
                  size="lg"
                  className={cn(
                    background === 'primary' || background === 'gradient'
                      ? 'border-white text-white hover:bg-white hover:!text-primary'
                      : ''
                  )}
                >
                  {secondaryAction.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
