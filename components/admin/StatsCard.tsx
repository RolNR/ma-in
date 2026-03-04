import { cn } from '@/lib/utils'

interface StatsCardProps {
  label: string
  value: number | string
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function StatsCard({ label, value, icon: Icon, className }: StatsCardProps) {
  return (
    <div className={cn('bg-white rounded-xl shadow-sm border border-gray-100 p-6', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className="p-2 bg-primary-50 rounded-lg">
            <Icon className="w-5 h-5 text-primary-600" />
          </div>
        )}
      </div>
    </div>
  )
}
