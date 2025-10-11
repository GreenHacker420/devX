# Advanced Streams

Advanced techniques for working with Node.js Streams.

## 🔹 Custom Transform Streams

### Basic Transform Stream

```js
const { Transform } = require('stream');

class JSONParseStream extends Transform {
  constructor(options) {
    super({ ...options, objectMode: true });
  }
  
  _transform(chunk, encoding, callback) {
    try {
      const data = JSON.parse(chunk.toString());
      this.push(data);
      callback();
    } catch (error) {
      callback(error);
    }
  }
}

// Usage
const fs = require('fs');

fs.createReadStream('data.json')
  .pipe(new JSONParseStream())
  .on('data', (obj) => console.log(obj))
  .on('error', (err) => console.error(err));
```

### Line-by-Line Transform

```js
const { Transform } = require('stream');

class LineTransform extends Transform {
  constructor(options) {
    super(options);
    this.buffer = '';
  }
  
  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\n');
    
    // Keep the last incomplete line in buffer
    this.buffer = lines.pop();
    
    // Push complete lines
    lines.forEach(line => {
      if (line.trim()) {
        this.push(line + '\n');
      }
    });
    
    callback();
  }
  
  _flush(callback) {
    if (this.buffer.trim()) {
      this.push(this.buffer + '\n');
    }
    callback();
  }
}

// Usage: Process large log files line by line
fs.createReadStream('huge-log.txt')
  .pipe(new LineTransform())
  .on('data', (line) => {
    if (line.includes('ERROR')) {
      console.log(line);
    }
  });
```

### CSV Parser Stream

```js
const { Transform } = require('stream');

class CSVParser extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true });
    this.headers = null;
    this.buffer = '';
  }
  
  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop();
    
    lines.forEach((line, index) => {
      const values = line.split(',').map(v => v.trim());
      
      if (!this.headers) {
        this.headers = values;
      } else {
        const obj = {};
        this.headers.forEach((header, i) => {
          obj[header] = values[i];
        });
        this.push(obj);
      }
    });
    
    callback();
  }
  
  _flush(callback) {
    if (this.buffer.trim()) {
      const values = this.buffer.split(',').map(v => v.trim());
      if (this.headers) {
        const obj = {};
        this.headers.forEach((header, i) => {
          obj[header] = values[i];
        });
        this.push(obj);
      }
    }
    callback();
  }
}

// Usage
fs.createReadStream('data.csv')
  .pipe(new CSVParser())
  .on('data', (row) => console.log(row));
```

## 🔹 Stream Pipelines

### Complex Pipeline with Error Handling

```js
const { pipeline } = require('stream');
const { promisify } = require('util');
const fs = require('fs');
const zlib = require('zlib');

const pipelineAsync = promisify(pipeline);

async function processFile(inputFile, outputFile) {
  try {
    await pipelineAsync(
      fs.createReadStream(inputFile),
      new LineTransform(),
      zlib.createGzip(),
      fs.createWriteStream(outputFile)
    );
    console.log('Pipeline succeeded');
  } catch (error) {
    console.error('Pipeline failed:', error);
  }
}

processFile('input.txt', 'output.txt.gz');
```

### Parallel Stream Processing

```js
const { Transform, pipeline } = require('stream');
const { promisify } = require('util');

const pipelineAsync = promisify(pipeline);

class ParallelTransform extends Transform {
  constructor(transformFn, concurrency = 5) {
    super({ objectMode: true });
    this.transformFn = transformFn;
    this.concurrency = concurrency;
    this.active = 0;
    this.queue = [];
  }
  
  async _transform(chunk, encoding, callback) {
    if (this.active >= this.concurrency) {
      this.queue.push({ chunk, callback });
    } else {
      this.processChunk(chunk, callback);
    }
  }
  
  async processChunk(chunk, callback) {
    this.active++;
    
    try {
      const result = await this.transformFn(chunk);
      this.push(result);
      callback();
    } catch (error) {
      callback(error);
    } finally {
      this.active--;
      
      if (this.queue.length > 0) {
        const { chunk: nextChunk, callback: nextCallback } = this.queue.shift();
        this.processChunk(nextChunk, nextCallback);
      }
    }
  }
}

// Usage: Process URLs in parallel
const urls = ['url1', 'url2', 'url3'];
const { Readable } = require('stream');

const urlStream = Readable.from(urls);

urlStream
  .pipe(new ParallelTransform(async (url) => {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Processed: ${url}`;
  }, 3))
  .on('data', (result) => console.log(result));
