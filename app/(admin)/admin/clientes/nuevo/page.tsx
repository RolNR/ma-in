import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { CreateClientForm } from '@/components/admin/CreateClientForm'

export const metadata = { title: 'Nuevo cliente' }

export default function NuevoClientePage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/clientes" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Clientes
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo cliente</h1>
        <p className="text-gray-500 mt-1">El email será el usuario de acceso al portal.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <CreateClientForm />
      </div>
    </div>
  )
}
