import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import tailwind from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  plugins: [vue()],
  base: '/',
  build: {
    emptyOutDir: true,
    target: 'modules',
    outDir: 'dist',
    rollupOptions: {
      input: './index.html',
    },
    minify: true,
    cssMinify: true
  },
  server: {
    host: true, 
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
