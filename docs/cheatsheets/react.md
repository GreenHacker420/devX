# ⚛️ React Cheatsheet

Quick reference for React essentials.

---

## 🚀 Setup

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

## 🧩 Components

```jsx
// Functional Component
const Button = () => <button>Click</button>;

// Props
function Greeting({ name }) {
  return <h1>Hello {name}</h1>;
}
<Greeting name="Divya" />

// Default Props
function Button({ text = "Click me" }) {
  return <button>{text}</button>;
}

// Children
function Container({ children }) {
  return <div>{children}</div>;
}
<Container>
  <p>Hi</p>
</Container>

```

## ⚙️ State

```jsx
import { useState } from "react";

// Basic state
const [count, setCount] = useState(0);

// Update state
setCount(count + 1);            // simple update
setCount(prev => prev + 1);     // functional update

// Objects & Arrays
setUser({ ...user, name: "Jane" });           // update object
setItems([...items, newItem]);                // add to array
setItems(items.filter(i => i.id !== id));     // remove from array
setItems(items.map(i => i.id === id ? updated : i));  // update array item
```

## 🧠 Hooks

| Hook       | Purpose                |
|------------|-----------------------|
| `useState` | State                 |
| `useEffect`| Side effects          |
| `useRef`   | DOM/mutable value     |
| `useContext` | Context API         |
| `useReducer` | Complex state logic |
| `useMemo`  | Memoize value         |
| `useCallback` | Memoize function   |


```jsx
import { useState, useEffect, useRef, useMemo, useCallback, useContext, useReducer } from "react";

// useRef - access DOM or mutable value
const inputRef = useRef();

// useEffect - run on mount
useEffect(() => {
  console.log("mounted");
}, []);

// useMemo - memoize expensive computation
const value = useMemo(() => compute(a, b), [a, b]);

// useCallback - memoize function
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

## 🔁 Lists & Conditional Rendering

```jsx
// Lists
items.map(item => <li key={item.id}>{item.name}</li>);

// Conditional Rendering
isLoggedIn ? <Dashboard /> : <Login />   // Ternary
isLoggedIn && <Dashboard />             // Logical AND
user?.name ?? "Guest"                   // Nullish coalescing
```

## 📝 Events

```jsx
// Click Event
<button onClick={handleClick}>Click</button>

// Input Change
<input onChange={e => setValue(e.target.value)} />

// Form Submit
<form onSubmit={handleSubmit}></form>

// Mouse Events
<div onMouseEnter={handleEnter}></div>
```

## 🌐 Context API

```jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("light");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <YourComponent />
    </ThemeContext.Provider>
  );
}

// Usage in child
const { theme, setTheme } = useContext(ThemeContext);
```
## 📡 Fetching Data

```jsx
import { useEffect, useState, useContext } from "react";

const [data, setData] = useState(null);
const [error, setError] = useState(null);

// Basic Fetch
useEffect(() => {
  fetch('/api/data')
    .then(res => res.json())
    .then(setData)
    .catch(setError);
}, []);

// Async/Await
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch('/api');
      setData(await res.json());
    } catch(e) {
      setError(e);
    }
  };
  fetchData();
}, []);
```
## 🧭 React Router (v6+)

```jsx
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import Home from './Home';
import About from './About';
import User from './User';

// Routes
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/user/:id" element={<User />} />
</Routes>

// Navigation
<Link to="/about">About</Link>

// URL Parameters
const { id } = useParams();

// Programmatic Navigation
const navigate = useNavigate();
navigate('/about');
```

## 🎨 Styling in React

```jsx
// Inline Styles
<div style={{ color: 'blue' }} />

// CSS Modules
<button className={styles.btn} />

// Tailwind CSS
<button className="bg-blue-500 text-white px-4 py-2 rounded" />
## 🧰 Common Commands

| Command           | Description                 |
|------------------|-----------------------------|
| `npm run dev`     | Start dev server            |
| `npm run build`   | Build production bundle     |
| `npm run lint`    | Run linter                  |
| `npm run preview` | Preview production build    |
```
## 💡 Best Practices

- ✅ Use functional components  
- ✅ Keep components small and focused  
- ✅ Use prop types or TypeScript for validation  
- ✅ Organize files by feature/module  
- ✅ Avoid unnecessary re-renders  
```
## 📚 References

- [React Official Docs](https://react.dev)  
- [React Router Docs](https://reactrouter.com)  
- [Vite + React Guide](https://vitejs.dev/guide)  
```