# JavaScript Promises

Promises represent the eventual completion (or failure) of an asynchronous operation.

## 🔹 What is a Promise?

A Promise is an object that may produce a value in the future. It can be in one of three states:

- **Pending**: Initial state, neither fulfilled nor rejected
- **Fulfilled**: Operation completed successfully
- **Rejected**: Operation failed

## 🔹 Creating a Promise

```js
const promise = new Promise((resolve, reject) => {
  // Asynchronous operation
  const success = true;
  
  if (success) {
    resolve("Operation successful!");
  } else {
    reject("Operation failed!");
  }
});
```

## 🔹 Consuming Promises

```js
promise
  .then(result => {
    console.log(result); // "Operation successful!"
  })
  .catch(error => {
    console.error(error);
  })
  .finally(() => {
    console.log("Promise settled (either resolved or rejected)");
  });
```

## 🔹 Chaining Promises

```js
fetch("https://api.example.com/user")
  .then(response => response.json())
  .then(data => {
    console.log("User:", data);
    return fetch(`https://api.example.com/posts/${data.id}`);
  })
  .then(response => response.json())
  .then(posts => {
    console.log("Posts:", posts);
  })
  .catch(error => {
    console.error("Error:", error);
  });
```

## 🔹 Promise Methods

### Promise.all()
Waits for all promises to resolve (or any to reject).

```js
const promise1 = Promise.resolve(3);
const promise2 = new Promise(resolve => setTimeout(() => resolve("foo"), 100));
const promise3 = fetch("https://api.example.com/data");

Promise.all([promise1, promise2, promise3])
  .then(values => {
    console.log(values); // [3, "foo", Response]
  })
  .catch(error => {
    console.error("One of the promises failed:", error);
  });
```

### Promise.race()
Returns the first promise that settles (resolves or rejects).

```js
const slow = new Promise(resolve => setTimeout(() => resolve("slow"), 500));
const fast = new Promise(resolve => setTimeout(() => resolve("fast"), 100));

Promise.race([slow, fast])
  .then(result => {
    console.log(result); // "fast"
  });
```

### Promise.allSettled()
Waits for all promises to settle (regardless of outcome).

```js
const promises = [
  Promise.resolve(1),
  Promise.reject("error"),
  Promise.resolve(3)
];

Promise.allSettled(promises)
  .then(results => {
    console.log(results);
    // [
    //   { status: "fulfilled", value: 1 },
    //   { status: "rejected", reason: "error" },
    //   { status: "fulfilled", value: 3 }
    // ]
  });
```

### Promise.any()
Returns the first promise that fulfills (ignores rejections).

```js
const promises = [
  Promise.reject("error1"),
  Promise.resolve("success"),
  Promise.reject("error2")
];

Promise.any(promises)
  .then(result => {
    console.log(result); // "success"
  });
```

## 🔹 Creating Utility Functions

```js
// Delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage
delay(2000).then(() => console.log("2 seconds passed"));

// Timeout wrapper
function timeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), ms)
    )
  ]);
}

// Usage
timeout(fetch("https://api.example.com/data"), 5000)
  .then(response => response.json())
  .catch(error => console.error(error));
```

## 💡 Tips

- Always handle errors with `.catch()` or `try/catch` with async/await
- Promises are **eager** (they start executing immediately)
- Return promises in `.then()` to chain them properly
- Use `Promise.all()` for parallel operations
- Use `Promise.allSettled()` when you need all results regardless of failures

## 🧩 Example: Fetching User Data

```js
function getUserData(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = {
        1: { id: 1, name: "Alice", email: "alice@example.com" },
        2: { id: 2, name: "Bob", email: "bob@example.com" }
      };
      
      const user = users[userId];
      if (user) {
        resolve(user);
      } else {
        reject(new Error("User not found"));
      }
    }, 1000);
  });
}

// Usage
getUserData(1)
  .then(user => {
    console.log("User found:", user);
  })
  .catch(error => {
    console.error("Error:", error.message);
  });
```

## ⚠️ Common Mistakes

❌ **Forgetting to return in .then()**
```js
promise
  .then(result => {
    doSomething(result); // Not returned!
  })
  .then(data => {
    console.log(data); // undefined
  });
```

✅ **Correct:**
```js
promise
  .then(result => {
    return doSomething(result); // Returned
  })
  .then(data => {
    console.log(data); // Correct value
  });
```

❌ **Nesting promises (callback hell)**
```js
promise1.then(result1 => {
  promise2.then(result2 => {
    promise3.then(result3 => {
      // Nested mess
    });
  });
});
```

✅ **Chain them:**
```js
promise1
  .then(result1 => promise2)
  .then(result2 => promise3)
  .then(result3 => {
    // Clean and flat
  });
```

❌ **Not handling errors**
```js
promise.then(result => {
  console.log(result);
}); // No .catch()!
```

✅ **Always catch errors:**
```js
promise
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error(error);
  });
```

## 🔗 See Also

- [Async/Await](./async-await.md)
- [Functions](./functions.md)
