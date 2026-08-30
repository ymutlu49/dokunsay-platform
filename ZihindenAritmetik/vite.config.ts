import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * PWA olarak kurulur: telefon, tablet, masaüstü ve akıllı tahtada aynı kod.
 *
 * Taban yolu: DokunSay platformu derlerken `BASE_PATH` verir (ör.
 * `/ZihindenAritmetik/`); tek başına derlendiğinde göreli yol kullanılır,
 * böylece uygulama alan adının kökünde de bir alt klasörde de çalışır.
 * Yönlendirme HashRouter iledir; sunucu tarafında yeniden yazma kuralı
 * gerekmez ve dosyadan açıldığında da çalışır.
 */
export default defineConfig({
  base: process.env.BASE_PATH || './',
  // DokunSay platformunda her aracin kendi dev portu vardir (3001'den baslar).
  server: { port: 3008, host: true },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'simge-180.png'],
      workbox: {
        // 58 etkinlik görseli dahil tüm kabuk çevrimdışı kullanılabilir olur
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
      manifest: {
        name: 'Zihinden Aritmetik',
        short_name: 'Zihinden',
        description:
          'Zihinden Aritmetik kitabının sınıf uygulama aracı: sayı konuşması dizileri, 58 etkinlik kartı ve sekiz canlı model.',
        lang: 'tr-TR',
        dir: 'ltr',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        background_color: '#F7F9FA',
        theme_color: '#1B4965',
        categories: ['education'],
        icons: [
          { src: 'simge-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'simge-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'simge-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
