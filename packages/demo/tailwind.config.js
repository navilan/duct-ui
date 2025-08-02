export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './index.html',
    // Custom extractor for markdown content in template literals
    {
      raw: '',
      extract: {
        tsx: (content) => {
          // Extract classes from template literals containing HTML
          const templateLiteralRegex = /`[\s\S]*?`/g
          const classRegex = /class="([^"]+)"/g
          const classes = new Set()
          
          let templateMatch
          while ((templateMatch = templateLiteralRegex.exec(content)) !== null) {
            const templateContent = templateMatch[0]
            let classMatch
            while ((classMatch = classRegex.exec(templateContent)) !== null) {
              classMatch[1].split(/\s+/).forEach(cls => {
                if (cls.trim()) classes.add(cls.trim())
              })
            }
          }
          
          return Array.from(classes)
        }
      }
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}