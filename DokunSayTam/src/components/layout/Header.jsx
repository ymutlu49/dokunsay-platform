import { THEME } from '../../constants/theme';

// DokunSay logo/başlık AppShell üst çubuğunda; burada yalnızca uygulamaya
// özgü göstergeler (pul sayacı + net değer + zoom) kalır.
const Header = ({ posCount, negCount, netValue, zoom, setZoom }) => (
  <div style={{
    height: 32, minHeight: 32,
    background: 'linear-gradient(135deg,#1a1a1a,#2d2520)',
    display: 'flex', alignItems: 'center', padding: '0 14px', gap: 8,
    boxShadow: '0 2px 10px rgba(0,0,0,.15)',
  }}>
    <div style={{ flex: 1 }} />

    {/* Pul sayacı */}
    <div style={{
      display: 'flex', gap: 5, alignItems: 'center',
      padding: '2px 10px', background: 'rgba(255,255,255,.08)', borderRadius: 6,
    }}>
      <span style={{ fontSize: 11, fontWeight: 800, color: '#4ade80' }}>{'⊕' + posCount}</span>
      <span style={{ fontSize: 11, fontWeight: 800, color: '#f87171' }}>{'⊖' + negCount}</span>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{'│'}</span>
      <span style={{
        fontSize: 12, fontWeight: 900,
        color: netValue > 0 ? '#4ade80' : netValue < 0 ? '#f87171' : THEME.accent,
      }}>
        {netValue > 0 ? '+' + netValue : netValue === 0 ? '0' : '' + netValue}
      </span>
    </div>

    {/* Zoom kontrolleri */}
    <div style={{
      display: 'flex', gap: 2, alignItems: 'center',
      background: 'rgba(255,255,255,.08)', borderRadius: 6, padding: '2px 6px',
    }}>
      <button
        onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))}
        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.85)', cursor: 'pointer', fontSize: 13, fontWeight: 900 }}
      >−</button>
      <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,.85)', minWidth: 32, textAlign: 'center' }}>
        {Math.round(zoom * 100) + '%'}
      </span>
      <button
        onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(1)))}
        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.85)', cursor: 'pointer', fontSize: 13, fontWeight: 900 }}
      >+</button>
    </div>
  </div>
);

export default Header;
