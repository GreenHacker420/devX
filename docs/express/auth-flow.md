# Express Authentication Flow

Complete authentication flow with JWT tokens and cookies.

## 🔹 Setup

```bash
npm install jsonwebtoken bcrypt cookie-parser
```

## 🔹 User Registration

```js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });
    
    res.status(201).json({
      message: 'User created successfully',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});
```

## 🔹 User Login

```js
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    res.json({
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});
```

## 🔹 Authentication Middleware

```js
const verifyToken = (req, res, next) => {
  // Get token from cookie or header
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Protected route
app.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});
```

## 🔹 Logout

```js
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});
```

## 🔹 Refresh Token

```js
app.post('/refresh', verifyToken, (req, res) => {
  const newToken = jwt.sign(
    { userId: req.user.userId, email: req.user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.cookie('token', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000
  });
  
  res.json({ message: 'Token refreshed' });
});
```

## 🔹 Role-Based Access

```js
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Admin only route
app.get('/admin', verifyToken, checkRole(['admin']), (req, res) => {
  res.json({ message: 'Admin panel' });
});

// Admin or moderator
app.get('/moderate', verifyToken, checkRole(['admin', 'moderator']), (req, res) => {
  res.json({ message: 'Moderation panel' });
});
```

## 💡 Tips

- **Never** store passwords in plain text
- Use **bcrypt** with salt rounds >= 10
- Store JWT in **httpOnly cookies** for security
- Set appropriate **token expiration**
- Use **HTTPS** in production
- Implement **refresh tokens** for better UX

## 🧩 Example: Complete Auth System

```js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

// Middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Register
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  // Save user to database
  res.status(201).json({ message: 'User created' });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // Find user
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
  
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.cookie('token', token, { httpOnly: true });
  res.json({ message: 'Logged in' });
});

// Protected route
app.get('/profile', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});
```

## 🔗 See Also

- [JWT](../auth/jwt.md)
- [Bcrypt](../auth/bcrypt.md)
- [Cookies](../auth/cookies.md)
