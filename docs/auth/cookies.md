# Cookies in Authentication

Cookies are small pieces of data stored in the browser and sent with every request.

## 🔹 Setting Cookies

```js
res.cookie('token', 'abc123', {
  maxAge: 900000,    // 15 minutes
  httpOnly: true,    // Not accessible via JavaScript
  secure: true,      // Only sent over HTTPS
  sameSite: 'strict' // CSRF protection
});
```

## 🔹 Reading Cookies

```js
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/profile', (req, res) => {
  const token = req.cookies.token;
  res.json({ token });
});
```

## 🔹 Clearing Cookies

```js
res.clearCookie('token');
```

## 🔹 Signed Cookies

```js
app.use(cookieParser('secret-key'));

// Set signed cookie
res.cookie('user', 'john', { signed: true });

// Read signed cookie
const user = req.signedCookies.user;
```

## 🔹 Cookie Options

```js
res.cookie('name', 'value', {
  maxAge: 900000,        // Expires in ms
  expires: new Date(...), // Expires at date
  httpOnly: true,        // Not accessible via JS
  secure: true,          // HTTPS only
  sameSite: 'strict',    // 'strict', 'lax', 'none'
  domain: '.example.com', // Cookie domain
  path: '/',             // Cookie path
  signed: true           // Sign cookie
});
```

## 💡 Tips

- Use **httpOnly** to prevent XSS
- Use **secure** in production (HTTPS)
- Use **sameSite** to prevent CSRF
- Sign cookies for tamper protection

## 🔗 See Also

- [JWT](./jwt.md)
- [Session](./session.md)
