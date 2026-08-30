import { useRef, useEffect, useCallback, useMemo } from "react";
import { useAppState } from "./state/AppContext";
import { useAuth } from "./state/AuthContext";
import { useAR } from "./state/ARContext";
import { getTheme, isDarkMode } from "./constants/colors";
import { getNextLanguage, getTemplateName, getTemplateDesc, isRTL } from "./services/i18nService";
import { CELL_SIZE, ROD_HEIGHT, CHIP_SIZE, SNAP_DISTANCE, TRASH_ZONE_HEIGHT, FRAME_CELL_SIZE, FRAME_PADDING } from "./constants/dimensions";
import { translate } from "./services/i18nService";
import { sfx } from "./services/audioService";
import { speak, speakNumber, startVoiceRecognition, stopVoiceRecognition } from "./services/speechService";
import { saveAsJson, loadFromJson, exportAsPng, printCanvas } from "./services/exportService";
import { parseVoiceCommand } from "./services/voiceCommandService";
import { loadProgress, saveProgress as storageSaveProgress, loadCustomTemplates, saveCustomTemplates } from "./services/storageService";
import { getItemWidth, getItemHeight, getSnapHoles, findNearestHole, findNearestHoleWithRod, getRodHolePosition, getHoleColor, getGridBackground } from "./utils/geometry";
import { calculateSnap, type AlignmentGuide } from "./utils/alignmentGuides";
import { generateId } from "./utils/idGenerator";
import { getAdjacentPairs } from "./state/selectors";
import { useHistory } from "./hooks/useHistory";
import { useActivityChecker } from "./hooks/useActivityChecker";
import { useItemOperations } from "./hooks/useItemOperations";
import { useVoiceCommands } from "./hooks/useVoiceCommands";
import { useResponsive } from "./hooks/useResponsive";
import type { CanvasItem, Template, RodItem, DrawLine, Point } from "./types";

import Sidebar from "./components/sidebar/Sidebar";
import BottomToolbar from "./components/toolbar/BottomToolbar";
import Rod from "./components/canvas/Rod";
import Frame from "./components/canvas/Frame";
import Chip from "./components/canvas/Chip";
import DotGroup from "./components/canvas/DotGroup";
import EmptyState from "./components/overlays/EmptyState";
import NumberLine from "./components/canvas/NumberLine";
import SentenceStrip from "./components/canvas/SentenceStrip";
import { describeCanvas } from "./utils/sentence";
import PageNavigator from "./components/canvas/PageNavigator";
import InstructionModal from "./components/overlays/InstructionModal";
import CoverOverlay from "./components/overlays/CoverOverlay";
import FeedbackBanner from "./components/overlays/FeedbackBanner";
import HelpModal from "./components/overlays/HelpModal";
import AboutModal from "./components/overlays/AboutModal";
import { useState as useLocalState } from "react";

/** Dokunuş (tap) ile sürükleme (drag) ayrımı için piksel eşiği. Bu mesafenin
 *  altındaki hareket "dokunuş" sayılır → çubuk/çerçeve deliğine pul ekle/çıkar. */
const TAP_SLOP = 6;

