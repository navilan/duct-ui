# @duct-ui/cloudflare-search-provider

Server-side search provider for Duct UI applications using Cloudflare Workers, KV, and R2 storage.

## Features

- **Server-side Search**: Offload search to Cloudflare Workers for better performance with large indexes
- **Distributed Storage**: Uses KV for metadata and R2 for index storage
- **REST API**: Simple HTTP API for search operations
- **Index Management**: Support for syncing and appending search indexes
- **CORS Support**: Built-in CORS headers for cross-origin requests
- **Authentication**: Token-based authentication for index updates
- **CLI Tool**: Built-in CLI for generating worker templates

## Quick Start with CLI

The package includes a CLI tool to generate Cloudflare Worker templates:

```bash
# Generate worker files in ./worker directory
npx @duct-ui/cloudflare-search-provider init

# Generate in custom directory
npx @duct-ui/cloudflare-search-provider init --output ./my-worker

# Specify project name
npx @duct-ui/cloudflare-search-provider init --name my-search-app
```

This generates:
- `search-worker.template.ts` - Worker implementation with /api prefix support
- `wrangler.toml.template` - Cloudflare configuration
- `SEARCH-PROVIDER-README.md` - Complete integration guide

## Installation

```bash
npm install @duct-ui/cloudflare-search-provider
# or
pnpm add @duct-ui/cloudflare-search-provider
```

## Setup

### 1. Create Worker Configuration

Create `worker/wrangler.toml`:

```toml
name = "search-worker"
main = "worker.ts"
compatibility_date = "2024-04-03"

# KV namespace for search metadata
[[kv_namespaces]]
binding = "SEARCH_METADATA"
id = "search-metadata-kv"

# R2 bucket for search index storage
[[r2_buckets]]
binding = "SEARCH_INDEX"
bucket_name = "search-index-bucket"
```

### 2. Create Worker Entry Point

Create `worker/worker.ts`:

```typescript
import { SearchWorkerHandler } from '@duct-ui/cloudflare-search-provider/worker'

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const pathname = url.pathname
    
    // Mount on /api prefix
    if (pathname.startsWith('/api/')) {
      const newUrl = new URL(request.url)
      newUrl.pathname = pathname.substring(4) // Remove '/api'
      const newRequest = new Request(newUrl, request)
      
      const handler = new SearchWorkerHandler(env)
      return handler.handleRequest(newRequest)
    }
    
    return new Response('Not Found', { status: 404 })
  }
}
```

### 3. Environment Variables

Create `.env` file for local development:

```bash
SEARCH_INDEX_AUTH_TOKEN=your-secure-token-here
```

For production, set via Cloudflare dashboard or:
```bash
wrangler secret put SEARCH_INDEX_AUTH_TOKEN
```

### 4. Development

Add to `package.json`:

```json
{
  "scripts": {
    "worker:dev": "wrangler dev -c worker/wrangler.toml --port 8788 --local"
  }
}
```

Run the worker:
```bash
npm run worker:dev
```

## Client Usage

### Initialize Provider

```typescript
import { CloudflareSearchProvider } from '@duct-ui/cloudflare-search-provider'

const searchProvider = new CloudflareSearchProvider()

// Initialize the provider
await searchProvider.initialize({
  workerUrl: 'http://localhost:8788/api', // or your production URL
  timeout: 5000
})
```

### Search

```typescript
const results = await searchProvider.search('your search query', {
  limit: 10,
  offset: 0
})

// Results format:
// [
//   {
//     url: '/page-url',
//     title: 'Page Title',
//     excerpt: 'Page excerpt...',
//     score: 95
//   }
// ]
```

### With Fallback

```typescript
import { CloudflareSearchProvider } from '@duct-ui/cloudflare-search-provider'
import { ClientSearchProvider } from '@duct-ui/client-search-provider'

let activeProvider

// Try server-side search first
try {
  const cloudflareProvider = new CloudflareSearchProvider()
  await cloudflareProvider.initialize({ 
    workerUrl: '/api',
    timeout: 5000
  })
  activeProvider = cloudflareProvider
} catch (error) {
  // Fallback to client-side search
  const clientProvider = new ClientSearchProvider()
  await clientProvider.initialize({ indexUrl: '/search-index.json' })
  activeProvider = clientProvider
}

// Use the active provider
const results = await activeProvider.search(query)
```

