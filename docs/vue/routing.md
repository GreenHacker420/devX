# Vue Router: Official Router for Vue.js

## Table of Contents
- [Introduction to Vue Router](#introduction-to-vue-router)
- [Installation & Setup](#installation--setup)
- [Basic Routing](#basic-routing)
- [Dynamic Route Matching](#dynamic-route-matching)
- [Nested Routes](#nested-routes)
- [Programmatic Navigation](#programmatic-navigation)
- [Named Routes & Views](#named-routes--views)
- [Route Parameters & Props](#route-parameters--props)
- [Navigation Guards](#navigation-guards)
- [Route Meta Fields](#route-meta-fields)
- [Transitions](#transitions)
- [Data Fetching](#data-fetching)
- [Scroll Behavior](#scroll-behavior)
- [Lazy Loading Routes](#lazy-loading-routes)
- [Navigation Failures](#navigation-failures)
- [Composition API](#composition-api)
- [TypeScript Support](#typescript-support)
- [Authentication & Protected Routes](#authentication--protected-routes)
- [Error Handling](#error-handling)
- [Performance Optimization](#performance-optimization)
- [Deployment](#deployment)
- [Common Patterns](#common-patterns)
- [Migration from Vue 2](#migration-from-vue-2)

## Introduction to Vue Router

Vue Router is the official router for Vue.js. It deeply integrates with Vue.js core to make building Single Page Applications with Vue.js a breeze.

### Key Features
- Nested route/view mapping
- Modular, component-based router configuration
- Route params, query, wildcards
- View transition effects
- Fine-grained navigation control
- Links with automatic active CSS classes
- HTML5 history or hash mode, with auto-fallback in IE9
- Customizable scroll behavior
- Proper encoding for URLs
- Route level code-splitting

## Installation & Setup

### Installation

```bash
# For Vue 3
npm install vue-router@4
# or with yarn
yarn add vue-router@4
```

### Basic Setup

```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
```

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```

### Router View

```vue
<!-- App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>
```

## Basic Routing

### Route Configuration

```javascript
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/contact', component: Contact }
]
```

### HTML5 History Mode

```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes
})
```

### Hash Mode

```javascript
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
```

## Dynamic Route Matching

### Dynamic Segments

```javascript
const routes = [
  // Dynamic segment starts with a colon
  { path: '/users/:id', component: User },
  
  // Multiple dynamic segments
  { path: '/users/:username/posts/:postId', component: UserPost }
]
```

### Accessing Route Parameters

```vue
<template>
  <div>
    <h2>User {{ $route.params.id }}</h2>
  </div>
</template>

<script>
export default {
  // Access in setup
  setup() {
    const route = useRoute()
    return {
      userId: computed(() => route.params.id)
    }
  },
  
  // Or in options API
  created() {
    console.log(this.$route.params.id)
  }
}
</script>
```

### Catch All / 404 Not Found Route

```javascript
{
  // Will match everything and put it under `$route.params.pathMatch`
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: NotFound
}
```

## Nested Routes

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: 'profile',
        component: UserProfile
      },
      {
        // UserPosts will be rendered inside User's <router-view>
        // when /user/:id/posts is matched
        path: 'posts',
        component: UserPosts
      },
      {
        // Redirect /user/:id to /user/:id/profile
        path: '',
        redirect: 'profile'
      }
    ]
  }
]
```

## Programmatic Navigation

### Navigation Methods

```javascript
// Navigate to a different URL
router.push('/users/1')

// Navigate with object
router.push({ path: '/users/1' })

// Named route
router.push({ name: 'user', params: { id: '1' } })

// With query parameters
router.push({ path: '/users', query: { page: '1' } })

// Replace current entry (no browser history)
router.replace({ path: '/home' })

// Go forward/back
router.go(1) // forward 1 page
router.go(-1) // back 1 page
```

### In Component Methods

```javascript
// Options API
methods: {
  goToUser() {
    this.$router.push('/users/1')
  }
}

// Composition API
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    
    const goToUser = () => {
      router.push('/users/1')
    }
    
    return { goToUser }
  }
}
```

## Named Routes & Views

### Named Routes

```javascript
const routes = [
  {
    path: '/user/:id',
    name: 'user',
    component: User
  }
]

// Navigation
router.push({ name: 'user', params: { id: 1 } })
```

### Named Views

```vue
<template>
  <div>
    <h1>App Layout</h1>
    <router-view name="header"></router-view>
    <router-view></router-view>
    <router-view name="footer"></router-view>
  </div>
</template>

<script>
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      components: {
        default: Home,
        header: Header,
        footer: Footer
      }
    }
  ]
})
</script>
```

## Route Parameters & Props

### Boolean Mode

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    props: true // Pass route.params as props
  }
]
```

### Object Mode

```javascript
const routes = [
  {
    path: '/user',
    component: User,
    props: { default: true, id: '123' }
  }
]
```

### Function Mode

```javascript
const routes = [
  {
    path: '/search',
    component: Search,
    props: route => ({ query: route.query.q })
  }
]
```

## Navigation Guards

### Global Before Guards

```javascript
const router = createRouter({ ... })

router.beforeEach((to, from, next) => {
  // Must call `next`
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```

### Per-Route Guards

```javascript
const routes = [
  {
    path: '/admin',
    component: Admin,
    beforeEnter: (to, from, next) => {
      if (isAdmin) next()
      else next('/login')
    }
  }
]
```

### In-Component Guards

```javascript
const UserDetails = {
  template: '...',
  beforeRouteEnter(to, from, next) {
    // Called before the route that renders this component is confirmed.
    // Does NOT have access to `this` component instance.
    next(vm => {
      // Access component instance via `vm`
    })
  },
  beforeRouteUpdate(to, from) {
    // Called when the route that renders this component has changed,
    // but this component is reused in the new route.
    // Has access to `this` component instance.
    this.userData = fetchUser(to.params.id)
  },
  beforeRouteLeave(to, from) {
    // Called when the route that renders this component is about to
    // be navigated away from.
    const answer = window.confirm('Do you really want to leave?')
    if (!answer) return false
  }
}
```

## Route Meta Fields

```javascript
const routes = [
  {
    path: '/profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAdmin: true }
  }
]

// Navigation guard example
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresAdmin && !isAdmin) {
    next('/unauthorized')
  } else {
    next()
  }
})
```

## Transitions

### Per-Route Transition

```vue
<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### Different Transitions per Route

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'fade'">
      <component :is="Component" />
    </transition>
  </router-view>
</template>
```

## Data Fetching

### Fetching Before Navigation

```javascript
const routes = [
  {
    path: '/user/:id',
    component: User,
    props: true,
    beforeEnter: async (to, from, next) => {
      try {
        const user = await fetchUser(to.params.id)
        to.meta.user = user
        next()
      } catch (error) {
        next('/error')
      }
    }
  }
]
```

### Fetching After Navigation

```vue
<template>
  <div v-if="user">
    <h1>{{ user.name }}</h1>
  </div>
  <div v-else-if="error">
    {{ error }}
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const user = ref(null)
    const error = ref(null)
    
    const fetchUser = async (id) => {
      try {
        const response = await fetch(`/api/users/${id}`)
        if (!response.ok) throw new Error('User not found')
        user.value = await response.json()
      } catch (err) {
        error.value = err.message
      }
    }
    
    onMounted(() => {
      fetchUser(route.params.id)
    })
    
    return { user, error }
  }
}
</script>
```

## Scroll Behavior

```javascript
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Scroll to top for all route navigations
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})
```

## Lazy Loading Routes

### Dynamic Imports

```javascript
const routes = [
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import(/* webpackChunkName: "contact" */ '../views/Contact.vue')
  }
]
```

### Grouping Components in the Same Chunk

```javascript
// webpackChunkName comments put these in the same chunk
const UserDetails = () => import(/* webpackChunkName: "users" */ './UserDetails.vue')
const UserPosts = () => import(/* webpackChunkName: "users" */ './UserPosts.vue')
```

## Navigation Failures

### Detecting Navigation Failures

```javascript
// After navigation
const navigationResult = await router.push('/some-path')

if (navigationResult) {
  // Navigation was prevented
  console.log('Navigation was prevented')
  
  if (isNavigationFailure(navigationResult, NavigationFailureType.aborted)) {
    console.log('Navigation was aborted')
  } else if (isNavigationFailure(navigationResult, NavigationFailureType.cancelled)) {
    console.log('Navigation was cancelled')
  }
} else {
  // Navigation was successful
  console.log('Navigation succeeded')
}
```

## Composition API

### useRouter & useRoute

```vue
<template>
  <button @click="goToUser">Go to User</button>
  <p>Current route: {{ route.path }}</p>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'

export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    const goToUser = () => {
      router.push(`/users/${route.params.userId}`)
    }
    
    // Watch for route changes
    watch(() => route.params, (newParams, oldParams) => {
      // React to route changes
    })
    
    return { goToUser, route }
  }
}
</script>
```

## TypeScript Support

### Typed Routes

```typescript
// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
```

### Typed Navigation

```typescript
import { useRouter } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresAdmin?: boolean
  }
}

const router = useRouter()

// Typed navigation
router.push({
  name: 'UserProfile',
  params: { id: 1 } // Type-checked
})
```

## Authentication & Protected Routes

### Route Guard for Authentication

```typescript
// router/guards/authGuard.ts
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Unauthorized' })
  } else {
    next()
  }
}
```

### Login Flow

```vue
<template>
  <form @submit.prevent="handleLogin">
    <input v-model="email" type="email" placeholder="Email" required>
    <input v-model="password" type="password" placeholder="Password" required>
    <button type="submit">Login</button>
  </form>
</template>

<script>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    
    const handleLogin = async () => {
      try {
        await authStore.login(email.value, password.value)
        
        // Redirect to the original URL or home
        const redirect = route.query.redirect || '/dashboard'
        router.push(redirect)
      } catch (error) {
        console.error('Login failed:', error)
      }
    }
    
    return { email, password, handleLogin }
  }
}
</script>
```

## Error Handling

### 404 Not Found

```javascript
// router/index.js
const routes = [
  // ... other routes ...
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]
```

### Global Error Handler

```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Global error handler for navigation errors
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue error:', err)
  console.error('Error in component:', vm)
  console.error('Error info:', info)
  
  // You could redirect to an error page here
  // router.push('/error')
}

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  // Prevent the default browser error handling
  event.preventDefault()
})

app.use(router)
app.mount('#app')
```

## Performance Optimization

### Route-Level Code Splitting

```javascript
const routes = [
  {
    path: '/dashboard',
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue')
  },
  {
    path: '/settings',
    component: () => import(/* webpackChunkName: "settings" */ '@/views/Settings.vue')
  }
]
```

### Prefetching Routes

```vue
<template>
  <router-link :to="/dashboard" v-slot="{ href, navigate }" custom>
    <a :href="href" @mouseover="prefetchDashboard" @click="navigate">
      Dashboard
    </a>
  </router-link>
</template>

<script>
export default {
  methods: {
    prefetchDashboard() {
      import(/* webpackPrefetch: true */ '@/views/Dashboard.vue')
    }
  }
}
</script>
```

### Lazy Loading with Suspense

```vue
<template>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

## Deployment

### History Mode Server Configuration

#### Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

#### Apache

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Base URL

```javascript
const router = createRouter({
  history: createWebHistory('/my-app/'),
  routes
})
```

## Common Patterns

### Route-Based Code Splitting

```javascript
// router/modules/admin.js
const AdminDashboard = () => import('@/views/admin/Dashboard.vue')
const AdminUsers = () => import('@/views/admin/Users.vue')

export default [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    children: [
      { path: '', component: AdminDashboard },
      { path: 'users', component: AdminUsers }
    ]
  }
]
```

### Scroll to Top on Route Change

```javascript
const router = createRouter({
  // ...
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})
```

### Query Parameter Changes

```vue
<template>
  <div>
    <input 
      v-model="searchQuery" 
      @input="updateQuery" 
      placeholder="Search..."
    >
    <ul>
      <li v-for="item in filteredItems" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  setup() {
    const route = useRoute()
    const router = useRouter()
    const searchQuery = ref(route.query.q || '')
    const items = ref([])
    
    // Update URL when search query changes
    const updateQuery = () => {
      router.push({
        query: { q: searchQuery.value || undefined }
      })
    }
    
    // Watch for URL changes
    watch(() => route.query.q, (newQuery) => {
      searchQuery.value = newQuery || ''
      // Fetch data based on query
      fetchData()
    })
    
    const fetchData = async () => {
      // Fetch data based on searchQuery
      // items.value = await api.search(searchQuery.value)
    }
    
    const filteredItems = computed(() => {
      return items.value.filter(item => 
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })
    
    onMounted(() => {
      if (searchQuery.value) {
        fetchData()
      }
    })
    
    return { searchQuery, filteredItems, updateQuery }
  }
}
</script>
```

## Migration from Vue 2

### Key Changes in Vue Router 4

1. **New `createRouter` function**
   ```javascript
   // Vue Router 3
   const router = new VueRouter({ ... })
   
   // Vue Router 4
   import { createRouter, createWebHistory } from 'vue-router'
   const router = createRouter({
     history: createWebHistory(),
     routes: []
   })
   ```

2. **New Navigation API**
   ```javascript
   // Vue Router 3
   this.$router.push('/path')
   
   // Vue Router 4 (Composition API)
   import { useRouter } from 'vue-router'
   const router = useRouter()
   router.push('/path')
   ```

3. **Route Properties**
   - `$route` is now accessed via `useRoute()` in Composition API
   - `parent` and `children` properties are removed from route records

4. **Navigation Guards**
   - `next` parameter is now optional in navigation guards
   - `next(false)` is now `return false`
   - `next('/')` is now `return '/'`

5. **Scroll Behavior**
   - The `x` and `y` properties are now `left` and `top`
   - The `selector` option is replaced with `el`

### Migration Strategy

1. Update Vue Router to version 4
   ```bash
   npm install vue-router@4
   # or
   yarn add vue-router@4
   ```

2. Update your router configuration
   - Replace `new VueRouter()` with `createRouter()`
   - Replace `mode: 'history'` with `history: createWebHistory()`
   - Update any scroll behavior functions

3. Update your components
   - Replace `this.$route` with `useRoute()` in setup()
   - Replace `this.$router` with `useRouter()` in setup()
   - Update any navigation guards

4. Test thoroughly
   - Test all navigation flows
   - Check for any direct route property access
   - Verify scroll behavior

5. Update tests
   - Update any tests that interact with the router
   - Use the new testing utilities if needed

## Conclusion

Vue Router is a powerful and flexible routing library for Vue.js applications. By following the patterns and best practices outlined in this guide, you can build complex, maintainable, and performant single-page applications. Whether you're building a small project or a large-scale application, Vue Router provides the tools you need to manage navigation and state effectively.
