# Express Setup

Express is a minimal and flexible Node.js web application framework.

## 🔹 Installation

```bash
# Initialize project
npm init -y

# Install Express
npm install express

# Install dev dependencies
npm install --save-dev nodemon
```

## 🔹 Basic Server

```js
const express = require('express');
const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## 🔹 Project Structure

```
my-app/
├── node_modules/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   └── app.js
├── package.json
└── .env
```

## 🔹 Basic Setup with Middleware

```js
const express = require('express');
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static('public')); // Serve static files

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

app.get('/api/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob'] });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🔹 Environment Variables

### .env file
```
PORT=3000
DATABASE_URL=mongodb://localhost:27017/mydb
JWT_SECRET=your-secret-key
```

### Using dotenv
```bash
npm install dotenv
```

```js
require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DATABASE_URL;

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});
```

## 🔹 Modular App Structure

### src/app.js
```js
const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
```

### src/server.js
```js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### package.json scripts
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

## 🔹 CORS Setup

```bash
npm install cors
```

```js
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors());

// Or configure CORS
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));

// Or for specific routes
app.get('/api/public', cors(), (req, res) => {
  res.json({ message: 'Public endpoint' });
});
```

## 🔹 Morgan (Logging)

```bash
npm install morgan
```

```js
const express = require('express');
const morgan = require('morgan');
const app = express();

// Development logging
app.use(morgan('dev'));

// Production logging
app.use(morgan('combined'));

// Custom format
app.use(morgan(':method :url :status :response-time ms'));
```

## 🔹 Helmet (Security)

```bash
npm install helmet
```

```js
const express = require('express');
const helmet = require('helmet');
const app = express();

// Use helmet for security headers
app.use(helmet());
```

## 💡 Tips

- Use **environment variables** for sensitive data
- Use **nodemon** for development (auto-restart)
- Structure your app into **modules** (routes, controllers, etc.)
- Use **middleware** for common functionality
- Enable **CORS** if building an API for frontend apps

## 🧩 Example: Complete Setup

```js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging
app.use(morgan('dev'));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

## ⚠️ Common Mistakes

❌ **Not using environment variables**
```js
const PORT = 3000; // Hardcoded!
```

✅ **Use process.env:**
```js
const PORT = process.env.PORT || 3000;
```

❌ **Forgetting body parsing middleware**
```js
app.post('/api/data', (req, res) => {
  console.log(req.body); // undefined!
});
```

✅ **Add express.json():**
```js
app.use(express.json());
```

## 🔗 See Also

- [Routing](./routing.md)
- [Middleware](./middleware.md)
- [Error Handling](./error-handling.md)
