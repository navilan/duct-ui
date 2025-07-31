/**
 * Duct CLI configuration
 * @type {import('@duct-ui/cli/config').DuctConfig}
 */
export default {
  pagesDir: 'src/pages',
  layoutsDir: 'src/layouts',
  env: {
    siteUrl: 'https://duct-ui.example.com',
    buildTime: new Date().toISOString()
  }
}