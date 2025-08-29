---
title: Building Search into Duct - A Provider-Based Approach
date: 2025-08-29
author: navilan
image: /blog/2025/08/search/duct-search.png
ogPath: /blog/2025/08/search/duct-search.png
imageClass: dark-invert
tags: [Feature, Search, Architecture, Tutorial, Article]
---

Search is table stakes for modern websites. Users expect to find content instantly, whether you're running a documentation site, blog, or application. Duct v0.8.0 introduces a flexible search system that works everywhere from static hosting to edge workers.

<!--more-->

![Duct Search](/blog/2025/08/search/duct-search.png) {.dark-invert}

## The Problem with Search

Adding search to a static site traditionally meant choosing between:

- Expensive third-party services with monthly fees
- Complex self-hosted solutions requiring servers
- Limited client-side search that doesn't scale

We wanted search that's fast, affordable, and works with modern deployment patterns.

## Duct's Solution: Provider-Based Architecture

Instead of picking winners, Duct provides a search foundation with swappable providers. Build your site once, deploy anywhere.

```javascript
// duct.config.js
export default {
  search: {
    enabled: true,
    generateIndex: true,
    indexPath: 'search-index.json',
    excludePaths: ['/404'],
    includeContent: true
  }
}
```

Search configuration controls index generation at build time. Provider selection happens in your components.

## How It Works

### Build Time: Index Generation

During static site generation, Duct crawls your content and builds a search index:

```typescript
// Automatic during build
const searchIndex = {
  entries: [
    {
      url: '/blog/post-1',
      title: 'Building Search into Duct',
      description: 'Search is table stakes...',
      content: 'Full text content for searching',
      tags: ['search', 'architecture'],
      date: '2025-08-29'
    }
    // ... all your content
  ]
}
```

The index includes:

- Page content from markdown files
- Metadata from front-matter
- Component text content

### Runtime: Provider Handles Search

Each provider implements the same interface:

```typescript
interface SearchProvider<TIndexConfig = unknown> {
  name: string
  initialize(config: SearchProviderConfig): Promise<SearchInitializeResult>
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>

  // Optional index management methods
  index?(entries: SearchIndexEntry[], config?: TIndexConfig): Promise<void>
  updateIndex?(entries: SearchIndexEntry[], config?: TIndexConfig): Promise<void>
}
```

Your application code stays consistent regardless of provider.

## Available Providers

### Client Search Provider

Perfect for smaller sites and development:

```typescript
// Component initialization
import { ClientSearchProvider } from '@duct-ui/client-search-provider'

const clientSearchProvider = new ClientSearchProvider()
await clientSearchProvider.initialize({
  indexUrl: '/search-index.json',
  threshold: 0.3
})
```

- Runs entirely in the browser
- Uses FlexSearch for fast, typo-tolerant search
- No infrastructure needed
- Scales to ~1000 pages comfortably

### Cloudflare Search Provider

Deploy search to the edge:

```typescript
// Component initialization
import { CloudflareSearchProvider } from '@duct-ui/cloudflare-search-provider'

const cloudflareSearchProvider = new CloudflareSearchProvider()
await cloudflareSearchProvider.initialize({
  workerUrl: '/api', // or your worker URL
  timeout: 5000
})
```

- Runs on Cloudflare Workers
- R2 storage for unlimited index size
- KV namespaces for metadata
- Global edge deployment

Setup is straightforward:

```bash
# Generate worker templates
npx duct-cf-search init -o ./worker -n my-search

# Follow the instructions in the generated readme to configure the provider
...

# Deploy to Cloudflare
wrangler deploy -c worker/wrangler.toml

# Sync search index
node worker/sync-search-index.js
```

## The Search Component

Duct includes a ready-to-use search modal:

```typescript
import { SearchModal } from '@duct-ui/components'
import { createRef } from '@duct-ui/core'

const searchModalRef = createRef<SearchModalLogic>()

// In your component
<SearchModal
  ref={searchModalRef}
  placeholder="Search documentation..."
  hotkey="k"
  hotkeyCombination={["cmd"]}
  on:search={performSearch}
  on:select={handleSelect}
/>
```

Features:

- Keyboard navigation (↑/↓ to navigate, Enter to select)
- Hotkey support (Cmd+K / Ctrl+K)
- Responsive design
- Themeable

## Building Your Own Provider

Creating a custom provider requires implementing the SearchProvider interface:

```typescript
import type {
  SearchProvider,
  SearchProviderConfig,
  SearchOptions,
  SearchResult,
  SearchInitializeResult
} from '@duct-ui/search-core'

export class MySearchProvider implements SearchProvider {
  public readonly name = '@my-org/my-search-provider'

  async initialize(config: SearchProviderConfig): Promise<SearchInitializeResult> {
    // Connect to your search service
    // Return the number of indexed documents
    return { indexSize: 1000 }
  }

  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    // Perform search and return results
    return [
      {
        url: '/example',
        title: 'Example Result',
        excerpt: 'Matching content...',
        score: 0.95
      }
    ]
  }
}
```

**Required methods:**

- `name`: Unique identifier for your provider
- `initialize()`: Setup connection and return index size
- `search()`: Execute search and return formatted results

**Optional methods:**

- `index()`: Add entries to search index
- `updateIndex()`: Update existing index entries

**Reference implementations:**

- [ClientSearchProvider source](https://github.com/navilan/duct-ui/blob/main/packages/client-search-provider/src/client-search-provider.ts)
- [CloudflareSearchProvider source](https://github.com/navilan/duct-ui/blob/main/packages/cloudflare-search-provider/src/cloudflare-search-provider.ts)

## Deployment Patterns

### Static Hosting (Netlify, Vercel, GitHub Pages)

Use the client provider:

1. Build generates `search-index.json`
2. Deploy with your static files
3. Browser downloads and searches locally

### Edge Workers (Cloudflare, Deno Deploy)

Use the Cloudflare provider:

1. Build generates search index
2. Deploy worker to handle search
3. Sync index post-deployment
4. Search runs at the edge

### Traditional Servers

Build a provider for your backend:

1. Index to your database during build
2. API endpoint handles search
3. Provider proxies to your API

## Get Started with Search

Ready to add search to your Duct site? Check out our comprehensive [search demo](/demos/search) for step-by-step setup guides and configuration options.

Built a custom search provider or have an interesting search implementation? Share it in [GitHub Discussions](https://github.com/navilan/duct-ui/discussions/categories/show-and-tell) to help other developers in the community.

## Conclusion

Search in Duct follows the framework's philosophy: explicit, flexible, and predictable. Choose the provider that fits your deployment model, and upgrade as you grow. No vendor lock-in, no surprise bills, just search that works.
