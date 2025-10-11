# Next.js Server Actions

Server Actions allow you to run server-side code directly from your components without creating API routes.

## What are Server Actions?

Server Actions are asynchronous functions that run on the server. They can be called from Server or Client Components to handle form submissions, data mutations, and more.

## Basic Server Action

```tsx
// app/actions.ts
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  // Database operation
  await db.post.create({
    data: { title, content }
  })
  
  // Revalidate cache
  revalidatePath('/posts')
}
```

## Using Server Actions in Forms

### Server Component Form

```tsx
// app/posts/new/page.tsx
import { createPost } from '@/app/actions'

export default function NewPost() {
  return (
    <form action={createPost}>
      <input type="text" name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  )
}
```

### Client Component Form

```tsx
// app/components/PostForm.tsx
'use client'

import { createPost } from '@/app/actions'
import { useFormState, useFormStatus } from 'react-dom'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Post'}
    </button>
  )
}

export default function PostForm() {
  const [state, formAction] = useFormState(createPost, null)
  
  return (
    <form action={formAction}>
      <input type="text" name="title" required />
      <textarea name="content" required />
      <SubmitButton />
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  )
}
```

## Server Action with Validation

### Using Zod

```tsx
// app/actions.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const postSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  published: z.boolean().optional(),
})

export async function createPost(formData: FormData) {
  // Validate input
  const validatedFields = postSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    published: formData.get('published') === 'on',
  })
  
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }
  
  // Create post
  try {
    await db.post.create({
      data: validatedFields.data,
    })
    
    revalidatePath('/posts')
    return { success: true }
  } catch (error) {
    return {
      error: 'Failed to create post',
    }
  }
}
```

### Displaying Validation Errors

```tsx
'use client'

import { useFormState } from 'react-dom'
import { createPost } from '@/app/actions'

export default function PostForm() {
  const [state, formAction] = useFormState(createPost, null)
  
  return (
    <form action={formAction}>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
        {state?.errors?.title && (
          <p className="error">{state.errors.title[0]}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" />
        {state?.errors?.content && (
          <p className="error">{state.errors.content[0]}</p>
        )}
      </div>
      
      <button type="submit">Create Post</button>
      
      {state?.error && <p className="error">{state.error}</p>}
      {state?.success && <p className="success">Post created!</p>}
    </form>
  )
}
```

## Inline Server Actions

Define Server Actions directly in Server Components:

```tsx
// app/posts/page.tsx
import { revalidatePath } from 'next/cache'

export default function Posts() {
  async function deletePost(formData: FormData) {
    'use server'
    
    const id = formData.get('id') as string
    await db.post.delete({ where: { id } })
    revalidatePath('/posts')
  }
  
  const posts = await db.post.findMany()
  
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          {post.title}
          <form action={deletePost}>
            <input type="hidden" name="id" value={post.id} />
            <button type="submit">Delete</button>
          </form>
        </li>
      ))}
    </ul>
  )
}
```

## Calling Server Actions Programmatically

### From Client Components

```tsx
'use client'

import { createPost } from '@/app/actions'
import { useState } from 'react'

export default function PostForm() {
  const [loading, setLoading] = useState(false)
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await createPost(formData)
    
    setLoading(false)
    
    if (result.success) {
      e.currentTarget.reset()
      alert('Post created!')
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" required />
      <textarea name="content" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  )
}
```

### From Server Components

```tsx
// app/posts/page.tsx
import { createPost } from '@/app/actions'

export default async function Posts() {
  // Call server action directly
  await createPost(new FormData())
  
  return <div>Posts</div>
}
```

## Authentication in Server Actions

```tsx
// app/actions.ts
'use server'

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const session = await auth()
  
  if (!session) {
    redirect('/login')
  }
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  await db.post.create({
    data: {
      title,
      content,
      authorId: session.user.id,
    },
  })
  
  revalidatePath('/posts')
}
```

## File Uploads

```tsx
// app/actions.ts
'use server'

import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function uploadFile(formData: FormData) {
  const file = formData.get('file') as File
  
  if (!file) {
    return { error: 'No file uploaded' }
  }
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  const path = join(process.cwd(), 'public', 'uploads', file.name)
  await writeFile(path, buffer)
  
  return { success: true, path: `/uploads/${file.name}` }
}
```

