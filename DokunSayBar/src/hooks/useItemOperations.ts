/**
 * DokunSay Bar — Öğe (item) işlemleri
 *
 * App.tsx'ten çıkarıldı (2026-07-19, STANDARDS.md §2.5: "App.jsx 600 satırı geçerse →
 * hooks ve components'e ayır"). Bu blok bütünlüklüydü: hepsi tuvaldeki bir öğeyi
 * yerleştirir / dönüştürür / kaldırır ve tamamı `updateWithHistory` üzerinden geçer.
 *
 * DAVRANIŞ AYNEN KORUNDU — taşıma sırasında tek bir satır bile değiştirilmedi; yalnız
 * App.tsx'in yerel değişkenleri (cvRef, items, dispatch…) parametreye çevrildi.
 *
 * Kritik detaylar (taşırken bozulmaması gerekenler):
 *  · Çubuk ÇEVRİLİNCE üstündeki pullar SİLİNİR (delikler kaybolur, pul havada kalırdı).
 *  · Çubuk DÖNDÜRÜLÜNCE pullar KOPARILIR (parentId/holeIndex geçersizleşir).
 *  · Çubuk SİLİNİNCE ona bağlı pullar da silinir (yetim pul kalmaz).
 *  · startCount her adımda sayıyı SESLENDİRİR; yeni sayım eskisinin interval'ini temizler.
 */

import { useCallback } from "react";
import type { RefObject, MutableRefObject } from "react";
import { sfx } from "../services/audioService";
import { speakNumber } from "../services/speechService";
import { generateId } from "../utils/idGenerator";
import { getItemWidth, getItemHeight } from "../utils/geometry";
import { CELL_SIZE, CHIP_SIZE } from "../constants/dimensions";
import type { CanvasItem, RodItem, Language } from "../types";

interface ItemOpsDeps {
  cvRef: RefObject<HTMLDivElement | null>;
  // MutableRefObject: startCount bu ref'e YAZIYOR (interval kimliği) — salt-okunur RefObject olamaz.
  ctRef: MutableRefObject<ReturnType<typeof setInterval> | null>;
  items: CanvasItem[];
  language: Language;
  updateWithHistory: (updater: (prev: CanvasItem[]) => CanvasItem[]) => void;
  dispatch: (action: any) => void;
}

export function useItemOperations({ cvRef, ctRef, items, language, updateWithHistory, dispatch }: ItemOpsDeps) {
  const place = useCallback((def: Partial<CanvasItem>) => {
    const el = cvRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let x: number, y: number;
    if (def.type === "chip") {
      const cnt = items.filter((i) => i.type === "chip").length;
      x = 20 + (cnt % 10) * (CHIP_SIZE + 4);
      y = Math.round(r.height * 0.55 + (Math.floor(cnt / 10)) * (CHIP_SIZE + 6));
    } else {
      x = Math.round(r.width / 2 - getItemWidth(def as CanvasItem) / 2);
      y = Math.round(r.height / 2 - getItemHeight(def as CanvasItem) / 2);
    }
    updateWithHistory((prev) => [...prev, { ...def, id: generateId(), x, y } as CanvasItem]);
    sfx.place();
  }, [cvRef, items, updateWithHistory]);

  const flipItem = useCallback((id: number) => {
    // When flipping, remove child chips (holes disappear)
    updateWithHistory((p) => {
      const rod = p.find((i) => i.id === id && i.type === "rod") as RodItem | undefined;
      if (!rod) return p.map((i) => i.id === id && i.type === "rod" ? { ...i, flipped: !(i as any).flipped } : i);
      if (!rod.flipped) {
        // Flipping to hidden → remove child chips
        return p.filter((i) => !(i.type === "chip" && (i as any).parentId === id))
          .map((i) => i.id === id ? { ...i, flipped: true } : i);
      }
      return p.map((i) => i.id === id ? { ...i, flipped: false } : i);
    });
    sfx.flip();
  }, [updateWithHistory]);

  const rotateItem = useCallback((id: number) => {
    // When rotating, detach child chips (positions become invalid)
    updateWithHistory((p) => p
      .map((i) => {
        if (i.id === id && i.type === "rod") return { ...i, rot: i.rot === 0 ? 90 : 0 } as RodItem;
        if (i.id === id && i.type === "frame") {
          // Kareyi (beşlik/onluk) döndür: sütun ↔ satır yer değiştirir
          const f = i as any;
          return { ...f, rows: f.cols, cols: f.rows };
        }
        if (i.type === "chip" && (i as any).parentId === id) return { ...i, parentId: undefined, holeIndex: undefined };
        return i;
      }));
    sfx.rotate();
  }, [updateWithHistory]);

  const removeItem = useCallback((id: number) => {
    // When removing rod, also remove child chips
    updateWithHistory((p) => p.filter((i) => i.id !== id && !(i.type === "chip" && (i as any).parentId === id)));
    sfx.remove();
  }, [updateWithHistory]);

  const lockItem = useCallback((id: number) => {
    updateWithHistory((p) => p.map((i) => i.id === id ? { ...i, locked: !i.locked } : i));
  }, [updateWithHistory]);

  const splitRod = useCallback((id: number, at: number) => {
    const rod = items.find((i): i is RodItem => i.id === id && i.type === "rod");
    if (!rod || at < 1 || at >= rod.value) return;
    const isV = rod.rot === 90;
    const newRod1Id = generateId();
    const newRod2Id = generateId();
    updateWithHistory((p) => {
      // Remove original rod and its child chips
      const filtered = p.filter((i) => i.id !== id && !(i.type === "chip" && (i as any).parentId === id));
      return [
        ...filtered,
        { id: newRod1Id, type: "rod" as const, value: at, flipped: rod.flipped, rot: rod.rot, x: rod.x, y: rod.y, locked: false },
        { id: newRod2Id, type: "rod" as const, value: rod.value - at, flipped: rod.flipped, rot: rod.rot, x: isV ? rod.x : rod.x + at * CELL_SIZE, y: isV ? rod.y + at * CELL_SIZE : rod.y, locked: false },
      ];
    });
    dispatch({ type: "SET_SELECTED", id: null });
    sfx.snap();
  }, [items, updateWithHistory, dispatch]);

  const mergeRods = useCallback((a: RodItem, b: RodItem) => {
    updateWithHistory((p) => [
      ...p.filter((i) => i.id !== a.id && i.id !== b.id),
      { id: generateId(), type: "rod" as const, value: a.value + b.value, flipped: a.flipped, rot: a.rot, x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), locked: false },
    ]);
    sfx.snap();
  }, [updateWithHistory]);

  const startCount = useCallback((rid: number) => {
    const rod = items.find((i): i is RodItem => i.id === rid && i.type === "rod");
    if (!rod || rod.flipped) return;
    if (ctRef.current) clearInterval(ctRef.current);
    dispatch({ type: "SET_COUNTING", counting: { rid, step: 0 } });
    speakNumber(1, language);
    sfx.note(1);
    let step = 0;
    ctRef.current = setInterval(() => {
      step++;
      if (step >= rod.value) {
        clearInterval(ctRef.current!);
        ctRef.current = null;
        setTimeout(() => dispatch({ type: "SET_COUNTING", counting: null }), 800);
      } else {
        dispatch({ type: "SET_COUNTING", counting: { rid, step } });
        sfx.note(step + 1);
        speakNumber(step + 1, language);
      }
    }, 600);
  }, [items, language, dispatch, ctRef]);

  return { place, flipItem, rotateItem, removeItem, lockItem, splitRod, mergeRods, startCount };
}
