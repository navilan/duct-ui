export interface GalleryItem {
  title: string
  website: string
  source?: string
  screenshot?: string
  description: string
  features: string[]
}

export const galleryItems: GalleryItem[] = [
  {
    title: "Duct UI Documentation & Demo",
    website: "https://duct-ui.org",
    source: "https://github.com/navilan/duct-ui",
    screenshot: "/docs/gallery/duct-ui-org.png",
    description: "The official Duct UI documentation site and component demos. A comprehensive showcase of all Duct features.",
    features: [
      "Component Library - Interactive demos of all Duct components",
      "Static Site Generation - Documentation built with Duct SSG",
      "Content Management - Markdown-based documentation system",
      "Theme System - Light/dark mode with DaisyUI integration",
      "Code Highlighting - Syntax highlighting with Prism.js",
      "Navigation - Sidebar navigation with active state management",
      "Blog System - Full blog with pagination and tagging",
      "Selective Reanimation - Static pages with interactive components"
    ]
  },
  {
    title: "Duct UI Starter Template",
    website: "https://starter.duct-ui.org",
    source: "https://github.com/navilan/duct-ui/tree/main/packages/starter",
    screenshot: "/docs/gallery/starter-duct-ui.png",
    description: "A feature-rich starter template demonstrating best practices for building websites with Duct.",
    features: [
      "Blog System - Complete blog with pagination and excerpts",
      "Contact Form - Interactive form with modal feedback",
      "Theme Toggle - Persistent theme switching",
      "Responsive Design - Mobile-first responsive layout",
      "Content Collections - Organized markdown content",
      "SEO Optimization - Meta tags and Open Graph support",
      "Container Pattern - Advanced component composition",
      "DaisyUI Components - Semantic color system throughout"
    ]
  },
  {
    title: "Navilan.in",
    website: "https://navilan.in",
    source: "https://github.com/navilan/navilan.in",
    screenshot: "/docs/gallery/navilan-in.png",
    description: "A multilingual personal website showcasing advanced Duct features in production.",
    features: [
      "Multi-language Support - English and Tamil content",
      "Advanced Pagination - Dynamic page generation based on content",
      "Custom Markdown Parser - Enhanced markdown with plugins",
      "Custom Nunjucks Filters - Template processing extensions",
      "Content Co-location - Images stored with markdown files",
      "Bilingual Navigation - Language-aware routing",
      "Production Deployment - Real-world performance optimization",
      "Clean URL Structure - SEO-friendly paths"
    ]
  },
  {
    title: "Echoes of Each Other",
    website: "https://eoeo.one",
    source: "https://github.com/navilan/eoeo",
    screenshot: "/docs/gallery/eoeo-one.png",
    description: "An interactive single-page app exploring connections through dynamic data-driven SVG visualizations.",
    features: [
      "Interactive Single-Page App - Full client-side interactivity",
      "Custom State Management - Event-driven state synchronization",
      "Dynamic SVG Visualization - Data-driven visual representations",
      "Drawer Component - Navigation using Duct's drawer component",
      "Select Component - Interactive controls with Duct's select",
      "Event-Driven Architecture - Component communication through events",
      "Real-time Updates - Live data visualization updates",
      "Responsive Visualization - Adaptive graphics for all screen sizes"
    ]
  },
  {
    title: "Fourdle",
    website: "https://fourdle.puthir.org",
    source: "https://github.com/puthirali/fourdle",
    screenshot: "/docs/gallery/fourdle-puthir-org.png",
    description: "A multi-board word puzzle demonstrating advanced Duct UI patterns including granular observable state management, component refs, and SSG with client - side hydration.",
    features: [
      "Observable State Service - Centralized state with granular event subscriptions (slot: board: entry: slot pattern)",
      "Render/Bind Separation - Pure render functions with side effects isolated in bind lifecycle",
      "Component Refs Pattern - Parent-child communication using createRef for modal control",
      "Manual DOM Updates - Direct element manipulation in bind for surgical UI updates",
      "Event-Driven Architecture - Custom event emitters for component communication",
      "Memory Management - Explicit cleanup with release() pattern for subscriptions and listeners",
      "SSG-Compatible Components - LocalStorage access in bind(), pure rendering for static generation",
      "Duct UI Components - Modal and Select components from @duct-ui/components",
      "Dynamic Re-rendering - innerHTML updates with event listener re-attachment pattern",
      "CSS-Only Animations - Flip animations and auto-animate without React animation libraries"
    ]
  }
]