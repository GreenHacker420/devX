# Prisma Setup

Prisma is a next-generation ORM for Node.js and TypeScript.

## 🔹 Installation

```bash
# Install Prisma CLI
npm install -D prisma

# Install Prisma Client
npm install @prisma/client

# Initialize Prisma
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables

## 🔹 Database Connection

### .env
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
# Or for MySQL
DATABASE_URL="mysql://user:password@localhost:3306/mydb"
# Or for SQLite
DATABASE_URL="file:./dev.db"
# Or for MongoDB
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/mydb"
```

## 🔹 Schema File

### prisma/schema.prisma
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🔹 Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio

# Format schema
npx prisma format

# Validate schema
npx prisma validate

# Pull database schema
npx prisma db pull

# Push schema to database (without migration)
npx prisma db push
```

## 🔹 Prisma Client Setup

### lib/prisma.js
```js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
```

### With logging
```js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

module.exports = prisma;
```

### Singleton pattern (recommended)
```js
const { PrismaClient } = require('@prisma/client');

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

module.exports = prisma;
```

## 🔹 Using Prisma Client

```js
const prisma = require('./lib/prisma');

async function main() {
  // Create user
  const user = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice'
    }
  });
  
  console.log(user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 🔹 With Express

```js
const express = require('express');
const prisma = require('./lib/prisma');

const app = express();
app.use(express.json());

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create user
app.post('/users', async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(3000);
```

## 🔹 Environment-Specific Setup

### Development
```bash
npx prisma migrate dev
npx prisma studio
```

### Production
```bash
npx prisma migrate deploy
npx prisma generate
```

## 💡 Tips

- Run **prisma generate** after schema changes
- Use **migrations** for production databases
- Use **db push** for rapid prototyping
- Enable **query logging** in development
- Use **singleton pattern** to avoid multiple instances

## 🧩 Example: Complete Setup

```js
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       Int      @id @default(autoincrement())
  email    String   @unique
  name     String
  posts    Post[]
  profile  Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id])
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  Int
  author    User     @relation(fields: [authorId], references: [id])
}
```

```js
// lib/prisma.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
});

module.exports = prisma;
```

## ⚠️ Common Mistakes

❌ **Not running prisma generate**
```bash
# After schema changes, must run:
npx prisma generate
```

❌ **Multiple Prisma instances**
```js
// Don't create new instance everywhere
const prisma = new PrismaClient(); // ❌
```

✅ **Use singleton:**
```js
const prisma = require('./lib/prisma'); // ✅
```

## 🔗 See Also

- [Schema](./schema.md)
- [CRUD](./crud.md)
- [Relations](./relations.md)
