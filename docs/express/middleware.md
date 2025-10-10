# Express Middleware

Middleware functions have access to the request object (req), response object (res), and the next middleware function (next).

## 🔹 What is Middleware?

Middleware functions can:
- Execute any code
- Modify request and response objects
- End the request-response cycle
- Call the next middleware in the stack

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Pass control to next middleware
});
```

## 🔹 Application-Level Middleware

```js
const express = require('express');
const app = express();

// Runs for all routes
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});

// Runs for specific path
app.use('/api', (req, res, next) => {
  console.log('API request');
  next();
});

app.get('/', (req, res) => {
  res.send('Home');
});
```

## 🔹 Router-Level Middleware

```js
const express = require('express');
const router = express.Router();

// Middleware for this router
router.use((req, res, next) => {
  console.log('Router middleware');
  next();
});

// Middleware for specific route
router.use('/users/:id', (req, res, next) => {
  console.log('User ID:', req.params.id);
  next();
});

router.get('/users/:id', (req, res) => {
  res.send('User page');
});

module.exports = router;
```

## 🔹 Built-in Middleware

```js
const express = require('express');
const app = express();

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Serve from specific path
app.use('/static', express.static('public'));
```

## 🔹 Third-Party Middleware

### CORS
```js
const cors = require('cors');
app.use(cors());
```

### Morgan (Logging)
```js
const morgan = require('morgan');
app.use(morgan('dev'));
```

### Cookie Parser
```js
const cookieParser = require('cookie-parser');
app.use(cookieParser());
```

### Helmet (Security)
```js
const helmet = require('helmet');
app.use(helmet());
```

## 🔹 Custom Middleware

### Logger Middleware
```js
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

app.use(logger);
```

### Authentication Middleware
```js
const verifyAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Use on specific routes
app.get('/api/protected', verifyAuth, (req, res) => {
  res.json({ user: req.user });
});
```

### Request ID Middleware
```js
const { v4: uuidv4 } = require('uuid');

const requestId = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
};

app.use(requestId);
```

### Validation Middleware
```js
const validateUser = (req, res, next) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ 
      error: 'Name and email are required' 
    });
  }
  
  if (!email.includes('@')) {
    return res.status(400).json({ 
      error: 'Invalid email format' 
    });
  }
  
  next();
};

app.post('/api/users', validateUser, (req, res) => {
  // User data is valid
  res.json({ message: 'User created' });
});
```

## 🔹 Error-Handling Middleware

```js
// Must have 4 parameters (err, req, res, next)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});
```

## 🔹 Middleware Execution Order

```js
const express = require('express');
const app = express();

// 1. First middleware
app.use((req, res, next) => {
  console.log('1');
  next();
});

// 2. Second middleware
app.use((req, res, next) => {
  console.log('2');
  next();
});

// 3. Route handler
app.get('/', (req, res) => {
  console.log('3');
  res.send('Done');
});

// 4. This won't run (response already sent)
app.use((req, res, next) => {
  console.log('4');
  next();
});
```

## 🔹 Conditional Middleware

```js
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
};

app.get('/admin', checkRole('admin'), (req, res) => {
  res.send('Admin panel');
});

app.get('/moderator', checkRole('moderator'), (req, res) => {
  res.send('Moderator panel');
});
```

## 💡 Tips

- Always call **next()** unless ending the response
- Error-handling middleware must have **4 parameters**
- Middleware order matters - they execute in sequence
- Use **return** when sending response in middleware
- Create reusable middleware functions

## 🧩 Example: Complete Middleware Setup

```js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security
app.use(helmet());

// CORS
app.use(cors());

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running',
    requestTime: req.requestTime
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

app.listen(3000);
```

## 🧩 Example: Rate Limiting Middleware

```js
const rateLimit = new Map();

const rateLimiter = (limit = 100, window = 60000) => {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    if (!rateLimit.has(ip)) {
      rateLimit.set(ip, { count: 1, resetTime: now + window });
      return next();
    }
    
    const data = rateLimit.get(ip);
    
    if (now > data.resetTime) {
      data.count = 1;
      data.resetTime = now + window;
      return next();
    }
    
    if (data.count >= limit) {
      return res.status(429).json({ 
        error: 'Too many requests' 
      });
    }
    
    data.count++;
    next();
  };
};

app.use(rateLimiter(100, 60000)); // 100 requests per minute
```

## ⚠️ Common Mistakes

❌ **Forgetting to call next()**
```js
app.use((req, res, next) => {
  console.log('Middleware');
  // Forgot next()! Request hangs
});
```

✅ **Always call next():**
```js
app.use((req, res, next) => {
  console.log('Middleware');
  next();
});
```

❌ **Calling next() after sending response**
```js
app.use((req, res, next) => {
  res.send('Done');
  next(); // Error!
});
```

✅ **Return after response:**
```js
app.use((req, res, next) => {
  return res.send('Done');
});
```

## 🔗 See Also

- [Routing](./routing.md)
- [Error Handling](./error-handling.md)
- [Auth Flow](./auth-flow.md)
