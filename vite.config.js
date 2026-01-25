import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/ma-icons.js',
      name: 'MaIcons',
      formats: ['es'],
      fileName: () => 'ma-icons.js'
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});
