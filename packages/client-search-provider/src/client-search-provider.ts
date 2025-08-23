import FlexSearch from 'flexsearch'
import type { 
  SearchProvider, 
  SearchProviderConfig, 
  SearchOptions, 
  SearchResult, 
  SearchIndexEntry,
  SearchInitializeResult
} from '@duct-ui/search-core'

export interface ClientSearchConfig extends SearchProviderConfig {
  indexUrl?: string
  cacheKey?: string
  threshold?: number
  limit?: number
}

export class ClientSearchProvider implements SearchProvider {
  public readonly name = '@duct-ui/client-search-provider'
  
  private flexIndex: FlexSearch.Document<SearchIndexEntry> | null = null
  private indexData: SearchIndexEntry[] = []
  private config: ClientSearchConfig = {}
  private isInitialized = false
  
  async initialize(config: ClientSearchConfig): Promise<SearchInitializeResult> {
    this.config = {
      indexUrl: '/search-index.json',
      cacheKey: 'duct-search-index',
      threshold: 0.3,
      limit: 10,
      ...config
    }
    
    // Load index data
    await this.loadIndexData()
    
    // Create FlexSearch document index
    this.createFlexSearchIndex()
    
    this.isInitialized = true
    
    return { indexSize: this.indexData.length }
  }
  
  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    if (!this.isInitialized || !this.flexIndex || !query.trim()) {
      return []
    }
    
    const searchOptions = {
      limit: options?.limit || this.config.limit || 10,
      ...options
    }
    
