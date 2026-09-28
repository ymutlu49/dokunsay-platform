import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * DokunSay Problem — Vite 6 (STANDARDS §2.1).
 * build-site.js BASE_PATH'i `${SITE_BASE}DokunSayProblem/` olarak verir; tek başına
 * derlemede de doğru alt yol kalsın diye varsayılan klasör adıdır.
 * PWA bilinçli olarak YOK (Zihinden'de servis çalışanı üretimde boş sayfa açmıştı).
 */
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/DokunSayProblem/',
  resolve: {
    alias: { '@shared': path.resolve(__dirname, '../_platform/shared') },
  },
  server: {
    port: 3009,
    strictPort: true,
    host: true,
    fs: { allow: [path.resolve(__dirname, '..')] },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: { output: { manualChunks: { react: ['react', 'react-dom'] } } },
  },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
} as never);
