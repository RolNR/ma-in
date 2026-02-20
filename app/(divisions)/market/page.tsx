import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Globe,
  Leaf,
  Wine,
  Star,
  Home,
  UtensilsCrossed,
  ShoppingCart,
  Users,
  Sparkles,
  MapPin,
  ArrowRight,
  ShoppingBag,
  Store,
  Zap,
  Coffee,
} from 'lucide-react'
import { LOCATION } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'MA-IN Market - Tienda Gourmet',
  description:
    'Experiencia gourmet única en Cuernavaca. Alimentos selectos, frescos y de temporada de todo el mundo. Vinos, licores, productos orgánicos y artículos del hogar.',
}

const productCategories = [
  {
    icon: ShoppingBag,
    title: 'Alimentos selectos',
    description: 'Embutidos, quesos finos, conservas, especias y productos gourmet de alta calidad.',
    accent: false,
  },
  {
    icon: Leaf,
    title: 'Orgánicos',
    description: 'Abarrotes, snacks, bebidas y productos certificados libres de agroquímicos, para un consumo más consciente.',
    accent: true,
  },
  {
    icon: Wine,
    title: 'Vinos y licores',
    description: 'Amplia selección de vinos nacionales e importados, cervezas y destilados de autor.',
    accent: false,
  },
  {
    icon: Home,
    title: 'Artículos del hogar',
    description: 'Utensilios de cocina, accesorios y productos para el hogar seleccionados con criterio gourmet.',
    accent: true,
  },
]

const conceptos = [
  {
    icon: UtensilsCrossed,
    title: 'Restaurante',
    description: 'Platillos elaborados con los mejores ingredientes frescos y de temporada del mercado.',
  },
  {
    icon: Wine,
    title: 'Bar',
    description: 'Selección curada de vinos, cervezas, cocteles y bebidas de autor.',
  },
  {
    icon: Store,
    title: 'Tienda Gourmet',
    description: 'Productos selectos para llevar a casa y elevar tu experiencia culinaria diaria.',
  },
  {
    icon: Users,
    title: 'Convivencia',
    description: 'Espacios cálidos y amplios diseñados para compartir momentos especiales.',
  },
]

const experienceItems = [
  { icon: UtensilsCrossed, text: 'Barra de alimentos frescos y preparados' },
  { icon: Coffee, text: 'Cafetería con bebidas calientes y frías' },
  { icon: Wine, text: 'Barra de bebidas: jugos, cocteles y vinos' },
  { icon: Sparkles, text: 'Ambientes amplios, cálidos y acogedores' },
  { icon: Users, text: 'Zonas de convivencia y descanso' },
]

