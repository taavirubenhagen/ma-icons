import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/component.ts'),
      name: 'MaIcons',
      formats: ['es', 'iife'],
      fileName: (format) => `ma-icons.${format}.js`
    },
    rollupOptions: {
      output: {
        globals: {
          // No external dependencies, but this is where you'd list them if needed
        }
      }
    }
  },
  publicDir: 'public'
});