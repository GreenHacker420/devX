# Node.js Events

Node.js has an event-driven architecture. The `events` module provides the EventEmitter class.

## 🔹 Basic EventEmitter

```js
const EventEmitter = require('events');

const emitter = new EventEmitter();

// Register event listener
emitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// Emit event
emitter.emit('greet', 'Alice'); // "Hello, Alice!"
```

## 🔹 Creating Custom EventEmitter

```js
const EventEmitter = require('events');

class Logger extends EventEmitter {
  log(message) {
    console.log(message);
    this.emit('logged', { message, timestamp: Date.now() });
  }
}

const logger = new Logger();

logger.on('logged', (data) => {
  console.log('Log event:', data);
});

logger.log('User logged in');
// User logged in
// Log event: { message: 'User logged in', timestamp: 1234567890 }
```

## 🔹 Event Listener Methods

### on() / addListener() - Add listener
```js
const emitter = new EventEmitter();

emitter.on('data', (data) => {
  console.log('Received:', data);
});

// Same as on()
emitter.addListener('data', (data) => {
  console.log('Also received:', data);
});

emitter.emit('data', 'Hello');
```

### once() - Listen once
```js
const emitter = new EventEmitter();

emitter.once('connect', () => {
  console.log('Connected!');
});

emitter.emit('connect'); // "Connected!"
emitter.emit('connect'); // Nothing happens
```

### off() / removeListener() - Remove listener
```js
const emitter = new EventEmitter();

function handler(data) {
  console.log('Data:', data);
}

emitter.on('data', handler);
emitter.emit('data', 'First'); // "Data: First"

emitter.off('data', handler);
emitter.emit('data', 'Second'); // Nothing happens
```

### removeAllListeners() - Remove all
```js
const emitter = new EventEmitter();

emitter.on('data', () => console.log('Handler 1'));
emitter.on('data', () => console.log('Handler 2'));

emitter.removeAllListeners('data');
emitter.emit('data'); // Nothing happens

// Remove all listeners for all events
emitter.removeAllListeners();
```

## 🔹 Listener Information

### listenerCount() - Count listeners
```js
const emitter = new EventEmitter();

emitter.on('data', () => {});
emitter.on('data', () => {});

console.log(emitter.listenerCount('data')); // 2
```

### listeners() - Get all listeners
```js
const emitter = new EventEmitter();

const handler1 = () => console.log('Handler 1');
const handler2 = () => console.log('Handler 2');

emitter.on('data', handler1);
emitter.on('data', handler2);

const listeners = emitter.listeners('data');
console.log(listeners); // [handler1, handler2]
```

### eventNames() - Get all event names
```js
const emitter = new EventEmitter();

emitter.on('data', () => {});
emitter.on('error', () => {});

console.log(emitter.eventNames()); // ['data', 'error']
```

## 🔹 Prepending Listeners

```js
const emitter = new EventEmitter();

emitter.on('data', () => console.log('Second'));
emitter.prependListener('data', () => console.log('First'));

emitter.emit('data');
// First
// Second
```

## 🔹 Error Events

```js
const emitter = new EventEmitter();

// Always handle error events!
emitter.on('error', (err) => {
  console.error('Error occurred:', err.message);
});

emitter.emit('error', new Error('Something went wrong'));

// Without error handler, Node.js will crash:
// emitter.emit('error', new Error('Crash!')); // Throws!
```

## 🔹 Setting Max Listeners

```js
const emitter = new EventEmitter();

// Default is 10, warning if exceeded
emitter.setMaxListeners(20);

// Get max listeners
console.log(emitter.getMaxListeners()); // 20

// Set to 0 for unlimited (not recommended)
emitter.setMaxListeners(0);
```

## 💡 Tips

- Always handle **error** events to prevent crashes
- Use **once()** for one-time events (like 'ready')
- Remove listeners when no longer needed to prevent memory leaks
- EventEmitter is synchronous (listeners execute in order)
- Many Node.js APIs inherit from EventEmitter (streams, servers, etc.)

