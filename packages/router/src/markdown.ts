import * as fs from 'fs/promises'
import * as path from 'path'
import { glob } from 'glob'
import type { ContentMeta } from './types.js'

/**
 * Parse front-matter from markdown content
 */
export function parseFrontMatter(content: string): { meta: ContentMeta; body: string } {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontMatterRegex)

  if (!match) {
    return {
      meta: {},
      body: content
    }
  }

  const [, frontMatter, body] = match
  const meta: ContentMeta = {}

  // Parse YAML-like front-matter (simple implementation)
  const lines = frontMatter.split('\n')
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()

    // Handle basic types
    if (value.startsWith('[') && value.endsWith(']')) {
      // Array
      meta[key] = value
        .slice(1, -1)
        .split(',')
        .map(item => item.trim().replace(/^["']|["']$/g, ''))
    } else if (value === 'true' || value === 'false') {
      // Boolean
      meta[key] = value === 'true'
    } else if (!isNaN(Number(value)) && value !== '') {
      // Number
      meta[key] = Number(value)
    } else {
      // String (remove quotes if present)
      meta[key] = value.replace(/^["']|["']$/g, '')
    }
  }

  return { meta, body }
}

/**
 * Content file information
 */
export interface ContentFile {
  /** Relative path from content directory */
  relativePath: string
  /** URL path for the content */
  urlPath: string
  /** Parsed metadata from front-matter */
  meta: ContentMeta
  /** Markdown body content */
  body: string
  /** Full file path */
  filePath: string
}

/**
 * Scan a directory for markdown content files
 */
export async function scanContentDirectory(
  contentDir: string,
  baseRoute: string = '/'
): Promise<ContentFile[]> {
  const files: ContentFile[] = []

  // Find all markdown files
  const mdFiles = await glob('**/*.{md,mdx}', {
    cwd: contentDir,
    absolute: false
  })

  for (const mdFile of mdFiles) {
    const filePath = path.join(contentDir, mdFile)
    const content = await fs.readFile(filePath, 'utf-8')
    const { meta, body } = parseFrontMatter(content)

    // Generate URL path from file path
    const parsed = path.parse(mdFile)
    let urlPath: string

    if (parsed.name === 'index') {
      // index.md maps to directory path
      urlPath = parsed.dir === '.' ? baseRoute : path.join(baseRoute, parsed.dir)
    } else {
      // other.md maps to other/
      urlPath = path.join(baseRoute, parsed.dir, parsed.name)
    }

    // Ensure proper URL formatting
    if (!urlPath.startsWith('/')) {
      urlPath = '/' + urlPath
    }
    urlPath = urlPath.replace(/\\/g, '/') // Windows path fix

    files.push({
      relativePath: mdFile,
      urlPath,
      meta,
      body,
      filePath
    })
  }

  return files
}

/**
 * Generate slug from string (for URL-safe paths)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word chars
    .replace(/\s+/g, '-')      // Replace spaces with -
    .replace(/--+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')        // Trim - from start
    .replace(/-+$/, '')        // Trim - from end
}