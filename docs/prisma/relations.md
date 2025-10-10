# Prisma Relations

Working with related data in Prisma.

## 🔹 One-to-Many

### Schema
```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
```

### Create with relation
```js
// Create user with posts
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    posts: {
      create: [
        { title: 'Post 1', content: 'Content 1' },
        { title: 'Post 2', content: 'Content 2' }
      ]
    }
  },
  include: { posts: true }
});

// Create post with existing user
const post = await prisma.post.create({
  data: {
    title: 'New Post',
    content: 'Content',
    author: {
      connect: { id: 1 }
    }
  }
});
```

### Query with relation
```js
// Get user with posts
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true }
});

// Get posts with author
const posts = await prisma.post.findMany({
  include: { author: true }
});

// Filtered relations
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    }
  }
});
```

## 🔹 One-to-One

### Schema
```prisma
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  bio    String
  userId Int  @unique
  user   User @relation(fields: [userId], references: [id])
}
```

### Create with relation
```js
// Create user with profile
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    profile: {
      create: {
        bio: 'Software developer'
      }
    }
  },
  include: { profile: true }
});

// Create profile for existing user
const profile = await prisma.profile.create({
  data: {
    bio: 'Designer',
    user: {
      connect: { id: 1 }
    }
  }
});
```

### Query with relation
```js
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { profile: true }
});
```

## 🔹 Many-to-Many (Implicit)

### Schema
```prisma
model Post {
  id         Int        @id @default(autoincrement())
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  posts Post[]
}
```

### Create with relation
```js
// Create post with categories
const post = await prisma.post.create({
  data: {
    title: 'My Post',
    categories: {
      connect: [
        { id: 1 },
        { id: 2 }
      ]
    }
  },
  include: { categories: true }
});

// Create category with posts
const category = await prisma.category.create({
  data: {
    name: 'Technology',
    posts: {
      connect: [
        { id: 1 },
        { id: 2 }
      ]
    }
  }
});
```

### Update relations
```js
// Add categories
const post = await prisma.post.update({
  where: { id: 1 },
  data: {
    categories: {
      connect: [{ id: 3 }, { id: 4 }]
    }
  }
});

// Remove categories
const post = await prisma.post.update({
  where: { id: 1 },
  data: {
    categories: {
      disconnect: [{ id: 2 }]
    }
  }
});

// Replace all categories
const post = await prisma.post.update({
  where: { id: 1 },
  data: {
    categories: {
      set: [{ id: 1 }, { id: 3 }]
    }
  }
});
```

## 🔹 Many-to-Many (Explicit)

### Schema
```prisma
model Post {
  id              Int              @id @default(autoincrement())
  postCategories  PostCategory[]
}

model Category {
  id              Int              @id @default(autoincrement())
  postCategories  PostCategory[]
}

model PostCategory {
  postId     Int
  categoryId Int
  assignedAt DateTime @default(now())
  assignedBy String
  
  post     Post     @relation(fields: [postId], references: [id])
  category Category @relation(fields: [categoryId], references: [id])
  
  @@id([postId, categoryId])
}
```

### Create with relation
```js
const postCategory = await prisma.postCategory.create({
  data: {
    assignedBy: 'admin',
    post: { connect: { id: 1 } },
    category: { connect: { id: 2 } }
  }
});
```

### Query with relation
```js
const post = await prisma.post.findUnique({
  where: { id: 1 },
  include: {
    postCategories: {
      include: {
        category: true
      }
    }
  }
});
```

## 🔹 Nested Writes

```js
// Create user with profile and posts
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@example.com',
    profile: {
      create: {
        bio: 'Developer'
      }
    },
    posts: {
      create: [
        { title: 'Post 1', content: 'Content 1' },
        { title: 'Post 2', content: 'Content 2' }
      ]
    }
  },
  include: {
    profile: true,
    posts: true
  }
});

// Update with nested operations
const user = await prisma.user.update({
  where: { id: 1 },
  data: {
    profile: {
      update: {
        bio: 'Senior Developer'
      }
    },
    posts: {
      create: { title: 'New Post', content: 'Content' },
      update: {
        where: { id: 5 },
        data: { published: true }
      },
      delete: { id: 3 }
    }
  }
});
```

## 🔹 Relation Count

```js
const users = await prisma.user.findMany({
  include: {
    _count: {
      select: {
        posts: true,
        comments: true
      }
    }
  }
});

// With filter
const users = await prisma.user.findMany({
  include: {
    _count: {
      select: {
        posts: {
          where: { published: true }
        }
      }
    }
  }
});
```

## 🔹 Select vs Include

```js
// Include - adds related data
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true  // Adds posts array
  }
});

// Select - choose specific fields
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    name: true,
    posts: {
      select: {
        id: true,
        title: true
      }
    }
  }
});
```

## 💡 Tips

- Use **include** to fetch related data
- Use **select** for specific fields only
- Use **connect** to link existing records
- Use **disconnect** to remove relations
- Use **set** to replace all relations
- Use **_count** to get relation counts

## 🧩 Example: Blog with Relations

```js
// Get post with all related data
async function getPostWithDetails(postId) {
  return await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      categories: true,
      comments: {
        include: {
          author: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: {
          likes: true,
          comments: true
        }
      }
    }
  });
}

// Get user with post statistics
async function getUserWithStats(userId) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      posts: {
        where: { published: true },
        select: {
          id: true,
          title: true,
          createdAt: true,
          _count: {
            select: { comments: true, likes: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      },
      _count: {
        select: {
          posts: true,
          comments: true
        }
      }
    }
  });
}
```

## 🔗 See Also

- [Schema](./schema.md)
- [CRUD](./crud.md)
- [Filters](./filters.md)
