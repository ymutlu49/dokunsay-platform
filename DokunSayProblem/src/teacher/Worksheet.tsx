/**
 * Yazdırılabilir A4 çalışma kâğıdı: her problemde hikâye + boş şema diyagramı (ya da karışık
 * sette "Hangi tür?" kutucukları + serbest çizim alanı) + denklem satırı (☐ ☐ ☐ = ☐) +
 * cevap cümlesi kalıbı. Ayrı sayfada cevap anahtarı. Baskı: body'ye portal; yazdırma
 * sırasında yalnız bu kök görünür (teacher.css @media print).
 */
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Lang, Problem } from '../content/types';
import { pick } from '../i18n';
import { answerText, equationFor, schemaMeta, sentenceString } from '../lib/contentAdapter';
import { tokensText } from '../lib/problemUtil';
import { BlankDiagram } from './BlankDiagram';
import { SCHEMA_LIST } from './data';
import type { TT } from './i18n';

export function WorksheetPages({ problems, lang, t, showSchema }: { problems: Problem[]; lang: Lang; t: TT; showSchema: boolean }) {
  return (
    <div className="ws" lang={lang}>
      <header className="ws__head">
        <h1>{t('ws_title')}</h1>
        <div className="ws__meta">
          <span>{t('ws_name')} ______________________</span>
          <span>{t('ws_date')} ____________</span>
        </div>
      </header>
      {problems.map((p, i) => (
        <article key={p.id + i} className="ws__item">
          <p className="ws__story">
            <b>{i + 1}.</b> {(p.text[lang] ?? p.text.tr).map((s) => sentenceString(s)).join(' ')}
          </p>
          {!showSchema && (
            <p className="ws__which">
              {t('ws_which')}{' '}
              {SCHEMA_LIST.map((s) => (
                <span key={s} className="ws__box">
                  ☐ {pick(schemaMeta(s).name, lang)}
                </span>
              ))}
            </p>
          )}
          {(showSchema ? p.steps : [p.steps[0]]).map((st, k) => (
            <BlankDiagram key={k} schema={showSchema ? st.schema : null} lang={lang} label={t('ws_draw')} />
          ))}
          <p className="ws__line">
            {t('ws_eq')} <span className="ws__slots">☐ ☐ ☐ = ☐</span>
          </p>
          <p className="ws__line">
            {t('ws_ans')} {p.answer >= 0 ? answerText(p, lang, '________') : '________'}
          </p>
        </article>
      ))}
      <footer className="ws__foot">{t('ws_footer')}</footer>
      <section className="ws__key">
        <h2>{t('ws_key')}</h2>
        <ol>
          {problems.map((p, i) => (
            <li key={p.id + i}>
              <b>{pick(schemaMeta(p.steps[0].schema).name, lang)}</b> ·{' '}
              <span data-numeric="true">
                {p.steps.map((st) => tokensText(equationFor(st).tokens)).join(' ; ')}
              </span>{' '}
              · {p.answer >= 0 ? answerText(p, lang, p.answer) : '—'}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/** Portal + window.print(); yazdırma bitince onDone. */
export function PrintJob({ children, onDone }: { children: ReactNode; onDone: () => void }) {
  const cb = useRef(onDone);
  cb.current = onDone;
  useEffect(() => {
    document.body.classList.add('tc-printing');
    const done = () => {
      document.body.classList.remove('tc-printing');
      cb.current();
    };
    window.addEventListener('afterprint', done, { once: true });
    const id = setTimeout(() => window.print(), 80);
    return () => {
      clearTimeout(id);
      window.removeEventListener('afterprint', done);
      document.body.classList.remove('tc-printing');
    };
  }, []);
  return createPortal(<div className="tc-print-root">{children}</div>, document.body);
}
