import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    allowedHosts: [
      'de09-2409-40e3-3d4-ba-d53b-b697-3af7-f601.ngrok-free.app' // Yeh wala URL add karein
    ]
  }
})
