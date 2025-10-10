# JavaScript Objects

Objects are collections of key-value pairs. They're the foundation of JavaScript.

## 🔹 Creation

```js
// Object literal (most common)
const person = {
  name: "John",
  age: 30,
  city: "New York"
};

// Constructor
const obj = new Object();
obj.name = "John";

// Object.create()
const proto = { greet: () => console.log("Hello") };
const obj2 = Object.create(proto);
```

## 🔹 Accessing Properties

```js
const user = { name: "Alice", age: 25 };

// Dot notation
console.log(user.name); // "Alice"

// Bracket notation
console.log(user["age"]); // 25

// Dynamic keys
const key = "name";
console.log(user[key]); // "Alice"
```

## 🔹 Adding/Modifying Properties

```js
const car = { brand: "Toyota" };

// Add new property
car.model = "Camry";
car["year"] = 2023;

// Modify existing
car.brand = "Honda";

// Delete property
delete car.year;
```

## 🔹 Methods

```js
const calculator = {
  add: function(a, b) {
    return a + b;
  },
  // Shorthand syntax
  subtract(a, b) {
    return a - b;
  },
  // Arrow function (no 'this' binding)
  multiply: (a, b) => a * b
};

console.log(calculator.add(5, 3)); // 8
```

## 🔹 The `this` Keyword

```js
const person = {
  name: "John",
  greet: function() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

person.greet(); // "Hello, I'm John"
```

## 🔹 Checking Properties

```js
const obj = { name: "Alice", age: 25 };

// Check if property exists
"name" in obj;              // true
obj.hasOwnProperty("age");  // true

// Get all keys
Object.keys(obj);           // ["name", "age"]

// Get all values
Object.values(obj);         // ["Alice", 25]

// Get key-value pairs
Object.entries(obj);        // [["name", "Alice"], ["age", 25]]
```

## 🔹 Iteration

```js
const user = { name: "Bob", age: 30, city: "NYC" };

// For...in loop
for (const key in user) {
  console.log(`${key}: ${user[key]}`);
}

// Object.keys()
Object.keys(user).forEach(key => {
  console.log(`${key}: ${user[key]}`);
});

// Object.entries()
Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});
```

## 🔹 Copying Objects

```js
const original = { name: "Alice", age: 25 };

// Shallow copy
const copy1 = { ...original };
const copy2 = Object.assign({}, original);

// Deep copy (for nested objects)
const deep = JSON.parse(JSON.stringify(original));
```

## 💡 Tips

- Objects are **reference types** (copied by reference, not value)
- Property names are always **strings** (or Symbols)
- Use **dot notation** when possible, **bracket notation** for dynamic keys
- Methods can access object properties via `this`

## 🧩 Example

```js
const product = {
  id: 101,
  name: "Laptop",
  price: 999,
  inStock: true,
  
  applyDiscount(percent) {
    this.price = this.price * (1 - percent / 100);
  },
  
  getInfo() {
    return `${this.name} - $${this.price}`;
  }
};

product.applyDiscount(10);
console.log(product.getInfo()); // "Laptop - $899.1"
```

## ⚠️ Common Mistakes

❌ **Using arrow functions for methods** (loses `this` context)
```js
const obj = {
  name: "John",
  greet: () => {
    console.log(this.name); // undefined!
  }
};
```

✅ **Use regular functions:**
```js
const obj = {
  name: "John",
  greet() {
    console.log(this.name); // "John"
  }
};
```

❌ **Comparing objects directly**
```js
const a = { x: 1 };
const b = { x: 1 };
console.log(a === b); // false (different references)
```

✅ **Compare properties:**
```js
JSON.stringify(a) === JSON.stringify(b); // true
```

## 🔗 See Also

- [Object Methods](./object-methods.md)
- [Classes](./classes.md)
- [Prototypes](./prototypes.md)
