import {
  CELL_SIZE, ROD_HEIGHT, CHIP_SIZE,
  FRAME_CELL_SIZE, FRAME_PADDING, CHIP_SNAP_DISTANCE,
} from "../constants/dimensions";
import type { CanvasItem, RodItem, Point } from "../types";

export function getItemWidth(item: CanvasItem): number {
  if (item.type === "rod") return item.rot === 90 ? ROD_HEIGHT : item.value * CELL_SIZE;
  if (item.type === "frame") return (item.cols || 5) * FRAME_CELL_SIZE + FRAME_PADDING * 2;
  if (item.type === "dotgroup") return 2 * (CHIP_SIZE + 8) + CHIP_SIZE;
  return CHIP_SIZE;
}

export function getItemHeight(item: CanvasItem): number {
  if (item.type === "rod") return item.rot === 90 ? item.value * CELL_SIZE : ROD_HEIGHT;
  if (item.type === "frame") return (item.rows || 2) * FRAME_CELL_SIZE + FRAME_PADDING * 2;
  if (item.type === "dotgroup") return 2 * (CHIP_SIZE + 8) + CHIP_SIZE;
  return CHIP_SIZE;
}

export function getSnapHoles(items: CanvasItem[]): Point[] {
  const holes: Point[] = [];

  for (const item of items) {
    if (item.type === "rod" && !item.flipped) {
      for (let i = 0; i < item.value; i++) {
        const isVertical = item.rot === 90;
        holes.push({
          x: item.x + (isVertical ? ROD_HEIGHT / 2 - CHIP_SIZE / 2 : i * CELL_SIZE + CELL_SIZE / 2 - CHIP_SIZE / 2),
          y: item.y + (isVertical ? i * CELL_SIZE + CELL_SIZE / 2 - CHIP_SIZE / 2 : ROD_HEIGHT / 2 - CHIP_SIZE / 2),
        });
      }
    }

    if (item.type === "frame") {
      const rows = item.rows || 2;
      const cols = item.cols || 5;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          holes.push({
            x: item.x + FRAME_PADDING + c * FRAME_CELL_SIZE + FRAME_CELL_SIZE / 2 - CHIP_SIZE / 2,
            y: item.y + FRAME_PADDING + r * FRAME_CELL_SIZE + FRAME_CELL_SIZE / 2 - CHIP_SIZE / 2,
          });
        }
      }
    }
  }

  return holes;
}

export function findNearestHole(
  x: number,
  y: number,
  holes: Point[]
): Point | null {
  let best: Point | null = null;
  let bestDist = CHIP_SNAP_DISTANCE;

  for (const hole of holes) {
    const dist = Math.hypot(x - hole.x, y - hole.y);
    if (dist < bestDist) {
      best = hole;
      bestDist = dist;
    }
  }

  return best;
}

/** Find which rod and which hole index a chip snapped to */
export interface HoleMatch {
  point: Point;
  rodId: number;
  holeIndex: number;
}

export function findNearestHoleWithRod(
  x: number,
  y: number,
  items: CanvasItem[]
): HoleMatch | null {
  let best: HoleMatch | null = null;
  let bestDist = CHIP_SNAP_DISTANCE;

  for (const item of items) {
    if (item.type === "rod" && !item.flipped) {
      for (let i = 0; i < item.value; i++) {
        const isV = item.rot === 90;
        const hx = item.x + (isV ? ROD_HEIGHT / 2 - CHIP_SIZE / 2 : i * CELL_SIZE + CELL_SIZE / 2 - CHIP_SIZE / 2);
        const hy = item.y + (isV ? i * CELL_SIZE + CELL_SIZE / 2 - CHIP_SIZE / 2 : ROD_HEIGHT / 2 - CHIP_SIZE / 2);
        const dist = Math.hypot(x - hx, y - hy);
        if (dist < bestDist) {
          best = { point: { x: hx, y: hy }, rodId: item.id, holeIndex: i };
          bestDist = dist;
        }
      }
    }
    if (item.type === "frame") {
      const rows = (item as any).rows || 2;
      const cols = (item as any).cols || 5;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const hx = item.x + FRAME_PADDING + c * FRAME_CELL_SIZE + FRAME_CELL_SIZE / 2 - CHIP_SIZE / 2;
          const hy = item.y + FRAME_PADDING + r * FRAME_CELL_SIZE + FRAME_CELL_SIZE / 2 - CHIP_SIZE / 2;
          const dist = Math.hypot(x - hx, y - hy);
          if (dist < bestDist) {
            best = { point: { x: hx, y: hy }, rodId: item.id, holeIndex: r * cols + c };
            bestDist = dist;
          }
        }
      }
    }
  }
  return best;
}

/** Get the hole position for a specific rod and hole index */
export function getRodHolePosition(rod: RodItem, holeIndex: number): Point {
  const isV = rod.rot === 90;
  return {
    x: rod.x + (isV ? ROD_HEIGHT / 2 - CHIP_SIZE / 2 : holeIndex * CELL_SIZE + CELL_SIZE / 2 - CHIP_SIZE / 2),
    y: rod.y + (isV ? holeIndex * CELL_SIZE + CELL_SIZE / 2 - CHIP_SIZE / 2 : ROD_HEIGHT / 2 - CHIP_SIZE / 2),
  };
}

/** Determine chip color based on hole index (alternates every 5) */
export function getHoleColor(holeIndex: number): "blue" | "red" {
  const group = Math.floor(holeIndex / 5);
  return group % 2 === 0 ? "blue" : "red";
}

export function getGridBackground(
  type: string,
  isDark: boolean
): React.CSSProperties {
  const color = isDark ? "rgba(255,255,255,.08)" : "rgba(0,0,0,.08)";

  if (type === "square") {
    return {
      backgroundImage:
        `linear-gradient(${color} 1px,transparent 1px),` +
        `linear-gradient(90deg,${color} 1px,transparent 1px)`,
      backgroundSize: "48px 48px",
    };
  }
  if (type === "dot") {
    return {
      backgroundImage: `radial-gradient(circle,${color} 1.2px,transparent 1.2px)`,
      backgroundSize: "24px 24px",
    };
  }
  if (type === "line") {
    return {
      backgroundImage: `linear-gradient(${color} 1px,transparent 1px)`,
      backgroundSize: "100% 32px",
    };
  }
  return {};
}
