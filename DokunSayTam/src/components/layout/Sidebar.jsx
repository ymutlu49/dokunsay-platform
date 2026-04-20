import Logo from '../common/Logo';
import MaterialsTab from '../sidebar/MaterialsTab';
import ActivitiesTab from '../sidebar/ActivitiesTab';
import GamesTab from '../sidebar/GamesTab';
import FeaturesTab from '../sidebar/FeaturesTab';
import { THEME } from '../../constants/theme';

const TAB_ICONS = [
  ['📦', 'mat'],
  ['📋', 'act'],
  ['🎮', 'game'],
  ['\⚙\️', 'feat'],
];

const Sidebar = ({
  collapsed, setCollapsed, activeTab, setActiveTab,
  materialsProps, activitiesProps, gamesProps, featuresProps,
}) => (
  <div style={{
    width: collapsed ? 52 : 270, minWidth: collapsed ? 52 : 270,
    background: 'linear-gradient(180deg,' + THEME.side + ',#f3ede0)',
    borderRight: '1px solid ' + THEME.sideB,
    display: 'flex', flexDirection: 'column',
    transition: 'width .25s', overflow: 'hidden',
  }}>
    {!collapsed ? (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Üst bar */}
        <div style={{ padding: '10px 14px 6px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid rgba(0,0,0,.05)' }}>
          <Logo size={28} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: THEME.text }}>DokunSay Tam Sayılar</div>
          </div>
          <button onClick={() => setCollapsed(true)} style={{
            background: 'rgba(0,0,0,.04)', border: 'none', cursor: 'pointer',
            fontSize: 14, color: '#bbb', width: 28, height: 28, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{'\◀'}</button>
        </div>

        {/* Tab butonları */}
        <div style={{ display: 'flex', padding: '6px 10px', gap: 3, background: 'rgba(0,0,0,.02)' }}>
          {TAB_ICONS.map(([icon, tab]) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: '7px 0', border: 'none', borderRadius: 8,
              background: activeTab === tab ? '#fff' : 'transparent',
              cursor: 'pointer', fontSize: 13, fontWeight: 800,
              color: activeTab === tab ? THEME.text : '#aaa',
              fontFamily: 'inherit',
              boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,.06)' : 'none',
            }}>{icon}</button>
          ))}
        </div>

        {/* Tab içeriği */}
        {activeTab === 'mat' && <MaterialsTab {...materialsProps} />}
        {activeTab === 'act' && <ActivitiesTab {...activitiesProps} />}
        {activeTab === 'game' && <GamesTab {...gamesProps} />}
        {activeTab === 'feat' && <FeaturesTab {...featuresProps} />}
      </div>
    ) : (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '12px 0' }}>
        {TAB_ICONS.map(([icon, tab], i) => (
          <button key={i} onClick={() => { setCollapsed(false); setActiveTab(tab); }} style={{
            padding: '8px 12px', borderRadius: 8, border: '1px solid ' + THEME.sideB,
            background: '#fff', cursor: 'pointer', fontSize: 18,
          }}>{icon}</button>
        ))}
      </div>
    )}
  </div>
);

export default Sidebar;
