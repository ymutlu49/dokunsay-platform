export interface AppTabDef {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
}

export interface AppTabsProps {
  tabs: AppTabDef[];
  active: string;
  onChange: (id: string) => void;
  variant?: 'pills' | 'list';
  compact?: boolean;
  isDark?: boolean;
  ariaLabel?: string;
}

export const TAB_ORDER: string[];
export const TAB_ICONS: Record<string, string>;
export const TAB_I18N_KEY: Record<string, string>;

export function AppTabs(props: AppTabsProps): JSX.Element;
export default AppTabs;
