# Auth Cheatsheet

Quick reference for authentication essentials.

## 🔐 Bcrypt

```js
const bcrypt = require('bcrypt');

// Hash password
const hash = await bcrypt.hash(password, 10);

// Compare password
const isValid = await bcrypt.compare(password, hash);
```

## 🎫 JWT

```js
const jwt = require('jsonwebtoken');

// Sign token
const token = jwt.sign(
  { userId: 123 },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

## 🍪 Cookies

```js
// Set cookie
res.cookie('token', value, {
  httpOnly: true,
  secure: true,
  maxAge: 24 * 60 * 60 * 1000
});

// Read cookie
const token = req.cookies.token;

// Clear cookie
res.clearCookie('token');
```

## 🔒 Middleware

```js
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};
```

## 📝 Register

```js
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  
  const hash = await bcrypt.hash(password, 10);
  
  const user = await User.create({
    email,
    password: hash
  });
  
  res.status(201).json({ user });
});
```

## 🔑 Login

```js
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid' });
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: 'Invalid' });
  
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  
  res.json({ token });
});
```

## 🔗 See Also

- [JWT](../auth/jwt.md)
- [Bcrypt](../auth/bcrypt.md)
- [Best Practices](../auth/best-practices.md)
