import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'MA-IN <noreply@ma-in.mx>'
const TO = 'contacto@ma-in.mx'

const SITE_URL = 'https://ma-in.mx'

function baseTemplate(
  title: string,
  content: string,
  footerText = 'Correo generado automáticamente por ma-in.mx · No responder a este mensaje'
): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#eaf0ee;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#eaf0ee;padding:32px 16px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" role="presentation"
        style="max-width:600px;width:100%;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.10);">

        <!-- ── HEADER ─────────────────────────────── -->
        <tr>
          <td style="background:#138A6F;padding:22px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <!-- Logo on white pill -->
                <td style="vertical-align:middle;" width="90">
                  <div style="background:#ffffff;border-radius:6px;display:inline-block;padding:6px 10px;line-height:0;">
                    <img src="${SITE_URL}/logo.svg" alt="MA-IN" width="64" height="38"
                      style="display:block;border:0;width:64px;height:38px;" />
                  </div>
                </td>
                <!-- Company name -->
                <td style="vertical-align:middle;padding-left:16px;">
                  <p style="margin:0;color:#ffffff;font-size:21px;font-weight:700;letter-spacing:-0.5px;line-height:1;">MA-IN</p>
                  <p style="margin:3px 0 0;color:rgba(255,255,255,0.65);font-size:10px;letter-spacing:1.2px;text-transform:uppercase;">Soluciones integrales</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Gold accent bar -->
        <tr>
          <td style="background:#138A6F;padding:0 32px;">
            <div style="background:#E1C357;height:3px;border-radius:2px;margin-top:16px;font-size:0;line-height:0;">&nbsp;</div>
          </td>
        </tr>
        <!-- Title pill -->
        <tr>
          <td style="background:#138A6F;padding:10px 32px 18px;">
            <p style="margin:0;color:rgba(255,255,255,0.80);font-size:12px;letter-spacing:0.8px;text-transform:uppercase;">${title}</p>
          </td>
        </tr>

        <!-- ── CONTENT ─────────────────────────────── -->
        <tr>
          <td style="padding:36px 36px 28px;">
            ${content}
          </td>
        </tr>

        <!-- ── FOOTER ─────────────────────────────── -->
        <!-- Gold top stripe -->
        <tr>
          <td style="background:#E1C357;height:3px;font-size:0;line-height:0;">&nbsp;</td>
        </tr>
        <tr>
          <td style="background:#f8faf9;padding:20px 36px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td>
                  <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#1f2937;">Grupo MA-IN</p>
                  <p style="margin:0 0 3px;font-size:12px;color:#6b7280;">
                    <a href="mailto:contacto@ma-in.mx" style="color:#138A6F;text-decoration:none;">contacto@ma-in.mx</a>
                    &nbsp;&middot;&nbsp;
                    <a href="tel:+527773045114" style="color:#138A6F;text-decoration:none;">+52 1 777 304 5114</a>
                  </p>
                  <p style="margin:0;font-size:12px;color:#6b7280;">
                    <a href="${SITE_URL}" style="color:#138A6F;text-decoration:none;">ma-in.mx</a>
                    &nbsp;&middot;&nbsp;
                    Cuernavaca, Morelos, México
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding-top:14px;">
                  <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;">${footerText}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}

function fieldRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:9px 16px 9px 0;border-bottom:1px solid #f0f2f1;vertical-align:top;white-space:nowrap;width:1%;">
      <span style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.7px;">${label}</span>
    </td>
    <td style="padding:9px 0 9px 16px;border-bottom:1px solid #f0f2f1;vertical-align:top;">
      <span style="font-size:14px;color:#1f2937;">${value}</span>
    </td>
  </tr>`
}

const SUBJECT_LABELS: Record<string, string> = {
  general: 'Consulta general',
  cotizacion: 'Cotización de servicios',
  soporte: 'Soporte técnico',
  facturacion: 'Facturación',
  otro: 'Otro',
}

const ROUTE_LABELS: Record<string, string> = {
  corporativo: 'Ruta Corporativa',
  familiar: 'Ruta Familiar',
  aifa: 'Cuernavaca ↔ AIFA',
}

const DESTINATION_LABELS: Record<string, string> = {
  'san-miguel': 'San Miguel de Allende',
  guanajuato: 'Guanajuato',
  puebla: 'Puebla',
  veracruz: 'Veracruz',
  oaxaca: 'Oaxaca',
}

export interface ContactEmailData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export async function sendContactEmail(data: ContactEmailData) {
  const subjectLabel = SUBJECT_LABELS[data.subject] ?? data.subject

  const content = `
    <h2 style="margin:0 0 6px;font-size:18px;color:#111827;">Nuevo mensaje de contacto</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
      Recibiste un mensaje desde el formulario de contacto del sitio web.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${fieldRow('Nombre', data.name)}
      ${fieldRow('Email', `<a href="mailto:${data.email}" style="color:#138A6F;text-decoration:none;">${data.email}</a>`)}
      ${data.phone ? fieldRow('Teléfono', data.phone) : ''}
      ${fieldRow('Asunto', subjectLabel)}
    </table>

    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;">Mensaje</p>
    <div style="background:#f9fafb;border-left:3px solid #138A6F;padding:14px 16px;border-radius:0 4px 4px 0;font-size:14px;color:#374151;line-height:1.7;">
      ${data.message.replace(/\n/g, '<br />')}
    </div>

    <div style="margin-top:24px;padding:12px 16px;background:#fffbeb;border-radius:6px;border:1px solid #E1C357;">
      <p style="margin:0;font-size:13px;color:#78350f;">
        Responder directamente a:
        <a href="mailto:${data.email}" style="color:#138A6F;font-weight:600;text-decoration:none;">${data.email}</a>
      </p>
    </div>
  `

  return resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: data.email,
    subject: `[Contacto] ${subjectLabel} — ${data.name}`,
    html: baseTemplate('Formulario de contacto', content),
  })
}

export interface TravelEmailData {
  name: string
  phone: string
  email: string
  routeType: string
  passengers: string
  destination?: string
  date?: string
  comments?: string
}

export async function sendTravelEmail(data: TravelEmailData) {
  const routeLabel = ROUTE_LABELS[data.routeType] ?? data.routeType
  const destinationLabel =
    data.destination && data.destination !== ''
      ? (DESTINATION_LABELS[data.destination] ?? data.destination)
      : 'Por definir'

  const content = `
    <h2 style="margin:0 0 6px;font-size:18px;color:#111827;">Nueva solicitud — MA-IN Travel</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">
      Recibiste una solicitud de información desde la página de Travel.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${fieldRow('Nombre', data.name)}
      ${fieldRow('Teléfono', `<a href="tel:${data.phone}" style="color:#138A6F;text-decoration:none;">${data.phone}</a>`)}
      ${fieldRow('Email', `<a href="mailto:${data.email}" style="color:#138A6F;text-decoration:none;">${data.email}</a>`)}
      ${fieldRow('Tipo de ruta', routeLabel)}
      ${fieldRow('No. de personas', data.passengers)}
      ${fieldRow('Destino', destinationLabel)}
      ${data.date ? fieldRow('Fecha tentativa', data.date) : ''}
    </table>

    ${data.comments ? `
    <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;">Comentarios</p>
    <div style="background:#f9fafb;border-left:3px solid #138A6F;padding:14px 16px;border-radius:0 4px 4px 0;font-size:14px;color:#374151;line-height:1.7;margin-bottom:24px;">
      ${data.comments.replace(/\n/g, '<br />')}
    </div>` : ''}

    <div style="padding:12px 16px;background:#fffbeb;border-radius:6px;border:1px solid #E1C357;">
      <p style="margin:0;font-size:13px;color:#78350f;">
        Contactar al cliente:
        <a href="mailto:${data.email}" style="color:#138A6F;font-weight:600;text-decoration:none;">${data.email}</a>
        &nbsp;·&nbsp;
        <a href="tel:${data.phone}" style="color:#138A6F;font-weight:600;text-decoration:none;">${data.phone}</a>
      </p>
    </div>
  `

  return resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: data.email,
    subject: `[Travel] ${routeLabel} — ${data.name} (${data.passengers} personas)`,
    html: baseTemplate('MA-IN Travel — Solicitud de información', content),
  })
}

// ─── Auto-respuestas al cliente ───────────────────────────────────────────────

const CONTACT_FOOTER =
  '¿Tienes algo más que agregar? Puedes responder directamente a este correo y lo recibiremos de inmediato.'

export async function sendContactAutoReply(data: ContactEmailData) {
  const subjectLabel = SUBJECT_LABELS[data.subject] ?? data.subject
  const firstName = data.name.split(' ')[0]

  const content = `
    <h2 style="margin:0 0 16px;font-size:20px;color:#111827;">Hola, ${firstName} 👋</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
      Recibimos tu mensaje correctamente. Nuestro equipo lo revisará y te responderá
      a la brevedad, generalmente en un plazo de <strong>1 a 2 días hábiles</strong>.
    </p>

    <div style="margin:24px 0;background:#f0faf7;border-radius:8px;padding:20px 24px;border:1px solid #d1fae5;">
      <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#065f46;text-transform:uppercase;letter-spacing:0.6px;">Resumen de tu mensaje</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${fieldRow('Asunto', subjectLabel)}
        ${fieldRow('Mensaje', `<span style="color:#374151;">${data.message.length > 120 ? data.message.slice(0, 120) + '…' : data.message}</span>`)}
      </table>
    </div>

    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.7;">
      Si tu consulta es urgente, también puedes contactarnos directamente por cualquiera de estos medios:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      <tr>
        <td style="padding:8px 0;">
          <a href="mailto:contacto@ma-in.mx" style="font-size:14px;color:#138A6F;text-decoration:none;font-weight:600;">
            ✉️&nbsp; contacto@ma-in.mx
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;">
          <a href="tel:+527773045114" style="font-size:14px;color:#138A6F;text-decoration:none;font-weight:600;">
            📞&nbsp; +52 1 777 304 5114
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;">
          <a href="https://wa.me/527773045114" style="font-size:14px;color:#138A6F;text-decoration:none;font-weight:600;">
            💬&nbsp; WhatsApp
          </a>
        </td>
      </tr>
    </table>
  `

  return resend.emails.send({
    from: FROM,
    to: data.email,
    replyTo: TO,
    subject: `Recibimos tu mensaje — MA-IN`,
    html: baseTemplate('Confirmación de contacto', content, CONTACT_FOOTER),
  })
}

export async function sendTravelAutoReply(data: TravelEmailData) {
  const routeLabel = ROUTE_LABELS[data.routeType] ?? data.routeType
  const destinationLabel =
    data.destination && data.destination !== ''
      ? (DESTINATION_LABELS[data.destination] ?? data.destination)
      : 'Por definir'
  const firstName = data.name.split(' ')[0]

  const content = `
    <h2 style="margin:0 0 16px;font-size:20px;color:#111827;">Hola, ${firstName} 👋</h2>
    <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.7;">
      Recibimos tu solicitud para <strong>${routeLabel}</strong>. Un asesor de
      <strong>MA-IN Travel</strong> se pondrá en contacto contigo en
      <strong>menos de 24 horas</strong> para darte todos los detalles y costos.
    </p>

    <div style="margin:24px 0;background:#f0faf7;border-radius:8px;padding:20px 24px;border:1px solid #d1fae5;">
      <p style="margin:0 0 12px;font-size:12px;font-weight:700;color:#065f46;text-transform:uppercase;letter-spacing:0.6px;">Resumen de tu solicitud</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${fieldRow('Tipo de ruta', routeLabel)}
        ${fieldRow('No. de personas', data.passengers)}
        ${fieldRow('Destino', destinationLabel)}
        ${data.date ? fieldRow('Fecha tentativa', data.date) : ''}
      </table>
    </div>

    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.7;">
      Si necesitas atención inmediata o tienes alguna pregunta antes de que te contactemos,
      puedes escribirnos directamente:
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
      <tr>
        <td style="padding:8px 0;">
          <a href="mailto:contacto@ma-in.mx" style="font-size:14px;color:#138A6F;text-decoration:none;font-weight:600;">
            ✉️&nbsp; contacto@ma-in.mx
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;">
          <a href="tel:+527773045114" style="font-size:14px;color:#138A6F;text-decoration:none;font-weight:600;">
            📞&nbsp; +52 1 777 304 5114
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;">
          <a href="https://wa.me/527773045114" style="font-size:14px;color:#138A6F;text-decoration:none;font-weight:600;">
            💬&nbsp; WhatsApp
          </a>
        </td>
      </tr>
    </table>
  `

  return resend.emails.send({
    from: FROM,
    to: data.email,
    replyTo: TO,
    subject: `Recibimos tu solicitud — MA-IN Travel`,
    html: baseTemplate('MA-IN Travel — Confirmación de solicitud', content, CONTACT_FOOTER),
  })
}

// ─── Notificaciones MA-IN Track ──────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDIENTE:           { label: 'Pendiente',              color: '#92400e', bg: '#fffbeb' },
  EN_RUTA:             { label: 'En ruta',                color: '#1e40af', bg: '#eff6ff' },
  EN_PROCESO_ENTREGA:  { label: 'En proceso de entrega',  color: '#92400e', bg: '#fff7ed' },
  ENTREGADO:           { label: 'Entregado',              color: '#065f46', bg: '#ecfdf5' },
  ERRONEA:             { label: 'Errónea',                color: '#991b1b', bg: '#fef2f2' },
  CADUCADA:            { label: 'Caducada',               color: '#374151', bg: '#f3f4f6' },
  SIN_UTILIZAR:        { label: 'Sin utilizar',           color: '#374151', bg: '#f9fafb' },
}

function statusBadge(status: string): string {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: '#374151', bg: '#f3f4f6' }
  return `<span style="display:inline-block;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700;background:${cfg.bg};color:${cfg.color};">${cfg.label}</span>`
}

function ctaButton(url: string, label: string): string {
  return `<table cellpadding="0" cellspacing="0" role="presentation" style="margin:28px 0 8px;">
  <tr>
    <td style="background:#138A6F;border-radius:6px;">
      <a href="${url}" style="display:inline-block;padding:13px 28px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.3px;">${label} &rarr;</a>
    </td>
  </tr>
