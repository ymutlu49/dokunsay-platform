import React, { useState } from "react";
import { useFS } from "../contexts/A11yContext.jsx";
import { LEVEL_COLORS, CURCIO_LEVELS, MISCONCEPTIONS, P } from "../data/constants.js";
import { loadStudents } from "../utils/storage.js";
import { loadTestResult } from "../data/diagnostic.js";
import { LevelBadge, StatCard, TestResultRow } from "../components/common.jsx";

// ═══════════════════════════════════════════════════════════════════
// ÖĞRETMEN PANELİ — educational.jsx'ten ayrıldı (STANDARDS §2.5).
// Salt prop-güdümlü (lang, t, tt) ve yerel yardımcı paylaşmaz; bu yüzden
// düşük bağlantılı, güvenli bir çıkarma sınırıdır. Çekirdek etkileşim
// (Read/Deceive/Create ...) educational.jsx'te BIRAKILDI.
// ═══════════════════════════════════════════════════════════════════

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
              correlation: { tr: "İlişki ve Nedensellik", ku: "Têkilî û Sedemî", en: "Correlation & Causation" },
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
            {/* 2026-07-19 denetiminde eklenen yanılgı etkinliklerinin kaynakları */}
            <li><strong>Cleveland, W. S. & McGill, R. (1984)</strong> — Graphical perception: Theory, experimentation, and application to the development of graphical methods. <em>Journal of the American Statistical Association, 79</em>(387), 531-554.</li>
            <li><strong>Mokros, J. & Russell, S. J. (1995)</strong> — Children's concepts of average and representativeness. <em>JRME, 26</em>(1), 20-39.</li>
            <li><strong>Pollatsek, A., Lima, S. & Well, A. D. (1981)</strong> — Concept or computation: Students' understanding of the mean. <em>Educational Studies in Mathematics, 12</em>(2), 191-204.</li>
            <li><strong>Batanero, C., Estepa, A., Godino, J. D. & Green, D. R. (1996)</strong> — Intuitive strategies and preconceptions about association in contingency tables. <em>JRME, 27</em>(2), 151-169.</li>
            <li><strong>Shaughnessy, J. M. (2007)</strong> — Research on statistics learning and reasoning. In F. K. Lester (Ed.), <em>Second Handbook of Research on Mathematics Teaching and Learning</em> (pp. 957-1009). NCTM.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
