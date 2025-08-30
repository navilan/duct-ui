import type { SearchIndexEntry } from './types'

export interface IndexGeneratorOptions {
  baseUrl?: string
  includeContent?: boolean
  maxContentLength?: number
  excludePaths?: string[]
}

export interface PageData {
  url: string
  title: string
  description?: string
  content?: string
  tags?: string[]
  keywords?: string[]
}

/**
 * Generates search index entries from page data
 * Used by both client and server-side search providers
 */
export function generateSearchIndex(
  pages: PageData[],
  options: IndexGeneratorOptions = {}
): SearchIndexEntry[] {
  const {
    baseUrl = '',
    includeContent = true,
    maxContentLength = 5000,
    excludePaths = []
  } = options

  return pages
    .filter(page => {
      // Filter out excluded paths
      return !excludePaths.some(pattern => {
        const regex = new RegExp(pattern)
        return regex.test(page.url)
      })
    })
    .map(page => {
      const entry: SearchIndexEntry = {
        url: baseUrl + page.url,
        title: page.title || 'Untitled',
        description: page.description || '',
        content: includeContent 
          ? truncateContent(page.content || '', maxContentLength)
          : '',
        tags: page.tags || [],
        keywords: page.keywords || []
      }
      
      return entry
    })
}

function truncateContent(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content
  }
  
  // Try to truncate at a word boundary
  const truncated = content.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}

/**
 * Serializes search index for storage/transmission
 */
export function serializeSearchIndex(entries: SearchIndexEntry[]): string {
  return JSON.stringify(entries, null, 2)
}

/**
 * Deserializes search index from storage/transmission
 * Ensures all entries have proper structure with safe defaults
 */
export function deserializeSearchIndex(data: string): SearchIndexEntry[] {
  try {
    const parsed = JSON.parse(data)
    if (!Array.isArray(parsed)) {
      throw new Error('Invalid search index format')
    }
    
    // Validate and normalize each entry
    return parsed.map((entry: any): SearchIndexEntry => ({
      url: typeof entry.url === 'string' ? entry.url : '',
      title: typeof entry.title === 'string' ? entry.title : 'Untitled',
      description: typeof entry.description === 'string' ? entry.description : '',
      content: typeof entry.content === 'string' ? entry.content : '',
      tags: Array.isArray(entry.tags) ? entry.tags : [],
      keywords: Array.isArray(entry.keywords) ? entry.keywords : []
    })).filter(entry => entry.url) // Remove entries without valid URLs
  } catch (error) {
    console.error('Failed to deserialize search index:', error)
    return []
  }
}