import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/picsum': {
        target: 'https://picsum.photos',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/picsum/, '')
      }
    }
  },
  plugins: [react(),tailwindcss()],
})

