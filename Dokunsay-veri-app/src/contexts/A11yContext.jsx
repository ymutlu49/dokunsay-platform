import { createContext, useContext } from "react";

// ═══════════════════════════════════════════════════════════════════
// ERIŞILEBILIRLIK CONTEXT — fs, speak, lang, dyscalculia
// Diskalkuli odaklı tasarımın çekirdeği
// ═══════════════════════════════════════════════════════════════════
export const A11yContext = createContext({
  fsScale: 1,
  ttsOn: false,
  lang: "tr",
  dyscalculia: false,
});

// useFS — font ölçekleme hook'u
// dyscalculia ON: 1.35× ölçek (yazı + padding büyür)
export function useFS() {
  const { fsScale } = useContext(A11yContext);
  return (n) => Math.round(n * fsScale * 10) / 10;
}

// useA11y — erişilebilirlik context'inin tamamı
export function useA11y() {
  return useContext(A11yContext);
}
