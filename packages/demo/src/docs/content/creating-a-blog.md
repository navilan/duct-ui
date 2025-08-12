# Creating a Blog with Duct

Duct's static site generation (SSG) makes it easy to create content-driven websites like blogs. This guide walks you through setting up a complete blog with markdown content, automatic asset management, tagging, and pagination.

> **💡 Quick Start with Starter Template**
>
> Want to get started faster? The [Duct Starter Template](https://github.com/navilan/duct-ui/tree/main/packages/starter) includes a complete blog implementation with:
> - Pre-configured blog pages and layouts
> - Sample blog posts with tagging
> - Responsive design with DaisyUI themes
> - Full-height layouts with proper footer placement
> - Theme toggle functionality
> 
> Copy the `packages/starter` directory as your starting point and customize from there! The implementation follows all the patterns described in this guide.

## Prerequisites

- A Duct UI project set up with the CLI
- Basic understanding of markdown and front-matter
- Familiarity with Nunjucks templating

## Project Structure

A typical blog setup in Duct follows this structure:

```plaintext
my-blog/
├── src/
│   ├── pages/
│   │   └── blog/
│   │       ├── index.tsx           # Blog listing page
│   │       ├── __content__.tsx     # Individual post pages
│   │       └── tag/
│   │           └── [tag].tsx       # Tag-based filtering
│   └── layouts/
│       ├── blog-listing.html       # Blog index template
│       ├── post.html              # Individual post template
│       └── tag-listing.html       # Tag page template
├── content/
│   └── blog/
│       └── 2025/
│           └── 01/
│               ├── my-first-post.md
│               └── assets/
│                   └── hero-image.jpg
└── duct.config.js
```

## Step 1: Configure Duct for Content

First, update your `duct.config.js` to enable content management:

```javascript
export default {
  pagesDir: 'src/pages',
  layoutsDir: 'src/layouts',
  contentDir: 'content',          // Where your markdown files live

  // Content-specific configuration
  content: {
    excerptMarker: '<!--more-->'   // Marker for post excerpts
  },

  nunjucks: {
    filters: {
      // Date formatting
      date(dateString, format = 'MMMM D, YYYY') {
        if (!dateString) return ''
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return dateString

        const options = {
          year: 'numeric',
          month: format.includes('MMM') ? 'short' : 'long',
          day: 'numeric'
        }
        return date.toLocaleDateString('en-US', options)
      },

      // URL-friendly slugs
      slug(text) {
        return text?.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .replace(/^-+|-+$/g, '') || ''
      }
    }
  }
}
```

## Step 2: Create Content Pages Component

Create `src/pages/blog/__content__.tsx` to handle individual blog posts:

```tsx
import ThemeToggle from '../../components/ThemeToggle'

export function getLayout(): string {
  return 'post.html'
}

export function getPageMeta(): Record<string, any> {
  return {
    title: 'Blog Post',
    description: 'Read our latest blog post'
  }
}

// This component handles individual blog post pages
const BlogPostPage = () => {
  // Include interactive components if needed
  return <ThemeToggle />
}

export default BlogPostPage
```

## Step 3: Create Blog Listing Component

Create `src/pages/blog/index.tsx` for the main blog listing:

```tsx
import ThemeToggle from '../../components/ThemeToggle'

export function getLayout(): string {
  return 'blog-listing.html'
}

export function getPageMeta(): Record<string, any> {
  return {
    title: 'Blog',
    description: 'Latest posts from our blog',
    postsPerPage: 10
  }
}

const BlogIndexPage = () => {
  return <ThemeToggle />
}

export default BlogIndexPage
```

## Step 4: Create Tag Filtering Component

Create `src/pages/blog/tag/[tag].tsx` for tag-based filtering:

```tsx
import type { ContentItem } from '@duct-ui/router'
import ThemeToggle from '../../../components/ThemeToggle'

export function getLayout(): string {
  return 'tag-listing.html'
}

export function getPageMeta(): Record<string, any> {
  return {
    title: 'Blog Posts by Tag',
    description: 'Browse blog posts by tag',
    postsPerPage: 10
  }
}

// Generate static paths for all tags found in blog posts
export async function getRoutes(content?: Map<string, ContentItem[]>): Promise<Record<string, any>> {
  const routes: Record<string, any> = {}

  if (content) {
    // Extract all unique tags from content
    const allTags = new Set<string>()

    for (const [contentType, contentItems] of content) {
      for (const item of contentItems) {
        if (item.meta.tags && Array.isArray(item.meta.tags)) {
          for (const tag of item.meta.tags) {
            if (typeof tag === 'string' && tag.trim()) {
              allTags.add(tag.trim())
            }
          }
        }
      }
    }

    // Generate routes for each unique tag
    for (const tag of allTags) {
      const slug = tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      routes[`/blog/tag/${slug}`] = {
        title: `Posts tagged "${tag}"`,
        description: `All blog posts tagged with ${tag}`,
        tag: tag,
        tagSlug: slug,
        postsPerPage: 10
      }
    }
  }

  return routes
}

const TagListingPage = () => {
  return <ThemeToggle />
}

export default TagListingPage
```

## Step 5: Create Reusable Listing Macro

Create `src/layouts/_macros.html` for reusable blog listing functionality:

```html
{#
  Reusable listing macro for blog posts with pagination
#}
{% macro listing(posts, page, baseUrl, breadcrumbs=null, emptyMessage="No blog posts found.") %}
  <header class="mb-12">
    {% if breadcrumbs %}
    <div class="breadcrumbs text-sm mb-4">
      <ul>
        {% for crumb in breadcrumbs %}
        {% if crumb.url %}
        <li><a href="{{ crumb.url }}" class="link link-hover">{{ crumb.text }}</a></li>
        {% else %}
        <li>{{ crumb.text }}</li>
        {% endif %}
        {% endfor %}
      </ul>
    </div>
    {% endif %}

    <h1 class="text-5xl font-bold mb-4">{{ page.title }}</h1>
    <p class="text-xl text-base-content/70">{{ page.description }}</p>
  </header>

  <div class="grid gap-8">
    {% set postsPerPage = page.postsPerPage or 10 %}
    {% set currentPage = page.currentPage or 1 %}

    <!-- Sort posts by date (newest first) -->
    {% set sortedPosts = posts | sort(attribute='meta.date', reverse=true) %}
    {% set totalPosts = sortedPosts | length %}
    {% set totalPages = (totalPosts / postsPerPage) | round(0, 'ceil') %}
    {% set startIndex = (currentPage - 1) * postsPerPage %}
    {% set endIndex = startIndex + postsPerPage %}

    <!-- Paginate posts -->
    {% set pagePosts = [] %}
    {% for post in sortedPosts %}
      {% if loop.index0 >= startIndex and loop.index0 < endIndex %}
        {% set _ = pagePosts.push(post) %}
      {% endif %}
    {% endfor %}

    {% for post in pagePosts %}
      {% include "_blog_listing_item.html" %}
    {% endfor %}

    {% if totalPosts == 0 %}
    <div class="text-center py-12">
      <p class="text-xl text-base-content/60">{{ emptyMessage }}</p>
      {% if baseUrl != '/blog' %}
      <a href="/blog" class="btn btn-primary mt-4">Browse All Posts</a>
      {% endif %}
    </div>
    {% endif %}
  </div>

  <!-- Pagination -->
  {% if totalPages > 1 %}
  <nav class="flex justify-center mt-12">
    <div class="btn-group">
      {% if currentPage > 1 %}
      <a href="{{ baseUrl }}{% if currentPage > 2 %}/page/{{ currentPage - 1 }}{% endif %}" class="btn">
        « Previous
      </a>
      {% endif %}

      {% for pageNum in range(1, totalPages + 1) %}
        {% if pageNum == currentPage %}
        <button class="btn btn-active">{{ pageNum }}</button>
        {% else %}
        <a href="{{ baseUrl }}{% if pageNum > 1 %}/page/{{ pageNum }}{% endif %}" class="btn">
          {{ pageNum }}
        </a>
        {% endif %}
      {% endfor %}

      {% if currentPage < totalPages %}
      <a href="{{ baseUrl }}/page/{{ currentPage + 1 }}" class="btn">
        Next »
      </a>
      {% endif %}
    </div>
  </nav>
  {% endif %}

  <footer class="mt-12 pt-8 border-t border-base-300">
    <div class="text-center text-sm text-base-content/60">
      {% if totalPosts > 0 %}
      {% set actualEnd = endIndex %}
      {% if actualEnd > totalPosts %}
        {% set actualEnd = totalPosts %}
      {% endif %}
      Showing posts {{ startIndex + 1 }}-{{ actualEnd }} of {{ totalPosts }} total posts
      {% endif %}
    </div>

    {% if baseUrl != '/blog' %}
    <div class="text-center mt-4">
      <a href="/blog" class="btn btn-outline btn-sm">← Back to All Posts</a>
    </div>
    {% endif %}
  </footer>
{% endmacro %}
```

## Step 6: Create Blog Listing Item Template

Create `src/layouts/_blog_listing_item.html` for individual post cards:

```html
<article class="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
  <div class="card-body">
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Post Thumbnail (if image provided) -->
      {% if post.meta.image %}
      <div class="md:w-1/3 lg:w-1/4 flex-shrink-0">
        <figure class="overflow-hidden rounded-lg">
          <a href="{{ post.path }}" class="block">
            <img
              src="{{ post.meta.image }}"
              alt="{{ post.meta.title }}"
              class="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300{% if post.meta.imageClass %} {{ post.meta.imageClass }}{% endif %}"
              loading="lazy"
            />
          </a>
        </figure>
      </div>
      {% endif %}

      <!-- Post Content -->
      <div class="{% if post.meta.image %}md:w-2/3 lg:w-3/4{% else %}w-full{% endif %}">
        <header>
          <h2 class="card-title text-2xl mb-2">
            <a href="{{ post.path }}" class="link link-hover">
              {{ post.meta.title }}
            </a>
          </h2>

          <div class="flex flex-wrap gap-4 text-sm text-base-content/60 mb-4">
            {% if post.meta.date %}
            <time datetime="{{ post.meta.date }}">
              {{ post.meta.date | date("MMMM D, YYYY") }}
            </time>
            {% endif %}

            {% if post.meta.author %}
            <span>By {{ post.meta.author }}</span>
            {% endif %}

            {% if post.meta.readingTime %}
            <span>{{ post.meta.readingTime }} min read</span>
            {% endif %}
          </div>
        </header>

        <!-- Post Excerpt -->
        <p class="text-base-content/80 mb-4">
          {{ post.meta.excerpt or post.meta.description or "" | excerpt(150) }}
        </p>

        <!-- Tags -->
        {% if post.meta.tags and post.meta.tags.length > 0 %}
        <div class="flex flex-wrap gap-2 mb-4">
          {% for tag in post.meta.tags %}
          <a href="/blog/tag/{{ tag | slug }}" class="badge badge-outline badge-sm hover:badge-primary transition-colors">
            {{ tag }}
          </a>
          {% endfor %}
        </div>
        {% endif %}

        <!-- Read More -->
        <div class="card-actions justify-end">
          <a href="{{ post.path }}" class="btn btn-primary btn-sm">
            Read More →
          </a>
        </div>
      </div>
    </div>
  </div>
</article>
```

## Step 7: Create Layout Templates

### Blog Listing Template

Create `src/layouts/blog-listing.html`:

```html
{% from "_macros.html" import listing %}
<!DOCTYPE html>
<html lang="en" data-theme="{{ theme or 'duct' }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title }} - My Blog</title>
  <meta name="description" content="{{ page.description }}">
  <link rel="stylesheet" href="/src/styles/main.css">
</head>

<body class="min-h-screen flex flex-col">
  {% include "_header.html" %}

  <div class="max-w-6xl mx-auto px-4 py-8 flex-1">
    {{ listing(collections.blog or [], page, '/blog') }}
  </div>

  <div id="app"></div>

  {% for script in page.scripts %}
  <script type="module" src="{{ script }}"></script>
  {% endfor %}
</body>
</html>
```

### Tag Listing Template

Create `src/layouts/tag-listing.html`:

```html
{% from "_macros.html" import listing %}
<!DOCTYPE html>
<html lang="en" data-theme="{{ theme or 'duct' }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title }} - My Blog</title>
  <meta name="description" content="{{ page.description }}">
  <link rel="stylesheet" href="/src/styles/main.css">
</head>

<body class="min-h-screen flex flex-col">
  {% include "_header.html" %}

  <div class="max-w-6xl mx-auto px-4 py-8 flex-1">
    {# Filter posts by tag #}
    {% set targetTag = page.tag %}
    {% set filteredPosts = [] %}
    {% for post in collections.blog %}
      {% if post.meta.tags and targetTag in post.meta.tags %}
        {% set _ = filteredPosts.push(post) %}
      {% endif %}
    {% endfor %}

    {# Set up breadcrumbs #}
    {% set breadcrumbs = [
      {url: '/', text: 'Home'},
      {url: '/blog', text: 'Blog'},
      {text: 'Tag: ' + (page.tag or 'Unknown')}
    ] %}

    {# Custom page data for macro #}
    {% set tagPage = {
      title: 'Posts tagged "' + (page.tag or 'Unknown') + '"',
      description: page.description,
      postsPerPage: page.postsPerPage,
      currentPage: page.currentPage
    } %}

    {{ listing(
      filteredPosts,
      tagPage,
      '/blog/tag/' + (page.tagSlug or 'unknown'),
      breadcrumbs,
      'No blog posts found with the tag "' + (page.tag or 'Unknown') + '".'
    ) }}
  </div>

  <div id="app"></div>

  {% for script in page.scripts %}
  <script type="module" src="{{ script }}"></script>
  {% endfor %}
</body>
</html>
```

### Individual Post Template

Create `src/layouts/post.html`:

```html
<!DOCTYPE html>
<html lang="en" data-theme="{{ theme or 'duct' }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title }} - My Blog</title>
  <meta name="description" content="{{ page.description or page.excerpt }}">

  <!-- Article metadata -->
  {% if page.author %}<meta name="author" content="{{ page.author }}">{% endif %}
  {% if page.date %}<meta property="article:published_time" content="{{ page.date }}">{% endif %}
  {% if page.tags %}<meta name="keywords" content="{{ page.tags | join(', ') }}">{% endif %}

  <link rel="stylesheet" href="/src/styles/main.css">
</head>

<body class="min-h-screen flex flex-col">
  {% include "_header.html" %}

  <div id="content" class="flex-1">
    <article class="max-w-4xl mx-auto px-4 py-8">
      <header class="mb-8 pb-8 border-b border-base-300">
        <h1 class="text-4xl font-bold mb-4">{{ page.title or 'Untitled Post' }}</h1>

        <div class="flex flex-wrap gap-4 text-sm text-base-content/70">
          {% if page.date %}
          <time datetime="{{ page.date }}">{{ page.date | date("MMMM D, YYYY") }}</time>
          {% endif %}
          {% if page.author %}<span>By {{ page.author }}</span>{% endif %}
          {% if page.readingTime %}<span>{{ page.readingTime }} min read</span>{% endif %}
        </div>

        {% if page.tags and page.tags.length > 0 %}
        <div class="flex flex-wrap gap-2 mt-4">
          {% for tag in page.tags %}
          <a href="/blog/tag/{{ tag | slug }}" class="badge badge-primary hover:badge-primary-focus">
            {{ tag }}
          </a>
          {% endfor %}
        </div>
        {% endif %}
      </header>

      <!-- Article Content (from markdown) -->
      <div class="prose prose-lg max-w-none">
        {{ staticContent | safe }}
      </div>

      <footer class="mt-12 pt-8 border-t border-base-300">
        <div class="flex justify-between items-center">
          <a href="/blog" class="btn btn-outline btn-sm">← Back to Blog</a>
        </div>
      </footer>
    </article>
  </div>

  <!-- Interactive content container -->
  <div id="app">{{ interactiveContent | safe }}</div>

  {% for script in page.scripts %}
  <script type="module" src="{{ script }}"></script>
  {% endfor %}
</body>
</html>
```

## Step 8: Write Your First Blog Post

Create `content/blog/2025/01/my-first-post.md`:

```markdown
---
title: "My First Blog Post"
description: "Welcome to my new blog built with Duct UI"
date: 2025-01-15
author: "Your Name"
tags: ["Getting Started", "Blog"]
image: "/blog/2025/01/hero-image.jpg"
imageClass: "rounded-lg"
---

Welcome to my new blog! This is my first post using Duct UI's static site generation.

<!--more-->

## What is Duct UI?

Duct UI is a framework that separates templates from logic, making it easy to build maintainable web applications.

### Key Features

- **Explicit lifecycle**: Components have predictable render → bind → release phases
- **Template separation**: JSX templates are separate from component logic
- **Static site generation**: Built-in SSG for content-driven sites
- **Asset management**: Automatic copying and optimization of images and assets

## Code Example

Here's a simple Duct component:

```tsx
import { createBlueprint } from '@duct-ui/core'

interface Props {
  message: string
}

const HelloWorld = createBlueprint<Props>({
  render: ({ message }) => (
    <div class="greeting">
      <h1>{message}</h1>
      <button id="click-me">Click me!</button>
    </div>
  ),

  bind: (element, { message }) => {
    const button = element.querySelector('#click-me')
    button?.addEventListener('click', () => {
      alert(`Hello from: ${message}`)
    })
  }
})

export default HelloWorld
```

## Conclusion

Building a blog with Duct is straightforward and powerful. The framework handles content management, asset optimization, and provides a clean development experience.

Stay tuned for more posts about advanced Duct features!
```

## Step 9: Add Assets

Place your blog assets in the same directory as your markdown files:

```
content/blog/2025/01/
├── my-first-post.md
└── hero-image.jpg
```

Duct automatically copies these assets to the `dist` directory during build, maintaining the same relative structure.

## Step 10: Build and Deploy

Build your blog:

```bash
npx duct build
```

This generates:
- `/blog/index.html` - Main blog listing
- `/blog/2025/01/my-first-post.html` - Individual post
- `/blog/tag/getting-started.html` - Tag pages
- `/blog/2025/01/hero-image.jpg` - Copied assets

## Advanced Features

### Custom Excerpt Markers

Use `<!--more-->` in your markdown to define custom excerpts:

```markdown
This appears in the post listing as the excerpt.

<!--more-->

This content only appears on the full post page.
```

### Syntax Highlighting

Duct automatically enables Prism.js syntax highlighting:

````markdown
```typescript
interface User {
  name: string
  email: string
}
```
````

### Custom Layouts

Create specialized layouts for different post types:

```markdown
---
layout: "tutorial.html"  # Use custom tutorial layout
---
```

## Best Practices

1. **Organize by date**: Use `YYYY/MM/` folder structure for chronological organization
2. **Consistent front-matter**: Define required fields like `title`, `date`, `author`
3. **Optimize images**: Use web-optimized formats and reasonable dimensions
4. **Tag consistently**: Use a consistent tagging strategy
5. **Write excerpts**: Either use `description` field or `<!--more-->` markers

## Troubleshooting

### Posts not appearing
- Check that markdown files have proper front-matter
- Ensure `date` field is in valid format (YYYY-MM-DD)
- Verify `contentDir` path in `duct.config.js`

### Assets not loading
- Assets must be in the same directory tree as content files
- Use relative paths in markdown: `![Alt text](./image.jpg)`

### Tags not working
- Ensure tags are arrays in front-matter: `tags: ["Tag 1", "Tag 2"]`
- Tag pages are automatically generated based on actual content

Your Duct-powered blog is now ready! The framework handles content management, asset copying, tagging, and pagination. When used with the templates mentioned here, setting up a blog takes just minutes.