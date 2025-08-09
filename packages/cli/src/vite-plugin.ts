import { spawn } from 'child_process'
import * as path from 'path'
import * as fs from 'fs/promises'
import type { Plugin } from 'vite'
import { loadConfig, resolveConfigPaths } from './config.js'
import * as logger from './logger.js'

/**
 * Add all layout files to Vite's watch list so changes trigger rebuilds
 */
async function addLayoutFilesToWatch(context: any) {
  try {
    const config = await loadConfig()
    const { layoutsDir } = resolveConfigPaths(config)

    // Find all layout files
    const layoutFiles = await findLayoutFiles(layoutsDir)

    // Add each layout file to Vite's watch list
    for (const layoutFile of layoutFiles) {
      context.addWatchFile(layoutFile)
      logger.debug(`Watching layout file: ${path.relative(process.cwd(), layoutFile)}`)
    }

    logger.info(`Added ${layoutFiles.length} layout files to watch list`)
  } catch (error) {
    logger.warn('Failed to add layout files to watch:', error)
  }
}

/**
 * Recursively find all layout files in the layouts directory
 */
async function findLayoutFiles(layoutsDir: string): Promise<string[]> {
  const results: string[] = []

  try {
    const entries = await fs.readdir(layoutsDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(layoutsDir, entry.name)

      if (entry.isDirectory()) {
        const subFiles = await findLayoutFiles(fullPath)
        results.push(...subFiles)
      } else if (entry.name.endsWith('.html')) {
        results.push(fullPath)
      }
    }
  } catch (error) {
    // Directory might not exist
    logger.debug(`Layout directory not found: ${layoutsDir}`)
  }

  return results
}

