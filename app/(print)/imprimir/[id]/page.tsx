import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import QRCode from 'qrcode'
import { PrintButton } from './PrintButton'
import { formatDateOnly } from '@/lib/utils'

interface PageProps {
  params: Promise<{ id: string }>
}

function AddressBlock({ street, city, state, postal }: {
  street: string | null; city: string | null; state: string | null; postal: string | null
}) {
  const cityLine = [city, state].filter(Boolean).join(' ')
  return (
    <div className="text-sm leading-snug space-y-0.5">
      {street  && <p>{street}</p>}
      {postal  && <p>CP. {postal}</p>}
      {cityLine && <p>{cityLine.toUpperCase()}</p>}
    </div>
  )
}

export default async function ImprimirPage({ params }: PageProps) {
  const { id } = await params

  const shipment = await db.shipment.findUnique({
    where: { id },
    include: {
      carrier: { select: { name: true } },
      client:  { select: { phone: true } },
    },
  })
  if (!shipment) notFound()

  const headersList = await headers()
  const host  = headersList.get('host') ?? 'localhost:3000'
  const proto = headersList.get('x-forwarded-proto') ?? 'http'
  const scanUrl = `${proto}://${host}/scan/${shipment.trackingCode}`

  const qrDataUrl = await QRCode.toDataURL(scanUrl, {
    width: 180,
    margin: 1,
    color: { dark: '#000000', light: '#ffffff' },
  })

  const guideType = shipment.guideType?.toUpperCase() || 'PAQUETE'
  const date = formatDateOnly(shipment.shipmentDate, { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <>
      {/* Print CSS */}
      <style>{`
        @page { size: A4 portrait; margin: 12mm; }
        @media print { .no-print { display: none !important; } }
        @media screen { body { background: #f3f4f6; } }
      `}</style>

      {/* Screen toolbar */}
      <div className="no-print flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
        <p className="text-sm text-gray-500 font-mono">{shipment.trackingCode}</p>
        <PrintButton />
      </div>

      {/* Guide card */}
      <div className="mx-auto my-8 bg-white print:my-0 print:mx-0"
           style={{ maxWidth: 720, fontFamily: 'Arial, Helvetica, sans-serif' }}>

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between px-8 pt-8 pb-4">
          <div>
            <p className="text-6xl font-black tracking-tight text-gray-900">{guideType}</p>
            <p className="text-sm text-gray-600 mt-2">{date}</p>
            <p className="text-sm text-gray-600">Código rastreo: <strong>{shipment.trackingCode}</strong></p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="MA-IN Logistik" style={{ height: 56, width: 'auto' }} />
        </div>

        <hr className="border-gray-400 mx-8" />

        {/* ── Remitente ──────────────────────────────────────── */}
        <div className="px-8 py-5">
          <div className="flex gap-8">
            <div className="w-40 shrink-0">
              <p className="text-xs font-bold tracking-widest text-gray-500 mb-1">REMITENTE</p>
              <p className="font-bold text-sm">{shipment.senderName?.toUpperCase() || '—'}</p>
              {shipment.client?.phone && (
                <p className="text-xs text-gray-600 mt-1">Tel: {shipment.client.phone}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-500 mb-1">DIRECCIÓN</p>
              <AddressBlock
                street={shipment.originStreet}
                city={shipment.originCity}
                state={shipment.originState}
                postal={shipment.originPostal}
              />
            </div>
          </div>
        </div>

        <hr className="border-gray-400 mx-8" />

        {/* ── Consignatario ──────────────────────────────────── */}
        <div className="px-8 py-5 flex gap-8">
          <div className="flex-1 flex gap-8">
            <div className="w-40 shrink-0">
              <p className="text-xs font-bold tracking-widest text-gray-500 mb-1">CONSIGNATARIO</p>
              <p className="font-bold text-sm">{shipment.recipientName?.toUpperCase() || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-500 mb-1">DIRECCIÓN</p>
              <AddressBlock
                street={shipment.destStreet}
                city={shipment.destCity}
                state={shipment.destState}
                postal={shipment.destPostal}
              />
            </div>
          </div>
          {/* Siglas destino */}
          {shipment.destAbbr && (
            <div className="text-right shrink-0">
              <p className="text-xs font-bold tracking-widest text-gray-500 mb-1">Siglas destino</p>
              <p className="text-5xl font-black text-gray-900">{shipment.destAbbr.toUpperCase()}</p>
            </div>
          )}
        </div>

        <hr className="border-gray-400 mx-8" />

        {/* ── QR + datos ─────────────────────────────────────── */}
        <div className="px-8 py-6 flex items-start gap-8">
          <div className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="QR" style={{ width: 140, height: 140 }} />
            <p className="text-xs font-mono text-gray-500 mt-1 text-center">{shipment.trackingCode}</p>
          </div>
          <div className="space-y-4 pt-2">
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-500">Peso paquete</p>
              <p className="text-3xl font-bold text-gray-900">
                {shipment.weight ? `${shipment.weight} kg` : '— kg'}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-500">Contenido</p>
              <p className="text-3xl font-bold text-gray-900 uppercase">
                {shipment.content || 'PAQUETE'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
