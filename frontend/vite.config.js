import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // Use base '/manufolio/' only for production builds (gh-pages), 
    // and '/' for local dev server
    base: command === 'build' ? '/manufolio/' : '/',
  }
})
