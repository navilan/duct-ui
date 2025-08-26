import { FlexSearchEngine } from '@duct-ui/search-core'
import type { SearchIndexEntry } from '@duct-ui/search-core'

export interface Env {
  SEARCH_METADATA: KVNamespace
  SEARCH_INDEX: R2Bucket
  SEARCH_INDEX_AUTH_TOKEN: string
}

interface IndexMetadata {
  timestamp: number
  version: string
  entryCount: number
  indexSize: number
}

interface IndexData {
  entries: SearchIndexEntry[]
  timestamp: number
  version: string
}

/**
 * Cloudflare Worker request handler for search functionality
 * This is exported by the provider package and used by the minimal generated worker
 */
export class SearchWorkerHandler {
  private env: Env
  private searchEngine: FlexSearchEngine
  private indexMetadata: IndexMetadata | null = null
  private lastIndexLoad: number = 0

  constructor(env: Env) {
    this.env = env
    this.searchEngine = new FlexSearchEngine()
  }

  async handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const pathname = url.pathname

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    try {
      switch (pathname) {
        case '/search/health':
          return this.handleHealth(corsHeaders)
        case '/search/execute':
          return this.handleSearch(request, corsHeaders)
        case '/search/stats':
          return this.handleStats(corsHeaders)
        case '/search/index':
          return this.handleIndexUpdate(request, corsHeaders)
        case '/search/sync-index':
          return this.handleSyncIndex(request, corsHeaders)
        default:
          return new Response('Not Found', { status: 404, headers: corsHeaders })
      }
    } catch (error) {
      console.error('Worker error:', error)
      return new Response(
        JSON.stringify({ error: 'Internal Server Error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  private async handleHealth(corsHeaders: Record<string, string>): Promise<Response> {
    const metadata = await this.getIndexMetadata()
    return new Response(
      JSON.stringify({
        status: 'healthy',
        indexSize: metadata?.entryCount || 0,
        lastUpdate: metadata?.timestamp || 0,
        version: metadata?.version || '1.0'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  private async handleSearch(request: Request, corsHeaders: Record<string, string>): Promise<Response> {
    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
    }

    const url = new URL(request.url)
    const query = url.searchParams.get('q')?.trim()
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    if (!query) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    await this.ensureSearchIndex()
    if (this.searchEngine.size === 0) {
      return new Response(
        JSON.stringify({ results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const results = this.searchEngine.search(query, { limit, offset })

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  private async handleStats(corsHeaders: Record<string, string>): Promise<Response> {
    const metadata = await this.getIndexMetadata()
    return new Response(
      JSON.stringify({
        size: metadata?.entryCount || 0,
        lastUpdate: metadata?.timestamp || 0,
        version: metadata?.version || '1.0',
        indexSize: metadata?.indexSize || 0
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  private async handleIndexUpdate(request: Request, corsHeaders: Record<string, string>): Promise<Response> {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
    }

    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const token = authHeader.substring(7)
    if (token !== this.env.SEARCH_INDEX_AUTH_TOKEN) {
      return new Response('Forbidden', { status: 403, headers: corsHeaders })
    }

    try {
      const requestData = await request.json() as {
        entries: SearchIndexEntry[]
        timestamp: number
        version: string
      }

      if (!Array.isArray(requestData.entries)) {
        return new Response(
          JSON.stringify({ error: 'Invalid entries format' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get existing index data
      let existingEntries: SearchIndexEntry[] = []
      try {
        const existingData = await this.env.SEARCH_INDEX.get('index.json')
        if (existingData) {
          const existingIndexData = JSON.parse(await existingData.text()) as IndexData
          existingEntries = existingIndexData.entries || []
        }
      } catch (error) {
        // If no existing data or parse error, start with empty array
        existingEntries = []
      }

      // Append new entries to existing ones
      const allEntries = [...existingEntries, ...requestData.entries]

      const indexData: IndexData = {
        entries: allEntries,
        timestamp: requestData.timestamp || Date.now(),
        version: requestData.version || '1.0'
      }

      const indexDataStr = JSON.stringify(indexData)

      // Store updated index data in R2
      await this.env.SEARCH_INDEX.put('index.json', indexDataStr)

      // Store metadata in KV for fast access
      const metadata: IndexMetadata = {
        timestamp: indexData.timestamp,
        version: indexData.version,
        entryCount: allEntries.length,
        indexSize: new TextEncoder().encode(indexDataStr).length
      }

      await this.env.SEARCH_METADATA.put('metadata', JSON.stringify(metadata))

      // Reset search index to force rebuild on next search
      this.searchEngine.clear()
      this.indexMetadata = null
      this.lastIndexLoad = 0

      return new Response(
        JSON.stringify({
          success: true,
          entriesCount: allEntries.length,
          newEntriesAdded: requestData.entries.length,
          timestamp: indexData.timestamp,
          indexSize: metadata.indexSize
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  private async handleSyncIndex(request: Request, corsHeaders: Record<string, string>): Promise<Response> {
    if (request.method !== 'POST' && request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
    }

    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const token = authHeader.substring(7)
    if (token !== this.env.SEARCH_INDEX_AUTH_TOKEN) {
      return new Response('Forbidden', { status: 403, headers: corsHeaders })
    }

    try {
      let indexUrl: string = ''

      // Get index URL based on request method
      if (request.method === 'POST') {
        try {
          const text = await request.text()
          if (text.trim()) {
            const requestData = JSON.parse(text) as { url?: string }
            indexUrl = requestData.url || ''
          }
        } catch (error) {
          // Ignore JSON parse errors for empty or invalid bodies
          indexUrl = ''
        }
      } else if (request.method === 'GET') {
        const url = new URL(request.url)
        indexUrl = url.searchParams.get('url') || ''
      }

      // Use default if no URL provided
      if (!indexUrl) {
        indexUrl = '/search-index.json'
      }

      // Construct full URL for fetching the index
      const baseUrl = new URL(request.url).origin
      const fullIndexUrl = indexUrl.startsWith('http') ? indexUrl : `${baseUrl}${indexUrl}`

      // Fetch the search index
      const indexResponse = await fetch(fullIndexUrl)
      if (!indexResponse.ok) {
        return new Response(
          JSON.stringify({ 
            error: `Failed to fetch search index from ${fullIndexUrl}`, 
            status: indexResponse.status 
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const entries = await indexResponse.json() as SearchIndexEntry[]
      if (!Array.isArray(entries)) {
        return new Response(
          JSON.stringify({ error: 'Invalid search index format: expected array of entries' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create index data structure
      const indexData: IndexData = {
        entries,
        timestamp: Date.now(),
        version: '1.0'
      }

      const indexDataStr = JSON.stringify(indexData)

      // Store index data in R2
      await this.env.SEARCH_INDEX.put('index.json', indexDataStr)

      // Store metadata in KV for fast access
      const metadata: IndexMetadata = {
        timestamp: indexData.timestamp,
        version: indexData.version,
        entryCount: indexData.entries.length,
        indexSize: new TextEncoder().encode(indexDataStr).length
      }

      await this.env.SEARCH_METADATA.put('metadata', JSON.stringify(metadata))

      // Reset search index to force rebuild on next search
      this.searchEngine.clear()
      this.indexMetadata = null
      this.lastIndexLoad = 0

      return new Response(
        JSON.stringify({
          success: true,
          entriesCount: indexData.entries.length,
          timestamp: indexData.timestamp,
          indexSize: metadata.indexSize,
          indexUrl: fullIndexUrl
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      return new Response(
        JSON.stringify({ error: `Sync index failed: ${error}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  private async getIndexMetadata(): Promise<IndexMetadata | null> {
    if (this.indexMetadata) {
      return this.indexMetadata
    }

    try {
      const data = await this.env.SEARCH_METADATA.get('metadata')
      if (data) {
        this.indexMetadata = JSON.parse(data)
        return this.indexMetadata
      }
      return null
    } catch (error) {
      console.error('Failed to get index metadata:', error)
      return null
    }
  }

  private async getIndexData(): Promise<IndexData | null> {
    try {
      const object = await this.env.SEARCH_INDEX.get('index.json')
      if (!object) return null

      const data = await object.text()
      return JSON.parse(data)
    } catch (error) {
      console.error('Failed to get index data:', error)
      return null
    }
  }

  private async ensureSearchIndex(): Promise<void> {
    // Check if we have a cached index
    if (this.searchEngine.size > 0) {
      // Check if we need to refresh (metadata might have changed)
      const metadata = await this.getIndexMetadata()
      if (metadata && metadata.timestamp <= this.lastIndexLoad) {
        return // Index is still fresh
      }
    }

    const indexData = await this.getIndexData()
    if (!indexData || !indexData.entries.length) return

    // Initialize the search engine with entries
    this.searchEngine.initialize(indexData.entries)
    this.lastIndexLoad = Date.now()
  }

}