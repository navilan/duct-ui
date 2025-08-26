import ThemeToggle from '@components/ThemeToggle'
import SearchModalProvider from '@components/SearchModalProvider'

export function getLayout(): string {
  return 'blog-listing.html'
}

export function getPageMeta(): Record<string, any> {
  return {
    title: 'Blog',
    description: 'Latest posts from the Duct UI blog',
    postsPerPage: 5 // Configure pagination
  }
}

// Blog listing page component with theme toggle
const BlogListingPage = () => {
  // Include ThemeToggle and SearchModalProvider components for interactivity
  return (
    <>
      <SearchModalProvider />
      <ThemeToggle />
    </>
  )
}

export default BlogListingPage