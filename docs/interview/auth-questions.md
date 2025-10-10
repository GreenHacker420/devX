# Authentication Interview Questions

Common authentication and security interview questions.

## 🔹 What is JWT?

**Answer:** JWT (JSON Web Token) is a compact, URL-safe token format for securely transmitting information. It consists of header, payload, and signature.

## 🔹 What is the difference between JWT and session-based auth?

**Answer:**
- **JWT**: Stateless, token stored on client, scalable
- **Session**: Stateful, session stored on server, requires session store

## 🔹 What is bcrypt?

**Answer:** Bcrypt is a password hashing function designed to be slow and resistant to brute-force attacks.

## 🔹 What is the difference between authentication and authorization?

**Answer:**
- **Authentication**: Verifying identity (who you are)
- **Authorization**: Verifying permissions (what you can do)

## 🔹 What is CSRF?

**Answer:** CSRF (Cross-Site Request Forgery) is an attack that tricks users into performing unwanted actions. Prevent with CSRF tokens and SameSite cookies.

## 🔹 What is XSS?

**Answer:** XSS (Cross-Site Scripting) is injecting malicious scripts into web pages. Prevent with input validation and httpOnly cookies.

## 🔹 What is OAuth?

**Answer:** OAuth is an authorization framework that allows third-party applications to access user data without exposing passwords.

## 🔹 What is a refresh token?

**Answer:** A long-lived token used to obtain new access tokens without requiring re-authentication.

## 🔹 What are httpOnly cookies?

**Answer:** Cookies that cannot be accessed via JavaScript, preventing XSS attacks.

## 🔹 What is password salting?

**Answer:** Adding random data to passwords before hashing to prevent rainbow table attacks.

## 🔗 See Also

- [Backend Questions](./backend-questions.md)
- [Best Practices](../auth/best-practices.md)
