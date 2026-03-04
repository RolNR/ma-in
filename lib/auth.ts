import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { authConfig } from '@/lib/auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.active) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        )
        if (!valid) return null

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
          clientId: user.clientId ?? undefined,
        }
      },
    }),
  ],
})

// Extend next-auth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
      clientId?: number
    }
  }
}
