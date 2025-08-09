import type { DuctPageComponent, PageProps } from '@duct-ui/router'

export function getLayout(): string {
  return 'blog-listing.html'
}

export function getPageMeta(): Record<string, any> {
  return {
    title: 'Blog',
    description: 'Latest posts from the Duct UI blog',
    postsPerPage: 5, // Configure pagination
    noReanimation: true // Skip reanimation since content is entirely in template
  }
}

// Blog listing page component - content is entirely in the template
const BlogListingPage: DuctPageComponent = ({ meta, path, env }: PageProps) => {
  // Return empty since all content is handled by the blog-listing.html template
  return <></>
}

export default BlogListingPage