---
title: "Getting Started with Your New Site"
slug: "getting-started"
date: "2024-01-20"
author: "{{author}}"
tags: ["tutorial", "getting-started", "article"]
featured: false
---

This post will help you get started with your new Duct UI website and understand how to customize it for your needs.

<!--more-->

## Project Structure

Your website is organized as follows:

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

## Adding New Blog Posts

Create markdown files in the `src/blog/` directory with frontmatter:

```markdown
---
title: "Your Post Title"
slug: "your-post-slug"
date: "2024-01-01"
author: "Your Name"
tags: ["tag1", "tag2"]
featured: true
---

Your post content here...
```

## Customizing the Design

- Edit `tailwind.config.ts` to customize your design system
- Modify components in `src/components/` for custom UI elements
- Update layouts in `pages/layouts/` for page structure

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Next Steps

1. **Customize the homepage** - Edit `pages/index.tsx`
2. **Add your content** - Create new blog posts in `src/blog/`
3. **Update the about page** - Modify `pages/about.tsx`
4. **Configure deployment** - Choose your hosting platform

Happy building with Duct UI!