# JavaScript Interview Questions

Common JavaScript interview questions with answers.

## 🔹 What is the difference between `let`, `const`, and `var`?

**Answer:**
- `var`: Function-scoped, hoisted, can be redeclared
- `let`: Block-scoped, not hoisted, cannot be redeclared
- `const`: Block-scoped, not hoisted, cannot be reassigned

```js
var x = 1;   // Function scope
let y = 2;   // Block scope
const z = 3; // Block scope, immutable binding
```

## 🔹 What is a closure?

**Answer:** A closure is a function that has access to variables from its outer scope, even after the outer function has returned.

```js
function outer() {
  const message = "Hello";
  return function inner() {
    console.log(message); // Closure over 'message'
  };
}
```

## 🔹 What is the event loop?

**Answer:** The event loop handles asynchronous operations in JavaScript. It continuously checks the call stack and task queue, executing tasks when the stack is empty.

## 🔹 What is the difference between `==` and `===`?

**Answer:**
- `==`: Loose equality (type coercion)
- `===`: Strict equality (no type coercion)

```js
5 == "5"   // true
5 === "5"  // false
```

## 🔹 What is hoisting?

**Answer:** Hoisting is JavaScript's behavior of moving declarations to the top of their scope before code execution.

```js
console.log(x); // undefined (not error)
var x = 5;

// Equivalent to:
var x;
console.log(x);
x = 5;
```

## 🔹 What is the difference between `null` and `undefined`?

**Answer:**
- `undefined`: Variable declared but not assigned
- `null`: Intentional absence of value

```js
let x;           // undefined
let y = null;    // null
```

## 🔹 What are arrow functions?

**Answer:** Arrow functions are a shorter syntax for functions. They don't have their own `this`, `arguments`, or `super`.

```js
const add = (a, b) => a + b;
```

## 🔹 What is `this` keyword?

**Answer:** `this` refers to the object that is executing the current function. Its value depends on how the function is called.

```js
const obj = {
  name: "John",
  greet() {
    console.log(this.name); // "John"
  }
};
```

## 🔹 What is a Promise?

**Answer:** A Promise represents the eventual completion or failure of an asynchronous operation.

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Done"), 1000);
});
```

## 🔹 What is async/await?

**Answer:** Async/await is syntactic sugar over Promises, making asynchronous code look synchronous.

```js
async function fetchData() {
  const data = await fetch(url);
  return data.json();
}
```

## 🔗 See Also

- [Backend Questions](./backend-questions.md)
- [Express Questions](./express-questions.md)
