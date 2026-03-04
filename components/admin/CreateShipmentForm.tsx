'use client'

import { useFormState } from 'react-dom'
import { createShipment } from '@/lib/actions/shipments'

interface Carrier { id: number; name: string }
interface Client { id: number; companyName: string }

interface CreateShipmentFormProps {
  carriers: Carrier[]
  clients: Client[]
}

const initialState = { status: 'idle' as const }

const inputClass =
  'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500'

const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 border-b border-gray-100 mb-4">
      {children}
    </h3>
  )
}

export function CreateShipmentForm({ carriers, clients }: CreateShipmentFormProps) {
  const [state, formAction] = useFormState(createShipment, initialState)

  return (
    <form action={formAction} className="space-y-8">
      {/* Guía */}
      <div>
        <SectionTitle>Guía</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>
              Código de rastreo <span className="text-red-500">*</span>
            </label>
            <input name="trackingCode" required className={inputClass} placeholder="Ej: 1Z999AA10123456784" />
          </div>
          <div>
            <label className={labelClass}>
              Carrier <span className="text-red-500">*</span>
            </label>
            <select name="carrierId" required className={inputClass}>
              <option value="">Selecciona...</option>
              {carriers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select name="status" defaultValue="PENDIENTE" className={inputClass}>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_RUTA">En ruta</option>
              <option value="EN_PROCESO_ENTREGA">En proceso de entrega</option>
              <option value="ENTREGADO">Entregado</option>
              <option value="ERRONEA">Errónea</option>
              <option value="CADUCADA">Caducada</option>
              <option value="SIN_UTILIZAR">Sin utilizar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cliente */}
      <div>
        <SectionTitle>Cliente</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Cliente <span className="text-gray-400">(opcional)</span></label>
            <select name="clientId" className={inputClass}>
              <option value="">Sin asignar</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.companyName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Remitente */}
      <div>
        <SectionTitle>Remitente</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input name="senderName" className={inputClass} placeholder="Nombre del remitente" />
          </div>
          <div>
            <label className={labelClass}>Ciudad</label>
            <input name="originCity" className={inputClass} placeholder="Ciudad" />
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <input name="originState" className={inputClass} placeholder="Estado" />
          </div>
        </div>
      </div>

      {/* Consignatario */}
      <div>
        <SectionTitle>Consignatario</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input name="recipientName" className={inputClass} placeholder="Nombre del destinatario" />
          </div>
          <div>
            <label className={labelClass}>Ciudad</label>
            <input name="destCity" className={inputClass} placeholder="Ciudad" />
          </div>
          <div>
            <label className={labelClass}>Estado</label>
            <input name="destState" className={inputClass} placeholder="Estado" />
          </div>
          <div>
            <label className={labelClass}>C.P.</label>
            <input name="destPostal" className={inputClass} placeholder="Código postal" maxLength={10} />
          </div>
        </div>
      </div>

      {/* Paquete */}
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
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm transition-colors"
        >
          Crear guía
        </button>
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
