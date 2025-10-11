# Next.js Components

Next.js 13+ introduces Server and Client Components, a new way to build React applications with better performance and user experience.

## Server Components (Default)

Server Components render on the server and send HTML to the client. They are the default in the App Router.

### Basic Server Component

```tsx
// app/components/UserList.tsx
// No 'use client' directive = Server Component

async function getUsers() {
  const res = await fetch('https://api.example.com/users')
  return res.json()
}

export default async function UserList() {
  const users = await getUsers()
  
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Benefits of Server Components

- ✅ Direct database access
- ✅ Keep sensitive data on server (API keys, tokens)
- ✅ Reduce client-side JavaScript bundle
- ✅ Better SEO
- ✅ Faster initial page load
- ✅ Automatic code splitting

### Server Component Example with Database

```tsx
// app/components/Posts.tsx
import { prisma } from '@/lib/prisma'

export default async function Posts() {
  // Direct database query - no API route needed
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  })
  
  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>By {post.author.name}</p>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  )
}
```

## Client Components

Client Components render on the client and can use React hooks, event handlers, and browser APIs.

### Creating a Client Component

```tsx
// app/components/Counter.tsx
'use client' // This directive makes it a Client Component

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
```

### When to Use Client Components

Use Client Components when you need:
- ✅ Interactive elements (onClick, onChange)
- ✅ React hooks (useState, useEffect, useContext)
- ✅ Browser APIs (localStorage, geolocation)
- ✅ Event listeners
- ✅ Custom hooks
- ✅ Class components

### Client Component with Hooks

```tsx
'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light')
  
  useEffect(() => {
    // Access browser API
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
  }, [])
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
  }
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
```

## Composing Server and Client Components

### Server Component with Client Component Children

```tsx
// app/page.tsx (Server Component)
import ClientButton from './ClientButton'

export default async function Page() {
  const data = await fetchData()
  
  return (
    <div>
      <h1>{data.title}</h1>
      <ClientButton /> {/* Client Component */}
    </div>
  )
}
```

### Passing Server Components to Client Components

You can pass Server Components as children or props to Client Components:

```tsx
// app/components/ClientWrapper.tsx
'use client'

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="wrapper">
      {children}
    </div>
  )
}

// app/page.tsx (Server Component)
import ClientWrapper from './components/ClientWrapper'
import ServerComponent from './components/ServerComponent'

export default function Page() {
  return (
    <ClientWrapper>
      <ServerComponent /> {/* Stays a Server Component */}
    </ClientWrapper>
  )
}
```

### Sharing Data Between Server and Client

```tsx
// app/components/ClientComponent.tsx
'use client'

export default function ClientComponent({ data }: { data: any }) {
  const [selected, setSelected] = useState(data[0])
  
  return (
    <div>
      <select onChange={(e) => setSelected(data[e.target.value])}>
        {data.map((item, i) => (
          <option key={i} value={i}>{item.name}</option>
        ))}
      </select>
      <p>{selected.description}</p>
    </div>
  )
}

// app/page.tsx (Server Component)
import ClientComponent from './components/ClientComponent'

export default async function Page() {
  const data = await fetchData()
  
  return <ClientComponent data={data} />
}
```

## Layouts

Layouts wrap multiple pages and persist across navigation.

### Root Layout (Required)

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'My App',
  description: 'My awesome app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>{/* Navigation */}</nav>
        </header>
        <main>{children}</main>
        <footer>{/* Footer */}</footer>
      </body>
    </html>
  )
}
```

### Nested Layouts

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard">
      <aside>
        {/* Sidebar */}
        <nav>
          <a href="/dashboard">Overview</a>
          <a href="/dashboard/settings">Settings</a>
        </nav>
      </aside>
      <div className="content">
        {children}
      </div>
    </div>
  )
}
```

## Templates

Templates are similar to layouts but create a new instance on navigation.

```tsx
// app/template.tsx
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* This will re-mount on navigation */}
      {children}
    </div>
  )
}
```

## Metadata

### Static Metadata

```tsx
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about our company',
  openGraph: {
    title: 'About Us',
    description: 'Learn more about our company',
    images: ['/og-image.jpg'],
  },
}

export default function About() {
  return <div>About Page</div>
}
```

### Dynamic Metadata

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const post = await getPost(params.slug)
  return <article>{post.content}</article>
}
```

## Image Component

Optimized image component with automatic lazy loading and responsive images.

```tsx
import Image from 'next/image'

export default function Profile() {
  return (
    <div>
      {/* Local image */}
      <Image
        src="/profile.jpg"
        alt="Profile"
        width={500}
        height={500}
        priority // Load immediately
      />
      
      {/* Remote image */}
      <Image
        src="https://example.com/image.jpg"
        alt="Remote"
        width={800}
        height={600}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..."
      />
      
      {/* Fill container */}
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Image
          src="/banner.jpg"
          alt="Banner"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  )
}
```

### Image Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['example.com', 'cdn.example.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },
}
```

## Font Optimization

```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.className} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### Local Fonts

```tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: './my-font.woff2',
  display: 'swap',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

## Script Component

Optimize third-party scripts:

```tsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      {/* Load after page is interactive */}
      <Script src="https://example.com/script.js" strategy="lazyOnload" />
      
      {/* Load before page is interactive */}
      <Script src="https://example.com/script.js" strategy="beforeInteractive" />
      
      {/* Load after page hydrates */}
      <Script src="https://example.com/script.js" strategy="afterInteractive" />
      
      {/* Inline script */}
      <Script id="analytics">
        {`
          window.analytics = {
            track: (event) => console.log(event)
          }
        `}
      </Script>
    </>
  )
}
```

## Streaming and Suspense

```tsx
import { Suspense } from 'react'

async function SlowComponent() {
  await new Promise(resolve => setTimeout(resolve, 3000))
  return <div>Loaded!</div>
}

export default function Page() {
  return (
    <div>
      <h1>Page Title</h1>
      
      <Suspense fallback={<div>Loading...</div>}>
        <SlowComponent />
      </Suspense>
      
      <p>This content loads immediately</p>
    </div>
  )
}
```

## Best Practices

- ✅ Use Server Components by default
- ✅ Only use Client Components when needed
- ✅ Keep Client Components small and focused
- ✅ Pass data from Server to Client Components via props
- ✅ Use the Image component for all images
- ✅ Optimize fonts with next/font
- ✅ Use Suspense for streaming
- ✅ Implement proper error boundaries

## Common Pitfalls

- ⚠️ **Don't import Server Components into Client Components** - Pass as children instead
- ⚠️ **Don't use hooks in Server Components** - Mark as 'use client' first
- ⚠️ **Don't forget to add 'use client'** - Required for interactivity
- ⚠️ **Don't use async Client Components** - Use Server Components for async data fetching
- ⚠️ **Don't access browser APIs in Server Components** - Use Client Components

## Related Topics

- [Routing](./routing.md)
- [Data Fetching](./data-fetching.md)
- [Server Actions](./server-actions.md)

## References

- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