## API Endpoints

### GET /search/health
Check worker health and index status.

**Response:**
```json
{
  "status": "healthy",
  "indexSize": 100,
  "lastUpdate": 1234567890,
  "version": "1.0"
}
```

### GET /search/execute?q=query
Execute a search query.

**Parameters:**
- `q` (required): Search query
- `limit` (optional): Maximum results (default: 10)
- `offset` (optional): Result offset for pagination

**Response:**
```json
{
  "results": [
    {
      "url": "/page",
      "title": "Page Title",
      "excerpt": "Matching excerpt...",
      "score": 95
    }
  ]
}
```

### GET /search/stats
Get index statistics.

**Response:**
```json
{
  "size": 100,
  "lastUpdate": 1234567890,
  "version": "1.0",
  "indexSize": 50000
}
```

### POST /search/sync-index
Sync search index from a URL.

**Headers:**
- `Authorization: Bearer <token>`

**Body (optional):**
```json
{
  "url": "https://example.com/search-index.json"
}
```

Default URL: `/search-index.json`

**Response:**
```json
{
  "success": true,
  "entriesCount": 100,
  "timestamp": 1234567890,
  "indexSize": 50000,
  "indexUrl": "https://example.com/search-index.json"
}
```

### POST /search/index
Append entries to the search index.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "entries": [
    {
      "url": "/page",
      "title": "Page Title",
      "description": "Page description",
      "content": "Full page content",
      "tags": ["tag1", "tag2"],
      "keywords": ["keyword1", "keyword2"]
    }
  ],
  "timestamp": 1234567890,
  "version": "1.0"
}
```

**Response:**
```json
{
  "success": true,
  "entriesCount": 101,
  "newEntriesAdded": 1,
  "timestamp": 1234567890,
  "indexSize": 51000
}
```

## Index Management

### Sync from Static Index

```bash
# Sync from default location (/search-index.json)
curl -X POST "https://your-worker.workers.dev/api/search/sync-index" \
  -H "Authorization: Bearer your-token"

# Sync from custom URL
curl -X POST "https://your-worker.workers.dev/api/search/sync-index" \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/custom-index.json"}'
```

### Append New Entries

```typescript
const config = {
  authToken: 'your-secure-token',
  workerUrl: 'https://your-worker.workers.dev/api'
}

await searchProvider.appendIndex([
  {
    url: '/new-page',
    title: 'New Page',
    description: 'Description',
    content: 'Page content',
    tags: ['new'],
    keywords: ['new', 'page']
  }
], config)
```

## Production Deployment

### Deploy to Cloudflare Workers

```bash
# Deploy from your project root (TypeScript is compiled automatically by Wrangler)
wrangler deploy -c worker/wrangler.toml

# Or if you have a package.json script
npm run worker:deploy
```

**Note**: Wrangler automatically compiles TypeScript files. You don't need to compile `.ts` files to `.js` before deployment.

### Configure Production Secrets

```bash
wrangler secret put SEARCH_INDEX_AUTH_TOKEN
```

### Use with Cloudflare Pages

In your Duct UI application:

```typescript
const searchProvider = new CloudflareSearchProvider()

await searchProvider.initialize({
  workerUrl: 'https://search-api.your-domain.workers.dev',
  apiKey: process.env.SEARCH_API_KEY, // Optional additional security
  timeout: 5000
})
```

## Security Considerations

1. **Authentication**: Always use secure tokens for index updates
2. **CORS**: Configure allowed origins in production
3. **Rate Limiting**: Consider adding rate limiting for public endpoints
4. **Token Rotation**: Regularly rotate authentication tokens
5. **HTTPS**: Always use HTTPS in production

## Performance Tips

1. **Index Size**: Keep indexes under 10MB for optimal performance
2. **Caching**: Worker responses are cached at edge locations
3. **Pagination**: Use limit/offset for large result sets
4. **Fallback**: Implement client-side fallback for resilience

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type {
  CloudflareSearchConfig,
  CloudflareIndexConfig
} from '@duct-ui/cloudflare-search-provider'
```

## License

MIT