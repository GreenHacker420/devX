# Sample Good First Issues for Hacktoberfest 2025

Copy these to create GitHub issues and attract contributors!

---

## Issue 1: Fix Typos in JavaScript Documentation

**Title:** [good first issue] Fix typos in JavaScript array methods documentation

**Description:**
There are a few typos in the `docs/javascript/array-methods.md` file that need to be corrected.

**What needs to be done:**
- Review the file for spelling and grammatical errors
- Fix any typos found
- Ensure code examples are still correct

**Files to check:**
- `docs/javascript/array-methods.md`

**Labels:** `documentation`, `good first issue`, `hacktoberfest`

---

## Issue 2: Add More Examples to Express Middleware

**Title:** [good first issue] Add practical examples to Express middleware documentation

**Description:**
The middleware documentation could use more real-world examples to help beginners understand better.

**What needs to be done:**
- Add 2-3 more practical middleware examples
- Include use cases like request logging, timing, user agent detection
- Ensure examples are tested and working
- Add comments explaining each part

**Files to edit:**
- `docs/express/middleware.md`

**Labels:** `documentation`, `good first issue`, `enhancement`, `hacktoberfest`

---

## Issue 3: Create TypeScript Basics Documentation

**Title:** [new topic] Create TypeScript basics documentation

**Description:**
We need basic TypeScript documentation for developers transitioning from JavaScript.

**What needs to be done:**
- Create `docs/typescript/` directory
- Create `basics.md` with:
  - What is TypeScript
  - Basic types (string, number, boolean, etc.)
  - Interfaces
  - Type inference
  - Practical examples
- Follow our documentation template

**Labels:** `documentation`, `new topic`, `help wanted`, `hacktoberfest`

---

## Issue 4: Add Output Examples to Code Snippets

**Title:** [good first issue] Add output examples to Prisma CRUD operations

**Description:**
Many code examples in the Prisma CRUD documentation don't show the expected output. This makes it harder for learners to understand what to expect.

**What needs to be done:**
- Add output examples after code blocks
- Use this format:
  ```javascript
  // Code example
  const user = await prisma.user.findMany();
  console.log(user);
  ```
  
  **Output:**
  ```json
  [{ id: 1, name: "John", email: "john@example.com" }]
  ```

**Files to edit:**
- `docs/prisma/crud.md`

**Labels:** `documentation`, `good first issue`, `enhancement`, `hacktoberfest`

---

## Issue 5: Create a Cheatsheet for Git Commands

**Title:** [good first issue] Create Git commands cheatsheet

**Description:**
Add a Git commands cheatsheet to help developers with common Git operations.

**What needs to be done:**
- Create `docs/cheatsheets/git.md`
- Include common commands:
  - clone, add, commit, push, pull
  - branch, merge, checkout
  - status, log, diff
  - stash, reset, revert
- Add brief descriptions and examples
- Organize by category

**Labels:** `documentation`, `cheatsheet`, `good first issue`, `hacktoberfest`

---

## Issue 6: Add Interview Questions for TypeScript

**Title:** [help wanted] Add TypeScript interview questions

**Description:**
We're expanding our interview questions section to include TypeScript.

**What needs to be done:**
- Create `docs/interview/typescript-questions.md`
- Add 15-20 common TypeScript interview questions
- Include detailed answers with examples
- Cover topics like:
  - Types vs Interfaces
  - Generics
  - Type guards
  - Utility types
  - Decorators

**Labels:** `documentation`, `interview`, `help wanted`, `hacktoberfest`

---

## Issue 7: Improve Error Handling Examples

**Title:** [enhancement] Add more error handling patterns to Express documentation

**Description:**
The error handling documentation could be enhanced with more patterns and best practices.

**What needs to be done:**
- Add try-catch examples
- Add async/await error handling
- Add custom error classes
- Add error handling middleware examples
- Add common error scenarios (404, 500, validation errors)

**Files to edit:**
- `docs/express/error-handling.md`

**Labels:** `documentation`, `enhancement`, `help wanted`, `hacktoberfest`

---

## Issue 8: Create MongoDB/Mongoose Documentation

**Title:** [new topic] Create MongoDB with Mongoose documentation

**Description:**
Add comprehensive MongoDB and Mongoose documentation as an alternative to Prisma.

**What needs to be done:**
- Create `docs/mongodb/` directory
- Create multiple files:
  - `setup.md` - Installation and connection
  - `schemas.md` - Schema definition
  - `crud.md` - CRUD operations
  - `queries.md` - Advanced queries
  - `relationships.md` - Relationships and population
- Include practical examples
- Add to main README

**Labels:** `documentation`, `new topic`, `help wanted`, `hacktoberfest`

---

## Issue 9: Add Code Comments to Advanced Topics

**Title:** [good first issue] Add explanatory comments to async/await examples

**Description:**
The advanced async/await documentation has code examples that could use more inline comments to help learners understand.

**What needs to be done:**
- Review `docs/javascript/async-await.adv.md`
- Add comments explaining complex parts
- Ensure beginners can follow along
- Don't over-comment obvious things

**Files to edit:**
- `docs/javascript/async-await.adv.md`

**Labels:** `documentation`, `good first issue`, `enhancement`, `hacktoberfest`

---

## Issue 10: Create CLI Search Feature

**Title:** [feature] Add search functionality to CLI tool

**Description:**
The CLI tool would benefit from a search feature to help users find documentation quickly.

**What needs to be done:**
- Add a search command: `devdocx search <query>`
- Search through all markdown files
- Return list of files containing the query
- Highlight matches
- Make it case-insensitive

**Files to edit:**
- `cli/index.js`

**Labels:** `enhancement`, `cli`, `help wanted`, `hacktoberfest`

---

## How to Use These

1. Go to your repository's Issues page
2. Click "New Issue"
3. Copy the content from above
4. Add appropriate labels
5. Publish the issue

Remember to:
- ✅ Add `hacktoberfest` label
- ✅ Add difficulty labels (`good first issue`, `help wanted`)
- ✅ Add type labels (`documentation`, `enhancement`, `bug`)
- ✅ Be welcoming and clear in issue descriptions
- ✅ Respond to questions promptly

---

*These are just templates! Modify them based on your actual needs and create many more!*
