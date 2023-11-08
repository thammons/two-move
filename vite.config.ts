import { defineConfig, BuildOptions } from 'vite';
const { resolve } = require('path');

export default defineConfig({
  plugins: [
    {
      name: 'replace-src-path',
      apply: 'build',
      enforce: 'post',
      generateBundle(_, bundle) {
        for (const outputItem of Object.values(bundle)) {
          if (outputItem.fileName.endsWith('.html')) {
            outputItem.fileName = outputItem.fileName.replace('two-move/html/', '')
          }
        }
      }
    }
  ],
  build: {
    assetsDir: 'dist',
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'two-move/html/home.html'),
        game: resolve(__dirname, 'two-move/html/game.html'),
        fourOhFour: resolve(__dirname, 'two-move/html/404.html'),
        blockly: resolve(__dirname, 'two-move/html/blockly-builder.html'),
        
      },
    }
  }
})