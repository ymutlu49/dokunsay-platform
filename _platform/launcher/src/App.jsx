import { useState, useMemo, useEffect } from 'react';
import { TOOLS, TOOL_CATEGORIES } from './tools.js';
import { LANGS, LANG_LABELS, LANG_FLAGS, useT } from './i18n.js';

const STORAGE_KEY = 'dokunsay:platform:prefs';

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
  { key: 'tools',      icon: '🎯', value: 7 },
  { key: 'languages',  icon: '🌐', value: 3 },
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
  const [lang, setLang] = useState(initial.lang || 'tr');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeAge, setActiveAge] = useState('all');
  const [dyscalculia, setDyscalculia] = useState(Boolean(initial.dyscalculia));
  const [highContrast, setHighContrast] = useState(Boolean(initial.highContrast));

  const t = useT(lang);

  useEffect(() => {
    savePrefs({ lang, dyscalculia, highContrast });
    document.documentElement.setAttribute(
      'data-dyscalculia',
      dyscalculia ? 'on' : 'off'
    );
    document.documentElement.setAttribute(
      'data-contrast',
      highContrast ? 'high' : 'normal'
    );
    document.documentElement.setAttribute('lang', lang);
  }, [lang, dyscalculia, highContrast]);

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
              <svg viewBox="0 0 32 32" fill="none" width="32" height="32">
                <rect x="4" y="4" width="10" height="10" rx="2.5" fill="currentColor" opacity="0.95" />
                <rect x="18" y="4" width="10" height="10" rx="2.5" fill="currentColor" opacity="0.7" />
                <rect x="4" y="18" width="10" height="10" rx="2.5" fill="currentColor" opacity="0.55" />
                <rect x="18" y="18" width="10" height="10" rx="2.5" fill="currentColor" opacity="0.9" />
              </svg>
            </div>
            <div>
              <h1>{t('platform_title')}</h1>
              <p className="subtitle">{t('platform_subtitle')}</p>
            </div>
          </div>

          <div className="header-controls">
            <button
              className={`a11y-toggle ${dyscalculia ? 'on' : ''}`}
              onClick={() => setDyscalculia((v) => !v)}
              aria-pressed={dyscalculia}
              title={t('dyscalculia_mode')}
            >
              <span aria-hidden="true">🧠</span>
              <span className="a11y-label">{t('dyscalculia_mode')}</span>
            </button>
            <button
              className={`a11y-toggle ${highContrast ? 'on' : ''}`}
              onClick={() => setHighContrast((v) => !v)}
              aria-pressed={highContrast}
              title={t('high_contrast')}
            >
              <span aria-hidden="true">🌓</span>
              <span className="a11y-label">{t('high_contrast')}</span>
            </button>
            <div className="lang-switcher" role="group" aria-label={t('lang_btn')}>
              {LANGS.map((l) => (
                <button
                  key={l}
                  className={`lang-btn ${lang === l ? 'active' : ''}`}
                  onClick={() => setLang(l)}
                  aria-pressed={lang === l}
                  title={LANG_LABELS[l]}
                >
                  <span>{LANG_FLAGS[l]}</span>
                  <span className="lang-btn-label">{LANG_LABELS[l]}</span>
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
          <h2>{t('platform_title')}</h2>
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
          <h3>{t('all_tools')}</h3>
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
            © 2024-2026 · {t('author')}
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
