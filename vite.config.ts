import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy `/api` to the Express server
      '/api': {
        target: 'http://localhost:3000', // Express server running at port 3000
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Optional: rewrite `/api` if needed
      }
    }
  }
})
