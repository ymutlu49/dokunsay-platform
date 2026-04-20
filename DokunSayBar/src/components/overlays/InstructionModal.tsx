import type { InstructionData, Language } from "../../types";
import { translate, isRTL } from "../../services/i18nService";

interface InstructionModalProps {
  instruction: InstructionData;
  lang: Language;
  onClose: () => void;
}

export default function InstructionModal({ instruction, lang, onClose }: InstructionModalProps) {
  const nameMap: Record<string, string | undefined> = { tr: instruction.n, ku: instruction.k, en: instruction.en, ar: instruction.ar, fa: instruction.fa };
  const descMap: Record<string, string | undefined> = { tr: instruction.d, ku: instruction.dk, en: instruction.den, ar: instruction.dar, fa: instruction.dfa };
  const displayName = nameMap[lang] || instruction.n;
  const displayDesc = descMap[lang] || instruction.d;
  const rtl = isRTL(lang);

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute", inset: 0, zIndex: 50,
        background: "rgba(0,0,0,.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fffdf7", borderRadius: 16,
          padding: "24px 28px", maxWidth: 420,
          boxShadow: "0 12px 40px rgba(0,0,0,.3)",
          textAlign: "center",
          direction: rtl ? "rtl" : "ltr",
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 8 }}>{instruction.i}</div>
        <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 4 }}>{displayName}</div>
        <div style={{ fontSize: 13, marginBottom: 16 }}>{displayDesc}</div>
        <button
          onClick={onClose}
          style={{
            padding: "8px 28px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg,#f59e0b,#78350f)",
            color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer",
          }}
        >
          {translate("start", lang) + " ▸"}
        </button>
      </div>
    </div>
  );
}
