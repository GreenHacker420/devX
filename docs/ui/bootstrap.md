# Bootstrap 5 Documentation

## Table of Contents
1. [Getting Started](#getting-started)
2. [Layout](#layout)
3. [Components](#components)
4. [Utilities](#utilities)
5. [Forms](#forms)
6. [Icons](#icons)
7. [Theming](#theming)
8. [Customization](#customization)
9. [Best Practices](#best-practices)

## Getting Started

### Installation

#### CDN (Quick Start)
```html
<!-- CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- JavaScript Bundle with Popper -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

#### NPM
```bash
npm install bootstrap@5.3.0
```

#### Basic HTML Template
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bootstrap 5</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
    <h1>Hello, Bootstrap 5!</h1>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
  </body>
</html>
```

## Layout

### Container
```html
<div class="container">
  <!-- Fixed width container -->
</div>

<div class="container-fluid">
  <!-- Full width container -->
</div>

<!-- Responsive containers -->
<div class="container-sm">100% wide until small breakpoint</div>
<div class="container-md">100% wide until medium breakpoint</div>
<div class="container-lg">100% wide until large breakpoint</div>
<div class="container-xl">100% wide until extra large breakpoint</div>
<div class="container-xxl">100% wide until extra extra large breakpoint</div>
```

### Grid System
```html
<div class="container">
  <div class="row">
    <div class="col">Column 1</div>
    <div class="col">Column 2</div>
    <div class="col">Column 3</div>
  </div>
  
  <div class="row">
    <div class="col-8">Main content (8/12)</div>
    <div class="col-4">Sidebar (4/12)</div>
  </div>
  
  <!-- Responsive grid -->
  <div class="row">
    <div class="col-12 col-md-6 col-lg-4">
      <!-- Full width on mobile, half on medium, one third on large -->
    </div>
  </div>
</div>
```

### Breakpoints
| Breakpoint  | Class Infix | Dimensions |
|-------------|------------|------------|
| X-Small     | None       | <576px     |
| Small       | `sm`       | ≥576px     |
| Medium      | `md`       | ≥768px     |
| Large       | `lg`       | ≥992px     |
| Extra large | `xl`       | ≥1200px    |
| Extra extra large | `xxl` | ≥1400px    |

## Components

### Buttons
```html
<button type="button" class="btn btn-primary">Primary</button>
<button type="button" class="btn btn-secondary">Secondary</button>
<button type="button" class="btn btn-success">Success</button>
<button type="button" class="btn btn-outline-primary">Outline</button>
<button type="button" class="btn btn-primary btn-lg">Large button</button>
<button type="button" class="btn btn-secondary btn-sm">Small button</button>

<!-- Button group -->
<div class="btn-group" role="group">
  <button type="button" class="btn btn-primary">Left</button>
  <button type="button" class="btn btn-primary">Middle</button>
  <button type="button" class="btn btn-primary">Right</button>
</div>
```

### Cards
```html
<div class="card" style="width: 18rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>

<!-- Card with header and footer -->
<div class="card">
  <div class="card-header">
    Featured
  </div>
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
  <div class="card-footer text-muted">
    2 days ago
  </div>
</div>
```

### Navbar
```html
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
            Dropdown
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
      </ul>
      <form class="d-flex">
        <input class="form-control me-2" type="search" placeholder="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
```

### Modal
```html
<!-- Button trigger modal -->
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button>

<!-- Modal -->
<div class="modal fade" id="exampleModal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Modal title</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>Modal body text goes here.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
```

## Utilities

### Spacing
```html
<!-- Margin and Padding -->
<div class="m-1">Margin all around (0.25rem)</div>
<div class="mt-3">Margin top (1rem)</div>
<div class="p-4">Padding all around (1.5rem)</div>
<div class="px-5">Padding left and right (3rem)</div>

<!-- Responsive spacing -->
<div class="m-sm-2 m-md-3 m-lg-4">Responsive margin</div>
```

### Text
```html
<p class="text-start">Start aligned text</p>
<p class="text-center">Center aligned text</p>
<p class="text-end">End aligned text</p>

<p class="text-primary">Primary text</p>
<p class="text-success">Success text</p>
<p class="text-danger">Danger text</p>

<p class="fw-bold">Bold text</p>
<p class="fst-italic">Italic text</p>
<p class="text-uppercase">Uppercase text</p>
<p class="text-truncate">Truncated text with an ellipsis...</p>
```

### Colors
```html
<!-- Text colors -->
<p class="text-primary">.text-primary</p>
<p class="text-secondary">.text-secondary</p>
<p class="text-success">.text-success</p>
<p class="text-danger">.text-danger</p>
<p class="text-warning">.text-warning</p>
<p class="text-info">.text-info</p>
<p class="text-light bg-dark">.text-light</p>
<p class="text-dark">.text-dark</p>
<p class="text-muted">.text-muted</p>

<!-- Background colors -->
<div class="p-3 mb-2 bg-primary text-white">.bg-primary</div>
<div class="p-3 mb-2 bg-success text-white">.bg-success</div>
```

## Forms

### Basic Form
```html
<form>
  <div class="mb-3">
    <label for="exampleInputEmail1" class="form-label">Email address</label>
    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
    <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div class="mb-3">
    <label for="exampleInputPassword1" class="form-label">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1">
  </div>
  <div class="mb-3 form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1">
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
  </div>
  <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

### Form Controls
```html
<!-- Select -->
<select class="form-select" aria-label="Default select example">
  <option selected>Open this select menu</option>
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>

<!-- Checkboxes -->
<div class="form-check">
  <input class="form-check-input" type="checkbox" id="flexCheckDefault">
  <label class="form-check-label" for="flexCheckDefault">
    Default checkbox
  </label>
</div>

<!-- Radios -->
<div class="form-check">
  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1">
  <label class="form-check-label" for="flexRadioDefault1">
    Default radio
  </label>
</div>

<!-- Range -->
<label for="customRange1" class="form-label">Example range</label>
<input type="range" class="form-range" id="customRange1">
```

### Form Validation
```html
<form class="row g-3 needs-validation" novalidate>
  <div class="col-md-4">
    <label for="validationCustom01" class="form-label">First name</label>
    <input type="text" class="form-control" id="validationCustom01" value="Mark" required>
    <div class="valid-feedback">
      Looks good!
    </div>
  </div>
  <div class="col-md-4">
    <label for="validationCustom02" class="form-label">Last name</label>
    <input type="text" class="form-control" id="validationCustom02" value="Otto" required>
    <div class="valid-feedback">
      Looks good!
    </div>
  </div>
  <div class="col-12">
    <button class="btn btn-primary" type="submit">Submit form</button>
  </div>
</form>
```

## Icons

### Bootstrap Icons
```html
<!-- Add to head -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">

<!-- Usage -->
<i class="bi bi-alarm"></i>
<button type="button" class="btn btn-primary">
  <i class="bi bi-search"></i> Search
</button>
```

## Theming

### Color Modes
```html
<!-- Light/dark mode toggle -->
<button class="btn btn-primary" data-bs-theme-value="light">
  <i class="bi bi-sun-fill"></i> Light
</button>
<button class="btn btn-primary" data-bs-theme-value="dark">
  <i class="bi bi-moon-stars-fill"></i> Dark
</button>

<!-- Set default theme -->
<html data-bs-theme="dark">
```

### Custom Colors
```scss
// Custom.scss
// Override default variables before the import
$body-bg: #000;
$body-color: #fff;
$primary: #0d6efd;
$secondary: #6c757d;
$success: #198754;

// Import Bootstrap and its default variables
@import '~bootstrap/scss/bootstrap';
```

## Customization

### SASS Variables
```scss
// Customize colors
$primary: #0074d9;
$secondary: #6c757d;
$success: #28a745;
$info: #17a2b8;
$warning: #ffc107;
$danger: #dc3545;
$light: #f8f9fa;
$dark: #343a40;

// Customize spacing
$spacer: 1rem;
$spacers: (
  0: 0,
  1: $spacer * .25,
  2: $spacer * .5,
  3: $spacer,
  4: $spacer * 1.5,
  5: $spacer * 3,
  6: $spacer * 4,
  7: $spacer * 5,
  8: $spacer * 6,
);

// Customize container sizes
$container-max-widths: (
  sm: 540px,
  md: 720px,
  lg: 960px,
  xl: 1140px,
  xxl: 1320px
);
```

## Best Practices

### Responsive Images
```html
<img src="..." class="img-fluid" alt="Responsive image">
<img src="..." class="img-thumbnail" alt="Thumbnail">
<img src="..." class="rounded float-start" alt="...">
```

### Display Property
```html
<div class="d-inline p-2 bg-primary text-white">d-inline</div>
<div class="d-inline p-2 bg-dark text-white">d-inline</div>

<span class="d-block p-2 bg-primary text-white">d-block</span>
<span class="d-block p-2 bg-dark text-white">d-block</span>

<!-- Responsive display -->
<div class="d-inline d-lg-none">Hide on screens wider than lg</div>
<div class="d-none d-lg-block">Hide on screens smaller than lg</div>
```

### Flexbox
```html
<div class="d-flex p-2">I'm a flexbox container!</div>

<div class="d-flex justify-content-start">...</div>
<div class="d-flex justify-content-end">...</div>
<div class="d-flex justify-content-center">...</div>
<div class="d-flex justify-content-between">...</div>
<div class="d-flex justify-content-around">...</div>

<div class="d-flex align-items-start">...</div>
<div class="d-flex align-items-end">...</div>
<div class="d-flex align-items-center">...</div>
```

### Visibility
```html
<div class="visible">...</div>
<div class="invisible">...</div>

<!-- Responsive visibility -->
<div class="visible">Visible on all viewport sizes</div>
<div class="d-none d-md-block">Visible on medium and larger viewports</div>
<div class="d-md-none">Hidden on medium and larger viewports</div>
```

## JavaScript Components

### Tooltips
```html
<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="top" title="Tooltip on top">
  Tooltip on top
</button>

<!-- Initialize tooltips -->
<script>
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })
</script>
```

### Popovers
```html
<button type="button" class="btn btn-lg btn-danger" data-bs-toggle="popover" data-bs-title="Popover title" data-bs-content="And here's some amazing content. It's very engaging. Right?">
  Click to toggle popover
</button>

<!-- Initialize popovers -->
<script>
  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
  })
</script>
```

### Carousel
```html
<div id="carouselExample" class="carousel slide">
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img src="..." class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
      <img src="..." class="d-block w-100" alt="...">
    </div>
    <div class="carousel-item">
      <img src="..." class="d-block w-100" alt="...">
    </div>
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>
```

## Resources

- [Official Documentation](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Bootstrap Examples](https://getbootstrap.com/docs/5.3/examples/)
- [GitHub Repository](https://github.com/twbs/bootstrap)
- [Bootstrap Blog](https://blog.getbootstrap.com/)
