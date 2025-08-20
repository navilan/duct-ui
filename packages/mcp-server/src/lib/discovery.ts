import path from 'path'
import { glob } from 'glob'
import type { ResourcePaths } from '../types.js'

/**
 * Discover all component files in the components directory
 */
export async function discoverComponents(resourcePaths: ResourcePaths): Promise<string[]> {
  try {
    const pattern = path.join(resourcePaths.components, '**/*.tsx')
    const files = await glob(pattern, {
      ignore: ['**/node_modules/**', '**/*.test.tsx', '**/*.spec.tsx']
    })
    return files.map(f => path.relative(resourcePaths.components, f))
  } catch (error) {
    console.error('Error discovering components:', error)
    return []
  }
}

/**
 * Discover all demo files in the demo directory
 */
export async function discoverDemoFiles(resourcePaths: ResourcePaths): Promise<string[]> {
  try {
    const pattern = path.join(resourcePaths.demo, '**/*.tsx')
    const files = await glob(pattern, {
      ignore: ['**/node_modules/**', '**/*.test.tsx', '**/*.spec.tsx']
    })
    return files.map(f => path.relative(resourcePaths.demo, f))
  } catch (error) {
    console.error('Error discovering demo files:', error)
    return []
  }
}

/**
 * Discover documentation files
 */
export async function discoverDocFiles(resourcePaths: ResourcePaths): Promise<string[]> {
  if (!resourcePaths.docs) {
    return []
  }
  
  try {
    const pattern = path.join(resourcePaths.docs, '**/*.md')
    const files = await glob(pattern, {
      ignore: ['**/node_modules/**']
    })
    return files.map(f => path.relative(resourcePaths.docs!, f))
  } catch (error) {
    console.error('Error discovering documentation files:', error)
    return []
  }
}