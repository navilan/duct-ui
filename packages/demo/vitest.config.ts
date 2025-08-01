import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts']
  },
  resolve: {
    conditions: ['node', 'import', 'module']
  }
})