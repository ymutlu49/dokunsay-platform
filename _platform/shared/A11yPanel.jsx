/**
 * DokunSay Platform — Ortak Erişilebilirlik Paneli
 *
 * Sağ alt köşede sabit, tıklanabilir bir düğme açıldığında
 * 5 toggle (diskalkuli, yüksek kontrast, renk körü, TTS, SFX)
 * ve Sıfırla butonunu içerir. Her uygulama kendi A11yContext
 * içinde <A11yPanel /> render ederek aynı deneyimi sunar.
 *
 * Gereksinimler:
 *   - useA11y() context'inin mevcut olması (prefs, toggle, reset)
 *   - CSS: @shared/A11yPanel.css otomatik import
 */

import { useState, useEffect, useRef } from 'react';
import './A11yPanel.css';
import './a11y-global.css';

const I18N = {
  tr: {
    title: 'Erişilebilirlik',
    trigger_label: 'Erişilebilirlik ayarlarını aç',
    close: 'Kapat',
    reset: 'Sıfırla',
    dyscalculia: 'Diskalkuli Modu',
    dyscalculia_desc: 'Yavaş animasyon, büyük butonlar, belirgin odak',
    dyslexia: 'Disleksi Modu',
    dyslexia_desc: 'Geniş satır/harf aralığı, disleksi-dostu font',
    highContrast: 'Yüksek Kontrast',
    highContrast_desc: 'Güçlü renk zıtlığı',
    colorblind: 'Renk Körü Modu',
    colorblind_desc: 'Desen ve filtre ile renk ayrımı',
    tts: 'Sesli Okuma',
    tts_desc: 'Metinler sesli okunsun',
    sfx: 'Ses Efektleri',
    sfx_desc: 'Tıklama/işlem sesleri',
    reduceMotion: 'Animasyonu Azalt',
    reduceMotion_desc: 'Hareketleri durdur',
    on: 'Açık',
    off: 'Kapalı',
  },
  ku: {
    title: 'Gihîştin',
    trigger_label: 'Vebe sazkirinên gihîştinê',
    close: 'Bigire',
    reset: 'Ji Nû Ve',
    dyscalculia: 'Moda Diskalkulî',
    dyscalculia_desc: 'Animasyon hêdî, bişkojk mezin, balkêşîya aşkere',
    dyslexia: 'Moda Disleksî',
    dyslexia_desc: 'Navbera tîpan/rêzan fireh, fonta disleksî-dostî',
    highContrast: 'Kontrasta Bilind',
    highContrast_desc: 'Ciyawaziya rengan a bihêz',
    colorblind: 'Moda Koririya Rengan',
    colorblind_desc: 'Bi dûzin û fîlter ciyawaziya rengan',
    tts: 'Xwendina bi Deng',
    tts_desc: 'Nivîsên bi deng bên xwendin',
    sfx: 'Dengên Bandor',
    sfx_desc: 'Dengên klîk/kiran',
    reduceMotion: 'Kêmkirina Animasyonê',
    reduceMotion_desc: 'Tevger bên rawestandin',
    on: 'Vekirî',
    off: 'Girtî',
  },
  en: {
    title: 'Accessibility',
    trigger_label: 'Open accessibility settings',
    close: 'Close',
    reset: 'Reset',
    dyscalculia: 'Dyscalculia Mode',
    dyscalculia_desc: 'Slow animations, large buttons, strong focus',
    dyslexia: 'Dyslexia Mode',
    dyslexia_desc: 'Wide line/letter spacing, dyslexia-friendly font',
    highContrast: 'High Contrast',
    highContrast_desc: 'Strong color contrast',
    colorblind: 'Colorblind Mode',
    colorblind_desc: 'Color differentiation with patterns and filters',
    tts: 'Text-to-Speech',
    tts_desc: 'Read texts aloud',
    sfx: 'Sound Effects',
    sfx_desc: 'Click/action sounds',
    reduceMotion: 'Reduce Motion',
    reduceMotion_desc: 'Stop animations',
    on: 'On',
    off: 'Off',
  },
  ar: {
    title: 'إمكانية الوصول',
    trigger_label: 'فتح إعدادات إمكانية الوصول',
    close: 'إغلاق',
    reset: 'إعادة تعيين',
    dyscalculia: 'وضع عسر الحساب',
    dyscalculia_desc: 'حركات بطيئة، أزرار كبيرة، تركيز قوي',
    dyslexia: 'وضع عسر القراءة',
    dyslexia_desc: 'تباعد واسع بين الأسطر/الحروف، خط ملائم لعسر القراءة',
    highContrast: 'تباين عالٍ',
    highContrast_desc: 'تباين ألوان قوي',
    colorblind: 'وضع عمى الألوان',
    colorblind_desc: 'تمييز الألوان بالأنماط والمرشّحات',
    tts: 'القراءة الصوتية',
    tts_desc: 'قراءة النصوص بصوت عالٍ',
    sfx: 'المؤثرات الصوتية',
    sfx_desc: 'أصوات النقر/العمليات',
    reduceMotion: 'تقليل الحركة',
    reduceMotion_desc: 'إيقاف الحركات',
    on: 'مُفعّل',
    off: 'مُعطّل',
  },
  fa: {
    title: 'دسترس‌پذیری',
    trigger_label: 'باز کردن تنظیمات دسترس‌پذیری',
    close: 'بستن',
    reset: 'بازنشانی',
    dyscalculia: 'حالت اختلال محاسبه',
    dyscalculia_desc: 'انیمیشن آهسته، دکمه‌های بزرگ، تمرکز واضح',
    dyslexia: 'حالت نارساخوانی',
    dyslexia_desc: 'فاصله زیاد خط/حرف، فونت مناسب نارساخوانی',
    highContrast: 'کنتراست بالا',
    highContrast_desc: 'تضاد رنگی قوی',
    colorblind: 'حالت کوررنگی',
    colorblind_desc: 'تمایز رنگ با الگو و فیلتر',
    tts: 'خواندن صوتی',
    tts_desc: 'متن‌ها با صدا خوانده شوند',
    sfx: 'جلوه‌های صوتی',
    sfx_desc: 'صداهای کلیک/عملیات',
    reduceMotion: 'کاهش حرکت',
    reduceMotion_desc: 'توقف حرکت‌ها',
    on: 'روشن',
    off: 'خاموش',
  },
};

