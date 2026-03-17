'use client'

import { useState, useRef, useEffect } from 'react'
import { updateFromScan } from '@/lib/actions/scan'
import type { ShipmentStatus } from '@/lib/generated/prisma/client'
import { Loader2, CheckCircle2, Camera, PenLine, Trash2 } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'EN_PROCESO_ENTREGA', label: 'En proceso de entrega' },
  { value: 'ENTREGADO',          label: 'Entregado' },
  { value: 'ERRONEA',            label: 'Errónea' },
  { value: 'EN_RUTA',            label: 'En ruta' },
] as const

interface Props {
  shipmentId: string
  currentStatus: ShipmentStatus
  currentReceivedBy: string | null
}

type UIState = 'idle' | 'loading' | 'success' | 'error'

export function ScanForm({ shipmentId, currentStatus, currentReceivedBy }: Props) {
  const [selected, setSelected] = useState<ShipmentStatus>(currentStatus)
  const [uiState, setUiState] = useState<UIState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null)

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [hasSig, setHasSig] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Sync intrinsic size to display size to prevent scaling distortion
    canvas.width = Math.floor(canvas.getBoundingClientRect().width)
    canvas.height = 120
    const ctx = canvas.getContext('2d')!
    ctx.strokeStyle = '#1a1a1a'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true
    const ctx = canvasRef.current!.getContext('2d')!
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const ctx = canvasRef.current!.getContext('2d')!
    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSig(true)
  }

  function onPointerUp() { drawing.current = false }

  function clearSignature() {
    const canvas = canvasRef.current!
    canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
    setHasSig(false)
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Compress via canvas before storing
    const img = new Image()
    const reader = new FileReader()
    reader.onload = ev => {
      img.onload = () => {
        const maxW = 800
        const scale = Math.min(1, maxW / img.width)
        const w = img.width * scale
        const h = img.height * scale
        const c = document.createElement('canvas')
        c.width = w; c.height = h
        c.getContext('2d')!.drawImage(img, 0, 0, w, h)
        setPhotoDataUrl(c.toDataURL('image/jpeg', 0.7))
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUiState('loading')
    setErrorMsg('')

    const fd = new FormData(e.currentTarget)
    const receivedBy = (fd.get('receivedBy') as string)?.trim() || null
    const description = (fd.get('description') as string)?.trim() || null
    const signatureDataUrl = hasSig ? canvasRef.current!.toDataURL('image/png') : null

    const result = await updateFromScan(
      shipmentId,
      selected,
      receivedBy,
      description,
      signatureDataUrl,
      photoDataUrl,
    )

    if (result.status === 'success') {
      setUiState('success')
    } else {
      setErrorMsg(result.message)
      setUiState('error')
    }
  }

  if (uiState === 'success') {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">¡Entrega registrada!</h2>
        <p className="text-gray-500 mt-2">La información fue guardada correctamente.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 py-5 space-y-5">

      {/* Status */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
        <div className="grid grid-cols-2 gap-2">
          {STATUS_OPTIONS.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => setSelected(o.value as ShipmentStatus)}
              className={`py-3 px-3 rounded-xl text-sm font-medium border-2 transition-all text-left ${
                selected === o.value
                  ? 'border-primary-600 bg-primary-50 text-primary-800'
                  : 'border-gray-200 bg-white text-gray-600'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recibido por */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Recibido por</label>
        <input
          name="receivedBy"
          defaultValue={currentReceivedBy ?? ''}
          placeholder="Nombre de quien recibe"
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Nota */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Nota <span className="font-normal text-gray-400">(opcional)</span>
        </label>
        <textarea
          name="description"
          rows={2}
          placeholder="Ej: Se dejó en recepción..."
          className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>

      {/* Firma */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <PenLine className="w-4 h-4" /> Firma
            <span className="font-normal text-gray-400">(opcional)</span>
          </label>
          {hasSig && (
            <button type="button" onClick={clearSignature} className="text-xs text-red-500 flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Borrar
            </button>
          )}
        </div>
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="w-full border-2 border-dashed border-gray-300 rounded-xl bg-white touch-none cursor-crosshair"
          style={{ height: 120, touchAction: 'none' }}
        />
        {!hasSig && (
          <p className="text-xs text-gray-400 mt-1 text-center">Dibuja la firma arriba</p>
        )}
      </div>

      {/* Foto */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
          <Camera className="w-4 h-4" /> Foto de evidencia
          <span className="font-normal text-gray-400">(opcional)</span>
        </label>
        {photoDataUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoDataUrl} alt="Evidencia" className="w-full rounded-xl object-cover max-h-48" />
            <button
              type="button"
              onClick={() => setPhotoDataUrl(null)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl bg-white cursor-pointer hover:bg-gray-50 transition-colors">
            <Camera className="w-8 h-8 text-gray-300 mb-1" />
            <span className="text-sm text-gray-400">Tomar foto o seleccionar</span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhoto}
            />
          </label>
        )}
      </div>

      {uiState === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={uiState === 'loading'}
        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white font-semibold rounded-xl text-base transition-colors"
      >
        {uiState === 'loading'
          ? <><Loader2 className="w-5 h-5 animate-spin" /> Guardando...</>
          : 'Confirmar entrega'}
      </button>

    </form>
  )
}
