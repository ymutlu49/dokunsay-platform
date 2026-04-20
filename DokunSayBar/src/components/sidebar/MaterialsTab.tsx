import type { Language, ThemePalette } from "../../types";
import { translate } from "../../services/i18nService";
import MiniRod from "./MiniRod";
import MiniFrame from "./MiniFrame";

interface MaterialsTabProps {
  lang: Language;
  palette: ThemePalette;
  isDark: boolean;
  onPlaceRod: (value: number) => void;
  onPlaceFrame: (cols: number, rows: number) => void;
}

export default function MaterialsTab({
  lang, palette,
  onPlaceRod, onPlaceFrame,
}: MaterialsTabProps) {
  const t = (k: string) => translate(k, lang);

  const sectionLabel = {
    fontSize: 8, fontWeight: 700, textTransform: "uppercase" as const,
    letterSpacing: 1, color: palette.sub,
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
      {/* Rods */}
      <div style={{ ...sectionLabel, margin: "4px 0 2px" }}>{t("rods")}</div>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <div
          key={n}
          onClick={() => onPlaceRod(n)}
          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: "2px 0" }}
        >
          <MiniRod count={n} />
          <span style={{ fontSize: 9, fontWeight: 800, color: palette.sub }}>{n}</span>
        </div>
      ))}

      {/* Frames */}
      <div style={{ ...sectionLabel, margin: "8px 0 3px" }}>{t("frames")}</div>
      <div
        onClick={() => onPlaceFrame(5, 1)}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: "2px 0" }}
      >
        <MiniFrame cols={5} rows={1} />
        <span style={{ fontSize: 9, fontWeight: 700, color: palette.sub }}>{t("five")}</span>
      </div>
      <div
        onClick={() => onPlaceFrame(5, 2)}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 6, padding: "2px 0" }}
      >
        <MiniFrame cols={5} rows={2} />
        <span style={{ fontSize: 9, fontWeight: 700, color: palette.sub }}>{t("ten")}</span>
      </div>
    </div>
  );
}
