import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { COMPANY } from '@/lib/constants'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: `${COMPANY.name} - ${COMPANY.tagline}`,
    template: `%s | ${COMPANY.name}`,
  },
  description: COMPANY.description,
  keywords: [
    'logística',
    'envíos',
    'paquetería',
    'rastreo',
    'empaques',
    'México',
    'transporte',
    'mensajería',
  ],
  authors: [{ name: COMPANY.fullName }],
  creator: COMPANY.fullName,
  publisher: COMPANY.fullName,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    siteName: COMPANY.name,
    title: `${COMPANY.name} - ${COMPANY.tagline}`,
    description: COMPANY.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${COMPANY.name} - ${COMPANY.tagline}`,
    description: COMPANY.description,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
