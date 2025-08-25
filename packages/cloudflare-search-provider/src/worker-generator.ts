import * as fs from 'fs/promises'
import * as path from 'path'

export interface WorkerGeneratorConfig {
  outputDir: string
  projectName?: string
}

/**
 * Generates template files for Cloudflare Worker integration
 * Does not overwrite existing files - creates .template files instead
 */
export async function generateWorkerTemplates(config: WorkerGeneratorConfig): Promise<void> {
  const { outputDir, projectName = 'search' } = config

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true })

  // Generate minimal worker template (< 10 lines)
  const workerCode = `// Minimal Cloudflare Worker for Duct UI Search
import { SearchWorkerHandler } from '@duct-ui/cloudflare-search-provider/worker'

export default {
  async fetch(request, env) {
    const handler = new SearchWorkerHandler(env)
    return handler.handleRequest(request)
  }
}`

  await fs.writeFile(path.join(outputDir, 'search-worker.template.ts'), workerCode)

  // Generate wrangler.toml template
  const wranglerTemplate = `# Add these configurations to your existing wrangler.toml
# or create a new wrangler.toml if you don't have one

name = "${projectName}-search-worker"
main = "search-worker.ts"
compatibility_date = "2024-01-01"

# KV namespace for search metadata
[[kv_namespaces]]
binding = "SEARCH_METADATA"

# R2 bucket for search index storage
[[r2_buckets]]
binding = "SEARCH_INDEX"

# Environment variables
# Set SEARCH_INDEX_AUTH_TOKEN as a secret in Cloudflare dashboard:
# wrangler secret put SEARCH_INDEX_AUTH_TOKEN`

  await fs.writeFile(path.join(outputDir, 'wrangler.toml.template'), wranglerTemplate)

  // Generate integration instructions
  const readme = `# Duct UI Search - Cloudflare Worker Integration

This directory contains template files for integrating Duct UI search with Cloudflare Workers.

## 📦 Prerequisites

### Required Dependencies
\`\`\`bash
npm install @duct-ui/cloudflare-search-provider flexsearch
\`\`\`

### Required Cloudflare Resources
- Cloudflare account with Workers enabled
- R2 storage enabled (for search index)
- KV storage enabled (for metadata)

## 🚀 Setup Instructions

### Option A: New Worker Setup

If you don't have an existing Cloudflare Worker:

1. **Copy template files**
   \`\`\`bash
   cp search-worker.template.ts search-worker.ts
   cp wrangler.toml.template wrangler.toml
   \`\`\`

2. **Set authentication token**
   \`\`\`bash
   wrangler secret put SEARCH_INDEX_AUTH_TOKEN
   \`\`\`

### Option B: Existing Worker Integration

If you already have a Cloudflare Worker:

1. **Copy the search worker code**
   \`\`\`bash
   cp search-worker.template.ts search-worker.ts
   \`\`\`

2. **Update your existing worker's request handler**
   
   In your main worker file, add the search handler:
   \`\`\`typescript
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
   \`\`\`

3. **Add configurations to your existing wrangler.toml**
   \`\`\`toml
   # Add these to your existing wrangler.toml
   [[kv_namespaces]]
   binding = "SEARCH_METADATA"
   
   [[r2_buckets]]
   binding = "SEARCH_INDEX"
   \`\`\`

4. **Set authentication token**
   \`\`\`bash
   wrangler secret put SEARCH_INDEX_AUTH_TOKEN
   \`\`\`

## ⚙️ Configuration

### Update duct.config.ts

\`\`\`typescript
export default {
  search: {
    provider: '@duct-ui/cloudflare-search-provider',
    config: {
      // Optional: specify worker URL explicitly
      // workerUrl: 'https://your-worker.workers.dev'
    }
  }
}
\`\`\`

## 📁 Generated Files

| File | Purpose |
|------|---------|
| \`search-worker.template.ts\` | Minimal worker implementation |
| \`wrangler.toml.template\` | Cloudflare configuration |
| \`SEARCH-PROVIDER-README.md\` | This documentation |

## 🔍 API Endpoints

The worker exposes these endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| \`/search/execute?q=query\` | GET | Search the index |
| \`/search/health\` | GET | Check worker status |
| \`/search/stats\` | GET | Get index statistics |
| \`/search/index\` | POST | Update search index (requires auth) |

### Example API Calls

**Search for content:**
\`\`\`bash
curl https://your-worker.workers.dev/search/execute?q=getting+started
\`\`\`

**Check health status:**
\`\`\`bash
curl https://your-worker.workers.dev/search/health
\`\`\`

**Get index statistics:**
\`\`\`bash
curl https://your-worker.workers.dev/search/stats
\`\`\`

**Update search index (post-deployment only):**
\`\`\`bash
curl -X POST https://your-worker.workers.dev/search/index \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d @dist/search-index.json
\`\`\`

## 🔄 Deployment

### Build and Deploy Flow

1. **Build Phase** - Generates search index
   \`\`\`bash
   npm run build
   # Creates dist/search-index.json
   \`\`\`

2. **Deploy Phase** - Deploys worker and site
   
   **Automatic (via Cloudflare CI):**
   - Push to GitHub
   - Cloudflare deploys worker and site

   **Manual:**
   \`\`\`bash
   wrangler deploy
   \`\`\`

3. **Post-Deploy Phase** - Update search index
   \`\`\`bash
   # After deployment is complete, update the search index
   npm run update-search-index
   # or manually:
   curl -X POST https://your-worker.workers.dev/search/index \\
     -H "Authorization: Bearer $SEARCH_INDEX_AUTH_TOKEN" \\
     -H "Content-Type: application/json" \\
     -d @dist/search-index.json
   \`\`\`

### CI/CD Pipeline Example

\`\`\`yaml
# .github/workflows/deploy.yml
steps:
  - name: Build
    run: npm run build
    
  - name: Deploy to Cloudflare
    run: wrangler deploy
    
  - name: Update Search Index
    run: |
      curl -X POST https://your-worker.workers.dev/search/index \\
        -H "Authorization: Bearer \${{ secrets.SEARCH_INDEX_AUTH_TOKEN }}" \\
        -H "Content-Type: application/json" \\
        -d @dist/search-index.json
\`\`\`

## 🧪 Testing

### Local Development
\`\`\`bash
wrangler dev search-worker.ts
\`\`\`

### Test Endpoints
\`\`\`bash
# Test search
curl http://localhost:8787/search/execute?q=test

# Test health check
curl http://localhost:8787/search/health

# Test statistics
curl http://localhost:8787/search/stats
\`\`\`

## 🔐 Security

- **SEARCH_INDEX_AUTH_TOKEN**: Required for index updates
- **CORS**: Configured to allow cross-origin requests
- **Rate Limiting**: Configure in Cloudflare dashboard

## 🐛 Troubleshooting

### Common Issues

1. **"SEARCH_INDEX_AUTH_TOKEN is not defined"**
   - Run: \`wrangler secret put SEARCH_INDEX_AUTH_TOKEN\`

2. **"Cannot find module 'flexsearch'"**
   - Run: \`npm install flexsearch\`

3. **"Binding not found: SEARCH_INDEX"**
   - Ensure R2 bucket binding is added to wrangler.toml

4. **Search returns empty results**
   - Check if index has been uploaded post-deployment
   - Verify worker URL in duct.config.ts
   - Check \`/search/stats\` endpoint for index size

5. **Search shows unpublished content**
   - Ensure index update happens AFTER deployment
   - Not during build phase

### Debug Commands

\`\`\`bash
# Check worker logs
wrangler tail

# Check worker status
curl https://your-worker.workers.dev/search/health

# Check index stats
curl https://your-worker.workers.dev/search/stats
\`\`\`

## 📚 Additional Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Duct UI Documentation](https://duct-ui.dev)
- [FlexSearch Documentation](https://github.com/nextapps-de/flexsearch)
`

  await fs.writeFile(path.join(outputDir, 'SEARCH-PROVIDER-README.md'), readme)

  console.log(`✅ Generated Cloudflare worker templates at: ${outputDir}`)
  console.log(`
Template files created:
- search-worker.template.ts (worker implementation)
- wrangler.toml.template (Cloudflare configuration)
- SEARCH-PROVIDER-README.md (integration instructions)

No existing files were modified. Please review SEARCH-PROVIDER-README.md for integration steps.
`)
}