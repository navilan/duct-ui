# Duct UI Search - Cloudflare Worker Integration

This directory contains template files for integrating Duct UI search with Cloudflare Workers.

## 📦 Prerequisites

### Required Dependencies
```bash
npm install @duct-ui/cloudflare-search-provider flexsearch dotenv
```

### Required Cloudflare Resources
- Cloudflare account with Workers enabled
- R2 storage enabled (for search index)
- KV storage enabled (for metadata)

## ☁️ Creating Cloudflare Resources

### 1. Create KV Namespaces (for metadata)

```bash
# Create production KV namespace
wrangler kv namespace create "starter-search-metadata-prod"
# Output: Created namespace with title "your-worker-starter-search-metadata-prod"
# Copy the "id" value to wrangler.toml

# Create preview KV namespace
wrangler kv namespace create "starter-search-metadata-preview"  
# Output: Created namespace with title "your-worker-starter-search-metadata-preview"
# Copy the "id" value to wrangler.preview.toml
```

### 2. Create R2 Buckets (for search index)

```bash
# Create production R2 bucket
wrangler r2 bucket create starter-search-index-prod

# Create preview R2 bucket  
wrangler r2 bucket create starter-search-index-preview
```

### 3. Update Configuration Files with Resource IDs

After creating resources:

**Update `wrangler.toml` (Production):**
```toml
[[kv_namespaces]]
binding = "SEARCH_METADATA"
id = "production-kv-namespace-id" # Use ID from production KV namespace

[[r2_buckets]]
binding = "SEARCH_INDEX"
bucket_name = "starter-search-index-prod"
```

**Update `wrangler.preview.toml` (Preview):**
```toml
[[kv_namespaces]]
binding = "SEARCH_METADATA"
id = "preview-kv-namespace-id" # Use ID from preview KV namespace

[[r2_buckets]]
binding = "SEARCH_INDEX"
bucket_name = "starter-search-index-preview"
```

## 🚀 Setup Instructions

### Option A: New Worker Setup

If you don't have an existing Cloudflare Worker:

1. **Copy template files**
   ```bash
   cp search-worker.template.ts search-worker.ts
   cp wrangler.toml.template wrangler.toml
   cp wrangler.preview.toml.template wrangler.preview.toml
   ```

2. **Set authentication tokens**
   ```bash
   # For production
   wrangler secret put SEARCH_INDEX_AUTH_TOKEN -c wrangler.toml
   
   # For preview
   wrangler secret put SEARCH_INDEX_AUTH_TOKEN -c wrangler.preview.toml
   ```

### Option B: Existing Worker Integration

If you already have a Cloudflare Worker:

1. **Copy the search worker code**
   ```bash
   cp search-worker.template.ts search-worker.ts
   ```

2. **Update your existing worker's request handler**
   
   In your main worker file, add the search handler:
   ```typescript
   import { SearchWorkerHandler } from '@duct-ui/cloudflare-search-provider/worker'
   
   export default {
     async fetch(request, env) {
       const url = new URL(request.url)
       
       // Route /search/* endpoints to the search handler
       if (url.pathname.startsWith('/search/')) {
         const searchHandler = new SearchWorkerHandler(env)
         return searchHandler.handleRequest(request)
       }
       
       // Your existing worker logic
       return yourExistingHandler(request, env)
     }
   }
   ```

3. **Add configurations to your existing wrangler files**
   
   **Add to production `wrangler.toml`:**
   ```toml
   [[kv_namespaces]]
   binding = "SEARCH_METADATA"
   id = "your-production-kv-id"
   
   [[r2_buckets]]
   binding = "SEARCH_INDEX"
   bucket_name = "starter-search-index-prod"
   ```
   
   **Add to preview `wrangler.preview.toml`:**
   ```toml
   [[kv_namespaces]]
   binding = "SEARCH_METADATA"
   id = "your-preview-kv-id"
   
   [[r2_buckets]]
   binding = "SEARCH_INDEX"
   bucket_name = "starter-search-index-preview"
   ```

4. **Set authentication tokens**
   ```bash
   # For production
   wrangler secret put SEARCH_INDEX_AUTH_TOKEN -c wrangler.toml
   
   # For preview  
   wrangler secret put SEARCH_INDEX_AUTH_TOKEN -c wrangler.preview.toml
   ```

## ⚙️ Configuration

### Environment Variables Setup

Create a `.env` file in your project root with the following variables:

```bash
# .env file
SITE_URL=http://localhost:5173
WORKER_URL=http://localhost:8788
SEARCH_INDEX_AUTH_TOKEN=your-auth-token-here
```

**Environment Variable Descriptions:**
- `SITE_URL`: The URL where your built site is hosted (where search-index.json is accessible)
- `WORKER_URL`: The URL of your Cloudflare Worker (for local dev or deployed worker)
- `SEARCH_INDEX_AUTH_TOKEN`: Authentication token for updating the search index (same as set in wrangler secrets)

**For different environments:**
```bash
# Local development
SITE_URL=http://localhost:5173
WORKER_URL=http://localhost:8788

# Staging/Preview
SITE_URL=https://your-preview-site.pages.dev
WORKER_URL=https://staging--your-worker.your-subdomain.workers.dev

# Production
SITE_URL=https://your-site.com
WORKER_URL=https://your-worker.your-subdomain.workers.dev
```

### Update duct.config.ts

```typescript
export default {
  search: {
    provider: '@duct-ui/cloudflare-search-provider',
    config: {
      // Optional: specify worker URL explicitly
      // workerUrl: 'https://your-worker.workers.dev'
    }
  }
}
```

## 📁 Generated Files

