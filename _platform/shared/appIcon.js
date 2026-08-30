/**
 * DokunSay Platform — Ortak Favicon Üretici
 *
 * Tüm uygulamalar aynı şekil-yapısında favicon kullanır:
 *   yuvarlatılmış kare + accent gradient + büyük emoji.
 *
 * Tarayıcı sekmesinde görünür ve tutarlı bir kimlik sağlar.
 *
 * Kullanım:
 *   import { setAppFavicon } from '@shared/appIcon.js';
 *   setAppFavicon('bar');  // veya 'kesir', 'tam', vs.
 *
 * Tek satır — main.jsx/main.tsx içinde mount öncesi çağrılır.
 */

import { APP_ACCENTS } from './palette.js';

const APP_EMOJI = {
  bar:      '🧮',
  basamak:  '🔢',
  clock:    '🕐',
  kesir:    '🍕',
  tam:      '±',
  geo:      '🔺',
  veri:     '📊',
};

const SLUG_TO_APPID = {
  DokunSayBar: 'bar',
  DokunSayBasamak: 'basamak',
  DokunSayClock: 'clock',
  DokunSayKesir: 'kesir',
  DokunSayTam: 'tam',
  'Dokunsay-geo': 'geo',
  'Dokunsay-veri-app': 'veri',
};

export function appIdFromPath() {
  if (typeof window === 'undefined') return null;
  const m = (window.location.pathname || '').match(/\/(DokunSay[A-Za-z]+|Dokunsay-[a-z-]+)\//);
  if (!m) return null;
  return SLUG_TO_APPID[m[1]] || null;
}

export function buildFaviconSvg(appId) {
  const accent = APP_ACCENTS[appId] || APP_ACCENTS.bar;
  const emoji = APP_EMOJI[appId] || '+';
  const fontSize = emoji.length === 1 && /[+\-±]/.test(emoji) ? 76 : 60;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">` +
      `<stop offset="0" stop-color="${accent.color}"/>` +
      `<stop offset="1" stop-color="${accent.dark}"/>` +
    `</linearGradient></defs>` +
    `<rect width="100" height="100" rx="22" fill="url(#g)"/>` +
    `<text x="50" y="50" font-family="system-ui,Apple Color Emoji,Segoe UI Emoji,Noto Color Emoji,sans-serif" ` +
      `font-size="${fontSize}" font-weight="900" text-anchor="middle" dominant-baseline="central" fill="white">${emoji}</text>` +
    `</svg>`
  );
}

export function setAppFavicon(appId) {
  if (typeof document === 'undefined') return;
  const id = appId || appIdFromPath();
  if (!id) return;
  const svg = buildFaviconSvg(id);
  const url = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);

  // Remove existing favicon links
  document.querySelectorAll('link[rel*="icon"]').forEach(el => el.remove());

  // Add new
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/svg+xml';
  link.href = url;
  document.head.appendChild(link);

  // Apple touch icon
  const apple = document.createElement('link');
  apple.rel = 'apple-touch-icon';
  apple.href = url;
  document.head.appendChild(apple);
}
