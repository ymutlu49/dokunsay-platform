import { SpeakButton } from "@shared/SpeakButton.jsx";
import type { Sentence } from "../../utils/sentence";
import type { Language } from "../../types";

/**
 * DokunSay Bar — Sembolik + Sözel Cümle Şeridi (CRA'nın S basamağı)
 *
 * Tuvaldeki yapının SEMBOLİK ("4 + 3 = 7") ve SÖZEL ("dört artı üç eşittir yedi")
 * karşılığını, nesnelerin YANINDA gösterir. Bruner'ın üç kodlaması aynı anda ekranda
 * olsun diye: çocuk çubuğu iterken sembolün DEĞİŞTİĞİNİ görür, bağ böyle kurulur.
 *
 * TASARIM KARARLARI (diskalkuli duyarlılığı):
 *  · ÜSTTE SEMBOL, ALTTA SÖZCÜK — okuma öncesi çocuk sözcüğe, sembolü sökebilen
 *    çocuk üstteki satıra tutunur; ikisi hizalı durur.
 *  · SES İSTEĞE BAĞLI: otomatik okuma YOK. Her değişiklikte konuşan bir arayüz,
 *    çubuk sürüklerken sürekli konuşur ve dikkati dağıtır. 🔊 çocuğun denetiminde.
 *  · Şerit yalnız okunaklı bir yapı varken görünür (describeCanvas null dönerse hiç
 *    çizilmez) — boş/yanıltıcı bir kutu asılı kalmaz.
 *  · Tuvalin AKIŞINI bozmaz: mutlak konumlu, üstte, tıklama geçirgen (pointerEvents
 *    none) — altındaki çubuğa dokunmayı engellemez; yalnız 🔊 düğmesi tıklanabilir.
 */

interface Props {
  sentence: Sentence;
  lang: Language;
  isDark: boolean;
}

export default function SentenceStrip({ sentence, lang, isDark }: Props) {
  return (
    <div
      // pointerEvents:none → şerit tuvalin üstünde "cam" gibi durur, sürüklemeyi engellemez.
      style={{
        position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
        zIndex: 14, pointerEvents: "none",
        display: "flex", alignItems: "center", gap: 10,
        padding: "7px 14px", borderRadius: 12,
        background: isDark ? "rgba(30,30,30,.92)" : "rgba(255,255,255,.94)",
        border: `2px solid ${isDark ? "rgba(245,158,11,.35)" : "rgba(245,158,11,.45)"}`,
        boxShadow: "0 4px 14px rgba(0,0,0,.10)",
        maxWidth: "92%",
      }}
      role="status"
      aria-live="polite"
      aria-label={`${sentence.symbolic}. ${sentence.verbal}`}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.25 }}>
        {/* SEMBOLİK */}
        <span style={{
          fontSize: 22, fontWeight: 900, letterSpacing: ".02em",
          color: isDark ? "#fbbf24" : "#b45309", whiteSpace: "nowrap",
        }}>
          {sentence.symbolic}
        </span>
        {/* SÖZEL */}
        <span style={{
          fontSize: 12, fontWeight: 700,
          color: isDark ? "rgba(255,255,255,.66)" : "rgba(0,0,0,.55)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70vw",
        }}>
          {sentence.verbal}
        </span>
      </div>

      {/* Yalnız bu düğme tıklanabilir. SpeakButton, okunamayan dilde (ku sesi yoksa)
          kendini hiç çizmez — basınca hiçbir şey olmayan düğme bırakılmaz. */}
      <span style={{ pointerEvents: "auto", flexShrink: 0 }}>
        <SpeakButton text={sentence.verbal} lang={lang} size={30} />
      </span>
    </div>
  );
}
