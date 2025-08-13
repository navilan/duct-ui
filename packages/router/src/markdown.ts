import * as fs from 'fs/promises'
import * as path from 'path'
import { glob } from 'glob'
import MarkdownIt from 'markdown-it'
import markdownItPrism from 'markdown-it-prism'
import markdownItAttrs from 'markdown-it-attrs'
import 'prismjs/components/prism-javascript.js'
import 'prismjs/components/prism-typescript.js'
import 'prismjs/components/prism-jsx.js'
import 'prismjs/components/prism-tsx.js'
import 'prismjs/components/prism-css.js'
import 'prismjs/components/prism-json.js'
import 'prismjs/components/prism-bash.js'
import type { ContentMeta, ContentConfig, ParsedContent, ContentFile } from './types.js'

// Default markdown-it instance for fallback parsing
const defaultMarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
})
  .use(markdownItPrism)
  .use(markdownItAttrs)

/**
 * Parse markdown to HTML using custom parser or default markdown-it
 */
export async function parseMarkdown(
  markdown: string,
  customParser?: (markdown: string) => string | Promise<string>
): Promise<string> {
  if (customParser) {
    try {
      return await customParser(markdown)
    } catch (error) {
      console.warn('Custom markdown parser failed, falling back to default:', error)
      // Fall back to default parser
    }
  }

  // Use default markdown-it parser
  return defaultMarkdownIt.render(markdown)
}

/**
 * Parse front-matter from markdown content and extract excerpt
 */
export async function parseFrontMatter(content: string, contentConfig?: ContentConfig): Promise<ParsedContent> {
  const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontMatterRegex)

  let frontMatter = ''
  let body = content

  if (match) {
    [, frontMatter, body] = match
  }

  const meta: ContentMeta = {}

  // Parse YAML-like front-matter (simple implementation)
  if (frontMatter) {
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
  }

  // Extract excerpt if marker is present
  let excerpt: string | undefined
  const excerptMarker = contentConfig?.excerptMarker || '<!--more-->'


  if (excerptMarker && body.includes(excerptMarker)) {
    const markerIndex = body.indexOf(excerptMarker)
    const excerptMarkdown = body.substring(0, markerIndex).trim()


    // Parse the markdown excerpt to HTML
    excerpt = await parseMarkdown(excerptMarkdown, contentConfig?.markdownParser)


    // If no excerpt is provided in meta, use the parsed excerpt
    if (!meta.excerpt) {
      meta.excerpt = excerpt
    } else {
    }
  }


  return { meta, body, excerpt }
}


/**
 * Scan a directory for markdown content files
 */
export async function scanContentDirectory(
  contentDir: string,
  baseRoute: string = '/',
  contentConfig?: ContentConfig
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
    const { meta, body, excerpt } = await parseFrontMatter(content, contentConfig)

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
      excerpt,
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