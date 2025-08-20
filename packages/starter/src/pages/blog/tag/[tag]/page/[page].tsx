import type { ContentFile } from '@duct-ui/router'
import ThemeToggle from '@components/ThemeToggle'

export function getLayout(): string {
  return 'tag-listing.html'
}

export function getPageMeta(): Record<string, any> {
  return {
    title: 'Blog Posts by Tag - Duct Starter',
    description: 'Browse blog posts by tag',
    postsPerPage: 5
  }
}

// Generate static paths for paginated tag pages
export async function getRoutes(content?: Map<string, ContentFile[]>): Promise<Record<string, any>> {
  const routes: Record<string, any> = {}

  if (!content) {
    return routes
  }

  // Count posts per tag
  const tagCounts = new Map<string, number>()
  const tagNames = new Map<string, string>() // slug -> original tag name

  for (const [, contentItems] of content) {
    for (const item of contentItems) {
      if (item.meta.tags && Array.isArray(item.meta.tags)) {
        for (const tag of item.meta.tags) {
          if (typeof tag === 'string' && tag.trim()) {
            const trimmedTag = tag.trim()
            const slug = trimmedTag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
            
            // Store original tag name for display
            tagNames.set(slug, trimmedTag)
            
            // Count posts for this tag
            const currentCount = tagCounts.get(slug) || 0
            tagCounts.set(slug, currentCount + 1)
          }
        }
      }
    }
  }

  // Generate paginated routes for tags with more than 5 posts
  const postsPerPage = 5
  
  for (const [slug, count] of tagCounts) {
    const totalPages = Math.ceil(count / postsPerPage)
    const originalTag = tagNames.get(slug) || slug
    
    // Only generate page 2+ routes (page 1 is handled by [tag].tsx)
    for (let page = 2; page <= totalPages; page++) {
      routes[`/blog/tag/${slug}/page/${page}`] = {
        title: `Posts tagged "${originalTag}" - Page ${page} - Duct Starter`,
        description: `Blog posts tagged with ${originalTag}, page ${page}`,
        tag: originalTag,
        tagSlug: slug,
        currentPage: page,
        postsPerPage: 5
      }
    }
  }

  console.log(`Generated paginated routes for ${tagCounts.size} tags`)

  return routes
}

// Paginated tag listing component with theme toggle
const TagPageComponent = () => {
  // Include ThemeToggle component for interactivity
  return <ThemeToggle />
}

export default TagPageComponent