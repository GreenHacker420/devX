# MongoDB Schema Design

## Data Modeling Concepts

### 1. Document Structure

#### Embedded Documents
```javascript
// Users with embedded addresses
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  email: "john@example.com",
  addresses: [
    {
      type: "home",
      street: "123 Main St",
      city: "Springfield",
      zip: "12345",
      isPrimary: true
    },
    {
      type: "work",
      street: "456 Work Ave",
      city: "Springfield",
      zip: "12345"
    }
  ]
}
```

#### Referenced Documents
```javascript
// Users collection
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "John Doe",
  email: "john@example.com"
}

// Addresses collection
{
  _id: ObjectId("5a934e000102030405000000"),
  userId: ObjectId("507f1f77bcf86cd799439011"),
  type: "home",
  street: "123 Main St",
  city: "Springfield",
  zip: "12345",
  isPrimary: true
}
```

## Schema Design Patterns

### 1. Embedding (Denormalization)
**When to use:**
- One-to-few relationships
- Data that's always accessed together
- Data that changes together

**Example: Blog Post with Comments**
```javascript
{
  _id: ObjectId("5a934e000102030405000001"),
  title: "MongoDB Schema Design",
  content: "...",
  author: "John Doe",
  publishedAt: ISODate("2023-01-15T10:00:00Z"),
  comments: [
    {
      _id: ObjectId("5a934e000102030405000002"),
      author: "Alice",
      text: "Great post!",
      createdAt: ISODate("2023-01-15T11:30:00Z")
    },
    {
      _id: ObjectId("5a934e000102030405000003"),
      author: "Bob",
      text: "Thanks for sharing!",
      createdAt: ISODate("2023-01-16T09:15:00Z")
    }
  ]
}
```

### 2. Referencing (Normalization)
**When to use:**
- One-to-many or many-to-many relationships
- Large documents that exceed 16MB
- Frequently updated data

**Example: Products and Categories**
```javascript
// Products collection
{
  _id: ObjectId("5a934e000102030405000100"),
  name: "Laptop",
  price: 999.99,
  categoryIds: [
    ObjectId("5a934e000102030405000200"), // Electronics
    ObjectId("5a934e000102030405000201")  // Computers
  ]
}

// Categories collection
{
  _id: ObjectId("5a934e000102030405000200"),
  name: "Electronics",
  description: "Electronic devices"
}

{
  _id: ObjectId("5a934e000102030405000201"),
  name: "Computers",
  description: "Computers and laptops"
}
```

### 3. Bucket Pattern
**When to use:**
- Time-series data
- IoT sensor data
- Logging

**Example: Sensor Data**
```javascript
{
  _id: "sensor-1-2023-01",
  sensorId: "sensor-1",
  type: "temperature",
  unit: "Celsius",
  measurements: [
    { timestamp: ISODate("2023-01-01T00:00:00Z"), value: 21.5 },
    { timestamp: ISODate("2023-01-01T00:05:00Z"), value: 21.7 },
    // ... more measurements for the month
  ],
  metadata: {
    location: "Room 101",
    min: 18.0,
    max: 25.0
  }
}
```

### 4. Attribute Pattern
**When to use:**
- Heterogeneous document attributes
- Sparse fields
- Polymorphic schemas

**Example: E-commerce Product Catalog**
```javascript
{
  _id: ObjectId("5a934e000102030405000300"),
  name: "Smartphone X",
  category: "electronics",
  attributes: [
    { name: "color", value: "black" },
    { name: "storage", value: "128GB" },
    { name: "ram", value: "8GB" }
  ]
}

{
  _id: ObjectId("5a934e000102030405000301"),
  name: "T-Shirt",
  category: "clothing",
  attributes: [
    { name: "color", value: "blue" },
    { name: "size", value: "L" },
    { name: "material", value: "cotton" }
  ]
}
```

## Schema Validation

### JSON Schema Validation
```javascript
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "email", "status"],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        email: {
          bsonType: "string",
          pattern: "^.+@.+\\.",
          description: "must be a valid email and is required"
        },
        status: {
          enum: ["active", "inactive", "pending"],
          description: "must be a valid status and is required"
        },
        age: {
          bsonType: ["int", "null"],
          minimum: 0,
          maximum: 120,
          description: "must be an integer between 0 and 120"
        }
      }
    }
  }
});
```

## Data Types

### Common Data Types
- String (`string`)
- Number (`int32`, `int64`, `double`)
- Boolean (`bool`)
- Date (`date`)
- Array (`array`)
- Object (`object`)
- ObjectId (`objectId`)
- Binary Data (`binData`)
- Null (`null`)

### Special Types
- Decimal128 (for precise decimal arithmetic)
- Timestamp (for internal MongoDB use)
- Regular Expression (`regex`)
- JavaScript (`javascript`)
- MinKey/MaxKey (for comparison operations)

## Indexing Strategies

### Single Field Index
```javascript
db.users.createIndex({ email: 1 });
```

### Compound Index
```javascript
db.orders.createIndex({ customerId: 1, orderDate: -1 });
```

### Multikey Index (for arrays)
```javascript
db.products.createIndex({ tags: 1 });
```

### Text Index
```javascript
db.articles.createIndex({ title: "text", content: "text" });
```

### Wildcard Index
```javascript
db.users.createIndex({ "metadata.$**": 1 });
```

## Sharding Strategies

### Hashed Sharding
```javascript
sh.shardCollection("mydb.users", { _id: "hashed" });
```

### Ranged Sharding
```javascript
sh.shardCollection("mydb.orders", { customerId: 1 });
```

### Zoned Sharding
```javascript
sh.addShardTag("shard0000", "US");
sh.addShardTag("shard0001", "EU");
sh.addTagRange("mydb.users", { country: "US" }, { country: "US" }, "US");
sh.addTagRange("mydb.users", { country: "UK" }, { country: "FR" }, "EU");
```

## Data Lifecycle Management

### TTL Indexes
```javascript
// Documents will be automatically deleted after 30 days
db.logs.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 });
```

### Capped Collections
```javascript
// Create a capped collection of 1MB
db.createCollection("recent_activities", { capped: true, size: 1048576 });
```

## Schema Evolution

### Adding Fields
```javascript
db.users.updateMany(
  { newField: { $exists: false } },
  { $set: { newField: "default value" } }
);
```

### Migrating Data
```javascript
// Add new structure
db.products.updateMany(
  {},
  { $set: { "metadata.tags": [] } }
);

// Migrate old tags to new structure
db.products.updateMany(
  { tags: { $exists: true } },
  [
    { $set: { "metadata.tags": "$tags" } },
    { $unset: "tags" }
  ]
);
```
