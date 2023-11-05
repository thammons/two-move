import { defineConfig, BuildOptions } from 'vite';
const { resolve } = require('path');

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'two-move/html/home.html'),
        game: resolve(__dirname, 'two-move/html/game.html'),
        blockly: resolve(__dirname, 'two-move/html/blockly-builder.html'),
        
      },
    }
  }
})