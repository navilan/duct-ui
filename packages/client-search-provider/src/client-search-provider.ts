import { FlexSearchEngine } from '@duct-ui/search-core'
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
  
  private searchEngine: FlexSearchEngine
  private indexData: SearchIndexEntry[] = []
  private config: ClientSearchConfig = {}
  private isInitialized = false

  constructor() {
    this.searchEngine = new FlexSearchEngine()
  }
  
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
    
    // Initialize search engine with loaded data
    this.searchEngine.initialize(this.indexData)
    
    this.isInitialized = true
    
    return { indexSize: this.indexData.length }
  }
  
  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    if (!this.isInitialized || !query.trim()) {
      return []
    }
    
    const searchOptions = {
      limit: options?.limit || this.config.limit || 10,
      offset: options?.offset || 0
    }
    
    try {
      // Use the shared FlexSearch engine
      return this.searchEngine.search(query, searchOptions)
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
      
      // Check if cache is still valid (1 hour)
      const maxAge = 60 * 60 * 1000 // 1 hour
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
          
          // Check cache validity (1 hour)
          const maxAge = 60 * 60 * 1000
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