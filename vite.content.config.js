import { defineConfig } from 'vite'
import { r, commonConfig } from './vite.config'



// bundling the content script
export default defineConfig({
  ...commonConfig,
  build: {
    watch: {},
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: false,
    outDir: r('local/contentScript'),
    rollupOptions: {
      input: {
        contentScript: r('src/contentScript/index.ts'),
      },
      output: {
        assetFileNames: '[name].[ext]',
        entryFileNames: 'index.js',
        extend: true,
        format: 'iife'
      },
    },
  }
})
