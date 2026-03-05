import { db } from '@/lib/db'
import { CreateShipmentForm } from '@/components/admin/CreateShipmentForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata = { title: 'Nueva guía' }

export default async function NuevaGuiaPage() {
  const [carriers, clients] = await Promise.all([
    db.carrier.findMany({ where: { active: true }, select: { id: true, name: true }, orderBy: { name: 'asc' } }),
    db.client.findMany({ where: { active: true }, select: { id: true, companyName: true }, orderBy: { companyName: 'asc' } }),
  ])

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/guias" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Guías
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nueva guía</h1>
        <p className="text-gray-500 mt-1">Registra una guía de envío manualmente.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <CreateShipmentForm carriers={carriers} clients={clients} />
      </div>
    </div>
  )
}
