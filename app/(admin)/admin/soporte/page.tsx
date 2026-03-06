import { HelpCircle, Phone, Mail, MessageCircle, ChevronDown } from 'lucide-react'
import { COMPANY, SCHEDULE } from '@/lib/constants'

export const metadata = { title: 'Soporte' }

const faqs = [
  {
    q: '¿Cómo creo una guía individual?',
    a: 'Ve a "Guías" en el menú lateral y haz clic en "Nueva guía". Llena los datos de carrier, remitente, consignatario y paquete. Si el cliente tiene contactos guardados, puedes autocompletar con un clic.',
  },
  {
    q: '¿Cómo importo guías en lote desde CSV?',
    a: 'Ve a "Importar CSV" en el menú. Selecciona el carrier, sube el archivo CSV con el formato requerido y confirma. El sistema procesa cada fila y reporta cuántas se importaron correctamente y cuáles tuvieron error.',
  },
  {
    q: '¿Cómo actualizo el estatus de una guía?',
    a: 'Abre el detalle de la guía desde "Guías" y usa el panel "Actualizar status" en la columna derecha. Selecciona el nuevo estatus, agrega una nota opcional y guarda. El cambio queda registrado en el historial.',
  },
  {
    q: '¿Qué es un lote y cómo funciona?',
    a: 'Un lote agrupa varias guías creadas al mismo tiempo (cantidad > 1 al crear). Aparecen agrupados en la tabla con un icono de caja. Puedes actualizar el estatus de todo el lote de una sola vez desde el detalle de cualquier guía del lote.',
  },
  {
    q: '¿Cómo archivo o elimino guías?',
    a: 'Selecciona una o varias guías con los checkboxes en la tabla. Aparecerá una barra de acciones en la parte superior con los botones "Archivar" y "Eliminar" (solo admin). Las guías archivadas se pueden ver con el filtro "Ver archivadas".',
  },
  {
    q: '¿Cómo funcionan los contactos frecuentes?',
    a: 'En el detalle de cada cliente puedes agregar contactos frecuentes (remitentes o destinatarios habituales). Al crear una guía y seleccionar ese cliente, aparecerá un selector para autocompletar los campos de remitente o consignatario con un clic.',
  },
  {
    q: '¿Qué puede ver el cliente en su portal?',
    a: 'El cliente accede con su usuario y puede ver únicamente las guías asignadas a su cuenta: estatus actual, historial de movimientos y datos del envío. No tiene acceso al panel admin ni a guías de otros clientes.',
  },
  {
    q: '¿Cómo agrego o reseteo el acceso de un cliente al portal?',
    a: 'Ve al detalle del cliente en "Clientes". En la sección "Acceso al portal" verás el usuario asignado y un botón para resetear su contraseña. Si el cliente no tiene usuario, contacta a un administrador para crearlo.',
  },
]

export default function AdminSoportePage() {
  return (
    <div className="p-8 max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Soporte</h1>
        <p className="text-gray-500 mt-1">Guía de uso del sistema y preguntas frecuentes para operadores.</p>
      </div>

      {/* FAQs */}
      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4" /> Preguntas frecuentes
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                {faq.q}
                <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-3 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
          ¿Necesitas más ayuda?
        </h2>
        <p className="text-sm text-gray-600 mb-5">
          Contacta al administrador del sistema o al equipo técnico de MA-IN.<br />
          Horario de atención: {SCHEDULE.formatted.toLowerCase()}.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`tel:${COMPANY.phone}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Phone className="w-4 h-4 text-gray-400" />
            {COMPANY.phone}
          </a>
          <a
            href={`mailto:${COMPANY.email}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Mail className="w-4 h-4 text-gray-400" />
            {COMPANY.email}
          </a>
          <a
            href={`https://wa.me/${COMPANY.whatsapp.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-medium text-white transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
