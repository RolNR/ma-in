import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui'
import {
  Truck,
  MapPin,
  Package,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react'
import type { Division } from '@/data/divisions'

interface DivisionCardProps {
  division: Division
  variant?: 'default' | 'compact' | 'featured'
}

const iconMap = {
  truck: Truck,
  'map-pin': MapPin,
  package: Package,
  'shopping-cart': ShoppingCart,
}

export function DivisionCard({ division, variant = 'default' }: DivisionCardProps) {
  const Icon = iconMap[division.icon as keyof typeof iconMap] || Package

  if (variant === 'compact') {
    return (
      <Link href={division.href}>
        <Card
          hover
          className="group flex items-center gap-4 p-4"
        >
          <div className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center',
            division.color === 'accent'
              ? 'bg-accent-100 text-accent-600'
              : 'bg-primary-100 text-primary'
          )}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
              {division.name}
            </h3>
            <p className="text-sm text-gray-500">{division.tagline}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Card>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link href={division.href}>
        <Card
          hover
          className={cn(
            'group relative overflow-hidden h-full',
            division.color === 'accent'
              ? 'border-2 border-accent'
              : ''
          )}
        >
          {/* Background decoration */}
          <div className={cn(
            'absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16',
            division.color === 'accent'
              ? 'bg-accent/10'
              : 'bg-primary/10'
          )} />

          <div className="relative p-6">
            <div className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
              division.color === 'accent'
                ? 'bg-accent text-gray-900'
                : 'bg-primary text-white'
            )}>
              <Icon className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              {division.name}
            </h3>
            <p className="text-sm text-primary font-medium mb-3">
              {division.tagline}
            </p>
            <p className="text-gray-600 mb-4">
              {division.description}
            </p>

            <ul className="space-y-2 mb-6">
              {division.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full mr-2',
                    division.color === 'accent' ? 'bg-accent' : 'bg-primary'
                  )} />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex items-center text-primary font-medium group-hover:text-primary-600">
              Ver más
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Card>
      </Link>
    )
  }

  // Default variant
  return (
    <Link href={division.href}>
      <Card hover className="group h-full p-6">
        <div className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center mb-4',
          division.color === 'accent'
            ? 'bg-accent-100 text-accent-600'
            : 'bg-primary-100 text-primary'
        )}>
          <Icon className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
          {division.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {division.description}
        </p>

        <div className="flex items-center text-sm text-primary font-medium">
          Explorar
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </Card>
    </Link>
  )
}
