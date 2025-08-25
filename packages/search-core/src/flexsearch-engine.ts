import { Document } from 'flexsearch'
import type { SearchIndexEntry, SearchResult } from './types.js'

// Extend SearchIndexEntry to work with FlexSearch Document
interface FlexSearchEntry extends SearchIndexEntry {
  [key: string]: any
}

export interface FlexSearchOptions {
  threshold?: number
}

/**
 * Shared FlexSearch engine for consistent search behavior across providers
 */
export class FlexSearchEngine {
  private searchIndex: Document<FlexSearchEntry, false> | null = null
  private indexEntries: Map<string, SearchIndexEntry> = new Map()
  private options: FlexSearchOptions

  constructor(options: FlexSearchOptions = {}) {
    this.options = {
      threshold: 0.3,
      ...options
    }
  }

  /**
   * Initialize the search index with entries
   */
  initialize(entries: SearchIndexEntry[]): void {
    // Create FlexSearch document index
    this.searchIndex = new Document({
      document: {
        id: 'url',
        index: [
          {
            field: 'title',
            tokenize: 'forward',
            resolution: 9
          },
          {
            field: 'description',
            tokenize: 'forward',
            resolution: 5
          },
          {
            field: 'content',
            tokenize: 'forward',
            resolution: 1
          },
          {
            field: 'tags',
            tokenize: 'full',
            resolution: 9
          }
        ]
      }
    })

    // Clear and populate entries
    this.indexEntries.clear()
    for (const entry of entries) {
      this.searchIndex.add(entry as FlexSearchEntry)
      this.indexEntries.set(entry.url, entry)
    }
  }

  /**
   * Search the index
   */
  search(query: string, options: { limit?: number; offset?: number } = {}): SearchResult[] {
    if (!this.searchIndex || !query.trim()) {
      return []
    }

    const { limit = 10, offset = 0 } = options

    try {
      // FlexSearch Document search with options object
      const searchResults = this.searchIndex.search(query, {
        limit: limit + offset,
        enrich: true
      })

      const results: SearchResult[] = []
      const processedUrls = new Set<string>()

      // FlexSearch returns array of { field: string, result: Array<{id, doc}> } when enrich: true
      for (const fieldResult of searchResults) {
        if (fieldResult.result && Array.isArray(fieldResult.result)) {
          for (const item of fieldResult.result) {
            const url = typeof item === 'string' ? item : (typeof item.id !== 'undefined' ? String(item.id) : String(item))
            if (processedUrls.has(url)) continue
            processedUrls.add(url)

            const entry = this.indexEntries.get(url)
            if (!entry) continue

            const score = this.calculateRelevanceScore(entry, query, fieldResult.field)
            results.push({
              url: entry.url,
              title: entry.title,
              excerpt: this.generateExcerpt(entry, query),
              score
            })
          }
        }
      }

      // Filter results by threshold if configured
      let filteredResults = results
      if (this.options.threshold && this.options.threshold > 0) {
        const maxScore = Math.max(...results.map(r => r.score || 0))
        const minScore = maxScore * this.options.threshold
        filteredResults = results.filter(r => (r.score || 0) >= minScore)
      }

      // Sort by relevance score (highest first)
      filteredResults.sort((a, b) => (b.score || 0) - (a.score || 0))

      return filteredResults.slice(offset, offset + limit)
    } catch (error) {
      console.error('FlexSearch error:', error)
      return []
    }
  }

  /**
   * Calculate relevance score based on field matches
   */
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

    // Boost based on matching field
    if (matchingField === 'title') score *= 2
    else if (matchingField === 'tags') score *= 1.5

    return score
  }

  /**
   * Generate excerpt from entry content
   */
  private generateExcerpt(entry: SearchIndexEntry, query: string, maxLength: number = 200): string {
    // Use description if available, otherwise generate from content
    if (entry.description.trim()) {
      return entry.description
    }

    const content = entry.content
    const queryIndex = content.toLowerCase().indexOf(query.toLowerCase())
    
    if (queryIndex === -1) {
      return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '')
    }

    // Find a good start position (word boundary before the match)
    const start = Math.max(0, queryIndex - 50)
    const wordBoundaryStart = content.lastIndexOf(' ', start) + 1
    const actualStart = wordBoundaryStart > 0 ? wordBoundaryStart : start

    // Find a good end position (word boundary after maxLength)
    const end = Math.min(content.length, actualStart + maxLength)
    const wordBoundaryEnd = content.indexOf(' ', end)
    const actualEnd = wordBoundaryEnd > 0 ? wordBoundaryEnd : end

    let excerpt = content.substring(actualStart, actualEnd)
    
    if (actualStart > 0) excerpt = '...' + excerpt
    if (actualEnd < content.length) excerpt = excerpt + '...'

    return excerpt
  }

  /**
   * Get the number of indexed entries
   */
  get size(): number {
    return this.indexEntries.size
  }

  /**
   * Clear the search index
   */
  clear(): void {
    this.searchIndex = null
    this.indexEntries.clear()
  }
}