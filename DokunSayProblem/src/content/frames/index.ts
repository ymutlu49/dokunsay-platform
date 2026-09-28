import type { Frame } from './types';
import { CHANGE_FRAMES } from './change';
import { COMBINE_FRAMES } from './combine';
import { COMPARE_FRAMES } from './compare';
import { GROUP_FRAMES_A } from './groups';
import { GROUP_FRAMES_B } from './groups2';
import { MULT_FRAMES } from './multcompare';

export const FRAMES: Frame[] = [
  ...CHANGE_FRAMES, ...COMBINE_FRAMES, ...COMPARE_FRAMES, ...GROUP_FRAMES_A, ...GROUP_FRAMES_B, ...MULT_FRAMES,
];
export { CHAIN_FRAMES } from './chains';
export { TABLE_FRAMES } from './tables';
export { makeExtras } from './extras';
export type { Frame, FrameInput, FrameOut, RemInterp } from './types';