export default function App() {
  const { state, dispatch } = useAppState();
  const { auth, authDispatch } = useAuth();
  const { arDispatch } = useAR();
  const {
    items, lines, pages, currentPage,
    tool, penColor, penWidth, eraserWidth, textSize, textBold,
    selectedId, language, bgColor, gridType,
    showLabels, showNumberLine, showSentence, covered, activeTemplate, feedback, sideTab,
    collapsed, helpOpen, numPickerOpen, counting, voiceOn, teacherMode,
    progress, customTemplates, instruction, textInput, textValue, snapEffect,
  } = state;

  const cvRef = useRef<HTMLDivElement>(null);
  const ctRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const voiceRef = useRef<any>(null);
  const dragRef = useRef<(CanvasItem & { src: "c" | "p" }) | null>(null);
  const dpRef = useRef<Point>({ x: 0, y: 0 });
  const doffRef = useRef<Point>({ x: 0, y: 0 });
  const nearTrashRef = useRef(false);
  // Tap-vs-drag ayrımı: dokunulan öğenin yerel koordinatı + hareket bayrağı + başlangıç noktası
  const tapRef = useRef<{ localX: number; localY: number } | null>(null);
  const movedRef = useRef(false);
  const dStartRef = useRef<Point>({ x: 0, y: 0 });
  const [, forceRender] = useLocalState(0);

  const [aboutOpen, setAboutOpen] = useLocalState(false);
  const [alignGuides, setAlignGuides] = useLocalState<AlignmentGuide[]>([]);
  const [splitMode, setSplitMode] = useLocalState<number | null>(null); // rodId in split mode
  const dk = isDarkMode(bgColor);
  const palette = getTheme(bgColor);
  const t = useCallback((k: string) => translate(k, language), [language]);

  const { pushHistory, undo, redo, updateWithHistory, canUndo, canRedo } = useHistory();

  const handleSaveProgress = useCallback((name: string) => {
    const np = { ...progress, [name]: { done: true, ts: Date.now() } };
    dispatch({ type: "SET_PROGRESS", progress: np });
    storageSaveProgress(np).catch(() => {});
  }, [progress, dispatch]);

  const { checkActivity } = useActivityChecker(handleSaveProgress);
  useResponsive();

  // Load persisted data
  useEffect(() => {
    loadProgress().then((p) => { if (Object.keys(p).length) dispatch({ type: "SET_PROGRESS", progress: p }); }).catch(() => {});
    loadCustomTemplates().then((t) => { if (t.length) dispatch({ type: "SET_CUSTOM_TEMPLATES", templates: t }); }).catch(() => {});
  }, [dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ctRef.current) clearInterval(ctRef.current);
      stopVoiceRecognition(voiceRef.current);
    };
  }, []);

  const adjPairs = useMemo(() => getAdjacentPairs(items), [items]);
  // Cümle TÜRETİLİR (saklanmaz): items değişince kendiliğinden güncellenir; geri al,
  // sayfa değiştirme ve şablon yükleme ek kod olmadan doğru çalışır.
  const sentence = useMemo(
    () => (showSentence ? describeCanvas(items, language) : null),
    [showSentence, items, language],
  );

  // ===== Item Operations =====
  // Blok hooks/useItemOperations.ts'e tasindi (STANDARDS.md §2.5, 600 satir kurali).
  // Davranis aynen korundu; yalnizca yerel degiskenler parametreye cevrildi.
  const { place, flipItem, rotateItem, removeItem, lockItem, splitRod, mergeRods, startCount } =
    useItemOperations({ cvRef, ctRef, items, language, updateWithHistory, dispatch });

  // ===== Template Loading =====
  const loadTemplate = useCallback((tp: Template) => {
    pushHistory();
    const newItems = tp.it.map((r) => {
      const base = { id: generateId(), x: r.x, y: r.y, rot: (r.rot || 0) as 0 | 90 };
      if (r.t === "rod") return { ...base, type: "rod" as const, value: r.v!, flipped: !!r.f, locked: false };
      if (r.t === "frame") return { ...base, type: "frame" as const, cols: r.c!, rows: r.r!, locked: false };
      if (r.t === "chip") return { ...base, type: "chip" as const, color: r.color as any, label: r.label ?? null, locked: false };
      if (r.t === "dotgroup") return { ...base, type: "dotgroup" as const, value: r.v!, locked: false };
      if (r.t === "text") return { ...base, type: "text" as const, label: r.label!, color: r.color!, locked: false };
      return { ...base, type: "rod" as const, value: r.v!, flipped: !!r.f, locked: false };
    });
    dispatch({ type: "SET_ITEMS", items: newItems as CanvasItem[] });
    dispatch({ type: "SET_LINES", lines: [] });
    dispatch({ type: "SET_COVERED", covered: false });
    dispatch({ type: "SET_ACTIVE_TEMPLATE", template: tp });
    if (tp.d) {
      dispatch({ type: "SET_INSTRUCTION", instruction: { n: tp.n, k: tp.k, en: tp.en, ar: tp.ar, fa: tp.fa, i: tp.i, d: tp.d, dk: tp.dk, den: tp.den, dar: tp.dar, dfa: tp.dfa } });
      setTimeout(() => {
        const txt = getTemplateDesc(tp, language);
        speak(txt, language);
      }, 800);
    }
  }, [pushHistory, dispatch, language]);

  // ===== Text Commit =====
  const commitText = useCallback(() => {
    if (textValue.trim() && textInput) {
      updateWithHistory((p) => [...p, { id: generateId(), type: "text" as const, x: textInput.x, y: textInput.y, label: textValue.trim(), color: penColor, fontSize: textSize, fontWeight: textBold ? 800 : 400 }]);
    }
    dispatch({ type: "SET_TEXT_INPUT", position: null });
    dispatch({ type: "SET_TEXT_VALUE", value: "" });
  }, [textValue, textInput, penColor, textSize, textBold, updateWithHistory, dispatch]);

  // ===== Export Functions =====
  const handleSave = useCallback(() => saveAsJson(items, lines), [items, lines]);
  const handleLoad = useCallback(() => {
    loadFromJson((data) => {
      if (data.items) { pushHistory(); dispatch({ type: "SET_ITEMS", items: data.items }); }
      if (data.lines) dispatch({ type: "SET_LINES", lines: data.lines });
    });
  }, [pushHistory, dispatch]);
  const handleExportPng = useCallback(() => { if (cvRef.current) exportAsPng(cvRef.current, bgColor); }, [bgColor]);
  const handlePrint = useCallback(() => { if (cvRef.current) printCanvas(cvRef.current, bgColor); }, [bgColor]);

  // ===== Custom Template =====
  const handleSaveCustomTpl = useCallback(() => {
    const promptTexts: Record<string, string> = { tr: "Şablon adını yazın:", ku: "Navê şablonê binivîse:", en: "Enter template name:", ar: "أدخل اسم القالب:", fa: "نام الگو را وارد کنید:" };
    const name = prompt(promptTexts[language] || promptTexts.en);
    if (!name?.trim()) return;
    const tplItems = items.map((it) => ({
      t: it.type, v: (it as any).value, c: (it as any).cols, r: (it as any).rows,
      x: Math.round(it.x), y: Math.round(it.y),
      f: (it as any).flipped ? 1 : 0, rot: (it as any).rot || 0,
      color: (it as any).color, label: (it as any).label,
    }));
    const nt: Template = {
      n: name.trim(), k: name.trim(), i: "📝", cat: "custom", diff: 1, chk: "none",
      d: "Özel etkinlik", dk: "Xwerû çalakî", den: "Custom activity", dar: "نشاط مخصص", dfa: "فعالیت سفارشی", it: tplItems,
    };
    const nc = [...customTemplates, nt];
    dispatch({ type: "SET_CUSTOM_TEMPLATES", templates: nc });
    saveCustomTemplates(nc).catch(() => {});
    sfx.snap();
  }, [language, items, customTemplates, dispatch]);

  // ===== Speak Instruction =====
  const handleSpeakInstruction = useCallback(() => {
    if (!activeTemplate) return;
    const txt = getTemplateDesc(activeTemplate, language);
    speak(txt, language);
  }, [activeTemplate, language]);

  // ===== Voice Commands =====
  // Blok hooks/useVoiceCommands.ts'e tasindi (STANDARDS.md §2.5, 600 satir kurali).
  const { toggleVoice } = useVoiceCommands({
    voiceOn, language, dispatch, voiceRef, items, lines, covered, selectedId, adjPairs,
    place, undo, redo, checkActivity, flipItem, rotateItem, removeItem, lockItem,
    splitRod, mergeRods, startCount, handleLoad, handleExportPng, handlePrint,
    handleSpeakInstruction, setAboutOpen,
  });

  // ===== Drag & Drop =====
  const startDrag = useCallback((e: React.PointerEvent, eid: number) => {
    if (tool !== "select") return;
    e.preventDefault();
    e.stopPropagation();
    const r = cvRef.current!.getBoundingClientRect();
    const it = items.find((i) => i.id === eid);
    if (!it || it.locked) return;
    doffRef.current = { x: e.clientX - r.left - it.x, y: e.clientY - r.top - it.y };
    dpRef.current = { x: it.x, y: it.y };
    // Dokunuş konumunu (öğeye göre yerel) + başlangıç + hareket durumunu kaydet
    tapRef.current = { localX: e.clientX - r.left - it.x, localY: e.clientY - r.top - it.y };
    dStartRef.current = { x: e.clientX, y: e.clientY };
    movedRef.current = false;
    if (e.altKey) dragRef.current = { ...it, id: generateId(), src: "p" } as any;
    else dragRef.current = { ...it, src: "c" } as any;
    forceRender((v: number) => v + 1);
  }, [tool, items]);

  useEffect(() => {
    const drag = dragRef.current;
    if (!drag) return;

    function onMove(e: PointerEvent) {
      const r = cvRef.current!.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      // Eşik aşılana kadar hareketi yok say → dokunuş olarak değerlendir
      if (!movedRef.current) {
        const ddx = e.clientX - dStartRef.current.x, ddy = e.clientY - dStartRef.current.y;
        if (ddx * ddx + ddy * ddy <= TAP_SLOP * TAP_SLOP) return;
        movedRef.current = true;
      }
      const rawX = mx - doffRef.current.x, rawY = my - doffRef.current.y;

      // Smart alignment snap
      const snap = calculateSnap(rawX, rawY, drag!, items, gridType);
      dpRef.current = { x: snap.x, y: snap.y };
      setAlignGuides(snap.guides);
      nearTrashRef.current = my > r.height - TRASH_ZONE_HEIGHT - 50;
    }

    function onUp() {
      const d = dragRef.current;
      if (!d) return;

      // ── DOKUNUŞ (hareket yok) → çubuk/çerçeve deliğine pul ekle-çıkar, dolu pula dokun → kaldır ──
      if (!movedRef.current) {
        const tap = tapRef.current;
        if (tap) {
          if (d.type === "rod" && !(d as any).flipped && (((d as any).rot || 0) === 0)) {
            const val = (d as any).value as number;
            const hi = Math.max(0, Math.min(val - 1, Math.floor(tap.localX / CELL_SIZE)));
            const existing = items.find((c) => c.type === "chip" && (c as any).parentId === d.id && (c as any).holeIndex === hi);
            if (existing) { updateWithHistory((p) => p.filter((i) => i.id !== existing.id)); sfx.remove(); }
            else {
              const holeX = d.x + hi * CELL_SIZE + CELL_SIZE / 2 - CHIP_SIZE / 2;
              const holeY = d.y + ROD_HEIGHT / 2 - CHIP_SIZE / 2;
              updateWithHistory((p) => [...p, { id: generateId(), type: "chip", x: holeX, y: holeY, color: getHoleColor(hi), label: null, parentId: d.id, holeIndex: hi, locked: false } as any]);
              sfx.snap();
              dispatch({ type: "SET_SNAP_EFFECT", effect: { x: holeX + CHIP_SIZE / 2, y: holeY + CHIP_SIZE / 2, t: Date.now() } });
              setTimeout(() => dispatch({ type: "SET_SNAP_EFFECT", effect: null }), 500);
            }
          } else if (d.type === "frame") {
            const cols = (d as any).cols || 5; const rows = (d as any).rows || 2;
            const c = Math.floor((tap.localX - FRAME_PADDING) / FRAME_CELL_SIZE);
            const rr = Math.floor((tap.localY - FRAME_PADDING) / FRAME_CELL_SIZE);
            if (c >= 0 && c < cols && rr >= 0 && rr < rows) {
              const hi = rr * cols + c;
              const existing = items.find((ch) => ch.type === "chip" && (ch as any).parentId === d.id && (ch as any).holeIndex === hi);
              if (existing) { updateWithHistory((p) => p.filter((i) => i.id !== existing.id)); sfx.remove(); }
              else {
                const holeX = d.x + FRAME_PADDING + c * FRAME_CELL_SIZE + FRAME_CELL_SIZE / 2 - CHIP_SIZE / 2;
                const holeY = d.y + FRAME_PADDING + rr * FRAME_CELL_SIZE + FRAME_CELL_SIZE / 2 - CHIP_SIZE / 2;
                updateWithHistory((p) => [...p, { id: generateId(), type: "chip", x: holeX, y: holeY, color: getHoleColor(hi), label: null, parentId: d.id, holeIndex: hi, locked: false } as any]);
                sfx.snap();
              }
            }
          } else if (d.type === "chip" && (d as any).parentId != null) {
            updateWithHistory((p) => p.filter((i) => i.id !== d.id)); sfx.remove();
          }
        }
        dragRef.current = null;
        nearTrashRef.current = false;
        setAlignGuides([]);
        forceRender((v: number) => v + 1);
        return;
      }

      if (nearTrashRef.current) {
        if (d.src === "c") updateWithHistory((p) => p.filter((i) => i.id !== d.id));
        sfx.remove();
      } else {
        let fx = dpRef.current.x, fy = dpRef.current.y;
        let chipParentId: number | undefined;
        let chipHoleIndex: number | undefined;

        if (d.type === "chip") {
          // Find nearest hole WITH rod/frame identification
          const match = findNearestHoleWithRod(dpRef.current.x, dpRef.current.y,
            items.filter((i) => !(d.src === "c" && i.id === d.id)));
          if (match) {
            fx = match.point.x; fy = match.point.y;
            chipParentId = match.rodId;
            chipHoleIndex = match.holeIndex;
            sfx.snap();
            dispatch({ type: "SET_SNAP_EFFECT", effect: { x: match.point.x + CHIP_SIZE / 2, y: match.point.y + CHIP_SIZE / 2, t: Date.now() } });
            setTimeout(() => dispatch({ type: "SET_SNAP_EFFECT", effect: null }), 500);
          } else {
            // Detached from rod
            chipParentId = undefined;
            chipHoleIndex = undefined;
          }
        }

        // Build the new item
        const nb: any = { id: d.id, type: d.type, x: fx, y: fy, value: (d as any).value, cols: (d as any).cols, rows: (d as any).rows, flipped: !!(d as any).flipped, rot: (d as any).rot || 0, color: (d as any).color, label: (d as any).label, locked: (d as any).locked };
        if (d.type === "chip") {
          nb.parentId = chipParentId;
          nb.holeIndex = chipHoleIndex;
        }

        if (d.src === "c") {
          if (d.type === "rod") {
            // When rod is moved, also move all child chips
            const dx = fx - d.x;
            const dy = fy - d.y;
            updateWithHistory((p) => p.map((i) => {
              if (i.id === d.id) return nb as CanvasItem;
              if (i.type === "chip" && (i as any).parentId === d.id) {
                return { ...i, x: i.x + dx, y: i.y + dy };
              }
              return i;
            }));
          } else {
            updateWithHistory((p) => p.map((i) => i.id === d.id ? nb as CanvasItem : i));
          }
        } else {
          updateWithHistory((p) => [...p, nb as CanvasItem]);
        }
      }
      dragRef.current = null;
      nearTrashRef.current = false;
      setAlignGuides([]);
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  });

  // ===== Drawing =====
  const curLineRef = useRef<DrawLine | null>(null);

  const handleCanvasPointerDown = useCallback((e: React.PointerEvent) => {
    const r = cvRef.current!.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (tool === "pen") { curLineRef.current = { pts: [{ x, y }], color: penColor, w: penWidth }; }
    else if (tool === "eraser") { curLineRef.current = { pts: [{ x, y }], color: "erase", w: eraserWidth }; }
    else if (tool === "text") { dispatch({ type: "SET_TEXT_INPUT", position: { x, y } }); dispatch({ type: "SET_TEXT_VALUE", value: "" }); }
    else dispatch({ type: "SET_SELECTED", id: null });
  }, [tool, penColor, penWidth, eraserWidth, dispatch]);

  useEffect(() => {
    if (!curLineRef.current) return;
    function onMove(e: PointerEvent) {
      if (!curLineRef.current) return;
      const r = cvRef.current!.getBoundingClientRect();
      curLineRef.current.pts.push({ x: e.clientX - r.left, y: e.clientY - r.top });
    }
    function onUp() {
      const cl = curLineRef.current;
      if (!cl) return;
      if (cl.color === "erase") dispatch({ type: "ERASE_LINES", eraserPoints: cl.pts });
      else dispatch({ type: "ADD_LINE", line: cl });
      curLineRef.current = null;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  });

  // ===== Render Item =====
  const renderItem = useCallback((it: CanvasItem) => {
    if (it.type === "rod") return <Rod count={it.value} flipped={it.flipped} label={showLabels} />;
    if (it.type === "frame") return <Frame cols={it.cols || 5} rows={it.rows || 2} />;
    if (it.type === "dotgroup") return <DotGroup count={it.value} />;
    if (it.type === "text") return <span style={{ fontSize: it.fontSize || 20, fontWeight: it.fontWeight || 800, color: it.color || "#1a1a1a", lineHeight: 1.2 }}>{it.label}</span>;
    return <Chip color={it.color} label={it.label} size={CHIP_SIZE} />;
  }, [showLabels]);

  const selectedRod = items.find((i): i is RodItem => i.id === selectedId && i.type === "rod") ?? null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", fontFamily: "system-ui,sans-serif" }}>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar
          lang={language} palette={palette} isDark={dk}
          collapsed={collapsed} sideTab={sideTab}
          userProfile={auth.profile}
          onDashboard={() => authDispatch({ type: "SET_PAGE", page: "dashboard" })}
          showLabels={showLabels} showNumberLine={showNumberLine} showSentence={showSentence} covered={covered}
          canUndo={canUndo} canRedo={canRedo}
          activeTpl={activeTemplate} teacherMode={teacherMode}
          progress={progress} customTemplates={customTemplates}
          hasItems={items.length > 0} selectedRod={selectedRod}
          onSetLang={() => dispatch({ type: "SET_LANGUAGE", language: getNextLanguage(language) })}
          onToggleCollapse={() => dispatch({ type: "TOGGLE_COLLAPSED" })}
          onSetSideTab={(tab) => dispatch({ type: "SET_SIDE_TAB", tab })}
          onPlaceRod={(v) => place({ type: "rod", value: v, flipped: false, rot: 0 } as any)}
          onPlaceFrame={(cols, rows) => place({ type: "frame", cols, rows } as any)}
          onLoadTemplate={loadTemplate}
          onToggleTeacherMode={() => dispatch({ type: "TOGGLE_TEACHER_MODE" })}
          onSaveCustomTemplate={handleSaveCustomTpl}
          onSpeakInstruction={handleSpeakInstruction}
          onCheckActivity={checkActivity}
          onUndo={undo} onRedo={redo}
          onToggleLabels={() => dispatch({ type: "TOGGLE_LABELS" })}
          onToggleNumberLine={() => dispatch({ type: "TOGGLE_NUMBER_LINE" })}
          onToggleSentence={() => dispatch({ type: "TOGGLE_SENTENCE" })}
          onToggleCover={() => dispatch({ type: "TOGGLE_COVERED" })}
          onSave={handleSave} onLoad={handleLoad}
          onExportPng={handleExportPng} onPrint={handlePrint}
          onClear={() => dispatch({ type: "CLEAR_CANVAS" })}
          onAbout={() => setAboutOpen(true)}
        />

        {/* CANVAS */}
        <div
          ref={cvRef} role="main" aria-label={t("hint")} tabIndex={0}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); undo(); }
            if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); redo(); }
            if (e.key === "Delete" && selectedId != null) { e.preventDefault(); removeItem(selectedId); dispatch({ type: "SET_SELECTED", id: null }); }
          }}
          onPointerDown={handleCanvasPointerDown}
          style={{
            flex: 1, position: "relative", overflow: "hidden",
            background: bgColor,
            cursor: tool === "pen" ? "crosshair" : tool === "eraser" ? "cell" : tool === "text" ? "text" : "default",
            ...getGridBackground(gridType, dk),
          }}
        >
          {/* Drawing lines */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 3 }}>
            {lines.map((l, i) => (
              <path key={i} d={l.pts.map((p, j) => `${j ? "L" : "M"}${p.x},${p.y}`).join("")}
                fill="none" stroke={l.color} strokeWidth={l.w} strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </svg>

          {/* Alignment guides */}
          {alignGuides.length > 0 && (
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 900 }}>
              {alignGuides.map((g, i) =>
                g.type === "vertical" ? (
                  <line key={i} x1={g.position} y1={g.from} x2={g.position} y2={g.to}
                    stroke="#3b82f6" strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
                ) : (
                  <line key={i} x1={g.from} y1={g.position} x2={g.to} y2={g.position}
                    stroke="#3b82f6" strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
                )
              )}
            </svg>
          )}

          {/* Text input */}
          {textInput && (
            <div style={{ position: "absolute", left: textInput.x, top: textInput.y, zIndex: 20 }}>
              <input
                autoFocus value={textValue}
                onChange={(e) => dispatch({ type: "SET_TEXT_VALUE", value: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) commitText();
                  if (e.key === "Escape") { dispatch({ type: "SET_TEXT_INPUT", position: null }); dispatch({ type: "SET_TEXT_VALUE", value: "" }); }
                }}
                onBlur={commitText}
                style={{ fontSize: textSize, fontWeight: textBold ? 800 : 400, color: penColor, background: "rgba(255,255,255,.85)", border: "2px solid #a0aa94", borderRadius: 4, padding: "2px 6px", outline: "none", fontFamily: "inherit", minWidth: 80, maxWidth: 400 }}
                placeholder={t("textPh")}
              />
            </div>
          )}

          {/* Empty state */}
          {items.length === 0 && !dragRef.current && !activeTemplate && <EmptyState lang={language} isDark={dk} />}

          {/* Page navigator */}
          <PageNavigator
            pages={pages}
            currentPage={currentPage}
            lang={language}
            palette={palette}
            isDark={dk}
            onGotoPage={(i) => dispatch({ type: "GOTO_PAGE", index: i })}
            onAddPage={() => dispatch({ type: "ADD_PAGE" })}
            onDeletePage={(i) => dispatch({ type: "DELETE_PAGE", index: i })}
          />

          {/* Active template label */}
          {activeTemplate && !instruction && (
            <div style={{ position: "absolute", top: 8, left: 8, zIndex: 4, display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 10, background: dk ? "rgba(0,0,0,.5)" : "rgba(255,255,255,.75)", border: `1px solid ${dk ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.1)"}`, pointerEvents: "none" }}>
              <span style={{ fontSize: 14 }}>{activeTemplate.i}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: dk ? "#fff" : "#3d3520" }}>
                {getTemplateName(activeTemplate, language)}
              </span>
              <span style={{ fontSize: 8, color: "#d97706" }}>{"★".repeat(activeTemplate.diff || 1)}</span>
            </div>
          )}

          {/* Instruction modal */}
          {instruction && <InstructionModal instruction={instruction} lang={language} onClose={() => dispatch({ type: "SET_INSTRUCTION", instruction: null })} />}

          {/* Cover overlay */}
          {covered && <CoverOverlay />}

          {/* Canvas items */}
          {items.filter((i) => !(dragRef.current?.src === "c" && dragRef.current.id === i.id)).map((it) => (
            <div
              key={it.id}
              onPointerDown={(e) => { dispatch({ type: "SET_SELECTED", id: it.id }); if (splitMode && splitMode !== it.id) setSplitMode(null); startDrag(e, it.id); }}
              onDoubleClick={() => { if (it.type === "rod" && !it.flipped && !counting) startCount(it.id); }}
              style={{
                position: "absolute", left: it.x, top: it.y,
                zIndex: it.type === "chip" ? 6 : 5,
                cursor: it.locked ? "not-allowed" : tool === "select" ? "grab" : "default",
                touchAction: "none",
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,.2))",
                opacity: it.locked ? 0.85 : 1,
                outline: selectedId === it.id ? "2px solid #3b82f6" : "none",
                outlineOffset: 2, borderRadius: 4,
                transform: (it as any).rot === 90 ? "rotate(90deg)" : undefined,
                transformOrigin: (it as any).rot === 90 ? `${ROD_HEIGHT / 2}px ${ROD_HEIGHT / 2}px` : undefined,
              }}
            >
              {renderItem(it)}

              {/* Boş delik ipuçları — seçili çubukta, "dokun → doldur" (sadece görsel; dokunuş çubuk seviyesinde işlenir) */}
              {it.type === "rod" && !it.flipped && (it.rot || 0) === 0 && tool === "select" && selectedId === it.id && !dragRef.current && (
                Array.from({ length: it.value }, (_, hi) => {
                  const filled = items.some((c) => c.type === "chip" && (c as any).parentId === it.id && (c as any).holeIndex === hi);
                  if (filled) return null;
                  const hc = getHoleColor(hi);
                  return (
                    <div
                      key={`ghost-${hi}`}
                      style={{
                        position: "absolute",
                        left: hi * CELL_SIZE + (CELL_SIZE - CHIP_SIZE) / 2,
                        top: (ROD_HEIGHT - CHIP_SIZE) / 2,
                        width: CHIP_SIZE, height: CHIP_SIZE,
                        borderRadius: "50%",
                        border: `2px dashed ${hc === "blue" ? "rgba(37,99,235,.55)" : "rgba(220,38,38,.55)"}`,
                        boxSizing: "border-box",
                        pointerEvents: "none",
                        zIndex: 4,
                      }}
                    />
                  );
                })
              )}

              {/* Counting overlay */}
              {counting?.rid === it.id && it.type === "rod" && (it.rot || 0) === 0 &&
                Array.from({ length: Math.min(counting.step + 1, it.value) }, (_, ci) => {
                  const isActive = ci === counting.step;
                  return (
                    <div key={ci} style={{ position: "absolute", left: ci * CELL_SIZE, top: 0, width: CELL_SIZE, height: ROD_HEIGHT, background: isActive ? "rgba(34,197,94,.45)" : "rgba(34,197,94,.12)", animation: isActive ? "dsCount .6s ease infinite" : "none", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", borderRadius: isActive ? 4 : 0 }}>
                      <span style={{ fontSize: isActive ? 20 : 14, fontWeight: 900, color: isActive ? "#fff" : "#15803d", textShadow: isActive ? "0 1px 4px rgba(0,0,0,.3)" : "none", transition: "all .15s" }}>{ci + 1}</span>
                    </div>
                  );
                })}

              {/* Lock indicator */}
              {it.locked && <div style={{ position: "absolute", top: -6, left: -6, width: 16, height: 16, borderRadius: "50%", background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, pointerEvents: "none" }}>🔒</div>}

              {/* Rod action buttons — ÇUBUĞUN YANLARINDA (üstte değil), çocuk pul yerleştirirken çakışmasın */}
              {it.type === "rod" && selectedId === it.id && tool === "select" && !dragRef.current && (
                <>
                  {/* Flip — sol yan, dikey ortalı */}
                  <ActionBtn
                    pos={{ left: -28, top: ROD_HEIGHT / 2 - 10 }}
                    bg={it.flipped ? "#333" : "#fff"}
                    onClick={() => flipItem(it.id)}
                  >🔄</ActionBtn>
                  {/* Rotate — sağ yan, dikey ortalı */}
                  <ActionBtn
                    pos={{ right: -28, top: ROD_HEIGHT / 2 - 10 }}
                    onClick={() => rotateItem(it.id)}
                  >↻</ActionBtn>
                  {/* Lock — alt-orta */}
                  <ActionBtn
                    pos={{ bottom: -10, left: "50%", marginLeft: -10 }}
                    bg={it.locked ? "#ef4444" : "#fff"}
                    onClick={() => lockItem(it.id)}
                  >{it.locked ? "🔓" : "🔒"}</ActionBtn>

                  {/* Split button — sağ-alt köşe */}
                  {it.value > 1 && !it.flipped && (it.rot || 0) === 0 && (
                    <div
                      onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                      onClick={() => setSplitMode(splitMode === it.id ? null : it.id)}
                      style={{
                        position: "absolute", right: -10, bottom: -10,
                        width: 20, height: 20, borderRadius: "50%",
                        background: splitMode === it.id ? "#ef4444" : "rgba(239,68,68,.75)",
                        border: "2px solid #fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        cursor: "pointer", fontSize: 10, color: "#fff", fontWeight: 900, zIndex: 12,
                      }}
                    >
                      ✂
                    </div>
                  )}

                  {/* Split points — only visible when split mode active */}
                  {splitMode === it.id && it.value > 1 && !it.flipped && (it.rot || 0) === 0 &&
                    Array.from({ length: it.value - 1 }, (_, si) => (
                      <div key={`split-${si}`}
                        onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        onClick={() => { splitRod(it.id, si + 1); setSplitMode(null); }}
                        style={{
                          position: "absolute",
                          left: (si + 1) * CELL_SIZE - 8,
                          top: ROD_HEIGHT + 2,
                          width: 16, height: 16, borderRadius: "50%",
                          background: "rgba(239,68,68,.85)", border: "2px solid #fff",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          cursor: "pointer", fontSize: 9, color: "#fff", fontWeight: 900, zIndex: 12,
                          animation: "dsPop .2s ease-out",
                        }}
                      >
                        ✂
                      </div>
                    ))}
                </>
              )}

              {/* Frame (beşlik/onluk) action buttons — aynı desen, üstte değil yanlarda */}
              {it.type === "frame" && selectedId === it.id && tool === "select" && !dragRef.current && (() => {
                const frameHeight = ((it as any).rows || 2) * FRAME_CELL_SIZE + FRAME_PADDING * 2;
                return (
                  <>
                    <ActionBtn
                      pos={{ right: -28, top: frameHeight / 2 - 10 }}
                      onClick={() => rotateItem(it.id)}
                    >↻</ActionBtn>
                    <ActionBtn
                      pos={{ bottom: -10, left: "50%", marginLeft: -10 }}
                      bg={it.locked ? "#ef4444" : "#fff"}
                      onClick={() => lockItem(it.id)}
                    >{it.locked ? "🔓" : "🔒"}</ActionBtn>
                  </>
                );
              })()}

              {/* Çerçeve boş delik ipuçları — seçili, "dokun → doldur" (sadece görsel) */}
              {it.type === "frame" && tool === "select" && selectedId === it.id && !dragRef.current && (() => {
                const rows = (it as any).rows || 2;
                const cols = (it as any).cols || 5;
                return Array.from({ length: rows }, (_, r) =>
                  Array.from({ length: cols }, (_, c) => {
                    const hi = r * cols + c;
                    const filled = items.some(
                      (ch) => ch.type === "chip" && (ch as any).parentId === it.id && (ch as any).holeIndex === hi
                    );
                    if (filled) return null;
                    const hc = getHoleColor(hi);
                    return (
                      <div
                        key={`fghost-${hi}`}
                        style={{
                          position: "absolute",
                          left: FRAME_PADDING + c * FRAME_CELL_SIZE + (FRAME_CELL_SIZE - CHIP_SIZE) / 2,
                          top: FRAME_PADDING + r * FRAME_CELL_SIZE + (FRAME_CELL_SIZE - CHIP_SIZE) / 2,
                          width: CHIP_SIZE, height: CHIP_SIZE,
                          borderRadius: "50%",
                          border: `2px dashed ${hc === "blue" ? "rgba(37,99,235,.55)" : "rgba(220,38,38,.55)"}`,
                          boxSizing: "border-box",
                          pointerEvents: "none",
                          zIndex: 4,
                        }}
                      />
                    );
                  })
                );
              })()}
            </div>
          ))}

          {/* Merge buttons */}
          {tool === "select" && !dragRef.current && adjPairs.map((p, i) => (
            <div key={i} onClick={() => mergeRods(p.l, p.r)}
              style={{ position: "absolute", left: p.mx - 12, top: p.my - 12, width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#22c55e,#15803d)", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, color: "#fff", zIndex: 15 }}>
              ⊕
            </div>
          ))}

          {/* Drag ghost */}
          {dragRef.current && <div style={{ position: "absolute", left: dpRef.current.x, top: dpRef.current.y, zIndex: 999, pointerEvents: "none", opacity: nearTrashRef.current ? 0.4 : 0.85, transform: `scale(${nearTrashRef.current ? 0.7 : 1.03})${(dragRef.current as any).rot === 90 ? " rotate(90deg)" : ""}`, transformOrigin: (dragRef.current as any).rot === 90 ? `${ROD_HEIGHT / 2}px ${ROD_HEIGHT / 2}px` : "center", transition: "opacity .15s,transform .15s" }}>{renderItem(dragRef.current)}</div>}

          {/* Trash zone — sits below page navigator */}
          {dragRef.current && <div style={{ position: "absolute", bottom: 50, left: 0, right: 0, height: 48, background: nearTrashRef.current ? "rgba(239,68,68,.3)" : "rgba(0,0,0,.04)", borderTop: nearTrashRef.current ? "2px solid rgba(239,68,68,.5)" : "1px dashed rgba(0,0,0,.08)", borderBottom: nearTrashRef.current ? "2px solid rgba(239,68,68,.5)" : "none", borderRadius: 8, margin: "0 20%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, pointerEvents: "none", zIndex: 998 }}><span style={{ fontSize: 16, opacity: nearTrashRef.current ? 1 : 0.3 }}>🗑️</span><span style={{ fontSize: 10, fontWeight: 700, color: nearTrashRef.current ? "#dc2626" : "rgba(0,0,0,.15)" }}>{nearTrashRef.current ? t("trashY") : t("trashN")}</span></div>}

          {/* Snap effect */}
          {snapEffect && <div key={snapEffect.t} style={{ position: "absolute", left: snapEffect.x - 20, top: snapEffect.y - 20, width: 40, height: 40, borderRadius: "50%", border: "3px solid #22c55e", pointerEvents: "none", zIndex: 50, animation: "dsSnap .5s ease-out forwards" }} />}

          {/* Number line */}
          {showNumberLine && <NumberLine lang={language} isDark={dk} />}

          {/* Sembolik + sözel cümle şeridi — yapı okunaklı değilse hiç çizilmez */}
          {sentence && <SentenceStrip sentence={sentence} lang={language} isDark={dk} />}

          {/* Watermark */}
          <div style={{ position: "absolute", bottom: 6, right: 10, fontSize: 10, fontWeight: 700, color: "rgba(60,60,40,.15)", pointerEvents: "none" }}>Prof. Dr. Yılmaz Mutlu</div>

          {/* Feedback banner */}
          {feedback && <FeedbackBanner feedback={feedback} lang={language} hasActiveTemplate={!!activeTemplate} />}
        </div>
      </div>

      <BottomToolbar
        lang={language} palette={palette} isDark={dk}
        tool={tool} penColor={penColor} penWidth={penWidth} eraserWidth={eraserWidth}
        textSize={textSize} textBold={textBold}
        gridType={gridType} bgColor={bgColor}
        voiceOn={voiceOn} helpOpen={helpOpen} numPickerOpen={numPickerOpen}
        onAR3D={() => arDispatch({ type: "SET_AR_MODE", mode: "3d" })}
        onARCamera={() => arDispatch({ type: "SET_AR_MODE", mode: "camera-ar" })}
        onSetTool={(t) => dispatch({ type: "SET_TOOL", tool: t })}
        onSetPenColor={(c) => dispatch({ type: "SET_PEN_COLOR", color: c })}
        onSetPenWidth={(w) => dispatch({ type: "SET_PEN_WIDTH", width: w })}
        onSetEraserWidth={(w) => dispatch({ type: "SET_ERASER_WIDTH", width: w })}
        onSetTextSize={(s) => dispatch({ type: "SET_TEXT_SIZE", size: s })}
        onToggleTextBold={() => dispatch({ type: "TOGGLE_TEXT_BOLD" })}
        onSetGridType={(g) => dispatch({ type: "SET_GRID_TYPE", gridType: g })}
        onSetBgColor={(c) => dispatch({ type: "SET_BG_COLOR", color: c })}
        onToggleVoice={toggleVoice}
        onToggleHelp={() => dispatch({ type: "TOGGLE_HELP" })}
        onToggleNumPicker={() => dispatch({ type: "SET_NUM_PICKER", open: !numPickerOpen })}
        onPlaceChip={(color, label) => place({ type: "chip", color, label } as any)}
      />

      {helpOpen && <HelpModal lang={language} onClose={() => dispatch({ type: "TOGGLE_HELP" })} />}
      {aboutOpen && <AboutModal lang={language} onClose={() => setAboutOpen(false)} />}
    </div>
  );
}

function ActionBtn({ pos, bg, onClick, children }: { pos: React.CSSProperties; bg?: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <div
      onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
      onClick={onClick}
      style={{
        position: "absolute", ...pos,
        width: 20, height: 20, borderRadius: "50%",
        background: bg || "#fff", border: "2px solid #a0aa94",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", fontSize: 10, zIndex: 12,
      }}
    >
      {children}
    </div>
  );
}
