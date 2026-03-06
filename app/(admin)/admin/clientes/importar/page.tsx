import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { ArrowLeft, Upload } from 'lucide-react'
import { ClientImportForm } from '@/components/admin/ClientImportForm'

export const metadata = { title: 'Importar clientes' }

export default async function ImportarClientesPage() {
  const session = await auth()
  if (session?.user.role !== 'admin') redirect('/admin/clientes')

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link
          href="/admin/clientes"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a clientes
        </Link>
        <div className="flex items-center gap-3">
          <Upload className="w-6 h-6 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Importar clientes desde Knack</h1>
            <p className="text-gray-500 mt-0.5 text-sm">Sube el CSV exportado desde Knack para crear los clientes en masa.</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 space-y-1">
            <p className="font-semibold">Columnas requeridas en el CSV:</p>
            <ul className="list-disc list-inside space-y-0.5 text-xs text-blue-700">
              <li><span className="font-mono">Email</span> — correo del cliente (requerido)</li>
              <li><span className="font-mono">Empresa</span> — nombre de la empresa (requerido)</li>
              <li><span className="font-mono">Contraseña</span> — contraseña del cliente (requerido)</li>
              <li><span className="font-mono">Nombre de contacto : First</span> + <span className="font-mono">Last</span> — nombre completo</li>
            </ul>
          </div>
          <ClientImportForm />
        </div>
      </div>
    </div>
  )
}
