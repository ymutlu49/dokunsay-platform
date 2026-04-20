import { useRef, useCallback } from "react";
import type { CanvasItem } from "../types";
import { MAX_HISTORY } from "../constants/dimensions";
import { useAppState } from "../state/AppContext";

export function useHistory() {
  const { state, dispatch } = useAppState();
  const pastRef = useRef<CanvasItem[][]>([]);
  const futRef = useRef<CanvasItem[][]>([]);
  const itemsRef = useRef(state.items);
  itemsRef.current = state.items;

  const pushHistory = useCallback(() => {
    pastRef.current = pastRef.current.slice(-(MAX_HISTORY - 1)).concat([
      structuredClone(itemsRef.current),
    ]);
    futRef.current = [];
  }, []);

  const undo = useCallback(() => {
    if (!pastRef.current.length) return;
    futRef.current.push(structuredClone(itemsRef.current));
    const prev = pastRef.current.pop()!;
    dispatch({ type: "SET_ITEMS", items: prev });
  }, [dispatch]);

  const redo = useCallback(() => {
    if (!futRef.current.length) return;
    pastRef.current.push(structuredClone(itemsRef.current));
    const next = futRef.current.pop()!;
    dispatch({ type: "SET_ITEMS", items: next });
  }, [dispatch]);

  const updateWithHistory = useCallback(
    (updater: CanvasItem[] | ((prev: CanvasItem[]) => CanvasItem[])) => {
      pushHistory();
      if (typeof updater === "function") {
        dispatch({ type: "UPDATE_ITEMS", updater });
      } else {
        dispatch({ type: "SET_ITEMS", items: updater });
      }
    },
    [pushHistory, dispatch]
  );

  return {
    pushHistory,
    undo,
    redo,
    updateWithHistory,
    canUndo: pastRef.current.length > 0,
    canRedo: futRef.current.length > 0,
    pastRef,
    futRef,
  };
}
