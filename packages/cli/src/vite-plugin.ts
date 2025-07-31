import { spawn } from 'child_process'
import * as path from 'path'
import * as fs from 'fs/promises'
import type { Plugin } from 'vite'
import { loadConfig, resolveConfigPaths } from './config'

export function ductSSGPlugin(): Plugin {
  let htmlDir: string
  let generatedHtml: Map<string, string> = new Map()
  
  return {
    name: 'vite-plugin-duct-ssg',
    
    async buildStart() {
      console.log('🏗️  Generating static pages for development...')
      
      // Run the Duct CLI to generate HTML files
      await runDuctBuild()
      
      // Load generated HTML files into memory
      htmlDir = path.join(process.cwd(), '.duct/html')
      await loadGeneratedHtml()
      
      console.log(`✅ Loaded ${generatedHtml.size} static pages`)
    },
    
    configureServer(server) {
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
      console.warn('Failed to load generated HTML:', error)
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