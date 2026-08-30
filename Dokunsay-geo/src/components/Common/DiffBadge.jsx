import { LANGS } from '../../constants/i18n.js';

// ══════════════════════════════════════════════════════════════
// ZORLUK GÖSTERGESİ — STANDARDS §1.6 beş basamağı
//   1 Keşif · 2 Rehberli · 3 Yönlendirilmiş · 4 Bağımsız · 5 Transfer
//
// Platform denetiminde diğer araçlarda çıkan kusurlar burada
// BAŞTAN engellendi:
//  • DokunSayBar: `repeat(3-diff)` → diff 4'te negatif sayı, çöküyordu.
//    Burada sabit 5 nokta çizilir, dolu/boş karşılaştırmayla belirlenir;
//    hiçbir hesap negatife düşemez.
//  • DokunSayBasamak: üçlü ternary üst basamağı sessizce "zor"a
//    düşürüyordu. Burada değer önce 1..5 aralığına KENETLENİR ve
//    renk/etiket dizilerine sınır içi indeksle erişilir.
//  • DokunSayKesir: sınır denetimi yoktu. `clamp` + `Number.isFinite`
//    ile tanımsız/aralık dışı diff sessizce 1'e değil, görünür biçimde
//    en yakın geçerli basamağa oturur.
// ══════════════════════════════════════════════════════════════

const STEPS = 5;
const COLORS = ["#0ea5e9", "#22c55e", "#f59e0b", "#f97316", "#dc2626"];

/** diff'i 1..5 aralığına kenetler; geçersizse 1 döner. */
export function clampDiff(d) {
  const n = Math.round(Number(d));
  if (!Number.isFinite(n)) return 1;
  return Math.min(STEPS, Math.max(1, n));
}

export function DiffBadge({ diff, lang = "tr", showLabel = true }) {
  const L = LANGS[lang] || LANGS.tr;
  const d = clampDiff(diff);
  const color = COLORS[d - 1];
  const name = L["diff" + d] || LANGS.tr["diff" + d];
  const title = `${L.diffTitle || LANGS.tr.diffTitle} ${d}/${STEPS} — ${name}`;

  return (
    <span
      data-testid="diff-badge"
      data-diff={d}
      title={title}
      aria-label={title}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "1px 6px", borderRadius: 5,
        background: color + "1c", border: "1px solid " + color + "44",
      }}
    >
      {/* Sabit 5 nokta — hiçbir koşulda sayı değişmez, taşma olamaz */}
      <span style={{ display: "inline-flex", gap: 2 }} aria-hidden="true">
        {Array.from({ length: STEPS }, (_, i) => (
          <span key={i} style={{
            width: 4, height: 4, borderRadius: "50%",
            background: i < d ? color : color + "33",
          }} />
        ))}
      </span>
      {showLabel && (
        <span style={{ fontSize: 9, fontWeight: 800, color, whiteSpace: "nowrap" }}>
          {name}
        </span>
      )}
    </span>
  );
}
