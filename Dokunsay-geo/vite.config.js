import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// GitHub Pages: site proje alt yolunda yayınlanır (https://<user>.github.io/<repo>/).
// BASE_PATH ortam değişkeni CI tarafından "/dokunsay-geo/" olarak geçilir; lokalde "/" kullanılır.
export default defineConfig({
  base: process.env.BASE_PATH || "/Dokunsay-geo/",
  plugins: [react()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "../_platform/shared"),
    },
  },
  server: {
    port: 3006,
    strictPort: true,
    host: true,
    fs: { allow: [path.resolve(__dirname, "..")] },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 900,
  },
});
