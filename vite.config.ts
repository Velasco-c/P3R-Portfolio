import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Static assets in /public (fonts, videos, audio, images) are served from the
// site root and are not processed by Vite, so their URLs stay stable.
export default defineConfig({
  base: '/P3R-Portfolio/',
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
    sourcemap: false,
  },
});