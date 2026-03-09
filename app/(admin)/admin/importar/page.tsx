import { ImportForm } from '@/components/admin/ImportForm'
import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Importar guías' }

export default async function ImportarPage() {
  const clients = await db.client.findMany({
    where: { active: true },
    select: { companyName: true, legalName: true },
    orderBy: { companyName: 'asc' },
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/admin/guias"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Guías
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Importar guías</h1>
        <p className="text-gray-500 mt-1">
          Sube el archivo Excel maestro para importar guías masivamente.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <ImportForm clients={clients} />
      </div>
    </div>
  )
}
