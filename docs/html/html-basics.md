# HTML Tech Stack

Concise HTML tech stack and examples for building accessible, performant web pages (aligned with CONTRIBUTING.md style).

## What is this tech stack?
Tools, validators, linters and workflows to author semantic, accessible HTML and integrate with modern front-end build systems.

## Core Components
- Language
  - HTML5 (semantic elements)
- Tooling & bundlers
  - Vite, webpack, Parcel (optional for apps)
- Template engines / frameworks
  - Static HTML, Pug, Handlebars; integrates with React/Vue/Svelte
- Linting & validation
  - HTMLHint, W3C validator, Nu HTML Checker
- Accessibility & testing
  - axe, Lighthouse, Playwright, Cypress
- Formatting
  - Prettier
- CI/CD
  - GitHub Actions, Netlify, Vercel
- Editors
  - VS Code (Emmet, Live Server), WebStorm

## Basic Example

index.html
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Hello HTML</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header><h1>Welcome</h1></header>
  <main>
    <p>Hello, HTML tech stack!</p>
  </main>
  <footer>© Example</footer>
</body>
</html>
```
Expected: Page with "Welcome" heading and paragraph.

## Starter workflow
- Validate with W3C / HTMLHint
- Format with Prettier
- Test accessibility with axe / Lighthouse
- Bundle static assets with Vite or deploy static site

## CI snippet (GitHub Actions - static checks)
```yaml
name: HTML checks
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Node
        uses: actions/setup-node@v4
        with: node-version: '18'
      - run: npm ci
      - run: npx htmlhint "**/*.html"
      - run: npx prettier --check "**/*.{html,css,js,md}"
```

## File organization
```
site/
├─ index.html
├─ about.html
├─ assets/
│  ├─ styles.css
│  └─ images/
└─ README.md
```

## Common Pitfalls
- Missing alt text or improper heading order
- Forgetting viewport meta for mobile
- Inline styles that hamper maintainability
- Broken links or incorrect MIME types

## Best Practices
- Use semantic elements (main, nav, header, footer, article)
- Add meaningful alt text and ARIA where needed
- Keep HTML small and defer nonessential scripts
- Run accessibility checks in CI

## Related Topics
- Accessibility (WCAG) — https://www.w3.org/WAI/standards-guidelines/wcag/
- Lighthouse — https://developers.google.com/web/tools/lighthouse
