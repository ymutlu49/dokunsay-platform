import { THEME } from '../../constants/theme';

// DokunSay logo/başlık AppShell üst çubuğunda; burada yalnızca uygulamaya
// özgü göstergeler (pul sayacı + net değer + zoom) kalır.
const Header = ({ posCount, negCount, netValue, zoom, setZoom }) => (
  <div style={{
    height: 42, minHeight: 42,
    background: 'linear-gradient(135deg,#1a1a1a,#2d2520)',
    display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
    boxShadow: '0 4px 20px rgba(0,0,0,.2)',
  }}>
    <div style={{ flex: 1 }} />

    {/* Pul sayacı */}
    <div style={{
      display: 'flex', gap: 6, alignItems: 'center',
      padding: '4px 14px', background: 'rgba(255,255,255,.06)', borderRadius: 10,
    }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: '#4ade80' }}>{'\⊕' + posCount}</span>
      <span style={{ fontSize: 12, fontWeight: 800, color: '#f87171' }}>{'\⊖' + negCount}</span>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)' }}>{'\│'}</span>
      <span style={{
        fontSize: 14, fontWeight: 900,
        color: netValue > 0 ? '#4ade80' : netValue < 0 ? '#f87171' : THEME.accent,
      }}>
        {netValue > 0 ? '+' + netValue : netValue === 0 ? '0' : '' + netValue}
      </span>
    </div>

    {/* Zoom kontrolleri */}
    <div style={{
      display: 'flex', gap: 3, alignItems: 'center',
      background: 'rgba(255,255,255,.06)', borderRadius: 8, padding: '4px 8px',
    }}>
      <button
        onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))}
        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 14, fontWeight: 900 }}
      >\−</button>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,.35)', minWidth: 36, textAlign: 'center' }}>
        {Math.round(zoom * 100) + '%'}
      </span>
      <button
        onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(1)))}
        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.5)', cursor: 'pointer', fontSize: 14, fontWeight: 900 }}
      >+</button>
    </div>
  </div>
);

export default Header;
