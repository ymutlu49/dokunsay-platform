import React, { useState, useEffect } from "react";
import { A11yContext } from "./contexts/A11yContext.jsx";
import { stopSpeaking } from "./utils/speech.js";
import { loadCurrentStudent } from "./utils/storage.js";
import { CURCIO_LEVELS, LANGS, TRANSLATIONS, P } from "./data/constants.js";
import { loadTestResult, saveTestResult } from "./data/diagnostic.js";
import { ErrorBoundary } from "./components/common.jsx";
import { OnboardingTour, StudentProfileSetup, DiagnosticTest } from "./components/dialogs.jsx";
import { ModulePlaceholder } from "./modules/educational.jsx";
import { LangSwitcher } from "@shared/LangSwitcher.jsx";

export default function App() {
  // ─── STATE ─────────────────────────────────────────────────────────
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("dv_lang") || "tr"; }
    catch (e) { return "tr"; }
  });
  useEffect(() => {
    try { localStorage.setItem("dv_lang", lang); } catch (e) {}
  }, [lang]);

  const [sideTab, setSideTab] = useState("read");

  // Curcio seviye (L0-L3)
  const [curcioLevel, setCurcioLevel] = useState(0);

  // İlerleme takibi — her seviye için ayrı
  const [levelProgress, setLevelProgress] = useState(() => {
    try {
      const s = localStorage.getItem("dv_progress");
      return s ? JSON.parse(s) : { 0: { correct: 0, attempted: 0, acts: [] }, 1: { correct: 0, attempted: 0, acts: [] }, 2: { correct: 0, attempted: 0, acts: [] }, 3: { correct: 0, attempted: 0, acts: [] } };
    } catch (e) {
      return { 0: { correct: 0, attempted: 0, acts: [] }, 1: { correct: 0, attempted: 0, acts: [] }, 2: { correct: 0, attempted: 0, acts: [] }, 3: { correct: 0, attempted: 0, acts: [] } };
    }
  });
  useEffect(() => {
    try { localStorage.setItem("dv_progress", JSON.stringify(levelProgress)); } catch (e) {}
  }, [levelProgress]);

  // Toplam puan
  const [score, setScore] = useState(() => {
    try { return parseInt(localStorage.getItem("dv_score") || "0", 10); }
    catch (e) { return 0; }
  });
  useEffect(() => {
    try { localStorage.setItem("dv_score", String(score)); } catch (e) {}
  }, [score]);

  // Erişilebilirlik modları
  const [dyscalculia, setDyscalculia] = useState(() => {
    try { return localStorage.getItem("dv_dys") === "1"; } catch (e) { return false; }
  });
  const [colorblind, setColorblind] = useState(() => {
    try { return localStorage.getItem("dv_cb") === "1"; } catch (e) { return false; }
  });
  const [ttsOn, setTtsOn] = useState(() => {
    try { return localStorage.getItem("dv_tts") === "1"; } catch (e) { return false; }
  });
  const [noticeWonderOn, setNoticeWonderOn] = useState(() => {
    try {
      const v = localStorage.getItem("dv_nw");
      return v === null ? true : v === "1"; // varsayılan açık — pedagojik değer önceliği
    } catch (e) { return true; }
  });
  useEffect(() => { try { localStorage.setItem("dv_dys", dyscalculia ? "1" : "0"); } catch (e) {} }, [dyscalculia]);
  useEffect(() => { try { localStorage.setItem("dv_cb", colorblind ? "1" : "0"); } catch (e) {} }, [colorblind]);
  useEffect(() => { try { localStorage.setItem("dv_tts", ttsOn ? "1" : "0"); } catch (e) {} }, [ttsOn]);
  useEffect(() => { try { localStorage.setItem("dv_nw", noticeWonderOn ? "1" : "0"); } catch (e) {} }, [noticeWonderOn]);

  // App-level fs (Provider'dan önce — burada useFS hook'u kullanamayız,
  // çünkü App kendisi Provider'ı kuruyor; dyscalculia state'inden direkt hesapla)
  const _fsScale = dyscalculia ? 1.35 : 1;
  const fs = (n) => Math.round(n * _fsScale * 10) / 10;

  // Sidebar grup açık/kapalı durumu — varsayılan hepsi açık
  const [collapsedGroups, setCollapsedGroups] = useState(() => {
    try {
      const saved = localStorage.getItem("dv_collapsed_groups");
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });
  useEffect(() => {
    try { localStorage.setItem("dv_collapsed_groups", JSON.stringify(collapsedGroups)); } catch (e) {}
  }, [collapsedGroups]);

  // Onboarding: ilk kullanıcıya hoşgeldin turu
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return localStorage.getItem("dv_onboarded") !== "1"; } catch (e) { return false; }
  });
  function finishOnboarding() {
    try { localStorage.setItem("dv_onboarded", "1"); } catch (e) {}
    setShowOnboarding(false);
  }
  function resetOnboarding() {
    try { localStorage.removeItem("dv_onboarded"); } catch (e) {}
    setShowOnboarding(true);
  }

  // Mobil algılama
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 720);
  useEffect(() => {
    function onResize() { setIsMobile(window.innerWidth < 720); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Modül rehber kartları: her modülün ilk açılışında göster
  // dv_intro_<tabId> = "1" ise artık gösterme
  function isIntroShown(tabId) {
    try { return localStorage.getItem(`dv_intro_${tabId}`) === "1"; } catch (e) { return false; }
  }
  function dismissIntro(tabId) {
    try { localStorage.setItem(`dv_intro_${tabId}`, "1"); } catch (e) {}
    // Force re-render by updating a dummy state
    setIntroDismissTick(t => t + 1);
  }
  const [introDismissTick, setIntroDismissTick] = useState(0);

  // Öğrenci profili (v0.13)
  // Uygulama açılışında profil modalı göstermiyoruz; varsayılan olarak
  // Ziyaretçi oturumu başlatılır. Kullanıcı istediği an "Profili değiştir"
  // butonuyla (öğretmen/ayar sekmesinden) profil kaydı açabilir.
  const [currentStudent, setCurrentStudent] = useState(() => (
    loadCurrentStudent() || { id: "guest", name: "Ziyaretçi", isGuest: true }
  ));
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  function openProfileSetup() {
    setShowProfileSetup(true);
  }
  function handleProfileSelect(student) {
    setCurrentStudent(student);
    setShowProfileSetup(false);
    // Ön test daha önce yapılmadıysa, onu teklif et
    if (student && !student.isGuest) {
      const tests = loadTestResult(student.id);
      if (!tests?.preTest) {
        setShowDiagnostic("pre");
      }
    }
  }

  // Teşhis testi (v0.14)
  // null = gösterme, "pre" = ön test, "post" = son test
  const [showDiagnostic, setShowDiagnostic] = useState(null);
  function handleDiagnosticFinish(answers, recommendedLevel) {
    if (currentStudent) {
      saveTestResult(currentStudent.id, showDiagnostic, answers);
    }
    setShowDiagnostic(null);
    // Ön test ise önerilen seviyeye yerleştir
    if (showDiagnostic === "pre" && recommendedLevel != null) {
      setCurcioLevel(recommendedLevel);
    }
  }
  function startPostTest() {
    setShowDiagnostic("post");
  }

  // ─── YARDIMCI FONKSİYONLAR ─────────────────────────────────────────
  const t = (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS.tr[key] || key;
  const tt = (obj) => (obj && (obj[lang] || obj.tr)) || "";

  function addScore(n) { setScore(s => s + n); }

  function isLevelUnlocked(lv) {
    if (lv === 0) return true;
    const prev = levelProgress[lv - 1];
    if (!prev) return false;
    const crit = CURCIO_LEVELS[lv - 1].passCriteria;
    return prev.correct >= crit.minCorrect && prev.acts.length >= crit.minActivities;
  }

  function recordLevelAnswer(lv, actId, isCorrect) {
    setLevelProgress(p => {
      const cur = p[lv] || { correct: 0, attempted: 0, acts: [] };
      const acts = cur.acts.includes(actId) ? cur.acts : [...cur.acts, actId];
      return {
        ...p,
        [lv]: {
          correct: cur.correct + (isCorrect ? 1 : 0),
          attempted: cur.attempted + 1,
          acts,
        }
      };
    });
  }

  // ─── SEKME İKONLARI (SVG) ──────────────────────────────────────────
  // Her sekmenin inline SVG ikonu — emoji bağımlılığı yok
  const TAB_ICONS = {
    read: (
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <line x1="7" y1="9" x2="17" y2="9"/>
        <line x1="7" y1="13" x2="17" y2="13"/>
        <line x1="7" y1="17" x2="13" y2="17"/>
      </svg>
    ),
    deceive: (
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7"/>
        <line x1="16" y1="16" x2="21" y2="21"/>
        <line x1="8" y1="11" x2="14" y2="11"/>
      </svg>
    ),
    create: (
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="20" x2="4" y2="4"/>
        <line x1="4" y1="20" x2="20" y2="20"/>
        <rect x="7" y="12" width="3" height="8"/>
        <rect x="12" y="8" width="3" height="12"/>
        <rect x="17" y="14" width="3" height="6"/>
      </svg>
    ),
    center: (
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"/>
        <circle cx="7" cy="12" r="2"/>
        <circle cx="12" cy="12" r="2"/>
        <circle cx="17" cy="12" r="2"/>
        <line x1="12" y1="6" x2="12" y2="18"/>
      </svg>
    ),
    relate: (
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="20" x2="4" y2="4"/>
        <line x1="4" y1="20" x2="20" y2="20"/>
        <circle cx="8" cy="16" r="1.5" fill="currentColor"/>
        <circle cx="11" cy="13" r="1.5" fill="currentColor"/>
        <circle cx="14" cy="10" r="1.5" fill="currentColor"/>
        <circle cx="17" cy="7" r="1.5" fill="currentColor"/>
      </svg>
    ),
    recognize: (
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="7"/>
        <line x1="21" y1="21" x2="16.5" y2="16.5"/>
        <path d="M 8 11 L 10 13 L 14 9"/>
      </svg>
    ),
    world: (
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <ellipse cx="12" cy="12" rx="4.5" ry="9"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
      </svg>
    ),
    probability: (
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2"/>
        <circle cx="9" cy="9" r="1" fill="currentColor"/>
        <circle cx="15" cy="15" r="1" fill="currentColor"/>
        <circle cx="15" cy="9" r="1" fill="currentColor"/>
        <circle cx="9" cy="15" r="1" fill="currentColor"/>
      </svg>
    ),
    collect: (
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="18" rx="2"/>
        <line x1="8" y1="9" x2="16" y2="9"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="12" y2="17"/>
        <path d="M 9 2 L 9 5 L 15 5 L 15 2 Z"/>
      </svg>
    ),
    teach: (
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4"/>
        <path d="M 4 21 C 4 16 8 14 12 14 C 16 14 20 16 20 21"/>
      </svg>
    ),
    set: (
      <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M 19.4 15 A 2 2 0 0 0 19.4 13 L 21 11.5 L 19 8 L 17 9 A 2 2 0 0 0 15 8 L 14.5 6 L 10.5 6 L 10 8 A 2 2 0 0 0 8 9 L 6 8 L 4 11.5 L 5.6 13 A 2 2 0 0 0 5.6 15 L 4 16.5 L 6 20 L 8 19 A 2 2 0 0 0 10 20 L 10.5 22 L 14.5 22 L 15 20 A 2 2 0 0 0 17 19 L 19 20 L 21 16.5 Z"/>
      </svg>
    ),
  };

  // ─── SEKME TANIMLARI ───────────────────────────────────────────────
  // ─── SEKME TANIMLARI ───────────────────────────────────────────────
  // Gruplar: "discover" (kolay başlangıç) / "tools" (araçlar) / "manage" (öğretmen + ayarlar)
  const TABS = [
    { id: "read",        group: "discover" },  // Grafik okuma — her şey buradan başlar
    { id: "deceive",     group: "discover" },  // Yanıltma — temel eleştirel okuma
    { id: "world",       group: "discover" },  // Gerçek dünya grafikleri
    { id: "recognize",   group: "discover" },  // Grafik türü tanıma
    { id: "create",      group: "tools" },     // Kendi grafiğini oluştur
    { id: "center",      group: "tools" },     // Merkezi eğilim laboratuvarı
    { id: "relate",      group: "tools" },     // Saçılım / ilişki
    { id: "probability", group: "tools" },     // Olasılık / sampler
    { id: "collect",     group: "tools" },     // Veri toplayıcı
    { id: "teach",       group: "manage" },    // Öğretmen panosu
    { id: "set",         group: "manage" },    // Ayarlar
  ];

  const activeLevelData = CURCIO_LEVELS[curcioLevel];

  // Dil/TTS değişince konuşan sesi durdur
  useEffect(() => { stopSpeaking(); }, [lang, ttsOn]);

  // Erişilebilirlik context değeri
  const a11yValue = {
    fsScale: dyscalculia ? 1.35 : 1,
    ttsOn,
    lang,
    dyscalculia,
    currentStudent,
  };

  // ─── RENDER ────────────────────────────────────────────────────────
  return (
    <A11yContext.Provider value={a11yValue}>
    {/* Öğrenci profil modal'i — ilk açılışta veya istek üzerine */}
    {showProfileSetup && (
      <StudentProfileSetup
        lang={lang}
        onSelect={handleProfileSelect}
        onCancel={() => setShowProfileSetup(false)}
        allowSkip={!!currentStudent}
      />
    )}

    {/* Teşhis testi — ön test veya son test */}
    {showDiagnostic && !showProfileSetup && (
      <DiagnosticTest
        lang={lang}
        kind={showDiagnostic}
        studentName={currentStudent?.name}
        onFinish={handleDiagnosticFinish}
        onCancel={() => setShowDiagnostic(null)}
      />
    )}

    {/* Onboarding — ilk kullanıcıya hoşgeldin turu (profil seçiminden sonra) */}
    {showOnboarding && !showProfileSetup && !showDiagnostic && <OnboardingTour lang={lang} onFinish={finishOnboarding}/>}

    <div style={{
      height: "100vh", width: "100vw",
      display: "flex", flexDirection: isMobile ? "column" : "column",
      fontFamily: "system-ui, -apple-system, sans-serif",
      background: P.bg,
      color: P.text,
      overflow: "hidden",
    }}>

      {/* ════════ HEADER — Curcio seviye şeridi. DokunSay logo/başlık AppShell'de. ════════ */}
      <header style={{
        height: 50, minHeight: 50,
        background: P.header,
        display: "flex", alignItems: "center",
        padding: "0 14px", gap: 12,
        boxShadow: "0 2px 16px rgba(15,23,42,.35)",
        zIndex: 20,
      }}>
        <LangSwitcher lang={lang} setLang={setLang} langs={Object.keys(LANGS)} />

        <div style={{ flex: 1 }}/>

        {/* Curcio seviye butonları */}
        <div style={{ display: "flex", gap: 3 }}>
          {CURCIO_LEVELS.map(lv => {
            const unlocked = isLevelUnlocked(lv.id);
            const prog = levelProgress[lv.id] || { correct: 0, acts: [] };
            const done = prog.correct >= lv.passCriteria.minCorrect && prog.acts.length >= lv.passCriteria.minActivities;
            return (
              <button
                key={lv.id}
                onClick={() => {
                  if (!unlocked) {
                    alert(lang === "ku"
                      ? `Ev ast girtî ye. ${t("unlockHint")}.`
                      : lang === "en"
                      ? `${t("lockedLevel")}. ${t("unlockHint")}.`
                      : `${t("lockedLevel")}. ${t("unlockHint")}.`);
                    return;
                  }
                  setCurcioLevel(lv.id);
                  setSideTab("read");
                }}
                aria-pressed={curcioLevel === lv.id}
                title={tt(lv.name)}
                style={{
                  padding: "3px 9px", borderRadius: 7, border: "none",
                  cursor: unlocked ? "pointer" : "not-allowed", fontFamily: "inherit",
                  background: curcioLevel === lv.id ? lv.color + "33" : "rgba(255,255,255,.07)",
                  color: curcioLevel === lv.id ? lv.color : (unlocked ? "rgba(255,255,255,.45)" : "rgba(255,255,255,.22)"),
                  fontSize: fs(10), fontWeight: curcioLevel === lv.id ? 800 : 600,
                  opacity: unlocked ? 1 : 0.55,
                  display: "flex", alignItems: "center", gap: 3,
                }}>
                {!unlocked && <span style={{ fontSize: fs(8) }}>🔒</span>}
                {done && unlocked && <span style={{ fontSize: fs(8), color: "#10b981" }}>✓</span>}
                <span>L{lv.id} {tt(lv.shortName)}</span>
              </button>
            );
          })}
        </div>

        {/* Öğrenci adı rozeti (mevcut profil) — tıklayınca profil değiştir */}
        {currentStudent && (
          <button
            onClick={openProfileSetup}
            title={lang === "ku" ? "Profîl biguherîne" : lang === "en" ? "Change profile" : "Profili değiştir"}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: fs(10.5), fontWeight: 700,
              color: "rgba(255,255,255,.85)",
              background: "rgba(139,92,246,.25)",
              border: "1px solid rgba(139,92,246,.4)",
              padding: "3px 10px", borderRadius: 12,
              cursor: "pointer", fontFamily: "inherit",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,.4)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(139,92,246,.25)"}
          >
            <span style={{
              width: fs(18), height: fs(18), borderRadius: "50%",
              background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
              color: "#fff", fontSize: fs(9.5), fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {(currentStudent.name || "?").substring(0, 1).toUpperCase()}
            </span>
            <span>{currentStudent.name}</span>
          </button>
        )}

        {/* Puan rozeti */}
        <div style={{
          fontSize: fs(11), fontWeight: 800, color: "#fbbf24",
          background: "rgba(251,191,36,.15)",
          padding: "3px 9px", borderRadius: 6,
        }}>
          {t("score")}: {score}
        </div>
      </header>

      {/* ════════ ANA İÇERİK: SİDEBAR + İÇERİK ════════ */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        overflow: "hidden",
      }}>

        {/* ─── SİDEBAR (SEKMELER) ─── */}
        <aside style={{
          width: isMobile ? "100%" : (dyscalculia ? 260 : 220),
          minWidth: isMobile ? "auto" : (dyscalculia ? 260 : 220),
          maxHeight: isMobile ? 180 : "none",
          background: "#fff",
          borderRight: isMobile ? "none" : "1px solid rgba(30,41,59,.08)",
          borderBottom: isMobile ? "1px solid rgba(30,41,59,.1)" : "none",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Sekme listesi — 3 gruba ayrılmış (mobilde yatay scrollable) */}
          <nav style={{
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            padding: 8, gap: isMobile ? 6 : 2,
            flexShrink: 0,
            borderBottom: isMobile ? "none" : "1px solid rgba(30,41,59,.08)",
            overflowY: isMobile ? "hidden" : "auto",
            overflowX: isMobile ? "auto" : "hidden",
            maxHeight: isMobile ? "none" : "calc(100vh - 200px)",
          }}>
            {["discover", "tools", "manage"].map(groupId => {
              const groupTabs = TABS.filter(tab => tab.group === groupId);
              const isCollapsed = collapsedGroups[groupId];
              const groupName = t("tabGroups")?.[groupId] || groupId;
              const groupDesc = t("tabGroupDesc")?.[groupId] || "";
              const groupColor = groupId === "discover" ? "#3b82f6"
                : groupId === "tools" ? "#10b981"
                : "#8b5cf6";
              return (
                <div key={groupId} style={{
                  marginBottom: isMobile ? 0 : 6,
                  display: isMobile ? "flex" : "block",
                  gap: isMobile ? 4 : 0,
                  flexShrink: 0,
                }}>
                  {/* Grup başlığı — tıklayınca açıp kapanır (mobilde gizli) */}
                  {!isMobile && <button
                    onClick={() => setCollapsedGroups(g => ({ ...g, [groupId]: !isCollapsed }))}
                    aria-expanded={!isCollapsed}
                    style={{
                      width: "100%",
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "5px 8px",
                      borderRadius: 5, border: "none",
                      background: "transparent",
                      color: groupColor,
                      cursor: "pointer", fontFamily: "inherit",
                      fontSize: fs(10), fontWeight: 800,
                      textAlign: "left",
                      textTransform: "uppercase",
                      letterSpacing: .4,
                      marginBottom: 2,
                    }}>
                    <span style={{
                      display: "inline-block",
                      transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                      transition: "transform .2s",
                      fontSize: fs(9),
                    }}>▼</span>
                    <span>{groupName}</span>
                    <span style={{
                      marginLeft: "auto",
                      fontSize: fs(8), fontWeight: 600,
                      color: P.textSoft, opacity: 0.6,
                    }}>{groupTabs.length}</span>
                  </button>}

                  {/* Grup sekmeleri — mobilde daima göster, desktop'ta collapse edilebilir */}
                  {(isMobile || !isCollapsed) && (
                    <div style={{
                      display: "flex",
                      flexDirection: isMobile ? "row" : "column",
                      gap: isMobile ? 4 : 1,
                      paddingLeft: 0,
                    }}>
                      {groupTabs.map(tab => {
                        const isActive = sideTab === tab.id;
                        const label = t("sideTabs")[tab.id] || tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setSideTab(tab.id)}
                            aria-selected={isActive}
                            style={{
                              display: "flex", alignItems: "center",
                              gap: isMobile ? 4 : 8,
                              padding: isMobile ? "6px 10px" : (dyscalculia ? "10px 12px" : "7px 10px"),
                              borderRadius: isMobile ? 15 : 7,
                              border: "none",
                              background: isActive ? P.accentL : (isMobile ? "#f1f5f9" : "transparent"),
                              color: isActive ? P.accentD : P.textSoft,
                              cursor: "pointer", fontFamily: "inherit",
                              fontSize: fs(isMobile ? 10 : (dyscalculia ? 13 : 11.5)),
                              fontWeight: isActive ? 800 : 600,
                              textAlign: "left",
                              transition: "all .12s",
                              borderLeft: (!isMobile && isActive) ? `3px solid ${groupColor}` : (isMobile ? "none" : "3px solid transparent"),
                              borderBottom: (isMobile && isActive) ? `2px solid ${groupColor}` : "none",
                              whiteSpace: "nowrap",
                              flexShrink: 0,
                            }}
                            onMouseEnter={e => !isActive && !isMobile && (e.currentTarget.style.background = "rgba(59,130,246,.05)")}
                            onMouseLeave={e => !isActive && !isMobile && (e.currentTarget.style.background = "transparent")}
                          >
                            <span style={{
                              display: "flex", alignItems: "center", justifyContent: "center",
                              width: fs(isMobile ? 14 : (dyscalculia ? 20 : 16)),
                              height: fs(isMobile ? 14 : (dyscalculia ? 20 : 16)),
                              color: isActive ? P.accent : P.textSoft,
                            }}>
                              {TAB_ICONS[tab.id]}
                            </span>
                            <span>{label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Alt: Seviye rehber kartı (küçük) — mobilde gizli */}
          {!isMobile && (
          <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
            <div style={{
              padding: "10px 11px", borderRadius: 9,
              background: activeLevelData.colorSoft,
              border: "1.5px solid " + activeLevelData.color + "60",
              marginBottom: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                <span style={{ fontSize: fs(15) }}>{activeLevelData.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: fs(11), fontWeight: 800, color: activeLevelData.color, lineHeight: 1.1 }}>
                    L{activeLevelData.id}: {tt(activeLevelData.name)}
                  </div>
                  <div style={{ fontSize: fs(8), color: P.textSoft, fontWeight: 600 }}>
                    {t("age")}: {activeLevelData.ageRange}
                  </div>
                </div>
              </div>

              {/* Canlı ilerleme */}
              {(() => {
                const prog = levelProgress[curcioLevel] || { correct: 0, acts: [] };
                const pct = Math.min(100, Math.round((prog.correct / activeLevelData.passCriteria.minCorrect) * 100));
                return (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontSize: fs(8), fontWeight: 700, color: activeLevelData.color }}>
                        {t("progress")}
                      </span>
                      <span style={{ fontSize: fs(8), fontWeight: 700, color: P.textSoft }}>
                        {prog.correct}/{activeLevelData.passCriteria.minCorrect} {t("correct")}
                      </span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "rgba(0,0,0,.08)", overflow: "hidden" }}>
                      <div style={{
                        width: pct + "%", height: "100%",
                        background: activeLevelData.color,
                        transition: "width .3s",
                      }}/>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Pedagojik referans kartı */}
            <div style={{
              padding: "7px 9px", borderRadius: 7,
              background: "rgba(59,130,246,.04)",
              fontSize: fs(9), color: P.textSoft,
              lineHeight: 1.55, fontStyle: "italic",
            }}>
              📖 {t("pedagogical")}:
              <br/>
              Curcio (1987), GAISE (2020), PPDAC (Wild & Pfannkuch 1999)
            </div>
          </div>
          )}
        </aside>

        {/* ─── ANA İÇERİK ALANI ─── */}
        <main style={{
          flex: 1, overflow: "auto",
          padding: dyscalculia ? 24 : 18,
          background: P.bg,
        }}>
          {/* ErrorBoundary — modül çökerse uygulama ayakta kalır
              key={sideTab}: sekme değişince boundary sıfırlanır */}
          <ErrorBoundary key={sideTab} lang={lang}>
            <ModulePlaceholder
              tabId={sideTab}
              lang={lang}
              t={t}
              tt={tt}
              level={curcioLevel}
              levelData={activeLevelData}
              dyscalculia={dyscalculia}
              setDyscalculia={setDyscalculia}
              colorblind={colorblind}
              setColorblind={setColorblind}
              ttsOn={ttsOn}
              setTtsOn={setTtsOn}
              noticeWonderOn={noticeWonderOn}
              setNoticeWonderOn={setNoticeWonderOn}
              addScore={addScore}
              recordLevelAnswer={recordLevelAnswer}
              isIntroShown={isIntroShown}
              dismissIntro={dismissIntro}
              introDismissTick={introDismissTick}
              resetOnboarding={resetOnboarding}
              openProfileSetup={openProfileSetup}
              currentStudent={currentStudent}
              startPostTest={startPostTest}
            />
          </ErrorBoundary>
        </main>
      </div>
    </div>
    </A11yContext.Provider>
  );
}
