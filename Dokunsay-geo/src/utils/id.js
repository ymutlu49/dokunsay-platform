// Kısa rastgele ID üretici + ızgara yaslama yardımcıları.
export const nextId = () => Math.random().toString(36).slice(2, 8);
export const SNAP = 40; // ızgara adımı (px)
export function snapXY(x, y, enabled) {
  if (!enabled) return { x, y };
  return { x: Math.round(x / SNAP) * SNAP, y: Math.round(y / SNAP) * SNAP };
}
export const MAX_HIST = 30;
