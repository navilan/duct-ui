export interface SearchInitializeResult {
  indexSize: number
}

export interface SearchProvider<TIndexConfig = unknown> {
  name: string
  initialize(config: SearchProviderConfig): Promise<SearchInitializeResult>
  
  // Search operations
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>
  
  // Index management (optional - for providers that manage their own index)
  index?(entries: SearchIndexEntry[], config?: TIndexConfig): Promise<void>
  updateIndex?(entries: SearchIndexEntry[], config?: TIndexConfig): Promise<void>
}

export interface SearchProviderConfig {
  [key: string]: any
}

export interface SearchOptions {
  limit?: number
  offset?: number
  threshold?: number // 0.0 (exact) to 1.0 (very fuzzy) - controls search sensitivity
  [key: string]: any
}

export interface SearchResult {
  url: string
  title: string
  excerpt: string
  score?: number
}

export interface SearchIndexEntry {
  url: string
  title: string
  description: string
  content: string
  tags: string[]
  keywords: string[]
}

