import { defineConfig } from 'vite';
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/ma-icons.js"),
      name: 'MaIcons',
      formats: ['es', 'iife'],
      fileName: (format) => `ma-icons.${format}.js`
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    },
    target: "esnext",
    minify: "esbuild",
    emptyOutDir: true,
  }
});
