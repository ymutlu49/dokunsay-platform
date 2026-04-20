import Chip from '../common/Chip';
import { THEME } from '../../constants/theme';

const MaterialsTab = ({
  addChips, addZeroPair, clearAll, startSidebarDrag,
  showTray, setShowTray, resetTray,
  showFactory, setShowFactory, factoryReset,
  showThermometer, setShowThermometer, setTemp,
  showNumberLine, setShowNumberLine, resetNlPosition,
  walkStep, animateNumberLine, resetNumberLine,
}) => (
  <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', scrollbarWidth: 'thin' }}>
    {/* Pozitif Pullar */}
    <div style={{ background: '#fff', borderRadius: 12, padding: '8px 10px', marginBottom: 6, border: '1px solid rgba(0,0,0,.05)' }}>
      <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: THEME.posB, marginBottom: 5 }}>
        {'\⊕ Pozitif Pullar'}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {[1, 2, 3].map((n) => (
          <div key={n} style={{ width: 28, height: 28, cursor: 'grab', touchAction: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onPointerDown={(e) => startSidebarDrag('pos', 1, e)}>
            <Chip type="pos" size={13} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 2, marginTop: 5 }}>
        {[1, 3, 5, 10].map((n) => (
          <button key={n} onClick={() => addChips('pos', n)} style={{
            flex: 1, padding: '3px 0', borderRadius: 5,
            border: '1px solid rgba(34,197,94,.2)', background: 'rgba(34,197,94,.04)',
            cursor: 'pointer', fontSize: 8, fontWeight: 700, color: THEME.posB, fontFamily: 'inherit',
          }}>{'+' + n}</button>
        ))}
      </div>
    </div>

    {/* Negatif Pullar */}
    <div style={{ background: '#fff', borderRadius: 12, padding: '8px 10px', marginBottom: 6, border: '1px solid rgba(0,0,0,.05)' }}>
      <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: THEME.negB, marginBottom: 5 }}>
        {'\⊖ Negatif Pullar'}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {[1, 2, 3].map((n) => (
          <div key={n} style={{ width: 28, height: 28, cursor: 'grab', touchAction: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onPointerDown={(e) => startSidebarDrag('neg', 1, e)}>
            <Chip type="neg" size={13} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 2, marginTop: 5 }}>
        {[1, 3, 5, 10].map((n) => (
          <button key={n} onClick={() => addChips('neg', n)} style={{
            flex: 1, padding: '3px 0', borderRadius: 5,
            border: '1px solid rgba(239,68,68,.2)', background: 'rgba(239,68,68,.04)',
            cursor: 'pointer', fontSize: 8, fontWeight: 700, color: THEME.negB, fontFamily: 'inherit',
          }}>{'-' + n}</button>
        ))}
      </div>
    </div>

    {/* Sıfır Çifti */}
    <div style={{ background: '#fff', borderRadius: 12, padding: '8px 10px', marginBottom: 6, border: '1px solid rgba(0,0,0,.05)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: '#6d28d9' }}>{'🟣 Sıfır Çifti'}</div>
        <span style={{ fontSize: 8, color: '#aaa' }}>{'(+1)+(\−1)=0'}</span>
      </div>
      <button onClick={addZeroPair} style={{
        width: '100%', marginTop: 4, padding: '5px 0', borderRadius: 6,
        border: '1.5px solid rgba(139,92,246,.2)', background: 'rgba(139,92,246,.04)',
        cursor: 'pointer', fontSize: 10, fontWeight: 700, color: '#6d28d9', fontFamily: 'inherit',
      }}>{'\⊕\⊖ Ekle'}</button>
    </div>

    {/* Araçlar */}
    <div style={{ background: '#fff', borderRadius: 12, padding: '8px 10px', marginBottom: 6, border: '1px solid rgba(0,0,0,.05)' }}>
      <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: THEME.accentD, marginBottom: 4 }}>
        {'⚙️ Araçlar'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* İşlem Tepsisi */}
        {showTray ? (
          <button onClick={() => { setShowTray(false); resetTray(); }} style={{
            padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(245,158,11,.3)',
            background: THEME.accentL, cursor: 'pointer', fontSize: 10, fontWeight: 700,
            color: THEME.accentD, fontFamily: 'inherit', textAlign: 'left',
          }}>{'\✕ Tepsiyi Kapat'}</button>
        ) : (
          <div onPointerDown={(e) => startSidebarDrag('tool', 'tray', e)} style={{
            padding: '5px 8px', borderRadius: 6, border: '1px solid ' + THEME.sideB,
            background: '#fff', cursor: 'grab', fontSize: 10, fontWeight: 700,
            color: THEME.accentD, touchAction: 'none', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {'🧮 İşlem Tepsisi'}
            <span style={{ marginLeft: 'auto', fontSize: 8, color: '#ccc' }}>{'\⋮\⋮'}</span>
          </div>
        )}
        {/* Fabrika */}
        {showFactory ? (
          <button onClick={() => { setShowFactory(false); factoryReset(); }} style={{
            padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(124,58,237,.3)',
            background: 'rgba(124,58,237,.06)', cursor: 'pointer', fontSize: 10, fontWeight: 700,
            color: '#7c3aed', fontFamily: 'inherit', textAlign: 'left',
          }}>{'\✕ Fabrikayı Kapat'}</button>
        ) : (
          <div onPointerDown={(e) => startSidebarDrag('tool', 'fab', e)} style={{
            padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,.06)',
            background: '#fff', cursor: 'grab', fontSize: 10, fontWeight: 700,
            color: '#7c3aed', touchAction: 'none', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {'🏭 Tam-Say Fabrikası'}
            <span style={{ marginLeft: 'auto', fontSize: 8, color: '#ccc' }}>{'\⋮\⋮'}</span>
          </div>
        )}
        {/* Termometre */}
        {showThermometer ? (
          <button onClick={() => { setShowThermometer(false); setTemp(0); }} style={{
            padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(239,68,68,.3)',
            background: 'rgba(239,68,68,.04)', cursor: 'pointer', fontSize: 10, fontWeight: 700,
            color: THEME.negB, fontFamily: 'inherit', textAlign: 'left',
          }}>{'\✕ Termometreyi Kapat'}</button>
        ) : (
          <div onPointerDown={(e) => startSidebarDrag('tool', 'tm', e)} style={{
            padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,.06)',
            background: '#fff', cursor: 'grab', fontSize: 10, fontWeight: 700,
            color: THEME.negB, touchAction: 'none', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {'🌡️ Termometre'}
            <span style={{ marginLeft: 'auto', fontSize: 8, color: '#ccc' }}>{'\⋮\⋮'}</span>
          </div>
        )}
        {/* Sayı Doğrusu */}
        {showNumberLine ? (
          <button onClick={() => { setShowNumberLine(false); resetNlPosition(); }} style={{
            padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(59,130,246,.3)',
            background: 'rgba(59,130,246,.06)', cursor: 'pointer', fontSize: 10, fontWeight: 700,
            color: THEME.blue, fontFamily: 'inherit', textAlign: 'left',
          }}>{'\✕ Sayı Doğrusunu Kapat'}</button>
        ) : (
          <div onPointerDown={(e) => startSidebarDrag('tool', 'nl', e)} style={{
            padding: '5px 8px', borderRadius: 6, border: '1px solid rgba(0,0,0,.06)',
            background: '#fff', cursor: 'grab', fontSize: 10, fontWeight: 700,
            color: THEME.blue, touchAction: 'none', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {'📏 Sayı Doğrusu'}
            <span style={{ marginLeft: 'auto', fontSize: 8, color: '#ccc' }}>{'\⋮\⋮'}</span>
          </div>
        )}
      </div>
    </div>

    {/* Sayı doğrusu kontrolleri */}
    {showNumberLine && (
      <div style={{ background: '#fff', borderRadius: 12, padding: '8px 10px', marginBottom: 6, border: '1px solid rgba(59,130,246,.1)' }}>
        <div style={{ display: 'flex', gap: 2, marginBottom: 3 }}>
          <button onClick={() => walkStep('left')} style={{ flex: 1, padding: '4px 0', borderRadius: 5, border: '1px solid rgba(239,68,68,.2)', background: 'rgba(239,68,68,.04)', cursor: 'pointer', fontSize: 8, fontWeight: 800, color: THEME.negB, fontFamily: 'inherit' }}>{'\◀ Sola'}</button>
          <button onClick={() => { resetNumberLine(); }} style={{ flex: 1, padding: '4px 0', borderRadius: 5, border: '1px solid rgba(139,92,246,.2)', background: 'rgba(139,92,246,.04)', cursor: 'pointer', fontSize: 8, fontWeight: 800, color: '#6d28d9', fontFamily: 'inherit' }}>{'\⊙'}</button>
          <button onClick={() => walkStep('right')} style={{ flex: 1, padding: '4px 0', borderRadius: 5, border: '1px solid rgba(34,197,94,.2)', background: 'rgba(34,197,94,.04)', cursor: 'pointer', fontSize: 8, fontWeight: 800, color: THEME.posB, fontFamily: 'inherit' }}>{'Sağa \▶'}</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <button onClick={() => animateNumberLine(0, 4)} style={{ padding: '3px 0', borderRadius: 4, border: '1px solid rgba(34,197,94,.15)', background: 'rgba(34,197,94,.03)', cursor: 'pointer', fontSize: 7, fontWeight: 700, color: THEME.posB, fontFamily: 'inherit' }}>{'0\→+4'}</button>
          <button onClick={() => animateNumberLine(0, -3)} style={{ padding: '3px 0', borderRadius: 4, border: '1px solid rgba(239,68,68,.15)', background: 'rgba(239,68,68,.03)', cursor: 'pointer', fontSize: 7, fontWeight: 700, color: THEME.negB, fontFamily: 'inherit' }}>{'0\→\−3'}</button>
          <button onClick={() => animateNumberLine(3, -7)} style={{ padding: '3px 0', borderRadius: 4, border: '1px solid rgba(139,92,246,.15)', background: 'rgba(139,92,246,.03)', cursor: 'pointer', fontSize: 7, fontWeight: 700, color: '#6d28d9', fontFamily: 'inherit' }}>{'(+3)+(\−7)'}</button>
          <button onClick={() => resetNumberLine()} style={{ padding: '3px 0', borderRadius: 4, border: '1px solid ' + THEME.sideB, background: '#fff', cursor: 'pointer', fontSize: 7, fontWeight: 700, color: '#999', fontFamily: 'inherit' }}>{'🗑 Temizle'}</button>
        </div>
      </div>
    )}

    {/* İşaret & Sayı Kartları */}
    <div style={{ background: '#fff', borderRadius: 12, padding: '8px 10px', marginBottom: 6, border: '1px solid rgba(0,0,0,.05)' }}>
      <div style={{ fontSize: 9, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, color: THEME.accent, marginBottom: 4 }}>
        {'İşaret & Sayı Kartları'}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginBottom: 4 }}>
        {['+', '\−', '\×', '\÷', '=', '<', '>'].map((op) => (
          <div key={op} style={{
            width: 26, height: 26, borderRadius: 6, background: '#fff',
            border: '1.5px solid ' + THEME.sideB, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'grab', fontSize: 13, fontWeight: 900, color: THEME.accent, touchAction: 'none',
          }} onPointerDown={(e) => startSidebarDrag('op', op, e)}>{op}</div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((n) => (
          <div key={n} style={{
            padding: '2px 4px', borderRadius: 4,
            background: n > 0 ? 'rgba(34,197,94,.05)' : n < 0 ? 'rgba(239,68,68,.05)' : 'rgba(139,92,246,.05)',
            border: '1px solid ' + (n > 0 ? THEME.pos : n < 0 ? THEME.neg : '#8b5cf6'),
            cursor: 'grab', fontSize: 9, fontWeight: 800,
            color: n > 0 ? THEME.posB : n < 0 ? THEME.negB : '#6d28d9',
            touchAction: 'none', minWidth: 22, textAlign: 'center',
          }} onPointerDown={(e) => startSidebarDrag('num', n, e)}>
            {n > 0 ? '+' + n : n}
          </div>
        ))}
      </div>
    </div>

    {/* Örnek & Temizle */}
    <div style={{ display: 'flex', gap: 4 }}>
      <button onClick={() => { addChips('pos', 3); addChips('neg', 2); }} style={{
        flex: 1, padding: '7px 0', borderRadius: 8, border: 'none',
        background: 'linear-gradient(135deg,' + THEME.accent + ',' + THEME.accentD + ')',
        color: '#fff', fontSize: 10, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
      }}>{'\⚡ Örnek'}</button>
      <button onClick={clearAll} style={{
        flex: 1, padding: '7px 0', borderRadius: 8,
        border: '1.5px solid ' + THEME.sideB, background: '#fff',
        color: '#888', fontSize: 10, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
      }}>{'🗑 Temizle'}</button>
    </div>
  </div>
);

export default MaterialsTab;
