# TypeScript with React

Complete guide to using TypeScript with React for type-safe component development.

## Setup

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

### Add TypeScript to Existing Project

```bash
npm install --save-dev typescript @types/react @types/react-dom
```

## Function Components

### Basic Component

```tsx
interface GreetingProps {
  name: string
}

function Greeting({ name }: GreetingProps) {
  return <h1>Hello, {name}!</h1>
}

// Or with React.FC (not recommended)
const Greeting2: React.FC<GreetingProps> = ({ name }) => {
  return <h1>Hello, {name}!</h1>
}
```

### Component with Optional Props

```tsx
interface UserCardProps {
  name: string
  age?: number
  email?: string
}

function UserCard({ name, age, email }: UserCardProps) {
  return (
    <div>
      <h2>{name}</h2>
      {age && <p>Age: {age}</p>}
      {email && <p>Email: {email}</p>}
    </div>
  )
}
```

### Component with Default Props

```tsx
interface ButtonProps {
  text: string
  variant?: 'primary' | 'secondary'
  disabled?: boolean
}

function Button({ 
  text, 
  variant = 'primary', 
  disabled = false 
}: ButtonProps) {
  return (
    <button className={variant} disabled={disabled}>
      {text}
    </button>
  )
}
```

### Component with Children

```tsx
interface CardProps {
  title: string
  children: React.ReactNode
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  )
}

// Usage
<Card title="My Card">
  <p>Card content</p>
</Card>
```

## Hooks

### useState

```tsx
import { useState } from 'react'

function Counter() {
  // Type inference
  const [count, setCount] = useState(0)
  
  // Explicit type
  const [name, setName] = useState<string>('')
  
  // Union type
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  
  // Object state
  interface User {
    name: string
    age: number
  }
  const [user, setUser] = useState<User | null>(null)
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

### useEffect

```tsx
import { useEffect, useState } from 'react'

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null)
  
  useEffect(() => {
    async function fetchUser() {
      const response = await fetch(`/api/users/${userId}`)
      const data: User = await response.json()
      setUser(data)
    }
    
    fetchUser()
  }, [userId])
  
  return <div>{user?.name}</div>
}
```

### useRef

```tsx
import { useRef, useEffect } from 'react'

function TextInput() {
  // DOM element ref
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Mutable value ref
  const countRef = useRef<number>(0)
  
  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus()
  }, [])
  
  return <input ref={inputRef} type="text" />
}
```

### useContext

```tsx
import { createContext, useContext, useState } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Usage
function ThemedButton() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  )
}
```

### useReducer

```tsx
import { useReducer } from 'react'

interface State {
  count: number
  error: string | null
}

type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' }
  | { type: 'error'; payload: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 }
    case 'decrement':
      return { ...state, count: state.count - 1 }
    case 'reset':
      return { count: 0, error: null }
    case 'error':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, error: null })
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  )
}
```

### Custom Hooks

```tsx
import { useState, useEffect } from 'react'

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url)
        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [url])
  
  return { data, loading, error }
}

// Usage
interface User {
  id: number
  name: string
}

function UserList() {
  const { data, loading, error } = useFetch<User[]>('/api/users')
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <ul>
      {data?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

## Events

### Event Handlers

```tsx
function Form() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
  }
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('Button clicked')
  }
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed')
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} onKeyDown={handleKeyDown} />
      <button onClick={handleClick}>Submit</button>
    </form>
  )
}
```

### Generic Event Handler

```tsx
function handleEvent<T extends HTMLElement>(
  e: React.ChangeEvent<T>
) {
  console.log(e.target.value)
}

// Usage
<input onChange={handleEvent} />
<textarea onChange={handleEvent} />
```

## Props Patterns

### Extending HTML Attributes

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
}

function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  return (
    <button className={variant} {...props}>
      {children}
    </button>
  )
}

// Usage - all button props are available
<Button onClick={() => {}} disabled type="submit">
  Click me
</Button>
```

### Component Props Type

```tsx
// Extract props from existing component
type ButtonProps = React.ComponentProps<typeof Button>

// Extract props from HTML element
type DivProps = React.ComponentProps<'div'>
type InputProps = React.ComponentProps<'input'>
```

### Polymorphic Components

```tsx
type PolymorphicProps<E extends React.ElementType> = {
  as?: E
  children: React.ReactNode
} & React.ComponentPropsWithoutRef<E>

