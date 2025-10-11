# Advanced Prisma CRUD Operations

Advanced patterns and techniques for Prisma database operations.

## 🔹 Batch Operations

### Bulk Insert with Transaction

```js
const prisma = require('./prisma');

async function bulkInsertUsers(users) {
  return await prisma.$transaction(
    users.map(user => 
      prisma.user.create({
        data: user
      })
    )
  );
}

// Usage
const users = [
  { email: 'user1@example.com', name: 'User 1' },
  { email: 'user2@example.com', name: 'User 2' },
  { email: 'user3@example.com', name: 'User 3' }
];

const created = await bulkInsertUsers(users);
```

### Upsert Multiple Records

```js
async function upsertMany(data) {
  return await prisma.$transaction(
    data.map(item =>
      prisma.user.upsert({
        where: { email: item.email },
        update: { name: item.name },
        create: item
      })
    )
  );
}
```

### Batch Update with Conditions

```js
async function batchUpdateByCondition(condition, updates) {
  const records = await prisma.user.findMany({
    where: condition
  });
  
  return await prisma.$transaction(
    records.map(record =>
      prisma.user.update({
        where: { id: record.id },
        data: updates
      })
    )
  );
}

// Usage: Update all inactive users
await batchUpdateByCondition(
  { active: false },
  { status: 'archived', archivedAt: new Date() }
);
```

## 🔹 Complex Queries

### Dynamic Query Builder

```js
function buildDynamicQuery(filters) {
  const where = {};
  
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { email: { contains: filters.search, mode: 'insensitive' } }
    ];
  }
  
  if (filters.status) {
    where.status = filters.status;
  }
  
  if (filters.createdAfter) {
    where.createdAt = { gte: new Date(filters.createdAfter) };
  }
  
  if (filters.createdBefore) {
    where.createdAt = { 
      ...where.createdAt,
      lte: new Date(filters.createdBefore) 
    };
  }
  
  if (filters.tags && filters.tags.length > 0) {
    where.tags = {
      some: {
        name: { in: filters.tags }
      }
    };
  }
  
  return where;
}

// Usage
async function searchUsers(filters, pagination) {
  const where = buildDynamicQuery(filters);
  
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);
  
  return { users, total };
}
```

### Nested Filtering

```js
// Find users with posts that have specific tags
const users = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        tags: {
          some: {
            name: { in: ['javascript', 'nodejs'] }
          }
        },
        published: true
      }
    }
  },
  include: {
    posts: {
      where: {
        published: true
      },
      include: {
        tags: true
      }
    }
  }
});
```

### Aggregation Queries

```js
// Complex aggregation
const stats = await prisma.post.groupBy({
  by: ['authorId', 'published'],
  _count: {
    id: true
  },
  _avg: {
    views: true
  },
  _sum: {
    likes: true
  },
  where: {
    createdAt: {
      gte: new Date('2024-01-01')
    }
  },
  having: {
    likes: {
      _sum: {
        gt: 100
      }
    }
  }
});

// Get user statistics
const userStats = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    name: true,
    _count: {
      select: {
        posts: true,
        comments: true,
        followers: true
      }
    }
  }
});
```

## 🔹 Optimistic Locking

### Version-Based Locking

```js
async function updateWithOptimisticLock(id, data, currentVersion) {
  try {
    const updated = await prisma.document.updateMany({
      where: {
        id: id,
        version: currentVersion
      },
      data: {
        ...data,
        version: { increment: 1 }
      }
    });
    
    if (updated.count === 0) {
      throw new Error('Document was modified by another user');
    }
    
    return await prisma.document.findUnique({ where: { id } });
  } catch (error) {
    throw error;
  }
}

// Usage
const doc = await prisma.document.findUnique({ where: { id: 1 } });
await updateWithOptimisticLock(1, { title: 'New Title' }, doc.version);
```

## 🔹 Soft Delete Pattern

### Implement Soft Delete

```js
// Middleware for soft delete
prisma.$use(async (params, next) => {
  if (params.model === 'User') {
    if (params.action === 'delete') {
      // Change delete to update
      params.action = 'update';
      params.args.data = { deletedAt: new Date() };
    }
    
    if (params.action === 'deleteMany') {
      params.action = 'updateMany';
      if (params.args.data !== undefined) {
        params.args.data.deletedAt = new Date();
      } else {
        params.args.data = { deletedAt: new Date() };
      }
    }
    
    // Exclude soft-deleted records from queries
    if (params.action === 'findUnique' || params.action === 'findFirst') {
      params.action = 'findFirst';
      params.args.where = {
        ...params.args.where,
        deletedAt: null
      };
    }
    
    if (params.action === 'findMany') {
      if (params.args.where) {
        if (params.args.where.deletedAt === undefined) {
          params.args.where.deletedAt = null;
        }
      } else {
        params.args.where = { deletedAt: null };
      }
    }
  }
  
  return next(params);
});

// Hard delete function
async function hardDelete(model, where) {
  return await prisma.$executeRawUnsafe(
    `DELETE FROM "${model}" WHERE id = $1`,
    where.id
  );
}
```

## 🔹 Connection Pooling

### Custom Connection Pool