const TOGGLES = [
  { key: 'dyscalculia',  icon: '🔢', color: '#f59e0b' },
  { key: 'dyslexia',     icon: '📖', color: '#0ea5e9' },
  { key: 'highContrast', icon: '🌓', color: '#1e293b' },
  { key: 'colorblind',   icon: '🎨', color: '#ec4899' },
  { key: 'tts',          icon: '🔊', color: '#3b82f6' },
  { key: 'sfx',          icon: '🎵', color: '#22c55e' },
  { key: 'reduceMotion', icon: '🐢', color: '#8b5cf6' },
];

/** Cross-app paylaşılan dili tespit et: localStorage(dk_lang) → <html lang> → 'tr'. */
function detectSharedLang() {
  try {
    const ls = localStorage.getItem('dk_lang');
    if (ls) return ls;
  } catch { /* ignore */ }
  if (typeof document !== 'undefined') {
    const h = document.documentElement.getAttribute('lang');
    if (h) return h;
  }
  return 'tr';
}

export function A11yPanel({ useA11y, lang, position = 'bottom-right' }) {
  const [open, setOpen] = useState(false);
  const [detectedLang, setDetectedLang] = useState(detectSharedLang);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const { prefs, toggle, reset, announce } = useA11y();

  // Dil: prop açıkça verilmişse onu kullan; yoksa cross-app paylaşılan dili
  // (dk_lang + 'dk-lang-change' event) canlı izle. Memory: "A11yPanel auto-dil".
  useEffect(() => {
    if (lang) return undefined;
    function onChange(ev) { const n = ev.detail?.lang; if (n) setDetectedLang(n); }
    function onStorage(ev) { if (ev.key === 'dk_lang' && ev.newValue) setDetectedLang(ev.newValue); }
    window.addEventListener('dk-lang-change', onChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('dk-lang-change', onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, [lang]);

  const effLang = lang || detectedLang;
  const t = I18N[effLang] || I18N.tr;

  const handleToggle = (key) => {
    toggle(key);
    const newState = !prefs[key] ? t.on : t.off;
    if (announce) announce(`${t[key]} ${newState}`, 'polite');
  };

  const handleReset = () => {
    reset();
    if (announce) announce(`${t.title}: ${t.reset}`, 'polite');
  };

  useEffect(() => {
    if (!open) return undefined;
    function handleClickOutside(e) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const anyOn = TOGGLES.some((t) => prefs[t.key]);

  return (
    <div className={`ds-a11y-panel ds-a11y-panel--${position}`} role="complementary" aria-label={t.title}>
      {open && (
        <div
          className="ds-a11y-panel__body"
          ref={panelRef}
          role="dialog"
          aria-label={t.title}
        >
          <div className="ds-a11y-panel__head">
            <span aria-hidden="true">♿</span>
            <strong>{t.title}</strong>
            <button
              className="ds-a11y-panel__close"
              onClick={() => setOpen(false)}
              aria-label={t.close}
              type="button"
            >
              ✕
            </button>
          </div>

          <ul className="ds-a11y-panel__list">
            {TOGGLES.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  className={`ds-a11y-toggle ${prefs[item.key] ? 'ds-a11y-toggle--on' : ''}`}
                  onClick={() => handleToggle(item.key)}
                  aria-pressed={Boolean(prefs[item.key])}
                  aria-describedby={`ds-a11y-desc-${item.key}`}
                  title={t[`${item.key}_desc`]}
                  style={{ '--toggle-accent': item.color }}
                >
                  <span className="ds-a11y-toggle__icon" aria-hidden="true">{item.icon}</span>
                  <span className="ds-a11y-toggle__label">
                    {t[item.key]}
                    <span
                      id={`ds-a11y-desc-${item.key}`}
                      className="ds-a11y-toggle__desc"
                    >
                      {t[`${item.key}_desc`]}
                    </span>
                  </span>
                  <span className="ds-a11y-toggle__state" aria-hidden="true">
                    {prefs[item.key] ? t.on : t.off}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button
            className="ds-a11y-panel__reset"
            onClick={handleReset}
            type="button"
          >
            ↻ {t.reset}
          </button>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        className={`ds-a11y-panel__trigger ${open ? 'ds-a11y-panel__trigger--open' : ''} ${anyOn ? 'ds-a11y-panel__trigger--active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={t.trigger_label}
        aria-expanded={open}
        title={t.title}
      >
        <span aria-hidden="true">♿</span>
      </button>
    </div>
  );
}
