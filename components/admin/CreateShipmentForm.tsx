'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useRef, useState, useEffect } from 'react'
import { createShipment, type CreateShipmentState } from '@/lib/actions/shipments'
import { CheckCircle2, Loader2, Package, MapPin, BookUser } from 'lucide-react'
import Link from 'next/link'

interface Carrier { id: number; name: string }
interface Client  { id: number; companyName: string }
interface Props   { carriers: Carrier[]; clients: Client[] }

interface ContactItem {
  id: number
  name: string
  nickname: string | null
  street: string | null
  city: string | null
  state: string | null
  postal: string | null
}

const inputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'
const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100 mb-4">
      {children}
    </h3>
  )
}

function SubmitButton({ quantity }: { quantity: number }) {
  const { pending } = useFormStatus()
  const label = quantity > 1 ? `Crear ${quantity} guías` : 'Crear guía'
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors"
    >
      {pending ? <><Loader2 className="w-4 h-4 animate-spin" /> Creando...</> : label}
    </button>
  )
}

function SuccessView({ state }: { state: Extract<CreateShipmentState, { status: 'success' }> }) {
  return (
    <div className="space-y-5">
      <div className="rounded-xl border-2 border-green-400 bg-green-50 p-6">
        <div className="flex items-center gap-2 text-green-700 font-semibold text-lg mb-2">
          <CheckCircle2 className="w-5 h-5" />
          {state.count === 1 ? 'Guía creada' : `${state.count} guías creadas`}
        </div>
        <p className="text-sm text-green-700">
          Los códigos de rastreo fueron generados automáticamente.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/admin/guias"
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm transition-colors"
        >
          Ver en guías
        </Link>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          Crear más
        </button>
      </div>
    </div>
  )
}

// ─── CP Lookup ────────────────────────────────────────────────────────────────

interface CPResult { city: string; state: string; abbr: string }

