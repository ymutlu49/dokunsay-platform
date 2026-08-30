import MaterialsTab from '../sidebar/MaterialsTab';
import ActivitiesTab from '../sidebar/ActivitiesTab';
import GamesTab from '../sidebar/GamesTab';
import FeaturesTab from '../sidebar/FeaturesTab';
import { THEME } from '../../constants/theme';
import { AppTabs } from '@shared/AppTabs.jsx';
import { t } from '../../i18n/index.js';

// Kanonik DokunSay sekmeleri (ikon + i18n anahtarı) — tüm uygulamalarla tutarlı.
const TABS = [
  { id: 'mat', icon: '📦', key: 'menu_materials' },
  { id: 'act', icon: '📋', key: 'menu_activities' },
  { id: 'game', icon: '🎮', key: 'menu_games' },
  { id: 'feat', icon: '⚙️', key: 'menu_features' },
];

const Sidebar = ({
  collapsed, setCollapsed, activeTab, setActiveTab, lang = 'tr',
  materialsProps, activitiesProps, gamesProps, featuresProps,
}) => (
  <div style={{
    width: collapsed ? 52 : 220, minWidth: collapsed ? 52 : 220,
    background: 'linear-gradient(180deg,' + THEME.side + ',#f3ede0)',
    borderRight: '1px solid ' + THEME.sideB,
    display: 'flex', flexDirection: 'column',
    transition: 'width .25s', overflow: 'hidden',
  }}>
    {!collapsed ? (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Üst bar — başlık AppShell topbar'ında, burada sadece collapse butonu */}
        <div style={{ padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderBottom: '1px solid rgba(0,0,0,.05)' }}>
          <button onClick={() => setCollapsed(true)} aria-label="Daralt" style={{
            background: 'rgba(0,0,0,.04)', border: 'none', cursor: 'pointer',
            fontSize: 13, color: '#888', width: 26, height: 26, borderRadius: 7,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{'◀'}</button>
        </div>

        {/* Tab şeridi — ortak AppTabs (ikon + etiket, 5 dil) */}
        <div style={{ padding: '4px 8px', background: 'rgba(0,0,0,.02)' }}>
          <AppTabs
            tabs={TABS.map((tb) => ({ id: tb.id, icon: tb.icon, label: t(lang, tb.key) }))}
            active={activeTab}
            onChange={setActiveTab}
            variant="pills"
          />
        </div>

        {/* Tab içeriği */}
        {activeTab === 'mat' && <MaterialsTab {...materialsProps} />}
        {activeTab === 'act' && <ActivitiesTab {...activitiesProps} lang={lang} />}
        {activeTab === 'game' && <GamesTab {...gamesProps} />}
        {activeTab === 'feat' && <FeaturesTab {...featuresProps} />}
      </div>
    ) : (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '12px 0' }}>
        {TABS.map((tb) => (
          <button key={tb.id} onClick={() => { setCollapsed(false); setActiveTab(tb.id); }} title={t(lang, tb.key)} style={{
            padding: '8px 12px', borderRadius: 8, border: '1px solid ' + THEME.sideB,
            background: '#fff', cursor: 'pointer', fontSize: 18,
          }}>{tb.icon}</button>
        ))}
      </div>
    )}
  </div>
);

export default Sidebar;
