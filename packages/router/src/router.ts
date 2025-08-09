import * as nunjucks from 'nunjucks'
import type { 
  RouterConfig, 
  Route, 
  PageComponent, 
  SubRouteComponent,
  ContentPageComponent, 
  RenderedPage,
  PageMeta,
  ContentMeta,
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
  private allContent: Map<string, Array<{ path: string; meta: ContentMeta; body: string }>> = new Map()

  constructor(config: RouterConfig & { componentLoader?: (path: string) => Promise<PageComponent> }) {
    this.config = config
    this.componentLoader = config.componentLoader
    
    // Create Nunjucks environment with configuration
    const nunjucksOptions = config.nunjucks?.options || {}
    this.nunjucksEnv = new nunjucks.Environment(
      new nunjucks.FileSystemLoader(config.layoutsDir),
      {
        autoescape: true,
        trimBlocks: true,
        lstripBlocks: true,
        ...nunjucksOptions
      }
    )
    
    // Add custom filters
    if (config.nunjucks?.filters) {
      for (const [name, filter] of Object.entries(config.nunjucks.filters)) {
        this.nunjucksEnv.addFilter(name, filter)
      }
    }
    
    // Add custom globals
    if (config.nunjucks?.globals) {
      for (const [name, global] of Object.entries(config.nunjucks.globals)) {
        this.nunjucksEnv.addGlobal(name, global)
      }
    }
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
    
    // Generate reanimation script for this page (skip for content pages)
    const isContentPage = componentPath.endsWith('[#content#].tsx')
    const reanimationScript = isContentPage ? null : this.generateReanimationScript(path, componentPath, finalMeta)
    const isInlineScript = isContentPage
    
    // Render with layout if specified
    let html: string
    if (layoutConfig) {
      // Convert content map to object for template access
      const contentData: Record<string, any[]> = {}
      for (const [key, items] of this.allContent) {
        contentData[key] = items
        console.debug(`    Passing collection '${key}' with ${items.length} items to template`)
      }
      
      const templateContext = {
        ...layoutConfig.context,
        page: {
          ...finalMeta,
          scripts: [
            ...(finalMeta.scripts || []),
            ...(reanimationScript && !isInlineScript ? [reanimationScript] : []) // Only add module scripts to scripts array
          ],
          inlineScript: (reanimationScript && isInlineScript) ? reanimationScript : undefined // Add inline script separately
        },
        content: componentHtml,
        collections: contentData // All content collections available to templates
      }
      html = this.nunjucksEnv.render(layoutConfig.path, templateContext)
    } else {
      // If no layout, wrap in basic HTML with reanimation script (if any)
      const scriptTag = reanimationScript ? (
        isInlineScript 
          ? `<script>${reanimationScript}</script>`
          : `<script type="module" src="${reanimationScript}"></script>`
      ) : ''
      
      html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${finalMeta.title || 'Duct App'}</title>
</head>
<body>
  <div id="app">${componentHtml}</div>
  ${scriptTag}
</body>
</html>`
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
    
    // First pass: collect all content from content pages
    this.allContent.clear()
    for (const route of routes) {
      if (route.isContentPage && route.contentFiles) {
        const contentType = route.path.replace(/^\//, '') // Remove leading slash for content type key
        console.debug(`    Collecting content for type '${contentType}': ${route.contentFiles.length} items`)
        this.allContent.set(contentType, route.contentFiles)
      }
    }

    for (const route of routes) {
      if (route.isContentPage && route.staticPaths) {
        // Generate pages for content files
        const component = await this.loadComponent(route.componentPath) as ContentPageComponent
        
        // Apply content-specific transformations and filtering if defined
        let contentItems = route.contentFiles || []
        
        // Filter content if filter function is provided
        if (component.filterContent) {
          contentItems = contentItems.filter(item => 
            component.filterContent!(item.meta, item.path)
          )
        }
        
        // Transform metadata if transform function is provided
        if (component.transformMeta) {
          contentItems = contentItems.map(item => ({
            ...item,
            meta: component.transformMeta!(item.meta, item.path)
          }))
        }
        
        // Sort content if sort function is provided
        if (component.sortContent) {
          contentItems = component.sortContent(contentItems)
        }
        
        // Generate a page for each content file
        for (const item of contentItems) {
          const contentMeta: ContentMeta = {
            ...item.meta,
            content: item.body, // Add markdown body to meta for rendering
            contentPath: item.path
          }
          const renderedPage = await this.renderPage(
            component, 
            item.path, 
            route.componentPath, 
            true, 
            contentMeta
          )
          pages.push(renderedPage)
        }
      } else if (route.isDynamic && route.staticPaths) {
        // Generate pages for all static paths (regular dynamic routes)
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

  /**
   * Generate reanimation script for a page
   */
  private generateReanimationScript(path: string, componentPath: string, meta: PageMeta): string {
    // For content pages, return inline script since they don't need complex reanimation
    if (componentPath.endsWith('[#content#].tsx')) {
      return `console.log('Duct: Content page loaded at ${path}');`
    }
    
    // For regular pages, maintain the virtual module approach
    // Generate a unique virtual module path for this reanimation script
    return `/@duct/reanimate${path === '/' ? '/index' : path}.js`
  }
}