import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { findUserByUniversityId } from '@/lib/mongodb'
import { verifyPassword } from '@/lib/utils'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        universityId: { label: 'University ID', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.universityId || !credentials?.password) {
          return null
        }

        try {
          // Real user authentication from database
          const user = await findUserByUniversityId(credentials.universityId)

          if (!user) {
            return null
          }

          const isPasswordValid = await verifyPassword(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id || '',
            name: user.name,
            email: user.email,
            universityId: user.universityId,
            university: user.university,
            year: user.year,
            section: user.section,
            stream: user.stream,
            isVerified: user.isVerified
          }
        } catch (error) {
          console.error('Auth error:', error)

          // Fallback for mock user if DB is unavailable
          if (credentials.universityId === '10324210279' && credentials.password === 'dev02022005') {
            return {
              id: 'mock-user-id',
              name: 'Dev Student',
              email: 'dev.student@srm.edu.in',
              universityId: '10324210279',
              university: 'SRM University Sonipat',
              year: 3,
              section: 'A',
              stream: 'Computer Science Engineering',
              isVerified: true
            }
          }

          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.universityId = user.universityId
        token.university = user.university
        token.year = user.year
        token.section = user.section
        token.stream = user.stream
        token.isVerified = user.isVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.universityId = token.universityId as string
        session.user.university = token.university as string
        session.user.year = token.year as number
        session.user.section = token.section as string
        session.user.stream = token.stream as string
        session.user.isVerified = token.isVerified as boolean
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/signup'
  }
}

// Extend the built-in session types
declare module 'next-auth' {
  interface User {
    universityId: string
    university: string
    year: number
    section?: string
    stream?: string
    isVerified: boolean
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      universityId: string
      university: string
      year: number
      section?: string
      stream?: string
      isVerified: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    universityId: string
    university: string
    year: number
    section?: string
    stream?: string
    isVerified: boolean
  }
}
