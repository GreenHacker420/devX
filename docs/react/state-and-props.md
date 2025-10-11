# State and Props

Understand how data flows in React and how components manage UI changes.

## Props (Input)
- Read-only data passed from parent to child.
- Immutable inside the child component.

```jsx
function User({ name, age }) {
  return <p>{name} — {age}</p>
}

export default function App() {
  return <User name="Ada" age={28} />
}
```

## State (Local, Mutable via Setters)
- Managed by the component with hooks like `useState`.
- Triggers re-render when updated.

```jsx
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
    </div>
  )
}
```

## Updating State Correctly
- Treat state as immutable; create new arrays/objects.
- Use functional updates when next state depends on previous.

```jsx
// Arrays
setItems(prev => [...prev, newItem])
setItems(prev => prev.filter(x => x.id !== id))

// Objects
setUser(prev => ({ ...prev, name: 'Ada' }))
```

## Derived State
- Prefer computing from existing props/state instead of duplicating in state.

```jsx
// Good: derive
const fullName = `${user.first} ${user.last}`

// Avoid: duplicate state that can drift out of sync
```

## Controlled vs Uncontrolled Inputs
- Controlled: value comes from state; single source of truth.

```jsx
function NameForm() {
  const [name, setName] = useState('')
  return (
    <form onSubmit={e => e.preventDefault()}>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button>Save</button>
    </form>
  )
}
```

- Uncontrolled: use refs to read values when needed (simpler forms).

```jsx
import { useRef } from 'react'

function QuickForm() {
  const inputRef = useRef(null)
  const submit = () => console.log(inputRef.current.value)
  return (
    <>
      <input ref={inputRef} />
      <button onClick={submit}>Submit</button>
    </>
  )
}
```

## Lifting State Up
- Move state to the nearest common parent to share it between siblings.

```jsx
function Filter({ query, setQuery }) {
  return <input value={query} onChange={e => setQuery(e.target.value)} />
}

function List({ items, query }) {
  return (
    <ul>
      {items.filter(i => i.includes(query)).map(i => <li key={i}>{i}</li>)}
    </ul>
  )
}

export default function App() {
  const [query, setQuery] = useState('')
  const items = ['react', 'hooks', 'state']
  return (
    <>
      <Filter query={query} setQuery={setQuery} />
      <List items={items} query={query} />
    </>
  )
}
```

## Passing Callbacks via Props
- Parents pass event handlers so children can notify changes.

```jsx
function Toggle({ onChange, on }) {
  return <button onClick={() => onChange(!on)}>{on ? 'ON' : 'OFF'}</button>
}

export default function App() {
  const [on, setOn] = useState(false)
  return <Toggle on={on} onChange={setOn} />
}
```

## Avoid Prop Drilling (Overview)
- When many levels pass the same props, consider Context.
- For server/cache data, prefer libraries like React Query.

## Common Pitfalls
- Mutating state directly (`state.push(...)`) — creates bugs.
- Setting state in render. Only set state in events/effects.
- Stale closures: use functional `setState` when using previous value.

## Next Steps
- Learn `useEffect` for side effects.
- Explore memoization (`useMemo`, `useCallback`) for performance.
- Try forms with validation and debounced inputs.
