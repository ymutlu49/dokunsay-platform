/** Yerleştirilecek çiplerin tepsisi (etiket, sayı, "?", işaret). useDragDrop ile çalışır. */
import type { DndApi } from './useDragDrop';

export interface TrayChip {
  id: string;
  text: string;
  kind: 'label' | 'num' | 'unknown' | 'op';
  used?: boolean;
  sub?: string;
}

export function ChipTray({ title, chips, dnd }: { title: string; chips: TrayChip[]; dnd: DndApi }) {
  return (
    <div className="tray" role="group" aria-label={title}>
      <span className="tray__title">{title}</span>
      <div className="tray__chips">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`chip chip--${c.kind}${c.used ? ' is-used' : ''}${dnd.selected === c.id ? ' is-selected' : ''}`}
            {...dnd.itemProps(c.id, c.text, c.used)}
            aria-label={c.kind === 'unknown' ? '?' : c.sub ? `${c.text}, ${c.sub}` : c.text}
          >
            <span data-numeric={c.kind === 'num' ? 'true' : undefined}>{c.text}</span>
            {c.sub && <small className="chip__sub">{c.sub}</small>}
          </button>
        ))}
      </div>
    </div>
  );
}
