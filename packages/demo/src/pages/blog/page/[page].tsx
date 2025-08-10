import type { SubRouteComponent, PageProps } from '@duct-ui/router'

export function getLayout(): string {
  return 'blog-listing.html'
}

export function getPageMeta(): Record<string, any> {
  return {
    title: 'Blog',
    description: 'Latest posts from the Duct UI blog',
    postsPerPage: 5
  }
}

// Generate static paths for all blog pages
export async function getRoutes(): Promise<Record<string, any>> {
  // For static generation, we can't access the actual content count here
  // since this runs before content is collected. 
  // In a real scenario, you might:
  // 1. Read the content directory directly here
  // 2. Or configure expected page count in duct.config.js
  // 3. Or generate pages dynamically on demand
  
  // For now, return empty since we only have 2 posts and they fit on page 1
  // With 5 posts per page, we'd need page 2 only when we have 6+ posts
  const routes: Record<string, any> = {}
  
  // Uncomment when you have more than 5 posts:
  // const postsPerPage = 5
  // const totalPosts = 2 // This would be calculated from actual content
  // const totalPages = Math.ceil(totalPosts / postsPerPage)
  // 
  // for (let page = 2; page <= totalPages; page++) {
  //   routes[`/blog/page/${page}`] = {
  //     title: `Blog - Page ${page}`,
  //     description: `Blog posts page ${page}`,
  //     currentPage: page,
  //     postsPerPage
  //   }
  // }
  
  return routes
}

// Paginated blog listing component
const BlogPageComponent: SubRouteComponent = ({ meta, path, env }: PageProps) => {
  // Extract page number from path
  const pageNum = parseInt(path.split('/').pop() || '1', 10)
  
  return <div id="blog-listing" data-page={pageNum}></div>
}

export default BlogPageComponent