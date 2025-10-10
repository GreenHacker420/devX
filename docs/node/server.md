# Node.js HTTP Server

Creating HTTP servers with Node.js built-in `http` module.

## 🔹 Basic HTTP Server

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
```

## 🔹 Handling Different Routes

```js
const http = require('http');

const server = http.createServer((req, res) => {
  const { method, url } = req;
  
  if (url === '/' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Home Page</h1>');
  } 
  else if (url === '/about' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>About Page</h1>');
  } 
  else if (url === '/api/users' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ users: ['Alice', 'Bob'] }));
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## 🔹 Handling POST Requests

```js
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/api/data' && req.method === 'POST') {
    let body = '';
    
    // Collect data chunks
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    // When all data received
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('Received:', data);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          message: 'Data received', 
          data 
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000);
```

## 🔹 Serving Static Files

```js
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Build file path
  let filePath = path.join(__dirname, 'public', 
    req.url === '/' ? 'index.html' : req.url
  );
  
  // Get file extension
  const extname = path.extname(filePath);
  
  // Set content type
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg'
  };
  
  const contentType = contentTypes[extname] || 'text/plain';
  
  // Read and serve file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end('File not found');
      } else {
        res.writeHead(500);
        res.end('Server error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(3000);
```

## 🔹 Request Object Properties

```js
const server = http.createServer((req, res) => {
  console.log('Method:', req.method);        // GET, POST, etc.
  console.log('URL:', req.url);              // /path?query=value
  console.log('Headers:', req.headers);      // Request headers
  console.log('HTTP Version:', req.httpVersion); // 1.1
  
  // Parse URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log('Pathname:', url.pathname);    // /path
  console.log('Query:', url.searchParams);   // URLSearchParams
  
  res.end('Check console');
});
```

## 🔹 Response Object Methods

```js
const server = http.createServer((req, res) => {
  // Set status code
  res.statusCode = 200;
  
  // Set single header
  res.setHeader('Content-Type', 'application/json');
  
  // Set multiple headers
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value'
  });
  
  // Write response body
  res.write('First chunk\n');
  res.write('Second chunk\n');
  
  // End response
  res.end('Final chunk');
});
```

## 🔹 HTTPS Server

```js
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

const server = https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('Secure connection!');
});

server.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});
```

## 🔹 Server Events

```js
const server = http.createServer();

server.on('request', (req, res) => {
  res.end('Hello!');
});

server.on('connection', (socket) => {
  console.log('New connection established');
});

server.on('close', () => {
  console.log('Server closed');
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

server.listen(3000);
```

## 💡 Tips

- Use **Express** for production apps (much easier than raw http module)
- Always set proper **Content-Type** headers
- Handle errors properly (404, 500, etc.)
- Use **HTTPS** in production
- Consider using **process.env.PORT** for port configuration

## 🧩 Example: Simple REST API

```js
const http = require('http');

let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

const server = http.createServer((req, res) => {
  const { method, url } = req;
  
  // GET all users
  if (url === '/api/users' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  }
  
  // GET single user
  else if (url.match(/\/api\/users\/\d+/) && method === 'GET') {
    const id = parseInt(url.split('/')[3]);
    const user = users.find(u => u.id === id);
    
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'User not found' }));
    }
  }
  
  // POST new user
  else if (url === '/api/users' && method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const newUser = JSON.parse(body);
      newUser.id = users.length + 1;
      users.push(newUser);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  }
  
  else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('API running on port 3000');
});
```

## ⚠️ Common Mistakes

❌ **Not ending the response**
```js
const server = http.createServer((req, res) => {
  res.write('Hello'); // Response never ends!
});
```

✅ **Always call res.end():**
```js
const server = http.createServer((req, res) => {
  res.write('Hello');
  res.end(); // or res.end('Hello');
});
```

❌ **Not handling errors**
```js
req.on('data', chunk => {
  const data = JSON.parse(chunk); // May throw error!
});
```

✅ **Use try/catch:**
```js
req.on('data', chunk => {
  try {
    const data = JSON.parse(chunk);
  } catch (error) {
    res.writeHead(400);
    res.end('Invalid JSON');
  }
});
```

## 🔗 See Also

- [FS Module](./fs-module.md)
- [Path Module](./path-module.md)
- [Events](./events.md)
- [Express Setup](../express/setup.md)
