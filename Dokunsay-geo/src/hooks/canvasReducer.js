// ══════════════════════════════════════════════════════════════
// Kanvas redüktörü — şekiller, stroklar, undo/redo geçmişi.
// Saf fonksiyon + immutable güncellemeler. History 30 kayıtla sınırlı.
// ══════════════════════════════════════════════════════════════
import { nextId, snapXY, MAX_HIST } from "../utils/id.js";

export const INITIAL_CANVAS_STATE = {
  items: [],
  strokes: [],
  history: [],
  future: [],
  selectedId: null,
};

export function canvasReducer(state, action) {
  const pushHist = (items) => [items, ...state.history].slice(0, MAX_HIST);

  switch (action.type) {
    case "ADD": {
      const sp = snapXY(action.x, action.y, action.snap);
      const item = {
        id: nextId(),
        type: action.t,
        x: sp.x,
        y: sp.y,
        size: action.s || 80,
        rotation: 0,
        flippedH: false,
        flippedV: false,
      };
      if (action.color) item.color = action.color;
      return {
        ...state,
        items: [...state.items, item],
        history: pushHist(state.items),
        future: [],
        selectedId: null,
      };
    }
    case "SELECT":
      return { ...state, selectedId: action.id };
    case "DESELECT":
      return { ...state, selectedId: null };
    case "MOVE": {
      const sp = snapXY(action.x, action.y, action.snap || false);
      return {
        ...state,
        items: state.items.map(it =>
          it.id === action.id ? { ...it, x: sp.x, y: sp.y } : it
        ),
      };
    }
    case "ROTATE":
      return {
        ...state,
        items: state.items.map(it =>
          it.id === action.id ? { ...it, rotation: ((action.deg % 360) + 360) % 360 } : it
        ),
      };
    case "COLOR":
      return {
        ...state,
        items: state.items.map(it =>
          it.id === action.id ? { ...it, color: action.color } : it
        ),
      };
    case "FLIP_H":
      return {
        ...state,
        items: state.items.map(it =>
          it.id === action.id ? { ...it, flippedH: !it.flippedH } : it
        ),
      };
    case "FLIP_V":
      return {
        ...state,
        items: state.items.map(it =>
          it.id === action.id ? { ...it, flippedV: !it.flippedV } : it
        ),
      };
    case "RESIZE":
      return {
        ...state,
        items: state.items.map(it =>
          it.id === action.id ? { ...it, size: Math.max(40, Math.min(400, action.s)) } : it
        ),
      };
    case "EDGE_RESIZE":
      return {
        ...state,
        items: state.items.map(it =>
          it.id === action.id
            ? { ...it, ax: Math.max(0.3, Math.min(3.0, action.ax)), ay: Math.max(0.3, Math.min(3.0, action.ay)) }
            : it
        ),
      };
    case "DEL":
      return {
        ...state,
        items: state.items.filter(it => it.id !== action.id),
        selectedId: state.selectedId === action.id ? null : state.selectedId,
        history: pushHist(state.items),
        future: [],
      };
    case "CLEAR":
      return {
        ...state,
        items: [],
        selectedId: null,
        strokes: [],
        history: pushHist(state.items),
        future: [],
      };
    case "UNDO":
      if (!state.history.length) return state;
      return {
        ...state,
        items: state.history[0],
        history: state.history.slice(1),
        future: [state.items, ...state.future].slice(0, MAX_HIST),
        selectedId: null,
      };
    case "REDO":
      if (!state.future.length) return state;
      return {
        ...state,
        items: state.future[0],
        history: pushHist(state.items),
        future: state.future.slice(1),
        selectedId: null,
      };
    case "STROKE":
      return { ...state, strokes: [...state.strokes, action.sk] };
    case "UNDO_STROKE":
      return { ...state, strokes: state.strokes.slice(0, -1) };
    default:
      return state;
  }
}
