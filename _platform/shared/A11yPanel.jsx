/**
 * DokunSay Platform — Ortak Erişilebilirlik Paneli
 *
 * Sağ alt köşede sabit tetikleyici. Açıldığında 7 toggle
 * (diskalkuli, disleksi, yüksek kontrast, renk körü, TTS, SFX,
 * reduceMotion) + yazı boyutu slider + yardım butonu içerir.
 *
 * 5 dil: TR, KU (Kurmancî), EN, AR, FA — AR/FA için RTL otomatik.
 *
 * Gereksinimler:
 *   - useA11y() context'inin mevcut olması (prefs, toggle, setPref, reset, announce)
 *   - prefs.fontSize (0.85–1.4) slider tarafından yazılır
 *   - CSS: A11yPanel.css + a11y-global.css otomatik import
 */

import { useState, useEffect, useRef } from 'react';
import './A11yPanel.css';
import './a11y-global.css';

const RTL_LANGS = new Set(['ar', 'fa']);

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
    highContrast_desc: 'Güçlü renk zıtlığı, siyah-beyaz vurgu',
    colorblind: 'Renk Körü Modu',
    colorblind_desc: 'Desen ve filtre ile renk ayrımı',
    tts: 'Sesli Okuma',
    tts_desc: 'Metinler sesli okunsun',
    sfx: 'Ses Efektleri',
    sfx_desc: 'Tıklama/işlem sesleri',
    reduceMotion: 'Animasyonu Azalt',
    reduceMotion_desc: 'Hareketleri durdur',
    fontSize: 'Yazı Boyutu',
    fontSize_desc: 'Tüm metinleri büyüt veya küçült',
    fontSize_smaller: 'Küçük',
    fontSize_normal: 'Normal',
    fontSize_larger: 'Büyük',
    on: 'Açık',
    off: 'Kapalı',
    help: 'Yardım',
    help_desc: 'Klavye kısayolları ve özellikler',
    shortcuts_title: 'Klavye Kısayolları',
    sc_undo: 'Geri al',
    sc_redo: 'Tekrar yap',
    sc_delete: 'Sil',
    sc_speak: 'Sesli oku',
    sc_help: 'Yardım',
    sc_escape: 'Kapat',
    features_title: 'Erişilebilirlik Özellikleri',
    feat_dyscalculia: 'Diskalkuli (sayı güçlüğü) için yavaşlatılmış animasyon ve büyük dokunma alanları',
    feat_dyslexia: 'Disleksi için disleksi-dostu font, geniş aralık ve daha okunaklı metin',
    feat_screenReader: 'Ekran okuyucu uyumlu (ARIA), tüm değişiklikler sesli duyurulur',
  },
  ku: {
    title: 'Gihîştin',
    trigger_label: 'Vebe sazkirinên gihîştinê',
    close: 'Bigire',
    reset: 'Ji Nû Ve',
    dyscalculia: 'Moda Diskalkulî',
    dyscalculia_desc: 'Animasyon hêdî, bişkojk mezin, balkêşîya aşkere',
    dyslexia: 'Moda Disleksî',
    dyslexia_desc: 'Navbera tîp/rêzan fireh, fonta disleksî-dostî',
    highContrast: 'Kontrasta Bilind',
    highContrast_desc: 'Ciyawaziya rengan a bihêz, reş-spî',
    colorblind: 'Moda Koririya Rengan',
    colorblind_desc: 'Bi dûzin û fîlter ciyawaziya rengan',
    tts: 'Xwendina bi Deng',
    tts_desc: 'Nivîsên bi deng bên xwendin',
    sfx: 'Dengên Bandor',
    sfx_desc: 'Dengên klîk û kiran',
    reduceMotion: 'Kêmkirina Animasyonê',
    reduceMotion_desc: 'Tevger bên rawestandin',
    fontSize: 'Mezinahiya Nivîsê',
    fontSize_desc: 'Hemû nivîsan mezin yan biçûk bike',
    fontSize_smaller: 'Biçûk',
    fontSize_normal: 'Normal',
    fontSize_larger: 'Mezin',
    on: 'Vekirî',
    off: 'Girtî',
    help: 'Alîkarî',
    help_desc: 'Bişkojkên kurte û taybetmendî',
    shortcuts_title: 'Bişkojkên Kurte',
    sc_undo: 'Vegerandin',
    sc_redo: 'Dîsa kirin',
    sc_delete: 'Jêbirin',
    sc_speak: 'Bi deng bixwîne',
    sc_help: 'Alîkarî',
    sc_escape: 'Bigire',
    features_title: 'Taybetmendiyên Gihîştinê',
    feat_dyscalculia: 'Ji bo diskalkulî (zehmetiya hejmaran) animasyona hêdî û qadên mezin ên dest lê dan',
    feat_dyslexia: 'Ji bo disleksî fonta disleksî-dost, navbera fireh û nivîsa xwendinetir',
    feat_screenReader: 'Bi xwendevanê ekranê re lihevhatî (ARIA), hemû guherîn bi deng tên ragihandin',
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
    highContrast_desc: 'Strong color contrast, black-white emphasis',
    colorblind: 'Colorblind Mode',
    colorblind_desc: 'Color differentiation with patterns and filters',
    tts: 'Text-to-Speech',
    tts_desc: 'Read texts aloud',
    sfx: 'Sound Effects',
    sfx_desc: 'Click/action sounds',
    reduceMotion: 'Reduce Motion',
    reduceMotion_desc: 'Stop animations',
    fontSize: 'Text Size',
    fontSize_desc: 'Make all text larger or smaller',
    fontSize_smaller: 'Small',
    fontSize_normal: 'Normal',
    fontSize_larger: 'Large',
    on: 'On',
    off: 'Off',
    help: 'Help',
    help_desc: 'Keyboard shortcuts and features',
    shortcuts_title: 'Keyboard Shortcuts',
    sc_undo: 'Undo',
    sc_redo: 'Redo',
    sc_delete: 'Delete',
    sc_speak: 'Speak',
    sc_help: 'Help',
    sc_escape: 'Close',
    features_title: 'Accessibility Features',
    feat_dyscalculia: 'For dyscalculia (number difficulty): slowed animations and large touch targets',
    feat_dyslexia: 'For dyslexia: dyslexia-friendly font, wide spacing and more readable text',
    feat_screenReader: 'Screen reader compatible (ARIA), all changes announced aloud',
  },
  ar: {
    title: 'إمكانية الوصول',
    trigger_label: 'فتح إعدادات إمكانية الوصول',
    close: 'إغلاق',
    reset: 'إعادة تعيين',
    dyscalculia: 'وضع عسر الحساب',
    dyscalculia_desc: 'حركات بطيئة، أزرار كبيرة، تركيز واضح',
    dyslexia: 'وضع عسر القراءة',
    dyslexia_desc: 'تباعد واسع للأسطر والحروف، خط مناسب لعسر القراءة',
    highContrast: 'تباين عالٍ',
    highContrast_desc: 'تباين ألوان قوي، تأكيد بالأبيض والأسود',
    colorblind: 'وضع عمى الألوان',
    colorblind_desc: 'تمييز الألوان بأنماط ومرشحات',
    tts: 'القراءة الصوتية',
    tts_desc: 'قراءة النصوص بصوت عالٍ',
    sfx: 'المؤثرات الصوتية',
    sfx_desc: 'أصوات النقر والإجراء',
    reduceMotion: 'تقليل الحركة',
    reduceMotion_desc: 'إيقاف الحركات',
    fontSize: 'حجم النص',
    fontSize_desc: 'تكبير أو تصغير كل النصوص',
    fontSize_smaller: 'صغير',
    fontSize_normal: 'عادي',
    fontSize_larger: 'كبير',
    on: 'تشغيل',
    off: 'إيقاف',
    help: 'المساعدة',
    help_desc: 'اختصارات لوحة المفاتيح والميزات',
    shortcuts_title: 'اختصارات لوحة المفاتيح',
    sc_undo: 'تراجع',
    sc_redo: 'إعادة',
    sc_delete: 'حذف',
    sc_speak: 'قراءة بصوت',
    sc_help: 'مساعدة',
    sc_escape: 'إغلاق',
    features_title: 'ميزات إمكانية الوصول',
    feat_dyscalculia: 'لعسر الحساب: حركات بطيئة ومناطق لمس كبيرة',
    feat_dyslexia: 'لعسر القراءة: خط مناسب وتباعد واسع ونص أوضح',
    feat_screenReader: 'متوافق مع قارئ الشاشة (ARIA)، يُعلَن عن كل التغييرات صوتيًا',
  },
  fa: {
    title: 'دسترس‌پذیری',
    trigger_label: 'باز کردن تنظیمات دسترس‌پذیری',
    close: 'بستن',
    reset: 'بازنشانی',
    dyscalculia: 'حالت اختلال محاسبه',
    dyscalculia_desc: 'انیمیشن آهسته، دکمه‌های بزرگ، تمرکز واضح',
    dyslexia: 'حالت نارساخوانی',
    dyslexia_desc: 'فاصله سطر و حرف بیشتر، فونت مناسب نارساخوانی',
    highContrast: 'کنتراست بالا',
    highContrast_desc: 'تضاد رنگی قوی، تأکید سیاه و سفید',
    colorblind: 'حالت کوررنگی',
    colorblind_desc: 'تمایز رنگ با الگو و فیلتر',
    tts: 'خواندن صوتی',
    tts_desc: 'متن‌ها با صدا خوانده شوند',
    sfx: 'افکت‌های صوتی',
    sfx_desc: 'صدای کلیک و عملیات',
    reduceMotion: 'کاهش حرکت',
    reduceMotion_desc: 'توقف حرکت‌ها',
    fontSize: 'اندازه متن',
    fontSize_desc: 'بزرگ یا کوچک کردن همه متن‌ها',
    fontSize_smaller: 'کوچک',
    fontSize_normal: 'عادی',
    fontSize_larger: 'بزرگ',
    on: 'روشن',
    off: 'خاموش',
    help: 'راهنما',
    help_desc: 'میانبرهای صفحه‌کلید و ویژگی‌ها',
    shortcuts_title: 'میانبرهای صفحه‌کلید',
    sc_undo: 'بازگردانی',
    sc_redo: 'انجام مجدد',
    sc_delete: 'حذف',
    sc_speak: 'خواندن با صدا',
    sc_help: 'راهنما',
    sc_escape: 'بستن',
    features_title: 'ویژگی‌های دسترس‌پذیری',
    feat_dyscalculia: 'برای اختلال محاسبه: انیمیشن کند و نواحی لمسی بزرگ',
    feat_dyslexia: 'برای نارساخوانی: فونت مناسب، فاصله بیشتر و متن خواناتر',
    feat_screenReader: 'سازگار با صفحه‌خوان (ARIA)، همه تغییرات با صدا اعلام می‌شوند',
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

const FONT_STEPS = [
  { value: 0.85, label_key: 'fontSize_smaller' },
  { value: 1.0,  label_key: 'fontSize_normal'  },
  { value: 1.15, label_key: 'fontSize_normal'  },
  { value: 1.3,  label_key: 'fontSize_larger'  },
  { value: 1.45, label_key: 'fontSize_larger'  },
];

function fontStepIndex(value) {
  let best = 1;
  let bestDist = Infinity;
  FONT_STEPS.forEach((s, i) => {
    const d = Math.abs(s.value - (value ?? 1));
    if (d < bestDist) { best = i; bestDist = d; }
  });
  return best;
}

const SHORTCUTS = [
  { keys: 'Ctrl+Z',     desc_key: 'sc_undo' },
  { keys: 'Ctrl+Y',     desc_key: 'sc_redo' },
  { keys: 'Del',        desc_key: 'sc_delete' },
  { keys: 'S',          desc_key: 'sc_speak' },
  { keys: '?  /  F1',   desc_key: 'sc_help' },
  { keys: 'Esc',        desc_key: 'sc_escape' },
];

/**
 * Etkin dili belirler:
 * 1. lang prop verilmişse onu kullan (geriye dönük uyumluluk)
 * 2. Aksi halde <html lang> attribute'unu izle (LangSwitcher tarafından
 *    otomatik güncellenir). 5 dil dışındaki değerlerde 'tr'ye düş.
 */
function useResolvedLang(propLang) {
  const [docLang, setDocLang] = useState(() => {
    if (typeof document === 'undefined') return 'tr';
    const v = document.documentElement.lang?.toLowerCase().slice(0, 2);
    return v && I18N[v] ? v : 'tr';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const update = () => {
      const v = document.documentElement.lang?.toLowerCase().slice(0, 2);
      setDocLang(v && I18N[v] ? v : 'tr');
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });
    return () => observer.disconnect();
  }, []);

  // Açıkça verilmiş prop varsa onu kullan; yoksa document'tan oku.
  // Eski "lang='tr'" sabit pattern'inde varsayılana düşmesin diye:
  // prop hiç verilmediğinde (undefined) document izlenir.
  return propLang === undefined ? docLang : (I18N[propLang] ? propLang : docLang);
}

