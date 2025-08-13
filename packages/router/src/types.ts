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
 * Page module interface (contains page component and metadata functions)
 */
export interface DuctPageModule {
  /** Returns the layout configuration (optional) */
  getLayout?(): string | LayoutConfig
  /** Returns the page metadata for the layout template (optional) */
  getPageMeta?(): PageMeta
  /** The Duct page component to render */
  default: DuctPageComponent
}

/**
 * Sub-route module interface (for dynamic routing)
 */
export interface SubRouteModule extends DuctPageModule {
  /** Returns static paths to generate at build time with overlay page meta */
  getRoutes(content?: Map<string, ContentFile[]>): Record<string, PageMeta> | Promise<Record<string, PageMeta>>
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



/**
 * Content page module interface (for markdown-based content)
 */
export interface ContentPageModule extends DuctPageModule {
  /** Directory to scan for markdown files (defaults to 'content') */
  getContentDir?(): string
  /** Process and transform content metadata */
  transformMeta?(meta: ContentMeta, path: string): ContentMeta
  /** Filter which content files to include */
  filterContent?(meta: ContentMeta, path: string): boolean
  /** Sort content items */
  sortContent?<T extends ContentFile>(items: Array<T>): Array<T>
}

/**
 * Content file information
 */
export interface ContentFile {
  /** Relative path from content directory */
  relativePath: string
  /** URL path for the content */
  urlPath: string
  /** Parsed metadata from front-matter */
  meta: ContentMeta
  /** Markdown body content */
  body: string
  /** Parsed HTML excerpt if excerpt marker is found */
  excerpt?: string
  /** Full file path */
  filePath: string
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
  contentFiles?: Array<ContentFile>
}

/**
 * Content configuration
 */
export interface ContentConfig {
  /** Marker to indicate end of excerpt in markdown content. Default: <!--more--> */
  excerptMarker?: string
  /** Custom markdown parser function. Receives markdown string and should return HTML string */
  markdownParser?: (markdown: string) => string | Promise<string>
}

/**
 * Parsed front matter result
 */
export interface ParsedContent {
  /** Metadata extracted from front matter */
  meta: ContentMeta
  /** The markdown body content (without front matter) */
  body: string
  /** Parsed HTML excerpt if excerpt marker is found */
  excerpt?: string
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
  /** Content configuration */
  content?: ContentConfig
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