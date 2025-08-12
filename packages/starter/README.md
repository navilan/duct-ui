# Duct UI Starter Template

A modern, feature-rich starter template for building web applications with [Duct UI](https://duct-ui.org). This template provides a solid foundation with best practices, modern tooling, and essential features out of the box.

## ✨ Features

- **🎨 Modern Design** - Clean, responsive UI with DaisyUI themes
- **🌗 Theme Toggle** - Light/dark mode with system preference detection
- **📝 Blog System** - Complete blog with markdown content, tagging, and pagination
- **📱 Responsive Layout** - Mobile-first design that works on all devices
- **⚡ Static Site Generation** - Built-in SSG for optimal performance
- **🎯 Interactive Components** - Contact form with modal feedback
- **🔧 TypeScript Support** - Full TypeScript integration with strict typing
- **🎪 Component Library** - Uses Duct UI components for consistency
- **📊 Semantic Colors** - DaisyUI semantic color system throughout

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- Basic knowledge of TypeScript and web development

### Installation

1. **Copy this starter template:**
   ```bash
   cp -r packages/starter my-new-project
   cd my-new-project
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
# Build the project
pnpm build

# Preview the build
pnpm preview
```

## 📁 Project Structure

```
starter/
├── content/                 # Markdown content
│   └── blog/               # Blog posts
│       ├── hello-world.md
│       └── second-post.md
├── src/
│   ├── components/         # Reusable components
│   │   ├── ThemeToggle.tsx
│   │   ├── ContactContainer.tsx
│   │   ├── FormDataModal.tsx
│   │   ├── HomeDemo.tsx
│   │   └── AboutContainer.tsx
│   ├── layouts/           # Page layouts (Nunjucks)
│   │   ├── _header.html
│   │   ├── _footer.html
│   │   ├── _meta_tags.html
│   │   ├── home.html
│   │   ├── page.html
│   │   ├── post.html
│   │   ├── blog-listing.html
│   │   └── tag-listing.html
│   ├── pages/             # Route components
│   │   ├── index.tsx      # Home page
│   │   ├── about.tsx      # About page
│   │   ├── contact.tsx    # Contact page
│   │   └── blog/          # Blog routes
│   │       ├── __content__.tsx  # Blog posts
│   │       ├── index.tsx        # Blog listing
│   │       ├── page/[page].tsx  # Blog pagination
│   │       └── tag/[tag].tsx    # Tag filtering
│   └── styles/
│       └── main.css       # Global styles
├── duct.config.js         # Duct configuration
├── tailwind.config.js     # Tailwind CSS config
└── package.json
```

## 🎯 Key Components

### Pages

- **Home** (`/`) - Hero section with interactive demo
- **About** (`/about`) - About page with team values
- **Contact** (`/contact`) - Contact form with modal feedback
- **Blog** (`/blog`) - Blog listing with pagination
- **Blog Posts** (`/blog/hello-world`) - Individual blog posts
- **Tag Pages** (`/blog/tag/article`) - Tag-filtered blog posts

### Components

- **ThemeToggle** - Floating theme switcher (light/dark)
- **ContactContainer** - Interactive contact form
- **FormDataModal** - Modal for displaying form submissions
- **HomeDemo** - Interactive component showcase
- **AboutContainer** - Static about page content

### Layouts

- **home.html** - Custom home page layout
- **page.html** - Generic page layout
- **post.html** - Blog post layout
- **blog-listing.html** - Blog listing layout
- **tag-listing.html** - Tag page layout

## 🎨 Styling

This template uses:

- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Semantic component classes and themes
- **Semantic Colors** - Uses `primary`, `secondary`, `accent`, `base-100`, etc.
- **Responsive Design** - Mobile-first with responsive breakpoints

### Theme System

The template includes a theme toggle that switches between light and dark modes:

- Respects system preference by default
- Persists user choice in localStorage
- Smooth transitions between themes
- Semantic color system works with all themes

## 📝 Content Management

### Adding Blog Posts

1. Create a new markdown file in `content/blog/`:
   ```markdown
   ---
   title: "My New Post"
   slug: "my-new-post"
   excerpt: "A brief description of the post"
   date: "2024-01-20"
   author: "Your Name"
   tags: ["tutorial", "duct-ui", "article"]
   featured: false
   ---

   # My New Post

   Your post content goes here...
   ```

2. The blog system automatically:
   - Generates routes for the post
   - Creates tag pages for any new tags
   - Adds it to the blog listing
   - Calculates reading time

### Content Features

- **Markdown Support** - Full markdown syntax
- **Front Matter** - Metadata for posts
- **Tag System** - Automatic tag page generation
- **Date Sorting** - Posts sorted by date (newest first)
- **Reading Time** - Automatic calculation
- **Excerpts** - Manual or automatic excerpt generation

## 🔧 Configuration

### Duct Configuration

Edit `duct.config.js` to customize:
- Site metadata
- Content directories
- Build settings
- Nunjucks filters

### Tailwind Configuration

Edit `tailwind.config.js` to:
- Add custom colors
- Configure DaisyUI themes
- Add custom utilities

## 🚀 Deployment

### Static Hosting

Build and deploy to any static hosting provider:

```bash
pnpm build
# Upload dist/ folder to your hosting provider
```

### Popular Platforms

- **Netlify**: Connect your repository and set build command to `pnpm build`
- **Vercel**: Import project and select "Other" framework
- **GitHub Pages**: Use GitHub Actions with build workflow
- **Cloudflare Pages**: Connect repository with `pnpm build` command

## 🛠️ Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm typecheck` - Run TypeScript checks

### Adding New Pages

1. Create a new `.tsx` file in `src/pages/`
2. Export the page component and metadata
3. Optionally create a custom layout

Example:
```tsx
// src/pages/portfolio.tsx
import ThemeToggle from '@components/ThemeToggle'

export function getLayout(): string {
  return 'page.html'
}

export function getPageMeta() {
  return {
    title: 'Portfolio - My Site',
    description: 'Check out my work'
  }
}

const PortfolioPage = ({ meta, path, env }) => {
  return (
    <>
      <div>
        <h1>My Portfolio</h1>
        <p>Welcome to my portfolio...</p>
      </div>
      <ThemeToggle />
    </>
  )
}

export default PortfolioPage
```

### Creating Components

Follow the Duct UI component pattern:

```tsx
import { createBlueprint, type BaseProps } from '@duct-ui/core'
import { EventEmitter } from '@duct-ui/core/shared'

interface MyComponentProps {
  title: string
}

interface MyComponentEvents {
  buttonClick: (el: HTMLElement) => void
}

interface MyComponentLogic {
  updateTitle: (newTitle: string) => void
}

function render(props: BaseProps<MyComponentProps>) {
  const { title, ...moreProps } = props

  return (
    <div class="card bg-base-100 shadow-xl" {...moreProps}>
      <div class="card-body">
        <h2 class="card-title" data-title>{title}</h2>
        <button class="btn btn-primary" data-button>
          Click Me
        </button>
      </div>
    </div>
  )
}

function bind(el: HTMLElement, eventEmitter: EventEmitter<MyComponentEvents>) {
  const titleEl = el.querySelector('[data-title]')
  const buttonEl = el.querySelector('[data-button]')

  function updateTitle(newTitle: string) {
    if (titleEl) titleEl.textContent = newTitle
  }

  function handleClick() {
    eventEmitter.emit('buttonClick')
  }

  buttonEl?.addEventListener('click', handleClick)

  function release() {
    buttonEl?.removeEventListener('click', handleClick)
  }

  return { updateTitle, release }
}

const MyComponent = createBlueprint<MyComponentProps, MyComponentEvents, MyComponentLogic>(
  { id: "my-app/my-component" },
  render,
  { bind }
)

export default MyComponent
```

## 🤝 Contributing

This starter template is part of the Duct UI project. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📚 Learn More

- [Duct UI Documentation](https://duct-ui.org/docs)
- [Duct UI Examples](https://duct-ui.org/demos)
- [GitHub Repository](https://github.com/navilan/duct-ui)
- [DaisyUI Documentation](https://daisyui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Duct UI](https://duct-ui.org) - The component framework
- [DaisyUI](https://daisyui.com) - Semantic CSS components
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Vite](https://vitejs.dev) - Build tool

---

**Happy coding with Duct UI! 🚀**

*This starter template gives you everything you need to build modern, maintainable web applications with explicit patterns and great developer experience.*