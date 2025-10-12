# TypeScript Setup

Complete guide to setting up TypeScript in your projects.

## What is TypeScript?

TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale. It adds optional static typing, classes, and interfaces to JavaScript.

## Installation

### Global Installation

```bash
npm install -g typescript
```

### Project Installation

```bash
# Initialize npm project
npm init -y

# Install TypeScript
npm install --save-dev typescript

# Install type definitions for Node.js
npm install --save-dev @types/node
```

## Initialize TypeScript

```bash
# Create tsconfig.json
npx tsc --init
```

This creates a `tsconfig.json` file with default settings.

## Basic tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Project Structure

```
my-project/
├── src/
│   ├── index.ts
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── helpers.ts
├── dist/           # Compiled JavaScript
├── node_modules/
├── package.json
└── tsconfig.json
```

## First TypeScript File

```typescript
// src/index.ts
function greet(name: string): string {
  return `Hello, ${name}!`
}

const message = greet("World")
console.log(message)
```

## Compile TypeScript

```bash
# Compile once
npx tsc

# Watch mode (auto-compile on save)
npx tsc --watch

# Compile specific file
npx tsc src/index.ts
```

## Run TypeScript Directly

### Using ts-node

```bash
# Install ts-node
npm install --save-dev ts-node

# Run TypeScript file
npx ts-node src/index.ts
```

### Using tsx (Faster)

```bash
# Install tsx
npm install --save-dev tsx

# Run TypeScript file
npx tsx src/index.ts
```

## Package.json Scripts

```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsx watch src/index.ts",
    "start": "node dist/index.js",
    "type-check": "tsc --noEmit"
  }
}
```

## TypeScript with Node.js

### Installation

```bash
npm install --save-dev typescript @types/node ts-node
```

### Example Server

```typescript
// src/server.ts
import http from 'http'

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello from TypeScript!')
})

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## TypeScript with Express

### Installation

```bash
npm install express
npm install --save-dev @types/express
```

### Example

```typescript
// src/app.ts
import express, { Request, Response } from 'express'

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello TypeScript!' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## TypeScript with React

### Create React App with TypeScript

```bash
npx create-react-app my-app --template typescript
```

### Vite with TypeScript

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

### Example Component

```typescript
// src/components/Greeting.tsx
interface GreetingProps {
  name: string
  age?: number
}

export function Greeting({ name, age }: GreetingProps) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {age && <p>Age: {age}</p>}
    </div>
  )
}
```

## TypeScript with Next.js

Next.js has built-in TypeScript support:

```bash
npx create-next-app@latest my-app --typescript
```

Or add to existing project:

```bash
npm install --save-dev typescript @types/react @types/node
```

Create `tsconfig.json` and Next.js will configure it automatically.

## Common Compiler Options

### Target

```json
{
  "compilerOptions": {
    "target": "ES2020"  // ES5, ES6, ES2015, ES2020, ESNext
  }
}
```

### Module

```json
{
  "compilerOptions": {
    "module": "commonjs"  // commonjs, es2015, esnext, etc.
  }
}
```

### Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,  // Enable all strict type checking
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true
  }
}
```

### Path Mapping

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

Usage:

```typescript
// Instead of: import { Button } from '../../components/Button'
import { Button } from '@components/Button'
```

### Source Maps

```json
{
  "compilerOptions": {
    "sourceMap": true,  // Generate .map files for debugging
    "inlineSourceMap": false,
    "declarationMap": true
  }
}
```

## Declaration Files

Generate `.d.ts` files for libraries:

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationDir": "./types"
  }
}
```

## ESLint with TypeScript

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

`.eslintrc.json`:

```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

## Prettier with TypeScript

```bash
npm install --save-dev prettier
```

`.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

## Testing with TypeScript

### Jest

```bash
npm install --save-dev jest @types/jest ts-jest
```

`jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
}
```

### Vitest

```bash
npm install --save-dev vitest
```

`vite.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
})
```

## Environment Variables

### Type-safe env variables

```typescript
// src/env.ts
interface Env {
  NODE_ENV: 'development' | 'production' | 'test'
  PORT: number
  DATABASE_URL: string
  API_KEY: string
}

function getEnv(): Env {
  return {
    NODE_ENV: process.env.NODE_ENV as Env['NODE_ENV'],
    PORT: parseInt(process.env.PORT || '3000'),
    DATABASE_URL: process.env.DATABASE_URL || '',
    API_KEY: process.env.API_KEY || '',
  }
}

export const env = getEnv()
```

Usage:

```typescript
import { env } from './env'

console.log(env.PORT) // Type-safe!
```

## Debugging TypeScript

### VS Code Configuration

`.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug TypeScript",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["${workspaceFolder}/src/index.ts"],
      "cwd": "${workspaceFolder}",
      "protocol": "inspector"
    }
  ]
}
```

## Migration from JavaScript

### Step 1: Rename files

```bash
# Rename .js to .ts
mv src/index.js src/index.ts
```

### Step 2: Start with loose config

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false,
    "strict": false
  }
}
```

### Step 3: Gradually enable strict mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

### Step 4: Add types incrementally

```typescript
// Before
function add(a, b) {
  return a + b
}

// After
function add(a: number, b: number): number {
  return a + b
}
```

## Common Issues

### Module not found

```bash
# Install type definitions
npm install --save-dev @types/node
npm install --save-dev @types/express
```

### Cannot find module

Check `tsconfig.json`:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

### Implicit any

Enable strict mode or add types:

```typescript
// Error: Parameter 'x' implicitly has an 'any' type
function log(x) {
  console.log(x)
}

// Fix
function log(x: unknown) {
  console.log(x)
}
```

## Best Practices

- ✅ Enable strict mode
- ✅ Use explicit types for function parameters and return values
- ✅ Avoid `any` type when possible
- ✅ Use interfaces for object shapes
- ✅ Use path mapping for cleaner imports
- ✅ Generate declaration files for libraries
- ✅ Use ESLint and Prettier

## Related Topics

- [Basic Types](./basics.md)
- [Advanced Types](./advanced.md)
- [TypeScript with React](./with-react.md)

## References

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)
