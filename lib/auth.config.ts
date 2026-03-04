import type { NextAuthConfig } from 'next-auth'

// Edge-compatible config (no Node.js APIs — no database, no bcrypt)
// Used by middleware.ts which runs on the Edge runtime
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const role = (auth?.user as { role?: string })?.role
      const { pathname } = request.nextUrl

      if (!isLoggedIn) return false

      if (pathname.startsWith('/admin')) {
        if (role === 'client') return Response.redirect(new URL('/portal', request.nextUrl))
        return true
      }

      if (pathname.startsWith('/portal')) return true

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
        token.clientId = (user as { clientId?: number }).clientId
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.clientId = token.clientId as number | undefined
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
