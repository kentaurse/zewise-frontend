import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api/aigc': {
        target: 'http://119.45.125.226:8000/',
        changeOrigin: true
      },
      '/api': {
        target: 'http://119.45.125.226:3000/',
        changeOrigin: true
      },
      '/resources': {
        target: 'http://119.45.125.226:3000/',
        changeOrigin: true
      },
    }
  },
  plugins: [vue()]
})
