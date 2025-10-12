# Prisma Cheatsheet

Quick reference for Prisma ORM essentials.

## 🚀 Setup

```bash
npm install @prisma/client
npm install -D prisma

npx prisma init
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

## 📝 Schema 

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id       Int  @id @default(autoincrement())
  title    String
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
```

## ➕ Create

```js
// Single
await prisma.user.create({
  data: { email: 'user@example.com', name: 'User' }
});

// Many
await prisma.user.createMany({
  data: [{ email: 'a@ex.com' }, { email: 'b@ex.com' }]
});

// With relations
await prisma.user.create({
  data: {
    email: 'user@example.com',
    posts: { create: { title: 'Post' } }
  }
});
```

## 🔍 Read

```js
// Find unique
await prisma.user.findUnique({ where: { id: 1 } });

// Find first
await prisma.user.findFirst({ where: { name: 'Alice' } });

// Find many
await prisma.user.findMany();
await prisma.user.findMany({ where: { isActive: true } });

// With relations
await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true }
});

// Count
await prisma.user.count();
```

## ✏️ Update

```js
// Single
await prisma.user.update({
  where: { id: 1 },
  data: { name: 'New Name' }
});

// Many
await prisma.user.updateMany({
  where: { isActive: false },
  data: { status: 'INACTIVE' }
});

// Upsert
await prisma.user.upsert({
  where: { email: 'user@example.com' },
  update: { name: 'Updated' },
  create: { email: 'user@example.com', name: 'New' }
});
```

## ❌ Delete

```js
// Single
await prisma.user.delete({ where: { id: 1 } });

// Many
await prisma.user.deleteMany({ where: { isActive: false } });
```

## 🔍 Filters

```js
// Comparison
{ age: { gt: 18, lte: 65 } }

// String
{ email: { contains: '@gmail.com' } }
{ name: { startsWith: 'A' } }

// Logical
{ OR: [{ a: 1 }, { b: 2 }] }
{ AND: [{ a: 1 }, { b: 2 }] }
{ NOT: { status: 'BANNED' } }

// Relations
{ posts: { some: { published: true } } }
{ posts: { every: { published: true } } }
{ posts: { none: { published: false } } }
```

## 📄 Pagination

```js
// Offset
await prisma.user.findMany({
  skip: 10,
  take: 10
});

// Cursor
await prisma.user.findMany({
  take: 10,
  cursor: { id: lastId },
  skip: 1
});
```

## 🔄 Transactions

```js
await prisma.$transaction([
  prisma.user.create({ data: {...} }),
  prisma.post.create({ data: {...} })
]);

await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: {...} });
  await tx.post.create({ data: { authorId: user.id } });
});
```

## 🔗 See Also

- [CRUD](../prisma/crud.md)
- [Schema](../prisma/schema.md)