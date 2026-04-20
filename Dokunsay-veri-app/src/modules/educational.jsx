import React, { useState, useEffect, useReducer, useRef, useMemo, memo } from "react";
import { useFS, useA11y } from "../contexts/A11yContext.jsx";
import { speak, stopSpeaking } from "../utils/speech.js";
import { numberToWords, formatBigNumber } from "../utils/numberFormat.js";
import { pearson, correlationLabel } from "../utils/correlation.js";
import { loadCurrentStudent, loadStudents, genStudentId } from "../utils/storage.js";
import { LEVEL_COLORS, CURCIO_LEVELS, GAISE_LEVELS, PPDAC_PHASES, MISCONCEPTIONS, P, TRANSLATIONS } from "../data/constants.js";
import { READ_ACTIVITIES, DECEPTION_CASES, REAL_DATASETS, SCATTER_DATASETS, GRAPH_ICONS, GRAPH_TYPES, SCENARIO_QUESTIONS, WORLD_ACTIVITIES, MODULE_INTROS } from "../data/activities.jsx";
import { loadTestResult, DIAGNOSTIC_QUESTIONS } from "../data/diagnostic.js";
import { BarChart, Pictograph, DataTable, LineChart, PieChart, ScatterPlot } from "../components/charts.jsx";
import { SpeakButton, LevelBadge, ModuleIntroCard, StatCard, TestResultRow, SettingToggle } from "../components/common.jsx";

