# MA-IN - Sitio Web Corporativo

Sitio web corporativo para MA-IN, empresa mexicana de logística con 4 divisiones operativas: Logistic, Track, Pack y Market.

## Tecnologías

- **Next.js 14+** - Framework de React con App Router
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos

## Estructura del Proyecto

```
ma-in/
├── app/                          # App Router de Next.js
│   ├── (divisions)/              # Grupo de rutas para divisiones
│   │   ├── logistic/             # División Logistic
│   │   ├── track/                # División Track
│   │   ├── pack/                 # División Pack
│   │   └── market/               # División Market
│   ├── support/                  # Sección de soporte
│   │   ├── faq/                  # Preguntas frecuentes
│   │   ├── location/             # Ubicación
│   │   └── contact/              # Contacto
│   ├── privacy/                  # Aviso de privacidad
│   ├── terms/                    # Términos y condiciones
│   ├── layout.tsx                # Layout raíz
│   ├── page.tsx                  # Página principal
│   └── not-found.tsx             # Página 404
├── components/
│   ├── ui/                       # Componentes atómicos
│   ├── sections/                 # Componentes de sección
│   ├── layout/                   # Header, Footer, Breadcrumb
│   ├── forms/                    # Formularios
│   └── common/                   # Componentes compartidos
├── data/                         # Datos mockeados
├── lib/                          # Utilidades y constantes
└── public/                       # Archivos estáticos
```

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/ma-in.git
cd ma-in

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.local.example .env.local

# Configurar la API key de Google Maps en .env.local
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key

# Iniciar servidor de desarrollo
npm run dev
```

## Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## Variables de Entorno

Crea un archivo `.env.local` basado en `.env.local.example`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_de_google_maps
NEXT_PUBLIC_API_URL=https://api.ma-in.mx
NEXT_PUBLIC_CONTACT_EMAIL=contacto@ma-in.mx
NEXT_PUBLIC_CONTACT_PHONE=+52 777 123 4567
```

## Paleta de Colores

| Color     | Hex       | Uso                    |
|-----------|-----------|------------------------|
| Primary   | #138A6F   | Color principal verde  |
| Accent    | #E1C357   | Color acento dorado    |
| Light     | #FFFFFF   | Fondos claros          |

## Páginas Principales

### Divisiones
- `/logistic` - Servicios de logística y transporte
- `/logistic/services` - Detalle de servicios
- `/logistic/coverage` - Cobertura nacional
- `/logistic/process` - Proceso de envío
- `/logistic/quote` - Cotización de envío
- `/track` - Sistema de rastreo
- `/track/track-shipment` - Rastrear envío
- `/track/create-guide` - Generar guía
- `/track/features` - Características
- `/pack` - Empaques y embalaje
- `/pack/catalog` - Catálogo de productos
- `/pack/featured` - Productos destacados
- `/pack/solutions` - Soluciones por industria
- `/market` - Tienda en línea

### Soporte
- `/support` - Centro de soporte
- `/support/faq` - Preguntas frecuentes
- `/support/location` - Ubicación y horarios
- `/support/contact` - Formulario de contacto

### Legal
- `/privacy` - Aviso de privacidad
- `/terms` - Términos y condiciones

## Componentes Principales

### UI (`components/ui/`)
- `Button` - Botones con variantes
- `Card` - Tarjetas
- `Input` - Campos de entrada
- `Textarea` - Áreas de texto
- `Select` - Selectores
- `Badge` - Etiquetas
- `Accordion` - Acordeón para FAQ

### Secciones (`components/sections/`)
- `Hero` - Sección hero con gradiente
- `DivisionCard` - Tarjeta de división
- `Features` - Grid de características
- `Stats` - Estadísticas
- `CTA` - Call to action

### Formularios (`components/forms/`)
- `ContactForm` - Formulario de contacto
- `QuoteForm` - Formulario de cotización
- `TrackingForm` - Formulario de rastreo

## Despliegue en Vercel

1. Conecta tu repositorio de GitHub con Vercel
2. Configura las variables de entorno en el panel de Vercel
3. Vercel detectará automáticamente Next.js y configurará el build

## Próximos Pasos

- [ ] Integración con API de backend
- [ ] Sistema de autenticación
- [ ] Carrito de compras funcional
- [ ] Pasarela de pagos
- [ ] Dashboard de usuario
- [ ] Sistema de notificaciones

## Licencia

Todos los derechos reservados - MA-IN Logística y Servicios
