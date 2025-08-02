## Route Types

### Static Routes

Static routes are created using:

- `index.tsx` - Maps to the directory path (e.g., `/about/index.tsx` → `/about`)
- **Named files** - Any `.tsx` file maps to its filename (e.g., `404.tsx` → `/404`, `contact.tsx` → `/contact`)

### Dynamic Routes

For dynamic routes, create a `[sub].tsx` file:

```typescript
// src/pages/blog/[sub].tsx
export function getLayout(): string {
  return 'shell.html'
}

export function getPageContext(): Record<string, any> {
  return {
    title: 'Blog Post',
    description: 'Read our latest blog post'
  }
}

// Generate static paths at build time
export async function getRoutes(): Promise<Record<string, any>> {
  const posts = await fetchBlogPosts() // Your data fetching logic

  const routes: Record<string, any> = {}
  for (const post of posts) {
    routes[`/blog/${post.slug}`] = {
      title: `${post.title} - My Blog`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        image: post.coverImage
      }
    }
  }

  return routes
}

// Page component that returns a Duct component
const BlogPostPage: DuctPageComponent = ({ meta, path, env }: PageProps) => {
  const slug = path.split('/').pop()
  const post = blogPosts.find(p => p.slug === slug)
  
  if (!post) {
    // Plain JSX - no client-side presence
    return <div>Post not found</div>
  }
  
  // BlogPost is a Duct component - will be interactive on client
  return <BlogPost post={post} />
}

export default BlogPostPage
```