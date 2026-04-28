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

## Comandos útiles

```bash
npm run dev          # Dev server
npm run build        # prisma generate + next build
npm run db:seed      # Seed carriers + admin user
```

## Pendientes — Resend (email)

> Bloqueados hasta que el usuario genere su cuenta en resend.com y comparta la API key.
> Correo destino: `contacto@ma-in.mx`

- [ ] Instalar `resend` y agregar `RESEND_API_KEY` al `.env.local` y `.env.local.example`
- [ ] Crear `lib/email.ts` — cliente Resend singleton + plantillas base
- [ ] Conectar `TravelContactForm` → Server Action `lib/actions/travel.ts` → email a `contacto@ma-in.mx` con los datos del formulario
- [ ] Conectar `ContactForm` (soporte general) al mismo flujo de envío
- [ ] **MA-IN Track — notificaciones automáticas por correo:**
  - Guía creada → correo de confirmación al cliente/operador
  - Guía actualizada (cambio de estatus) → notificación al destinatario/cliente
  - Guía entregada → correo de confirmación de entrega con datos del receptor
