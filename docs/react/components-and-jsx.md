# Components and JSX

Learn how to build UI using React components and JSX syntax.

## What are Components?
- Reusable UI pieces that return JSX
- Functional components are the default in modern React

```jsx
// Greeting.jsx
export default function Greeting({ name }) {
  return <h2>Hello, {name}!</h2>
}
```

## JSX Basics
- Looks like HTML, but it’s JavaScript under the hood
- Must return a single parent (use a wrapper element or `<>...</>`) 
- Use `className` instead of `class`
- Expressions go inside `{}`

```jsx
const msg = 'Welcome'
return (
  <div className="box">
    <h1>{msg}</h1>
  </div>
)
```

## Props
- Input to components
- Read-only; do not mutate props

```jsx
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>
}

// usage
<Button label="Save" onClick={() => console.log('clicked')} />
```

## Children
- Special prop for nested content

```jsx
function Card({ title, children }) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <div>{children}</div>
    </section>
  )
}

<Card title="Profile">
  <p>User details go here.</p>
</Card>
```

## Conditional Rendering
```jsx
{isLoading ? (
  <Spinner />
) : error ? (
  <ErrorBox />
) : (
  <DataView data={data} />
)}

// Short-circuit
{items.length > 0 && <List items={items} />}
```

## Lists and Keys
- Always provide stable `key` for list items

```jsx
<ul>
  {users.map(user => (
    <li key={user.id}>{user.name}</li>
  ))}
</ul>
```

## Event Handling
- Use camelCase event names; pass functions, don’t call them immediately

```jsx
<button onClick={() => setOpen(o => !o)}>Toggle</button>
```

## Composition vs Inheritance
- Prefer composing components via props/children over inheritance

```jsx
function Modal({ title, footer, children }) {
  return (
    <div className="modal">
      <header>{title}</header>
      <main>{children}</main>
      <footer>{footer}</footer>
    </div>
  )
}
```

## Fragments
- Group elements without extra DOM nodes

```jsx
return (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
)
```

## Styling Patterns
- Class names + CSS files
- CSS Modules: `import styles from './box.module.css'`
- Tailwind CSS utility classes
- CSS-in-JS libraries (Emotion, Styled Components)

## Accessibility Essentials
- Use semantic HTML
- Label form controls (`<label htmlFor="id">`)
- Manage focus for dialogs/menus
- Provide alt text for images

## Common Pitfalls
- Returning multiple siblings without a wrapper
- Missing `key` in lists
- Using `class` instead of `className`
- Heavy inline functions without memoization (optimize later with `useCallback` if necessary)

## Next Steps
- Learn state and props patterns
- Explore hooks: `useState`, `useEffect`, `useMemo`, `useCallback`
- Try splitting UI into small, focused components
