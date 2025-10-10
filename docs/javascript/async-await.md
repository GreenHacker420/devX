# JavaScript Async/Await

Async/await is syntactic sugar over Promises, making asynchronous code look and behave like synchronous code.

## 🔹 Basic Syntax

```js
async function fetchData() {
  const response = await fetch("https://api.example.com/data");
  const data = await response.json();
  return data;
}
```

## 🔹 Async Functions

An `async` function **always returns a Promise**.

```js
async function greet() {
  return "Hello!";
}

// Equivalent to:
function greet() {
  return Promise.resolve("Hello!");
}

// Usage
greet().then(msg => console.log(msg)); // "Hello!"
```

## 🔹 Await Keyword

`await` pauses execution until the Promise resolves.

```js
async function getUser() {
  const response = await fetch("https://api.example.com/user");
  const user = await response.json();
  console.log(user);
}

// Can only use 'await' inside 'async' functions
```

## 🔹 Error Handling

Use `try/catch` blocks to handle errors.

```js
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw if needed
  }
}
```

## 🔹 Multiple Async Operations

### Sequential (one after another)

```js
async function sequential() {
  const user = await fetchUser();      // Wait for this
  const posts = await fetchPosts();    // Then wait for this
  const comments = await fetchComments(); // Then wait for this
  
  return { user, posts, comments };
}
```

### Parallel (all at once)

```js
async function parallel() {
  // Start all requests simultaneously
  const [user, posts, comments] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchComments()
  ]);
  
  return { user, posts, comments };
}
```

## 🔹 Async/Await vs Promises

**Promises:**
```js
function getData() {
  return fetch("https://api.example.com/user")
    .then(response => response.json())
    .then(user => {
      return fetch(`https://api.example.com/posts/${user.id}`);
    })
    .then(response => response.json())
    .then(posts => {
      console.log(posts);
    })
    .catch(error => {
      console.error(error);
    });
}
```

**Async/Await:**
```js
async function getData() {
  try {
    const userResponse = await fetch("https://api.example.com/user");
    const user = await userResponse.json();
    
    const postsResponse = await fetch(`https://api.example.com/posts/${user.id}`);
    const posts = await postsResponse.json();
    
    console.log(posts);
  } catch (error) {
    console.error(error);
  }
}
```

## 🔹 Top-Level Await

In ES2022+, you can use `await` at the top level in modules.

```js
// In a .mjs file or module
const response = await fetch("https://api.example.com/data");
const data = await response.json();
console.log(data);
```

## 🔹 Async Loops

```js
// Sequential processing
async function processItems(items) {
  for (const item of items) {
    await processItem(item); // Wait for each
  }
}

// Parallel processing
async function processItemsParallel(items) {
  await Promise.all(items.map(item => processItem(item)));
}

// With results
async function getResults(ids) {
  const results = [];
  for (const id of ids) {
    const result = await fetchData(id);
    results.push(result);
  }
  return results;
}

// Parallel version
async function getResultsParallel(ids) {
  return await Promise.all(ids.map(id => fetchData(id)));
}
```

## 💡 Tips

- `async` functions **always** return a Promise
- `await` only works inside `async` functions (or top-level in modules)
- Use `Promise.all()` for parallel operations
- Always wrap `await` in `try/catch` for error handling
- Avoid using `await` in loops unless you need sequential execution

## 🧩 Example: User Authentication

```js
async function login(email, password) {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error("Email and password are required");
    }
    
    // Call API
    const response = await fetch("https://api.example.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    
    // Check response
    if (!response.ok) {
      throw new Error("Invalid credentials");
    }
    
    // Parse response
    const data = await response.json();
    
    // Store token
    localStorage.setItem("token", data.token);
    
    return data.user;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
}

// Usage
login("user@example.com", "password123")
  .then(user => {
    console.log("Logged in:", user);
  })
  .catch(error => {
    console.error("Error:", error.message);
  });
```

## 🧩 Example: Retry Logic

```js
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error; // Last attempt
      console.log(`Retry ${i + 1}/${retries}...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## ⚠️ Common Mistakes

❌ **Forgetting async keyword**
```js
function getData() {
  const data = await fetch(url); // Error! await only in async functions
  return data;
}
```

✅ **Correct:**
```js
async function getData() {
  const data = await fetch(url);
  return data;
}
```

❌ **Sequential when parallel is better**
```js
async function slow() {
  const user = await fetchUser();     // 1 second
  const posts = await fetchPosts();   // 1 second
  const likes = await fetchLikes();   // 1 second
  // Total: 3 seconds
}
```

✅ **Use Promise.all():**
```js
async function fast() {
  const [user, posts, likes] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchLikes()
  ]);
  // Total: 1 second (parallel)
}
```

❌ **Not handling errors**
```js
async function getData() {
  const data = await fetch(url); // No error handling!
  return data;
}
```

✅ **Use try/catch:**
```js
async function getData() {
  try {
    const data = await fetch(url);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
```

❌ **Awaiting in array methods**
```js
// This doesn't work as expected!
items.forEach(async (item) => {
  await processItem(item);
});
```

✅ **Use for...of or Promise.all():**
```js
// Sequential
for (const item of items) {
  await processItem(item);
}

// Parallel
await Promise.all(items.map(item => processItem(item)));
```

## 🔗 See Also

- [Promises](./promises.md)
- [Functions](./functions.md)
