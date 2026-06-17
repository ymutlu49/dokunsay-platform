/**
 * DokunSay Platform — shared/A11yPanel.jsx tip bildirimi
 */

import type { FC } from "react";
import type { A11yPrefs } from "./a11y";

export interface A11yContextValue {
  prefs: A11yPrefs;
  toggle: (key: keyof A11yPrefs) => void;
  setPref?: <K extends keyof A11yPrefs>(key: K, value: A11yPrefs[K]) => void;
  reset: () => void;
  announce?: (message: string, priority?: "polite" | "assertive") => void;
  installShortcuts?: (handlers: unknown) => () => void;
}

export interface A11yPanelProps {
  useA11y: () => A11yContextValue;
  /**
   * UI dili. Belirtilmezse panel `<html lang>` attribute'unu otomatik
   * izler ve LangSwitcher tarafından güncellenen dile uyum sağlar.
   * Geriye dönük uyumluluk için açıkça verilebilir.
   */
  lang?: "tr" | "ku" | "en" | "ar" | "fa";
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

export const A11yPanel: FC<A11yPanelProps>;
