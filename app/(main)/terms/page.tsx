import type { Metadata } from 'next'
import { Hero } from '@/components/sections'
import { Card } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { COMPANY, LOCATION } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: `Términos y condiciones de uso de los servicios de ${COMPANY.fullName}.`,
}

export default function TermsPage() {
  const lastUpdated = '1 de enero de 2026'

  return (
    <>
      <Hero
        title="Términos y Condiciones"
        subtitle="Legal"
        description={`Última actualización: ${lastUpdated}`}
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb items={[{ label: 'Términos y Condiciones' }]} />
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <Card className="max-w-4xl mx-auto p-8 md:p-12">
            <div className="prose prose-gray max-w-none">
              <h2>1. Aceptación de Términos</h2>
              <p>
                Al utilizar los servicios de <strong>{COMPANY.fullName}</strong>,
                usted acepta estos términos y condiciones en su totalidad.
                Si no está de acuerdo con alguna parte de estos términos,
                no deberá utilizar nuestros servicios.
              </p>

              <h2>2. Servicios</h2>
              <p>
                {COMPANY.name} ofrece servicios de:
              </p>
              <ul>
                <li>Logística y transporte de paquetería a nivel nacional</li>
                <li>Rastreo de envíos en tiempo real</li>
                <li>Venta de empaques y materiales de embalaje</li>
                <li>Tienda en línea de suministros</li>
              </ul>

              <h2>3. Condiciones de Envío</h2>
              <h3>3.1 Restricciones</h3>
              <p>No se aceptan envíos de:</p>
              <ul>
                <li>Sustancias peligrosas, inflamables o explosivas</li>
                <li>Armas de cualquier tipo</li>
                <li>Drogas o sustancias ilegales</li>
                <li>Animales vivos</li>
                <li>Dinero en efectivo o valores negociables</li>
                <li>Artículos perecederos sin empaque adecuado</li>
                <li>Artículos prohibidos por la ley mexicana</li>
              </ul>

              <h3>3.2 Empaque</h3>
              <p>
                El remitente es responsable del empaque adecuado de sus productos.
                {COMPANY.name} no se hace responsable por daños causados por
                empaque deficiente.
              </p>

              <h3>3.3 Tiempos de Entrega</h3>
              <p>
                Los tiempos de entrega son estimados y pueden variar según:
              </p>
              <ul>
                <li>Ubicación de origen y destino</li>
                <li>Condiciones climáticas</li>
                <li>Días festivos</li>
                <li>Situaciones de fuerza mayor</li>
              </ul>

              <h2>4. Responsabilidad y Seguro</h2>
              <h3>4.1 Cobertura Básica</h3>
              <p>
                Todos los envíos incluyen una cobertura básica de hasta $1,000 MXN.
                Para valores mayores, se recomienda contratar seguro adicional.
              </p>

              <h3>4.2 Reclamaciones</h3>
              <p>
                Las reclamaciones por pérdida o daño deben presentarse dentro de
                los 5 días hábiles posteriores a la fecha de entrega programada.
              </p>

              <h3>4.3 Limitaciones</h3>
              <p>
                {COMPANY.name} no será responsable por:
              </p>
              <ul>
                <li>Daños indirectos o consecuentes</li>
                <li>Pérdida de ganancias o ingresos</li>
                <li>Declaraciones falsas sobre el contenido</li>
                <li>Eventos de fuerza mayor</li>
              </ul>

              <h2>5. Precios y Pagos</h2>
              <p>
                Los precios de nuestros servicios están sujetos a cambio sin previo aviso.
                El pago debe realizarse antes del envío o según los términos acordados
                para clientes con línea de crédito.
              </p>

              <h2>6. Política de Cancelación</h2>
              <p>
                Las guías pueden cancelarse antes de la recolección del paquete.
                Una vez recolectado, no se realizan reembolsos.
                Las guías no utilizadas tienen vigencia de 30 días.
              </p>

              <h2>7. Compras en Línea</h2>
              <h3>7.1 Productos</h3>
              <p>
                Los productos mostrados en nuestra tienda están sujetos a disponibilidad.
                Las imágenes son ilustrativas y pueden variar del producto real.
              </p>

              <h3>7.2 Devoluciones</h3>
              <p>
                Aceptamos devoluciones dentro de los 7 días posteriores a la compra,
                siempre que el producto esté sin uso y en su empaque original.
              </p>

              <h2>8. Propiedad Intelectual</h2>
              <p>
                Todo el contenido de este sitio web, incluyendo logos, textos,
                imágenes y software, es propiedad de {COMPANY.fullName} y está
                protegido por las leyes de propiedad intelectual.
              </p>

              <h2>9. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento.
                Los cambios entrarán en vigor a partir de su publicación en este sitio.
              </p>

              <h2>10. Ley Aplicable</h2>
              <p>
                Estos términos se rigen por las leyes de los Estados Unidos Mexicanos.
                Cualquier controversia será sometida a los tribunales competentes
                del estado de Morelos.
              </p>

              <h2>11. Contacto</h2>
              <p>
                Para cualquier pregunta sobre estos términos, contáctenos en:
              </p>
              <ul>
                <li>Email: {COMPANY.email}</li>
                <li>Teléfono: {COMPANY.phone}</li>
                <li>Dirección: {LOCATION.fullAddress}</li>
              </ul>
            </div>
          </Card>
        </div>
      </section>
    </>
  )
}
