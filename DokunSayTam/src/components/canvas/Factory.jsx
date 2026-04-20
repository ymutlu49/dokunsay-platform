import Chip from '../common/Chip';
import { THEME } from '../../constants/theme';

const Factory = ({
  posCount, setPosCount, negCount, setNegCount,
  step, pairs, result, mix, solve, reset,
  setShowFactory, panelPos, startPanelDrag,
}) => (
  <div data-panel="fab" style={{
    position: 'absolute',
    left: panelPos ? panelPos.x : undefined,
    top: panelPos ? panelPos.y : 50,
    right: panelPos ? undefined : 16,
    zIndex: 6, width: 260, animation: 'slideDown .4s',
  }}>
    <div style={{
      background: 'linear-gradient(180deg,#1e1b4b,#312e81)',
      borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(30,27,75,.4)', border: '2px solid rgba(255,255,255,.1)',
    }}>
      {/* Başlık */}
      <div onPointerDown={(e) => startPanelDrag('fab', e)} style={{
        background: 'linear-gradient(135deg,#a78bfa,#7c3aed)',
        padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        cursor: 'grab', touchAction: 'none', userSelect: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 16 }}>{'🏭'}</span>
          <span style={{ fontSize: 12, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>TAM-SAY FABRİKASI</span>
        </div>
        <button onClick={() => { setShowFactory(false); reset(); }} style={{
          background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff',
          width: 22, height: 22, borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 900,
        }}>{'\✕'}</button>
      </div>

      {/* Adım göstergesi */}
      <div style={{ display: 'flex', padding: '6px 14px', gap: 4, background: 'rgba(255,255,255,.05)' }}>
        {[['\① Yükle', 0], ['\② Karıştır', 1], ['\③ Sonuç', 2]].map(([label, idx]) => (
          <div key={idx} style={{
            flex: 1, padding: '3px 0', borderRadius: 6, textAlign: 'center', fontSize: 8, fontWeight: 800,
            background: step === idx ? 'rgba(245,158,11,.2)' : 'rgba(255,255,255,.05)',
            color: step === idx ? '#fbbf24' : step > idx ? 'rgba(255,255,255,.4)' : 'rgba(255,255,255,.15)',
            transition: 'all .3s',
          }}>{label}</div>
        ))}
      </div>

      {/* Aşama 1: Yükleme */}
      {step === 0 && (
        <div style={{ padding: '10px 14px' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {/* Pozitif hazne */}
            <div style={{ flex: 1, background: 'rgba(34,197,94,.08)', borderRadius: 12, padding: '8px', border: '1.5px solid rgba(34,197,94,.2)' }}>
              <div style={{ fontSize: 8, fontWeight: 800, color: '#4ade80', textAlign: 'center', marginBottom: 4 }}>{'\⊕ POZİTİF'}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3, minHeight: 32 }}>
                {Array.from({ length: posCount }, (_, i) => (
                  <div key={i} style={{ animation: 'popIn .2s', animationDelay: i * 0.05 + 's', animationFillMode: 'both' }}>
                    <Chip type="pos" size={11} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 3, marginTop: 6 }}>
                <button onClick={() => setPosCount((p) => Math.max(0, p - 1))} style={{ flex: 1, padding: '4px 0', borderRadius: 5, border: 'none', background: 'rgba(255,255,255,.06)', cursor: 'pointer', fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,.3)' }}>{'\−'}</button>
                <div style={{ padding: '4px 10px', borderRadius: 5, background: 'rgba(34,197,94,.15)', fontSize: 14, fontWeight: 900, color: '#4ade80', textAlign: 'center', minWidth: 30 }}>{posCount}</div>
                <button onClick={() => setPosCount((p) => Math.min(10, p + 1))} style={{ flex: 1, padding: '4px 0', borderRadius: 5, border: 'none', background: 'rgba(34,197,94,.15)', cursor: 'pointer', fontSize: 12, fontWeight: 900, color: '#4ade80' }}>+</button>
              </div>
            </div>
            {/* Negatif hazne */}
            <div style={{ flex: 1, background: 'rgba(239,68,68,.08)', borderRadius: 12, padding: '8px', border: '1.5px solid rgba(239,68,68,.2)' }}>
              <div style={{ fontSize: 8, fontWeight: 800, color: '#f87171', textAlign: 'center', marginBottom: 4 }}>{'\⊖ NEGATİF'}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3, minHeight: 32 }}>
                {Array.from({ length: negCount }, (_, i) => (
                  <div key={i} style={{ animation: 'popIn .2s', animationDelay: i * 0.05 + 's', animationFillMode: 'both' }}>
                    <Chip type="neg" size={11} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 3, marginTop: 6 }}>
                <button onClick={() => setNegCount((p) => Math.max(0, p - 1))} style={{ flex: 1, padding: '4px 0', borderRadius: 5, border: 'none', background: 'rgba(255,255,255,.06)', cursor: 'pointer', fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,.3)' }}>{'\−'}</button>
                <div style={{ padding: '4px 10px', borderRadius: 5, background: 'rgba(239,68,68,.15)', fontSize: 14, fontWeight: 900, color: '#f87171', textAlign: 'center', minWidth: 30 }}>{negCount}</div>
                <button onClick={() => setNegCount((p) => Math.min(10, p + 1))} style={{ flex: 1, padding: '4px 0', borderRadius: 5, border: 'none', background: 'rgba(239,68,68,.15)', cursor: 'pointer', fontSize: 12, fontWeight: 900, color: '#f87171' }}>+</button>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 8, padding: '5px 10px', borderRadius: 8, background: 'rgba(255,255,255,.06)', textAlign: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 900, color: '#fff', fontFamily: "'Courier New',monospace" }}>
              {'(+' + posCount + ') + (\−' + negCount + ') = ?'}
            </span>
          </div>
          <button onClick={mix} disabled={posCount === 0 && negCount === 0} style={{
            width: '100%', marginTop: 8, padding: '8px 0', borderRadius: 10, border: 'none',
            background: (posCount === 0 && negCount === 0) ? 'rgba(255,255,255,.06)' : 'linear-gradient(135deg,#f59e0b,#d97706)',
            color: (posCount === 0 && negCount === 0) ? 'rgba(255,255,255,.2)' : '#fff',
            fontSize: 12, fontWeight: 800, cursor: (posCount === 0 && negCount === 0) ? 'default' : 'pointer', fontFamily: 'inherit',
          }}>{'\⚙\️ Karıştır \→'}</button>
        </div>
      )}

      {/* Aşama 2: Karıştırma animasyonu */}
      {step === 1 && (
        <div style={{ padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', marginBottom: 10 }}>Pullar karıştırılıyor...</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
            {Array.from({ length: posCount }, (_, i) => (
              <div key={'mp' + i} style={{ animation: 'popIn .3s', animationDelay: i * 0.1 + 's', animationFillMode: 'both' }}><Chip type="pos" size={11} /></div>
            ))}
            {Array.from({ length: negCount }, (_, i) => (
              <div key={'mn' + i} style={{ animation: 'popIn .3s', animationDelay: (posCount + i) * 0.1 + 's', animationFillMode: 'both' }}><Chip type="neg" size={11} /></div>
            ))}
          </div>
          {pairs > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
              {Array.from({ length: pairs }, (_, i) => (
                <div key={'zp' + i} style={{ display: 'flex', alignItems: 'center', gap: 1, padding: '2px 6px', borderRadius: 8, background: 'rgba(139,92,246,.2)', animation: 'zeroPoof .8s ' + (.6 + i * .15) + 's both' }}>
                  <Chip type="pos" size={8} /><Chip type="neg" size={8} />
                  <span style={{ fontSize: 8, fontWeight: 900, color: '#a78bfa' }}>=0</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)' }}>Sıfır çiftleri eşleşiyor...</div>
        </div>
      )}

      {/* Aşama 3: Sonuç */}
      {step === 2 && (
        <div style={{ padding: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap', marginBottom: 8, minHeight: 28 }}>
            {result > 0 && Array.from({ length: result }, (_, i) => (
              <div key={'rp' + i} style={{ animation: 'popIn .3s', animationDelay: i * 0.1 + 's', animationFillMode: 'both' }}><Chip type="pos" size={12} /></div>
            ))}
            {result < 0 && Array.from({ length: Math.abs(result) }, (_, i) => (
              <div key={'rn' + i} style={{ animation: 'popIn .3s', animationDelay: i * 0.1 + 's', animationFillMode: 'both' }}><Chip type="neg" size={12} /></div>
            ))}
            {result === 0 && (
              <div style={{ animation: 'popIn .3s', padding: '4px 12px', borderRadius: 8, background: 'rgba(139,92,246,.15)' }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#a78bfa' }}>= 0 (Tümü eşleşti!)</span>
              </div>
            )}
          </div>
          {pairs > 0 && <div style={{ fontSize: 9, color: 'rgba(139,92,246,.6)', textAlign: 'center', marginBottom: 4 }}>{pairs + ' sıfır çifti birbirini yok etti'}</div>}
          <div style={{ background: 'rgba(255,255,255,.08)', borderRadius: 12, padding: '10px', textAlign: 'center', marginBottom: 8 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', marginBottom: 2 }}>Sonuç</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: result > 0 ? '#4ade80' : result < 0 ? '#f87171' : '#a78bfa' }}>
              {result > 0 ? '+' + result : result === 0 ? '0' : '' + result}
            </div>
            <div style={{ fontSize: 12, fontWeight: 900, color: 'rgba(255,255,255,.7)', fontFamily: "'Courier New',monospace", marginTop: 4 }}>
              {'(+' + posCount + ') + (\−' + negCount + ') = ' + (result >= 0 ? '+' : '') + result}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={solve} style={{
              flex: 1, padding: '7px 0', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#fff',
              fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
            }}>{'📥 Kanvasa Aktar'}</button>
            <button onClick={reset} style={{
              flex: 1, padding: '7px 0', borderRadius: 8,
              border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.06)',
              color: 'rgba(255,255,255,.5)', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
            }}>{'\↺ Yeniden'}</button>
          </div>
        </div>
      )}
    </div>
  </div>
);

export default Factory;
