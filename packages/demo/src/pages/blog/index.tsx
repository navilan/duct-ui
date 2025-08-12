import ThemeToggle from '@components/ThemeToggle'

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
  // Include ThemeToggle component for interactivity
  return <ThemeToggle />
}

export default BlogListingPage