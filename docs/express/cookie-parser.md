# Express Cookie Parser

The `cookie-parser` middleware parses cookies attached to client requests.

## 🔹 Installation

```bash
npm install cookie-parser
```

## 🔹 Basic Setup

```js
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

// Use cookie parser
app.use(cookieParser());

app.get('/', (req, res) => {
  console.log('Cookies:', req.cookies);
  res.send('Check console for cookies');
});
```

## 🔹 Setting Cookies

```js
app.get('/set-cookie', (req, res) => {
  // Simple cookie
  res.cookie('username', 'john');
  
  // Cookie with options
  res.cookie('userId', '123', {
    maxAge: 900000,    // 15 minutes in milliseconds
    httpOnly: true,    // Not accessible via JavaScript
    secure: true,      // Only sent over HTTPS
    sameSite: 'strict' // CSRF protection
  });
  
  res.send('Cookies set');
});
```

## 🔹 Reading Cookies

```js
app.get('/get-cookie', (req, res) => {
  const username = req.cookies.username;
  const userId = req.cookies.userId;
  
  res.json({ username, userId });
});
```

## 🔹 Deleting Cookies

```js
app.get('/clear-cookie', (req, res) => {
  // Clear specific cookie
  res.clearCookie('username');
  
  // Clear with same options used when setting
  res.clearCookie('userId', {
    httpOnly: true,
    secure: true
  });
  
  res.send('Cookies cleared');
});
```

## 🔹 Signed Cookies

```js
const cookieParser = require('cookie-parser');

// Use secret for signing
app.use(cookieParser('your-secret-key'));

// Set signed cookie
app.get('/set-signed', (req, res) => {
  res.cookie('user', 'john', { signed: true });
  res.send('Signed cookie set');
});

// Read signed cookie
app.get('/get-signed', (req, res) => {
  const user = req.signedCookies.user;
  res.json({ user });
});
```

## 🔹 Cookie Options

```js
res.cookie('name', 'value', {
  maxAge: 900000,        // Expires in milliseconds
  expires: new Date(Date.now() + 900000), // Expires at specific date
  httpOnly: true,        // Not accessible via JavaScript
  secure: true,          // Only sent over HTTPS
  sameSite: 'strict',    // 'strict', 'lax', or 'none'
  domain: '.example.com', // Cookie domain
  path: '/',             // Cookie path
  signed: true           // Sign the cookie
});
```

## 💡 Tips

- Use **httpOnly** to prevent XSS attacks
- Use **secure** in production (HTTPS only)
- Use **sameSite** to prevent CSRF attacks
- **Sign cookies** for tamper protection
- Set appropriate **maxAge** or **expires**

## 🧩 Example: Session Cookie

```js
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser('secret-key'));

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Verify credentials (simplified)
  if (username === 'admin' && password === 'password') {
    res.cookie('sessionId', 'abc123', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
      signed: true
    });
    
    res.json({ message: 'Logged in' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected route
app.get('/profile', (req, res) => {
  const sessionId = req.signedCookies.sessionId;
  
  if (!sessionId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  res.json({ user: 'admin' });
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('sessionId');
  res.json({ message: 'Logged out' });
});
```

## 🔗 See Also

- [Auth Flow](./auth-flow.md)
- [Middleware](./middleware.md)