| File | Purpose |
|------|---------|
| `search-worker.template.ts` | Worker implementation with /api prefix support |
| `wrangler.toml.template` | Production Cloudflare configuration |
| `wrangler.preview.toml.template` | Preview Cloudflare configuration |
| `sync-search-index.js` | ES module script for syncing search index with .env support |
| `SEARCH-PROVIDER-README.md` | This documentation |

## 🔍 API Endpoints

The worker exposes these endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/search/execute?q=query` | GET | Search the index |
| `/search/health` | GET | Check worker status |
| `/search/stats` | GET | Get index statistics |
| `/search/index` | POST | Append entries to search index (requires auth) |
| `/search/sync-index` | POST | Sync index from URL (requires auth) |

### Example API Calls

**Search for content:**
```bash
curl https://your-worker.workers.dev/search/execute?q=getting+started
```

**Check health status:**
```bash
curl https://your-worker.workers.dev/search/health
```

**Get index statistics:**
```bash
curl https://your-worker.workers.dev/search/stats
```

**Sync search index from URL:**
```bash
# Sync from default location (/search-index.json)
curl -X POST https://your-worker.workers.dev/search/sync-index \
  -H "Authorization: Bearer YOUR_TOKEN"

# Sync from custom URL
curl -X POST https://your-worker.workers.dev/search/sync-index \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-site.com/search-index.json"}'
```

**Append entries to search index:**
```bash
curl -X POST https://your-worker.workers.dev/search/index \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entries": [
      {
        "url": "/new-page",
        "title": "New Page Title",
        "description": "Page description",
        "content": "Page content for search"
      }
    ]
  }'
```

## 📝 Package.json Scripts

Add these scripts to your `package.json` for easier development and deployment:

```json
{
  "scripts": {
    "worker:dev": "wrangler dev -c worker/wrangler.preview.toml --port 8788 --local",
    "worker:deploy": "wrangler deploy -c worker/wrangler.toml",
    "worker:deploy:preview": "wrangler versions upload -c worker/wrangler.preview.toml --preview-alias staging",
    "worker:types": "wrangler types --config worker/wrangler.toml",
    "worker:types:preview": "wrangler types --config worker/wrangler.preview.toml",
    "search:sync": "node sync-search-index.js"
  }
}
```

### Script Usage

```bash
# Start local worker (using preview config)
npm run worker:dev

# Deploy to production
npm run worker:deploy

# Deploy to preview (Cloudflare Versions with staging alias)
npm run worker:deploy:preview

# Generate TypeScript types for production
npm run worker:types

# Generate TypeScript types for preview
npm run worker:types:preview

# Sync search index (uses .env file)
npm run search:sync
```

## 🔄 Deployment

### Build and Deploy Flow

1. **Build Phase** - Generates search index
   ```bash
   npm run build
   # Creates dist/search-index.json
   ```

2. **Deploy Phase** - Deploys worker and site
   
   **Automatic (via Cloudflare CI):**
   - Push to GitHub
   - Cloudflare deploys worker and site

   **Manual:**
   ```bash
   wrangler deploy
   ```

3. **Post-Deploy Phase** - Sync search index
   ```bash
   # Using npm script (recommended)
   npm run search:sync
   
   # Or manually with environment variables:
   WORKER_URL=https://your-worker.workers.dev SITE_URL=https://your-site.com node sync-search-index.js
   ```

### CI/CD Pipeline Example

```yaml
# .github/workflows/deploy.yml
steps:
  - name: Build
    run: npm run build
    
  - name: Deploy to Cloudflare
    run: wrangler deploy
    
  - name: Sync Search Index
    run: npm run search:sync
    env:
      WORKER_URL: https://your-worker.workers.dev
      SITE_URL: https://your-deployed-site.com
      SEARCH_INDEX_AUTH_TOKEN: ${{ secrets.SEARCH_INDEX_AUTH_TOKEN }}
```

## 🧪 Testing

### Local Development
```bash
wrangler dev search-worker.ts
```

### Test Endpoints
```bash
# Test search
curl http://localhost:8787/search/execute?q=test

# Test health check
curl http://localhost:8787/search/health

# Test statistics
curl http://localhost:8787/search/stats
```

## 🔐 Security

- **SEARCH_INDEX_AUTH_TOKEN**: Required for index updates
- **CORS**: Configured to allow cross-origin requests
- **Rate Limiting**: Configure in Cloudflare dashboard

## 🐛 Troubleshooting

### Common Issues

1. **"SEARCH_INDEX_AUTH_TOKEN is not defined"**
   - Run: `wrangler secret put SEARCH_INDEX_AUTH_TOKEN`

2. **"Cannot find module 'flexsearch'"**
   - Run: `npm install flexsearch`

3. **"Binding not found: SEARCH_INDEX"**
   - Ensure R2 bucket binding is added to wrangler.toml

4. **Search returns empty results**
   - Check if index has been uploaded post-deployment
   - Verify worker URL in duct.config.ts
   - Check `/search/stats` endpoint for index size

5. **Search shows unpublished content**
   - Ensure index update happens AFTER deployment
   - Not during build phase

6. **".env file not found" error**
   - Create `.env` file in project root with required variables
   - Ensure file is not committed to version control (add to .gitignore)

### Debug Commands

```bash
# Check worker logs
wrangler tail

# Check worker status
curl https://your-worker.workers.dev/search/health

# Check index stats
curl https://your-worker.workers.dev/search/stats

# Test sync script locally
node sync-search-index.js
```

## 📚 Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Duct UI Documentation](https://duct-ui.dev)
- [FlexSearch Documentation](https://github.com/nextapps-de/flexsearch)