export function A11yPanel({ useA11y, lang, position = 'bottom-right' }) {
  const [open, setOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const helpRef = useRef(null);
  const ctx = useA11y();
  const { prefs, toggle, setPref, reset, announce } = ctx;
  const resolvedLang = useResolvedLang(lang);
  const t = I18N[resolvedLang] || I18N.tr;
  const isRTL = RTL_LANGS.has(resolvedLang);

  const handleToggle = (key) => {
    toggle(key);
    const newState = !prefs[key] ? t.on : t.off;
    if (announce) announce(`${t[key]} ${newState}`, 'polite');
  };

  const handleFontChange = (delta) => {
    const idx = fontStepIndex(prefs.fontSize);
    const next = Math.max(0, Math.min(FONT_STEPS.length - 1, idx + delta));
    const value = FONT_STEPS[next].value;
    if (setPref) {
      setPref('fontSize', value);
    } else {
      // setPref olmayan eski sürümler için fallback
      // (yeni A11yContext'lerde setPref var)
    }
    if (announce) announce(`${t.fontSize}: ${Math.round(value * 100)}%`, 'polite');
  };

  const handleReset = () => {
    reset();
    if (announce) announce(`${t.title}: ${t.reset}`, 'polite');
  };

  // Help kısayolu (?, F1) — global dinleyici
  useEffect(() => {
    function onKey(e) {
      const inInput = e.target?.tagName === 'INPUT' ||
                      e.target?.tagName === 'TEXTAREA' ||
                      e.target?.isContentEditable;
      if (inInput) return;
      if (e.key === '?' || e.key === 'F1') {
        e.preventDefault();
        setHelpOpen((v) => !v);
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Panel dışı tıklama / Esc kapatma
  useEffect(() => {
    if (!open && !helpOpen) return undefined;
    function handleClickOutside(e) {
      if (helpOpen && helpRef.current && !helpRef.current.contains(e.target)) {
        setHelpOpen(false);
        return;
      }
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    function handleKey(e) {
      if (e.key === 'Escape') {
        if (helpOpen) setHelpOpen(false);
        else if (open) setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, helpOpen]);

  const anyOn = TOGGLES.some((tg) => prefs[tg.key]) || (prefs.fontSize ?? 1) !== 1;
  const fontIdx = fontStepIndex(prefs.fontSize);
  const fontPct = Math.round((FONT_STEPS[fontIdx]?.value ?? 1) * 100);

  return (
    <div
      className={`ds-a11y-panel ds-a11y-panel--${position} ${isRTL ? 'ds-a11y-panel--rtl' : ''}`}
      role="complementary"
      aria-label={t.title}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
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
              className="ds-a11y-panel__help"
              onClick={() => { setHelpOpen(true); setOpen(false); }}
              aria-label={t.help}
              title={t.help_desc}
              type="button"
            >
              ?
            </button>
            <button
              className="ds-a11y-panel__close"
              onClick={() => setOpen(false)}
              aria-label={t.close}
              type="button"
            >
              ✕
            </button>
          </div>

          {/* Font Size Slider */}
          <div className="ds-a11y-fontsize" role="group" aria-labelledby="ds-a11y-fs-label">
            <div className="ds-a11y-fontsize__row">
              <span id="ds-a11y-fs-label" className="ds-a11y-fontsize__label">
                <span className="ds-a11y-fontsize__icon" aria-hidden="true">Aa</span>
                {t.fontSize}
              </span>
              <span className="ds-a11y-fontsize__value" aria-live="polite">{fontPct}%</span>
            </div>
            <div className="ds-a11y-fontsize__controls">
              <button
                type="button"
                className="ds-a11y-fontsize__btn"
                onClick={() => handleFontChange(-1)}
                disabled={fontIdx === 0}
                aria-label={t.fontSize_smaller}
                title={t.fontSize_smaller}
              >
                A−
              </button>
              <div
                className="ds-a11y-fontsize__track"
                role="slider"
                aria-label={t.fontSize}
                aria-valuemin={Math.round(FONT_STEPS[0].value * 100)}
                aria-valuemax={Math.round(FONT_STEPS[FONT_STEPS.length - 1].value * 100)}
                aria-valuenow={fontPct}
                aria-valuetext={`${fontPct}%`}
              >
                <div
                  className="ds-a11y-fontsize__fill"
                  style={{ width: `${(fontIdx / (FONT_STEPS.length - 1)) * 100}%` }}
                />
              </div>
              <button
                type="button"
                className="ds-a11y-fontsize__btn"
                onClick={() => handleFontChange(1)}
                disabled={fontIdx === FONT_STEPS.length - 1}
                aria-label={t.fontSize_larger}
                title={t.fontSize_larger}
              >
                A+
              </button>
            </div>
            <p className="ds-a11y-fontsize__desc">{t.fontSize_desc}</p>
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

      {helpOpen && (
        <div
          className="ds-a11y-help__overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ds-a11y-help-title"
        >
          <div className="ds-a11y-help__body" ref={helpRef} dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="ds-a11y-help__head">
              <span aria-hidden="true">⌨️</span>
              <strong id="ds-a11y-help-title">{t.help}</strong>
              <button
                className="ds-a11y-panel__close"
                onClick={() => setHelpOpen(false)}
                aria-label={t.close}
                type="button"
              >
                ✕
              </button>
            </div>

            <h3 className="ds-a11y-help__section-title">{t.shortcuts_title}</h3>
            <table className="ds-a11y-help__shortcuts">
              <tbody>
                {SHORTCUTS.map((s) => (
                  <tr key={s.keys}>
                    <td><kbd>{s.keys}</kbd></td>
                    <td>{t[s.desc_key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="ds-a11y-help__section-title">{t.features_title}</h3>
            <ul className="ds-a11y-help__features">
              <li>{t.feat_dyscalculia}</li>
              <li>{t.feat_dyslexia}</li>
              <li>{t.feat_screenReader}</li>
            </ul>
          </div>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        className={`ds-a11y-panel__trigger ${open ? 'ds-a11y-panel__trigger--open' : ''} ${anyOn ? 'ds-a11y-panel__trigger--active' : ''}`}
        onClick={() => { setOpen((v) => !v); setHelpOpen(false); }}
        aria-label={t.trigger_label}
        aria-expanded={open}
        title={t.title}
      >
        <span aria-hidden="true">♿</span>
      </button>
    </div>
  );
}
