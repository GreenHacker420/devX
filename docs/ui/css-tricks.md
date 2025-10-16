# CSS Tricks and Tips

## Layout

### Flexbox Centering
Center elements both horizontally and vertically:
```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Optional: for full viewport height */
}
```

### CSS Grid Layout
Create a responsive grid with auto-fill:
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}
```

### Sticky Footer
Keep footer at the bottom of the page:
```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
```

## Effects

### Smooth Scrolling
```css
html {
  scroll-behavior: smooth;
}
```

### Custom Scrollbar
```css
/* WebKit (Chrome, Safari, newer Edge) */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}

/* Firefox */
html {
  scrollbar-width: thin;
  scrollbar-color: #888 #f1f1f1;
}
```

### Hover Effects
```css
.button {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

## Typography

### Text Overflow Ellipsis
```css
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Multi-line ellipsis (3 lines) */
.multi-line-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### System Font Stack
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
               "Helvetica Neue", Arial, sans-serif;
}
```

## Responsive Design

### Mobile-First Media Queries
```css
/* Base styles (mobile) */
.container {
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Responsive Images
```css
.responsive-img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Art direction with picture element */
<picture>
  <source media="(min-width: 768px)" srcset="large.jpg">
  <source media="(min-width: 480px)" srcset="medium.jpg">
  <img src="small.jpg" alt="Description" class="responsive-img">
</picture>
```

## Animations

### Keyframe Animation
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}
```

### Hover Underline Animation
```css
.hover-underline {
  position: relative;
  text-decoration: none;
}

.hover-underline::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: currentColor;
  transition: width 0.3s ease;
}

.hover-underline:hover::after {
  width: 100%;
}
```

## Forms

### Custom Checkbox/Radio
```css
.custom-checkbox {
  position: relative;
  padding-left: 30px;
  cursor: pointer;
}

.custom-checkbox input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #eee;
  border: 2px solid #ddd;
  border-radius: 4px;
}

.custom-checkbox:hover input ~ .checkmark {
  background-color: #ccc;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #2196F3;
  border-color: #2196F3;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.custom-checkbox .checkmark:after {
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
```

## Variables and Theming

### CSS Custom Properties
```css
:root {
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --spacing-unit: 1rem;
  --border-radius: 4px;
  --transition: all 0.3s ease;
}

.button {
  background-color: var(--primary-color);
  padding: calc(var(--spacing-unit) * 2);
  border-radius: var(--border-radius);
  transition: var(--transition);
}

/* Dark mode theming */
@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #2980b9;
    --secondary-color: #27ae60;
  }
}
```

## Performance

### Will-Change Property
```css
.optimize {
  will-change: transform, opacity;
}
```

### Content Visibility
```css
.long-content {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px; /* Estimated height */
}
```

## Browser Compatibility

### Feature Queries
```css
@supports (display: grid) {
  .container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@supports not (display: grid) {
  .container {
    display: flex;
    flex-wrap: wrap;
  }
  
  .container > * {
    flex: 1 1 250px;
    margin: 0.5rem;
  }
}
```

### Vendor Prefixes
```css
.gradient-bg {
  background: #1e5799; /* Fallback */
  background: -moz-linear-gradient(top, #1e5799 0%, #2989d8 100%);
  background: -webkit-linear-gradient(top, #1e5799 0%,#2989d8 100%);
  background: linear-gradient(to bottom, #1e5799 0%,#2989d8 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(
    startColorstr='#1e5799',
    endColorstr='#2989d8',
    GradientType=0
  );
}
```

## Debugging

### Debugging Layout
```css
/* Add to any element to debug */
.debug {
  outline: 1px solid red;
  background: rgba(255, 0, 0, 0.1);
}

/* Debug all elements */
* { outline: 1px solid rgba(255, 0, 0, 0.2); }
* * { outline: 1px solid rgba(0, 255, 0, 0.2); }
* * * { outline: 1px solid rgba(0, 0, 255, 0.2); }
* * * * { outline: 1px solid rgba(255, 0, 255, 0.2); }
* * * * * { outline: 1px solid rgba(0, 255, 255, 0.2); }
```

### Print Styles
```css
@media print {
  /* Hide elements when printing */
  .no-print {
    display: none !important;
  }
  
  /* Page breaks */
  .page-break {
    page-break-before: always;
  }
  
  /* Prevent text from breaking across pages */
  p, h1, h2, h3, h4, h5, h6 {
    page-break-inside: avoid;
  }
  
  /* Set page margins */
  @page {
    margin: 2cm;
  }
}
```

## Modern CSS

### Aspect Ratio
```css
.aspect-ratio-box {
  aspect-ratio: 16 / 9;
  background: #f0f0f0;
}
```

### CSS Grid Subgrid
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.grid-item {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3; /* Number of rows this item spans */
}
```

### Container Queries
```css
.component {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .component .content {
    display: flex;
    gap: 1rem;
  }
}
```

## Accessibility

### Screen Reader Only
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* For interactive elements that need to be visible on focus */
.sr-only.focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 0.5em;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Bonus: CSS Reset
```css
/* Box sizing rules */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Remove default margin and padding */
html,
body,
h1, h2, h3, h4, h5, h6,
p, blockquote, pre,
dl, dd, ol, ul,
figure,
fieldset, legend,
textarea,
pre, iframe,
hr {
  margin: 0;
  padding: 0;
}

/* Set core body defaults */
body {
  min-height: 100vh;
  scroll-behavior: smooth;
  text-rendering: optimizeSpeed;
  line-height: 1.5;
}

/* Remove list styles on ul, ol elements */
ul[class],
ol[class] {
  list-style: none;
}

/* Make images easier to work with */
img,
picture,
video,
canvas,
svg {
  max-width: 100%;
  display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
  font: inherit;
}

/* Remove all animations and transitions for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## CSS Variables for Theming
```css
:root {
  /* Colors */
  --color-primary: #2563eb;
  --color-secondary: #7c3aed;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  
  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;
  
  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #3b82f6;
    --color-secondary: #8b5cf6;
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-danger: #ef4444;
    
    --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
    --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  }
}
```

This CSS tricks guide covers a wide range of techniques from basic to advanced, including layout, animations, responsive design, accessibility, and modern CSS features. Each example is ready to use and includes comments for better understanding.
