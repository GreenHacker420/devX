# Vue Components

## Table of Contents
1. [Component Basics](#component-basics)
2. [Component Registration](#component-registration)
3. [Props](#props)
4. [Emits](#emits)
5. [Slots](#slots)
6. [Provide/Inject](#provide--inject)
7. [Dynamic Components](#dynamic-components)
8. [Async Components](#async-components)
9. [Composables](#composables)
10. [Render Functions & JSX](#render-functions--jsx)
11. [Custom Directives](#custom-directives)
12. [Plugins](#plugins)
13. [Performance Optimization](#performance-optimization)

## Component Basics

### Single File Components (SFC)
```vue
<template>
  <div class="greeting">
    <h1>{{ msg }}</h1>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Props
defineProps({
  msg: {
    type: String,
    required: true
  }
})

// State
const count = ref(0)

// Methods
function increment() {
  count.value++
}
</script>

<style scoped>
.greeting {
  color: #2c3e50;
  text-align: center;
  margin-top: 2em;
}
</style>
```

### Options API (Legacy)
```vue
<template>
  <div class="greeting">
    <h1>{{ msg }}</h1>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script>
export default {
  // Component name (optional)
  name: 'MyComponent',
  
  // Component properties
  props: {
    msg: {
      type: String,
      required: true
    }
  },
  
  // Local state
  data() {
    return {
      count: 0
    }
  },
  
  // Methods
  methods: {
    increment() {
      this.count++
    }
  },
  
  // Lifecycle hooks
  mounted() {
    console.log('Component mounted')
  },
  
  // Computed properties
  computed: {
    doubleCount() {
      return this.count * 2
    }
  },
  
  // Watchers
  watch: {
    count(newVal, oldVal) {
      console.log(`Count changed from ${oldVal} to ${newVal}`)
    }
  }
}
</script>

<style scoped>
.greeting {
  color: #2c3e50;
  text-align: center;
  margin-top: 2em;
}
</style>
```

## Component Registration

### Global Registration
```javascript
// main.js
import { createApp } from 'vue'
import App from './App.vue'
import MyComponent from './components/MyComponent.vue'

const app = createApp(App)

// Register globally
app.component('MyComponent', MyComponent)

app.mount('#app')
```

### Local Registration
```vue
<script setup>
import MyComponent from './MyComponent.vue'
</script>

<template>
  <MyComponent />
</template>
```

### Auto-import Components
```javascript
// plugins/components.js
import { defineAsyncComponent } from 'vue'

export default {
  install(app) {
    const components = import.meta.glob('./components/**/*.vue')
    
    for (const [path, component] of Object.entries(components)) {
      const componentName = path
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
      
      app.component(componentName, defineAsyncComponent(component))
    }
  }
}

// main.js
import { createApp } from 'vue'
import App from './App.vue'
import components from './plugins/components'

const app = createApp(App)
app.use(components)
app.mount('#app')
```

## Props

### Prop Types and Validation
```vue
<script setup>
const props = defineProps({
  // Basic type check
  title: String,
  
  // Multiple types
  id: [String, Number],
  
  // Required
  description: {
    type: String,
    required: true
  },
  
  // Default value
  likes: {
    type: Number,
    default: 0
  },
  
  // Object with default
  author: {
    type: Object,
    default: () => ({
      name: 'Anonymous',
      email: 'no-email@example.com'
    })
  },
  
  // Custom validator
  status: {
    validator(value) {
      return ['draft', 'published', 'archived'].includes(value)
    },
    default: 'draft'
  },
  
  // Function with default
  onAction: {
    type: Function,
    default: () => {}
  }
})
</script>
```

### One-Way Data Flow
```vue
<template>
  <div>
    <p>{{ localTitle }}</p>
    <input v-model="localTitle" @change="updateTitle">
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps(['title'])
const emit = defineEmits(['update:title'])

const localTitle = ref(props.title)

// Update local title when prop changes
watch(() => props.title, (newVal) => {
  localTitle.value = newVal
})

// Emit update when local title changes
function updateTitle() {
  emit('update:title', localTitle.value)
}
</script>
```

## Emits

### Declaring Emits
```vue
<script setup>
// Array syntax
const emit = defineEmits(['update', 'delete'])

// Object syntax with validation
const emit = defineEmits({
  // No validation
  click: null,
  
  // With validation
  submit: (payload) => {
    if (payload.email && payload.password) {
      return true
    }
    console.warn('Invalid submit payload!')
    return false
  }
})

function handleClick() {
  emit('click')
}

function handleSubmit() {
  if (isValid) {
    emit('submit', { email, password })
  }
}
</script>
```

### v-model with Components
```vue
<!-- ParentComponent.vue -->
<template>
  <CustomInput v-model="searchText" />
  <!-- Shorthand for: -->
  <!-- <CustomInput
    :modelValue="searchText"
    @update:modelValue="newValue => searchText = newValue"
  /> -->
</template>

<!-- CustomInput.vue -->
<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>
```

### Multiple v-model Bindings
```vue
<!-- ParentComponent.vue -->
<template>
  <UserForm
    v-model:first-name="firstName"
    v-model:last-name="lastName"
  />
</template>

<!-- UserForm.vue -->
<template>
  <input
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  >
  <input
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  >
</template>

<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>
```

## Slots

### Basic Slots
```vue
<!-- BaseLayout.vue -->
<template>
  <div class="container">
    <header>
      <slot name="header">Default header</slot>
    </header>
    <main>
      <slot>Default content</slot>
    </main>
    <footer>
      <slot name="footer">Default footer</slot>
    </footer>
  </div>
</template>

<!-- Usage -->
<BaseLayout>
  <template #header>
    <h1>My App</h1>
  </template>
  
  <p>Main content goes here</p>
  
  <template #footer>
    <p>Copyright 2023</p>
  </template>
</BaseLayout>
```

### Scoped Slots
```vue
<!-- FancyList.vue -->
<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <slot :item="item" :index="index">
        {{ item }}
      </slot>
    </li>
  </ul>
</template>

<!-- Usage -->
<FancyList :items="todos">
  <template #default="{ item, index }">
    <span :class="{ done: item.done }">
      {{ index + 1 }}. {{ item.text }}
    </span>
  </template>
</FancyList>
```

### Renderless Components
```vue
<!-- MouseTracker.vue -->
<template>
  <slot :x="x" :y="y" :position="{ x, y }" />
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<!-- Usage -->
<MouseTracker v-slot="{ x, y }">
  Mouse is at: {{ x }}, {{ y }}
</MouseTracker>
```

## Provide / Inject

### Basic Usage
```vue
<!-- ParentComponent.vue -->
<template>
  <ChildComponent />
</template>

<script setup>
import { provide, ref } from 'vue'
import ChildComponent from './ChildComponent.vue'

const count = ref(0)

// Provide a value to all descendants
provide('count', count)

// Provide a method to update the count
function increment() {
  count.value++
}
provide('increment', increment)
</script>

<!-- ChildComponent.vue -->
<template>
  <button @click="increment">
    Count: {{ count }}
  </button>
</template>

<script setup>
import { inject } from 'vue'

// Inject the provided value
const count = inject('count', 0) // 0 is default value
const increment = inject('increment')
</script>
```

### With Symbol Keys
```javascript
// keys.js
export const COUNT_KEY = Symbol('count')
export const INCREMENT_KEY = Symbol('increment')

// ParentComponent.vue
import { provide } from 'vue'
import { COUNT_KEY, INCREMENT_KEY } from './keys'

const count = ref(0)
provide(COUNT_KEY, count)
provide(INCREMENT_KEY, () => count.value++)

// ChildComponent.vue
import { inject } from 'vue'
import { COUNT_KEY, INCREMENT_KEY } from './keys'

const count = inject(COUNT_KEY, 0)
const increment = inject(INCREMENT_KEY)
```

## Dynamic Components

### Basic Dynamic Components
```vue
<template>
  <component :is="currentComponent" />
  <button @click="toggleComponent">Toggle</button>
</template>

<script setup>
import { shallowRef } from 'vue'
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'

const currentComponent = shallowRef(ComponentA)

function toggleComponent() {
  currentComponent.value = 
    currentComponent.value === ComponentA ? ComponentB : ComponentA
}
</script>
```

### Keep-Alive Components
```vue
<template>
  <button @click="currentTab = 'posts'">Posts</button>
  <button @click="currentTab = 'archive'">Archive</button>
  
  <KeepAlive>
    <component 
      :is="currentTab === 'posts' ? Posts : Archive"
      :key="currentTab"
    />
  </KeepAlive>
</template>

<script setup>
import { ref, shallowRef } from 'vue'
import Posts from './Posts.vue'
import Archive from './Archive.vue'

const currentTab = ref('posts')
</script>
```

## Async Components

### Basic Async Component
```javascript
// AsyncComponent.vue
import { defineAsyncComponent } from 'vue'

export default {
  components: {
    // Simple usage
    AdminPanel: defineAsyncComponent(() =>
      import('./AdminPanel.vue')
    ),
    
    // With options
    UserProfile: defineAsyncComponent({
      // The loader function
      loader: () => import('./UserProfile.vue'),
      
      // A component to use while the async component is loading
      loadingComponent: LoadingComponent,
      
      // A component to use if the load fails
      errorComponent: ErrorComponent,
      
      // Delay before showing the loading component. Default: 200ms
      delay: 200,
      
      // The error component will be displayed if a timeout is
      // provided and exceeded. Default: Infinity
      timeout: 3000,
      
      // A function that returns a boolean indicating whether the async component should retry when the loader promise rejects
      onError(error, retry, fail, attempts) {
        if (error.message.match(/fetch/) && attempts <= 3) {
          // Retry on fetch errors, 3 max attempts
          retry()
        } else {
          // Note that retry/fail are like resolve/reject of a promise:
          // one of them must be called for the error handling to continue.
          fail()
        }
      }
    })
  }
}
```

### Suspense (Experimental)
```vue
<!-- Parent.vue -->
<template>
  <Suspense>
    <template #default>
      <AsyncComponent />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const AsyncComponent = defineAsyncComponent(() => 
  import('./AsyncComponent.vue')
)
</script>
```

## Composables

### Creating a Composable
```javascript
// useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }
  
  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))
  
  return { x, y }
}

// Usage in component
import { useMouse } from './useMouse'

const { x, y } = useMouse()
```

### Async Composable
```javascript
// useFetch.js
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const isPending = ref(false)
  
  async function doFetch() {
    // Reset state
    data.value = null
    error.value = null
    isPending.value = true
    
    try {
      // Unwrap the url in case it's a ref
      const urlValue = unref(url)
      const response = await fetch(urlValue)
      data.value = await response.json()
    } catch (e) {
      error.value = e
    } finally {
      isPending.value = false
    }
  }
  
  if (isRef(url)) {
    // Setup reactive re-fetch if input URL is a ref
    watchEffect(doFetch)
  } else {
    // Otherwise, just fetch once
    doFetch()
  }
  
  return { data, error, isPending, retry: doFetch }
}

// Usage
const { data, isPending, error } = useFetch('https://api.example.com/data')
// Or with a ref
const url = ref('https://api.example.com/data')
const { data } = useFetch(url)
```

## Render Functions & JSX

### Basic Render Function
```javascript
// MyComponent.js
import { h } from 'vue'

export default {
  props: ['level'],
  render() {
    return h(
      'h' + this.level, // tag name
      {}, // props/attributes
      this.$slots.default() // array of children
    )
  }
}

// With JSX
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['level'],
  setup(props, { slots }) {
    return () => (
      <div class="my-component">
        {slots.default?.()}
      </div>
    )
  }
})
```

### Functional Components
```javascript
// FunctionalComponent.js
import { h } from 'vue'

const FunctionalComponent = (props, { slots, emit, attrs }) => {
  return h('div', { class: 'functional' }, [
    h('button', { onClick: () => emit('click') }, 'Click me'),
    slots.default?.()
  ])
}

FunctionalComponent.props = ['title']
FunctionalComponent.emits = ['click']

export default FunctionalComponent
```

## Custom Directives

### Basic Directive
```javascript
// v-focus directive
const vFocus = {
  mounted(el) {
    el.focus()
  }
}

// Usage in template
// <input v-focus>

// Global registration
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})
```

### Directive with Arguments and Modifiers
```javascript
const vPin = {
  mounted(el, binding) {
    el.style.position = 'fixed'
    
    // Binding value
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
    
    // Modifiers
    if (binding.modifiers.animate) {
      el.style.transition = 'all 0.3s'
    }
  },
  
  // Updated when the bound value changes
  updated(el, binding) {
    const s = binding.arg || 'top'
    el.style[s] = binding.value + 'px'
  }
}

// Usage
// <div v-pin:bottom.animate="200">Pinned element</div>
```

## Plugins

### Creating a Plugin
```javascript
// plugins/i18n.js
export default {
  install: (app, options) => {
    // Add a global method
    app.config.globalProperties.$translate = (key) => {
      return key.split('.').reduce((o, i) => {
        if (o) return o[i]
      }, options.messages)
    }
    
    // Provide a value to the app
    app.provide('i18n', options)
    
    // Add a custom directive
    app.directive('my-directive', {
      mounted(el, binding, vnode, prevVnode) {
        // ...
      }
    })
    
    // Add a global mixin
    app.mixin({
      created() {
        // ...
      }
    })
  }
}

// main.js
import { createApp } from 'vue'
import App from './App.vue'
import i18nPlugin from './plugins/i18n'

const app = createApp(App)

app.use(i18nPlugin, {
  messages: {
    welcome: 'Welcome',
    buttons: {
      save: 'Save',
      cancel: 'Cancel'
    }
  }
})

app.mount('#app')
```

## Performance Optimization

### v-once
```vue
<template>
  <!-- Will never re-render -->
  <div v-once>{{ heavyComputation() }}</div>
  
  <!-- Only render once, then cache -->
  <HeavyComponent v-once />
</template>
```

### v-memo
```vue
<template>
  <!-- Only re-render if items or selected change -->
  <div v-for="item in items" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }} - selected: {{ item.id === selected }}</p>
    <p>...more child nodes</p>
  </div>
</template>
```

### Virtual Scrolling
```vue
<template>
  <RecycleScroller
    class="scroller"
    :items="items"
    :item-size="32"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="item">
      {{ item.name }}
    </div>
  </RecycleScroller>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const items = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`
}))
</script>

<style scoped>
.scroller {
  height: 400px;
}

.item {
  height: 32px;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
</style>
```

### Lazy Loading Routes
```javascript
// router.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/about',
    // Route level code-splitting
    component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
  },
  {
    path: '/admin',
    // Lazy load admin routes
    component: () => import('./views/AdminLayout.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('./views/admin/Dashboard.vue')
      },
      // ...
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

### Optimizing Updates
```vue
<template>
  <!-- Use v-if instead of v-show for heavy components -->
  <HeavyComponent v-if="show" />
  
  <!-- Use key to force re-render when needed -->
  <Component :key="componentKey" />
  <button @click="componentKey++">Force Update</button>
  
  <!-- Use v-show for frequently toggled elements -->
  <div v-show="isActive">Toggled content</div>
</template>

<script setup>
import { ref, shallowRef } from 'vue'

const show = ref(false)
const componentKey = ref(0)
const isActive = ref(false)

// Use shallowRef for large objects that don't need deep reactivity
const largeObject = shallowRef({ /* ... */ })
</script>
```

## Component Design Patterns

### Compound Components
```vue
<!-- Tabs.vue -->
<template>
  <div class="tabs">
    <div class="tabs-header">
      <slot name="header"></slot>
    </div>
    <div class="tabs-content">
      <slot></slot>
    </div>
  </div>
</template>

<!-- Tab.vue -->
<template>
  <div v-if="isActive" class="tab">
    <slot></slot>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

const activeTab = inject('activeTab')
const isActive = computed(() => activeTab.value === props.title)
</script>

<!-- Usage -->
<Tabs>
  <template #header>
    <button 
      v-for="tab in ['Tab 1', 'Tab 2']" 
      :key="tab"
      @click="activeTab = tab"
    >
      {{ tab }}
    </button>
  </template>
  
  <Tab title="Tab 1">
    Content for Tab 1
  </Tab>
  <Tab title="Tab 2">
    Content for Tab 2
  </Tab>
</Tabs>
```

### Renderless Components
```vue
<!-- Hover.vue -->
<template>
  <div @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <slot :isHovered="isHovered" />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isHovered = ref(false)
</script>

<!-- Usage -->
<Hover v-slot="{ isHovered }">
  <div :class="{ 'hovered': isHovered }">
    Hover over me!
  </div>
</Hover>
```

### Controlled Components
```vue
<template>
  <input 
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<!-- Usage -->
<ControlledInput v-model="searchText" />
```

## Testing Components

### Unit Testing with Vitest
```javascript
// Component.spec.js
import { mount } from '@vue/test-utils'
import Component from './Component.vue'

describe('Component', () => {
  it('renders correctly', () => {
    const wrapper = mount(Component, {
      props: {
        msg: 'Hello, World!'
      },
      global: {
        stubs: ['FontAwesomeIcon']
      }
    })
    
    expect(wrapper.text()).toContain('Hello, World!')
  })
  
  it('emits an event when clicked', async () => {
    const wrapper = mount(Component)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
```

### Component Testing with Testing Library
```javascript
import { render, screen, fireEvent } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import Component from './Component.vue'

test('renders a greeting', () => {
  render(Component, {
    props: {
      msg: 'Hello, World!'
    }
  })
  
  expect(screen.getByText('Hello, World!')).toBeInTheDocument()
})

test('increments counter on button click', async () => {
  render(Component)
  const button = screen.getByRole('button', { name: /count/i })
  
  await userEvent.click(button)
  
  expect(button).toHaveTextContent('Count: 1')
})
```

## Accessibility (a11y)

### ARIA Attributes
```vue
<template>
  <button 
    @click="toggle"
    :aria-expanded="isExpanded"
    :aria-controls="contentId"
  >
    {{ label }}
  </button>
  
  <div :id="contentId" v-show="isExpanded">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: 'Toggle'
  }
})

const isExpanded = ref(false)
const contentId = computed(() => `content-${Math.random().toString(36).substr(2, 9)}`)

function toggle() {
  isExpanded.value = !isExpanded.value
}
</script>
```

### Focus Management
```vue
<template>
  <div>
    <button @click="open = true">Open Dialog</button>
    
    <div v-if="open" role="dialog" aria-labelledby="dialog-title" ref="dialog">
      <h2 id="dialog-title">Dialog Title</h2>
      <p>Dialog content goes here.</p>
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const open = ref(false)
const dialog = ref(null)
let previousActiveElement = null

watch(open, async (newVal) => {
  if (newVal) {
    // Save the currently focused element
    previousActiveElement = document.activeElement
    
    // Wait for the dialog to be rendered
    await nextTick()
    
    // Focus the dialog
    dialog.value.focus()
    
    // Trap focus inside the dialog
    const focusableElements = dialog.value.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    function trapTabKey(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
      
      // Close on Escape
      if (e.key === 'Escape') {
        close()
      }
    }
    
    document.addEventListener('keydown', trapTabKey)
    
    // Cleanup
    return () => {
      document.removeEventListener('keydown', trapTabKey)
      
      // Restore focus to the previously focused element
      if (previousActiveElement) {
        previousActiveElement.focus()
      }
    }
  }
})

function close() {
  open.value = false
}
</script>
```

## Internationalization (i18n)

### Using vue-i18n
```javascript
// plugins/i18n.js
import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    message: {
      hello: 'Hello!',
      welcome: 'Welcome, {name}!'
    }
  },
  es: {
    message: {
      hello: '¡Hola!',
      welcome: '¡Bienvenido, {name}!'
    }
  }
}

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
})

export default i18n

// main.js
import { createApp } from 'vue'
import App from './App.vue'
import i18n from './plugins/i18n'

const app = createApp(App)
app.use(i18n)
app.mount('#app')

// Usage in components
<template>
  <div>
    <p>{{ $t('message.hello') }}</p>
    <p>{{ $t('message.welcome', { name: 'John' }) }}</p>
    
    <!-- Language switcher -->
    <select v-model="$i18n.locale">
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  </div>
</template>
```

## Server-Side Rendering (SSR)

### Basic SSR with Vite
```javascript
// server.js
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './src/App.vue'

export async function render(url) {
  const app = createSSRApp(App)
  
  const appHtml = await renderToString(app)
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR</title>
      </head>
      <body>
        <div id="app">${appHtml}</div>
        <script type="module" src="/src/entry-client.js"></script>
      </body>
    </html>
  `
}

// entry-client.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

// entry-server.js
import { createSSRApp } from 'vue'
import App from './App.vue'

export default function () {
  const app = createSSRApp(App)
  
  return {
    app
  }
}
```

## Progressive Web App (PWA)

### Using Vite PWA Plugin
```bash
npm install -D vite-plugin-pwa
```

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'My Awesome App',
        short_name: 'MyApp',
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})

// Register service worker in main.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
```

## Migration from Vue 2

### Migration Build
```javascript
// vue.config.js
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        vue: '@vue/compat',
        'vue-router': 'vue-router/dist/vue-router.compat.js'
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              compatConfig: {
                MODE: 2 // or 3 for Vue 3 mode with some Vue 2 compat
              }
            }
          }
        }
      ]
    }
  }
}
```

### Breaking Changes
1. **Global API**: `Vue` is no longer a constructor, use `createApp`
2. **Template Directives**: `v-model` syntax changed, `v-for` key usage changed
3. **Events API**: `$on`, `$off`, and `$once` removed
4. **Filters** removed, use methods or computed properties
5. **Functional Components** now need to be plain functions
6. **Async Components** now use `defineAsyncComponent`
7. **Render Function** API changed
8. **Custom Directives** lifecycle hooks renamed
9. **Transition** classes changed
10. **v-model** in components now uses `modelValue` and `update:modelValue`

## Resources

### Official Documentation
- [Vue 3 Documentation](https://v3.vuejs.org/)
- [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html)
- [Single File Components](https://v3.vuejs.org/guide/single-file-component.html)
- [Vue Router](https://next.router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [VueUse](https://vueuse.org/)

### Tools
- [Vue DevTools](https://devtools.vuejs.org/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
- [Vitest](https://vitest.dev/)
- [Vue Test Utils](https://next.vue-test-utils.vuejs.org/)
- [VueUse](https://vueuse.org/)

### UI Frameworks
- [Vuetify](https://next.vuetifyjs.com/)
- [Quasar](https://quasar.dev/)
- [Element Plus](https://element-plus.org/)
- [Naive UI](https://www.naiveui.com/)
- [PrimeVue](https://primefaces.org/primevue/)

### Learning Resources
- [Vue Mastery](https://www.vuemastery.com/)
- [Vue School](https://vueschool.io/)
- [Vue.js Developers](https://vuejsdevelopers.com/)
- [VueDose](https://vuedose.tips/)