## 🧩 Example: User Authentication System

```js
const EventEmitter = require('events');

class AuthService extends EventEmitter {
  async login(username, password) {
    this.emit('login:attempt', { username });
    
    try {
      // Simulate authentication
      if (username === 'admin' && password === 'secret') {
        const user = { id: 1, username };
        this.emit('login:success', user);
        return user;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      this.emit('login:failure', { username, error });
      throw error;
    }
  }
  
  logout(userId) {
    this.emit('logout', { userId, timestamp: Date.now() });
  }
}

const auth = new AuthService();

// Register listeners
auth.on('login:attempt', ({ username }) => {
  console.log(`Login attempt for: ${username}`);
});

auth.on('login:success', (user) => {
  console.log(`User logged in: ${user.username}`);
});

auth.on('login:failure', ({ username, error }) => {
  console.log(`Login failed for ${username}: ${error.message}`);
});

auth.on('logout', ({ userId }) => {
  console.log(`User ${userId} logged out`);
});

// Usage
await auth.login('admin', 'secret');
auth.logout(1);
```

## 🧩 Example: Download Progress Tracker

```js
const EventEmitter = require('events');

class Downloader extends EventEmitter {
  async download(url, totalSize) {
    this.emit('start', { url, totalSize });
    
    let downloaded = 0;
    const chunkSize = totalSize / 10;
    
    const interval = setInterval(() => {
      downloaded += chunkSize;
      const progress = Math.min((downloaded / totalSize) * 100, 100);
      
      this.emit('progress', { 
        downloaded, 
        totalSize, 
        progress: progress.toFixed(2) 
      });
      
      if (downloaded >= totalSize) {
        clearInterval(interval);
        this.emit('complete', { url, totalSize });
      }
    }, 100);
  }
}

const downloader = new Downloader();

downloader.on('start', ({ url, totalSize }) => {
  console.log(`Starting download: ${url} (${totalSize} bytes)`);
});

downloader.on('progress', ({ progress }) => {
  console.log(`Progress: ${progress}%`);
});

downloader.on('complete', ({ url }) => {
  console.log(`Download complete: ${url}`);
});

downloader.download('https://example.com/file.zip', 1000000);
```

## 🧩 Example: Real-time Chat Room

```js
const EventEmitter = require('events');

class ChatRoom extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.users = new Set();
  }
  
  join(username) {
    this.users.add(username);
    this.emit('user:join', { username, room: this.name });
  }
  
  leave(username) {
    this.users.delete(username);
    this.emit('user:leave', { username, room: this.name });
  }
  
  sendMessage(username, message) {
    this.emit('message', { 
      username, 
      message, 
      room: this.name,
      timestamp: Date.now()
    });
  }
}

const room = new ChatRoom('General');

room.on('user:join', ({ username }) => {
  console.log(`${username} joined the room`);
});

room.on('user:leave', ({ username }) => {
  console.log(`${username} left the room`);
});

room.on('message', ({ username, message }) => {
  console.log(`${username}: ${message}`);
});

room.join('Alice');
room.sendMessage('Alice', 'Hello everyone!');
room.join('Bob');
room.sendMessage('Bob', 'Hi Alice!');
room.leave('Alice');
```

## ⚠️ Common Mistakes

❌ **Not handling error events**
```js
const emitter = new EventEmitter();
emitter.emit('error', new Error('Boom!')); // Crashes!
```

✅ **Always handle errors:**
```js
emitter.on('error', (err) => {
  console.error('Error:', err);
});
```

❌ **Memory leaks from not removing listeners**
```js
setInterval(() => {
  emitter.on('data', () => {}); // Adds new listener every second!
}, 1000);
```

✅ **Remove listeners when done:**
```js
const handler = () => {};
emitter.on('data', handler);
// Later...
emitter.off('data', handler);
```

## 🔗 See Also

- [Streams](./streams.md)
- [Server](./server.md)
- [FS Module](./fs-module.md)
