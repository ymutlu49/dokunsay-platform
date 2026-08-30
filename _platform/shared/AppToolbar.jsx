/**
 * DokunSay Platform — Ortak Araç Çubuğu primitifleri (AppToolbar)
 *
 * DokunSay Bar'ın alt araç çubuğu referans alınarak çıkarılan yapı taşları.
 * Her uygulama kendi araçlarını bu primitiflerle dizer → tüm uygulamalarda
 * AYNI görünüm/konum, "tek tasarımcı" hissi, kullanıcı acemilik yaşamaz.
 *
 * Önerilen düzen (Bar referansı, soldan sağa):
 *   [Araç grubu: Seç/Çiz/Yaz/Sil] [bağlamsal seçenekler] <Spacer/>
 *   [Görünüm/ızgara] [Geri/İleri] [Zoom] [Yardımcı: tam-ekran/yardım]
 *
 * Kullanım:
 *   import { Toolbar, ToolGroup, ToolButton, IconButton, ToolSep, ToolSpacer } from '@shared/AppToolbar.jsx';
 *   <Toolbar isDark={dk}>
 *     <ToolGroup>
 *       <ToolButton icon="👆" label="Seç" active={tool==='select'} onClick={...} />
 *       ...
 *     </ToolGroup>
 *     <ToolSpacer />
 *     <ToolGroup><IconButton icon="⛶" title="Tam ekran" onClick={...} /></ToolGroup>
 *   </Toolbar>
 */

import './AppToolbar.css';

export function Toolbar({ children, isDark = false, className = '', style, ariaLabel = 'Araçlar' }) {
  return (
    <div
      className={`ds-toolbar${isDark ? ' ds-toolbar--dark' : ''}${className ? ' ' + className : ''}`}
      role="toolbar"
      aria-label={ariaLabel}
      style={style}
    >
      {children}
    </div>
  );
}

export function ToolGroup({ children, className = '' }) {
  return <div className={`ds-toolbar__group${className ? ' ' + className : ''}`}>{children}</div>;
}

export function ToolButton({ icon, label, active = false, onClick, title, style, ...rest }) {
  return (
    <button
      type="button"
      className={`ds-toolbar__btn${active ? ' ds-toolbar__btn--active' : ''}`}
      onClick={onClick}
      title={title || label}
      aria-pressed={active}
      style={style}
      {...rest}
    >
      {icon != null && <span className="ds-toolbar__btn-icon" aria-hidden="true">{icon}</span>}
      {label != null && label !== '' && <span className="ds-toolbar__btn-label">{label}</span>}
    </button>
  );
}

export function IconButton({ icon, active = false, onClick, title, danger = false, disabled = false, style, ...rest }) {
  return (
    <button
      type="button"
      className={`ds-toolbar__icon-btn${active ? ' ds-toolbar__icon-btn--active' : ''}${danger ? ' ds-toolbar__icon-btn--danger' : ''}`}
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      style={style}
      {...rest}
    >
      {icon}
    </button>
  );
}

export function ToolSep() {
  return <span className="ds-toolbar__sep" aria-hidden="true" />;
}

export function ToolSpacer() {
  return <span className="ds-toolbar__spacer" />;
}

export default Toolbar;
