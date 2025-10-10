# Node.js Cheatsheet

Quick reference for Node.js essentials.

## 📦 Modules

```js
// CommonJS
const module = require('module');
module.exports = value;
exports.name = value;

// ES Modules
import module from 'module';
export default value;
export { name };
```

## 📁 File System

```js
const fs = require('fs').promises;

// Read
const data = await fs.readFile('file.txt', 'utf8');

// Write
await fs.writeFile('file.txt', 'content');

// Append
await fs.appendFile('file.txt', 'more');

// Delete
await fs.unlink('file.txt');

// Check exists
await fs.access('file.txt');

// Directory
await fs.mkdir('dir', { recursive: true });
await fs.readdir('dir');
await fs.rmdir('dir');
```

## 🛤️ Path

```js
const path = require('path');

path.join('a', 'b', 'c')     // a/b/c
path.resolve('file.txt')     // /absolute/path/file.txt
path.basename('/a/b/c.txt')  // c.txt
path.dirname('/a/b/c.txt')   // /a/b
path.extname('file.txt')     // .txt
__dirname                     // Current directory
__filename                    // Current file
```

## 🌐 HTTP Server

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(3000);
```

## 🔄 Events

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('event', (data) => {});
emitter.once('event', (data) => {});
emitter.emit('event', data);
emitter.off('event', handler);
```

## 💻 Process

```js
process.env.VAR              // Environment variable
process.argv                 // Command line arguments
process.cwd()                // Current directory
process.exit(0)              // Exit
process.on('SIGINT', () => {}) // Handle signals
```

## 🔗 See Also

- [FS Module](../node/fs-module.md)
- [Path Module](../node/path-module.md)
