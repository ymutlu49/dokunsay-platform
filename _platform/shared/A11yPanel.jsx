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

const I18N = {
  tr: {
    title: 'Erişilebilirlik',
    trigger_label: 'Erişilebilirlik ayarlarını aç',
    close: 'Kapat',
    reset: 'Sıfırla',
    dyscalculia: 'Diskalkuli Modu',
    highContrast: 'Yüksek Kontrast',
    colorblind: 'Renk Körü Modu',
    tts: 'Sesli Okuma',
    sfx: 'Ses Efektleri',
    reduceMotion: 'Animasyonu Azalt',
    on: 'Açık',
    off: 'Kapalı',
  },
  ku: {
    title: 'Gihîştin',
    trigger_label: 'Vebe sazkirinên gihîştinê',
    close: 'Bigire',
    reset: 'Ji Nû Ve',
    dyscalculia: 'Moda Diskalkulî',
    highContrast: 'Kontrasta Bilind',
    colorblind: 'Moda Koririya Rengan',
    tts: 'Xwendina bi Deng',
    sfx: 'Dengên Bandor',
    reduceMotion: 'Kêmkirina Animasyonê',
    on: 'Vekirî',
    off: 'Girtî',
  },
  en: {
    title: 'Accessibility',
    trigger_label: 'Open accessibility settings',
    close: 'Close',
    reset: 'Reset',
    dyscalculia: 'Dyscalculia Mode',
    highContrast: 'High Contrast',
    colorblind: 'Colorblind Mode',
    tts: 'Text-to-Speech',
    sfx: 'Sound Effects',
    reduceMotion: 'Reduce Motion',
    on: 'On',
    off: 'Off',
  },
};

const TOGGLES = [
  { key: 'dyscalculia',  icon: '🧠', color: '#f59e0b' },
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
  const { prefs, toggle, reset } = useA11y();
  const t = I18N[lang] || I18N.tr;

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
                  onClick={() => toggle(item.key)}
                  aria-pressed={Boolean(prefs[item.key])}
                  style={{ '--toggle-accent': item.color }}
                >
                  <span className="ds-a11y-toggle__icon" aria-hidden="true">{item.icon}</span>
                  <span className="ds-a11y-toggle__label">{t[item.key]}</span>
                  <span className="ds-a11y-toggle__state" aria-hidden="true">
                    {prefs[item.key] ? t.on : t.off}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button
            className="ds-a11y-panel__reset"
            onClick={reset}
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
