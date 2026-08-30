/**
 * DokunSay Bar — Sesli komutlar
 *
 * App.tsx'ten cikarildi (2026-07-19, STANDARDS.md §2.5: "App 600 satiri gecerse -> hooks
 * ve components'e ayir"). Blok bütünlükluydu: tek bir `toggleVoice`, 40 komut dali.
 *
 * GOVDE AYNEN TASINDI - tek satir degistirilmedi. App.tsx'in yerel degiskenleri (place,
 * undo, items...) artik `deps` parametresinden gelir; bagimlilik listesi de aynen korundu,
 * boylece useCallback'in yeniden-olusma davranisi degismez.
 */

import { useCallback } from "react";
import type { MutableRefObject } from "react";
import { sfx } from "../services/audioService";
import { startVoiceRecognition, stopVoiceRecognition } from "../services/speechService";
import { parseVoiceCommand } from "../services/voiceCommandService";
import type { CanvasItem, RodItem, DrawLine, Language, AdjacentPair } from "../types";
import { saveAsJson } from "../services/exportService";

interface VoiceDeps {
  voiceOn: boolean;
  language: Language;
  dispatch: (action: any) => void;
  voiceRef: MutableRefObject<any>;
  items: CanvasItem[];
  lines: DrawLine[];
  covered: boolean;
  selectedId: number | null;
  adjPairs: AdjacentPair[];
  place: (def: Partial<CanvasItem>) => void;
  undo: () => void;
  redo: () => void;
  checkActivity: () => void;
  flipItem: (id: number) => void;
  rotateItem: (id: number) => void;
  removeItem: (id: number) => void;
  lockItem: (id: number) => void;
  splitRod: (id: number, at: number) => void;
  mergeRods: (a: RodItem, b: RodItem) => void;
  startCount: (rid: number) => void;
  handleLoad: () => void;
  handleExportPng: () => void;
  handlePrint: () => void;
  handleSpeakInstruction: () => void;
  setAboutOpen: (v: boolean) => void;
}

export function useVoiceCommands(deps: VoiceDeps) {
  const {
    voiceOn, language, dispatch, voiceRef, items, lines, covered, selectedId, adjPairs,
    place, undo, redo, checkActivity, flipItem, rotateItem, removeItem, lockItem,
    splitRod, mergeRods, startCount, handleLoad, handleExportPng, handlePrint,
    handleSpeakInstruction, setAboutOpen,
  } = deps;

  const toggleVoice = useCallback(() => {
    if (voiceOn) {
      stopVoiceRecognition(voiceRef.current);
      voiceRef.current = null;
      dispatch({ type: "SET_VOICE", on: false });
      return;
    }
    const rec = startVoiceRecognition(language, {
      onResult: (txt) => {
        const cmd = parseVoiceCommand(txt);
        if (!cmd) return;

        switch (cmd.action) {
          // Placing items
          case "placeRod": place({ type: "rod", value: cmd.value, flipped: false, rot: 0 } as any); break;
          case "placeMultipleRods": for (let i = 0; i < cmd.count; i++) setTimeout(() => place({ type: "rod", value: cmd.value, flipped: false, rot: 0 } as any), i * 100); break;
          case "placeFiveFrame": place({ type: "frame", cols: 5, rows: 1 } as any); break;
          case "placeTenFrame": place({ type: "frame", cols: 5, rows: 2 } as any); break;
          case "placeDotGroup": place({ type: "dotgroup", value: cmd.value } as any); break;
          case "placeChip": place({ type: "chip", color: cmd.color, label: cmd.label } as any); break;
          case "placeMultipleChips": for (let i = 0; i < cmd.count; i++) setTimeout(() => place({ type: "chip", color: cmd.color, label: null } as any), i * 100); break;
          case "placeOperator": place({ type: "chip", color: "yellow", label: cmd.operator } as any); break;
          case "placeExpression": cmd.parts.forEach((p, i) => setTimeout(() => {
            if (["+", "−", "×", "÷", "="].includes(p)) place({ type: "chip", color: "yellow", label: p } as any);
            else place({ type: "chip", color: "green", label: p } as any);
          }, i * 150)); break;
          // Canvas
          case "clear": dispatch({ type: "CLEAR_CANVAS" }); break;
          case "undo": undo(); break;
          case "redo": redo(); break;
          // File
          case "save": saveAsJson(items, lines); break;
          case "load": handleLoad(); break;
          case "exportPng": handleExportPng(); break;
          case "print": handlePrint(); break;
          // Activity
          case "check": checkActivity(); break;
          case "nextActivity": case "prevActivity": case "loadActivity": break; // TODO: wire to template navigation
          // View
          case "cover": if (!covered) dispatch({ type: "TOGGLE_COVERED" }); break;
          case "reveal": if (covered) dispatch({ type: "TOGGLE_COVERED" }); break;
          case "toggleLabels": dispatch({ type: "TOGGLE_LABELS" }); break;
          case "toggleNumberLine": dispatch({ type: "TOGGLE_NUMBER_LINE" }); break;
          case "fullscreen": if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); break;
          // Selected item
          case "flipSelected": if (selectedId != null) flipItem(selectedId); break;
          case "rotateSelected": if (selectedId != null) rotateItem(selectedId); break;
          case "deleteSelected": if (selectedId != null) { removeItem(selectedId); dispatch({ type: "SET_SELECTED", id: null }); } break;
          case "lockSelected": if (selectedId != null) lockItem(selectedId); break;
          case "unlockSelected": if (selectedId != null) lockItem(selectedId); break;
          case "splitSelected": if (selectedId != null) splitRod(selectedId, cmd.at); break;
          case "mergeSelected": if (adjPairs.length > 0) mergeRods(adjPairs[0].l, adjPairs[0].r); break;
          case "countSelected": { const rod = items.find((i) => i.id === selectedId && i.type === "rod"); if (rod) startCount(rod.id); } break;
          // Tool switching
          case "selectTool": dispatch({ type: "SET_TOOL", tool: cmd.tool }); break;
          case "setPenColor": dispatch({ type: "SET_PEN_COLOR", color: cmd.color }); dispatch({ type: "SET_TOOL", tool: "pen" }); break;
          // Grid & background
          case "setGrid": dispatch({ type: "SET_GRID_TYPE", gridType: cmd.grid }); break;
          case "setBgColor": dispatch({ type: "SET_BG_COLOR", color: cmd.color }); break;
          // Language
          case "setLanguage": dispatch({ type: "SET_LANGUAGE", language: cmd.lang as any }); break;
          // Music
          case "playNote": { const r = items.find((i) => i.id === selectedId && i.type === "rod"); if (r) sfx.note((r as any).value); } break;
          // Speak / Help / About
          case "speakInstruction": handleSpeakInstruction(); break;
          case "help": dispatch({ type: "TOGGLE_HELP" }); break;
          case "about": setAboutOpen(true); break;
        }
      },
      onError: () => dispatch({ type: "SET_VOICE", on: false }),
    });
    if (rec) { voiceRef.current = rec; dispatch({ type: "SET_VOICE", on: true }); }
  }, [voiceOn, language, dispatch, place, undo, redo, checkActivity, items, lines, covered, selectedId,
      flipItem, rotateItem, removeItem, lockItem, splitRod, mergeRods, startCount, adjPairs,
      handleLoad, handleExportPng, handlePrint, handleSpeakInstruction]);

  return { toggleVoice };
}
