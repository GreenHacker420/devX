# Prisma Interview Questions

Common Prisma ORM interview questions.

## 🔹 What is Prisma?

**Answer:** Prisma is a next-generation ORM (Object-Relational Mapping) for Node.js and TypeScript that provides type-safe database access.

## 🔹 What is Prisma Schema?

**Answer:** The schema file defines your database structure, models, and relationships using Prisma's declarative syntax.

## 🔹 What is Prisma Client?

**Answer:** Prisma Client is an auto-generated query builder that provides type-safe database access based on your schema.

## 🔹 What is the difference between findUnique and findFirst?

**Answer:**
- `findUnique`: Requires unique field, returns single record or null
- `findFirst`: Can use any field, returns first match or null

## 🔹 How do you handle relations in Prisma?

**Answer:** Define relations in schema using relation fields and use include/select to fetch related data.

```prisma
model User {
  posts Post[]
}

model Post {
  author User @relation(fields: [authorId], references: [id])
}
```

## 🔹 What is a migration?

**Answer:** Migrations are version-controlled changes to your database schema. Created with `prisma migrate dev`.

## 🔹 What is the difference between include and select?

**Answer:**
- `include`: Adds related data to the result
- `select`: Chooses specific fields to return

## 🔹 How do you handle transactions?

**Answer:** Use `$transaction` for multiple operations that should succeed or fail together.

```js
await prisma.$transaction([
  prisma.user.create({ data: {...} }),
  prisma.post.create({ data: {...} })
]);
```

## 🔗 See Also

- [Auth Questions](./auth-questions.md)
- [JavaScript Questions](./javascript-questions.md)
