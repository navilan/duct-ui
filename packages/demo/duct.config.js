/**
 * Duct CLI configuration
 * @type {import('@duct-ui/cli/config').DuctConfig}
 */
export default {
  pagesDir: 'src/pages',
  layoutsDir: 'src/layouts',
  contentDir: 'content',
  env: {
    SITE_NAME: 'Duct UI',
    SITE_URL: 'https://duct-ui.org',
    repository: 'https://github.com/navilan/duct-ui'
  },
  nunjucks: {
    filters: {
      // Date formatting filter
      date(dateString, format = 'MMMM D, YYYY') {
        if (!dateString) return ''

        const date = new Date(dateString)
        if (isNaN(date.getTime())) return dateString

        // Simple date formatting - can be enhanced with libraries like date-fns
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }

        // Adjust format based on parameter
        if (format.includes('MMM') && !format.includes('MMMM')) {
          options.month = 'short'
        }

        return date.toLocaleDateString('en-US', options)
      },

      // Markdown-to-excerpt filter
      excerpt(content, length = 150) {
        if (!content) return ''

        // Remove markdown syntax and HTML tags
        const text = content
          .replace(/#{1,6}\s/g, '') // Remove headers
          .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
          .replace(/\*(.*?)\*/g, '$1') // Remove italic
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links
          .replace(/<[^>]+>/g, '') // Remove HTML tags
          .replace(/\n+/g, ' ') // Replace newlines with spaces
          .trim()

        if (text.length <= length) return text

        // Find last word boundary before length limit
        const truncated = text.substring(0, length)
        const lastSpace = truncated.lastIndexOf(' ')
        return truncated.substring(0, lastSpace) + '...'
      },

      // Slugify filter for URLs
      slug(text) {
        if (!text) return ''
        return text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/--+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '')
      },

      // Range filter for generating number sequences (useful for pagination)
      range(start, stop, step = 1) {
        const arr = []
        for (let i = start; i < stop; i += step) {
          arr.push(i)
        }
        return arr
      },

      // Min filter to get minimum value
      min(...values) {
        return Math.min(...values.filter(v => v !== undefined && v !== null))
      }
    },

    globals: {
      // Current year for copyright
      currentYear: new Date().getFullYear(),

      // Site-wide constants
      site: {
        name: 'Duct UI',
        tagline: 'Explicit, Predictable Web Components',
        url: 'https://duct-ui.org'
      }
    },

    options: {
      autoescape: true,
      trimBlocks: true,
      lstripBlocks: true,
      throwOnUndefined: false // Allow graceful handling of missing variables
    }
  },

  // Content configuration
  content: {
    // Marker to indicate end of excerpt in markdown files
    // When present, content before the marker becomes the excerpt
    excerptMarker: '<!--more-->'
  }
}