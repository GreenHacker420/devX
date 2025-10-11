# Tailwind CSS

Complete guide to using Tailwind CSS for rapid UI development with utility-first CSS.

## What is Tailwind CSS?

Tailwind CSS is a utility-first CSS framework that provides low-level utility classes to build custom designs without writing CSS.

## Installation

### With Vite

```bash
npm create vite@latest my-app
cd my-app
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### With Next.js

```bash
npx create-next-app@latest my-app
# Select "Yes" for Tailwind CSS during setup
```

### With Create React App

```bash
npx create-react-app my-app
cd my-app
npm install -D tailwindcss
npx tailwindcss init
```

### Manual Installation

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Configuration

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3490dc',
        secondary: '#ffed4e',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
```

### CSS File

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Layout

### Container

```html
<div class="container mx-auto px-4">
  Content centered with padding
</div>

<!-- Responsive container -->
<div class="container sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto">
  Responsive width
</div>
```

### Display

```html
<!-- Block -->
<div class="block">Block element</div>

<!-- Inline Block -->
<span class="inline-block">Inline block</span>

<!-- Flex -->
<div class="flex">Flex container</div>

<!-- Grid -->
<div class="grid">Grid container</div>

<!-- Hidden -->
<div class="hidden">Hidden element</div>
```

### Flexbox

```html
<!-- Flex Direction -->
<div class="flex flex-row">Horizontal</div>
<div class="flex flex-col">Vertical</div>

<!-- Justify Content -->
<div class="flex justify-start">Start</div>
<div class="flex justify-center">Center</div>
<div class="flex justify-end">End</div>
<div class="flex justify-between">Space between</div>
<div class="flex justify-around">Space around</div>

<!-- Align Items -->
<div class="flex items-start">Top</div>
<div class="flex items-center">Center</div>
<div class="flex items-end">Bottom</div>
<div class="flex items-stretch">Stretch</div>

<!-- Flex Wrap -->
<div class="flex flex-wrap">Wrap</div>
<div class="flex flex-nowrap">No wrap</div>

<!-- Gap -->
<div class="flex gap-4">Gap 1rem</div>
<div class="flex gap-x-4 gap-y-2">Different gaps</div>
```

### Grid

```html
<!-- Grid Columns -->
<div class="grid grid-cols-3">3 columns</div>
<div class="grid grid-cols-4 gap-4">4 columns with gap</div>

<!-- Responsive Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  Responsive columns
</div>

<!-- Grid Template -->
<div class="grid grid-cols-3 grid-rows-3">
  <div class="col-span-2">Spans 2 columns</div>
  <div class="row-span-2">Spans 2 rows</div>
</div>
```

## Spacing

### Padding

```html
<!-- All sides -->
<div class="p-4">Padding 1rem</div>

<!-- Individual sides -->
<div class="pt-4">Padding top</div>
<div class="pr-4">Padding right</div>
<div class="pb-4">Padding bottom</div>
<div class="pl-4">Padding left</div>

<!-- Horizontal & Vertical -->
<div class="px-4">Padding horizontal</div>
<div class="py-4">Padding vertical</div>

<!-- Responsive -->
<div class="p-2 md:p-4 lg:p-6">Responsive padding</div>
```

### Margin

```html
<!-- All sides -->
<div class="m-4">Margin 1rem</div>

<!-- Individual sides -->
<div class="mt-4">Margin top</div>
<div class="mr-4">Margin right</div>
<div class="mb-4">Margin bottom</div>
<div class="ml-4">Margin left</div>

<!-- Auto margin (centering) -->
<div class="mx-auto">Centered horizontally</div>

<!-- Negative margin -->
<div class="-mt-4">Negative margin top</div>
```

### Space Between

```html
<div class="flex flex-col space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<div class="flex space-x-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

## Typography

### Font Size

```html
<p class="text-xs">Extra small</p>
<p class="text-sm">Small</p>
<p class="text-base">Base</p>
<p class="text-lg">Large</p>
<p class="text-xl">Extra large</p>
<p class="text-2xl">2XL</p>
<p class="text-3xl">3XL</p>
<p class="text-4xl">4XL</p>
```

### Font Weight

```html
<p class="font-thin">Thin</p>
<p class="font-light">Light</p>
<p class="font-normal">Normal</p>
<p class="font-medium">Medium</p>
<p class="font-semibold">Semibold</p>
<p class="font-bold">Bold</p>
<p class="font-extrabold">Extra bold</p>
```

### Text Alignment

```html
<p class="text-left">Left aligned</p>
<p class="text-center">Center aligned</p>
<p class="text-right">Right aligned</p>
<p class="text-justify">Justified</p>
```

### Text Color

```html
<p class="text-black">Black</p>
<p class="text-white">White</p>
<p class="text-gray-500">Gray</p>
<p class="text-red-500">Red</p>
<p class="text-blue-500">Blue</p>
<p class="text-green-500">Green</p>
```

### Text Transform

```html
<p class="uppercase">UPPERCASE</p>
<p class="lowercase">lowercase</p>
<p class="capitalize">Capitalize Each Word</p>
<p class="normal-case">Normal case</p>
```

### Line Height

```html
<p class="leading-none">No line height</p>
<p class="leading-tight">Tight</p>
<p class="leading-normal">Normal</p>
<p class="leading-relaxed">Relaxed</p>
<p class="leading-loose">Loose</p>
```

## Colors

### Background Color

```html
<div class="bg-white">White background</div>
<div class="bg-gray-100">Light gray</div>
<div class="bg-blue-500">Blue</div>
<div class="bg-red-500">Red</div>
<div class="bg-green-500">Green</div>

