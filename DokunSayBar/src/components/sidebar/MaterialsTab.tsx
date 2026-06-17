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

/**
 * 5 dilde "yerleştir" ifadesi — aria-label için ekran okuyucu duyurusu.
 * Listbox stili kullanmıyoruz çünkü öğeler tek tıkla doğrudan canvas'a
 * yerleştirilir; her öğe bağımsız bir <button> gibi davranır.
 */
const PLACE_LABEL: Record<Language, (text: string) => string> = {
  tr: (text) => `${text} yerleştir`,
  ku: (text) => `${text} daxe`,
  en: (text) => `Place ${text.toLowerCase()}`,
  ar: (text) => `ضع ${text}`,
  fa: (text) => `${text} قرار بده`,
};

const ROD_NAME: Record<Language, (n: number) => string> = {
  tr: (n) => `${n} birimlik sayı çubuğu`,
  ku: (n) => `çoviya ${n}-yekîneyî`,
  en: (n) => `${n}-unit number rod`,
  ar: (n) => `قضيب أعداد ${n} وحدات`,
  fa: (n) => `میله اعداد ${n}-تایی`,
};

export default function MaterialsTab({
  lang, palette,
  onPlaceRod, onPlaceFrame,
}: MaterialsTabProps) {
  const t = (k: string) => translate(k, lang);

  const sectionLabel = {
    fontSize: 8, fontWeight: 700, textTransform: "uppercase" as const,
    letterSpacing: 1, color: palette.sub,
  };

  /**
   * Materyal öğesi: native <button> ki klavye + ekran okuyucu otomatik çalışsın.
   * Görsel olarak şeffaf — Mini SVG + sayı etiketi içerir.
   * Diskalkuli mode'da global CSS 48px min-height uygular.
   */
  const itemBtnStyle: React.CSSProperties = {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "2px 0",
    width: "100%",
    background: "transparent",
    border: "1px solid transparent",
    borderRadius: 4,
    fontFamily: "inherit",
    textAlign: "left",
  };

  const placeRod = PLACE_LABEL[lang];
  const rodName = ROD_NAME[lang];

  return (
    <div
      style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}
      role="group"
      aria-labelledby="bar-mat-title"
    >
      {/* Rods */}
      <div id="bar-mat-title" style={{ ...sectionLabel, margin: "4px 0 2px" }}>
        {t("rods")}
      </div>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <button
          key={n}
          onClick={() => onPlaceRod(n)}
          style={itemBtnStyle}
          aria-label={placeRod(rodName(n))}
        >
          <MiniRod count={n} />
          <span style={{ fontSize: 9, fontWeight: 800, color: palette.sub }} data-numeric="true">{n}</span>
        </button>
      ))}

      {/* Frames */}
      <div style={{ ...sectionLabel, margin: "8px 0 3px" }}>{t("frames")}</div>
      <button
        onClick={() => onPlaceFrame(5, 1)}
        style={itemBtnStyle}
        aria-label={placeRod(t("five"))}
      >
        <MiniFrame cols={5} rows={1} />
        <span style={{ fontSize: 9, fontWeight: 700, color: palette.sub }}>{t("five")}</span>
      </button>
      <button
        onClick={() => onPlaceFrame(5, 2)}
        style={itemBtnStyle}
        aria-label={placeRod(t("ten"))}
      >
        <MiniFrame cols={5} rows={2} />
        <span style={{ fontSize: 9, fontWeight: 700, color: palette.sub }}>{t("ten")}</span>
      </button>
    </div>
  );
}
