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
  getRoutes(): Record<string, PageMeta> | Promise<Record<string, PageMeta>>
  /** Fallback handler for Cloudflare Worker (dynamic routes) (optional) */
  fallback?(request: Request): Promise<FallbackResult | undefined>
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
  /** Static paths for dynamic routes with their overlay meta */
  staticPaths?: Record<string, PageMeta>
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