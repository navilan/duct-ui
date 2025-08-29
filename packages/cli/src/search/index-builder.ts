import * as path from 'path'
import * as fs from 'fs/promises'
import type { SearchIndexEntry } from '@duct-ui/search-core'
import type { ContentFile } from '@duct-ui/router'
import { stripHtml, normalizeText } from '@duct-ui/search-core'
import * as logger from '../logger.js'

export interface IndexBuilderOptions {
  excludePaths?: string[]
  includeContent?: boolean
  indexPath?: string
}

export class IndexBuilder {
  constructor(
    private outDir: string,
    private options: IndexBuilderOptions = {}
  ) {}

  async build(pages: Array<{ path: string; html: string; componentPath: string }>, allContent: Map<string, ContentFile[]>): Promise<void> {
    logger.info('Building search index...')
    
    const entries: SearchIndexEntry[] = []
    
    // Process HTML pages
    for (const page of pages) {
      if (this.shouldExcludePath(page.path)) {
        logger.debug(`Skipping excluded path: ${page.path}`)
        continue
      }
      
      const entry = await this.processHtmlPage(page)
      if (entry) {
        entries.push(entry)
        logger.debug(`Indexed page: ${page.path}`)
      }
    }
    
    // Process markdown content if available
    if (this.options.includeContent !== false) {
      for (const [contentType, contentFiles] of allContent) {
        for (const contentFile of contentFiles) {
          const entry = this.processMarkdownContent(contentFile, contentType)
          if (entry) {
            entries.push(entry)
            logger.debug(`Indexed content: ${contentFile.urlPath}`)
          }
        }
      }
    }
    
    // Write index file
    const indexPath = this.options.indexPath || 'search-index.json'
    const outputPath = path.join(this.outDir, indexPath)
    
    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, JSON.stringify(entries, null, 2))
    
    logger.success(`Generated search index: ${entries.length} entries -> ${outputPath}`)
  }

  private shouldExcludePath(path: string): boolean {
    const excludePaths = this.options.excludePaths || []
    return excludePaths.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'))
        return regex.test(path)
      }
      return path.startsWith(pattern)
    })
  }

  private async processHtmlPage(page: { path: string; html: string; componentPath: string }): Promise<SearchIndexEntry | null> {
    try {
      const content = this.extractMainContent(page.html)
      const title = this.extractTitle(page.html)
      const description = this.extractDescription(page.html)
      
      if (!content.trim()) {
        logger.warn(`No content extracted from ${page.path}`)
        return null
      }
      
      return {
        url: page.path,
        title: title || this.generateTitleFromPath(page.path),
        description: description || '',
        content: normalizeText(content),
        tags: [],
        keywords: this.extractKeywords(content, title, description)
      }
    } catch (error) {
      logger.error(`Failed to process HTML page ${page.path}:`, error)
      return null
    }
  }

  private processMarkdownContent(contentFile: ContentFile, contentType: string): SearchIndexEntry | null {
    try {
      // For markdown content, we have structured metadata
      const title = contentFile.meta.title || this.generateTitleFromPath(contentFile.urlPath)
      const description = contentFile.excerpt || contentFile.meta.description || ''
      const content = contentFile.body || ''
      const tags = contentFile.meta.tags || []
      
      return {
        url: contentFile.urlPath,
        title,
        description,
        content: normalizeText(stripHtml(content)), // Content might have HTML from markdown processing
        tags,
        keywords: this.extractKeywords(content, title, description)
      }
    } catch (error) {
      logger.error(`Failed to process markdown content ${contentFile.urlPath}:`, error)
      return null
    }
  }

  private extractMainContent(html: string): string {
    // Try to extract content from semantic HTML elements in order of preference
    const contentSelectors = [
      'article',
      'main', 
      '[role="main"]',
      '.content',
      '#content',
      'body'
    ]
    
    for (const selector of contentSelectors) {
      const content = this.extractBySelector(html, selector)
      if (content.trim()) {
        return this.cleanContent(content)
      }
    }
    
    // Fallback: strip all HTML and return body content
    return this.cleanContent(stripHtml(html))
  }

  private extractBySelector(html: string, selector: string): string {
    // Simple regex-based extraction for semantic elements
    // This is a simplified approach - for production, consider using a proper HTML parser
    
    let pattern: RegExp
    
    if (selector === 'article') {
      pattern = /<article[^>]*>([\s\S]*?)<\/article>/i
    } else if (selector === 'main') {
      pattern = /<main[^>]*>([\s\S]*?)<\/main>/i
    } else if (selector === '[role="main"]') {
      pattern = /<[^>]*role=["']main["'][^>]*>([\s\S]*?)<\/[^>]+>/i
    } else if (selector === '.content') {
      pattern = /<[^>]*class=["'][^"']*content[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/i
    } else if (selector === '#content') {
      pattern = /<[^>]*id=["']content["'][^>]*>([\s\S]*?)<\/[^>]+>/i
    } else if (selector === 'body') {
      pattern = /<body[^>]*>([\s\S]*?)<\/body>/i
    } else {
      return ''
    }
    
    const match = html.match(pattern)
    return match ? match[1] : ''
  }

  private cleanContent(content: string): string {
    return stripHtml(content)
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\n{3,}/g, '\n\n') // Limit consecutive newlines
      .trim()
  }

  private extractTitle(html: string): string {
    // Try to extract title from various sources
    const titleSources = [
      /<title[^>]*>([^<]+)<\/title>/i,
      /<h1[^>]*>([^<]+)<\/h1>/i,
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*name=["']title["'][^>]*content=["']([^"']+)["']/i
    ]
    
    for (const pattern of titleSources) {
      const match = html.match(pattern)
      if (match) {
        return stripHtml(match[1]).trim()
      }
    }
    
    return ''
  }

  private extractDescription(html: string): string {
    // Try to extract description from meta tags
    const descriptionPatterns = [
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i,
      /<meta[^>]*name=["']twitter:description["'][^>]*content=["']([^"']+)["']/i
    ]
    
    for (const pattern of descriptionPatterns) {
      const match = html.match(pattern)
      if (match) {
        return stripHtml(match[1]).trim()
      }
    }
    
    return ''
  }

  private generateTitleFromPath(path: string): string {
    // Convert path to readable title
    // /blog/my-post-title -> My Post Title
    // /docs/getting-started -> Getting Started
    const segments = path.split('/').filter(Boolean)
    if (segments.length === 0) return 'Home'
    
    const lastSegment = segments[segments.length - 1]
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  private extractKeywords(content: string, title: string, description: string): string[] {
    // Simple keyword extraction - combine title and description words
    const text = `${title} ${description}`.toLowerCase()
    const words = text.split(/\W+/).filter(word => word.length > 2)
    
    // Remove common stop words
    const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'use', 'man', 'new', 'now', 'way', 'may', 'say'])
    
    return [...new Set(words.filter(word => !stopWords.has(word)))]
  }
}