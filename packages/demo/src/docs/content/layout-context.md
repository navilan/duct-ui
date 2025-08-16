# Layout Context Reference

Duct's Static Site Generation (SSG) uses **Nunjucks layouts** to define the HTML structure around your page content. Layouts provide complete control over the HTML document while offering rich context variables for dynamic content generation.

## Layout Architecture

### Core Concepts

Layouts in Duct follow a template-based architecture where:

- **Layouts** define the HTML shell and structure using Nunjucks templating
- **Pages** provide metadata via `getPageMeta()` and content via components
- **Content pages** (blog posts, markdown) have separate static and interactive content
- **Regular pages** render Duct components directly into the layout
- **Context variables** bridge layouts and page data
- **Includes** enable reusable layout components

### Layout Resolution

When a page component exports `getLayout()`, Duct resolves the layout file:

```typescript
// In your page component
export function getLayout(): string {
  return 'default.html'  // Resolves to src/layouts/default.html
}
```

If no layout is specified, Duct uses `default.html` as the fallback.

## Page Types and Content Rendering

### Regular Pages vs Content Pages

Duct handles two distinct types of pages with different rendering patterns:

#### Regular Pages
Regular pages render Duct components directly:

```typescript
// pages/about/index.tsx
export function getPageMeta() {
  return {
    title: 'About Us',
    description: 'Learn about our company'
  }
}

const AboutPage: DuctPageComponent = ({ meta, path, env }) => {
  return <AboutPageComponent />
}
```

**Layout pattern for regular pages:**
```html
<!-- default.html -->
<body>
  <div id="app">
    {{ content | safe }}  <!-- Duct component renders here -->
  </div>
</body>
```

#### Content Pages (Blog Posts, Markdown)
Content pages require a special `__content__.tsx` file that configures the content directory and processing:

```typescript
// pages/blog/__content__.tsx
const BlogPost = ({ meta }: PageProps) => {
  // Only render interactive components for the #app container
  return <ThemeToggle />
}

export function getLayout(): string {
  return 'post.html'
}

export function getPageMeta(): ContentMeta {
  return {
    title: 'Blog Post',
    description: 'A blog post'
  }
}

// Configure content directory (relative to project root)
export function getContentDir(): string {
  return 'content/blog'
}

// Optional: Filter content (e.g., exclude drafts in production)
export function filterContent(meta: ContentMeta, path: string): boolean {
  if (process.env.NODE_ENV === 'production' && meta.draft) {
    return false
  }
  return true
}

// Optional: Transform metadata to add computed fields
export function transformMeta(meta: ContentMeta, path: string): ContentMeta {
  // Calculate reading time
  if (meta.content) {
    const wordCount = meta.content.split(/\s+/).length
    meta.readingTime = Math.ceil(wordCount / 200)
  }
  
  // Add slug from path
  meta.slug = path.split('/').pop() || ''
  
  return meta
}

export default BlogPost
```

**Layout pattern for content pages:**
```html
<!-- post.html -->
<body>
  <!-- Static content (pre-rendered markdown) -->
  <div id="content">
    <article class="prose">
      {{ staticContent | safe }}
    </article>
  </div>
  
  <!-- Interactive components -->
  <div id="app">
    {{ interactiveContent | safe }}
  </div>
</body>
```

## Context Variables and Data Flow

### The `page` Variable

The `page` object is the primary data bridge between your application and layouts. It combines:

1. **Page metadata** from `getPageMeta()`
2. **Frontmatter data** from markdown files
3. **System-generated data** from Duct's SSG process

#### Data Sources

**From `getPageMeta()` function:**
```typescript
export function getPageMeta() {
  return {
    title: 'My Page',
    description: 'Page description',
    author: 'John Doe',
    customData: 'Any custom field'
  }
}
```

**From markdown frontmatter:**
```markdown
---
title: "Blog Post Title"
description: "Post excerpt"
date: "2023-12-01"
tags: ["tutorial", "duct"]
author: "Jane Smith"
readingTime: 5
---

# Blog content here...
```

**System-generated fields:**
- `page.canonicalUrl` - Full canonical URL
- `page.urlPath` - Relative URL path  
- `page.scripts` - Array of script paths to load
- `page.inlineScript` - Inline JavaScript code

#### Usage in Layouts

All these data sources merge into the `page` variable:

