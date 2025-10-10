# Express Error Handling

Proper error handling ensures your application responds gracefully to errors.

## 🔹 Basic Error Handling

```js
app.get('/user/:id', (req, res, next) => {
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});
```

## 🔹 Error-Handling Middleware

```js
// Must have 4 parameters: err, req, res, next
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});
```

## 🔹 Throwing Errors

```js
app.get('/user/:id', (req, res, next) => {
  try {
    const user = getUser(req.params.id);
    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }
    res.json(user);
  } catch (error) {
    next(error); // Pass to error handler
  }
});
```

## 🔹 Async Error Handling

```js
// Without wrapper (error not caught!)
app.get('/users', async (req, res) => {
  const users = await User.findAll(); // If this fails, app crashes!
  res.json(users);
});

// With try/catch
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

// With async wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get('/users', asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
}));
```

## 🔹 Custom Error Classes

```js
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

// Usage
app.get('/user/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

## 🔹 Centralized Error Handler

```js
const errorHandler = (err, req, res, next) => {
  // Log error
  console.error('Error:', err);
  
  // Default to 500
  let status = err.status || 500;
  let message = err.message || 'Internal Server Error';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }
  
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }
  
  if (err.code === 11000) { // MongoDB duplicate key
    status = 409;
    message = 'Duplicate entry';
  }
  
  // Send response
  res.status(status).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { 
        stack: err.stack,
        details: err 
      })
    }
  });
};

app.use(errorHandler);
```

## 🔹 404 Handler

```js
// Place before error handler
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Or throw error
app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});
```

## 🔹 Validation Errors

```js
const validateUser = (req, res, next) => {
  const errors = [];
  
  if (!req.body.name) {
    errors.push('Name is required');
  }
  
  if (!req.body.email) {
    errors.push('Email is required');
  } else if (!req.body.email.includes('@')) {
    errors.push('Invalid email format');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  
  next();
};

app.post('/users', validateUser, (req, res) => {
  res.json({ message: 'User created' });
});
```

## 💡 Tips

- Always use **try/catch** with async functions
- Use **next(error)** to pass errors to error handler
- Error handler must have **4 parameters**
- Place error handler **after all routes**
- Don't expose sensitive error details in production

## 🧩 Example: Complete Error Handling

```js
const express = require('express');
const app = express();

// Custom error class
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Async wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes
app.get('/user/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json(user);
}));

// 404 handler
app.use((req, res, next) => {
  throw new AppError('Route not found', 404);
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`[${status}] ${message}`);
  
  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(3000);
```

## ⚠️ Common Mistakes

❌ **Not catching async errors**
```js
app.get('/users', async (req, res) => {
  const users = await User.findAll(); // Crashes if error!
  res.json(users);
});
```

✅ **Use try/catch or wrapper:**
```js
app.get('/users', async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});
```

## 🔗 See Also

- [Middleware](./middleware.md)
- [Routing](./routing.md)
