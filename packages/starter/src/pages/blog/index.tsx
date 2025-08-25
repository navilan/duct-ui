import ThemeToggle from '@components/ThemeToggle'
import SearchModalProvider from '@components/SearchModalProvider'

export function getLayout(): string {
  return 'blog-listing.html'
}

export function getPageMeta(): Record<string, any> {
  return {
    title: 'Blog - Duct Starter',
    description: 'Latest posts from the Duct Starter Template blog',
    postsPerPage: 5 // Configure pagination
  }
}

// Blog listing page component with theme toggle and search
const BlogListingPage = () => {
  return (
    <>
      <SearchModalProvider />
      <ThemeToggle />
    </>
  )
}

export default BlogListingPage