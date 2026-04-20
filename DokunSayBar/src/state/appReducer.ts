import type {
  CanvasItem, DrawLine, ToolType, Language, GridType,
  Template, FeedbackType, InstructionData, CountingState,
  ProgressMap, SideTab, Point,
} from "../types";

/* ===== State Shape ===== */
export interface PageData {
  items: CanvasItem[];
  lines: DrawLine[];
  label?: string;
}

export interface AppState {
  pages: PageData[];
  currentPage: number;
  items: CanvasItem[];
  lines: DrawLine[];
  tool: ToolType;
  penColor: string;
  penWidth: number;
  eraserWidth: number;
  textSize: number;
  textBold: boolean;
  selectedId: number | null;
  language: Language;
  bgColor: string;
  gridType: GridType;
  showLabels: boolean;
  showNumberLine: boolean;
  covered: boolean;
  activeTemplate: Template | null;
  feedback: FeedbackType | null;
  sideTab: SideTab;
  collapsed: boolean;
  helpOpen: boolean;
  numPickerOpen: boolean;
  counting: CountingState | null;
  voiceOn: boolean;
  teacherMode: boolean;
  progress: ProgressMap;
  customTemplates: Template[];
  instruction: InstructionData | null;
  textInput: Point | null;
  textValue: string;
  snapEffect: { x: number; y: number; t: number } | null;
}

export const initialState: AppState = {
  pages: [{ items: [], lines: [] }],
  currentPage: 0,
  items: [],
  lines: [],
  tool: "select",
  penColor: "#1a1a1a",
  penWidth: 3,
  eraserWidth: 20,
  textSize: 20,
  textBold: true,
  selectedId: null,
  language: "tr",
  bgColor: "#f0ead6",
  gridType: "none",
  showLabels: false,
  showNumberLine: false,
  covered: false,
  activeTemplate: null,
  feedback: null,
  sideTab: "mat",
  collapsed: false,
  helpOpen: false,
  numPickerOpen: false,
  counting: null,
  voiceOn: false,
  teacherMode: false,
  progress: {},
  customTemplates: [],
  instruction: null,
  textInput: null,
  textValue: "",
  snapEffect: null,
};

/* ===== Actions ===== */
export type AppAction =
  | { type: "SET_ITEMS"; items: CanvasItem[] }
  | { type: "UPDATE_ITEMS"; updater: (items: CanvasItem[]) => CanvasItem[] }
  | { type: "SET_LINES"; lines: DrawLine[] }
  | { type: "ADD_LINE"; line: DrawLine }
  | { type: "ERASE_LINES"; eraserPoints: Point[] }
  | { type: "SET_TOOL"; tool: ToolType }
  | { type: "SET_PEN_COLOR"; color: string }
  | { type: "SET_PEN_WIDTH"; width: number }
  | { type: "SET_ERASER_WIDTH"; width: number }
  | { type: "SET_TEXT_SIZE"; size: number }
  | { type: "TOGGLE_TEXT_BOLD" }
  | { type: "SET_SELECTED"; id: number | null }
  | { type: "SET_LANGUAGE"; language: Language }
  | { type: "SET_BG_COLOR"; color: string }
  | { type: "SET_GRID_TYPE"; gridType: GridType }
  | { type: "TOGGLE_LABELS" }
  | { type: "TOGGLE_NUMBER_LINE" }
  | { type: "TOGGLE_COVERED" }
  | { type: "SET_ACTIVE_TEMPLATE"; template: Template | null }
  | { type: "SET_FEEDBACK"; feedback: FeedbackType | null }
  | { type: "SET_SIDE_TAB"; tab: SideTab }
  | { type: "TOGGLE_COLLAPSED" }
  | { type: "SET_COLLAPSED"; collapsed: boolean }
  | { type: "TOGGLE_HELP" }
  | { type: "SET_NUM_PICKER"; open: boolean }
  | { type: "SET_COUNTING"; counting: CountingState | null }
  | { type: "SET_VOICE"; on: boolean }
  | { type: "TOGGLE_TEACHER_MODE" }
  | { type: "SET_PROGRESS"; progress: ProgressMap }
  | { type: "SET_CUSTOM_TEMPLATES"; templates: Template[] }
  | { type: "SET_INSTRUCTION"; instruction: InstructionData | null }
  | { type: "SET_TEXT_INPUT"; position: Point | null }
  | { type: "SET_TEXT_VALUE"; value: string }
  | { type: "SET_SNAP_EFFECT"; effect: { x: number; y: number; t: number } | null }
  | { type: "CLEAR_CANVAS" }
  | { type: "GOTO_PAGE"; index: number }
  | { type: "ADD_PAGE" }
  | { type: "DELETE_PAGE"; index: number }
  | { type: "RENAME_PAGE"; index: number; label: string };

