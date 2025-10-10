# Prisma Pagination

Efficiently paginate large datasets with Prisma.

## 🔹 Offset Pagination

```js
const page = 2;
const pageSize = 10;

const users = await prisma.user.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize
});

// Get total count
const total = await prisma.user.count();
const totalPages = Math.ceil(total / pageSize);
```

## 🔹 Cursor-Based Pagination

```js
const users = await prisma.user.findMany({
  take: 10,
  skip: 1,
  cursor: {
    id: lastUserId
  }
});
```

## 🔹 Complete Pagination Helper

```js
async function paginate(model, page = 1, limit = 10, where = {}) {
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    prisma[model].findMany({
      where,
      skip,
      take: limit
    }),
    prisma[model].count({ where })
  ]);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
}
```

## 🔗 See Also

- [CRUD](./crud.md)
- [Filters](./filters.md)
