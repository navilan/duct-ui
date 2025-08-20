import { defineConfig } from 'vite'
import { resolve } from 'path'
import { ductSSGPlugin } from '@duct-ui/cli/vite-plugin'

export default defineConfig({
  plugins: [
    ductSSGPlugin()
  ],
  resolve: {
    alias: {
      "@components": resolve(__dirname, "./src/components")
    }
  },
  css: {
    postcss: './postcss.config.js'
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      external: ['fs', 'path', 'url']
    }
  }
})