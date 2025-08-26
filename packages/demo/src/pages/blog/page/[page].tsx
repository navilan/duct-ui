import type { PageProps, ContentFile } from '@duct-ui/router'
import ThemeToggle from '@components/ThemeToggle'
import SearchModalProvider from '@components/SearchModalProvider'

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
export async function getRoutes(content?: Map<string, ContentFile[]>): Promise<Record<string, any>> {
  const routes: Record<string, any> = {}

  if (!content) {
    return routes
  }

  const blogPosts = content.get('blog') || []
  const postsPerPage = 5
  const totalPosts = blogPosts.length
  const totalPages = Math.ceil(totalPosts / postsPerPage)

  // Generate routes for pages 2 and beyond (page 1 is handled by the main blog route)
  for (let page = 2; page <= totalPages; page++) {
    routes[`/blog/page/${page}`] = {
      title: `Blog - Page ${page}`,
      description: `Blog posts page ${page}`,
      currentPage: page,
      postsPerPage
    }
  }

  return routes
}

// Paginated blog listing component
const BlogPageComponent = ({ meta, path, env }: PageProps) => {
  // Extract page number from path
  const pageNum = parseInt(path.split('/').pop() || '1', 10)

  return (
    <>
      <SearchModalProvider />
      <ThemeToggle />
      <div id="blog-listing" data-page={pageNum}></div>
    </>
  )
}

export default BlogPageComponent