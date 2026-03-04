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
      const isOnAdmin = request.nextUrl.pathname.startsWith('/admin')
      if (isOnAdmin) return isLoggedIn
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