```html
<title>{{ page.title | default('My Site') }}</title>
<meta name="description" content="{{ page.description }}">
<meta name="author" content="{{ page.author }}">

<!-- Blog-specific fields from frontmatter -->
{% if page.date %}
  <time datetime="{{ page.date }}">
    {{ page.date | date("MMMM D, YYYY") }}
  </time>
{% endif %}

{% if page.tags %}
  <div class="flex gap-2">
    {% for tag in page.tags %}
      <span class="badge">{{ tag }}</span>
    {% endfor %}
  </div>
{% endif %}

<!-- Custom fields -->
<meta property="custom:data" content="{{ page.customData }}">
```

### Environment Context (`env`)

Environment variables from your configuration:

```html
<title>{{ page.title | default(env.siteName) }}</title>
<meta property="og:url" content="{{ env.siteUrl }}{{ path }}">
<meta property="og:site_name" content="{{ env.siteName }}">
```

### Collections Context

Access to your content collections:

```html
<!-- Blog post navigation -->
{% set allPosts = collections.blog | sort(true, false, 'meta.date') | reverse %}

<!-- Related content -->
{% for post in collections.blog %}
  {% if post.meta.tags contains 'tutorial' %}
    <a href="{{ post.urlPath }}">{{ post.meta.title }}</a>
  {% endif %}
{% endfor %}
```

## Passing Data to Layouts

### Via Page Metadata

The most common way to pass data to layouts is through `getPageMeta()`:

```typescript
// pages/product/[id].tsx
export function getPageMeta() {
  return {
    title: 'Product Details',
    description: 'View product information',
    ogType: 'product',
    canonicalUrl: 'https://mysite.com/product/123',
    customData: {
      productId: '123',
      category: 'electronics'
    }
  }
}
```

```html
<!-- Layout access -->
<meta property="og:type" content="{{ page.ogType }}">
<link rel="canonical" href="{{ page.canonicalUrl }}">
<meta name="product-id" content="{{ page.customData.productId }}">
```

### Via Frontmatter (Content Pages)

For markdown-based content, use frontmatter:

```markdown
---
title: "Advanced Duct Patterns"
description: "Learn advanced patterns for building with Duct"
date: "2023-12-01"
tags: ["advanced", "patterns"]
author: "Technical Team"
readingTime: 8
featured: true
series: "Duct Mastery"
level: "advanced"
---

Content here...
```

```html
<!-- Layout usage -->
<article>
  <header>
    <h1>{{ page.title }}</h1>
    {% if page.series %}
      <div class="series-badge">Part of: {{ page.series }}</div>
    {% endif %}
    {% if page.level %}
      <div class="difficulty-{{ page.level }}">{{ page.level | title }}</div>
    {% endif %}
  </header>
  
  <div class="prose">
    {{ staticContent | safe }}
  </div>
</article>
```

### Dynamic Route Data with Content Access

For non-content pages (like tag listings, blog indexes, etc.), `getRoutes()` receives a `content` parameter containing all content collections. This allows you to generate pages based on your content:

```typescript
// pages/blog/tag/[tag].tsx - Tag listing page
export async function getRoutes(content?: Map<string, ContentFile[]>): Promise<Record<string, any>> {
  const routes: Record<string, any> = {}
  
  if (content) {
    // Extract all unique tags from all content collections
    const allTags = new Set<string>()
    
    for (const [collectionName, files] of content) {
      for (const file of files) {
        if (file.meta.tags) {
          file.meta.tags.forEach(tag => allTags.add(tag))
        }
      }
    }
    
    // Generate a route for each tag
    for (const tag of allTags) {
      routes[`/blog/tag/${tag.toLowerCase()}`] = {
        title: `Posts tagged "${tag}"`,
        description: `All blog posts tagged with ${tag}`,
        tag: tag,
        postsPerPage: 5
      }
    }
  }
  
  return routes
}
```

```typescript
// pages/blog/page/[page].tsx - Blog pagination
export async function getRoutes(content?: Map<string, ContentFile[]>): Promise<Record<string, any>> {
  const routes: Record<string, any> = {}
  
  if (content) {
    const blogPosts = content.get('blog') || []
    const postsPerPage = 5
    const totalPages = Math.ceil(blogPosts.length / postsPerPage)
    
    // Generate pagination routes
    for (let page = 2; page <= totalPages; page++) {
      routes[`/blog/page/${page}`] = {
        title: `Blog - Page ${page}`,
        description: 'Latest blog posts',
        currentPage: page,
        postsPerPage: postsPerPage
      }
    }
  }
  
  return routes
}
```

