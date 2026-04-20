import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/DokunSayBasamak/',
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../_platform/shared'),
    },
  },
  server: {
    port: 3002,
    strictPort: true,
    host: true,
    fs: { allow: [path.resolve(__dirname, '..')] },
  },
});
