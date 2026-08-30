/**
 * Her Çocuk Matematik Öğrenebilir (HÇMÖ) — Ortak Alt Bar (minimal)
 *
 * Tek satır, ince. AppShell'in `footer` prop'una geçilir.
 * Sol: "HÇMÖ" üst-marka anahtar linki (dar alan → kısa form)
 * Sağ: copyright (mobilde gizlenir)
 *
 * NOT: "Diskalkulî çi ye? / What is dyscalculia?" linki bir EĞİTİM KONUSUDUR,
 * üst-marka değildir — etiket korunur.
 */

import { HcmoMark } from './HcmoMark.jsx';
import './AppFooter.css';

const T = {
  tr: { home: 'HÇMÖ', tools: 'Araçlar', learn: 'Diskalkuli nedir?', rights: 'Tüm hakları saklıdır' },
  ku: { home: 'HÇMÖ', tools: 'Amûr', learn: 'Diskalkulî çi ye?', rights: 'Hemû maf parastî ne' },
  en: { home: 'HÇMÖ', tools: 'Tools', learn: 'What is dyscalculia?', rights: 'All rights reserved' },
  ar: { home: 'HÇMÖ', tools: 'الأدوات', learn: 'ما هي الديسكالكوليا؟', rights: 'جميع الحقوق محفوظة' },
  fa: { home: 'HÇMÖ', tools: 'ابزارها', learn: 'دیسکالکولی چیست؟', rights: 'تمامی حقوق محفوظ است' },
};

// Umbrella host (HÇMÖ): bireysel ürün domainleri (dokunsay.com vb.) korunur.
const BASE = 'https://hercocukmatematikogrenebilir.com';

export function AppFooter({ lang = 'tr' }) {
  const t = T[lang] || T.tr;
  const year = new Date().getFullYear();

  return (
    <div className="ds-appfooter" role="contentinfo">
      <div className="ds-appfooter__inner">
        <div className="ds-appfooter__brand">
          <a href={`${BASE}/`} target="_top" rel="noopener" className="ds-appfooter__home">
            <HcmoMark size={18} decorative />
            <span>{t.home}</span>
          </a>
          <span className="ds-appfooter__sep" aria-hidden="true">·</span>
          <nav className="ds-appfooter__nav" aria-label={t.tools}>
            <a href={`${BASE}/araclar/`} target="_top" rel="noopener">{t.tools}</a>
            <a href={`${BASE}/diskalkuli-nedir/`} target="_top" rel="noopener">{t.learn}</a>
          </nav>
        </div>
        <div className="ds-appfooter__copy">© {year} Prof. Dr. Yılmaz Mutlu — {t.rights}</div>
      </div>
    </div>
  );
}
