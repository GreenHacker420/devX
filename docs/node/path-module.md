# Node.js Path Module

The `path` module provides utilities for working with file and directory paths.

## 🔹 Joining Paths

### path.join() - Join path segments
```js
const path = require('path');

const fullPath = path.join('/users', 'john', 'documents', 'file.txt');
console.log(fullPath); // /users/john/documents/file.txt

// Handles .. and .
const normalized = path.join('/users', 'john', '..', 'jane', 'file.txt');
console.log(normalized); // /users/jane/file.txt

// Common use: build paths relative to current file
const filePath = path.join(__dirname, 'data', 'users.json');
```

### path.resolve() - Resolve to absolute path
```js
const path = require('path');

// Resolves to absolute path
console.log(path.resolve('file.txt'));
// /current/working/directory/file.txt

console.log(path.resolve('/users', 'john', 'file.txt'));
// /users/john/file.txt

console.log(path.resolve('users', 'john', 'file.txt'));
// /current/working/directory/users/john/file.txt
```

## 🔹 Path Information

### path.basename() - Get filename
```js
const path = require('path');

const filename = path.basename('/users/john/file.txt');
console.log(filename); // file.txt

// Remove extension
const name = path.basename('/users/john/file.txt', '.txt');
console.log(name); // file
```

### path.dirname() - Get directory name
```js
const path = require('path');

const dir = path.dirname('/users/john/file.txt');
console.log(dir); // /users/john
```

### path.extname() - Get file extension
```js
const path = require('path');

const ext = path.extname('file.txt');
console.log(ext); // .txt

const ext2 = path.extname('archive.tar.gz');
console.log(ext2); // .gz
```

### path.parse() - Parse path into object
```js
const path = require('path');

const parsed = path.parse('/users/john/file.txt');
console.log(parsed);
// {
//   root: '/',
//   dir: '/users/john',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file'
// }
```

### path.format() - Build path from object
```js
const path = require('path');

const pathObj = {
  root: '/',
  dir: '/users/john',
  base: 'file.txt'
};

const fullPath = path.format(pathObj);
console.log(fullPath); // /users/john/file.txt
```

## 🔹 Path Normalization

### path.normalize() - Normalize path
```js
const path = require('path');

const messy = '/users//john/../jane/./file.txt';
const clean = path.normalize(messy);
console.log(clean); // /users/jane/file.txt
```

## 🔹 Relative Paths

### path.relative() - Get relative path
```js
const path = require('path');

const from = '/users/john/documents';
const to = '/users/john/pictures/photo.jpg';

const relative = path.relative(from, to);
console.log(relative); // ../pictures/photo.jpg
```

## 🔹 Path Checking

### path.isAbsolute() - Check if absolute
```js
const path = require('path');

console.log(path.isAbsolute('/users/john')); // true
console.log(path.isAbsolute('users/john'));  // false
console.log(path.isAbsolute('../file.txt')); // false
```

## 🔹 Platform-Specific

### path.sep - Path separator
```js
const path = require('path');

console.log(path.sep); // '/' on Unix, '\' on Windows

// Split path by separator
const parts = '/users/john/file.txt'.split(path.sep);
console.log(parts); // ['', 'users', 'john', 'file.txt']
```

### path.delimiter - PATH delimiter
```js
const path = require('path');

console.log(path.delimiter); // ':' on Unix, ';' on Windows

// Split PATH environment variable
const paths = process.env.PATH.split(path.delimiter);
```

### Platform-specific paths
```js
const path = require('path');

// Force Windows-style paths
console.log(path.win32.join('users', 'john', 'file.txt'));
// users\john\file.txt

// Force POSIX-style paths
console.log(path.posix.join('users', 'john', 'file.txt'));
// users/john/file.txt
```

## 🔹 Special Paths

### __dirname - Current directory
```js
console.log(__dirname); // /path/to/current/directory
```

### __filename - Current file
```js
console.log(__filename); // /path/to/current/directory/file.js
```

### process.cwd() - Working directory
```js
console.log(process.cwd()); // /path/where/node/was/started
```

## 💡 Tips

- Always use **path.join()** instead of string concatenation
- Use **__dirname** for paths relative to current file
- Use **process.cwd()** for paths relative to where Node was started
- **path.join()** vs **path.resolve()**: join preserves relative paths, resolve makes absolute
- Path module handles cross-platform differences automatically

## 🧩 Example: Common Path Operations

```js
const path = require('path');

// Get project root (assuming we're in src/utils/helper.js)
const projectRoot = path.join(__dirname, '..', '..');

// Build path to config file
const configPath = path.join(projectRoot, 'config', 'database.json');

// Build path to uploads folder
const uploadsDir = path.join(projectRoot, 'public', 'uploads');

// Get file info
const filePath = '/users/john/documents/report.pdf';
console.log('Directory:', path.dirname(filePath));
console.log('Filename:', path.basename(filePath));
console.log('Extension:', path.extname(filePath));
console.log('Name only:', path.basename(filePath, path.extname(filePath)));
```

## 🧩 Example: File Upload Path Builder

```js
const path = require('path');
const fs = require('fs').promises;

async function saveUploadedFile(file, uploadDir) {
  // Ensure upload directory exists
  await fs.mkdir(uploadDir, { recursive: true });
  
  // Generate safe filename
  const ext = path.extname(file.originalname);
  const basename = path.basename(file.originalname, ext);
  const timestamp = Date.now();
  const safeFilename = `${basename}-${timestamp}${ext}`;
  
  // Build full path
  const fullPath = path.join(uploadDir, safeFilename);
  
  // Save file
  await fs.writeFile(fullPath, file.buffer);
  
  return {
    filename: safeFilename,
    path: fullPath,
    relativePath: path.relative(process.cwd(), fullPath)
  };
}

// Usage
const result = await saveUploadedFile(
  { originalname: 'photo.jpg', buffer: Buffer.from('...') },
  path.join(__dirname, 'uploads')
);
```

## 🧩 Example: Find Project Root

```js
const path = require('path');
const fs = require('fs');

function findProjectRoot(startPath = __dirname) {
  let currentPath = startPath;
  
  while (currentPath !== path.parse(currentPath).root) {
    const packageJsonPath = path.join(currentPath, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      return currentPath;
    }
    
    currentPath = path.dirname(currentPath);
  }
  
  return null;
}

const projectRoot = findProjectRoot();
console.log('Project root:', projectRoot);
```

## ⚠️ Common Mistakes

❌ **Using string concatenation for paths**
```js
const filePath = __dirname + '/data/users.json'; // Wrong on Windows!
```

✅ **Use path.join():**
```js
const filePath = path.join(__dirname, 'data', 'users.json');
```

❌ **Hardcoding path separators**
```js
const parts = filePath.split('/'); // Breaks on Windows!
```

✅ **Use path.sep:**
```js
const parts = filePath.split(path.sep);
```

❌ **Confusing __dirname and process.cwd()**
```js
// If you run: node src/app.js from project root
console.log(__dirname);    // /project/src (where file is)
console.log(process.cwd()); // /project (where node was started)
```

## 🔗 See Also

- [FS Module](./fs-module.md)
- [OS Module](./os-module.md)
- [Server](./server.md)
