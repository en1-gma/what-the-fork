import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: '/bin/index.js',
      name: 'what-the-fork',
      formats: ['es'],
      fileName: () => 'index.js',
    },
  },
});
