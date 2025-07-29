// @ts-nocheck
import { defineConfig } from "vite"
import { resolve } from "path"

function ductDemosPlugin() {
  return {
    name: "duct-demos-plugin",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url.startsWith('/docs/') && !req.url.endsWith('.html')) {
          req.url = '/docs.html';
        }
        next();
      });
    }
  }
}

export default defineConfig({
  root: ".",
  server: {
    port: 3333,
  },
  plugins: [
    ductDemosPlugin()
  ],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        docs: resolve(__dirname, "demos-8252.html"),
        "404": resolve(__dirname, "404.html")
      },
      output: {
        format: "es",
        dir: "dist",
      }
    }
  },
})