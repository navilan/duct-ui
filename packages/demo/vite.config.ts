import { defineConfig } from "vite"
import { resolve } from "path"
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
      input: {
        main: resolve(__dirname, "index.html"),
        "404": resolve(__dirname, "404.html"),
      },
      output: {
        format: "es",
        dir: "dist",
      },
    }
  },
})