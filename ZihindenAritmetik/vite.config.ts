import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  resolve: {
    // Platformun ortak kabugu (AppShell, LangSwitcher) diger yedi aracla ayni yerden gelir.
    alias: { '@shared': path.resolve(__dirname, '../_platform/shared') },
    // Ortak dosyalar uygulama klasorunun disinda durur ve orada node_modules
    // yoktur; react'i bu uygulamanin kopyasindan cozdur. (Diger araclar Vite 6
    // kullandigi icin buna ihtiyac duymuyor; Vite 8'in cozumleyicisi katidir.)
    dedupe: ['react', 'react-dom'],
  },
  // DokunSay platformunda her aracin kendi dev portu vardir (3001'den baslar).
  server: { port: 3008, host: true, fs: { allow: [path.resolve(__dirname, '..')] } },
  plugins: [
    react(),
    VitePWA({
      // Servis calisani gecici olarak kapali (kendini kaldiran surum).
      //
      // Ilk uretim dagitiminda eksik bir on-bellekle kayitli kalan servis
      // calisani, ikinci dagitimda eski varliklar silinince sayfayi bos
      // acmaya basladi. selfDestroying, daha once kayitli olan calisani ve
      // onbellegini ziyaretcinin tarayicisindan temizler; sayfa yeniden
      // acilir hale gelir.
      //
      // Cevrimdisi destegi yeniden acilmadan once gercek bir tarayicida
      // sinanmalidir (gomulu onizleme paneli servis calisani kaydina izin
      // vermiyor, bu yuzden burada dogrulanamiyor).
      selfDestroying: true,
      // Kayit betigi enjekte EDILMEZ. Edilirse sayfa her acilista kendini
      // kaldiran calisani yeniden kaydeder; calisan kendini kaldirip sayfayi
      // yeniler ve dongu olusur. Daha once kayitli olan ziyaretcilerde
      // tarayici sw.js'i kendisi yeniden getirir ve temizlik boylece calisir.
      injectRegister: false,
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
