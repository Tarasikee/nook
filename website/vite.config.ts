import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  resolve: {
    alias: {
      '@nook/core': fileURLToPath(new URL('../packages/core/src/index.ts', import.meta.url))
    }
  }
})
