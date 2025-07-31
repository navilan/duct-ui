import * as nunjucks from 'nunjucks'
import type { 
  RouterConfig, 
  Route, 
  PageComponent, 
  SubRouteComponent, 
  RenderedPage,
  PageMeta,
  LayoutConfig,
  PageProps 
} from './types.js'

/**
 * File-based router for Duct UI applications
 */
export class DuctRouter {
  private config: RouterConfig
  private nunjucksEnv: nunjucks.Environment
  private componentLoader?: (path: string) => Promise<PageComponent>

  constructor(config: RouterConfig & { componentLoader?: (path: string) => Promise<PageComponent> }) {
    this.config = config
    this.componentLoader = config.componentLoader
    this.nunjucksEnv = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(config.layoutsDir)
    )
  }


  /**
   * Render a page component to HTML
   */
  async renderPage(
    component: PageComponent, 
    path: string, 
    componentPath: string,
    isDynamic: boolean,
    metaOverlay?: PageMeta
  ): Promise<RenderedPage> {
    // Get layout configuration
    const layoutConfig = this.getLayoutConfig(component)
    
    // Get page metadata
    const baseMeta = component.getPageMeta?.() || {}
    const finalMeta = { ...baseMeta, ...metaOverlay }
    
    // Create page props
    const pageProps: PageProps = {
      meta: finalMeta,
      path: path,
      env: this.config.env || {}
    }
    
    // Render the DuctPageComponent
    const jsxElement = component.default(pageProps)
    const componentHtml = jsxElement.toString()
    
    // Render with layout if specified
    let html: string
    if (layoutConfig) {
      const templateContext = {
        ...layoutConfig.context,
        page: finalMeta,
        content: componentHtml
      }
      html = this.nunjucksEnv.render(layoutConfig.path, templateContext)
    } else {
      html = componentHtml
    }

    return {
      html,
      path,
      meta: finalMeta,
      componentPath,
      isDynamic
    }
  }

  /**
   * Generate static pages for given routes
   */
  async generateStaticPages(routes: Route[]): Promise<RenderedPage[]> {
    const pages: RenderedPage[] = []

    for (const route of routes) {
      if (route.isDynamic && route.staticPaths) {
        // Generate pages for all static paths
        for (const [staticPath, metaOverlay] of Object.entries(route.staticPaths)) {
          const component = await this.loadComponent(route.componentPath) as SubRouteComponent
          const renderedPage = await this.renderPage(component, staticPath, route.componentPath, true, metaOverlay)
          pages.push(renderedPage)
        }
      } else if (!route.isDynamic) {
        // Generate regular static page
        const component = await this.loadComponent(route.componentPath)
        const renderedPage = await this.renderPage(component, route.path, route.componentPath, false)
        pages.push(renderedPage)
      }
    }

    return pages
  }

  /**
   * Load a page component from file path
   */
  async loadComponent(componentPath: string): Promise<PageComponent> {
    if (this.componentLoader) {
      return this.componentLoader(componentPath)
    }
    
    // Default behavior - try to import directly (won't work with .tsx files)
    throw new Error(
      `Cannot load component from ${componentPath}. ` +
      `A componentLoader must be provided to handle TypeScript/JSX files.`
    )
  }

  /**
   * Get layout configuration from component
   */
  private getLayoutConfig(component: PageComponent): LayoutConfig | null {
    const layout = component.getLayout?.()
    if (!layout) return null

    if (typeof layout === 'string') {
      return {
        path: layout,
        context: {}
      }
    }

    return layout
  }
}