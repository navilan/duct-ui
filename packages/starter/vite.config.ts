import { defineConfig } from 'vite'
import { resolve } from 'path'
import { ductSSGPlugin } from '@duct-ui/cli/vite-plugin'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig({
  plugins: [
    ductSSGPlugin(),
    cloudflare({
      experimentalJsonConfig: true,
      routes: [
        {
          pattern: "/api/*",
          target: "worker"
        }
      ]
    })
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