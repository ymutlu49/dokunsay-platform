import { THEME } from '../../constants/theme';

const ActivityModal = ({ activity, onClose }) => (
  <div onClick={onClose} style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div onClick={(e) => e.stopPropagation()} style={{
      background: '#fffdf7', borderRadius: 20, padding: '28px 32px', maxWidth: 480,
      boxShadow: '0 16px 48px rgba(0,0,0,.25)', textAlign: 'center', animation: 'popIn .35s',
    }}>
      <div style={{ fontSize: 44, marginBottom: 10 }}>{activity.icon}</div>
      <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 8 }}>{activity.name}</div>
      <div style={{ fontSize: 14, marginBottom: 20, color: '#555', lineHeight: 1.6 }}>{activity.description}</div>
      <button onClick={onClose} style={{
        padding: '10px 32px', borderRadius: 12, border: 'none',
        background: 'linear-gradient(135deg,' + THEME.accent + ',' + THEME.accentD + ')',
        color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer',
      }}>{'Başla \▸'}</button>
    </div>
  </div>
);

export default ActivityModal;
