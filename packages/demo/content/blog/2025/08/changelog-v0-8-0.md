---
title: "Release v0.8.0: Search & Discovery"
image: /blog/release.svg
imageClass: dark-invert
layout: changelog.html
date: 2025-08-28
author: Duct Team
version: "0.8.0"
summary: "Full-text search with provider-based architecture, automatic sitemap generation, Claude Code specialized agents, and improved developer experience."
tags: [Release]
---

We're thrilled to announce **Duct UI v0.8.0**, bringing powerful search capabilities to Duct through a flexible provider system, along with automatic sitemap generation and enhanced AI-assisted development tools.

<!--more-->

## ✨ New Features

### Search Infrastructure

Duct now ships with built-in search capabilities through a provider-based architecture. Generate search indexes at build time, integrate with your preferred search solution, and provide instant search experiences to your users.

**Key features:**

- FlexSearch-based indexing with configurable schemas
- Provider system supporting local and cloud search
- Automatic index generation during static site builds
- Search modal component with keyboard navigation

### Local Search Provider

- Client-side FlexSearch implementation
- Zero infrastructure requirements
- Automatic index loading
- Same API as cloud providers

### Cloudflare Search Provider

Deploy search to the edge with the new Cloudflare Workers integration:

- R2 storage for search indexes
- KV namespaces for metadata
- Sync search indexes post-deployment
- Full API for search operations
- Fallback to local search when the worker is unavailable

### Sitemap Generation

- **Automatic Generation**: Static builds now create `sitemap.xml` with all routes
- **Smart Configuration**: Configurable URL patterns and priorities
- **Content Awareness**: Automatic lastmod dates from content files
- **SEO Friendly**: Respects robots meta tags and exclusions

## 🔧 Improvements

The starter template gets search integration out of the box.

- Search integration out of the box
- Environment-based configuration

## 📚 Learn More

For detailed information about the new search functionality, check out our comprehensive guide: [Building Search into Duct](/blog/2025/08/search-in-duct).
