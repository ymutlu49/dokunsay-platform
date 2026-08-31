/**
 * DokunSay Platform — Uygulama Listesi (tek doğruluk kaynağı)
 *
 * Hangi uygulamanın hangi klasöre derlendiği yalnızca burada yazar.
 * Hem site derleyicisi (`scripts/build-site.js`) hem de araç kataloğunun
 * sınamaları (`launcher/src/tools.test.js`) bu listeyi okur.
 *
 * Neden ayrı bir dosya: katalogda `prodPath` diye ikinci bir yol alanı vardı
 * ve derlenen klasörlerle sessizce ayrışmıştı — Kesir, Tam ve Veri için var
 * olmayan yolları gösteriyordu (/DokunSayFraction/, /DokunSayExact/,
 * /dokunsay-veri/). Fırlatıcı `folder` alanını kullandığı için döşemeler
 * çalışmaya devam etti ve hata yıllarca görünmedi. Yol artık tek yerde durur.
 */

/** @typedef {{ dir: string, name: string, folder: string, id: string | null }} Uygulama */

/** Launcher dahil, derlenen her şey. `folder: ''` = sitenin kökü. */
export const APPS = [
  { dir: '_platform/launcher', name: 'Launcher', folder: '',                   id: null },
  { dir: 'DokunSayBar',        name: 'Bar',      folder: 'DokunSayBar',        id: 'bar' },
  { dir: 'DokunSayBasamak',    name: 'Basamak',  folder: 'DokunSayBasamak',    id: 'basamak' },
  { dir: 'DokunSayClock',      name: 'Clock',    folder: 'DokunSayClock',      id: 'clock' },
  { dir: 'DokunSayKesir',      name: 'Kesir',    folder: 'DokunSayKesir',      id: 'kesir' },
  { dir: 'DokunSayTam',        name: 'Tam',      folder: 'DokunSayTam',        id: 'tam' },
  { dir: 'Dokunsay-geo',       name: 'Geo',      folder: 'Dokunsay-geo',       id: 'geo' },
  { dir: 'Dokunsay-veri-app',  name: 'Veri',     folder: 'Dokunsay-veri-app',  id: 'veri' },
  { dir: 'ZihindenAritmetik',  name: 'Zihinden', folder: 'ZihindenAritmetik',  id: 'zihinden' },
];

/** Katalogdaki araç id'sinden derlenen klasöre eşleme. */
export const KLASOR = Object.fromEntries(
  APPS.filter((a) => a.id).map((a) => [a.id, a.folder]),
);
