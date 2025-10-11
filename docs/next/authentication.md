# Next.js Authentication

Comprehensive guide to implementing authentication in Next.js applications using NextAuth.js and other methods.

## NextAuth.js Setup

### Installation

```bash
npm install next-auth
```

### Basic Configuration

```tsx
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate credentials
        const user = await validateUser(credentials)
        
        if (user) {
          return user
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})

export { handler as GET, handler as POST }
```

### Environment Variables

```env
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth Providers
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
```

## Session Provider

```tsx
// app/providers.tsx
'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
```

```tsx
// app/layout.tsx
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Client-Side Authentication

### useSession Hook

```tsx
'use client'

import { useSession, signIn, signOut } from 'next-auth/react'

export default function Profile() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return <div>Loading...</div>
  }
  
  if (status === 'unauthenticated') {
    return (
      <div>
        <p>Not signed in</p>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    )
  }
  
  return (
    <div>
      <p>Signed in as {session?.user?.email}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  )
}
```

### Protected Client Component

```tsx
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function ProtectedPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    },
  })
  
  if (status === 'loading') {
    return <div>Loading...</div>
  }
  
  return <div>Protected content for {session?.user?.email}</div>
}
```

## Server-Side Authentication

### Server Component

```tsx
// app/dashboard/page.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.name}</p>
    </div>
  )
}
```

### API Route

```tsx
// app/api/protected/route.ts
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  return NextResponse.json({ data: 'Protected data' })
}
```

## Login Page

```tsx
// app/login/page.tsx
'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    
    if (result?.error) {
      setError('Invalid credentials')
    } else {
      router.push('/dashboard')
    }
  }
  
  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {error && <p className="text-red-500">{error}</p>}
        
        <button type="submit">Sign In</button>
      </form>
      
      <div className="mt-4">
        <p>Or sign in with:</p>
        <button onClick={() => signIn('github')}>
          GitHub
        </button>
        <button onClick={() => signIn('google')}>
          Google
        </button>
      </div>
    </div>
  )
}
```

## Middleware Protection

```tsx
// middleware.ts
import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // Check if user is authenticated
      if (req.nextUrl.pathname.startsWith('/admin')) {
        return token?.role === 'admin'
      }
      return !!token
    },
  },
})

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
```

## Database Adapter (Prisma)

### Installation

```bash
npm install @prisma/client @next-auth/prisma-adapter
npm install -D prisma
```

### Prisma Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?
  role          String    @default("user")
  accounts      Account[]
  sessions      Session[]
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### NextAuth Configuration with Prisma

```tsx
// lib/auth.ts
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        
        if (!user || !user.password) {
          return null
        }
        
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        
        if (!isValid) {
          return null
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
}
```

## Registration

```tsx
// app/api/register/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })
    
    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Role-Based Access Control

```tsx
// lib/auth.ts
export function hasRole(session: Session | null, role: string) {
  return session?.user?.role === role
}

export function isAdmin(session: Session | null) {
  return hasRole(session, 'admin')
}
```

```tsx
// app/admin/page.tsx
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions, isAdmin } from '@/lib/auth'

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || !isAdmin(session)) {
    redirect('/unauthorized')
  }
  
  return <div>Admin Dashboard</div>
}
```

## JWT Authentication (Manual)

### Generate Token

```tsx
// lib/jwt.ts
import jwt from 'jsonwebtoken'

export function generateToken(userId: string) {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    return null
  }
}
```

### Login Endpoint

```tsx
// app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const { email, password } = await request.json()
  
  const user = await prisma.user.findUnique({
    where: { email },
  })
  
  if (!user || !user.password) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }
  
  const isValid = await bcrypt.compare(password, user.password)
  
  if (!isValid) {
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }
  
  const token = generateToken(user.id)
  
  const response = NextResponse.json({ success: true })
  response.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
  
  return response
}
```

## Best Practices

- ✅ Use HTTPS in production
- ✅ Store passwords with bcrypt
- ✅ Use httpOnly cookies for tokens
- ✅ Implement CSRF protection
- ✅ Use secure session secrets
- ✅ Implement rate limiting
- ✅ Add email verification
- ✅ Use role-based access control

## Common Pitfalls

- ⚠️ **Don't store passwords in plain text** - Always hash
- ⚠️ **Don't expose JWT secrets** - Use environment variables
- ⚠️ **Don't skip validation** - Validate all inputs
- ⚠️ **Don't use weak secrets** - Generate strong random secrets
- ⚠️ **Don't forget to protect API routes** - Check authentication

## Related Topics

- [API Routes](./api-routes.md)
- [Server Actions](./server-actions.md)
- [Middleware](./middleware.md)

## References

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Authentication Best Practices](https://nextjs.org/docs/app/building-your-application/authentication)
