# MongoDB Aggregation Framework

## Aggregation Pipeline Stages

### $match
Filters documents to pass only matching documents to the next stage.

```javascript
db.orders.aggregate([
  { $match: { status: "completed", total: { $gt: 100 } } }
]);
```

### $group
Groups documents by specified identifier expressions.

```javascript
db.orders.aggregate([
  { 
    $group: {
      _id: "$customerId",
      totalSpent: { $sum: "$total" },
      averageOrder: { $avg: "$total" },
      orderCount: { $sum: 1 }
    }
  }
]);
```

### $sort
Sorts all input documents and returns them in sorted order.

```javascript
db.products.aggregate([
  { $sort: { price: -1, name: 1 } }
]);
```

### $project
Reshapes each document by including, excluding, or adding new fields.

```javascript
db.users.aggregate([
  {
    $project: {
      name: 1,
      email: 1,
      yearJoined: { $year: "$joinDate" },
      _id: 0
    }
  }
]);
```

### $lookup
Performs a left outer join to another collection.

```javascript
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" }
]);
```

### $unwind
Deconstructs an array field to output one document per array element.

```javascript
db.orders.aggregate([
  { $unwind: "$items" },
  { $group: { _id: "$items.productId", total: { $sum: "$items.quantity" } } }
]);
```

### $facet
Processes multiple aggregation pipelines within a single stage.

```javascript
db.products.aggregate([
  {
    $facet: {
      categories: [
        { $unwind: "$categories" },
        { $group: { _id: "$categories", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ],
      priceStats: [
        { $match: { price: { $exists: true } } },
        {
          $group: {
            _id: null,
            average: { $avg: "$price" },
            min: { $min: "$price" },
            max: { $max: "$price" }
          }
        }
      ]
    }
  }
]);
```

## Aggregation Operators

### Arithmetic Operators
- `$add`: Adds numbers together
- `$subtract`: Subtracts two numbers
- `$multiply`: Multiplies numbers together
- `$divide`: Divides one number by another
- `$mod`: Returns the remainder of a division

```javascript
db.orders.aggregate([
  {
    $project: {
      subtotal: 1,
      tax: 1,
      total: {
        $add: ["$subtotal", "$tax"]
      },
      discount: {
        $multiply: ["$subtotal", 0.1] // 10% discount
      },
      finalTotal: {
        $subtract: [
          { $add: ["$subtotal", "$tax"] },
          { $multiply: ["$subtotal", 0.1] }
        ]
      }
    }
  }
]);
```

### String Operators
- `$concat`: Concatenates strings
- `$substr`: Returns a substring
- `$toLower` / `$toUpper`: Converts to lowercase/uppercase
- `$trim`: Removes whitespace

```javascript
db.users.aggregate([
  {
    $project: {
      fullName: {
        $concat: ["$firstName", " ", "$lastName"]
      },
      emailLower: { $toLower: "$email" },
      username: { $substr: ["$email", 0, { $indexOfBytes: ["$email", "@"] }] }
    }
  }
]);
```

### Date Operators
- `$year` / `$month` / `$dayOfMonth`: Extracts date parts
- `$dateToString`: Formats a date as a string
- `$dateFromString`: Converts a date string to a date object

```javascript
db.orders.aggregate([
  {
    $project: {
      orderDate: 1,
      year: { $year: "$orderDate" },
      month: { $month: "$orderDate" },
      day: { $dayOfMonth: "$orderDate" },
      formattedDate: {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$orderDate"
        }
      }
    }
  }
]);
```

### Conditional Operators
- `$cond`: Ternary operator
- `$ifNull`: Returns a value if null, otherwise returns the field value
- `$switch`: Case/when/default logic

```javascript
db.products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      priceCategory: {
        $switch: {
          branches: [
            { case: { $lt: ["$price", 50] }, then: "Budget" },
            { case: { $lt: ["$price", 200] }, then: "Standard" },
            { case: { $lt: ["$price", 1000] }, then: "Premium" }
          ],
          default: "Luxury"
        }
      },
      discountPrice: {
        $cond: {
          if: { $gt: ["$quantity", 10] },
          then: { $multiply: ["$price", 0.9] }, // 10% discount
          else: "$price"
        }
      },
      description: { $ifNull: ["$description", "No description available"] }
    }
  }
]);
```

## Performance Optimization

### Index Usage
```javascript
// Create an index for the aggregation
// db.orders.createIndex({ status: 1, orderDate: -1 });

db.orders.aggregate([
  { $match: { status: "completed", orderDate: { $gte: new Date("2023-01-01") } } },
  { $sort: { orderDate: -1 } },
  { $limit: 100 }
]);
```

### $lookup Optimization
```javascript
// Instead of this (inefficient with large collections):
db.orders.aggregate([
  { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "product" } },
  { $unwind: "$product" },
  { $match: { "product.category": "Electronics" } }
]);

// Do this (more efficient):
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      let: { productId: "$productId" },
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$productId"] }, category: "Electronics" } }
      ],
      as: "product"
    }
  },
  { $unwind: "$product" }
]);
```

### $redact
Controls document traversal during processing.

```javascript
db.employees.aggregate([
  {
    $redact: {
      $cond: {
        if: { $eq: ["$department", "HR"] },
        then: "$$DESCEND",
        else: "$$PRUNE"
      }
    }
  }
]);
```

## Aggregation with $graphLookup

### Recursive Lookup
```javascript
db.employees.aggregate([
  {
    $match: { name: "John Doe" }
  },
  {
    $graphLookup: {
      from: "employees",
      startWith: "$reportsTo",
      connectFromField: "reportsTo",
      connectToField: "_id",
      as: "managementChain",
      maxDepth: 10,
      depthField: "level"
    }
  }
]);
```

## Aggregation with $merge

### Output to a Collection
```javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m", date: "$orderDate" } },
      totalSales: { $sum: "$total" },
      orderCount: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } },
  {
    $merge: {
      into: "monthlySales",
      on: "_id",
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
]);
```

## Aggregation with $setWindowFields (MongoDB 5.0+)

### Moving Averages and Rankings
```javascript
db.sales.aggregate([
  { $match: { date: { $gte: new Date("2023-01-01") } } },
  { $sort: { productId: 1, date: 1 } },
  {
    $setWindowFields: {
      partitionBy: "$productId",
      sortBy: { date: 1 },
      output: {
        movingAvg: {
          $avg: "$amount",
          window: {
            documents: ["unbounded", "current"]
          }
        },
        salesRank: {
          $denseRank: {}
        }
      }
    }
  }
]);
```

## Aggregation with $densify

### Filling Gaps in Time Series Data
```javascript
db.sensorReadings.aggregate([
  { $match: { sensorId: "A1", timestamp: { $gte: new Date("2023-01-01") } } },
  {
    $densify: {
      field: "timestamp",
      range: {
        step: 1,
        unit: "hour",
        bounds: [new Date("2023-01-01"), new Date("2023-01-02")]
      }
    }
  },
  {
    $fill: {
      output: {
        value: { method: "linear" },
        status: { value: "interpolated" }
      }
    }
  }
]);
```
