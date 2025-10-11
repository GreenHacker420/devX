# Advanced Middleware

Advanced middleware patterns and techniques for Express.js.

## 🔹 Custom Authentication Middleware

### JWT Authentication Middleware

```js
const jwt = require('jsonwebtoken');

function authenticateJWT(options = {}) {
  const { secret = process.env.JWT_SECRET, algorithms = ['HS256'] } = options;
  
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    
    try {
      const decoded = jwt.verify(token, secret, { algorithms });
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ error: 'Invalid token' });
    }
  };
}

// Usage
app.get('/protected', authenticateJWT(), (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});
```

### Role-Based Access Control

```js
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const hasRole = allowedRoles.some(role => req.user.roles?.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.roles
      });
    }
    
    next();
  };
}

// Usage
app.delete('/users/:id', 
  authenticateJWT(),
  requireRole('admin', 'moderator'),
  (req, res) => {
    res.json({ message: 'User deleted' });
  }
);
```

### API Key Authentication

```js
function authenticateAPIKey(options = {}) {
  const { header = 'X-API-Key', validKeys = [] } = options;
  
  return (req, res, next) => {
    const apiKey = req.headers[header.toLowerCase()];
    
    if (!apiKey) {
      return res.status(401).json({ error: 'API key required' });
    }
    
    if (!validKeys.includes(apiKey)) {
      return res.status(403).json({ error: 'Invalid API key' });
    }
    
    req.apiKey = apiKey;
    next();
  };
}

// Usage
const validKeys = ['key1', 'key2', 'key3'];
app.use('/api', authenticateAPIKey({ validKeys }));
```

## 🔹 Rate Limiting Middleware

### Simple Rate Limiter

```js
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = new Map();
  }
  
  middleware() {
    return (req, res, next) => {
      const key = req.ip;
      const now = Date.now();
      
      if (!this.requests.has(key)) {
        this.requests.set(key, []);
      }
      
      const userRequests = this.requests.get(key);
      
      // Remove old requests outside the window
      const validRequests = userRequests.filter(time => now - time < this.windowMs);
      
      if (validRequests.length >= this.maxRequests) {
        const oldestRequest = Math.min(...validRequests);
        const retryAfter = Math.ceil((this.windowMs - (now - oldestRequest)) / 1000);
        
        res.setHeader('Retry-After', retryAfter);
        return res.status(429).json({ 
          error: 'Too many requests',
          retryAfter: `${retryAfter} seconds`
        });
      }
      
      validRequests.push(now);
      this.requests.set(key, validRequests);
      
      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', this.maxRequests - validRequests.length);
      
      next();
    };
  }
}

// Usage: 100 requests per 15 minutes
const limiter = new RateLimiter(100, 15 * 60 * 1000);
app.use('/api', limiter.middleware());
```

### Token Bucket Rate Limiter

```js
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate; // tokens per second
    this.lastRefill = Date.now();
  }
  
  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const tokensToAdd = elapsed * this.refillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
  
  consume(tokens = 1) {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    
    return false;
  }
}

function tokenBucketLimiter(capacity, refillRate) {
  const buckets = new Map();
  
  return (req, res, next) => {
    const key = req.ip;
    
    if (!buckets.has(key)) {
      buckets.set(key, new TokenBucket(capacity, refillRate));
    }
    
    const bucket = buckets.get(key);
    
    if (bucket.consume()) {
      res.setHeader('X-RateLimit-Remaining', Math.floor(bucket.tokens));
      next();
    } else {
      res.status(429).json({ error: 'Rate limit exceeded' });
    }
  };
}

// Usage: 10 tokens, refill 1 token per second
app.use('/api', tokenBucketLimiter(10, 1));
```

## 🔹 Caching Middleware

### Response Caching

