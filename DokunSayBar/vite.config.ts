import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || "/DokunSayBar/",
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../_platform/shared"),
    },
  },
  server: {
    port: 3001,
    strictPort: true,
    host: true,
    fs: {
      allow: [
        path.resolve(__dirname, ".."),
      ],
    },
  },
  build: {
    rollupOptions: {
      output: {
        /*
          three.js BİLEREK burada listelenmiyor.

          `manualChunks`in nesne biçimi, adı geçen paketi başlangıç grafiğinin
          parçası sayar ve Vite index.html'e `modulepreload` bağlantısı ekler.
          Sonuç: ARCameraView `lazy()` ile yüklendiği hâlde three.js (968 KB)
          her ziyarette, araç açılmadan önce iniyordu. Listeden çıkarılınca
          Rollup onu AR bileşeninin kendi tembel parçasına koyar; yani yalnızca
          kamera/AR görünümü gerçekten açıldığında inar.

          firebase kalıyor: AuthContext uygulama kökünde bağlı, gerçekten
          başlangıçta gerekiyor. Onu da ertelemek ayrı ve daha riskli bir iş.
        */
        manualChunks: {
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
        },
      },
    },
  },
});
