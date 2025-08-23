import { spawn } from 'child_process'
import * as path from 'path'
import * as fs from 'fs/promises'
import type { Plugin } from 'vite'
import mime from 'mime'
import { findAssets } from '@duct-ui/router'
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
 * Add all content files (assets and markdown) to Vite's watch list so changes trigger rebuilds
 */
async function addContentFilesToWatch(context: any) {
  try {
    const config = await loadConfig()
    const { contentDir } = resolveConfigPaths(config)
    const contentExtensions = ['.md', '.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.ico']

    // Find all content files in content directory
    const contentFiles = await findAssets(contentDir, contentExtensions)

    // Add each content file to Vite's watch list
    for (const contentFile of contentFiles) {
      context.addWatchFile(contentFile)
      logger.debug(`Watching content file: ${path.relative(process.cwd(), contentFile)}`)
    }

    logger.info(`Added ${contentFiles.length} content files (markdown & assets) to watch list`)
  } catch (error) {
    logger.warn('Failed to add content files to watch:', error)
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

/**
 * Copy content assets to dist directory for development
 */
async function copyContentAssets() {
  try {
    const config = await loadConfig()
    const { contentDir = 'content' } = resolveConfigPaths(config)
    const assetExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.ico']

    // Find all assets in content directory
    const assets = await findAssets(contentDir, assetExtensions)

    let copiedCount = 0
    for (const asset of assets) {
      // Calculate relative path from content directory
      const relativePath = path.relative(contentDir, asset)
      const targetPath = path.join(process.cwd(), 'dist', relativePath)

      // Create target directory if needed
      await fs.mkdir(path.dirname(targetPath), { recursive: true })

      // Copy the asset
      await fs.copyFile(asset, targetPath)
      copiedCount++
    }

    if (copiedCount > 0) {
      logger.info(`Copied ${copiedCount} content assets to dist/`)
    }
  } catch (error) {
    logger.warn('Failed to copy content assets:', error)
  }
}

export function ductSSGPlugin(): Plugin {
  let htmlDir: string
  let generatedHtml: Map<string, string> = new Map()
  let pageRoutes: Map<string, { componentPath: string, meta: any }> = new Map()
  let viteMode: string = 'development'

  return {
    name: 'vite-plugin-duct-ssg',

    configResolved(config) {
      viteMode = config.mode
    },

    async buildStart(options) {
      // Skip plugin execution during --html-only builds to prevent recursion
      if (process.env.DUCT_HTML_ONLY === 'true') {
        return
      }
      
      // Also skip if Vite mode is 'html_only'
      if (viteMode === 'html_only') {
        return
      }
      
      logger.build('Generating static pages for development...')

      // Add layout files to Vite's watch list
      await addLayoutFilesToWatch(this)

      // Add content files (markdown & assets) to Vite's watch list
      await addContentFilesToWatch(this)

      // Copy content assets for development
      await copyContentAssets()

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
        const { layoutsDir, contentDir } = resolveConfigPaths(config)
        const normalizedLayoutsDir = path.resolve(layoutsDir)
        const normalizedContentDir = path.resolve(contentDir)
        const normalizedChangedFile = path.resolve(changedFile)

        // Check if this is a content file (markdown or asset)
        const assetExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.ico']
        const isAsset = assetExtensions.some(ext => changedFile.toLowerCase().endsWith(ext))
        const isMarkdown = changedFile.toLowerCase().endsWith('.md')
        
        if (normalizedChangedFile.startsWith(normalizedContentDir)) {
          if (isAsset) {
            logger.info(`Content asset changed: ${path.relative(process.cwd(), changedFile)}`)
            
            try {
              // Re-copy the single asset file
              const relativePath = path.relative(contentDir, changedFile)
              const targetPath = path.join(process.cwd(), 'dist', relativePath)
              
              // Create target directory if needed
              await fs.mkdir(path.dirname(targetPath), { recursive: true })
              
              // Copy the asset
              await fs.copyFile(changedFile, targetPath)
              logger.success(`Updated asset: ${relativePath}`)
              
              // Trigger full page reload to reflect asset change
              ctx.server.ws.send({
                type: 'full-reload',
                path: '*'
              })
              
              // Return empty array to prevent default HMR
              return []
            } catch (error) {
              logger.error('Failed to update asset:', error)
              return []
            }
          } else if (isMarkdown) {
            logger.info(`Content markdown changed: ${path.relative(process.cwd(), changedFile)}`)
            logger.build('Regenerating static pages...')
            
            try {
              // Regenerate HTML files when markdown changes
              await runDuctBuild()
              await loadGeneratedHtml()
              
              logger.success('Static pages regenerated successfully')
              
              // Trigger full page reload to reflect content change
              ctx.server.ws.send({
                type: 'full-reload',
                path: '*'
              })
              
              // Return empty array to prevent default HMR
              return []
            } catch (error) {
              logger.error('Failed to regenerate static pages:', error)
              return []
            }
          }
        }

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
      // First middleware: serve assets from dist/assets and dist/content if they exist
      server.middlewares.use(async (req, res, next) => {
        let url = req.url?.split('?')[0] // Remove query params

        // Serve build assets
        if (url && url.startsWith('/assets/')) {
          const assetPath = path.join(process.cwd(), 'dist', url)
          try {
            const assetContent = await fs.readFile(assetPath)
            const contentType = mime.getType(url) || 'application/octet-stream'

            res.statusCode = 200
            res.setHeader('Content-Type', contentType)
            res.end(assetContent)
            return
          } catch (error) {
            // Asset not found in dist/assets, continue to next middleware
          }
        }

        // Serve search-index.json and sitemap.xml if configured
        try {
          const config = await loadConfig()
          
          if (url === '/search-index.json' && config.search?.enabled) {
            const searchIndexPath = path.join(process.cwd(), 'dist', 'search-index.json')
            try {
              const searchIndex = await fs.readFile(searchIndexPath, 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.setHeader('Cache-Control', 'no-cache')
              res.end(searchIndex)
              return
            } catch (error) {
              // Search index not found, will continue to next middleware
            }
          }
          
          if (url === '/sitemap.xml' && config.sitemap?.enabled) {
            const sitemapPath = path.join(process.cwd(), 'dist', 'sitemap.xml')
            try {
              const sitemap = await fs.readFile(sitemapPath, 'utf-8')
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/xml')
              res.setHeader('Cache-Control', 'no-cache')
              res.end(sitemap)
              return
            } catch (error) {
              // Sitemap not found, will continue to next middleware
            }
          }
        } catch (error) {
          // Config loading error, continue to next middleware
        }

        // Serve content assets (images from markdown content) - try any path for potential assets
        if (url) {
          const ext = path.extname(url).toLowerCase()
          const isAsset = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.ico'].includes(ext)
          
          if (isAsset) {
            const assetPath = path.join(process.cwd(), 'dist', url)
            try {
              const assetContent = await fs.readFile(assetPath)
              const contentType = mime.getType(url) || 'application/octet-stream'

              res.statusCode = 200
              res.setHeader('Content-Type', contentType)
              res.end(assetContent)
              return
            } catch (error) {
              // Asset not found, continue to next middleware
            }
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
        stdio: 'inherit',
        env: {
          ...process.env,
          DUCT_HTML_ONLY: 'true'
        }
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