function Text<E extends React.ElementType = 'span'>({
  as,
  children,
  ...props
}: PolymorphicProps<E>) {
  const Component = as || 'span'
  return <Component {...props}>{children}</Component>
}

// Usage
<Text>Default span</Text>
<Text as="h1">Heading</Text>
<Text as="a" href="/about">Link</Text>
```

### Render Props

```tsx
interface MouseTrackerProps {
  render: (position: { x: number; y: number }) => React.ReactNode
}

function MouseTracker({ render }: MouseTrackerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  
  const handleMouseMove = (e: React.MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
  }
  
  return (
    <div onMouseMove={handleMouseMove}>
      {render(position)}
    </div>
  )
}

// Usage
<MouseTracker
  render={({ x, y }) => (
    <p>Mouse at {x}, {y}</p>
  )}
/>
```

## Forms

### Controlled Form

```tsx
import { useState } from 'react'

interface FormData {
  name: string
  email: string
  age: number
}

function UserForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    age: 0
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value
    }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
      />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Form with react-hook-form

```tsx
import { useForm } from 'react-hook-form'

interface FormInputs {
  name: string
  email: string
  age: number
}

function UserForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>()
  
  const onSubmit = (data: FormInputs) => {
    console.log(data)
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: true })} />
      {errors.name && <span>Name is required</span>}
      
      <input {...register('email', { required: true })} />
      {errors.email && <span>Email is required</span>}
      
      <input {...register('age', { valueAsNumber: true })} />
      
      <button type="submit">Submit</button>
    </form>
  )
}
```

## Generic Components

### List Component

```tsx
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}

// Usage
interface User {
  id: number
  name: string
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]

<List items={users} renderItem={(user) => <span>{user.name}</span>} />
```

### Table Component

```tsx
interface Column<T> {
  key: keyof T
  header: string
  render?: (value: T[keyof T], item: T) => React.ReactNode
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
}

function Table<T>({ data, columns }: TableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key as string}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>
            {columns.map(col => (
              <td key={col.key as string}>
                {col.render 
                  ? col.render(item[col.key], item)
                  : String(item[col.key])
                }
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

## Higher-Order Components

```tsx
interface WithLoadingProps {
  loading: boolean
}

function withLoading<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithLoadingComponent(
    props: P & WithLoadingProps
  ) {
    const { loading, ...rest } = props
    
    if (loading) {
      return <div>Loading...</div>
    }
    
    return <Component {...(rest as P)} />
  }
}

// Usage
interface UserListProps {
  users: User[]
}

function UserList({ users }: UserListProps) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}

const UserListWithLoading = withLoading(UserList)

// Use it
<UserListWithLoading loading={false} users={users} />
```

## Typing Third-Party Libraries

### Axios

```tsx
import axios from 'axios'

interface User {
  id: number
  name: string
  email: string
}

async function getUser(id: number): Promise<User> {
  const response = await axios.get<User>(`/api/users/${id}`)
  return response.data
}
```

### React Query

```tsx
import { useQuery } from '@tanstack/react-query'

interface User {
  id: number
  name: string
}

function useUser(id: number) {
  return useQuery<User, Error>({
    queryKey: ['user', id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${id}`)
      return response.json()
    }
  })
}

function UserProfile({ id }: { id: number }) {
  const { data, isLoading, error } = useUser(id)
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{data?.name}</div>
}
```

## Best Practices

- ✅ Use function components over class components
- ✅ Prefer type inference over explicit types
- ✅ Use interfaces for props
- ✅ Avoid `React.FC` for function components
- ✅ Use `React.ReactNode` for children prop
- ✅ Create custom hooks for reusable logic
- ✅ Use discriminated unions for state management
- ✅ Type event handlers properly

## Common Pitfalls

- ⚠️ **Don't use `any` for props** - Define proper types
- ⚠️ **Don't forget to type event handlers** - Use React event types
- ⚠️ **Don't use `React.FC`** - It's not recommended anymore
- ⚠️ **Don't forget null checks** - Use optional chaining
- ⚠️ **Don't inline complex types** - Extract to interfaces

## Related Topics

- [Basics](./basics.md)
- [Advanced Types](./advanced.md)
- [Setup](./setup.md)

## References

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [React Documentation](https://react.dev/learn/typescript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
