/**
 * DokunSay Platform — Ortak Dil Seçici
 *
 * Üst şeritte sağda (AppShell tools slot'unda) kullanılır.
 * 3-harf kod stilinde kompakt pill görünümü (TR / KU / EN / AR / FA).
 * Her uygulama kendi lang state'ini `lang` + `setLang` props ile verir.
 *
 * AR ve FA otomatik olarak <html dir="rtl"> uygular.
 */

import { useEffect } from 'react';
import './LangSwitcher.css';

/**
 * SUNULAN DİLLER — 2026-07-19 kararı (kullanıcı).
 *
 * AR ve FA seçiciden GİZLENDİ. İçerik ve çeviri dosyaları SİLİNMEDİ; yalnızca
 * kullanıcıya sunulmuyor. Gerekçe: platform genelinde Arapça/Farsça İÇERİK
 * doğrulanamadı — bir kısmı hiç yoktu (çocuk Arapça arayüzde Türkçe görev
 * görüyordu), bir kısmı ise uzman denetiminden geçmemiş çeviriydi. Matematik
 * öğretiminde terim hassasiyeti kritiktir (pay/payda, basamak değeri, eş parça);
 * YANLIŞ çeviri SESSİZCE yanlıştır, oysa eksik çeviri en azından bariz bozuktur.
 * Çocuğa kendi dilini vaat edip yanlış terim öğretmektense, dili hiç sunmamak
 * daha dürüst.
 *
 * §1.7'nin şartı (en az 3 dil) tr/ku/en ile zaten sağlanıyor.
 *
 * GERİ AÇMAK İÇİN: uzman denetimi tamamlanınca bu diziye 'ar' ve/veya 'fa' ekle —
 * etiketler, ARIA adları ve RTL desteği aşağıda HAZIR bekliyor, başka değişiklik
 * gerekmez.
 */
const DEFAULT_LANGS = ['tr', 'ku', 'en'];

/** Kod tarafında tanınan TÜM diller (gizlenenler dahil) — normalizeLang için. */
const KNOWN_LANGS = ['tr', 'ku', 'en', 'ar', 'fa'];

/**
 * Kayıtlı/gelen dil kodunu SUNULAN dillere indirger.
 * Daha önce AR/FA seçmiş bir kullanıcının localStorage'ı hâlâ 'ar' diyor olabilir;
 * bu durumda uygulama gizlenmiş bir dilde açılır ve seçicide hiçbir düğme aktif
 * görünmez. Bu yardımcı onu güvenli varsayılana çeker.
 */
export function normalizeLang(lang, allowed = DEFAULT_LANGS) {
  return allowed.includes(lang) ? lang : allowed[0];
}

export { KNOWN_LANGS, DEFAULT_LANGS as VISIBLE_LANGS };

const DEFAULT_LABELS = {
  tr: 'TR',
  ku: 'KU',
  en: 'EN',
  ar: 'AR',
  fa: 'FA',
};

const ARIA_LABELS = {
  tr: 'Türkçe',
  ku: 'Kurmancî',
  en: 'English',
  ar: 'العربية',
  fa: 'فارسی',
};

const RTL_LANGS = new Set(['ar', 'fa']);
export function isRTL(lang) { return RTL_LANGS.has(lang); }

export function LangSwitcher({
  lang,
  setLang,
  langs = DEFAULT_LANGS,
  labels = DEFAULT_LABELS,
}) {
  // Dil değiştiğinde <html lang> ve <html dir> güncellenir.
  // AR/FA RTL, diğerleri LTR. Bu sayede CSS :dir() ve varsayılan
  // tarayıcı davranışları (form hizalama, metin akışı) doğru çalışır.
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', RTL_LANGS.has(lang) ? 'rtl' : 'ltr');
  }, [lang]);

  return (
    <div className="ds-lang-switcher" role="group" aria-label="Language">
      {langs.map((l) => (
        <button
          key={l}
          type="button"
          className={`ds-lang-switcher__btn ${lang === l ? 'ds-lang-switcher__btn--active' : ''}`}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          aria-label={ARIA_LABELS[l] || l}
          title={ARIA_LABELS[l] || l}
        >
          {labels[l] || l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
