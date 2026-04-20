import { useState, useRef, useEffect, useCallback, useReducer } from "react";

/* ── Constants ── */
import { PALETTE } from "./constants/palette";
import { BLOCK_UNIT_PX, HUNDRED_SIDE_PX, GRID_SNAP } from "./constants/dimensions";
import { BLOCK_TYPES, SUP, SUB } from "./constants/blockTypes";
import { ACTIVITIES } from "./constants/activities";
import { QUIZ_POOL } from "./constants/quizPool";

/* ── i18n ── */
import { LANGS } from "./i18n";

/* ── Utils ── */
import { createAudioContext, playTone, playGroup, playBreak, playAdd, playRemove, playCorrect, playWrong } from "./utils/audio";
import { speakInLang, SPEECH_SUPPORTED } from "./utils/speech";
import { loadProgress, saveProgress } from "./utils/progress";
import { interpretCommand } from "./utils/turkishParser";

/* ── State ── */
import { itemsReducer, initialState } from "./state/itemsReducer";

/* ── Components ── */
import BlockPatternDefs from "./components/blocks/BlockPatternDefs";
import BlockSVG from "./components/blocks/BlockSVG";
import NumberLine from "./components/widgets/NumberLine";
import Toggle from "./components/ui/Toggle";
import ModalBackdrop from "./components/modals/ModalBackdrop";
import { LangSwitcher } from "@shared/LangSwitcher.jsx";

const U = BLOCK_UNIT_PX;
const W = HUNDRED_SIDE_PX;

