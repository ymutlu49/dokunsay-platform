import React, { useMemo, memo } from "react";
import { useFS } from "../contexts/A11yContext.jsx";
import { P } from "../data/constants.js";

export function BarChart({ data, highlight, truncated, colorblindMode }) {
  const fs = useFS();
  // data: { title, categories: [...], values: [...], unit, xLabel, yLabel, maxHint? }
  const palette = colorblindMode ? P.okabe : ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
  const W = 360, H = 260;
  const padL = 44, padR = 14, padT = 30, padB = 56;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const n = data.categories.length;
  const maxVal = data.maxHint || Math.max(...data.values);
  // truncated: y-ekseni sıfırdan başlamıyor — Huff 1954 yanıltma örneği için
  const minVal = truncated ? Math.min(...data.values) * 0.9 : 0;
  const range = maxVal - minVal;
  const barW = (plotW / n) * 0.65;
  const gap = (plotW / n) * 0.35;

  // Y ekseni tik değerleri (4 aralık)
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => minVal + f * range);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 460, height: "auto", display: "block" }}>
      {/* Başlık */}
      {data.title && (
        <text x={W / 2} y={16} textAnchor="middle"
          style={{ fontSize: fs(12), fontWeight: 800, fill: P.text, fontFamily: "system-ui" }}>
          {data.title}
        </text>
      )}

      {/* Y ekseni */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH}
        stroke={P.textSoft} strokeWidth={1.2}/>
      {/* X ekseni */}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH}
        stroke={P.textSoft} strokeWidth={1.2}/>

      {/* Y ekseni tikler + yatay kılavuz çizgileri */}
      {yTicks.map((v, i) => {
        const y = padT + plotH - (i / 4) * plotH;
        return (
          <g key={i}>
            <line x1={padL - 3} y1={y} x2={padL + plotW} y2={y}
              stroke={i === 0 ? P.textSoft : "rgba(30,41,59,.08)"} strokeWidth={i === 0 ? 1.2 : 1}/>
            <text x={padL - 6} y={y + 3} textAnchor="end"
              style={{ fontSize: fs(9), fill: P.textSoft, fontFamily: "system-ui" }}>
              {Math.round(v * 10) / 10}
            </text>
          </g>
        );
      })}

      {/* Y ekseni etiketi */}
      {data.yLabel && (
        <text x={12} y={padT + plotH / 2} textAnchor="middle"
          transform={`rotate(-90, 12, ${padT + plotH / 2})`}
          style={{ fontSize: fs(10), fontWeight: 700, fill: P.textSoft, fontFamily: "system-ui" }}>
          {data.yLabel}
        </text>
      )}

      {/* Çubuklar */}
      {data.values.map((v, i) => {
        const x = padL + (i + 0.5) * (plotW / n) - barW / 2;
        const h = ((v - minVal) / range) * plotH;
        const y = padT + plotH - h;
        const color = palette[i % palette.length];
        const isHL = highlight === i;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={Math.max(0, h)}
              fill={color}
              fillOpacity={isHL ? 1 : 0.82}
              stroke={isHL ? P.text : "none"}
              strokeWidth={isHL ? 2 : 0}
              rx={3}/>
            {/* Değer etiketi */}
            <text x={x + barW / 2} y={y - 4} textAnchor="middle"
              style={{ fontSize: fs(10), fontWeight: 700, fill: P.text, fontFamily: "system-ui" }}>
              {v}
            </text>
            {/* Kategori etiketi */}
            <text x={x + barW / 2} y={padT + plotH + 14} textAnchor="middle"
              style={{ fontSize: fs(9.5), fontWeight: 600, fill: P.textSoft, fontFamily: "system-ui" }}>
              {data.categories[i]}
            </text>
          </g>
        );
      })}

      {/* Truncated uyarı — Huff görselleştirmesi için */}
      {truncated && (
        <g>
          <path d={`M ${padL - 8} ${padT + plotH - 12} l 4 -3 l -4 -3 l 4 -3 l -4 -3`}
            fill="none" stroke="#ef4444" strokeWidth={1.5}/>
        </g>
      )}

      {/* X ekseni etiketi */}
      {data.xLabel && (
        <text x={padL + plotW / 2} y={H - 6} textAnchor="middle"
          style={{ fontSize: fs(10), fontWeight: 700, fill: P.textSoft, fontFamily: "system-ui" }}>
          {data.xLabel}
        </text>
      )}

      {/* Birim */}
      {data.unit && (
        <text x={W - padR} y={padT - 6} textAnchor="end"
          style={{ fontSize: fs(9), fontStyle: "italic", fill: P.textSoft, fontFamily: "system-ui" }}>
          ({data.unit})
        </text>
      )}
    </svg>
  );
}


