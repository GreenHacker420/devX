# JavaScript Object Methods

Built-in methods for working with objects in JavaScript.

## 🔹 Object.keys()

Get an array of object's own property names.

```js
const user = { name: "Alice", age: 25, city: "NYC" };
const keys = Object.keys(user);
console.log(keys); // ["name", "age", "city"]
```

## 🔹 Object.values()

Get an array of object's own property values.

```js
const user = { name: "Alice", age: 25, city: "NYC" };
const values = Object.values(user);
console.log(values); // ["Alice", 25, "NYC"]
```

## 🔹 Object.entries()

Get an array of [key, value] pairs.

```js
const user = { name: "Alice", age: 25 };
const entries = Object.entries(user);
console.log(entries); // [["name", "Alice"], ["age", 25]]

// Useful for iteration
Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});
```

## 🔹 Object.fromEntries()

Create object from [key, value] pairs.

```js
const entries = [["name", "Alice"], ["age", 25]];
const user = Object.fromEntries(entries);
console.log(user); // { name: "Alice", age: 25 }

// Convert Map to object
const map = new Map([["a", 1], ["b", 2]]);
const obj = Object.fromEntries(map);
console.log(obj); // { a: 1, b: 2 }
```

## 🔹 Object.assign()

Copy properties from source objects to target.

```js
const target = { a: 1 };
const source = { b: 2, c: 3 };
Object.assign(target, source);
console.log(target); // { a: 1, b: 2, c: 3 }

// Clone object (shallow)
const original = { name: "Alice", age: 25 };
const clone = Object.assign({}, original);

// Merge multiple objects
const obj1 = { a: 1 };
const obj2 = { b: 2 };
const obj3 = { c: 3 };
const merged = Object.assign({}, obj1, obj2, obj3);
console.log(merged); // { a: 1, b: 2, c: 3 }
```

## 🔹 Object.create()

Create object with specified prototype.

```js
const personProto = {
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  }
};

const alice = Object.create(personProto);
alice.name = "Alice";
alice.greet(); // "Hello, I'm Alice"
```

## 🔹 Object.freeze()

Prevent modifications to object.

```js
const user = { name: "Alice", age: 25 };
Object.freeze(user);

user.age = 30;        // Ignored (strict mode: error)
user.city = "NYC";    // Ignored
delete user.name;     // Ignored

console.log(user); // { name: "Alice", age: 25 }

// Check if frozen
console.log(Object.isFrozen(user)); // true
```

## 🔹 Object.seal()

Prevent adding/removing properties (can still modify existing).

```js
const user = { name: "Alice", age: 25 };
Object.seal(user);

user.age = 30;        // ✅ Works
user.city = "NYC";    // ❌ Ignored
delete user.name;     // ❌ Ignored

console.log(user); // { name: "Alice", age: 30 }

// Check if sealed
console.log(Object.isSealed(user)); // true
```

## 🔹 Object.preventExtensions()

Prevent adding new properties (can modify/delete existing).

```js
const user = { name: "Alice", age: 25 };
Object.preventExtensions(user);

user.age = 30;        // ✅ Works
user.city = "NYC";    // ❌ Ignored
delete user.name;     // ✅ Works

console.log(user); // { age: 30 }

// Check if extensible
console.log(Object.isExtensible(user)); // false
```

## 🔹 Object.getOwnPropertyNames()

Get all own property names (including non-enumerable).

```js
const obj = { a: 1, b: 2 };
Object.defineProperty(obj, "c", {
  value: 3,
  enumerable: false
});

console.log(Object.keys(obj));              // ["a", "b"]
console.log(Object.getOwnPropertyNames(obj)); // ["a", "b", "c"]
```

## 🔹 Object.getOwnPropertyDescriptors()

Get property descriptors for all own properties.

```js
const obj = { name: "Alice", age: 25 };
const descriptors = Object.getOwnPropertyDescriptors(obj);
console.log(descriptors);
// {
//   name: { value: "Alice", writable: true, enumerable: true, configurable: true },
//   age: { value: 25, writable: true, enumerable: true, configurable: true }
// }
```

