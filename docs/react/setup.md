# React Setup

This guide helps you quickly set up a modern React app using Vite. It covers prerequisites, installation, scripts, file structure, environment variables, and basic linting/formatting.

## Prerequisites
- Node.js 18+ (recommended) and npm 9+
- A code editor (VS Code)

Check versions:
```bash
node -v
npm -v
```

## Create a New App (Vite)
```bash
# JavaScript
npm create vite@latest my-app -- --template react

# TypeScript (optional)
npm create vite@latest my-app -- --template react-ts

cd my-app
npm install
```

## Run and Build
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

## Project Structure (Vite default)
```
my-app/
├── index.html
├── package.json
├── vite.config.ts|js
├── src/
│   ├── App.tsx|jsx
│   ├── main.tsx|jsx
│   └── assets/
└── public/
```

## First Component
```jsx
// src/App.jsx
import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>React + Vite</h1>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
    </div>
  )
}
```

## Styling Options
- CSS/SCSS modules (built-in)
- Tailwind CSS
- CSS-in-JS (e.g., Emotion, Styled Components)

Example: add Tailwind
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
Configure `tailwind.config.js` content paths and import Tailwind directives in `src/index.css`.

## Environment Variables
- Files: `.env`, `.env.development`, `.env.production`
- Prefix variables with `VITE_` to expose to the client
```env
VITE_API_URL=https://api.example.com
```
Use in code:
```js
const api = import.meta.env.VITE_API_URL
```

## ESLint + Prettier
Install and initialize:
```bash
npm install -D eslint prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks
npx eslint --init
```
Recommend enabling:
- React and React Hooks plugins
- Prettier via "extends": ["plugin:react/recommended", "plugin:react-hooks/recommended", "prettier"]

Add scripts to `package.json`:
```json
{
  "scripts": {
    "lint": "eslint \"src/**/*.{js,jsx,ts,tsx}\"",
    "format": "prettier --write ."
  }
}
```

## Testing (Optional)
Vite + Vitest + RTL:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```
Update `vite.config.ts|js` to include `test` config with `environment: 'jsdom'`.

## Troubleshooting
- Port in use: change `npm run dev` port with `--port 5174` or kill the process.
- Blank page in production: ensure `base` in `vite.config` matches deploy path.
- Node version errors: upgrade Node to 18+.

## Next Steps
- Learn components/JSX, state/props, hooks, routing, and testing.
- Consider TypeScript for better DX.
- Set up CI (GitHub Actions) for lint/tests on PRs.
