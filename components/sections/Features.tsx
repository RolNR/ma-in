import { cn } from '@/lib/utils'
import {
  ShieldCheck,
  Cpu,
  Headphones,
  Settings,
  Truck,
  Zap,
  Layers,
  Home,
  RefreshCw,
  MapPin,
  Bell,
  Clock,
  Code,
  BarChart,
  Box,
  Tag,
  Leaf,
  Mail,
  Factory,
  Utensils,
  Pill,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react'

interface Feature {
  id: string
  title: string
  description: string
  icon: string
}

interface FeaturesProps {
  title?: string
  subtitle?: string
  features: Feature[]
  columns?: 2 | 3 | 4
  variant?: 'cards' | 'list' | 'icons'
}

const iconMap: Record<string, LucideIcon> = {
  'shield-check': ShieldCheck,
  cpu: Cpu,
  headphones: Headphones,
  settings: Settings,
  truck: Truck,
  zap: Zap,
  layers: Layers,
  home: Home,
  warehouse: Home,
  'refresh-cw': RefreshCw,
  'map-pin': MapPin,
  bell: Bell,
  clock: Clock,
  code: Code,
  'bar-chart': BarChart,
  box: Box,
  tag: Tag,
  leaf: Leaf,
  mail: Mail,
  factory: Factory,
  utensils: Utensils,
  pill: Pill,
  'shopping-bag': ShoppingBag,
  boxes: Layers,
}

export function Features({
  title,
  subtitle,
  features,
  columns = 3,
  variant = 'cards',
}: FeaturesProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className="section-padding">
      <div className="container-custom">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {subtitle && (
              <p className="text-primary font-medium mb-2">{subtitle}</p>
            )}
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                {title}
              </h2>
            )}
          </div>
        )}

        <div className={cn('grid gap-6', gridCols[columns])}>
          {features.map((feature) => {
            const Icon = iconMap[feature.icon] || Box

            if (variant === 'list') {
              return (
                <div key={feature.id} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )
            }

            if (variant === 'icons') {
              return (
                <div key={feature.id} className="text-center p-6">
                  <div className="w-16 h-16 bg-primary-100 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              )
            }

            // Default: cards
            return (
              <div
                key={feature.id}
                className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 text-primary rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
