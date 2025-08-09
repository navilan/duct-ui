import ThemeToggle from '../../../components/ThemeToggle'

export function getLayout(): string {
  return 'tag-listing.html'
}

export function getPageMeta(): Record<string, any> {
  return {
    title: 'Blog Posts by Tag',
    description: 'Browse blog posts by tag',
    postsPerPage: 5
  }
}

// Generate static paths for all tags found in blog posts
export async function getRoutes(): Promise<Record<string, any>> {
  // In a real implementation, this would scan the content directory
  // For now, let's extract tags from the existing blog posts
  const routes: Record<string, any> = {}

  // These would be dynamically extracted from all blog posts
  const knownTags = [
    'Tutorial', 'Duct', 'Getting Started',
    'Advanced', 'Architecture', 'Lifecycle'
  ]

  for (const tag of knownTags) {
    const slug = tag.toLowerCase().replace(/\s+/g, '-')
    routes[`/blog/tag/${slug}`] = {
      title: `Posts tagged "${tag}"`,
      description: `All blog posts tagged with ${tag}`,
      tag: tag,
      tagSlug: slug,
      postsPerPage: 5
    }
  }

  return routes
}

// Tag listing page component with theme toggle
const TagListingPage = () => {
  // Include ThemeToggle component for interactivity
  return <ThemeToggle />
}

export default TagListingPage