export function Pictograph({ data, colorblindMode }) {
  const fs = useFS();
  // data: { title, categories, counts, perIcon, iconType }
  const W = 360, H = Math.max(200, 70 + data.categories.length * 36);
  const palette = colorblindMode ? P.okabe : ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  // İkon SVG'leri (inline)
  const ICON_PATHS = {
    person: "M 10 3 a 3 3 0 1 1 0 6 a 3 3 0 0 1 0 -6 M 4 17 v -2 a 5 5 0 0 1 5 -5 h 2 a 5 5 0 0 1 5 5 v 2",
    star:   "M 10 2 L 12 7 L 18 8 L 13 12 L 14 18 L 10 15 L 6 18 L 7 12 L 2 8 L 8 7 Z",
    heart:  "M 10 16 C 10 16 3 12 3 7 C 3 5 5 3 7 3 C 8 3 10 4 10 5 C 10 4 12 3 13 3 C 15 3 17 5 17 7 C 17 12 10 16 10 16 Z",
    apple:  "M 10 5 C 7 5 4 7 4 11 C 4 15 7 18 10 18 C 13 18 16 15 16 11 C 16 7 13 5 10 5 M 10 5 C 10 3 11 2 13 2",
  };
  const iconPath = ICON_PATHS[data.iconType] || ICON_PATHS.person;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 460, height: "auto", display: "block" }}>
      {data.title && (
        <text x={W / 2} y={16} textAnchor="middle"
          style={{ fontSize: fs(12), fontWeight: 800, fill: P.text, fontFamily: "system-ui" }}>
          {data.title}
        </text>
      )}

      {data.categories.map((cat, i) => {
        const y = 40 + i * 36;
        const count = data.counts[i];
        const icons = Math.ceil(count / (data.perIcon || 1));
        const color = palette[i % palette.length];
        return (
          <g key={i}>
            {/* Kategori etiketi (solda) */}
            <text x={10} y={y + 15} textAnchor="start"
              style={{ fontSize: fs(11), fontWeight: 700, fill: P.text, fontFamily: "system-ui" }}>
              {cat}
            </text>
            {/* İkonlar */}
            {Array.from({ length: icons }).map((_, j) => (
              <g key={j} transform={`translate(${90 + j * 22}, ${y})`}>
                <path d={iconPath} fill={color} fillOpacity={0.85}/>
              </g>
            ))}
            {/* Sağda toplam */}
            <text x={W - 10} y={y + 15} textAnchor="end"
              style={{ fontSize: fs(11), fontWeight: 800, fill: color, fontFamily: "system-ui" }}>
              {count}
            </text>
          </g>
        );
      })}

      {/* Altta legend: 1 ikon = N */}
      <g transform={`translate(${W / 2 - 60}, ${H - 22})`}>
        <path d={ICON_PATHS[data.iconType]} fill={P.textSoft} transform="scale(0.8)"/>
        <text x={26} y={12}
          style={{ fontSize: fs(10), fontWeight: 600, fill: P.textSoft, fontFamily: "system-ui" }}>
          = {data.perIcon || 1} {data.unit || ""}
        </text>
      </g>
    </svg>
  );
}


