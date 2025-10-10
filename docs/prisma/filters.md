# Prisma Filters

Advanced filtering and querying with Prisma.

## 🔹 Comparison Operators

```js
const results = await prisma.user.findMany({
  where: {
    age: { equals: 25 },
    score: { gt: 80 },        // Greater than
    views: { gte: 100 },      // Greater than or equal
    rating: { lt: 5 },        // Less than
    likes: { lte: 1000 },     // Less than or equal
    status: { not: 'BANNED' }, // Not equal
    role: { in: ['ADMIN', 'MODERATOR'] },
    category: { notIn: ['spam', 'deleted'] }
  }
});
```

## 🔹 String Filters

```js
const users = await prisma.user.findMany({
  where: {
    email: { contains: '@gmail.com' },
    name: { startsWith: 'A' },
    username: { endsWith: '123' },
    
    // Case insensitive
    email: { contains: 'GMAIL', mode: 'insensitive' },
    name: { startsWith: 'a', mode: 'insensitive' }
  }
});
```

## 🔹 Null Filters

```js
const users = await prisma.user.findMany({
  where: {
    bio: null,              // bio is null
    avatar: { not: null },  // avatar is not null
    
    // Alternative syntax
    bio: { equals: null },
    avatar: { not: { equals: null } }
  }
});
```

## 🔹 Array Filters

```js
const posts = await prisma.post.findMany({
  where: {
    tags: { has: 'javascript' },                    // Contains 'javascript'
    categories: { hasSome: ['tech', 'coding'] },    // Contains any of these
    keywords: { hasEvery: ['node', 'express'] },    // Contains all of these
    labels: { isEmpty: true }                       // Array is empty
  }
});
```

## 🔹 Logical Operators

### AND
```js
const users = await prisma.user.findMany({
  where: {
    AND: [
      { isActive: true },
      { role: 'ADMIN' },
      { age: { gte: 18 } }
    ]
  }
});

// Implicit AND (same as above)
const users = await prisma.user.findMany({
  where: {
    isActive: true,
    role: 'ADMIN',
    age: { gte: 18 }
  }
});
```

### OR
```js
const users = await prisma.user.findMany({
  where: {
    OR: [
      { email: { contains: '@gmail.com' } },
      { email: { contains: '@yahoo.com' } },
      { email: { contains: '@hotmail.com' } }
    ]
  }
});
```

### NOT
```js
const users = await prisma.user.findMany({
  where: {
    NOT: {
      role: 'BANNED'
    }
  }
});

// Multiple NOT conditions
const users = await prisma.user.findMany({
  where: {
    NOT: [
      { role: 'BANNED' },
      { status: 'DELETED' }
    ]
  }
});
```

### Complex combinations
```js
const users = await prisma.user.findMany({
  where: {
    AND: [
      { isActive: true },
      {
        OR: [
          { role: 'ADMIN' },
          { role: 'MODERATOR' }
        ]
      },
      {
        NOT: {
          status: 'SUSPENDED'
        }
      }
    ]
  }
});
```

## 🔹 Relation Filters

### some - At least one related record matches
```js
// Users who have at least one published post
const users = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        published: true
      }
    }
  }
});
```

### every - All related records match
```js
// Users where ALL posts are published
const users = await prisma.user.findMany({
  where: {
    posts: {
      every: {
        published: true
      }
    }
  }
});
```

### none - No related records match
```js
// Users with no published posts
const users = await prisma.user.findMany({
  where: {
    posts: {
      none: {
        published: true
      }
    }
  }
});
```

### is - One-to-one relation filter
```js
// Users with a verified profile
const users = await prisma.user.findMany({
  where: {
    profile: {
      is: {
        verified: true
      }
    }
  }
});

// Users without a profile
const users = await prisma.user.findMany({
  where: {
    profile: {
      is: null
    }
  }
});
```

### isNot - Negation of is
```js
const users = await prisma.user.findMany({
  where: {
    profile: {
      isNot: {
        verified: false
      }
    }
  }
});
```

## 🔹 Date Filters

```js
const posts = await prisma.post.findMany({
  where: {
    createdAt: { gte: new Date('2024-01-01') },
    updatedAt: { lt: new Date() },
    
    // Date range
    publishedAt: {
      gte: new Date('2024-01-01'),
      lte: new Date('2024-12-31')
    }
  }
});

// Posts from last 7 days
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const recentPosts = await prisma.post.findMany({
  where: {
    createdAt: { gte: sevenDaysAgo }
  }
});
```

## 🔹 JSON Filters

```js
const users = await prisma.user.findMany({
  where: {
    metadata: {
      path: ['settings', 'theme'],
      equals: 'dark'
    }
  }
});

// Check if JSON field contains value
const users = await prisma.user.findMany({
  where: {
    preferences: {
      path: ['notifications'],
      array_contains: 'email'
    }
  }
});
```

## 🔹 Aggregation with Filters

```js
// Count with filter
const count = await prisma.post.count({
  where: { published: true }
});

// Aggregate
const result = await prisma.post.aggregate({
  where: { published: true },
  _count: true,
  _avg: { views: true },
  _sum: { likes: true },
  _min: { createdAt: true },
  _max: { createdAt: true }
});
```

## 💡 Tips

- Use **mode: 'insensitive'** for case-insensitive string searches
- Combine **AND**, **OR**, **NOT** for complex queries
- Use **some**, **every**, **none** for relation filtering
- Index frequently filtered fields for better performance
- Use **gte** and **lte** for range queries

## 🧩 Example: Advanced Search

```js
async function searchUsers(filters) {
  const {
    query,
    role,
    isActive,
    minAge,
    maxAge,
    hasProfile,
    minPosts
  } = filters;
  
  const where = {
    AND: []
  };
  
  // Text search
  if (query) {
    where.AND.push({
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } }
      ]
    });
  }
  
  // Role filter
  if (role) {
    where.AND.push({ role });
  }
  
  // Active status
  if (isActive !== undefined) {
    where.AND.push({ isActive });
  }
  
  // Age range
  if (minAge || maxAge) {
    const ageFilter = {};
    if (minAge) ageFilter.gte = minAge;
    if (maxAge) ageFilter.lte = maxAge;
    where.AND.push({ age: ageFilter });
  }
  
  // Has profile
  if (hasProfile !== undefined) {
    where.AND.push({
      profile: hasProfile ? { isNot: null } : { is: null }
    });
  }
  
  // Minimum posts
  if (minPosts) {
    where.AND.push({
      posts: {
        some: {}
      }
    });
  }
  
  return await prisma.user.findMany({
    where: where.AND.length > 0 ? where : {},
    include: {
      profile: true,
      _count: {
        select: { posts: true }
      }
    }
  });
}

// Usage
const results = await searchUsers({
  query: 'john',
  role: 'USER',
  isActive: true,
  minAge: 18,
  hasProfile: true
});
```

## 🧩 Example: E-commerce Product Filter

```js
async function filterProducts(filters) {
  const {
    category,
    minPrice,
    maxPrice,
    inStock,
    tags,
    rating,
    search
  } = filters;
  
  const where = {};
  
  if (category) {
    where.categoryId = category;
  }
  
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }
  
  if (inStock) {
    where.stock = { gt: 0 };
  }
  
  if (tags && tags.length > 0) {
    where.tags = { hasSome: tags };
  }
  
  if (rating) {
    where.rating = { gte: rating };
  }
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  return await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
}
```

## 🔗 See Also

- [CRUD](./crud.md)
- [Relations](./relations.md)
- [Pagination](./pagination.md)
