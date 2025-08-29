import * as path from 'path'
import * as fs from 'fs/promises'
import * as logger from '../logger.js'

export interface SitemapBuilderOptions {
  baseUrl: string
  excludePaths?: string[]
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export class SitemapBuilder {
  constructor(
    private outDir: string,
    private options: SitemapBuilderOptions
  ) {}

  async build(pages: Array<{ path: string; componentPath: string }>): Promise<void> {
    logger.info('Building sitemap...')
    
    const urls: SitemapUrl[] = []
    
    for (const page of pages) {
      if (this.shouldExcludePath(page.path)) {
        logger.debug(`Skipping excluded path from sitemap: ${page.path}`)
        continue
      }
      
      urls.push({
        loc: this.buildUrl(page.path),
        lastmod: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        changefreq: this.options.changefreq || 'weekly',
        priority: this.calculatePriority(page.path)
      })
    }
    
    // Generate sitemap.xml
    await this.writeSitemap(urls)
    
    // Generate robots.txt
    await this.writeRobotsTxt()
    
    logger.success(`Generated sitemap: ${urls.length} URLs`)
  }

  private shouldExcludePath(path: string): boolean {
    const excludePaths = this.options.excludePaths || []
    return excludePaths.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'))
        return regex.test(path)
      }
      return path.startsWith(pattern)
    })
  }

  private buildUrl(path: string): string {
    const baseUrl = this.options.baseUrl.replace(/\/$/, '') // Remove trailing slash
    return `${baseUrl}${path}`
  }

  private calculatePriority(path: string): number {
    if (this.options.priority !== undefined) {
      return this.options.priority
    }
    
    // Default priority calculation based on path depth and type
    if (path === '/') return 1.0
    
    const segments = path.split('/').filter(Boolean)
    const depth = segments.length
    
    // Higher priority for shallower pages
    if (depth === 1) return 0.8
    if (depth === 2) return 0.6
    return 0.4
  }

  private async writeSitemap(urls: SitemapUrl[]): Promise<void> {
    const xml = this.generateSitemapXml(urls)
    const sitemapPath = path.join(this.outDir, 'sitemap.xml')
    
    await fs.writeFile(sitemapPath, xml, 'utf-8')
    logger.debug(`Written sitemap to: ${sitemapPath}`)
  }

  private generateSitemapXml(urls: SitemapUrl[]): string {
    const urlElements = urls.map(url => `  <url>
    <loc>${this.escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority.toFixed(1)}</priority>
  </url>`).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`
  }

  private async writeRobotsTxt(): Promise<void> {
    const sitemapUrl = this.buildUrl('/sitemap.xml')
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}`

    const robotsPath = path.join(this.outDir, 'robots.txt')
    await fs.writeFile(robotsPath, robotsTxt, 'utf-8')
    logger.debug(`Written robots.txt to: ${robotsPath}`)
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }
}

interface SitemapUrl {
  loc: string
  lastmod: string
  changefreq: string
  priority: number
}