```html
<!-- Tag listing layout -->
<h1>Posts tagged "{{ page.tag }}"</h1>
<meta name="description" content="{{ page.description }}">

<!-- Blog pagination layout -->
<title>{{ page.title }}</title>
<div class="pagination-info">Page {{ page.currentPage }}</div>
```

## Layout Patterns

### Basic Layout Structure

Every layout should follow this fundamental structure:

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  {% include "_meta_tags.html" %}
  <link rel="stylesheet" href="/src/styles/main.css">
</head>
<body>
  <div id="app">
    {{ content | safe }}
  </div>
  
  <!-- Scripts -->
  {% if page.scripts %}
    {% for script in page.scripts %}
      <script type="module" src="{{ script }}"></script>
    {% endfor %}
  {% endif %}
</body>
</html>
```

### Content Page Layout

For pages with markdown content and optional interactive components:

```html
<!-- post.html -->
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  {% set ogType = 'article' %}
  {% include "_meta_tags.html" %}
  <link rel="stylesheet" href="/src/styles/main.css">
</head>
<body>
  <!-- Static content container -->
  <div id="content">
    <article class="max-w-4xl mx-auto px-4 py-8">
      <!-- Article header with frontmatter data -->
      <header class="mb-8 pb-8 border-b">
        <h1>{{ page.title }}</h1>
        
        <div class="flex gap-4 text-sm opacity-70">
          {% if page.date %}
            <time datetime="{{ page.date }}">
              {{ page.date | date("MMMM D, YYYY") }}
            </time>
          {% endif %}
          {% if page.author %}
            <span>By {{ page.author }}</span>
          {% endif %}
          {% if page.readingTime %}
            <span>{{ page.readingTime }} min read</span>
          {% endif %}
        </div>
        
        {% if page.tags %}
          <div class="flex gap-2 mt-4">
            {% for tag in page.tags %}
              <a href="/blog/tag/{{ tag | slug }}" class="badge badge-primary">
                {{ tag }}
              </a>
            {% endfor %}
          </div>
        {% endif %}
      </header>
      
      <!-- Markdown content -->
      <div class="prose prose-lg max-w-none">
        {{ staticContent | safe }}
      </div>
    </article>
  </div>
  
  <!-- Interactive components -->
  <div id="app">
    {{ interactiveContent | safe }}
  </div>
  
  <!-- Scripts -->
  {% for script in page.scripts %}
    <script type="module" src="{{ script }}"></script>
  {% endfor %}
</body>
</html>
```

### Hybrid Layout (Static + Interactive)

Some layouts combine static Nunjucks-generated content with interactive areas:

```html
<!-- blog-listing.html -->
{% from "_macros.html" import listing %}
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  {% include "_meta_tags.html" %}
  <link rel="stylesheet" href="/src/styles/main.css">
</head>
<body>
  <!-- Static listing generated by Nunjucks -->
  <div class="max-w-6xl mx-auto px-4 py-8">
    {{ listing(collections.blog, page, '/blog') }}
  </div>
  
  <!-- Interactive features (search, filters, etc.) -->
  <div id="app"></div>
  
  <!-- Scripts -->
  {% for script in page.scripts %}
    <script type="module" src="{{ script }}"></script>
  {% endfor %}
</body>
</html>
```

## Nunjucks Features and Template Inheritance

Duct leverages the full power of [Nunjucks templating](https://mozilla.github.io/nunjucks/templating.html). Key features include:

### Template Inheritance

Create base layouts and extend them:

```html
<!-- _base.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>{% block title %}{{ env.siteName }}{% endblock %}</title>
  {% block head %}{% endblock %}
</head>
<body>
  <header>{% block header %}{% endblock %}</header>
  <main>{% block content %}{% endblock %}</main>
  <footer>{% block footer %}{% endblock %}</footer>
</body>
</html>
```

```html
<!-- blog.html -->
{% extends "_base.html" %}

{% block title %}{{ page.title }} - {{ env.siteName }}{% endblock %}

