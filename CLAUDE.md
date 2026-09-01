# CLAUDE.md — MA-IN

## Rol

Actúas como experto fullstack con dominio en:
- **UX/UI y diseño frontend** — interfaces limpias, accesibles y responsive
- **Base de datos** — modelado relacional, Prisma ORM, PostgreSQL (Neon)
- **Backend** — Next.js App Router, Server Actions, API Routes, Auth
- **Arquitectura** — separación de responsabilidades, reutilización, código limpio

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 14.2 (App Router) |
| UI | React 18.3, Tailwind CSS 3.4, Lucide React |
| Lenguaje | TypeScript 5.5 estricto |
| ORM | Prisma v7 — output en `lib/generated/prisma` |
| Base de datos | PostgreSQL (Neon) — `lib/db.ts` singleton |
| Auth | next-auth@beta v5 + bcryptjs — split edge/node |
| Utilidades | clsx, nanoid, recharts, xlsx, qrcode |

## Principios de desarrollo

- **Sin duplicar código.** Extrae lógica compartida a helpers, hooks o componentes reutilizables.
- **Sin over-engineering.** Implementa solo lo que el task requiere; no agregues abstracciones hipotéticas.
- **Sin comentarios obvios.** Solo documenta el _por qué_ cuando no es evidente.
- **Server-first.** Prefiere Server Components y Server Actions sobre Client Components.
- **Tipado estricto.** Infiere tipos desde Prisma; no uses `any`.
- **Validación en el borde.** Valida solo en entradas externas (formularios, APIs). Confía en las garantías internas de TypeScript/Prisma.

## Diseño responsive (obligatorio en todo cambio)

Todo cambio de UI debe funcionar correctamente en:

| Breakpoint | Uso |
|-----------|-----|
| `sm` (640 px) | Móvil horizontal |
| `md` (768 px) | Tablet vertical |
| `lg` (1024 px) | Tablet horizontal / laptop |
| `xl` (1280 px) | Desktop |

**Reglas:**
- Diseña mobile-first: la base es móvil, usa `md:` / `lg:` para ampliar.
- Grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` según contenido.
- Tablas: en móvil usa scroll horizontal (`overflow-x-auto`) o rediseña como tarjetas.
- Formularios: columnas completas en móvil, multi-columna en `md:`.
- Sidebar admin: colapsable/overlay en móvil, fija en `lg:`.
- Tipografía y espaciado: escala con `text-sm md:text-base`, `p-3 md:p-6`.

## Arquitectura de carpetas

```
app/
  (main)/         — Sitio público (layout con Header/Footer)
    (divisions)/  — Páginas de Logistik, Pack, Market
    support/      — Contacto, FAQ, Ubicación
  (admin)/        — Panel interno (layout con Sidebar, sin Header/Footer)
    admin/        — Dashboard, guías, clientes, usuarios, importar
  (portal)/       — Portal empresarial para clientes
  (scan)/         — App de escaneo (repartidores)
  (print)/        — Vista de impresión de guías/lotes
  api/            — Route Handlers
  login/          — Página de login pública

components/
  ui/             — Primitivas (Button, Input, Select, Card, Badge…)
  layout/         — Header, Footer, Breadcrumb
  sections/       — Hero, Features, Stats, CTA, DivisionCard
  forms/          — ContactForm, QuoteForm, TrackingForm
  common/         — FAQ, GoogleMap, LoadingSpinner
  admin/          — Componentes exclusivos del panel admin
  portal/         — Componentes del portal de clientes
  (cada carpeta expone un index.ts barrel)

lib/
  auth.config.ts  — Edge-safe (sin DB/bcrypt) — usado en middleware
  auth.ts         — Full config (Credentials + DB + bcrypt)
  db.ts           — Singleton PrismaClient
  actions/        — Server Actions agrupadas por entidad
  constants.ts    — Constantes globales
  utils.ts        — cn() y helpers
  validation.ts   — Schemas de validación

data/             — Datos estáticos: divisions, services, faq, products
prisma/
  schema.prisma   — Modelos: Carrier, Client, User, Shipment, Batch, Contact…