```

## 🔹 Backpressure Handling

### Manual Backpressure Control

```js
const { Writable } = require('stream');

class SlowWriter extends Writable {
  constructor(options) {
    super(options);
    this.processing = false;
  }
  
  _write(chunk, encoding, callback) {
    if (this.processing) {
      // Simulate backpressure
      setTimeout(() => {
        console.log('Wrote:', chunk.toString());
        callback();
      }, 1000);
    } else {
      console.log('Wrote:', chunk.toString());
      callback();
    }
  }
}

// Producer respects backpressure
function writeWithBackpressure(stream, data) {
  return new Promise((resolve, reject) => {
    if (!stream.write(data)) {
      // Wait for drain event
      stream.once('drain', resolve);
    } else {
      resolve();
    }
  });
}

// Usage
const writer = new SlowWriter();

async function produce() {
  for (let i = 0; i < 100; i++) {
    await writeWithBackpressure(writer, `Data ${i}\n`);
  }
  writer.end();
}

produce();
```

## 🔹 Stream Multiplexing

### Split Stream to Multiple Destinations

```js
const { PassThrough } = require('stream');
const fs = require('fs');

function splitStream(source, destinations) {
  const passThrough = new PassThrough();
  
  source.pipe(passThrough);
  
  destinations.forEach(dest => {
    passThrough.pipe(dest);
  });
  
  return passThrough;
}

// Usage: Write to multiple files
const source = fs.createReadStream('input.txt');
const dest1 = fs.createWriteStream('output1.txt');
const dest2 = fs.createWriteStream('output2.txt');
const dest3 = fs.createWriteStream('output3.txt');

splitStream(source, [dest1, dest2, dest3]);
```

### Merge Multiple Streams

```js
const { PassThrough } = require('stream');

function mergeStreams(...streams) {
  const output = new PassThrough();
  let activeStreams = streams.length;
  
  streams.forEach(stream => {
    stream.pipe(output, { end: false });
    
    stream.on('end', () => {
      activeStreams--;
      if (activeStreams === 0) {
        output.end();
      }
    });
    
    stream.on('error', (err) => {
      output.destroy(err);
    });
  });
  
  return output;
}

// Usage: Combine multiple log files
const log1 = fs.createReadStream('log1.txt');
const log2 = fs.createReadStream('log2.txt');
const log3 = fs.createReadStream('log3.txt');

mergeStreams(log1, log2, log3)
  .pipe(fs.createWriteStream('combined.log'));
```

## 🔹 Stream Buffering

### Buffered Transform Stream

```js
const { Transform } = require('stream');

class BufferedTransform extends Transform {
  constructor(bufferSize, options) {
    super(options);
    this.bufferSize = bufferSize;
    this.buffer = [];
  }
  
  _transform(chunk, encoding, callback) {
    this.buffer.push(chunk);
    
    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    }
    
    callback();
  }
  
  _flush(callback) {
    if (this.buffer.length > 0) {
      this.flush();
    }
    callback();
  }
  
  flush() {
    const combined = Buffer.concat(this.buffer);
    this.push(combined);
    this.buffer = [];
  }
}

// Usage: Batch process data
fs.createReadStream('data.bin')
  .pipe(new BufferedTransform(1024 * 1024)) // 1MB buffer
  .on('data', (batch) => {
    console.log(`Processing batch of ${batch.length} bytes`);
  });
```

## 🔹 Stream Monitoring

### Monitor Stream Progress

```js
const { Transform } = require('stream');

class ProgressMonitor extends Transform {
  constructor(totalSize, options) {
    super(options);
    this.totalSize = totalSize;
    this.processedSize = 0;
    this.lastUpdate = Date.now();
  }
  
  _transform(chunk, encoding, callback) {
    this.processedSize += chunk.length;
    
    const now = Date.now();
    if (now - this.lastUpdate > 1000) {
      const progress = (this.processedSize / this.totalSize * 100).toFixed(2);
      const speed = (this.processedSize / (now - this.lastUpdate) * 1000 / 1024 / 1024).toFixed(2);
      console.log(`Progress: ${progress}% | Speed: ${speed} MB/s`);
      this.lastUpdate = now;
    }
    
    this.push(chunk);
    callback();
  }
}

// Usage
const fs = require('fs');

fs.stat('large-file.bin', (err, stats) => {
  if (err) throw err;
  
  fs.createReadStream('large-file.bin')
    .pipe(new ProgressMonitor(stats.size))
    .pipe(fs.createWriteStream('copy.bin'));
});
```

## 🔹 Stream Encryption/Decryption

### Encrypt Stream

```js
const crypto = require('crypto');
const fs = require('fs');
const { pipeline } = require('stream');