export default function App() {
  /* ═══════════════════════════════════════════════
     MERKEZI DURUM
  ═══════════════════════════════════════════════ */
  const [ds, dispatch] = useReducer(itemsReducer, initialState);
  const { items, itemHistory, itemFuture, strokes, undone, pages, currentPageId } = ds;

  const blockIdCounter = useRef(1);
  const nextId = () => blockIdCounter.current++;

  /* ── Audio ── */
  const audioCtxRef = useRef(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const play = useCallback((fn) => {
    if (!soundEnabled) return;
    if (!audioCtxRef.current) audioCtxRef.current = createAudioContext();
    fn(audioCtxRef.current);
  }, [soundEnabled]);

  /* ── Dil ── */
  const [langCode, setLangCode] = useState("tr");
  const L = LANGS[langCode] || LANGS.tr;
  const t = key => L[key] ?? LANGS.tr[key] ?? key;
  const readNum = n => L.readNum(n);

  /* ── TTS ── */
  const [ttsEnabled, setTtsEnabled] = useState(false);

  /* ── ARIA ── */
  const [ariaMsg, setAriaMsg] = useState("");
  const announce = useCallback((msg) => {
    setAriaMsg(""); setTimeout(() => setAriaMsg(msg), 50);
    if (ttsEnabled) speakInLang(msg, langCode);
  }, [ttsEnabled, langCode]);

  /* ═══════════════════════════════════════════════
     BLOK İŞLEMLERİ
  ═══════════════════════════════════════════════ */
  const counts = { ones: 0, tens: 0, huns: 0, ths: 0 };
  items.forEach(it => { if (counts[it.t] !== undefined) counts[it.t]++; });
  const totalValue = counts.ones + counts.tens * 10 + counts.huns * 100 + counts.ths * 1000;

  const addItem = useCallback((blockType, x, y) => {
    dispatch({ type: "ADD_ITEM", id: nextId(), blockType, x, y });
    play(playAdd);
  }, [play]);

  const removeItem = useCallback((id) => {
    dispatch({ type: "REMOVE_ITEM", id });
    play(playRemove);
  }, [play]);

  const moveItem = useCallback((id, x, y) => {
    dispatch({ type: "MOVE_ITEM", id, x, y });
  }, []);

  /* ── Gruplama & Çözme ── */
  function groupItem(id) {
    const item = items.find(it => it.id === id);
    if (!item || item.t === "ths") return;
    const same = items.filter(it => it.t === item.t);
    if (same.length < 10) {
      announce(`Gruplama için en az 10 ${BLOCK_TYPES.find(b => b.t === item.t).label} gerekli. Şu an ${same.length} var.`);
      return;
    }
    const sup = SUP[item.t];
    let removed = 0, cx = 0, cy = 0;
    const nextItems = [];
    items.forEach(it => {
      if (it.t === item.t && removed < 10) { removed++; cx += it.x; cy += it.y; return; }
      nextItems.push(it);
    });
    nextItems.push({ id: nextId(), t: sup, x: Math.round(cx / 10), y: Math.round(cy / 10) });
    dispatch({ type: "SET_ITEMS_BATCH", items: nextItems });
    play(playGroup);
    announce(`10 ${BLOCK_TYPES.find(b => b.t === item.t).label} gruplandı → 1 ${BLOCK_TYPES.find(b => b.t === sup).label}. Toplam: ${totalValue}`);
  }

  function breakItem(id) {
    const item = items.find(it => it.id === id);
    if (!item || item.t === "ones") return;
    const sub = SUB[item.t];
    const bt = BLOCK_TYPES.find(b => b.t === sub);
    const nextItems = items.filter(it => it.id !== id);
    for (let i = 0; i < 10; i++) {
      const dx = item.t === "tens" ? 0 : (i % 5) * (bt.w + 2);
      const dy = item.t === "tens" ? i * (bt.h + 2) : Math.floor(i / 5) * (bt.h + 4);
      nextItems.push({ id: nextId(), t: sub, x: Math.round(item.x + dx), y: Math.round(item.y + dy) });
    }
    dispatch({ type: "SET_ITEMS_BATCH", items: nextItems });
    play(playBreak);
    announce(`Çözüldü → 10 ${BLOCK_TYPES.find(b => b.t === sub).label}. Toplam: ${totalValue}`);
  }

  /* ── Genişletilmiş Gösterim ── */
  const expanded = [];
  if (counts.ths > 0) expanded.push(`${counts.ths}×1000`);
  if (counts.huns > 0) expanded.push(`${counts.huns}×100`);
  if (counts.tens > 0) expanded.push(`${counts.tens}×10`);
  if (counts.ones > 0) expanded.push(`${counts.ones}×1`);
  const expandedStr = expanded.length ? expanded.join(" + ") + " = " + totalValue : "";
  const okunus = totalValue > 0 ? readNum(totalValue) : "";

  /* ═══════════════════════════════════════════════
     UI DURUMU
  ═══════════════════════════════════════════════ */
  const [sidebarTab, setSidebarTab] = useState("mat");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [bgType, setBgType] = useState("grid");
  const [tool, setTool] = useState("select");
  const [penColor, setPenColor] = useState("#1a1a1a");
  const [penWidth, setPenWidth] = useState(3);
  const [penAlpha, setPenAlpha] = useState(1);
  const [eraserSize, setEraserSize] = useState(20);
  const [drawing, setDrawing] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [pendingActivity, setPendingActivity] = useState(null);
  const [game, setGame] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTeacher, setShowTeacher] = useState(false);
  const [showMat, setShowMat] = useState(true);
  const [showVals, setShowVals] = useState(false);
  const [showDecomp, setShowDecomp] = useState(false);
  const [showTablet, setShowTablet] = useState(false);
  const [showNumberLine, setShowNumberLine] = useState(false);
  const [matCols, setMatCols] = useState(3);
  const [matCounts, setMatCounts] = useState({ ones: 0, tens: 0, huns: 0, ths: 0 });
  const combinedCounts = {
    ones: counts.ones + matCounts.ones, tens: counts.tens + matCounts.tens,
    huns: counts.huns + matCounts.huns, ths: counts.ths + matCounts.ths,
  };
  const combinedTotal = combinedCounts.ones + combinedCounts.tens * 10 + combinedCounts.huns * 100 + combinedCounts.ths * 1000;
  const [matScale, setMatScale] = useState(1);
  const [matXY, setMatXY] = useState(null);
  const [decompXY, setDecompXY] = useState(null);
  const [matDrag, setMatDrag] = useState(null);
  const [tabXY, setTabXY] = useState(null);
  const [tabSep, setTabSep] = useState(false);
  const [tabVis, setTabVis] = useState(["tens", "ones"]);
  const [tabCounts, setTabCounts] = useState({ ones: 0, tens: 0, huns: 0, ths: 0 });
  const [colorBlind, setColorBlind] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontFamily, setFontFamily] = useState("nunito");
  const [fontSize, setFontSize] = useState(1);
  const [dragFromSidebar, setDragFromSidebar] = useState(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [dropHighlight, setDropHighlight] = useState(false);
  const [itemDrag, setItemDrag] = useState(null);
  const [overTrash, setOverTrash] = useState(false);
  const [progress, setProgress] = useState(loadProgress);
  const [sessionStart] = useState(() => Date.now());

  /* ── Ses Komutu ── */
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceLog, setVoiceLog] = useState([]);
  const [voiceError, setVoiceError] = useState("");
  const [voiceMode, setVoiceMode] = useState("push");
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const recognitionRef = useRef(null);

  /* ── Kayıt & AR ── */
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [showRecPanel, setShowRecPanel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [arMode, setArMode] = useState(false);
  const [arError, setArError] = useState("");
  const arVideoRef = useRef(null);
  const arStreamRef = useRef(null);
  const mediaRecRef = useRef(null);
  const recTimerRef = useRef(null);
  const recChunksRef = useRef([]);

  /* ── Refs ── */
  const matRef = useRef(null);
  const canvasRef = useRef(null);
  const drawRef = useRef(null);
  const cursorRef = useRef(null);
  const mainAreaRef = useRef(null);
  const curStroke = useRef([]);
  const canvasSized = useRef(false);

  /* ── Tablet Fonksiyonları ── */
  const tabTotal = ["ths", "huns", "tens", "ones"]
    .filter(bt => tabVis.includes(bt))
    .reduce((s, bt) => s + (tabCounts[bt] || 0) * { ones: 1, tens: 10, huns: 100, ths: 1000 }[bt], 0);

  function tabInc(bt) { setTabCounts(p => ({ ...p, [bt]: Math.min(p[bt] + 1, 9) })); play(playAdd); }
  function tabDec(bt) { setTabCounts(p => ({ ...p, [bt]: Math.max(p[bt] - 1, 0) })); }
  function tabAddCol(bt) { setTabVis(p => { if (p.includes(bt)) return p; const order = ["ths", "huns", "tens", "ones"]; return order.filter(o => p.includes(o) || o === bt); }); }
  function tabRemCol(bt) { setTabVis(p => p.length <= 1 ? p : p.filter(x => x !== bt)); }

  function startTabDrag(e) {
    if (e.target.closest && e.target.closest("[data-tabbtn]")) return;
    e.preventDefault();
    const el = e.currentTarget; const r = el.getBoundingClientRect();
    const ox = e.clientX - r.left, oy = e.clientY - r.top;
    function onM(ev) { setTabXY({ x: ev.clientX - ox, y: ev.clientY - oy }); }
    function onU() { window.removeEventListener("pointermove", onM); window.removeEventListener("pointerup", onU); }
    window.addEventListener("pointermove", onM); window.addEventListener("pointerup", onU);
  }

  /* ── Basamak Tablosu Sütunları ── */
  const ALL_COLS = [
    { t: "ths", l: t("colThs"), c: PALETTE.ths, cB: PALETTE.thsB },
    { t: "huns", l: t("colHuns"), c: PALETTE.huns, cB: PALETTE.hunsB },
    { t: "tens", l: t("colTens"), c: PALETTE.tens, cB: PALETTE.tensB },
    { t: "ones", l: t("colOnes"), c: PALETTE.ones, cB: PALETTE.onesB },
  ];
  const visCols = ALL_COLS.slice(4 - matCols);

  /* ── Çözümleme ── */
  const decompParts = [];
  if (counts.ths > 0) decompParts.push("" + (counts.ths * 1000));
  if (counts.huns > 0) decompParts.push("" + (counts.huns * 100));
  if (counts.tens > 0) decompParts.push("" + (counts.tens * 10));
  if (counts.ones > 0) decompParts.push("" + counts.ones);
  const decompStr = decompParts.length > 1 ? decompParts.join(" + ") + " = " + totalValue : decompParts.length === 1 ? "" + totalValue : "";

  /* ═══════════════════════════════════════════════
     ETKİNLİK & BLOK EKLEME
  ═══════════════════════════════════════════════ */
  function runSetup(act) {
    if (!act?.s) return;
    const s = act.s;
    dispatch({ type: "CLEAR_ALL" });
    if (s.cols) setMatCols(s.cols);
    setShowMat(true);
    if (s.decomp) setShowDecomp(true);
    setTimeout(() => {
      let x = 80, y = 100, gap = 6;
      if (s.ths) { for (let i = 0; i < s.ths; i++) addItem("ths", x + i * (160 + gap), y); y += 180; }
      if (s.huns) { for (let i = 0; i < s.huns; i++) addItem("huns", x + i * (140 + gap), y); y += 150; }
      if (s.tens) { for (let i = 0; i < s.tens; i++) addItem("tens", x + (i % 8) * (U + gap), y + Math.floor(i / 8) * (W + gap)); if (s.tens > 8) y += 2 * (W + gap); else y += W + 10; }
      if (s.ones) { for (let i = 0; i < s.ones; i++) addItem("ones", x + (i % 10) * (U + gap), y + Math.floor(i / 10) * (U + gap)); }
    }, 60);
    announce(`Etkinlik başlatıldı: ${act.n}`);
  }

  function addBlocks(type, count) {
    const bt = BLOCK_TYPES.find(b => b.t === type);
    const existing = items.filter(i => i.t === type).length;
    const gap = 4;
    for (let i = 0; i < count; i++) {
      const idx = existing + i;
      const cols = type === "ones" ? 10 : type === "tens" ? 6 : 3;
      addItem(type, 60 + (idx % cols) * (bt.w + gap), 60 + Math.floor(idx / cols) * (bt.h + gap));
    }
  }

  /* ═══════════════════════════════════════════════
     SES KOMUTU SİSTEMİ
  ═══════════════════════════════════════════════ */
  function showNumberAsBlocks(n) {
    if (!n || n < 1 || n > 9999) return;
    dispatch({ type: "CLEAR_ALL" });
    setShowMat(true);
    setTimeout(() => {
      const ths = Math.floor(n / 1000), huns = Math.floor((n % 1000) / 100), tens = Math.floor((n % 100) / 10), ones = n % 10;
      let x = 60, y = 80, gap = 6;
      if (ths) { for (let i = 0; i < ths; i++) addItem("ths", x + i * (160 + gap), y); y += 180; }
      if (huns) { for (let i = 0; i < huns; i++) addItem("huns", x + i * (140 + gap), y); y += 150; }
      if (tens) { for (let i = 0; i < tens; i++) addItem("tens", x + i * (U + gap), y); y += W + 10; }
      if (ones) { for (let i = 0; i < ones; i++) addItem("ones", x + i * (U + gap), y); }
    }, 80);
  }

  function executeVoiceCommand(cmd, rawText) {
    const ok = cmd.type !== "UNKNOWN";
    setVoiceLog(log => [{ text: rawText, label: cmd.label, ok, ts: Date.now() }, ...log.slice(0, 19)]);
    announce(cmd.label);
    play(ok ? ctx => playTone(ctx, 660, "sine", 0.08, 0.25) : ctx => playTone(ctx, 220, "square", 0.1, 0.2));

    switch (cmd.type) {
      case "ADD_BLOCK": addBlocks(cmd.payload.blockType, cmd.payload.count); break;
      case "GROUP": {
        if (cmd.payload.blockType) { const tgt = items.find(it => it.t === cmd.payload.blockType); if (tgt) groupItem(tgt.id); }
        else { for (const bt of ["ones", "tens", "huns"]) { if (counts[bt] >= 10) { const tgt = items.find(it => it.t === bt); if (tgt) { groupItem(tgt.id); break; } } } }
        break;
      }
      case "BREAK": {
        if (cmd.payload.blockType) { const tgt = items.find(it => it.t === cmd.payload.blockType); if (tgt) breakItem(tgt.id); }
        else { for (const bt of ["tens", "huns", "ths"]) { const f = items.find(it => it.t === bt); if (f) { breakItem(f.id); break; } } }
        break;
      }
      case "CLEAR": dispatch({ type: "CLEAR_ALL" }); break;
      case "UNDO": dispatch({ type: "UNDO" }); break;
      case "REDO": dispatch({ type: "REDO" }); break;
      case "SPEAK": totalValue > 0 ? speakInLang(`${totalValue}: ${readNum(totalValue)}`, langCode) : speakInLang("Kanvas boş", langCode); break;
      case "SHOW_NUMBER": showNumberAsBlocks(cmd.payload.n); break;
      case "QUIZ": startQuiz(); setSidebarTab("game"); break;
      case "BUILD": startBuild(); setSidebarTab("game"); break;
      case "TOGGLE_WIDGET":
        switch (cmd.payload.w) {
          case "mat": setShowMat(cmd.payload.v); break;
          case "line": setShowNumberLine(cmd.payload.v); break;
          case "vals": setShowVals(cmd.payload.v); break;
          case "decomp": setShowDecomp(cmd.payload.v); break;
          case "tablet": setShowTablet(cmd.payload.v); break;
          case "colorBlind": setColorBlind(cmd.payload.v); break;
          case "contrast": setHighContrast(cmd.payload.v); break;
        } break;
      case "ZOOM":
        if (cmd.payload.dir === 0) setZoom(1);
        else if (cmd.payload.dir > 0) setZoom(z => Math.min(2, +(z + .2).toFixed(1)));
        else setZoom(z => Math.max(.5, +(z - .2).toFixed(1)));
        break;
      case "PAGE": dispatch({ type: "ADD_PAGE", id: Math.max(...pages.map(p => p.id)) + 1 }); break;
      case "HELP": setShowVoicePanel(true); break;
      default: break;
    }
  }

  /* ── SpeechRecognition ── */
  function startVoice() {
    if (!SPEECH_SUPPORTED) { setVoiceError("Bu tarayıcı ses tanımayı desteklemiyor."); return; }
    setVoiceError("");
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = "tr-TR"; rec.continuous = voiceMode === "continuous"; rec.interimResults = true; rec.maxAlternatives = 3;
    rec.onstart = () => { setVoiceActive(true); setVoiceTranscript(""); };
    rec.onend = () => { setVoiceActive(false); setVoiceTranscript(""); };
    rec.onerror = e => { setVoiceActive(false); setVoiceError({ "not-allowed": "Mikrofon izni verilmedi.", "no-speech": "Ses algılanamadı.", "network": "Ağ hatası.", "audio-capture": "Mikrofon bulunamadı." }[e.error] || `Hata: ${e.error}`); };
    rec.onresult = e => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) final += e.results[i][0].transcript; else interim += e.results[i][0].transcript; }
      setVoiceTranscript(interim || final);
      if (final.trim()) { executeVoiceCommand(interpretCommand(final.trim()), final.trim()); if (voiceMode === "push") rec.stop(); }
    };
    recognitionRef.current = rec;
    try { rec.start(); } catch { setVoiceError("Mikrofon başlatılamadı."); }
  }
  function stopVoice() { recognitionRef.current?.stop(); setVoiceActive(false); }
  function toggleVoice() { voiceActive ? stopVoice() : startVoice(); }
  useEffect(() => () => { recognitionRef.current?.stop(); }, []);

  /* ═══════════════════════════════════════════════
     QUIZ & BUILD
  ═══════════════════════════════════════════════ */
  const [currentQuizLevel, setCurrentQuizLevel] = useState(2);

  function startQuiz() {
    const pool = QUIZ_POOL.filter(q => q.bloom <= currentQuizLevel);
    setGame({ mode: "quiz", score: 0, total: 0, feedback: null, qIdx: Math.floor(Math.random() * pool.length), streak: 0 });
  }
  function startBuild() {
    setGame({ mode: "build", score: 0, total: 0, feedback: null, target: Math.floor(Math.random() * 900) + 100 });
    dispatch({ type: "CLEAR_ALL" });
  }
  function pickQuiz(selectedIdx) {
    if (!game || game.feedback) return;
    const pool = QUIZ_POOL.filter(q => q.bloom <= currentQuizLevel);
    const correct = selectedIdx === pool[game.qIdx].a;
    const newStreak = correct ? game.streak + 1 : 0;
    let newLevel = currentQuizLevel;
    if (correct && newStreak >= 3 && currentQuizLevel < 5) newLevel = Math.min(5, currentQuizLevel + 1);
    if (!correct && currentQuizLevel > 1) newLevel = Math.max(1, currentQuizLevel - 1);
    if (correct) { play(playCorrect); announce("Doğru!"); }
    else { play(playWrong); announce(`Yanlış. Doğru cevap: ${pool[game.qIdx].o[pool[game.qIdx].a]}`); }
    setGame(g => ({ ...g, feedback: correct ? "correct" : "wrong", score: g.score + (correct ? 1 : 0), total: g.total + 1, streak: newStreak, selectedIdx }));
    setCurrentQuizLevel(newLevel);
    const entry = { q: pool[game.qIdx].q, bloom: pool[game.qIdx].bloom, correct, timestamp: Date.now() };
    const newProg = { ...progress, quizHistory: [...(progress.quizHistory || []).slice(-99), entry] };
    setProgress(newProg); saveProgress(newProg);
    if (correct) setTimeout(() => { const np = QUIZ_POOL.filter(q => q.bloom <= newLevel); setGame(g => ({ ...g, qIdx: Math.floor(Math.random() * np.length), feedback: null, streak: newStreak })); }, 1200);
  }
  function checkBuild() {
    if (!game || game.mode !== "build") return;
    if (combinedTotal === game.target) {
      play(playCorrect); announce(`Doğru! ${game.target} sayısını oluşturdun!`);
      setGame(g => ({ ...g, feedback: "correct", score: g.score + 1, total: g.total + 1 }));
      setTimeout(() => { setGame(g => ({ ...g, target: Math.floor(Math.random() * 900) + 100, feedback: null })); dispatch({ type: "CLEAR_ALL" }); setMatCounts({ ones: 0, tens: 0, huns: 0, ths: 0 }); }, 1500);
    } else {
      play(playWrong); announce(`Henüz değil. ${combinedTotal} var, ${game.target} gerekiyor.`);
      setGame(g => ({ ...g, feedback: "wrong", total: g.total + 1 }));
      setTimeout(() => setGame(g => ({ ...g, feedback: null })), 1000);
    }
  }

  /* ═══════════════════════════════════════════════
     KLAVYE KISAYOLLARI
  ═══════════════════════════════════════════════ */
  useEffect(() => {
    function onKeyDown(e) {
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "q" || e.key === "Q") { addItem("ones", 80 + (counts.ones % 10) * (U + 4), 100 + Math.floor(counts.ones / 10) * (U + 4)); e.preventDefault(); }
      if (e.key === "w" || e.key === "W") { addItem("tens", 80 + (counts.tens % 6) * (U + 4), 100 + Math.floor(counts.tens / 6) * (W + 4)); e.preventDefault(); }
      if (e.key === "e" || e.key === "E") { addItem("huns", 80 + (counts.huns % 3) * (140 + 4), 100 + Math.floor(counts.huns / 3) * (140 + 4)); e.preventDefault(); }
      if (e.key === "r" || e.key === "R") { addItem("ths", 80 + (counts.ths % 2) * (160 + 4), 100 + Math.floor(counts.ths / 2) * (160 + 4)); e.preventDefault(); }
      if (selectedBlock) {
        if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); removeItem(selectedBlock); setSelectedBlock(null); }
        if (e.key === "g" || e.key === "G") { e.preventDefault(); groupItem(selectedBlock); }
        if (e.key === "b" || e.key === "B") { e.preventDefault(); breakItem(selectedBlock); }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); dispatch({ type: "UNDO" }); }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); dispatch({ type: "REDO" }); }
      if (e.key === "s" || e.key === "S") { if (totalValue > 0) { e.preventDefault(); speakInLang(`${totalValue} — ${readNum(totalValue)}`, langCode); } }
      if (e.key === "Escape") setSelectedBlock(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedBlock, counts, totalValue, addItem, removeItem, items]);

  /* ═══════════════════════════════════════════════
     SÜRÜKLEME SİSTEMİ
  ═══════════════════════════════════════════════ */
  useEffect(() => {
    if (!dragFromSidebar) return;
    function isOverCanvas(ex, ey) { if (!canvasRef.current) return false; const r = canvasRef.current.getBoundingClientRect(); return ex > r.left - 40 && ex < r.right + 40 && ey > r.top - 40 && ey < r.bottom + 40; }
    function onMove(e) { if (e.buttons === 0) { setDragFromSidebar(null); setDropHighlight(false); return; } setDragPos({ x: e.clientX, y: e.clientY }); setDropHighlight(isOverCanvas(e.clientX, e.clientY)); }
    function onUp(e) {
      setDropHighlight(false);
      if (matRef.current) { const mr = matRef.current.getBoundingClientRect(); if (e.clientX >= mr.left && e.clientX <= mr.right && e.clientY >= mr.top && e.clientY <= mr.bottom) { setMatCounts(p => ({ ...p, [dragFromSidebar.t]: p[dragFromSidebar.t] + 1 })); setDragFromSidebar(null); return; } }
      if (canvasRef.current && isOverCanvas(e.clientX, e.clientY)) { const r = canvasRef.current.getBoundingClientRect(); addItem(dragFromSidebar.t, (e.clientX - r.left) / zoom, (e.clientY - r.top) / zoom); }
      setDragFromSidebar(null);
    }
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [dragFromSidebar, zoom, addItem]);

  useEffect(() => {
    if (!itemDrag) return;
    function onMove(e) { if (e.buttons === 0) { setItemDrag(null); return; } if (!canvasRef.current) return; const r = canvasRef.current.getBoundingClientRect(); moveItem(itemDrag.id, (e.clientX - r.left) / zoom - itemDrag.offX, (e.clientY - r.top) / zoom - itemDrag.offY); setOverTrash(e.clientY > r.bottom - 50); }
    function onUp(e) { if (canvasRef.current && e.clientY > canvasRef.current.getBoundingClientRect().bottom - 50) { removeItem(itemDrag.id); if (selectedBlock === itemDrag.id) setSelectedBlock(null); } setItemDrag(null); setOverTrash(false); }
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [itemDrag, zoom, moveItem, removeItem, selectedBlock]);

  useEffect(() => {
    if (!matDrag) return;
    function onMove(e) { if (!canvasRef.current) return; const r = canvasRef.current.getBoundingClientRect(); setMatXY({ x: (e.clientX - r.left) / zoom - matDrag.offX, y: (e.clientY - r.top) / zoom - matDrag.offY }); }
    function onUp() { setMatDrag(null); }
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  });

  /* ═══════════════════════════════════════════════
     ÇİZİM SİSTEMİ
  ═══════════════════════════════════════════════ */
  function sizeCanvas() {
    const cv = drawRef.current; if (!cv || !canvasRef.current) return;
    const w = canvasRef.current.clientWidth, h = canvasRef.current.clientHeight;
    if (cv.width === w * 2 && cv.height === h * 2) return;
    cv.width = w * 2; cv.height = h * 2; cv.style.width = w + "px"; cv.style.height = h + "px";
    canvasSized.current = true;
  }
  function renderStrokes() {
    const cv = drawRef.current; if (!cv) return; sizeCanvas();
    const ctx = cv.getContext("2d"); ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.save(); ctx.scale(2, 2); ctx.lineCap = "round"; ctx.lineJoin = "round";
    strokes.forEach(s => {
      if (!s.points || s.points.length < 2) return;
      ctx.beginPath(); ctx.globalCompositeOperation = s.type === "eraser" ? "destination-out" : "source-over";
      ctx.globalAlpha = s.type === "eraser" ? 1 : (s.alpha || 1);
      ctx.strokeStyle = s.type === "eraser" ? "rgba(0,0,0,1)" : s.color; ctx.lineWidth = s.width;
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length - 1; i++) { const mx = (s.points[i].x + s.points[i + 1].x) / 2, my = (s.points[i].y + s.points[i + 1].y) / 2; ctx.quadraticCurveTo(s.points[i].x, s.points[i].y, mx, my); }
      ctx.lineTo(s.points[s.points.length - 1].x, s.points[s.points.length - 1].y);
      ctx.stroke(); ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    });
    ctx.restore();
  }
  useEffect(() => { renderStrokes(); }, [strokes]);
  useEffect(() => { const obs = new ResizeObserver(() => { canvasSized.current = false; renderStrokes(); }); if (canvasRef.current) obs.observe(canvasRef.current); return () => obs.disconnect(); }, []);

  function drawStart(e) { if (tool === "select") return; sizeCanvas(); const r = canvasRef.current.getBoundingClientRect(); curStroke.current = [{ x: (e.clientX - r.left) / zoom, y: (e.clientY - r.top) / zoom }]; setDrawing(true); }
  function drawMove(e) {
    if (cursorRef.current) { const cr = canvasRef.current?.getBoundingClientRect(); if (cr && tool !== "select") { const sz = tool === "eraser" ? eraserSize : Math.max(penWidth, 6); cursorRef.current.style.display = "block"; cursorRef.current.style.left = (e.clientX - cr.left - sz / 2) + "px"; cursorRef.current.style.top = (e.clientY - cr.top - sz / 2) + "px"; cursorRef.current.style.width = sz + "px"; cursorRef.current.style.height = sz + "px"; cursorRef.current.style.borderColor = tool === "eraser" ? "rgba(0,0,0,.3)" : penColor; } else { cursorRef.current.style.display = "none"; } }
    if (!drawing) return;
    const r = canvasRef.current.getBoundingClientRect(); const p = { x: (e.clientX - r.left) / zoom, y: (e.clientY - r.top) / zoom }; curStroke.current.push(p);
    const cv = drawRef.current; if (!cv) return; const ctx = cv.getContext("2d"); ctx.save(); ctx.scale(2, 2);
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over"; ctx.globalAlpha = tool === "eraser" ? 1 : penAlpha;
    ctx.beginPath(); ctx.strokeStyle = tool === "eraser" ? "rgba(0,0,0,1)" : penColor; ctx.lineWidth = tool === "eraser" ? eraserSize : penWidth; ctx.lineCap = "round";
    const pts = curStroke.current; if (pts.length >= 2) { ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y); ctx.lineTo(p.x, p.y); ctx.stroke(); } ctx.restore();
  }
  function drawEnd() {
    if (!drawing) return; setDrawing(false);
    if (curStroke.current.length > 1) dispatch({ type: "ADD_STROKE", stroke: { points: curStroke.current.slice(), color: penColor, width: tool === "eraser" ? eraserSize : penWidth, type: tool, alpha: penAlpha } });
    curStroke.current = [];
  }

  /* ═══════════════════════════════════════════════
     TAM EKRAN & KAYIT & AR
  ═══════════════════════════════════════════════ */
  function toggleFullscreen() { const el = mainAreaRef.current; if (!el) return; if (!document.fullscreenElement) el.requestFullscreen?.(); else document.exitFullscreen?.(); }
  useEffect(() => { function onFs() { setIsFullscreen(!!document.fullscreenElement); } document.addEventListener("fullscreenchange", onFs); return () => document.removeEventListener("fullscreenchange", onFs); }, []);

  async function startScreenRecord() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: false });
      recChunksRef.current = [];
      const mr = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
      mr.ondataavailable = e => { if (e.data.size > 0) recChunksRef.current.push(e.data); };
      mr.onstop = () => { const blob = new Blob(recChunksRef.current, { type: "video/webm" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `DokuSay_${Date.now()}.webm`; a.click(); URL.revokeObjectURL(url); stream.getTracks().forEach(t => t.stop()); setRecording(false); setRecSeconds(0); clearInterval(recTimerRef.current); };
      mr.start(1000); mediaRecRef.current = mr; setRecording(true); setRecSeconds(0);
      recTimerRef.current = setInterval(() => setRecSeconds(s => s + 1), 1000);
    } catch (e) { announce("Kayıt başlatılamadı: " + e.message); }
  }
  function stopScreenRecord() { mediaRecRef.current?.stop(); clearInterval(recTimerRef.current); }
  function takeSnapshot() {
    const canvas = document.createElement("canvas"); const mainEl = canvasRef.current; if (!mainEl) return;
    const r = mainEl.getBoundingClientRect(); canvas.width = r.width * 2; canvas.height = r.height * 2;
    const ctx = canvas.getContext("2d"); ctx.scale(2, 2); ctx.fillStyle = "#f5f0e3"; ctx.fillRect(0, 0, r.width, r.height);
    const dc = drawRef.current; if (dc) ctx.drawImage(dc, 0, 0, r.width, r.height);
    canvas.toBlob(blob => { const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `DokuSay_${Date.now()}.png`; a.click(); URL.revokeObjectURL(url); }, "image/png");
  }
  function exportSession() {
    const data = { version: "3.0", timestamp: new Date().toISOString(), lang: langCode, totalValue, items: items.map(it => ({ id: it.id, type: it.t, x: it.x, y: it.y })), matCounts, pages: pages.map(p => p.label) };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `DokuSay_oturum_${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
  }
  async function startAR() {
    setArError("");
    try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } }); arStreamRef.current = stream; if (arVideoRef.current) { arVideoRef.current.srcObject = stream; await arVideoRef.current.play(); } setArMode(true); }
    catch (e) { setArError("Kamera erişimi reddedildi: " + e.message); }
  }
  function stopAR() { arStreamRef.current?.getTracks().forEach(t => t.stop()); if (arVideoRef.current) arVideoRef.current.srcObject = null; setArMode(false); }
  useEffect(() => () => { arStreamRef.current?.getTracks().forEach(t => t.stop()); clearInterval(recTimerRef.current); }, []);

  /* ═══════════════════════════════════════════════
     RAPOR HESAPLAMALARI
  ═══════════════════════════════════════════════ */
  const bloomLevels = ["", "Hatırlama", "Anlama", "Uygulama", "Analiz", "Değerlendirme"];
  const recentQuiz = (progress.quizHistory || []).slice(-20);
  const correctCount = recentQuiz.filter(q => q.correct).length;
  const wrongCount = recentQuiz.length - correctCount;
  const bloomStats = [1, 2, 3, 4, 5].map(level => ({ level, label: bloomLevels[level], total: recentQuiz.filter(q => q.bloom === level).length, correct: recentQuiz.filter(q => q.bloom === level && q.correct).length })).filter(b => b.total > 0);

  /* ═══════════════════════════════════════════════
     STİL HESAPLAMALARI
  ═══════════════════════════════════════════════ */
  const fontMap = { nunito: "'Nunito','Segoe UI',system-ui,sans-serif", opendyslexic: "'OpenDyslexic',system-ui,sans-serif", mono: "'Courier New',monospace", serif: "Georgia,serif" };
  const baseFontSize = Math.round(14 * fontSize);
  const bgColor = highContrast ? "#000" : PALETTE.bg;
  const bgStyle = { background: bgColor };
  if (bgType === "grid") { bgStyle.backgroundImage = "linear-gradient(rgba(0,0,0,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.05) 1px,transparent 1px)"; bgStyle.backgroundSize = "24px 24px"; }
  else if (bgType === "dot") { bgStyle.backgroundImage = "radial-gradient(rgba(0,0,0,.1) 1px,transparent 1px)"; bgStyle.backgroundSize = "20px 20px"; }
  const canAutoGroup = { ones: counts.ones >= 10, tens: counts.tens >= 10, huns: counts.huns >= 10 };
  const fontStyle = fontFamily === "opendyslexic" ? "system-ui,sans-serif" : fontMap[fontFamily] || fontMap.nunito;

  /* ═══════════════════════════════════════════════
     BLOK RENDER FONKSİYONU
  ═══════════════════════════════════════════════ */
  function renderBlock(item) {
    const bt = BLOCK_TYPES.find(b => b.t === item.t); if (!bt) return null;
    const isSelected = selectedBlock === item.id;
    const canGrp = item.t !== "ths" && counts[item.t] >= 10;
    const canBrk = item.t !== "ones";
    return (
      <div key={"blk" + item.id} role="button" aria-label={`${bt.ariaDesc}. ${isSelected ? "Seçili." : ""}`} tabIndex={0}
        style={{ position: "absolute", left: item.x, top: item.y, zIndex: isSelected ? 5 : 2, cursor: "grab", touchAction: "none", outline: isSelected ? "2.5px solid " + PALETTE.accent : "none", outlineOffset: 3, borderRadius: 4, animation: "blockIn .2s ease-out" }}
        onPointerDown={e => { e.preventDefault(); e.stopPropagation(); const r = e.currentTarget.getBoundingClientRect(); setItemDrag({ id: item.id, offX: (e.clientX - r.left) / zoom, offY: (e.clientY - r.top) / zoom }); }}
        onClick={e => { e.stopPropagation(); setSelectedBlock(selectedBlock === item.id ? null : item.id); }}
        onKeyDown={e => {
          if (e.key === " " || e.key === "Enter") { e.preventDefault(); setSelectedBlock(selectedBlock === item.id ? null : item.id); }
          if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); removeItem(item.id); setSelectedBlock(null); }
          if (e.key === "g" || e.key === "G") { e.preventDefault(); groupItem(item.id); }
          if (e.key === "b" || e.key === "B") { e.preventDefault(); breakItem(item.id); }
        }}>
        <BlockSVG type={item.t} size={1} showVal={showVals} colorBlind={colorBlind} />
        {showVals && <div style={{ position: "absolute", left: "50%", bottom: -14, transform: "translateX(-50%)", background: bt.colorB, color: "#fff", fontSize: 8, fontWeight: 900, borderRadius: 4, padding: "1px 4px", whiteSpace: "nowrap", pointerEvents: "none" }}>{bt.val}</div>}
        {isSelected && (
          <div role="toolbar" aria-label="Blok işlemleri" style={{ position: "absolute", left: bt.w + 4, top: 0, zIndex: 10, background: "rgba(255,255,255,.97)", backdropFilter: "blur(8px)", borderRadius: 7, padding: "3px", boxShadow: "0 2px 10px rgba(0,0,0,.12)", border: "1px solid rgba(0,0,0,.08)", display: "flex", gap: 2, animation: "popIn .15s" }} onClick={e => e.stopPropagation()}>
            {canBrk && <button aria-label="Çöz" onClick={() => breakItem(item.id)} style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: BLOCK_TYPES.find(b => b.t === SUB[item.t]).color + "18", cursor: "pointer", fontSize: 9, fontWeight: 700, color: BLOCK_TYPES.find(b => b.t === SUB[item.t]).colorB, fontFamily: "inherit" }}>{"✂ Çöz (B)"}</button>}
            {canGrp && <button aria-label="Grupla" onClick={() => groupItem(item.id)} style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: BLOCK_TYPES.find(b => b.t === SUP[item.t]).color + "18", cursor: "pointer", fontSize: 9, fontWeight: 700, color: BLOCK_TYPES.find(b => b.t === SUP[item.t]).colorB, fontFamily: "inherit" }}>{"🔗 Grupla (G)"}</button>}
            <button aria-label="Sil" onClick={() => { removeItem(item.id); setSelectedBlock(null); }} style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: "rgba(239,68,68,.1)", cursor: "pointer", fontSize: 9, fontWeight: 700, color: "#b91c1c", fontFamily: "inherit" }}>{"× Sil"}</button>
          </div>
        )}
      </div>
    );
  }

  /* ═══════════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════════ */
  return (
    <div lang="tr" style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", fontFamily: fontStyle, fontSize: baseFontSize, filter: highContrast ? "contrast(1.4) brightness(1.05)" : "none" }}>
      {/* ARIA */}
      <div aria-live="polite" aria-atomic="true" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>{ariaMsg}</div>

      {/* ══ HEADER ══ (app kimliği AppShell'de — burada sadece işlevsel unsurlar) */}
      <header role="banner" style={{ height: 40, minHeight: 40, background: "linear-gradient(135deg,#3d2e1a,#2a2018)", display: "flex", alignItems: "center", padding: "0 14px", gap: 10, boxShadow: "0 2px 12px rgba(60,50,30,.2)" }}>
        <LangSwitcher
          lang={langCode}
          setLang={setLangCode}
          langs={Object.values(LANGS).map(l => l.code)}
          labels={Object.fromEntries(Object.values(LANGS).map(l => [l.code, l.code.toUpperCase()]))}
        />
        <div style={{ flex: 1 }} />
        <div aria-live="polite" style={{ background: "rgba(255,255,255,.07)", borderRadius: 8, padding: "3px 10px", display: "flex", alignItems: "center", gap: 6, minWidth: 80 }}>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.35)" }}>∑</span>
          <span style={{ fontSize: 17, fontWeight: 900, color: totalValue > 0 ? PALETTE.accent : "rgba(255,255,255,.2)" }}>{totalValue > 0 ? totalValue : "—"}</span>
          {okunus && <span style={{ fontSize: 9, color: "rgba(255,255,255,.35)", fontStyle: "italic", maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{okunus}</span>}
          {totalValue > 0 && <button onClick={() => speakInLang(`${totalValue} — ${okunus}`, langCode)} aria-label="Seslendir" style={{ background: "none", border: "none", color: "rgba(255,255,255,.35)", cursor: "pointer", fontSize: 13, padding: "1px 2px" }}>🔊</button>}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ══ SIDEBAR ══ */}
        <nav aria-label="Araçlar" style={{ width: sidebarCollapsed ? 48 : 252, minWidth: sidebarCollapsed ? 48 : 252, background: `linear-gradient(180deg,${PALETTE.side},#efe8d6)`, borderRight: "1px solid " + PALETTE.sideB, display: "flex", flexDirection: "column", transition: "width .25s", overflow: "hidden" }}>
          {sidebarCollapsed ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "12px 0" }}>
              {[["📦", "mat"], ["📋", "act"], ["🎮", "game"], ["⚙️", "feat"]].map(([ic, id]) => (
                <button key={id} onClick={() => { setSidebarCollapsed(false); setSidebarTab(id); }} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid " + PALETTE.sideB, background: "#fff", cursor: "pointer", fontSize: 18 }}>{ic}</button>
              ))}
              <button onClick={() => setSidebarCollapsed(false)} style={{ padding: "6px 12px", borderRadius: 8, border: "1px solid " + PALETTE.sideB, background: "#fff", cursor: "pointer", fontSize: 12, color: "#bbb" }}>▶</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid rgba(60,50,30,.06)" }}>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 900, color: PALETTE.text }}>Basamak Değeri</div>
                <button onClick={() => setSidebarCollapsed(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#ccc", width: 26, height: 26, borderRadius: 6 }}>◀</button>
              </div>
              <div role="tablist" style={{ display: "flex", padding: "4px 8px", gap: 3, background: "rgba(60,50,30,.02)" }}>
                {[["📦", "mat", t("tabBlocks")], ["📋", "act", t("tabAct")], ["🎮", "game", t("tabGame")], ["⚙️", "feat", t("tabSettings")]].map(([ic, id, lbl]) => (
                  <button key={id} role="tab" aria-selected={sidebarTab === id} onClick={() => setSidebarTab(id)} style={{ flex: 1, padding: "6px 0", border: "none", borderRadius: 8, background: sidebarTab === id ? "#fff" : "transparent", cursor: "pointer", fontSize: 12, fontWeight: 800, color: sidebarTab === id ? PALETTE.text : "#bbb", fontFamily: "inherit", boxShadow: sidebarTab === id ? "0 1px 4px " + PALETTE.sh : "none" }} title={lbl}>{ic}</button>
                ))}
              </div>

              {/* BLOKLAR */}
              {sidebarTab === "mat" && (
                <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
                  {BLOCK_TYPES.map(bt => {
                    const cnt = counts[bt.t]; const glowing = canAutoGroup[bt.t];
                    return (
                      <div key={bt.t} style={{ background: "#fff", borderRadius: 12, padding: "8px 12px", marginBottom: 6, borderLeft: "3px solid " + bt.color, border: "1px solid " + (glowing ? "rgba(245,158,11,.3)" : "rgba(60,50,30,.04)"), borderLeftWidth: 3, borderLeftColor: bt.color, boxShadow: glowing ? "0 0 14px rgba(245,158,11,.18)" : "0 1px 4px " + PALETTE.sh, position: "relative", transition: "box-shadow .3s" }}>
                        {cnt > 0 && <div style={{ position: "absolute", top: -4, right: -4, background: bt.color, color: "#fff", fontSize: 10, fontWeight: 900, borderRadius: 10, padding: "1px 6px", minWidth: 20, textAlign: "center" }}>{cnt}</div>}
                        {glowing && <div aria-live="assertive" style={{ position: "absolute", top: -4, left: -4, background: PALETTE.accent, color: "#fff", fontSize: 8, fontWeight: 800, borderRadius: 8, padding: "1px 5px", animation: "pulse 1.5s infinite" }}>10+ grupla!</div>}
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div role="button" tabIndex={0} style={{ cursor: "grab", touchAction: "none", padding: 4, background: bt.color + "08", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 52, minHeight: 58, border: "1.5px dashed " + bt.color + "25" }}
                            onPointerDown={e => { setDragFromSidebar({ t: bt.t }); setDragPos({ x: e.clientX, y: e.clientY }); }}
                            onKeyDown={e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); addItem(bt.t, 80 + cnt * (bt.w + 4), 100); } }}>
                            <BlockSVG type={bt.t} size={0.38} colorBlind={colorBlind} />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: bt.colorB }}>{t(bt.t)}</div>
                            <div style={{ fontSize: 10, color: "#b5a990", marginTop: 2 }}>{"= " + bt.val + " " + t("equalsUnit")}</div>
                            <div style={{ fontSize: 9, color: "#d4c8b0", marginTop: 1 }}>Klavye: <strong>{bt.t === "ones" ? "Q" : bt.t === "tens" ? "W" : bt.t === "huns" ? "E" : "R"}</strong></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ background: "#fff", borderRadius: 12, padding: "10px 12px", marginBottom: 6, border: "1px solid rgba(60,50,30,.04)", boxShadow: "0 1px 4px " + PALETTE.sh }}>
                    <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "#b5a990", marginBottom: 6 }}>Araçlar</div>
                    <Toggle on={showMat} onToggle={() => setShowMat(!showMat)} icon="📊" label={t("toolMat")} highContrast={highContrast} />
                    <Toggle on={showVals} onToggle={() => setShowVals(!showVals)} icon="🔢" label={t("toolVals")} highContrast={highContrast} />
                    <Toggle on={showDecomp} onToggle={() => setShowDecomp(!showDecomp)} icon="📐" label={t("toolDecomp")} highContrast={highContrast} />
                    <Toggle on={showTablet} onToggle={() => setShowTablet(!showTablet)} icon="📟" label={t("toolTablet")} highContrast={highContrast} />
                  </div>
                </div>
              )}

              {/* ETKİNLİKLER */}
              {sidebarTab === "act" && (
                <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
                  {["keşif", "kavram", "işlem", "karşılaştır", "senaryo", "yanılgı"].map(cat => {
                    const acts = ACTIVITIES.filter(a => a.cat === cat); if (!acts.length) return null;
                    const catLabel = { keşif: "Keşif", kavram: "Kavram", işlem: "İşlemler", karşılaştır: "Karşılaştırma", senaryo: "🌍 Gerçek Hayat", yanılgı: "🔍 Yanılgı" }[cat];
                    return (
                      <div key={cat}>
                        <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: cat === "yanılgı" ? "#ef4444" : cat === "senaryo" ? "#3b82f6" : "#b5a990", margin: "6px 0 3px" }}>{catLabel}</div>
                        {acts.map((tp, i) => (
                          <button key={i} onClick={() => setPendingActivity(tp)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", width: "100%", background: PALETTE.card, border: "1px solid rgba(60,50,30,.04)", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", textAlign: "left", color: PALETTE.text, marginBottom: 3, fontSize: 11, fontWeight: 600 }}>
                            <span aria-hidden style={{ fontSize: 14 }}>{tp.i}</span>
                            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tp.n}</span>
                            <span style={{ fontSize: 9, background: tp.diff === 1 ? "#dcfce7" : tp.diff === 2 ? "#fef9c3" : "#fee2e2", color: tp.diff === 1 ? "#166534" : tp.diff === 2 ? "#854d0e" : "#991b1b", padding: "1px 5px", borderRadius: 4, flexShrink: 0 }}>{tp.diff === 1 ? t("easy") : tp.diff === 2 ? t("medium") : t("hard")}</span>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* OYUNLAR */}
              {sidebarTab === "game" && (
                <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
                  {!game ? (
                    <>
                      <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "#b5a990", marginBottom: 8 }}>Oyunlar</div>
                      <div style={{ marginBottom: 8, background: "#fff", borderRadius: 10, padding: "8px 12px", border: "1px solid rgba(60,50,30,.04)" }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#b5a990", marginBottom: 4 }}>Quiz Zorluk (Bloom)</div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {[1, 2, 3, 4, 5].map(l => (
                            <button key={l} onClick={() => setCurrentQuizLevel(l)} style={{ padding: "4px 8px", borderRadius: 6, border: "1.5px solid", borderColor: currentQuizLevel === l ? PALETTE.accent : "rgba(60,50,30,.1)", background: currentQuizLevel === l ? PALETTE.accentL : "#fff", cursor: "pointer", fontSize: 10, fontWeight: 700, color: currentQuizLevel === l ? PALETTE.accentD : "#b5a990", fontFamily: "inherit" }}>L{l}</button>
                          ))}
                        </div>
                      </div>
                      <button onClick={startQuiz} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid rgba(245,158,11,.15)", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: PALETTE.accentD, fontFamily: "inherit", textAlign: "left", marginBottom: 6 }}>🧮 Basamak Değeri Quiz</button>
                      <button onClick={startBuild} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid rgba(59,130,246,.15)", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 700, color: PALETTE.hunsB, fontFamily: "inherit", textAlign: "left" }}>🏗️ Sayı Oluştur</button>
                    </>
                  ) : (
                    <div style={{ background: PALETTE.accentL, borderRadius: 12, padding: "12px", border: "1.5px solid rgba(245,158,11,.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                        <span style={{ fontSize: 15, fontWeight: 900, color: PALETTE.accentD }}>🏆 {game.score}/{game.total}</span>
                        <button onClick={() => setGame(null)} style={{ padding: "4px 10px", borderRadius: 8, border: "1px solid " + PALETTE.sideB, background: "#fff", cursor: "pointer", fontSize: 10, fontWeight: 700, color: "#b5a990", fontFamily: "inherit" }}>✕ Bitir</button>
                      </div>
                      {game.mode === "quiz" && (() => {
                        const pool = QUIZ_POOL.filter(q => q.bloom <= currentQuizLevel); const q = pool[game.qIdx]; if (!q) return null;
                        return (
                          <div>
                            <div style={{ padding: "12px", borderRadius: 12, background: "#fff", border: "1.5px solid rgba(245,158,11,.15)", textAlign: "center", marginBottom: 8 }}>
                              <div style={{ fontSize: 9, color: "#b5a990", marginBottom: 4 }}>{"🎯 " + bloomLevels[q.bloom]}</div>
                              <div style={{ fontSize: 14, fontWeight: 900, color: PALETTE.text }}>{q.q}</div>
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              {q.o.map((opt, ci) => {
                                const isCorrect = game.feedback && ci === q.a;
                                const isWrong = game.feedback === "wrong" && ci === game.selectedIdx;
                                return (
                                  <button key={ci} onClick={() => pickQuiz(ci)} disabled={!!game.feedback}
                                    style={{ padding: "10px 12px", borderRadius: 10, border: isCorrect ? "2px solid #22c55e" : isWrong ? "2px solid #ef4444" : "1.5px solid rgba(60,50,30,.04)", background: isCorrect ? "rgba(34,197,94,.08)" : isWrong ? "rgba(239,68,68,.06)" : "#fff", cursor: game.feedback ? "default" : "pointer", fontSize: 13, fontWeight: 700, color: isCorrect ? "#15803d" : isWrong ? "#b91c1c" : PALETTE.text, fontFamily: "inherit", textAlign: "left" }}>
                                    {opt}{isCorrect ? " ✅" : isWrong ? " ✗" : ""}
                                  </button>
                                );
                              })}
                            </div>
                            {game.feedback === "wrong" && <div role="alert" style={{ marginTop: 8, fontSize: 12, color: "#ef4444", textAlign: "center", fontWeight: 700 }}>Doğru cevap: {q.o[q.a]}</div>}
                          </div>
                        );
                      })()}
                      {game.mode === "build" && (
                        <div>
                          <div style={{ padding: "14px", borderRadius: 12, background: "#fff", textAlign: "center", marginBottom: 8 }}>
                            <div style={{ fontSize: 11, color: "#b5a990", marginBottom: 4 }}>Bu sayıyı bloklarla oluştur:</div>
                            <div style={{ fontSize: 32, fontWeight: 900, color: PALETTE.hunsB }}>{game.target}</div>
                            <div style={{ fontSize: 11, color: "#6d28d9", fontStyle: "italic", marginTop: 2 }}>{readNum(game.target)}</div>
                          </div>
                          <div style={{ textAlign: "center", marginBottom: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 800, color: combinedTotal === game.target ? "#22c55e" : PALETTE.text }}>Şu anki: {combinedTotal}</span>
                          </div>
                          <button onClick={checkBuild} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: combinedTotal === game.target ? "linear-gradient(135deg,#22c55e,#15803d)" : `linear-gradient(135deg,${PALETTE.huns},${PALETTE.hunsB})`, color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>✓ Kontrol Et</button>
                          {game.feedback === "correct" && <div role="alert" style={{ marginTop: 8, textAlign: "center", fontSize: 14, color: "#22c55e", fontWeight: 900, animation: "popIn .3s" }}>🎉 Doğru!</div>}
                          {game.feedback === "wrong" && <div role="alert" style={{ marginTop: 8, textAlign: "center", fontSize: 12, color: "#ef4444", fontWeight: 700 }}>Henüz değil</div>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* AYARLAR */}
              {sidebarTab === "feat" && (
                <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
                  <div style={{ background: "#fff", borderRadius: 12, padding: "10px 12px", marginBottom: 6, border: "1px solid rgba(60,50,30,.04)" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color: "#b5a990", marginBottom: 6 }}>Erişilebilirlik</div>
                    <Toggle on={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} icon="🔊" label={t("soundFx")} highContrast={highContrast} />
                    <Toggle on={ttsEnabled} onToggle={() => setTtsEnabled(!ttsEnabled)} icon="🗣" label={t("autoSpeak")} highContrast={highContrast} />
                    <Toggle on={colorBlind} onToggle={() => setColorBlind(!colorBlind)} icon="👁" label={t("colorBlindMode")} highContrast={highContrast} />
                    <Toggle on={highContrast} onToggle={() => setHighContrast(!highContrast)} icon="◑" label={t("highContrastMode")} highContrast={highContrast} />
                    <div style={{ padding: "6px 8px", marginBottom: 3 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: PALETTE.text, marginBottom: 4 }}>{t("fontLabel")}</div>
                      <select value={fontFamily} onChange={e => setFontFamily(e.target.value)} style={{ width: "100%", padding: "5px 8px", borderRadius: 6, border: "1px solid " + PALETTE.sideB, background: "#fff", fontSize: 11, fontFamily: "inherit", color: PALETTE.text }}>
                        <option value="nunito">Nunito (Varsayılan)</option>
                        <option value="opendyslexic">Disleksi Dostu</option>
                        <option value="mono">Monospace</option>
                        <option value="serif">Serif</option>
                      </select>
                    </div>
                    <div style={{ padding: "6px 8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, color: PALETTE.text, marginBottom: 4 }}><span>{t("fontSizeLabel")}</span><span>{Math.round(fontSize * 100)}%</span></div>
                      <input type="range" min="0.8" max="1.5" step="0.1" value={fontSize} onChange={e => setFontSize(parseFloat(e.target.value))} style={{ width: "100%" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* ══ KANVAS ══ */}
        <main ref={mainAreaRef} aria-label="Blok çalışma alanı" style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div ref={canvasRef} onClick={() => setSelectedBlock(null)} style={{ position: "absolute", inset: 0, overflow: "hidden", ...bgStyle }}>
            <svg width={0} height={0} style={{ position: "absolute" }}><BlockPatternDefs /></svg>

            {/* Toolbar */}
            <div role="toolbar" aria-label="Çizim araçları" style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", zIndex: 30, display: "flex", gap: 1, background: "rgba(255,255,255,.94)", backdropFilter: "blur(16px)", borderRadius: 10, padding: "3px 5px", boxShadow: "0 2px 12px rgba(0,0,0,.05)", border: "1px solid rgba(0,0,0,.04)", alignItems: "center" }}>
              {[["select", "🖱️", "Seç"], ["pen", "✏️", "Kalem"], ["highlighter", "🖍️", "Vurgulayıcı"], ["eraser", "🧹", "Silgi"]].map(([t2, ic, lbl]) => (
                <button key={t2} aria-label={lbl} aria-pressed={tool === t2} onClick={() => { setTool(t2); if (t2 === "highlighter") { setPenAlpha(.35); setPenWidth(12); } else if (t2 === "pen") { setPenAlpha(1); setPenWidth(3); } }} style={{ width: 30, height: 30, borderRadius: 7, border: tool === t2 ? "2px solid " + PALETTE.accent : "2px solid transparent", background: tool === t2 ? PALETTE.accentL : "transparent", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>{ic}</button>
              ))}
              {(tool === "pen" || tool === "highlighter") && <>
                {["#1a1a1a", "#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6"].map(c => (
                  <button key={c} onClick={() => setPenColor(c)} style={{ width: 14, height: 14, borderRadius: "50%", background: c, border: penColor === c ? "2px solid " + PALETTE.accent : "1px solid rgba(0,0,0,.1)", cursor: "pointer" }} />
                ))}
              </>}
              <div aria-hidden style={{ width: 1, height: 16, background: "rgba(0,0,0,.08)", margin: "0 1px" }} />
              <button onClick={() => dispatch({ type: "UNDO_STROKE" })} disabled={!strokes.length} style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent", cursor: strokes.length ? "pointer" : "default", fontSize: 13, color: strokes.length ? "#666" : "#ddd" }}>↩</button>
              <button onClick={() => dispatch({ type: "REDO_STROKE" })} disabled={!undone.length} style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent", cursor: undone.length ? "pointer" : "default", fontSize: 13, color: undone.length ? "#666" : "#ddd" }}>↪</button>
              <div aria-hidden style={{ width: 1, height: 16, background: "rgba(0,0,0,.08)", margin: "0 1px" }} />
              <button onClick={() => dispatch({ type: "UNDO" })} disabled={!itemHistory.length} style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent", cursor: itemHistory.length ? "pointer" : "default", fontSize: 11, color: itemHistory.length ? PALETTE.accent : "#ddd", fontWeight: 900 }}>⊘</button>
              <button onClick={() => dispatch({ type: "REDO" })} disabled={!itemFuture.length} style={{ width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent", cursor: itemFuture.length ? "pointer" : "default", fontSize: 11, color: itemFuture.length ? PALETTE.accent : "#ddd", fontWeight: 900 }}>⊛</button>
              <div aria-hidden style={{ width: 1, height: 16, background: "rgba(0,0,0,.08)", margin: "0 1px" }} />
              <button onClick={() => { if (items.length > 0 || strokes.length > 0) { dispatch({ type: "CLEAR_ALL" }); } }} disabled={items.length === 0 && strokes.length === 0} style={{ width: 28, height: 28, borderRadius: 6, border: "none", background: items.length > 0 || strokes.length > 0 ? "rgba(239,68,68,.08)" : "transparent", cursor: items.length > 0 || strokes.length > 0 ? "pointer" : "default", fontSize: 14, color: items.length > 0 || strokes.length > 0 ? "#ef4444" : "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>🗑</button>
            </div>

            <div ref={cursorRef} aria-hidden style={{ position: "absolute", display: "none", borderRadius: "50%", border: "2px solid #000", pointerEvents: "none", zIndex: 26 }} />
            <canvas ref={drawRef} style={{ position: "absolute", inset: 0, zIndex: tool !== "select" ? 25 : 0, pointerEvents: tool !== "select" ? "auto" : "none", cursor: tool !== "select" ? "none" : "default" }} onPointerDown={drawStart} onPointerMove={drawMove} onPointerUp={drawEnd} onPointerCancel={drawEnd} onPointerLeave={() => { if (cursorRef.current) cursorRef.current.style.display = "none"; }} aria-hidden="true" />

            {/* Zoom */}
            <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "0 0", width: (100 / zoom) + "%", height: (100 / zoom) + "%" }}>
              {/* Basamak Tablosu */}
              {showMat && (
                <div ref={matRef} data-mat="1" style={matXY ? { position: "absolute", left: matXY.x, top: matXY.y, zIndex: 4, transform: `scale(${matScale})`, transformOrigin: "top left" } : { position: "absolute", top: "50%", left: "50%", zIndex: 4, transform: `translate(-50%,-50%) scale(${matScale})`, transformOrigin: "center center", animation: "slideDown .3s" }}>
                  <div style={{ background: "rgba(255,255,255,.97)", backdropFilter: "blur(14px)", borderRadius: 16, overflow: "hidden", border: "1.5px solid rgba(60,50,30,.06)", boxShadow: "0 8px 32px " + PALETTE.shM }}>
                    <div onPointerDown={e => { e.preventDefault(); e.stopPropagation(); if (!canvasRef.current) return; const r = canvasRef.current.getBoundingClientRect(); const el = e.currentTarget.closest("[data-mat]"); if (!el) return; const er = el.getBoundingClientRect(); const ox = (er.left - r.left) / zoom, oy = (er.top - r.top) / zoom; const mx = (e.clientX - r.left) / zoom, my = (e.clientY - r.top) / zoom; setMatDrag({ offX: mx - ox, offY: my - oy }); if (!matXY) setMatXY({ x: ox, y: oy }); }}
                      style={{ background: `linear-gradient(135deg,${PALETTE.accent},${PALETTE.accentD})`, padding: "5px 8px", display: "flex", alignItems: "center", gap: 4, cursor: "grab", touchAction: "none", userSelect: "none" }}>
                      <button onClick={e => { e.stopPropagation(); setMatCols(c => Math.max(2, c - 1)); }} style={{ width: 20, height: 20, borderRadius: 5, border: "1px solid rgba(255,255,255,.3)", background: "rgba(255,255,255,.15)", cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: 900 }}>−</button>
                      <span style={{ flex: 1, textAlign: "center", fontSize: 9, fontWeight: 900, color: "#fff", letterSpacing: 1 }}>{t("placeTable")}</span>
                      <button onClick={e => { e.stopPropagation(); setMatCols(c => Math.min(4, c + 1)); }} style={{ width: 20, height: 20, borderRadius: 5, border: "1px solid rgba(255,255,255,.3)", background: "rgba(255,255,255,.15)", cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: 900 }}>+</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${visCols.length},1fr)` }}>
                      {visCols.map(col => <div key={col.t + "h"} style={{ textAlign: "center", padding: "4px 2px", background: col.c + "10", borderBottom: "2px solid " + col.c + "30", borderRight: "1px solid rgba(60,50,30,.04)" }}><div style={{ fontSize: 10, fontWeight: 800, color: col.c }}>{col.l}</div><div style={{ fontSize: 8, color: col.c + "88" }}>{t("colSub")}</div></div>)}
                      {visCols.map(col => <button key={col.t + "+"} onClick={() => setMatCounts(p => ({ ...p, [col.t]: p[col.t] + 1 }))} style={{ padding: "5px 0", border: "none", borderBottom: "1px solid rgba(0,0,0,.04)", borderRight: "1px solid rgba(60,50,30,.03)", background: col.c + "08", cursor: "pointer", fontSize: 14, fontWeight: 900, color: col.c, fontFamily: "inherit", textAlign: "center" }}>+</button>)}
                      {visCols.map(col => { const v = matCounts[col.t]; return (<div key={col.t + "b"} style={{ height: 120, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 2, flexWrap: "wrap", padding: "4px", borderRight: "1px solid rgba(60,50,30,.03)", background: "rgba(255,255,255,.4)" }}>{v > 0 && Array.from({ length: Math.min(v, 9) }, (_, i) => <BlockSVG key={i} type={col.t} size={col.t === "ones" ? 1.2 : 0.22} colorBlind={colorBlind} />)}{v === 0 && <span style={{ fontSize: 18, color: "#e8dfd0" }}>—</span>}</div>); })}
                      {visCols.map(col => { const v = matCounts[col.t]; return <button key={col.t + "-"} onClick={() => setMatCounts(p => ({ ...p, [col.t]: Math.max(0, p[col.t] - 1) }))} disabled={v < 1} style={{ padding: "5px 0", border: "none", borderTop: "1px solid rgba(0,0,0,.04)", borderBottom: "1px solid rgba(0,0,0,.06)", borderRight: "1px solid rgba(60,50,30,.03)", background: v > 0 ? col.c + "08" : "transparent", cursor: v > 0 ? "pointer" : "default", fontSize: 14, fontWeight: 900, color: v > 0 ? col.c : "#ddd", fontFamily: "inherit", textAlign: "center" }}>−</button>; })}
                      {visCols.map(col => <div key={col.t + "n"} style={{ textAlign: "center", padding: "4px 0", fontSize: 22, fontWeight: 900, color: col.c, borderRight: "1px solid rgba(60,50,30,.03)" }}>{matCounts[col.t]}</div>)}
                    </div>
                    {(() => {
                      const mtv = matCounts.ones + matCounts.tens * 10 + matCounts.huns * 100 + matCounts.ths * 1000;
                      const mOk = mtv > 0 ? readNum(mtv) : "";
                      return (
                        <div style={{ borderTop: "2px solid rgba(60,50,30,.06)", padding: "8px 12px", background: "rgba(60,50,30,.01)" }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: "#b5a990", minWidth: 52 }}>{t("total")}</span>
                            <span style={{ fontSize: 24, fontWeight: 900, color: PALETTE.accentD }}>{mtv || "—"}</span>
                          </div>
                          {mOk && <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}><span style={{ fontSize: 10, fontWeight: 700, color: "#b5a990", minWidth: 52 }}>{t("reading")}</span><span style={{ fontSize: 13, fontWeight: 900, color: "#6d28d9", fontStyle: "italic" }}>{mOk}</span></div>}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Bloklar */}
              {items.map(it => renderBlock(it))}
            </div>

            {/* Silme Alanı */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 38, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: overTrash ? "rgba(239,68,68,.12)" : itemDrag ? "rgba(0,0,0,.02)" : "transparent", borderTop: overTrash ? "2px solid rgba(239,68,68,.4)" : "1px solid rgba(0,0,0,.04)", zIndex: 20, transition: "all .2s" }}>
              <span aria-hidden style={{ fontSize: overTrash ? 16 : 12 }}>{overTrash ? "🗑️" : "🗑"}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: overTrash ? "#ef4444" : "#ddd" }}>{overTrash ? "Bırak → Sil" : "Silme Alanı"}</span>
            </div>

            {items.length === 0 && !showMat && !showTablet && !showDecomp && strokes.length === 0 && (
              <div aria-hidden style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none", animation: "fadeIn .8s" }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "rgba(60,50,30,.14)", marginBottom: 4 }}>{t("emptyLine1")}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(60,50,30,.08)" }}>{t("emptyLine2")}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(60,50,30,.06)", marginTop: 4 }}>{t("emptyLine3")}</div>
              </div>
            )}

            {dragFromSidebar && dropHighlight && (
              <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0, border: "3px dashed rgba(245,158,11,.45)", borderRadius: 4, pointerEvents: "none" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: PALETTE.accentL, padding: "8px 20px", borderRadius: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "rgba(245,158,11,.7)" }}>📥 Buraya bırak</span>
                </div>
              </div>
            )}

            {dragFromSidebar && <div aria-hidden style={{ position: "fixed", left: dragPos.x - 16, top: dragPos.y - 16, zIndex: 9999, pointerEvents: "none", opacity: .9, filter: "drop-shadow(0 6px 12px rgba(60,50,30,.2))", animation: "blockIn .15s" }}><BlockSVG type={dragFromSidebar.t} size={0.45} colorBlind={colorBlind} /></div>}
          </div>
        </main>
      </div>

      {/* ══ ALT BAR ══ */}
      <div style={{ height: 46, minHeight: 46, background: `linear-gradient(180deg,${PALETTE.side},#ede5d0)`, borderTop: "1px solid rgba(60,50,30,.07)", display: "flex", alignItems: "center", padding: "0 10px", gap: 4 }}>
        <div role="group" style={{ display: "flex", gap: 1, background: "rgba(255,255,255,.55)", borderRadius: 7, padding: 2 }}>
          {[["▫", "plain"], ["▦", "grid"], ["⋯", "dot"]].map(([ic, tp]) => (
            <button key={tp} onClick={() => setBgType(tp)} style={{ width: 26, height: 26, borderRadius: 5, border: "none", background: bgType === tp ? PALETTE.accent : "transparent", cursor: "pointer", fontSize: 11, color: bgType === tp ? "#fff" : "#aaa", display: "flex", alignItems: "center", justifyContent: "center" }}>{ic}</button>
          ))}
        </div>
        <div aria-hidden style={{ width: 1, height: 18, background: "rgba(60,50,30,.08)" }} />
        <div role="group" style={{ display: "flex", gap: 1, alignItems: "center", background: "rgba(255,255,255,.55)", borderRadius: 7, padding: "2px 4px" }}>
          <button onClick={() => setZoom(z => Math.max(.5, +(z - .1).toFixed(1)))} style={{ width: 22, height: 22, border: "none", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 900, color: "#888" }}>−</button>
          <span style={{ fontSize: 10, fontWeight: 700, color: PALETTE.accentD, minWidth: 32, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, +(z + .1).toFixed(1)))} style={{ width: 22, height: 22, border: "none", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 900, color: "#888" }}>+</button>
        </div>
        <button onClick={toggleFullscreen} style={{ width: 28, height: 28, borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, background: isFullscreen ? PALETTE.accentL : "rgba(255,255,255,.55)", color: isFullscreen ? PALETTE.accentD : "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>{isFullscreen ? "⊡" : "⊞"}</button>
        <div aria-hidden style={{ width: 1, height: 18, background: "rgba(60,50,30,.08)" }} />
        {SPEECH_SUPPORTED && <button onClick={toggleVoice} style={{ width: 28, height: 28, borderRadius: 7, border: "none", cursor: "pointer", fontSize: 14, background: voiceActive ? "rgba(239,68,68,.12)" : "rgba(255,255,255,.55)", color: voiceActive ? "#ef4444" : "#888", display: "flex", alignItems: "center", justifyContent: "center", animation: voiceActive ? "micPulse 1.5s infinite" : "none" }}>{voiceActive ? "🔴" : "🎙️"}</button>}
        <button onClick={() => setShowRecPanel(p => !p)} style={{ width: 28, height: 28, borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, background: recording ? "rgba(239,68,68,.12)" : "rgba(255,255,255,.55)", color: recording ? "#ef4444" : "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>{recording ? "⏹" : "⏺"}</button>
        <button onClick={() => setShowTeacher(true)} style={{ width: 28, height: 28, borderRadius: 7, border: "none", cursor: "pointer", fontSize: 13, background: "rgba(255,255,255,.55)", color: "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>📊</button>
        <button onClick={() => setShowHelp(true)} style={{ width: 28, height: 28, borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, background: "rgba(255,255,255,.55)", color: "#888", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>?</button>
        <button onClick={() => setShowAbout(true)} style={{ width: 28, height: 28, borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12, background: "rgba(255,255,255,.55)", color: "#888", display: "flex", alignItems: "center", justifyContent: "center" }}>ℹ</button>
        <div style={{ flex: 1 }} />
        {(() => {
          const curIdx = pages.findIndex(p => p.id === currentPageId);
          const prevPg = pages[curIdx - 1]; const nextPg = pages[curIdx + 1];
          return (
            <div role="group" style={{ display: "flex", alignItems: "center", gap: 2, background: "rgba(255,255,255,.6)", borderRadius: 8, padding: "2px", border: "1px solid rgba(60,50,30,.06)" }}>
              <button onClick={() => prevPg && dispatch({ type: "SWITCH_PAGE", pid: prevPg.id })} disabled={!prevPg} style={{ width: 26, height: 26, borderRadius: 7, border: "none", cursor: prevPg ? "pointer" : "default", background: "transparent", fontSize: 14, color: prevPg ? "#888" : "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
              <div style={{ minWidth: 44, textAlign: "center", fontSize: 11, fontWeight: 800, color: PALETTE.accentD, padding: "2px 4px", background: PALETTE.accentL, borderRadius: 5 }}>{curIdx + 1} / {pages.length}</div>
              <button onClick={() => nextPg && dispatch({ type: "SWITCH_PAGE", pid: nextPg.id })} disabled={!nextPg} style={{ width: 26, height: 26, borderRadius: 7, border: "none", cursor: nextPg ? "pointer" : "default", background: "transparent", fontSize: 14, color: nextPg ? "#888" : "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
              <button onClick={() => dispatch({ type: "ADD_PAGE", id: Math.max(...pages.map(p => p.id)) + 1 })} style={{ width: 26, height: 26, borderRadius: 7, border: "none", cursor: "pointer", background: "transparent", fontSize: 15, fontWeight: 700, color: "#aaa", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>
          );
        })()}
      </div>

      {/* ══ MODALLer ══ */}
      {pendingActivity && (
        <ModalBackdrop onClose={() => setPendingActivity(null)}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }} aria-hidden>{pendingActivity.i}</div>
            <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 6 }}>{pendingActivity.n}</div>
            <div style={{ fontSize: 13, marginBottom: 8, color: "#555", lineHeight: 1.6 }}>{pendingActivity.d}</div>
            <button onClick={() => { runSetup(pendingActivity); setPendingActivity(null); }} style={{ padding: "10px 28px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${PALETTE.accent},${PALETTE.accentD})`, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", width: "100%" }}>Başla ▸</button>
          </div>
        </ModalBackdrop>
      )}

      {showHelp && (
        <ModalBackdrop onClose={() => setShowHelp(false)}>
          <div style={{ fontSize: 18, fontWeight: 900, color: PALETTE.text, marginBottom: 12 }}>{t("helpTitle")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px 12px", fontSize: 12, lineHeight: 1.6, color: "#555", marginBottom: 12 }}>
            <strong>Q W E R</strong><div>Birlik / Onluk / Yüzlük / Binlik ekle</div>
            <strong>G</strong><div>Seçili bloğu grupla</div>
            <strong>B</strong><div>Seçili bloğu çöz</div>
            <strong>S</strong><div>Toplam değeri seslendir</div>
            <strong>Del</strong><div>Seçili bloğu sil</div>
            <strong>Ctrl+Z/Y</strong><div>Geri / İleri al</div>
          </div>
          <button onClick={() => setShowHelp(false)} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: PALETTE.accent, color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>{t("ok")}</button>
        </ModalBackdrop>
      )}

      {showTeacher && (
        <ModalBackdrop onClose={() => setShowTeacher(false)}>
          <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 12 }}>{t("reportTitle")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[{ label: t("totalQ"), val: recentQuiz.length, color: PALETTE.huns }, { label: t("correctQ"), val: correctCount, color: "#22c55e" }, { label: t("wrongQ"), val: wrongCount, color: "#ef4444" }, { label: t("sessionMin"), val: Math.floor((Date.now() - sessionStart) / 60000), color: PALETTE.accent }].map(m => (
              <div key={m.label} style={{ background: "rgba(0,0,0,.03)", borderRadius: 10, padding: "10px", textAlign: "center" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: m.color }}>{m.val}</div>
                <div style={{ fontSize: 10, color: "#b5a990", marginTop: 2 }}>{m.label}</div>
              </div>
            ))}
          </div>
          {bloomStats.length > 0 && bloomStats.map(b => (
            <div key={b.level} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#888", width: 80 }}>{b.label}</div>
              <div style={{ flex: 1, height: 16, background: "rgba(0,0,0,.06)", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${b.total > 0 ? Math.round(b.correct / b.total * 100) : 0}%`, background: b.correct / b.total >= .7 ? "#22c55e" : "#f59e0b", borderRadius: 8 }} />
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#888", width: 40, textAlign: "right" }}>{b.correct}/{b.total}</div>
            </div>
          ))}
          <button onClick={() => setShowTeacher(false)} style={{ width: "100%", marginTop: 8, padding: "10px", borderRadius: 10, border: "none", background: PALETTE.accent, color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>{t("close")}</button>
        </ModalBackdrop>
      )}

      {showAbout && (
        <ModalBackdrop onClose={() => setShowAbout(false)}>
          <div style={{ textAlign: "center" }}>
            <span aria-hidden style={{ fontSize: 48 }}>📐</span>
            <div style={{ fontSize: 22, fontWeight: 900, marginTop: 8, color: PALETTE.text }}>DokunSay</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: PALETTE.accent, marginBottom: 14 }}>Basamak Değeri v3.0</div>
            <div style={{ fontSize: 12, color: "#777", lineHeight: 1.8, marginBottom: 12 }}>Orantılı onluk bloklar ile basamak değeri kavramını somut olarak keşfedin.</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center", marginBottom: 14 }}>
              {["Orantılı Bloklar", "Grupla/Çöz", "Basamak Tablosu", "Türkçe TTS", "Renk Körü Modu", "Bloom Taksonomisi", "Adaptif Quiz"].map(f => (
                <span key={f} style={{ padding: "3px 8px", borderRadius: 6, background: PALETTE.accentL, fontSize: 10, fontWeight: 700, color: PALETTE.accentD }}>{f}</span>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#b5a990" }}>{t("author")}</div>
            <div style={{ fontSize: 10, color: "#ccc" }}>{t("version")}</div>
            <button onClick={() => setShowAbout(false)} style={{ marginTop: 14, width: "100%", padding: "10px", borderRadius: 10, border: "none", background: PALETTE.accent, color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>{t("close")}</button>
          </div>
        </ModalBackdrop>
      )}

      {/* Voice Overlay */}
      {voiceActive && (
        <div aria-live="assertive" style={{ position: "fixed", bottom: 60, left: "50%", transform: "translateX(-50%)", zIndex: 9998, background: "rgba(15,10,5,.92)", backdropFilter: "blur(16px)", borderRadius: 20, padding: "14px 24px", minWidth: 320, border: "2px solid rgba(239,68,68,.5)", boxShadow: "0 8px 32px rgba(0,0,0,.4)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "slideDown .3s" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 24 }}>
            {[0.4, 0.7, 1, 0.8, 0.5, 0.9, 0.6, 1, 0.7, 0.4].map((h, i) => <div key={i} style={{ width: 4, borderRadius: 2, background: "#ef4444", height: 24 * h, animation: `wavebar 0.8s ease-in-out infinite`, animationDelay: `${i * 0.08}s`, opacity: 0.8 }} />)}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,.5)" }}>SES KOMUTU DİNLENİYOR…</div>
          {voiceTranscript && <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", textAlign: "center", borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 8, width: "100%" }}>"{voiceTranscript}"</div>}
          <button onClick={stopVoice} style={{ padding: "6px 20px", borderRadius: 10, border: "none", background: "rgba(239,68,68,.3)", color: "#fca5a5", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>■ Durdur</button>
        </div>
      )}

      {/* Kayıt Paneli */}
      {showRecPanel && (
        <div style={{ position: "fixed", right: 12, top: 60, zIndex: 9000, background: "rgba(255,253,247,.97)", backdropFilter: "blur(20px)", borderRadius: 16, border: "1.5px solid rgba(60,50,30,.08)", boxShadow: "0 8px 40px rgba(0,0,0,.15)", width: 260, animation: "slideDown .25s" }}>
          <div style={{ padding: "10px 14px", borderBottom: "1px solid rgba(60,50,30,.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: PALETTE.text }}>⏺ Kayıt Araçları</div>
            <button onClick={() => setShowRecPanel(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#ccc" }}>×</button>
          </div>
          <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
            {!recording ? <button onClick={startScreenRecord} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#ef4444,#b91c1c)", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>⏺ Kaydı Başlat</button>
              : <button onClick={stopScreenRecord} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>⏹ Durdur ({Math.floor(recSeconds / 60)}:{String(recSeconds % 60).padStart(2, "0")})</button>}
            <button onClick={takeSnapshot} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${PALETTE.huns},${PALETTE.hunsB})`, color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>📸 PNG İndir</button>
            <button onClick={exportSession} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: `linear-gradient(135deg,${PALETTE.ths},${PALETTE.thsB})`, color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>💾 JSON Dışa Aktar</button>
          </div>
        </div>
      )}

      {voiceError && (
        <div role="alert" style={{ position: "fixed", bottom: 60, left: "50%", transform: "translateX(-50%)", zIndex: 9998, background: "rgba(220,38,38,.9)", borderRadius: 14, padding: "10px 20px", color: "#fff", fontSize: 13, fontWeight: 700, display: "flex", gap: 10, alignItems: "center" }}>
          ⚠ {voiceError}
          <button onClick={() => setVoiceError("")} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 16 }}>×</button>
        </div>
      )}
    </div>
  );
}