```tsx
// app/components/FileUpload.tsx
'use client'

import { uploadFile } from '@/app/actions'
import { useState } from 'react'

export default function FileUpload() {
  const [result, setResult] = useState<any>(null)
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const result = await uploadFile(formData)
    
    setResult(result)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="file" required />
      <button type="submit">Upload</button>
      {result?.success && <p>File uploaded: {result.path}</p>}
      {result?.error && <p className="error">{result.error}</p>}
    </form>
  )
}
```

## Optimistic Updates

Update UI immediately before server action completes:

```tsx
'use client'

import { useOptimistic } from 'react'
import { createPost } from '@/app/actions'

export default function Posts({ posts }: { posts: Post[] }) {
  const [optimisticPosts, addOptimisticPost] = useOptimistic(
    posts,
    (state, newPost: Post) => [...state, newPost]
  )
  
  async function handleSubmit(formData: FormData) {
    const title = formData.get('title') as string
    
    // Add optimistically
    addOptimisticPost({
      id: crypto.randomUUID(),
      title,
      content: '',
      createdAt: new Date(),
    })
    
    // Call server action
    await createPost(formData)
  }
  
  return (
    <div>
      <form action={handleSubmit}>
        <input type="text" name="title" required />
        <button type="submit">Add Post</button>
      </form>
      
      <ul>
        {optimisticPosts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Revalidation

### Revalidate Path

```tsx
'use server'

import { revalidatePath } from 'next/cache'

export async function updatePost(id: string, formData: FormData) {
  await db.post.update({
    where: { id },
    data: {
      title: formData.get('title') as string,
    },
  })
  
  // Revalidate specific path
  revalidatePath('/posts')
  
  // Revalidate specific post
  revalidatePath(`/posts/${id}`)
  
  // Revalidate all posts
  revalidatePath('/posts', 'layout')
}
```

### Revalidate Tag

```tsx
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  await db.post.create({
    data: {
      title: formData.get('title') as string,
    },
  })
  
  // Revalidate all data tagged with 'posts'
  revalidateTag('posts')
}
```

## Redirects

```tsx
'use server'

import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get('title') as string,
    },
  })
  
  // Redirect to new post
  redirect(`/posts/${post.id}`)
}
```

## Error Handling

```tsx
'use server'

export async function createPost(formData: FormData) {
  try {
    const title = formData.get('title') as string
    
    if (!title) {
      return { error: 'Title is required' }
    }
    
    await db.post.create({
      data: { title },
    })
    
    revalidatePath('/posts')
    return { success: true }
  } catch (error) {
    console.error('Error creating post:', error)
    return { error: 'Failed to create post' }
  }
}
```

## Progressive Enhancement

Forms work without JavaScript:

```tsx
// app/posts/new/page.tsx
import { createPost } from '@/app/actions'
import { redirect } from 'next/navigation'

export default function NewPost() {
  async function handleSubmit(formData: FormData) {
    'use server'
    
    await createPost(formData)
    redirect('/posts')
  }
  
  return (
    <form action={handleSubmit}>
      <input type="text" name="title" required />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  )
}
```

## Cookies and Headers

```tsx
'use server'

import { cookies, headers } from 'next/headers'

export async function savePreference(formData: FormData) {
  const theme = formData.get('theme') as string
  
  // Set cookie
  cookies().set('theme', theme)
  
  // Read headers
  const userAgent = headers().get('user-agent')
  
  return { success: true }
}
```

## Best Practices

- ✅ Use Server Actions for mutations
- ✅ Validate input with Zod or similar
- ✅ Handle errors gracefully
- ✅ Revalidate cache after mutations
- ✅ Use optimistic updates for better UX
- ✅ Implement authentication checks
- ✅ Use TypeScript for type safety
- ✅ Keep actions focused and single-purpose

## Common Pitfalls

- ⚠️ **Don't forget 'use server'** - Required for Server Actions
- ⚠️ **Don't skip validation** - Always validate user input
- ⚠️ **Don't forget to revalidate** - Update cache after mutations
- ⚠️ **Don't expose sensitive data** - Keep secrets on server
- ⚠️ **Don't use for data fetching** - Use Server Components instead

## Related Topics

- [Data Fetching](./data-fetching.md)
- [Forms](./forms.md)
- [Authentication](./authentication.md)

## References

- [Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Forms and Mutations](https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations)
