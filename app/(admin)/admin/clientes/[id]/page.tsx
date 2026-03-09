import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { EditClientForm } from '@/components/admin/EditClientForm'
import { ShipmentsTable } from '@/components/admin/ShipmentsTable'
import { ContactsSection } from '@/components/admin/ContactsSection'
import { DeleteClientButton } from '@/components/admin/DeleteClientButton'
import { toggleClientActive } from '@/lib/actions/clients'
import { ResetPasswordButton } from '@/components/admin/ResetPasswordButton'
import { ArrowLeft, Mail, Phone } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ClienteDetailPage({ params }: PageProps) {
  const { id } = await params
  const clientId = parseInt(id)

  if (isNaN(clientId)) notFound()

  const [client, contacts] = await Promise.all([
    db.client.findUnique({
      where: { id: clientId },
      include: {
        users: { select: { id: true, name: true, email: true, role: true, active: true } },
        shipments: {
          include: {
            carrier: { select: { name: true } },
            client: { select: { companyName: true } },
          },
          orderBy: { shipmentDate: 'desc' },
          take: 10,
        },
      },
    }),
    db.contact.findMany({
      where: { clientId },
      orderBy: { name: 'asc' },
      select: {
        id: true, name: true, nickname: true,
        street: true, city: true, state: true, postal: true, phone: true,
      },
    }),
  ])

  if (!client) notFound()

  const portalUser = client.users.find((u) => u.role === 'client')

  async function handleToggle(formData: FormData) {
    'use server'
    await toggleClientActive(clientId, !client!.active)
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <Link href="/admin/clientes" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Clientes
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.companyName}</h1>
            {client.legalName && <p className="text-sm text-gray-500 mt-0.5">{client.legalName}</p>}
            {client.rfc && <p className="text-sm text-gray-500 font-mono mt-0.5">{client.rfc}</p>}
          </div>
          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
              client.active
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {client.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      {/* Datos + editar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Información</h2>
        <EditClientForm
          client={{
            id: client.id,
            companyName: client.companyName,
            legalName: client.legalName,
            contactName: client.contactName,
            rfc: client.rfc,
            phone: client.phone,
          }}
        />
      </div>

      {/* Acceso portal */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Acceso al portal</h2>
        {portalUser ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" />
                {portalUser.email}
              </span>
              {client.phone && (
                <span className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {client.phone}
                </span>
              )}
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  portalUser.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {portalUser.active ? 'Habilitado' : 'Deshabilitado'}
              </span>
            </div>
            <ResetPasswordButton userId={portalUser.id} />
          </div>
        ) : (
          <p className="text-sm text-gray-400">Sin usuario de portal asignado.</p>
        )}
      </div>

      {/* Contactos frecuentes */}
      <ContactsSection clientId={client.id} contacts={contacts} />

      {/* Últimas guías */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Últimas guías</h2>
          <Link
            href={`/admin/guias?client=${client.id}`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver todas
          </Link>
        </div>
        <ShipmentsTable shipments={client.shipments} isAdmin={false} />
      </div>

      {/* Activar / Desactivar / Eliminar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Acceso</h2>
          <p className="text-sm text-gray-500 mb-3">
            {client.active
              ? 'Desactivar bloqueará el acceso al portal para todos los usuarios de este cliente.'
              : 'Activar habilitará el acceso al portal para los usuarios de este cliente.'}
          </p>
          <form action={handleToggle}>
            <button
              type="submit"
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors ${
                client.active
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                  : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
              }`}
            >
              {client.active ? 'Desactivar cliente' : 'Activar cliente'}
            </button>
          </form>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Zona de peligro</h2>
          <DeleteClientButton clientId={client.id} />
        </div>
      </div>
    </div>
  )
}
