import { Command } from 'commander'
import * as path from 'path'
import * as fs from 'fs/promises'
import { build as viteBuild } from 'vite'
import { RouteGenerator, DuctRouter } from '@duct-ui/router'
import type { SubRouteComponent } from '@duct-ui/router'
import { loadConfig, resolveConfigPaths } from '../config.js'

export const buildCommand = new Command('build')
  .description('Build Duct UI application with SSG')
  .option('-c, --config <file>', 'Vite config file', 'vite.config.ts')
  .option('--pages <dir>', 'Pages directory (overrides config)')
  .option('--layouts <dir>', 'Layouts directory (overrides config)')
  .option('--html-only', 'Generate HTML files only (skip Vite build)', false)
  .action(async (options) => {
    const { config: configFile, htmlOnly } = options
    const cwd = process.cwd()

    console.log('🏗️  Building Duct UI application with SSG...')

    try {
      // Load and resolve config
      const config = await loadConfig(cwd)
      const resolvedConfig = resolveConfigPaths(config, cwd)

      // Override with CLI options if provided
      const resolvedPagesDir = options.pages ? path.resolve(cwd, options.pages) : resolvedConfig.pagesDir
      const resolvedLayoutsDir = options.layouts ? path.resolve(cwd, options.layouts) : resolvedConfig.layoutsDir

      console.log(`📁 Pages directory: ${resolvedPagesDir}`)
      console.log(`🎨 Layouts directory: ${resolvedLayoutsDir}`)
      const tempDir = path.join(cwd, '.duct')

      // Step 1: Discover routes
      console.log('🔍 Discovering routes...')
      const generator = new RouteGenerator(resolvedPagesDir)
      const routes = await generator.discoverRoutes()
      console.log(`📄 Found ${routes.length} routes`)

      // Step 2: Create individual component entry points for Vite SSR build
      console.log('📝 Preparing components for compilation...')
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
      }

      // Step 3: Build components using Vite SSR
      console.log('⚡ Compiling TypeScript components...')
      const ssrOutDir = path.join(tempDir, 'compiled')

      try {
        // Build each component separately to ensure proper output
        await fs.mkdir(ssrOutDir, { recursive: true })

        // Change to .duct directory to avoid picking up project's vite config
        const originalCwd = process.cwd()
        process.chdir(tempDir)

        try {
          for (const [entryName, entryFile] of Object.entries(entryPoints)) {
            console.log(`  Building ${entryName}...`)

            await viteBuild({
              configFile: false, // Don't use any config file
              logLevel: 'warn',
              resolve: {
                extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
              },
              build: {
                ssr: entryFile,
                outDir: 'compiled',
                rollupOptions: {
                  output: {
                    entryFileNames: `${entryName}.js`,
                    format: 'es'
                  }
                },
                emptyOutDir: false
              }
            })
          }
        } finally {
          // Always restore original working directory
          process.chdir(originalCwd)
        }

        console.log(`  ✓ Compiled to ${ssrOutDir}`)
      } catch (buildError) {
        console.error('❌ Vite SSR build failed:', buildError)
        throw buildError
      }

      // Step 4: Load compiled components and resolve dynamic routes
      console.log('🔗 Resolving dynamic routes...')
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

      // Load dynamic routes
      for (const route of routes) {
        if (route.isDynamic) {
          try {
            const component = await componentLoader(route.componentPath) as SubRouteComponent
            if (component.getRoutes) {
              console.log(`  Loading routes for ${route.componentPath}...`)
              route.staticPaths = await component.getRoutes()
              console.log(`  Found ${Object.keys(route.staticPaths).length} dynamic routes`)
            }
          } catch (error) {
            console.warn(`⚠️  Failed to load dynamic routes for ${route.componentPath}:`, error instanceof Error ? error.message : String(error))
            route.staticPaths = {}
          }
        }
      }

      // Step 5: Generate static pages
      console.log('🎨 Generating static pages...')

      const router = new DuctRouter({
        pagesDir: resolvedPagesDir,
        layoutsDir: resolvedLayoutsDir,
        outDir: 'dist',
        baseUrl: '/',
        env: {
          buildTime: new Date().toISOString(),
          ...resolvedConfig.env
        },
        componentLoader
      })

      const pages = await router.generateStaticPages(routes)
      console.log(`✨ Generated ${pages.length} pages`)

      // Step 5.5: Generate debug pages.json file
      const pagesDebugFile = path.join(tempDir, 'pages.json')
      const debugData = {
        routes: routes.map(route => ({
          path: route.path,
          componentPath: path.relative(tempDir, route.componentPath),
          isDynamic: route.isDynamic,
          staticPaths: route.staticPaths || null
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
      console.log('📄 Writing HTML entry points...')

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
        console.log(`  ✓ ${fileName}`)
      }

      // If --html-only flag is set, stop here
      if (htmlOnly) {
        console.log('🎉 HTML generation complete!')
        console.log(`📁 Generated files available in ${htmlDir}`)
        return
      }

      // Step 7: Run Vite build with HTML files as entry points
      console.log('📦 Building assets with Vite...')

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
      console.log('📂 Moving HTML files to correct locations...')
      const distDir = path.join(cwd, 'dist')
      const distHtmlDir = path.join(distDir, '.duct', 'html')

      // Move all HTML files from dist/.duct/html to dist/
      for (const page of pages) {
        // Use same logic as above to determine fileName
        let fileName: string
        if (page.path === '/') {
          fileName = 'index.html'
        } else {
          const pathWithoutSlash = page.path.slice(1)
          if (page.componentPath.endsWith('/index.tsx')) {
            fileName = `${pathWithoutSlash}/index.html`
          } else {
            fileName = `${pathWithoutSlash}.html`
          }
        }

        const sourcePath = path.join(distHtmlDir, fileName)
        const targetPath = path.join(distDir, fileName)

        // Create target directory if needed
        await fs.mkdir(path.dirname(targetPath), { recursive: true })

        // Move the file
        await fs.rename(sourcePath, targetPath)
        console.log(`  ✓ Moved ${fileName}`)
      }

      // Clean up the temporary .duct directory in dist
      await fs.rm(path.join(distDir, '.duct'), { recursive: true, force: true })

      console.log('🎉 Build complete!')

    } catch (error) {
      console.error('❌ Build failed:', error)
      console.log(`📁 Debug files available in ${path.join(cwd, '.duct')}`)
      process.exit(1)
    }
  })