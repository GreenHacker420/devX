# Next.js Data Fetching

Next.js provides multiple ways to fetch data with built-in caching, revalidation, and streaming support.

## Server Components Data Fetching

Server Components can fetch data directly using async/await.

### Basic Fetch

```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  
  return res.json()
}

export default async function Posts() {
  const posts = await getPosts()
  
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### Fetch with Options

```tsx
async function getData() {
  // Cache by default
  const res = await fetch('https://api.example.com/data')
  
  // No caching
  const res = await fetch('https://api.example.com/data', {
    cache: 'no-store'
  })
  
  // Revalidate every 60 seconds
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 }
  })
  
  // Revalidate with tag
  const res = await fetch('https://api.example.com/data', {
    next: { tags: ['posts'] }
  })
  
  return res.json()
}
```

## Caching Strategies

### Static Data (Default)

Data is fetched at build time and cached:

```tsx
// app/blog/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  return res.json()
}

export default async function Blog() {
  const posts = await getPosts()
  return <div>{/* Render posts */}</div>
}
```

### Dynamic Data

Fetch fresh data on every request:

```tsx
async function getUser() {
  const res = await fetch('https://api.example.com/user', {
    cache: 'no-store' // Don't cache
  })
  return res.json()
}

export default async function Profile() {
  const user = await getUser()
  return <div>{user.name}</div>
}
```

### Revalidated Data (ISR)

Fetch data and revalidate at intervals:

```tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Revalidate every hour
  })
  return res.json()
}

export default async function Blog() {
  const posts = await getPosts()
  return <div>{/* Render posts */}</div>
}
```

## Parallel Data Fetching

Fetch multiple data sources in parallel:

```tsx
async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`)
  return res.json()
}

async function getPosts(userId: string) {
  const res = await fetch(`https://api.example.com/posts?userId=${userId}`)
  return res.json()
}

export default async function UserProfile({ params }: { params: { id: string } }) {
  // Fetch in parallel
  const [user, posts] = await Promise.all([
    getUser(params.id),
    getPosts(params.id)
  ])
  
  return (
    <div>
      <h1>{user.name}</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Sequential Data Fetching

Fetch data that depends on previous results:

```tsx
async function getUser(id: string) {
  const res = await fetch(`https://api.example.com/users/${id}`)
  return res.json()
}

async function getTeam(teamId: string) {
  const res = await fetch(`https://api.example.com/teams/${teamId}`)
  return res.json()
}

export default async function UserPage({ params }: { params: { id: string } }) {
  // First fetch
  const user = await getUser(params.id)
  
  // Second fetch depends on first
  const team = await getTeam(user.teamId)
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Team: {team.name}</p>
    </div>
  )
}
```

## Streaming with Suspense

Stream data as it becomes available:

```tsx
import { Suspense } from 'react'

async function Posts() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

async function Comments() {
  // Slow query
  await new Promise(resolve => setTimeout(resolve, 3000))
  const comments = await fetch('https://api.example.com/comments').then(r => r.json())
  
  return (
    <ul>
      {comments.map((comment) => (
        <li key={comment.id}>{comment.text}</li>
      ))}
    </ul>
  )
}

export default function Page() {
  return (
    <div>
      <h1>Blog</h1>
      
      {/* Posts load immediately */}
      <Suspense fallback={<div>Loading posts...</div>}>
        <Posts />
      </Suspense>
      
      {/* Comments stream in later */}
      <Suspense fallback={<div>Loading comments...</div>}>
        <Comments />
      </Suspense>
    </div>
  )
}
```

## Database Queries

### With Prisma

```tsx
// app/users/page.tsx
import { prisma } from '@/lib/prisma'

export default async function Users() {
  const users = await prisma.user.findMany({
    include: {
      posts: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} - {user.posts.length} posts
        </li>
      ))}
    </ul>
  )
}
```

### With Raw SQL

```tsx
import { sql } from '@vercel/postgres'

