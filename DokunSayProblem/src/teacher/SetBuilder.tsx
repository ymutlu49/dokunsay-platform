/**
 * Set oluşturucu: şema(lar) + sayı + bloklu/karışık → set paylaşım bağlantısı (#set=, bkz.
 * setShare.ts) + yazdırılabilir çalışma kâğıdı (A4, boş diyagramlı, ayrı cevap anahtarı).
 * İlke: yeni tür önce bloklu, ustalıktan sonra karışık (DESIGN §2 ilke 10).
 */
import { useState } from 'react';
import type { Grade, Lang, Problem, SchemaId } from '../content/types';
import { pick } from '../i18n';
import { schemaMeta, sentenceString } from '../lib/contentAdapter';
import { minGradeFor } from '../lib/share';
import { copyText } from '../modules/clipboard';
import { SCHEMA_LIST } from './data';
import type { TT } from './i18n';
import { problemsOfSet, setUrl, type SetSpec } from './setShare';
import { PrintJob, WorksheetPages } from './Worksheet';

export function SetBuilder({ t, lang, grade0, onProject }: { t: TT; lang: Lang; grade0: Grade; onProject: (p: Problem) => void }) {
  const [grade, setGrade] = useState<Grade>(grade0);
  const [schemas, setSchemas] = useState<SchemaId[]>(['change']);
  const [count, setCount] = useState(6);
  const [mixed, setMixed] = useState(false);
  const [spec, setSpec] = useState<SetSpec | null>(null);
  const [probs, setProbs] = useState<Problem[]>([]);
  const [showSchema, setShowSchema] = useState(true);
  const [actBoxes, setActBoxes] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [msg, setMsg] = useState('');

  const toggle = (s: SchemaId) => setSchemas((l) => (l.includes(s) ? l.filter((x) => x !== s) : [...l, s]));
  const make = () => {
    if (!schemas.length) return;
    const sp: SetSpec = { grade, schemas: SCHEMA_LIST.filter((s) => schemas.includes(s)), count, mixed, seed: 1 + Math.floor(Math.random() * 90000) };
    setSpec(sp);
    setProbs(problemsOfSet(sp));
    setShowSchema(!mixed);
    setMsg('');
  };

  return (
    <div className="tc-stack">
      <p className="tc-note">{t('set_hint')}</p>
      <div className="tc-form">
        <label className="tc-field">
          <span>{t('f_grade')}</span>
          <select className="tc-input" value={grade} onChange={(e) => setGrade(Number(e.target.value) as Grade)}>
            {[1, 2, 3, 4, 5, 6].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>
        <label className="tc-field">
          <span>{t('set_count')}</span>
          <select className="tc-input" value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {[4, 5, 6, 8, 10, 12].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="tc-fieldset tc-radios">
          <legend>{t('set_order')}</legend>
          <label className="tc-check">
            <input type="radio" name="tc-order" checked={!mixed} onChange={() => setMixed(false)} /> <span>{t('set_blocked')}</span>
          </label>
          <label className="tc-check">
            <input type="radio" name="tc-order" checked={mixed} onChange={() => setMixed(true)} /> <span>{t('set_mixed')}</span>
          </label>
        </fieldset>
      </div>
      <fieldset className="tc-fieldset">
        <legend>{t('set_schemas')}</legend>
        <div className="tc-checks">
          {SCHEMA_LIST.map((s) => (
            <label key={s} className="tc-check" style={{ ['--schema' as string]: schemaMeta(s).color }}>
              <input type="checkbox" checked={schemas.includes(s)} onChange={() => toggle(s)} />
              <span>
                {pick(schemaMeta(s).name, lang)} <small className="tc-muted">({minGradeFor(s)}+)</small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      {!schemas.length && <p className="tc-warn">{t('set_empty')}</p>}
      <div className="tc-actions">
        <button type="button" className="tc-btn tc-btn--primary" disabled={!schemas.length} onClick={make}>
          {t('btn_make')}
        </button>
      </div>
      {spec && (
        <section className="tc-card">
          <ol className="tc-setlist">
            {probs.map((p, i) => (
              <li key={p.id + i}>
                <span className="tc-tag" style={{ ['--schema' as string]: schemaMeta(p.steps[0].schema).color }}>
                  {pick(schemaMeta(p.steps[0].schema).name, lang)}
                </span>{' '}
                {(p.text[lang] ?? p.text.tr).map((s) => sentenceString(s)).join(' ')}{' '}
                <button type="button" className="tc-btn tc-btn--sm" onClick={() => onProject(p)}>
                  {t('btn_project')}
                </button>
              </li>
            ))}
          </ol>
          <h4>{t('set_link')}</h4>
          <code className="tc-code">{setUrl(spec)}</code>
          <label className="tc-check">
            <input type="checkbox" checked={showSchema} onChange={(e) => setShowSchema(e.target.checked)} />
            <span>{t('ws_show_schema')}</span>
          </label>
          <label className="tc-check">
            <input type="checkbox" checked={actBoxes} onChange={(e) => setActBoxes(e.target.checked)} />
            <span>{t('ws_act')}</span>
          </label>
          <div className="tc-actions">
            <button type="button" className="tc-btn" onClick={async () => setMsg((await copyText(setUrl(spec))) ? t('copied') : t('copy_fail'))}>
              {t('btn_copy_link')}
            </button>
            <button type="button" className="tc-btn tc-btn--primary" onClick={() => setPrinting(true)} disabled={!probs.length}>
              🖨 {t('btn_print')}
            </button>
          </div>
          <p role="status" aria-live="polite" className="tc-muted">
            {msg}
          </p>
        </section>
      )}
      {printing && (
        <PrintJob onDone={() => setPrinting(false)}>
          <WorksheetPages problems={probs} lang={lang} t={t} showSchema={showSchema} actBoxes={actBoxes} />
        </PrintJob>
      )}
    </div>
  );
}
