# Node.js Streams

Streams are objects that let you read or write data in chunks, making them memory-efficient for large data.

## 🔹 Types of Streams

1. **Readable** - Read data (e.g., `fs.createReadStream()`)
2. **Writable** - Write data (e.g., `fs.createWriteStream()`)
3. **Duplex** - Both readable and writable (e.g., TCP socket)
4. **Transform** - Modify data while reading/writing (e.g., compression)

## 🔹 Readable Streams

### Reading from a file
```js
const fs = require('fs');

const readStream = fs.createReadStream('large-file.txt', {
  encoding: 'utf8',
  highWaterMark: 64 * 1024 // 64KB chunks
});

readStream.on('data', (chunk) => {
  console.log('Received chunk:', chunk.length, 'bytes');
});

readStream.on('end', () => {
  console.log('Finished reading');
});

readStream.on('error', (err) => {
  console.error('Error:', err);
});
```

### Pausing and resuming
```js
const readStream = fs.createReadStream('file.txt');

readStream.on('data', (chunk) => {
  console.log('Chunk received');
  
  // Pause stream
  readStream.pause();
  
  // Resume after 1 second
  setTimeout(() => {
    readStream.resume();
  }, 1000);
});
```

## 🔹 Writable Streams

### Writing to a file
```js
const fs = require('fs');

const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Line 1\n');
writeStream.write('Line 2\n');
writeStream.write('Line 3\n');

writeStream.end('Final line\n');

writeStream.on('finish', () => {
  console.log('Finished writing');
});

writeStream.on('error', (err) => {
  console.error('Error:', err);
});
```

### Handling backpressure
```js
const writeStream = fs.createWriteStream('output.txt');

function writeMillionLines() {
  let i = 0;
  
  function write() {
    let ok = true;
    
    while (i < 1000000 && ok) {
      ok = writeStream.write(`Line ${i}\n`);
      i++;
    }
    
    if (i < 1000000) {
      // Wait for drain event
      writeStream.once('drain', write);
    } else {
      writeStream.end();
    }
  }
  
  write();
}

writeMillionLines();
```

## 🔹 Piping Streams

### Basic pipe
```js
const fs = require('fs');

const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

// Pipe read to write
readStream.pipe(writeStream);

writeStream.on('finish', () => {
  console.log('File copied');
});
```

### Chaining pipes
```js
const fs = require('fs');
const zlib = require('zlib');

// Read -> Compress -> Write
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('input.txt.gz'));

// Read compressed -> Decompress -> Write
fs.createReadStream('input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('output.txt'));
```

## 🔹 Transform Streams

### Creating a transform stream
```js
const { Transform } = require('stream');

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    // Transform data
    const upperChunk = chunk.toString().toUpperCase();
    this.push(upperChunk);
    callback();
  }
});

// Usage
process.stdin
  .pipe(upperCaseTransform)
  .pipe(process.stdout);
```

### Line-by-line transform
```js
const { Transform } = require('stream');

class LineTransform extends Transform {
  constructor() {
    super();
    this.buffer = '';
  }
  
  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\n');
    
    // Keep last incomplete line in buffer
    this.buffer = lines.pop();
    
    // Process complete lines
    lines.forEach(line => {
      this.push(line.toUpperCase() + '\n');
    });
    
    callback();
  }
  
  _flush(callback) {
    // Process remaining buffer
    if (this.buffer) {
      this.push(this.buffer.toUpperCase() + '\n');
    }
    callback();
  }
}

fs.createReadStream('input.txt')
  .pipe(new LineTransform())
  .pipe(fs.createWriteStream('output.txt'));
```

## 🔹 Duplex Streams

```js
const { Duplex } = require('stream');

class MyDuplex extends Duplex {
  constructor() {
    super();
    this.data = [];
  }
  
  _read(size) {
    // Read implementation
    if (this.data.length) {
      this.push(this.data.shift());
    } else {
      this.push(null); // End of data
    }
  }
  
  _write(chunk, encoding, callback) {
    // Write implementation
    this.data.push(chunk);
    callback();
  }
}
```

