/**
 * DokunSay Platform — Ortak Sekme Şeridi (AppTabs)
 *
 * Tüm DokunSay uygulamalarında AYNI sekme görünümü, ikonları, sırası ve
 * etkileşimi. Böylece bir uygulamadan diğerine geçen öğrenci/öğretmen
 * navigasyonu tanıdık bulur ("ortak anlayış").
 *
 * Kanonik sekme kimlikleri + ikonları (TAB_ICONS) ve önerilen sıra (TAB_ORDER)
 * aşağıda. Her uygulama yalnızca ihtiyacı olan sekmeleri, bu sırada gösterir.
 * Etiketler uygulamanın kendi i18n'inden (5 dil) gelir; ikon/sıra/stil paylaşılır.
 *
 * Kullanım:
 *   import { AppTabs } from '@shared/AppTabs.jsx';
 *   <AppTabs
 *     tabs={[
 *       { id: 'materials', label: t('material') },
 *       { id: 'activities', label: t('activity') },
 *     ]}
 *     active={tab}
 *     onChange={setTab}
 *     isDark={isDark}
 *   />
 */

import './AppTabs.css';

/** Kanonik DokunSay sekme sırası — uygulamalar bu sırayı korur. */
export const TAB_ORDER = ['materials', 'activities', 'games', 'teacher', 'settings'];

/** Kanonik sekme ikonları — her uygulamada aynı kavram = aynı ikon. */
export const TAB_ICONS = {
  materials: '📦',
  activities: '📋',
  games: '🎮',
  teacher: '👩‍🏫',
  settings: '⚙️',
};

/** menu_* i18n anahtarına eşleme (i18n-base.js BASE_* ile uyumlu). */
export const TAB_I18N_KEY = {
  materials: 'menu_materials',
  activities: 'menu_activities',
  games: 'menu_games',
  teacher: 'menu_teacher',
  settings: 'menu_settings',
};

/**
 * @param {Object} props
 * @param {Array<{id:string,label:string,icon?:string,badge?:string|number}>} props.tabs
 * @param {string} props.active                aktif sekme id
 * @param {(id:string)=>void} props.onChange
 * @param {'pills'|'list'} [props.variant]     'pills' (yatay, az sekme) | 'list' (dikey, çok sekme)
 * @param {boolean} [props.compact]            ikon ÜSTTE etiket (dar alanda çok sekme için)
 * @param {boolean} [props.isDark]
 * @param {string} [props.ariaLabel]
 */
export function AppTabs({
  tabs,
  active,
  onChange,
  variant = 'pills',
  compact = false,
  isDark = false,
  ariaLabel = 'Sekmeler',
}) {
  return (
    <div
      className={`ds-tabs ds-tabs--${variant}${compact ? ' ds-tabs--compact' : ''}${isDark ? ' ds-tabs--dark' : ''}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((tab) => {
        const icon = tab.icon || TAB_ICONS[tab.id] || '';
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`ds-tab${isActive ? ' ds-tab--active' : ''}`}
            onClick={() => onChange(tab.id)}
            title={tab.label}
          >
            {icon && <span className="ds-tab__icon" aria-hidden="true">{icon}</span>}
            <span className="ds-tab__label">{tab.label}</span>
            {tab.badge != null && tab.badge !== '' && (
              <span className="ds-tab__badge">{tab.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default AppTabs;
