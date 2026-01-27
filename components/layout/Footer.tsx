import Link from 'next/link'
import Image from 'next/image'
import { COMPANY, LOCATION, SCHEDULE, FOOTER_NAV, SOCIAL_LINKS, ROUTES } from '@/lib/constants'
import { getWhatsAppLink, getEmailLink } from '@/lib/utils'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from 'lucide-react'

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.svg"
                alt={COMPANY.name}
                width={40}
                height={24}
                className="h-8 w-auto"
              />
              <span className="font-bold text-xl text-white">
                {COMPANY.name}
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              {COMPANY.description}
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a
                href={`tel:${COMPANY.phone}`}
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 text-primary" />
                {COMPANY.phone}
              </a>
              <a
                href={getEmailLink(COMPANY.email)}
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 text-primary" />
                {COMPANY.email}
              </a>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span>{LOCATION.fullAddress}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-primary" />
                <span>{SCHEDULE.formatted}</span>
              </div>
            </div>
          </div>

          {/* Divisions */}
          <div>
            <h3 className="font-semibold text-white mb-4">Divisiones</h3>
            <ul className="space-y-3">
              {FOOTER_NAV.divisiones.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-white mb-4">Soporte</h3>
            <ul className="space-y-3">
              {FOOTER_NAV.soporte.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={ROUTES.logistik.trackShipment}
                  className="text-sm hover:text-primary transition-colors"
                >
                  Rastrear envío
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3 mb-6">
              {FOOTER_NAV.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social links */}
            <h3 className="font-semibold text-white mb-4">Síguenos</h3>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((social) => {
                const Icon = socialIcons[social.icon as keyof typeof socialIcons]
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} {COMPANY.fullName}. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href={ROUTES.privacy}
                className="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                Privacidad
              </Link>
              <Link
                href={ROUTES.terms}
                className="text-sm text-gray-500 hover:text-primary transition-colors"
              >
                Términos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
