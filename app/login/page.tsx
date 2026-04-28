'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type Phase = 'idle' | 'loading' | 'exiting'

export default function LoginPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (phase !== 'idle') return
    setError('')
    setPhase('loading')

    const form = e.currentTarget
    const email    = (form.elements.namedItem('email')    as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const result = await signIn('credentials', { email, password, redirect: false })

    if (result?.error) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      setPhase('idle')
    } else {
      const session = await getSession()
      const dest = session?.user.role === 'client' ? '/portal' : '/admin'
      setPhase('exiting')
      setTimeout(() => router.push(dest), 750)
    }
  }

  const exiting = phase === 'exiting'

  return (
    <div className="min-h-screen flex overflow-hidden bg-white">

      {/* ── Panel izquierdo ────────────────────────────────────────── */}
      <div
        className={`
          hidden lg:flex flex-col w-[45%] relative overflow-hidden
          transition-transform duration-700 ease-in-out
          ${exiting ? '-translate-x-full' : 'translate-x-0'}
        `}
        style={{ background: 'linear-gradient(150deg, #22d4ab 0%, #138A6F 40%, #083728 100%)' }}
      >
        {/* Blobs decorativos */}
        <div className="bokeh-1 absolute w-[580px] h-[580px] rounded-full bg-white/5 -top-40 -right-40 pointer-events-none" />
        <div className="bokeh-2 absolute w-[380px] h-[380px] rounded-full bg-white/5 -bottom-24 -left-24 pointer-events-none" />
        <div className="bokeh-3 absolute w-[220px] h-[220px] rounded-full border border-white/10 top-1/3 right-1/4 pointer-events-none" />
        <div
          className="bokeh-4 absolute w-[120px] h-[120px] rounded-full pointer-events-none"
          style={{ background: '#E1C357', bottom: '30%', right: '12%', filter: 'blur(32px)' }}
        />

        {/* Logo top-left */}
        <div className="login-panel-enter relative z-10 p-9">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="MA-IN"
              width={52}
              height={31}
            />
            <div className="leading-none">
              <p className="text-white font-bold text-2xl">MA-IN</p>
              <p className="font-bold text-[12px] tracking-[0.28em] mt-0.5" style={{ color: '#E1C357' }}>
                TRACK
              </p>
            </div>
          </div>
        </div>

        {/* Espaciador */}
        <div className="flex-1" />

        {/* Tagline bottom-left */}
        <div className="login-tagline-enter relative z-10 p-9 pb-14">
          <h2 className="text-white text-[2.4rem] font-bold leading-tight">
            Tus envíos,<br />siempre bajo<br />control.
          </h2>
          <p className="text-white/55 text-sm mt-4 leading-relaxed">
            La plataforma integral de logística<br />para tu empresa.
          </p>
          {/* Acento dorado */}
          <div className="mt-8 flex gap-1.5">
            <span className="inline-block w-6 h-1 rounded-full" style={{ background: '#E1C357' }} />
            <span className="inline-block w-2 h-1 rounded-full bg-white/30" />
            <span className="inline-block w-2 h-1 rounded-full bg-white/30" />
          </div>
        </div>
      </div>

      {/* ── Panel derecho (formulario) ─────────────────────────────── */}
      <div
        className={`
          flex-1 flex items-center justify-center p-8
          transition-opacity duration-500
          ${exiting ? 'opacity-0' : 'opacity-100'}
        `}
      >
        <div className="w-full max-w-sm">

          {/* Logo mobile (solo en pantallas pequeñas) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <Image src="/logo.svg" alt="MA-IN" width={36} height={21} />
            <div className="leading-none">
              <p className="font-bold text-lg text-gray-900">MA-IN</p>
              <p className="font-bold text-[10px] tracking-[0.28em] mt-0.5 text-primary-600">TRACK</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Iniciar sesión</h1>
            <p className="text-gray-500 text-sm mt-2">Accede a tu cuenta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="correo@empresa.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              disabled={phase !== 'idle'}
              className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors mt-1"
            >
              {phase === 'loading' ? 'Verificando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-10">
            Acceso exclusivo para empleados y clientes de MA-IN
          </p>
        </div>
      </div>
    </div>
  )
}