/* ===== Reducer ===== */
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.items };
    case "UPDATE_ITEMS":
      return { ...state, items: action.updater(state.items) };
    case "SET_LINES":
      return { ...state, lines: action.lines };
    case "ADD_LINE":
      return { ...state, lines: [...state.lines, action.line] };
    case "ERASE_LINES":
      return {
        ...state,
        lines: state.lines.filter(
          (l) => !l.pts.some((lp) =>
            action.eraserPoints.some(
              (ep) => Math.hypot(lp.x - ep.x, lp.y - ep.y) < state.eraserWidth
            )
          )
        ),
      };
    case "SET_TOOL":
      return { ...state, tool: action.tool };
    case "SET_PEN_COLOR":
      return { ...state, penColor: action.color };
    case "SET_PEN_WIDTH":
      return { ...state, penWidth: action.width };
    case "SET_ERASER_WIDTH":
      return { ...state, eraserWidth: action.width };
    case "SET_TEXT_SIZE":
      return { ...state, textSize: action.size };
    case "TOGGLE_TEXT_BOLD":
      return { ...state, textBold: !state.textBold };
    case "SET_SELECTED":
      return { ...state, selectedId: action.id };
    case "SET_LANGUAGE":
      return { ...state, language: action.language };
    case "SET_BG_COLOR":
      return { ...state, bgColor: action.color };
    case "SET_GRID_TYPE":
      return { ...state, gridType: action.gridType };
    case "TOGGLE_LABELS":
      return { ...state, showLabels: !state.showLabels };
    case "TOGGLE_NUMBER_LINE":
      return { ...state, showNumberLine: !state.showNumberLine };
    case "TOGGLE_COVERED":
      return { ...state, covered: !state.covered };
    case "SET_ACTIVE_TEMPLATE":
      return { ...state, activeTemplate: action.template };
    case "SET_FEEDBACK":
      return { ...state, feedback: action.feedback };
    case "SET_SIDE_TAB":
      return { ...state, sideTab: action.tab };
    case "TOGGLE_COLLAPSED":
      return { ...state, collapsed: !state.collapsed };
    case "SET_COLLAPSED":
      return { ...state, collapsed: action.collapsed };
    case "TOGGLE_HELP":
      return { ...state, helpOpen: !state.helpOpen };
    case "SET_NUM_PICKER":
      return { ...state, numPickerOpen: action.open };
    case "SET_COUNTING":
      return { ...state, counting: action.counting };
    case "SET_VOICE":
      return { ...state, voiceOn: action.on };
    case "TOGGLE_TEACHER_MODE":
      return { ...state, teacherMode: !state.teacherMode };
    case "SET_PROGRESS":
      return { ...state, progress: action.progress };
    case "SET_CUSTOM_TEMPLATES":
      return { ...state, customTemplates: action.templates };
    case "SET_INSTRUCTION":
      return { ...state, instruction: action.instruction };
    case "SET_TEXT_INPUT":
      return { ...state, textInput: action.position };
    case "SET_TEXT_VALUE":
      return { ...state, textValue: action.value };
    case "SET_SNAP_EFFECT":
      return { ...state, snapEffect: action.effect };
    case "CLEAR_CANVAS": {
      const clearedPages = [...state.pages];
      clearedPages[state.currentPage] = { ...clearedPages[state.currentPage], items: [], lines: [] };
      return {
        ...state,
        pages: clearedPages,
        items: [],
        lines: [],
        activeTemplate: null,
        selectedId: null,
        counting: null,
        feedback: null,
      };
    }
    case "GOTO_PAGE": {
      // Save current page first, then switch
      const saved = [...state.pages];
      saved[state.currentPage] = { ...saved[state.currentPage], items: state.items, lines: state.lines };
      const target = saved[action.index] || { items: [], lines: [] };
      return {
        ...state,
        pages: saved,
        currentPage: action.index,
        items: target.items,
        lines: target.lines,
        selectedId: null,
        counting: null,
        activeTemplate: null,
      };
    }
    case "ADD_PAGE": {
      const savedBeforeAdd = [...state.pages];
      savedBeforeAdd[state.currentPage] = { ...savedBeforeAdd[state.currentPage], items: state.items, lines: state.lines };
      const newPages = [...savedBeforeAdd, { items: [], lines: [] }];
      return {
        ...state,
        pages: newPages,
        currentPage: newPages.length - 1,
        items: [],
        lines: [],
        selectedId: null,
        counting: null,
        activeTemplate: null,
      };
    }
    case "DELETE_PAGE": {
      if (state.pages.length <= 1) return state; // Can't delete the last page
      const remaining = state.pages.filter((_, i) => i !== action.index);
      const newIdx = action.index >= remaining.length ? remaining.length - 1 : action.index;
      const pg = remaining[newIdx];
      return {
        ...state,
        pages: remaining,
        currentPage: newIdx,
        items: pg.items,
        lines: pg.lines,
        selectedId: null,
      };
    }
    case "RENAME_PAGE": {
      const renamed = [...state.pages];
      renamed[action.index] = { ...renamed[action.index], label: action.label };
      return { ...state, pages: renamed };
    }
    default:
      return state;
  }
}
