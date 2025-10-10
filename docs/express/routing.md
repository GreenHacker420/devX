# Express Routing

Routing refers to how an application responds to client requests at specific endpoints (URIs).

## 🔹 Basic Routes

```js
const express = require('express');
const app = express();

// GET request
app.get('/', (req, res) => {
  res.send('GET request to homepage');
});

// POST request
app.post('/api/users', (req, res) => {
  res.send('POST request to /api/users');
});

// PUT request
app.put('/api/users/:id', (req, res) => {
  res.send(`PUT request to update user ${req.params.id}`);
});

// DELETE request
app.delete('/api/users/:id', (req, res) => {
  res.send(`DELETE request for user ${req.params.id}`);
});

// PATCH request
app.patch('/api/users/:id', (req, res) => {
  res.send(`PATCH request for user ${req.params.id}`);
});
```

## 🔹 Route Parameters

```js
// Single parameter
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ userId });
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});

// Optional parameter (using ?)
app.get('/users/:id?', (req, res) => {
  if (req.params.id) {
    res.json({ userId: req.params.id });
  } else {
    res.json({ message: 'All users' });
  }
});
```

## 🔹 Query Parameters

```js
// GET /search?q=express&limit=10
app.get('/search', (req, res) => {
  const { q, limit } = req.query;
  res.json({ 
    query: q, 
    limit: limit || 20 
  });
});

// Multiple values: /filter?tags=node&tags=express
app.get('/filter', (req, res) => {
  const tags = req.query.tags; // ['node', 'express']
  res.json({ tags });
});
```

## 🔹 Route Handlers

### Multiple handlers
```js
const checkAuth = (req, res, next) => {
  console.log('Checking auth...');
  next();
};

const getUser = (req, res) => {
  res.json({ user: 'Alice' });
};

app.get('/profile', checkAuth, getUser);

// Array of handlers
app.get('/admin', [checkAuth, checkAdmin, getAdminData]);
```

### Chaining route handlers
```js
app.route('/users')
  .get((req, res) => {
    res.json({ message: 'Get all users' });
  })
  .post((req, res) => {
    res.json({ message: 'Create user' });
  });

app.route('/users/:id')
  .get((req, res) => {
    res.json({ message: `Get user ${req.params.id}` });
  })
  .put((req, res) => {
    res.json({ message: `Update user ${req.params.id}` });
  })
  .delete((req, res) => {
    res.json({ message: `Delete user ${req.params.id}` });
  });
```

## 🔹 Express Router

### routes/userRoutes.js
```js
const express = require('express');
const router = express.Router();

// GET /api/users
router.get('/', (req, res) => {
  res.json({ users: [] });
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  res.json({ user: { id: req.params.id } });
});

// POST /api/users
router.post('/', (req, res) => {
  res.json({ message: 'User created' });
});

// PUT /api/users/:id
router.put('/:id', (req, res) => {
  res.json({ message: 'User updated' });
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
  res.json({ message: 'User deleted' });
});

module.exports = router;
```

### app.js
```js
const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
```

## 🔹 Nested Routers

```js
const express = require('express');
const router = express.Router();

// Nested router for posts
const postRouter = express.Router({ mergeParams: true });

postRouter.get('/', (req, res) => {
  const { userId } = req.params;
  res.json({ message: `Posts for user ${userId}` });
});

postRouter.get('/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});

// Mount nested router
router.use('/:userId/posts', postRouter);

module.exports = router;
```

## 🔹 Response Methods

```js
app.get('/examples', (req, res) => {
  // Send string
  res.send('Hello');
  
  // Send JSON
  res.json({ message: 'Hello' });
  
  // Send status
  res.sendStatus(200); // Sends "OK"
  
  // Set status and send
  res.status(404).send('Not Found');
  res.status(201).json({ created: true });
  
  // Redirect
  res.redirect('/new-url');
  res.redirect(301, '/permanent-url');
  
  // Send file
  res.sendFile('/path/to/file.pdf');
  
  // Download file
  res.download('/path/to/file.pdf', 'custom-name.pdf');
  
  // Render template
  res.render('index', { title: 'Home' });
});
```

## 🔹 Regular Expressions in Routes

```js
// Match /users/123 but not /users/abc
app.get('/users/:id(\\d+)', (req, res) => {
  res.json({ userId: req.params.id });
});

// Match paths ending with 'fly'
app.get(/.*fly$/, (req, res) => {
  res.send('Matches butterfly, dragonfly, etc.');
});
```

## 💡 Tips

- Use **Express Router** for modular route organization
- Use **route parameters** for dynamic values
- Use **query parameters** for filtering/pagination
- Chain route handlers for cleaner code
- Use **res.json()** for API responses

## 🧩 Example: RESTful API Routes

```js
const express = require('express');
const router = express.Router();

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// GET all users
router.get('/', (req, res) => {
  res.json(users);
});

// GET single user
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// POST create user
router.post('/', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT update user
router.put('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  user.name = req.body.name;
  res.json(user);
});

// DELETE user
router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  users.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
```

## ⚠️ Common Mistakes

❌ **Not returning after sending response**
```js
app.get('/user/:id', (req, res) => {
  if (!user) {
    res.status(404).send('Not found');
    // Code continues!
  }
  res.json(user); // Error: Can't set headers after sent
});
```

✅ **Use return:**
```js
app.get('/user/:id', (req, res) => {
  if (!user) {
    return res.status(404).send('Not found');
  }
  res.json(user);
});
```

## 🔗 See Also

- [Middleware](./middleware.md)
- [Error Handling](./error-handling.md)
- [Setup](./setup.md)
