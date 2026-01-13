import type { Metadata } from 'next'
import { Hero } from '@/components/sections'
import { Card } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { COMPANY, LOCATION } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Aviso de Privacidad',
  description: `Aviso de privacidad de ${COMPANY.fullName}. Conoce cómo protegemos tus datos personales.`,
}

export default function PrivacyPage() {
  const lastUpdated = '1 de enero de 2026'

  return (
    <>
      <Hero
        title="Aviso de Privacidad"
        subtitle="Legal"
        description={`Última actualización: ${lastUpdated}`}
        size="sm"
      />

      <div className="container-custom py-4">
        <Breadcrumb items={[{ label: 'Aviso de Privacidad' }]} />
      </div>

      <section className="section-padding">
        <div className="container-custom">
          <Card className="max-w-4xl mx-auto p-8 md:p-12">
            <div className="prose prose-gray max-w-none">
              <h2>1. Identidad del Responsable</h2>
              <p>
                <strong>{COMPANY.fullName}</strong>, con domicilio en {LOCATION.fullAddress},
                es responsable del tratamiento de sus datos personales.
              </p>

              <h2>2. Datos Personales Recabados</h2>
              <p>
                Recabamos los siguientes datos personales:
              </p>
              <ul>
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
                <li>Número telefónico</li>
                <li>Dirección de envío y facturación</li>
                <li>RFC (para facturación)</li>
                <li>Datos de pago (procesados por terceros certificados)</li>
              </ul>

              <h2>3. Finalidades del Tratamiento</h2>
              <p>Sus datos personales serán utilizados para:</p>
              <h3>Finalidades primarias:</h3>
              <ul>
                <li>Procesamiento y seguimiento de envíos</li>
                <li>Generación de guías de envío</li>
                <li>Facturación de servicios</li>
                <li>Atención a consultas y soporte</li>
                <li>Comunicación sobre el estado de sus envíos</li>
              </ul>
              <h3>Finalidades secundarias:</h3>
              <ul>
                <li>Envío de promociones y ofertas comerciales</li>
                <li>Encuestas de satisfacción</li>
                <li>Mejora de nuestros servicios</li>
              </ul>
              <p>
                Si no desea que sus datos sean utilizados para finalidades secundarias,
                puede solicitarlo enviando un correo a {COMPANY.email}.
              </p>

              <h2>4. Transferencias de Datos</h2>
              <p>
                Sus datos podrán ser transferidos a:
              </p>
              <ul>
                <li>Empresas de paquetería aliadas para completar envíos</li>
                <li>Procesadores de pago certificados</li>
                <li>Autoridades competentes cuando sea requerido por ley</li>
              </ul>

              <h2>5. Derechos ARCO</h2>
              <p>
                Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al
                tratamiento de sus datos personales (derechos ARCO). Para ejercer
                estos derechos, envíe su solicitud a {COMPANY.email} indicando:
              </p>
              <ul>
                <li>Nombre completo</li>
                <li>Descripción clara de los datos sobre los que desea ejercer sus derechos</li>
                <li>Documentos que acrediten su identidad</li>
              </ul>
              <p>
                Responderemos en un plazo máximo de 20 días hábiles.
              </p>

              <h2>6. Medidas de Seguridad</h2>
              <p>
                Implementamos medidas de seguridad administrativas, técnicas y físicas
                para proteger sus datos personales contra daño, pérdida, alteración,
                destrucción o uso, acceso o tratamiento no autorizado.
              </p>

              <h2>7. Uso de Cookies</h2>
              <p>
                Nuestro sitio web utiliza cookies para mejorar su experiencia de navegación.
                Puede configurar su navegador para rechazar cookies, aunque esto puede
                afectar la funcionalidad del sitio.
              </p>

              <h2>8. Cambios al Aviso de Privacidad</h2>
              <p>
                Nos reservamos el derecho de modificar este aviso de privacidad.
                Cualquier cambio será publicado en esta página con la fecha de
                última actualización.
              </p>

              <h2>9. Contacto</h2>
              <p>
                Para cualquier duda o comentario sobre este aviso de privacidad,
                puede contactarnos en:
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
