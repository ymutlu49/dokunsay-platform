import { THEME } from '../../constants/theme';
import Switch from '../common/Switch';

const FeaturesTab = ({
  showVertical, setShowVertical,
  elevator, setElevator, moveElevator,
  temp, changeTemp, setTemp,
}) => (
  <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
    {/* Görünüm */}
    <div style={{ background: '#fff', borderRadius: 14, padding: '12px', marginBottom: 8, border: '1px solid rgba(0,0,0,.05)' }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: '#555', marginBottom: 8 }}>Görünüm</div>
      <Switch on={showVertical} onTap={() => setShowVertical(!showVertical)} icon="🏗️" label="Dikey sayı doğrusu" sub="Asansör / Deniz seviyesi" />
    </div>

    {/* Asansör Simülasyonu */}
    <div style={{ background: '#fff', borderRadius: 14, padding: '12px', marginBottom: 8, border: '1px solid rgba(0,0,0,.05)' }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: THEME.blue, marginBottom: 8 }}>{'🏢 Asansör Simülasyonu'}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ width: 60, background: 'linear-gradient(180deg,#e0e7ff,#dbeafe)', borderRadius: 10, padding: '4px', position: 'relative', height: 180 }}>
          {Array.from({ length: 11 }, (_, i) => {
            const v = 5 - i;
            return (
              <div key={v} style={{
                position: 'absolute', top: 4 + i * 16, left: 0, right: 0, height: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 8, fontWeight: v === 0 ? 900 : 600,
                color: v > 0 ? THEME.posB : v < 0 ? THEME.negB : THEME.accent,
                background: v === elevator ? 'rgba(245,158,11,.2)' : 'transparent',
                borderRadius: 4, transition: 'background .3s',
              }}>{v === 0 ? 'Giriş' : v > 0 ? '+' + v : v}</div>
            );
          })}
          <div style={{
            position: 'absolute', top: 4 + (5 - elevator) * 16, right: -4,
            width: 8, height: 16, background: THEME.accent, borderRadius: 4,
            transition: 'top .4s ease', boxShadow: '0 2px 8px rgba(245,158,11,.4)',
          }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 20, fontWeight: 900, textAlign: 'center', marginBottom: 8,
            color: elevator > 0 ? THEME.posB : elevator < 0 ? THEME.negB : THEME.accent,
          }}>{elevator === 0 ? 'Giriş Katı' : (elevator > 0 ? '+' : '') + elevator + '. Kat'}</div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
            <button onClick={() => moveElevator(1)} style={{ flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid rgba(34,197,94,.2)', background: 'rgba(34,197,94,.04)', cursor: 'pointer', fontSize: 10, fontWeight: 800, color: THEME.posB, fontFamily: 'inherit' }}>{'\▲ Yukarı'}</button>
            <button onClick={() => moveElevator(-1)} style={{ flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid rgba(239,68,68,.2)', background: 'rgba(239,68,68,.04)', cursor: 'pointer', fontSize: 10, fontWeight: 800, color: THEME.negB, fontFamily: 'inherit' }}>{'\▼ Aşağı'}</button>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {[3, -5, 2, -3].map((d) => (
              <button key={d} onClick={() => moveElevator(d)} style={{
                flex: 1, padding: '4px 0', borderRadius: 5, border: '1px solid ' + THEME.sideB,
                background: '#fff', cursor: 'pointer', fontSize: 8, fontWeight: 700,
                color: d > 0 ? THEME.posB : THEME.negB, fontFamily: 'inherit',
              }}>{(d > 0 ? '+' : '') + d + ' kat'}</button>
            ))}
          </div>
          <button onClick={() => setElevator(0)} style={{
            width: '100%', padding: '4px 0', borderRadius: 5, border: '1px solid ' + THEME.sideB,
            background: '#fff', cursor: 'pointer', fontSize: 8, fontWeight: 700, color: '#999',
            fontFamily: 'inherit', marginTop: 3,
          }}>{'\↺ Girişe dön'}</button>
        </div>
      </div>
    </div>

    {/* Termometre */}
    <div style={{ background: '#fff', borderRadius: 14, padding: '12px', marginBottom: 8, border: '1px solid rgba(0,0,0,.05)' }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, color: THEME.red, marginBottom: 8 }}>{'🌡️ Termometre'}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={{ width: 30, height: 160, background: 'linear-gradient(180deg,#fee2e2,#dbeafe)', borderRadius: 15, position: 'relative', border: '2px solid #ddd' }}>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: Math.max(4, (temp + 10) / 20 * 160),
            background: temp > 0 ? 'linear-gradient(180deg,#ef4444,#f87171)' : temp < 0 ? 'linear-gradient(180deg,#3b82f6,#60a5fa)' : 'linear-gradient(180deg,#8b5cf6,#a78bfa)',
            borderRadius: '0 0 13px 13px', transition: 'height .4s ease',
          }} />
          <div style={{
            position: 'absolute', bottom: Math.max(0, (temp + 10) / 20 * 160) - 8,
            left: '50%', transform: 'translateX(-50%)',
            fontSize: 10, fontWeight: 900, color: '#fff', textShadow: '0 1px 3px rgba(0,0,0,.4)',
          }}>{temp + '\°'}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 28, fontWeight: 900, textAlign: 'center', marginBottom: 4,
            color: temp > 0 ? THEME.negB : temp < 0 ? THEME.blue : THEME.accent,
          }}>{(temp > 0 ? '+' : '') + temp + '\°C'}</div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
            <button onClick={() => changeTemp(1)} style={{ flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid rgba(239,68,68,.2)', background: 'rgba(239,68,68,.04)', cursor: 'pointer', fontSize: 10, fontWeight: 800, color: THEME.negB, fontFamily: 'inherit' }}>{'🔥 +1\°'}</button>
            <button onClick={() => changeTemp(-1)} style={{ flex: 1, padding: '6px 0', borderRadius: 6, border: '1px solid rgba(59,130,246,.2)', background: 'rgba(59,130,246,.04)', cursor: 'pointer', fontSize: 10, fontWeight: 800, color: THEME.blue, fontFamily: 'inherit' }}>{'\❄\️ \−1\°'}</button>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {[5, -5, 3, -8].map((d) => (
              <button key={d} onClick={() => changeTemp(d)} style={{
                flex: 1, padding: '4px 0', borderRadius: 5, border: '1px solid ' + THEME.sideB,
                background: '#fff', cursor: 'pointer', fontSize: 8, fontWeight: 700,
                color: d > 0 ? THEME.negB : THEME.blue, fontFamily: 'inherit',
              }}>{(d > 0 ? '+' : '') + d + '\°'}</button>
            ))}
          </div>
          <button onClick={() => setTemp(0)} style={{
            width: '100%', padding: '4px 0', borderRadius: 5, border: '1px solid ' + THEME.sideB,
            background: '#fff', cursor: 'pointer', fontSize: 8, fontWeight: 700, color: '#999',
            fontFamily: 'inherit', marginTop: 3,
          }}>{'\↺ Sıfırla'}</button>
        </div>
      </div>
    </div>
  </div>
);

export default FeaturesTab;
