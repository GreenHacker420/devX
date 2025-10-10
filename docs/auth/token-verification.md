# Token Verification

Verifying and validating authentication tokens.

## 🔹 JWT Verification Middleware

```js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Get token from header or cookie
  const token = req.cookies.token || 
                req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};
```

## 🔹 Role-Based Verification

```js
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Usage
app.get('/admin', verifyToken, checkRole(['admin']), (req, res) => {
  res.json({ message: 'Admin access' });
});
```

## 🔹 Token Refresh

```js
app.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token' });
  }
  
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    
    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    res.cookie('token', newAccessToken, { httpOnly: true });
    res.json({ message: 'Token refreshed' });
  } catch (error) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
});
```

## 🔗 See Also

- [JWT](./jwt.md)
- [Best Practices](./best-practices.md)
