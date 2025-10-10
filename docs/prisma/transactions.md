# Prisma Transactions

Transactions ensure multiple database operations succeed or fail together.

## 🔹 Sequential Transactions

```js
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'alice@example.com', name: 'Alice' } }),
  prisma.post.create({ data: { title: 'First Post', authorId: 1 } })
]);

// All operations succeed or all fail
```

## 🔹 Interactive Transactions

```js
const result = await prisma.$transaction(async (tx) => {
  // Create user
  const user = await tx.user.create({
    data: { email: 'bob@example.com', name: 'Bob' }
  });
  
  // Create profile
  const profile = await tx.profile.create({
    data: { bio: 'Developer', userId: user.id }
  });
  
  // Create posts
  const posts = await tx.post.createMany({
    data: [
      { title: 'Post 1', authorId: user.id },
      { title: 'Post 2', authorId: user.id }
    ]
  });
  
  return { user, profile, posts };
});
```

## 🔹 Transaction with Error Handling

```js
try {
  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: { email: 'test@example.com', name: 'Test' }
    });
    
    // This might fail
    const post = await tx.post.create({
      data: { title: 'Post', authorId: 999 } // Invalid authorId
    });
    
    return { user, post };
  });
} catch (error) {
  console.error('Transaction failed:', error);
  // Both user and post creation are rolled back
}
```

## 🔹 Transfer Money Example

```js
async function transferMoney(fromId, toId, amount) {
  return await prisma.$transaction(async (tx) => {
    // Deduct from sender
    const sender = await tx.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } }
    });
    
    // Check if sender has sufficient balance
    if (sender.balance < 0) {
      throw new Error('Insufficient balance');
    }
    
    // Add to receiver
    const receiver = await tx.account.update({
      where: { id: toId },
      data: { balance: { increment: amount } }
    });
    
    // Create transaction record
    const transaction = await tx.transaction.create({
      data: {
        fromId,
        toId,
        amount,
        type: 'TRANSFER'
      }
    });
    
    return { sender, receiver, transaction };
  });
}
```

## 🔹 Transaction Options

```js
const result = await prisma.$transaction(
  async (tx) => {
    // Operations
  },
  {
    maxWait: 5000,      // Max time to wait for transaction to start (ms)
    timeout: 10000,     // Max time transaction can run (ms)
    isolationLevel: 'Serializable' // Transaction isolation level
  }
);
```

### Isolation Levels
- `ReadUncommitted`
- `ReadCommitted`
- `RepeatableRead`
- `Serializable`

## 🔹 Nested Writes (Implicit Transactions)

```js
// This is automatically wrapped in a transaction
const user = await prisma.user.create({
  data: {
    email: 'alice@example.com',
    name: 'Alice',
    profile: {
      create: { bio: 'Developer' }
    },
    posts: {
      create: [
        { title: 'Post 1', content: 'Content 1' },
        { title: 'Post 2', content: 'Content 2' }
      ]
    }
  }
});
```

## 🔹 Batch Operations in Transaction

```js
const result = await prisma.$transaction([
  prisma.user.deleteMany({ where: { isActive: false } }),
  prisma.post.deleteMany({ where: { published: false } }),
  prisma.comment.deleteMany({ where: { spam: true } })
]);

console.log('Deleted:', result);
```

## 🔹 Read-Modify-Write Pattern

```js
async function incrementPostViews(postId) {
  return await prisma.$transaction(async (tx) => {
    // Read
    const post = await tx.post.findUnique({
      where: { id: postId }
    });
    
    if (!post) {
      throw new Error('Post not found');
    }
    
    // Modify
    const updatedPost = await tx.post.update({
      where: { id: postId },
      data: { views: post.views + 1 }
    });
    
    // Log view
    await tx.viewLog.create({
      data: { postId, viewedAt: new Date() }
    });
    
    return updatedPost;
  });
}
```

## 💡 Tips

- Use **interactive transactions** for complex operations
- Use **sequential transactions** for simple batch operations
- Always handle **errors** in transactions
- Set appropriate **timeout** values
- Use **isolation levels** based on your needs
- Nested writes are automatically transactional

## 🧩 Example: Order Processing

```js
async function processOrder(userId, items) {
  return await prisma.$transaction(async (tx) => {
    // Calculate total
    let total = 0;
    const orderItems = [];
    
    // Check stock and calculate total
    for (const item of items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId }
      });
      
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      
      total += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
    }
    
    // Create order
    const order = await tx.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: {
          create: orderItems
        }
      }
    });
    
    // Update stock
    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity }
        }
      });
    }
    
    // Create invoice
    const invoice = await tx.invoice.create({
      data: {
        orderId: order.id,
        amount: total,
        status: 'UNPAID'
      }
    });
    
    return { order, invoice };
  });
}
```

## 🧩 Example: User Registration with Email

```js
async function registerUser(userData) {
  return await prisma.$transaction(async (tx) => {
    // Check if email exists
    const existing = await tx.user.findUnique({
      where: { email: userData.email }
    });
    
    if (existing) {
      throw new Error('Email already exists');
    }
    
    // Create user
    const user = await tx.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        password: userData.hashedPassword
      }
    });
    
    // Create verification token
    const token = await tx.verificationToken.create({
      data: {
        userId: user.id,
        token: generateToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });
    
    // Send verification email (outside transaction)
    // await sendVerificationEmail(user.email, token.token);
    
    return { user, token };
  });
}
```

## ⚠️ Common Mistakes

❌ **Not handling errors**
```js
const result = await prisma.$transaction(async (tx) => {
  // Operations that might fail
}); // No error handling!
```

✅ **Use try/catch:**
```js
try {
  const result = await prisma.$transaction(async (tx) => {
    // Operations
  });
} catch (error) {
  console.error('Transaction failed:', error);
}
```

❌ **Long-running operations in transaction**
```js
await prisma.$transaction(async (tx) => {
  await sendEmail(); // Don't do I/O in transactions!
  await sleep(5000); // Don't delay!
});
```

✅ **Keep transactions short:**
```js
const result = await prisma.$transaction(async (tx) => {
  // Only database operations
});

// Do I/O after transaction
await sendEmail(result);
```

## 🔗 See Also

- [CRUD](./crud.md)
- [Relations](./relations.md)
- [Pagination](./pagination.md)
