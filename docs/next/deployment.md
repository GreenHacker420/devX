# Next.js Deployment

Guide to deploying Next.js applications to various platforms.

## Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps, created by the Next.js team.

### Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Deploy with Git Integration

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Configure settings (auto-detected for Next.js)
6. Click "Deploy"

### Environment Variables

Add in Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add variables for Production, Preview, and Development

```env
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Docker

### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/mydb
      - NEXTAUTH_SECRET=your-secret
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### next.config.js for Docker

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
```

### Build and Run

```bash
# Build image
docker build -t my-nextjs-app .

# Run container
docker run -p 3000:3000 my-nextjs-app

# Or with docker-compose
docker-compose up
```

## Self-Hosting (Node.js)

### Build for Production

```bash
npm run build
npm start
```

### Using PM2

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start npm --name "nextjs-app" -- start

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

### ecosystem.config.js

```javascript
module.exports = {
  apps: [{
    name: 'nextjs-app',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 'max',
    exec_mode: 'cluster',
  }],
}
```

```bash
pm2 start ecosystem.config.js
```

## Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/nextjs-app
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/nextjs-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Static Export

For static sites without server-side features:

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

### Build

```bash
npm run build
```

Output will be in the `out` directory. Deploy to any static hosting:

```bash
# Deploy to Netlify
npx netlify-cli deploy --prod --dir=out

# Deploy to GitHub Pages
# Push the out directory to gh-pages branch
```

## AWS (Amplify)

### Deploy with Git

1. Go to AWS Amplify Console
2. Connect your repository
3. Configure build settings (auto-detected)
4. Deploy

### amplify.yml

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

## Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Render

1. Create a new Web Service
2. Connect your repository
3. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Add environment variables
5. Deploy

## Netlify

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

Deploy:
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

## Environment Variables

### Production Checklist

```env
# Required
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=generate-a-secure-random-string

# Database
DATABASE_URL=postgresql://...

# API Keys (keep secret)
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=...

# Public variables (exposed to client)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

## Performance Optimization

### Image Optimization

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['example.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}
```

### Compression

```javascript
// next.config.js
module.exports = {
  compress: true,
}
```

### Bundle Analyzer

```bash
npm install @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // your config
})
```

```bash
ANALYZE=true npm run build
```

## CDN Configuration

### Cloudflare

1. Add your domain to Cloudflare
2. Update nameservers
3. Enable caching rules:
   - Cache static assets (`/_next/static/*`)
   - Cache images (`/_next/image/*`)

### Cache Headers

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}
```

## Database Migrations

### Before Deployment

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

### In CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Health Checks

```tsx
// app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Database connection failed',
      },
      { status: 503 }
    )
  }
}
```

## Monitoring

### Sentry Integration

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
})
```

### Logging

```tsx
// lib/logger.ts
export function log(message: string, data?: any) {
  if (process.env.NODE_ENV === 'production') {
    // Send to logging service
    console.log(JSON.stringify({ message, data, timestamp: new Date() }))
  } else {
    console.log(message, data)
  }
}
```

## Pre-Deployment Checklist

- [ ] Run `npm run build` locally
- [ ] Test production build with `npm start`
- [ ] Set all environment variables
- [ ] Run database migrations
- [ ] Configure domain and SSL
- [ ] Set up monitoring and logging
- [ ] Configure CDN and caching
- [ ] Test all critical user flows
- [ ] Set up error tracking (Sentry)
- [ ] Configure backup strategy

## Post-Deployment

### Verify Deployment

```bash
# Check if site is live
curl https://yourdomain.com

# Check API health
curl https://yourdomain.com/api/health

# Check headers
curl -I https://yourdomain.com
```

### Rollback

```bash
# Vercel
vercel rollback

# PM2
pm2 reload ecosystem.config.js

# Docker
docker-compose down
docker-compose up -d
```

## Best Practices

- ✅ Use environment variables for secrets
- ✅ Enable compression
- ✅ Configure CDN for static assets
- ✅ Set up monitoring and alerts
- ✅ Implement health checks
- ✅ Use CI/CD for automated deployments
- ✅ Test production builds locally
- ✅ Configure proper caching headers

## Common Issues

### Build Failures

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Memory Issues

```javascript
// next.config.js
module.exports = {
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
}
```

### Port Already in Use

```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

## Related Topics

- [Performance Optimization](./optimization.md)
- [Environment Variables](./setup.md)
- [Caching](./caching.md)

## References

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
