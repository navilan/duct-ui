import type {
  SearchProvider,
  SearchResult,
  SearchIndexEntry,
  SearchOptions,
  SearchProviderConfig,
  SearchInitializeResult
} from '@duct-ui/search-core'

interface WorkerSearchResult {
  url: string
  title: string
  excerpt: string
  score?: number
}

interface WorkerSearchResponse {
  results?: WorkerSearchResult[]
}

interface WorkerHealthResponse {
  indexSize?: number
  status?: string
  lastUpdate?: number
  version?: string
}

interface WorkerStatsResponse {
  size?: number
  lastUpdate?: number
  version?: string
  indexSize?: number
}

export interface CloudflareSearchConfig extends SearchProviderConfig {
  /** Cloudflare Worker URL for search API */
  workerUrl: string
  /** API key for authenticated requests (optional) */
  apiKey?: string
  /** Timeout for search requests in milliseconds */
  timeout?: number
}

export interface CloudflareIndexConfig {
  /** Authentication token for index upload */
  authToken: string
  /** Worker URL for index management */
  workerUrl: string
}

/**
 * Search provider that uses Cloudflare Worker for server-side search
 * Ideal for larger sites where client-side search becomes too heavy
 */
export class CloudflareSearchProvider implements SearchProvider<CloudflareIndexConfig> {
  public readonly name = 'cloudflare'
  
  private config: CloudflareSearchConfig
  private initialized = false

  constructor(config?: Partial<CloudflareSearchConfig>) {
    this.config = {
      workerUrl: '',
      timeout: 5000,
      ...config
    }
  }

  async initialize(config: CloudflareSearchConfig): Promise<{ indexSize: number }> {
    this.config = { ...this.config, ...config }
    
    if (!this.config.workerUrl) {
      throw new Error('CloudflareSearchProvider: workerUrl is required')
    }

    try {
      // Test connection and get index info
      const response = await this.makeRequest('/search/health')
      const healthData = await response.json() as WorkerHealthResponse
      
      this.initialized = true
      
      return {
        indexSize: healthData.indexSize || 0
      }
    } catch (error) {
      throw new Error(`CloudflareSearchProvider initialization failed: ${error}`)
    }
  }

  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    if (!this.initialized) {
      throw new Error('CloudflareSearchProvider not initialized')
    }

    if (!query.trim()) {
      return []
    }

    try {
      const searchParams = new URLSearchParams({
        q: query,
        ...(options?.limit && { limit: options.limit.toString() }),
        ...(options?.offset && { offset: options.offset.toString() })
      })

      const response = await this.makeRequest(`/search/execute?${searchParams}`)
      
      if (!response.ok) {
        throw new Error(`Search request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json() as WorkerSearchResponse
      return this.formatResults(data.results || [])
    } catch (error) {
      console.error('CloudflareSearchProvider search error:', error)
      return []
    }
  }

  /**
   * Append entries to search index in Cloudflare Worker
   * This method appends new entries without replacing existing ones
   */
  async appendIndex(entries: SearchIndexEntry[], config?: CloudflareIndexConfig): Promise<void> {
    if (!config) {
      throw new Error('CloudflareSearchProvider.appendIndex requires CloudflareIndexConfig')
    }
    try {
      const response = await fetch(`${config.workerUrl}/search/index`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.authToken}`,
          'User-Agent': 'Duct-UI-Indexer/1.0'
        },
        body: JSON.stringify({
          entries,
          timestamp: Date.now(),
          version: '1.0'
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Index upload failed: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const result = await response.json()
      console.log(`Successfully uploaded ${entries.length} entries to Cloudflare Worker`, result)
    } catch (error) {
      throw new Error(`Failed to update index: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Get index statistics from the worker
   */
  async getIndexStats(): Promise<{ size: number; lastUpdate: number }> {
    if (!this.initialized) {
      throw new Error('CloudflareSearchProvider not initialized')
    }

    try {
      const response = await this.makeRequest('/search/stats')
      const data = await response.json() as WorkerStatsResponse
      
      return {
        size: data.size || 0,
        lastUpdate: data.lastUpdate || 0
      }
    } catch (error) {
      console.error('Failed to get index stats:', error)
      return { size: 0, lastUpdate: 0 }
    }
  }

  private async makeRequest(path: string): Promise<Response> {
    const url = `${this.config.workerUrl}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Duct-UI-Search/1.0'
    }

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      const response = await fetch(url, {
        headers,
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${this.config.timeout}ms`)
      }
      throw error
    }
  }

  private formatResults(results: WorkerSearchResult[]): SearchResult[] {
    return results.map((result: WorkerSearchResult): SearchResult => ({
      url: result.url || '',
      title: result.title || '',
      excerpt: result.excerpt || '',
      score: result.score
    })).filter(result => result.url && result.title)
  }
}