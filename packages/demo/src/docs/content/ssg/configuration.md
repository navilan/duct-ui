## Configuration

Create an optional `duct.config.js` to customize paths:

```javascript
// duct.config.js
export default {
  pagesDir: 'src/pages',      // Default: 'src/pages'
  layoutsDir: 'src/layouts',  // Default: 'src/layouts'
  env: {
    // Environment variables available in components
    API_URL: process.env.API_URL,
    SITE_NAME: 'My Website'
  }
}
```