export function ductSSGPlugin(): Plugin {
  let htmlDir: string
  let generatedHtml: Map<string, string> = new Map()
  let pageRoutes: Map<string, { componentPath: string, meta: any }> = new Map()

  return {
    name: 'vite-plugin-duct-ssg',

    async buildStart() {
      logger.build('Generating static pages for development...')

      // Add layout files to Vite's watch list
      await addLayoutFilesToWatch(this)

      // Run the Duct CLI to generate HTML files
      await runDuctBuild()

      // Load generated HTML files into memory
      htmlDir = path.join(process.cwd(), '.duct/html')
      await loadGeneratedHtml()

      // Load page metadata from pages.json
      try {
        const pagesJson = await fs.readFile(path.join(process.cwd(), '.duct/pages.json'), 'utf-8')
        const pagesData = JSON.parse(pagesJson)

        // Build page routes map
        for (const page of pagesData.pages) {
          pageRoutes.set(page.path, {
            componentPath: page.componentPath,
            meta: {}
          })
        }
      } catch (error) {
        logger.warn('Failed to load pages.json:', error)
      }

      logger.success(`Loaded ${generatedHtml.size} static pages:`)
      for (const [path, _] of generatedHtml) {
        logger.indent().info(`${path}`)
      }
    },

    resolveId(id) {
      // Handle virtual reanimation modules
      if (id.startsWith('/@duct/reanimate/')) {
        return id
      }
      return null
    },

    load(id) {
      // Generate reanimation script for virtual modules
      if (id.startsWith('/@duct/reanimate/')) {
        const pagePath = id.replace('/@duct/reanimate', '').replace('.js', '')
        const normalizedPath = pagePath === '/index' ? '/' : pagePath

        const pageInfo = pageRoutes.get(normalizedPath)
        if (!pageInfo) {
          logger.warn(`No page info found for ${normalizedPath}`)
          return null
        }

        // Generate the reanimation script
        const componentPath = pageInfo.componentPath.replace(/\\/g, '/')
        let importPath: string

        if (componentPath.startsWith('.duct/')) {
          importPath = `/${componentPath}`
        } else if (componentPath.startsWith('src/')) {
          importPath = `/${componentPath}`
        } else {
          importPath = `/src/${componentPath}`
        }

        logger.debug(`Generating reanimation for ${normalizedPath}: ${importPath}`)

        return `
import { reanimate } from '@duct-ui/core'
import PageComponent from '${importPath}'

document.addEventListener('DOMContentLoaded', () => {
  reanimate(PageComponent, {
    rootElement: '#app',
    clearContent: true,
    meta: ${JSON.stringify(pageInfo.meta || {})},
    env: ${JSON.stringify({})} // TODO: Load from config
  })
})
`
      }
      return null
    },

    async handleHotUpdate(ctx) {
      // Check if the changed file is a layout file
      const changedFile = ctx.file

      try {
        const config = await loadConfig()
        const { layoutsDir } = resolveConfigPaths(config)
        const normalizedLayoutsDir = path.resolve(layoutsDir)
        const normalizedChangedFile = path.resolve(changedFile)

        // Only process if the changed file is within the layouts directory and is an HTML file
        if (normalizedChangedFile.startsWith(normalizedLayoutsDir) && changedFile.endsWith('.html')) {
          logger.info(`Layout file changed: ${path.relative(process.cwd(), changedFile)}`)
          logger.build('Regenerating static pages...')

          try {
            // Regenerate HTML files
            await runDuctBuild()
            await loadGeneratedHtml()

            logger.success('Static pages regenerated successfully')

            // Trigger full page reload since layout changes affect multiple pages
            ctx.server.ws.send({
              type: 'full-reload'
            })

            // Return empty array to prevent default HMR
            return []
          } catch (error) {
            logger.error('Failed to regenerate static pages:', error)
            return []
          }
        }
      } catch (error) {
        // If we can't load config, just use default HMR
        logger.debug('Could not load config for layout file check:', error)
      }

      // For other files, use default HMR behavior
      return undefined
    },

    configureServer(server) {
      // First middleware: serve assets from dist/assets if they exist
      server.middlewares.use(async (req, res, next) => {
        let url = req.url?.split('?')[0] // Remove query params

        if (url && url.startsWith('/assets/')) {
          const assetPath = path.join(process.cwd(), 'dist', url)
          try {
            const assetContent = await fs.readFile(assetPath)
            const ext = path.extname(url).toLowerCase()

            // Set appropriate content type
            let contentType = 'application/octet-stream'
            if (ext === '.svg') contentType = 'image/svg+xml'
            else if (ext === '.png') contentType = 'image/png'
            else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
            else if (ext === '.ico') contentType = 'image/x-icon'
            else if (ext === '.css') contentType = 'text/css'
            else if (ext === '.js') contentType = 'application/javascript'

            res.statusCode = 200
            res.setHeader('Content-Type', contentType)
            res.end(assetContent)
            return
          } catch (error) {
            // Asset not found in dist/assets, continue to next middleware
          }
        }

        next()
      })

      // Second middleware: serve HTML pages
      server.middlewares.use(async (req, res, next) => {
        let url = req.url?.split('?')[0] // Remove query params

        // Skip static assets and special routes
        if (!url ||
          url.startsWith('/src/') ||
          url.startsWith('/assets/') ||
          url.startsWith('/@') ||
          url.startsWith('/node_modules/') ||
          url === '/favicon.ico') {
          return next()
        }

        // Try different path variations to find matching HTML
        const pathsToTry = []

        if (url === '/') {
          pathsToTry.push('/index.html')
        } else {
          // For naked URLs like /docs, /demos, try index.html first
          pathsToTry.push(`${url}/index.html`)
          pathsToTry.push(`${url}.html`)
          // Also try with .html extension if not present
          if (!url.endsWith('.html')) {
            pathsToTry.push(`${url}.html`)
          } else {
            pathsToTry.push(url)
          }
        }

        // Try each path variation
        for (const htmlPath of pathsToTry) {
          const htmlContent = generatedHtml.get(htmlPath)
          if (htmlContent) {
            // Inject Vite client for HMR
            const htmlWithViteClient = htmlContent.replace(
              '</head>',
              '<script type="module" src="/@vite/client"></script></head>'
            )

            res.statusCode = 200
            res.setHeader('Content-Type', 'text/html')
            res.end(htmlWithViteClient)
            return
          }
        }

        // Fall back to next middleware
        next()
      })
    }
  }

  async function runDuctBuild(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Default to node_modules path
      const ductCliPath = path.join(process.cwd(), 'node_modules/@duct-ui/cli/dist/cli.js')

      // Run the CLI build command, but only up to HTML generation
      const proc = spawn('node', [ductCliPath, 'build', '--html-only'], {
        cwd: process.cwd(),
        stdio: 'inherit'
      })

      proc.on('exit', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Duct CLI exited with code ${code}`))
        }
      })

      proc.on('error', (err) => {
        reject(err)
      })
    })
  }

  async function loadGeneratedHtml(): Promise<void> {
    try {
      const files = await findHtmlFiles(htmlDir)

      for (const file of files) {
        const content = await fs.readFile(file, 'utf-8')
        // Store with path relative to htmlDir, prefixed with /
        const relativePath = '/' + path.relative(htmlDir, file).replace(/\\/g, '/')
        generatedHtml.set(relativePath, content)
      }
    } catch (error) {
      logger.warn('Failed to load generated HTML:', error)
    }
  }

  async function findHtmlFiles(dir: string): Promise<string[]> {
    const results: string[] = []

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)

        if (entry.isDirectory()) {
          const subFiles = await findHtmlFiles(fullPath)
          results.push(...subFiles)
        } else if (entry.name.endsWith('.html')) {
          results.push(fullPath)
        }
      }
    } catch (error) {
      // Directory might not exist yet
    }

    return results
  }
}