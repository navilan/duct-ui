import { Command } from 'commander'
import * as path from 'path'
import * as fs from 'fs/promises'
import { build as viteBuild, loadConfigFromFile, InlineConfig } from 'vite'
import { RouteGenerator, DuctRouter, findAssets } from '@duct-ui/router'
import type { SubRouteComponent, ContentPageComponent, ContentItem } from '@duct-ui/router'
import { loadConfig, resolveConfigPaths } from '../config.js'
import * as logger from '../logger.js'

export const buildCommand = new Command('build')
  .description('Build Duct UI application with SSG')
  .option('-c, --config <file>', 'Vite config file', 'vite.config.ts')
  .option('--pages <dir>', 'Pages directory (overrides config)')
  .option('--layouts <dir>', 'Layouts directory (overrides config)')
  .option('--html-only', 'Generate HTML files only (skip Vite build)', false)
  .action(async (options) => {
    const { config: configFile, htmlOnly } = options
    const cwd = process.cwd()

    logger.build('Building Duct UI application with SSG...')

    try {
      // Load and resolve config
      const config = await loadConfig(cwd)
      const resolvedConfig = resolveConfigPaths(config, cwd)

      // Load project's Vite config
      let baseViteConfig: any = {}
      const viteConfigFile = path.resolve(cwd, configFile)
      
      // For html-only builds, use 'html_only' mode to prevent plugin execution
      const mode = htmlOnly ? 'html_only' : 'production'
      const viteConfigResult = await loadConfigFromFile({ command: 'build', mode }, viteConfigFile)
      baseViteConfig = viteConfigResult?.config || {}

      // Override with CLI options if provided
      const resolvedPagesDir = options.pages ? path.resolve(cwd, options.pages) : resolvedConfig.pagesDir
      const resolvedLayoutsDir = options.layouts ? path.resolve(cwd, options.layouts) : resolvedConfig.layoutsDir

      logger.folder(`Pages directory: ${resolvedPagesDir}`)
      logger.folder(`Layouts directory: ${resolvedLayoutsDir}`)
      const tempDir = path.join(cwd, '.duct')

      // Step 1: Discover routes
      logger.step(1, 'Discovering routes...')
      const generator = new RouteGenerator(resolvedPagesDir)
      const routes = await generator.discoverRoutes()
      const contentPages = routes.filter(r => r.isContentPage)
      logger.info(`Found ${routes.length} routes (${contentPages.length} content pages)`)

      // Step 2: Create individual component entry points for Vite SSR build
      logger.step(2, 'Preparing components for compilation...')
      const ssrDir = path.join(tempDir, 'ssr')
      await fs.mkdir(ssrDir, { recursive: true })

      const entryPoints: Record<string, string> = {}
      const routeMap = new Map<string, typeof routes[0]>()

      for (let i = 0; i < routes.length; i++) {
        const route = routes[i]
        const entryName = `route-${i}`
        const entryFile = path.join(ssrDir, `${entryName}.ts`)

        // Create entry file that exports the component
        const relativePath = path.relative(ssrDir, route.componentPath)
        await fs.writeFile(entryFile, `export * from '${relativePath.replace(/\\/g, '/')}'
export { default } from '${relativePath.replace(/\\/g, '/')}'`)

        entryPoints[entryName] = entryFile
        routeMap.set(entryName, route)
        logger.debug(`Created entry point: ${entryName} -> ${route.componentPath}`)
      }

      // Step 3: Build components using Vite SSR
      logger.step(3, 'Compiling TypeScript components...')
      const ssrOutDir = path.join(tempDir, 'compiled')

      try {
        // Build each component separately to ensure proper output
        await fs.mkdir(ssrOutDir, { recursive: true })

        // Don't change directory - stay in original project directory
        const originalCwd = process.cwd()

        try {
          for (const [entryName, entryFile] of Object.entries(entryPoints)) {
            logger.compile(`Building ${entryName}...`)

            // Create SSR-specific Vite config based on user's config
            const ssrViteConfig: InlineConfig = {
              ...baseViteConfig,
              configFile: false, // Don't load config file again
              logLevel: 'warn',
              root: originalCwd, // Use original project root
              // Filter out ductSSGPlugin to prevent recursion
              plugins: (baseViteConfig.plugins || []).filter((plugin: any) => 
                plugin?.name !== 'vite-plugin-duct-ssg'
              ),
              resolve: {
                ...(baseViteConfig.resolve || {}),
                extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
                // Keep original aliases as they are - they should work from the original root
                alias: baseViteConfig.resolve?.alias
              },
              build: {
                ssr: entryFile,
                outDir: path.resolve(tempDir, 'compiled'),
                rollupOptions: {
                  output: {
                    entryFileNames: `${entryName}.js`,
                    format: 'es'
                  }
                },
                emptyOutDir: false
              }
            }

            await viteBuild(ssrViteConfig)
          }
        } finally {
          // No need to restore directory since we didn't change it
        }

        logger.success(`Compiled to ${ssrOutDir}`)
      } catch (buildError) {
        logger.error('Vite SSR build failed:', buildError)
        throw buildError
      }

      // Step 4: Load compiled components and resolve dynamic routes
      logger.step(4, 'Resolving dynamic routes...')
      const componentLoader = async (componentPath: string) => {
        // Find the route entry that matches this component path
        for (const [entryName, route] of routeMap) {
          if (route.componentPath === componentPath) {
            const compiledPath = path.join(ssrOutDir, `${entryName}.js`)
            const fileUrl = new URL(`file://${compiledPath}`).href
            return await import(fileUrl)
          }
        }
        throw new Error(`Component not found: ${componentPath}`)
      }

      // First pass: Load all content pages to collect content
      const allContent = new Map<string, Array<ContentItem>>()

      for (const route of routes) {
        if (route.isContentPage) {
          // Handle content pages (__content__.tsx)
          try {
            const component = await componentLoader(route.componentPath) as ContentPageComponent
            logger.indent().info(`Loading content for ${route.componentPath}...`)

            // Get content directory from component or use default
            const contentDir = component.getContentDir?.() || 'content'

            // Get excerpt marker from config
            const excerptMarker = resolvedConfig.content?.excerptMarker || '<!--more-->'

            // Populate content routes
            await generator.populateContentRoutes(route, contentDir, cwd, excerptMarker)

            if (route.staticPaths) {
              logger.indent().success(`Found ${Object.keys(route.staticPaths).length} content pages`)
              logger.indent().debug(`Content files: ${route.contentFiles?.length || 0}`)
              logger.indent().debug(`Content directory: ${contentDir}`)

              // Store content for dynamic routes to use
              if (route.contentFiles) {
                const contentType = route.path.replace(/^\//, '') // Remove leading slash for content type key
                allContent.set(contentType, route.contentFiles)
              }
            } else {
              logger.indent().warn(`No static paths generated for ${route.componentPath}`)
            }
          } catch (error) {
            logger.indent().error(`Failed to load content for ${route.componentPath}:`, error instanceof Error ? error.message : String(error))
            route.staticPaths = {}
            route.contentFiles = []
          }
        }
      }

      // Second pass: Load dynamic routes (with access to all content)
      for (const route of routes) {
        if (route.isDynamic && !route.isContentPage) {
          // Handle regular dynamic routes ([sub].tsx)
          try {
            const component = await componentLoader(route.componentPath) as SubRouteComponent
            if (component.getRoutes) {
              logger.indent().info(`Loading routes for ${route.componentPath}...`)
              route.staticPaths = await component.getRoutes(allContent)
              logger.indent().success(`Found ${Object.keys(route.staticPaths).length} dynamic routes`)
            }
          } catch (error) {
            logger.indent().error(`Failed to load dynamic routes for ${route.componentPath}:`, error instanceof Error ? error.message : String(error))
            route.staticPaths = {}
          }
        }
      }

      // Step 5: Generate static pages
      logger.step(5, 'Generating static pages...')

      const router = new DuctRouter({
        pagesDir: resolvedPagesDir,
        layoutsDir: resolvedLayoutsDir,
        outDir: 'dist',
        baseUrl: '/',
        env: {
          buildTime: new Date().toISOString(),
          ...resolvedConfig.env
        },
        nunjucks: resolvedConfig.nunjucks,
        componentLoader
      })

      const pages = await router.generateStaticPages(routes)
      logger.success(`Generated ${pages.length} pages`)

      // Step 5.5: Generate debug pages.json file
      const pagesDebugFile = path.join(tempDir, 'pages.json')
      const debugData = {
        routes: routes.map(route => ({
          path: route.path,
          componentPath: path.relative(tempDir, route.componentPath),
          isDynamic: route.isDynamic,
          isContentPage: route.isContentPage || false,
          staticPaths: route.staticPaths || null,
          contentFilesCount: route.contentFiles?.length || 0
        })),
        pages: pages.map(page => ({
          path: page.path,
          componentPath: path.relative(tempDir, page.componentPath),
          isDynamic: page.isDynamic,
          fileName: page.path === '/' ? 'index.html' :
            page.componentPath.endsWith('/index.tsx') ?
              `${page.path.slice(1)}/index.html` :
              `${page.path.slice(1)}.html`
        }))
      }
      await fs.writeFile(pagesDebugFile, JSON.stringify(debugData, null, 2))

      // Step 6: Write generated HTML files as entry points
      logger.step(6, 'Writing HTML entry points...')

      const htmlDir = path.join(tempDir, 'html')
      await fs.mkdir(htmlDir, { recursive: true })

      const htmlEntries: Record<string, string> = {}

      for (const page of pages) {
        // Match source file structure: pages/xxx/index.tsx -> xxx/index.html, pages/xxx/sub.tsx -> xxx/route.html
        let fileName: string
        if (page.path === '/') {
          fileName = 'index.html'
        } else {
          const pathWithoutSlash = page.path.slice(1)
          // Check if this page comes from an index.tsx file
          if (page.componentPath.endsWith('/index.tsx')) {
            // pages/docs/index.tsx -> docs/index.html
            fileName = `${pathWithoutSlash}/index.html`
          } else {
            // pages/docs/sub.tsx with dynamic routes -> docs/button.html, docs/toggle.html
            fileName = `${pathWithoutSlash}.html`
          }
        }

        const filePath = path.join(htmlDir, fileName)

        // Create directory structure if needed
        await fs.mkdir(path.dirname(filePath), { recursive: true })

        await fs.writeFile(filePath, page.html)

        // Use the path without extension as entry key, preserving directory structure
        const entryKey = page.path === '/' ? 'index' : page.path.slice(1)
        htmlEntries[entryKey] = filePath
        logger.file(`${fileName} (from ${page.componentPath.endsWith('__content__.tsx') ? 'content page' : 'component'}: ${page.path})`)
      }

      logger.info('Vite entries summary:')
      for (const [entryKey, filePath] of Object.entries(htmlEntries)) {
        logger.indent().debug(`${entryKey} -> ${path.relative(cwd, filePath)}`)
      }

      // If --html-only flag is set, stop here
      if (htmlOnly) {
        logger.success('HTML generation complete!')
        logger.folder(`Generated files available in ${htmlDir}`)
        return
      }

      // Step 7: Run Vite build with HTML files as entry points
      logger.step(7, 'Building assets with Vite...')

      await viteBuild({
        configFile,
        build: {
          outDir: 'dist',
          rollupOptions: {
            input: htmlEntries
          }
        }
      })

      // Step 8: Move HTML files from dist/.duct/html to dist/ preserving directory structure
      logger.step(8, 'Moving HTML files to correct locations...')
      const distDir = path.join(cwd, 'dist')
      const distHtmlDir = path.join(distDir, '.duct', 'html')

      // Debug: Check what files exist in dist/.duct/html
      logger.debug(`Checking files in ${distHtmlDir}:`)
      try {
        const distHtmlFiles = await fs.readdir(distHtmlDir, { recursive: true })
        for (const file of distHtmlFiles) {
          logger.indent().debug(`Found: ${file}`)
        }
      } catch (error) {
        logger.indent().warn(`Directory ${distHtmlDir} doesn't exist or is empty`)
      }

      // Move all HTML files from dist/.duct/html to dist/
      for (const page of pages) {
        // Use same logic as above to determine fileName
        let fileName: string
        if (page.path === '/') {
          fileName = 'index.html'
        } else {
          const pathWithoutSlash = page.path.slice(1)
          // Check if this page comes from an index.tsx file
          if (page.componentPath.endsWith('/index.tsx')) {
            // pages/docs/index.tsx -> docs/index.html
            fileName = `${pathWithoutSlash}/index.html`
          } else {
            // pages/docs/sub.tsx with dynamic routes -> docs/button.html, docs/toggle.html
            // content pages like /blog/post-name -> blog/post-name.html
            fileName = `${pathWithoutSlash}.html`
          }
        }

        const sourcePath = path.join(distHtmlDir, fileName)
        const targetPath = path.join(distDir, fileName)

        logger.copy(`Attempting to move: ${fileName}`)
        logger.indent().debug(`Source: ${sourcePath}`)
        logger.indent().debug(`Target: ${targetPath}`)

        // Check if source file exists
        try {
          await fs.access(sourcePath)
        } catch (error) {
          logger.indent().error(`Source file not found: ${sourcePath}`)
          continue
        }

        // Create target directory if needed
        await fs.mkdir(path.dirname(targetPath), { recursive: true })

        // Move the file
        try {
          await fs.rename(sourcePath, targetPath)
          logger.indent().success(`Successfully moved ${fileName}`)
        } catch (error) {
          logger.indent().error(`Failed to move ${fileName}:`, error)
        }
      }

      // Clean up the temporary .duct directory in dist
      await fs.rm(path.join(distDir, '.duct'), { recursive: true, force: true })

      // Step 9: Copy content assets (images) as final step
      logger.step(9, 'Copying content assets...')

      // Scan the entire content directory for assets
      const assetExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.ico']
      const contentRootDir = resolvedConfig.contentDir
      let totalAssetsCopied = 0

      try {
        logger.info(`Scanning for assets in: ${contentRootDir}`)
        const assets = await findAssets(contentRootDir, assetExtensions)
        logger.info(`Found ${assets.length} assets: ${assets.map(a => path.relative(cwd, a)).join(', ')}`)

        for (const asset of assets) {
          // Calculate relative path from project root content directory
          const relativePath = path.relative(contentRootDir, asset)
          const targetPath = path.join(cwd, 'dist', relativePath)

          logger.info(`Asset copy: ${asset} -> ${targetPath}`)

          // Create target directory if needed
          await fs.mkdir(path.dirname(targetPath), { recursive: true })

          // Copy the asset
          await fs.copyFile(asset, targetPath)
          logger.indent().info(`Copied: ${relativePath}`)
          totalAssetsCopied++
        }

        if (totalAssetsCopied > 0) {
          logger.success(`Copied ${totalAssetsCopied} content assets`)
        } else {
          logger.info('No content assets found to copy')
        }
      } catch (error) {
        logger.warn('Failed to copy content assets:', error)
      }

      logger.success('Build complete!')

    } catch (error) {
      logger.error('Build failed:', error)
      logger.folder(`Debug files available in ${path.join(cwd, '.duct')}`)
      process.exit(1)
    }
  })