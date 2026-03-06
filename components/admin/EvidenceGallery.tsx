import { Camera, PenLine } from 'lucide-react'

interface Evidence {
  id: number
  type: string
  fileUrl: string
  capturedAt: Date
}

interface EvidenceGalleryProps {
  evidence: Evidence[]
}

function EvidenceItem({ item }: { item: Evidence }) {
  const isSignature = item.type === 'signature'
  const Icon = isSignature ? PenLine : Camera
  const label = isSignature ? 'Firma' : 'Foto de evidencia'
  const timestamp = new Date(item.capturedAt).toLocaleString('es-MX', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

  return (
    <div>
      <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5" />
        {label}
        <span className="ml-auto text-gray-400 font-normal">{timestamp}</span>
      </p>
      <div className={isSignature ? 'border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 p-2' : ''}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.fileUrl}
          alt={label}
          className={isSignature
            ? 'max-h-28 w-full object-contain'
            : 'w-full rounded-lg object-cover max-h-64'}
        />
      </div>
    </div>
  )
}

export function EvidenceGallery({ evidence }: EvidenceGalleryProps) {
  if (evidence.length === 0) return null

  // Show signatures first, then photos
  const sorted = [
    ...evidence.filter(e => e.type === 'signature'),
    ...evidence.filter(e => e.type === 'photo'),
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5 flex items-center gap-1.5">
        <Camera className="w-3.5 h-3.5" /> Evidencia de entrega
      </h2>
      <div className="space-y-5">
        {sorted.map(item => (
          <EvidenceItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
