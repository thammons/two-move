import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    // other plugins...
    // require('tsconfig-paths/register')
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})