# Advanced File System Operations

Advanced techniques for working with the Node.js File System module.

## 🔹 Watching Files and Directories

### Watch for File Changes

```js
const fs = require('fs');
const path = require('path');

// Watch a single file
const watcher = fs.watch('config.json', (eventType, filename) => {
  console.log(`Event: ${eventType}`);
  console.log(`File: ${filename}`);
  
  if (eventType === 'change') {
    console.log('File was modified');
  }
});

// Stop watching
setTimeout(() => {
  watcher.close();
}, 60000);
```

### Watch Directory Recursively

```js
const fs = require('fs');
const path = require('path');

function watchDirectory(dir) {
  fs.watch(dir, { recursive: true }, (eventType, filename) => {
    if (filename) {
      const fullPath = path.join(dir, filename);
      console.log(`${eventType}: ${fullPath}`);
    }
  });
}

watchDirectory('./src');
```

### Advanced File Watcher with Debouncing

```js
const fs = require('fs');

class FileWatcher {
  constructor(filepath, callback, delay = 100) {
    this.filepath = filepath;
    this.callback = callback;
    this.delay = delay;
    this.timeout = null;
    this.watcher = null;
  }
  
  start() {
    this.watcher = fs.watch(this.filepath, (eventType) => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.callback(eventType, this.filepath);
      }, this.delay);
    });
  }
  
  stop() {
    if (this.watcher) {
      this.watcher.close();
    }
    clearTimeout(this.timeout);
  }
}

// Usage
const watcher = new FileWatcher('data.json', (event, file) => {
  console.log(`File ${file} changed: ${event}`);
  // Reload configuration, etc.
}, 500);

watcher.start();
```

## 🔹 Streaming Large Files

### Read Large Files with Streams

```js
const fs = require('fs');
const readline = require('readline');

async function processLargeFile(filepath) {
  const fileStream = fs.createReadStream(filepath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let lineCount = 0;
  
  for await (const line of rl) {
    lineCount++;
    // Process each line
    if (line.includes('ERROR')) {
      console.log(`Line ${lineCount}: ${line}`);
    }
  }
  
  console.log(`Processed ${lineCount} lines`);
}

processLargeFile('huge-log.txt');
```

### Copy Large Files Efficiently

```js
const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');

const pipelineAsync = promisify(pipeline);

async function copyLargeFile(source, destination) {
  try {
    await pipelineAsync(
      fs.createReadStream(source),
      fs.createWriteStream(destination)
    );
    console.log('File copied successfully');
  } catch (error) {
    console.error('Copy failed:', error);
  }
}

copyLargeFile('large-video.mp4', 'backup/large-video.mp4');
```

### Transform Stream for Processing

```js
const fs = require('fs');
const { Transform } = require('stream');

class UpperCaseTransform extends Transform {
  _transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
}

// Read, transform, and write
fs.createReadStream('input.txt')
  .pipe(new UpperCaseTransform())
  .pipe(fs.createWriteStream('output.txt'))
  .on('finish', () => console.log('Transformation complete'));
```

## 🔹 File Locking and Concurrency

### Simple File Lock Implementation

```js
const fs = require('fs').promises;
const path = require('path');

class FileLock {
  constructor(filepath) {
    this.filepath = filepath;
    this.lockfile = `${filepath}.lock`;
  }
  
  async acquire(timeout = 5000) {
    const startTime = Date.now();
    
    while (true) {
      try {
        await fs.writeFile(this.lockfile, process.pid.toString(), { flag: 'wx' });
        return true;
      } catch (error) {
        if (Date.now() - startTime > timeout) {
          throw new Error('Lock acquisition timeout');
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
  
  async release() {
    try {
      await fs.unlink(this.lockfile);
    } catch (error) {
      // Lock file already removed
    }
  }
}

// Usage
async function updateFileWithLock(filepath, data) {
  const lock = new FileLock(filepath);
  
  try {
    await lock.acquire();
    
    // Critical section
    const existing = await fs.readFile(filepath, 'utf8');
    const updated = existing + data;
    await fs.writeFile(filepath, updated);
    
  } finally {
    await lock.release();
  }
}
```

