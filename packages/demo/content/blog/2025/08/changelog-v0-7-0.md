---
title: "Release v0.7.0: Content Management"
image: /blog/release.svg
imageClass: dark-invert
layout: changelog.html
date: 2025-08-11
author: Duct Team
version: "0.7.0"
summary: "Major improvements to static site generation with content asset management, excerpt markers, Prism.js syntax highlighting, and reusable template components."
tags: [Release]
---

We're excited to announce **Duct UI v0.7.0**, a significant release focused on enhancing our static site generation capabilities with powerful content management features and improved developer experience.

<!--more-->

Duct now supports generating HTML pages from a content directory of markdown files. This allows for generating blogs from posts written exclusively in markdown.

## ✨ New Features

### Content Asset Management

- **Automatic Asset Copying**: Images and other assets alongside markdown files are now automatically copied to the dist directory during build
- **Hot Reload Support**: Content assets and markdown files are watched for changes in development mode with automatic browser refresh
- **Configurable Content Directory**: Added `contentDir` configuration option with proper path resolution

### Enhanced Markdown Support

- **Excerpt Markers**: Support for `<!--more-->` markers to define custom content excerpts without requiring description metadata
- **Prism.js Integration**: Full syntax highlighting for code blocks in markdown content with support for TypeScript, JavaScript, CSS, JSON, Bash, and more