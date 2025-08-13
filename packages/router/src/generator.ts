import * as path from 'path'
import * as fs from 'fs/promises'
import { glob } from 'glob'
import type { Route, PageMeta, ContentMeta, ContentConfig, ContentFile } from './types.js'
import { scanContentDirectory } from './markdown.js'

/**
 * Find assets (images, etc.) recursively in a directory
 */
export async function findAssets(dir: string, extensions: string[]): Promise<string[]> {
  const results: string[] = []

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        const subAssets = await findAssets(fullPath, extensions)
        results.push(...subAssets)
      } else if (extensions.some(ext => entry.name.toLowerCase().endsWith(ext))) {
        results.push(fullPath)
      }
    }
  } catch (error) {
    // Directory might not exist, return empty array
  }

  return results
}

/**
 * Route generator for discovering and processing file-based routes
 */
export class RouteGenerator {
  private pagesDir: string

  constructor(pagesDir: string) {
    this.pagesDir = pagesDir
  }

  /**
   * Discover all routes from the pages directory
   */
  async discoverRoutes(): Promise<Route[]> {
    const routes: Route[] = []

    // Find all .tsx files
    const files = await glob('**/*.tsx', {
      cwd: this.pagesDir,
      absolute: false
    })

    for (const file of files) {
      const parsed = path.parse(file)
      const routePath = this.fileToRoutePath(file)
      const componentPath = path.join(this.pagesDir, file)

      if (parsed.name === 'index') {
        // Static index route - maps to directory path
        routes.push({
          path: routePath,
          componentPath,
          isDynamic: false
        })
      } else if (parsed.name === '__content__') {
        // Content page - generates routes from markdown files
        routes.push({
          path: routePath,
          componentPath,
          isDynamic: true,
          isContentPage: true,
          // staticPaths will be populated by scanning content directory
          staticPaths: undefined
        })
      } else if (parsed.name.startsWith('[') && parsed.name.endsWith(']')) {
        // Dynamic route with bracket syntax [sub].tsx
        // Dynamic route - we'll need to load the component to get routes
        // This will be handled by the CLI which can compile and load the component
        routes.push({
          path: routePath,
          componentPath,
          isDynamic: true,
          // staticPaths will be populated by the CLI after compilation
          staticPaths: undefined
        })
      } else {
        // Static named route - maps to filename
        const namedRoutePath = this.fileToNamedRoutePath(file)
        routes.push({
          path: namedRoutePath,
          componentPath,
          isDynamic: false
        })
      }
    }

    return routes
  }

  /**
   * Convert file path to route path (for index.tsx and [sub].tsx files)
   */
  private fileToRoutePath(filePath: string): string {
    // Remove the filename
    const dir = path.dirname(filePath)

    // Convert to route path
    if (dir === '.') {
      return '/'
    }

    // Ensure leading slash
    return '/' + dir
  }

  /**
   * Convert file path to named route path (for specific .tsx files like 404.tsx)
   */
  private fileToNamedRoutePath(filePath: string): string {
    const parsed = path.parse(filePath)
    const dir = path.dirname(filePath)

    // If it's in root directory
    if (dir === '.') {
      return '/' + parsed.name
    }

    // If it's in a subdirectory
    return '/' + dir + '/' + parsed.name
  }

  /**
   * Populate content routes by scanning content directory
   */
  async populateContentRoutes(
    route: Route,
    contentDir: string = 'content',
    projectRoot: string = process.cwd(),
    contentConfig?: ContentConfig
  ): Promise<void> {
    if (!route.isContentPage) return

    // Determine the content directory path
    const fullContentDir = path.isAbsolute(contentDir)
      ? contentDir
      : path.join(projectRoot, contentDir)

    console.debug(`    Scanning content directory: ${fullContentDir}`)

    // Check if content directory exists
    try {
      await fs.access(fullContentDir)
    } catch {
      // Content directory doesn't exist, no content to generate
      console.warn(`    Content directory ${fullContentDir} does not exist`)
      route.staticPaths = {}
      route.contentFiles = []
      return
    }

    // Scan for markdown files
    const contentFiles = await scanContentDirectory(fullContentDir, route.path, contentConfig)
    console.info(`    Found ${contentFiles.length} markdown files`)

    // Convert to route format
    const staticPaths: Record<string, ContentMeta> = {}
    const files: Array<ContentFile> = []

    for (const file of contentFiles) {
      console.debug(`    Processing: ${file.relativePath} -> ${file.urlPath}`)

      // Skip drafts unless in development
      if (file.meta.draft && process.env.NODE_ENV === 'production') {
        console.debug(`    Skipping draft: ${file.relativePath}`)
        continue
      }

      staticPaths[file.urlPath] = file.meta
      files.push(file)
    }

    console.info(`    Generated ${Object.keys(staticPaths).length} static paths`)
    route.staticPaths = staticPaths
    route.contentFiles = files
  }
}