async function lookupCP(cp: string): Promise<CPResult | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/MX/${cp}`)
    if (!res.ok) return null
    const data = await res.json()
    const place = data.places?.[0]
    if (!place) return null
    return {
      city: place['place name'] ?? '',
      state: place['state'] ?? '',
      abbr: place['state abbreviation'] ?? '',
    }
  } catch {
    return null
  }
}

// ─── CP Input with autocomplete ───────────────────────────────────────────────

interface CPInputProps {
  name: string
  cityRef: React.RefObject<HTMLInputElement | null>
  stateRef: React.RefObject<HTMLInputElement | null>
  abbrRef?: React.RefObject<HTMLInputElement | null>
}

function CPInput({ name, cityRef, stateRef, abbrRef }: CPInputProps) {
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cp = e.target.value.trim()
    if (timer.current) clearTimeout(timer.current)
    if (cp.length !== 5) return
    timer.current = setTimeout(async () => {
      setLoading(true)
      const result = await lookupCP(cp)
      setLoading(false)
      if (!result) return
      if (cityRef.current)  cityRef.current.value  = result.city
      if (stateRef.current) stateRef.current.value = result.state
      if (abbrRef?.current) abbrRef.current.value  = result.abbr
    }, 400)
  }

  return (
    <div className="relative">
      <input
        name={name}
        className={inputClass}
        placeholder="Código postal"
        maxLength={10}
        onChange={handleChange}
      />
      {loading && (
        <MapPin className="absolute right-3 top-2.5 w-4 h-4 text-primary-500 animate-pulse" />
      )}
    </div>
  )
}

// ─── Contact quick-fill ───────────────────────────────────────────────────────

interface ContactQuickFillProps {
  contacts: ContactItem[]
  nameRef:   React.RefObject<HTMLInputElement | null>
  streetRef: React.RefObject<HTMLInputElement | null>
  cityRef:   React.RefObject<HTMLInputElement | null>
  stateRef:  React.RefObject<HTMLInputElement | null>
  postalRef: React.RefObject<HTMLInputElement | null>
}

function ContactQuickFill({ contacts, nameRef, streetRef, cityRef, stateRef, postalRef }: ContactQuickFillProps) {
  if (contacts.length === 0) return null

  function fill(c: ContactItem) {
    if (nameRef.current)   nameRef.current.value   = c.name
    if (streetRef.current) streetRef.current.value = c.street ?? ''
    if (cityRef.current)   cityRef.current.value   = c.city ?? ''
    if (stateRef.current)  stateRef.current.value  = c.state ?? ''
    if (postalRef.current) postalRef.current.value = c.postal ?? ''
  }

  return (
    <div className="flex items-center gap-2 mb-3 p-2.5 bg-primary-50 border border-primary-100 rounded-lg">
      <BookUser className="w-3.5 h-3.5 text-primary-500 shrink-0" />
      <span className="text-xs text-primary-700 font-medium whitespace-nowrap">Usar contacto:</span>
      <select
        className="flex-1 text-xs border border-primary-200 rounded px-2 py-1 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
        onChange={e => {
          const id = parseInt(e.target.value)
          const c = contacts.find(x => x.id === id)
          if (c) fill(c)
          e.target.value = ''
        }}
        defaultValue=""
      >
        <option value="" disabled>Selecciona un contacto guardado...</option>
        {contacts.map(c => (
          <option key={c.id} value={c.id}>
            {c.nickname ? `${c.nickname} · ${c.name}` : c.name}
            {c.city ? ` — ${c.city}` : ''}
          </option>
        ))}
      </select>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CreateShipmentForm({ carriers, clients }: Props) {
  const [state, formAction] = useFormState(createShipment, { status: 'idle' })
  const [quantity, setQuantity] = useState(1)
  const [selectedClientId, setSelectedClientId] = useState('')
  const [contacts, setContacts] = useState<ContactItem[]>([])

  useEffect(() => {
    if (!selectedClientId) { setContacts([]); return }
    fetch(`/api/contacts?clientId=${selectedClientId}`)
      .then(r => r.json())
      .then(data => setContacts(Array.isArray(data) ? data : []))
      .catch(() => setContacts([]))
  }, [selectedClientId])

  // Refs para autofill de CP
  const originCityRef  = useRef<HTMLInputElement>(null)
  const originStateRef = useRef<HTMLInputElement>(null)
  const destCityRef    = useRef<HTMLInputElement>(null)
  const destStateRef   = useRef<HTMLInputElement>(null)
  const destAbbrRef    = useRef<HTMLInputElement>(null)

  // Refs para autofill de contacto
  const senderNameRef  = useRef<HTMLInputElement>(null)
  const originStreetRef = useRef<HTMLInputElement>(null)
  const recipientNameRef = useRef<HTMLInputElement>(null)
  const destStreetRef  = useRef<HTMLInputElement>(null)

  if (state.status === 'success') return <SuccessView state={state} />

  return (
    <form action={formAction} className="space-y-8">

      {/* ── Guía ─────────────────────────────────────────────── */}
      <div>
        <SectionTitle>Guía</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div>
            <label className={labelClass}>Tipo <span className="text-red-500">*</span></label>
            <select name="guideType" defaultValue="EXPRESS" className={inputClass}>
              <option value="EXPRESS">Express</option>
              <option value="ECONOMY">Economy</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Carrier <span className="text-red-500">*</span></label>
            <select name="carrierId" required className={inputClass}>
              <option value="">Selecciona...</option>
              {carriers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Cantidad
              <span className="ml-1 text-xs text-gray-400">(máx. 50)</span>
            </label>
            <input
              name="quantity"
              type="number"
              min="1"
              max="50"
              value={quantity}
              onChange={e => setQuantity(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-fit">
          <Package className="w-3.5 h-3.5" />
          Código de rastreo y status se asignan automáticamente
        </div>
      </div>

      {/* ── Cliente ───────────────────────────────────────────── */}
      <div>
        <SectionTitle>Cliente</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Cliente <span className="text-gray-400">(opcional)</span></label>
            <select
              name="clientId"
              className={inputClass}
              value={selectedClientId}
              onChange={e => setSelectedClientId(e.target.value)}
            >
              <option value="">Sin asignar</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Remitente ─────────────────────────────────────────── */}
      <div>
        <SectionTitle>Remitente</SectionTitle>
        <ContactQuickFill
          contacts={contacts}
          nameRef={senderNameRef}
          streetRef={originStreetRef}
          cityRef={originCityRef}
          stateRef={originStateRef}
          postalRef={{ current: null }}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input ref={senderNameRef} name="senderName" className={inputClass} placeholder="Nombre del remitente" />
          </div>
          <div>
            <label className={labelClass}>Calle y número</label>
            <input ref={originStreetRef} name="originStreet" className={inputClass} placeholder="Av. Reforma 123, Col. Centro" />
          </div>
          <div>
            <label className={labelClass}>
              C.P.
              <span className="ml-1 text-xs text-primary-500">→ autorrellena ciudad y estado</span>
            </label>
            <CPInput
              name="originPostal"
              cityRef={originCityRef}
              stateRef={originStateRef}
            />
          </div>
          <div>
            <label className={labelClass}>Ciudad</label>
            <input ref={originCityRef} name="originCity" className={inputClass} placeholder="Ciudad" />
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <input ref={originStateRef} name="originState" className={inputClass} placeholder="Estado" />
          </div>
        </div>
      </div>

      {/* ── Consignatario ─────────────────────────────────────── */}
      <div>
        <SectionTitle>Consignatario</SectionTitle>
        <ContactQuickFill
          contacts={contacts}
          nameRef={recipientNameRef}
          streetRef={destStreetRef}
          cityRef={destCityRef}
          stateRef={destStateRef}
          postalRef={{ current: null }}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input ref={recipientNameRef} name="recipientName" className={inputClass} placeholder="Nombre del destinatario" />
          </div>
          <div>
            <label className={labelClass}>Calle y número</label>
            <input ref={destStreetRef} name="destStreet" className={inputClass} placeholder="Av. Domingo Díez 910, Col. Lomas" />
          </div>
          <div>
            <label className={labelClass}>
              C.P.
              <span className="ml-1 text-xs text-primary-500">→ autorrellena ciudad, estado y siglas</span>
            </label>
            <CPInput
              name="destPostal"
              cityRef={destCityRef}
              stateRef={destStateRef}
              abbrRef={destAbbrRef}
            />
          </div>
          <div>
            <label className={labelClass}>Ciudad</label>
            <input ref={destCityRef} name="destCity" className={inputClass} placeholder="Ciudad" />
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <input ref={destStateRef} name="destState" className={inputClass} placeholder="Estado" />
          </div>
          <div>
            <label className={labelClass}>
              Siglas destino
              <span className="ml-1 text-xs text-gray-400">(ej. MOR)</span>
            </label>
            <input ref={destAbbrRef} name="destAbbr" className={inputClass} placeholder="MOR" maxLength={10} />
          </div>
        </div>
      </div>

      {/* ── Paquete ───────────────────────────────────────────── */}
      <div>
        <SectionTitle>Paquete</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Contenido</label>
            <input name="content" className={inputClass} placeholder="Descripción del contenido" />
          </div>
          <div>
            <label className={labelClass}>Peso (kg)</label>
            <input name="weight" type="number" step="0.01" min="0" className={inputClass} placeholder="0.00" />
          </div>
          <div>
            <label className={labelClass}>Fecha de envío</label>
            <input
              name="shipmentDate"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {state.status === 'error' && (
        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{state.message}</p>
      )}

      <div className="flex gap-3">
        <SubmitButton quantity={quantity} />
        <a
          href="/admin/guias"
          className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}
