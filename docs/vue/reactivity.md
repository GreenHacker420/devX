# Vue Reactivity System

## Table of Contents
1. [Introduction to Reactivity](#introduction-to-reactivity)
2. [Reactive State](#reactive-state)
3. [Reactive Objects](#reactive-objects)
4. [Reactive Arrays](#reactive-arrays)
5. [Reactive Refs](#reactive-refs)
6. [Computed Properties](#computed-properties)
7. [Watching Reactive Data](#watching-reactive-data)
8. [Effect Scope](#effect-scope)
9. [Reactivity Utilities](#reactivity-utilities)
10. [Performance Considerations](#performance-considerations)

## Introduction to Reactivity

Vue's reactivity system is the foundation of its component model. When you change data, the view updates automatically.

### How Reactivity Works
1. **Proxy-based** (Vue 3): Uses JavaScript Proxies to track property access
2. **Getter/Setter** (Vue 2): Uses Object.defineProperty for reactivity

## Reactive State

### `reactive()`
Creates a reactive object (works with objects, arrays, Map, Set).

```typescript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  user: {
    name: 'John',
    age: 30
  },
  todos: []
})

// Nested objects are reactive
state.user.name = 'Jane' // triggers reactivity
```

### `ref()`
Creates a reactive reference to a value.

```typescript
import { ref } from 'vue'

const count = ref(0) // { value: 0 }
const user = ref({
  name: 'John',
  age: 30
})

// Access with .value
count.value++ // triggers reactivity
user.value.name = 'Jane' // also reactive

// In templates, no .value needed
// <div>{{ count }}</div>
```

### `readonly()`
Creates a read-only proxy of the original object.

```typescript
import { reactive, readonly } from 'vue'

const original = reactive({ count: 0 })
const copy = readonly(original)

// Mutating original will trigger updates in copy
original.count++ // works
copy.count++ // warning: cannot mutate readonly property
```

## Reactive Objects

### Shallow Reactive
Only the top-level properties are reactive.

```typescript
import { shallowReactive } from 'vue'

const state = shallowReactive({
  count: 0,
  user: { name: 'John' } // nested object is NOT reactive
})

state.count++ // reactive
state.user.name = 'Jane' // NOT reactive
```

### Reactive vs Ref

| Feature           | `reactive` | `ref` |
|-------------------|------------|-------|
| Works with        | Objects/Arrays | Any value |
| Access in JS     | Direct     | `.value` |
| Template usage   | Direct     | Unwraps automatically |
| TypeScript support | Good      | Excellent |
| Watch deep by default | Yes | No |

## Reactive Arrays

### Array Reactivity
```typescript
const list = reactive([1, 2, 3])

// These methods trigger updates
list.push(4)
list.pop()
list.splice(0, 1, 5)
list.sort()
list.reverse()

// Replacing the entire array works
list = [...list, 4] // with let
list.splice(0, list.length, ...newList) // with const
```

### Caveats with Arrays
```typescript
// These won't trigger updates
list[0] = 5 // Won't work
list.length = 0 // Won't work

// Solutions
list.splice(0, 1, 5) // Use array methods
list.splice(0) // Clear array
```

## Computed Properties

### Basic Usage
```typescript
import { ref, computed } from 'vue'

const count = ref(0)
const double = computed(() => count.value * 2)

console.log(double.value) // 0
count.value++
console.log(double.value) // 2
```

### Writable Computed
```typescript
const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})

fullName.value = 'Jane Smith' // Updates firstName and lastName
```

## Watching Reactive Data

### `watch`
```typescript
import { ref, watch } from 'vue'

const count = ref(0)
const user = reactive({ name: 'John' })

// Watch a single ref
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
})

// Watch a getter function
watch(
  () => user.name,
  (newName, oldName) => {
    console.log(`Name changed from ${oldName} to ${newName}`)
  }
)

// Watch multiple sources
watch(
  [() => user.name, count],
  ([newName, newCount], [oldName, oldCount]) => {
    console.log('Name or count changed')
  }
)
```

### `watchEffect`
Runs immediately and tracks reactive dependencies automatically.

```typescript
import { ref, watchEffect } from 'vue'

const count = ref(0)
const double = ref(0)

watchEffect(() => {
  // Automatically tracks count
  double.value = count.value * 2
})

count.value++ // Triggers effect
```

### Watch Options
```typescript
watch(
  source,
  callback,
  {
    immediate: true, // Run immediately
    deep: true,      // Deep watch
    flush: 'post',   // Run after DOM updates
    onTrack(e) {     // Debugging
      debugger
    },
    onTrigger(e) {   // Debugging
      debugger
    }
  }
)
```

## Effect Scope

### `effectScope`
Groups multiple effects together for better organization and cleanup.

```typescript
import { effectScope, ref, watch, watchEffect } from 'vue'

const scope = effectScope()

scope.run(() => {
  const count = ref(0)
  
  watch(count, () => console.log('Count changed'))
  watchEffect(() => console.log('Effect:', count.value))
  
  // All effects are stopped when scope is stopped
  setTimeout(() => scope.stop(), 1000)
})
```

## Reactivity Utilities

### `toRef` and `toRefs`
```typescript
import { reactive, toRef, toRefs } from 'vue'

const state = reactive({
  foo: 1,
  bar: 2
})

// Convert a single property to a ref
const fooRef = toRef(state, 'foo')

// Convert all properties to refs
const { foo, bar } = toRefs(state)

// Now you can pass refs around without losing reactivity
function useFeatureX(foo, bar) {
  // Both are refs that stay synced with the original
  return {
    foo,
    bar,
    sum: computed(() => foo.value + bar.value)
  }
}
```

### `isReactive` and `isRef`
```typescript
import { isReactive, isRef, reactive, ref } from 'vue'

console.log(isReactive(reactive({}))) // true
console.log(isRef(ref(0))) // true
```

### `shallowRef` and `triggerRef`
```typescript
import { shallowRef, triggerRef } from 'vue'

const state = shallowRef({ count: 0 })

// Doesn't trigger updates for nested properties
state.value.count++ // No update

// Force update
triggerRef(state) // Triggers update
```

## Performance Considerations

1. **Avoid Large Reactive Objects**
   - Keep reactive state minimal
   - Use `shallowRef` or `shallowReactive` for large objects

2. **Debounce Expensive Operations**
   ```typescript
   import { debounce } from 'lodash-es'
   
   const searchQuery = ref('')
   const searchResults = ref([])
   
   const search = debounce(async () => {
     searchResults.value = await fetchResults(searchQuery.value)
   }, 500)
   
   watch(searchQuery, search)
   ```

3. **Use `computed` for Derived State**
   - Caches results until dependencies change
   - More efficient than methods in templates

4. **Batch Updates**
   ```typescript
   import { nextTick } from 'vue'
   
   // Multiple state updates in the same tick
   const update = () => {
     state.a = 1
     state.b = 2
     // DOM updates once after this function
   }
   
   // Or use nextTick
   const update = async () => {
     state.a = 1
     await nextTick()
     // DOM is updated
     state.b = 2
   }
   ```

5. **Virtual Scrolling for Large Lists**
   ```vue
   <template>
     <div class="scroll-container">
       <div 
         v-for="item in visibleItems" 
         :key="item.id"
         class="list-item"
       >
         {{ item.content }}
       </div>
     </div>
   </template>
   
   <script setup>
   import { computed, onMounted, onUnmounted, ref } from 'vue'
   
   const items = Array.from({ length: 10000 }, (_, i) => ({
     id: i,
     content: `Item ${i + 1}`
   }))
   
   const scrollTop = ref(0)
   const containerHeight = ref(0)
   const itemHeight = 50
   const buffer = 5
   
   const visibleItems = computed(() => {
     const start = Math.max(0, Math.floor(scrollTop.value / itemHeight) - buffer)
     const end = Math.min(
       items.length,
       Math.ceil((scrollTop.value + containerHeight.value) / itemHeight) + buffer
     )
     return items.slice(start, end)
   })
   
   const onScroll = (e) => {
     scrollTop.value = e.target.scrollTop
   }
   
   onMounted(() => {
     const container = document.querySelector('.scroll-container')
     containerHeight.value = container.clientHeight
     container.addEventListener('scroll', onScroll)
   })
   
   onUnmounted(() => {
     const container = document.querySelector('.scroll-container')
     container?.removeEventListener('scroll', onScroll)
   })
   </script>
   
   <style scoped>
   .scroll-container {
     height: 400px;
     overflow-y: auto;
     position: relative;
   }
   
   .list-item {
     height: 50px;
     position: absolute;
     width: 100%;
   }
   
   .list-item:nth-child(even) {
     background-color: #f5f5f5;
   }
   </style>
   ```

## Common Pitfalls

1. **Destructuring Reactive Objects**
   ```typescript
   // ❌ Loses reactivity
   const { x, y } = reactive({ x: 0, y: 0 })
   
   // ✅ Use toRefs
   const pos = reactive({ x: 0, y: 0 })
   const { x, y } = toRefs(pos)
   ```

2. **Async Updates**
   ```typescript
   // ❌ May miss updates
   const update = async () => {
     state.data = await fetchData()
     // DOM not updated yet
     doSomethingWithDOM()
   }
   
   // ✅ Use nextTick
   const update = async () => {
     state.data = await fetchData()
     await nextTick()
     // DOM is updated
     doSomethingWithDOM()
   }
   ```

3. **Circular References**
   ```typescript
   // ❌ Creates infinite loop
   const obj = reactive({})
   obj.self = obj // Circular reference
   
   // ✅ Break the cycle
   const obj = reactive({
     self: null as any
   })
   obj.self = obj // Still reactive, but no infinite loop
   ```

## Advanced Reactivity Patterns

### Custom Ref
```typescript
import { customRef } from 'vue'

function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      }
    }
  })
}

// Usage
const text = useDebouncedRef('hello')
```

### Reactive State Machine
```typescript
import { reactive } from 'vue'

function createMachine(config) {
  const state = reactive({
    current: config.initial,
    transition(event) {
      const currentState = config.states[state.current]
      const nextState = currentState?.on?.[event]
      
      if (nextState) {
        currentState.onExit?.()
        state.current = nextState
        config.states[nextState].onEnter?.()
        return true
      }
      return false
    }
  })
  
  return state
}

// Usage
const trafficLight = createMachine({
  initial: 'red',
  states: {
    red: {
      on: { next: 'green' },
      onEnter: () => console.log('Stop!')
    },
    yellow: {
      on: { next: 'red' },
      onEnter: () => console.log('Slow down!')
    },
    green: {
      on: { next: 'yellow' },
      onEnter: () => console.log('Go!')
    }
  }
})

trafficLight.transition('next') // Logs: "Go!"
```
