import { DateTime } from 'luxon'
import { parseMarkdown } from './src/markdown-parser.js'

export default {
  pagesDir: './src/pages',
  layoutsDir: './src/layouts',
  contentDir: './content',
  content: {
    excerptMarker: '<!--more-->',
    markdownParser: parseMarkdown
  },
  env: {
    siteName: 'Duct Starter',
    siteUrl: 'https://starter.duct-ui.org'
  },
  search: {
    enabled: true,
    generateIndex: true,
    indexPath: 'search-index.json',
    excludePaths: ['/404'],
    includeContent: true
  },
  nunjucks: {
    filters: {
      date: (date, format = 'LLL dd, yyyy') => {
        if (!date) return ''
        const dt = DateTime.fromISO(date)
        if (!dt.isValid) {
          // Try parsing as a regular date if ISO format fails
          const parsedDt = DateTime.fromJSDate(new Date(date))
          return parsedDt.isValid ? parsedDt.toFormat(format) : date
        }
        return dt.toFormat(format)
      }
    }
  }
}