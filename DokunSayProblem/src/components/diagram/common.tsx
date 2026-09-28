/**
 * Şema diyagramlarının ORTAK dili (DESIGN §3; 02 diyagram kuralları; 05 §C2–C3).
 *
 *  - Her rol bir KUTU (RoleBox) + bir ŞERİT (Strip). Kutu etkileşimlidir (yerleştirme
 *    hedefi, ≥44 px düğme); şerit yalnız görseldir (div) → a11y-global'in 44 px
 *    `!important` kuralı orantılı şerit gövdelerini ŞİŞİREMEZ (06 R14).
 *  - "build" kipinde şeritler ölçeksizdir (sabit ağırlık); denetim doğruysa "scaled"
 *    kipinde değerlere orantılı olur (flex-grow 400 ms geçiş; hareket azaltılmışsa anında).
 *  - Renk + DESEN + metin: Okabe-Ito tonları ve her tonun kendi deseni (renk körü modunda
 *    desen belirginleşir). Aynı rol türü = aynı ton, tüm diyagramlarda.
 *  - "?" jetonu her yerde aynı: kesikli çerçeveli sarı.
 */
import type { CSSProperties, ReactNode } from 'react';
import type { Lang, Role, SchemaId, SchemaStep } from '../../content/types';
import { pick, useT } from '../../i18n';
import { roleLabel } from '../../lib/contentAdapter';
import { BangMark, OkMark } from '../icons';

export interface BoxContent {
  label?: string;
  value?: number | '?';
  derived?: boolean;
}

export type Mark = 'ok' | 'bad';

export interface DiagramProps {
  step: SchemaStep;
  lang: Lang;
  mode: 'build' | 'scaled';
  boxes: Partial<Record<Role, BoxContent>>;
  marks?: Partial<Record<Role, Mark>>;
  showRoleNames?: boolean;
  /** Yerleştirme hedefi özellikleri (useDragDrop.targetProps) — verilirse kutular düğmedir. */
  target?: (role: Role) => Record<string, unknown>;
  /** Eşleşik vurgu için dokunma (denklem adımı). */
  onBoxTap?: (role: Role) => void;
  highlight?: Role[];
  units?: boolean;
  compact?: boolean;
  /** Yalnız change: 'arrow' | 'bar'. */
  view?: 'arrow' | 'bar';
}

/** Rol → ton (1 mavi · 2 turuncu · 3 yeşil · 4 pembe). Aynı kavram aynı ton. */
export function toneOf(schema: SchemaId, role: Role): 1 | 2 | 3 | 4 {
  const map: Partial<Record<Role, 1 | 2 | 3 | 4>> = {
    start: 1,
    change: 2,
    result: 3,
    part1: 1,
    part2: 2,
    whole: 3,
    larger: 1,
    smaller: 2,
    difference: 4,
    groups: 4,
    perGroup: 2,
    total: 3,
    reference: 1,
    factor: 4,
    compared: 3,
  };
  void schema;
  return map[role] ?? 1;
}

export function valueOf(step: SchemaStep, role: Role): number {
  return step.quantities.find((q) => q.role === role)?.value ?? 0;
}

export function UnknownToken({ small }: { small?: boolean }) {
  return (
    <span className={`qtoken${small ? ' qtoken--sm' : ''}`} aria-hidden="true">
      ?
    </span>
  );
}

export function RoleBox({
  role,
  p,
  className = '',
  prefix,
}: {
  role: Role;
  p: DiagramProps;
  className?: string;
  prefix?: ReactNode;
}) {
  const t = useT();
  const c = p.boxes[role] ?? {};
  const mark = p.marks?.[role];
  const tone = toneOf(p.step.schema, role);
  const roleName = pick(roleLabel(role), p.lang);
  const contentText = [
    c.label ?? '',
    c.value === '?' ? t('unknown_token') : c.value != null ? String(c.value) : '',
    mark === 'ok' ? t('placed_correct') : mark === 'bad' ? t('placed_wrong') : '',
  ]
    .filter(Boolean)
    .join(', ');
  const aria = t('box_aria', { role: roleName, content: contentText || t('box_empty') });
  const interactive = !!p.target || !!p.onBoxTap;
  const cls = `rolebox tone-${tone}${mark ? ` is-${mark}` : ''}${p.highlight?.includes(role) ? ' is-linked' : ''}${
    c.label || c.value != null ? ' is-filled' : ''
  } ${className}`;
  const inner = (
    <>
      {p.showRoleNames && <span className="rolebox__role">{roleName}</span>}
      <span className={`rolebox__label${c.label ? '' : ' is-empty'}`}>{c.label ?? ' '}</span>
      <span className="rolebox__value" data-numeric="true">
        {prefix}
        {c.value === '?' ? <UnknownToken small={p.compact} /> : c.value != null ? c.value : <span className="rolebox__slot" />}
      </span>
      {mark && (
        <span className={`rolebox__mark`} data-semantic={mark === 'ok' ? 'positive' : 'negative'} aria-hidden="true">
          {mark === 'ok' ? <OkMark size={14} /> : <BangMark size={14} />}
        </span>
      )}
    </>
  );
  if (!interactive) {
    return (
      <div className={cls} role="group" aria-label={aria}>
        {inner}
      </div>
    );
  }
  const tp = p.target ? p.target(role) : {};
  return (
    <button
      type="button"
      className={cls}
      aria-label={aria}
      {...tp}
      onClick={(e) => {
        (tp as { onClick?: (e: unknown) => void }).onClick?.(e);
        p.onBoxTap?.(role);
      }}
    >
      {inner}
    </button>
  );
}

/** Görsel şerit (etkileşimsiz div). Orantı flex-grow ile; birim kareler isteğe bağlı. */
export function Strip({
  role,
  p,
  dashed,
  showValue,
  children,
  style,
}: {
  role: Role;
  p: DiagramProps;
  dashed?: boolean;
  showValue?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}) {
  const tone = toneOf(p.step.schema, role);
  const v = valueOf(p.step, role);
  const scaled = p.mode === 'scaled';
  const units = scaled && p.units && v > 0 && v <= 20;
  const c = p.boxes[role];
  return (
    <div
      className={`strip tone-${tone} pat-${tone}${dashed ? ' is-dashed' : ''}${units ? ' has-units' : ''}${
        p.highlight?.includes(role) ? ' is-linked' : ''
      }`}
      style={{ ...(units ? ({ '--n': v } as CSSProperties) : null), ...style }}
      data-drop={p.target ? role : undefined}
      aria-hidden="true"
    >
      {children}
      {showValue && scaled && (
        <span className="strip__val" data-numeric="true">
          {c?.value === '?' ? <UnknownToken small /> : v}
        </span>
      )}
    </div>
  );
}

/** Rolün sütun ağırlığı: build'de sabit, scaled'de değer. */
export function weight(p: DiagramProps, role: Role, buildWeight: number): number {
  return p.mode === 'scaled' ? Math.max(valueOf(p.step, role), 0.0001) : buildWeight;
}

export function Bracket() {
  return (
    <svg className="dg-bracket" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
      <path d="M1 9 Q1 2 8 2 H44 Q50 2 50 0 Q50 2 56 2 H92 Q99 2 99 9" fill="none" stroke="currentColor" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
