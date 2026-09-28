/**
 * Yerleştirme etkileşimi — ÜÇ eşdeğer yol (05 §C1; 06 R14–R16):
 *  1) Sürükle-bırak (pointer events; fare + dokunmatik + kalem),
 *  2) Dokun-dokun (çipe dokun → kutuya dokun),
 *  3) Klavye (Tab ile çip, Enter ile seç → odak ilk kutuya geçer, ok tuşlarıyla kutular
 *     arasında gezin, Enter ile bırak, Esc ile vazgeç).
 * Sürükleme hayaleti body'ye portal ile çizilir ve konumu body'nin kutusuna göre
 * hesaplanır: renk körü modunda `body{filter}` fixed öğeleri body'ye bağlar (06 R15).
 */
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface DndApi {
  selected: string | null;
  setSelected: (id: string | null) => void;
  itemProps: (id: string, label: string, disabled?: boolean) => {
    onPointerDown: (e: PointerEvent<HTMLElement>) => void;
    onClick: (e: MouseEvent<HTMLElement>) => void;
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
    'aria-pressed': boolean;
    'data-dnd-item': string;
    disabled?: boolean;
  };
  targetProps: (id: string) => {
    'data-drop': string;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => void;
    ref: (el: HTMLElement | null) => void;
  };
  ghost: ReactNode;
  dragging: boolean;
}

interface Opts {
  onDrop: (itemId: string, targetId: string) => void;
  /** Seçim yokken kutuya dokunulursa (ör. içindekini geri al). */
  onTargetTap?: (targetId: string) => void;
  onSelect?: (itemId: string | null, label: string) => void;
  /** Klavye gezinmesi için hedeflerin sırası. */
  targetOrder: string[];
}

export function useDragDrop({ onDrop, onTargetTap, onSelect, targetOrder }: Opts): DndApi {
  const [selected, setSelectedState] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ id: string; label: string; x: number; y: number } | null>(null);
  const targets = useRef(new Map<string, HTMLElement>());
  const suppressClick = useRef(false);
  const labels = useRef(new Map<string, string>());
  const lastItemEl = useRef<HTMLElement | null>(null);
  const cbs = useRef({ onDrop, onTargetTap, onSelect });
  cbs.current = { onDrop, onTargetTap, onSelect };

  const setSelected = useCallback((id: string | null) => {
    setSelectedState(id);
    cbs.current.onSelect?.(id, id ? labels.current.get(id) ?? '' : '');
  }, []);

  const focusTarget = useCallback(
    (i: number) => {
      const id = targetOrder[(i + targetOrder.length) % targetOrder.length];
      targets.current.get(id)?.focus();
    },
    [targetOrder],
  );

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelected(null);
        lastItemEl.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, setSelected]);

  const itemProps: DndApi['itemProps'] = (id, label, disabled) => {
    labels.current.set(id, label);
    return {
      'data-dnd-item': id,
      'aria-pressed': selected === id,
      disabled,
      onPointerDown: (e) => {
        if (disabled || (e.pointerType === 'mouse' && e.button !== 0)) return;
        const sx = e.clientX;
        const sy = e.clientY;
        let moved = false;
        const move = (ev: globalThis.PointerEvent) => {
          if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 8) return;
          moved = true;
          setDrag({ id, label, x: ev.clientX, y: ev.clientY });
        };
        const up = (ev: globalThis.PointerEvent) => {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
          window.removeEventListener('pointercancel', up);
          setDrag(null);
          if (!moved) return;
          suppressClick.current = true;
          setTimeout(() => (suppressClick.current = false), 0);
          const el = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('[data-drop]') as HTMLElement | null;
          if (el?.dataset.drop) {
            cbs.current.onDrop(id, el.dataset.drop);
            setSelected(null);
          }
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
        window.addEventListener('pointercancel', up);
      },
      onClick: (e) => {
        if (disabled) return;
        if (suppressClick.current) {
          suppressClick.current = false;
          return;
        }
        lastItemEl.current = e.currentTarget;
        const next = selected === id ? null : id;
        setSelected(next);
        // Klavyeyle (Enter/Boşluk) seçildiyse odağı ilk hedefe taşı.
        if (next && e.detail === 0 && targetOrder.length) setTimeout(() => focusTarget(0), 0);
      },
      onKeyDown: (e) => {
        if (e.key === 'Escape') setSelected(null);
      },
    };
  };

  const targetProps: DndApi['targetProps'] = (id) => ({
    'data-drop': id,
    ref: (el) => {
      if (el) targets.current.set(id, el);
      else targets.current.delete(id);
    },
    onClick: () => {
      if (selected) {
        cbs.current.onDrop(selected, id);
        setSelected(null);
      } else {
        cbs.current.onTargetTap?.(id);
      }
    },
    onKeyDown: (e) => {
      const i = targetOrder.indexOf(id);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        focusTarget(i + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        focusTarget(i - 1);
      }
    },
  });

  let ghost: ReactNode = null;
  if (drag && typeof document !== 'undefined') {
    const r = document.body.getBoundingClientRect();
    ghost = createPortal(
      <div className="dnd-ghost" style={{ left: drag.x - r.left, top: drag.y - r.top }} aria-hidden="true">
        {drag.label}
      </div>,
      document.body,
    );
  }

  return { selected, setSelected, itemProps, targetProps, ghost, dragging: !!drag };
}
