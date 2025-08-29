# Add Search to Your Website

Add instant search to your Duct site with configurable providers for any deployment scenario.

## Quick Setup

### 1. Enable Search in Configuration

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

### 2. Install Search Packages

**Client-side search** (for static hosting):

```bash
npm install @duct-ui/search-core @duct-ui/client-search-provider
```

**Cloudflare Workers** (for edge deployment):

```bash
npm install @duct-ui/search-core @duct-ui/cloudflare-search-provider
```

### 3. Add Search Modal to Your Layout

```typescript
import { createBlueprint, type BaseProps, createRef } from '@duct-ui/core'
import SearchModal, { type SearchModalLogic } from '@duct-ui/components/search/search-modal'
import { ClientSearchProvider } from '@duct-ui/client-search-provider'

const searchModalRef = createRef<SearchModalLogic>()
let clientSearchProvider: ClientSearchProvider | null = null

// Initialize search provider
async function initializeSearch() {
  clientSearchProvider = new ClientSearchProvider()
  await clientSearchProvider.initialize({
    indexUrl: '/search-index.json',
    threshold: 0.3
  })
}

// Perform search
async function performSearch(_el: HTMLElement, query: string) {
  if (!searchModalRef.current || !clientSearchProvider || !query.trim()) {
    searchModalRef.current?.setResults([])
    return
  }

  const results = await clientSearchProvider.search(query, { limit: 10 })
  searchModalRef.current.setResults(results)
}

// Handle result selection
function handleSelect(_el: HTMLElement, result: any) {
  if (result?.url) {
    searchModalRef.current?.hide()
    window.location.href = result.url
  }
}

// In your component render
<SearchModal
  ref={searchModalRef}
  placeholder="Search documentation..."
  hotkey="k"
  hotkeyCombination={["cmd"]}
  on:search={performSearch}
  on:select={handleSelect}
/>
```

## Search Providers

- **Client Search Provider**: Runs in browser, perfect for static sites
- **Cloudflare Search Provider**: Server-side search on edge workers

## Reference Implementation

See the complete working example in the [SearchModalProvider source](https://github.com/navilan/duct-ui/blob/main/packages/demo/src/components/SearchModalProvider.tsx).

## Learn More

- [Search Architecture Blog Post](/blog/2025/08/search-in-duct) - Deep dive into Duct's search system
- [Search Demo](/demos/search) - Interactive examples and configuration options