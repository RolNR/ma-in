'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { importClients, type ImportClientsState } from '@/lib/actions/clients'
import { useState } from 'react'
import { Upload, FileText, X, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ParsedRow {
  companyName: string
  name: string
  email: string
  passwordHash: string
}

interface InvalidRow {
  index: number
  reason: string
  raw: string
}

interface ParseResult {
  valid: ParsedRow[]
  invalid: InvalidRow[]
  total: number
}

type LocalStep =
  | { type: 'idle' }
  | { type: 'parsing' }
  | { type: 'preview'; fileName: string; result: ParseResult; rowsJson: string }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

function parseKnackCSV(text: string): ParseResult {
  // Split by lines, handle \r\n and \n
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')

  if (lines.length < 2) return { valid: [], invalid: [], total: 0 }

  // Parse CSV respecting quoted fields
  function parseLine(line: string): string[] {
    const fields: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
        else inQuotes = !inQuotes
      } else if (ch === ',' && !inQuotes) {
        fields.push(current.trim())
        current = ''
      } else {
        current += ch
      }
    }
    fields.push(current.trim())
    return fields
  }

  const headers = parseLine(lines[0]).map(h => h.replace(/^"|"$/g, ''))

  const idx = {
    first:    headers.findIndex(h => h === 'Nombre de contacto : First'),
    last:     headers.findIndex(h => h === 'Nombre de contacto : Last'),
    email:    headers.findIndex(h => h === 'Email'),
    password: headers.findIndex(h => h === 'Contraseña'),
    empresa:  headers.findIndex(h => h === 'Empresa'),
  }

  const valid: ParsedRow[] = []
  const invalid: InvalidRow[] = []

  const dataLines = lines.slice(1).filter(l => l.trim() !== '')

  dataLines.forEach((line, i) => {
    const cols = parseLine(line)
    const email = (idx.email >= 0 ? cols[idx.email] : '').toLowerCase().trim()
    const empresa = (idx.empresa >= 0 ? cols[idx.empresa] : '').trim()
    const first = (idx.first >= 0 ? cols[idx.first] : '').trim()
    const last  = (idx.last  >= 0 ? cols[idx.last]  : '').trim()
    const password = (idx.password >= 0 ? cols[idx.password] : '').trim()

    if (!email) {
      invalid.push({ index: i + 2, reason: 'Sin email', raw: empresa || line.slice(0, 40) })
      return
    }
    if (!empresa) {
      invalid.push({ index: i + 2, reason: 'Sin empresa', raw: email })
      return
    }
    if (!password) {
      invalid.push({ index: i + 2, reason: 'Sin contraseña', raw: email })
      return
    }

    const name = toTitleCase([first, last].filter(Boolean).join(' ') || empresa)

    valid.push({ companyName: toTitleCase(empresa), name, email, passwordHash: password })
  })

  return { valid, invalid, total: dataLines.length }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number; color: 'gray' | 'green' | 'amber' | 'red' }) {
  const colors = { gray: 'text-gray-900', green: 'text-green-700', amber: 'text-amber-600', red: 'text-red-600' }
  return (
    <div className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
      <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold mt-0.5 ${colors[color]}`}>{value}</p>
    </div>
  )
}

function ConfirmButton({ total }: { total: number }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending || total === 0}
      className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
    >
      {pending
        ? <><Loader2 className="w-4 h-4 animate-spin" /> Importando...</>
        : <><Upload className="w-4 h-4" /> Importar {total} cliente{total !== 1 ? 's' : ''}</>}
    </button>
  )
}

function SuccessView({ state }: { state: Extract<ImportClientsState, { status: 'success' }> }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border-2 border-green-400 bg-green-50 p-6">
        <div className="flex items-center gap-2 text-green-700 font-semibold text-lg mb-5">
          <CheckCircle2 className="w-5 h-5" />
          Importación completada
        </div>
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Importados" value={state.imported} color="green" />
          <StatCard label="Ya existían" value={state.skipped} color={state.skipped > 0 ? 'amber' : 'gray'} />
          <StatCard label="Errores" value={state.errors} color={state.errors > 0 ? 'red' : 'gray'} />
        </div>
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

export function ClientImportForm() {
  const [serverState, formAction] = useFormState(importClients, { status: 'idle' })
  const [local, setLocal] = useState<LocalStep>({ type: 'idle' })
  const [dragging, setDragging] = useState(false)

  async function processFile(file: File) {
    if (!/\.csv$/i.test(file.name)) return
    setLocal({ type: 'parsing' })

    try {
      const text = await file.text()
      const result = parseKnackCSV(text)
      const rowsJson = JSON.stringify(result.valid)
      setLocal({ type: 'preview', fileName: file.name, result, rowsJson })
    } catch {
      setLocal({ type: 'idle' })
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  if (serverState.status === 'success') return <SuccessView state={serverState} />

  if (local.type === 'preview') {
    const { fileName, result, rowsJson } = local
    const preview = result.valid.slice(0, 10)

    return (
      <form action={formAction} className="space-y-5">
        <input name="rowsJson" type="hidden" value={rowsJson} />

        {/* File header */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">{fileName}</p>
              <p className="text-xs text-gray-400">{result.total} filas detectadas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLocal({ type: 'idle' })}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-2.5 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Cambiar
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="A importar" value={result.valid.length} color="green" />
          <StatCard label="Inválidas" value={result.invalid.length} color={result.invalid.length > 0 ? 'amber' : 'gray'} />
          <StatCard label="Total" value={result.total} color="gray" />
        </div>

        {result.invalid.length > 0 && (
          <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2.5 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              {result.invalid.length} fila{result.invalid.length !== 1 ? 's' : ''} omitidas por datos faltantes (sin email, empresa o contraseña).
            </span>
          </div>
        )}

        <p className="text-xs text-gray-400">
          * Los clientes con email ya registrado en el sistema serán omitidos automáticamente.
        </p>

        {/* Preview table */}
        {result.valid.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Primeras {preview.length} filas válidas
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Empresa', 'Nombre', 'Email'].map(h => (
                      <th key={h} className="text-left px-3 py-2 font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {preview.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-800 max-w-[160px]">
                        <span className="block truncate" title={row.companyName}>{row.companyName}</span>
                      </td>
                      <td className="px-3 py-2 text-gray-600">{row.name || '—'}</td>
                      <td className="px-3 py-2 text-gray-500">{row.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {result.valid.length > 10 && (
              <p className="text-xs text-gray-400 mt-1.5 pl-1">
                + {result.valid.length - 10} más no mostradas
              </p>
            )}
          </div>
        )}

        {serverState.status === 'error' && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 px-3 py-2.5 rounded-lg">
            <XCircle className="w-4 h-4 mt-0.5 shrink-0" /> {serverState.message}
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <ConfirmButton total={result.valid.length} />
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

  // ── Idle / Parsing ──────────────────────────────────────────────────────────
  return (
    <div
      onClick={() => local.type === 'idle' && document.getElementById('client-csv-input')?.click()}
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
              {dragging ? 'Suelta el archivo aquí' : 'Arrastra el CSV o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Exportación de clientes desde Knack (.csv)</p>
          </div>
        </>
      )}
      <input
        id="client-csv-input"
        type="file"
        accept=".csv"
        className="hidden"
        onChange={e => { if (e.target.files?.[0]) processFile(e.target.files[0]) }}
      />
    </div>
  )
}
