# Angular Setup Guide

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- Angular CLI (latest stable version)

## Installation

1. Install Angular CLI globally:
```bash
npm install -g @angular/cli
```

2. Verify installation:
```bash
ng version
```

## Creating a New Project
```bash
ng new my-angular-app
cd my-angular-app
```

## Project Structure
```
my-angular-app/
├── src/
│   ├── app/           # Your application code
│   ├── assets/        # Static assets
│   ├── environments/  # Environment configurations
│   └── index.html     # Main HTML file
├── angular.json       # Angular CLI configuration
└── package.json       # Project dependencies
```

## Development Server
```bash
# Start development server
ng serve

# Open in browser
ng serve --open
```

## Building for Production
```bash
ng build --prod
```

## Common Commands
- `ng generate component component-name` - Generate a new component
- `ng generate service service-name` - Generate a new service
- `ng test` - Run unit tests
- `ng e2e` - Run end-to-end tests
