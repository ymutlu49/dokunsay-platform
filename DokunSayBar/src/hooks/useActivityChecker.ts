import { useCallback } from "react";
import { CELL_SIZE } from "../constants/dimensions";
import { playTone } from "../services/audioService";
import { getSnapHoles } from "../utils/geometry";
import { useAppState } from "../state/AppContext";
import type { CanvasItem, RodItem, ChipItem } from "../types";

export function useActivityChecker(
  saveProgressFn: (name: string) => void
) {
  const { state, dispatch } = useAppState();

  const showFeedback = useCallback(
    (ok: boolean) => {
      dispatch({ type: "SET_FEEDBACK", feedback: ok ? "ok" : "no" });
      if (ok) {
        playTone(523, 0.2, 0.12);
        playTone(659, 0.2, 0.12);
        if (state.activeTemplate) saveProgressFn(state.activeTemplate.n);
      } else {
        playTone(220, 0.3, 0.08, "sawtooth");
      }
      setTimeout(() => dispatch({ type: "SET_FEEDBACK", feedback: null }), 2500);
    },
    [dispatch, state.activeTemplate, saveProgressFn]
  );

  const checkActivity = useCallback(() => {
    const { activeTemplate, items } = state;
    if (!activeTemplate || activeTemplate.chk === "none") {
      dispatch({ type: "SET_FEEDBACK", feedback: "info" });
      setTimeout(() => dispatch({ type: "SET_FEEDBACK", feedback: null }), 2000);
      return;
    }

    const rods = items.filter((i): i is RodItem => i.type === "rod");
    const chips = items.filter((i): i is ChipItem => i.type === "chip");
    const chk = activeTemplate.chk;

    if (chk === "sort_asc") {
      const sorted = rods.slice().sort((a, b) => a.x - b.x);
      let ok = true;
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].value < sorted[i - 1].value) { ok = false; break; }
      }
      showFeedback(ok && rods.length >= 2);
      return;
    }

    if (chk === "sort_desc") {
      const sorted = rods.slice().sort((a, b) => a.x - b.x);
      let ok = true;
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].value > sorted[i - 1].value) { ok = false; break; }
      }
      showFeedback(ok && rods.length >= 2);
      return;
    }

    if (chk === "adjacent") {
      let ok = false;
      for (let ai = 0; ai < rods.length && !ok; ai++) {
        for (let bi = ai + 1; bi < rods.length; bi++) {
          const ra = rods[ai], rb = rods[bi];
          if (Math.abs(ra.y - rb.y) < 8) {
            const g1 = Math.abs((ra.x + ra.value * CELL_SIZE) - rb.x);
            const g2 = Math.abs((rb.x + rb.value * CELL_SIZE) - ra.x);
            if (g1 < 10 || g2 < 10) { ok = true; break; }
          }
        }
      }
      showFeedback(ok);
      return;
    }

    if (chk === "compare") {
      showFeedback(
        rods.length >= 2 &&
        Math.abs(rods[0].y - rods[1].y) > 20 &&
        Math.abs(rods[0].x - rods[1].x) < CELL_SIZE
      );
      return;
    }

    if (chk === "sequence") {
      const vals = rods.map((r) => r.value).sort((a, b) => a - b);
      let seq = true;
      for (let k = 1; k < vals.length; k++) {
        if (vals[k] !== vals[k - 1] + 1) { seq = false; break; }
      }
      showFeedback(seq && vals.length >= 3);
      return;
    }

    if (chk === "chips_on_rod") {
      const rodHoles = getSnapHoles(items.filter((i) => i.type === "rod" && !(i as RodItem).flipped));
      let snapped = 0;
      for (const ch of chips) {
        for (const h of rodHoles) {
          if (Math.abs(ch.x - h.x) < 8 && Math.abs(ch.y - h.y) < 8) snapped++;
        }
      }
      showFeedback(snapped >= 1 && rods.length >= 1);
      return;
    }

    if (chk === "chips_in_frame") {
      const frameHoles = getSnapHoles(items.filter((i) => i.type === "frame"));
      let filled = 0;
      for (const ch of chips) {
        for (const h of frameHoles) {
          if (Math.abs(ch.x - h.x) < 8 && Math.abs(ch.y - h.y) < 8) filled++;
        }
      }
      showFeedback(filled >= 1);
      return;
    }

    if (chk === "complete_ten") {
      const frameHoles = getSnapHoles(items.filter((i) => i.type === "frame"));
      let chipCount = 0;
      for (const ch of chips) {
        for (const h of frameHoles) {
          if (Math.abs(ch.x - h.x) < 8 && Math.abs(ch.y - h.y) < 8) chipCount++;
        }
      }
      let rodTotal = 0;
      for (const r of rods) rodTotal += r.value;
      showFeedback(chipCount + rodTotal === 10 || chipCount === 10);
      return;
    }

    if (chk === "part_whole") {
      if (rods.length < 2) { showFeedback(false); return; }
      const byY = rods.slice().sort((a, b) => a.y - b.y);
      const whole = byY[0].value;
      let partSum = 0;
      for (let m = 1; m < byY.length; m++) partSum += byY[m].value;
      showFeedback(partSum === whole);
      return;
    }

    showFeedback(false);
  }, [state, dispatch, showFeedback]);

  return { checkActivity };
}
