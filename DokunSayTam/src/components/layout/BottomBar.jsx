import { THEME } from '../../constants/theme';

const BottomBar = ({
  bgType, setBgType, bgColor, setBgColor,
  pages, currentPage, switchPage, addPage, deletePage,
  setShowHelp, setShowAbout, setShowTeacher,
}) => (
  <div style={{
    height: 42, minHeight: 42, background: THEME.side,
    borderTop: '1px solid ' + THEME.sideB,
    display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10,
  }}>
    {/* Arka plan deseni */}
    {[['Düz', 'plain'], ['Kareli', 'grid'], ['Noktalı', 'dot']].map(([label, value]) => (
      <button
        key={value}
        onClick={() => setBgType(value)}
        style={{
          padding: '4px 12px', borderRadius: 8,
          border: bgType === value ? '2px solid ' + THEME.accent : '1.5px solid rgba(0,0,0,.06)',
          background: bgType === value ? THEME.accentL : '#fff',
          cursor: 'pointer', fontSize: 10, fontWeight: 700,
          color: bgType === value ? THEME.accentD : '#999',
        }}
      >{label}</button>
    ))}

    <div style={{ width: 1, height: 22, background: 'rgba(0,0,0,.06)' }} />

    {/* Arka plan rengi */}
    {[['Bej', THEME.bg], ['Beyaz', '#fff'], ['Krem', '#fef3c7'], ['Gri', '#f0f0f0'], ['Koyu', '#2a2a2a']].map(([, color]) => (
      <button
        key={color}
        onClick={() => setBgColor(color)}
        style={{
          width: 22, height: 22, borderRadius: '50%',
          border: bgColor === color ? '3px solid ' + THEME.accent : '2px solid rgba(0,0,0,.08)',
          background: color, cursor: 'pointer',
        }}
      />
    ))}

    <div style={{ width: 1, height: 22, background: 'rgba(0,0,0,.06)' }} />

    {/* Sayfa sistemi */}
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {pages.map((pg) => (
        <button
          key={pg.id}
          onClick={() => switchPage(pg.id)}
          style={{
            padding: '3px 10px', borderRadius: 6,
            border: currentPage === pg.id ? '2px solid ' + THEME.accent : '1.5px solid rgba(0,0,0,.06)',
            background: currentPage === pg.id ? THEME.accentL : '#fff',
            cursor: 'pointer', fontSize: 9,
            fontWeight: currentPage === pg.id ? 800 : 600,
            color: currentPage === pg.id ? THEME.accentD : '#999',
            fontFamily: 'inherit',
          }}
        >
          {pg.label}
          {pages.length > 1 && currentPage === pg.id && (
            <span
              onClick={(e) => { e.stopPropagation(); deletePage(pg.id); }}
              style={{ marginLeft: 4, fontSize: 8, color: '#ccc', cursor: 'pointer' }}
            >\×</span>
          )}
        </button>
      ))}
      <button
        onClick={addPage}
        style={{
          width: 24, height: 24, borderRadius: 6,
          border: '1.5px dashed rgba(0,0,0,.12)', background: '#fff',
          cursor: 'pointer', fontSize: 13, fontWeight: 800, color: '#ccc',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >+</button>
    </div>

    <div style={{ flex: 1 }} />

    {/* Alt bar butonları */}
    {[
      { icon: '?', onClick: () => setShowHelp(true) },
      { icon: '\ℹ', onClick: () => setShowAbout(true) },
      { icon: '👨‍🏫', onClick: () => setShowTeacher(true) },
    ].map(({ icon, onClick }, i) => (
      <button
        key={i}
        onClick={onClick}
        style={{
          width: 28, height: 28, borderRadius: 8,
          border: '1.5px solid rgba(0,0,0,.08)', background: '#fff',
          cursor: 'pointer', fontSize: 12, color: '#999',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >{icon}</button>
    ))}
  </div>
);

export default BottomBar;
