# Backend Interview Questions

Common backend development interview questions.

## 🔹 What is REST API?

**Answer:** REST (Representational State Transfer) is an architectural style for designing networked applications. It uses HTTP methods (GET, POST, PUT, DELETE) to perform CRUD operations.

## 🔹 What are HTTP methods?

**Answer:**
- **GET**: Retrieve data
- **POST**: Create new resource
- **PUT**: Update entire resource
- **PATCH**: Update partial resource
- **DELETE**: Remove resource

## 🔹 What are status codes?

**Answer:**
- **2xx**: Success (200 OK, 201 Created)
- **3xx**: Redirection (301 Moved, 304 Not Modified)
- **4xx**: Client error (400 Bad Request, 404 Not Found, 401 Unauthorized)
- **5xx**: Server error (500 Internal Server Error)

## 🔹 What is middleware?

**Answer:** Middleware functions have access to request and response objects and can modify them or end the request-response cycle.

```js
app.use((req, res, next) => {
  console.log('Middleware');
  next();
});
```

## 🔹 What is CORS?

**Answer:** CORS (Cross-Origin Resource Sharing) is a security feature that controls which domains can access your API.

## 🔹 What is JWT?

**Answer:** JWT (JSON Web Token) is a compact token format for securely transmitting information between parties as a JSON object.

## 🔹 What is the difference between authentication and authorization?

**Answer:**
- **Authentication**: Verifying who you are (login)
- **Authorization**: Verifying what you can access (permissions)

## 🔹 What is a database transaction?

**Answer:** A transaction is a sequence of database operations that are treated as a single unit. Either all succeed or all fail (ACID properties).

## 🔹 What is SQL injection?

**Answer:** SQL injection is a security vulnerability where attackers inject malicious SQL code. Prevent it using parameterized queries.

## 🔹 What is rate limiting?

**Answer:** Rate limiting restricts the number of requests a client can make in a given time period to prevent abuse.

## 🔗 See Also

- [JavaScript Questions](./javascript-questions.md)
- [Express Questions](./express-questions.md)
