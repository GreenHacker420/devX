# Express Interview Questions

Common Express.js interview questions.

## 🔹 What is Express.js?

**Answer:** Express is a minimal and flexible Node.js web application framework that provides features for web and mobile applications.

## 🔹 What is middleware in Express?

**Answer:** Middleware functions have access to req, res, and next. They can execute code, modify req/res, end the cycle, or call next middleware.

## 🔹 What is the difference between app.use() and app.get()?

**Answer:**
- `app.use()`: Mounts middleware for all HTTP methods
- `app.get()`: Handles only GET requests

## 🔹 What is Express Router?

**Answer:** Router is a mini Express application for organizing routes into modules.

```js
const router = express.Router();
router.get('/users', handler);
module.exports = router;
```

## 🔹 How do you handle errors in Express?

**Answer:** Use error-handling middleware with 4 parameters (err, req, res, next).

```js
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

## 🔹 What is body-parser?

**Answer:** Body-parser is middleware that parses incoming request bodies. Now built into Express as `express.json()` and `express.urlencoded()`.

## 🔹 How do you serve static files?

**Answer:** Use `express.static()` middleware.

```js
app.use(express.static('public'));
```

## 🔹 What is template engine?

**Answer:** Template engines like EJS, Pug, or Handlebars allow you to generate HTML dynamically.

## 🔹 How do you handle async errors?

**Answer:** Wrap async functions in try/catch or use an async wrapper.

```js
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

## 🔗 See Also

- [Prisma Questions](./prisma-questions.md)
- [Auth Questions](./auth-questions.md)