export default async function Users() {
  const { rows } = await sql`
    SELECT * FROM users
    WHERE active = true
    ORDER BY created_at DESC
  `
  
  return (
    <ul>
      {rows.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

## Client-Side Data Fetching

### Using SWR

```tsx
'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher)
  
  if (error) return <div>Failed to load</div>
  if (isLoading) return <div>Loading...</div>
  
  return <div>Hello {data.name}!</div>
}
```

### Using React Query

```tsx
'use client'

import { useQuery } from '@tanstack/react-query'

async function fetchUser() {
  const res = await fetch('/api/user')
  return res.json()
}

export default function Profile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  })
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>Hello {data.name}!</div>
}
```

### Using useEffect

```tsx
'use client'

import { useState, useEffect } from 'react'

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## Route Handlers (API Routes)

### Basic API Route

```tsx
// app/api/posts/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return NextResponse.json(posts)
}

export async function POST(request: Request) {
  const body = await request.json()
  
  // Create post
  const post = await createPost(body)
  
  return NextResponse.json(post, { status: 201 })
}
```

### Dynamic API Route

```tsx
// app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = await fetch(`https://api.example.com/posts/${params.id}`)
    .then(r => r.json())
  
  return NextResponse.json(post)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const post = await updatePost(params.id, body)
  
  return NextResponse.json(post)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await deletePost(params.id)
  return new NextResponse(null, { status: 204 })
}
```

### API Route with Headers and Cookies

```tsx
// app/api/user/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  // Read cookies
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  
  // Read headers
  const authorization = request.headers.get('authorization')
  
  const user = await getUser(token?.value)
  
  // Set cookies in response
  const response = NextResponse.json(user)
  response.cookies.set('lastVisit', new Date().toISOString())
  
  return response
}
```

## Revalidation

### Time-based Revalidation

```tsx
// Revalidate every 60 seconds
export const revalidate = 60

export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>{/* Render data */}</div>
}
```

### On-Demand Revalidation

```tsx
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { path, tag } = await request.json()
  
  if (path) {
    revalidatePath(path)
  }
  
  if (tag) {
    revalidateTag(tag)
  }
  
  return NextResponse.json({ revalidated: true })
}
```

Usage:

```tsx
// Fetch with tag
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] }
  })
  return res.json()
}

// Revalidate from another route
await fetch('/api/revalidate', {
  method: 'POST',
  body: JSON.stringify({ tag: 'posts' })
})
```

## Error Handling

### Try-Catch

```tsx
async function getData() {
  try {
    const res = await fetch('https://api.example.com/data')
    
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export default async function Page() {
  const data = await getData()
  return <div>{/* Render data */}</div>
}
```

### Error Boundary

```tsx
// app/error.tsx
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

## Loading States

```tsx
// app/posts/loading.tsx
export default function Loading() {
  return (
    <div>
      <div className="skeleton h-8 w-48 mb-4" />
      <div className="skeleton h-4 w-full mb-2" />
      <div className="skeleton h-4 w-full mb-2" />
      <div className="skeleton h-4 w-3/4" />
    </div>
  )
}
```

## Best Practices

- ✅ Use Server Components for data fetching when possible
- ✅ Fetch data at the component level
- ✅ Use parallel fetching with Promise.all()
- ✅ Implement proper error handling
- ✅ Use Suspense for streaming
- ✅ Cache data appropriately
- ✅ Use revalidation for dynamic data
- ✅ Minimize client-side data fetching

## Common Pitfalls

- ⚠️ **Don't fetch in Client Components unnecessarily** - Use Server Components
- ⚠️ **Don't forget error handling** - Always handle fetch errors
- ⚠️ **Don't over-cache** - Use appropriate cache strategies
- ⚠️ **Don't fetch sequentially when parallel is possible** - Use Promise.all()
- ⚠️ **Don't expose sensitive data** - Keep API keys on server

## Related Topics

- [Server Actions](./server-actions.md)
- [API Routes](./api-routes.md)
- [Caching](./caching.md)

## References

- [Data Fetching Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Caching Documentation](https://nextjs.org/docs/app/building-your-application/caching)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
