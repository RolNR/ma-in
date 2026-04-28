import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Hero } from '@/components/sections'
import { Card, Button } from '@/components/ui'
import { Breadcrumb } from '@/components/layout'
import { TravelContactForm } from '@/components/forms'
import { divisionDetails } from '@/data/divisions'
import { ROUTES, DIVISION_NAV } from '@/lib/constants'
import {
  Briefcase,
  Users,
  Plane,
  MapPin,
  ShieldCheck,
  Star,
  Clock,
  ChevronRight,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Travel - Turismo Corporativo y Familiar | MA-IN',
  description:
    'Rutas turísticas corporativas y familiares. Más de 100 tours realizados hacia San Miguel de Allende, Guanajuato, Puebla, Veracruz y Oaxaca. Transporte seguro y confiable.',
}

const serviceIcons = {
  briefcase: Briefcase,
  users: Users,
  plane: Plane,
}

const { hero, stats, services, destinations } = divisionDetails.travel

export default function TravelPage() {
  return (
    <>
      {/* Hero */}
      <Hero
        title={hero.title}
        subtitle="MA-IN Travel"
        description={hero.subtitle}
        primaryAction={{ label: 'Solicitar información', href: '#contacto' }}
        secondaryAction={{ label: 'Ver destinos', href: '#destinos' }}
      />

      {/* Breadcrumb */}
      <div className="container-custom py-4">
        <Breadcrumb items={[{ label: 'Travel' }]} />
      </div>

      {/* Quick Nav */}
      <section className="pb-8">
        <div className="container-custom">
          <div className="flex flex-wrap gap-3">
            {DIVISION_NAV.travel.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="outline" size="sm">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-primary py-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl md:text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-white/80 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">Lo que ofrecemos</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Rutas para cada ocasión
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = serviceIcons[service.icon as keyof typeof serviceIcons] || Plane

              return (
                <Card key={service.id} hover className="p-6 relative overflow-hidden">
                  {service.comingSoon && (
                    <span className="absolute top-4 right-4 bg-accent text-gray-900 text-xs font-bold px-2 py-1 rounded-full">
                      Próximamente
                    </span>
                  )}
                  <div className="w-14 h-14 bg-primary text-white rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section id="destinos" className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">Nuestros destinos</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Los lugares más hermosos de México
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Más de 100 tours realizados hacia estos destinos con la seguridad y
              confiabilidad que caracteriza a MA-IN.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, index) => (
              <Link
                key={dest.id}
                href="#contacto"
                className="group relative rounded-2xl overflow-hidden min-h-[280px] flex flex-col justify-end focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* Background image */}
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-300" />

                {/* Content */}
                <div className="relative z-10 p-6 text-white">
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    {dest.highlight}
                  </span>
                  <h3 className="text-xl font-bold mb-1">{dest.name}</h3>
                  <p className="text-white/70 text-sm flex items-center gap-1 mb-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {dest.state}
                  </p>
                  <p className="text-white/85 text-sm mb-4">{dest.description}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all">
                    Solicitar tour
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Travel with us */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">¿Por qué elegirnos?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Viaja con total tranquilidad
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Seguridad garantizada',
                desc: 'Unidades verificadas, conductores certificados y rutas planificadas con todos los protocolos de seguridad.',
              },
              {
                icon: Star,
                title: '+100 tours exitosos',
                desc: 'Experiencia comprobada con grupos corporativos y familias que confían en nuestro servicio.',
              },
              {
                icon: Users,
                title: 'Grupos reducidos',
                desc: 'Atención personalizada en grupos pequeños para garantizar la mejor experiencia de viaje.',
              },
              {
                icon: Clock,
                title: 'Puntualidad',
                desc: 'Salidas y llegadas en los horarios acordados. Respetamos tu tiempo en cada etapa del recorrido.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 shadow-soft hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section id="contacto" className="section-padding bg-gradient-to-br from-primary to-primary-600">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: info */}
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Plane className="w-6 h-6 text-accent" />
                </div>
                <span className="text-accent font-semibold">MA-IN Travel</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Listo para tu próxima aventura?
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Cuéntanos qué tipo de viaje estás buscando y con gusto te
                enviamos información detallada y costos sin compromiso.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Respuesta en menos de 24 horas',
                  'Cotización sin compromiso',
                  'Asesoría personalizada',
                  'Itinerarios a tu medida',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-white/90">
                    <span className="w-2 h-2 bg-accent rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              {/* AIFA teaser */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-accent font-semibold text-sm mb-1">Próximamente</p>
                <p className="text-white font-medium">Ruta Cuernavaca ↔ AIFA</p>
                <p className="text-white/70 text-sm mt-1">
                  Traslado directo al Aeropuerto Internacional Felipe Ángeles.
                  Regístrate para ser de los primeros en conocer disponibilidad.
                </p>
              </div>
            </div>

            {/* Right: form */}
            <Card className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Solicitar información y costos
              </h3>
              <TravelContactForm />
            </Card>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gray-900 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                ¿Tienes preguntas sobre nuestros tours?
              </h2>
              <p className="text-gray-400 mt-1">
                Escríbenos o llámanos, con gusto te atendemos.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href={ROUTES.support.contact}>
                <Button variant="secondary" size="lg">
                  Contactar
                </Button>
              </Link>
              <Link href="#contacto">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:!text-gray-900"
                >
                  Ver destinos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
