/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Özel problem — öğretmen METİN YAZMAZ (güvenli yol): şema + alt tür + bilinmeyen + sınıf +
 * bağlam + (isteğe bağlı) sayılar + eksenler (I, L, M, P) seçer; generateProblem ile 3 dilde
 * ÖNİZLER, validateProblem uyarılarını görür, beğenirse paylaşım kodu/bağlantısı (#p=<kod>).
 * Sayılar ProblemSpec'te alan olmadığı için TOHUM ARAMASIyla eşlenir (aynı tohum → aynı
 * problem; paylaşım kodu tohumu taşır, sunucusuz).
 */
import { useMemo, useState } from 'react';
import { SCHEMA_ROLES, type Axes, type Grade, type Lang, type Problem, type ProblemSpec, type Role, type SchemaId, type SchemaVariant } from '../content/types';
import * as C from '../lib/content';
import { pick } from '../i18n';
import { answerText, equationFor, makeProblem, roleLabel, schemaMeta, sentenceString } from '../lib/contentAdapter';
import { encodeShare, shareUrl } from '../lib/share';
import { tokensText } from '../lib/problemUtil';
import { copyText } from '../modules/clipboard';
import { SCHEMA_LIST } from './data';
import type { TKey, TT } from './i18n';

export const VARIANTS: Record<SchemaId, SchemaVariant[]> = {
  change: ['join', 'separate'],
  combine: ['static'],
  compare: ['more', 'fewer', 'equalize'],
  equalGroups: ['multiply', 'partitive', 'quotative'],
  multCompare: ['times', 'fraction'],
};

const API = C as unknown as Record<string, any>;

function contexts(): { id: string; label: string }[] {
  const raw = ['CONTEXTS', 'CONTEXT_IDS'].map((k) => API[k]).find((v) => v != null);
  const list: any[] = Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? Object.entries(raw).map(([id, v]) => ({ id, ...(v as object) })) : [];
  return list.map((c: any) => (typeof c === 'string' ? { id: c, label: c } : { id: String(c.id), label: typeof c.label === 'string' ? c.label : c.label?.tr ?? c.name?.tr ?? String(c.id) }));
}

export function validationOf(p: Problem): string[] {
  try {
    const r = API.validateProblem?.(p);
    const list: any[] = Array.isArray(r) ? r : r?.warnings ?? r?.errors ?? r?.issues ?? [];
    return list.map((x: any) => (typeof x === 'string' ? x : x?.message ?? x?.msg ?? JSON.stringify(x)));
  } catch (e) {
    return [String(e)];
  }
}

export function ProblemPreview({ p, t }: { p: Problem; t: TT }) {
  const last = p.steps[p.steps.length - 1];
  const eq = equationFor(last).tokens;
  return (
    <div className="tc-preview">
      {(['tr', 'ku', 'en'] as Lang[]).map((l) => (
        <div key={l} className="tc-preview__col" lang={l}>
          <span className="tc-preview__lang">{l.toUpperCase()}</span>
          <p>{(p.text[l] ?? []).map((s) => sentenceString(s)).join(' ')}</p>
          <p className="tc-muted">
            {t('cp_answer')}: {p.answer >= 0 ? answerText(p, l, p.answer) : '—'}
          </p>
        </div>
      ))}
      {eq.length > 0 && (
        <p className="tc-preview__eq" data-numeric="true">
          {t('cp_equation')}: {tokensText(eq)}
        </p>
      )}
    </div>
  );
}

