# Next.js API Routes

API Routes (Route Handlers) allow you to create RESTful API endpoints in Next.js using the App Router.

## Basic Route Handler

```tsx
// app/api/hello/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello World' })
}
```

**URL:** `GET /api/hello`

## HTTP Methods

```tsx
// app/api/posts/route.ts
import { NextResponse } from 'next/server'

// GET /api/posts
export async function GET(request: Request) {
  const posts = await db.post.findMany()
  return NextResponse.json(posts)
}

// POST /api/posts
export async function POST(request: Request) {
  const body = await request.json()
  const post = await db.post.create({ data: body })
  return NextResponse.json(post, { status: 201 })
}

// PUT /api/posts
export async function PUT(request: Request) {
  const body = await request.json()
  const post = await db.post.update({
    where: { id: body.id },
    data: body,
  })
  return NextResponse.json(post)
}

// DELETE /api/posts
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  await db.post.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}

// PATCH /api/posts
export async function PATCH(request: Request) {
  const body = await request.json()
  const post = await db.post.update({
    where: { id: body.id },
    data: body,
  })
  return NextResponse.json(post)
}
```

## Dynamic Routes

```tsx
// app/api/posts/[id]/route.ts
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = await db.post.findUnique({
    where: { id: params.id },
  })
  
  if (!post) {
    return NextResponse.json(
      { error: 'Post not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(post)
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const post = await db.post.update({
    where: { id: params.id },
    data: body,
  })
  
  return NextResponse.json(post)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await db.post.delete({
    where: { id: params.id },
  })
  
  return new NextResponse(null, { status: 204 })
}
```

**URLs:**
- `GET /api/posts/123`
- `PUT /api/posts/123`
- `DELETE /api/posts/123`

## Request Object

### Reading Request Body

```tsx
// app/api/users/route.ts
export async function POST(request: Request) {
  // JSON body
  const body = await request.json()
  
  // FormData
  const formData = await request.formData()
  const name = formData.get('name')
  
  // Text
  const text = await request.text()
  
  return NextResponse.json({ received: body })
}
```

### Reading Query Parameters

```tsx
// app/api/search/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  const query = searchParams.get('q')
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '10'
  
  const results = await search(query, {
    page: parseInt(page),
    limit: parseInt(limit),
  })
  
  return NextResponse.json(results)
}
```

**URL:** `GET /api/search?q=nextjs&page=1&limit=10`

### Reading Headers

```tsx
// app/api/auth/route.ts
export async function GET(request: Request) {
  const authorization = request.headers.get('authorization')
  const contentType = request.headers.get('content-type')
  const userAgent = request.headers.get('user-agent')
  
  return NextResponse.json({
    authorization,
    contentType,
    userAgent,
  })
}
```

### Reading Cookies

```tsx
// app/api/profile/route.ts
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const user = await getUserFromToken(token.value)
  return NextResponse.json(user)
}
```

## Response Object

### JSON Response

```tsx
export async function GET() {
  return NextResponse.json(
    { message: 'Success' },
    { status: 200 }
  )
}
```

### Custom Headers

```tsx
export async function GET() {
  return NextResponse.json(
    { data: 'value' },
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Header': 'value',
      },
    }
  )
}
```

### Setting Cookies

```tsx
export async function POST(request: Request) {
  const response = NextResponse.json({ success: true })
  
  response.cookies.set('token', 'abc123', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
  
  return response
}
```

### Redirects

```tsx
import { redirect } from 'next/navigation'

export async function GET() {
  redirect('/new-url')
}

// Or with NextResponse
export async function GET() {
  return NextResponse.redirect(new URL('/new-url', request.url))
}
```

## Error Handling

```tsx
// app/api/posts/route.ts
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validation
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }
    
    const post = await db.post.create({ data: body })
    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

## Authentication

### JWT Authentication

```tsx
// app/api/protected/route.ts
import { verify } from 'jsonwebtoken'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const authorization = request.headers.get('authorization')
  
  if (!authorization) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const token = authorization.split(' ')[1]
  
  try {
    const decoded = verify(token, process.env.JWT_SECRET!)
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
    })
    
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}
```

### Session Authentication

```tsx
// app/api/profile/route.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  return NextResponse.json(session.user)
}
```

## CORS

```tsx
// app/api/public/route.ts
export async function GET(request: Request) {
  const response = NextResponse.json({ message: 'Public API' })
  
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
```

## File Upload

```tsx
// app/api/upload/route.ts
import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import { join } from 'path'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return NextResponse.json(
      { error: 'No file uploaded' },
      { status: 400 }
    )
  }
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  const path = join(process.cwd(), 'public', 'uploads', file.name)
  await writeFile(path, buffer)
  
  return NextResponse.json({
    success: true,
    url: `/uploads/${file.name}`,
  })
}
```

## Streaming Response

```tsx
// app/api/stream/route.ts
export async function GET() {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        controller.enqueue(encoder.encode(`Data chunk ${i}\n`))
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      controller.close()
    },
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
    },
  })
}
```

## Webhooks

```tsx
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }
  
  // Handle event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      await handlePaymentSuccess(paymentIntent)
      break
    
    case 'payment_intent.failed':
      await handlePaymentFailure(event.data.object)
      break
  }
  
  return NextResponse.json({ received: true })
}
```

## Rate Limiting

```tsx
// app/api/limited/route.ts
import { NextResponse } from 'next/server'

const rateLimit = new Map<string, { count: number; resetTime: number }>()

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const limit = 10
  const window = 60 * 1000 // 1 minute
  
  const record = rateLimit.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + window })
  } else if (record.count >= limit) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  } else {
    record.count++
  }
  
  return NextResponse.json({ message: 'Success' })
}
```

## Caching

```tsx
// app/api/posts/route.ts
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET() {
  const posts = await db.post.findMany()
  return NextResponse.json(posts)
}

// Or disable caching
export const dynamic = 'force-dynamic'
```

## Edge Runtime

```tsx
// app/api/edge/route.ts
export const runtime = 'edge'

export async function GET() {
  return NextResponse.json({ message: 'Running on Edge' })
}
```

## Best Practices

- ✅ Use proper HTTP status codes
- ✅ Validate input data
- ✅ Handle errors gracefully
- ✅ Implement authentication
- ✅ Use TypeScript for type safety
- ✅ Add rate limiting for public APIs
- ✅ Set appropriate CORS headers
- ✅ Use environment variables for secrets

## Common Status Codes

- `200` - OK
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Common Pitfalls

- ⚠️ **Don't forget error handling** - Always handle errors
- ⚠️ **Don't expose sensitive data** - Keep secrets secure
- ⚠️ **Don't skip validation** - Validate all input
- ⚠️ **Don't forget CORS** - Set headers for cross-origin requests
- ⚠️ **Don't use wrong HTTP methods** - Use appropriate methods

## Related Topics

- [Server Actions](./server-actions.md)
- [Data Fetching](./data-fetching.md)
- [Authentication](./authentication.md)

## References

- [Route Handlers Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [API Routes Best Practices](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)