export function DataTable({ data }) {
  const fs = useFS();
  // data: { title, headers, rows }
  return (
    <div style={{ width: "100%", maxWidth: 460 }}>
      {data.title && (
        <div style={{ fontSize: fs(12), fontWeight: 800, color: P.text, marginBottom: 8, textAlign: "center" }}>
          {data.title}
        </div>
      )}
      <table style={{
        width: "100%", borderCollapse: "collapse",
        fontSize: fs(12), fontFamily: "system-ui",
        background: "#fff",
        borderRadius: 8, overflow: "hidden",
        boxShadow: "0 1px 4px rgba(30,41,59,.08)",
      }}>
        <thead>
          <tr style={{ background: P.accentL }}>
            {data.headers.map((h, i) => (
              <th key={i} style={{
                padding: "9px 12px", textAlign: "left",
                fontWeight: 800, color: P.accentD,
                borderBottom: `2px solid ${P.accent}`,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "rgba(59,130,246,.03)" }}>
              {row.map((cell, j) => (
                <td key={j} style={{
                  padding: "8px 12px",
                  color: j === 0 ? P.text : P.textSoft,
                  fontWeight: j === 0 ? 700 : 500,
                  borderBottom: "1px solid rgba(30,41,59,.05)",
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export function LineChart({ data, colorblindMode }) {
  const fs = useFS();
  const palette = colorblindMode ? P.okabe : ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
  const W = 360, H = 240;
  const padL = 44, padR = 14, padT = 30, padB = 44;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const n = data.categories.length;
  const maxVal = data.maxHint || Math.max(...data.values);
  const minVal = 0;
  const range = Math.max(1, maxVal - minVal);
  const xStep = plotW / Math.max(1, n - 1);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(f => minVal + f * range);
  const color = palette[0];

  const points = data.values.map((v, i) => {
    const x = padL + i * xStep;
    const y = padT + plotH - ((v - minVal) / range) * plotH;
    return { x, y };
  });
  const pathD = points.map((p, i) => (i === 0 ? "M" : "L") + ` ${p.x} ${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 460, height: "auto", display: "block" }}>
      {data.title && (
        <text x={W / 2} y={16} textAnchor="middle"
          style={{ fontSize: fs(12), fontWeight: 800, fill: P.text, fontFamily: "system-ui" }}>
          {data.title}
        </text>
      )}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={P.textSoft} strokeWidth={1.2}/>
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={P.textSoft} strokeWidth={1.2}/>
      {yTicks.map((v, i) => {
        const y = padT + plotH - (i / 4) * plotH;
        return (
          <g key={i}>
            <line x1={padL - 3} y1={y} x2={padL + plotW} y2={y}
              stroke={i === 0 ? P.textSoft : "rgba(30,41,59,.08)"} strokeWidth={i === 0 ? 1.2 : 1}/>
            <text x={padL - 6} y={y + 3} textAnchor="end"
              style={{ fontSize: fs(9), fill: P.textSoft, fontFamily: "system-ui" }}>
              {Math.round(v * 10) / 10}
            </text>
          </g>
        );
      })}
      <path d={pathD} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"/>
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={color} stroke="#fff" strokeWidth={1.5}/>
          <text x={p.x} y={p.y - 9} textAnchor="middle"
            style={{ fontSize: fs(9), fontWeight: 700, fill: P.text, fontFamily: "system-ui" }}>
            {data.values[i]}
          </text>
          <text x={p.x} y={padT + plotH + 14} textAnchor="middle"
            style={{ fontSize: fs(9), fontWeight: 600, fill: P.textSoft, fontFamily: "system-ui" }}>
            {data.categories[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}


export function PieChart({ data, colorblindMode }) {
  const fs = useFS();
  const palette = colorblindMode ? P.okabe : ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
  const W = 360, H = 260;
  const cx = 120, cy = 130, r = 80;
  const total = data.values.reduce((a, b) => a + b, 0) || 1;
  let a0 = -Math.PI / 2;
  const slices = data.values.map((v, i) => {
    const frac = v / total;
    const a1 = a0 + frac * 2 * Math.PI;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const large = frac > 0.5 ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`;
    // Etiket pozisyonu (dilim ortasında, hafif dışarı)
    const am = (a0 + a1) / 2;
    const lx = cx + (r * 0.65) * Math.cos(am);
    const ly = cy + (r * 0.65) * Math.sin(am);
    const percent = Math.round(frac * 100);
    const slice = { d, color: palette[i % palette.length], lx, ly, percent, cat: data.categories[i], value: v };
    a0 = a1;
    return slice;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 460, height: "auto", display: "block" }}>
      {data.title && (
        <text x={W / 2} y={18} textAnchor="middle"
          style={{ fontSize: fs(12), fontWeight: 800, fill: P.text, fontFamily: "system-ui" }}>
          {data.title}
        </text>
      )}
      {slices.map((s, i) => (
        <g key={i}>
          <path d={s.d} fill={s.color} fillOpacity={0.85} stroke="#fff" strokeWidth={2}/>
          {s.percent >= 5 && (
            <text x={s.lx} y={s.ly} textAnchor="middle"
              style={{ fontSize: fs(10), fontWeight: 800, fill: "#fff", fontFamily: "system-ui" }}>
              {s.percent}%
            </text>
          )}
        </g>
      ))}
      {/* Legend */}
      {slices.map((s, i) => (
        <g key={`lg${i}`} transform={`translate(${W - 140}, ${30 + i * 20})`}>
          <rect x={0} y={0} width={12} height={12} fill={s.color} rx={2}/>
          <text x={18} y={10}
            style={{ fontSize: fs(10), fontWeight: 600, fill: P.text, fontFamily: "system-ui" }}>
            {s.cat} <tspan fill={P.textSoft}>({s.value})</tspan>
          </text>
        </g>
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
// PEARSON KORELASYON KATSAYISI
// r değeri -1 ile +1 arası:
//   +1: mükemmel pozitif ilişki
//    0: ilişki yok
//   -1: mükemmel negatif ilişki
// Her zaman hatırla: Korelasyon NEDENSELLIK DEĞİLDİR.

export function ScatterPlot({ data, showTrend, showCorrelation, highlightIdx, colorblindMode }) {
  const fs = useFS();
  // data: { title, xLabel, yLabel, points: [{x, y, label?}] }
  const palette = colorblindMode ? P.okabe : ["#3b82f6"];
  const color = palette[0];
  const W = 380, H = 300;
  const padL = 50, padR = 20, padT = 36, padB = 50;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // TÜM hesaplamalar useMemo altında — data referansı değişmedikçe yeniden hesaplanmaz
  const computed = useMemo(() => {
    const xs = data.points.map(p => p.x);
    const ys = data.points.map(p => p.y);
    const xMin = Math.min(...xs);
    const xMax = Math.max(...xs);
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);
    const xRange = Math.max(1, xMax - xMin);
    const yRange = Math.max(1, yMax - yMin);
    const xPad = xRange * 0.08;
    const yPad = yRange * 0.08;
    const xLo = xMin - xPad;
    const xHi = xMax + xPad;
    const yLo = yMin - yPad;
    const yHi = yMax + yPad;

    // Trend line için regresyon
    const n = xs.length;
    const mx = xs.reduce((a, b) => a + b, 0) / n;
    const my = ys.reduce((a, b) => a + b, 0) / n;
    let sxy = 0, sxx = 0;
    for (let i = 0; i < n; i++) {
      sxy += (xs[i] - mx) * (ys[i] - my);
      sxx += (xs[i] - mx) ** 2;
    }
    const slope = sxx === 0 ? 0 : sxy / sxx;
    const intercept = my - slope * mx;

    // r değeri
    const r = pearson(xs, ys);

    return { xs, ys, xLo, xHi, yLo, yHi, slope, intercept, r };
  }, [data.points]);

  const { xs, ys, xLo, xHi, yLo, yHi, slope, intercept, r } = computed;

  const xOf = v => padL + ((v - xLo) / (xHi - xLo)) * plotW;
  const yOf = v => padT + plotH - ((v - yLo) / (yHi - yLo)) * plotH;

  // Y tik değerleri
  const yTicks = [];
  const tickCount = 5;
  for (let i = 0; i <= tickCount; i++) {
    yTicks.push(yLo + (i / tickCount) * (yHi - yLo));
  }
  const xTicks = [];
  for (let i = 0; i <= tickCount; i++) {
    xTicks.push(xLo + (i / tickCount) * (xHi - xLo));
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 480, height: "auto", display: "block" }}>
      {/* Başlık */}
      {data.title && (
        <text x={W / 2} y={18} textAnchor="middle"
          style={{ fontSize: fs(12), fontWeight: 800, fill: P.text, fontFamily: "system-ui" }}>
          {data.title}
        </text>
      )}

      {/* Y ekseni */}
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={P.textSoft} strokeWidth={1.2}/>
      {/* X ekseni */}
      <line x1={padL} y1={padT + plotH} x2={padL + plotW} y2={padT + plotH} stroke={P.textSoft} strokeWidth={1.2}/>

      {/* Y tikler + yatay kılavuz */}
      {yTicks.map((v, i) => {
        const y = yOf(v);
        return (
          <g key={`y${i}`}>
            <line x1={padL} y1={y} x2={padL + plotW} y2={y}
              stroke="rgba(30,41,59,.06)" strokeWidth={1}/>
            <text x={padL - 6} y={y + 3} textAnchor="end"
              style={{ fontSize: fs(9), fill: P.textSoft, fontFamily: "system-ui" }}>
              {Math.round(v * 10) / 10}
            </text>
          </g>
        );
      })}

      {/* X tikler */}
      {xTicks.map((v, i) => {
        const x = xOf(v);
        return (
          <g key={`x${i}`}>
            <line x1={x} y1={padT + plotH} x2={x} y2={padT + plotH + 3}
              stroke={P.textSoft} strokeWidth={1}/>
            <text x={x} y={padT + plotH + 14} textAnchor="middle"
              style={{ fontSize: fs(9), fill: P.textSoft, fontFamily: "system-ui" }}>
              {Math.round(v * 10) / 10}
            </text>
          </g>
        );
      })}

      {/* Trend çizgisi */}
      {showTrend && n >= 2 && (
        <line
          x1={xOf(xLo)} y1={yOf(slope * xLo + intercept)}
          x2={xOf(xHi)} y2={yOf(slope * xHi + intercept)}
          stroke="#ef4444" strokeWidth={1.8} strokeDasharray="5,4" strokeLinecap="round"
          style={{ opacity: 0.75 }}/>
      )}

      {/* Noktalar */}
      {data.points.map((p, i) => {
        const cx = xOf(p.x);
        const cy = yOf(p.y);
        const isHL = highlightIdx === i;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={isHL ? 7 : 5}
              fill={color}
              fillOpacity={isHL ? 1 : 0.72}
              stroke={isHL ? P.text : "#fff"}
              strokeWidth={isHL ? 2 : 1.5}/>
            {p.label && isHL && (
              <text x={cx} y={cy - 10} textAnchor="middle"
                style={{ fontSize: fs(9), fontWeight: 700, fill: P.text, fontFamily: "system-ui" }}>
                {p.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Eksen etiketleri */}
      {data.xLabel && (
        <text x={padL + plotW / 2} y={H - 8} textAnchor="middle"
          style={{ fontSize: fs(10), fontWeight: 700, fill: P.textSoft, fontFamily: "system-ui" }}>
          {data.xLabel} →
        </text>
      )}
      {data.yLabel && (
        <text x={14} y={padT + plotH / 2} textAnchor="middle"
          transform={`rotate(-90, 14, ${padT + plotH / 2})`}
          style={{ fontSize: fs(10), fontWeight: 700, fill: P.textSoft, fontFamily: "system-ui" }}>
          ↑ {data.yLabel}
        </text>
      )}

      {/* Korelasyon rozeti */}
      {showCorrelation && n >= 2 && (
        <g transform={`translate(${padL + plotW - 95}, ${padT + 6})`}>
          <rect x={0} y={0} width={90} height={26} rx={5}
            fill={r > 0.3 ? "rgba(16,185,129,.12)" : r < -0.3 ? "rgba(239,68,68,.12)" : "rgba(30,41,59,.06)"}
            stroke={r > 0.3 ? "#10b981" : r < -0.3 ? "#ef4444" : "rgba(30,41,59,.2)"}
            strokeWidth={1}/>
          <text x={8} y={12} style={{ fontSize: fs(9), fontWeight: 800, fill: P.textSoft, fontFamily: "system-ui" }}>
            r =
          </text>
          <text x={22} y={12} style={{ fontSize: fs(11), fontWeight: 900,
            fill: r > 0.3 ? "#065f46" : r < -0.3 ? "#991b1b" : P.text, fontFamily: "system-ui" }}>
            {r.toFixed(2)}
          </text>
          <text x={8} y={22} style={{ fontSize: fs(8), fontStyle: "italic", fill: P.textSoft, fontFamily: "system-ui" }}>
            Pearson
          </text>
        </g>
      )}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════
// NOTICE & WONDER STAGE BİLEŞENİ
// Kaynaklar: Barlow (2020) NCTM, NYTimes/ASA What's Going On in This Graph (2017–)
//
// Felsefe: Öğrenci grafiği inceler, "doğru cevap" aranmaz.
// Açık uçlu 3 soru:
//   1. "Ne fark ediyorsun?" (Notice — gözlem)
//   2. "Ne merak ediyorsun?" (Wonder — soru oluştur)
//   3. "Kısa bir başlık yaz" (Headline — özet)
// Her aşama atlanabilir. Yazılanlar yargılanmaz, sadece kaydedilir.
// Öğretmen panosunda tüm notlar görünür.
