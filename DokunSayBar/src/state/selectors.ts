import { CELL_SIZE, ROD_HEIGHT } from "../constants/dimensions";
import type { CanvasItem, AdjacentPair, RodItem } from "../types";

export function getAdjacentPairs(items: CanvasItem[]): AdjacentPair[] {
  const rods = items.filter(
    (i): i is RodItem => i.type === "rod" && (i.rot || 0) === 0
  );
  const pairs: AdjacentPair[] = [];

  for (let ai = 0; ai < rods.length; ai++) {
    const a = rods[ai];
    for (let bi = ai + 1; bi < rods.length; bi++) {
      const b = rods[bi];
      if (Math.abs(a.y - b.y) > 4 || a.flipped !== b.flipped) continue;

      const aRight = a.x + a.value * CELL_SIZE;
      const bRight = b.x + b.value * CELL_SIZE;

      if (Math.abs(aRight - b.x) < 6) {
        pairs.push({ l: a, r: b, mx: aRight, my: a.y + ROD_HEIGHT / 2 });
      } else if (Math.abs(bRight - a.x) < 6) {
        pairs.push({ l: b, r: a, mx: bRight, my: b.y + ROD_HEIGHT / 2 });
      }
    }
  }

  return pairs;
}
