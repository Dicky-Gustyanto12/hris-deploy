import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // server: {
  //   proxy: {
  //     '/login': {
  //       target: 'http://api.hris.portfoliodigato.com',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //     '/logout': {
  //       target: 'http://api.hris.portfoliodigato.com',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //     '/sanctum': {
  //       target: 'http://api.hris.portfoliodigato.com',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //     '/api': {
  //       target: 'http://api.hris.portfoliodigato.com',
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
})
