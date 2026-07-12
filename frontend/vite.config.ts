import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// configure vite plugins
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
