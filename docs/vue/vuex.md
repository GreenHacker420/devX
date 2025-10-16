# Vuex: State Management for Vue.js

## Table of Contents
- [Introduction to Vuex](#introduction-to-vuex)
- [Core Concepts](#core-concepts)
  - [State](#state)
  - [Getters](#getters)
  - [Mutations](#mutations)
  - [Actions](#actions)
  - [Modules](#modules)
- [Setting Up Vuex](#setting-up-vuex)
- [Basic Usage](#basic-usage)
- [Advanced Patterns](#advanced-patterns)
- [Composition API with Vuex](#composition-api-with-vuex)
- [Testing Vuex](#testing-vuex)
- [Vuex vs. Pinia](#vuex-vs-pinia)
- [Best Practices](#best-practices)
- [Migration from Vuex 3 to 4](#migration-from-vuex-3-to-4)
- [Common Pitfalls](#common-pitfalls)
- [Performance Optimization](#performance-optimization)
- [Useful Plugins](#useful-plugins)

## Introduction to Vuex

Vuex is a state management pattern + library for Vue.js applications. It serves as a centralized store for all the components in an application, with rules ensuring that the state can only be mutated in a predictable fashion.

### When to Use Vuex
- Large-scale applications with complex state management needs
- Multiple components need to share state
- State needs to be accessed by many components at different nesting levels
- State needs to be preserved across page reloads
- State needs to be tracked and debugged

## Core Concepts

### State

```javascript
const store = createStore({
  state: {
    count: 0,
    todos: []
  }
})
```

### Getters

```javascript
const store = createStore({
  state: {
    todos: [
      { id: 1, text: 'Learn Vue', done: true },
      { id: 2, text: 'Learn Vuex', done: false }
    ]
  },
  getters: {
    doneTodos: (state) => {
      return state.todos.filter(todo => todo.done)
    },
    getTodoById: (state) => (id) => {
      return state.todos.find(todo => todo.id === id)
    }
  }
})
```

### Mutations

```javascript
const store = createStore({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      state.count++
    },
    incrementBy (state, payload) {
      state.count += payload.amount
    }
  }
})

// Commit a mutation
store.commit('increment')
store.commit('incrementBy', { amount: 10 })
```

### Actions

```javascript
const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    incrementAsync ({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    },
    async fetchData({ commit }) {
      try {
        const response = await fetch('api/data')
        const data = await response.json()
        commit('setData', data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  }
})

// Dispatch an action
store.dispatch('incrementAsync')
```

### Modules

```javascript
const moduleA = {
  namespaced: true,
  state: { count: 0 },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  getters: {
    doubleCount (state) {
      return state.count * 2
    }
  }
}

const store = createStore({
  modules: {
    a: moduleA
  }
})

// Access module state
store.state.a.count

// Access module getter
store.getters['a/doubleCount']

// Commit module mutation
store.commit('a/increment')

// Dispatch module action
store.dispatch('a/incrementAsync')
```

## Setting Up Vuex

### Installation

```bash
# For Vue 3
npm install vuex@next --save
# or with yarn
yarn add vuex@next
```

### Basic Store

```javascript
import { createApp } from 'vue'
import { createStore } from 'vuex'

const store = createStore({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    incrementAsync ({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    }
  },
  getters: {
    getCount: state => state.count
  }
})

const app = createApp({ /* your root component */ })
app.use(store)
app.mount('#app')
```

## Composition API with Vuex

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
    <button @click="incrementAsync">Increment Async</button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()
    
    return {
      count: computed(() => store.state.count),
      doubleCount: computed(() => store.getters.doubleCount),
      increment: () => store.commit('increment'),
      incrementAsync: () => store.dispatch('incrementAsync')
    }
  }
}
</script>
```

## Testing Vuex

### Testing Mutations

```javascript
import { createStore } from 'vuex'
import { mutations } from '@/store/mutations'

describe('mutations', () => {
  let store
  
  beforeEach(() => {
    store = createStore({
      state: { count: 0 },
      mutations
    })
  })
  
  test('increment increments state.count by 1', () => {
    store.commit('increment')
    expect(store.state.count).toBe(1)
  })
})
```

### Testing Actions

```javascript
import { createStore } from 'vuex'
import { actions } from '@/store/actions'

// Mock API or service
jest.mock('@/api', () => ({
  fetchData: jest.fn(() => Promise.resolve({ data: 'mocked data' }))
}))

describe('actions', () => {
  let store
  
  beforeEach(() => {
    store = createStore({
      state: { data: null },
      mutations: {
        setData: (state, data) => { state.data = data }
      },
      actions
    })
  })
  
  test('fetchData commits the response', async () => {
    await store.dispatch('fetchData')
    expect(store.state.data).toBe('mocked data')
  })
})
```

## Vuex vs. Pinia

| Feature | Vuex | Pinia |
|---------|------|-------|
| Vue 3 Support | Vuex 4+ | Built for Vue 3 |
| TypeScript | Partial | First-class |
| DevTools | Yes | Yes |
| Composition API | Yes | Built with it |
| Size | ~1.5KB | ~1KB |
| Modules | Required | Optional |
| Code Splitting | Manual | Automatic |

## Best Practices

1. **Strict Mode**
   ```javascript
   const store = createStore({
     // ...
     strict: process.env.NODE_ENV !== 'production'
   })
   ```

2. **Use Constants for Mutation Types**
   ```javascript
   // mutation-types.js
   export const SOME_MUTATION = 'SOME_MUTATION'
   
   // store.js
   import { SOME_MUTATION } from './mutation-types'
   
   const store = createStore({
     state: { ... },
     mutations: {
       [SOME_MUTATION] (state) {
         // mutate state
       }
     }
   })
   ```

3. **Organize with Modules**
   ```
   store/
   ├── index.js          # where we assemble modules and export the store
   ├── actions.js        # root actions
   ├── mutations.js      # root mutations
   └── modules/
       ├── cart.js       # cart module
       └── products.js   # products module
   ```

4. **Use Action Composition**
   ```javascript
   actions: {
     async actionA ({ commit }) {
       commit('gotData', await getData())
     },
     async actionB ({ dispatch, commit }) {
       await dispatch('actionA') // wait for actionA to finish
       commit('gotOtherData', await getOtherData())
     }
   }
   ```

## Migration from Vuex 3 to 4

1. **Installation**
   ```bash
   npm install vuex@next
   ```

2. **Breaking Changes**
   - Vue 3 compatibility only
   - New `createStore` function instead of `new Vuex.Store`
   - TypeScript improvements
   - `store.subscribeAction` now receives an object with `before` and `after` hooks

## Common Pitfalls

1. **Mutating State Outside Mutations**
   ```javascript
   // Bad
   store.state.count = 10
   
   // Good
   store.commit('setCount', 10)
   ```

2. **Not Using Getters for Derived State**
   ```javascript
   // Bad - computed property in component
   computed: {
     completedTodos() {
       return this.$store.state.todos.filter(todo => todo.completed)
     }
   }
   
   // Good - using getter
   computed: {
     completedTodos() {
       return this.$store.getters.completedTodos
     }
   }
   ```

3. **Overusing Vuex**
   - Use component local state for component-specific state
   - Use props/events for parent-child communication
   - Use provide/inject for dependency injection
   - Use Vuex for global state that needs to be shared across components

## Performance Optimization

1. **Use `mapState` with Care**
   ```javascript
   // Instead of this (creates a new computed property for each state property)
   ...mapState(['a', 'b', 'c'])
   
   // Do this (single computed property)
   ...mapState({
     state: state => ({
       a: state.a,
       b: state.b,
       c: state.c
     })
   })
   ```

2. **Use `mapGetters` for Multiple Getters**
   ```javascript
   import { mapGetters } from 'vuex'
   
   export default {
     computed: {
       ...mapGetters([
         'doneTodosCount',
         'anotherGetter',
         // ...
       ])
     }
   }
   ```

3. **Lazy Load Modules**
   ```javascript
   const store = createStore({ /* ... */ })
   
   // Load module dynamically
   import('./modules/cart').then(cartModule => {
     store.registerModule('cart', cartModule.default)
   })
   ```

## Useful Plugins

1. **vuex-persistedstate**
   ```bash
   npm install --save vuex-persistedstate
   ```
   
   ```javascript
   import createPersistedState from 'vuex-persistedstate'
   
   const store = createStore({
     // ...
     plugins: [
       createPersistedState({
         key: 'my-app',
         paths: ['user', 'settings']
       })
     ]
   })
   ```

2. **vuex-router-sync**
   ```bash
   npm install vuex-router-sync@next
   ```
   
   ```javascript
   import { sync } from 'vuex-router-sync'
   import store from './store'
   import router from './router'
   
   sync(store, router)
   ```

3. **vuex-shared-mutations**
   ```bash
   npm install --save vuex-shared-mutations
   ```
   
   ```javascript
   import createMutationsSharer from 'vuex-shared-mutations'
   
   const store = createStore({
     // ...
     plugins: [
       createMutationsSharer({
         predicate: [
           'increment',
           'decrement',
           'setUser'
         ]
       })
     ]
   })
   ```

## Conclusion

Vuex provides a robust solution for state management in Vue.js applications. While newer solutions like Pinia offer a more modern API, Vuex remains a solid choice, especially for existing projects. By following the patterns and best practices outlined in this guide, you can build maintainable and scalable Vue.js applications with Vuex.
