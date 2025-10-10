# Node.js File System (fs) Module

The `fs` module provides an API for interacting with the file system.

## 🔹 Reading Files

### Asynchronous (Recommended)
```js
const fs = require('fs');

// Read entire file
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  console.log(data);
});

// With promises
const fs = require('fs').promises;

async function readFile() {
  try {
    const data = await fs.readFile('file.txt', 'utf8');
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Synchronous (Blocks execution)
```js
const fs = require('fs');

try {
  const data = fs.readFileSync('file.txt', 'utf8');
  console.log(data);
} catch (error) {
  console.error('Error:', error);
}
```

## 🔹 Writing Files

### writeFile() - Overwrites file
```js
const fs = require('fs');

fs.writeFile('output.txt', 'Hello World!', (err) => {
  if (err) throw err;
  console.log('File written successfully');
});

// With promises
const fs = require('fs').promises;

await fs.writeFile('output.txt', 'Hello World!');
```

### appendFile() - Appends to file
```js
const fs = require('fs');

fs.appendFile('log.txt', 'New log entry\n', (err) => {
  if (err) throw err;
  console.log('Data appended');
});
```

## 🔹 Checking File/Directory Existence

```js
const fs = require('fs');

// Check if exists
fs.access('file.txt', fs.constants.F_OK, (err) => {
  if (err) {
    console.log('File does not exist');
  } else {
    console.log('File exists');
  }
});

// With promises
const fs = require('fs').promises;

try {
  await fs.access('file.txt');
  console.log('File exists');
} catch {
  console.log('File does not exist');
}

// Using existsSync (synchronous)
if (fs.existsSync('file.txt')) {
  console.log('File exists');
}
```

## 🔹 File Information

```js
const fs = require('fs');

fs.stat('file.txt', (err, stats) => {
  if (err) throw err;
  
  console.log('Is file:', stats.isFile());
  console.log('Is directory:', stats.isDirectory());
  console.log('Size:', stats.size, 'bytes');
  console.log('Created:', stats.birthtime);
  console.log('Modified:', stats.mtime);
});
```

## 🔹 Deleting Files

```js
const fs = require('fs');

// Delete file
fs.unlink('file.txt', (err) => {
  if (err) throw err;
  console.log('File deleted');
});

// With promises
await fs.promises.unlink('file.txt');
```

## 🔹 Renaming/Moving Files

```js
const fs = require('fs');

fs.rename('old-name.txt', 'new-name.txt', (err) => {
  if (err) throw err;
  console.log('File renamed');
});

// Move to different directory
fs.rename('file.txt', 'backup/file.txt', (err) => {
  if (err) throw err;
  console.log('File moved');
});
```

## 🔹 Working with Directories

### Create Directory
```js
const fs = require('fs');

// Create single directory
fs.mkdir('new-folder', (err) => {
  if (err) throw err;
  console.log('Directory created');
});

// Create nested directories
fs.mkdir('path/to/nested/folder', { recursive: true }, (err) => {
  if (err) throw err;
  console.log('Nested directories created');
});
```

### Read Directory
```js
const fs = require('fs');

fs.readdir('.', (err, files) => {
  if (err) throw err;
  console.log('Files:', files);
});

// With file types
fs.readdir('.', { withFileTypes: true }, (err, entries) => {
  if (err) throw err;
  
  entries.forEach(entry => {
    console.log(entry.name, entry.isDirectory() ? '(dir)' : '(file)');
  });
});
```

### Remove Directory
```js
const fs = require('fs');

// Remove empty directory
fs.rmdir('folder', (err) => {
  if (err) throw err;
  console.log('Directory removed');
});

// Remove directory and contents (Node 14.14+)
fs.rm('folder', { recursive: true, force: true }, (err) => {
  if (err) throw err;
  console.log('Directory and contents removed');
});
```

## 🔹 Copying Files

```js
const fs = require('fs');

fs.copyFile('source.txt', 'destination.txt', (err) => {
  if (err) throw err;
  console.log('File copied');
});

// Copy directory recursively (Node 16+)
const fs = require('fs').promises;

await fs.cp('source-dir', 'dest-dir', { recursive: true });
```

## 🔹 Watching Files

```js
const fs = require('fs');

// Watch file for changes
fs.watch('file.txt', (eventType, filename) => {
  console.log(`Event: ${eventType}`);
  console.log(`File: ${filename}`);
});

// Watch with more control
const watcher = fs.watch('folder', { recursive: true }, (eventType, filename) => {
  console.log(`${filename} changed: ${eventType}`);
});

// Stop watching
watcher.close();
```

## 🔹 Streams (for large files)

### Read Stream
```js
const fs = require('fs');

const readStream = fs.createReadStream('large-file.txt', 'utf8');

readStream.on('data', (chunk) => {
  console.log('Chunk:', chunk);
});

readStream.on('end', () => {
  console.log('Finished reading');
});

readStream.on('error', (err) => {
  console.error('Error:', err);
});
```

### Write Stream
```js
const fs = require('fs');

const writeStream = fs.createWriteStream('output.txt');

writeStream.write('Line 1\n');
writeStream.write('Line 2\n');
writeStream.end('Final line\n');

writeStream.on('finish', () => {
  console.log('Finished writing');
});
```

### Pipe Streams
```js
const fs = require('fs');

const readStream = fs.createReadStream('input.txt');
const writeStream = fs.createWriteStream('output.txt');

readStream.pipe(writeStream);

writeStream.on('finish', () => {
  console.log('File copied using streams');
});
```

## 💡 Tips

- Use **async methods** (callbacks/promises) to avoid blocking
- Use **streams** for large files to save memory
- Always handle **errors** properly
- Use **path.join()** for cross-platform file paths
- Check if file exists before reading/deleting

## 🧩 Example: Read JSON File

```js
const fs = require('fs').promises;

async function readJSON(filename) {
  try {
    const data = await fs.readFile(filename, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON:', error);
    return null;
  }
}

async function writeJSON(filename, data) {
  try {
    await fs.writeFile(filename, JSON.stringify(data, null, 2));
    console.log('JSON written successfully');
  } catch (error) {
    console.error('Error writing JSON:', error);
  }
}

// Usage
const users = await readJSON('users.json');
await writeJSON('backup.json', users);
```

## 🧩 Example: List All Files Recursively

```js
const fs = require('fs').promises;
const path = require('path');

async function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = await fs.readdir(dirPath, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file.name);
    
    if (file.isDirectory()) {
      arrayOfFiles = await getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }
  
  return arrayOfFiles;
}

// Usage
const allFiles = await getAllFiles('./src');
console.log(allFiles);
```

## ⚠️ Common Mistakes

❌ **Using sync methods in production**
```js
const data = fs.readFileSync('file.txt'); // Blocks entire server!
```

✅ **Use async methods:**
```js
const data = await fs.promises.readFile('file.txt');
```

❌ **Not handling errors**
```js
fs.readFile('file.txt', (err, data) => {
  console.log(data); // May be undefined if error!
});
```

✅ **Always check for errors:**
```js
fs.readFile('file.txt', (err, data) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log(data);
});
```

## 🔗 See Also

- [Path Module](./path-module.md)
- [Streams](./streams.md)
- [Server](./server.md)
