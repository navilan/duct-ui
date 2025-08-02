# Static Site Generation

Duct supports static site generation (SSG) with file-based routing, allowing you to build fast,
SEO-friendly websites that can be deployed to CDNs like Cloudflare Pages.{.lead}

## Getting Started

### 1. Install the CLI Package

First, add the Duct CLI to your project:

```bash
npm install @duct-ui/cli --save-dev
```

### 2. Update Vite Configuration

Add the Duct SSG plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import { ductSSGPlugin } from '@duct-ui/cli/vite-plugin'

export default defineConfig({
  plugins: [
    ductSSGPlugin()
  ],
  // ... other config
})
```

### 3. Create Directory Structure

Create the required directories for pages and layouts:

```text
src/
├── pages/              # Page components
│   ├── index.tsx       # Home page (/)
│   ├── 404.tsx         # 404 error page (/404)
│   ├── contact.tsx     # Contact page (/contact)
│   ├── about/
│   │   └── index.tsx   # About page (/about)
│   └── blog/
│       ├── index.tsx   # Blog index (/blog)
│       └── [sub].tsx   # Dynamic blog posts (/blog/*)
└── layouts/            # HTML templates
    └── shell.html      # Main layout template
```