middleware.ts     — Protege /admin/* con NextAuth(authConfig)
```

## Convenciones de código

- **Alias:** `@/*` para todas las importaciones internas.
- **Estilos:** `cn()` de `@/lib/utils` para clases condicionales.
- **Colores de marca:** Primary teal `#138A6F` · Accent gold `#E1C357`.
- **Idioma:** Español (es-MX) en toda la UI y mensajes de error.
- **Barrel exports:** Importa componentes desde el índice de la carpeta, no el archivo directo.
- **Server Actions:** En `lib/actions/<entidad>.ts`, tipadas con retorno `{ success, error?, data? }`.
- **Formularios admin:** Usan `useActionState` + Server Action. Sin librerías de formulario externas.
- **Prisma:** Importa desde `@/lib/generated/prisma/client`, nunca desde `@prisma/client`.

## Modelos principales (Prisma)

| Modelo | Tabla | Descripción |
|--------|-------|-------------|
| `Carrier` | `carriers` | Paqueterías (MA-IN, FedEx, DHL…) |
| `Client` | `clients` | Empresas clientes |
| `User` | `users` | Empleados y usuarios empresariales (`admin`, `operator`, `client`) |
| `Shipment` | `shipments` | Guías de envío (tabla principal) |
| `ShipmentEvent` | `shipment_events` | Historial de estatus |
| `ShipmentEvidence` | `shipment_evidence` | Fotos y firmas de entrega |
| `Batch` | `batches` | Lotes para envíos masivos |
| `Contact` | `contacts` | Agenda de contactos frecuentes por cliente |
| `CsvImport` | `csv_imports` | Log de importaciones CSV |

## Rutas del panel admin

| Ruta | Descripción |
|------|-------------|
| `/login` | Login público |
| `/admin` | Dashboard con estadísticas |
| `/admin/guias` | Lista de guías con filtros y paginación |
| `/admin/guias/nueva` | Crear guía individual |
| `/admin/guias/[id]` | Detalle de guía |
| `/admin/clientes` | Lista de clientes |
| `/admin/clientes/nuevo` | Crear cliente |
| `/admin/clientes/[id]` | Editar cliente |
| `/admin/clientes/importar` | Importar clientes CSV |
| `/admin/importar` | Importar guías CSV por carrier |
| `/admin/lote/[batchId]` | Detalle de lote |
| `/admin/usuarios` | Gestión de usuarios |
| `/admin/perfil` | Perfil del usuario autenticado |
| `/admin/soporte` | Soporte interno |

## Auth

- `admin@ma-in.mx` / `Admin123!` — seeded con `npm run db:seed`
- Roles: `admin` > `operator` > `client`
- Middleware protege `/admin/*` en el edge usando `auth.config.ts` (sin Node.js APIs)
- Server Components usan `auth()` de `lib/auth.ts` para leer sesión

## Importación de guías (CSV/Excel)

- `/admin/importar` → `components/admin/ImportForm.tsx` → `lib/actions/imports.ts`
- **Preview server-side real**: `previewImportShipments` y `importShipments` comparten la misma función interna `parseAndValidate()` — el preview nunca puede divergir de lo que realmente se escribe en BD. El cliente ya no parsea el Excel (se eliminó el `xlsx` duplicado en `ImportForm.tsx`).
- **Columnas de Excel esperadas** (header exacto, sensible a mayúsculas/espacios): `COD DE RASTREO` (obligatoria), `NOMBRE CORTO DE ORIGEN`, `FOLIO INTERNO`, `TIPO DE SERVICIO`, `NUM GUIA`, `DESTINO`, `STATUS`, `RECIBIDO DESTINO`, `CONTENIDO`, `PESO MAIN`, `SOBREPESO MAIN`, `FECHA` + columnas de `carrierMetadata` (`PESO ESTAFETA`, `SOBREPESO ESTAFETA`, `SEGURO`, `PRECIO DE GUIA`, `CARGO X COMBUSTIBLE`, `PRECIO SOBREPESO`, `SUBTOTAL`).
  - Si el archivo trae `PESO ESTAFETA`/`SOBREPESO ESTAFETA` pero no `PESO MAIN`/`SOBREPESO MAIN` (formato usado por algunos remitentes), `weight`/`overweight` cae a esos valores como fallback en vez de quedar en `null` (2026-09-01).
  - Carrier: el usuario lo selecciona explícitamente en un `<select>` en `/admin/importar` (carriers activos, cargados server-side en `page.tsx`) y se envía como `carrierId` en el `FormData`; `parseAndValidate()` valida que exista y esté activo. Ya no se infiere automáticamente (2026-09-01).
  - Cliente se vincula por match exacto (mayúsculas/trim) entre `NOMBRE CORTO DE ORIGEN` y `legalName`/`companyName` de un cliente activo; si no hay match, la guía importa con `clientId = null`.
  - Status no reconocido por `normalizeStatus()` cae por default a `EN_RUTA`.
- **Cada importación crea un `Batch`** (agrupa las guías insertadas, `Batch.guideCount` = total real). Visible/reversible en `/admin/lote/[batchId]` vía `components/admin/BatchActions.tsx` → `deleteBatch()` (solo admin, borra el lote completo si la importación tuvo un error).
- Al mostrar totales de un lote en listas paginadas (ej. `ShipmentsTable.tsx`), usar siempre `Batch.guideCount`, **no** `shipments.length` del array cargado — la lista de guías pagina a nivel de shipment individual, así que un lote puede repartirse entre varias páginas.

## `ShipmentStatus` (enum)

Valores: `PENDIENTE`, `EN_RUTA`, `EN_PROCESO_ENTREGA`, `ENTREGADO`, `ERRONEA`, `CADUCADA`, `SIN_UTILIZAR`, `CANCELADA`.

Al agregar un valor nuevo al enum, actualizar también (todos sin fallback exhaustivo automático):
`components/admin/StatusBadge.tsx`, `StatusDonut.tsx`, `UpdateStatusForm.tsx`, `ShipmentsTable.tsx`, `lib/actions/imports.ts` (`normalizeStatus`), `lib/email.ts` (`STATUS_CONFIG`), `components/forms/TrackingForm.tsx` (`TERMINAL`, si es un estado terminal), `app/api/admin/guias/export/route.ts`, `app/(admin)/admin/page.tsx` (dashboard), y los filtros `<select>` en `app/(admin)/admin/guias/page.tsx` y `app/(portal)/portal/guias/page.tsx`. `ScanForm.tsx` y `data/divisions.ts` son listas curadas a propósito (no exhaustivas) — no requieren actualización.

## Entornos y base de datos (Neon)

- Dos branches de Neon: **dev** (local, `.env.local` líneas activas) y **production** (Vercel; en `.env.local` quedan comentadas solo como referencia manual, nunca se usan para desarrollo local).
- `prisma.config.ts` carga `.env.local` y usa `DIRECT_URL` (conexión directa, sin pooler) para operaciones de schema (`prisma generate`, `prisma db push`). La app en runtime (`lib/db.ts`) usa `DATABASE_URL` (pooled) — son variables independientes y **ambas** deben existir en Vercel (Production).
- El proyecto usa `prisma db push` como flujo real de schema (hay drift entre la migración inicial y el estado actual de la BD) — **no** usar `prisma migrate dev`, va a pedir resetear la base.
- `npm run build` = `prisma generate && prisma db push && next build`. Si `DIRECT_URL` falta en las env vars de Vercel, el build falla en el paso de `db push` y Vercel se queda sirviendo el deployment anterior sin avisar con un error visible en la app — solo se ve en los logs del build.

## Comandos útiles

```bash
npm run dev          # Dev server
npm run build        # prisma generate + db push + next build
npm run db:seed      # Seed carriers + admin user
```

## Email (Resend)

- `lib/email.ts` — cliente Resend singleton + templates HTML branded (contacto, travel, notificaciones de guía).
- `lib/notifications.ts` — helpers que fetchan DB y llaman a los templates (nunca lanzan excepción).
- `ContactForm` y `TravelContactForm` ya conectados vía `lib/actions/contact.ts` / `lib/actions/travel.ts`.
- MA-IN Track: notificaciones automáticas de guía creada/actualizada/entregada ya implementadas — **no** se disparan en importaciones masivas (`importShipments` usa `createMany`, sin notificaciones, para evitar spam al cargar históricos).
- Cron de guías estancadas: `app/api/cron/stagnant/route.ts` + `vercel.json` (9am L-V).
