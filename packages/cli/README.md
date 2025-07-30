# Duct UI CLI

The command-line interface and build tools for Duct UI static site generation.

> **⚠️ Under Construction**: This library is currently in early development and may exhibit unexpected behavior. APIs are subject to change and components may not be fully stable. Use with caution in production environments.

## Installation

```bash
npm install @duct-ui/cli --save-dev
```

## Quick Start

1. **Add the Vite plugin to your project:**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { ductSSGPlugin } from '@duct-ui/cli/vite-plugin'

export default defineConfig({
  plugins: [
    ductSSGPlugin()
  ]
})
```

2. **Create your page structure:**

```
src/
├── pages/
│   ├── index.tsx        # Home page
│   ├── about/
│   │   └── index.tsx    # About page
│   └── blog/
│       ├── index.tsx    # Blog index
│       └── sub.tsx      # Dynamic blog posts
└── layouts/
    └── shell.html       # HTML template
```

3. **Build your static site:**

```bash
# Development with hot reloading
npm run dev

# Production build
node node_modules/@duct-ui/cli/dist/cli.js build
```

## Commands

### `build`

Generates static HTML files from your Duct UI pages:

```bash
duct build [options]
```

Options:
- `--html-only` - Generate only HTML files without final Vite build
- `--config <path>` - Path to config file (default: `duct.config.js`)

## Configuration

Create a `duct.config.js` file to customize paths and settings:

```javascript
// duct.config.js
export default {
  pagesDir: 'src/pages',      // Default: 'src/pages'
  layoutsDir: 'src/layouts',  // Default: 'src/layouts'
  env: {
    API_URL: process.env.API_URL,
    SITE_NAME: 'My Website'
  }
}
```

## Page Components

Each page component must export specific functions:

```typescript
// src/pages/about/index.tsx
export function getLayout(): string {
  return 'shell.html'  // Layout template to use
}

export function getPageContext(): Record<string, any> {
  return {
    title: 'About Us',
    description: 'Learn more about our company',
    openGraph: {
      title: 'About Us - My Site',
      description: 'Learn more about our company',
      image: '/images/about-og.jpg'
    }
  }
}

// Default export: Your Duct component
export default function AboutPage() {
  return (
    <div class="container mx-auto px-4 py-8">
      <h1>About Us</h1>
      <p>Welcome to our about page!</p>
    </div>
  )
}
```

## Dynamic Routes

For dynamic routes, create a `sub.tsx` file with additional exports:

```typescript
// src/pages/blog/sub.tsx
export function getLayout(): string {
  return 'shell.html'
}

export function getPageContext(): Record<string, any> {
  return {
    title: 'Blog Post',
    description: 'Read our latest blog post'
  }
}

// Generate static paths at build time
export async function getRoutes(): Promise<Record<string, any>> {
  const posts = await fetchBlogPosts()
  
  const routes: Record<string, any> = {}
  for (const post of posts) {
    routes[`/blog/${post.slug}`] = {
      title: `${post.title} - My Blog`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        image: post.coverImage
      }
    }
  }
  
  return routes
}

export default function BlogPost({ path }: { path: string }) {
  const slug = path.split('/').pop()
  return <div>Blog post: {slug}</div>
}
```

## Layout Templates

Layout templates use Nunjucks templating with access to page context:

```html
<!-- src/layouts/shell.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <title>{{ page.title }}</title>
  <meta name="description" content="{{ page.description }}">
  
  <!-- Open Graph tags -->
  {% if page.openGraph %}
  <meta property="og:title" content="{{ page.openGraph.title }}">
  <meta property="og:description" content="{{ page.openGraph.description }}">
  <meta property="og:image" content="{{ page.openGraph.image }}">
  {% endif %}
  
  <!-- Stylesheets -->
  {% if page.styles %}
    {% for style in page.styles %}
    <link rel="stylesheet" href="{{ style }}">
    {% endfor %}
  {% endif %}
</head>
<body>
  <div id="app"></div>
  
  <!-- Scripts -->
  {% if page.scripts %}
    {% for script in page.scripts %}
    <script type="module" src="{{ script }}"></script>
    {% endfor %}
  {% endif %}
</body>
</html>
```

## Vite Plugin

The included Vite plugin provides development server integration:

```typescript
import { ductSSGPlugin } from '@duct-ui/cli/vite-plugin'

export default defineConfig({
  plugins: [
    ductSSGPlugin()
  ]
})
```

Features:
- Automatic static page generation on dev server start
- Hot reloading for page changes
- Client-side routing for fast navigation
- Proper handling of dynamic routes

## Environment Variables

Access environment variables in your page components:

```typescript
export default function HomePage({ env }: { env: Record<string, any> }) {
  return (
    <div>
      <h1>Welcome to {env.SITE_NAME}</h1>
      <p>API URL: {env.API_URL}</p>
    </div>
  )
}
```

## Resources

- [Main Repository](https://github.com/navilan/duct-ui)
- [Core Framework](https://www.npmjs.com/package/@duct-ui/core)
- [Component Library](https://www.npmjs.com/package/@duct-ui/components)
- [Live Demos](https://duct-ui.org)
- [SSG Documentation](https://duct-ui.org/docs/static-site-generation)