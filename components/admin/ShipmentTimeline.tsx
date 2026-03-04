import { StatusBadge } from './StatusBadge'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'

interface TimelineEvent {
  id: number
  status: string
  description: string | null
  location: string | null
  occurredAt: Date
  user?: { name: string } | null
}

interface ShipmentTimelineProps {
  events: TimelineEvent[]
}

export function ShipmentTimeline({ events }: ShipmentTimelineProps) {
  if (events.length === 0) {
    return <p className="text-sm text-gray-400 py-4">Sin eventos registrados.</p>
  }

  return (
    <ol className="relative border-l-2 border-gray-200 space-y-6 pl-6">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span className="absolute -left-[29px] top-0.5 w-3.5 h-3.5 rounded-full bg-primary-600 border-2 border-white ring-2 ring-primary-200" />
          <div className="flex flex-wrap items-start gap-2 mb-1">
            <StatusBadge status={event.status as ShipmentStatus} />
            <span className="text-xs text-gray-400">
              {new Date(event.occurredAt).toLocaleString('es-MX', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </span>
          </div>
          {event.description && (
            <p className="text-sm text-gray-700">{event.description}</p>
          )}
          {event.location && (
            <p className="text-xs text-gray-500 mt-0.5">{event.location}</p>
          )}
          {event.user && (
            <p className="text-xs text-gray-400 mt-0.5">Por: {event.user.name}</p>
          )}
        </li>
      ))}
    </ol>
  )
}
