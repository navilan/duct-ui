# @duct-ui/client-search-provider

Client-side search provider for Duct UI applications using FlexSearch for fast, in-browser full-text search.

## Features

- **Client-side Search**: Fast, in-browser search with no server dependencies
- **FlexSearch Integration**: Powerful full-text search with relevance scoring
- **Small Bundle Size**: Lightweight implementation for optimal performance
- **Fuzzy Matching**: Configurable threshold for typo tolerance
- **Highlighting Support**: Built-in search result highlighting
- **TypeScript Support**: Full type safety

## Installation

```bash
npm install @duct-ui/client-search-provider
# or
pnpm add @duct-ui/client-search-provider
```

## Usage

### Basic Setup

```typescript
import { ClientSearchProvider } from '@duct-ui/client-search-provider'

// Create and initialize the provider
const searchProvider = new ClientSearchProvider()

await searchProvider.initialize({
  indexUrl: '/search-index.json', // URL to your search index
  threshold: 0.3 // Optional: fuzzy matching threshold (0-1)
})

// Perform a search
const results = await searchProvider.search('your search query', {
  limit: 10,
  offset: 0
})

// Results format:
// [
//   {
//     url: '/page-url',
//     title: 'Page Title',
//     excerpt: 'Matching excerpt with <mark>highlighted</mark> terms...',
//     score: 0.95
//   }
// ]
```

### Search Index Format

Your `search-index.json` should be an array of entries:

```json
[
  {
    "url": "/page-1",
    "title": "Page Title",
    "description": "Page description",
    "content": "Full searchable content of the page",
    "tags": ["tag1", "tag2"],
    "keywords": ["keyword1", "keyword2"]
  },
  {
    "url": "/page-2",
    "title": "Another Page",
    "description": "Another description",
    "content": "More searchable content",
    "tags": ["tag3"],
    "keywords": ["keyword3"]
  }
]
```

### With Duct UI Components

```typescript
import { createBlueprint, createRef } from '@duct-ui/core'
import { SearchModal } from '@duct-ui/components'
import { ClientSearchProvider } from '@duct-ui/client-search-provider'

const searchModalRef = createRef()
let searchProvider = null

// Initialize on component mount
async function initializeSearch() {
  searchProvider = new ClientSearchProvider()
  await searchProvider.initialize({
    indexUrl: '/search-index.json'
  })
}

// Handle search
async function performSearch(el, query) {
  if (!searchProvider || !query.trim()) {
    searchModalRef.current?.setResults([])
    return
  }
  
  const results = await searchProvider.search(query)
  searchModalRef.current?.setResults(results)
}

// Component render
function render(props) {
  return (
    <SearchModal
      ref={searchModalRef}
      placeholder="Search..."
      on:search={performSearch}
    />
  )
}
```

### Advanced Options

```typescript
const searchProvider = new ClientSearchProvider()

// Initialize with custom configuration
await searchProvider.initialize({
  indexUrl: '/search-index.json',
  threshold: 0.3, // Fuzzy matching (0 = exact, 1 = very fuzzy)
  limit: 10, // Default result limit
  highlightTag: 'mark', // HTML tag for highlighting
  highlightClass: 'highlight' // CSS class for highlights
})

// Search with options
const results = await searchProvider.search('query', {
  limit: 20, // Override default limit
  offset: 10, // For pagination
  fuzzy: true, // Enable fuzzy matching
  highlight: true // Enable highlighting
})
```

## Search Index Generation

### During Build (Static Sites)

Generate the search index during your build process:

```javascript
// build-search-index.js
import fs from 'fs'
import path from 'path'

const pages = []

// Collect your pages (example for markdown files)
const contentDir = './content'
const files = fs.readdirSync(contentDir)

for (const file of files) {
  const content = fs.readFileSync(path.join(contentDir, file), 'utf-8')
  // Parse your content (markdown, HTML, etc.)
  
  pages.push({
    url: `/posts/${file.replace('.md', '')}`,
    title: extractTitle(content),
    description: extractDescription(content),
    content: extractText(content),
    tags: extractTags(content),
    keywords: extractKeywords(content)
  })
}

// Write the index
fs.writeFileSync(
  './dist/search-index.json',
  JSON.stringify(pages)
)
```

### With Duct SSG

Duct's static site generator can automatically generate the search index:

```javascript
// duct.config.js
export default {
  build: {
    searchIndex: {
      enabled: true,
      output: 'search-index.json',
      include: ['**/*.html'],
      exclude: ['404.html']
    }
  }
}
```

## Performance Considerations

### Index Size

- **< 100 entries**: Excellent performance, instant results
- **100-1000 entries**: Good performance, < 50ms search time
- **1000-5000 entries**: Acceptable performance, < 200ms search time
- **> 5000 entries**: Consider server-side search or index splitting

### Optimization Tips

1. **Preload Index**: Load the index on page load for instant first search
2. **Compress Content**: Minimize content field to essential text
3. **Use Keywords**: Leverage keywords field for important terms
4. **Lazy Loading**: Load the search provider only when needed

```typescript
// Lazy load search provider
let searchProvider = null

async function getSearchProvider() {
  if (!searchProvider) {
    const { ClientSearchProvider } = await import('@duct-ui/client-search-provider')
    searchProvider = new ClientSearchProvider()
    await searchProvider.initialize({
      indexUrl: '/search-index.json'
    })
  }
  return searchProvider
}

// Use when needed
async function handleSearch(query) {
  const provider = await getSearchProvider()
  return provider.search(query)
}
```

## Comparison with CloudflareSearchProvider

| Feature | ClientSearchProvider | CloudflareSearchProvider |
|---------|---------------------|-------------------------|
| Location | Browser | Cloudflare Worker |
| Index Size Limit | ~5MB practical | Unlimited |
| Network Requests | Initial index download | Per search query |
| Latency | Instant after load | Network dependent |
| Offline Support | Yes | No |
| Server Costs | None | Cloudflare Workers |
| Best For | Small-medium sites | Large sites |

## Fallback Strategy

Implement graceful fallback between providers:

```typescript
import { ClientSearchProvider } from '@duct-ui/client-search-provider'
import { CloudflareSearchProvider } from '@duct-ui/cloudflare-search-provider'

class SearchProviderWithFallback {
  constructor() {
    this.providers = []
  }
  
  async initialize() {
    // Try server-side first (faster for large indexes)
    try {
      const cloudflare = new CloudflareSearchProvider({
        workerUrl: '/api'
      })
      await cloudflare.initialize({ workerUrl: '/api' })
      this.providers.push(cloudflare)
    } catch (e) {
      console.log('Server search unavailable')
    }
    
    // Always have client-side as fallback
    try {
      const client = new ClientSearchProvider()
      await client.initialize({
        indexUrl: '/search-index.json'
      })
      this.providers.push(client)
    } catch (e) {
      console.error('Client search failed to initialize')
    }
  }
  
  async search(query, options) {
    for (const provider of this.providers) {
      try {
        return await provider.search(query, options)
      } catch (e) {
        continue // Try next provider
      }
    }
    return [] // No providers available
  }
}
```

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  SearchProvider,
  SearchResult,
  SearchOptions,
  SearchIndexEntry
} from '@duct-ui/client-search-provider'
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT