import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// Get __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Path alias configuration
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // You can add more aliases if needed:
      // '@components': path.resolve(__dirname, './src/components'),
      // '@api': path.resolve(__dirname, './src/api'),
    },
  },
  
  // Dev server configuration
  server: {
    port: 5173,
    open: true, // Automatically open browser
    proxy: {
      // Proxy API requests to backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})