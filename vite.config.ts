import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svgLoader from 'vite-svg-loader'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),svgLoader()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    },
    https: {
      minVersion: 'TLSv1.2',
      maxVersion: 'TLSv1.3',
      cert: fs.readFileSync('./cert.pem'),
      key: fs.readFileSync('./key.pem'),
      passphrase: 'test test test'
    }
  },
  build: {
    outDir: 'dist/client'
  }
})
