# Next.js Routing

Next.js uses a file-system based router where folders define routes. The App Router (app directory) is the recommended approach.

## File-System Based Routing

### Basic Routes

```
app/
├── page.tsx              # / (Home)
├── about/
│   └── page.tsx          # /about
├── blog/
│   └── page.tsx          # /blog
└── contact/
    └── page.tsx          # /contact
```

### Creating a Route

```tsx
// app/about/page.tsx
export default function About() {
  return (
    <div>
      <h1>About Us</h1>
      <p>Welcome to our about page</p>
    </div>
  )
}
```

## Dynamic Routes

### Single Dynamic Segment

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>
}

// Matches: /blog/hello-world, /blog/my-post, etc.
```

### Multiple Dynamic Segments

```tsx
// app/shop/[category]/[product]/page.tsx
export default function Product({ 
  params 
}: { 
  params: { category: string; product: string } 
}) {
  return (
    <div>
      <h1>Category: {params.category}</h1>
      <h2>Product: {params.product}</h2>
    </div>
  )
}

// Matches: /shop/electronics/laptop, /shop/clothing/shirt
```

### Catch-All Routes

```tsx
// app/docs/[...slug]/page.tsx
export default function Docs({ params }: { params: { slug: string[] } }) {
  return <h1>Docs: {params.slug.join('/')}</h1>
}

// Matches: /docs/a, /docs/a/b, /docs/a/b/c
```

### Optional Catch-All Routes

```tsx
// app/shop/[[...slug]]/page.tsx
export default function Shop({ params }: { params: { slug?: string[] } }) {
  return <h1>Shop: {params.slug?.join('/') || 'Home'}</h1>
}

// Matches: /shop, /shop/a, /shop/a/b
```

## Route Groups

Organize routes without affecting the URL structure using parentheses:

```
app/
├── (marketing)/
│   ├── about/
│   │   └── page.tsx      # /about
│   └── blog/
│       └── page.tsx      # /blog
└── (shop)/
    ├── products/
    │   └── page.tsx      # /products
    └── cart/
        └── page.tsx      # /cart
```

Each group can have its own layout:

```tsx
// app/(marketing)/layout.tsx
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <nav>{/* Marketing nav */}</nav>
      {children}
    </div>
  )
}
```

## Parallel Routes

Display multiple pages in the same layout using slots:

```
app/
├── @analytics/
│   └── page.tsx
├── @team/
│   └── page.tsx
└── layout.tsx
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <>
      {children}
      {analytics}
      {team}
    </>
  )
}
```

## Intercepting Routes

Intercept routes to display content in a modal while keeping the URL:

```
app/
├── feed/
│   └── page.tsx
├── photo/
│   └── [id]/
│       └── page.tsx
└── @modal/
    └── (.)photo/
        └── [id]/
            └── page.tsx
```

Conventions:
- `(.)` - same level
- `(..)` - one level up
- `(..)(..)` - two levels up
- `(...)` - from root

## Navigation

### Link Component

```tsx
import Link from 'next/link'

export default function Nav() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
      <Link href="/blog/hello-world">Blog Post</Link>
      
      {/* With dynamic data */}
      <Link href={`/blog/${post.slug}`}>
        {post.title}
      </Link>
      
      {/* Replace instead of push */}
      <Link href="/login" replace>
        Login
      </Link>
      
      {/* Prefetch disabled */}
      <Link href="/heavy-page" prefetch={false}>
        Heavy Page
      </Link>
    </nav>
  )
}
```

### useRouter Hook (Client Component)

```tsx
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  
  const handleClick = () => {
    // Navigate to a route
    router.push('/dashboard')
    
    // Replace current route
    router.replace('/login')
    
    // Go back
    router.back()
    
    // Go forward
    router.forward()
    
    // Refresh current route
    router.refresh()
    
    // Prefetch a route
    router.prefetch('/dashboard')
  }
  
  return <button onClick={handleClick}>Navigate</button>
}
```

### redirect Function (Server Component)

```tsx
import { redirect } from 'next/navigation'

