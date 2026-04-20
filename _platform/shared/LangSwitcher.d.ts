import type { FC } from "react";

export interface LangSwitcherProps {
  lang: string;
  setLang: (l: string) => void;
  langs?: readonly string[] | string[];
  labels?: Record<string, string>;
}

export const LangSwitcher: FC<LangSwitcherProps>;
