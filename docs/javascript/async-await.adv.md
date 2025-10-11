# Advanced Async/Await Patterns

Advanced techniques and patterns for asynchronous JavaScript.

## 🔹 Parallel Execution

### Promise.all for Concurrent Operations

```js
// Run multiple async operations in parallel
async function fetchAllData() {
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
  ]);
  
  return { users, posts, comments };
}

// With error handling
async function fetchAllDataSafe() {
  const results = await Promise.allSettled([
    fetchUsers(),
    fetchPosts(),
    fetchComments()
  ]);
  
  const [users, posts, comments] = results.map(result => 
    result.status === 'fulfilled' ? result.value : null
  );
  
  return { users, posts, comments };
}
```

### Controlled Concurrency

```js
async function mapWithConcurrency(items, asyncFn, concurrency = 5) {
  const results = [];
  const executing = [];
  
  for (const item of items) {
    const promise = asyncFn(item).then(result => {
      executing.splice(executing.indexOf(promise), 1);
      return result;
    });
    
    results.push(promise);
    executing.push(promise);
    
    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }
  
  return Promise.all(results);
}

// Usage: Process 100 items with max 5 concurrent operations
const urls = Array.from({ length: 100 }, (_, i) => `https://api.example.com/item/${i}`);
const data = await mapWithConcurrency(urls, fetch, 5);
```

### Batch Processing

```js
async function processBatches(items, batchSize, processFn) {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processFn));
    results.push(...batchResults);
    
    console.log(`Processed ${Math.min(i + batchSize, items.length)} / ${items.length}`);
  }
  
  return results;
}

// Usage: Process 1000 items in batches of 50
await processBatches(items, 50, async (item) => {
  return await processItem(item);
});
```

## 🔹 Error Handling Patterns

### Retry with Exponential Backoff

```js
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// Usage
const data = await retryWithBackoff(
  () => fetch('https://api.example.com/data'),
  5,
  1000
);
```

### Timeout Wrapper

```js
function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    )
  ]);
}

// Usage
try {
  const data = await withTimeout(
    fetch('https://slow-api.example.com'),
    5000
  );
} catch (error) {
  console.error('Request timed out or failed:', error);
}
```

### Fallback Chain

```js
async function withFallback(...fns) {
  let lastError;
  
  for (const fn of fns) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log('Trying fallback...');
    }
  }
  
  throw lastError;
}

// Usage: Try primary API, then fallback APIs
const data = await withFallback(
  () => fetch('https://primary-api.com/data'),
  () => fetch('https://backup-api.com/data'),
  () => fetch('https://cache-api.com/data'),
  () => ({ fallback: true, data: [] })
);
```

## 🔹 Async Iteration

### Async Generator

```js
async function* fetchPages(url, maxPages = 10) {
  let page = 1;
  
  while (page <= maxPages) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response.json();
    
    if (data.items.length === 0) break;
    
    yield data.items;
    page++;
  }
}

// Usage
for await (const items of fetchPages('https://api.example.com/items', 5)) {
  console.log('Processing page:', items);
  items.forEach(item => processItem(item));
}
```

### Async Iterator

```js
class AsyncQueue {
  constructor() {
    this.queue = [];
    this.resolvers = [];
    this.done = false;
  }
  
  push(value) {
    if (this.resolvers.length > 0) {
      const resolve = this.resolvers.shift();
      resolve({ value, done: false });
    } else {
      this.queue.push(value);
    }
  }
  
  close() {
    this.done = true;
    this.resolvers.forEach(resolve => resolve({ done: true }));
    this.resolvers = [];
  }
  
  [Symbol.asyncIterator]() {
    return {
      next: () => {
        if (this.queue.length > 0) {
          return Promise.resolve({
            value: this.queue.shift(),
            done: false
          });
        }
        
        if (this.done) {
          return Promise.resolve({ done: true });
        }
        
        return new Promise(resolve => {
          this.resolvers.push(resolve);
        });
      }
    };
  }
}

// Usage
const queue = new AsyncQueue();

// Producer
setTimeout(() => queue.push(1), 100);
setTimeout(() => queue.push(2), 200);
setTimeout(() => queue.push(3), 300);
setTimeout(() => queue.close(), 400);

// Consumer
for await (const value of queue) {
  console.log('Received:', value);
}
```

## 🔹 Async Patterns

### Debounce Async

```js
function debounceAsync(fn, delay) {
  let timeoutId;
  let pendingPromise;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    if (pendingPromise) {
      return pendingPromise;
    }
    
    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          pendingPromise = fn.apply(this, args);
          const result = await pendingPromise;
          pendingPromise = null;
          resolve(result);
        } catch (error) {
          pendingPromise = null;
          reject(error);
        }
      }, delay);
    });
  };
}

// Usage
const debouncedSearch = debounceAsync(async (query) => {
  const response = await fetch(`/api/search?q=${query}`);
  return response.json();
}, 300);
```

### Throttle Async

```js
function throttleAsync(fn, limit) {
  let inThrottle;
  let lastResult;
  
  return async function(...args) {
    if (!inThrottle) {
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
      
      lastResult = await fn.apply(this, args);
      return lastResult;
    }
    
    return lastResult;
  };
}

