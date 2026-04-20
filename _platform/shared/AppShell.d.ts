/**
 * DokunSay Platform — shared/AppShell.jsx tip bildirimi
 */

import type { FC, ReactNode } from "react";
import type { AppId } from "./palette";

export interface AppShellProps {
  appId: AppId;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  topBar?: boolean;
  showBack?: boolean;
  backHref?: string;
  backLang?: "tr" | "ku" | "en" | "ar" | "fa";
  tools?: ReactNode;
  footer?: ReactNode;
  background?: string;
  children?: ReactNode;
}

export const AppShell: FC<AppShellProps>;
