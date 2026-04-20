import Chip from '../common/Chip';
import { THEME } from '../../constants/theme';

const TrayChips = ({ chips, onAdd, onRemove, label }) => {
  const pCnt = chips.filter((c) => c === 'pos').length;
  const nCnt = chips.filter((c) => c === 'neg').length;
  const val = pCnt - nCnt;

  return (
    <div style={{
      background: 'linear-gradient(180deg,#3d8b8b,#2d6b6b)',
      borderRadius: 16, padding: '10px', border: '2.5px solid rgba(255,255,255,.3)',
      minWidth: 140, minHeight: 100,
    }}>
      <div style={{ fontSize: 8, fontWeight: 800, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, minHeight: 44, marginBottom: 6 }}>
        {chips.map((c, i) => (
          <div key={i} onClick={() => onRemove(i)} style={{ cursor: 'pointer', animation: 'popIn .3s' }}>
            <Chip type={c} size={18} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        <button onClick={() => onAdd('pos')} style={{
          flex: 1, padding: '4px 0', borderRadius: 6, border: '1.5px solid rgba(34,197,94,.4)',
          background: 'rgba(34,197,94,.15)', cursor: 'pointer', fontSize: 9, fontWeight: 800,
          color: '#4ade80', fontFamily: 'inherit',
        }}>{'⊕'}</button>
        <button onClick={() => onAdd('neg')} style={{
          flex: 1, padding: '4px 0', borderRadius: 6, border: '1.5px solid rgba(239,68,68,.4)',
          background: 'rgba(239,68,68,.15)', cursor: 'pointer', fontSize: 9, fontWeight: 800,
          color: '#f87171', fontFamily: 'inherit',
        }}>{'⊖'}</button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 4, fontSize: 16, fontWeight: 900, color: '#fff' }}>
        {val >= 0 ? '+' + val : val}
      </div>
    </div>
  );
};

const OperationTray = ({
  trayA, setTrayA, trayB, setTrayB,
  operator, setOperator, result, calculate, reset,
  valueA, valueB, panelPos, startPanelDrag,
}) => (
  <div data-panel="tray" style={panelPos ? {
    position: 'absolute', left: panelPos.x, top: panelPos.y, zIndex: 6,
  } : {
    position: 'absolute', top: 54, left: '50%', transform: 'translateX(-50%)', zIndex: 6, animation: 'slideDown .3s',
  }}>
    {/* Sürükleme tutamacı */}
    <div onPointerDown={(e) => startPanelDrag('tray', e)} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
      padding: '2px 0', cursor: 'grab', userSelect: 'none', touchAction: 'none', marginBottom: 2,
    }}>
      <div style={{ width: 30, height: 4, borderRadius: 2, background: 'rgba(0,0,0,.1)' }} />
      <span style={{ fontSize: 7, color: 'rgba(0,0,0,.15)' }}>sürükle</span>
      <div style={{ width: 30, height: 4, borderRadius: 2, background: 'rgba(0,0,0,.1)' }} />
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <TrayChips chips={trayA} onAdd={(t) => setTrayA((p) => [...p, t])} onRemove={(i) => setTrayA((p) => p.filter((_, j) => j !== i))} label="Sol Tepsi" />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        {['+', '−', '×', '÷'].map((op) => (
          <button key={op} onClick={() => setOperator(op)} style={{
            width: 36, height: 36, borderRadius: 10,
            border: operator === op ? '2.5px solid ' + THEME.accent : '2px solid #ddd',
            background: operator === op ? THEME.accentL : '#fff',
            cursor: 'pointer', fontSize: 18, fontWeight: 900,
            color: operator === op ? THEME.accentD : '#aaa',
          }}>{op}</button>
        ))}
      </div>

      <TrayChips chips={trayB} onAdd={(t) => setTrayB((p) => [...p, t])} onRemove={(i) => setTrayB((p) => p.filter((_, j) => j !== i))} label="Sağ Tepsi" />

      <div style={{ fontSize: 28, fontWeight: 900, color: '#999' }}>{'\→'}</div>

      <div style={{
        background: 'linear-gradient(180deg,#3d8b8b,#2d6b6b)',
        borderRadius: 16, padding: '12px 16px', border: '2.5px solid rgba(255,255,255,.3)',
        minWidth: 90, textAlign: 'center',
      }}>
        {result !== null ? (
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', animation: 'popIn .3s' }}>
              {result >= 0 ? '+' + result : result}
            </div>
            <button onClick={reset} style={{
              marginTop: 4, padding: '3px 10px', borderRadius: 5,
              border: '1px solid rgba(255,255,255,.3)', background: 'rgba(255,255,255,.1)',
              cursor: 'pointer', fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,.7)',
              fontFamily: 'inherit',
            }}>{'\↺ Sıfırla'}</button>
          </div>
        ) : (
          <button onClick={calculate} style={{
            padding: '10px 16px', borderRadius: 8, border: 'none',
            background: THEME.accent, color: '#fff', fontSize: 13, fontWeight: 800,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>= Hesapla</button>
        )}
      </div>
    </div>

    {/* Sembolik ifade */}
    <div style={{
      marginTop: 6, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(8px)',
      borderRadius: 10, padding: '6px 14px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      border: '1.5px solid rgba(245,158,11,.15)',
    }}>
      <div style={{ fontSize: 8, fontWeight: 800, color: THEME.accentD, textTransform: 'uppercase', letterSpacing: 1 }}>Sembolik</div>
      <div style={{ fontSize: 16, fontWeight: 900, color: THEME.text, fontFamily: "'Courier New',monospace" }}>
        {'(' + (valueA >= 0 ? '+' : '') + valueA + ') ' + operator + ' (' + (valueB >= 0 ? '+' : '') + valueB + ')' + (result !== null ? ' = ' + (result >= 0 ? '+' : '') + result : '')}
      </div>
    </div>
  </div>
);

export default OperationTray;
