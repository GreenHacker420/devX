# TypeScript with Node.js

Complete guide to using TypeScript with Node.js for backend development.

## Setup

### Initialize Project

```bash
mkdir my-app
cd my-app
npm init -y
```

### Install Dependencies

```bash
# TypeScript and Node types
npm install --save-dev typescript @types/node

# Development tools
npm install --save-dev ts-node nodemon

# Or use tsx (faster)
npm install --save-dev tsx
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "dev:nodemon": "nodemon --exec ts-node src/index.ts"
  }
}
```

## Basic HTTP Server

```typescript
// src/server.ts
import http from 'http'

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Hello TypeScript!' }))
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## Express with TypeScript

### Installation

```bash
npm install express
npm install --save-dev @types/express
```

### Basic Express App

```typescript
// src/app.ts
import express, { Request, Response, NextFunction } from 'express'

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello TypeScript!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

### Typed Routes

```typescript
interface User {
  id: number
  name: string
  email: string
}

app.get('/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  
  const user: User = {
    id,
    name: 'Alice',
    email: 'alice@example.com'
  }
  
  res.json(user)
})

app.post('/users', (req: Request, res: Response) => {
  const { name, email } = req.body as Pick<User, 'name' | 'email'>
  
  const user: User = {
    id: Date.now(),
    name,
    email
  }
  
  res.status(201).json(user)
})
```

### Custom Request Types

```typescript
// src/types/express.d.ts
import { User } from './models'

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}
```

Usage:

```typescript
// Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = { id: 1, name: 'Alice', email: 'alice@example.com' }
  next()
})

// Route
app.get('/profile', (req: Request, res: Response) => {
  res.json(req.user)  // TypeScript knows about user property
})
```

### Error Handling

```typescript
interface ApiError extends Error {
  statusCode: number
}

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    error: err.message
  })
})
```

## File System Operations

```typescript
import fs from 'fs/promises'
import path from 'path'

async function readFile(filename: string): Promise<string> {
  try {
    const filePath = path.join(__dirname, filename)
    const data = await fs.readFile(filePath, 'utf-8')
    return data
  } catch (error) {
    throw new Error(`Failed to read file: ${error}`)
  }
}

async function writeFile(filename: string, content: string): Promise<void> {
  try {
    const filePath = path.join(__dirname, filename)
    await fs.writeFile(filePath, content, 'utf-8')
  } catch (error) {
    throw new Error(`Failed to write file: ${error}`)
  }
}

// Usage
async function main() {
  const content = await readFile('data.txt')
  console.log(content)
  
  await writeFile('output.txt', 'Hello TypeScript!')
}
```

## Database with Prisma

### Installation

```bash
npm install @prisma/client
npm install --save-dev prisma
npx prisma init
```

### Prisma Schema

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
}
```

### Prisma Client

```typescript
// src/db.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma
```

### CRUD Operations

```typescript
// src/services/userService.ts
import prisma from '../db'
import { User, Prisma } from '@prisma/client'

export async function createUser(
  data: Prisma.UserCreateInput
): Promise<User> {
  return await prisma.user.create({ data })
}

export async function getUser(id: number): Promise<User | null> {
  return await prisma.user.findUnique({
    where: { id },
    include: { posts: true }
  })
}

export async function updateUser(
  id: number,
  data: Prisma.UserUpdateInput
): Promise<User> {
  return await prisma.user.update({
    where: { id },
    data
  })
}

export async function deleteUser(id: number): Promise<User> {
  return await prisma.user.delete({
    where: { id }
  })
}

export async function getAllUsers(): Promise<User[]> {
  return await prisma.user.findMany({
    include: { posts: true }
  })
}
```

### Express Routes with Prisma

```typescript
import express from 'express'
import * as userService from './services/userService'

const app = express()
app.use(express.json())

app.post('/users', async (req, res) => {
  try {
    const user = await userService.createUser(req.body)
    res.status(201).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' })
  }
})

app.get('/users/:id', async (req, res) => {
  try {
    const user = await userService.getUser(parseInt(req.params.id))
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})
```

## Environment Variables

### Type-Safe Environment Variables

```typescript
// src/config/env.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  API_KEY: z.string()
})