<!-- Opacity -->
<div class="bg-blue-500/50">50% opacity</div>
<div class="bg-blue-500/75">75% opacity</div>
```

### Border Color

```html
<div class="border border-gray-300">Gray border</div>
<div class="border-2 border-blue-500">Blue border</div>
<div class="border-4 border-red-500">Thick red border</div>
```

### Gradient

```html
<div class="bg-gradient-to-r from-blue-500 to-purple-500">
  Gradient background
</div>

<div class="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
  Multi-color gradient
</div>
```

## Borders

### Border Width

```html
<div class="border">1px border</div>
<div class="border-2">2px border</div>
<div class="border-4">4px border</div>
<div class="border-8">8px border</div>

<!-- Individual sides -->
<div class="border-t-4">Top border</div>
<div class="border-r-4">Right border</div>
<div class="border-b-4">Bottom border</div>
<div class="border-l-4">Left border</div>
```

### Border Radius

```html
<div class="rounded">Small radius</div>
<div class="rounded-md">Medium radius</div>
<div class="rounded-lg">Large radius</div>
<div class="rounded-xl">Extra large</div>
<div class="rounded-full">Full circle</div>

<!-- Individual corners -->
<div class="rounded-t-lg">Top corners</div>
<div class="rounded-r-lg">Right corners</div>
<div class="rounded-b-lg">Bottom corners</div>
<div class="rounded-l-lg">Left corners</div>
```

### Border Style

```html
<div class="border-solid">Solid border</div>
<div class="border-dashed">Dashed border</div>
<div class="border-dotted">Dotted border</div>
<div class="border-double">Double border</div>
```

## Shadows

```html
<!-- Box Shadow -->
<div class="shadow-sm">Small shadow</div>
<div class="shadow">Default shadow</div>
<div class="shadow-md">Medium shadow</div>
<div class="shadow-lg">Large shadow</div>
<div class="shadow-xl">Extra large shadow</div>
<div class="shadow-2xl">2XL shadow</div>

<!-- No shadow -->
<div class="shadow-none">No shadow</div>

<!-- Colored shadow -->
<div class="shadow-lg shadow-blue-500/50">Blue shadow</div>
```

## Effects

### Opacity

```html
<div class="opacity-0">Invisible</div>
<div class="opacity-25">25% opacity</div>
<div class="opacity-50">50% opacity</div>
<div class="opacity-75">75% opacity</div>
<div class="opacity-100">Fully visible</div>
```

### Hover, Focus, Active

```html
<!-- Hover -->
<button class="bg-blue-500 hover:bg-blue-700">
  Hover me
</button>

<!-- Focus -->
<input class="border focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />

<!-- Active -->
<button class="bg-blue-500 active:bg-blue-800">
  Click me
</button>

<!-- Combined -->
<button class="bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
  Interactive button
</button>
```

### Transitions

```html
<button class="transition duration-300 ease-in-out bg-blue-500 hover:bg-blue-700">
  Smooth transition
</button>

<div class="transition-all duration-500 hover:scale-110">
  Scale on hover
</div>

<div class="transition-colors duration-200 hover:text-blue-500">
  Color transition
</div>
```

### Transform

```html
<!-- Scale -->
<div class="scale-50">50% scale</div>
<div class="scale-100">Normal scale</div>
<div class="scale-150">150% scale</div>
<div class="hover:scale-110">Scale on hover</div>

<!-- Rotate -->
<div class="rotate-45">Rotate 45deg</div>
<div class="rotate-90">Rotate 90deg</div>
<div class="-rotate-45">Rotate -45deg</div>

<!-- Translate -->
<div class="translate-x-4">Move right</div>
<div class="translate-y-4">Move down</div>
<div class="-translate-x-4">Move left</div>
```

## Responsive Design

### Breakpoints

```html
<!-- Mobile first approach -->
<div class="text-sm md:text-base lg:text-lg xl:text-xl">
  Responsive text size
</div>

<!-- sm: 640px -->
<!-- md: 768px -->
<!-- lg: 1024px -->
<!-- xl: 1280px -->
<!-- 2xl: 1536px -->

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  Responsive grid
</div>
```

### Show/Hide on Breakpoints

```html
<!-- Hide on mobile, show on desktop -->
<div class="hidden md:block">
  Desktop only
</div>

<!-- Show on mobile, hide on desktop -->
<div class="block md:hidden">
  Mobile only
</div>
```

## Common Components

### Button

```html
<!-- Primary Button -->
<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition">
  Primary Button
</button>

<!-- Secondary Button -->
<button class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
  Secondary Button
