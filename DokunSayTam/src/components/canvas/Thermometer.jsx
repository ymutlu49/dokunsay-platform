import { THEME } from '../../constants/theme';

const Thermometer = ({ temp, changeTemp, setTemp, panelPos, startPanelDrag, resetPosition }) => (
  <div data-panel="tm" style={{
    position: 'absolute',
    left: panelPos ? panelPos.x : undefined,
    top: panelPos ? panelPos.y : 60,
    right: panelPos ? undefined : 20,
    zIndex: 5, width: 120,
  }}>
    <div onPointerDown={(e) => startPanelDrag('tm', e)} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
      padding: '2px 0', cursor: 'grab', userSelect: 'none', touchAction: 'none',
    }}>
      <div style={{ width: 24, height: 4, borderRadius: 2, background: 'rgba(0,0,0,.12)' }} />
      <span style={{ fontSize: 7, fontWeight: 700, color: 'rgba(0,0,0,.15)' }}>sürükle</span>
      <div style={{ width: 24, height: 4, borderRadius: 2, background: 'rgba(0,0,0,.12)' }} />
      {panelPos && (
        <button onClick={(e) => { e.stopPropagation(); resetPosition('tm'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 8, color: '#bbb' }}>{'\↩'}</button>
      )}
    </div>
    <div style={{
      background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(8px)',
      borderRadius: 14, padding: '10px',
      boxShadow: '0 4px 20px rgba(0,0,0,.08)', border: '1.5px solid rgba(0,0,0,.06)',
    }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ width: 28, height: 140, background: 'linear-gradient(180deg,#fee2e2,#dbeafe)', borderRadius: 14, position: 'relative', border: '2px solid #ddd', flexShrink: 0 }}>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: Math.max(4, (temp + 10) / 20 * 140),
            background: temp > 0 ? 'linear-gradient(180deg,#ef4444,#f87171)' : temp < 0 ? 'linear-gradient(180deg,#3b82f6,#60a5fa)' : 'linear-gradient(180deg,#8b5cf6,#a78bfa)',
            borderRadius: '0 0 12px 12px', transition: 'height .4s ease',
          }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 22, fontWeight: 900, textAlign: 'center', marginBottom: 4,
            color: temp > 0 ? THEME.negB : temp < 0 ? THEME.blue : THEME.accent,
          }}>{(temp > 0 ? '+' : '') + temp + '\°C'}</div>
          <div style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
            <button onClick={() => changeTemp(1)} style={{ flex: 1, padding: '4px 0', borderRadius: 5, border: '1px solid rgba(239,68,68,.2)', background: 'rgba(239,68,68,.04)', cursor: 'pointer', fontSize: 9, fontWeight: 800, color: THEME.negB, fontFamily: 'inherit' }}>{'🔥'}</button>
            <button onClick={() => changeTemp(-1)} style={{ flex: 1, padding: '4px 0', borderRadius: 5, border: '1px solid rgba(59,130,246,.2)', background: 'rgba(59,130,246,.04)', cursor: 'pointer', fontSize: 9, fontWeight: 800, color: THEME.blue, fontFamily: 'inherit' }}>{'\❄\️'}</button>
          </div>
          <button onClick={() => setTemp(0)} style={{
            width: '100%', padding: '3px 0', borderRadius: 4, border: '1px solid ' + THEME.sideB,
            background: '#fff', cursor: 'pointer', fontSize: 7, fontWeight: 700, color: '#999', fontFamily: 'inherit',
          }}>{'\↺ 0\°C'}</button>
        </div>
      </div>
    </div>
  </div>
);

export default Thermometer;