function encryptStream(inputFile, outputFile, password) {
  const algorithm = 'aes-256-ctr';
  const key = crypto.scryptSync(password, 'salt', 32);
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  // Write IV to beginning of file
  const output = fs.createWriteStream(outputFile);
  output.write(iv);
  
  pipeline(
    fs.createReadStream(inputFile),
    cipher,
    output,
    (err) => {
      if (err) {
        console.error('Encryption failed:', err);
      } else {
        console.log('Encryption complete');
      }
    }
  );
}

encryptStream('secret.txt', 'secret.txt.enc', 'mypassword');
```

### Decrypt Stream

```js
function decryptStream(inputFile, outputFile, password) {
  const algorithm = 'aes-256-ctr';
  const key = crypto.scryptSync(password, 'salt', 32);
  
  const input = fs.createReadStream(inputFile);
  
  // Read IV from beginning of file
  input.once('readable', () => {
    const iv = input.read(16);
    
    if (!iv) {
      throw new Error('Failed to read IV');
    }
    
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    
    pipeline(
      input,
      decipher,
      fs.createWriteStream(outputFile),
      (err) => {
        if (err) {
          console.error('Decryption failed:', err);
        } else {
          console.log('Decryption complete');
        }
      }
    );
  });
}

decryptStream('secret.txt.enc', 'secret.txt', 'mypassword');
```

## 🔹 Stream Rate Limiting

### Throttle Stream

```js
const { Transform } = require('stream');

class ThrottleStream extends Transform {
  constructor(bytesPerSecond) {
    super();
    this.bytesPerSecond = bytesPerSecond;
    this.bytesWritten = 0;
    this.startTime = Date.now();
  }
  
  _transform(chunk, encoding, callback) {
    this.bytesWritten += chunk.length;
    const elapsed = (Date.now() - this.startTime) / 1000;
    const expectedTime = this.bytesWritten / this.bytesPerSecond;
    const delay = Math.max(0, (expectedTime - elapsed) * 1000);
    
    setTimeout(() => {
      this.push(chunk);
      callback();
    }, delay);
  }
}

// Usage: Limit download speed to 1MB/s
fs.createReadStream('large-file.bin')
  .pipe(new ThrottleStream(1024 * 1024))
  .pipe(fs.createWriteStream('throttled-copy.bin'));
```

## 🔹 Stream Validation

### Checksum Stream

```js
const { Transform } = require('stream');
const crypto = require('crypto');

class ChecksumStream extends Transform {
  constructor(algorithm = 'sha256') {
    super();
    this.hash = crypto.createHash(algorithm);
    this.checksum = null;
  }
  
  _transform(chunk, encoding, callback) {
    this.hash.update(chunk);
    this.push(chunk);
    callback();
  }
  
  _flush(callback) {
    this.checksum = this.hash.digest('hex');
    callback();
  }
  
  getChecksum() {
    return this.checksum;
  }
}

// Usage
const checksumStream = new ChecksumStream();

fs.createReadStream('file.bin')
  .pipe(checksumStream)
  .pipe(fs.createWriteStream('copy.bin'))
  .on('finish', () => {
    console.log('Checksum:', checksumStream.getChecksum());
  });
```

## 🔹 Object Streams

### Array to Object Stream

```js
const { Readable } = require('stream');

function arrayToStream(array) {
  return Readable.from(array, { objectMode: true });
}

// Usage
const data = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];

arrayToStream(data)
  .on('data', (obj) => console.log(obj));
```

### Object Stream to Array

```js
async function streamToArray(stream) {
  const chunks = [];
  
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  
  return chunks;
}

// Usage
const stream = arrayToStream([1, 2, 3, 4, 5]);
streamToArray(stream).then(arr => console.log(arr));
```

### Filter Object Stream

```js
class FilterStream extends Transform {
  constructor(filterFn, options) {
    super({ ...options, objectMode: true });
    this.filterFn = filterFn;
  }
  
  _transform(obj, encoding, callback) {
    if (this.filterFn(obj)) {
      this.push(obj);
    }
    callback();
  }
}

// Usage: Filter objects
arrayToStream(data)
  .pipe(new FilterStream(obj => obj.id > 1))
  .on('data', (obj) => console.log(obj));
```

## 🔗 See Also

- [Streams Basics](./streams.md)
- [FS Module](./fs-module.md)
- [Events](./events.md)