export function CustomProblem({ t, lang, grade0, onProject }: { t: TT; lang: Lang; grade0: Grade; onProject: (p: Problem, spec: ProblemSpec) => void }) {
  const [grade, setGrade] = useState<Grade>(grade0);
  const [schema, setSchema] = useState<SchemaId>('change');
  const [variant, setVariant] = useState<SchemaVariant>('join');
  const [unknown, setUnknown] = useState<Role>('result');
  const [context, setContext] = useState('');
  const [nums, setNums] = useState<Partial<Record<Role, string>>>({});
  const [axes, setAxes] = useState<Pick<Axes, 'I' | 'L' | 'M' | 'P'>>({ I: 0, L: 0, M: 1, P: 0 });
  const [out, setOut] = useState<{ p: Problem; spec: ProblemSpec; matched: boolean | null } | null>(null);
  const [msg, setMsg] = useState('');
  const [failed, setFailed] = useState(false);
  const ctx = useMemo(contexts, []);
  const roles = SCHEMA_ROLES[schema];
  const wantNums = axes.M === 1 ? roles.filter((r) => r !== unknown && nums[r]) : [];

  const changeSchema = (s: SchemaId) => {
    setSchema(s);
    setVariant(VARIANTS[s][0]);
    setUnknown(SCHEMA_ROLES[s][SCHEMA_ROLES[s].length - 1]);
    setNums({});
    setOut(null);
  };

  const generate = (startSeed: number) => {
    setMsg('');
    const base: ProblemSpec = { grade, schema, variant, unknown, axes: { ...axes }, ...(context ? { context } : {}) };
    let first: { p: Problem; spec: ProblemSpec } | null = null;
    const tries = wantNums.length ? 500 : 1;
    for (let i = 0; i < tries; i++) {
      const spec = { ...base, seed: startSeed + i };
      const p = makeProblem(spec);
      if (!p) continue;
      if (!first) first = { p, spec };
      if (!wantNums.length) break;
      const st = p.steps[0];
      if (wantNums.every((r) => st.quantities.find((q) => q.role === r)?.value === Number(nums[r]))) {
        setOut({ p, spec, matched: true });
        setFailed(false);
        return;
      }
    }
    setFailed(!first);
    setOut(first ? { ...first, matched: wantNums.length ? false : null } : null);
  };

  const warnings = out ? validationOf(out.p) : [];
  const copy = async (text: string) => setMsg((await copyText(text)) ? t('copied') : t('copy_fail'));
  const sel = (label: string, value: string, on: (v: string) => void, opts: { v: string; l: string }[]) => (
    <label className="tc-field">
      <span>{label}</span>
      <select className="tc-input" value={value} onChange={(e) => (on(e.target.value), setOut(null))}>
        {opts.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );
  const axSel = (k: 'I' | 'L' | 'M' | 'P', values: number[]) =>
    sel(t(`ax_${k}` as TKey), String(axes[k]), (v) => setAxes((a) => ({ ...a, [k]: Number(v) })), values.map((n) => ({ v: String(n), l: t(`ax_${k}${n}` as TKey) })));

  return (
    <div className="tc-stack">
      <p className="tc-muted">{t('cp_desc')}</p>
      <div className="tc-form">
        {sel(t('f_grade'), String(grade), (v) => setGrade(Number(v) as Grade), [1, 2, 3, 4, 5, 6].map((g) => ({ v: String(g), l: String(g) })))}
        {sel(t('f_schema'), schema, (v) => changeSchema(v as SchemaId), SCHEMA_LIST.map((s) => ({ v: s, l: pick(schemaMeta(s).name, lang) })))}
        {sel(t('f_variant'), variant, (v) => setVariant(v as SchemaVariant), VARIANTS[schema].map((v) => ({ v, l: t(`var_${v}` as TKey) })))}
        {sel(t('f_unknown'), unknown, (v) => setUnknown(v as Role), roles.map((r) => ({ v: r, l: pick(roleLabel(r), lang) })))}
        {sel(t('f_context'), context, setContext, [{ v: '', l: t('f_auto') }, ...ctx.map((c) => ({ v: c.id, l: c.label }))])}
      </div>
      <fieldset className="tc-fieldset">
        <legend>{t('f_axes')}</legend>
        <div className="tc-form">
          {axSel('I', [0, 1, 2])}
          {axSel('L', [0, 1])}
          {axSel('M', [1, 2, 3])}
          {axSel('P', [0, 1])}
        </div>
      </fieldset>
      {axes.M === 1 && (
        <fieldset className="tc-fieldset">
          <legend>{t('f_numbers')}</legend>
          <div className="tc-form">
            {roles
              .filter((r) => r !== unknown)
              .map((r) => (
                <label key={r} className="tc-field">
                  <span>{pick(roleLabel(r), lang)}</span>
                  <input className="tc-input" inputMode="numeric" value={nums[r] ?? ''} onChange={(e) => setNums((n) => ({ ...n, [r]: e.target.value.replace(/\D/g, '').slice(0, 4) }))} />
                </label>
              ))}
          </div>
        </fieldset>
      )}
      <div className="tc-actions">
        <button type="button" className="tc-btn tc-btn--primary" onClick={() => generate(1 + Math.floor(Math.random() * 5000))}>
          {t('btn_preview')}
        </button>
        {out && (
          <button type="button" className="tc-btn" onClick={() => generate((out.spec.seed ?? 1) + 997)}>
            {t('btn_other')}
          </button>
        )}
      </div>
      {failed && <p className="tc-warn">{t('cp_fail')}</p>}
      {out && (
        <section className="tc-card" aria-live="polite">
          {out.matched === true && <p className="tc-ok">✓ {t('cp_match')}</p>}
          {out.matched === false && <p className="tc-warn">! {t('cp_nomatch')}</p>}
          <ProblemPreview p={out.p} t={t} />
          <h4>{t('cp_warnings')}</h4>
          {warnings.length ? (
            <ul className="tc-warnlist">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          ) : (
            <p className="tc-ok">✓ {t('cp_valid')}</p>
          )}
          <h4>{t('cp_share')}</h4>
          <code className="tc-code">{shareUrl(out.spec)}</code>
          <div className="tc-actions">
            <button type="button" className="tc-btn" onClick={() => copy(shareUrl(out.spec))}>
              {t('btn_copy_link')}
            </button>
            <button type="button" className="tc-btn" onClick={() => copy(encodeShare(out.spec))}>
              {t('btn_copy_code')}
            </button>
            <button type="button" className="tc-btn tc-btn--primary" onClick={() => onProject(out.p, out.spec)}>
              {t('btn_project')}
            </button>
          </div>
          <p role="status" aria-live="polite" className="tc-muted">
            {msg}
          </p>
        </section>
      )}
    </div>
  );
}
