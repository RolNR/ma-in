import { Badge } from '@/components/ui/Badge'

type ShipmentStatus =
  | 'PENDIENTE'
  | 'EN_RUTA'
  | 'EN_PROCESO_ENTREGA'
  | 'ENTREGADO'
  | 'ERRONEA'
  | 'CADUCADA'
  | 'SIN_UTILIZAR'

const STATUS_CONFIG: Record<ShipmentStatus, {
  variant: 'warning' | 'primary' | 'secondary' | 'success' | 'error' | 'default'
  label: string
}> = {
  PENDIENTE:           { variant: 'warning',   label: 'Pendiente' },
  EN_RUTA:             { variant: 'primary',   label: 'En ruta' },
  EN_PROCESO_ENTREGA:  { variant: 'secondary', label: 'En proceso' },
  ENTREGADO:           { variant: 'success',   label: 'Entregado' },
  ERRONEA:             { variant: 'error',     label: 'Errónea' },
  CADUCADA:            { variant: 'default',   label: 'Caducada' },
  SIN_UTILIZAR:        { variant: 'default',   label: 'Sin utilizar' },
}

interface StatusBadgeProps {
  status: ShipmentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { variant: 'default', label: status }
  return <Badge variant={config.variant} size="sm">{config.label}</Badge>
}