```js
class ResponseCache {
  constructor(ttl = 60000) {
    this.cache = new Map();
    this.ttl = ttl;
  }
  
  middleware() {
    return (req, res, next) => {
      // Only cache GET requests
      if (req.method !== 'GET') {
        return next();
      }
      
      const key = req.originalUrl;
      const cached = this.cache.get(key);
      
      if (cached && Date.now() - cached.timestamp < this.ttl) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cached.data);
      }
      
      // Override res.json to cache response
      const originalJson = res.json.bind(res);
      
      res.json = (data) => {
        this.cache.set(key, {
          data,
          timestamp: Date.now()
        });
        res.setHeader('X-Cache', 'MISS');
        return originalJson(data);
      };
      
      next();
    };
  }
  
  clear(pattern) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }
}

// Usage
const cache = new ResponseCache(5 * 60 * 1000); // 5 minutes
app.use('/api', cache.middleware());

// Clear cache on updates
app.post('/api/users', (req, res) => {
  // Create user...
  cache.clear('/api/users');
  res.json({ message: 'User created' });
});
```

### ETag Caching

```js
const crypto = require('crypto');

function etagCache() {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);
    
    res.json = (data) => {
      const content = JSON.stringify(data);
      const etag = crypto.createHash('md5').update(content).digest('hex');
      
      res.setHeader('ETag', etag);
      
      if (req.headers['if-none-match'] === etag) {
        return res.status(304).end();
      }
      
      return originalJson(data);
    };
    
    next();
  };
}

app.use('/api', etagCache());
```

## 🔹 Request Validation Middleware

### Schema Validation

```js
function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];
      
      if (rules.required && !value) {
        errors.push(`${field} is required`);
        continue;
      }
      
      if (value) {
        if (rules.type && typeof value !== rules.type) {
          errors.push(`${field} must be ${rules.type}`);
        }
        
        if (rules.min && value.length < rules.min) {
          errors.push(`${field} must be at least ${rules.min} characters`);
        }
        
        if (rules.max && value.length > rules.max) {
          errors.push(`${field} must be at most ${rules.max} characters`);
        }
        
        if (rules.pattern && !rules.pattern.test(value)) {
          errors.push(`${field} format is invalid`);
        }
        
        if (rules.enum && !rules.enum.includes(value)) {
          errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
        }
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    next();
  };
}

// Usage
const userSchema = {
  email: {
    required: true,
    type: 'string',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    type: 'string',
    min: 8,
    max: 100
  },
  role: {
    type: 'string',
    enum: ['user', 'admin', 'moderator']
  }
};

app.post('/register', validateBody(userSchema), (req, res) => {
  res.json({ message: 'User registered' });
});
```

### Sanitization Middleware

```js
function sanitizeInput() {
  return (req, res, next) => {
    const sanitize = (obj) => {
      if (typeof obj === 'string') {
        return obj.trim()
          .replace(/[<>]/g, '') // Remove < and >
          .replace(/javascript:/gi, ''); // Remove javascript:
      }
      
      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      }
      
      if (obj && typeof obj === 'object') {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
          sanitized[key] = sanitize(value);
        }
        return sanitized;
      }
      
      return obj;
    };
    
    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);
    
    next();
  };
}

app.use(sanitizeInput());
```

## 🔹 Logging Middleware

### Advanced Request Logger

```js
const fs = require('fs');
const path = require('path');

class RequestLogger {
  constructor(options = {}) {
    this.logFile = options.logFile || 'requests.log';
    this.logLevel = options.logLevel || 'info';
    this.stream = fs.createWriteStream(this.logFile, { flags: 'a' });
  }
  
  middleware() {
    return (req, res, next) => {
      const startTime = Date.now();
      
      // Log request
      this.log('info', {
        type: 'request',
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
      });
      
      // Capture response
      const originalSend = res.send.bind(res);
      
      res.send = (body) => {
        const duration = Date.now() - startTime;
        
        this.log('info', {
          type: 'response',
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString()
        });
        
        return originalSend(body);
      };
      
      next();
    };
  }
  
  log(level, data) {
    const logEntry = JSON.stringify({ level, ...data }) + '\n';
    this.stream.write(logEntry);
  }
  
  close() {
    this.stream.end();
  }
}

// Usage
const logger = new RequestLogger({ logFile: 'app.log' });
app.use(logger.middleware());
```

