import { THEME } from '../../constants/theme';

const TOOLS = [
  ['select', '🖱️', 'Seç'],
  ['pen', '\✏\️', 'Kalem'],
  ['highlighter', '🖍️', 'Vurgula'],
  ['eraser', '🧹', 'Silgi'],
];

const COLORS = ['#1a1a1a', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#fff'];
const WIDTHS = [{ w: 2, label: 'İnce' }, { w: 4, label: 'Orta' }, { w: 8, label: 'Kalın' }];
const ERASER_SIZES = [{ s: 12, label: 'Küçük' }, { s: 24, label: 'Orta' }, { s: 40, label: 'Büyük' }];

const Toolbar = ({
  tool, setTool, penColor, setPenColor, penWidth, setPenWidth,
  eraserSize, setEraserSize, setPenAlpha,
  strokes, undone, undo, redo, clearDrawings,
}) => (
  <div style={{
    position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
    zIndex: 30, display: 'flex', gap: 2,
    background: 'rgba(255,255,255,.95)', backdropFilter: 'blur(12px)',
    borderRadius: 14, padding: '5px 6px',
    boxShadow: '0 4px 20px rgba(0,0,0,.08)', alignItems: 'center',
  }}>
    {/* Araç seçimi */}
    {TOOLS.map(([id, icon, title]) => (
      <button key={id} onClick={() => {
        setTool(id);
        if (id === 'highlighter') { setPenAlpha(0.35); setPenWidth(12); }
        else if (id === 'pen') { setPenAlpha(1); setPenWidth(3); }
      }} title={title} style={{
        width: 34, height: 34, borderRadius: 8,
        border: tool === id ? '2px solid ' + THEME.accent : '2px solid transparent',
        background: tool === id ? THEME.accentL : 'transparent',
        cursor: 'pointer', fontSize: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>{icon}</button>
    ))}

    <div style={{ width: 1, height: 22, background: 'rgba(0,0,0,.08)', margin: '0 2px' }} />

    {/* Renk paleti */}
    {(tool === 'pen' || tool === 'highlighter') && (
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {COLORS.map((c) => (
          <button key={c} onClick={() => setPenColor(c)} style={{
            width: 16, height: 16, borderRadius: '50%', background: c,
            border: penColor === c ? '2.5px solid ' + THEME.accent : c === '#fff' ? '1.5px solid #ddd' : '1.5px solid rgba(0,0,0,.08)',
            cursor: 'pointer',
            boxShadow: penColor === c ? '0 0 0 2px rgba(245,158,11,.3)' : 'none',
          }} />
        ))}
        <div style={{ width: 1, height: 22, background: 'rgba(0,0,0,.08)', margin: '0 2px' }} />
        {WIDTHS.map((s) => (
          <button key={s.w} onClick={() => setPenWidth(tool === 'highlighter' ? s.w * 3 : s.w)} title={s.label} style={{
            width: 28, height: 28, borderRadius: 6,
            border: (penWidth === s.w || (tool === 'highlighter' && penWidth === s.w * 3)) ? '2px solid ' + THEME.accent : '1.5px solid rgba(0,0,0,.06)',
            background: (penWidth === s.w || (tool === 'highlighter' && penWidth === s.w * 3)) ? 'rgba(245,158,11,.08)' : 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: s.w + 6, height: s.w + 1, borderRadius: s.w, background: penColor }} />
          </button>
        ))}
      </div>
    )}

    {/* Silgi boyutu */}
    {tool === 'eraser' && (
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {ERASER_SIZES.map((s) => (
          <button key={s.s} onClick={() => setEraserSize(s.s)} title={s.label} style={{
            width: 28, height: 28, borderRadius: 6,
            border: eraserSize === s.s ? '2px solid ' + THEME.accent : '1.5px solid rgba(0,0,0,.06)',
            background: eraserSize === s.s ? 'rgba(245,158,11,.08)' : 'transparent',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: s.s / 2, height: s.s / 2, borderRadius: '50%', border: '2px solid #999' }} />
          </button>
        ))}
      </div>
    )}

    <div style={{ width: 1, height: 22, background: 'rgba(0,0,0,.08)', margin: '0 2px' }} />
    <button onClick={undo} title="Geri al" style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, color: strokes.length ? '#666' : '#ddd' }}>{'\↩'}</button>
    <button onClick={redo} title="Yinele" style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 14, color: undone.length ? '#666' : '#ddd' }}>{'\↪'}</button>
    <button onClick={clearDrawings} title="Çizimleri sil" style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, color: '#bbb' }}>{'🗑'}</button>
  </div>
);

export default Toolbar;