    try {
      // Perform multi-field search using FlexSearch
      // FlexSearch document search returns results from all configured fields
      const results = await this.flexIndex.searchAsync(query, searchOptions.limit)
      
      // Convert FlexSearch results to SearchResult format
      return this.formatResults(results, query)
    } catch (error) {
      console.error('Search failed:', error)
      return []
    }
  }
  
  private async loadIndexData(): Promise<void> {
    try {
      // Try to load from cache first
      const cachedData = await this.loadFromCache()
      if (cachedData) {
        this.indexData = cachedData.index
        return
      }
      
      // Load from network
      const response = await fetch(this.config.indexUrl!)
      if (!response.ok) {
        throw new Error(`Failed to load search index: ${response.statusText}`)
      }
      
      this.indexData = await response.json()
      
      // Cache the loaded data
      await this.saveToCache({
        index: this.indexData,
        timestamp: Date.now(),
        etag: response.headers.get('etag') || undefined
      })
      
    } catch (error) {
      console.error('Failed to load search index:', error)
      this.indexData = []
    }
  }
  
  private createFlexSearchIndex(): void {
    // Create FlexSearch document index with multi-field support
    this.flexIndex = new FlexSearch.Document({
      document: {
        id: 'url',
        index: [
          {
            field: 'title',
            tokenize: 'forward',
            optimize: true,
            resolution: 9
          },
          {
            field: 'description', 
            tokenize: 'forward',
            optimize: true,
            resolution: 5
          },
          {
            field: 'content',
            tokenize: 'forward', 
            optimize: true,
            resolution: 1
          },
          {
            field: 'tags',
            tokenize: 'full',
            optimize: true,
            resolution: 9
          }
        ]
      }
    })
    
    // Add all documents to the index
    for (const entry of this.indexData) {
      this.flexIndex.add(entry)
    }
  }
  
  private formatResults(results: any[], query: string): SearchResult[] {
    const searchResults: SearchResult[] = []
    const urlSet = new Set<string>()
    
    // FlexSearch Document API returns results grouped by field
    // Each result is { field: "fieldName", result: ["url1", "url2", ...] }
    for (const fieldResult of results) {
      if (fieldResult.result && Array.isArray(fieldResult.result)) {
        for (const url of fieldResult.result) {
          // Avoid duplicates since a URL can appear in multiple fields
          if (!urlSet.has(url)) {
            urlSet.add(url)
            const entry = this.indexData.find(item => item.url === url)
            if (entry) {
              searchResults.push({
                url: entry.url,
                title: entry.title,
                excerpt: this.generateExcerpt(entry, query),
                score: this.calculateRelevanceScore(entry, query, fieldResult.field)
              })
            }
          }
        }
      }
    }
    
    // Filter out results below the threshold (if configured)
    let filteredResults = searchResults
    if (this.config.threshold && this.config.threshold > 0) {
      // Calculate minimum score threshold based on the highest score
      const maxScore = Math.max(...searchResults.map(r => r.score || 0))
      const minScore = maxScore * this.config.threshold
      filteredResults = searchResults.filter(r => (r.score || 0) >= minScore)
    }
    
    // Sort by relevance score (highest first)
    return filteredResults.sort((a, b) => (b.score || 0) - (a.score || 0))
  }
  
  private generateExcerpt(entry: SearchIndexEntry, query: string): string {
    // Use description if available, otherwise generate from content
    if (entry.description.trim()) {
      return entry.description
    }
    
    // Find query term in content and create excerpt around it
    const queryTerms = query.toLowerCase().split(/\s+/)
    const content = entry.content.toLowerCase()
    
    for (const term of queryTerms) {
      const index = content.indexOf(term)
      if (index !== -1) {
        const start = Math.max(0, index - 100)
        const end = Math.min(entry.content.length, index + term.length + 100)
        let excerpt = entry.content.slice(start, end).trim()
        
        if (start > 0) excerpt = '...' + excerpt
        if (end < entry.content.length) excerpt = excerpt + '...'
        
        return excerpt
      }
    }
    
    // Fallback to first 200 characters
    return entry.content.slice(0, 200).trim() + (entry.content.length > 200 ? '...' : '')
  }
  
  private calculateRelevanceScore(entry: SearchIndexEntry, query: string, matchingField?: string): number {
    const queryTerms = query.toLowerCase().split(/\s+/)
    let score = 0
    
    // Score based on matches in different fields (weighted)
    const title = entry.title.toLowerCase()
    const description = entry.description.toLowerCase()
    const content = entry.content.toLowerCase()
    const tags = entry.tags.join(' ').toLowerCase()
    
    for (const term of queryTerms) {
      if (title.includes(term)) score += 10
      if (description.includes(term)) score += 5
      if (tags.includes(term)) score += 8
      if (content.includes(term)) score += 1
    }
    
    // Boost exact phrase matches
    const queryPhrase = query.toLowerCase()
    if (title.includes(queryPhrase)) score += 20
    if (description.includes(queryPhrase)) score += 10
    
    return score
  }
  
  private async loadFromCache(): Promise<CacheData | null> {
    try {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return this.loadFromLocalStorage()
      }
      
      return await this.loadFromIndexedDB()
    } catch (error) {
      console.warn('Cache load failed, falling back to network:', error)
      return null
    }
  }
  
  private loadFromLocalStorage(): CacheData | null {
    try {
      const cached = localStorage.getItem(this.config.cacheKey!)
      if (!cached) return null
      
      const data: CacheData = JSON.parse(cached)
      
      // Check if cache is still valid (24 hours)
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours
      if (Date.now() - data.timestamp > maxAge) {
        localStorage.removeItem(this.config.cacheKey!)
        return null
      }
      
      return data
    } catch (error) {
      localStorage.removeItem(this.config.cacheKey!)
      return null
    }
  }
  
  private async loadFromIndexedDB(): Promise<CacheData | null> {
    return new Promise((resolve) => {
      const request = indexedDB.open('duct-search', 1)
      
      request.onerror = () => resolve(null)
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('search-index')) {
          db.createObjectStore('search-index')
        }
      }
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const transaction = db.transaction(['search-index'], 'readonly')
        const store = transaction.objectStore('search-index')
        const getRequest = store.get(this.config.cacheKey!)
        
        getRequest.onsuccess = () => {
          const data = getRequest.result
          if (!data) {
            resolve(null)
            return
          }
          
          // Check cache validity (24 hours)
          const maxAge = 24 * 60 * 60 * 1000
          if (Date.now() - data.timestamp > maxAge) {
            // Clean up expired cache
            const deleteTransaction = db.transaction(['search-index'], 'readwrite')
            const deleteStore = deleteTransaction.objectStore('search-index')
            deleteStore.delete(this.config.cacheKey!)
            resolve(null)
            return
          }
          
          resolve(data)
        }
        
        getRequest.onerror = () => resolve(null)
      }
    })
  }
  
  private async saveToCache(data: CacheData): Promise<void> {
    try {
      if (typeof window === 'undefined') return
      
      // Try IndexedDB first, fallback to localStorage
      if (window.indexedDB) {
        await this.saveToIndexedDB(data)
      } else {
        this.saveToLocalStorage(data)
      }
    } catch (error) {
      console.warn('Failed to save to cache:', error)
    }
  }
  
  private saveToLocalStorage(data: CacheData): void {
    try {
      localStorage.setItem(this.config.cacheKey!, JSON.stringify(data))
    } catch (error) {
      // Quota exceeded or other error - remove old data and try again
      localStorage.removeItem(this.config.cacheKey!)
    }
  }
  
  private async saveToIndexedDB(data: CacheData): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('duct-search', 1)
      
      request.onerror = () => reject(request.error)
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('search-index')) {
          db.createObjectStore('search-index')
        }
      }
      
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const transaction = db.transaction(['search-index'], 'readwrite')
        const store = transaction.objectStore('search-index')
        const putRequest = store.put(data, this.config.cacheKey!)
        
        putRequest.onsuccess = () => resolve()
        putRequest.onerror = () => reject(putRequest.error)
      }
    })
  }
}

interface CacheData {
  index: SearchIndexEntry[]
  timestamp: number
  etag?: string
}