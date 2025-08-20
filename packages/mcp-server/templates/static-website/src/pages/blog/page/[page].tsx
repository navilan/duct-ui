import type { PageProps } from '@duct-ui/router'
import ThemeToggle from '@components/ThemeToggle'

export function getLayout(): string {
  return 'blog-listing.html'
}

export function getPageMeta(): Record<string, any> {
  return {
    title: 'Blog - Duct Starter',
    description: 'Latest posts from the Duct Starter Template blog',
    postsPerPage: 5
  }
}

// Generate static paths for all blog pages
export async function getRoutes(): Promise<Record<string, any>> {
  // For static generation, we can't access the actual content count here
  // since this runs before content is collected.
  // With only 2 posts and 5 posts per page, we don't need pagination yet.
  // This will be useful when you have more than 5 posts.

  const routes: Record<string, any> = {}

  // Uncomment when you have more than 5 posts:
  // const postsPerPage = 5
  // const totalPosts = 2 // This would be calculated from actual content
  // const totalPages = Math.ceil(totalPosts / postsPerPage)
  //
  // for (let page = 2; page <= totalPages; page++) {
  //   routes[`/blog/page/${page}`] = {
  //     title: `Blog - Page ${page} - Duct Starter`,
  //     description: `Blog posts page ${page}`,
  //     currentPage: page,
  //     postsPerPage
  //   }
  // }

  return routes
}

// Paginated blog listing component
const BlogPageComponent = ({ meta, path, env }: PageProps) => {
  // Extract page number from path
  const pageNum = parseInt(path.split('/').pop() || '1', 10)

  return (
    <>
      <ThemeToggle />
      <div id="blog-listing" data-page={pageNum}></div>
    </>
  )
}

export default BlogPageComponent