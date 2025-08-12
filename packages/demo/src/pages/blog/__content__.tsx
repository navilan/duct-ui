import type { PageProps, ContentMeta } from '@duct-ui/router'
import ThemeToggle from '@components/ThemeToggle'

/**
 * Blog post content page component
 * This component only handles interactive elements.
 * The static markdown content is handled by the post.html layout.
 */
const BlogPost = ({ meta }: PageProps) => {
  // Only render interactive components for the #app container
  return <ThemeToggle />
}

// Use the post layout for blog articles
export function getLayout(): string {
  return 'post.html'
}

// Base metadata - will be overridden by front-matter
export function getPageMeta(): ContentMeta {
  return {
    title: 'Blog Post',
    description: 'A blog post on Duct UI'
  }
}

// Configure content directory (relative to project root)
export function getContentDir(): string {
  return 'content/blog'
}

// Filter out draft posts in production
export function filterContent(meta: ContentMeta, path: string): boolean {
  // In production, exclude drafts
  if (process.env.NODE_ENV === 'production' && meta.draft) {
    return false
  }
  return true
}

// Transform metadata to add computed fields
export function transformMeta(meta: ContentMeta, path: string): ContentMeta {
  // Calculate reading time (rough estimate: 200 words per minute)
  if (meta.content) {
    const wordCount = meta.content.split(/\s+/).length
    meta.readingTime = Math.ceil(wordCount / 200)
  }

  // Add slug from path
  meta.slug = path.split('/').pop() || ''

  // Add GitHub edit URL if repository is configured
  if (meta.repository) {
    meta.githubUrl = `${meta.repository}/edit/main/content/blog/${meta.slug}.md`
  }

  return meta
}

// Sort posts by date (newest first)
export function sortContent<T extends { meta: ContentMeta; path: string }>(items: T[]): T[] {
  return items.sort((a, b) => {
    const dateA = a.meta.date ? new Date(a.meta.date).getTime() : 0
    const dateB = b.meta.date ? new Date(b.meta.date).getTime() : 0
    return dateB - dateA // Newest first
  })
}

export default BlogPost