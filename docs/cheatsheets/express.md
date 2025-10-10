# Express Cheatsheet

Quick reference for Express.js essentials.

## 🚀 Setup

```js
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => console.log('Server running'));
```

## 🛤️ Routing

```js
app.get('/path', (req, res) => {});
app.post('/path', (req, res) => {});
app.put('/path', (req, res) => {});
app.delete('/path', (req, res) => {});
app.patch('/path', (req, res) => {});

// Parameters
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
});

// Query
app.get('/search', (req, res) => {
  const { q } = req.query; // ?q=value
});
```

## 📨 Request

```js
req.params        // URL parameters
req.query         // Query string
req.body          // Request body
req.headers       // Headers
req.cookies       // Cookies
req.method        // HTTP method
req.url           // Request URL
```

## 📤 Response

```js
res.send('text')
res.json({ key: 'value' })
res.status(404).send('Not Found')
res.redirect('/path')
res.sendFile('/path/to/file')
res.cookie('name', 'value')
res.clearCookie('name')
```

## 🔧 Middleware

```js
// Application-level
app.use((req, res, next) => {
  console.log('Middleware');
  next();
});

// Router-level
const router = express.Router();
router.use(middleware);

// Error handling
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

## 📁 Router

```js
const router = express.Router();

router.get('/', handler);
router.post('/', handler);

app.use('/api', router);
```

## 🔗 See Also

- [Routing](../express/routing.md)
- [Middleware](../express/middleware.md)
