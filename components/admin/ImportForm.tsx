'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { importShipments, type ImportState } from '@/lib/actions/imports'
import { useRef, useState, useEffect } from 'react'
import { Upload, FileSpreadsheet, X, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface PreviewRow {
  trackingCode: string | null
  company: string | null
  destination: string | null
  status: string | null
  date: string
}

interface PreviewStats {
  total: number
  toImport: number   // unique TCs (estimated inserts)
  withoutCode: number
  intraDups: number
}

type LocalStep =
  | { type: 'idle' }
  | { type: 'parsing' }
  | { type: 'preview'; file: File; rows: PreviewRow[]; stats: PreviewStats }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toDateStr(val: unknown): string {
  if (val instanceof Date) return val.toLocaleDateString('es-MX')
  if (typeof val === 'number')
    return new Date(Math.round((val - 25569) * 86400 * 1000)).toLocaleDateString('es-MX')
  return '—'
}

function StatCard({ label, value, color }: { label: string; value: number; color: 'gray' | 'green' | 'amber' | 'red' }) {
  const colors = { gray: 'text-gray-900', green: 'text-green-700', amber: 'text-amber-600', red: 'text-red-600' }
  return (
    <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-0.5 ${colors[color]}`}>{value}</p>
    </div>
  )
}

// ─── Submit button ────────────────────────────────────────────────────────────

function ConfirmButton({ total }: { total: number }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
    >
      {pending
        ? <><Loader2 className="w-4 h-4 animate-spin" /> Importando...</>
        : <><Upload className="w-4 h-4" /> Importar {total.toLocaleString()} guías</>}
    </button>
  )
}

// ─── Success view ─────────────────────────────────────────────────────────────

function SuccessView({ state }: { state: Extract<ImportState, { status: 'success' }> }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border-2 border-green-400 bg-green-50 p-6">
        <div className="flex items-center gap-2 text-green-700 font-semibold text-lg mb-5">
          <CheckCircle2 className="w-5 h-5" />
          Importación completada
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={state.total} color="gray" />
          <StatCard label="Importadas" value={state.imported} color="green" />
          <StatCard label="Ya existían" value={state.skipped} color="amber" />
          <StatCard label="Sin código" value={state.errors} color="red" />
        </div>
        {state.matched > 0 && (
          <p className="text-sm text-green-700 mt-4 bg-green-100 px-3 py-2 rounded-lg">
            ✓ {state.matched} guías asignadas automáticamente a clientes registrados.
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors"
      >
        Importar otro archivo
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ImportForm() {
  const [serverState, formAction] = useFormState(importShipments, { status: 'idle' })
  const [local, setLocal] = useState<LocalStep>({ type: 'idle' })
  const [dragging, setDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Assign file to hidden input AFTER the preview form renders (fileInputRef is null before that)
  useEffect(() => {
    if (local.type !== 'preview' || !fileInputRef.current) return
    const dt = new DataTransfer()
    dt.items.add(local.file)
    fileInputRef.current.files = dt.files
  }, [local])

  async function processFile(file: File) {
    if (!/\.(xlsx|xls)$/i.test(file.name)) return
    setLocal({ type: 'parsing' })

    try {
      const XLSX = await import('xlsx')
      const buffer = await file.arrayBuffer()
      const wb = XLSX.read(new Uint8Array(buffer), { type: 'array', cellDates: true })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rawData = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1 }) as unknown[][]

      if (rawData.length < 2) { setLocal({ type: 'idle' }); return }

      const headers = (rawData[0] as unknown[]).map(h => String(h ?? '').trim())
      const dataRows = rawData
        .slice(1)
        .map(row => {
          const obj: Record<string, unknown> = {}
          headers.forEach((h, i) => { obj[h] = (row as unknown[])[i] ?? null })
          return obj
        })
        .filter(r => Object.values(r).some(v => v !== null && v !== ''))

      // Stats
      const tcs = dataRows.map(r => String(r['COD DE RASTREO'] ?? '').trim()).filter(Boolean)
      const uniqueTCs = new Set(tcs)
      const withoutCode = dataRows.length - tcs.length
      const intraDups = tcs.length - uniqueTCs.size

      // Preview rows (first 10)
      const rows: PreviewRow[] = dataRows.slice(0, 10).map(r => ({
        trackingCode: String(r['COD DE RASTREO'] ?? '').trim() || null,
        company: String(r['NOMBRE CORTO DE ORIGEN'] ?? '').trim() || null,
        destination: String(r['DESTINO'] ?? '').trim() || null,
        status: String(r['STATUS'] ?? '').trim() || null,
        date: toDateStr(r['FECHA']),
      }))

      setLocal({
        type: 'preview',
        file,
        rows,
        stats: { total: dataRows.length, toImport: uniqueTCs.size, withoutCode, intraDups },
      })
    } catch {
      setLocal({ type: 'idle' })
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    processFile(e.dataTransfer.files[0])
  }

  if (serverState.status === 'success') return <SuccessView state={serverState} />

  // ── Preview ──────────────────────────────────────────────────────────────
  if (local.type === 'preview') {
    const { file, rows, stats } = local
    const omitted = stats.withoutCode + stats.intraDups

    return (
      <form action={formAction} className="space-y-5">
        <input ref={fileInputRef} name="file" type="file" accept=".xlsx,.xls" className="hidden" />

        {/* File header */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-400">{stats.total} filas detectadas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLocal({ type: 'idle' })}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Cambiar archivo
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="A importar" value={stats.toImport} color="green" />
          <StatCard label="Omitidas" value={omitted} color={omitted > 0 ? 'amber' : 'gray'} />
          <StatCard label="Sin código" value={stats.withoutCode} color={stats.withoutCode > 0 ? 'red' : 'gray'} />
        </div>

        {omitted > 0 && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
            {stats.intraDups > 0 && `${stats.intraDups} código(s) duplicados dentro del archivo. `}
            {stats.withoutCode > 0 && `${stats.withoutCode} fila(s) sin código de rastreo. `}
            Estas filas serán omitidas.
          </p>
        )}

        <p className="text-xs text-gray-400">
          * Las guías que ya existen en el sistema también serán omitidas automáticamente.
        </p>

        {/* Preview table */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Primeras {rows.length} filas
          </p>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Código', 'Empresa', 'Destino', 'Status', 'Fecha'].map(h => (
                    <th key={h} className="text-left px-3 py-2 font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, i) => (
                  <tr key={i} className={!row.trackingCode ? 'bg-red-50' : 'hover:bg-gray-50'}>
                    <td className="px-3 py-2 font-mono text-gray-700">
                      {row.trackingCode ?? <span className="text-red-500 italic">sin código</span>}
                    </td>
                    <td className="px-3 py-2 text-gray-600 max-w-[160px]">
                      <span className="block truncate" title={row.company ?? ''}>{row.company ?? '—'}</span>
                    </td>
                    <td className="px-3 py-2 text-gray-600">{row.destination ?? '—'}</td>
                    <td className="px-3 py-2 text-gray-500 max-w-[140px]">
                      <span className="block truncate" title={row.status ?? ''}>{row.status ?? '—'}</span>
                    </td>
                    <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {stats.total > 10 && (
            <p className="text-xs text-gray-400 mt-1.5 pl-1">
              + {(stats.total - 10).toLocaleString()} filas más no mostradas
            </p>
          )}
        </div>

        {serverState.status === 'error' && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 px-3 py-2.5 rounded-lg">
            <XCircle className="w-4 h-4 mt-0.5 shrink-0" /> {serverState.message}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <ConfirmButton total={stats.toImport} />
          <button
            type="button"
            onClick={() => setLocal({ type: 'idle' })}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    )
  }

  // ── Idle / Parsing ───────────────────────────────────────────────────────
  return (
    <div
      onClick={() => local.type === 'idle' && document.getElementById('file-input-trigger')?.click()}
      onDragOver={e => { e.preventDefault(); if (local.type === 'idle') setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={[
        'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 transition-colors',
        local.type === 'parsing'
          ? 'border-primary-300 bg-primary-50 cursor-wait'
          : dragging
          ? 'border-primary-500 bg-primary-50 cursor-copy'
          : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50/40 cursor-pointer',
      ].join(' ')}
    >
      {local.type === 'parsing' ? (
        <>
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          <p className="text-sm font-medium text-primary-700">Analizando archivo...</p>
        </>
      ) : (
        <>
          <Upload className={`w-10 h-10 ${dragging ? 'text-primary-500' : 'text-gray-400'}`} />
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              {dragging ? 'Suelta el archivo aquí' : 'Arrastra el archivo o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Formato: .xlsx o .xls</p>
          </div>
        </>
      )}
      <input
        id="file-input-trigger"
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={e => processFile(e.target.files![0])}
      />
    </div>
  )
}
