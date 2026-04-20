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

export function A11yPanel({ useA11y, lang = 'tr', position = 'bottom-right' }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const { prefs, toggle, reset, announce } = useA11y();
  const t = I18N[lang] || I18N.tr;

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