## 🔹 Stream Events

### Readable stream events
```js
const readStream = fs.createReadStream('file.txt');

readStream.on('data', (chunk) => {
  console.log('Data:', chunk);
});

readStream.on('end', () => {
  console.log('No more data');
});

readStream.on('error', (err) => {
  console.error('Error:', err);
});

readStream.on('close', () => {
  console.log('Stream closed');
});
```

### Writable stream events
```js
const writeStream = fs.createWriteStream('file.txt');

writeStream.on('finish', () => {
  console.log('All data written');
});

writeStream.on('drain', () => {
  console.log('Ready for more data');
});

writeStream.on('error', (err) => {
  console.error('Error:', err);
});
```

## 🔹 Object Mode Streams

```js
const { Transform } = require('stream');

const objectTransform = new Transform({
  objectMode: true,
  transform(obj, encoding, callback) {
    obj.processed = true;
    obj.timestamp = Date.now();
    this.push(obj);
    callback();
  }
});

// Usage
const { Readable } = require('stream');

const objectStream = new Readable({
  objectMode: true,
  read() {}
});

objectStream.push({ id: 1, name: 'Alice' });
objectStream.push({ id: 2, name: 'Bob' });
objectStream.push(null);

objectStream
  .pipe(objectTransform)
  .on('data', (obj) => {
    console.log(obj);
  });
```

## 💡 Tips

- Use streams for **large files** to save memory
- Always handle **error** events
- Use **pipe()** for automatic backpressure handling
- **Transform streams** are great for data processing
- Streams are **EventEmitters** (can use .on(), .once(), etc.)

## 🧩 Example: CSV Parser

```js
const fs = require('fs');
const { Transform } = require('stream');

class CSVParser extends Transform {
  constructor() {
    super({ objectMode: true });
    this.buffer = '';
    this.headers = null;
  }
  
  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop();
    
    lines.forEach(line => {
      if (!this.headers) {
        this.headers = line.split(',');
      } else {
        const values = line.split(',');
        const obj = {};
        this.headers.forEach((header, i) => {
          obj[header] = values[i];
        });
        this.push(obj);
      }
    });
    
    callback();
  }
}

fs.createReadStream('data.csv')
  .pipe(new CSVParser())
  .on('data', (row) => {
    console.log(row);
  });
```

## 🧩 Example: Progress Tracker

```js
const fs = require('fs');
const { Transform } = require('stream');

class ProgressTransform extends Transform {
  constructor(totalSize) {
    super();
    this.totalSize = totalSize;
    this.transferred = 0;
  }
  
  _transform(chunk, encoding, callback) {
    this.transferred += chunk.length;
    const progress = (this.transferred / this.totalSize * 100).toFixed(2);
    console.log(`Progress: ${progress}%`);
    this.push(chunk);
    callback();
  }
}

const stats = fs.statSync('large-file.txt');
const progress = new ProgressTransform(stats.size);

fs.createReadStream('large-file.txt')
  .pipe(progress)
  .pipe(fs.createWriteStream('copy.txt'));
```

## ⚠️ Common Mistakes

❌ **Not handling errors**
```js
readStream.pipe(writeStream); // Errors not handled!
```

✅ **Handle errors on all streams:**
```js
readStream.on('error', err => console.error(err));
writeStream.on('error', err => console.error(err));
readStream.pipe(writeStream);
```

❌ **Reading entire file into memory**
```js
const data = fs.readFileSync('huge-file.txt'); // Memory overflow!
```

✅ **Use streams:**
```js
const stream = fs.createReadStream('huge-file.txt');
```

## 🔗 See Also

- [FS Module](./fs-module.md)
- [Events](./events.md)
- [Server](./server.md)