export type Env = z.infer<typeof envSchema>

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env)
  
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.format())
    process.exit(1)
  }
  
  return parsed.data
}

export const env = validateEnv()
```

Usage:

```typescript
import { env } from './config/env'

const PORT = env.PORT  // Type-safe!
const dbUrl = env.DATABASE_URL
```

## Authentication with JWT

### Installation

```bash
npm install jsonwebtoken bcryptjs
npm install --save-dev @types/jsonwebtoken @types/bcryptjs
```

### JWT Service

```typescript
// src/services/authService.ts
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { env } from '../config/env'

interface TokenPayload {
  userId: number
  email: string
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}
```

### Auth Middleware

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../services/authService'

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }
  
  const token = authHeader.split(' ')[1]
  
  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

## Validation with Zod

```bash
npm install zod
```

```typescript
import { z } from 'zod'
import { Request, Response } from 'express'

const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().int().positive().optional()
})

type UserInput = z.infer<typeof userSchema>

app.post('/users', (req: Request, res: Response) => {
  try {
    const validatedData = userSchema.parse(req.body)
    
    // validatedData is type-safe
    const user = createUser(validatedData)
    res.status(201).json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})
```

## Async Error Handling

```typescript
// src/utils/asyncHandler.ts
import { Request, Response, NextFunction } from 'express'

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>

export function asyncHandler(fn: AsyncHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Usage
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await userService.getUser(parseInt(req.params.id))
  res.json(user)
}))
```

## Logging

```typescript
// src/utils/logger.ts
enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  data?: any
}

class Logger {
  private log(level: LogLevel, message: string, data?: any): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data
    }
    
    console.log(JSON.stringify(entry))
  }
  
  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data)
  }
  
  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data)
  }
  
  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, message, data)
  }
}

export const logger = new Logger()
```

## Testing with Jest

### Installation

```bash
npm install --save-dev jest @types/jest ts-jest
npx ts-jest config:init
```

### Test Example

```typescript
// src/__tests__/userService.test.ts
import * as userService from '../services/userService'

describe('UserService', () => {
  it('should create a user', async () => {
    const user = await userService.createUser({
      name: 'Alice',
      email: 'alice@example.com'
    })
    
    expect(user).toHaveProperty('id')
    expect(user.name).toBe('Alice')
    expect(user.email).toBe('alice@example.com')
  })
  
  it('should get a user by id', async () => {
    const user = await userService.getUser(1)
    expect(user).not.toBeNull()
  })
})
```

## Project Structure

```
src/
├── config/
│   ├── env.ts
│   └── database.ts
├── controllers/
│   ├── userController.ts
│   └── postController.ts
├── middleware/
│   ├── auth.ts
│   ├── validation.ts
│   └── errorHandler.ts
├── models/
│   └── types.ts
├── routes/
│   ├── userRoutes.ts
│   └── postRoutes.ts
├── services/
│   ├── userService.ts
│   ├── postService.ts
│   └── authService.ts
├── utils/
│   ├── logger.ts
│   └── asyncHandler.ts
├── __tests__/
│   └── userService.test.ts
├── app.ts
└── index.ts
```

## Best Practices

- ✅ Use strict mode in tsconfig.json
- ✅ Validate environment variables at startup
- ✅ Use Zod or similar for request validation
- ✅ Create type-safe database queries with Prisma
- ✅ Use async/await instead of callbacks
- ✅ Implement proper error handling
- ✅ Use dependency injection for testability
- ✅ Write tests for critical functionality

## Common Pitfalls

- ⚠️ **Don't use `any` for request/response** - Type them properly
- ⚠️ **Don't forget error handling** - Use try-catch or async handlers
- ⚠️ **Don't skip validation** - Always validate user input
- ⚠️ **Don't expose sensitive data** - Keep secrets in environment variables
- ⚠️ **Don't forget to close database connections** - Use proper cleanup

## Related Topics

- [Basics](./basics.md)
- [Advanced Types](./advanced.md)
- [Setup](./setup.md)

## References

- [Node.js TypeScript Documentation](https://nodejs.org/en/docs/guides/typescript/)
- [Express TypeScript Guide](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Prisma Documentation](https://www.prisma.io/docs)
