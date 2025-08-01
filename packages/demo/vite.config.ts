import { defineConfig } from "vite"
import { ductSSGPlugin } from "@duct-ui/cli/vite-plugin"

export default defineConfig({
  root: ".",
  server: {
    port: 3333,
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