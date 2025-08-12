import { defineConfig } from "vite"
import { resolve } from "path"
import { ductSSGPlugin } from "@duct-ui/cli/vite-plugin"

export default defineConfig({
  root: ".",
  server: {
    port: 3333,
  },
  resolve: {
    alias: {
      "@components": resolve(__dirname, "./src/components")
    }
  },
  plugins: [
    ductSSGPlugin()
  ],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        format: "es",
        dir: "dist",
      },
    }
  },
})