```js
const { PrismaClient } = require('@prisma/client');

class PrismaPool {
  constructor(poolSize = 10) {
    this.pool = [];
    this.poolSize = poolSize;
    this.activeConnections = 0;
    
    for (let i = 0; i < poolSize; i++) {
      this.pool.push(new PrismaClient());
    }
  }
  
  async getConnection() {
    if (this.activeConnections >= this.poolSize) {
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.getConnection();
    }
    
    const client = this.pool[this.activeConnections];
    this.activeConnections++;
    
    return {
      client,
      release: () => {
        this.activeConnections--;
      }
    };
  }
  
  async disconnect() {
    await Promise.all(this.pool.map(client => client.$disconnect()));
  }
}

// Usage
const pool = new PrismaPool(5);

async function queryWithPool() {
  const { client, release } = await pool.getConnection();
  
  try {
    const users = await client.user.findMany();
    return users;
  } finally {
    release();
  }
}
```

## 🔹 Query Optimization

### Select Only Needed Fields

```js
// Bad: Fetches all fields
const users = await prisma.user.findMany();

// Good: Select specific fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
  }
});
```

### Pagination with Cursor

```js
async function paginateWithCursor(cursor, take = 10) {
  const users = await prisma.user.findMany({
    take: take + 1, // Fetch one extra to check if there's more
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor }
    }),
    orderBy: { id: 'asc' }
  });
  
  const hasMore = users.length > take;
  const items = hasMore ? users.slice(0, -1) : users;
  const nextCursor = hasMore ? items[items.length - 1].id : null;
  
  return {
    items,
    nextCursor,
    hasMore
  };
}

// Usage
let cursor = null;
let page = 1;

do {
  const result = await paginateWithCursor(cursor, 20);
  console.log(`Page ${page}:`, result.items);
  cursor = result.nextCursor;
  page++;
} while (cursor);
```

### Batch Loading (DataLoader Pattern)

```js
class PrismaDataLoader {
  constructor() {
    this.queue = new Map();
    this.scheduled = false;
  }
  
  load(model, id) {
    return new Promise((resolve, reject) => {
      if (!this.queue.has(model)) {
        this.queue.set(model, []);
      }
      
      this.queue.get(model).push({ id, resolve, reject });
      
      if (!this.scheduled) {
        this.scheduled = true;
        process.nextTick(() => this.flush());
      }
    });
  }
  
  async flush() {
    const queue = this.queue;
    this.queue = new Map();
    this.scheduled = false;
    
    for (const [model, requests] of queue.entries()) {
      const ids = requests.map(r => r.id);
      
      try {
        const results = await prisma[model].findMany({
          where: { id: { in: ids } }
        });
        
        const resultMap = new Map(results.map(r => [r.id, r]));
        
        requests.forEach(({ id, resolve }) => {
          resolve(resultMap.get(id) || null);
        });
      } catch (error) {
        requests.forEach(({ reject }) => reject(error));
      }
    }
  }
}

// Usage
const loader = new PrismaDataLoader();

const user1 = await loader.load('user', 1);
const user2 = await loader.load('user', 2);
const user3 = await loader.load('user', 3);
// All three queries batched into one
```

## 🔹 Raw Queries

### Complex Raw SQL

```js
// Raw query with parameters
const users = await prisma.$queryRaw`
  SELECT u.*, COUNT(p.id) as post_count
  FROM "User" u
  LEFT JOIN "Post" p ON u.id = p."authorId"
  WHERE u."createdAt" > ${new Date('2024-01-01')}
  GROUP BY u.id
  HAVING COUNT(p.id) > 5
  ORDER BY post_count DESC
  LIMIT 10
`;

// Execute raw SQL
await prisma.$executeRaw`
  UPDATE "User"
  SET "lastActive" = NOW()
  WHERE "id" = ${userId}
`;
```

### Full-Text Search

```js
// PostgreSQL full-text search
const results = await prisma.$queryRaw`
  SELECT *
  FROM "Post"
  WHERE to_tsvector('english', title || ' ' || content) @@ to_tsquery('english', ${searchTerm})
  ORDER BY ts_rank(to_tsvector('english', title || ' ' || content), to_tsquery('english', ${searchTerm})) DESC
  LIMIT 20
`;
```

## 🔹 Transaction Patterns

### Interactive Transactions

```js
async function transferFunds(fromId, toId, amount) {
  return await prisma.$transaction(async (tx) => {
    // Check sender balance
    const sender = await tx.account.findUnique({
      where: { id: fromId }
    });
    
    if (sender.balance < amount) {
      throw new Error('Insufficient funds');
    }
    
    // Deduct from sender
    await tx.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } }
    });
    
    // Add to receiver
    await tx.account.update({
      where: { id: toId },
      data: { balance: { increment: amount } }
    });
    
    // Create transaction record
    await tx.transaction.create({
      data: {
        fromId,
        toId,
        amount,
        type: 'TRANSFER'
      }
    });
    
    return { success: true };
  });
}
```

### Retry Logic

```js
async function withRetry(fn, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (error.code === 'P2034') { // Transaction conflict
        await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, i)));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError;
}

// Usage
await withRetry(async () => {
  return await prisma.$transaction(async (tx) => {
    // Transaction logic
  });
});
```

## 🔹 Middleware Patterns

### Logging Middleware

```js
prisma.$use(async (params, next) => {
  const before = Date.now();
  
  const result = await next(params);
  
  const after = Date.now();
  
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  
  return result;
});
```

### Audit Trail Middleware

```js
prisma.$use(async (params, next) => {
  if (params.action === 'create' || params.action === 'update') {
    params.args.data = {
      ...params.args.data,
      updatedAt: new Date(),
      updatedBy: getCurrentUserId() // Your auth context
    };
  }
  
  return next(params);
});
```

## 🔗 See Also

- [CRUD Basics](./crud.md)
- [Transactions](./transactions.md)
- [Relations](./relations.md)
