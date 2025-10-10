# JavaScript Cheatsheet

Quick reference for JavaScript essentials.

## 📦 Variables

```js
let x = 1;        // Mutable, block-scoped
const y = 2;      // Immutable, block-scoped
var z = 3;        // Function-scoped (avoid)
```

## 🔢 Data Types

```js
const str = "text";
const num = 42;
const bool = true;
const arr = [1, 2, 3];
const obj = { key: "value" };
const nul = null;
const undef = undefined;
```

## 🔄 Operators

```js
// Arithmetic
+ - * / % **

// Comparison
== === != !== < > <= >=

// Logical
&& || !

// Ternary
condition ? true : false

// Nullish coalescing
value ?? defaultValue

// Optional chaining
obj?.property
```

## 📋 Arrays

```js
arr.push(item)           // Add to end
arr.pop()                // Remove from end
arr.shift()              // Remove from start
arr.unshift(item)        // Add to start
arr.map(fn)              // Transform
arr.filter(fn)           // Filter
arr.reduce(fn, init)     // Reduce
arr.find(fn)             // Find first
arr.includes(item)       // Check exists
arr.slice(start, end)    // Extract
arr.splice(i, n, items)  // Modify
```

## 🗂️ Objects

```js
Object.keys(obj)         // Get keys
Object.values(obj)       // Get values
Object.entries(obj)      // Get [key, value] pairs
Object.assign(t, s)      // Merge objects
{ ...obj }               // Spread operator
```

## 🔁 Loops

```js
for (let i = 0; i < n; i++) {}
for (const item of array) {}
for (const key in object) {}
array.forEach(item => {})
while (condition) {}
```

## ⚡ Functions

```js
// Function declaration
function name(params) { return value; }

// Arrow function
const name = (params) => value;
const name = (params) => { return value; };

// Default parameters
function greet(name = "Guest") {}
```

## 🎯 Destructuring

```js
// Array
const [a, b] = [1, 2];

// Object
const { name, age } = user;

// Rename
const { name: userName } = user;

// Default values
const { role = "user" } = user;
```

## 📤 Spread/Rest

```js
// Spread
const arr2 = [...arr1];
const obj2 = { ...obj1 };

// Rest
function sum(...numbers) {}
const [first, ...rest] = arr;
```

## 🔄 Async

```js
// Promise
promise.then(result => {}).catch(err => {});

// Async/await
async function fn() {
  const result = await promise;
}

// Promise.all
await Promise.all([p1, p2, p3]);
```

## 🎨 Template Literals

```js
const str = `Hello ${name}!`;
const multi = `
  Line 1
  Line 2
`;
```

## 🔍 Common Methods

```js
// String
str.includes(substr)
str.startsWith(prefix)
str.endsWith(suffix)
str.split(delimiter)
str.trim()
str.replace(old, new)

// Number
Number(str)
parseInt(str)
parseFloat(str)
num.toFixed(2)

// JSON
JSON.stringify(obj)
JSON.parse(str)
```

## 🔗 See Also

- [Array Methods](../javascript/array-methods.md)
- [Object Methods](../javascript/object-methods.md)
