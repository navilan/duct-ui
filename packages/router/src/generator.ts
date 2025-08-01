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


}