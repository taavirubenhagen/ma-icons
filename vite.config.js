import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/ma-icons.js',
      name: 'MaIcons',
      formats: ['es', 'iife'],
      fileName: (format) => `ma-icons.${format}.js`
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});
