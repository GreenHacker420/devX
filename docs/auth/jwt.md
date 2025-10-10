# JWT (JSON Web Tokens)

JWT is a compact, URL-safe means of representing claims between two parties.

## 🔹 Installation

```bash
npm install jsonwebtoken
```

## 🔹 Creating a Token

```js
const jwt = require('jsonwebtoken');

const payload = {
  userId: 123,
  email: 'user@example.com',
  role: 'admin'
};

const token = jwt.sign(payload, 'your-secret-key', {
  expiresIn: '24h'
});

console.log(token);
```

## 🔹 Verifying a Token

```js
const jwt = require('jsonwebtoken');

try {
  const decoded = jwt.verify(token, 'your-secret-key');
  console.log(decoded);
  // { userId: 123, email: 'user@example.com', role: 'admin', iat: ..., exp: ... }
} catch (error) {
  console.error('Invalid token:', error.message);
}
```

## 🔹 Token Options

```js
const token = jwt.sign(payload, secret, {
  expiresIn: '24h',           // '1h', '7d', '30m', etc.
  issuer: 'myapp',            // Token issuer
  audience: 'myapp-users',    // Intended audience
  algorithm: 'HS256'          // Signing algorithm
});
```

## 🔹 Decoding Without Verification

```js
const decoded = jwt.decode(token);
// Returns payload without verifying signature
```

## 🔹 Refresh Tokens

```js
function generateTokens(userId) {
  const accessToken = jwt.sign(
    { userId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
}

function refreshAccessToken(refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );
    return newAccessToken;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
}
```

## 🔹 Middleware for Express

```js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
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

// Usage
app.get('/protected', verifyToken, (req, res) => {
  res.json({ user: req.user });
});
```

## 💡 Tips

- Store secret in **environment variables**
- Use short expiration for **access tokens** (15-30 min)
- Use longer expiration for **refresh tokens** (7-30 days)
- Never expose secrets in client-side code
- Use **HTTPS** in production

## 🧩 Example: Complete Auth System

```js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ token, user: { id: user.id, email: user.email } });
});

// Protected route
app.get('/profile', verifyToken, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.json({ user });
});
```

## 🔗 See Also

- [Bcrypt](./bcrypt.md)
- [Session](./session.md)
- [Cookies](./cookies.md)
