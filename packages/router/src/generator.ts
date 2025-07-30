import * as path from 'path'
import * as fs from 'fs/promises'
import { glob } from 'glob'
import type { Route, PageMeta } from './types.js'

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
    
    // Find all index.tsx and sub.tsx files
    const files = await glob('**/+(index|sub).tsx', {
      cwd: this.pagesDir,
      absolute: false
    })

    for (const file of files) {
      const parsed = path.parse(file)
      const routePath = this.fileToRoutePath(file)
      const componentPath = path.join(this.pagesDir, file)
      
      if (parsed.name === 'index') {
        // Static route
        routes.push({
          path: routePath,
          componentPath,
          isDynamic: false
        })
      } else if (parsed.name === 'sub') {
        // Dynamic route - we'll need to load the component to get routes
        // This will be handled by the CLI which can compile and load the component
        routes.push({
          path: routePath,
          componentPath,
          isDynamic: true,
          // staticPaths will be populated by the CLI after compilation
          staticPaths: undefined
        })
      }
    }

    return routes
  }

  /**
   * Convert file path to route path
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


}