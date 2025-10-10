# Authentication Best Practices

Security best practices for authentication systems.

## 🔹 Password Security

✅ **Do:**
- Hash passwords with bcrypt (10+ rounds)
- Enforce strong password requirements
- Use HTTPS for all auth endpoints
- Implement rate limiting on login
- Use password reset tokens with expiration

❌ **Don't:**
- Store passwords in plain text
- Use weak hashing (MD5, SHA1)
- Send passwords in URLs
- Log passwords
- Reveal if email or password is wrong

## 🔹 Token Security

✅ **Do:**
- Store JWT secret in environment variables
- Use short expiration for access tokens (15-30 min)
- Implement refresh tokens
- Use httpOnly cookies for tokens
- Validate tokens on every request

❌ **Don't:**
- Store tokens in localStorage (XSS risk)
- Use long-lived access tokens
- Expose secrets in client code
- Trust client-side validation

## 🔹 Session Security

✅ **Do:**
- Use secure session stores (Redis, database)
- Set httpOnly and secure flags
- Implement session timeout
- Regenerate session ID after login
- Use CSRF protection

❌ **Don't:**
- Use default session secrets
- Store sensitive data in sessions
- Allow unlimited session duration

## 🔹 General Security

✅ **Do:**
- Use HTTPS in production
- Implement rate limiting
- Validate all input
- Use parameterized queries (prevent SQL injection)
- Log authentication events
- Implement account lockout after failed attempts
- Use 2FA for sensitive accounts

❌ **Don't:**
- Trust user input
- Expose error details to users
- Use predictable tokens
- Skip input validation

## 🧩 Example: Secure Login

```js
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts'
});

app.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  // Find user
  const user = await User.findOne({ email });
  
  // Generic error message
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Check if account is locked
  if (user.locked) {
    return res.status(403).json({ error: 'Account locked' });
  }
  
  // Generate token
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  // Set secure cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000
  });
  
  res.json({ message: 'Logged in' });
});
```

## 🔗 See Also

- [JWT](./jwt.md)
- [Bcrypt](./bcrypt.md)
- [Token Verification](./token-verification.md)
