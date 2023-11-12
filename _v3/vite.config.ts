import { defineConfig, BuildOptions } from 'vite';
const { resolve } = require('path');

export default defineConfig({
  base: '/',
  root: './',
  plugins: [
    {
      name: 'replace-src-path',
      apply: 'build',

      enforce: 'post',
      generateBundle(_, bundle) {
        for (const outputItem of Object.values(bundle)) {
          const outputItemAny = (outputItem as any);
          if (outputItemAny.fileName && outputItemAny.fileName.endsWith('.html')) {
            outputItemAny.fileName = outputItemAny.fileName.replace('_html/', '')
          }
        }
      }
    }
  ],
  build: {
    assetsDir: 'assets',
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, '_html/home.html'),
        game: resolve(__dirname, '_html/game.html'),
        test: resolve(__dirname, '_html/test-page.html'),
        fourOhFour: resolve(__dirname, '_html/404.html'),
        blockly: resolve(__dirname, '_html/blockly-builder.html'),

      },
    }
  }

});