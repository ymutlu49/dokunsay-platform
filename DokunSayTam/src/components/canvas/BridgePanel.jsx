import Chip from '../common/Chip';
import { THEME } from '../../constants/theme';

const BridgePanel = ({ posCount, negCount, zeroPairs, netValue, symExpr, animateNumberLine, panelPos, startPanelDrag, showFactory }) => (
  <div data-panel="bridge" style={{
    position: 'absolute',
    top: panelPos ? panelPos.y : 56,
    left: panelPos ? panelPos.x : undefined,
    right: panelPos ? undefined : (showFactory ? 270 : 16),
    zIndex: 4, borderRadius: 14,
    background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(10px)',
    border: '1.5px solid rgba(0,0,0,.08)',
    boxShadow: '0 4px 20px rgba(0,0,0,.06)',
    overflow: 'hidden', width: 180,
  }}>
    {/* Sürükleme tutamacı */}
    <div onPointerDown={(e) => startPanelDrag('bridge', e)} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
      padding: '3px 0', cursor: 'grab', userSelect: 'none', touchAction: 'none',
      borderBottom: '1px solid rgba(0,0,0,.04)',
    }}>
      <div style={{ width: 24, height: 3, borderRadius: 2, background: 'rgba(0,0,0,.1)' }} />
    </div>

    {/* Somut temsil */}
    <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(0,0,0,.05)' }}>
      <div style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#888', marginBottom: 4 }}>Somut Temsil</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip type="pos" size={10} />
          <span style={{ fontSize: 12, fontWeight: 900, color: THEME.posB }}>{'\×' + posCount}</span>
        </div>
        <span style={{ fontSize: 10, color: '#ccc' }}>+</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip type="neg" size={10} />
          <span style={{ fontSize: 12, fontWeight: 900, color: THEME.negB }}>{'\×' + negCount}</span>
        </div>
      </div>
      {zeroPairs > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
          <div style={{ display: 'flex' }}><Chip type="pos" size={7} /><Chip type="neg" size={7} /></div>
          <span style={{ fontSize: 8, color: '#6d28d9', fontWeight: 700 }}>{zeroPairs + ' sıfır çifti'}</span>
        </div>
      )}
    </div>

    {/* Sembolik ifade */}
    <div style={{ padding: '6px 12px', background: 'rgba(245,158,11,.04)', borderBottom: '1px solid rgba(0,0,0,.05)' }}>
      <div style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: THEME.accentD, marginBottom: 2 }}>Sembolik İfade</div>
      <div style={{ fontSize: 13, fontWeight: 900, color: THEME.text, fontFamily: "'Courier New',monospace" }}>{symExpr}</div>
    </div>

    {/* Sonuç */}
    <div style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 8, color: '#888', fontWeight: 700 }}>Sonuç</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: netValue > 0 ? THEME.posB : netValue < 0 ? THEME.negB : '#6d28d9' }}>
          {netValue > 0 ? '+' + netValue : netValue === 0 ? '0' : '' + netValue}
        </div>
      </div>
      {Math.abs(netValue) <= 10 && (
        <button onClick={() => animateNumberLine(0, netValue)} style={{
          padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(59,130,246,.2)',
          background: 'rgba(59,130,246,.04)', cursor: 'pointer', fontSize: 8, fontWeight: 700,
          color: THEME.blue, fontFamily: 'inherit',
        }}>{'📏 Doğruda Göster'}</button>
      )}
    </div>
  </div>
);

export default BridgePanel;
