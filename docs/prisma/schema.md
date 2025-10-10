# Prisma Schema

The Prisma schema defines your database structure and relationships.

## 🔹 Basic Model

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
}
```

## 🔹 Field Types

### Scalar Types
```prisma
model Example {
  id        Int      @id @default(autoincrement())
  string    String
  int       Int
  float     Float
  boolean   Boolean
  datetime  DateTime
  json      Json
  bytes     Bytes
  decimal   Decimal
  bigint    BigInt
}
```

### Optional Fields
```prisma
model User {
  id    Int     @id @default(autoincrement())
  name  String?  // Optional (nullable)
  email String   // Required
}
```

### Arrays
```prisma
model Post {
  id   Int      @id @default(autoincrement())
  tags String[]  // Array of strings
}
```

## 🔹 Attributes

### @id - Primary key
```prisma
model User {
  id Int @id @default(autoincrement())
}

// UUID primary key
model User {
  id String @id @default(uuid())
}

// Composite primary key
model UserRole {
  userId Int
  roleId Int
  
  @@id([userId, roleId])
}
```

### @unique - Unique constraint
```prisma
model User {
  email String @unique
}

// Composite unique
model User {
  firstName String
  lastName  String
  
  @@unique([firstName, lastName])
}
```

### @default - Default value
```prisma
model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  isActive  Boolean  @default(true)
  role      String   @default("user")
}
```

### @updatedAt - Auto-update timestamp
```prisma
model User {
  updatedAt DateTime @updatedAt
}
```

### @map - Custom database name
```prisma
model User {
  id        Int    @id @default(autoincrement())
  firstName String @map("first_name")
  
  @@map("users")  // Table name in database
}
```

## 🔹 Relations

### One-to-Many
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

### One-to-One
```prisma
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  userId Int  @unique
  user   User @relation(fields: [userId], references: [id])
}
```

### Many-to-Many
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

### Explicit Many-to-Many
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
  
  post     Post     @relation(fields: [postId], references: [id])
  category Category @relation(fields: [categoryId], references: [id])
  
  @@id([postId, categoryId])
}
```

## 🔹 Enums

```prisma
enum Role {
  USER
  ADMIN
  MODERATOR
}

model User {
  id   Int  @id @default(autoincrement())
  role Role @default(USER)
}
```

## 🔹 Indexes

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String
  
  @@index([name])
  @@index([email, name])
}
```

## 🔹 Cascading Deletes

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

Options:
- `Cascade` - Delete related records
- `SetNull` - Set foreign key to null
- `Restrict` - Prevent deletion
- `NoAction` - Database default
- `SetDefault` - Set to default value

## 💡 Tips

- Use **@updatedAt** for automatic timestamp updates
- Use **enums** for fixed sets of values
- Add **indexes** for frequently queried fields
- Use **@@map** to match existing database names
- Use **Cascade** carefully to avoid accidental data loss

## 🧩 Example: E-commerce Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  orders    Order[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id          Int         @id @default(autoincrement())
  name        String
  description String?
  price       Decimal
  stock       Int         @default(0)
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  @@index([name])
}

model Order {
  id         Int         @id @default(autoincrement())
  userId     Int
  user       User        @relation(fields: [userId], references: [id])
  status     OrderStatus @default(PENDING)
  total      Decimal
  items      OrderItem[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId Int
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Decimal
  
  @@unique([orderId, productId])
}
```

## 🔗 See Also

- [Setup](./setup.md)
- [CRUD](./crud.md)
- [Relations](./relations.md)