</button>

<!-- Outline Button -->
<button class="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-white transition">
  Outline Button
</button>

<!-- Disabled Button -->
<button class="px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed" disabled>
  Disabled Button
</button>
```

### Card

```html
<div class="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
  <img class="w-full" src="image.jpg" alt="Card image">
  <div class="px-6 py-4">
    <h2 class="font-bold text-xl mb-2">Card Title</h2>
    <p class="text-gray-700 text-base">
      Card description goes here.
    </p>
  </div>
  <div class="px-6 py-4">
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
      #tag1
    </span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
      #tag2
    </span>
  </div>
</div>
```

### Form Input

```html
<div class="mb-4">
  <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
    Username
  </label>
  <input 
    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" 
    id="username" 
    type="text" 
    placeholder="Username"
  >
</div>

<!-- With error -->
<div class="mb-4">
  <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
    Email
  </label>
  <input 
    class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-red-500" 
    id="email" 
    type="email" 
    placeholder="Email"
  >
  <p class="text-red-500 text-xs italic mt-1">Please enter a valid email.</p>
</div>
```

### Navigation Bar

```html
<nav class="bg-gray-800 p-4">
  <div class="container mx-auto flex justify-between items-center">
    <div class="text-white font-bold text-xl">Logo</div>
    <div class="hidden md:flex space-x-4">
      <a href="#" class="text-gray-300 hover:text-white transition">Home</a>
      <a href="#" class="text-gray-300 hover:text-white transition">About</a>
      <a href="#" class="text-gray-300 hover:text-white transition">Services</a>
      <a href="#" class="text-gray-300 hover:text-white transition">Contact</a>
    </div>
    <button class="md:hidden text-white">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>
  </div>
</nav>
```

### Modal

```html
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div class="bg-white rounded-lg p-8 max-w-md w-full">
    <h2 class="text-2xl font-bold mb-4">Modal Title</h2>
    <p class="text-gray-700 mb-6">
      Modal content goes here.
    </p>
    <div class="flex justify-end space-x-4">
      <button class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
        Cancel
      </button>
      <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition">
        Confirm
      </button>
    </div>
  </div>
</div>
```

### Alert

```html
<!-- Success Alert -->
<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
  <strong class="font-bold">Success!</strong>
  <span class="block sm:inline">Your action was successful.</span>
</div>

<!-- Error Alert -->
<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
  <strong class="font-bold">Error!</strong>
  <span class="block sm:inline">Something went wrong.</span>
</div>

<!-- Warning Alert -->
<div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
  <strong class="font-bold">Warning!</strong>
  <span class="block sm:inline">Please be careful.</span>
</div>
```

## Dark Mode

### Enable Dark Mode

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media'
  // ...
}
```

### Usage

```html
<div class="bg-white dark:bg-gray-800 text-black dark:text-white">
  Content adapts to dark mode
</div>

<button class="bg-blue-500 dark:bg-blue-700 text-white">
  Dark mode button
</button>
```

### Toggle Dark Mode

```javascript
// Toggle dark mode
document.documentElement.classList.toggle('dark')

// Enable dark mode
document.documentElement.classList.add('dark')

// Disable dark mode
document.documentElement.classList.remove('dark')
```

## Custom Utilities

### Add Custom Classes

```css
/* src/index.css */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition;
  }
  
  .card {
    @apply rounded-lg shadow-lg bg-white p-6;
  }
}

@layer utilities {
  .text-shadow {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  }
}
```

## Plugins

### Official Plugins

```bash
# Forms
npm install @tailwindcss/forms

# Typography
npm install @tailwindcss/typography

# Aspect Ratio
npm install @tailwindcss/aspect-ratio

# Line Clamp
npm install @tailwindcss/line-clamp
```

```javascript
// tailwind.config.js
module.exports = {
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}
```

## Best Practices

- ✅ Use utility classes instead of custom CSS
- ✅ Extract components for repeated patterns
- ✅ Use responsive design utilities
- ✅ Leverage dark mode support
- ✅ Use @apply for component classes
- ✅ Configure custom colors and spacing in config
- ✅ Use PurgeCSS in production (automatic with Tailwind 3+)
- ✅ Follow mobile-first approach

## Common Pitfalls

- ⚠️ **Don't use arbitrary values excessively** - Use config for consistency
- ⚠️ **Don't forget to configure content paths** - Required for purging
- ⚠️ **Don't mix Tailwind with traditional CSS** - Stick to utilities
- ⚠️ **Don't forget responsive prefixes** - Use mobile-first approach
- ⚠️ **Don't overuse @apply** - Use utilities directly when possible

## Production Optimization

### Purge Unused CSS

Tailwind 3+ automatically purges unused CSS. Ensure your `content` paths are correct:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
```

### Minification

```bash
# Build for production
npm run build
```

## Related Topics

- [React Components](../react/components-and-jsx.md)
- [Next.js Setup](../next/setup.md)

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Playground](https://play.tailwindcss.com/)
- [Tailwind UI](https://tailwindui.com/)
- [Headless UI](https://headlessui.com/)