</table>`
}

function fmtDate(date: Date): string {
  return date.toLocaleDateString('es-MX', {
    day: '2-digit', month: 'long', year: 'numeric',
    timeZone: 'America/Mexico_City',
  })
}

const TRACK_FOOTER =
  'Notificación automática de MA-IN Track · Si tienes dudas escribe a contacto@ma-in.mx'

export interface ShipmentCreatedEmailData {
  clientEmail: string
  clientName: string
  trackingCode: string
  recipientName?: string | null
  destCity?: string | null
  destState?: string | null
  shipmentDate: Date
  carrierName: string
}

export async function sendShipmentCreatedEmail(data: ShipmentCreatedEmailData) {
  const dest = [data.destCity, data.destState].filter(Boolean).join(', ') || '—'

  const content = `
    <h2 style="margin:0 0 6px;font-size:18px;color:#111827;">Nueva guía registrada en tu cuenta</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#6b7280;">
      Hola, <strong>${data.clientName}</strong>. Se generó una nueva guía de envío en tu cuenta MA-IN.
    </p>

    <div style="background:#f0faf7;border:2px dashed #6ee7b7;border-radius:8px;padding:18px 24px;margin:0 0 24px;text-align:center;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.8px;">Código de rastreo</p>
      <p style="margin:0;font-size:26px;font-weight:700;color:#138A6F;font-family:'Courier New',monospace;letter-spacing:2px;">${data.trackingCode}</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${fieldRow('Destinatario', data.recipientName ?? '—')}
      ${fieldRow('Destino', dest)}
      ${fieldRow('Carrier', data.carrierName)}
      ${fieldRow('Fecha', fmtDate(data.shipmentDate))}
      ${fieldRow('Estatus', statusBadge('PENDIENTE'))}
    </table>

    ${ctaButton(`${SITE_URL}/logistik/track-shipment?code=${data.trackingCode}`, 'Rastrear guía')}
  `

  return resend.emails.send({
    from: FROM,
    to: data.clientEmail,
    replyTo: TO,
    subject: `Nueva guía registrada — ${data.trackingCode}`,
    html: baseTemplate('MA-IN Track — Nueva guía', content, TRACK_FOOTER),
  })
}

export interface ShipmentStatusEmailData {
  clientEmail: string
  clientName: string
  trackingCode: string
  prevStatus: string
  newStatus: string
  recipientName?: string | null
  destCity?: string | null
  destState?: string | null
  receivedBy?: string | null
}

export async function sendShipmentStatusEmail(data: ShipmentStatusEmailData) {
  const dest = [data.destCity, data.destState].filter(Boolean).join(', ') || '—'
  const isDelivered = data.newStatus === 'ENTREGADO'

  const deliveredBox = isDelivered ? `
    <div style="margin:20px 0;background:#ecfdf5;border-radius:8px;padding:18px 24px;border:1px solid #6ee7b7;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#065f46;text-transform:uppercase;letter-spacing:0.5px;">✓ Entrega confirmada</p>
      ${data.receivedBy ? `<p style="margin:0;font-size:14px;color:#1f2937;">Recibido por: <strong>${data.receivedBy}</strong></p>` : ''}
      <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">Fecha: ${fmtDate(new Date())}</p>
    </div>` : ''

  const content = `
    <h2 style="margin:0 0 6px;font-size:18px;color:#111827;">
      ${isDelivered ? '¡Tu guía fue entregada!' : 'Actualización de estatus'}
    </h2>
    <p style="margin:0 0 20px;font-size:14px;color:#6b7280;">
      Hola, <strong>${data.clientName}</strong>. La guía <strong style="font-family:'Courier New',monospace;">${data.trackingCode}</strong> ha cambiado de estatus.
    </p>

    <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin:0 0 24px;display:inline-block;width:100%;box-sizing:border-box;">
      <table cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="vertical-align:middle;">${statusBadge(data.prevStatus)}</td>
          <td style="vertical-align:middle;padding:0 14px;font-size:18px;color:#9ca3af;">&rarr;</td>
          <td style="vertical-align:middle;">${statusBadge(data.newStatus)}</td>
        </tr>
      </table>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      ${fieldRow('Guía', `<span style="font-family:'Courier New',monospace;font-weight:700;">${data.trackingCode}</span>`)}
      ${fieldRow('Destinatario', data.recipientName ?? '—')}
      ${fieldRow('Destino', dest)}
    </table>

    ${deliveredBox}

    ${ctaButton(`${SITE_URL}/logistik/track-shipment?code=${data.trackingCode}`, 'Ver detalle de guía')}
  `

  const subjectPrefix = isDelivered ? '¡Guía entregada!' : `Guía ${data.trackingCode}:`
  const subjectStatus = STATUS_CONFIG[data.newStatus]?.label ?? data.newStatus

  return resend.emails.send({
    from: FROM,
    to: data.clientEmail,
    replyTo: TO,
    subject: `${subjectPrefix} ${subjectStatus} — MA-IN Track`,
    html: baseTemplate('MA-IN Track — Actualización de guía', content, TRACK_FOOTER),
  })
}

export interface StagnantShipmentRow {
  id: string
  trackingCode: string
  clientName: string
  status: string
  daysStagnant: number
}

export async function sendStagnantShipmentAlert(shipments: StagnantShipmentRow[]) {
  const count = shipments.length

  const tableRows = shipments.map(s => {
    const cfg = STATUS_CONFIG[s.status] ?? { label: s.status, color: '#374151', bg: '#f3f4f6' }
    const daysLabel = s.daysStagnant === 1 ? '1 día' : `${s.daysStagnant} días`
    const urgentColor = s.daysStagnant >= 7 ? '#991b1b' : s.daysStagnant >= 5 ? '#92400e' : '#374151'
    return `<tr>
      <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-family:'Courier New',monospace;font-size:13px;color:#138A6F;white-space:nowrap;">
        <a href="${SITE_URL}/admin/guias/${s.id}" style="color:#138A6F;text-decoration:none;">${s.trackingCode}</a>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:13px;color:#374151;">${s.clientName}</td>
      <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;">
        <span style="display:inline-block;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:700;background:${cfg.bg};color:${cfg.color};">${cfg.label}</span>
      </td>
      <td style="padding:10px 12px;border-bottom:1px solid #f3f4f6;font-size:13px;font-weight:700;color:${urgentColor};text-align:center;">${daysLabel}</td>
    </tr>`
  }).join('')

  const content = `
    <div style="margin-bottom:24px;padding:14px 18px;background:#fef2f2;border-radius:8px;border-left:4px solid #dc2626;">
      <p style="margin:0;font-size:15px;font-weight:700;color:#991b1b;">
        ⚠ ${count} guía${count !== 1 ? 's' : ''} sin movimiento por 3 o más días
      </p>
      <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">Revisa y actualiza el estatus para mantener informados a los clientes.</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px;">
      <thead>
        <tr style="background:#f9fafb;">
          <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;border-bottom:2px solid #e5e7eb;">Código</th>
          <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;border-bottom:2px solid #e5e7eb;">Cliente</th>
          <th style="padding:10px 12px;text-align:left;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;border-bottom:2px solid #e5e7eb;">Estatus</th>
          <th style="padding:10px 12px;text-align:center;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.6px;border-bottom:2px solid #e5e7eb;">Sin movimiento</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>

    ${ctaButton(`${SITE_URL}/admin/guias`, 'Ver guías en Admin')}
  `

  return resend.emails.send({
    from: FROM,
    to: TO,
    subject: `⚠ ${count} guía${count !== 1 ? 's' : ''} estancada${count !== 1 ? 's' : ''} — MA-IN Track`,
    html: baseTemplate('MA-IN Track — Alerta operativa', content),
  })
}
