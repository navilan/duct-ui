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

// Generate static paths for all tags found in blog posts
export async function getRoutes(content?: Map<string, ContentFile[]>): Promise<Record<string, any>> {
  const routes: Record<string, any> = {}

  if (content) {
    // Extract all unique tags from all content collections
    const allTags = new Set<string>()

    for (const [contentType, contentItems] of content) {
      for (const item of contentItems) {
        if (item.meta.tags && Array.isArray(item.meta.tags)) {
          for (const tag of item.meta.tags) {
            if (typeof tag === 'string' && tag.trim()) {
              allTags.add(tag.trim())
            }
          }
        }
      }
    }

    // Generate routes for each unique tag
    for (const tag of allTags) {
      const slug = tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      routes[`/blog/tag/${slug}`] = {
        title: `Posts tagged "${tag}" - Duct Starter`,
        description: `All blog posts tagged with ${tag}`,
        tag: tag,
        tagSlug: slug,
        postsPerPage: 5
      }
    }

    console.log(`Generated ${allTags.size} tag routes: ${Array.from(allTags).join(', ')}`)
  } else {
    console.warn('No content provided to getRoutes for tag generation')
  }

  return routes
}

// Tag listing page component with theme toggle
const TagListingPage = () => {
  // Include ThemeToggle component for interactivity
  return <ThemeToggle />
}

export default TagListingPage