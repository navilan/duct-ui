// @ts-nocheck
import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  root: ".",
  server: {
    port: 3000
  },
  // Add multiple entry points for the demo
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {
        button: resolve(__dirname, "examples/button/index.html")
      },
      output: {
        format: "es",
        dir: "dist",
      }
    }
  },
})