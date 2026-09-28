/**
 * İÇERİK GEÇİDİ — arayüzün içerik motoruna tek bağlantı noktası.
 *
 * Gerçek motor (`src/content/index.ts`) hazır olduğunda AŞAĞIDAKİ TEK SATIRI değiştir:
 *   export * from '../dev/contentStub';   →   export * from '../content';
 * Arayüz hiçbir yerde `../content` ya da `../dev/contentStub`'ı doğrudan içe aktarmaz
 * (yalnız sözleşme tipleri `../content/types`); tüm çağrılar `contentAdapter.ts` üzerinden
 * geçer ve oradaki normalleştirme küçük biçim farklarını (boolean ↔ {ok}, dizi ↔ nesne)
 * tolere eder.
 */
export * from '../content';
