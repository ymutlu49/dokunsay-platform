/**
 * ÖĞRETMEN PANELİ sekmesi (DESIGN §9; STANDARDS §1.8). Yetişkin kapısı → alt sekmeler:
 * Özet (düzey, ısı tablosu, karışıklık matrisi, ipucu, adım süreleri) · Özel problem ·
 * Set ve çalışma kâğıdı · Projeksiyon · Veri · Rehber. Veriler yalnız bu cihazda.
 *
 * Props: { lang, grade? } — grade verilmezse ilerlemedeki sınıf (currentGrade).
 * Set bağlantısı biçimi: #tab=solve&set=<kod> → App `readSetHash` + `problemsOfSet`
 * (./setShare) ile okuyabilir.
 */
import { useCallback, useMemo, useState } from 'react';
import type { Grade, Lang, Problem } from '../content/types';
import { LangContext } from '../i18n';
import { makeProblem } from '../lib/contentAdapter';
import { currentGrade } from '../modules/record';
import { schemasFor } from '../modules/api';
import { AdultGate, gateOpen, setGate } from './AdultGate';
import { CustomProblem } from './CustomProblem';
import { buildSummary } from './data';
import { DataTools } from './DataTools';
import { Guide, HonestNote } from './Guide';
import { tt, type TKey } from './i18n';
import { Projection } from './Projection';
import { SetBuilder } from './SetBuilder';
import { Summary } from './Summary';
import './teacher.css';

type Sub = 'summary' | 'custom' | 'set' | 'projection' | 'data' | 'guide';
const SUBS: { id: Sub; key: TKey; icon: string }[] = [
  { id: 'summary', key: 'tab_summary', icon: '📊' },
  { id: 'custom', key: 'tab_custom', icon: '🧩' },
  { id: 'set', key: 'tab_set', icon: '🖨' },
  { id: 'projection', key: 'tab_projection', icon: '📽' },
  { id: 'data', key: 'tab_data', icon: '💾' },
  { id: 'guide', key: 'tab_guide', icon: '📘' },
];

export default function TeacherTab({ lang, grade: gradeProp }: { lang: Lang; grade?: Grade }) {
  const t = useMemo(() => tt(lang), [lang]);
  const grade = useMemo<Grade>(() => gradeProp ?? currentGrade(), [gradeProp]);
  const [open, setOpen] = useState(gateOpen);
  const [sub, setSub] = useState<Sub>('summary');
  const [ver, setVer] = useState(0);
  const [proj, setProj] = useState<Problem | null>(null);
  const summary = useMemo(() => buildSummary(), [ver, open, sub]); // eslint-disable-line react-hooks/exhaustive-deps

  const randomProblem = useCallback(() => {
    const schemas = schemasFor(grade);
    return makeProblem({ grade, schema: schemas[Math.floor(Math.random() * schemas.length)], seed: 1 + Math.floor(Math.random() * 90000) });
  }, [grade]);

  let body;
  if (!open) body = <AdultGate t={t} onOpen={() => setOpen(true)} />;
  else {
    body = (
      <>
        <header className="tc-head">
          <h2>👩‍🏫 {t('panel_title')}</h2>
          <button
            type="button"
            className="tc-btn tc-btn--sm"
            onClick={() => {
              setGate(false);
              setOpen(false);
            }}
          >
            🔒 {t('gate_lock')}
          </button>
        </header>
        <HonestNote t={t} />
        <nav className="tc-subtabs" aria-label={t('panel_title')}>
          {SUBS.map((s) => (
            <button key={s.id} type="button" aria-current={sub === s.id ? 'page' : undefined} className={`tc-subtab${sub === s.id ? ' is-on' : ''}`} onClick={() => setSub(s.id)}>
              <span aria-hidden="true">{s.icon}</span> {t(s.key)}
            </button>
          ))}
        </nav>
        <div className="tc-panel">
          {sub === 'summary' && <Summary s={summary} t={t} lang={lang} />}
          {sub === 'custom' && <CustomProblem t={t} lang={lang} grade0={grade} onProject={(p) => setProj(p)} />}
          {sub === 'set' && <SetBuilder t={t} lang={lang} grade0={grade} onProject={(p) => setProj(p)} />}
          {sub === 'projection' && (
            <section className="tc-card">
              <p>{t('pj_desc')}</p>
              <button type="button" className="tc-btn tc-btn--primary tc-btn--big" onClick={() => setProj(randomProblem())}>
                📽 {t('pj_open')}
              </button>
            </section>
          )}
          {sub === 'data' && <DataTools t={t} onChanged={() => setVer((v) => v + 1)} />}
          {sub === 'guide' && <Guide t={t} />}
        </div>
      </>
    );
  }

  return (
    <LangContext.Provider value={lang}>
      <div className="tc-root" lang={lang}>
        {body}
        {open && proj && <Projection problem={proj} lang={lang} t={t} onClose={() => setProj(null)} onNew={() => setProj(randomProblem())} />}
      </div>
    </LangContext.Provider>
  );
}
