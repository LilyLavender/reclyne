import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // Relative base so the build works on GitHub Pages or opened straight from dist/
  base: './',
  plugins: [vue()],
})
