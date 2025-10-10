# Bcrypt Password Hashing

Bcrypt is a password hashing function designed to be slow and resistant to brute-force attacks.

## 🔹 Installation

```bash
npm install bcrypt
```

## 🔹 Hashing a Password

```js
const bcrypt = require('bcrypt');

const password = 'myPassword123';
const saltRounds = 10;

// Async (recommended)
const hashedPassword = await bcrypt.hash(password, saltRounds);
console.log(hashedPassword);

// Sync
const hashedPasswordSync = bcrypt.hashSync(password, saltRounds);
```

## 🔹 Comparing Passwords

```js
const bcrypt = require('bcrypt');

const password = 'myPassword123';
const hashedPassword = '$2b$10$...'; // From database

// Async
const isMatch = await bcrypt.compare(password, hashedPassword);
console.log(isMatch); // true or false

// Sync
const isMatchSync = bcrypt.compareSync(password, hashedPassword);
```

## 🔹 Registration Example

```js
const bcrypt = require('bcrypt');

app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
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
      email,
      password: hashedPassword
    });
    
    res.status(201).json({ 
      message: 'User created',
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});
```

## 🔹 Login Example

```js
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Compare password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token or create session
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
    
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});
```

## 🔹 Salt Rounds

```js
// Salt rounds determine computational cost
const saltRounds = 10; // Recommended (2^10 iterations)

// Higher = more secure but slower
const saltRounds = 12; // Very secure
const saltRounds = 14; // Extremely secure (slow)
```

## 💡 Tips

- Use **10-12 salt rounds** for good balance
- Always use **async** methods in production
- Never store **plain text** passwords
- Use **bcrypt.compare()** for verification
- Don't reveal if email or password is wrong

## 🔗 See Also

- [JWT](./jwt.md)
- [Session](./session.md)
- [Best Practices](./best-practices.md)
