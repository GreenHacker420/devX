# Vue.js Setup Guide

## Table of Contents
1. [Installation](#installation)
2. [Project Setup](#project-setup)
3. [Vue CLI](#vue-cli)
4. [Vite](#vite)
5. [CDN](#cdn)
6. [Development Server](#development-server)
7. [Build for Production](#build-for-production)
8. [Configuration](#configuration)
9. [IDE Setup](#ide-setup)
10. [Browser DevTools](#browser-devtools)

## Installation

### Prerequisites
- Node.js 16.0.0 or later
- npm or yarn

### Vue CLI (Legacy)
```bash
# Install Vue CLI globally
npm install -g @vue/cli
# OR
yarn global add @vue/cli

# Check installation
vue --version
```

### Create a New Project
#### Using Vue CLI
```bash
vue create my-vue-app
cd my-vue-app
```

#### Using Vite (Recommended for new projects)
```bash
# npm 7+, extra double-dash is needed:
npm create vue@latest my-vue-app -- --typescript --router --pinia --vitest --eslint

# npm 6.x
npm create vue@latest my-vue-app --template typescript --router --pinia --vitest --eslint

# yarn
yarn create vue my-vue-app --template typescript --router --pinia --vitest --eslint

# pnpm
pnpm create vue my-vue-app -- --typescript --router --pinia --vitest --eslint

# Navigate to project
cd my-vue-app

# Install dependencies
npm install
# OR
yarn
# OR
pnpm install
```

## Project Structure

### Vue 3 Project Structure
```
my-vue-app/
├── public/                 # Static files
│   ├── favicon.ico
│   └── index.html          # Main HTML file
├── src/
│   ├── assets/             # Static assets (images, styles)
│   ├── components/         # Reusable components
│   ├── composables/        # Composable functions
│   ├── router/             # Vue Router configuration
│   ├── stores/             # State management (Pinia)
│   ├── views/              # Route components
│   ├── App.vue             # Root component
│   └── main.js             # Application entry point
├── .eslintrc.js            # ESLint config
├── .gitignore
├── index.html
├── package.json
├── README.md
├── vite.config.js          # Vite config
└── tsconfig.json           # TypeScript config
```

### Main Application File
```typescript
// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import global styles
import './assets/main.css'

const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Mount the app
app.mount('#app')
```

## CDN

### Development Version
```html
<!-- Development version, includes helpful console warnings -->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

### Production Version
```html
<!-- Production version, optimized for size and speed -->
<script src="https://unpkg.com/vue@3"></script>
```

### ES Modules Build
```html
<script type="module">
  import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
  
  createApp({
    // app options
  }).mount('#app')
</script>
```

## Development Server

### Vite Dev Server
```bash
# Start development server
npm run dev
# OR
yarn dev
# OR
pnpm dev

# Access at http://localhost:5173
```

### Vue CLI Dev Server (legacy)
```bash
npm run serve
# OR
yarn serve
```

## Build for Production

### Vite Build
```bash
# Build for production
npm run build
# OR
yarn build
# OR
pnpm build

# Preview production build locally
npm run preview
```

### Vue CLI Build (legacy)
```bash
npm run build
# OR
yarn build
```

## Configuration

### Vite Configuration (vite.config.js)
```javascript
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  }
})
```

### Environment Variables
Create `.env` files in your project root:

```env
# .env
VITE_APP_TITLE=My Vue App
VITE_API_URL=https://api.example.com
```

Access in your code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## IDE Setup

### VS Code Extensions
1. [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Official Vue Language Features
2. [TypeScript Vue Plugin](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) - TypeScript support for Vue
3. [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) - JavaScript/TypeScript linting
4. [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) - Code formatter
5. [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) - CSS/SCSS linting

### Recommended VS Code Settings
```json
{
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact", "vue"],
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Browser DevTools

### Vue Devtools
1. Install [Vue Devtools](https://devtools.vuejs.org/guide/installation.html) browser extension
2. For local development, it should automatically detect your Vue application
3. For production, add this to your main application file:

```typescript
// Only in development
if (import.meta.env.DEV) {
  const { createApp } = await import('vue')
  const { default: App } = await import('./App.vue')
  
  // Mount devtools
  if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = createApp
  }
}
```

### Debugging
- Use `debugger` statements in your code
- Utilize Vue Devtools component inspection
- Check the browser's console for warnings and errors

## Common Issues

### Resolving Dependency Issues
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install
```

### TypeScript Support
Ensure your `tsconfig.json` includes:
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "jsx": "preserve",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Vue 2 vs Vue 3
- Vue 3 is the current major version with Composition API
- Vue 2 is in maintenance mode (end of life: Dec 31, 2023)
- Use `@vue/compat` for migration from Vue 2 to 3

## Next Steps
- [Learn about Components](./components.md)
- [Understand Reactivity System](./reactivity.md)
- [State Management with Pinia/Vuex](./vuex.md)
- [Routing with Vue Router](./routing.md)
