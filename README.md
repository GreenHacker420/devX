# 📘 DevDocsX

> **Complete offline documentation for JavaScript, Node.js, Express, Prisma, and Auth — all in one NPM package!**

DevDocsX is an NPM package that installs comprehensive, example-rich documentation for backend development. Perfect for quick reference before exams, interviews, or while coding offline.

## 🚀 Installation

```bash
npm install devdocsx
```

## 📖 Usage

### Option 1: Browse Files Directly

After installation, navigate to the docs folder:

```bash
cd node_modules/devdocsx/docs
```

All documentation is organized in markdown files:

```
docs/
├── javascript/      # JS fundamentals
├── node/            # Node.js core modules
├── express/         # Express framework
├── prisma/          # Prisma ORM
├── auth/            # Authentication
├── interview/       # Interview questions
└── cheatsheets/     # Quick references
```

### Option 2: CLI Tool

Read documentation directly in your terminal:

```bash
npx devdocsx javascript/arrays
npx devdocsx express/middleware
npx devdocsx prisma/crud
npx devdocsx auth/jwt
npx devdocsx cheatsheets/javascript
```

## 📚 What's Included

### JavaScript
- **Core Concepts**: Arrays, Objects, Functions, Promises, Async/Await
- **Advanced**: Closures, Prototypes, Classes
- **Methods**: Array Methods, Object Methods, String Methods

### Node.js
- **Modules**: Server, FS, Path, Events, OS, Streams
- **Examples**: HTTP servers, file operations, event handling

### Express
- **Basics**: Setup, Routing, Middleware
- **Advanced**: Error Handling, Cookie Parser, Auth Flow
- **Best Practices**: Security, validation, async handling

### Prisma
- **Setup**: Installation, schema, migrations
- **Operations**: CRUD, Filters, Relations, Transactions
- **Advanced**: Pagination, complex queries

### Authentication
- **Methods**: JWT, Session, Bcrypt
- **Security**: Cookies, Token Verification, Best Practices
- **Examples**: Complete auth flows

### Interview Prep
- JavaScript Questions
- Backend Questions
- Express Questions
- Prisma Questions
- Auth Questions

### Cheatsheets
- JavaScript Quick Reference
- Node.js Quick Reference
- Express Quick Reference
- Prisma Quick Reference
- Auth Quick Reference

## 🎯 Perfect For

- 📝 **Exam Preparation**: Quick revision before tests
- 💼 **Interview Prep**: Common questions and answers
- 🚀 **Project Reference**: Copy-paste ready examples
- 📚 **Learning**: Structured, example-rich content
- ✈️ **Offline Access**: No internet required

## 🌟 Features

- ✅ **Comprehensive**: Covers all essential topics
- ✅ **Example-Rich**: Real-world code examples
- ✅ **Offline**: Works without internet
- ✅ **Well-Organized**: Easy to navigate
- ✅ **CLI Access**: Read docs in terminal
- ✅ **Copy-Paste Ready**: Production-ready code
- ✅ **Interview Questions**: Common Q&A included
- ✅ **Cheatsheets**: Quick reference guides

## 📂 Documentation Structure

```
devdocsx/
├── docs/
│   ├── javascript/
│   │   ├── arrays.md
│   │   ├── objects.md
│   │   ├── functions.md
│   │   ├── promises.md
│   │   ├── async-await.md
│   │   ├── closures.md
│   │   ├── prototypes.md
│   │   ├── classes.md
│   │   ├── array-methods.md
│   │   ├── object-methods.md
│   │   └── string-methods.md
│   │
│   ├── node/
│   │   ├── server.md
│   │   ├── fs-module.md
│   │   ├── path-module.md
│   │   ├── events.md
│   │   ├── os-module.md
│   │   └── streams.md
│   │
│   ├── express/
│   │   ├── setup.md
│   │   ├── routing.md
│   │   ├── middleware.md
│   │   ├── error-handling.md
│   │   ├── cookie-parser.md
│   │   └── auth-flow.md
│   │
│   ├── prisma/
│   │   ├── setup.md
│   │   ├── schema.md
│   │   ├── crud.md
│   │   ├── filters.md
│   │   ├── relations.md
│   │   ├── transactions.md
│   │   └── pagination.md
│   │
│   ├── auth/
│   │   ├── jwt.md
│   │   ├── session.md
│   │   ├── bcrypt.md
│   │   ├── cookies.md
│   │   ├── token-verification.md
│   │   └── best-practices.md
│   │
│   ├── interview/
│   │   ├── javascript-questions.md
│   │   ├── backend-questions.md
│   │   ├── express-questions.md
│   │   ├── prisma-questions.md
│   │   └── auth-questions.md
│   │
│   └── cheatsheets/
│       ├── javascript.md
│       ├── node.md
│       ├── express.md
│       ├── prisma.md
│       └── auth.md
│
├── cli/
│   └── index.js
├── package.json
└── README.md
```

## 💡 Examples

### Quick Reference
```bash
# View JavaScript array methods
npx devdocsx javascript/array-methods

# Learn Express middleware
npx devdocsx express/middleware

# Prisma CRUD operations
npx devdocsx prisma/crud

# JWT authentication
npx devdocsx auth/jwt
```

### Browse in VS Code
```bash
code node_modules/devdocsx/docs
```

### Open Specific File
```bash
# macOS
open node_modules/devdocsx/docs/javascript/arrays.md

# Linux
xdg-open node_modules/devdocsx/docs/javascript/arrays.md

# Windows
start node_modules/devdocsx/docs/javascript/arrays.md
```

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new topics
- Improve existing documentation
- Add more examples

## 📝 License

MIT © Harsh Hirawat

## 🙏 Acknowledgments

Created with ❤️ for developers who want quick, offline access to quality documentation.

---

**Happy Coding! 🚀**

For questions or suggestions, please open an issue on GitHub.