## 🔹 Directory Operations

### Recursive Directory Copy

```js
const fs = require('fs').promises;
const path = require('path');

async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

copyDirectory('./source', './destination');
```

### Get Directory Size

```js
const fs = require('fs').promises;
const path = require('path');

async function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      totalSize += await getDirectorySize(fullPath);
    } else {
      const stats = await fs.stat(fullPath);
      totalSize += stats.size;
    }
  }
  
  return totalSize;
}

// Usage
getDirectorySize('./node_modules').then(size => {
  console.log(`Size: ${(size / 1024 / 1024).toFixed(2)} MB`);
});
```

### Find Files by Pattern

```js
const fs = require('fs').promises;
const path = require('path');

async function findFiles(dir, pattern) {
  const results = [];
  
  async function search(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        await search(fullPath);
      } else if (pattern.test(entry.name)) {
        results.push(fullPath);
      }
    }
  }
  
  await search(dir);
  return results;
}

// Find all JavaScript files
findFiles('./src', /\.js$/).then(files => {
  console.log('JavaScript files:', files);
});
```

### Clean Old Files

```js
const fs = require('fs').promises;
const path = require('path');

async function cleanOldFiles(dir, maxAgeDays) {
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
  const now = Date.now();
  
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isFile()) {
      const stats = await fs.stat(fullPath);
      const age = now - stats.mtimeMs;
      
      if (age > maxAgeMs) {
        await fs.unlink(fullPath);
        console.log(`Deleted: ${fullPath}`);
      }
    }
  }
}

// Delete files older than 30 days
cleanOldFiles('./temp', 30);
```

## 🔹 File Metadata and Permissions

### Get Detailed File Information

```js
const fs = require('fs').promises;

async function getFileInfo(filepath) {
  const stats = await fs.stat(filepath);
  
  return {
    size: stats.size,
    created: stats.birthtime,
    modified: stats.mtime,
    accessed: stats.atime,
    isFile: stats.isFile(),
    isDirectory: stats.isDirectory(),
    isSymbolicLink: stats.isSymbolicLink(),
    permissions: stats.mode.toString(8).slice(-3),
    uid: stats.uid,
    gid: stats.gid
  };
}

getFileInfo('package.json').then(info => {
  console.log(info);
});
```

### Change File Permissions

```js
const fs = require('fs').promises;

// Make file executable
async function makeExecutable(filepath) {
  await fs.chmod(filepath, 0o755);
}

// Make file read-only
async function makeReadOnly(filepath) {
  await fs.chmod(filepath, 0o444);
}

// Make file private (owner only)
async function makePrivate(filepath) {
  await fs.chmod(filepath, 0o600);
}
```

## 🔹 Atomic File Operations

### Atomic Write (Write and Rename)

```js
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

async function atomicWrite(filepath, data) {
  const tempFile = `${filepath}.${crypto.randomBytes(8).toString('hex')}.tmp`;
  
  try {
    await fs.writeFile(tempFile, data);
    await fs.rename(tempFile, filepath);
  } catch (error) {
    // Clean up temp file on error
    try {
      await fs.unlink(tempFile);
    } catch {}
    throw error;
  }
}

// Usage
atomicWrite('config.json', JSON.stringify({ key: 'value' }, null, 2));
```

### Safe JSON File Update

```js
const fs = require('fs').promises;

async function updateJSON(filepath, updateFn) {
  let data;
  
  try {
    const content = await fs.readFile(filepath, 'utf8');
    data = JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      data = {};
    } else {
      throw error;
    }
  }
  
  const updated = updateFn(data);
  const tempFile = `${filepath}.tmp`;
  
  await fs.writeFile(tempFile, JSON.stringify(updated, null, 2));
  await fs.rename(tempFile, filepath);
  
  return updated;
}

// Usage
updateJSON('config.json', (config) => {
  config.lastUpdated = new Date().toISOString();
  config.version = (config.version || 0) + 1;
  return config;
});
```

