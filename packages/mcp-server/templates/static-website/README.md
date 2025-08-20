# {{name}}

{{description}}

A static website built with [Duct UI](https://duct-ui.org) featuring a blog and modern web development practices.

## Features

- 🚀 **Static Site Generation**: Pre-rendered pages for optimal performance
- 📝 **Blog Support**: Markdown-based blog with frontmatter
- 🎨 **Tailwind CSS**: Utility-first styling with typography plugin
- 📱 **Responsive Design**: Mobile-first responsive layouts
- ⚡ **Fast Development**: Hot reload with Vite
- 🔧 **TypeScript**: Full type safety throughout

## Quick Start

```bash
# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev

# Build for production
npm run build
# or
pnpm build

# Preview production build
npm run preview
# or
pnpm preview
```

## Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   └── blog/          # Blog content (markdown files)
├── pages/
│   ├── layouts/       # HTML layout templates
│   ├── blog/          # Blog page components
│   ├── index.tsx      # Homepage
│   └── about.tsx      # About page
├── tailwind.config.ts # Tailwind configuration
├── vite.config.ts     # Vite configuration
└── tsconfig.json      # TypeScript configuration
```

## Adding Blog Posts

Create markdown files in `src/blog/` with frontmatter:

```markdown
---
title: "Your Post Title"
description: "Post description"
date: "2024-01-01"
tags: ["tag1", "tag2"]
---

# Your Post Title

Your post content here...
```

## Customization

### Styling
- Edit `tailwind.config.ts` to customize your design system
- Modify components in `src/components/` for custom UI elements
- Update layouts in `pages/layouts/` for page structure

### Content
- Add pages in the `pages/` directory
- Create blog posts in `src/blog/`
- Customize navigation in your layout components

## Deployment

This site generates static files that can be deployed anywhere:

- **Netlify**: Connect your repository and deploy automatically
- **Vercel**: Import your project for instant deployment
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **Cloudflare Pages**: Connect repository for edge deployment

## Built with Duct UI

This website is built using the [Duct UI Framework](https://duct-ui.org), providing:

- **Performance**: Compiled templates with minimal runtime overhead
- **Type Safety**: Full TypeScript support with strict typing
- **SSG Support**: Server-side rendering and static site generation
- **Component System**: Reusable UI components with clear lifecycle
- **Modern DX**: Hot reload, TypeScript, and modern tooling

## License

MIT