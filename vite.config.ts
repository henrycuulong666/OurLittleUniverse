import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `base: './'` makes every asset URL relative, so the exact same build works at
// https://<user>.github.io/<any-repo-name>/ and at a custom domain root.
// Need an absolute sub-path instead? Build with:  VITE_BASE=/my-repo/ npm run build
export default defineConfig({
  base: process.env.VITE_BASE ?? './',
  plugins: [react()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
});