// Usage
const throttledUpdate = throttleAsync(async (data) => {
  await fetch('/api/update', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}, 1000);
```

### Memoize Async

```js
function memoizeAsync(fn, keyFn = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  const pending = new Map();
  
  return async function(...args) {
    const key = keyFn(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    if (pending.has(key)) {
      return pending.get(key);
    }
    
    const promise = fn.apply(this, args);
    pending.set(key, promise);
    
    try {
      const result = await promise;
      cache.set(key, result);
      pending.delete(key);
      return result;
    } catch (error) {
      pending.delete(key);
      throw error;
    }
  };
}

// Usage
const memoizedFetch = memoizeAsync(async (url) => {
  const response = await fetch(url);
  return response.json();
});
```

## 🔹 Async Queue

### Task Queue with Concurrency

```js
class TaskQueue {
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }
  
  async add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.process();
    });
  }
  
  async process() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }
    
    this.running++;
    const { task, resolve, reject } = this.queue.shift();
    
    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }
}

// Usage
const queue = new TaskQueue(3);

const tasks = Array.from({ length: 10 }, (_, i) => 
  () => fetch(`https://api.example.com/item/${i}`)
);

const results = await Promise.all(
  tasks.map(task => queue.add(task))
);
```

## 🔹 Async State Machine

### State Machine Pattern

```js
class AsyncStateMachine {
  constructor(initialState) {
    this.state = initialState;
    this.transitions = new Map();
  }
  
  addTransition(from, to, action) {
    if (!this.transitions.has(from)) {
      this.transitions.set(from, new Map());
    }
    this.transitions.get(from).set(to, action);
  }
  
  async transition(to, ...args) {
    const fromTransitions = this.transitions.get(this.state);
    
    if (!fromTransitions || !fromTransitions.has(to)) {
      throw new Error(`Invalid transition from ${this.state} to ${to}`);
    }
    
    const action = fromTransitions.get(to);
    await action(...args);
    
    this.state = to;
  }
  
  getState() {
    return this.state;
  }
}

// Usage: Order processing
const orderMachine = new AsyncStateMachine('pending');

orderMachine.addTransition('pending', 'processing', async (orderId) => {
  await validateOrder(orderId);
  console.log('Order validated');
});

orderMachine.addTransition('processing', 'shipped', async (orderId) => {
  await shipOrder(orderId);
  console.log('Order shipped');
});

orderMachine.addTransition('shipped', 'delivered', async (orderId) => {
  await confirmDelivery(orderId);
  console.log('Order delivered');
});

// Execute transitions
await orderMachine.transition('processing', orderId);
await orderMachine.transition('shipped', orderId);
await orderMachine.transition('delivered', orderId);
```

## 🔹 Async Coordination

### Semaphore

```js
class Semaphore {
  constructor(max) {
    this.max = max;
    this.count = 0;
    this.queue = [];
  }
  
  async acquire() {
    if (this.count < this.max) {
      this.count++;
      return;
    }
    
    await new Promise(resolve => this.queue.push(resolve));
  }
  
  release() {
    this.count--;
    
    if (this.queue.length > 0) {
      this.count++;
      const resolve = this.queue.shift();
      resolve();
    }
  }
  
  async use(fn) {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

// Usage: Limit concurrent database connections
const dbSemaphore = new Semaphore(5);

async function queryDatabase(query) {
  return await dbSemaphore.use(async () => {
    return await db.query(query);
  });
}
```

### Barrier

```js
class Barrier {
  constructor(count) {
    this.count = count;
    this.waiting = 0;
    this.resolvers = [];
  }
  
  async wait() {
    this.waiting++;
    
    if (this.waiting === this.count) {
      this.resolvers.forEach(resolve => resolve());
      this.resolvers = [];
      this.waiting = 0;
      return;
    }
    
    await new Promise(resolve => this.resolvers.push(resolve));
  }
}

// Usage: Wait for all workers to reach checkpoint
const barrier = new Barrier(3);

async function worker(id) {
  console.log(`Worker ${id} starting`);
  await doWork();
  
  console.log(`Worker ${id} at barrier`);
  await barrier.wait();
  
  console.log(`Worker ${id} continuing`);
}

Promise.all([worker(1), worker(2), worker(3)]);
```

## 🔹 Async Streams

### Async Transform Stream

```js
async function* transform(source, transformFn) {
  for await (const item of source) {
    yield await transformFn(item);
  }
}

// Usage
async function* numbers() {
  for (let i = 1; i <= 10; i++) {
    yield i;
  }
}

const doubled = transform(numbers(), async (n) => n * 2);

for await (const num of doubled) {
  console.log(num); // 2, 4, 6, 8, ...
}
```

### Async Filter Stream

```js
async function* filter(source, predicate) {
  for await (const item of source) {
    if (await predicate(item)) {
      yield item;
    }
  }
}

// Usage
const evens = filter(numbers(), async (n) => n % 2 === 0);

for await (const num of evens) {
  console.log(num); // 2, 4, 6, 8, 10
}
```

## 🔗 See Also

- [Async/Await Basics](./async-await.md)
- [Promises](./promises.md)
- [Functions](./functions.md)
