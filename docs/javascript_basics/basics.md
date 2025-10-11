# JavaScript Basics

JavaScript (JS) is a high-level, dynamic programming language primarily used to add interactivity to web pages. It runs in the browser and on servers (via Node.js).

## Why JavaScript?
- Runs everywhere: browsers, servers, desktops, mobile, IoT
- Massive ecosystem (libraries/frameworks)
- Great for building interactive UIs and APIs

## Where It Runs
- Browser: Chrome, Firefox, Safari, Edge
- Server: Node.js (JavaScript outside the browser)

## Hello World
```html
<!DOCTYPE html>
<html>
  <body>
    <h1>Hello</h1>
    <script>
      console.log('Hello, JavaScript!');
    </script>
  </body>
</html>
```

## Variables
Use `let` and `const` (prefer `const` by default).
```js
const pi = 3.14;     // constant
let count = 0;       // reassignable
```
Avoid `var` (function-scoped and hoist-prone).

## Data Types
- Primitive: `string`, `number`, `boolean`, `null`, `undefined`, `bigint`, `symbol`
- Reference: `object` (arrays, functions, dates, etc.)
```js
const name = 'Ada';         // string
const age = 28;             // number
const active = true;        // boolean
let unknown;                // undefined
const nothing = null;       // null
const ids = [1, 2, 3];      // array (object)
const user = { name: 'Ada', age: 28 }; // object
```

## Operators
- Arithmetic: `+ - * / % **`
- Comparison: `=== !== > < >= <=`
- Logical: `&& || !`
- Nullish coalescing: `??` (use fallback only for `null`/`undefined`)
- Optional chaining: `?.`
```js
const title = user.profile?.title ?? 'Guest';
```

## Control Flow
```js
if (age >= 18) {
  console.log('Adult');
} else {
  console.log('Minor');
}

for (let i = 0; i < 3; i++) {
  console.log(i);
}

const nums = [1, 2, 3];
for (const n of nums) console.log(n);
```

## Functions
```js
function add(a, b) { return a + b; }
const mul = (a, b) => a * b;        // arrow function
```

## Scope & Hoisting
- `let`/`const` are block-scoped
- Functions and `var` are hoisted (avoid `var`)

## Arrays & Objects
```js
const arr = [1, 2, 3];
arr.push(4);
const doubled = arr.map(x => x * 2);

const obj = { a: 1 };
obj.b = 2;
const { a, b } = obj;      // destructuring
```

## DOM Basics (Browser)
```html
<button id="btn">Click</button>
<script>
  const btn = document.getElementById('btn');
  btn.addEventListener('click', () => alert('Clicked!'));
</script>
```

## Asynchronous JS
- Promises, `async/await`, timers, fetch
```js
function wait(ms) {
  return new Promise(res => setTimeout(res, ms));
}

async function main() {
  await wait(500);
  const res = await fetch('https://api.example.com/data');
  const data = await res.json();
  console.log(data);
}
main();
```

## Modules
- ES Modules (modern): `import`/`export`
```js
// math.js
export const add = (a, b) => a + b;

// app.js
import { add } from './math.js';
console.log(add(2, 3));
```

## Best Practices
- Prefer `const`, then `let`
- Use strict equality `===`
- Keep functions small and pure when possible
- Handle errors with `try/catch` for async code
- Lint/format with ESLint + Prettier

## Next Steps
- Explore: arrays, objects, functions, classes, async/await
- Practice with the console and small browser projects
- Read `docs/javascript/` for deeper topics