export function NoticeWonderStage({ actId, lang, t, graph, onDone }) {
  const fs = useFS();
  const { currentStudent } = useA11y();
  // 3 aşama: notice → wonder → headline
  const [stage, setStage] = useState(0);
  // localStorage'dan önceki notları oku (varsa)
  const loadNote = (kind) => {
    try { return localStorage.getItem(`dv_obs_${actId}_${kind}`) || ""; }
    catch (e) { return ""; }
  };
  const [notice, setNotice] = useState(() => loadNote("notice"));
  const [wonder, setWonder] = useState(() => loadNote("wonder"));
  const [headline, setHeadline] = useState(() => loadNote("headline"));

  // Her aşamada kaydet (yazıldıkça)
  function saveNote(kind, value) {
    try {
      if (value.trim()) {
        localStorage.setItem(`dv_obs_${actId}_${kind}`, value);
        // Ayrıca master listede tut (öğretmen panosunda gösterilecek)
        const master = JSON.parse(localStorage.getItem("dv_obs_index") || "{}");
        master[actId] = master[actId] || { notice: "", wonder: "", headline: "", ts: Date.now() };
        master[actId][kind] = value;
        master[actId].ts = Date.now();
        // v0.13: öğrenci etiketi
        if (currentStudent) {
          master[actId].studentId = currentStudent.id;
          master[actId].studentName = currentStudent.name;
        }
        localStorage.setItem("dv_obs_index", JSON.stringify(master));
      }
    } catch (e) {}
  }

  const STAGES = [
    {
      key: "notice",
      title: t("whatNotice"),
      hint: t("whatNoticeHint"),
      icon: "👁️",
      color: "#3b82f6",
      value: notice,
      setter: setNotice,
      placeholder: lang === "ku" ? "Tiştê ku bala te kişand..." : lang === "en" ? "Something you notice..." : "Fark ettiğin bir şey...",
    },
    {
      key: "wonder",
      title: t("whatWonder"),
      hint: t("whatWonderHint"),
      icon: "💭",
      color: "#8b5cf6",
      value: wonder,
      setter: setWonder,
      placeholder: lang === "ku" ? "Pirsa ku li xewê te dike..." : lang === "en" ? "A question this raises..." : "Aklına gelen bir soru...",
    },
    {
      key: "headline",
      title: t("writeHeadline"),
      hint: t("writeHeadlineHint"),
      icon: "📰",
      color: "#f59e0b",
      value: headline,
      setter: setHeadline,
      placeholder: lang === "ku" ? "Sernavekî çarşeb..." : lang === "en" ? "A snappy headline..." : "Çarpıcı bir başlık...",
    },
  ];

  const cur = STAGES[stage];

  function advance(saveValue) {
    if (saveValue) saveNote(cur.key, cur.value);
    if (stage < STAGES.length - 1) {
      setStage(s => s + 1);
    } else {
      onDone();
    }
  }

  return (
    <div style={{
      padding: 20, borderRadius: 14,
      background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
      border: "2px solid " + P.accent + "40",
      marginBottom: 12,
    }}>
      {/* Üstte: Notice & Wonder başlık + pedagojik giriş */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `linear-gradient(135deg,${P.accent},${P.accentD})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: fs(16),
        }}>🔎</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: fs(13), fontWeight: 900, color: P.accentD }}>
            {t("nwTitle")}
          </div>
          <div style={{ fontSize: fs(9), color: P.textSoft, fontStyle: "italic" }}>
            📖 Barlow (2020) · NYTimes/ASA (2017–)
          </div>
        </div>
      </div>
      <p style={{ fontSize: fs(11), color: P.textSoft, lineHeight: 1.5, margin: "0 0 14px 0" }}>
        {t("nwIntro")}
      </p>

      {/* Aşama göstergesi (1/3, 2/3, 3/3) */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14 }}>
        {STAGES.map((s, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i < stage ? s.color : i === stage ? s.color : "rgba(30,41,59,.12)",
            opacity: i <= stage ? 1 : 0.4,
            transition: "all .2s",
          }}/>
        ))}
      </div>

      {/* Grafik — küçük önizleme (öğrenci aşağı kaydırmasın) */}
      {graph && (
        <div style={{
          padding: 10, background: "#fff", borderRadius: 9,
          marginBottom: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,.05)",
        }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {graph}
          </div>
        </div>
      )}

      {/* Mevcut aşama */}
      <div style={{
        padding: 14, borderRadius: 10,
        background: "#fff",
        border: "1.5px solid " + cur.color + "40",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: fs(18) }}>{cur.icon}</span>
          <div style={{ fontSize: fs(13), fontWeight: 800, color: cur.color, flex: 1 }}>
            {cur.title}
          </div>
          <SpeakButton text={cur.title + ". " + cur.hint} size="sm"/>
          <span style={{
            fontSize: fs(9), fontWeight: 700,
            color: P.textSoft, background: "rgba(30,41,59,.05)",
            padding: "2px 7px", borderRadius: 10,
          }}>
            {stage + 1}/3
          </span>
        </div>
        <div style={{ fontSize: fs(10), color: P.textSoft, marginBottom: 8, lineHeight: 1.5, fontStyle: "italic" }}>
          {cur.hint}
        </div>
        <textarea
          value={cur.value}
          onChange={e => cur.setter(e.target.value)}
          placeholder={cur.placeholder}
          rows={3}
          style={{
            width: "100%", padding: "10px 12px", borderRadius: 8,
            border: "1.5px solid rgba(30,41,59,.12)",
            fontSize: fs(12.5), fontFamily: "inherit", lineHeight: 1.5,
            outline: "none", boxSizing: "border-box", resize: "vertical",
          }}
          onFocus={e => e.target.style.borderColor = cur.color}
          onBlur={e => e.target.style.borderColor = "rgba(30,41,59,.12)"}
        />

        {/* Butonlar */}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={() => advance(false)} style={{
            padding: "8px 14px", borderRadius: 7,
            border: "1.5px solid rgba(30,41,59,.15)",
            background: "#fff", color: P.textSoft,
            cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(11), fontWeight: 700,
          }}>
            {t("skip")}
          </button>
          <div style={{ flex: 1 }}/>
          <button onClick={() => advance(true)} style={{
            padding: "9px 18px", borderRadius: 7, border: "none",
            background: cur.color, color: "#fff",
            cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(12), fontWeight: 800,
            boxShadow: "0 2px 8px " + cur.color + "40",
          }}>
            {stage < STAGES.length - 1 ? t("continueNext") : t("continueToQuestion")}
          </button>
        </div>

        {/* Önceki not (varsa göster) — ilk ziyaret değilse */}
        {cur.value && cur.value === loadNote(cur.key) && (
          <div style={{
            marginTop: 8, padding: "6px 10px", borderRadius: 6,
            background: "rgba(30,41,59,.03)",
            fontSize: fs(9), color: P.textSoft, fontStyle: "italic",
          }}>
            💾 {t("yourPrevNote")}
          </div>
        )}
      </div>

      {/* Atla tamamen */}
      <div style={{ marginTop: 10, textAlign: "center" }}>
        <button onClick={() => onDone()} style={{
          background: "transparent", border: "none",
          color: P.textSoft, fontSize: fs(10), fontFamily: "inherit",
          cursor: "pointer", fontStyle: "italic",
          textDecoration: "underline",
        }}>
          {lang === "ku" ? "Hemû qonaxan derbas bibe" : lang === "en" ? "Skip all stages" : "Tüm aşamaları atla"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GRAFİK OKUMA ETKİNLİKLERİ — 14 adet (L0:4, L1:4, L2:3, L3:3)
// Her etkinlik: {id, level, gaise, graphType, data, q, opts, correct, hint}

export function ReadModule({ lang, t, tt, level, levelData, colorblind, noticeWonderOn, onCorrect, onAttempt }) {
  const fs = useFS();
  const activities = READ_ACTIVITIES.filter(a => a.level === level);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong"
  const [showHint, setShowHint] = useState(false);
  // Notice & Wonder aşaması tamamlandı mı? — her etkinlik için sıfırlanır
  const [nwDone, setNwDone] = useState(!noticeWonderOn);

  // Seviye değişince sıfırla
  useEffect(() => {
    setIdx(0); setSelected(null); setFeedback(null); setShowHint(false);
    setNwDone(!noticeWonderOn);
  }, [level, noticeWonderOn]);

  // Yeni etkinliğe geçince N&W aşamasını sıfırla
  useEffect(() => {
    setNwDone(!noticeWonderOn);
  }, [idx, noticeWonderOn]);

  if (activities.length === 0) {
    return (
      <div style={{ maxWidth: 520, margin: "0 auto", padding: 20, textAlign: "center" }}>
        <div style={{ fontSize: fs(36), marginBottom: 10 }}>📭</div>
        <div style={{ fontSize: fs(14), color: P.textSoft }}>
          {lang === "ku" ? "Ji bo vê astê hîn çalakî tune" : lang === "en" ? "No activities yet for this level" : "Bu seviye için henüz etkinlik yok"}
        </div>
      </div>
    );
  }

  const act = activities[idx % activities.length];
  const data = act.data;
  // Dile duyarlı grafik verisi çözümü
  const resolvedData = {
    ...data,
    title: tt(data.title),
    categories: Array.isArray(data.categories) ? data.categories : (data.categories[lang] || data.categories.tr),
    unit: data.unit ? tt(data.unit) : undefined,
    yLabel: data.yLabel ? tt(data.yLabel) : undefined,
    xLabel: data.xLabel ? tt(data.xLabel) : undefined,
    headers: data.headers ? (data.headers[lang] || data.headers.tr) : undefined,
  };
  const qText = tt(act.q);
  const options = act.opts[lang] || act.opts.tr;

  function handleAnswer(i) {
    if (feedback) return; // Zaten cevaplandı
    setSelected(i);
    const isCorrect = i === act.correct;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (onAttempt) onAttempt(act.id, isCorrect);
    if (isCorrect && onCorrect) onCorrect();
  }

  function next() {
    setIdx(i => i + 1);
    setSelected(null);
    setFeedback(null);
    setShowHint(false);
  }

  // Grafik elementi — hem N&W'de hem quiz kartında kullanılır
  const graphEl = (
    <>
      {act.graphType === "bar" && <BarChart data={resolvedData} truncated={act.truncated} colorblindMode={colorblind}/>}
      {act.graphType === "picto" && <Pictograph data={resolvedData} colorblindMode={colorblind}/>}
      {act.graphType === "table" && <DataTable data={resolvedData}/>}
    </>
  );

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      {/* Başlık + sayaç */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1 style={{ fontSize: fs(20), fontWeight: 800, color: P.text, margin: 0 }}>
          📊 {lang === "ku" ? "Xwendina Grafîkan" : lang === "en" ? "Graph Reading" : "Grafik Okuma"}
        </h1>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: fs(11), fontWeight: 700, color: P.textSoft }}>
            {(idx % activities.length) + 1}/{activities.length}
          </span>
          <span style={{
            fontSize: fs(9), fontWeight: 800, color: levelData.color,
            background: levelData.colorSoft,
            padding: "3px 8px", borderRadius: 10,
          }}>
            L{level} · GAISE {act.gaise}
          </span>
        </div>
      </div>

      {/* Notice & Wonder aşaması — opsiyonel */}
      {noticeWonderOn && !nwDone && (
        <NoticeWonderStage
          actId={act.id}
          lang={lang}
          t={t}
          graph={graphEl}
          onDone={() => setNwDone(true)}
        />
      )}

      {/* Soru kartı — N&W tamamlandıysa veya kapalıysa */}
      {nwDone && (
      <div style={{
        padding: 18, borderRadius: 12,
        background: "#fff",
        border: "1px solid rgba(30,41,59,.08)",
        marginBottom: 10,
      }}>
        {/* Grafik */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, padding: 10, background: "rgba(59,130,246,.02)", borderRadius: 8 }}>
          {graphEl}
        </div>

        {/* Soru */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
          <SpeakButton text={qText} size="md"/>
          <div style={{ flex: 1, fontSize: fs(13.5), fontWeight: 700, color: P.text, lineHeight: 1.55 }}>
            {qText}
          </div>
        </div>

        {/* Seçenekler */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {options.map((opt, i) => {
            const isCorrect = i === act.correct;
            const isSelected = selected === i;
            const showResult = feedback !== null;

            let bg = "#fff", borderColor = "rgba(30,41,59,.15)", color = P.text;
            if (showResult) {
              if (isCorrect) {
                bg = "rgba(16,185,129,.12)"; borderColor = "#10b981"; color = "#065f46";
              } else if (isSelected) {
                bg = "rgba(239,68,68,.12)"; borderColor = "#ef4444"; color = "#991b1b";
              } else {
                bg = "rgba(30,41,59,.03)"; color = P.textSoft;
              }
            } else if (isSelected) {
              bg = P.accentL; borderColor = P.accent;
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={feedback !== null}
                style={{
                  padding: "12px 14px", borderRadius: 9,
                  border: "2px solid " + borderColor,
                  background: bg, color: color,
                  cursor: feedback ? "default" : "pointer",
                  fontFamily: "inherit",
                  fontSize: fs(12.5), fontWeight: 700,
                  textAlign: "left",
                  transition: "all .15s",
                  display: "flex", alignItems: "center", gap: 8,
                }}
                onMouseEnter={e => !feedback && (e.currentTarget.style.background = P.accentL)}
                onMouseLeave={e => !feedback && !isSelected && (e.currentTarget.style.background = "#fff")}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: showResult && isCorrect ? "#10b981" : showResult && isSelected ? "#ef4444" : "rgba(30,41,59,.08)",
                  color: showResult && (isCorrect || isSelected) ? "#fff" : P.textSoft,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: fs(11), fontWeight: 800, flexShrink: 0,
                }}>
                  {showResult && isCorrect ? "✓" : showResult && isSelected ? "✗" : String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Geri bildirim + ipucu */}
        {feedback === "correct" && (
          <div style={{
            marginTop: 12, padding: "10px 14px", borderRadius: 8,
            background: "rgba(16,185,129,.1)", border: "1px solid rgba(16,185,129,.3)",
            fontSize: fs(12), color: "#065f46", fontWeight: 700,
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{ fontSize: fs(16) }}>✓</span>
            <span>{lang === "ku" ? "Rast! +10 xal" : lang === "en" ? "Correct! +10 pts" : "Doğru! +10 puan"}</span>
          </div>
        )}

        {feedback === "wrong" && (
          <div style={{
            marginTop: 12, padding: "10px 14px", borderRadius: 8,
            background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)",
          }}>
            <div style={{ fontSize: fs(12), color: "#991b1b", fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: fs(16) }}>💡</span>
              <span>{lang === "ku" ? "Nêzîk! Nîşan bixwîne:" : lang === "en" ? "Close! Read the hint:" : "Yaklaştın! İpucunu oku:"}</span>
            </div>
            <div style={{ fontSize: fs(11.5), color: "#7f1d1d", lineHeight: 1.55 }}>
              {tt(act.hint)}
            </div>
          </div>
        )}

        {/* İpucu butonu (cevaplanmadan önce) */}
        {!feedback && !showHint && (
          <button
            onClick={() => setShowHint(true)}
            style={{
              marginTop: 10, padding: "6px 12px",
              borderRadius: 7, border: "1px dashed rgba(59,130,246,.3)",
              background: "transparent", color: P.accent,
              cursor: "pointer", fontFamily: "inherit",
              fontSize: fs(11), fontWeight: 700,
            }}>
            💡 {lang === "ku" ? "Nîşan nîşan bide" : lang === "en" ? "Show hint" : "İpucu göster"}
          </button>
        )}
        {!feedback && showHint && (
          <div style={{
            marginTop: 10, padding: "8px 12px", borderRadius: 8,
            background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.3)",
            fontSize: fs(11), color: "#78350f", lineHeight: 1.5,
          }}>
            💡 {tt(act.hint)}
          </div>
        )}
      </div>
      )}

      {/* Yanılgı etiketi — varsa */}
      {act.misconception && feedback && (
        <div style={{
          padding: "7px 11px", borderRadius: 7,
          background: "rgba(124,58,237,.06)",
          fontSize: fs(10), color: "#7c3aed", fontStyle: "italic", lineHeight: 1.5,
          marginBottom: 10,
        }}>
          📖 {lang === "ku" ? "Çewtiya gelemper" : lang === "en" ? "Common misconception" : "Yaygın yanılgı"}: {act.misconception}
        </div>
      )}

      {/* Sonraki butonu */}
      {feedback && (
        <button
          onClick={next}
          style={{
            width: "100%", padding: 12,
            borderRadius: 10, border: "none",
            background: `linear-gradient(135deg,${P.accent},${P.accentD})`,
            color: "#fff", cursor: "pointer",
            fontFamily: "inherit", fontSize: fs(13), fontWeight: 800,
            boxShadow: "0 2px 10px rgba(59,130,246,.3)",
          }}>
          {lang === "ku" ? "Paşê →" : lang === "en" ? "Next →" : "Sonraki →"}
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// YANILTMA AVI ETKİNLİKLERİ — Huff (1954) ilhamlı
// Öğrenci kötü grafiği inceler, yanıltmayı bulur, düzeltilmiş versiyonu görür

export function DeceiveModule({ lang, t, tt, colorblind, noticeWonderOn, onCorrect, onAttempt, level }) {
  const fs = useFS();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showFix, setShowFix] = useState(false);
  const [nwDone, setNwDone] = useState(!noticeWonderOn);

  // Etkinlik değişince N&W'yi sıfırla
  useEffect(() => {
    setNwDone(!noticeWonderOn);
  }, [idx, noticeWonderOn]);

  const ex = DECEPTION_CASES[idx % DECEPTION_CASES.length];
  const badResolved = {
    ...ex.badData,
    title: tt(ex.badData.title),
    categories: ex.badData.categories[lang] || ex.badData.categories.tr,
    yLabel: ex.badData.yLabel ? tt(ex.badData.yLabel) : undefined,
  };
  const goodResolved = ex.goodData ? {
    ...ex.goodData,
    title: tt(ex.goodData.title),
    categories: ex.goodData.categories[lang] || ex.goodData.categories.tr,
  } : null;

  function handleAnswer(i) {
    if (feedback) return;
    setSelected(i);
    const isCorrect = i === ex.correct;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (onAttempt) onAttempt(ex.id, isCorrect);
    if (isCorrect && onCorrect) onCorrect();
  }

  function next() {
    setIdx(i => i + 1);
    setSelected(null);
    setFeedback(null);
    setShowFix(false);
  }

  const options = ex.options[lang] || ex.options.tr;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h1 style={{ fontSize: fs(20), fontWeight: 800, color: P.text, margin: 0 }}>
          🔍 {lang === "ku" ? "Nêçîra Xapandinê" : lang === "en" ? "Deception Hunt" : "Yanıltma Avı"}
        </h1>
        <span style={{ fontSize: fs(11), fontWeight: 700, color: P.textSoft }}>
          {(idx % DECEPTION_CASES.length) + 1}/{DECEPTION_CASES.length}
        </span>
      </div>

      {/* Uyarı şeridi */}
      <div style={{
        padding: "8px 12px", borderRadius: 8, marginBottom: 12,
        background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.2)",
        fontSize: fs(11), color: "#991b1b", lineHeight: 1.5,
      }}>
        ⚠ {lang === "ku"
          ? "Ev grafîk ji bo fêrkirina xapandinê bi NIYETÊ çewt hatine çêkirin. Çewtiyê bibînin!"
          : lang === "en"
          ? "These graphs are INTENTIONALLY misleading for learning. Find the deception!"
          : "Bu grafikler KASITLI yanıltıcıdır — eğitim amaçlı. Hatayı bul!"}
      </div>

      {/* Başlık */}
      <h2 style={{ fontSize: fs(15), fontWeight: 800, color: "#991b1b", margin: "0 0 10px 0" }}>
        "{tt(ex.title)}"
      </h2>

      {/* Notice & Wonder — yanıltıcı grafik için özellikle güçlü */}
      {noticeWonderOn && !nwDone && (
        <NoticeWonderStage
          actId={ex.id}
          lang={lang}
          t={t}
          graph={<BarChart data={badResolved} truncated={ex.badTruncated} colorblindMode={colorblind}/>}
          onDone={() => setNwDone(true)}
        />
      )}

      {nwDone && (
      <div style={{
        padding: 18, borderRadius: 12,
        background: "#fff",
        border: "1px solid rgba(30,41,59,.08)",
        marginBottom: 10,
      }}>
        {/* Kötü grafik */}
        <div style={{ marginBottom: 8, textAlign: "center" }}>
          <div style={{
            display: "inline-block", fontSize: fs(10), fontWeight: 800, color: "#991b1b",
            background: "rgba(239,68,68,.1)", padding: "2px 8px", borderRadius: 10, marginBottom: 4,
          }}>
            ❌ {lang === "ku" ? "Grafîka xapînok" : lang === "en" ? "Misleading graph" : "Yanıltıcı grafik"}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", padding: 10, background: "rgba(239,68,68,.02)", borderRadius: 8 }}>
          <BarChart data={badResolved} truncated={ex.badTruncated} colorblindMode={colorblind}/>
        </div>
        {ex.badNote && (
          <div style={{
            marginTop: 8, padding: "8px 12px", borderRadius: 7,
            background: "rgba(251,191,36,.1)", border: "1px solid rgba(251,191,36,.25)",
            fontSize: fs(11), color: "#78350f", fontStyle: "italic",
          }}>
            📋 {tt(ex.badNote)}
          </div>
        )}

        {/* Soru */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 14, marginBottom: 10 }}>
          <SpeakButton text={tt(ex.question)} size="md"/>
          <div style={{ flex: 1, fontSize: fs(13.5), fontWeight: 700, color: P.text, lineHeight: 1.55 }}>
            {tt(ex.question)}
          </div>
        </div>

        {/* Seçenekler */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {options.map((opt, i) => {
            const isCorrect = i === ex.correct;
            const isSelected = selected === i;
            const showResult = feedback !== null;
            let bg = "#fff", borderColor = "rgba(30,41,59,.15)", color = P.text;
            if (showResult) {
              if (isCorrect) { bg = "rgba(16,185,129,.12)"; borderColor = "#10b981"; color = "#065f46"; }
              else if (isSelected) { bg = "rgba(239,68,68,.12)"; borderColor = "#ef4444"; color = "#991b1b"; }
              else { bg = "rgba(30,41,59,.03)"; color = P.textSoft; }
            } else if (isSelected) { bg = P.accentL; borderColor = P.accent; }
            return (
              <button key={i} onClick={() => handleAnswer(i)} disabled={feedback !== null}
                style={{
                  padding: "11px 14px", borderRadius: 8,
                  border: "2px solid " + borderColor, background: bg, color: color,
                  cursor: feedback ? "default" : "pointer", fontFamily: "inherit",
                  fontSize: fs(12.5), fontWeight: 700, textAlign: "left",
                  display: "flex", alignItems: "center", gap: 9,
                }}>
                <span style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: showResult && isCorrect ? "#10b981" : showResult && isSelected ? "#ef4444" : "rgba(30,41,59,.08)",
                  color: showResult && (isCorrect || isSelected) ? "#fff" : P.textSoft,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: fs(11), fontWeight: 800, flexShrink: 0,
                }}>
                  {showResult && isCorrect ? "✓" : showResult && isSelected ? "✗" : String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Açıklama + düzeltme */}
        {feedback && (
          <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 8,
            background: "rgba(59,130,246,.06)", border: "1px solid rgba(59,130,246,.2)" }}>
            <div style={{ fontSize: fs(11), fontWeight: 800, color: P.accentD, marginBottom: 6, textTransform: "uppercase", letterSpacing: .4 }}>
              📖 {lang === "ku" ? "Şîrove" : lang === "en" ? "Explanation" : "Açıklama"}
            </div>
            <div style={{ fontSize: fs(12), color: P.text, lineHeight: 1.6 }}>
              {tt(ex.explanation)}
            </div>
            <div style={{ fontSize: fs(9), color: P.textSoft, marginTop: 6, fontStyle: "italic" }}>
              📚 {ex.source}
            </div>
          </div>
        )}

        {/* Düzeltme grafiği — sadece cevap verildiyse */}
        {feedback && goodResolved && (
          <div style={{ marginTop: 14 }}>
            <button
              onClick={() => setShowFix(s => !s)}
              style={{
                width: "100%", padding: "9px", borderRadius: 8, border: "2px solid #10b981",
                background: showFix ? "rgba(16,185,129,.15)" : "rgba(16,185,129,.05)",
                color: "#065f46", cursor: "pointer", fontFamily: "inherit",
                fontSize: fs(12), fontWeight: 700,
              }}>
              {showFix ? "▼" : "▶"} {lang === "ku" ? "Grafîka rast nîşan bide" : lang === "en" ? "Show correct graph" : "Doğru grafiği göster"}
            </button>
            {showFix && (
              <div style={{ marginTop: 10, padding: 14, background: "rgba(16,185,129,.04)", borderRadius: 10, border: "1px solid rgba(16,185,129,.2)" }}>
                <div style={{
                  display: "inline-block", fontSize: fs(10), fontWeight: 800, color: "#065f46",
                  background: "rgba(16,185,129,.15)", padding: "2px 8px", borderRadius: 10, marginBottom: 8,
                }}>
                  ✓ {lang === "ku" ? "Grafîka rast" : lang === "en" ? "Honest graph" : "Dürüst grafik"}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <BarChart data={goodResolved} colorblindMode={colorblind}/>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      )}

      {feedback && (
        <button onClick={next} style={{
          width: "100%", padding: 12, borderRadius: 10, border: "none",
          background: `linear-gradient(135deg,${P.accent},${P.accentD})`, color: "#fff",
          cursor: "pointer", fontFamily: "inherit", fontSize: fs(13), fontWeight: 800,
          boxShadow: "0 2px 10px rgba(59,130,246,.3)",
        }}>
          {lang === "ku" ? "Nimûneya paşê →" : lang === "en" ? "Next case →" : "Sonraki örnek →"}
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MERKEZİ EĞİLİM MODÜLÜ — Canlı mean/median/mod
// Öğrenci veri ekler/çıkarır, 3 ölçü anlık güncellenir
// Pedagojik: Watson & Callingham (2003) — mean ≠ mode yanılgısı

export function CenterModule({ lang, t, tt, colorblind, noticeWonderOn }) {
  const fs = useFS();
  const [data, setData] = useState([2, 5, 5, 7, 9, 10, 10, 10, 14]);
  const [newVal, setNewVal] = useState("");
  const [show, setShow] = useState({ mean: true, median: true, mode: true });
  const [nwDone, setNwDone] = useState(!noticeWonderOn);

  // Tüm istatistik hesaplamaları — data değişene kadar tekrar yok
  const stats = useMemo(() => {
    const n = data.length;
    const total = data.reduce((a, b) => a + b, 0);
    const mean = n ? total / n : 0;
    const sorted = [...data].sort((a, b) => a - b);
    const median = n === 0 ? 0 : (n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)]);
    const freq = {};
    data.forEach(v => freq[v] = (freq[v] || 0) + 1);
    const maxFreq = Math.max(0, ...Object.values(freq));
    const modes = Object.entries(freq).filter(([_, f]) => f === maxFreq && maxFreq > 1).map(([v]) => parseFloat(v));
    const rangeVal = n ? Math.max(...data) - Math.min(...data) : 0;
    const minD = n ? Math.min(...data) : 0;
    const maxD = n ? Math.max(...data) : 10;
    const span = Math.max(1, maxD - minD);
    return { n, total, mean, sorted, median, freq, maxFreq, modes, rangeVal, minD, maxD, span };
  }, [data]);
  const { n, total, mean, sorted, median, freq, maxFreq, modes, rangeVal, minD, maxD, span } = stats;

  // Dot plot için boyut hesapları
  const W = 460, H = 220;
  const padL = 24, padR = 24, padT = 30, padB = 40;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const xOf = v => padL + ((v - minD) / span) * plotW;

  // Noktalar için konum (aynı değere yığılan noktalar üst üste)
  const dots = [];
  const stackCount = {};
  sorted.forEach(v => {
    stackCount[v] = (stackCount[v] || 0) + 1;
    dots.push({ v, y: padT + plotH - (stackCount[v] - 1) * 14 - 10 });
  });

  function addVal() {
    const v = parseFloat(newVal);
    if (!isNaN(v)) {
      setData(d => [...d, v]);
      setNewVal("");
    }
  }
  function removeVal(i) {
    setData(d => d.filter((_, j) => j !== i));
  }
  function reset() {
    setData([2, 5, 5, 7, 9, 10, 10, 10, 14]);
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: fs(20), fontWeight: 800, color: P.text, marginTop: 0, marginBottom: 8 }}>
        🎯 {lang === "ku" ? "Navendkarî" : lang === "en" ? "Central Tendency" : "Merkezi Eğilim"}
      </h1>
      <p style={{ fontSize: fs(12), color: P.textSoft, marginTop: 0, marginBottom: 16, lineHeight: 1.6 }}>
        {lang === "ku"
          ? "Daneyê biguherîne û bibîne ku navînî, medyan û mod çawa diguhere. Her yek bersiveke cuda dide."
          : lang === "en"
          ? "Change the data and see how mean, median, mode shift. Each answers a different question."
          : "Veriyi değiştir, ortalama/medyan/mod nasıl değişiyor gör. Her biri farklı bir soruya cevap verir."}
      </p>

      {/* N&W açılışı — sadece ilk açılışta, noticeWonderOn ise */}
      {noticeWonderOn && !nwDone && (
        <NoticeWonderStage
          actId="center_opening"
          lang={lang}
          t={t}
          graph={
            <div style={{
              padding: 14, background: "rgba(245,158,11,.05)",
              borderRadius: 9, border: "1px solid rgba(245,158,11,.2)",
            }}>
              <div style={{ fontSize: fs(11), color: "#92400e", fontWeight: 700, marginBottom: 6 }}>
                📊 {lang === "ku" ? "Daneyên destpêkê" : lang === "en" ? "Starting data" : "Başlangıç verisi"}:
              </div>
              <div style={{ fontSize: fs(14), fontFamily: "monospace", color: "#78350f", letterSpacing: 2 }}>
                {data.join(", ")}
              </div>
            </div>
          }
          onDone={() => setNwDone(true)}
        />
      )}

      {nwDone && (<>
      {/* Ana panel */}
      <div style={{ padding: 18, borderRadius: 12, background: "#fff", border: "1px solid rgba(30,41,59,.08)", marginBottom: 12 }}>
        {/* Dot plot */}
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 540, display: "block", margin: "0 auto" }}>
          {/* Eksen */}
          <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={P.textSoft} strokeWidth={1.5}/>
          {/* X tikleri */}
          {(() => {
            const ticks = [];
            const step = Math.max(1, Math.ceil(span / 8));
            for (let v = Math.floor(minD); v <= Math.ceil(maxD); v += step) {
              ticks.push(v);
            }
            return ticks.map((t, i) => (
              <g key={i}>
                <line x1={xOf(t)} y1={padT + plotH} x2={xOf(t)} y2={padT + plotH + 4} stroke={P.textSoft} strokeWidth={1}/>
                <text x={xOf(t)} y={padT + plotH + 16} textAnchor="middle" style={{ fontSize: fs(10), fill: P.textSoft, fontFamily: "system-ui" }}>{t}</text>
              </g>
            ));
          })()}
          {/* Veri noktaları */}
          {dots.map((d, i) => (
            <circle key={i} cx={xOf(d.v)} cy={d.y} r={5.5} fill="#3b82f6" stroke="#fff" strokeWidth={1.5}/>
          ))}
          {/* Mean çizgisi */}
          {show.mean && n > 0 && (
            <g>
              <line x1={xOf(mean)} y1={padT - 5} x2={xOf(mean)} y2={padT + plotH + 8}
                stroke="#ef4444" strokeWidth={2} strokeDasharray="4,3"/>
              <text x={xOf(mean)} y={padT - 10} textAnchor="middle"
                style={{ fontSize: fs(10), fontWeight: 800, fill: "#ef4444", fontFamily: "system-ui" }}>
                μ={mean.toFixed(2)}
              </text>
            </g>
          )}
          {/* Median çizgisi */}
          {show.median && n > 0 && (
            <g>
              <line x1={xOf(median)} y1={padT + 5} x2={xOf(median)} y2={padT + plotH - 5}
                stroke="#10b981" strokeWidth={2}/>
              <text x={xOf(median)} y={padT + plotH + 30} textAnchor="middle"
                style={{ fontSize: fs(10), fontWeight: 800, fill: "#10b981", fontFamily: "system-ui" }}>
                med={median}
              </text>
            </g>
          )}
          {/* Mod işaretleri */}
          {show.mode && modes.map((m, i) => (
            <g key={i}>
              <path d={`M ${xOf(m)} ${padT + plotH - 2} l -6 10 l 12 0 z`}
                fill="#f59e0b" stroke="#fff" strokeWidth={1}/>
            </g>
          ))}
          {show.mode && modes.length > 0 && (
            <text x={padL + plotW} y={padT - 10} textAnchor="end"
              style={{ fontSize: fs(10), fontWeight: 800, fill: "#f59e0b", fontFamily: "system-ui" }}>
              mod = {modes.join(", ")}
            </text>
          )}
        </svg>

        {/* 3 ölçü rozeti */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 10 }}>
          {[
            { key: "mean", symbol: "μ", color: "#ef4444", val: mean.toFixed(2), name: { tr: "Ortalama", ku: "Navînî", en: "Mean" }, desc: { tr: "Tüm değerlerin toplamı ÷ sayısı", ku: "Kom ÷ hejmar", en: "Total ÷ count" } },
            { key: "median", symbol: "med", color: "#10b981", val: String(median), name: { tr: "Medyan", ku: "Medyan", en: "Median" }, desc: { tr: "Sıralanınca ortadaki değer", ku: "Ya di navê de dema rêzkirin", en: "Middle when sorted" } },
            { key: "mode", symbol: "mod", color: "#f59e0b", val: modes.length ? modes.join(", ") : "—", name: { tr: "Mod", ku: "Mod", en: "Mode" }, desc: { tr: "En çok tekrar eden değer", ku: "Ya herî zêde dubare dibe", en: "Most frequent value" } },
          ].map(m => (
            <div key={m.key}
              onClick={() => setShow(s => ({ ...s, [m.key]: !s[m.key] }))}
              style={{
                padding: "10px 12px", borderRadius: 9,
                background: show[m.key] ? m.color + "15" : "rgba(30,41,59,.03)",
                border: "2px solid " + (show[m.key] ? m.color : "rgba(30,41,59,.1)"),
                cursor: "pointer",
                opacity: show[m.key] ? 1 : 0.5,
                transition: "all .15s",
              }}>
              <div style={{ fontSize: fs(9), fontWeight: 800, color: show[m.key] ? m.color : P.textSoft, textTransform: "uppercase", letterSpacing: .4 }}>
                {m.symbol} {tt(m.name)}
              </div>
              <div style={{ fontSize: fs(18), fontWeight: 900, color: show[m.key] ? m.color : P.textSoft, lineHeight: 1.1, marginTop: 2 }}>
                {m.val}
              </div>
              <div style={{ fontSize: fs(9), color: P.textSoft, marginTop: 3, lineHeight: 1.3 }}>
                {tt(m.desc)}
              </div>
            </div>
          ))}
        </div>

        {/* Ek bilgi */}
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: fs(11), color: P.textSoft, padding: "7px 10px", background: "rgba(59,130,246,.05)", borderRadius: 7 }}>
          <span><strong>n</strong> = {n}</span>
          <span><strong>{lang === "ku" ? "Berfirehî" : lang === "en" ? "Range" : "Aralık"}</strong> = {rangeVal}</span>
          <span><strong>{lang === "ku" ? "Kom" : lang === "en" ? "Sum" : "Toplam"}</strong> = {total.toFixed(1)}</span>
        </div>
      </div>

      {/* Veri girişi */}
      <div style={{ padding: 14, borderRadius: 10, background: "#fff", border: "1px solid rgba(30,41,59,.08)", marginBottom: 12 }}>
        <div style={{ fontSize: fs(11), fontWeight: 800, color: P.accentD, textTransform: "uppercase", letterSpacing: .4, marginBottom: 8 }}>
          ✏️ {lang === "ku" ? "Daneyê biguherîne" : lang === "en" ? "Edit data" : "Veriyi düzenle"}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
          {data.map((v, i) => (
            <span key={i} style={{
              padding: "4px 8px", borderRadius: 6,
              background: "rgba(59,130,246,.1)", color: P.accentD,
              fontSize: fs(11), fontWeight: 700,
              display: "flex", alignItems: "center", gap: 5,
            }}>
              {v}
              <button onClick={() => removeVal(i)} aria-label="Sil" style={{
                width: 14, height: 14, borderRadius: "50%", border: "none",
                background: "rgba(239,68,68,.2)", color: "#dc2626",
                cursor: "pointer", fontSize: fs(10), fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 0, lineHeight: 1,
              }}>×</button>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <input type="number" step="0.1" value={newVal} onChange={e => setNewVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addVal()}
            placeholder={lang === "ku" ? "Nirxek têkevîne..." : lang === "en" ? "Enter value..." : "Değer gir..."}
            style={{
              flex: 1, padding: "8px 12px", borderRadius: 7,
              border: "1.5px solid rgba(30,41,59,.15)",
              fontSize: fs(12), fontFamily: "inherit",
              outline: "none",
            }}/>
          <button onClick={addVal} style={{
            padding: "8px 16px", borderRadius: 7, border: "none",
            background: P.accent, color: "#fff", cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(12), fontWeight: 800,
          }}>+ {lang === "ku" ? "Zêde bike" : lang === "en" ? "Add" : "Ekle"}</button>
          <button onClick={reset} style={{
            padding: "8px 14px", borderRadius: 7, border: "1.5px solid rgba(30,41,59,.15)",
            background: "#fff", color: P.textSoft, cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(11), fontWeight: 700,
          }}>↺ {lang === "ku" ? "Ji destpêkê" : lang === "en" ? "Reset" : "Başa dön"}</button>
        </div>
      </div>

      {/* Pedagojik not */}
      <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(124,58,237,.06)",
        border: "1px solid rgba(124,58,237,.2)", fontSize: fs(11), color: "#581c87", lineHeight: 1.6 }}>
        💡 <strong>{lang === "ku" ? "Dene" : lang === "en" ? "Try" : "Dene"}:</strong>{" "}
        {lang === "ku"
          ? "Nirxekî pir mezin zêde bike (mînak 100). Navînî diqevze, lê medyan nayê guhertin zêde. Çima?"
          : lang === "en"
          ? "Add a very large value (e.g. 100). Mean jumps, but median barely moves. Why?"
          : "Çok büyük bir değer ekle (ör. 100). Ortalama sıçrar, medyan neredeyse değişmez. Neden?"}
      </div>
      <div style={{ marginTop: 6, padding: "6px 10px", fontSize: fs(9), color: P.textSoft, fontStyle: "italic" }}>
        📖 Watson & Callingham (2003): "Mean = most common" yanılgısı yaygındır. Mean, median ve mod üçü farklı soruyu cevaplar.
      </div>
      </>)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GRAFİK OLUŞTUR MODÜLÜ — Öğrenci kendi verisini girer, grafik çizer

export function CreateModule({ lang, t, tt, colorblind }) {
  const fs = useFS();
  const { dyscalculia } = useA11y();
  const [title, setTitle] = useState(lang === "ku" ? "Daneyên min" : lang === "en" ? "My data" : "Verim");
  const [chartType, setChartType] = useState("bar");
  const [entries, setEntries] = useState([
    { cat: lang === "ku" ? "A" : "A", val: "10" },
    { cat: "B", val: "25" },
    { cat: "C", val: "15" },
    { cat: "D", val: "30" },
  ]);
  // Yüklenen veri setinin kaynağı (etiket için)
  const [loadedSource, setLoadedSource] = useState(null); // {source, date, context, id}

  function addRow() {
    setEntries(e => [...e, { cat: "", val: "" }]);
  }
  function removeRow(i) {
    setEntries(e => e.filter((_, j) => j !== i));
    // Veri düzenlenince kaynağı temizle (artık saf kaynak değil)
    setLoadedSource(null);
  }
  function updateRow(i, field, value) {
    setEntries(e => e.map((r, j) => j === i ? { ...r, [field]: value } : r));
    setLoadedSource(null); // kullanıcı düzenledi → artık "kendi verisi"
  }

  // Hazır veri setini yükle
  function loadDataset(ds) {
    setTitle(tt(ds.title));
    setChartType(ds.chartType);
    const cats = Array.isArray(ds.data.categories) ? ds.data.categories : (ds.data.categories[lang] || ds.data.categories.tr);
    setEntries(cats.map((c, i) => ({ cat: c, val: String(ds.data.values[i]) })));
    setLoadedSource({
      source: ds.source,
      date: ds.date,
      sourceUrl: ds.sourceUrl,
      context: ds.context,
      id: ds.id,
    });
  }

  const valid = entries.filter(e => e.cat.trim() && !isNaN(parseFloat(e.val)));
  const chartData = {
    title,
    categories: valid.map(e => e.cat),
    values: valid.map(e => parseFloat(e.val)),
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: fs(20), fontWeight: 800, color: P.text, marginTop: 0, marginBottom: 6 }}>
        📈 {lang === "ku" ? "Grafîk Çêbike" : lang === "en" ? "Create a Graph" : "Grafik Oluştur"}
      </h1>
      <p style={{ fontSize: fs(12), color: P.textSoft, marginTop: 0, marginBottom: 16, lineHeight: 1.6 }}>
        {lang === "ku"
          ? "Daneyê têkevîne, grafîk tipê hilbijêre. Guherandin canlî xuya dibin."
          : lang === "en"
          ? "Enter your data, pick a chart type. Live preview updates as you type."
          : "Veriyi gir, grafik tipini seç. Yazdıkça canlı önizleme güncellenir."}
      </p>

      {/* Hazır Veri Yükleyici — Türkiye gerçek verileri */}
      <div style={{
        padding: 14, borderRadius: 10, marginBottom: 14,
        background: "linear-gradient(135deg,#fef3c7,#fde68a)",
        border: "1.5px solid #f59e0b",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: fs(18) }}>📂</span>
          <div>
            <div style={{ fontSize: fs(12), fontWeight: 800, color: "#78350f" }}>
              {lang === "ku" ? "Daneyên Rastîn Bar Bike" : lang === "en" ? "Load Real Data" : "Hazır Veri Yükle"}
            </div>
            <div style={{ fontSize: fs(9), color: "rgba(120,53,15,.7)", fontStyle: "italic" }}>
              🇹🇷 {lang === "ku" ? "Tirkiye: TÜİK, MGM, MEB/OECD" : lang === "en" ? "Turkey: TÜİK, MGM, MEB/OECD" : "Türkiye: TÜİK, MGM, MEB/OECD"}
            </div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {REAL_DATASETS.map(ds => {
            const isLoaded = loadedSource?.id === ds.id;
            return (
              <button key={ds.id} onClick={() => loadDataset(ds)}
                style={{
                  padding: "9px 10px", borderRadius: 7,
                  border: "1.5px solid " + (isLoaded ? "#78350f" : "rgba(120,53,15,.2)"),
                  background: isLoaded ? "rgba(120,53,15,.1)" : "#fff",
                  color: "#78350f", cursor: "pointer", fontFamily: "inherit",
                  fontSize: fs(10.5), fontWeight: isLoaded ? 800 : 600,
                  textAlign: "left", lineHeight: 1.3,
                }}>
                {isLoaded && "✓ "}{tt(ds.title)}
              </button>
            );
          })}
        </div>

        {/* Yüklü kaynağın bağlam bilgisi */}
        {loadedSource && (
          <div style={{
            marginTop: 10, padding: "8px 11px", borderRadius: 7,
            background: "rgba(255,255,255,.5)",
          }}>
            <div style={{ fontSize: fs(9), fontWeight: 800, color: "#78350f", marginBottom: 3, textTransform: "uppercase", letterSpacing: .4 }}>
              📚 {lang === "ku" ? "Çavkanî" : lang === "en" ? "Source" : "Kaynak"}:{" "}
              <span style={{ fontWeight: 700 }}>{loadedSource.source}</span>
              <span style={{ color: "rgba(120,53,15,.6)", marginLeft: 6 }}>· {loadedSource.date}</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <SpeakButton text={loadedSource.context[lang] || loadedSource.context.tr} size="sm"/>
              <div style={{ flex: 1, fontSize: fs(10), color: "#78350f", lineHeight: 1.5, fontStyle: "italic" }}>
                {loadedSource.context[lang] || loadedSource.context.tr}
              </div>
            </div>

            {/* Sözel değer kartı — milyon cinsinden veriler için diskalkuli yardımcısı */}
            {dyscalculia && loadedSource.id === "tr_pop_cities" && (
              <div style={{
                marginTop: 8, padding: "8px 10px",
                background: "rgba(255,255,255,.8)",
                borderRadius: 6,
                border: "1px dashed rgba(120,53,15,.3)",
              }}>
                <div style={{ fontSize: fs(9), fontWeight: 800, color: "#78350f", marginBottom: 5, textTransform: "uppercase", letterSpacing: .4 }}>
                  🔢 {lang === "ku" ? "Nirx bi gotinan" : lang === "en" ? "Values in words" : "Değerler yazıyla"}
                </div>
                {entries.map((e, i) => {
                  const val = parseFloat(e.val);
                  if (isNaN(val)) return null;
                  const words = numberToWords(val, lang);
                  const ttsText = `${e.cat}: ${words} ${lang === "ku" ? "kes" : lang === "en" ? "people" : "kişi"}`;
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      fontSize: fs(10), color: "#78350f", lineHeight: 1.55,
                      marginBottom: 2,
                    }}>
                      <span style={{ fontWeight: 700, minWidth: 70 }}>{e.cat}:</span>
                      <span style={{ fontWeight: 600 }}>{val} M</span>
                      <span style={{ opacity: 0.7 }}>=</span>
                      <span style={{ fontStyle: "italic" }}>{words} {lang === "ku" ? "kes" : lang === "en" ? "people" : "kişi"}</span>
                      <SpeakButton text={ttsText} size="sm" style={{ marginLeft: "auto" }}/>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grafik tipi seçici */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[
          { id: "bar", label: { tr: "Çubuk", ku: "Darik", en: "Bar" }, icon: "📊" },
          { id: "line", label: { tr: "Çizgi", ku: "Xet", en: "Line" }, icon: "📈" },
          { id: "pie", label: { tr: "Pasta", ku: "Keka", en: "Pie" }, icon: "🥧" },
        ].map(opt => {
          const isSel = chartType === opt.id;
          return (
            <button key={opt.id} onClick={() => setChartType(opt.id)}
              style={{
                flex: 1, padding: "10px 12px", borderRadius: 9,
                border: "2px solid " + (isSel ? P.accent : "rgba(30,41,59,.15)"),
                background: isSel ? P.accentL : "#fff",
                color: isSel ? P.accentD : P.text,
                cursor: "pointer", fontFamily: "inherit",
                fontSize: fs(12), fontWeight: isSel ? 800 : 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
              <span>{opt.icon}</span>
              <span>{tt(opt.label)}</span>
            </button>
          );
        })}
      </div>

      {/* Başlık girişi */}
      <div style={{ padding: 14, borderRadius: 10, background: "#fff", border: "1px solid rgba(30,41,59,.08)", marginBottom: 12 }}>
        <div style={{ fontSize: fs(10), fontWeight: 800, color: P.accentD, textTransform: "uppercase", letterSpacing: .4, marginBottom: 5 }}>
          {lang === "ku" ? "Sernav" : lang === "en" ? "Title" : "Başlık"}
        </div>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          style={{
            width: "100%", padding: "8px 12px", borderRadius: 7,
            border: "1.5px solid rgba(30,41,59,.15)",
            fontSize: fs(13), fontFamily: "inherit",
            outline: "none", boxSizing: "border-box",
          }}/>
      </div>

      {/* Veri girişi */}
      <div style={{ padding: 14, borderRadius: 10, background: "#fff", border: "1px solid rgba(30,41,59,.08)", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: fs(10), fontWeight: 800, color: P.accentD, textTransform: "uppercase", letterSpacing: .4 }}>
            {lang === "ku" ? "Dane" : lang === "en" ? "Data" : "Veri"}
          </div>
          <button onClick={addRow} style={{
            padding: "5px 12px", borderRadius: 6, border: "none",
            background: P.accent, color: "#fff", cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(11), fontWeight: 700,
          }}>+ {lang === "ku" ? "Rêz" : lang === "en" ? "Row" : "Satır"}</button>
        </div>

        {/* Satırlar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px", gap: 6, fontSize: fs(9), fontWeight: 700, color: P.textSoft, textTransform: "uppercase", letterSpacing: .4, marginBottom: -2 }}>
            <div>{lang === "ku" ? "Kategorî" : lang === "en" ? "Category" : "Kategori"}</div>
            <div>{lang === "ku" ? "Nirx" : lang === "en" ? "Value" : "Değer"}</div>
            <div/>
          </div>
          {entries.map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 28px", gap: 6 }}>
              <input type="text" value={row.cat} onChange={e => updateRow(i, "cat", e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 6, border: "1.5px solid rgba(30,41,59,.12)",
                  fontSize: fs(12), fontFamily: "inherit", outline: "none" }}/>
              <input type="number" step="0.1" value={row.val} onChange={e => updateRow(i, "val", e.target.value)}
                style={{ padding: "6px 10px", borderRadius: 6, border: "1.5px solid rgba(30,41,59,.12)",
                  fontSize: fs(12), fontFamily: "inherit", outline: "none" }}/>
              <button onClick={() => removeRow(i)} aria-label="Sil"
                style={{ width: 28, height: 30, borderRadius: 6, border: "1.5px solid rgba(239,68,68,.3)",
                  background: "rgba(239,68,68,.08)", color: "#dc2626", cursor: "pointer", fontFamily: "inherit",
                  fontSize: fs(13), padding: 0 }}>×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Önizleme */}
      <div style={{ padding: 18, borderRadius: 12, background: "#fff", border: "1px solid rgba(30,41,59,.08)" }}>
        <div style={{ fontSize: fs(10), fontWeight: 800, color: P.accentD, textTransform: "uppercase", letterSpacing: .4, marginBottom: 10 }}>
          👁 {lang === "ku" ? "Pêşdîtin" : lang === "en" ? "Preview" : "Önizleme"}
        </div>
        {valid.length < 1 ? (
          <div style={{ padding: 30, textAlign: "center", color: P.textSoft, fontSize: fs(12), fontStyle: "italic" }}>
            {lang === "ku" ? "Ji bo pêşdîtinê herî kêm yek rêz daneyê têkevîne" : lang === "en" ? "Enter at least one data row for preview" : "Önizleme için en az bir satır veri gir"}
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            {chartType === "bar" && <BarChart data={chartData} colorblindMode={colorblind}/>}
            {chartType === "line" && <LineChart data={chartData} colorblindMode={colorblind}/>}
            {chartType === "pie" && <PieChart data={chartData} colorblindMode={colorblind}/>}
          </div>
        )}
      </div>

      {/* İpucu */}
      <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(59,130,246,.05)",
        border: "1px solid rgba(59,130,246,.15)", fontSize: fs(11), color: P.accentD, lineHeight: 1.6 }}>
        💡 {lang === "ku"
          ? "Grafîka rast hilbijêre: darik ji bo berawirdkirinê, xet ji bo zeman, keka ji bo par/rêjeyê."
          : lang === "en"
          ? "Pick the right chart: bar for comparison, line for time, pie for proportion."
          : "Doğru grafiği seç: karşılaştırma için çubuk, zaman için çizgi, oran için pasta."}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// OLASILIK MODÜLÜ — Zar, para, torba
// Pedagojik: Deney olasılığı (bağıl frekans) vs. teorik olasılık
// Yasası büyük sayılar: deneme arttıkça deney→teori yakınsar
// ═══════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════
// GÖRSEL SAMPLER — TinkerPlots (Konold & Miller 2005) tarzı
// Öğrenci torbayı GÖRÜR, TASARLAR, TOP ÇEKER.
// Soyut sayılar değil, somut renkli toplar.

export function VisualSampler({ lang, t, tt, colorblind }) {
  const fs = useFS();
  // Renk paleti — 6 temel renk (renk körü moda uyumlu olabilir)
  const COLOR_PALETTE = colorblind ? [
    { id: "c1", color: "#E69F00", name: { tr: "Turuncu", ku: "Sorkîrî", en: "Orange" } },
    { id: "c2", color: "#56B4E9", name: { tr: "Açık Mavi", ku: "Şînê zelal", en: "Sky Blue" } },
    { id: "c3", color: "#009E73", name: { tr: "Yeşil", ku: "Kesk", en: "Green" } },
    { id: "c4", color: "#F0E442", name: { tr: "Sarı", ku: "Zer", en: "Yellow" } },
    { id: "c5", color: "#0072B2", name: { tr: "Mavi", ku: "Şîn", en: "Blue" } },
    { id: "c6", color: "#D55E00", name: { tr: "Kırmızı", ku: "Sor", en: "Red" } },
  ] : [
    { id: "c1", color: "#ef4444", name: { tr: "Kırmızı", ku: "Sor", en: "Red" } },
    { id: "c2", color: "#3b82f6", name: { tr: "Mavi", ku: "Şîn", en: "Blue" } },
    { id: "c3", color: "#10b981", name: { tr: "Yeşil", ku: "Kesk", en: "Green" } },
    { id: "c4", color: "#f59e0b", name: { tr: "Sarı", ku: "Zer", en: "Yellow" } },
    { id: "c5", color: "#8b5cf6", name: { tr: "Mor", ku: "Mor", en: "Purple" } },
    { id: "c6", color: "#ec4899", name: { tr: "Pembe", ku: "Pembê", en: "Pink" } },
  ];

  // Torba içeriği: [{colorId, count}]
  const [bag, setBag] = useState([
    { colorId: "c1", count: 3 },
    { colorId: "c2", count: 5 },
    { colorId: "c3", count: 2 },
  ]);
  const [draws, setDraws] = useState([]); // [colorId, ...]
  const [extracted, setExtracted] = useState(null); // {colorId, ts} — animasyon için
  const [autoRun, setAutoRun] = useState(false);
  const [replaceMode, setReplaceMode] = useState(true); // iadeli (çekilen geri konur) / iadesiz

  const total = bag.reduce((s, b) => s + b.count, 0);

  // Rastgele bir top çek (ağırlıklı)
  function drawOne() {
    if (total === 0) return;
    let r = Math.random() * total;
    let pickedColorId = bag[0].colorId;
    for (const b of bag) {
      if (r < b.count) { pickedColorId = b.colorId; break; }
      r -= b.count;
    }
    setExtracted({ colorId: pickedColorId, ts: Date.now() });
    setDraws(d => [...d, pickedColorId]);
    // Animasyonu 700ms sonra temizle
    setTimeout(() => setExtracted(null), 700);
    // İadesizse torbadan çıkar
    if (!replaceMode) {
      setBag(b => b.map(it => it.colorId === pickedColorId
        ? { ...it, count: Math.max(0, it.count - 1) }
        : it).filter(it => it.count > 0));
    }
  }

  // Auto run
  useEffect(() => {
    if (!autoRun) return;
    if (!replaceMode && total === 0) { setAutoRun(false); return; }
    const id = setInterval(() => drawOne(), 300);
    return () => clearInterval(id);
    // eslint-disable-next-line
  }, [autoRun, total, replaceMode]);

  function reset() {
    setDraws([]);
    setExtracted(null);
    setAutoRun(false);
  }
  function resetBag() {
    setBag([
      { colorId: "c1", count: 3 },
      { colorId: "c2", count: 5 },
      { colorId: "c3", count: 2 },
    ]);
    reset();
  }

  function incColor(colorId) {
    setBag(b => {
      const exists = b.find(it => it.colorId === colorId);
      if (exists) return b.map(it => it.colorId === colorId ? { ...it, count: it.count + 1 } : it);
      return [...b, { colorId, count: 1 }];
    });
  }
  function decColor(colorId) {
    setBag(b => b.map(it => it.colorId === colorId
      ? { ...it, count: Math.max(0, it.count - 1) }
      : it).filter(it => it.count > 0));
  }

  // Torba render: SVG torba şekli + içinde toplar
  // Toplar deterministik yerleşim — her index için sabit pozisyon
  const W = 340, H = 280;
  const bagLeft = 60, bagRight = 280, bagTop = 60, bagBot = 255;
  // Tüm topları düz liste haline getir
  const ballList = [];
  bag.forEach(b => {
    const color = COLOR_PALETTE.find(c => c.id === b.colorId);
    for (let i = 0; i < b.count; i++) ballList.push({ colorId: b.colorId, color: color?.color || "#64748b" });
  });

  // Yeni yerleşim: Piramit/sıvı şekli — alt satır 5 top, yukarıya doğru aynı veya azalır
  // Her satır yatay olarak ortalanır → kavanozun yuvarlak alt kısmına uyar
  const ballR = 10;
  const stepX = 26;   // yatay adım (ball çapı + aralık)
  const stepY = 21;   // dikey adım
  const bagCenterX = (bagLeft + bagRight) / 2;

  // Satır başına top sayısı — alt sıralar 5, üst sıralar aşamalı olarak azalır
  // Toplam ~25 top için: [5,5,5,4,4,3,3,2,2] desenine uyar
  function colsInRow(r) {
    if (r < 2) return 5;        // en alt 2 satır: 5'er top
    if (r < 4) return 5;        // sonraki 2 satır: 5'er top
    if (r < 6) return 4;        // sonraki 2 satır: 4'er top
    if (r < 8) return 3;        // sonraki 2: 3 top
    return 2;                   // en üst: 2
  }

  function ballPos(i) {
    // i'yi satır + satır-içi-index'e çevir
    let idx = i, row = 0;
    while (idx >= colsInRow(row)) {
      idx -= colsInRow(row);
      row++;
    }
    const n = colsInRow(row);
    // Hexagonal offset — yarım adım (çift/tek satırlara göre)
    const offset = (row % 2 === 1) ? stepX / 2 : 0;
    // Her satır, n topla ortalanır; offset hexagonal kilitlenmeye yardımcı olur
    const totalWidth = (n - 1) * stepX;
    const startX = bagCenterX - totalWidth / 2 + offset * 0.3;
    const x = startX + idx * stepX;
    const y = bagBot - 18 - row * stepY;
    return { x, y };
  }

  // Sayım — useMemo ile çekim sayısı değişene kadar yeniden hesaplanmaz
  const { counts, n } = useMemo(() => {
    const c = {};
    COLOR_PALETTE.forEach(col => c[col.id] = 0);
    draws.forEach(cid => { c[cid] = (c[cid] || 0) + 1; });
    return { counts: c, n: draws.length };
  }, [draws]);

  return (
    <div>
      {/* SVG Torba + Toplar */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 440, height: "auto", display: "block" }}>
          {/* Torba gölgesi */}
          <ellipse cx={170} cy={263} rx={115} ry={8} fill="rgba(0,0,0,.08)"/>

          {/* Torba gövdesi — kumaş görünümü */}
          <defs>
            <linearGradient id="bagGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f1f5f9"/>
              <stop offset="100%" stopColor="#cbd5e1"/>
            </linearGradient>
          </defs>
          <path
            d={`M ${bagLeft - 5} ${bagTop + 15}
                Q ${bagLeft - 5} ${bagBot + 5} ${170} ${bagBot + 5}
                Q ${bagRight + 5} ${bagBot + 5} ${bagRight + 5} ${bagTop + 15}
                L ${bagRight} ${bagTop}
                Q ${170} ${bagTop - 10} ${bagLeft} ${bagTop}
                Z`}
            fill="url(#bagGrad)"
            stroke="#94a3b8"
            strokeWidth={2}/>

          {/* Torba ipleri */}
          <path d={`M ${bagLeft + 15} ${bagTop + 5} Q ${170} ${bagTop - 18} ${bagRight - 15} ${bagTop + 5}`}
            fill="none" stroke="#64748b" strokeWidth={1.5} strokeDasharray="3,3"/>

          {/* Torba ağzı */}
          <ellipse cx={170} cy={bagTop} rx={105} ry={8}
            fill="#1e293b" opacity={0.15}/>

          {/* Kavanoz iç alanı — toplar bunun dışına taşırsa kırpılır */}
          <defs>
            <clipPath id="jarInterior">
              <path d={`M ${bagLeft - 2} ${bagTop + 16}
                        Q ${bagLeft - 2} ${bagBot + 2} ${170} ${bagBot + 2}
                        Q ${bagRight + 2} ${bagBot + 2} ${bagRight + 2} ${bagTop + 16}
                        L ${bagRight + 2} ${bagTop + 3}
                        Q ${170} ${bagTop - 6} ${bagLeft - 2} ${bagTop + 3}
                        Z`}/>
            </clipPath>
          </defs>

          {/* Toplar — kavanoz içi clip ile */}
          <g clipPath="url(#jarInterior)">
            {ballList.map((ball, i) => {
              const pos = ballPos(i);
              // Taşma güvenliği: çok üstte veya çok yanlarda render etme
              if (pos.y < bagTop + 14) return null;
              if (pos.x < bagLeft + 5 || pos.x > bagRight - 5) return null;
              return (
                <g key={i}>
                  {/* Gölge altta */}
                  <ellipse cx={pos.x} cy={pos.y + ballR - 1} rx={ballR - 2} ry={2}
                    fill="#000" fillOpacity={0.12}/>
                  {/* Ana top */}
                  <circle cx={pos.x} cy={pos.y} r={ballR}
                    fill={ball.color} fillOpacity={0.95}
                    stroke="#fff" strokeWidth={1.2}/>
                  {/* Parlaklık */}
                  <ellipse cx={pos.x - ballR * 0.3} cy={pos.y - ballR * 0.4}
                    rx={ballR * 0.35} ry={ballR * 0.22}
                    fill="#fff" fillOpacity={0.5}/>
                </g>
              );
            })}
          </g>

          {/* Çekilen top — torba üstünde büyük */}
          {extracted && (() => {
            const color = COLOR_PALETTE.find(c => c.id === extracted.colorId);
            return (
              <g>
                {/* Parıltı */}
                <circle cx={170} cy={25} r={28}
                  fill={color?.color || "#64748b"} fillOpacity={0.15}/>
                <circle cx={170} cy={25} r={18}
                  fill={color?.color || "#64748b"}
                  stroke="#fff" strokeWidth={2.5}>
                  <animate attributeName="cy" from={bagTop + 5} to={25} dur="0.35s" fill="freeze"/>
                </circle>
                <ellipse cx={165} cy={20} rx={6} ry={4}
                  fill="#fff" fillOpacity={0.5}/>
                <text x={170} y={52} textAnchor="middle"
                  style={{ fontSize: fs(11), fontWeight: 800, fill: color?.color || "#64748b", fontFamily: "system-ui" }}>
                  {tt(color?.name || { tr: "?" })}!
                </text>
              </g>
            );
          })()}

          {/* Toplam sayısı */}
          <text x={W - 10} y={H - 5} textAnchor="end"
            style={{ fontSize: fs(10), fontWeight: 700, fill: P.textSoft, fontFamily: "system-ui" }}>
            n = {total} {lang === "ku" ? "top" : lang === "en" ? "balls" : "top"}
          </text>
        </svg>
      </div>

      {/* Çekim butonları */}
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 12 }}>
        <button onClick={drawOne} disabled={total === 0 || autoRun}
          style={{
            padding: "10px 22px", borderRadius: 9, border: "none",
            background: total === 0 || autoRun ? "rgba(30,41,59,.1)" : `linear-gradient(135deg,${P.accent},${P.accentD})`,
            color: total === 0 || autoRun ? P.textSoft : "#fff",
            cursor: total === 0 || autoRun ? "default" : "pointer", fontFamily: "inherit",
            fontSize: fs(13), fontWeight: 800,
            boxShadow: total === 0 || autoRun ? "none" : "0 2px 10px rgba(59,130,246,.3)",
          }}>
          🎯 {lang === "ku" ? "Top Bikşîne" : lang === "en" ? "Draw" : "Top Çek"}
        </button>
        <button onClick={() => {
          for (let i = 0; i < 10; i++) setTimeout(drawOne, i * 60);
        }} disabled={total === 0 || autoRun}
          style={{
            padding: "10px 16px", borderRadius: 9, border: "none",
            background: total === 0 || autoRun ? "rgba(30,41,59,.1)" : P.accent,
            color: total === 0 || autoRun ? P.textSoft : "#fff",
            cursor: total === 0 || autoRun ? "default" : "pointer", fontFamily: "inherit",
            fontSize: fs(12), fontWeight: 800,
          }}>+10</button>
        <button onClick={() => setAutoRun(a => !a)} disabled={total === 0}
          style={{
            padding: "10px 14px", borderRadius: 9, border: "none",
            background: autoRun ? "#ef4444" : "#10b981",
            color: "#fff", cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(12), fontWeight: 800,
          }}>{autoRun ? "⏸" : "▶"}</button>
        <button onClick={reset}
          style={{
            padding: "10px 14px", borderRadius: 9, border: "1.5px solid rgba(30,41,59,.15)",
            background: "#fff", color: P.textSoft, cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(11), fontWeight: 700,
          }}>↺</button>
      </div>

      {/* İadeli/İadesiz toggle */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <label style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "6px 12px", borderRadius: 7,
          background: "rgba(59,130,246,.06)", cursor: "pointer",
          fontSize: fs(11), color: P.accentD, fontWeight: 600,
        }}>
          <input type="checkbox" checked={replaceMode} onChange={e => setReplaceMode(e.target.checked)}
            style={{ cursor: "pointer", accentColor: P.accent }}/>
          {lang === "ku"
            ? "Bi paşvegerandin (top vegere ser tûrikê)"
            : lang === "en"
            ? "With replacement (ball goes back)"
            : "İadeli (top torbaya geri)"}
        </label>
      </div>

      {/* Torba tasarım paneli */}
      <div style={{
        padding: 14, borderRadius: 10, marginBottom: 12,
        background: "#fff", border: "1px solid rgba(30,41,59,.08)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: fs(11), fontWeight: 800, color: P.accentD, textTransform: "uppercase", letterSpacing: .4 }}>
            🎨 {lang === "ku" ? "Tûrika Xwe Sêwirîne" : lang === "en" ? "Design your bag" : "Torbayı tasarla"}
          </div>
          <button onClick={resetBag} style={{
            padding: "4px 10px", borderRadius: 6, border: "1px solid rgba(30,41,59,.15)",
            background: "#fff", color: P.textSoft, cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(10), fontWeight: 700,
          }}>↺</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {COLOR_PALETTE.map(c => {
            const item = bag.find(b => b.colorId === c.id);
            const count = item ? item.count : 0;
            return (
              <div key={c.id} style={{
                padding: "8px 10px", borderRadius: 8,
                background: count > 0 ? c.color + "12" : "rgba(30,41,59,.03)",
                border: "1.5px solid " + (count > 0 ? c.color + "50" : "rgba(30,41,59,.08)"),
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: c.color, flexShrink: 0,
                  boxShadow: "inset -2px -2px 3px rgba(0,0,0,.15), inset 2px 2px 3px rgba(255,255,255,.4)",
                }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: fs(10), fontWeight: 700, color: P.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {tt(c.name)}
                  </div>
                  <div style={{ fontSize: fs(9), color: P.textSoft, fontWeight: 600 }}>
                    {count > 0 && total > 0 ? `${count} (${Math.round((count / total) * 100)}%)` : "0"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 3 }}>
                  <button onClick={() => decColor(c.id)} disabled={count === 0}
                    style={{
                      width: 22, height: 22, borderRadius: 5, border: "none",
                      background: count === 0 ? "rgba(30,41,59,.08)" : "rgba(239,68,68,.15)",
                      color: count === 0 ? P.textSoft : "#dc2626",
                      cursor: count === 0 ? "default" : "pointer",
                      fontFamily: "inherit", fontSize: fs(12), fontWeight: 800,
                      padding: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>−</button>
                  <button onClick={() => incColor(c.id)}
                    style={{
                      width: 22, height: 22, borderRadius: 5, border: "none",
                      background: c.color, color: "#fff",
                      cursor: "pointer",
                      fontFamily: "inherit", fontSize: fs(12), fontWeight: 800,
                      padding: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>+</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sonuçlar tablosu */}
      {n > 0 && (
        <div style={{
          padding: 12, borderRadius: 10,
          background: "#fff", border: "1px solid rgba(30,41,59,.08)", marginBottom: 10,
        }}>
          <div style={{ fontSize: fs(11), fontWeight: 800, color: P.accentD, textTransform: "uppercase", letterSpacing: .4, marginBottom: 8 }}>
            📊 {lang === "ku" ? "Encamên canlî" : lang === "en" ? "Live results" : "Canlı sonuçlar"} (n={n})
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {COLOR_PALETTE.filter(c => counts[c.id] > 0 || bag.find(b => b.colorId === c.id)).map(c => {
              const cnt = counts[c.id] || 0;
              const freq = n ? cnt / n : 0;
              const theory = total > 0 ? (bag.find(b => b.colorId === c.id)?.count || 0) / total : 0;
              const diff = (freq - theory) * 100;
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: fs(10.5) }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: c.color, flexShrink: 0 }}/>
                  <span style={{ width: 60, fontWeight: 700, color: P.text, flexShrink: 0 }}>{tt(c.name)}</span>
                  <div style={{ flex: 1, height: 12, background: "rgba(30,41,59,.06)", borderRadius: 3, overflow: "hidden", display: "flex" }}>
                    <div style={{ width: (freq * 100) + "%", background: c.color, opacity: 0.8, transition: "width .2s" }}/>
                  </div>
                  <span style={{ width: 60, fontWeight: 700, textAlign: "right", color: P.textSoft }}>
                    {cnt} ({(freq * 100).toFixed(0)}%)
                  </span>
                  {n >= 10 && (
                    <span style={{ fontSize: fs(9), fontWeight: 700, color: Math.abs(diff) < 5 ? "#10b981" : "#ef4444", width: 36, textAlign: "right" }}>
                      {diff >= 0 ? "+" : ""}{diff.toFixed(0)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {n >= 10 && (
            <div style={{ fontSize: fs(9), color: P.textSoft, fontStyle: "italic", marginTop: 6, textAlign: "center" }}>
              {lang === "ku"
                ? "Sonda: Sapma teorîk vs deneyî (%). Zêde ceribandin = kêmtir sapma."
                : lang === "en"
                ? "Rightmost: deviation theory vs experiment (%). More trials = less deviation."
                : "Sağdaki: teori vs deney sapması (%). Daha çok deneme = daha az sapma."}
            </div>
          )}
        </div>
      )}

      {/* Son çekilenler şeridi */}
      {draws.length > 0 && (
        <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(59,130,246,.04)" }}>
          <div style={{ fontSize: fs(9), fontWeight: 700, color: P.textSoft, marginBottom: 4 }}>
            {lang === "ku" ? "Dawîn 25 çekim" : lang === "en" ? "Last 25 draws" : "Son 25 çekim"}
          </div>
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            {draws.slice(-25).map((cid, i) => {
              const c = COLOR_PALETTE.find(p => p.id === cid);
              return (
                <div key={i} style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: c?.color || "#64748b",
                  border: "1px solid rgba(0,0,0,.05)",
                }}/>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════

export function ProbabilityModule({ lang, t, tt, colorblind }) {
  const fs = useFS();
  // Mod: "visual" (TinkerPlots sampler) veya "classic" (tablolu)
  const [mode, setMode] = useState("visual");
  const [experiment, setExperiment] = useState("coin");
  // Her deney için sonuç dizisi
  const [results, setResults] = useState([]); // örn: coin için ["H","T","H",...]; dice için [1,6,3,...]
  const [autoRun, setAutoRun] = useState(false);

  useEffect(() => {
    setResults([]);
  }, [experiment]);

  // Auto run
  useEffect(() => {
    if (!autoRun) return;
    const id = setInterval(() => roll(), 150);
    return () => clearInterval(id);
  }, [autoRun, experiment, results.length]);

  function roll() {
    if (experiment === "coin") {
      setResults(r => [...r, Math.random() < 0.5 ? "H" : "T"]);
    } else if (experiment === "dice") {
      setResults(r => [...r, Math.floor(Math.random() * 6) + 1]);
    } else if (experiment === "bag") {
      // Torba: 3K (kırmızı), 5M (mavi), 2Y (yeşil) toplam 10
      const r = Math.random() * 10;
      const color = r < 3 ? "R" : r < 8 ? "B" : "G";
      setResults(rs => [...rs, color]);
    }
  }
  function reset() {
    setResults([]);
    setAutoRun(false);
  }

  // Teorik olasılıklar
  const theory = experiment === "coin"
    ? { H: 0.5, T: 0.5 }
    : experiment === "dice"
    ? { 1: 1/6, 2: 1/6, 3: 1/6, 4: 1/6, 5: 1/6, 6: 1/6 }
    : { R: 0.3, B: 0.5, G: 0.2 };

  const keys = Object.keys(theory);
  // useMemo — results değişene kadar sayım yeniden yapılmaz
  const { counts, n } = useMemo(() => {
    const c = {};
    keys.forEach(k => c[k] = 0);
    results.forEach(r => { if (c[String(r)] !== undefined) c[String(r)]++; });
    return { counts: c, n: results.length };
  }, [results, experiment]);

  const labels = {
    H: { tr: "Yazı", ku: "Nivîs", en: "Heads" },
    T: { tr: "Tura", ku: "Şêwe", en: "Tails" },
    R: { tr: "Kırmızı", ku: "Sor", en: "Red" },
    B: { tr: "Mavi", ku: "Şîn", en: "Blue" },
    G: { tr: "Yeşil", ku: "Kesk", en: "Green" },
  };
  const colorMap = { H: "#3b82f6", T: "#10b981", R: "#ef4444", B: "#3b82f6", G: "#10b981",
    "1": "#3b82f6", "2": "#10b981", "3": "#f59e0b", "4": "#ef4444", "5": "#8b5cf6", "6": "#ec4899" };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: fs(20), fontWeight: 800, color: P.text, marginTop: 0, marginBottom: 6 }}>
        🎲 {lang === "ku" ? "Îhtîmal" : lang === "en" ? "Probability" : "Olasılık"}
      </h1>
      <p style={{ fontSize: fs(12), color: P.textSoft, marginTop: 0, marginBottom: 14, lineHeight: 1.6 }}>
        {lang === "ku"
          ? "Ceribandinê bimeşîne — bi her gerê îhtîmala deneyî (canlı) ber bi îhtîmala teorîk (rastî) diçe."
          : lang === "en"
          ? "Run experiments — with each trial, experimental probability approaches theoretical probability."
          : "Deney yap — her denemede, deney olasılığı teorik olasılığa yaklaşır."}
      </p>

      {/* Mod seçici — Görsel / Klasik */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        <button onClick={() => setMode("visual")}
          style={{
            flex: 1, padding: "10px 12px", borderRadius: 9,
            border: "2px solid " + (mode === "visual" ? P.accent : "rgba(30,41,59,.15)"),
            background: mode === "visual" ? P.accentL : "#fff",
            color: mode === "visual" ? P.accentD : P.text,
            cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(12), fontWeight: mode === "visual" ? 800 : 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
          <span>🎨</span>
          <span>{lang === "ku" ? "Görsel (Tûrik)" : lang === "en" ? "Visual (Bag)" : "Görsel (Torba)"}</span>
        </button>
        <button onClick={() => setMode("classic")}
          style={{
            flex: 1, padding: "10px 12px", borderRadius: 9,
            border: "2px solid " + (mode === "classic" ? P.accent : "rgba(30,41,59,.15)"),
            background: mode === "classic" ? P.accentL : "#fff",
            color: mode === "classic" ? P.accentD : P.text,
            cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(12), fontWeight: mode === "classic" ? 800 : 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
          <span>📊</span>
          <span>{lang === "ku" ? "Klasîk (Tablo)" : lang === "en" ? "Classic (Table)" : "Klasik (Tablo)"}</span>
        </button>
      </div>

      {/* GÖRSEL MOD — TinkerPlots tarzı sampler */}
      {mode === "visual" && (
        <VisualSampler lang={lang} t={t} tt={tt} colorblind={colorblind}/>
      )}

      {/* Pedagojik not — her modda ortak */}
      {mode === "visual" && (
        <>
          <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: "rgba(124,58,237,.06)",
            border: "1px solid rgba(124,58,237,.2)", fontSize: fs(11), color: "#581c87", lineHeight: 1.6 }}>
            💡 <strong>{lang === "ku" ? "Qanûna hejmarên mezin" : lang === "en" ? "Law of large numbers" : "Büyük sayılar yasası"}:</strong>{" "}
            {lang === "ku"
              ? "Her ku zêde top dikşînî, sonda cudahiya teorîk vs deneyî kêm dibe. Ceribandinê bike: 10 top, paşê 100, paşê 500."
              : lang === "en"
              ? "More draws → experimental frequency converges to theoretical. Try 10, 100, 500 draws."
              : "Daha çok top çektikçe, deneysel frekans teorik olasılığa yaklaşır. 10, 100, 500 dene."}
          </div>
          <div style={{ marginTop: 6, padding: "6px 10px", fontSize: fs(9), color: P.textSoft, fontStyle: "italic", textAlign: "center" }}>
            📖 Konold & Miller (2005) TinkerPlots Sampler · Bernoulli (1713) · GAISE 2020
          </div>
        </>
      )}

      {/* KLASİK MOD — Eski tablolu görünüm */}
      {mode === "classic" && <>

      {/* Deney seçici */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[
          { id: "coin", label: { tr: "Para", ku: "Pere", en: "Coin" }, icon: "🪙" },
          { id: "dice", label: { tr: "Zar", ku: "Zar", en: "Die" }, icon: "🎲" },
          { id: "bag", label: { tr: "Torba (3K 5M 2Y)", ku: "Tûrik (3S 5Ş 2K)", en: "Bag (3R 5B 2G)" }, icon: "👜" },
        ].map(opt => {
          const isSel = experiment === opt.id;
          return (
            <button key={opt.id} onClick={() => setExperiment(opt.id)}
              style={{
                flex: 1, padding: "10px 8px", borderRadius: 9,
                border: "2px solid " + (isSel ? P.accent : "rgba(30,41,59,.15)"),
                background: isSel ? P.accentL : "#fff",
                color: isSel ? P.accentD : P.text,
                cursor: "pointer", fontFamily: "inherit",
                fontSize: fs(11.5), fontWeight: isSel ? 800 : 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
              <span style={{ fontSize: fs(16) }}>{opt.icon}</span>
              <span>{tt(opt.label)}</span>
            </button>
          );
        })}
      </div>

      {/* Ana panel: teorik vs deney */}
      <div style={{ padding: 18, borderRadius: 12, background: "#fff", border: "1px solid rgba(30,41,59,.08)", marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ fontSize: fs(12), fontWeight: 800, color: P.text }}>
            n = {n} {lang === "ku" ? "ceribandin" : lang === "en" ? "trials" : "deneme"}
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            <button onClick={roll} disabled={autoRun} style={{
              padding: "6px 14px", borderRadius: 7, border: "none",
              background: autoRun ? "rgba(30,41,59,.1)" : P.accent,
              color: autoRun ? P.textSoft : "#fff", cursor: autoRun ? "default" : "pointer",
              fontFamily: "inherit", fontSize: fs(11), fontWeight: 800,
            }}>+1</button>
            <button onClick={() => {
              for (let i = 0; i < 10; i++) {
                setTimeout(() => roll(), i * 20);
              }
            }} disabled={autoRun} style={{
              padding: "6px 14px", borderRadius: 7, border: "none",
              background: autoRun ? "rgba(30,41,59,.1)" : P.accent,
              color: autoRun ? P.textSoft : "#fff", cursor: autoRun ? "default" : "pointer",
              fontFamily: "inherit", fontSize: fs(11), fontWeight: 800,
            }}>+10</button>
            <button onClick={() => setAutoRun(a => !a)} style={{
              padding: "6px 12px", borderRadius: 7, border: "none",
              background: autoRun ? "#ef4444" : "#10b981", color: "#fff", cursor: "pointer",
              fontFamily: "inherit", fontSize: fs(11), fontWeight: 800,
            }}>{autoRun ? "⏸" : "▶"}</button>
            <button onClick={reset} style={{
              padding: "6px 10px", borderRadius: 7, border: "1.5px solid rgba(30,41,59,.15)",
              background: "#fff", color: P.textSoft, cursor: "pointer", fontFamily: "inherit",
              fontSize: fs(11), fontWeight: 700,
            }}>↺</button>
          </div>
        </div>

        {/* Yan yana teori ve deney çubukları */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Teorik */}
          <div>
            <div style={{ fontSize: fs(10), fontWeight: 800, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: .4, marginBottom: 6, textAlign: "center" }}>
              📐 {lang === "ku" ? "Teorîk" : lang === "en" ? "Theoretical" : "Teorik"}
            </div>
            {keys.map(k => {
              const p = theory[k];
              return (
                <div key={k} style={{ marginBottom: 5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: fs(10), fontWeight: 700, color: P.textSoft, marginBottom: 2 }}>
                    <span>{labels[k] ? tt(labels[k]) : k}</span>
                    <span>{(p * 100).toFixed(1)}%</span>
                  </div>
                  <div style={{ height: 14, background: "rgba(30,41,59,.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: (p * 100) + "%", height: "100%", background: "#8b5cf6", opacity: 0.7 }}/>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Deney */}
          <div>
            <div style={{ fontSize: fs(10), fontWeight: 800, color: P.accent, textTransform: "uppercase", letterSpacing: .4, marginBottom: 6, textAlign: "center" }}>
              🧪 {lang === "ku" ? "Deneyî" : lang === "en" ? "Experimental" : "Deneysel"}
            </div>
            {keys.map(k => {
              const c = counts[k] || 0;
              const freq = n ? c / n : 0;
              const diff = (freq - theory[k]) * 100;
              return (
                <div key={k} style={{ marginBottom: 5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: fs(10), fontWeight: 700, color: P.textSoft, marginBottom: 2 }}>
                    <span>{labels[k] ? tt(labels[k]) : k} ({c})</span>
                    <span>
                      {n > 0 ? (freq * 100).toFixed(1) + "%" : "—"}
                      {n > 0 && <span style={{ color: Math.abs(diff) < 5 ? "#10b981" : "#ef4444", marginLeft: 4, fontSize: fs(9) }}>
                        ({diff >= 0 ? "+" : ""}{diff.toFixed(1)})
                      </span>}
                    </span>
                  </div>
                  <div style={{ height: 14, background: "rgba(30,41,59,.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: (freq * 100) + "%", height: "100%", background: colorMap[k] || P.accent, transition: "width .2s" }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Son atışlar şeridi */}
        {results.length > 0 && (
          <div style={{ marginTop: 12, padding: "8px 10px", borderRadius: 7, background: "rgba(59,130,246,.04)" }}>
            <div style={{ fontSize: fs(9), fontWeight: 700, color: P.textSoft, marginBottom: 4 }}>
              {lang === "ku" ? "Dawîn 20 ceribandin" : lang === "en" ? "Last 20 trials" : "Son 20 deneme"}
            </div>
            <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {results.slice(-20).map((r, i) => (
                <span key={i} style={{
                  width: 22, height: 22, borderRadius: 5,
                  background: colorMap[String(r)] || P.accent,
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: fs(10), fontWeight: 800,
                }}>{r}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pedagojik not */}
      <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(124,58,237,.06)",
        border: "1px solid rgba(124,58,237,.2)", fontSize: fs(11), color: "#581c87", lineHeight: 1.6 }}>
        💡 <strong>{lang === "ku" ? "Qanûna hejmarên mezin" : lang === "en" ? "Law of large numbers" : "Büyük sayılar yasası"}:</strong>{" "}
        {lang === "ku"
          ? "Ceribandin zêde bibin, îhtîmala deneyî nêzîktir dibe îhtîmala teorîk. 10 ceribandinê bikin, paşê 100, paşê 500 — guherandinê bibînin."
          : lang === "en"
          ? "As trials increase, experimental probability approaches theoretical. Try 10 trials, then 100, then 500 — see the convergence."
          : "Deneme sayısı arttıkça deney olasılığı teorik olasılığa yaklaşır. 10 dene, sonra 100, sonra 500 — yakınsamayı gör."}
      </div>
      <div style={{ marginTop: 6, padding: "6px 10px", fontSize: fs(9), color: P.textSoft, fontStyle: "italic" }}>
        📖 Bernoulli (1713), GAISE 2020 — Olasılık modellemesi: teori ↔ deney köprüsü.
      </div>
      </>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// VERİ TOPLA MODÜLÜ — Basit sınıf anketi
// Öğretmen: soru + seçenek tanımlar, öğrenciler oy kullanır, canlı grafik
// PPDAC tam döngü: P1 Problem → P2 Plan → D Data → A Analyze → C Conclude

export function CollectModule({ lang, t, tt, colorblind }) {
  const fs = useFS();
  // localStorage'dan yükle
  const [survey, setSurvey] = useState(() => {
    try {
      const s = localStorage.getItem("dv_survey");
      return s ? JSON.parse(s) : {
        question: lang === "ku" ? "Rengê te yê delal çi ye?" : lang === "en" ? "What's your favorite color?" : "En sevdiğin renk nedir?",
        options: lang === "ku" ? ["Sor", "Şîn", "Kesk", "Zer"] : lang === "en" ? ["Red", "Blue", "Green", "Yellow"] : ["Kırmızı", "Mavi", "Yeşil", "Sarı"],
        votes: [0, 0, 0, 0],
      };
    } catch (e) {
      return { question: "", options: [], votes: [] };
    }
  });
  useEffect(() => {
    try { localStorage.setItem("dv_survey", JSON.stringify(survey)); } catch (e) {}
  }, [survey]);

  const [mode, setMode] = useState("collect"); // collect | setup

  function vote(i) {
    setSurvey(s => ({
      ...s,
      votes: s.votes.map((v, j) => j === i ? v + 1 : v)
    }));
  }
  function reset() {
    setSurvey(s => ({ ...s, votes: s.votes.map(() => 0) }));
  }

  function updateQ(q) {
    setSurvey(s => ({ ...s, question: q }));
  }
  function updateOpt(i, v) {
    setSurvey(s => ({ ...s, options: s.options.map((o, j) => j === i ? v : o) }));
  }
  function addOpt() {
    setSurvey(s => ({ ...s, options: [...s.options, ""], votes: [...s.votes, 0] }));
  }
  function removeOpt(i) {
    setSurvey(s => ({
      ...s,
      options: s.options.filter((_, j) => j !== i),
      votes: s.votes.filter((_, j) => j !== i),
    }));
  }

  const totalVotes = survey.votes.reduce((a, b) => a + b, 0);
  const chartData = {
    title: survey.question,
    categories: survey.options,
    values: survey.votes,
  };

  // En popüler cevap
  const topIdx = survey.votes.indexOf(Math.max(...survey.votes));
  const topAnswer = survey.options[topIdx];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: fs(20), fontWeight: 800, color: P.text, marginTop: 0, marginBottom: 6 }}>
        📋 {lang === "ku" ? "Dane Berhev Bike" : lang === "en" ? "Collect Data" : "Veri Topla"}
      </h1>
      <p style={{ fontSize: fs(12), color: P.textSoft, marginTop: 0, marginBottom: 14, lineHeight: 1.6 }}>
        {lang === "ku"
          ? "Anketa sinifê — pirs bipirse, bersivan berhev bike, encamê bibîne. Hemû PPDAC dorê."
          : lang === "en"
          ? "Class survey — ask a question, collect answers, see results. Full PPDAC cycle."
          : "Sınıf anketi — soru sor, cevap topla, sonucu gör. Tam PPDAC döngüsü."}
      </p>

      {/* PPDAC rozetleri */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 14 }}>
        {PPDAC_PHASES.map(p => (
          <span key={p.id} style={{
            fontSize: fs(9), fontWeight: 700, color: P.accentD,
            background: P.accentL, padding: "3px 8px", borderRadius: 10,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <span>{p.icon}</span>
            <span>{tt(p.name)}</span>
          </span>
        ))}
      </div>

      {/* Mod seçici */}
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <button onClick={() => setMode("setup")}
          style={{
            flex: 1, padding: "9px", borderRadius: 8,
            border: "2px solid " + (mode === "setup" ? P.accent : "rgba(30,41,59,.15)"),
            background: mode === "setup" ? P.accentL : "#fff",
            color: mode === "setup" ? P.accentD : P.text,
            cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(12), fontWeight: mode === "setup" ? 800 : 600,
          }}>
          ⚙ {lang === "ku" ? "Anketê saz bike" : lang === "en" ? "Setup survey" : "Anket hazırla"}
        </button>
        <button onClick={() => setMode("collect")}
          style={{
            flex: 1, padding: "9px", borderRadius: 8,
            border: "2px solid " + (mode === "collect" ? P.accent : "rgba(30,41,59,.15)"),
            background: mode === "collect" ? P.accentL : "#fff",
            color: mode === "collect" ? P.accentD : P.text,
            cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(12), fontWeight: mode === "collect" ? 800 : 600,
          }}>
          ✋ {lang === "ku" ? "Deng berhev bike" : lang === "en" ? "Collect votes" : "Oy topla"}
        </button>
      </div>

      {/* Setup modu */}
      {mode === "setup" && (
        <div style={{ padding: 16, borderRadius: 10, background: "#fff", border: "1px solid rgba(30,41,59,.08)", marginBottom: 12 }}>
          <div style={{ fontSize: fs(10), fontWeight: 800, color: P.accentD, marginBottom: 5, textTransform: "uppercase", letterSpacing: .4 }}>
            ❓ {lang === "ku" ? "Pirs" : lang === "en" ? "Question" : "Soru"}
          </div>
          <input type="text" value={survey.question} onChange={e => updateQ(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", borderRadius: 7, border: "1.5px solid rgba(30,41,59,.15)",
              fontSize: fs(13), fontFamily: "inherit", outline: "none", boxSizing: "border-box", marginBottom: 12 }}/>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: fs(10), fontWeight: 800, color: P.accentD, textTransform: "uppercase", letterSpacing: .4 }}>
              ☑ {lang === "ku" ? "Bijare" : lang === "en" ? "Options" : "Seçenekler"}
            </div>
            <button onClick={addOpt} style={{
              padding: "4px 10px", borderRadius: 6, border: "none",
              background: P.accent, color: "#fff", cursor: "pointer", fontFamily: "inherit",
              fontSize: fs(10), fontWeight: 700,
            }}>+ {lang === "ku" ? "Bijareyek" : lang === "en" ? "Option" : "Seçenek"}</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {survey.options.map((opt, i) => (
              <div key={i} style={{ display: "flex", gap: 6 }}>
                <input type="text" value={opt} onChange={e => updateOpt(i, e.target.value)}
                  placeholder={lang === "ku" ? "Bijareyê têkevîne..." : lang === "en" ? "Enter option..." : "Seçenek gir..."}
                  style={{ flex: 1, padding: "7px 10px", borderRadius: 6, border: "1.5px solid rgba(30,41,59,.12)",
                    fontSize: fs(12), fontFamily: "inherit", outline: "none" }}/>
                <button onClick={() => removeOpt(i)} aria-label="Sil"
                  style={{ width: 30, borderRadius: 6, border: "1.5px solid rgba(239,68,68,.3)",
                    background: "rgba(239,68,68,.08)", color: "#dc2626", cursor: "pointer", fontFamily: "inherit",
                    fontSize: fs(14) }}>×</button>
              </div>
            ))}
          </div>

          <button onClick={reset} style={{
            marginTop: 12, width: "100%", padding: "8px", borderRadius: 7,
            border: "1.5px solid rgba(239,68,68,.3)", background: "rgba(239,68,68,.05)",
            color: "#dc2626", cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(11), fontWeight: 700,
          }}>
            ↺ {lang === "ku" ? "Dengan rake" : lang === "en" ? "Reset votes" : "Oyları sıfırla"}
          </button>
        </div>
      )}

      {/* Collect modu */}
      {mode === "collect" && (
        <>
          {/* Soru kartı */}
          <div style={{ padding: 18, borderRadius: 12, background: "linear-gradient(135deg,#fef3c7,#fde68a)",
            border: "2px solid #f59e0b", marginBottom: 14 }}>
            <div style={{ fontSize: fs(9), fontWeight: 800, color: "#78350f", textTransform: "uppercase", letterSpacing: .4, marginBottom: 5 }}>
              ❓ {lang === "ku" ? "Pirs" : lang === "en" ? "Question" : "Soru"}
            </div>
            <div style={{ fontSize: fs(16), fontWeight: 800, color: "#78350f", lineHeight: 1.4 }}>
              {survey.question || (lang === "ku" ? "Pirsek tune" : lang === "en" ? "No question set" : "Soru yok")}
            </div>
          </div>

          {/* Oy butonları */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 14 }}>
            {survey.options.map((opt, i) => {
              const count = survey.votes[i];
              const color = (colorblind ? P.okabe : ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"])[i % 6];
              return (
                <button key={i} onClick={() => vote(i)}
                  style={{
                    padding: "14px 12px", borderRadius: 10,
                    border: "2px solid " + color,
                    background: color + "15", color: color,
                    cursor: "pointer", fontFamily: "inherit",
                    fontSize: fs(13), fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: "all .1s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = color + "25"}
                  onMouseLeave={e => e.currentTarget.style.background = color + "15"}>
                  <span>{opt || `Opt ${i + 1}`}</span>
                  <span style={{
                    minWidth: 28, padding: "2px 8px", borderRadius: 10,
                    background: color, color: "#fff", fontSize: fs(12), fontWeight: 800,
                  }}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Canlı grafik */}
          {totalVotes > 0 && (
            <div style={{ padding: 16, borderRadius: 10, background: "#fff", border: "1px solid rgba(30,41,59,.08)", marginBottom: 12 }}>
              <div style={{ fontSize: fs(10), fontWeight: 800, color: P.accentD, textTransform: "uppercase", letterSpacing: .4, marginBottom: 8 }}>
                📊 {lang === "ku" ? "Canlı grafîk" : lang === "en" ? "Live graph" : "Canlı grafik"} (n={totalVotes})
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <BarChart data={chartData} colorblindMode={colorblind}/>
              </div>
            </div>
          )}

          {/* PPDAC-C Sonuç */}
          {totalVotes >= 3 && (
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(16,185,129,.08)",
              border: "1px solid rgba(16,185,129,.3)", marginBottom: 10 }}>
              <div style={{ fontSize: fs(10), fontWeight: 800, color: "#065f46", textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>
                💡 {lang === "ku" ? "Encam (Conclude)" : lang === "en" ? "Conclude" : "Sonuç (Conclude)"}
              </div>
              <div style={{ fontSize: fs(12), color: "#065f46", lineHeight: 1.5 }}>
                {lang === "ku"
                  ? `"${topAnswer}" bersiva herî populer e (${survey.votes[topIdx]}/${totalVotes} deng, %${Math.round((survey.votes[topIdx] / totalVotes) * 100)}).`
                  : lang === "en"
                  ? `"${topAnswer}" is the most popular answer (${survey.votes[topIdx]}/${totalVotes} votes, ${Math.round((survey.votes[topIdx] / totalVotes) * 100)}%).`
                  : `"${topAnswer}" en popüler cevap (${survey.votes[topIdx]}/${totalVotes} oy, %${Math.round((survey.votes[topIdx] / totalVotes) * 100)}).`}
              </div>
              {totalVotes < 20 && (
                <div style={{ fontSize: fs(10), color: "#065f46", marginTop: 5, opacity: 0.8, fontStyle: "italic" }}>
                  ⚠ {lang === "ku"
                    ? "Nimûne biçûk e (n<20). Tê texmîn kirin ku ev ne temsîlî ye."
                    : lang === "en"
                    ? `Small sample (n<20). Results may not be representative.`
                    : "Örneklem küçük (n<20). Sonuçlar temsili olmayabilir."}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div style={{ padding: "8px 10px", fontSize: fs(9), color: P.textSoft, fontStyle: "italic", textAlign: "center" }}>
        📖 Wild & Pfannkuch (1999) — PPDAC: Problem → Plan → Data → Analyze → Conclude
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SAÇILIM VERİ SETLERİ — iki değişken arası ilişki
// Her veri seti: gerçekçi / öğretici + pedagojik mesaj
// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// GERÇEK VERİ SETLERİ — Türkiye
// Kaynaklar (tam erişim tarihi kodda her veri setinin "source" alanında):
//   • TÜİK (Türkiye İstatistik Kurumu) — nüfus verileri
//   • MGM (Meteoroloji Genel Müdürlüğü) — iklim normalleri 1991-2020
//   • MEB/OECD — PISA 2022 sonuçları
//
// Pedagojik amaç: "Bu veri nereden?", "Ne zaman toplandı?", "Kim topladı?"
// sorularını sormayı öğretmek (GAISE 2020, WGOITG yaklaşımı)

export function RelateModule({ lang, t, tt, colorblind, noticeWonderOn, onCorrect, onAttempt }) {
  const fs = useFS();
  const [idx, setIdx] = useState(0);
  const [showTrend, setShowTrend] = useState(false);
  const [showCorrelation, setShowCorrelation] = useState(false);
  const [showLesson, setShowLesson] = useState(false);
  const [nwDone, setNwDone] = useState(!noticeWonderOn);

  const ds = SCATTER_DATASETS[idx % SCATTER_DATASETS.length];
  const resolvedData = {
    title: tt(ds.title),
    xLabel: tt(ds.xLabel),
    yLabel: tt(ds.yLabel),
    points: ds.points,
  };

  // Yeni dataset seçildiğinde N&W'yi sıfırla (noticeWonderOn ise)
  useEffect(() => {
    setNwDone(!noticeWonderOn);
  }, [idx, noticeWonderOn]);

  function nextDataset() {
    setIdx(i => i + 1);
    setShowTrend(false);
    setShowCorrelation(false);
    setShowLesson(false);
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: fs(20), fontWeight: 800, color: P.text, marginTop: 0, marginBottom: 6 }}>
        🔗 {lang === "ku" ? "Têkilî (Saçılım)" : lang === "en" ? "Relate (Scatter)" : "İlişki (Saçılım)"}
      </h1>
      <p style={{ fontSize: fs(12), color: P.textSoft, marginTop: 0, marginBottom: 14, lineHeight: 1.6 }}>
        {lang === "ku"
          ? "Du guherbar li hember hev: gelo têkiliyek heye? Lê baldar be — korelasyon NE nedensellîk e!"
          : lang === "en"
          ? "Two variables against each other: is there a relationship? But beware — correlation is NOT causation!"
          : "İki değişken karşılıklı: aralarında ilişki var mı? Ama dikkat — korelasyon NEDENSELLİK DEĞİLDİR!"}
      </p>

      {/* Veri seti navigasyonu */}
      <div style={{ display: "flex", gap: 5, marginBottom: 12, flexWrap: "wrap" }}>
        {SCATTER_DATASETS.map((d, i) => (
          <button key={d.id} onClick={() => { setIdx(i); setShowTrend(false); setShowCorrelation(false); setShowLesson(false); }}
            style={{
              padding: "6px 10px", borderRadius: 7,
              border: "1.5px solid " + (idx === i ? P.accent : "rgba(30,41,59,.12)"),
              background: idx === i ? P.accentL : "#fff",
              color: idx === i ? P.accentD : P.textSoft,
              cursor: "pointer", fontFamily: "inherit",
              fontSize: fs(10.5), fontWeight: idx === i ? 800 : 600,
            }}>
            {tt(d.title)}
          </button>
        ))}
      </div>

      {/* Veri tanımı + seviye rozeti */}
      <div style={{
        padding: "10px 14px", borderRadius: 8, marginBottom: 10,
        background: "rgba(59,130,246,.05)", border: "1px solid rgba(59,130,246,.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: fs(11.5), fontWeight: 700, color: P.accentD, flex: 1 }}>
            {tt(ds.title)}
          </span>
          <LevelBadge level={ds.curcioLevel} lang={lang}/>
        </div>
        <div style={{ fontSize: fs(11), color: P.accentD, lineHeight: 1.55 }}>
          ℹ️ {tt(ds.description)}
        </div>
      </div>

      {/* Notice & Wonder — yeni dataset açılışında (noticeWonderOn ise) */}
      {noticeWonderOn && !nwDone && (
        <NoticeWonderStage
          actId={`relate_${ds.id}`}
          lang={lang}
          t={t}
          graph={
            <ScatterPlot
              data={resolvedData}
              showTrend={false}
              showCorrelation={false}
              colorblindMode={colorblind}
            />
          }
          onDone={() => setNwDone(true)}
        />
      )}

      {/* Ana grafik kartı — N&W bitince */}
      {nwDone && (<>
      <div style={{ padding: 18, borderRadius: 12, background: "#fff",
        border: "1px solid rgba(30,41,59,.08)", marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <ScatterPlot
            data={resolvedData}
            showTrend={showTrend}
            showCorrelation={showCorrelation}
            colorblindMode={colorblind}
          />
        </div>

        {/* Kontroller */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => setShowTrend(s => !s)} style={{
            padding: "7px 14px", borderRadius: 7,
            border: "1.5px solid " + (showTrend ? "#ef4444" : "rgba(30,41,59,.15)"),
            background: showTrend ? "rgba(239,68,68,.08)" : "#fff",
            color: showTrend ? "#991b1b" : P.textSoft,
            cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(11), fontWeight: 700,
          }}>
            {showTrend ? "✓ " : ""}📉 {lang === "ku" ? "Xeta meylê" : lang === "en" ? "Trend line" : "Trend çizgisi"}
          </button>
          <button onClick={() => setShowCorrelation(s => !s)} style={{
            padding: "7px 14px", borderRadius: 7,
            border: "1.5px solid " + (showCorrelation ? P.accent : "rgba(30,41,59,.15)"),
            background: showCorrelation ? P.accentL : "#fff",
            color: showCorrelation ? P.accentD : P.textSoft,
            cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(11), fontWeight: 700,
          }}>
            {showCorrelation ? "✓ " : ""}📊 r {lang === "ku" ? "nîşan bide" : lang === "en" ? "show" : "göster"}
          </button>
          <button onClick={() => {
            const willShow = !showLesson;
            setShowLesson(willShow);
            // İlk kez Ders açıldığında etkinlik tamamlanmış sayılır
            if (willShow) {
              if (onCorrect) onCorrect(10);
              if (onAttempt) onAttempt(`relate_${ds.id}`, true);
            }
          }} style={{
            padding: "7px 14px", borderRadius: 7,
            border: "1.5px solid " + (showLesson ? "#8b5cf6" : "rgba(30,41,59,.15)"),
            background: showLesson ? "rgba(139,92,246,.08)" : "#fff",
            color: showLesson ? "#6d28d9" : P.textSoft,
            cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(11), fontWeight: 700,
          }}>
            {showLesson ? "✓ " : ""}💡 {lang === "ku" ? "Ders" : lang === "en" ? "Lesson" : "Ders"}
          </button>
        </div>
      </div>

      {/* Korelasyon etiketi */}
      {showCorrelation && (() => {
        const r = pearson(ds.points.map(p => p.x), ds.points.map(p => p.y));
        const label = correlationLabel(r, lang);
        return (
          <div style={{
            padding: "12px 14px", borderRadius: 10, marginBottom: 10,
            background: r > 0.3 ? "rgba(16,185,129,.08)" : r < -0.3 ? "rgba(239,68,68,.08)" : "rgba(30,41,59,.04)",
            border: "1px solid " + (r > 0.3 ? "rgba(16,185,129,.3)" : r < -0.3 ? "rgba(239,68,68,.3)" : "rgba(30,41,59,.1)"),
          }}>
            <div style={{ fontSize: fs(11), fontWeight: 800, color: r > 0.3 ? "#065f46" : r < -0.3 ? "#991b1b" : P.text, marginBottom: 3 }}>
              Pearson r = {r.toFixed(3)} — <span style={{ fontWeight: 700, textTransform: "capitalize" }}>{label}</span>
            </div>
            <div style={{ fontSize: fs(10.5), color: P.textSoft, lineHeight: 1.5, fontStyle: "italic" }}>
              {lang === "ku"
                ? "r = -1: têkiliya negatîf a tekûz · r = 0: tu têkilî tune · r = +1: têkiliya pozîtîf a tekûz"
                : lang === "en"
                ? "r = -1: perfect negative · r = 0: no relation · r = +1: perfect positive"
                : "r = -1: mükemmel negatif · r = 0: ilişki yok · r = +1: mükemmel pozitif"}
            </div>
          </div>
        );
      })()}

      {/* Pedagojik ders paneli — KRİTİK: korelasyon ≠ nedensellik */}
      {showLesson && (
        <div style={{
          padding: 14, borderRadius: 10, marginBottom: 10,
          background: ds.causal ? "linear-gradient(135deg,#ecfdf5,#d1fae5)" : "linear-gradient(135deg,#fef2f2,#fee2e2)",
          border: "2px solid " + (ds.causal ? "#10b981" : "#ef4444"),
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: fs(20) }}>{ds.causal ? "✓" : "🚨"}</span>
            <div style={{ fontSize: fs(12), fontWeight: 800, color: ds.causal ? "#065f46" : "#991b1b" }}>
              {ds.causal
                ? (lang === "ku" ? "Nedensellik mentîqî" : lang === "en" ? "Causation plausible" : "Nedensellik mantıklı")
                : (lang === "ku" ? "Korelasyon ≠ Nedensellik" : lang === "en" ? "Correlation ≠ Causation" : "Korelasyon ≠ Nedensellik")}
            </div>
          </div>
          <div style={{ fontSize: fs(11.5), color: ds.causal ? "#065f46" : "#991b1b", lineHeight: 1.6 }}>
            {tt(ds.lesson)}
          </div>
        </div>
      )}

      {/* Sonraki */}
      <button onClick={nextDataset} style={{
        width: "100%", padding: 11, borderRadius: 9, border: "none",
        background: `linear-gradient(135deg,${P.accent},${P.accentD})`, color: "#fff",
        cursor: "pointer", fontFamily: "inherit", fontSize: fs(12.5), fontWeight: 800,
        boxShadow: "0 2px 8px rgba(59,130,246,.25)",
        marginBottom: 12,
      }}>
        {lang === "ku" ? "Daneyê paşê →" : lang === "en" ? "Next dataset →" : "Sonraki veri seti →"}
      </button>

      {/* Genel pedagojik uyarı */}
      <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(124,58,237,.06)",
        border: "1px solid rgba(124,58,237,.2)", fontSize: fs(11), color: "#581c87", lineHeight: 1.6 }}>
        <strong>📖 {lang === "ku" ? "Bîranîn" : lang === "en" ? "Remember" : "Unutma"}:</strong>{" "}
        {lang === "ku"
          ? "Du tişt bi hev ve bin, divê ne wateya wê ye ku yek dibe sedema ya din. Dibe ku guherbareke sêyem her du jî bandor bike (confounder)."
          : lang === "en"
          ? "Two things varying together doesn't mean one CAUSES the other. A third variable may affect both (confounder)."
          : "İki şey birlikte değişiyorsa biri diğerine SEBEP değildir zorunlu olarak. Üçüncü bir değişken ikisini de etkiliyor olabilir (karıştırıcı)."}
      </div>
      <div style={{ marginTop: 6, padding: "6px 10px", fontSize: fs(9), color: P.textSoft, fontStyle: "italic", textAlign: "center" }}>
        📚 Pearson (1896) · Simpson (1951) · Tyler Vigen's "Spurious Correlations" (2015)
      </div>
      </>)}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// GRAFİK TÜRLERİ KATALOĞU — 10 temel görselleştirme türü
// Her tip: küçük SVG ikonu + 3 dilde açıklama + "ne için uygun" + örnek
// Kaynaklar: Schwabish (2021) Better Data Visualizations · Tufte (2001)
// ═══════════════════════════════════════════════════════════════════


export function WorldModule({ lang, t, tt, colorblind, noticeWonderOn, onCorrect, onAttempt }) {
  const fs = useFS();
  const [idx, setIdx] = useState(0);
  const [stage, setStage] = useState("context"); // context | nw | analyze | lesson
  const [openQ, setOpenQ] = useState({}); // soru cevapları {0: true, 1: false, ...}
  const [nwDone, setNwDone] = useState(!noticeWonderOn);

  const act = WORLD_ACTIVITIES[idx % WORLD_ACTIVITIES.length];

  // Etkinlik değişince state sıfırla
  useEffect(() => {
    setStage("context");
    setOpenQ({});
    setNwDone(!noticeWonderOn);
  }, [idx, noticeWonderOn]);

  // N&W tamamlanınca otomatik analiz'e geç
  useEffect(() => {
    if (stage === "nw" && nwDone) setStage("analyze");
  }, [stage, nwDone]);

  const resolvedData = {
    title: tt(act.title),
    categories: act.data.categories,
    values: act.data.values,
  };

  const graphEl = act.chartType === "line"
    ? <LineChart data={{ ...resolvedData, yLabel: tt(act.yLabel) }}/>
    : <BarChart data={resolvedData} colorblindMode={colorblind}/>;

  function nextActivity() {
    setIdx(i => (i + 1) % WORLD_ACTIVITIES.length);
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Başlık */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h1 style={{ fontSize: fs(20), fontWeight: 800, color: P.text, margin: 0 }}>
          🌍 {lang === "ku" ? "Cîhan" : lang === "en" ? "World" : "Dünya"}
        </h1>
        <span style={{ fontSize: fs(11), fontWeight: 700, color: P.textSoft }}>
          {(idx % WORLD_ACTIVITIES.length) + 1}/{WORLD_ACTIVITIES.length}
        </span>
      </div>
      <p style={{ fontSize: fs(12), color: P.textSoft, marginTop: 0, marginBottom: 14, lineHeight: 1.6 }}>
        {lang === "ku"
          ? "Grafîkên ji cîhana rastîn — nûçe, lêkolîn, dane. Çavdêrî bike, bifikire, fam bike."
          : lang === "en"
          ? "Real-world graphs — news, research, data. Observe, think, understand."
          : "Gerçek dünyadan grafikler — haber, araştırma, veri. Gözle, düşün, anla."}
      </p>

      {/* Etkinlik seçici */}
      <div style={{ display: "flex", gap: 5, marginBottom: 12, flexWrap: "wrap" }}>
        {WORLD_ACTIVITIES.map((a, i) => (
          <button key={a.id} onClick={() => setIdx(i)}
            style={{
              padding: "5px 9px", borderRadius: 6,
              border: "1.5px solid " + (idx === i ? a.badgeColor : "rgba(30,41,59,.12)"),
              background: idx === i ? a.badgeColor + "15" : "#fff",
              color: idx === i ? a.badgeColor : P.textSoft,
              cursor: "pointer", fontFamily: "inherit",
              fontSize: fs(10), fontWeight: idx === i ? 800 : 600,
            }}>
            {tt(a.badge)}
          </button>
        ))}
      </div>

      {/* Başlık ve Curcio seviye rozeti */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: fs(16), fontWeight: 800, color: P.text, margin: 0, lineHeight: 1.3, flex: 1 }}>
          {tt(act.title)}
        </h2>
        <LevelBadge level={act.curcioLevel} lang={lang}/>
      </div>

      {/* Aşama 1: BAĞLAM — öğrenci önce arka planı okur */}
      {stage === "context" && (
        <>
          <div style={{
            padding: 14, borderRadius: 12, marginBottom: 12,
            background: act.badgeColor + "0a",
            border: "1.5px solid " + act.badgeColor + "40",
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <span style={{
                fontSize: fs(10), fontWeight: 800, color: "#fff",
                background: act.badgeColor,
                padding: "3px 10px", borderRadius: 10,
              }}>
                {tt(act.badge)}
              </span>
              <span style={{ fontSize: fs(9), color: P.textSoft, fontStyle: "italic" }}>
                📚 {act.source} · {act.date}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <SpeakButton text={act.context[lang] || act.context.tr} size="md"/>
              <div style={{ flex: 1, fontSize: fs(12.5), color: P.text, lineHeight: 1.65 }}>
                {act.context[lang] || act.context.tr}
              </div>
            </div>
          </div>
          <button onClick={() => setStage(noticeWonderOn ? "nw" : "analyze")} style={{
            width: "100%", padding: 12, borderRadius: 10, border: "none",
            background: `linear-gradient(135deg,${act.badgeColor},${act.badgeColor}dd)`,
            color: "#fff", cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(13), fontWeight: 800,
          }}>
            {noticeWonderOn
              ? (lang === "ku" ? "Grafîkê Binêre →" : lang === "en" ? "Look at the Graph →" : "Grafiğe Bak →")
              : (lang === "ku" ? "Pirsên Analîzê →" : lang === "en" ? "Analysis Questions →" : "Analiz Sorularına →")}
          </button>
        </>
      )}

      {/* Aşama 2: NOTICE & WONDER */}
      {stage === "nw" && noticeWonderOn && !nwDone && (
        <NoticeWonderStage
          actId={act.id}
          lang={lang}
          t={t}
          graph={graphEl}
          onDone={() => setNwDone(true)}
        />
      )}

      {/* Aşama 3: ANALİZ — grafik + 3 soru */}
      {stage === "analyze" && (
        <>
          <div style={{ padding: 16, borderRadius: 12, background: "#fff",
            border: "1px solid rgba(30,41,59,.08)", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              {graphEl}
            </div>
          </div>

          <div style={{ fontSize: fs(11), fontWeight: 800, color: P.accentD, textTransform: "uppercase", letterSpacing: .4, marginBottom: 8 }}>
            🧩 {lang === "ku" ? "Pirsên Analîzê" : lang === "en" ? "Analysis Questions" : "Analiz Soruları"}
          </div>

          {act.questions.map((qa, qi) => {
            const isOpen = openQ[qi];
            return (
              <div key={qi} style={{
                padding: 12, borderRadius: 9,
                background: "#fff",
                border: "1.5px solid " + (isOpen ? "#10b981" : "rgba(30,41,59,.1)"),
                marginBottom: 8,
              }}>
                <div style={{ display: "flex", gap: 8, marginBottom: isOpen ? 8 : 0 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: isOpen ? "#10b981" : "rgba(30,41,59,.08)",
                    color: isOpen ? "#fff" : P.textSoft,
                    fontSize: fs(11), fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>{qi + 1}</span>
                  <div style={{ flex: 1, fontSize: fs(12), color: P.text, lineHeight: 1.55, fontWeight: 600 }}>
                    {qa.q[lang] || qa.q.tr}
                  </div>
                  <SpeakButton text={qa.q[lang] || qa.q.tr} size="sm"/>
                </div>
                {isOpen && (
                  <div style={{
                    marginLeft: 30, padding: "8px 12px",
                    background: "rgba(16,185,129,.08)",
                    borderRadius: 7, borderLeft: "3px solid #10b981",
                    fontSize: fs(11.5), color: "#065f46", lineHeight: 1.6,
                  }}>
                    💡 {qa.a[lang] || qa.a.tr}
                  </div>
                )}
                {!isOpen && (
                  <button onClick={() => {
                    setOpenQ(o => ({ ...o, [qi]: true }));
                    if (onAttempt) onAttempt(`world_${act.id}_q${qi}`, true);
                  }}
                    style={{
                      marginLeft: 30, marginTop: 4, padding: "4px 10px",
                      borderRadius: 6, border: "1px dashed rgba(16,185,129,.4)",
                      background: "transparent", color: "#10b981",
                      cursor: "pointer", fontFamily: "inherit",
                      fontSize: fs(10), fontWeight: 700,
                    }}>
                    💡 {lang === "ku" ? "Bersivê Bibîne" : lang === "en" ? "Show answer" : "Cevabı gör"}
                  </button>
                )}
              </div>
            );
          })}

          <button onClick={() => {
            setStage("lesson");
            // Tüm etkinliği "tamamlandı" olarak işaretle + puan ver
            if (onCorrect) onCorrect(15);
            if (onAttempt) onAttempt(`world_${act.id}_complete`, true);
          }} style={{
            width: "100%", padding: 12, borderRadius: 10, border: "none",
            background: `linear-gradient(135deg,${act.badgeColor},${act.badgeColor}dd)`,
            color: "#fff", cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(13), fontWeight: 800, marginTop: 8,
          }}>
            📖 {lang === "ku" ? "Der̄sê Bibîne →" : lang === "en" ? "See Lesson →" : "Dersi Gör →"}
          </button>
        </>
      )}

      {/* Aşama 4: DERS */}
      {stage === "lesson" && (
        <>
          <div style={{ padding: 14, borderRadius: 12, background: "#fff",
            border: "1px solid rgba(30,41,59,.08)", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              {graphEl}
            </div>
          </div>
          <div style={{
            padding: 16, borderRadius: 12, marginBottom: 12,
            background: "linear-gradient(135deg," + act.badgeColor + "10," + act.badgeColor + "20)",
            border: "2px solid " + act.badgeColor,
          }}>
            <div style={{ fontSize: fs(13), fontWeight: 800, color: act.badgeColor, marginBottom: 8 }}>
              💡 {lang === "ku" ? "Der̄s" : lang === "en" ? "Lesson" : "Ders"}
            </div>
            <div style={{ fontSize: fs(12), color: P.text, lineHeight: 1.65 }}>
              {act.lesson[lang] || act.lesson.tr}
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => { setStage("context"); setOpenQ({}); setNwDone(!noticeWonderOn); }}
              style={{
                flex: 1, padding: 11, borderRadius: 9, border: "1.5px solid rgba(30,41,59,.15)",
                background: "#fff", color: P.textSoft, cursor: "pointer", fontFamily: "inherit",
                fontSize: fs(12), fontWeight: 700,
              }}>
              ↺ {lang === "ku" ? "Dîsa" : lang === "en" ? "Restart" : "Tekrar"}
            </button>
            <button onClick={nextActivity} style={{
              flex: 2, padding: 11, borderRadius: 9, border: "none",
              background: `linear-gradient(135deg,${P.accent},${P.accentD})`,
              color: "#fff", cursor: "pointer", fontFamily: "inherit",
              fontSize: fs(12.5), fontWeight: 800,
              boxShadow: "0 2px 10px rgba(59,130,246,.3)",
            }}>
              {lang === "ku" ? "Etkînliya Paşê →" : lang === "en" ? "Next Activity →" : "Sonraki Etkinlik →"}
            </button>
          </div>
        </>
      )}

      {/* İlerleme noktaları */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 14 }}>
        {["context", noticeWonderOn ? "nw" : null, "analyze", "lesson"].filter(Boolean).map((s, i) => (
          <div key={i} style={{
            width: stage === s ? 18 : 6, height: 6, borderRadius: 3,
            background: stage === s ? act.badgeColor : "rgba(30,41,59,.15)",
            transition: "all .2s",
          }}/>
        ))}
      </div>

      {/* Kaynak */}
      <div style={{ marginTop: 10, padding: "6px 10px", fontSize: fs(9), color: P.textSoft, fontStyle: "italic", textAlign: "center" }}>
        📖 NYTimes/ASA "What's Going On in This Graph?" (2017–) pedagojisi
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// TANI MODÜLÜ — Grafik türü tanıma oyunu (PolicyViz Match-It tarzı)
// 2 oyun modu: "Bu ne?" ve "Hangisi uygun?"

export function RecognizeModule({ lang, t, tt, onCorrect, onAttempt }) {
  const fs = useFS();
  const [gameMode, setGameMode] = useState("identify"); // identify | pick
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // "correct" | "wrong"
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Identify modu: rastgele bir grafik türü seç, 4 şık oluştur (1 doğru + 3 yanlış)
  const [identifyQ, setIdentifyQ] = useState(() => generateIdentifyQ());

  function generateIdentifyQ() {
    const correctIdx = Math.floor(Math.random() * GRAPH_TYPES.length);
    const correct = GRAPH_TYPES[correctIdx];
    // 3 yanlış seç
    const wrongs = [];
    const pool = GRAPH_TYPES.filter((_, i) => i !== correctIdx);
    while (wrongs.length < 3 && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      wrongs.push(pool[idx]);
      pool.splice(idx, 1);
    }
    const options = [correct, ...wrongs].sort(() => Math.random() - 0.5);
    return { correct, options };
  }

  function nextQuestion() {
    setSelected(null);
    setFeedback(null);
    if (gameMode === "identify") {
      setIdentifyQ(generateIdentifyQ());
    } else {
      setQIdx(i => (i + 1) % SCENARIO_QUESTIONS.length);
    }
  }

  function handleAnswer(optId, correctId) {
    if (feedback) return;
    setSelected(optId);
    const isCorrect = optId === correctId;
    setFeedback(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setScore(s => s + 10);
      setStreak(s => s + 1);
      if (onCorrect) onCorrect(5); // tutarlı puanlama App'e
    } else {
      setStreak(0);
    }
    // Etkinlik tamamlama: mod + soru idx birleşik id
    const actId = gameMode === "identify"
      ? `recognize_identify_${identifyQ.correct.id}`
      : `recognize_pick_${qIdx}`;
    if (onAttempt) onAttempt(actId, isCorrect);
  }

  // Mod değişince sıfırla
  useEffect(() => {
    setSelected(null);
    setFeedback(null);
    if (gameMode === "identify") setIdentifyQ(generateIdentifyQ());
    else setQIdx(0);
  }, [gameMode]);

  const scQ = SCENARIO_QUESTIONS[qIdx];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h1 style={{ fontSize: fs(20), fontWeight: 800, color: P.text, margin: 0 }}>
          🧠 {lang === "ku" ? "Grafîk Nas Bike" : lang === "en" ? "Recognize Graphs" : "Grafik Tanı"}
        </h1>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {streak > 1 && (
            <span style={{ fontSize: fs(10), fontWeight: 800, color: "#f59e0b",
              background: "rgba(245,158,11,.15)", padding: "2px 8px", borderRadius: 10 }}>
              🔥 {streak}
            </span>
          )}
          <span style={{ fontSize: fs(11), fontWeight: 800, color: P.accentD,
            background: P.accentL, padding: "3px 10px", borderRadius: 10 }}>
            {score} {t("score")}
          </span>
        </div>
      </div>
      <p style={{ fontSize: fs(12), color: P.textSoft, marginTop: 0, marginBottom: 14, lineHeight: 1.6 }}>
        {lang === "ku"
          ? "Gelek curê grafîk hene. Her kes ji bo daneyeke cuda guncav e. Nas bikirin û hilbijêrin!"
          : lang === "en"
          ? "Many graph types exist. Each fits a different kind of data. Recognize and choose!"
          : "Çok farklı grafik türü var. Her biri farklı veriye uygundur. Tanıyalım ve seçelim!"}
      </p>

      {/* Mod seçici */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <button onClick={() => setGameMode("identify")}
          style={{
            flex: 1, padding: "10px 8px", borderRadius: 9,
            border: "2px solid " + (gameMode === "identify" ? P.accent : "rgba(30,41,59,.15)"),
            background: gameMode === "identify" ? P.accentL : "#fff",
            color: gameMode === "identify" ? P.accentD : P.text,
            cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(11.5), fontWeight: gameMode === "identify" ? 800 : 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          }}>
          🔍 {lang === "ku" ? "Ev çi ye?" : lang === "en" ? "What is this?" : "Bu ne?"}
        </button>
        <button onClick={() => setGameMode("pick")}
          style={{
            flex: 1, padding: "10px 8px", borderRadius: 9,
            border: "2px solid " + (gameMode === "pick" ? P.accent : "rgba(30,41,59,.15)"),
            background: gameMode === "pick" ? P.accentL : "#fff",
            color: gameMode === "pick" ? P.accentD : P.text,
            cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(11.5), fontWeight: gameMode === "pick" ? 800 : 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          }}>
          🎯 {lang === "ku" ? "Kîjan guncav e?" : lang === "en" ? "Which fits?" : "Hangisi uygun?"}
        </button>
      </div>

      {/* MOD 1: IDENTIFY — grafik göster, türünü seç */}
      {gameMode === "identify" && (
        <>
          <div style={{ padding: 18, borderRadius: 12, background: "#fff",
            border: "1px solid rgba(30,41,59,.08)", marginBottom: 10 }}>
            <div style={{ fontSize: fs(11), fontWeight: 800, color: P.textSoft, marginBottom: 10, textTransform: "uppercase", letterSpacing: .4 }}>
              {lang === "ku" ? "Ev çi curê grafîk e?" : lang === "en" ? "What type is this graph?" : "Bu hangi tür grafik?"}
            </div>
            <div style={{ display: "flex", justifyContent: "center", padding: "10px 0", background: "rgba(59,130,246,.03)", borderRadius: 8 }}>
              {GRAPH_ICONS[identifyQ.correct.id]}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            {identifyQ.options.map(opt => {
              const isSel = selected === opt.id;
              const isCorrect = opt.id === identifyQ.correct.id;
              const showCorrect = feedback && isCorrect;
              const showWrong = feedback && isSel && !isCorrect;
              return (
                <button key={opt.id}
                  onClick={() => handleAnswer(opt.id, identifyQ.correct.id)}
                  disabled={!!feedback}
                  style={{
                    padding: "12px 14px", borderRadius: 9,
                    border: "2px solid " + (
                      showCorrect ? "#10b981"
                        : showWrong ? "#ef4444"
                        : isSel ? P.accent
                        : "rgba(30,41,59,.12)"
                    ),
                    background: showCorrect ? "rgba(16,185,129,.08)"
                      : showWrong ? "rgba(239,68,68,.08)"
                      : isSel ? P.accentL
                      : "#fff",
                    color: showCorrect ? "#065f46"
                      : showWrong ? "#991b1b"
                      : P.text,
                    cursor: feedback ? "default" : "pointer",
                    fontFamily: "inherit", fontSize: fs(12), fontWeight: 700,
                    textAlign: "left", lineHeight: 1.4,
                  }}>
                  {showCorrect && "✓ "}{showWrong && "✗ "}{tt(opt.name)}
                </button>
              );
            })}
          </div>

          {feedback && (
            <div style={{
              padding: 14, borderRadius: 10, marginBottom: 10,
              background: feedback === "correct" ? "rgba(16,185,129,.08)" : "rgba(239,68,68,.08)",
              border: "1.5px solid " + (feedback === "correct" ? "#10b981" : "#ef4444"),
            }}>
              <div style={{ fontSize: fs(11), fontWeight: 800,
                color: feedback === "correct" ? "#065f46" : "#991b1b", marginBottom: 6 }}>
                {feedback === "correct"
                  ? (lang === "ku" ? "✓ Rast!" : lang === "en" ? "✓ Correct!" : "✓ Doğru!")
                  : (lang === "ku" ? "✗ Xelet — ev " : lang === "en" ? "✗ Wrong — this is " : "✗ Yanlış — bu bir ") + tt(identifyQ.correct.name)}
              </div>
              <div style={{ fontSize: fs(11), color: P.text, lineHeight: 1.6, marginBottom: 4 }}>
                <strong>{lang === "ku" ? "Ji bo çi guncav e" : lang === "en" ? "Best for" : "Ne için uygun"}:</strong>{" "}
                {tt(identifyQ.correct.bestFor)}
              </div>
              <div style={{ fontSize: fs(10.5), color: P.textSoft, lineHeight: 1.55, fontStyle: "italic" }}>
                ⚠ {tt(identifyQ.correct.whenNot)}
              </div>
            </div>
          )}
        </>
      )}

      {/* MOD 2: PICK — senaryo ver, uygun grafik tipini seç */}
      {gameMode === "pick" && (
        <>
          <div style={{ padding: 18, borderRadius: 12, background: "#fff",
            border: "1px solid rgba(30,41,59,.08)", marginBottom: 10 }}>
            <div style={{ fontSize: fs(11), fontWeight: 800, color: P.textSoft, marginBottom: 10, textTransform: "uppercase", letterSpacing: .4 }}>
              {lang === "ku" ? "Senaryo" : lang === "en" ? "Scenario" : "Senaryo"} ({qIdx + 1}/{SCENARIO_QUESTIONS.length})
            </div>
            <div style={{ fontSize: fs(13.5), fontWeight: 700, color: P.text, lineHeight: 1.6 }}>
              {tt(scQ.scenario)}
            </div>
          </div>

          {/* 4 grafik türü şıkkı (1 doğru + 3 yanlış) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            {(() => {
              const correctObj = GRAPH_TYPES.find(g => g.id === scQ.correctType);
              const wrongs = scQ.wrongTypes.map(wid => GRAPH_TYPES.find(g => g.id === wid)).filter(Boolean);
              // Sıralama deterministik olsun ki kullanıcı bir sonraki soruda aynı yerde beklemeyi öğrenmesin
              const opts = [correctObj, ...wrongs];
              // qIdx'e göre deterministik karıştırma
              const shuffled = [...opts].sort((a, b) => {
                const ha = (a.id + scQ.id).charCodeAt(0);
                const hb = (b.id + scQ.id).charCodeAt(0);
                return ha - hb;
              });
              return shuffled.map(opt => {
                const isSel = selected === opt.id;
                const isCorrect = opt.id === scQ.correctType;
                const showCorrect = feedback && isCorrect;
                const showWrong = feedback && isSel && !isCorrect;
                return (
                  <button key={opt.id}
                    onClick={() => handleAnswer(opt.id, scQ.correctType)}
                    disabled={!!feedback}
                    style={{
                      padding: "10px 12px", borderRadius: 9,
                      border: "2px solid " + (
                        showCorrect ? "#10b981"
                          : showWrong ? "#ef4444"
                          : isSel ? P.accent
                          : "rgba(30,41,59,.12)"
                      ),
                      background: showCorrect ? "rgba(16,185,129,.08)"
                        : showWrong ? "rgba(239,68,68,.08)"
                        : isSel ? P.accentL
                        : "#fff",
                      cursor: feedback ? "default" : "pointer",
                      fontFamily: "inherit",
                      display: "flex", alignItems: "center", gap: 8,
                    }}>
                    <div style={{ flexShrink: 0, transform: "scale(0.6)", transformOrigin: "left center" }}>
                      {GRAPH_ICONS[opt.id]}
                    </div>
                    <span style={{
                      fontSize: fs(12), fontWeight: 700,
                      color: showCorrect ? "#065f46" : showWrong ? "#991b1b" : P.text,
                      lineHeight: 1.3,
                    }}>
                      {showCorrect && "✓ "}{showWrong && "✗ "}{tt(opt.name)}
                    </span>
                  </button>
                );
              });
            })()}
          </div>

          {feedback && (
            <div style={{
              padding: 14, borderRadius: 10, marginBottom: 10,
              background: feedback === "correct" ? "rgba(16,185,129,.08)" : "rgba(239,68,68,.08)",
              border: "1.5px solid " + (feedback === "correct" ? "#10b981" : "#ef4444"),
            }}>
              <div style={{ fontSize: fs(11), fontWeight: 800,
                color: feedback === "correct" ? "#065f46" : "#991b1b", marginBottom: 6 }}>
                {feedback === "correct"
                  ? (lang === "ku" ? "✓ Rast!" : lang === "en" ? "✓ Correct!" : "✓ Doğru!")
                  : (lang === "ku" ? "✗ Xelet" : lang === "en" ? "✗ Wrong" : "✗ Yanlış")}
              </div>
              <div style={{ fontSize: fs(11), color: P.text, lineHeight: 1.6 }}>
                {tt(scQ.explain)}
              </div>
            </div>
          )}
        </>
      )}

      {/* Sonraki soru */}
      {feedback && (
        <button onClick={nextQuestion} style={{
          width: "100%", padding: 12, borderRadius: 10, border: "none",
          background: `linear-gradient(135deg,${P.accent},${P.accentD})`,
          color: "#fff", cursor: "pointer", fontFamily: "inherit",
          fontSize: fs(13), fontWeight: 800,
          boxShadow: "0 2px 10px rgba(59,130,246,.3)",
        }}>
          {lang === "ku" ? "Pirsa paşê →" : lang === "en" ? "Next →" : "Sonraki →"}
        </button>
      )}

      <div style={{ marginTop: 12, padding: "6px 10px", fontSize: fs(9), color: P.textSoft, fontStyle: "italic", textAlign: "center" }}>
        📖 Schwabish (2021) Better Data Visualizations · PolicyViz Match-It
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ÖĞRETMEN PANOSU — Seviye rehberi + Yanılgılar + Öğrenci özeti
// ═══════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════
// STAT CARD — sınıf özeti için küçük istatistik kartı

export function TeacherModule({ lang, t, tt }) {
  const fs = useFS();
  const [panel, setPanel] = useState("levels"); // levels | misconceptions | progress | refs
  const [studentFilter, setStudentFilter] = useState(null); // null = all students

  // Öğrenci ilerlemesi — localStorage'dan oku
  const progress = (() => {
    try {
      const s = localStorage.getItem("dv_progress");
      return s ? JSON.parse(s) : {};
    } catch (e) { return {}; }
  })();
  const totalScore = (() => {
    try { return parseInt(localStorage.getItem("dv_score") || "0", 10); }
    catch (e) { return 0; }
  })();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: fs(22), fontWeight: 800, color: P.text, marginTop: 0, marginBottom: 6 }}>
        👩‍🏫 {lang === "ku" ? "Panela Mamoste" : lang === "en" ? "Teacher Panel" : "Öğretmen Panosu"}
      </h1>
      <p style={{ fontSize: fs(12), color: P.textSoft, marginTop: 0, marginBottom: 14, lineHeight: 1.6 }}>
        {lang === "ku"
          ? "Rehbera astê, katalogê çewtî, ilerleme ya xwendekaran û çavkanî."
          : lang === "en"
          ? "Level guide, misconception catalog, student progress, references."
          : "Seviye rehberi, yanılgı kataloğu, öğrenci ilerlemesi, referanslar."}
      </p>

      {/* Alt-sekme navigasyonu */}
      <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
        {[
          { id: "levels", label: { tr: "📊 Seviyeler", ku: "📊 Asta", en: "📊 Levels" } },
          { id: "misconceptions", label: { tr: "⚠ Yanılgılar", ku: "⚠ Çewtî", en: "⚠ Misconceptions" } },
          { id: "progress", label: { tr: "📈 İlerleme", ku: "📈 Pêşketin", en: "📈 Progress" } },
          { id: "observations", label: { tr: "🔎 Gözlemler", ku: "🔎 Çavdêrî", en: "🔎 Observations" } },
          { id: "tests", label: { tr: "📋 Testler", ku: "📋 Test", en: "📋 Tests" } },
          { id: "class", label: { tr: "📊 Sınıf", ku: "📊 Pol", en: "📊 Class" } },
          { id: "refs", label: { tr: "📚 Referanslar", ku: "📚 Çavkanî", en: "📚 References" } },
        ].map(p => (
          <button key={p.id} onClick={() => setPanel(p.id)}
            style={{
              padding: "8px 14px", borderRadius: 8,
              border: "2px solid " + (panel === p.id ? P.accent : "rgba(30,41,59,.12)"),
              background: panel === p.id ? P.accentL : "#fff",
              color: panel === p.id ? P.accentD : P.text,
              cursor: "pointer", fontFamily: "inherit",
              fontSize: fs(11.5), fontWeight: panel === p.id ? 800 : 600,
            }}>
            {tt(p.label)}
          </button>
        ))}
      </div>

      {/* SEVİYELER paneli — Curcio L0-L3 detayı */}
      {panel === "levels" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {CURCIO_LEVELS.map(lv => (
            <div key={lv.id} style={{
              padding: 16, borderRadius: 12,
              background: "#fff",
              border: "2px solid " + lv.color + "40",
              borderLeft: "6px solid " + lv.color,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: fs(24) }}>{lv.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: fs(15), fontWeight: 800, color: lv.color }}>
                    L{lv.id}: {tt(lv.name)}
                  </div>
                  <div style={{ fontSize: fs(10), color: P.textSoft, fontWeight: 600 }}>
                    {t("age")}: {lv.ageRange}
                  </div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={{ fontSize: fs(9), fontWeight: 800, color: "#10b981", textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>
                    ✓ {t("canDo")}
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: fs(11), color: P.textSoft, lineHeight: 1.5 }}>
                    {(lv.canDo[lang] || lv.canDo.tr).map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <div style={{ fontSize: fs(9), fontWeight: 800, color: "#ef4444", textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>
                    ✗ {t("cannotDo")}
                  </div>
                  <div style={{ fontSize: fs(11), color: P.textSoft, lineHeight: 1.5, fontStyle: "italic" }}>
                    {tt(lv.cannotDo)}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 12, padding: "8px 10px", background: lv.color + "10", borderRadius: 7 }}>
                <div style={{ fontSize: fs(9), fontWeight: 800, color: lv.color, textTransform: "uppercase", letterSpacing: .4, marginBottom: 3 }}>
                  🎯 {t("teacherFocus")}
                </div>
                <div style={{ fontSize: fs(11), color: P.text, lineHeight: 1.5, marginBottom: 6 }}>
                  {tt(lv.teacherFocus)}
                </div>
                <div style={{ fontSize: fs(9), fontWeight: 800, color: "#991b1b", textTransform: "uppercase", letterSpacing: .4, marginBottom: 3 }}>
                  ⚠ {t("teacherAvoid")}
                </div>
                <div style={{ fontSize: fs(11), color: P.text, lineHeight: 1.5 }}>
                  {tt(lv.teacherAvoid)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* YANILGILAR paneli */}
      {panel === "misconceptions" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {Object.entries(MISCONCEPTIONS).map(([cat, list]) => {
            const catLabels = {
              graph_reading: { tr: "Grafik Okuma", ku: "Xwendina Grafîkan", en: "Graph Reading" },
              central_tendency: { tr: "Merkezi Eğilim", ku: "Navendkarî", en: "Central Tendency" },
              prediction: { tr: "Tahmin", ku: "Pêşbînî", en: "Prediction" },
              deception: { tr: "Yanıltma", ku: "Xapandin", en: "Deception" },
            };
            return (
              <div key={cat}>
                <h3 style={{ fontSize: fs(13), fontWeight: 800, color: P.accentD, margin: "0 0 8px 0" }}>
                  {tt(catLabels[cat] || { tr: cat })}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {list.map(m => {
                    const lv = CURCIO_LEVELS.find(l => l.id === m.level);
                    return (
                      <div key={m.id} style={{
                        padding: 12, borderRadius: 9,
                        background: "#fff",
                        border: "1px solid rgba(30,41,59,.1)",
                        borderLeft: `4px solid ${lv?.color || P.accent}`,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: fs(9), fontWeight: 800, color: lv?.color || P.accent,
                            background: (lv?.color || P.accent) + "15", padding: "2px 7px", borderRadius: 10 }}>
                            L{m.level} · {lv ? tt(lv.shortName) : ""}
                          </span>
                          <span style={{ fontSize: fs(9), color: P.textSoft, fontStyle: "italic" }}>
                            {m.src}
                          </span>
                        </div>
                        <div style={{ fontSize: fs(11.5), color: P.text, lineHeight: 1.5 }}>
                          {m[lang] || m.tr}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* İLERLEME paneli */}
      {panel === "progress" && (
        <div>
          <div style={{ padding: 18, borderRadius: 12, background: "linear-gradient(135deg,#fef3c7,#fde68a)",
            border: "2px solid #f59e0b", marginBottom: 14, textAlign: "center" }}>
            <div style={{ fontSize: fs(9), fontWeight: 800, color: "#78350f", textTransform: "uppercase", letterSpacing: .5 }}>
              {t("score")}
            </div>
            <div style={{ fontSize: fs(36), fontWeight: 900, color: "#78350f", lineHeight: 1 }}>
              {totalScore}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {CURCIO_LEVELS.map(lv => {
              const prog = progress[lv.id] || { correct: 0, attempted: 0, acts: [] };
              const crit = lv.passCriteria;
              const pct = Math.min(100, Math.round((prog.correct / crit.minCorrect) * 100));
              const done = prog.correct >= crit.minCorrect && prog.acts.length >= crit.minActivities;
              return (
                <div key={lv.id} style={{
                  padding: 14, borderRadius: 10,
                  background: "#fff",
                  border: "1.5px solid " + (done ? "#10b981" : "rgba(30,41,59,.1)"),
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: fs(16) }}>{lv.icon}</span>
                      <span style={{ fontSize: fs(13), fontWeight: 800, color: lv.color }}>
                        L{lv.id}: {tt(lv.name)}
                      </span>
                      {done && <span style={{ fontSize: fs(10), fontWeight: 800, color: "#10b981",
                        background: "rgba(16,185,129,.15)", padding: "2px 8px", borderRadius: 10 }}>
                        ✓ {t("done")}
                      </span>}
                    </div>
                    <span style={{ fontSize: fs(11), fontWeight: 700, color: P.textSoft }}>
                      {prog.correct}/{crit.minCorrect} {t("correct")}
                    </span>
                  </div>
                  <div style={{ height: 6, background: "rgba(30,41,59,.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: pct + "%", height: "100%", background: lv.color, transition: "width .3s" }}/>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: fs(10), color: P.textSoft }}>
                    <span>{prog.attempted} {lang === "ku" ? "ceribandin" : lang === "en" ? "attempts" : "deneme"}</span>
                    <span>{prog.acts.length} {lang === "ku" ? "çalakî" : lang === "en" ? "activities" : "etkinlik"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={() => {
            if (window.confirm(lang === "ku" ? "Pêşketinê rakin?" : lang === "en" ? "Reset progress?" : "İlerlemeyi sıfırla?")) {
              try {
                localStorage.removeItem("dv_progress");
                localStorage.removeItem("dv_score");
                window.location.reload();
              } catch (e) {}
            }
          }} style={{
            marginTop: 14, width: "100%", padding: "10px", borderRadius: 8,
            border: "1.5px solid rgba(239,68,68,.3)", background: "rgba(239,68,68,.05)",
            color: "#dc2626", cursor: "pointer", fontFamily: "inherit",
            fontSize: fs(11), fontWeight: 700,
          }}>
            ↺ {lang === "ku" ? "Hemû pêşketinê rakin" : lang === "en" ? "Reset all progress" : "Tüm ilerlemeyi sıfırla"}
          </button>
        </div>
      )}

      {/* SINIF ÖZETİ paneli — anonimleştirilmiş sınıf düzeyinde istatistikler */}
      {panel === "class" && (() => {
        const allStudents = loadStudents();
        // Her öğrenci için toplam veri: test, gözlem sayısı
        let allObs = {};
        try { allObs = JSON.parse(localStorage.getItem("dv_obs_index") || "{}"); } catch (e) {}
        const obsEntries = Object.entries(allObs);

        // Öğrenci bazlı agregat
        const rows = allStudents.map(s => {
          const tests = loadTestResult(s.id) || {};
          const pre = tests.preTest;
          const posts = tests.postTests || [];
          const lastPost = posts[posts.length - 1];
          const obsCount = obsEntries.filter(([_, v]) => v.studentId === s.id).length;
          return { student: s, pre, lastPost, postCount: posts.length, obsCount };
        }).filter(r => r.pre || r.lastPost || r.obsCount > 0);

        const totalStudents = rows.length;
        const preTaken = rows.filter(r => r.pre).length;
        const postTaken = rows.filter(r => r.lastPost).length;
        const hasGrowthData = rows.filter(r => r.pre && r.lastPost);
        const avgGrowth = hasGrowthData.length > 0
          ? hasGrowthData.reduce((sum, r) => sum + (r.lastPost.totalCorrect - r.pre.totalCorrect), 0) / hasGrowthData.length
          : 0;

        // Başlangıç ve bitiş seviye dağılımları
        const preLevelDist = { 0: 0, 1: 0, 2: 0, 3: 0 };
        const postLevelDist = { 0: 0, 1: 0, 2: 0, 3: 0 };
        rows.forEach(r => {
          if (r.pre) preLevelDist[r.pre.recommended]++;
          if (r.lastPost) postLevelDist[r.lastPost.recommended]++;
        });

        // CSV export
        function exportCSV() {
          const headers = ["Öğrenci", "Ön Test Skoru", "Ön Test Seviye", "Son Test Skoru", "Son Test Seviye", "Tekrar Test Sayısı", "Gözlem Sayısı"];
          const lines = [headers.join(",")];
          rows.forEach(r => {
            const name = r.student.name.replace(/,/g, ";");
            const preS = r.pre ? `${r.pre.totalCorrect}/${r.pre.total}` : "-";
            const preL = r.pre ? `L${r.pre.recommended}` : "-";
            const postS = r.lastPost ? `${r.lastPost.totalCorrect}/${r.lastPost.total}` : "-";
            const postL = r.lastPost ? `L${r.lastPost.recommended}` : "-";
            lines.push([name, preS, preL, postS, postL, r.postCount, r.obsCount].join(","));
          });
          const csv = lines.join("\n");
          try {
            navigator.clipboard.writeText(csv);
            alert(lang === "ku" ? "CSV li panoyê hate kopîkirin!" : lang === "en" ? "CSV copied to clipboard!" : "CSV panoya kopyalandı!");
          } catch (e) {
            // Fallback: metin alanı göster
            window.prompt(lang === "en" ? "Copy this CSV:" : "Bu CSV'yi kopyala:", csv);
          }
        }

        return (
          <div>
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(5,150,105,.06)",
              border: "1px solid rgba(5,150,105,.2)", marginBottom: 14, fontSize: fs(11), color: "#065f46", lineHeight: 1.6 }}>
              📖 {lang === "ku"
                ? "Agahiyên anonîm li asta polê. Rêzên li jêr navên xwendekaran nîşan didin lê îhracata CSV tenê hejmar tê de ye."
                : lang === "en"
                ? "Class-level anonymized statistics. Rows below show names, but CSV export can be adapted for research use."
                : "Sınıf düzeyinde anonimleştirilmiş veriler. Aşağıdaki satırlar ad gösterir ama CSV ihracatı araştırma için uyarlanabilir."}
            </div>

            {totalStudents === 0 ? (
              <div style={{
                padding: 30, borderRadius: 12,
                background: "#fff", border: "2px dashed rgba(30,41,59,.12)",
                textAlign: "center", color: P.textSoft,
              }}>
                <div style={{ fontSize: fs(36), marginBottom: 10, opacity: 0.4 }}>📊</div>
                <div style={{ fontSize: fs(12), lineHeight: 1.5 }}>
                  {lang === "ku" ? "Hê zêde dane nîn in." : lang === "en" ? "Not enough data yet." : "Henüz yeterli veri yok."}
                </div>
              </div>
            ) : (
              <>
                {/* Özet kartları */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 16 }}>
                  <StatCard
                    icon="👥"
                    label={lang === "ku" ? "Xwendekar" : lang === "en" ? "Students" : "Öğrenci"}
                    value={totalStudents}
                    color="#8b5cf6"
                    fs={fs}
                  />
                  <StatCard
                    icon="📋"
                    label={lang === "ku" ? "Ön test" : lang === "en" ? "Pre-test" : "Ön test"}
                    value={`${preTaken}/${totalStudents}`}
                    color="#0891b2"
                    fs={fs}
                  />
                  <StatCard
                    icon="📈"
                    label={lang === "ku" ? "Son test" : lang === "en" ? "Post-test" : "Son test"}
                    value={`${postTaken}/${totalStudents}`}
                    color="#0e7490"
                    fs={fs}
                  />
                  <StatCard
                    icon={avgGrowth > 0 ? "↗" : avgGrowth < 0 ? "↘" : "→"}
                    label={lang === "ku" ? "Ort. gelişim" : lang === "en" ? "Avg growth" : "Ort. gelişim"}
                    value={hasGrowthData.length > 0 ? (avgGrowth > 0 ? `+${avgGrowth.toFixed(1)}` : avgGrowth.toFixed(1)) : "—"}
                    color={avgGrowth > 0 ? "#10b981" : avgGrowth < 0 ? "#ef4444" : "#64748b"}
                    fs={fs}
                  />
                </div>

                {/* Seviye dağılımları */}
                <div style={{ marginBottom: 16, padding: 14, borderRadius: 10, background: "#fff", border: "1px solid rgba(30,41,59,.08)" }}>
                  <div style={{ fontSize: fs(11), fontWeight: 800, color: P.text, marginBottom: 10 }}>
                    📊 {lang === "ku" ? "Belavbûna asta" : lang === "en" ? "Level distribution" : "Seviye dağılımı"}
                  </div>
                  {[0, 1, 2, 3].map(lv => {
                    const lc = LEVEL_COLORS[lv];
                    const preC = preLevelDist[lv];
                    const postC = postLevelDist[lv];
                    const maxC = Math.max(1, ...Object.values(preLevelDist), ...Object.values(postLevelDist));
                    return (
                      <div key={lv} style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 10 }}>
                        <LevelBadge level={lv} lang={lang} compact/>
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                          {/* Pre bar */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: fs(9), color: P.textSoft, minWidth: 30 }}>
                              {lang === "ku" ? "Pêşî" : lang === "en" ? "Pre" : "Ön"}
                            </span>
                            <div style={{ flex: 1, height: 10, borderRadius: 3, background: "rgba(0,0,0,.05)", overflow: "hidden" }}>
                              <div style={{ width: `${(preC / maxC) * 100}%`, height: "100%", background: lc.color, opacity: 0.6 }}/>
                            </div>
                            <span style={{ fontSize: fs(9.5), fontWeight: 700, color: P.text, minWidth: 18, textAlign: "right" }}>{preC}</span>
                          </div>
                          {/* Post bar */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: fs(9), color: P.textSoft, minWidth: 30 }}>
                              {lang === "ku" ? "Paşê" : lang === "en" ? "Post" : "Son"}
                            </span>
                            <div style={{ flex: 1, height: 10, borderRadius: 3, background: "rgba(0,0,0,.05)", overflow: "hidden" }}>
                              <div style={{ width: `${(postC / maxC) * 100}%`, height: "100%", background: lc.color }}/>
                            </div>
                            <span style={{ fontSize: fs(9.5), fontWeight: 700, color: P.text, minWidth: 18, textAlign: "right" }}>{postC}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ fontSize: fs(9), color: P.textSoft, fontStyle: "italic", marginTop: 8, textAlign: "center" }}>
                    {lang === "ku" ? "Pêşî = ön test, Paşê = son test pêşniyariya asta" : lang === "en" ? "Pre = pre-test, Post = post-test level recommendation" : "Ön = ön test önerisi, Son = son test önerisi"}
                  </div>
                </div>

                {/* CSV export */}
                <button onClick={exportCSV} style={{
                  padding: "10px 18px", borderRadius: 8, border: "none",
                  background: "linear-gradient(135deg, #059669, #047857)",
                  color: "#fff", cursor: "pointer", fontFamily: "inherit",
                  fontSize: fs(12), fontWeight: 800,
                  display: "flex", alignItems: "center", gap: 8,
                  boxShadow: "0 2px 10px rgba(5,150,105,.3)",
                }}>
                  📋 {lang === "ku" ? "CSV îxrac bike (ji bo lêkolînê)" : lang === "en" ? "Export CSV (for research)" : "CSV olarak ihraç et (araştırma için)"}
                </button>
                <div style={{ fontSize: fs(9.5), color: P.textSoft, marginTop: 6, fontStyle: "italic" }}>
                  {lang === "ku" ? "Dane li panoyê tê kopîkirin. Li Excel/Numbers/Sheets paste bike." : lang === "en" ? "Data copies to clipboard. Paste into Excel/Numbers/Sheets." : "Veri panoya kopyalanır. Excel/Numbers/Sheets'e yapıştır."}
                </div>
              </>
            )}
          </div>
        );
      })()}

      {/* TESTLER paneli — öğrencilerin ön test / son test sonuçları */}
      {panel === "tests" && (() => {
        // Tüm öğrencileri ve testlerini topla
        const allStudents = loadStudents();
        const testsPerStudent = allStudents.map(s => {
          const t = loadTestResult(s.id) || {};
          return { student: s, tests: t };
        }).filter(x => x.tests.preTest || (x.tests.postTests && x.tests.postTests.length > 0));

        return (
          <div>
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(8,145,178,.06)",
              border: "1px solid rgba(8,145,178,.2)", marginBottom: 14, fontSize: fs(11), color: "#0e7490", lineHeight: 1.6 }}>
              📖 {lang === "ku"
                ? "Testên teşhîsê û pêşveçûnê. 8 pirs, her ji 4 astan 2. Guhertina di asta destpêk û paşê de pêşveçûna zanyariyê nîşan dide."
                : lang === "en"
                ? "Diagnostic & progress tests. 8 questions, 2 per Curcio level. Change from pre- to post-test shows real learning."
                : "Teşhis ve gelişim testleri. Her Curcio seviyesinden 2 soru = 8 toplam. Ön testten son teste değişim gerçek öğrenmenin ölçüsüdür."}
            </div>

            {testsPerStudent.length === 0 ? (
              <div style={{
                padding: 30, borderRadius: 12,
                background: "#fff", border: "2px dashed rgba(30,41,59,.12)",
                textAlign: "center", color: P.textSoft,
              }}>
                <div style={{ fontSize: fs(36), marginBottom: 10, opacity: 0.4 }}>📋</div>
                <div style={{ fontSize: fs(12), lineHeight: 1.5 }}>
                  {lang === "ku" ? "Hê testek nehatiye kirin." : lang === "en" ? "No tests taken yet." : "Henüz test alınmamış."}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {testsPerStudent.map(({ student, tests }) => {
                  const pre = tests.preTest;
                  const posts = tests.postTests || [];
                  const latest = posts[posts.length - 1] || pre;
                  const improvement = (pre && latest && latest !== pre)
                    ? latest.totalCorrect - pre.totalCorrect
                    : 0;
                  return (
                    <div key={student.id} style={{
                      padding: 14, borderRadius: 10,
                      background: "#fff",
                      border: "1.5px solid rgba(8,145,178,.25)",
                      borderLeft: "4px solid #0891b2",
                    }}>
                      {/* Öğrenci başlık */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                        <div style={{
                          width: fs(32), height: fs(32), borderRadius: "50%",
                          background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                          color: "#fff", fontSize: fs(13), fontWeight: 800,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          {(student.name || "?").substring(0, 1).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: fs(13), fontWeight: 800, color: "#1e293b" }}>{student.name}</div>
                          <div style={{ fontSize: fs(9.5), color: P.textSoft }}>
                            {pre ? `1 ön + ${posts.length} tekrar = ${1 + posts.length} test` : `${posts.length} test`}
                          </div>
                        </div>
                        {improvement !== 0 && (
                          <span style={{
                            fontSize: fs(11), fontWeight: 800,
                            color: improvement > 0 ? "#10b981" : "#ef4444",
                            background: improvement > 0 ? "rgba(16,185,129,.1)" : "rgba(239,68,68,.1)",
                            padding: "3px 10px", borderRadius: 12,
                          }}>
                            {improvement > 0 ? `↗ +${improvement}` : `↘ ${improvement}`}
                          </span>
                        )}
                      </div>

                      {/* Pre + post test özetleri */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {pre && (
                          <TestResultRow
                            label={lang === "ku" ? "Ön Test" : lang === "en" ? "Pre-Test" : "Ön Test"}
                            result={pre}
                            color="#64748b"
                            lang={lang}
                            fs={fs}
                          />
                        )}
                        {posts.map((post, i) => (
                          <TestResultRow
                            key={i}
                            label={`${lang === "ku" ? "Tekrar" : lang === "en" ? "Retake" : "Tekrar"} ${i + 1}`}
                            result={post}
                            color="#0891b2"
                            lang={lang}
                            fs={fs}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

      {/* GÖZLEMLER paneli — öğrencinin Notice & Wonder notları */}
      {panel === "observations" && (() => {
        let allObs = {};
        try { allObs = JSON.parse(localStorage.getItem("dv_obs_index") || "{}"); } catch (e) {}
        const entries = Object.entries(allObs).sort((a, b) => (b[1].ts || 0) - (a[1].ts || 0));

        // Benzersiz öğrenci ID'leri (varsa)
        const uniqueStudents = Array.from(new Set(
          entries.map(([_, v]) => v.studentId).filter(Boolean)
        )).map(id => {
          const e = entries.find(([_, v]) => v.studentId === id);
          return { id, name: e?.[1].studentName || id };
        });

        // Filter by student (local state inside IIFE won't work; use ref via useState)
        const filteredEntries = studentFilter
          ? entries.filter(([_, v]) => v.studentId === studentFilter)
          : entries;

        return (
          <div>
            <div style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(59,130,246,.06)",
              border: "1px solid rgba(59,130,246,.2)", marginBottom: 14, fontSize: fs(11), color: P.accentD, lineHeight: 1.6 }}>
              📖 {lang === "ku"
                ? "Notên xwendekaran ji moda 'Notice & Wonder'. Ev çavdêriyên vekirî ne, rast/xelet nayê darizandin. Ev xwendekarê dike ku rexneyî bifikire."
                : lang === "en"
                ? "Student notes from 'Notice & Wonder' mode. These are open-ended observations, not judged right/wrong. They build critical thinking."
                : "Öğrencinin 'Gözlem Modu'nda yazdıkları. Bu notlar açık uçlu — doğru/yanlış yargılanmaz. Eleştirel düşünmeyi geliştirir."}
            </div>

            {/* Öğrenci filtresi — kayıtlarda öğrenci varsa göster */}
            {uniqueStudents.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                <span style={{ fontSize: fs(10), fontWeight: 700, color: P.textSoft }}>
                  👤 {lang === "ku" ? "Filtre:" : lang === "en" ? "Filter:" : "Filtre:"}
                </span>
                <button onClick={() => setStudentFilter(null)}
                  style={{
                    padding: "4px 10px", borderRadius: 12,
                    border: "1.5px solid " + (studentFilter === null ? "#8b5cf6" : "rgba(30,41,59,.15)"),
                    background: studentFilter === null ? "rgba(139,92,246,.1)" : "#fff",
                    color: studentFilter === null ? "#6d28d9" : P.textSoft,
                    cursor: "pointer", fontFamily: "inherit",
                    fontSize: fs(9.5), fontWeight: studentFilter === null ? 800 : 600,
                  }}>
                  {lang === "ku" ? "Hemû" : lang === "en" ? "All" : "Tümü"} ({entries.length})
                </button>
                {uniqueStudents.map(s => {
                  const count = entries.filter(([_, v]) => v.studentId === s.id).length;
                  const active = studentFilter === s.id;
                  return (
                    <button key={s.id} onClick={() => setStudentFilter(s.id)}
                      style={{
                        padding: "4px 10px", borderRadius: 12,
                        border: "1.5px solid " + (active ? "#8b5cf6" : "rgba(30,41,59,.15)"),
                        background: active ? "rgba(139,92,246,.1)" : "#fff",
                        color: active ? "#6d28d9" : P.textSoft,
                        cursor: "pointer", fontFamily: "inherit",
                        fontSize: fs(9.5), fontWeight: active ? 800 : 600,
                      }}>
                      {s.name} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            <div style={{ fontSize: fs(10), color: P.textSoft, marginBottom: 10, fontStyle: "italic" }}>
              {lang === "ku" ? "Pirsên NCTM: 1) Çi bala te dikişîne? 2) Çi kûrahî dikî? 3) Sernav" : lang === "en" ? "NCTM questions: 1) What do you notice? 2) What do you wonder? 3) Headline" : "NCTM soruları: 1) Ne fark ediyorsun? 2) Ne merak ediyorsun? 3) Başlık"}
            </div>

            {entries.length === 0 ? (
              <div style={{
                padding: 30, borderRadius: 12,
                background: "#fff",
                border: "2px dashed rgba(30,41,59,.12)",
                textAlign: "center",
                color: P.textSoft,
              }}>
                <div style={{ fontSize: fs(36), marginBottom: 10, opacity: 0.4 }}>📝</div>
                <div style={{ fontSize: fs(12), lineHeight: 1.5 }}>
                  {t("noObservationsYet")}
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {filteredEntries.map(([actId, notes]) => {
                  const date = notes.ts ? new Date(notes.ts).toLocaleDateString(lang === "ku" ? "tr-TR" : lang === "en" ? "en-US" : "tr-TR") : "";
                  const hasAnyNote = notes.notice || notes.wonder || notes.headline;
                  if (!hasAnyNote) return null;
                  return (
                    <div key={actId} style={{
                      padding: 14, borderRadius: 10,
                      background: "#fff",
                      border: "1px solid rgba(30,41,59,.1)",
                      borderLeft: `4px solid ${P.accent}`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: fs(10), fontWeight: 800, color: P.accentD,
                          background: P.accentL, padding: "2px 8px", borderRadius: 10,
                          fontFamily: "monospace",
                        }}>
                          {actId}
                        </span>
                        {/* Öğrenci rozet — filtre "Tümü"ndeyken kim yazdı gösterir */}
                        {notes.studentName && !studentFilter && (
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            fontSize: fs(9.5), fontWeight: 700, color: "#6d28d9",
                            background: "rgba(139,92,246,.1)",
                            padding: "2px 8px", borderRadius: 10,
                            border: "1px solid rgba(139,92,246,.2)",
                          }}>
                            👤 {notes.studentName}
                          </span>
                        )}
                        <span style={{ fontSize: fs(9), color: P.textSoft, fontStyle: "italic", marginLeft: "auto" }}>
                          {date}
                        </span>
                      </div>

                      {notes.notice && (
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: fs(9), fontWeight: 800, color: "#3b82f6", textTransform: "uppercase", letterSpacing: .4, marginBottom: 3 }}>
                            👁️ {t("whatNotice")}
                          </div>
                          <div style={{ fontSize: fs(11.5), color: P.text, lineHeight: 1.5, padding: "6px 10px", background: "rgba(59,130,246,.04)", borderRadius: 6 }}>
                            {notes.notice}
                          </div>
                        </div>
                      )}

                      {notes.wonder && (
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: fs(9), fontWeight: 800, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: .4, marginBottom: 3 }}>
                            💭 {t("whatWonder")}
                          </div>
                          <div style={{ fontSize: fs(11.5), color: P.text, lineHeight: 1.5, padding: "6px 10px", background: "rgba(139,92,246,.04)", borderRadius: 6 }}>
                            {notes.wonder}
                          </div>
                        </div>
                      )}

                      {notes.headline && (
                        <div>
                          <div style={{ fontSize: fs(9), fontWeight: 800, color: "#f59e0b", textTransform: "uppercase", letterSpacing: .4, marginBottom: 3 }}>
                            📰 {t("writeHeadline")}
                          </div>
                          <div style={{ fontSize: fs(11.5), color: P.text, lineHeight: 1.5, padding: "6px 10px", background: "rgba(245,158,11,.04)", borderRadius: 6, fontWeight: 700, fontStyle: "italic" }}>
                            "{notes.headline}"
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {entries.length > 0 && (
              <button onClick={() => {
                if (window.confirm(lang === "ku" ? "Hemû çavdêriyan rakin?" : lang === "en" ? "Clear all observations?" : "Tüm gözlemleri sil?")) {
                  try {
                    localStorage.removeItem("dv_obs_index");
                    // Tüm dv_obs_* anahtarlarını sil
                    const toRemove = [];
                    for (let i = 0; i < localStorage.length; i++) {
                      const key = localStorage.key(i);
                      if (key && key.startsWith("dv_obs_") && key !== "dv_obs_index") toRemove.push(key);
                    }
                    toRemove.forEach(k => localStorage.removeItem(k));
                    window.location.reload();
                  } catch (e) {}
                }
              }} style={{
                marginTop: 14, width: "100%", padding: "9px", borderRadius: 8,
                border: "1.5px solid rgba(239,68,68,.3)", background: "rgba(239,68,68,.05)",
                color: "#dc2626", cursor: "pointer", fontFamily: "inherit",
                fontSize: fs(11), fontWeight: 700,
              }}>
                ↺ {lang === "ku" ? "Hemû çavdêriyan rakin" : lang === "en" ? "Clear all observations" : "Tüm gözlemleri sil"}
              </button>
            )}
          </div>
        );
      })()}

      {/* REFERANSLAR paneli */}
      {panel === "refs" && (
        <div style={{ padding: 18, borderRadius: 12, background: "#fff", border: "1px solid rgba(30,41,59,.08)" }}>
          <h3 style={{ fontSize: fs(13), fontWeight: 800, color: P.accentD, marginTop: 0, marginBottom: 10 }}>
            {t("pedagogical")}
          </h3>
          <ul style={{ fontSize: fs(12), color: P.textSoft, lineHeight: 1.7, paddingLeft: 18, margin: 0 }}>
            <li><strong>Curcio, F. R. (1987)</strong> — Comprehension of mathematical relationships expressed in graphs. <em>Journal for Research in Mathematics Education, 18</em>(5), 382-393.</li>
            <li><strong>Friel, S. N., Curcio, F. R. & Bright, G. W. (2001)</strong> — Making sense of graphs: Critical factors influencing comprehension. <em>JRME, 32</em>(2), 124-158.</li>
            <li><strong>GAISE (2020)</strong> — Guidelines for Assessment & Instruction in Statistics Education II. American Statistical Association.</li>
            <li><strong>Wild, C. J. & Pfannkuch, M. (1999)</strong> — Statistical thinking in empirical enquiry. <em>International Statistical Review, 67</em>(3), 223-248.</li>
            <li><strong>Watson, J. M. & Callingham, R. (2003)</strong> — Statistical literacy: A complex hierarchical construct. <em>Statistics Education Research Journal, 2</em>(2), 3-46.</li>
            <li><strong>Garfield, J. & Ben-Zvi, D. (2005)</strong> — A framework for teaching and assessing reasoning about variability. <em>SERJ, 4</em>(1), 92-99.</li>
            <li><strong>Huff, D. (1954)</strong> — <em>How to Lie with Statistics</em>. W. W. Norton & Co.</li>
            <li><strong>Kahneman, D. & Tversky, A. (1971)</strong> — Belief in the law of small numbers. <em>Psychological Bulletin, 76</em>(2), 105-110.</li>
            <li><strong>Tufte, E. R. (2001)</strong> — <em>The Visual Display of Quantitative Information</em> (2nd ed.). Graphics Press.</li>
            <li><strong>Wainer, H. (1984)</strong> — How to display data badly. <em>The American Statistician, 38</em>(2), 137-147.</li>
            <li><strong>Bernoulli, J. (1713)</strong> — <em>Ars Conjectandi</em> (Büyük Sayılar Yasası).</li>
          </ul>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ANA UYGULAMA

export function ModulePlaceholder({ tabId, lang, t, tt, level, levelData, dyscalculia, setDyscalculia, colorblind, setColorblind, ttsOn, setTtsOn, noticeWonderOn, setNoticeWonderOn, addScore, recordLevelAnswer, isIntroShown, dismissIntro, introDismissTick, resetOnboarding, openProfileSetup, currentStudent, startPostTest }) {
  const fs = useFS();

  // Intro wrapper — tabId için intro varsa ve henüz kapatılmadıysa göster
  const introVisible = MODULE_INTROS[tabId] && isIntroShown && !isIntroShown(tabId);
  const intro = introVisible ? (
    <ModuleIntroCard tabId={tabId} lang={lang} onDismiss={() => dismissIntro(tabId)}/>
  ) : null;

  // Yardımcı: mevcut render'ı intro kartı ile sarar
  const wrap = (el) => (
    <div>
      {intro}
      {el}
    </div>
  );

  // Grafik Okuma modülü — GERÇEK
  if (tabId === "read") {
    return wrap(
      <ReadModule
        lang={lang}
        t={t}
        tt={tt}
        level={level}
        levelData={levelData}
        colorblind={colorblind}
        noticeWonderOn={noticeWonderOn}
        onCorrect={() => addScore(10)}
        onAttempt={(actId, isCorrect) => recordLevelAnswer(level, actId, isCorrect)}
      />
    );
  }

  // Yanıltma Avı — GERÇEK
  if (tabId === "deceive") {
    return wrap(
      <DeceiveModule
        lang={lang}
        t={t}
        tt={tt}
        level={level}
        colorblind={colorblind}
        noticeWonderOn={noticeWonderOn}
        onCorrect={() => addScore(15)}
        onAttempt={(actId, isCorrect) => recordLevelAnswer(3, actId, isCorrect)}
      />
    );
  }

  // Merkezi Eğilim — GERÇEK
  if (tabId === "center") {
    return wrap(
      <CenterModule
        lang={lang}
        t={t}
        tt={tt}
        colorblind={colorblind}
        noticeWonderOn={noticeWonderOn}
      />
    );
  }

  // Grafik Oluştur — GERÇEK
  if (tabId === "create") {
    return wrap(
      <CreateModule
        lang={lang}
        t={t}
        tt={tt}
        colorblind={colorblind}
      />
    );
  }

  // İlişki (Saçılım) — GERÇEK
  if (tabId === "relate") {
    return wrap(
      <RelateModule
        lang={lang}
        t={t}
        tt={tt}
        colorblind={colorblind}
        noticeWonderOn={noticeWonderOn}
        onCorrect={(n) => addScore(n || 10)}
        onAttempt={(actId, isCorrect) => recordLevelAnswer(3, actId, isCorrect)}
      />
    );
  }

  // Grafik Tanı — GERÇEK
  if (tabId === "recognize") {
    return wrap(
      <RecognizeModule
        lang={lang}
        t={t}
        tt={tt}
        onCorrect={() => addScore(5)}
        onAttempt={(actId, isCorrect) => recordLevelAnswer(2, actId, isCorrect)}
      />
    );
  }

  // Dünya (WGOITG tarzı) — GERÇEK
  if (tabId === "world") {
    return wrap(
      <WorldModule
        lang={lang}
        t={t}
        tt={tt}
        colorblind={colorblind}
        noticeWonderOn={noticeWonderOn}
        onCorrect={(n) => addScore(n || 15)}
        onAttempt={(actId, isCorrect) => {
          // World etkinliklerinin kendi Curcio seviyesi var — act bulup kullan
          const match = actId.match(/^world_(w_[a-z_]+)_/);
          if (match) {
            const act = WORLD_ACTIVITIES.find(a => a.id === match[1]);
            const lv = act?.curcioLevel ?? 2;
            recordLevelAnswer(lv, actId, isCorrect);
          }
        }}
      />
    );
  }

  // Olasılık — GERÇEK
  if (tabId === "probability") {
    return wrap(
      <ProbabilityModule
        lang={lang}
        t={t}
        tt={tt}
        colorblind={colorblind}
      />
    );
  }

  // Veri Topla — GERÇEK
  if (tabId === "collect") {
    return wrap(
      <CollectModule
        lang={lang}
        t={t}
        tt={tt}
        colorblind={colorblind}
      />
    );
  }

  // Ayarlar sekmesi — HAZİR
  if (tabId === "set") {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ fontSize: fs(22), fontWeight: 800, color: P.text, marginTop: 0, marginBottom: 16 }}>
          ⚙️ {t("sideTabs").set}
        </h1>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <SettingToggle
            label={t("dyscalculia")}
            desc={lang === "ku"
              ? "Yazı %35 mezintir, hedefên berfirehtir, hejmar bi gotinan (15 mîlyon 700 hezar), nav hemû modulan"
              : lang === "en"
              ? "35% larger text, wider targets, numbers in words (15 million 700 thousand), active across ALL modules"
              : "Yazı %35 daha büyük, daha geniş hedefler, sayılar yazıyla (15 milyon 700 bin), TÜM modüllerde etkin"}
            checked={dyscalculia}
            onChange={setDyscalculia}
          />
          <SettingToggle
            label={t("colorblind")}
            desc={lang === "ku" ? "Paleta Okabe-Ito — ji bo kor-rengiyê ewle" : lang === "en" ? "Okabe-Ito palette — safe for colorblind" : "Okabe-Ito paleti — renk körü için güvenli"}
            checked={colorblind}
            onChange={setColorblind}
          />
          <SettingToggle
            label={t("tts")}
            desc={lang === "ku"
              ? "Butona 🔊 li kêleka her pirsê xuya dibe — klik bike, bi deng bixwîne"
              : lang === "en"
              ? "🔊 button appears next to questions — click to hear it aloud"
              : "Her sorunun yanında 🔊 butonu çıkar — tıklayınca sesli okur"}
            checked={ttsOn}
            onChange={setTtsOn}
          />

          {/* TTS test butonu — yalnızca TTS açıkken */}
          {ttsOn && (
            <div style={{
              padding: "10px 14px", borderRadius: 9,
              background: "rgba(59,130,246,.06)",
              border: "1px solid rgba(59,130,246,.2)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <SpeakButton
                text={lang === "ku"
                  ? "Silav! Ez dengê te yê dengbêj im. Ez pirsên te dibihîzim û bi deng dixwînim."
                  : lang === "en"
                  ? "Hello! I am the voice that reads your questions aloud. Press any speaker icon to hear the text."
                  : "Merhaba! Ben senin sesli okuyucunum. Her sorunun yanındaki hoparlör simgesine tıkla, ben okuyayım."}
                size="lg"
              />
              <div style={{ flex: 1, fontSize: fs(11), color: P.accentD, lineHeight: 1.5 }}>
                {lang === "ku"
                  ? "🔊 Klik bike ji bo ceribandina dengê — gelo deng baş e?"
                  : lang === "en"
                  ? "🔊 Click to test the voice — can you hear it clearly?"
                  : "🔊 Tıkla ve sesi test et — sesi net duyabiliyor musun?"}
              </div>
            </div>
          )}

          <SettingToggle
            label={t("nwMode")}
            desc={t("nwModeDesc")}
            checked={noticeWonderOn}
            onChange={setNoticeWonderOn}
          />
        </div>

        {/* Erişilebilirlik notu */}
        <div style={{
          marginTop: 18, padding: "10px 12px", borderRadius: 8,
          background: "rgba(139,92,246,.05)",
          border: "1px dashed rgba(139,92,246,.25)",
          fontSize: fs(10), color: "#6d28d9", lineHeight: 1.55,
          fontStyle: "italic",
        }}>
          ♿ {lang === "ku"
            ? "Ji bo zarokên diskalkulîk: Herdu 'Diskalkuli' û 'Sesli Anlatım' vebike. Zimanê te biguherîne, qonaxê sekne, her dem bigere."
            : lang === "en"
            ? "For dyscalculic students: Turn on both 'Dyscalculia Mode' and 'Text to Speech'. Pause anytime, change language, take it slow."
            : "Diskalkulik öğrenciler için: 'Diskalkuli Modu' ve 'Sesli Anlatım' birlikte açılırsa en iyi sonucu verir. İstediğin zaman ara ver, dili değiştir, acele etme."}
        </div>

        {/* Profil kartı — mevcut öğrenci + değiştirme butonu */}
        <div style={{
          marginTop: 14, padding: "12px 14px", borderRadius: 9,
          background: "rgba(139,92,246,.05)",
          border: "1px solid rgba(139,92,246,.2)",
        }}>
          <div style={{ fontSize: fs(11), fontWeight: 800, color: "#6d28d9", marginBottom: 6 }}>
            👤 {lang === "ku" ? "Profîl" : lang === "en" ? "Profile" : "Profil"}
          </div>
          {currentStudent ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{
                width: fs(36), height: fs(36), borderRadius: "50%",
                background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                color: "#fff", fontSize: fs(14), fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {(currentStudent.name || "?").substring(0, 1).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: fs(12.5), fontWeight: 800, color: "#1e293b" }}>
                  {currentStudent.name}
                </div>
                <div style={{ fontSize: fs(9.5), color: P.textSoft, fontStyle: "italic" }}>
                  {currentStudent.isGuest
                    ? (lang === "ku" ? "Mêvan — pêşveçûna te tê tomarkirin lê dibe ji bîr bibe" : lang === "en" ? "Guest — progress recorded but may be forgotten" : "Ziyaretçi — ilerlemen kaydedilir ama unutulabilir")
                    : (lang === "ku" ? "Profîlek şexsî" : lang === "en" ? "Personal profile" : "Kişisel profil")}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: fs(10.5), color: P.textSoft, lineHeight: 1.55, marginBottom: 10 }}>
              {lang === "ku" ? "Tu profîlek hilbijêrî nekiriye." : lang === "en" ? "No profile selected." : "Henüz profil seçmedin."}
            </div>
          )}
          <button
            onClick={openProfileSetup}
            style={{
              padding: "7px 14px", borderRadius: 7,
              border: "1.5px solid #8b5cf6",
              background: "#fff", color: "#6d28d9",
              cursor: "pointer", fontFamily: "inherit",
              fontSize: fs(11), fontWeight: 700,
              display: "flex", alignItems: "center", gap: 6,
            }}>
            🔄 {lang === "ku" ? "Profîlê Biguherîne" : lang === "en" ? "Change Profile" : "Profili Değiştir"}
          </button>
        </div>

        {/* Teşhis Testi kartı — sadece non-guest profil varsa */}
        {currentStudent && !currentStudent.isGuest && (() => {
          const tests = loadTestResult(currentStudent.id) || {};
          const hasPreTest = !!tests.preTest;
          const postTests = tests.postTests || [];
          const lastTest = postTests[postTests.length - 1] || tests.preTest;
          const daysSince = lastTest ? Math.floor((Date.now() - lastTest.date) / (1000 * 60 * 60 * 24)) : null;
          const canRetake = !hasPreTest || daysSince >= 7; // 7 günde bir en fazla

          return (
            <div style={{
              marginTop: 14, padding: "12px 14px", borderRadius: 9,
              background: "rgba(8,145,178,.05)",
              border: "1px solid rgba(8,145,178,.2)",
            }}>
              <div style={{ fontSize: fs(11), fontWeight: 800, color: "#0e7490", marginBottom: 6 }}>
                📋 {lang === "ku" ? "Teşhîs û Pêşveçûn" : lang === "en" ? "Diagnostic & Progress" : "Teşhis & İlerleme"}
              </div>
              {hasPreTest ? (
                <div style={{ fontSize: fs(10.5), color: P.textSoft, lineHeight: 1.55, marginBottom: 10 }}>
                  {lang === "ku"
                    ? `Teşhîsa destpêkê: ${tests.preTest.totalCorrect}/${tests.preTest.total} rast, L${tests.preTest.recommended}. ${postTests.length > 0 ? `${postTests.length} ceribandina din.` : ""}`
                    : lang === "en"
                    ? `Initial diagnostic: ${tests.preTest.totalCorrect}/${tests.preTest.total} correct, L${tests.preTest.recommended}. ${postTests.length > 0 ? `${postTests.length} retake(s).` : ""}`
                    : `Başlangıç teşhisi: ${tests.preTest.totalCorrect}/${tests.preTest.total} doğru, L${tests.preTest.recommended}. ${postTests.length > 0 ? `${postTests.length} tekrar test.` : ""}`}
                </div>
              ) : (
                <div style={{ fontSize: fs(10.5), color: P.textSoft, lineHeight: 1.55, marginBottom: 10 }}>
                  {lang === "ku" ? "Te hê testa destpêkê nekir." : lang === "en" ? "You haven't taken the starting diagnostic yet." : "Henüz başlangıç teşhisi yapmadın."}
                </div>
              )}
              <button
                onClick={() => startPostTest && startPostTest()}
                disabled={!canRetake}
                style={{
                  padding: "7px 14px", borderRadius: 7,
                  border: "1.5px solid #0891b2",
                  background: canRetake ? "#fff" : "#f1f5f9",
                  color: canRetake ? "#0e7490" : "#94a3b8",
                  cursor: canRetake ? "pointer" : "not-allowed",
                  fontFamily: "inherit",
                  fontSize: fs(11), fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 6,
                }}
                title={!canRetake ? (lang === "en" ? `Wait ${7 - daysSince} days` : `${7 - daysSince} gün bekle`) : ""}
              >
                📋 {hasPreTest
                  ? (lang === "ku" ? "Testa Paşê Bike" : lang === "en" ? "Take Progress Test" : "Gelişim Testi Al")
                  : (lang === "ku" ? "Teşhîs Bike" : lang === "en" ? "Take Diagnostic" : "Teşhis Testi Al")}
              </button>
            </div>
          );
        })()}

        {/* Yardım kısmı — turu tekrar gösterme */}
        <div style={{
          marginTop: 14, padding: "12px 14px", borderRadius: 9,
          background: "rgba(59,130,246,.04)",
          border: "1px solid rgba(59,130,246,.15)",
        }}>
          <div style={{ fontSize: fs(11), fontWeight: 800, color: P.accentD, marginBottom: 6 }}>
            💡 {lang === "ku" ? "Alîkarî" : lang === "en" ? "Help" : "Yardım"}
          </div>
          <div style={{ fontSize: fs(10.5), color: P.textSoft, lineHeight: 1.55, marginBottom: 10 }}>
            {lang === "ku"
              ? "Te tura hoşamedî ji bîr kir? Vî gavê ji nû ve bibîne."
              : lang === "en"
              ? "Forgot the welcome tour? View it again anytime."
              : "Hoşgeldin turunu atladıysan veya tekrar görmek istersen:"}
          </div>
          <button
            onClick={resetOnboarding}
            style={{
              padding: "7px 14px", borderRadius: 7,
              border: "1.5px solid " + P.accent,
              background: "#fff", color: P.accent,
              cursor: "pointer", fontFamily: "inherit",
              fontSize: fs(11), fontWeight: 700,
              display: "flex", alignItems: "center", gap: 6,
            }}>
            🔄 {lang === "ku" ? "Turê ji Nû Ve Bibîne" : lang === "en" ? "Show Tour Again" : "Turu Tekrar Göster"}
          </button>
        </div>
      </div>
    );
  }

  // Öğretmen sekmesi — GENİŞLETİLDİ
  if (tabId === "teach") {
    return <TeacherModule lang={lang} t={t} tt={tt} />;
  }

  // Diğer tüm modüller — "Yakında" kartı
  const moduleInfo = {
    read: {
      title: lang === "ku" ? "Xwendina Grafîkan" : lang === "en" ? "Graph Reading" : "Grafik Okuma",
      desc: lang === "ku"
        ? "Çubuk, xeta, keka… Grafîkê bixwîne û bi asta Curcio pêş ve biçe (L0→L3)."
        : lang === "en"
        ? "Bar, line, pie… Read graphs and progress through Curcio levels (L0→L3)."
        : "Çubuk, çizgi, pasta… Grafikleri oku ve Curcio seviyelerinde ilerle (L0→L3).",
      phases: ["D", "A"],  // PPDAC döngüsünde hangi aşamaya denk geliyor
    },
    deceive: {
      title: lang === "ku" ? "Nêçîra Xapandinê" : lang === "en" ? "Deception Hunt" : "Yanıltma Avı",
      desc: lang === "ku"
        ? "Grafîkên çewt û xapînok — li ku xapandin heye bibîne! (Huff 1954)"
        : lang === "en"
        ? "Misleading graphs — find the deception! (Huff 1954)"
        : "Yanıltıcı grafikler — kandırmaca nerede, bul! (Huff 1954)",
      phases: ["A", "C"],
    },
    create: {
      title: lang === "ku" ? "Grafîk Çêbike" : lang === "en" ? "Create a Graph" : "Grafik Oluştur",
      desc: lang === "ku"
        ? "Daneyên xwe têkevîne û grafîkê çubuk, xeta, keka çêbike."
        : lang === "en"
        ? "Enter your data and create bar, line, pie charts."
        : "Kendi verini gir, çubuk / çizgi / pasta grafik oluştur.",
      phases: ["D", "A"],
    },
    center: {
      title: lang === "ku" ? "Navendkarî" : lang === "en" ? "Central Tendency" : "Merkezi Eğilim",
      desc: lang === "ku"
        ? "Navînî, medyan, mod — bi nîşaneya zindî. Daneyê biguherîne, nirxan bibîne."
        : lang === "en"
        ? "Mean, median, mode — live visualization. Change data, see values shift."
        : "Ortalama, medyan, mod — canlı görselleştirme. Veriyi değiştir, değerler anında güncellensin.",
      phases: ["A"],
    },
    probability: {
      title: lang === "ku" ? "Îhtîmal" : lang === "en" ? "Probability" : "Olasılık",
      desc: lang === "ku"
        ? "Zar, pere, tûrik — ceribandin û teorî bide ber hev."
        : lang === "en"
        ? "Dice, coin, bag — compare experiment vs theory."
        : "Zar, para, torba — deney ile teoriyi karşılaştır.",
      phases: ["P1", "P2", "D", "A", "C"],
    },
    collect: {
      title: lang === "ku" ? "Dane Berhev Bike" : lang === "en" ? "Collect Data" : "Veri Topla",
      desc: lang === "ku"
        ? "Anketa sinifê — pirs bipirse, bersivan berhev bike, grafîkê bibîne."
        : lang === "en"
        ? "Class survey — ask question, collect answers, see the graph."
        : "Sınıf anketi — soru sor, cevap topla, grafiği gör.",
      phases: ["P1", "P2", "D"],
    },
  };

  const info = moduleInfo[tabId] || { title: tabId, desc: "", phases: [] };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ fontSize: fs(22), fontWeight: 800, color: P.text, marginTop: 0, marginBottom: 6 }}>
        {info.title}
      </h1>
      <p style={{ fontSize: fs(13), color: P.textSoft, marginTop: 0, marginBottom: 20, lineHeight: 1.6 }}>
        {info.desc}
      </p>

      {/* PPDAC rozetleri */}
      {info.phases.length > 0 && (
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 20 }}>
          <span style={{ fontSize: fs(10), fontWeight: 700, color: P.textSoft, marginRight: 4, display: "flex", alignItems: "center" }}>
            {t("cycle")}:
          </span>
          {PPDAC_PHASES.filter(p => info.phases.includes(p.id)).map(p => (
            <span key={p.id} style={{
              fontSize: fs(10), fontWeight: 700, color: P.accentD,
              background: P.accentL,
              padding: "3px 8px", borderRadius: 10,
              display: "flex", alignItems: "center", gap: 4,
            }}>
              <span>{p.icon}</span>
              <span>{tt(p.name)}</span>
            </span>
          ))}
        </div>
      )}

      {/* Yakında kartı */}
      <div style={{
        padding: 30, borderRadius: 14,
        background: "#fff",
        border: "2px dashed " + P.accent + "40",
        textAlign: "center",
      }}>
        <div style={{ fontSize: fs(42), marginBottom: 10, opacity: 0.4 }}>🚧</div>
        <div style={{ fontSize: fs(16), fontWeight: 800, color: P.accentD, marginBottom: 6 }}>
          {t("comingSoon")}
        </div>
        <div style={{ fontSize: fs(12), color: P.textSoft, lineHeight: 1.6 }}>
          {t("comingSoonDesc")}
        </div>
      </div>

      {/* Seviye detayı — şu anki Curcio seviyesini göster */}
      <div style={{
        marginTop: 20,
        padding: 18, borderRadius: 12,
        background: levelData.colorSoft,
        border: "1.5px solid " + levelData.color + "50",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: fs(20) }}>{levelData.icon}</span>
          <div>
            <div style={{ fontSize: fs(14), fontWeight: 800, color: levelData.color }}>
              L{levelData.id}: {tt(levelData.name)}
            </div>
            <div style={{ fontSize: fs(10), color: P.textSoft }}>
              {t("age")}: {levelData.ageRange}
            </div>
          </div>
        </div>
        <div style={{ fontSize: fs(10), fontWeight: 800, color: levelData.color, textTransform: "uppercase", letterSpacing: .4, marginBottom: 4 }}>
          ✓ {t("canDo")}
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: fs(11), color: P.textSoft, lineHeight: 1.55 }}>
          {(levelData.canDo[lang] || levelData.canDo.tr).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <div style={{ fontSize: fs(10), fontWeight: 800, color: "rgba(30,41,59,.6)", textTransform: "uppercase", letterSpacing: .4, marginTop: 10, marginBottom: 4 }}>
          🎯 {t("teacherFocus")}
        </div>
        <p style={{ margin: 0, fontSize: fs(11), color: P.textSoft, lineHeight: 1.55 }}>
          {tt(levelData.teacherFocus)}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// AYAR GEÇİŞ BİLEŞENİ
