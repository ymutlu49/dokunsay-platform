import { useState, useMemo, useEffect } from 'react';
import { TOOLS, TOOL_CATEGORIES } from './tools.js';
import { VISIBLE_LANGS, LANG_LABELS, LANG_FLAGS, useT } from './i18n.js';
import { useAuthSlot } from './useAuthSlot.js';

const STORAGE_KEY = 'dokunsay:platform:prefs';

// DokunSay amber Üçlü-Kod işareti (yerel inline; dış marka bağımlılığı yok).
function BrandMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#f5b942" />
      <circle cx="16" cy="20" r="3.4" fill="#241a05" />
      <circle cx="32" cy="20" r="3.4" fill="#241a05" />
      <circle cx="24" cy="31" r="3.4" fill="#241a05" />
    </svg>
  );
}

const AGE_RANGES = {
  all: [0, 99],
  early: [5, 7],
  primary: [8, 11],
  middle: [12, 15],
};

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePrefs(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* yoksay */
  }
}

function hexToSoft(hex, opacity = 0.15) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function darken(hex, amount = 0.3) {
  const h = hex.replace('#', '');
  let r = parseInt(h.substring(0, 2), 16);
  let g = parseInt(h.substring(2, 4), 16);
  let b = parseInt(h.substring(4, 6), 16);
  r = Math.max(0, Math.floor(r * (1 - amount)));
  g = Math.max(0, Math.floor(g * (1 - amount)));
  b = Math.max(0, Math.floor(b * (1 - amount)));
  return `rgb(${r}, ${g}, ${b})`;
}

function parseAgeRange(range) {
  const parts = (range || '').split('-').map((n) => parseInt(n, 10));
  return [parts[0] ?? 0, parts[1] ?? parts[0] ?? 0];
}

function toolMatchesAgeFilter(tool, filterKey) {
  if (filterKey === 'all') return true;
  const [minF, maxF] = AGE_RANGES[filterKey] || AGE_RANGES.all;
  const [minT, maxT] = parseAgeRange(tool.ageRange);
  return !(maxT < minF || minT > maxF);
}

/**
 * Aracın URL'sini çöz: dev modda kendi portu (3001-3007),
 * prod modda göreceli alt yol (GitHub Pages uyumlu).
 */
