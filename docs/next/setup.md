# Next.js Setup

This guide helps you quickly set up a modern Next.js application. It covers prerequisites, installation, project structure, and configuration.

## Prerequisites
- Node.js 18.17+ (recommended) and npm 9+
- A code editor (VS Code recommended)

Check versions:
```bash
node -v
npm -v
```

## Create a New App

### Automatic Setup (Recommended)
```bash
# Create a new Next.js app with TypeScript
npx create-next-app@latest my-app

# You'll be prompted with:
# ✔ Would you like to use TypeScript? Yes
# ✔ Would you like to use ESLint? Yes
# ✔ Would you like to use Tailwind CSS? Yes
# ✔ Would you like to use `src/` directory? Yes
# ✔ Would you like to use App Router? Yes
# ✔ Would you like to customize the default import alias? No

cd my-app
```

### Manual Setup
```bash
npm install next@latest react@latest react-dom@latest
```

Add scripts to `package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## Run and Build

```bash
# Start development server (default: http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Project Structure (App Router)

```
my-app/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── api/                # API routes
│       └── route.ts
├── public/                 # Static files
│   ├── images/
│   └── favicon.ico
├── components/             # Reusable components
├── lib/                    # Utility functions
├── next.config.js          # Next.js configuration
├── package.json
└── tsconfig.json
```

## First Page (App Router)

```tsx
// app/page.tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
      <p className="mt-4 text-lg">Start building your app</p>
    </main>
  )
}
```

## Root Layout

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'Created with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

## Environment Variables

Create `.env.local` for local development:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# API Keys (prefix with NEXT_PUBLIC_ for client-side access)
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET_KEY=your-secret-key
```

Access in code:
```tsx
// Server-side (Server Components, API Routes)
const dbUrl = process.env.DATABASE_URL

// Client-side (must use NEXT_PUBLIC_ prefix)
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

## Configuration (next.config.js)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode
  reactStrictMode: true,
  
  // Image optimization
  images: {
    domains: ['example.com', 'cdn.example.com'],
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'my-value',
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
```

## TypeScript Configuration

Next.js automatically configures TypeScript. The `tsconfig.json` is created on first run:

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Styling Options

### 1. Tailwind CSS (Recommended)
Already configured if you selected it during setup.

### 2. CSS Modules
```tsx
// app/page.module.css
.container {
  padding: 2rem;
}

// app/page.tsx
import styles from './page.module.css'

export default function Page() {
  return <div className={styles.container}>Content</div>
}
```

### 3. Global CSS
```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

## Common Packages to Install

```bash
# UI Components
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu

# Forms
npm install react-hook-form zod @hookform/resolvers

# State Management
npm install zustand

# Data Fetching
npm install @tanstack/react-query axios

# Database (Prisma)
npm install @prisma/client
npm install -D prisma

# Authentication
npm install next-auth

# Icons
npm install lucide-react
```

## Development Tips

### Hot Reload
Next.js automatically reloads when you save files. If it doesn't work:
```bash
# Clear .next folder
rm -rf .next
npm run dev
```

### Port Configuration
```bash
# Use a different port
npm run dev -- -p 3001
```

### Turbopack (Faster Development)
```bash
# Use Turbopack for faster builds (experimental)
npm run dev -- --turbo
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### TypeScript Errors
```bash
# Regenerate types
rm -rf .next
npm run dev
```

### Build Errors
```bash
# Check for errors
npm run build

# Clear cache
rm -rf .next
npm run build
```

## Next Steps

- Learn about [Routing](./routing.md)
- Understand [Server and Client Components](./components.md)
- Explore [Data Fetching](./data-fetching.md)
- Set up [API Routes](./api-routes.md)
- Implement [Authentication](./authentication.md)

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js GitHub](https://github.com/vercel/next.js)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
