import { Toolbar, ToolGroup, ToolButton, IconButton, ToolSep, ToolSpacer } from '@shared/AppToolbar.jsx';
import { THEME } from '../../constants/theme';

/**
 * Tam alt araç çubuğu — ortak @shared/AppToolbar primitifleriyle (Bar referans).
 * Tüm DokunSay uygulamalarında aynı görünüm/konum.
 */
const BottomBar = ({
  bgType, setBgType, bgColor, setBgColor,
  pages, currentPage, switchPage, addPage, deletePage,
  setShowHelp, setShowAbout, setShowTeacher,
  zoom, setZoom,
}) => (
  <Toolbar>
    {/* Arka plan deseni */}
    <ToolGroup>
      {[['Düz', 'plain'], ['Kareli', 'grid'], ['Noktalı', 'dot']].map(([label, value]) => (
        <ToolButton key={value} label={label} active={bgType === value} onClick={() => setBgType(value)} />
      ))}
    </ToolGroup>

    {/* Arka plan rengi */}
    <ToolGroup>
      {[THEME.bg, '#fff', '#fef3c7', '#f0f0f0', '#2a2a2a'].map((color) => (
        <button
          key={color}
          onClick={() => setBgColor(color)}
          aria-label="Arka plan rengi"
          style={{
            width: 20, height: 20, borderRadius: '50%',
            border: bgColor === color ? '3px solid var(--appshell-accent,#22c55e)' : '2px solid rgba(0,0,0,.1)',
            background: color, cursor: 'pointer', flexShrink: 0,
          }}
        />
      ))}
    </ToolGroup>

    {/* Sayfa sistemi */}
    <ToolGroup>
      {pages.map((pg) => (
        <button
          key={pg.id}
          onClick={() => switchPage(pg.id)}
          className={'ds-toolbar__btn' + (currentPage === pg.id ? ' ds-toolbar__btn--active' : '')}
        >
          {pg.label}
          {pages.length > 1 && currentPage === pg.id && (
            <span
              onClick={(e) => { e.stopPropagation(); deletePage(pg.id); }}
              style={{ marginLeft: 4, fontSize: 10, opacity: 0.7, cursor: 'pointer' }}
            >×</span>
          )}
        </button>
      ))}
      <IconButton icon="+" title="Yeni sayfa" onClick={addPage} />
    </ToolGroup>

    <ToolSpacer />

    {/* Zoom */}
    {setZoom && (
      <ToolGroup>
        <IconButton icon="−" title="Uzaklaştır" onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))} />
        <span style={{ fontSize: 11, fontWeight: 800, minWidth: 40, textAlign: 'center', color: THEME.text }}>
          {Math.round(zoom * 100) + '%'}
        </span>
        <IconButton icon="+" title="Yakınlaştır" onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(1)))} />
      </ToolGroup>
    )}

    <ToolSep />

    {/* Yardımcılar */}
    <ToolGroup>
      <IconButton icon="?" title="Yardım" onClick={() => setShowHelp(true)} />
      <IconButton icon="ℹ️" title="Hakkında" onClick={() => setShowAbout(true)} />
      <IconButton icon="👨‍🏫" title="Öğretmen" onClick={() => setShowTeacher(true)} />
    </ToolGroup>
  </Toolbar>
);

export default BottomBar;
