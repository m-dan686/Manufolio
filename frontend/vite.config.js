import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react()],
    // Base defaults to '/' for Vercel / root domain deployments
    // (can be overridden via VITE_BASE_PATH if deploying to a subpath)
    base: process.env.VITE_BASE_PATH || '/',
  }
})