export default function MarketPage() {
  return (
    <>
      {/* Banner: Próximamente Tienda en Línea */}
      <div className="bg-accent">
        <div className="container-custom py-3 px-4">
          <div className="flex items-center justify-center gap-3 flex-wrap text-center">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-gray-900 flex-shrink-0" />
              <span className="font-bold text-gray-900 text-sm md:text-base">
                Próximamente:
              </span>
            </div>
            <span className="text-gray-900 text-sm md:text-base">
              <strong>Tienda en línea MA-IN Market</strong> — compra desde la comodidad de tu hogar
            </span>
            <span className="bg-gray-900 text-accent text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Coming soon
            </span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative gradient-hero text-white overflow-hidden py-24 md:py-36">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-700/90 to-primary-500/80" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <p className="text-accent font-semibold mb-4 tracking-wide uppercase text-sm">
            MA-IN Market
          </p>
          <h1 className="font-bold mb-6 max-w-3xl leading-tight">
            Tu destino gourmet en Cuernavaca
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl">
            Alimentos selectos, frescos y de temporada de distintas partes del mundo.
            Una experiencia que fusiona tienda gourmet, bar, restaurante y espacios de convivencia.
          </p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(LOCATION.fullAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-accent-400 transition-colors shadow-lg"
          >
            <MapPin className="w-5 h-5" />
            Visítanos
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Enfoque Gourmet — pilares editoriales sin cajas */}
      <section className="section-padding bg-white">
        <div className="container-custom">

          {/* Header alineado a la izquierda */}
          <div className="mb-14 max-w-xl">
            <p className="text-primary font-medium mb-2">Nuestro enfoque</p>
            <h2 className="font-bold text-gray-900 leading-tight">
              Frescos, selectos y de temporada
            </h2>
          </div>

          {/* 3 pilares separados por divisores verticales */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="py-8 md:py-0 md:pr-12">
              <div className="w-10 h-10 text-primary mb-6">
                <Zap className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Fresco y de temporada
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Elegimos cada producto en su punto óptimo, siguiendo los ciclos naturales
                para garantizar sabor real en cada compra.
              </p>
            </div>

            <div className="py-8 md:py-0 md:px-12">
              <div className="w-10 h-10 text-primary mb-6">
                <Globe className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Del mundo a tu mesa
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Traemos ingredientes de distintas partes del mundo con criterio
                y curaduría, no solo por ser importados sino por ser buenos.
              </p>
            </div>

            <div className="py-8 md:py-0 md:pl-12">
              <div className="w-10 h-10 text-primary mb-6">
                <Star className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Selección con criterio
              </h3>
              <p className="text-gray-500 leading-relaxed">
                Cada producto en nuestro anaquel pasó por un proceso de selección.
                No vendemos de todo, vendemos lo que vale la pena.
              </p>
            </div>
          </div>

          {/* Línea de cierre */}
          <div className="mt-14 pt-8 border-t border-gray-100">
            <p className="text-sm text-gray-400 italic">
              Desde ingredientes locales hasta importados — siempre con criterio, temporada y origen como guía.
            </p>
          </div>

        </div>
      </section>

      {/* Variedad de Productos — cards horizontales 2×2 */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">

          {/* Header split: título izquierda, descripción derecha */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-primary font-medium mb-2">Nuestra variedad</p>
              <h2 className="font-bold text-gray-900 leading-tight">
                Todo lo que buscas,<br className="hidden sm:block" /> en un solo lugar
              </h2>
            </div>
            <p className="text-gray-500 lg:max-w-xs lg:text-right leading-relaxed">
              Desde básicos de la más alta calidad hasta artículos especializados,
              vinos y productos orgánicos certificados.
            </p>
          </div>

          {/* Grid 2×2 de cards horizontales */}
          <div className="grid sm:grid-cols-2 gap-4">
            {productCategories.map((cat) => {
              const Icon = cat.icon
              return (
                <div
                  key={cat.title}
                  className="group bg-white rounded-2xl p-6 flex items-start gap-5 shadow-soft hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      cat.accent
                        ? 'bg-accent-100 text-accent-700 group-hover:bg-accent group-hover:text-gray-900'
                        : 'bg-primary-100 text-primary group-hover:bg-primary group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 mb-1.5">{cat.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{cat.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* La Experiencia */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary font-medium mb-2">La experiencia</p>
              <h2 className="font-bold text-gray-900 mb-6">
                Espacios que invitan a quedarse
              </h2>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Diseñamos cada rincón para que tu visita sea mucho más que una compra.
                Ambientes cálidos y amplios donde disfrutar, explorar y convivir.
              </p>
              <ul className="space-y-4">
                {experienceItems.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <li key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary-100 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-gray-700 font-medium">{item.text}</span>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Visual decorativo */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 via-accent-50 to-accent-100 rounded-3xl aspect-square flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-primary">
                    <ShoppingCart className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-primary-800 font-bold text-xl">MA-IN Market</p>
                  <p className="text-primary-600 text-sm mt-1">Experiencia gourmet</p>
                  <div className="mt-4 flex items-center justify-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-accent text-gray-900 rounded-xl px-4 py-2 shadow-lg font-bold text-sm">
                Gourmet
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary text-white rounded-xl px-4 py-2 shadow-lg font-semibold text-sm">
                Selección premium
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conceptos Únicos */}
      <section className="section-padding gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative z-10">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold mb-2 uppercase tracking-wide text-sm">
              Una propuesta única
            </p>
            <h2 className="font-bold text-white mb-4">Más que una tienda</h2>
            <p className="text-white/80 max-w-2xl mx-auto text-lg">
              MA-IN Market fusiona distintos conceptos en un solo espacio para ofrecerte
              una experiencia completa e irrepetible.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {conceptos.map((concepto) => {
              const Icon = concepto.icon
              return (
                <div
                  key={concepto.title}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all hover:-translate-y-0.5 border border-white/10"
                >
                  <div className="w-16 h-16 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{concepto.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{concepto.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Visítanos */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-10">
            <p className="text-primary font-medium mb-2">¿Cómo llegarnos?</p>
            <h2 className="font-bold text-gray-900">Visítanos</h2>
          </div>

          {/* Card sofisticada: panel info + mapa */}
          <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden shadow-xl grid lg:grid-cols-5">

            {/* Panel izquierdo — info */}
            <div className="lg:col-span-2 bg-primary-800 text-white p-10 flex flex-col justify-between gap-10">
              <div>
                <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center mb-7">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>

                <p className="text-accent text-xs font-semibold uppercase tracking-widest mb-3">
                  Ubicación
                </p>
                <h3 className="text-2xl font-bold text-white mb-4 leading-snug">
                  MA-IN Market
                </h3>
                <div className="w-8 h-0.5 bg-accent mb-6 rounded-full" />

                <address className="not-italic space-y-1">
                  <p className="text-white font-medium">{LOCATION.address}</p>
                  <p className="text-white/60 text-sm">{LOCATION.colony}</p>
                  <p className="text-white/60 text-sm">
                    C.P. {LOCATION.postalCode}, {LOCATION.city}, {LOCATION.state}
                  </p>
                </address>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(LOCATION.fullAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-accent text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-accent-400 transition-colors text-sm"
              >
                <MapPin className="w-4 h-4" />
                Abrir en Google Maps
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Mapa — lado derecho */}
            <div className="lg:col-span-3 h-72 lg:h-auto min-h-[320px]">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(LOCATION.fullAddress)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación MA-IN Market"
              />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
