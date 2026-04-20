import { CELL_SIZE, ROD_HEIGHT, HOLE_RADIUS, CHIP_SIZE, FRAME_CELL_SIZE, FRAME_PADDING, FRAME_HOLE_RADIUS } from "./dimensions";

/** Pixels-to-3D-units conversion factor */
export const SCALE = 1 / CELL_SIZE;

/** Rod dimensions in 3D units */
export const ROD_3D = {
  cellWidth: 1,
  height: ROD_HEIGHT * SCALE,
  depth: 0.35,
  holeRadius: HOLE_RADIUS * SCALE,
  holeDepth: 0.15,
  cornerRadius: 0.12,
} as const;

/** Frame dimensions in 3D units */
export const FRAME_3D = {
  cellSize: FRAME_CELL_SIZE * SCALE,
  padding: FRAME_PADDING * SCALE,
  depth: 0.25,
  holeRadius: FRAME_HOLE_RADIUS * SCALE,
  holeDepth: 0.12,
} as const;

/** Chip dimensions in 3D units */
export const CHIP_3D = {
  radius: (CHIP_SIZE / 2) * SCALE,
  height: 0.15,
} as const;

/** Camera settings for AR */
export const AR_CAMERA = {
  fov: 50,
  near: 0.1,
  far: 1000,
  defaultPosition: [0, 6, 10] as [number, number, number],
} as const;

/** Ground plane for AR placement */
export const AR_GROUND = {
  size: 50,
  yPosition: 0,
} as const;
