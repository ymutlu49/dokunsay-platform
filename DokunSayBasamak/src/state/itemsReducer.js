import { GRID_SNAP } from '../constants/dimensions';

export const initialState = {
  items: [],
  itemHistory: [],
  itemFuture: [],
  strokes: [],
  undone: [],
  pages: [{ id: 1, label: "Sayfa 1" }],
  currentPageId: 1,
  pageData: {},
};

const snap = v => Math.round(v / GRID_SNAP) * GRID_SNAP;

export function itemsReducer(state, action) {
  switch (action.type) {
    case "SET_ITEMS":
      return { ...state, items: action.items };

    case "PUSH_HISTORY":
      return {
        ...state,
        itemHistory: [...state.itemHistory.slice(-29), state.items],
        itemFuture: [],
      };

    case "UNDO": {
      if (!state.itemHistory.length) return state;
      const prev = state.itemHistory[state.itemHistory.length - 1];
      return {
        ...state,
        items: prev,
        itemHistory: state.itemHistory.slice(0, -1),
        itemFuture: [...state.itemFuture, state.items],
      };
    }

    case "REDO": {
      if (!state.itemFuture.length) return state;
      const next = state.itemFuture[state.itemFuture.length - 1];
      return {
        ...state,
        items: next,
        itemFuture: state.itemFuture.slice(0, -1),
        itemHistory: [...state.itemHistory, state.items],
      };
    }

    case "ADD_ITEM":
      return {
        ...state,
        itemHistory: [...state.itemHistory.slice(-29), state.items],
        itemFuture: [],
        items: [...state.items, { id: action.id, t: action.blockType, x: snap(action.x), y: snap(action.y) }],
      };

    case "MOVE_ITEM":
      return {
        ...state,
        items: state.items.map(it => it.id === action.id ? { ...it, x: snap(action.x), y: snap(action.y) } : it),
      };

    case "REMOVE_ITEM":
      return {
        ...state,
        itemHistory: [...state.itemHistory.slice(-29), state.items],
        itemFuture: [],
        items: state.items.filter(it => it.id !== action.id),
      };

    case "SET_ITEMS_BATCH":
      return {
        ...state,
        itemHistory: [...state.itemHistory.slice(-29), state.items],
        itemFuture: [],
        items: action.items,
      };

    case "CLEAR_ALL":
      return {
        ...state,
        itemHistory: state.items.length ? [...state.itemHistory.slice(-29), state.items] : state.itemHistory,
        itemFuture: [],
        items: [],
        strokes: [],
      };

    case "SET_STROKES":
      return { ...state, strokes: action.strokes };

    case "ADD_STROKE":
      return { ...state, strokes: [...state.strokes, action.stroke], undone: [] };

    case "UNDO_STROKE": {
      if (!state.strokes.length) return state;
      const last = state.strokes[state.strokes.length - 1];
      return { ...state, strokes: state.strokes.slice(0, -1), undone: [...state.undone, last] };
    }

    case "REDO_STROKE": {
      if (!state.undone.length) return state;
      const last = state.undone[state.undone.length - 1];
      return { ...state, strokes: [...state.strokes, last], undone: state.undone.slice(0, -1) };
    }

    case "SWITCH_PAGE": {
      const saved = state.pageData[action.pid] || {};
      return {
        ...state,
        pageData: { ...state.pageData, [state.currentPageId]: { items: state.items, strokes: state.strokes } },
        currentPageId: action.pid,
        items: saved.items || [],
        strokes: saved.strokes || [],
        itemHistory: [], itemFuture: [], undone: [],
      };
    }

    case "ADD_PAGE":
      return {
        ...state,
        pageData: { ...state.pageData, [state.currentPageId]: { items: state.items, strokes: state.strokes } },
        pages: [...state.pages, { id: action.id, label: "Sayfa " + action.id }],
        currentPageId: action.id,
        items: [], strokes: [],
        itemHistory: [], itemFuture: [], undone: [],
      };

    case "DELETE_PAGE": {
      if (state.pages.length <= 1) return state;
      const remaining = state.pages.filter(p => p.id !== action.pid);
      const nextId = state.currentPageId === action.pid ? remaining[0].id : state.currentPageId;
      const newData = { ...state.pageData };
      delete newData[action.pid];
      const saved = newData[nextId] || {};
      return {
        ...state,
        pages: remaining,
        pageData: newData,
        currentPageId: nextId,
        items: state.currentPageId === action.pid ? (saved.items || []) : state.items,
        strokes: state.currentPageId === action.pid ? (saved.strokes || []) : state.strokes,
      };
    }

    default:
      return state;
  }
}