## 🔹 Object.defineProperty()

Define or modify a property with specific attributes.

```js
const obj = {};

Object.defineProperty(obj, "name", {
  value: "Alice",
  writable: false,    // Can't change value
  enumerable: true,   // Shows in for...in
  configurable: false // Can't delete or reconfigure
});

obj.name = "Bob"; // Ignored (strict mode: error)
console.log(obj.name); // "Alice"

// Getter/Setter
Object.defineProperty(obj, "age", {
  get() {
    return this._age;
  },
  set(value) {
    if (value < 0) throw new Error("Age must be positive");
    this._age = value;
  }
});

obj.age = 25;
console.log(obj.age); // 25
```

## 🔹 Object.hasOwn() (ES2022)

Check if object has own property (better than hasOwnProperty).

```js
const obj = { name: "Alice" };

console.log(Object.hasOwn(obj, "name"));     // true
console.log(Object.hasOwn(obj, "toString")); // false

// Safer than hasOwnProperty
const obj2 = Object.create(null);
// obj2.hasOwnProperty("name"); // Error!
console.log(Object.hasOwn(obj2, "name")); // false - Works!
```

## 🔹 Object.is()

Compare two values (better than === for special cases).

```js
console.log(Object.is(25, 25));        // true
console.log(Object.is("hello", "hello")); // true

// Special cases
console.log(NaN === NaN);              // false
console.log(Object.is(NaN, NaN));      // true

console.log(-0 === +0);                // true
console.log(Object.is(-0, +0));        // false
```

## 🔹 Object.getPrototypeOf() / setPrototypeOf()

Get or set object's prototype.

```js
const proto = { greet() { console.log("Hello"); } };
const obj = Object.create(proto);

console.log(Object.getPrototypeOf(obj) === proto); // true

// Set prototype (not recommended, use Object.create instead)
const newProto = { sayBye() { console.log("Bye"); } };
Object.setPrototypeOf(obj, newProto);
```

## 💡 Tips

- Use **Object.keys()** for iteration over own properties
- Use **Object.freeze()** for immutable objects
- Use **Object.assign()** or spread `{...obj}` for shallow cloning
- Use **Object.hasOwn()** instead of `hasOwnProperty()`
- **Object.is()** is more accurate than `===` for NaN and -0/+0

## 🧩 Example: Deep Clone

```js
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

const original = {
  name: "Alice",
  address: { city: "NYC", zip: 10001 },
  hobbies: ["reading", "coding"]
};

const clone = deepClone(original);
clone.address.city = "LA";
console.log(original.address.city); // "NYC" (not affected)
```

## 🧩 Example: Filter Object Properties

```js
function filterObject(obj, predicate) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => predicate(key, value))
  );
}

const user = { name: "Alice", age: 25, city: "NYC", country: "USA" };

// Keep only string values
const strings = filterObject(user, (key, value) => typeof value === "string");
console.log(strings); // { name: "Alice", city: "NYC", country: "USA" }

// Keep specific keys
const subset = filterObject(user, (key) => ["name", "age"].includes(key));
console.log(subset); // { name: "Alice", age: 25 }
```

## ⚠️ Common Mistakes

❌ **Modifying frozen object**
```js
const obj = Object.freeze({ name: "Alice" });
obj.name = "Bob"; // Silently fails (error in strict mode)
```

✅ **Check if frozen first:**
```js
if (!Object.isFrozen(obj)) {
  obj.name = "Bob";
}
```

❌ **Shallow copy with nested objects**
```js
const original = { user: { name: "Alice" } };
const copy = Object.assign({}, original);
copy.user.name = "Bob";
console.log(original.user.name); // "Bob" - Original affected!
```

✅ **Use deep clone:**
```js
const copy = JSON.parse(JSON.stringify(original));
// Or use a deep clone function
```

## 🔗 See Also

- [Objects](./objects.md)
- [Array Methods](./array-methods.md)
- [Classes](./classes.md)
