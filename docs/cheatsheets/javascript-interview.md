# JavaScript Interview Cheatsheet

A quick reference for common JavaScript interview topics, concepts, and code snippets.

---

## 1. Data Types
- Primitive: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`
- Reference: `object`, `array`, `function`

## 2. Variable Declarations
- `var`: function-scoped, hoisted
- `let`: block-scoped, not hoisted
- `const`: block-scoped, cannot be reassigned

## 3. Functions
```js
function foo() { /* ... */ }
const bar = function() { /* ... */ }
const baz = () => { /* ... */ }
```

## 4. Closures
A closure is a function that remembers its outer variables even after the outer function has executed.
```js
function makeCounter() {
  let count = 0;
  return function() { count++; return count; };
}
```

## 5. Hoisting
- Variable and function declarations are moved to the top of their scope.
- Only declarations are hoisted, not initializations.

## 6. Prototypes & Inheritance
```js
function Person(name) { this.name = name; }
Person.prototype.sayHi = function() { return 'Hi ' + this.name; };
```

## 7. `this` Keyword
- Depends on how a function is called (global, object, class, arrow function, etc.)

## 8. Array Methods
- `map`, `filter`, `reduce`, `forEach`, `find`, `some`, `every`, `includes`, `push`, `pop`, `shift`, `unshift`, `slice`, `splice`

## 9. Promises & Async/Await
```js
const p = new Promise((resolve, reject) => { /* ... */ });
p.then().catch();

async function foo() {
  await someAsyncFunc();
}
```

## 10. Event Loop
- Call Stack, Web APIs, Callback Queue, Microtask Queue
- `setTimeout`, `Promise`, `async/await`

## 11. ES6+ Features
- Arrow functions, template literals, destructuring, spread/rest, classes, modules, `let`/`const`, default parameters

## 12. Common Interview Questions
- Explain closures
- Difference between `==` and `===`
- What is hoisting?
- How does prototypal inheritance work?
- What is event delegation?
- Explain the event loop
- What are promises?
- Difference between `null` and `undefined`
- How does `this` work?
- What is a pure function?

---

**Tip:** Practice coding problems and explaining concepts out loud!
