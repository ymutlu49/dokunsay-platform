/* ===== Core Types ===== */

export type Language = "tr" | "ku" | "en" | "ar" | "fa";
export type ToolType = "select" | "pen" | "text" | "eraser";
export type GridType = "none" | "square" | "dot" | "line";
export type ChipColor = "blue" | "red" | "green" | "yellow";
export type FeedbackType = "ok" | "no" | "info";
export type SideTab = "mat" | "act";

export type ActivityCheck =
  | "none"
  | "compare"
  | "sort_asc"
  | "sort_desc"
  | "adjacent"
  | "sequence"
  | "chips_on_rod"
  | "chips_in_frame"
  | "complete_ten"
  | "part_whole";

export type ActivityCategory =
  | "keşif"
  | "oyun"
  | "sayma"
  | "işlem"
  | "tahmin"
  | "custom";

/* ===== Canvas Items ===== */

interface BaseItem {
  id: number;
  x: number;
  y: number;
  locked?: boolean;
}

export interface RodItem extends BaseItem {
  type: "rod";
  value: number;
  flipped: boolean;
  rot: 0 | 90;
}

export interface FrameItem extends BaseItem {
  type: "frame";
  cols: number;
  rows: number;
}

export interface ChipItem extends BaseItem {
  type: "chip";
  color: ChipColor;
  label: string | null;
  parentId?: number;
  holeIndex?: number;
}

export interface DotGroupItem extends BaseItem {
  type: "dotgroup";
  value: number;
}

export interface TextItem extends BaseItem {
  type: "text";
  label: string;
  fontSize?: number;
  fontWeight?: number;
  color: string;
}

export type CanvasItem = RodItem | FrameItem | ChipItem | DotGroupItem | TextItem;

/* ===== Drawing ===== */

export interface Point {
  x: number;
  y: number;
}

export interface DrawLine {
  pts: Point[];
  color: string;
  w: number;
}

/* ===== Templates ===== */

export interface TemplateItem {
  t: string;
  v?: number;
  c?: number;
  r?: number;
  x: number;
  y: number;
  f?: number;
  rot?: number;
  color?: string;
  label?: string;
}

export interface Template {
  n: string;
  k: string;
  en?: string;
  ar?: string;
  fa?: string;
  i: string;
  cat: ActivityCategory;
  diff: number;
  chk: ActivityCheck;
  d: string;
  dk: string;
  den?: string;
  dar?: string;
  dfa?: string;
  it: TemplateItem[];
}

/* ===== Activity ===== */

export interface InstructionData {
  n: string;
  k: string;
  en?: string;
  ar?: string;
  fa?: string;
  i: string;
  d: string;
  dk: string;
  den?: string;
  dar?: string;
  dfa?: string;
}

export interface CountingState {
  rid: number;
  step: number;
}

export interface ProgressEntry {
  done: boolean;
  ts: number;
}

export type ProgressMap = Record<string, ProgressEntry>;

/* ===== Theme ===== */

export interface ThemePalette {
  bg: string;
  panel: string;
  brd: string;
  tx: string;
  sub: string;
}

/* ===== Auth & User Management ===== */

export type UserRole = "teacher" | "student" | "parent";

export type AuthPage = "login" | "signup" | "forgot" | "app" | "dashboard";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  classIds: string[];
  parentOf: string[];
  studentCode?: string;
  createdAt: number;
}

export interface ClassRoom {
  id: string;
  name: string;
  teacherId: string;
  teacherName: string;
  studentIds: string[];
  code: string;
  createdAt: number;
}

export interface StudentProgressEntry {
  done: boolean;
  ts: number;
  attempts: number;
}

export type StudentProgressMap = Record<string, StudentProgressEntry>;

/* ===== Adjacent Pair ===== */

export interface AdjacentPair {
  l: RodItem;
  r: RodItem;
  mx: number;
  my: number;
}