### Performance Monitoring

```js
function performanceMonitor(options = {}) {
  const { slowThreshold = 1000 } = options;
  
  return (req, res, next) => {
    const startTime = process.hrtime.bigint();
    const startMemory = process.memoryUsage();
    
    res.on('finish', () => {
      const endTime = process.hrtime.bigint();
      const duration = Number(endTime - startTime) / 1000000; // Convert to ms
      const endMemory = process.memoryUsage();
      
      const memoryDelta = {
        heapUsed: endMemory.heapUsed - startMemory.heapUsed,
        external: endMemory.external - startMemory.external
      };
      
      const logData = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration.toFixed(2)}ms`,
        memory: {
          heapUsed: `${(memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`,
          external: `${(memoryDelta.external / 1024 / 1024).toFixed(2)}MB`
        }
      };
      
      if (duration > slowThreshold) {
        console.warn('⚠️ Slow request:', logData);
      } else {
        console.log('✓ Request:', logData);
      }
    });
    
    next();
  };
}

app.use(performanceMonitor({ slowThreshold: 500 }));
```

## 🔹 Error Handling Middleware

### Async Error Handler

```js
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Usage
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  res.json(user);
}));
```

### Custom Error Classes

```js
class AppError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

// Error handler middleware
function errorHandler(err, req, res, next) {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
        ...(err.errors && { errors: err.errors })
      }
    });
  }
  
  // Programming or unknown errors
  console.error('💥 ERROR:', err);
  
  res.status(500).json({
    error: {
      message: 'Internal server error',
      code: 'INTERNAL_ERROR'
    }
  });
}

app.use(errorHandler);

// Usage
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    throw new NotFoundError('User');
  }
  
  res.json(user);
}));
```

## 🔹 Request Context Middleware

### Request ID Tracking

```js
const crypto = require('crypto');

function requestId() {
  return (req, res, next) => {
    const id = req.headers['x-request-id'] || crypto.randomUUID();
    req.id = id;
    res.setHeader('X-Request-ID', id);
    next();
  };
}

app.use(requestId());
```

### Request Context Storage

```js
const { AsyncLocalStorage } = require('async_hooks');

const requestContext = new AsyncLocalStorage();

function contextMiddleware() {
  return (req, res, next) => {
    const context = {
      requestId: crypto.randomUUID(),
      user: null,
      startTime: Date.now()
    };
    
    requestContext.run(context, () => {
      req.context = context;
      next();
    });
  };
}

function getContext() {
  return requestContext.getStore();
}

// Usage
app.use(contextMiddleware());

app.get('/test', (req, res) => {
  const context = getContext();
  res.json({ requestId: context.requestId });
});
```

## 🔹 Compression Middleware

### Smart Compression

```js
const zlib = require('zlib');

function smartCompress(options = {}) {
  const { threshold = 1024, level = 6 } = options;
  
  return (req, res, next) => {
    const acceptEncoding = req.headers['accept-encoding'] || '';
    
    if (!acceptEncoding.includes('gzip')) {
      return next();
    }
    
    const originalSend = res.send.bind(res);
    
    res.send = (body) => {
      if (typeof body !== 'string' || body.length < threshold) {
        return originalSend(body);
      }
      
      zlib.gzip(body, { level }, (err, compressed) => {
        if (err) {
          return originalSend(body);
        }
        
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Length', compressed.length);
        res.removeHeader('Content-Length'); // Let Express set it
        
        return originalSend(compressed);
      });
    };
    
    next();
  };
}

app.use(smartCompress({ threshold: 2048 }));
```

## 🔗 See Also

- [Middleware Basics](./middleware.md)
- [Error Handling](./error-handling.md)
- [Routing](./routing.md)
