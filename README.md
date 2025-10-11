# 📘 DevdocX

[![npm version](https://img.shields.io/npm/v/@greenhacker420/devdocx.svg)](https://www.npmjs.com/package/@greenhacker420/devdocx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Hacktoberfest](https://img.shields.io/badge/Hacktoberfest-2025-blueviolet)](https://hacktoberfest.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Contributors](https://img.shields.io/github/contributors/GreenHacker420/devdocx.svg)](https://github.com/GreenHacker420/devdocx/graphs/contributors)

> **Complete offline documentation for JavaScript, Node.js, Express, Prisma, and Auth — all in one NPM package!**

devdocx is an NPM package that installs comprehensive, example-rich documentation for backend development. Perfect for quick reference before exams, interviews, or while coding offline.

## 🎃 Hacktoberfest 2025

**We're participating in Hacktoberfest 2025!** 🎉

This is a great opportunity to contribute to open source and help improve documentation for developers worldwide. Whether you're fixing a typo or adding comprehensive new topics, all contributions are welcome!

### How to Contribute
1. Check out our [Contributing Guidelines](CONTRIBUTING.md)
2. Look for issues labeled `hacktoberfest`, `good first issue`, or `help wanted`
3. Fork the repo, make your changes, and submit a PR
4. Get your PR reviewed and merged!

**New to open source?** No worries! Check out our [Good First Issues](https://github.com/GreenHacker420/devdocx/labels/good%20first%20issue).

## 🚀 Installation

```bash
npm install devdocx
```

## 📖 Usage

### Option 1: Browse Files Directly

After installation, navigate to the docs folder:

```bash
cd node_modules/devdocx/docs
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
npx devdocx javascript/arrays
npx devdocx express/middleware
npx devdocx prisma/crud
npx devdocx auth/jwt
npx devdocx cheatsheets/javascript
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
- **Advanced**: Error Handling, Cookie Parser, Auth Flow, File Uploads
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
devdocx/
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
│   │   ├── auth-flow.md
│   │   └── file-uploads.md
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
npx devdocx javascript/array-methods

# Learn Express middleware
npx devdocx express/middleware

# File uploads and sending files
npx devdocx express/file-uploads

# Prisma CRUD operations
npx devdocx prisma/crud

# JWT authentication
npx devdocx auth/jwt
```

### Browse in VS Code
```bash
code node_modules/devdocx/docs
```

### Open Specific File
```bash
# macOS
open node_modules/devdocx/docs/javascript/arrays.md

# Linux
xdg-open node_modules/devdocx/docs/javascript/arrays.md

# Windows
start node_modules/devdocx/docs/javascript/arrays.md
```

## 🤝 Contributing

We love contributions! Devdevdocx is a community-driven project and we welcome contributions of all kinds.

### Ways to Contribute

- 📝 **Add new documentation** - Create docs for new technologies (TypeScript, React, MongoDB, etc.)
- ✏️ **Improve existing docs** - Fix typos, add examples, clarify explanations
- 🐛 **Report bugs** - Help us identify and fix issues
- 💡 **Suggest features** - Share ideas for new features or improvements
- ❓ **Add interview questions** - Share common interview questions and answers
- 📄 **Create cheatsheets** - Quick reference guides for any technology

### Getting Started

1. **Read the [Contributing Guidelines](CONTRIBUTING.md)**
2. **Check out [Good First Issues](https://github.com/GreenHacker420/devdocx/labels/good%20first%20issue)**
3. **Fork the repository**
4. **Make your changes**
5. **Submit a Pull Request**

### Contribution Ideas

- Add TypeScript documentation
- Create Next.js guides
- Add MongoDB/PostgreSQL docs
- Improve code examples with more comments
- Add diagrams and visualizations
- Create video tutorials
- Translate documentation

Check our [open issues](https://github.com/GreenHacker420/devdocx/issues) or [create a new one](https://github.com/GreenHacker420/devdocx/issues/new/choose)!


## 📝 License

MIT © Harsh Hirawat aka Green Hacker

## 🙏 Acknowledgments

Created with ❤️ for developers who want quick, offline access to quality documentation.

---

**Happy Coding! 🚀**

For questions or suggestions, please open an issue on GitHub.
