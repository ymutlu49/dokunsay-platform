export type ARMode = "off" | "3d" | "camera-ar" | "recognition";

export interface AR3DItem {
  id: number;
  type: "rod" | "frame" | "chip";
  value?: number;
  cols?: number;
  rows?: number;
  color?: string;
  label?: string | null;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface RecognizedRod {
  x: number;
  y: number;
  width: number;
  height: number;
  holeCount: number;
  confidence: number;
}

export interface ARState {
  mode: ARMode;
  cameraReady: boolean;
  cameraError: string | null;
  placedItems: AR3DItem[];
  selectedARItemId: number | null;
  recognizedRods: RecognizedRod[];
  processingFrame: boolean;
}

export const initialARState: ARState = {
  mode: "off",
  cameraReady: false,
  cameraError: null,
  placedItems: [],
  selectedARItemId: null,
  recognizedRods: [],
  processingFrame: false,
};

export type ARAction =
  | { type: "SET_AR_MODE"; mode: ARMode }
  | { type: "SET_CAMERA_READY"; ready: boolean }
  | { type: "SET_CAMERA_ERROR"; error: string | null }
  | { type: "ADD_AR_ITEM"; item: AR3DItem }
  | { type: "MOVE_AR_ITEM"; id: number; position: [number, number, number] }
  | { type: "REMOVE_AR_ITEM"; id: number }
  | { type: "SELECT_AR_ITEM"; id: number | null }
  | { type: "CLEAR_AR_ITEMS" }
  | { type: "SET_RECOGNIZED_RODS"; rods: RecognizedRod[] }
  | { type: "SET_PROCESSING_FRAME"; processing: boolean };

export function arReducer(state: ARState, action: ARAction): ARState {
  switch (action.type) {
    case "SET_AR_MODE":
      return { ...state, mode: action.mode, recognizedRods: [], cameraError: null };
    case "SET_CAMERA_READY":
      return { ...state, cameraReady: action.ready };
    case "SET_CAMERA_ERROR":
      return { ...state, cameraError: action.error, cameraReady: false };
    case "ADD_AR_ITEM":
      return { ...state, placedItems: [...state.placedItems, action.item] };
    case "MOVE_AR_ITEM":
      return { ...state, placedItems: state.placedItems.map((i) => i.id === action.id ? { ...i, position: action.position } : i) };
    case "REMOVE_AR_ITEM":
      return { ...state, placedItems: state.placedItems.filter((i) => i.id !== action.id) };
    case "SELECT_AR_ITEM":
      return { ...state, selectedARItemId: action.id };
    case "CLEAR_AR_ITEMS":
      return { ...state, placedItems: [], selectedARItemId: null };
    case "SET_RECOGNIZED_RODS":
      return { ...state, recognizedRods: action.rods };
    case "SET_PROCESSING_FRAME":
      return { ...state, processingFrame: action.processing };
    default:
      return state;
  }
}
