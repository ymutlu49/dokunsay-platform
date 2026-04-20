import { THEME } from '../../constants/theme';

const Switch = ({ on, onTap, icon, label, sub }) => (
  <div
    onClick={onTap}
    style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '4px 6px', marginBottom: 2, borderRadius: 6,
      cursor: 'pointer', background: on ? THEME.accentL : 'transparent',
    }}
  >
    <div style={{
      width: 28, height: 16, borderRadius: 8,
      background: on ? THEME.accent : '#ddd',
      position: 'relative', transition: '.2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 14 : 2,
        width: 12, height: 12, borderRadius: '50%',
        background: '#fff', transition: '.2s',
      }} />
    </div>
    <span style={{ fontSize: 11 }}>{icon}</span>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: THEME.text }}>{label}</div>
      {sub && <div style={{ fontSize: 7, color: '#aaa' }}>{sub}</div>}
    </div>
  </div>
);

export default Switch;
