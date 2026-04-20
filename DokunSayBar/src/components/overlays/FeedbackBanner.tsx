import type { FeedbackType, Language } from "../../types";
import { translate } from "../../services/i18nService";

interface FeedbackBannerProps {
  feedback: FeedbackType;
  lang: Language;
  hasActiveTemplate: boolean;
}

const GRADIENTS: Record<FeedbackType, string> = {
  ok: "linear-gradient(135deg,#22c55e,#16a34a)",
  no: "linear-gradient(135deg,#f59e0b,#d97706)",
  info: "linear-gradient(135deg,#3b82f6,#1e40af)",
};

const ICONS: Record<FeedbackType, string> = {
  ok: "✅",
  no: "💡",
  info: "ℹ️",
};

const TEXT_KEYS: Record<FeedbackType, string> = {
  ok: "checkOk",
  no: "checkNo",
  info: "checkNone",
};

export default function FeedbackBanner({ feedback, lang, hasActiveTemplate }: FeedbackBannerProps) {
  return (
    <div
      className={feedback === "no" ? "ds-shake" : "ds-slide"}
      style={{
        position: "absolute",
        top: hasActiveTemplate ? 48 : 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
        padding: "14px 32px",
        borderRadius: 16,
        fontWeight: 800,
        fontSize: 16,
        pointerEvents: "none",
        boxShadow: "0 8px 28px rgba(0,0,0,.25)",
        background: GRADIENTS[feedback],
        color: "#fff",
      }}
    >
      {ICONS[feedback] + " " + translate(TEXT_KEYS[feedback], lang)}
    </div>
  );
}
