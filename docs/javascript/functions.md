# JavaScript Functions

Functions are reusable blocks of code that perform specific tasks.

## 🔹 Function Declaration

```js
function greet(name) {
  return `Hello, ${name}!`;
}

console.log(greet("Alice")); // "Hello, Alice!"
```

## 🔹 Function Expression

```js
const greet = function(name) {
  return `Hello, ${name}!`;
};

console.log(greet("Bob")); // "Hello, Bob!"
```

## 🔹 Arrow Functions

```js
// Single parameter, single expression
const square = x => x * x;

// Multiple parameters
const add = (a, b) => a + b;

// Multiple statements (need curly braces)
const greet = name => {
  const message = `Hello, ${name}!`;
  return message;
};

// No parameters
const random = () => Math.random();
```

## 🔹 Parameters & Arguments

```js
// Default parameters
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}
greet();        // "Hello, Guest!"
greet("Alice"); // "Hello, Alice!"

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
sum(1, 2, 3, 4); // 10
```

## 🔹 Return Values

```js
function add(a, b) {
  return a + b; // Explicit return
}

// Without return, function returns undefined
function log(msg) {
  console.log(msg);
  // No return statement
}

const result = log("Hi"); // result is undefined
```

## 🔹 Scope

```js
const global = "I'm global";

function outer() {
  const outerVar = "I'm in outer";
  
  function inner() {
    const innerVar = "I'm in inner";
    console.log(global);    // ✅ Can access
    console.log(outerVar);  // ✅ Can access
    console.log(innerVar);  // ✅ Can access
  }
  
  inner();
  // console.log(innerVar); // ❌ Error: not defined
}

outer();
```

## 🔹 Higher-Order Functions

Functions that take other functions as arguments or return functions.

```js
// Function as argument
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, console.log); // 0, 1, 2

// Function returning function
function multiplier(factor) {
  return number => number * factor;
}

const double = multiplier(2);
const triple = multiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

## 🔹 Callback Functions

```js
function fetchData(callback) {
  setTimeout(() => {
    const data = { id: 1, name: "John" };
    callback(data);
  }, 1000);
}

fetchData(data => {
  console.log("Data received:", data);
});
```

## 🔹 IIFE (Immediately Invoked Function Expression)

```js
(function() {
  console.log("I run immediately!");
})();

// With arrow function
(() => {
  console.log("Arrow IIFE!");
})();
```

## 💡 Tips

- **Function declarations** are hoisted (can be called before definition)
- **Function expressions** are NOT hoisted
- **Arrow functions** don't have their own `this`
- Use **arrow functions** for short, simple operations
- Use **regular functions** when you need `this` context

## 🧩 Example

```js
// Calculator with multiple functions
const calculator = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => b !== 0 ? a / b : "Cannot divide by zero",
  
  calculate(operation, a, b) {
    return this[operation](a, b);
  }
};

console.log(calculator.calculate("add", 10, 5));      // 15
console.log(calculator.calculate("multiply", 10, 5)); // 50
```

## ⚠️ Common Mistakes

❌ **Forgetting to return**
```js
const add = (a, b) => {
  a + b; // Missing return!
};
console.log(add(2, 3)); // undefined
```

✅ **Correct:**
```js
const add = (a, b) => a + b; // Implicit return
// OR
const add = (a, b) => {
  return a + b; // Explicit return
};
```

❌ **Using arrow function as method**
```js
const obj = {
  name: "John",
  greet: () => {
    console.log(this.name); // undefined! Arrow functions don't bind 'this'
  }
};
```

✅ **Use regular function:**
```js
const obj = {
  name: "John",
  greet() {
    console.log(this.name); // "John"
  }
};
```

## 🔗 See Also

- [Closures](./closures.md)
- [Async/Await](./async-await.md)
- [Promises](./promises.md)
