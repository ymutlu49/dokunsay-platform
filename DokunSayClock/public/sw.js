// SÜRÜM YÜKSELTMESİ ŞART: activate kancası yalnız ADI TUTMAYAN önbellekleri siler.
// Sürüm sabit kalırsa daha önce siteyi açmış kullanıcılar ESKİ paketi görmeye devam eder.
// v1 → v2 (2026-07-19): AR/FA dilleri seçiciden gizlendi; sürüm yükseltilmezse mevcut
// kullanıcıların dil seçicisinde o iki dil durmaya devam ederdi. (Bu, denetim sırasında
// dev sunucuda da beni yanılttı: değişiklik doğruydu, servis çalışanı bayat paket sunuyordu.)
// v2 → v3 (2026-08-31): oturum kaydı eklendi (tahtadaki saat ve pullar artık saklanıyor).
// Sürüm yükseltilmezse eski kullanıcılar kaydetmeyen paketi kullanmaya devam ederdi.
const CACHE_VERSION = "dokun-say-clock-v3";
const ASSETS_CACHE = `${CACHE_VERSION}-assets`;

const PRECACHE_URLS = ["/DokunSayClock/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(ASSETS_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== ASSETS_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(ASSETS_CACHE).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
