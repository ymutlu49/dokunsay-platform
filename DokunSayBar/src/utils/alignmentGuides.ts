/**
 * Alignment Guide System
 * Provides smart snapping and visual alignment guides during drag operations.
 */

import { getItemWidth, getItemHeight } from "./geometry";
import { CELL_SIZE } from "../constants/dimensions";
import type { CanvasItem } from "../types";

export interface AlignmentGuide {
  type: "horizontal" | "vertical";
  position: number;       // x for vertical, y for horizontal
  from: number;           // start of the guide line
  to: number;             // end of the guide line
  label?: string;         // optional distance label
}

export interface SnapResult {
  x: number;
  y: number;
  guides: AlignmentGuide[];
}

const SNAP_THRESHOLD = 12;
const GRID_SNAP = CELL_SIZE;

interface Edges {
  left: number;
  right: number;
  top: number;
  bottom: number;
  centerX: number;
  centerY: number;
}

function getEdges(item: CanvasItem): Edges {
  const w = getItemWidth(item);
  const h = getItemHeight(item);
  return {
    left: item.x,
    right: item.x + w,
    top: item.y,
    bottom: item.y + h,
    centerX: item.x + w / 2,
    centerY: item.y + h / 2,
  };
}

/**
 * Calculate smart snap position and alignment guides for a dragged item.
 */
export function calculateSnap(
  dragX: number,
  dragY: number,
  dragItem: CanvasItem,
  allItems: CanvasItem[],
  gridType: string
): SnapResult {
  const dragW = getItemWidth(dragItem);
  const dragH = getItemHeight(dragItem);

  const dragEdges: Edges = {
    left: dragX,
    right: dragX + dragW,
    top: dragY,
    bottom: dragY + dragH,
    centerX: dragX + dragW / 2,
    centerY: dragY + dragH / 2,
  };

  let snapX = dragX;
  let snapY = dragY;
  let bestDx = SNAP_THRESHOLD;
  let bestDy = SNAP_THRESHOLD;
  const guides: AlignmentGuide[] = [];

  // Other items to compare against (exclude self)
  const others = allItems.filter((o) => o.id !== dragItem.id && o.type !== "text");

  for (const other of others) {
    const oe = getEdges(other);

    // ── Vertical alignment (X axis) ──

    // Left-to-left
    const llDist = Math.abs(dragEdges.left - oe.left);
    if (llDist < bestDx) {
      bestDx = llDist;
      snapX = oe.left;
    }

    // Right-to-right
    const rrDist = Math.abs(dragEdges.right - oe.right);
    if (rrDist < bestDx) {
      bestDx = rrDist;
      snapX = oe.right - dragW;
    }

    // Left-to-right (adjacent snap)
    const lrDist = Math.abs(dragEdges.left - oe.right);
    if (lrDist < bestDx) {
      bestDx = lrDist;
      snapX = oe.right;
    }

    // Right-to-left (adjacent snap)
    const rlDist = Math.abs(dragEdges.right - oe.left);
    if (rlDist < bestDx) {
      bestDx = rlDist;
      snapX = oe.left - dragW;
    }

    // Center-to-center X
    const ccxDist = Math.abs(dragEdges.centerX - oe.centerX);
    if (ccxDist < bestDx) {
      bestDx = ccxDist;
      snapX = oe.centerX - dragW / 2;
    }

    // ── Horizontal alignment (Y axis) ──

    // Top-to-top
    const ttDist = Math.abs(dragEdges.top - oe.top);
    if (ttDist < bestDy) {
      bestDy = ttDist;
      snapY = oe.top;
    }

    // Bottom-to-bottom
    const bbDist = Math.abs(dragEdges.bottom - oe.bottom);
    if (bbDist < bestDy) {
      bestDy = bbDist;
      snapY = oe.bottom - dragH;
    }

    // Top-to-bottom (stack)
    const tbDist = Math.abs(dragEdges.top - oe.bottom);
    if (tbDist < bestDy) {
      bestDy = tbDist;
      snapY = oe.bottom;
    }

    // Bottom-to-top (stack above)
    const btDist = Math.abs(dragEdges.bottom - oe.top);
    if (btDist < bestDy) {
      bestDy = btDist;
      snapY = oe.top - dragH;
    }

    // Center-to-center Y
    const ccyDist = Math.abs(dragEdges.centerY - oe.centerY);
    if (ccyDist < bestDy) {
      bestDy = ccyDist;
      snapY = oe.centerY - dragH / 2;
    }
  }

  // ── Grid snap (when grid is active) ──
  if (gridType !== "none") {
    const gridSnapX = Math.round(snapX / GRID_SNAP) * GRID_SNAP;
    const gridSnapY = Math.round(snapY / GRID_SNAP) * GRID_SNAP;

    // Only grid-snap if not already snapped to an item
    if (bestDx >= SNAP_THRESHOLD) {
      if (Math.abs(snapX - gridSnapX) < GRID_SNAP / 2) snapX = gridSnapX;
    }
    if (bestDy >= SNAP_THRESHOLD) {
      if (Math.abs(snapY - gridSnapY) < GRID_SNAP / 2) snapY = gridSnapY;
    }
  }

  // ── Generate visible guides for snapped edges ──
  const finalEdges: Edges = {
    left: snapX,
    right: snapX + dragW,
    top: snapY,
    bottom: snapY + dragH,
    centerX: snapX + dragW / 2,
    centerY: snapY + dragH / 2,
  };

  for (const other of others) {
    const oe = getEdges(other);
    const minY = Math.min(finalEdges.top, oe.top) - 10;
    const maxY = Math.max(finalEdges.bottom, oe.bottom) + 10;
    const minX = Math.min(finalEdges.left, oe.left) - 10;
    const maxX = Math.max(finalEdges.right, oe.right) + 10;

    // Vertical guides (X matches)
    if (Math.abs(finalEdges.left - oe.left) < 2) {
      guides.push({ type: "vertical", position: oe.left, from: minY, to: maxY });
    }
    if (Math.abs(finalEdges.right - oe.right) < 2) {
      guides.push({ type: "vertical", position: oe.right, from: minY, to: maxY });
    }
    if (Math.abs(finalEdges.left - oe.right) < 2) {
      guides.push({ type: "vertical", position: oe.right, from: minY, to: maxY });
    }
    if (Math.abs(finalEdges.right - oe.left) < 2) {
      guides.push({ type: "vertical", position: oe.left, from: minY, to: maxY });
    }
    if (Math.abs(finalEdges.centerX - oe.centerX) < 2) {
      guides.push({ type: "vertical", position: oe.centerX, from: minY, to: maxY });
    }

    // Horizontal guides (Y matches)
    if (Math.abs(finalEdges.top - oe.top) < 2) {
      guides.push({ type: "horizontal", position: oe.top, from: minX, to: maxX });
    }
    if (Math.abs(finalEdges.bottom - oe.bottom) < 2) {
      guides.push({ type: "horizontal", position: oe.bottom, from: minX, to: maxX });
    }
    if (Math.abs(finalEdges.top - oe.bottom) < 2) {
      guides.push({ type: "horizontal", position: oe.bottom, from: minX, to: maxX });
    }
    if (Math.abs(finalEdges.bottom - oe.top) < 2) {
      guides.push({ type: "horizontal", position: oe.top, from: minX, to: maxX });
    }
    if (Math.abs(finalEdges.centerY - oe.centerY) < 2) {
      guides.push({ type: "horizontal", position: oe.centerY, from: minX, to: maxX });
    }
  }

  return { x: snapX, y: snapY, guides };
}
