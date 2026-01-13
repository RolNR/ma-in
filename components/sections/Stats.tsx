import { cn } from '@/lib/utils'
import {
  Calendar,
  Package,
  Map,
  Users,
  type LucideIcon,
} from 'lucide-react'

interface Stat {
  id: string
  value: string
  label: string
  icon: string
}

interface StatsProps {
  stats: Stat[]
  variant?: 'default' | 'cards' | 'dark'
  columns?: 2 | 3 | 4
}

const iconMap: Record<string, LucideIcon> = {
  calendar: Calendar,
  package: Package,
  map: Map,
  users: Users,
}

export function Stats({ stats, variant = 'default', columns = 4 }: StatsProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 lg:grid-cols-4',
  }

  if (variant === 'dark') {
    return (
      <section className="bg-primary py-16">
        <div className="container-custom">
          <div className={cn('grid gap-8', gridCols[columns])}>
            {stats.map((stat) => {
              const Icon = iconMap[stat.icon] || Package

              return (
                <div key={stat.id} className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-white/80 text-sm">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'cards') {
    return (
      <section className="py-16">
        <div className="container-custom">
          <div className={cn('grid gap-6', gridCols[columns])}>
            {stats.map((stat) => {
              const Icon = iconMap[stat.icon] || Package

              return (
                <div
                  key={stat.id}
                  className="bg-white rounded-xl p-6 shadow-soft text-center"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  // Default variant
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className={cn('grid gap-8', gridCols[columns])}>
          {stats.map((stat) => {
            const Icon = iconMap[stat.icon] || Package

            return (
              <div key={stat.id} className="text-center">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm mt-1">
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
