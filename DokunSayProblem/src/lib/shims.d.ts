/// <reference types="vite/client" />
/**
 * Ortak katmanda tip bildirimi OLMAYAN dosyalar için dar kapsamlı bildirimler
 * (06_entegrasyon §1.5 / R3). `_platform/shared/*.d.ts` eklendiğinde bu bildirimler
 * zararsızca gölgede kalır; ekleyen olursa buradan silinebilir.
 */
declare module '@shared/storage.js' {
  export function saveState(modul: string, konu: string, data: unknown): boolean;
  export function loadState<T = unknown>(modul: string, konu: string, fallback?: T): T;
  export function removeState(modul: string, konu: string): boolean;
  export function saveProgress(modul: string, activityId: string, payload: object): boolean;
  export function loadProgress(modul: string): Record<string, unknown>;
  export function exportAll(modul: string): Record<string, unknown>;
}

declare module '@shared/appIcon.js' {
  export function setAppFavicon(appId?: string): void;
  export function appIdFromPath(): string;
}

declare module '@shared/i18n-base.js' {
  type Dict = Record<string, string>;
  export const LANGS: string[];
  export const BASE_TR: Dict;
  export const BASE_KU: Dict;
  export const BASE_EN: Dict;
}

declare module '@shared/AppFooter.jsx' {
  import type { FC } from 'react';
  export const AppFooter: FC<{ lang?: string }>;
  const def: FC<{ lang?: string }>;
  export default def;
}
