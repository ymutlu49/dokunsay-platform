/**
 * Başlangıç: sınıf (1–4; 5–6 isteğe bağlı), şema yolu kartları (LADDER'dan) + Karışık,
 * kaldığın yerden devam. İlerleme ŞEMA BAZINDA ("Karşılaştırma: Birlikte → Sen");
 * puan tablosu ve süre YOK (DESIGN §9).
 */
import { useState } from 'react';
import type { Grade, ScaffoldLevel, SchemaId } from '../content/types';
import { pick, useLang, useT, type Key } from '../i18n';
import { rungsFor, schemaMeta } from '../lib/contentAdapter';
import { canStartSchema, mixedEligible, type ProgressState, type SessionInfo } from '../lib/progress';
import { SchemaCard } from '../components/SchemaCard';
import { schemasForGrade } from './steps/KnownSchemaSteps';

export const LVL_KEY: Record<ScaffoldLevel, Key> = { 3: 'lvl_3', 2: 'lvl_2', 1: 'lvl_1', 0: 'lvl_0' };

export function levelLine(t: ReturnType<typeof useT>, level: ScaffoldLevel | undefined): string {
  if (level == null) return t('lvl_new');
  if (level === 0) return t('lvl_0');
  return `${t(LVL_KEY[level])} → ${t(LVL_KEY[(level - 1) as ScaffoldLevel])}`;
}

export function StartScreen({
  progress,
  session,
  grade,
  setGrade,
  onPath,
  onMixed,
  onResume,
}: {
  progress: ProgressState;
  session: SessionInfo;
  grade: Grade;
  setGrade: (g: Grade) => void;
  onPath: (schema: SchemaId) => void;
  onMixed: () => void;
  onResume: () => void;
}) {
  const t = useT();
  const lang = useLang();
  const [showOpt, setShowOpt] = useState(grade > 4);
  const schemas = schemasForGrade(grade).filter((x) => rungsFor(x, grade).length > 0);
  const mixedOk = mixedEligible(progress).length > 0;
  const last = progress.last;
  return (
    <div className="start">
      {last && (
        <button type="button" className="resume" onClick={onResume}>
          <span className="resume__title">{t('btn_resume')}</span>
          <span className="resume__desc">
            {t('resume_desc', {
              name: last.mode === 'mixed' || !last.schema ? t('mixed') : pick(schemaMeta(last.schema).name, lang),
              grade: t('grade_n', { n: last.grade }),
            })}
          </span>
        </button>
      )}

      <section className="start__block" aria-labelledby="grade-h">
        <h2 id="grade-h" className="start__h">{t('grade_title')}</h2>
        <div className="pillrow" role="radiogroup" aria-labelledby="grade-h">
          {([1, 2, 3, 4] as Grade[]).map((g) => (
            <button key={g} type="button" role="radio" aria-checked={grade === g} className={`pill pill--big${grade === g ? ' is-on' : ''}`} onClick={() => setGrade(g)}>
              {t('grade_n', { n: g })}
            </button>
          ))}
          {showOpt ? (
            ([5, 6] as Grade[]).map((g) => (
              <button key={g} type="button" role="radio" aria-checked={grade === g} className={`pill pill--big pill--opt${grade === g ? ' is-on' : ''}`} onClick={() => setGrade(g)}>
                {t('grade_n', { n: g })}
              </button>
            ))
          ) : (
            <button type="button" className="pill pill--ghost" onClick={() => setShowOpt(true)}>
              5–6 · {t('grade_optional')}
            </button>
          )}
        </div>
      </section>

      <section className="start__block" aria-labelledby="path-h">
        <h2 id="path-h" className="start__h">{t('path_title')}</h2>
        <p className="start__hint">{t('start_hint')}</p>
        <div className="schemacards schemacards--start">
          {schemas.map((sc) => {
            const sp = progress.schemas[sc];
            const rungs = rungsFor(sc, grade);
            const allowed = canStartSchema(progress, session, sc);
            const rungNo = Math.min(sp?.rung ?? 0, rungs.length - 1);
            const foot = allowed
              ? `${levelLine(t, sp?.level)} · ${t('rung_n', { n: rungNo + 1, m: rungs.length })}: ${pick(rungs[rungNo].label, lang)}`
              : t('new_schema_locked');
            return <SchemaCard key={sc} schema={sc} onPick={() => onPath(sc)} disabled={!allowed} footer={foot} badge={sp ? undefined : t('lvl_new')} />;
          })}
          <button type="button" className="schemacard schemacard--mixed" onClick={onMixed} disabled={!mixedOk}>
            <span className="schemacard__icon" aria-hidden="true">
              <MixIcon />
            </span>
            <span className="schemacard__name">{t('mixed')}</span>
            <span className="schemacard__short">{mixedOk ? t('mixed_desc') : t('mixed_locked')}</span>
          </button>
        </div>
      </section>
    </div>
  );
}

function MixIcon() {
  return (
    <svg width="56" height="37" viewBox="0 0 48 32" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 8h10c6 0 10 16 16 16h10M4 24h10c6 0 10-16 16-16h10" />
      <path d="M36 4l4 4-4 4M36 20l4 4-4 4" />
    </svg>
  );
}