{% block head %}
  <meta property="og:type" content="article">
{% endblock %}

{% block header %}
  {% include "_blog_header.html" %}
{% endblock %}

{% block content %}
  <article>
    {{ staticContent | safe }}
  </article>
{% endblock %}
```

### Includes for Reusable Components

Break layouts into reusable pieces:

```html
<!-- _meta_tags.html -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{ page.title | default(env.siteName) }}</title>
<meta name="description" content="{{ page.description }}">

<!-- Open Graph -->
<meta property="og:type" content="{{ page.ogType | default('website') }}">
<meta property="og:title" content="{{ page.title }}">
<meta property="og:description" content="{{ page.description }}">
<meta property="og:url" content="{{ env.siteUrl }}{{ path }}">
```

```html
<!-- _header.html -->
<header class="border-b bg-white sticky top-0">
  <nav class="max-w-6xl mx-auto px-4 py-4">
    <div class="flex justify-between items-center">
      <a href="/" class="text-xl font-bold">{{ env.siteName }}</a>
      
      <div class="hidden md:flex gap-6">
        <a href="/" class="hover:text-blue-600">Home</a>
        <a href="/blog" class="hover:text-blue-600">Blog</a>
        <a href="/about" class="hover:text-blue-600">About</a>
      </div>
    </div>
  </nav>
</header>
```

### Macros for Complex Logic

Create reusable template functions:

```html
<!-- _macros.html -->
{% macro listing(posts, page, baseUrl, breadcrumbs=null) %}
  <!-- Pagination logic -->
  {% set postsPerPage = page.postsPerPage or 10 %}
  {% set currentPage = page.currentPage or 1 %}
  {% set sortedPosts = posts | sort(attribute='meta.date', reverse=true) %}
  {% set totalPosts = sortedPosts | length %}
  {% set totalPages = (totalPosts / postsPerPage) | round(0, 'ceil') %}
  
  <!-- Post grid -->
  <div class="grid gap-8">
    {% for post in sortedPosts %}
      {% if loop.index0 >= startIndex and loop.index0 < endIndex %}
        <article class="card">
          <h2><a href="{{ post.urlPath }}">{{ post.meta.title }}</a></h2>
          <p>{{ post.meta.description }}</p>
          <time>{{ post.meta.date | date("MMM D, YYYY") }}</time>
        </article>
      {% endif %}
    {% endfor %}
  </div>
  
  <!-- Pagination -->
  {% if totalPages > 1 %}
    <nav class="flex justify-center mt-8">
      {% for pageNum in range(1, totalPages + 1) %}
        {% if pageNum == currentPage %}
          <span class="btn btn-active">{{ pageNum }}</span>
        {% else %}
          <a href="{{ baseUrl }}{% if pageNum > 1 %}/page/{{ pageNum }}{% endif %}" class="btn">
            {{ pageNum }}
          </a>
        {% endif %}
      {% endfor %}
    </nav>
  {% endif %}
{% endmacro %}
```

### Advanced Nunjucks Features

- **Filters**: Transform data (`{{ page.date | date("YYYY-MM-DD") }}`)
- **Tests**: Conditional logic (`{% if post.featured is defined %}`)
- **Loops**: Iterate with control (`{% for post in posts %} ... {% endfor %}`)
- **Conditionals**: Complex branching (`{% if page.ogType == 'article' %}`)
- **Variables**: Set and manipulate data (`{% set currentIndex = loop.index0 %}`)

For comprehensive documentation on Nunjucks features, see the [official Nunjucks documentation](https://mozilla.github.io/nunjucks/templating.html).

## Best Practices

1. **Understand page types** - Use appropriate rendering patterns for regular vs content pages
2. **Leverage data flow** - Pass data through `getPageMeta()` and frontmatter effectively  
3. **Use includes** - Break layouts into reusable components
4. **Consider inheritance** - Use template inheritance for consistent structure
5. **Optimize performance** - Load scripts and styles efficiently
6. **Plan for SEO** - Include comprehensive metadata
7. **Support themes** - Use data attributes for theme switching
8. **Validate markup** - Ensure proper HTML structure

Layouts are the foundation of your Duct application's presentation layer. By understanding the data flow from page metadata and frontmatter to layout variables, and leveraging Nunjucks' powerful templating features, you can create flexible, maintainable, and performant website architectures.