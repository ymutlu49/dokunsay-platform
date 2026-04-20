import type { Language } from "../../types";
import { translate, isRTL } from "../../services/i18nService";

interface HelpModalProps {
  lang: Language;
  onClose: () => void;
}

export default function HelpModal({ lang, onClose }: HelpModalProps) {
  const t = (k: string) => translate(k, lang);
  const rtl = isRTL(lang);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="ds-pop"
        style={{
          background: "#fffdf7", borderRadius: 20,
          padding: "28px 36px", maxWidth: 480,
          boxShadow: "0 16px 48px rgba(0,0,0,.3)",
          direction: rtl ? "rtl" : "ltr",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 12, color: "#3d3520" }}>
          {"⌨ " + t("shortcuts")}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 16px", fontSize: 13 }}>
          <Kbd>Ctrl+Z</Kbd><span>{t("undo")}</span>
          <Kbd>Ctrl+Y</Kbd><span>{t("redo")}</span>
          <Kbd>Delete</Kbd><span>{t("delete")}</span>
          <Kbd>Alt+Drag</Kbd><span>{t("copy")}</span>
          <Kbd>Double-click</Kbd><span>{t("countTTS")}</span>
        </div>

        <div style={{ fontSize: 14, fontWeight: 500, margin: "12px 0 6px", color: "#d97706" }}>
          {"🎤 " + t("voiceCommands")}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 12px", fontSize: 12 }}>
          <VoiceExample lang={lang} />
        </div>

        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 12 }}>
          {t("closeHint")}
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: string }) {
  return (
    <kbd style={{ background: "#e5e7eb", padding: "2px 8px", borderRadius: 4, fontWeight: 700 }}>
      {children}
    </kbd>
  );
}

function VoiceExample({ lang }: { lang: Language }) {
  const examples: Record<Language, [string, string][]> = {
    tr: [
      ['"üç çubuğu koy"', "3'lük çubuk ekler"],
      ['"onluk kart"', "Onluk kart ekler"],
      ['"temizle"', "Kanvası temizler"],
      ['"kontrol et"', "Etkinliği kontrol eder"],
    ],
    ku: [
      ['"çovika sê deyne"', "Çovikê 3an zêde dike"],
      ['"dehan"', "Çarçoveya dehan zêde dike"],
      ['"paqij bike"', "Hemû paqij dike"],
      ['"kontrol"', "Çalakiyê kontrol dike"],
    ],
    en: [
      ['"place three rod"', "Adds a 3-rod"],
      ['"ten frame"', "Adds a ten-frame"],
      ['"clear"', "Clears the canvas"],
      ['"check"', "Checks the activity"],
    ],
    ar: [
      ['"ضع قضيب ثلاثة"', "يضيف قضيب ٣"],
      ['"إطار عشري"', "يضيف إطارًا عشريًّا"],
      ['"مسح"', "يمسح اللوحة"],
      ['"تحقّق"', "يتحقق من النشاط"],
    ],
    fa: [
      ['"میله سه بگذار"', "میله ۳تایی اضافه می‌کند"],
      ['"قاب ده‌تایی"', "قاب ده‌تایی اضافه می‌کند"],
      ['"پاک‌سازی"', "بوم را پاک می‌کند"],
      ['"بررسی"', "فعالیت را بررسی می‌کند"],
    ],
  };

  return (
    <>
      {(examples[lang] || examples.tr).map(([cmd, desc], i) => (
        <span key={`cmd-${i}`} style={{ display: "contents" }}>
          <span style={{ fontWeight: 700, color: "#78350f" }}>{cmd}</span>
          <span>{desc}</span>
        </span>
      ))}
    </>
  );
}
