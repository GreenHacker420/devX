# MongoDB CRUD Operations

## Basic CRUD Operations

### 1. Create Operations

#### Insert a Single Document
```javascript
// Using insertOne()
db.collection('users').insertOne({
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  status: 'active'
});
```

#### Insert Multiple Documents
```javascript
// Using insertMany()
db.collection('users').insertMany([
  { name: 'Alice', age: 25, status: 'active' },
  { name: 'Bob', age: 35, status: 'inactive' },
  { name: 'Charlie', age: 40, status: 'pending' }
]);
```

### 2. Read Operations

#### Find All Documents
```javascript
// Using find() with no query
const allUsers = await db.collection('users').find({}).toArray();
```

#### Find with Query
```javascript
// Find with equality condition
const activeUsers = await db.collection('users')
  .find({ status: 'active' })
  .toArray();

// Using comparison operators
const adultUsers = await db.collection('users')
  .find({ age: { $gt: 18 } })
  .toArray();
```

#### Find One Document
```javascript
const user = await db.collection('users').findOne({ email: 'john@example.com' });
```

#### Projection (Selecting Fields)
```javascript
// Include only name and email fields
const users = await db.collection('users')
  .find({}, { projection: { name: 1, email: 1, _id: 0 } })
  .toArray();
```

#### Sorting
```javascript
// Sort by age in descending order
const sortedUsers = await db.collection('users')
  .find()
  .sort({ age: -1 })
  .toArray();
```

#### Limiting and Skipping
```javascript
// Pagination: Get second page with 10 items per page
const page = 2;
const limit = 10;
const users = await db.collection('users')
  .find()
  .skip((page - 1) * limit)
  .limit(limit)
  .toArray();
```

### 3. Update Operations

#### Update a Single Document
```javascript
// Using updateOne()
const result = await db.collection('users').updateOne(
  { email: 'john@example.com' },
  { $set: { status: 'inactive', updatedAt: new Date() } }
);

console.log(`${result.matchedCount} document(s) matched the filter`);
console.log(`${result.modifiedCount} document(s) was/were updated`);
```

#### Update Multiple Documents
```javascript
// Using updateMany()
const result = await db.collection('users').updateMany(
  { status: 'pending' },
  { $set: { status: 'active', updatedAt: new Date() } }
);
```

#### Increment a Value
```javascript
// Increment age by 1
await db.collection('users').updateOne(
  { email: 'john@example.com' },
  { $inc: { age: 1 } }
);
```

#### Add to Array
```javascript
// Add to array field
await db.collection('users').updateOne(
  { email: 'john@example.com' },
  { $push: { tags: 'premium' } }
);

// Add to array if not exists
await db.collection('users').updateOne(
  { email: 'john@example.com' },
  { $addToSet: { tags: 'premium' } }
);
```

### 4. Delete Operations

#### Delete a Single Document
```javascript
const result = await db.collection('users').deleteOne({ email: 'john@example.com' });
console.log(`${result.deletedCount} document(s) was/were deleted`);
```

#### Delete Multiple Documents
```javascript
const result = await db.collection('users').deleteMany({ status: 'inactive' });
```

#### Delete All Documents (but keep the collection)
```javascript
const result = await db.collection('users').deleteMany({});
```

## Bulk Operations

### Ordered Bulk Operations
```javascript
const bulk = db.collection('users').initializeOrderedBulkOp();
bulk.insert({ name: 'User 1' });
bulk.insert({ name: 'User 2' });
bulk.find({ name: 'User 1' }).update({ $set: { status: 'active' } });
const result = await bulk.execute();
```

### Unordered Bulk Operations
```javascript
const bulk = db.collection('users').initializeUnorderedBulkOp();
bulk.insert({ name: 'User 3' });
bulk.insert({ name: 'User 4' });
const result = await bulk.execute();
```

## Find and Modify

### Find One and Update
```javascript
const result = await db.collection('users').findOneAndUpdate(
  { email: 'john@example.com' },
  { $set: { lastLogin: new Date() } },
  { returnDocument: 'after' }  // Return the updated document
);
```

### Find One and Delete
```javascript
const result = await db.collection('users').findOneAndDelete(
  { email: 'john@example.com' }
);
```

## Indexes

### Create Index
```javascript
// Single field index
await db.collection('users').createIndex({ email: 1 });

// Compound index
await db.collection('users').createIndex({ status: 1, createdAt: -1 });

// Unique index
await db.collection('users').createIndex({ email: 1 }, { unique: true });

// Text index for text search
await db.collection('articles').createIndex({ content: 'text' });
```

### List Indexes
```javascript
const indexes = await db.collection('users').indexes();
console.log(indexes);
```

### Drop Index
```javascript
await db.collection('users').dropIndex('email_1');
```

## Transactions (MongoDB 4.0+)

```javascript
const session = client.startSession();

try {
  await session.withTransaction(async () => {
    // Perform operations in the transaction
    const user = await db.collection('users').findOne(
      { email: 'john@example.com' },
      { session }
    );

    if (!user) {
      throw new Error('User not found');
    }

    await db.collection('orders').insertOne(
      {
        userId: user._id,
        items: ['item1', 'item2'],
        total: 100,
        status: 'pending'
      },
      { session }
    );

    await db.collection('users').updateOne(
      { _id: user._id },
      { $inc: { orderCount: 1 } },
      { session }
    );
  });
} finally {
  await session.endSession();
}
```

## Best Practices

1. **Use Projections** to retrieve only the fields you need
2. **Create Indexes** for frequently queried fields
3. **Use $lookup** instead of multiple queries when possible
4. **Batch Operations** for bulk inserts/updates
5. **Use Cursors** for large result sets
6. **Monitor Performance** using explain()
7. **Use Transactions** for multi-document operations that need to be atomic
8. **Set Write Concerns** appropriately for your use case
9. **Use TTL Indexes** for expiring data
10. **Regularly Compact** collections with high churn
