/**
 * Page metadata for layout templates
 */
export interface PageMeta {
  [key: string]: any
}

/**
 * Props passed to DuctPageComponent
 */
export interface PageProps {
  /** Page metadata */
  meta: PageMeta
  /** Current route path */
  path: string
  /** Environment variables from router config */
  env: Record<string, any>
}

/**
 * Function-based page component that returns JSX
 */
export type DuctPageComponent = (props: PageProps) => JSX.Element

/**
 * Layout configuration for a page
 */
export interface LayoutConfig {
  /** Path to the layout file relative to layouts directory */
  path: string
  /** Context data to pass to the layout template */
  context: PageMeta
}

/**
 * Fallback result for dynamic routes
 */
export interface FallbackResult {
  /** The Duct page component to render */
  component: DuctPageComponent
  /** Page metadata overlay */
  meta: PageMeta
}

/**
 * Page component interface
 */
export interface PageComponent {
  /** Returns the layout configuration (optional) */
  getLayout?(): string | LayoutConfig
  /** Returns the page metadata for the layout template (optional) */
  getPageMeta?(): PageMeta
  /** The Duct page component to render */
  default: DuctPageComponent
}

/**
 * Sub-route component interface (for dynamic routing)
 */
export interface SubRouteComponent extends PageComponent {
  /** Returns static paths to generate at build time with overlay page meta */
  getRoutes(content?: Map<string, ContentItem[]>): Record<string, PageMeta> | Promise<Record<string, PageMeta>>
  /** Fallback handler for Cloudflare Worker (dynamic routes) (optional) */
  fallback?(request: Request): Promise<FallbackResult | undefined>
}

/**
 * Content metadata from markdown front-matter
 */
export interface ContentMeta extends PageMeta {
  /** Title of the content */
  title?: string
  /** Description of the content */
  description?: string
  /** Publication date */
  date?: string
  /** Author name */
  author?: string
  /** Tags/categories */
  tags?: string[]
  /** Draft status */
  draft?: boolean
}

export interface ContentItem {
  path: string
  meta: ContentMeta
  body: string
}


/**
 * Content page component interface (for markdown-based content)
 */
export interface ContentPageComponent extends PageComponent {
  /** Directory to scan for markdown files (defaults to 'content') */
  getContentDir?(): string
  /** Process and transform content metadata */
  transformMeta?(meta: ContentMeta, path: string): ContentMeta
  /** Filter which content files to include */
  filterContent?(meta: ContentMeta, path: string): boolean
  /** Sort content items */
  sortContent?<T extends ContentItem>(items: Array<T>): Array<T>
}

/**
 * Route definition
 */
export interface Route {
  /** The route path */
  path: string
  /** The page component file path */
  componentPath: string
  /** Whether this is a dynamic route */
  isDynamic: boolean
  /** Whether this is a content page (__content__.tsx) */
  isContentPage?: boolean
  /** Static paths for dynamic routes with their overlay meta */
  staticPaths?: Record<string, PageMeta>
  /** Content files for content pages */
  contentFiles?: Array<{ path: string; meta: ContentMeta; body: string }>
}

/**
 * Router configuration
 */
export interface RouterConfig {
  /** Pages directory path */
  pagesDir: string
  /** Layouts directory path */
  layoutsDir: string
  /** Output directory for generated files */
  outDir: string
  /** Base URL for the site */
  baseUrl?: string
  /** Environment variables to pass to page components */
  env?: Record<string, any>
  /** Nunjucks environment configuration */
  nunjucks?: {
    /** Custom filters to add to the environment */
    filters?: Record<string, (...args: any[]) => any>
    /** Custom globals to add to the environment */
    globals?: Record<string, any>
    /** Nunjucks options */
    options?: {
      autoescape?: boolean
      trimBlocks?: boolean
      lstripBlocks?: boolean
      throwOnUndefined?: boolean
    }
  }
}

/**
 * Rendered page result
 */
export interface RenderedPage {
  /** The rendered HTML content */
  html: string
  /** The route path */
  path: string
  /** Any additional metadata */
  meta?: PageMeta
  /** The original source component path */
  componentPath: string
  /** Whether this page came from a dynamic route */
  isDynamic: boolean
}