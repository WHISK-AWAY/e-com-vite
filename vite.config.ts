import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('react-hook-form')) {
            return 'hook-form';
          } else if (id.includes('zod')) {
            return 'zod';
          } else if (id.includes('react-query')) {
            return 'react-query';
          } else if (id.includes('react-select') || id.includes('emotion')) {
            return 'react-select';
          } else if (id.includes('chart')) {
            return 'chartjs';
          } else if (id.includes('stripe')) {
            return 'stripe';
          } else if (id.includes('framer')) {
            return 'framer';
          } else if (id.includes('fuse')) {
            return 'fuse';
          } else if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  publicDir: 'src/public',
});
