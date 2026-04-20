import { useState, useEffect } from 'react';

/**
 * Panel sürükleme mantığını yöneten hook.
 * Kanvas üstündeki panellerin (sayı doğrusu, tepsi, fabrika vb.) sürüklenmesini sağlar.
 */
export const usePanelDrag = (cvRef, zoom) => {
  const [positions, setPositions] = useState({
    nl: null, tm: null, tray: null, fab: null, bridge: null,
  });
  const [dragging, setDragging] = useState(null);

  const setPosition = (which, pos) => {
    setPositions((prev) => ({ ...prev, [which]: pos }));
  };

  const resetPosition = (which) => {
    setPositions((prev) => ({ ...prev, [which]: null }));
  };

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e) => {
      if (!cvRef.current) return;
      const cr = cvRef.current.getBoundingClientRect();
      const nx = (e.clientX - cr.left) / zoom - dragging.offX;
      const ny = (e.clientY - cr.top) / zoom - dragging.offY;
      setPosition(dragging.which, { x: nx, y: ny });
    };

    const onUp = () => setDragging(null);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  });

  const startPanelDrag = (which, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cvRef.current) return;

    const cr = cvRef.current.getBoundingClientRect();
    const el = e.currentTarget.closest('[data-panel]');
    if (!el) return;

    const r = el.getBoundingClientRect();
    const ox = (r.left - cr.left) / zoom;
    const oy = (r.top - cr.top) / zoom;
    const mx = (e.clientX - cr.left) / zoom;
    const my = (e.clientY - cr.top) / zoom;

    setDragging({ which, offX: mx - ox, offY: my - oy });
    if (!positions[which]) setPosition(which, { x: ox, y: oy });
  };

  return { positions, setPosition, resetPosition, startPanelDrag };
};
