import * as path from 'path'
import * as fs from 'fs/promises'

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
  }
}

const DEFAULT_CONFIG: DuctConfig = {
  pagesDir: 'src/pages',
  layoutsDir: 'src/layouts',
  contentDir: 'content',
  env: {},
  content: {
    excerptMarker: '<!--more-->'
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

  for (const configPath of configPaths) {
    try {
      await fs.access(configPath)

      if (configPath.endsWith('.json')) {
        const content = await fs.readFile(configPath, 'utf-8')
        const config = JSON.parse(content)
        return { ...DEFAULT_CONFIG, ...config }
      } else {
        // Dynamic import for JS/TS configs
        const module = await import(configPath)
        const config = module.default || module
        return { ...DEFAULT_CONFIG, ...config }
      }
    } catch {
      // Config file doesn't exist, continue checking
    }
  }

  // No config file found, return defaults
  return DEFAULT_CONFIG as Required<DuctConfig>
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