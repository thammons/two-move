import { defineConfig, BuildOptions } from 'vite';
const { resolve } = require('path');

export default defineConfig({
  base: '/',
  root: './',
  // plugins: [
  //   {
  //     name: 'replace-src-path',
  //     apply: 'build',

  //     enforce: 'post',
  //     generateBundle(_, bundle) {
  //       for (const outputItem of Object.values(bundle)) {
  //         const outputItemAny = (outputItem as any);
  //         if (outputItemAny.fileName && outputItemAny.fileName.endsWith('.html')) {
  //           outputItemAny.fileName = outputItemAny.fileName.replace('two-move/_html/', '')
  //         }
  //       }
  //     }
  //   }
  // ],
  build: {
    assetsDir: 'assets',
    outDir: 'dist',
    // rollupOptions: {
    //   input: {
    //     main: resolve(__dirname, 'index.html'),
    //     home: resolve(__dirname, 'two-move/_html/home.html'),
    //     game: resolve(__dirname, 'two-move/_html/game.html'),
    //     test: resolve(__dirname, 'two-move/_html/test-page.html'),
    //     fourOhFour: resolve(__dirname, 'two-move/_html/404.html'),
    //     blockly: resolve(__dirname, 'two-move/_html/blockly-builder.html'),

    //   },
    // }
  },
  resolve: {
    alias: {
      '/@': resolve(__dirname, './src')
    }
  }

});