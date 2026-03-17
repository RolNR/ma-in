import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import QRCode from 'qrcode'
import { PrintButton } from '@/app/(print)/imprimir/[id]/PrintButton'
import { formatDateOnly } from '@/lib/utils'

interface PageProps {
  params: Promise<{ batchId: string }>
}

function AddressBlock({ street, city, state, postal }: {
  street: string | null; city: string | null; state: string | null; postal: string | null
}) {
  const cityLine = [city, state].filter(Boolean).join(' ')
  return (
    <div className="text-sm leading-snug space-y-0.5">
      {street   && <p>{street}</p>}
      {postal   && <p>CP. {postal}</p>}
      {cityLine && <p>{cityLine.toUpperCase()}</p>}
    </div>
  )
}

export default async function ImprimirLotePage({ params }: PageProps) {
  const { batchId } = await params

  const batch = await db.batch.findUnique({
    where: { id: batchId },
    include: {
      client: { select: { companyName: true, phone: true } },
      user:   { select: { name: true } },
      shipments: {
        orderBy: { trackingCode: 'asc' },
        include: { carrier: { select: { name: true } } },
      },
    },
  })

  if (!batch || batch.shipments.length === 0) notFound()

  // Generate batch QR (links to admin lote status page)
  const headersList = await headers()
  const host  = headersList.get('host') ?? 'localhost:3000'
  const proto = headersList.get('x-forwarded-proto') ?? 'http'

  // Generate individual QR for each guide (links to scan page)
  const scanBase = `${proto}://${host}/scan`
  const qrUrls = await Promise.all(
    batch.shipments.map(s =>
      QRCode.toDataURL(`${scanBase}/${s.trackingCode}`, { width: 140, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
    )
  )
  const batchUrl = `${proto}://${host}/admin/lote/${batchId}`
  const batchQrUrl = await QRCode.toDataURL(batchUrl, {
    width: 200, margin: 1, color: { dark: '#138A6F', light: '#ffffff' },
  })

  return (
    <>
      <style>{`
        @page { size: A4 portrait; margin: 12mm; }
        @media print { .no-print { display: none !important; } .page-break { page-break-after: always; } }
        @media screen { body { background: #f3f4f6; } }
      `}</style>

      {/* Screen toolbar */}
      <div className="no-print flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
        <div>
          <p className="text-sm font-semibold text-gray-700">Lote de {batch.shipments.length} guías</p>
          {batch.client && <p className="text-xs text-gray-400">{batch.client.companyName}</p>}
        </div>
        <PrintButton />
      </div>

      {/* One guide card per page */}
      {batch.shipments.map((shipment, i) => {
        const guideType = shipment.guideType?.toUpperCase() || 'PAQUETE'
        const date = formatDateOnly(shipment.shipmentDate, { day: '2-digit', month: '2-digit', year: 'numeric' })
        const isLast = i === batch.shipments.length - 1

        return (
          <div
            key={shipment.id}
            className={isLast ? 'page-break' : 'page-break'}
            style={{ pageBreakAfter: 'always' }}
          >
            <div className="mx-auto my-8 bg-white print:my-0 print:mx-0"
                 style={{ maxWidth: 720, fontFamily: 'Arial, Helvetica, sans-serif' }}>

              {/* Header */}
              <div className="flex items-start justify-between px-8 pt-8 pb-4">
                <div>
                  <p className="text-6xl font-black tracking-tight text-gray-900">{guideType}</p>
                  <p className="text-sm text-gray-600 mt-2">{date}</p>
                  <p className="text-sm text-gray-600">
                    Código rastreo: <strong>{shipment.trackingCode}</strong>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Guía {i + 1} de {batch.shipments.length}</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.svg" alt="MA-IN Logistik" style={{ height: 56, width: 'auto' }} />
              </div>

              <hr className="border-gray-400 mx-8" />

              {/* Remitente */}
              <div className="px-8 py-5">
                <div className="flex gap-8">
                  <div className="w-40 shrink-0">
                    <p className="text-xs font-bold tracking-widest text-gray-500 mb-1">REMITENTE</p>
                    <p className="font-bold text-sm">{shipment.senderName?.toUpperCase() || '—'}</p>
                    {batch.client?.phone && (
                      <p className="text-xs text-gray-600 mt-1">Tel: {batch.client.phone}</p>
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

              {/* Consignatario */}
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
                {shipment.destAbbr && (
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold tracking-widest text-gray-500 mb-1">Siglas destino</p>
                    <p className="text-5xl font-black text-gray-900">{shipment.destAbbr.toUpperCase()}</p>
                  </div>
                )}
              </div>

              <hr className="border-gray-400 mx-8" />

              {/* QR individual + datos + QR lote */}
              <div className="px-8 py-6 flex items-start justify-between gap-8">
                <div className="flex items-start gap-8">
                  <div className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrUrls[i]} alt="QR" style={{ width: 140, height: 140 }} />
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

                {/* Batch QR — esquina inferior derecha */}
                <div className="shrink-0 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={batchQrUrl} alt="QR Lote" style={{ width: 90, height: 90 }} />
                  <p className="text-xs font-bold tracking-widest mt-1" style={{ color: '#138A6F' }}>LOTE</p>
                  <p className="text-xs text-gray-400">{batch.shipments.length} guías</p>
                </div>
              </div>

            </div>
          </div>
        )
      })}
    </>
  )
}
