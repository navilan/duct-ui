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
export async function getRoutes(): Promise<Record<string, any>> {
  const routes: Record<string, any> = {}

  // Based on our current blog posts, we have these tags:
  // "welcome", "getting-started", "demo", "blog"
  // With only 2 posts total, we don't need pagination yet.
  // This will be useful when you have more posts per tag.
  
  // Uncomment and modify when you have more posts:
  // const knownTags = ['welcome', 'getting-started', 'demo', 'blog']
  // 
  // for (const tag of knownTags) {
  //   const slug = tag.toLowerCase().replace(/\s+/g, '-')
  //   
  //   // Only generate if we expect to have more than 5 posts for this tag
  //   const estimatedPostsForTag = 2 // Update based on actual content
  //   const postsPerPage = 5
  //   const totalPages = Math.ceil(estimatedPostsForTag / postsPerPage)
  //   
  //   for (let page = 2; page <= totalPages; page++) {
  //     routes[`/blog/tag/${slug}/page/${page}`] = {
  //       title: `Posts tagged "${tag}" - Page ${page} - Duct Starter`,
  //       description: `Blog posts tagged with ${tag}, page ${page}`,
  //       tag: tag,
  //       tagSlug: slug,
  //       currentPage: page,
  //       postsPerPage: 5
  //     }
  //   }
  // }
  
  return routes
}

// Paginated tag listing component with theme toggle
const TagPageComponent = () => {
  // Include ThemeToggle component for interactivity
  return <ThemeToggle />
}

export default TagPageComponent