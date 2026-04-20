import React, { useState, useEffect, useRef } from "react";
import { useFS } from "../contexts/A11yContext.jsx";
import { SpeakButton, LevelBadge } from "./common.jsx";
import { ONBOARDING_SLIDES } from "../data/activities.jsx";
import { LEVEL_COLORS } from "../data/constants.js";
import { loadStudents, saveStudents, loadCurrentStudent, saveCurrentStudent, genStudentId } from "../utils/storage.js";
import { getDiagnosticSet, computeStartLevel, resolveOption } from "../data/diagnostic.js";

export function OnboardingTour({ lang, onFinish }) {
  const [idx, setIdx] = useState(0);
  const slide = ONBOARDING_SLIDES[idx];
  const isLast = idx === ONBOARDING_SLIDES.length - 1;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(15,23,42,.7)",
      backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        maxWidth: 480, width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,.3)",
        overflow: "hidden",
      }}>
        {/* Üst: büyük ikon + renkli bant */}
        <div style={{
          background: `linear-gradient(135deg, ${slide.color}, ${slide.color}cc)`,
          padding: "32px 24px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>{slide.icon}</div>
          <h2 style={{
            fontSize: 20, fontWeight: 900, color: "#fff",
            margin: 0, lineHeight: 1.3,
          }}>
            {slide.title[lang] || slide.title.tr}
          </h2>
        </div>

        {/* Gövde metin */}
        <div style={{ padding: "22px 24px 12px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <SpeakButton text={slide.body[lang] || slide.body.tr} size="md"/>
            <p style={{
              flex: 1, fontSize: 13.5, color: "#1e293b",
              lineHeight: 1.65, margin: 0,
            }}>
              {slide.body[lang] || slide.body.tr}
            </p>
          </div>
        </div>

        {/* Alt: nokta göstergesi + butonlar */}
        <div style={{ padding: "12px 24px 20px", display: "flex",
          alignItems: "center", gap: 12 }}>
          {/* Noktalar */}
          <div style={{ display: "flex", gap: 6 }}>
            {ONBOARDING_SLIDES.map((_, i) => (
              <div key={i} style={{
                width: i === idx ? 20 : 7, height: 7, borderRadius: 4,
                background: i === idx ? slide.color : "rgba(30,41,59,.2)",
                transition: "all .2s",
              }}/>
            ))}
          </div>
          <div style={{ flex: 1 }}/>

          {/* Butonlar */}
          {idx > 0 && (
            <button onClick={() => setIdx(i => i - 1)} style={{
              padding: "8px 14px", borderRadius: 8,
              border: "1.5px solid rgba(30,41,59,.15)",
              background: "#fff", color: "#64748b",
              cursor: "pointer", fontFamily: "inherit",
              fontSize: 12, fontWeight: 700,
            }}>
              ← {lang === "ku" ? "Berê" : lang === "en" ? "Back" : "Geri"}
            </button>
          )}
          <button onClick={isLast ? onFinish : () => setIdx(i => i + 1)} style={{
            padding: "9px 18px", borderRadius: 8, border: "none",
            background: slide.color, color: "#fff",
            cursor: "pointer", fontFamily: "inherit",
            fontSize: 12.5, fontWeight: 800,
            boxShadow: `0 2px 10px ${slide.color}66`,
          }}>
            {isLast
              ? (lang === "ku" ? "Dest Pê Bike →" : lang === "en" ? "Let's Start →" : "Başla →")
              : (lang === "ku" ? "Paşê →" : lang === "en" ? "Next →" : "İleri →")}
          </button>
        </div>

        {/* Skip link */}
        {!isLast && (
          <div style={{ textAlign: "center", paddingBottom: 14 }}>
            <button onClick={onFinish} style={{
              background: "transparent", border: "none",
              color: "#94a3b8", fontSize: 10, fontFamily: "inherit",
              cursor: "pointer", textDecoration: "underline",
            }}>
              {lang === "ku" ? "Turê derbas bike" : lang === "en" ? "Skip the tour" : "Turu atla"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ÖĞRENCI PROFİL YÖNETİMİ — çoklu profil altyapısı
// • currentStudent: { id, name } — localStorage'da kalıcı
// • Her gözlem/puan kaydı bu öğrenciyle ilişkilendirilir
// • Öğretmen panosunda filtre yapılabilir
// ═══════════════════════════════════════════════════════════════════

export function StudentProfileSetup({ lang, onSelect, onCancel, allowSkip = false }) {
  const [name, setName] = useState("");
  const [students, setStudents] = useState(loadStudents());
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  function createProfile() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newStudent = { id: genStudentId(), name: trimmed, created: Date.now() };
    const updated = [...students, newStudent];
    saveStudents(updated);
    saveCurrentStudent(newStudent);
    onSelect(newStudent);
  }

  function selectExisting(student) {
    saveCurrentStudent(student);
    onSelect(student);
  }

  function useGuest() {
    const guest = { id: "guest", name: lang === "ku" ? "Mêvan" : lang === "en" ? "Guest" : "Ziyaretçi", isGuest: true };
    saveCurrentStudent(guest);
    onSelect(guest);
  }

  function deleteProfile(id, e) {
    e.stopPropagation();
    if (!window.confirm(lang === "ku" ? "Profîlê jêbibe?" : lang === "en" ? "Delete this profile?" : "Bu profili sil?")) return;
    const updated = students.filter(s => s.id !== id);
    saveStudents(updated);
    setStudents(updated);
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1100,
      background: "rgba(15,23,42,.75)",
      backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        maxWidth: 460, width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,.3)",
        overflow: "hidden",
      }}>
        {/* Başlık */}
        <div style={{
          padding: "24px 24px 16px",
          background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
          color: "#fff", textAlign: "center",
        }}>
          <div style={{ fontSize: 44, marginBottom: 6 }}>👤</div>
          <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0, lineHeight: 1.3 }}>
            {lang === "ku"
              ? "Kî yî tu?"
              : lang === "en"
              ? "Who are you?"
              : "Kimsin sen?"}
          </h2>
          <p style={{ fontSize: 11, margin: "6px 0 0", opacity: 0.9, lineHeight: 1.5 }}>
            {lang === "ku"
              ? "Navê xwe binivîse da ku pêşveçûna te were tomarkirin"
              : lang === "en"
              ? "Write your name so your progress gets recorded"
              : "İlerlemen kaydedilebilsin diye adını yaz"}
          </p>
        </div>

        {/* Varolan profiller */}
        {students.length > 0 && (
          <div style={{ padding: "16px 20px 0" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b",
              textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>
              {lang === "ku" ? "Profîlên hene" : lang === "en" ? "Existing profiles" : "Mevcut profiller"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5, maxHeight: 140, overflowY: "auto" }}>
              {students.map(s => (
                <button key={s.id} onClick={() => selectExisting(s)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px", borderRadius: 8,
                    border: "1.5px solid rgba(139,92,246,.2)",
                    background: "rgba(139,92,246,.04)",
                    color: "#1e293b", cursor: "pointer", fontFamily: "inherit",
                    fontSize: 12, fontWeight: 700, textAlign: "left",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(139,92,246,.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(139,92,246,.04)"}>
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                    color: "#fff", fontSize: 13, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{s.name.substring(0, 1).toUpperCase()}</span>
                  <span style={{ flex: 1 }}>{s.name}</span>
                  <span onClick={(e) => deleteProfile(s.id, e)} style={{
                    padding: "2px 7px", color: "#94a3b8",
                    borderRadius: 4, fontSize: 14,
                  }} title={lang === "en" ? "Delete" : "Sil"}>×</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Yeni profil yarat */}
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b",
            textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>
            {lang === "ku" ? "Profîla nû çêke" : lang === "en" ? "Create new profile" : "Yeni profil"}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") createProfile(); }}
              placeholder={lang === "ku" ? "Navê te" : lang === "en" ? "Your name" : "Adın"}
              maxLength={30}
              style={{
                flex: 1, padding: "10px 12px", borderRadius: 8,
                border: "1.5px solid rgba(30,41,59,.15)",
                fontSize: 13, fontFamily: "inherit",
                outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = "#8b5cf6"}
              onBlur={e => e.target.style.borderColor = "rgba(30,41,59,.15)"}
            />
            <button onClick={createProfile}
              disabled={!name.trim()}
              style={{
                padding: "10px 16px", borderRadius: 8, border: "none",
                background: name.trim() ? "#8b5cf6" : "rgba(139,92,246,.3)",
                color: "#fff", cursor: name.trim() ? "pointer" : "not-allowed",
                fontFamily: "inherit", fontSize: 12, fontWeight: 800,
              }}>
              ✓ {lang === "ku" ? "Çêke" : lang === "en" ? "Create" : "Oluştur"}
            </button>
          </div>
        </div>

        {/* Alt aksiyon — Ziyaretçi veya İptal */}
        <div style={{
          padding: "14px 20px", background: "#f8fafc",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderTop: "1px solid rgba(30,41,59,.06)",
        }}>
          <button onClick={useGuest}
            style={{
              padding: "7px 12px", borderRadius: 7,
              border: "1px solid rgba(30,41,59,.15)",
              background: "#fff", color: "#64748b",
              cursor: "pointer", fontFamily: "inherit",
              fontSize: 11, fontWeight: 700,
            }}>
            👤 {lang === "ku" ? "Wekî Mêvan" : lang === "en" ? "Continue as Guest" : "Ziyaretçi olarak devam"}
          </button>
          {allowSkip && (
            <button onClick={onCancel}
              style={{
                background: "transparent", border: "none",
                color: "#94a3b8", fontSize: 11, cursor: "pointer",
                fontFamily: "inherit", textDecoration: "underline",
              }}>
              {lang === "ku" ? "Betal" : lang === "en" ? "Cancel" : "İptal"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function DiagnosticTest({ lang, kind = "pre", onFinish, onCancel, studentName }) {
  const fs = useFS();
  const questions = getDiagnosticSet(kind);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState("intro"); // intro | question | results

  const q = questions[idx];
  const isLast = idx === questions.length - 1;

  function handleChoice(optIdx) {
    if (selected !== null) return;
    setSelected(optIdx);
    const isCorrect = optIdx === q.correct;
    setAnswers(a => ({ ...a, [q.id]: isCorrect }));
  }

  function handleNext() {
    if (isLast) {
      // Bitir: analiz et
      setPhase("results");
    } else {
      setIdx(i => i + 1);
      setSelected(null);
    }
  }

  // Intro ekranı
  if (phase === "intro") {
    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 1200,
        background: "rgba(15,23,42,.75)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}>
        <div style={{
          background: "#fff", borderRadius: 16,
          maxWidth: 480, width: "100%",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,.3)",
        }}>
          <div style={{
            background: "linear-gradient(135deg, #0891b2, #0e7490)",
            padding: "28px 24px 20px",
            color: "#fff", textAlign: "center",
          }}>
            <div style={{ fontSize: 50, marginBottom: 6 }}>📋</div>
            <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>
              {kind === "pre"
                ? (lang === "ku" ? "Teşhîsa Destpêkê" : lang === "en" ? "Starting Diagnostic" : "Başlangıç Teşhisi")
                : (lang === "ku" ? "Ceribandina Paşê" : lang === "en" ? "Progress Check" : "Gelişim Sınaması")}
            </h2>
            {studentName && (
              <div style={{ fontSize: 11, marginTop: 6, opacity: 0.9 }}>
                👤 {studentName}
              </div>
            )}
          </div>
          <div style={{ padding: "22px 24px 16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
              <SpeakButton text={
                kind === "pre"
                  ? (lang === "ku" ? "8 pirsên piçûk. Bibîne tu di kîjan astê de dest pê bikî. Bersiva çewt baş e — em ji kîjan derê dest pê bikin dibînin." : lang === "en" ? "8 quick questions to see where you start. Wrong answers are fine — we're finding your level." : "8 kısa soru. Hangi seviyeden başlamalısın anlayacağız. Yanlış cevap iyi — seviye tespit ediyoruz.")
                  : (lang === "ku" ? "Heman 8 pirs. Bibîne tu çiqas pêşveçûn kirî!" : lang === "en" ? "Same 8 questions. See how much you've progressed!" : "Aynı 8 soru. Ne kadar ilerlediğini görelim!")
              } size="md"/>
              <p style={{ flex: 1, fontSize: 13, lineHeight: 1.6, color: "#1e293b", margin: 0 }}>
                {kind === "pre"
                  ? (lang === "ku" ? "8 pirsên piçûk. Bibîne tu di kîjan astê de dest pê bikî. Bersiva çewt baş e — em ji kîjan derê dest pê bikin dibînin." : lang === "en" ? "8 quick questions to see where you start. Wrong answers are fine — we're finding your level." : "8 kısa soru. Hangi seviyeden başlamalısın anlayacağız. Yanlış cevap iyi — seviye tespit ediyoruz.")
                  : (lang === "ku" ? "Heman 8 pirs. Bibîne tu çiqas pêşveçûn kirî!" : lang === "en" ? "Same 8 questions. See how much you've progressed!" : "Aynı 8 soru. Ne kadar ilerlediğini görelim!")}
              </p>
            </div>
            <div style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5, fontStyle: "italic", padding: "8px 10px", background: "rgba(0,0,0,.03)", borderRadius: 7, marginBottom: 6 }}>
              {lang === "ku"
                ? "⏱ Nêzî 3-5 deqeyan dikişîne. Li her pirsê yek bersiv hilbijêre. Paşê nebe."
                : lang === "en"
                ? "⏱ Takes about 3-5 minutes. Pick one answer per question. No going back."
                : "⏱ 3-5 dakika sürer. Her soruda bir cevap seç. Geri dönüş yok."}
            </div>
          </div>
          <div style={{ padding: "14px 20px 20px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
            {onCancel && (
              <button onClick={onCancel} style={{
                padding: "9px 16px", borderRadius: 8,
                border: "1.5px solid rgba(30,41,59,.15)",
                background: "#fff", color: "#64748b",
                cursor: "pointer", fontFamily: "inherit",
                fontSize: 12, fontWeight: 700,
              }}>
                {lang === "ku" ? "Niha na" : lang === "en" ? "Not now" : "Şimdi değil"}
              </button>
            )}
            <button onClick={() => setPhase("question")} style={{
              padding: "10px 22px", borderRadius: 8, border: "none",
              background: "linear-gradient(135deg, #0891b2, #0e7490)",
              color: "#fff", cursor: "pointer", fontFamily: "inherit",
              fontSize: 13, fontWeight: 800,
              boxShadow: "0 2px 10px rgba(8,145,178,.35)",
            }}>
              ✓ {lang === "ku" ? "Dest Pê Bike" : lang === "en" ? "Start Test" : "Teste Başla"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sonuç ekranı
  if (phase === "results") {
    const { scores, recommended } = computeStartLevel(answers, kind);
    const totalCorrect = Object.values(answers).filter(Boolean).length;
    const recLevel = LEVEL_COLORS[recommended];
    const recLabel = recLevel.label[lang] || recLevel.label.tr;

    return (
      <div style={{
        position: "fixed", inset: 0, zIndex: 1200,
        background: "rgba(15,23,42,.75)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}>
        <div style={{
          background: "#fff", borderRadius: 16,
          maxWidth: 540, width: "100%",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,.3)",
          maxHeight: "90vh", overflowY: "auto",
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${recLevel.color}, ${recLevel.color}dd)`,
            padding: "28px 24px 18px",
            color: "#fff", textAlign: "center",
          }}>
            <div style={{ fontSize: 50, marginBottom: 4 }}>🎯</div>
            <h2 style={{ fontSize: 18, fontWeight: 900, margin: 0 }}>
              {lang === "ku" ? "Teşhîsa Te" : lang === "en" ? "Your Diagnostic" : "Teşhis Sonucun"}
            </h2>
            <div style={{ fontSize: 12, marginTop: 5, opacity: 0.9 }}>
              {totalCorrect}/{questions.length} {lang === "ku" ? "rast" : lang === "en" ? "correct" : "doğru"}
            </div>
          </div>
          <div style={{ padding: "20px 22px" }}>
            {/* Seviyeye göre performans */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: .4, marginBottom: 8 }}>
                {lang === "ku" ? "Li her astê performansa te" : lang === "en" ? "Performance per level" : "Seviyelerdeki performansın"}
              </div>
              {scores.map(s => {
                const lv = LEVEL_COLORS[s.level];
                const label = lv.label[lang] || lv.label.tr;
                const pct = (s.correct / s.total) * 100;
                return (
                  <div key={s.level} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: lv.color }}>
                        L{s.level} · {label}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>
                        {s.correct}/{s.total}
                      </span>
                    </div>
                    <div style={{ height: 7, borderRadius: 4, background: "rgba(0,0,0,.06)", overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: lv.color, transition: "width .4s" }}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Öneri */}
            <div style={{
              padding: "14px 16px", borderRadius: 10,
              background: recLevel.color + "15",
              border: `2px solid ${recLevel.color}`,
              marginBottom: 14,
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: recLevel.color, marginBottom: 4, textTransform: "uppercase", letterSpacing: .5 }}>
                🎓 {lang === "ku" ? "Pêşniyara Me" : lang === "en" ? "Our Recommendation" : "Önerimiz"}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1e293b", marginBottom: 4 }}>
                L{recommended} — {recLabel}
              </div>
              <div style={{ fontSize: 11.5, color: "#475569", lineHeight: 1.55 }}>
                {lang === "ku"
                  ? `Ji bo destpêkê, ji ${`L${recommended}`} dest pê bike. Her dem tu dikarî biguherî.`
                  : lang === "en"
                  ? `Start at L${recommended}. You can change this anytime.`
                  : `L${recommended} seviyesinden başla. İstediğin zaman değiştirebilirsin.`}
              </div>
            </div>
          </div>
          <div style={{ padding: "12px 22px 20px", display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={() => onFinish(answers, recommended)} style={{
              padding: "10px 22px", borderRadius: 8, border: "none",
              background: `linear-gradient(135deg, ${recLevel.color}, ${recLevel.color}dd)`,
              color: "#fff", cursor: "pointer", fontFamily: "inherit",
              fontSize: 13, fontWeight: 800,
            }}>
              ✓ {lang === "ku" ? "Dest Pê Bike" : lang === "en" ? "Let's Begin" : "Hadi Başlayalım"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Soru ekranı
  const scenarioText = q.scenario[lang] || q.scenario.tr;
  const questionText = q.question[lang] || q.question.tr;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1200,
      background: "rgba(15,23,42,.75)",
      backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        maxWidth: 520, width: "100%",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,.3)",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        {/* Başlık + ilerleme */}
        <div style={{
          padding: "16px 20px",
          background: "linear-gradient(135deg, #0891b2, #0e7490)",
          color: "#fff",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 22 }}>📋</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800 }}>
              {lang === "ku" ? "Teşhîs" : lang === "en" ? "Diagnostic" : "Teşhis"}
            </div>
            <div style={{ fontSize: 10, opacity: 0.9 }}>
              {idx + 1}/{questions.length}
            </div>
          </div>
          <LevelBadge level={q.level} lang={lang} compact/>
        </div>

        {/* İlerleme çubuğu */}
        <div style={{ height: 4, background: "rgba(0,0,0,.06)" }}>
          <div style={{
            width: `${((idx + 1) / questions.length) * 100}%`,
            height: "100%", background: "#0891b2",
            transition: "width .3s",
          }}/>
        </div>

        {/* Senaryo */}
        <div style={{ padding: "18px 22px 8px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
            <SpeakButton text={scenarioText} size="sm"/>
            <div style={{
              flex: 1, fontSize: 12.5, color: "#475569",
              background: "rgba(0,0,0,.03)", padding: "10px 12px",
              borderRadius: 7, lineHeight: 1.55, fontStyle: "italic",
            }}>
              {scenarioText}
            </div>
          </div>

          {/* Soru */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 14 }}>
            <SpeakButton text={questionText} size="md"/>
            <div style={{ flex: 1, fontSize: 14, fontWeight: 800, color: "#1e293b", lineHeight: 1.5 }}>
              {questionText}
            </div>
          </div>

          {/* Seçenekler */}
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrect = selected !== null && i === q.correct;
              const isWrongSelect = selected !== null && isSelected && i !== q.correct;
              const optText = resolveOption(opt, lang);
              return (
                <button key={i} onClick={() => handleChoice(i)}
                  disabled={selected !== null}
                  style={{
                    padding: "11px 14px", borderRadius: 8,
                    border: "1.5px solid " + (
                      isCorrect ? "#10b981"
                      : isWrongSelect ? "#ef4444"
                      : isSelected ? "#0891b2"
                      : "rgba(30,41,59,.15)"
                    ),
                    background: isCorrect ? "rgba(16,185,129,.08)"
                      : isWrongSelect ? "rgba(239,68,68,.08)"
                      : isSelected ? "rgba(8,145,178,.08)"
                      : "#fff",
                    color: "#1e293b",
                    cursor: selected !== null ? "default" : "pointer",
                    fontFamily: "inherit",
                    fontSize: 12.5, fontWeight: 600,
                    textAlign: "left",
                    display: "flex", alignItems: "center", gap: 10,
                    transition: "all .15s",
                  }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: isCorrect ? "#10b981" : isWrongSelect ? "#ef4444" : "rgba(0,0,0,.05)",
                    color: (isCorrect || isWrongSelect) ? "#fff" : "#64748b",
                    fontSize: 11, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    {isCorrect ? "✓" : isWrongSelect ? "✗" : String.fromCharCode(65 + i)}
                  </span>
                  <span>{optText}</span>
                </button>
              );
            })}
          </div>

          {/* İlerle butonu — cevap verildiyse */}
          {selected !== null && (
            <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={handleNext} style={{
                padding: "9px 18px", borderRadius: 8, border: "none",
                background: "#0891b2", color: "#fff",
                cursor: "pointer", fontFamily: "inherit",
                fontSize: 12.5, fontWeight: 800,
              }}>
                {isLast
                  ? (lang === "ku" ? "Dîtina Encaman →" : lang === "en" ? "See Results →" : "Sonucu Gör →")
                  : (lang === "ku" ? "Pirsa Paşê →" : lang === "en" ? "Next →" : "Sonraki →")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
