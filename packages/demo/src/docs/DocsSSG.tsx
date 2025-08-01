import { BindReturn, createBlueprint, type BaseProps } from "@duct-ui/core/blueprint"
import { escapeHtml } from "@kitajs/html"

function render(props: BaseProps<{}>) {
  return (
    <div class="prose prose-lg max-w-4xl p-8" {...props}>
      <h1 class="text-4xl font-bold mb-8">Static Site Generation</h1>

      <p class="text-lg mb-6">
        Duct supports static site generation (SSG) with file-based routing, allowing you to build fast,
        SEO-friendly websites that can be deployed to CDNs like Cloudflare Pages.
      </p>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Getting Started</h2>

      <h3 class="text-xl font-medium mt-6 mb-3">1. Install the CLI Package</h3>
      <p class="mb-4">First, add the Duct CLI to your project:</p>
      <div class="not-prose">
        <pre class="p-4 rounded-lg mb-6 overflow-x-auto">
          <code class="text-sm">npm install @duct-ui/cli --save-dev</code>
        </pre>
      </div>

      <h3 class="text-xl font-medium mt-6 mb-3">2. Update Vite Configuration</h3>
      <p class="mb-4">Add the Duct SSG plugin to your <code class="px-2 py-1 rounded">vite.config.ts</code>:</p>
      <div class="not-prose">
        <pre class="p-4 rounded-lg mb-6 overflow-x-auto">
          <code class="text-sm">{escapeHtml(`import { defineConfig } from 'vite'
import { ductSSGPlugin } from '@duct-ui/cli/vite-plugin'

export default defineConfig({
  plugins: [
    ductSSGPlugin()
  ],
  // ... other config
})`)}</code>
        </pre>
      </div>

      <h3 class="text-xl font-medium mt-6 mb-3">3. Create Directory Structure</h3>
      <p class="mb-4">Create the required directories for pages and layouts:</p>
      <div class="not-prose">
        <pre class="p-4 rounded-lg mb-6 overflow-x-auto">
          <code class="text-sm">{`src/
├── pages/              # Page components
│   ├── index.tsx       # Home page (/)
│   ├── 404.tsx         # 404 error page (/404)
│   ├── contact.tsx     # Contact page (/contact)
│   ├── about/
│   │   └── index.tsx   # About page (/about)
│   └── blog/
│       ├── index.tsx   # Blog index (/blog)
│       └── [sub].tsx   # Dynamic blog posts (/blog/*)
└── layouts/            # HTML templates
    └── shell.html      # Main layout template`}</code>
        </pre>
      </div>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Page Components</h2>

      <p class="mb-4">Page components in Duct SSG return either:</p>
      <ul class="list-disc ml-6 mb-4">
        <li><strong>Duct components</strong> (created with <code class="px-2 py-1 rounded">createBlueprint</code>) - These are reinstantiated on the client with full logic binding and interactivity</li>
        <li><strong>Plain JSX</strong> - Rendered as static HTML with no client-side presence or interactivity</li>
      </ul>

      <div class="tip">
        <p class="text-sm">
          <strong>📝 Note:</strong> See real examples in the Duct demo source:
          <a href="https://github.com/navilan/duct-ui/blob/main/packages/demo/src/pages/demos/index.tsx" class="text-primary hover:underline ml-2" target="_blank" rel="noopener noreferrer">pages/demos/index.tsx</a>,
          <a href="https://github.com/navilan/duct-ui/blob/main/packages/demo/src/pages/demos/[sub].tsx" class="text-primary hover:underline ml-2" target="_blank" rel="noopener noreferrer">pages/demos/[sub].tsx</a>, and
          <a href="https://github.com/navilan/duct-ui/blob/main/packages/demo/src/pages/404.tsx" class="text-primary hover:underline ml-2" target="_blank" rel="noopener noreferrer">pages/404.tsx</a>
        </p>
      </div>

      <p class="mb-4">Each page component must export specific functions:</p>

      <div class="not-prose">
        <pre class="p-4 rounded-lg mb-6 overflow-x-auto">
          <code class="text-sm">{escapeHtml(`// src/pages/about/index.tsx
import type { DuctPageComponent, PageProps } from '@duct-ui/router'
import AboutContent from '../../components/AboutContent' // A Duct component

export function getLayout(): string {
  return 'shell.html'  // Layout template to use
}

export function getPageContext(): Record<string, any> {
  return {
    title: 'About Us',
    description: 'Learn more about our company',
    openGraph: {
      title: 'About Us - My Site',
      description: 'Learn more about our company and mission',
      image: '/images/about-og.jpg'
    }
  }
}

// Example 1: Returning a Duct component (with client-side interactivity)
const AboutPage: DuctPageComponent = ({ meta, path, env }: PageProps) => {
  // AboutContent is created with createBlueprint and will be 
  // reinstantiated on the client with full logic binding
  return <AboutContent />
}

// Example 2: Returning plain JSX (static HTML only)
const StaticAboutPage: DuctPageComponent = ({ meta, path, env }: PageProps) => {
  // This JSX will be rendered as static HTML with no client-side presence
  return (
    <div class="container mx-auto px-4 py-8">
      <h1>About Us</h1>
      <p>This is static content with no interactivity.</p>
    </div>
  )
}

export default AboutPage // Use the interactive version`)}</code>
        </pre>
      </div>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Route Types</h2>

      <h3 class="text-xl font-medium mt-6 mb-3">Static Routes</h3>
      <p class="mb-4">Static routes are created using:</p>
      <ul class="list-disc ml-6 mb-4">
        <li><code class="px-2 py-1 rounded">index.tsx</code> - Maps to the directory path (e.g., <code>/about/index.tsx</code> → <code>/about</code>)</li>
        <li><strong>Named files</strong> - Any <code>.tsx</code> file maps to its filename (e.g., <code>404.tsx</code> → <code>/404</code>, <code>contact.tsx</code> → <code>/contact</code>)</li>
      </ul>

      <h3 class="text-xl font-medium mt-6 mb-3">Dynamic Routes</h3>
      <p class="mb-4">For dynamic routes, create a <code class="px-2 py-1 rounded">[sub].tsx</code> file:</p>

      <div class="not-prose">
        <pre class="p-4 rounded-lg mb-6 overflow-x-auto">
          <code class="text-sm">{escapeHtml(`// src/pages/blog/[sub].tsx
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
    routes[\`/blog/\${post.slug}\`] = {
      title: \`\${post.title} - My Blog\`,
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

export default BlogPostPage`)}</code>
        </pre>
      </div>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Layout Templates</h2>

      <p class="mb-4/80">Layout templates use Nunjucks templating with access to page context:</p>

      <div class="not-prose">
        <pre class="p-4 rounded-lg mb-6 overflow-x-auto">
          <code class="text-sm">{escapeHtml(`<!-- src/layouts/shell.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Page metadata -->
  <title>{{ page.title }}</title>
  <meta name="description" content="{{ page.description }}">

  <!-- Open Graph tags -->
  {% if page.openGraph %}
  <meta property="og:title" content="{{ page.openGraph.title }}">
  <meta property="og:description" content="{{ page.openGraph.description }}">
  <meta property="og:image" content="{{ page.openGraph.image }}">
  <meta property="og:type" content="{{ page.openGraph.type or 'website' }}">
  {% endif %}

  <!-- Twitter Card tags -->
  {% if page.twitter %}
  <meta name="twitter:card" content="{{ page.twitter.card or 'summary' }}">
  <meta name="twitter:title" content="{{ page.twitter.title or page.title }}">
  <meta name="twitter:description" content="{{ page.twitter.description or page.description }}">
  <meta name="twitter:image" content="{{ page.twitter.image or page.openGraph.image }}">
  {% endif %}

  <!-- Additional meta tags -->
  {% if page.meta %}
    {% for key, value in page.meta %}
    <meta name="{{ key }}" content="{{ value }}">
    {% endfor %}
  {% endif %}

  <!-- Stylesheets -->
  {% if page.styles %}
    {% for style in page.styles %}
    <link rel="stylesheet" href="{{ style }}">
    {% endfor %}
  {% endif %}
</head>
<body>
  <!-- Your Duct component renders here -->
  <div id="app"></div>

  <!-- Scripts -->
  {% if page.scripts %}
    {% for script in page.scripts %}
    <script type="module" src="{{ script }}"></script>
    {% endfor %}
  {% endif %}
</body>
</html>`)}</code>
        </pre>
      </div>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Configuration</h2>

      <p class="mb-4/80">Create an optional <code class="px-2 py-1 rounded">duct.config.js</code> to customize paths:</p>

      <div class="not-prose">
        <pre class="p-4 rounded-lg mb-6 overflow-x-auto">
          <code class="text-sm">{escapeHtml(`// duct.config.js
export default {
  pagesDir: 'src/pages',      // Default: 'src/pages'
  layoutsDir: 'src/layouts',  // Default: 'src/layouts'
  env: {
    // Environment variables available in components
    API_URL: process.env.API_URL,
    SITE_NAME: 'My Website'
  }
}`)}</code>
        </pre>
      </div>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Build Commands</h2>

      <p class="mb-4/80">Update your <code class="px-2 py-1 rounded">package.json</code> scripts:</p>

      <div class="not-prose">
        <pre class="p-4 rounded-lg mb-6 overflow-x-auto">
          <code class="text-sm">{escapeHtml(`{
  "scripts": {
    "dev": "vite",
    "build": "node node_modules/@duct-ui/cli/dist/cli.js build",
    "preview": "vite preview"
  }
}`)}</code>
        </pre>
      </div>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Development Workflow</h2>

      <ol class="list-decimal ml-6 space-y-2 mb-6/80">
        <li>Run <code class="px-2 py-1 rounded">npm run dev</code> for development with hot reloading</li>
        <li>The Vite plugin automatically generates static pages in the background</li>
        <li>Your pages are served with client-side routing for fast navigation</li>
        <li>Run <code class="px-2 py-1 rounded">npm run build</code> to generate production static files</li>
      </ol>

      <h2 class="text-2xl font-semibold mt-8 mb-4">Advanced Features</h2>

      <h3 class="text-xl font-medium mt-6 mb-3">Environment Variables</h3>
      <p class="mb-4/80">Access environment variables in your page components:</p>
      <div class="not-prose">
        <pre class="p-4 rounded-lg mb-6 overflow-x-auto">
          <code class="text-sm">{escapeHtml(`export default function HomePage({ env }: { env: Record<string, any> }) {
  return (
    <div>
      <h1>Welcome to {env.SITE_NAME}</h1>
      <p>API URL: {env.API_URL}</p>
    </div>
  )
}`)}</code>
        </pre>
      </div>

      <h3 class="text-xl font-medium mt-6 mb-3">Conditional Rendering</h3>
      <p class="mb-4/80">Different behavior for static vs. client-side rendering:</p>
      <div class="not-prose">
        <pre class="p-4 rounded-lg mb-6 overflow-x-auto">
          <code class="text-sm">{escapeHtml(`export default function MyPage() {
  const isSSG = typeof window === 'undefined'

  return (
    <div>
      <h1>My Page</h1>
      {!isSSG && (
        <div>This only renders on the client</div>
      )}
    </div>
  )
}`)}</code>
        </pre>
      </div>

      <div class="info-card mt-8">
        <h3 class="text-lg font-semibold mb-2">💡 Pro Tips</h3>
        <ul class="list-disc ml-6 space-y-1">
          <li>Return Duct components (created with <code class="px-2 py-1 rounded">createBlueprint</code>) for interactive pages</li>
          <li>Return plain JSX for purely static content that needs no client-side logic</li>
          <li>Use descriptive page context for better SEO</li>
          <li>Include Open Graph images for social media sharing</li>
          <li>Keep static generation fast by minimizing data fetching in <code class="px-2 py-1 rounded">getRoutes()</code></li>
          <li>Use environment variables for configuration that changes between environments</li>
          <li>Study the <a href="https://github.com/navilan/duct-ui/tree/main/packages/demo/src/pages" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">demo pages source</a> for real-world examples</li>
        </ul>
      </div>
    </div>
  )
}

const id = { id: "docs/ssg" }

function bind(): BindReturn<any> {
  return {
    release: () => { }
  }
}

const DocsSSG = createBlueprint(id, render, { bind })

export default DocsSSG