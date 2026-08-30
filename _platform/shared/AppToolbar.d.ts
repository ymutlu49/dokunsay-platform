import type { ReactNode, CSSProperties } from 'react';

export interface ToolbarProps {
  children?: ReactNode;
  isDark?: boolean;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
}
export interface ToolGroupProps {
  children?: ReactNode;
  className?: string;
}
export interface ToolButtonProps {
  icon?: ReactNode;
  label?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}
export interface IconButtonProps {
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  title?: string;
  danger?: boolean;
  disabled?: boolean;
  style?: CSSProperties;
  [key: string]: unknown;
}

export function Toolbar(props: ToolbarProps): JSX.Element;
export function ToolGroup(props: ToolGroupProps): JSX.Element;
export function ToolButton(props: ToolButtonProps): JSX.Element;
export function IconButton(props: IconButtonProps): JSX.Element;
export function ToolSep(): JSX.Element;
export function ToolSpacer(): JSX.Element;
export default Toolbar;
