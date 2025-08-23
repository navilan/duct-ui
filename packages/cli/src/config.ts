import * as path from 'path'
import * as fs from 'fs/promises'
import type { SearchConfig } from '@duct-ui/search-core'

export interface SitemapConfig {
  enabled: boolean
  baseUrl: string
  excludePaths?: string[]
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

/**
 * Deep merge two configuration objects
 */
function mergeConfig(base: DuctConfig, override: DuctConfig): Required<DuctConfig> {
  const result = { ...base } as Required<DuctConfig>
  
  // Merge top-level properties
  if (override.pagesDir) result.pagesDir = override.pagesDir
  if (override.layoutsDir) result.layoutsDir = override.layoutsDir
  if (override.contentDir) result.contentDir = override.contentDir
  
  // Deep merge env
  if (override.env) {
    result.env = { ...result.env, ...override.env }
  }
  
  // Deep merge nunjucks
  if (override.nunjucks) {
    result.nunjucks = {
      filters: { ...(result.nunjucks?.filters || {}), ...(override.nunjucks.filters || {}) },
      globals: { ...(result.nunjucks?.globals || {}), ...(override.nunjucks.globals || {}) },
      options: { ...(result.nunjucks?.options || {}), ...(override.nunjucks.options || {}) }
    }
  }
  
  // Deep merge content
  if (override.content) {
    result.content = {
      excerptMarker: override.content.excerptMarker || result.content?.excerptMarker || '<!--more-->',
      markdownParser: override.content.markdownParser || result.content?.markdownParser
    }
  }
  
  // Deep merge search
  if (override.search) {
    result.search = {
      enabled: override.search.enabled ?? result.search?.enabled ?? false,
      provider: override.search.provider || result.search?.provider,
      providerConfig: { ...(result.search?.providerConfig || {}), ...(override.search.providerConfig || {}) },
      generateIndex: override.search.generateIndex ?? result.search?.generateIndex ?? true,
      indexPath: override.search.indexPath || result.search?.indexPath || 'search-index.json',
      excludePaths: override.search.excludePaths || result.search?.excludePaths || [],
      includeContent: override.search.includeContent ?? result.search?.includeContent ?? true
    }
  }
  
  // Deep merge sitemap
  if (override.sitemap) {
    result.sitemap = {
      enabled: override.sitemap.enabled ?? result.sitemap?.enabled ?? false,
      baseUrl: override.sitemap.baseUrl || result.sitemap?.baseUrl || 'https://example.com',
      excludePaths: override.sitemap.excludePaths || result.sitemap?.excludePaths || [],
      changefreq: override.sitemap.changefreq || result.sitemap?.changefreq || 'weekly',
      priority: override.sitemap.priority ?? result.sitemap?.priority
    }
  }
  
  return result
}

export interface DuctConfig {
  contentDir?: string
  pagesDir?: string
  layoutsDir?: string
  env?: Record<string, any>
  nunjucks?: {
    filters?: Record<string, (...args: any[]) => any>
    globals?: Record<string, any>
    options?: {
      autoescape?: boolean
      trimBlocks?: boolean
      lstripBlocks?: boolean
      throwOnUndefined?: boolean
    }
  }
  content?: {
    /** Marker to indicate end of excerpt in markdown content. Default: <!--more--> */
    excerptMarker?: string
    /** Custom markdown parser function. Receives markdown string and should return HTML string */
    markdownParser?: (markdown: string) => string | Promise<string>
  }
  search?: SearchConfig
  sitemap?: SitemapConfig
}

const DEFAULT_CONFIG: DuctConfig = {
  pagesDir: 'src/pages',
  layoutsDir: 'src/layouts',
  contentDir: 'content',
  env: {},
  nunjucks: {
    filters: {},
    globals: {},
    options: {}
  },
  content: {
    excerptMarker: '<!--more-->',
    markdownParser: undefined // Will use default markdown parsing (just return raw markdown)
  },
  search: {
    enabled: false,
    provider: '@duct-ui/client-search-provider',
    providerConfig: {},
    generateIndex: true,
    indexPath: 'search-index.json',
    excludePaths: [],
    includeContent: true
  },
  sitemap: {
    enabled: false,
    baseUrl: 'https://example.com',
    excludePaths: [],
    changefreq: 'weekly'
  }
}

/**
 * Load Duct configuration from file or return defaults
 */
export async function loadConfig(cwd: string = process.cwd()): Promise<Required<DuctConfig>> {
  const configPaths = [
    path.join(cwd, 'duct.config.js'),
    path.join(cwd, 'duct.config.mjs'),
    path.join(cwd, 'duct.config.ts'),
    path.join(cwd, 'duct.config.json')
  ]

  // Find the first config file that exists
  let foundConfigPath: string | null = null
  for (const configPath of configPaths) {
    try {
      await fs.access(configPath)
      foundConfigPath = configPath
      break
    } catch {
      // Config file doesn't exist, continue checking
    }
  }

  // No config file found, return defaults
  if (!foundConfigPath) {
    return DEFAULT_CONFIG as Required<DuctConfig>
  }

  // Parse the found config file
  if (foundConfigPath.endsWith('.json')) {
    const content = await fs.readFile(foundConfigPath, 'utf-8')
    try {
      const config = JSON.parse(content)
      return mergeConfig(DEFAULT_CONFIG, config)
    } catch (error) {
      console.error(`Failed to parse JSON config at ${foundConfigPath}:`, error)
      return DEFAULT_CONFIG as Required<DuctConfig>
    }
  } else {
    // Dynamic import for JS/TS configs
    try {
      const module = await import(foundConfigPath)
      const config = module.default || module
      return mergeConfig(DEFAULT_CONFIG, config)
    } catch (error) {
      console.error(`Failed to import config at ${foundConfigPath}:`, error)
      return DEFAULT_CONFIG as Required<DuctConfig>
    }
  }
}

/**
 * Resolve paths relative to working directory
 */
export function resolveConfigPaths(config: Required<DuctConfig>, cwd: string = process.cwd()): Required<DuctConfig> {
  return {
    ...config,
    pagesDir: path.resolve(cwd, config.pagesDir),
    layoutsDir: path.resolve(cwd, config.layoutsDir),
    contentDir: path.resolve(cwd, config.contentDir)
  }
}