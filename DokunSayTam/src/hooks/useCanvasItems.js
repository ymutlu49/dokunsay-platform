import { useState, useRef } from 'react';

const GRID = 48;
const snapToGrid = (value) => Math.round(value / GRID) * GRID;

/**
 * Kanvas üzerindeki pul/kart/sayı öğelerini yöneten hook.
 */
export const useCanvasItems = () => {
  const [items, setItems] = useState([]);
  const [poofs, setPoofs] = useState([]);
  const nextId = useRef(1);
  const cancelLock = useRef(false);

  const addItem = (type, value, x, y) => {
    setItems((prev) => [
      ...prev,
      { id: nextId.current++, t: type, v: value, x: snapToGrid(x), y: snapToGrid(y) },
    ]);
  };

  const moveItem = (id, x, y) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, x: snapToGrid(x), y: snapToGrid(y) } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const checkZeroPair = (droppedId) => {
    if (cancelLock.current) return;

    const dropped = items.find((item) => item.id === droppedId);
    if (!dropped || (dropped.t !== 'pos' && dropped.t !== 'neg')) return;

    const oppositeType = dropped.t === 'pos' ? 'neg' : 'pos';
    let match = null;

    items.forEach((item) => {
      if (match) return;
      if (item.id !== droppedId && item.t === oppositeType) {
        const dx = dropped.x - item.x;
        const dy = dropped.y - item.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < GRID * 1.3) match = item;
      }
    });

    if (!match) return;

    cancelLock.current = true;
    const midX = (dropped.x + match.x) / 2;
    const midY = (dropped.y + match.y) / 2;

    setItems((prev) => prev.filter((item) => item.id !== droppedId && item.id !== match.id));
    setPoofs([{ x: midX, y: midY, id: nextId.current++ }]);
    setTimeout(() => {
      setPoofs([]);
      cancelLock.current = false;
    }, 800);
  };

  const addChips = (type, count) => {
    const startX = 120;
    const startY = 100;
    const existing = items.filter((i) => i.t === type).length;
    for (let i = 0; i < count; i++) {
      const idx = existing + i;
      addItem(type, 1, startX + (idx % 8) * GRID, startY + Math.floor(idx / 8) * GRID);
    }
  };

  const addZeroPair = () => {
    const y = 100 + Math.floor(items.length / 6) * GRID;
    addItem('pos', 1, 120, y);
    addItem('neg', 1, 120 + GRID * 3, y);
  };

  const clearAll = () => setItems([]);

  const posCount = items.filter((i) => i.t === 'pos').length;
  const negCount = items.filter((i) => i.t === 'neg').length;
  const zeroPairs = Math.min(posCount, negCount);
  const netValue = posCount - negCount;

  return {
    items, setItems, poofs, nextId,
    addItem, moveItem, removeItem, checkZeroPair,
    addChips, addZeroPair, clearAll,
    posCount, negCount, zeroPairs, netValue,
    GRID,
  };
};
