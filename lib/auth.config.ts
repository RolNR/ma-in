import type { NextAuthConfig } from 'next-auth'

// Edge-compatible config (no Node.js APIs — no database, no bcrypt)
// Used by middleware.ts which runs on the Edge runtime
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user
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
