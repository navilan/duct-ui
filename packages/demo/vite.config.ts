// @ts-nocheck
import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  root: ".",
  server: {
    port: 3333
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html")
      },
      output: {
        format: "es",
        dir: "dist",
      }
    }
  },
})