## 🔹 Memory-Mapped Files

### Read File in Chunks

```js
const fs = require('fs').promises;

async function readFileInChunks(filepath, chunkSize = 1024 * 1024) {
  const fileHandle = await fs.open(filepath, 'r');
  const stats = await fileHandle.stat();
  const buffer = Buffer.alloc(chunkSize);
  
  let position = 0;
  
  try {
    while (position < stats.size) {
      const { bytesRead } = await fileHandle.read(buffer, 0, chunkSize, position);
      
      // Process chunk
      const chunk = buffer.slice(0, bytesRead);
      console.log(`Read ${bytesRead} bytes at position ${position}`);
      
      position += bytesRead;
    }
  } finally {
    await fileHandle.close();
  }
}

readFileInChunks('large-file.bin');
```

## 🔹 File Compression

### Compress File with Gzip

```js
const fs = require('fs');
const zlib = require('zlib');
const { pipeline } = require('stream');
const { promisify } = require('util');

const pipelineAsync = promisify(pipeline);

async function compressFile(source, destination) {
  await pipelineAsync(
    fs.createReadStream(source),
    zlib.createGzip(),
    fs.createWriteStream(destination)
  );
  
  const originalSize = (await fs.promises.stat(source)).size;
  const compressedSize = (await fs.promises.stat(destination)).size;
  const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);
  
  console.log(`Compressed: ${ratio}% reduction`);
}

compressFile('large-file.txt', 'large-file.txt.gz');
```

### Decompress File

```js
async function decompressFile(source, destination) {
  await pipelineAsync(
    fs.createReadStream(source),
    zlib.createGunzip(),
    fs.createWriteStream(destination)
  );
  
  console.log('Decompression complete');
}

decompressFile('large-file.txt.gz', 'large-file.txt');
```

## 🔹 Temporary Files

### Create Temporary File

```js
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const crypto = require('crypto');

async function createTempFile(prefix = 'tmp', extension = '.tmp') {
  const tempDir = os.tmpdir();
  const filename = `${prefix}-${crypto.randomBytes(8).toString('hex')}${extension}`;
  const filepath = path.join(tempDir, filename);
  
  await fs.writeFile(filepath, '');
  
  return filepath;
}

// Usage
const tempFile = await createTempFile('myapp', '.json');
console.log(`Temp file: ${tempFile}`);

// Use temp file...

// Clean up
await fs.unlink(tempFile);
```

### Auto-Cleanup Temporary File

```js
class TempFile {
  constructor(prefix = 'tmp', extension = '.tmp') {
    this.prefix = prefix;
    this.extension = extension;
    this.filepath = null;
  }
  
  async create() {
    const tempDir = os.tmpdir();
    const filename = `${this.prefix}-${crypto.randomBytes(8).toString('hex')}${this.extension}`;
    this.filepath = path.join(tempDir, filename);
    await fs.writeFile(this.filepath, '');
    return this.filepath;
  }
  
  async write(data) {
    if (!this.filepath) throw new Error('Temp file not created');
    await fs.writeFile(this.filepath, data);
  }
  
  async read() {
    if (!this.filepath) throw new Error('Temp file not created');
    return await fs.readFile(this.filepath, 'utf8');
  }
  
  async cleanup() {
    if (this.filepath) {
      try {
        await fs.unlink(this.filepath);
      } catch (error) {
        // File already deleted
      }
    }
  }
}

// Usage
const temp = new TempFile('data', '.json');
try {
  await temp.create();
  await temp.write(JSON.stringify({ test: 'data' }));
  const data = await temp.read();
  console.log(data);
} finally {
  await temp.cleanup();
}
```

## 🔗 See Also

- [FS Module Basics](./fs-module.md)
- [Streams](./streams.md)
- [Path Module](./path-module.md)