export default async function Profile() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  return <div>Profile Page</div>
}
```

### usePathname Hook

```tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Nav() {
  const pathname = usePathname()
  
  return (
    <nav>
      <Link 
        href="/" 
        className={pathname === '/' ? 'active' : ''}
      >
        Home
      </Link>
      <Link 
        href="/about" 
        className={pathname === '/about' ? 'active' : ''}
      >
        About
      </Link>
    </nav>
  )
}
```

### useSearchParams Hook

```tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function Search() {
  const searchParams = useSearchParams()
  
  const query = searchParams.get('q')
  const page = searchParams.get('page')
  
  return (
    <div>
      <p>Search: {query}</p>
      <p>Page: {page}</p>
    </div>
  )
}

// URL: /search?q=nextjs&page=1
```

## Route Handlers (API Routes)

```tsx
// app/api/users/route.ts
import { NextResponse } from 'next/server'

// GET /api/users
export async function GET(request: Request) {
  const users = await getUsers()
  return NextResponse.json(users)
}

// POST /api/users
export async function POST(request: Request) {
  const body = await request.json()
  const user = await createUser(body)
  return NextResponse.json(user, { status: 201 })
}
```

### Dynamic Route Handlers

```tsx
// app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUser(params.id)
  return NextResponse.json(user)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await deleteUser(params.id)
  return new NextResponse(null, { status: 204 })
}
```

## Middleware

Intercept requests before they complete:

```tsx
// middleware.ts (root level)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check authentication
  const token = request.cookies.get('token')
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Add custom header
  const response = NextResponse.next()
  response.headers.set('x-custom-header', 'value')
  return response
}

// Specify which routes to run middleware on
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}
```

## Loading States

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>Loading dashboard...</div>
}
```

## Error Handling

```tsx
// app/dashboard/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

## Not Found

```tsx
// app/not-found.tsx
export default function NotFound() {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <p>Could not find the requested resource</p>
    </div>
  )
}
```

Trigger programmatically:

```tsx
import { notFound } from 'next/navigation'

export default async function Page({ params }: { params: { id: string } }) {
  const user = await getUser(params.id)
  
  if (!user) {
    notFound()
  }
  
  return <div>{user.name}</div>
}
```

## Route Segment Config

Configure route behavior:

```tsx
// app/dashboard/page.tsx
export const dynamic = 'force-dynamic' // 'auto' | 'force-dynamic' | 'error' | 'force-static'
export const dynamicParams = true // true | false
export const revalidate = 3600 // false | 0 | number
export const fetchCache = 'auto' // 'auto' | 'default-cache' | 'only-cache' | 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'
export const runtime = 'nodejs' // 'nodejs' | 'edge'
export const preferredRegion = 'auto' // 'auto' | 'global' | 'home' | string | string[]

export default function Page() {
  return <div>Dashboard</div>
}
```

## Best Practices

- ✅ Use the App Router for new projects
- ✅ Organize routes with route groups
- ✅ Use `<Link>` for client-side navigation
- ✅ Implement loading and error states
- ✅ Use middleware for authentication checks
- ✅ Leverage dynamic routes for flexible URLs
- ✅ Use `notFound()` for missing resources

## Common Pitfalls

- ⚠️ **Don't use `useRouter` from `next/router`** - Use `next/navigation` instead
- ⚠️ **Don't forget to mark client components** - Use `'use client'` directive
- ⚠️ **Don't nest `<Link>` components** - Links should not contain other links
- ⚠️ **Don't use `a` tags for internal navigation** - Use `<Link>` instead

## Related Topics

- [Components](./components.md)
- [Data Fetching](./data-fetching.md)
- [API Routes](./api-routes.md)

## References

- [Next.js Routing Documentation](https://nextjs.org/docs/app/building-your-application/routing)
- [App Router Migration](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)
