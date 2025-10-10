# Session-Based Authentication

Session-based auth stores user state on the server.

## 🔹 Installation

```bash
npm install express-session
```

## 🔹 Basic Setup

```js
const express = require('express');
const session = require('express-session');

const app = express();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));
```

## 🔹 Login

```js
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  req.session.userId = user.id;
  req.session.email = user.email;
  
  res.json({ message: 'Logged in successfully' });
});
```

## 🔹 Logout

```js
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});
```

## 🔹 Auth Middleware

```js
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  next();
};

app.get('/profile', requireAuth, (req, res) => {
  res.json({ userId: req.session.userId });
});
```

## 🔗 See Also

- [JWT](./jwt.md)
- [Cookies](./cookies.md)
