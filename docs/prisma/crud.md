# Prisma CRUD Operations

Create, Read, Update, and Delete operations with Prisma.

## 🔹 Create

### Create single record
```js
const user = await prisma.user.create({
  data: {
    email: 'alice@example.com',
    name: 'Alice'
  }
});
```

### Create with relations
```js
const user = await prisma.user.create({
  data: {
    email: 'bob@example.com',
    name: 'Bob',
    posts: {
      create: [
        { title: 'First Post', content: 'Hello World' },
        { title: 'Second Post', content: 'Another post' }
      ]
    }
  }
});
```

### Create many
```js
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
    { email: 'user3@example.com', name: 'User 3' }
  ],
  skipDuplicates: true // Skip records with duplicate unique fields
});

console.log(`Created ${users.count} users`);
```

## 🔹 Read

### Find unique
```js
const user = await prisma.user.findUnique({
  where: { email: 'alice@example.com' }
});

const userById = await prisma.user.findUnique({
  where: { id: 1 }
});
```

### Find first
```js
const user = await prisma.user.findFirst({
  where: { name: 'Alice' }
});
```

### Find many
```js
const users = await prisma.user.findMany();

// With conditions
const activeUsers = await prisma.user.findMany({
  where: { isActive: true }
});
```

### Find with relations
```js
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true,
    profile: true
  }
});
```

### Select specific fields
```js
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    email: true,
    name: true
  }
});
```

### Count records
```js
const count = await prisma.user.count();

const activeCount = await prisma.user.count({
  where: { isActive: true }
});
```

## 🔹 Update

### Update single record
```js
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Alice Updated' }
});
```

### Update many
```js
const result = await prisma.user.updateMany({
  where: { isActive: false },
  data: { status: 'INACTIVE' }
});

console.log(`Updated ${result.count} users`);
```

### Upsert (update or create)
```js
const user = await prisma.user.upsert({
  where: { email: 'alice@example.com' },
  update: { name: 'Alice Updated' },
  create: {
    email: 'alice@example.com',
    name: 'Alice'
  }
});
```

### Increment/Decrement
```js
const post = await prisma.post.update({
  where: { id: 1 },
  data: {
    views: { increment: 1 },
    likes: { decrement: 1 }
  }
});
```

### Update with relations
```js
const user = await prisma.user.update({
  where: { id: 1 },
  data: {
    posts: {
      create: { title: 'New Post', content: 'Content' },
      delete: { id: 5 },
      update: {
        where: { id: 3 },
        data: { published: true }
      }
    }
  }
});
```

## 🔹 Delete

### Delete single record
```js
const user = await prisma.user.delete({
  where: { id: 1 }
});
```

### Delete many
```js
const result = await prisma.user.deleteMany({
  where: { isActive: false }
});

console.log(`Deleted ${result.count} users`);

// Delete all
const deleteAll = await prisma.user.deleteMany();
```

## 🔹 Ordering

```js
// Ascending
const users = await prisma.user.findMany({
  orderBy: { name: 'asc' }
});

// Descending
const posts = await prisma.post.findMany({
  orderBy: { createdAt: 'desc' }
});

// Multiple fields
const users = await prisma.user.findMany({
  orderBy: [
    { role: 'asc' },
    { name: 'asc' }
  ]
});

// Order by relation
const users = await prisma.user.findMany({
  orderBy: {
    posts: {
      _count: 'desc'
    }
  }
});
```

## 🔹 Pagination

### Offset pagination
```js
const page = 2;
const pageSize = 10;

const users = await prisma.user.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize
});
```

### Cursor-based pagination
```js
const users = await prisma.user.findMany({
  take: 10,
  cursor: { id: lastUserId },
  skip: 1 // Skip the cursor
});
```

## 🔹 Filtering

### Basic filters
```js
const users = await prisma.user.findMany({
  where: {
    name: 'Alice',
    isActive: true
  }
});
```

### Comparison operators
```js
const users = await prisma.user.findMany({
  where: {
    age: { gt: 18 },      // Greater than
    score: { gte: 90 },   // Greater than or equal
    views: { lt: 100 },   // Less than
    rating: { lte: 5 },   // Less than or equal
    status: { not: 'BANNED' }
  }
});
```

### String filters
```js
const users = await prisma.user.findMany({
  where: {
    email: { contains: '@gmail.com' },
    name: { startsWith: 'A' },
    username: { endsWith: '123' }
  }
});
```

### Array filters
```js
const posts = await prisma.post.findMany({
  where: {
    tags: { has: 'javascript' },
    categories: { hasSome: ['tech', 'programming'] },
    keywords: { hasEvery: ['node', 'express'] }
  }
});
```

### Logical operators
```js
// OR
const users = await prisma.user.findMany({
  where: {
    OR: [
      { email: { contains: '@gmail.com' } },
      { email: { contains: '@yahoo.com' } }
    ]
  }
});

// AND
const users = await prisma.user.findMany({
  where: {
    AND: [
      { isActive: true },
      { role: 'ADMIN' }
    ]
  }
});

// NOT
const users = await prisma.user.findMany({
  where: {
    NOT: { role: 'BANNED' }
  }
});
```

### Relation filters
```js
// Users with at least one post
const users = await prisma.user.findMany({
  where: {
    posts: { some: {} }
  }
});

// Users with no posts
const users = await prisma.user.findMany({
  where: {
    posts: { none: {} }
  }
});

// Users where all posts are published
const users = await prisma.user.findMany({
  where: {
    posts: { every: { published: true } }
  }
});
```

## 💡 Tips

- Use **select** to fetch only needed fields
- Use **include** to fetch relations
- Use **upsert** for "create or update" logic
- Use **cursor pagination** for better performance
- Use **transactions** for multiple operations

## 🧩 Example: Blog API

```js
const prisma = require('./lib/prisma');

// Get all posts with author
async function getPosts(page = 1, limit = 10) {
  const posts = await prisma.post.findMany({
    skip: (page - 1) * limit,
    take: limit,
    include: {
      author: {
        select: { id: true, name: true, email: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  
  const total = await prisma.post.count();
  
  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}

// Create post
async function createPost(authorId, data) {
  return await prisma.post.create({
    data: {
      ...data,
      authorId
    },
    include: { author: true }
  });
}

// Update post
async function updatePost(id, data) {
  return await prisma.post.update({
    where: { id },
    data
  });
}

// Delete post
async function deletePost(id) {
  return await prisma.post.delete({
    where: { id }
  });
}

// Search posts
async function searchPosts(query) {
  return await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } }
      ]
    }
  });
}
```

## 🔗 See Also

- [Filters](./filters.md)
- [Relations](./relations.md)
- [Transactions](./transactions.md)