function resolveToolUrl(tool) {
  if (import.meta.env.DEV && tool.devUrl) return tool.devUrl;
  // Prod: BASE_URL + folder name (örn: /dokunsay/DokunSayBar/)
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${tool.folder}/`.replace(/\/+/g, '/');
}

const STATS = [
  { key: 'tools',      icon: '🎯', value: 8 },
  { key: 'languages',  icon: '🌐', value: 5 },
  { key: 'activities', icon: '✨', value: '200+' },
  { key: 'frameworks', icon: '📚', value: 5 },
];

const FEATURES = [
  { key: 'research',     icon: '🔬', color: '#8b5cf6' },
  { key: 'multilingual', icon: '🗣️', color: '#3b82f6' },
  { key: 'inclusive',    icon: '💜', color: '#ec4899' },
  { key: 'manipulative', icon: '✋', color: '#f59e0b' },
];

function openTool(tool) {
  const url = resolveToolUrl(tool);
  window.location.href = url;
}

export default function App() {
  const initial = loadPrefs();
  // Kayitli dil gizlenen bir dil olabilir (AR/FA daha once secilmisse) -> guvenli varsayilan.
  // Yoksa portal gizli bir dilde acilir ve secicide hicbir dugme aktif gorunmez.
  const [lang, setLang] = useState(
    VISIBLE_LANGS.includes(initial.lang) ? initial.lang : 'tr'
  );
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeAge, setActiveAge] = useState('all');
  const t = useT(lang);
  useAuthSlot();

  const trajectoriesUrl = `${import.meta.env.BASE_URL || '/'}yorunge/`.replace(/\/{2,}/g, '/');
  const zihindenUrl = `${import.meta.env.BASE_URL || '/'}ZihindenAritmetik/`.replace(/\/{2,}/g, '/');
  const rehberUrl = `${import.meta.env.BASE_URL || '/'}rehber/`.replace(/\/{2,}/g, '/');
  const setUrl = `${import.meta.env.BASE_URL || '/'}sayi-cubuklari/`.replace(/\/{2,}/g, '/');

  useEffect(() => {
    savePrefs({ lang });
    document.documentElement.setAttribute('lang', lang);
  }, [lang]);

  const categories = TOOL_CATEGORIES[lang] || TOOL_CATEGORIES.tr;

  const filteredTools = useMemo(() => {
    let list = TOOLS;

    if (activeCategory !== 'all') {
      const cat = categories.find((c) => c.id === activeCategory);
      if (cat) list = list.filter((tool) => cat.tools.includes(tool.id));
    }

    if (activeAge !== 'all') {
      list = list.filter((tool) => toolMatchesAgeFilter(tool, activeAge));
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((tool) => {
        const name = (tool.name[lang] || '').toLowerCase();
        const subtitle = (tool.subtitle[lang] || '').toLowerCase();
        const desc = (tool.description[lang] || '').toLowerCase();
        const topics = (tool.topics[lang] || []).join(' ').toLowerCase();
        return (
          name.includes(q) ||
          subtitle.includes(q) ||
          desc.includes(q) ||
          topics.includes(q)
        );
      });
    }

    return list;
  }, [query, activeCategory, activeAge, lang, categories]);

  function scrollToTools() {
    const el = document.getElementById('tools-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-row">
          <div className="brand">
            <div className="brand-logo" aria-hidden="true">
              <BrandMark size={32} />
            </div>
            <div>
              <h1>{t('platform_title')}</h1>
              <p className="subtitle">{t('platform_subtitle')}</p>
            </div>
          </div>

          <div className="header-controls">
            <a
              className="trajectories-link"
              href={trajectoriesUrl}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 15px', borderRadius: '999px', fontWeight: 700, fontSize: '.86rem',
                color: '#fde6c0', background: 'rgba(245,158,11,.18)',
                border: '1px solid rgba(245,158,11,.45)', textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              🧭 {t('trajectories_nav')}
            </a>
            <a
              className="rehber-link"
              href={rehberUrl}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 15px', borderRadius: '999px', fontWeight: 700, fontSize: '.86rem',
                color: '#d7f0d9', background: 'rgba(46,125,50,.2)',
                border: '1px solid rgba(46,125,50,.5)', textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              📘 {t('rehber_nav')}
            </a>
            <button
              className="araclar-link"
              onClick={scrollToTools}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontFamily: 'inherit',
                padding: '8px 15px', borderRadius: '999px', fontWeight: 700, fontSize: '.86rem',
                color: '#bfe8e4', background: 'rgba(13,148,136,.2)',
                border: '1px solid rgba(13,148,136,.5)', whiteSpace: 'nowrap',
              }}
            >
              🛠️ {t('tools_nav')}
            </button>
            <a
              className="zihinden-link"
              href={zihindenUrl}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '8px 15px', borderRadius: '999px', fontWeight: 700, fontSize: '.86rem',
                color: '#cfe4f5', background: 'rgba(44,136,232,.2)',
                border: '1px solid rgba(44,136,232,.5)', textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              📘 {t('zihinden_nav')}
            </a>
            <div className="lang-switcher" role="group" aria-label={t('lang_btn')}>
              {VISIBLE_LANGS.map((l) => (
                <button
                  key={l}
                  className={`lang-btn ${lang === l ? 'active' : ''}`}
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  title={LANG_LABELS[l]}
                  aria-label={LANG_LABELS[l]}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-decoration" aria-hidden="true">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
        <div className="hero-inner">
          <span className="hero-eyebrow">🎯 {t('platform_subtitle')}</span>
          <h2><span className="hero-hl">{t('platform_title')}</span></h2>
          <p className="hero-lead">{t('platform_tagline')}</p>
          <button className="hero-cta" onClick={scrollToTools}>
            {t('platform_hero_cta')} →
          </button>

          <div className="stats-row">
            {STATS.map((s) => (
              <div key={s.key} className="stat">
                <div className="stat-icon" aria-hidden="true">{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{t(`stats_${s.key}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '36px 24px 0', maxWidth: '1140px', margin: '0 auto', width: '100%' }}>
        <div
          style={{
            background: 'linear-gradient(135deg,#f1f8f2,#e3f1e5)',
            border: '1px solid #c5dcc6', borderRadius: '24px', padding: '30px 32px',
            boxShadow: '0 18px 44px -22px rgba(27,94,32,.4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '2rem', lineHeight: 1 }} aria-hidden="true">🧭</span>
            <h3 style={{ margin: 0, color: '#1b5e20', fontSize: '1.55rem', fontWeight: 800, letterSpacing: '-.01em' }}>
              {t('trajectories_nav')}
            </h3>
            <span style={{
              marginLeft: 'auto', fontWeight: 800, color: '#2e7d32', fontSize: '.86rem',
              background: '#fff', border: '1px solid #c5dcc6', borderRadius: '999px', padding: '7px 15px', whiteSpace: 'nowrap',
            }}>{t('traj_scope')}</span>
          </div>
          <p style={{ margin: '0 0 20px', color: '#45584a', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '760px' }}>
            {t('trajectories_desc')}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: '12px', marginBottom: '22px' }}>
            {[['🎂', t('traj_h_age')], ['👤', t('traj_h_lvl')], ['🛠️', t('traj_h_tool')]].map(([ic, tx]) => (
              <div key={tx} style={{ display: 'flex', alignItems: 'center', gap: '11px', background: 'rgba(255,255,255,.65)', border: '1px solid #c5dcc6', borderRadius: '15px', padding: '13px 15px' }}>
                <span style={{ fontSize: '1.4rem', flex: '0 0 auto' }} aria-hidden="true">{ic}</span>
                <span style={{ fontWeight: 700, color: '#1b5e20', fontSize: '.96rem' }}>{tx}</span>
              </div>
            ))}
          </div>
          <a
            href={trajectoriesUrl}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#fff', fontSize: '1.02rem',
              background: 'linear-gradient(135deg,#43a047,#2e7d32)', borderRadius: '999px', padding: '14px 28px',
              textDecoration: 'none', boxShadow: '0 10px 24px -8px rgba(27,94,32,.55)',
            }}
          >
            {t('traj_explore')} →
          </a>
        </div>
      </section>

      <section style={{ padding: '18px 24px 0', maxWidth: '1140px', margin: '0 auto', width: '100%' }}>
        <div
          style={{
            display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap',
            background: '#fff', border: '1px solid #c5dcc6', borderRadius: '20px', padding: '22px 28px',
            boxShadow: '0 14px 36px -24px rgba(27,94,32,.45)',
          }}
        >
          <span style={{ fontSize: '2.4rem', lineHeight: 1, flex: '0 0 auto' }} aria-hidden="true">📘</span>
          <div style={{ flex: '1 1 380px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h3 style={{ margin: 0, color: '#1b5e20', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-.01em' }}>
                {t('rehber_nav')}
              </h3>
              <span style={{
                fontWeight: 800, color: '#2e7d32', fontSize: '.78rem',
                background: '#eef6ef', border: '1px solid #c5dcc6', borderRadius: '999px', padding: '5px 12px', whiteSpace: 'nowrap',
              }}>{t('rehber_scope')}</span>
            </div>
            <p style={{ margin: 0, color: '#45584a', fontSize: '.99rem', lineHeight: 1.55 }}>
              {t('rehber_desc')}
            </p>
          </div>
          <a
            href={rehberUrl}
            style={{
              flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#fff', fontSize: '1rem',
              background: 'linear-gradient(135deg,#43a047,#2e7d32)', borderRadius: '999px', padding: '13px 26px',
              textDecoration: 'none', boxShadow: '0 10px 24px -8px rgba(27,94,32,.55)',
            }}
          >
            {t('rehber_explore')} →
          </a>
        </div>
      </section>

      <section className="why-section">
        <div className="why-inner">
          <div className="section-heading">
            <span className="section-eyebrow">✨</span>
            <h3>{t('why_title')}</h3>
            <p>{t('why_subtitle')}</p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <article
                key={f.key}
                className="feature-card"
                style={{
                  '--feature-accent': f.color,
                  '--feature-accent-soft': hexToSoft(f.color, 0.15),
                }}
              >
                <div className="feature-icon" aria-hidden="true">{f.icon}</div>
                <h4>{t(`feature_${f.key}_title`)}</h4>
                <p>{t(`feature_${f.key}_body`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="tools-section" className="tools-section">
        <div className="section-heading">
          <span className="section-eyebrow">🛠️</span>
          <h3>{t('tools_section_title')}</h3>
          <p>{t('tools_section_sub')}</p>
        </div>

        <div style={{ maxWidth: '1140px', margin: '0 auto 22px', width: '100%', padding: '0 24px' }}>
          <div style={{
            display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap',
            background: 'linear-gradient(135deg,#f1f8f2,#e3f1e5)', border: '1px solid #c5dcc6', borderRadius: '20px', padding: '22px 28px',
            boxShadow: '0 14px 36px -24px rgba(27,94,32,.45)',
          }}>
            <span style={{ fontSize: '2.4rem', lineHeight: 1, flex: '0 0 auto' }} aria-hidden="true">🧮</span>
            <div style={{ flex: '1 1 360px', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <h3 style={{ margin: 0, color: '#1b5e20', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-.01em' }}>{t('set_nav')}</h3>
                <span style={{ fontWeight: 800, color: '#2e7d32', fontSize: '.78rem', background: '#fff', border: '1px solid #c5dcc6', borderRadius: '999px', padding: '5px 12px', whiteSpace: 'nowrap' }}>{t('set_scope')}</span>
              </div>
              <p style={{ margin: 0, color: '#45584a', fontSize: '.99rem', lineHeight: 1.55 }}>{t('set_desc')}</p>
            </div>
            <a href={setUrl} style={{ flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#fff', fontSize: '1rem', background: 'linear-gradient(135deg,#43a047,#2e7d32)', borderRadius: '999px', padding: '13px 26px', textDecoration: 'none', boxShadow: '0 10px 24px -8px rgba(27,94,32,.55)' }}>{t('set_explore')} →</a>
          </div>
        </div>

        <div className="filter-panel">
          <div className="filter-group">
            <label className="filter-label">{t('by_age')}</label>
            <div className="filter-pills">
              {['all', 'early', 'primary', 'middle'].map((age) => (
                <button
                  key={age}
                  className={`filter-pill ${activeAge === age ? 'active' : ''}`}
                  onClick={() => setActiveAge(age)}
                >
                  {t(`age_${age}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">{t('by_category')}</label>
            <div className="filter-pills">
              <button
                className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                {t('all_tools')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group filter-search">
            <input
              type="search"
              className="search-input"
              placeholder={t('search_placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t('search_placeholder')}
            />
          </div>
        </div>

        <div className="tools-result-meta">
          <span className="result-count">
            {filteredTools.length} / {TOOLS.length}
          </span>
        </div>

        {filteredTools.length === 0 ? (
          <div className="no-results">{t('no_results')}</div>
        ) : (
          <div className="tool-grid">
            {filteredTools.map((tool) => (
              <a
                key={tool.id}
                href={resolveToolUrl(tool)}
                className="tool-card"
                aria-label={`${tool.name[lang]} — ${tool.description[lang]}`}
                style={{
                  '--card-accent': tool.color,
                  '--card-accent-soft': hexToSoft(tool.color, 0.15),
                  '--card-accent-softer': hexToSoft(tool.color, 0.06),
                  '--card-accent-dark': darken(tool.color, 0.35),
                }}
              >
                <div className="card-accent-bar" />
                <div className="tool-header">
                  <div className="tool-icon" aria-hidden="true">
                    {tool.icon}
                  </div>
                  <div className="tool-titles">
                    <h3>{tool.name[lang]}</h3>
                    <p>{tool.subtitle[lang]}</p>
                  </div>
                  <span className="tool-age-badge" title={t('age')}>
                    {tool.ageRange}
                  </span>
                </div>

                <p className="tool-body">{tool.description[lang]}</p>

                <div className="tool-meta">
                  {(tool.topics[lang] || []).slice(0, 4).map((topic) => (
                    <span key={topic} className="meta-chip">
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="tool-footer">
                  <div className="tool-footer-info">
                    <span className="footer-badge">📚 {tool.framework}</span>
                  </div>
                  <span className="open-btn">
                    {t('open_tool')} <span aria-hidden="true">→</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="about-section">
        <div className="about-inner">
          <div className="section-heading">
            <span className="section-eyebrow">🎓</span>
            <h3>{t('about')}</h3>
          </div>
          <p className="about-body">{t('about_body')}</p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <strong>{t('platform_title')}</strong>
            <span>· {t('platform_subtitle')}</span>
          </div>
          <div className="footer-meta">
            © 2024-2026 ·{' '}
            <a
              className="footer-author"
              href="https://hercocukmatematikogrenebilir.com/yilmaz-mutlu/"
              target="_blank"
              rel="noopener author"
            >
              {t('author')}
            </a>
          </div>
          <div className="footer-links">
            <a href="https://github.com/ymutlu49" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
