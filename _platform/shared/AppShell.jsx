/**
 * DokunSay Platform — Ortak Uygulama Kabuğu (AppShell)
 *
 * Tüm DokunSay uygulamalarının dış çerçevesini sağlar:
 * - Renk (app'in accent'i), tipografi (Nunito), arka plan
 * - Üst kimlik şeridi: "Menüye Dön" + ikon + başlık + alt başlık + tools
 * - Ana içerik alanı (children fills remaining)
 * - (Opsiyonel) alt bilgi şeridi
 *
 * Kullanım:
 *   import { AppShell } from '@shared/AppShell.jsx';
 *   <AppShell appId="bar" title="DokunSay Bar" subtitle="Çubuklar ve Pullar" icon="🧮">
 *     {/* uygulamanın mevcut içeriği *\/}
 *   </AppShell>
 *
 * `backHref`: "Menüye Dön" butonunun gideceği URL. Varsayılan:
 *   - dev  → http://localhost:3000/ (launcher dev sunucusu)
 *   - prod → ../ (bulunduğu alt dizinden üst dizine)
 * `showBack={false}` ile bağımsız açılımda gizlenir.
 */

import { APP_ACCENTS } from './palette.js';
import './AppShell.css';

function computeBackHref() {
  if (typeof window === 'undefined') return '/';
  // Vite-özel env: dev modunda launcher ayrı portta çalışır
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
    return 'http://localhost:3000/';
  }
  // Prod: bir üst dizine git (GitHub Pages alt-yol yapısına uygun)
  try {
    return new URL('..', window.location.href).pathname;
  } catch {
    return '../';
  }
}

const BACK_LABEL = {
  tr: 'Menüye Dön',
  ku: 'Vegere Menûyê',
  en: 'Back to Menu',
  ar: 'العودة إلى القائمة',
  fa: 'بازگشت به منو',
};

export function AppShell({
  appId = 'bar',
  title,
  subtitle,
  icon,
  topBar = true,
  showBack = true,
  backHref,
  backLang = 'tr',
  tools,
  footer,
  background,
  children,
}) {
  const accent = APP_ACCENTS[appId] || APP_ACCENTS.bar;
  const resolvedBack = backHref || computeBackHref();
  const backText = BACK_LABEL[backLang] || BACK_LABEL.tr;

  const cssVars = {
    '--appshell-accent': accent.color,
    '--appshell-accent-dark': accent.dark,
    '--appshell-accent-soft': accent.soft,
    '--appshell-accent-softer': accent.softer,
  };
  if (background) cssVars['--appshell-bg'] = background;

  return (
    <div className="ds-appshell" style={cssVars} data-app={appId}>
      {topBar && (
        <header className="ds-appshell__topbar" role="banner">
          <div className="ds-appshell__brand">
            {showBack && (
              <a
                href={resolvedBack}
                className="ds-appshell__back"
                aria-label={backText}
                title={backText}
              >
                <span aria-hidden="true">←</span>
                <span className="ds-appshell__back-label">{backText}</span>
              </a>
            )}
            {icon && (
              <div className="ds-appshell__icon" aria-hidden="true">
                <span>{icon}</span>
              </div>
            )}
            <div className="ds-appshell__titles">
              {title && <h1 className="ds-appshell__title">{title}</h1>}
              {subtitle && <p className="ds-appshell__subtitle">{subtitle}</p>}
            </div>
          </div>
          {tools && <div className="ds-appshell__tools">{tools}</div>}
        </header>
      )}

      <main className="ds-appshell__main">
        {children}
      </main>

      {footer && (
        <footer className="ds-appshell__footer" role="contentinfo">
          {footer}
        </footer>
      )}
    </div>
  );
}
