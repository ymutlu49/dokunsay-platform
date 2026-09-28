/**
 * Şema × hata türü ısı tablosu ve şema karışıklık matrisi (DESIGN §9). Gerçek <table>
 * (ekran okuyucu ve tablo görünümü aynı anda). Kodlama: tek ton (çivit) açık→koyu +
 * hücrede SAYI + sık hücrelerde çizgili DESEN (renk körü / baskı). Satır adına dokununca
 * öğretmen notu açılır (MISCONCEPTIONS.teacherNote varsa o da eklenir).
 */
import { useState } from 'react';
import type { ErrorClass, Lang, SchemaId } from '../content/types';
import { pick } from '../i18n';
import { schemaMeta } from '../lib/contentAdapter';
import { misconceptionNote } from '../modules/api';
import { ERROR_LIST, SCHEMA_LIST, type TeacherSummary } from './data';
import type { TKey, TT } from './i18n';

function level(n: number, max: number): number {
  if (n <= 0 || max <= 0) return 0;
  return Math.min(5, Math.max(1, Math.ceil((n / max) * 5)));
}

function Cell({ n, max, title, diag }: { n: number; max: number; title: string; diag?: boolean }) {
  const lv = level(n, max);
  return (
    <td className={`tc-cell lv-${lv}${lv >= 4 ? ' is-striped' : ''}${diag ? ' is-diag' : ''}`} title={title} data-numeric="true">
      {n > 0 ? n : <span className="tc-zero">·</span>}
    </td>
  );
}

export function Heatmap({ s, t, lang }: { s: TeacherSummary; t: TT; lang: Lang }) {
  const [open, setOpen] = useState<ErrorClass | null>(null);
  const rows = ERROR_LIST;
  return (
    <section className="tc-card">
      <h3>{t('heat_title')}</h3>
      <p className="tc-muted">{t('heat_desc')}</p>
      {s.heatMax === 0 ? (
        <p className="tc-empty">{t('heat_empty')}</p>
      ) : (
        <div className="tc-tablewrap">
          <table className="tc-heat">
            <thead>
              <tr>
                <th scope="col" />
                {SCHEMA_LIST.map((sc) => (
                  <th key={sc} scope="col">
                    {pick(schemaMeta(sc).name, lang)}
                  </th>
                ))}
                <th scope="col">{t('col_total')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => {
                const total = SCHEMA_LIST.reduce((a, sc) => a + s.heat[e][sc], 0);
                const extra = misconceptionNote(e);
                return (
                  <tr key={e}>
                    <th scope="row">
                      <button type="button" className="tc-rowbtn" aria-expanded={open === e} onClick={() => setOpen(open === e ? null : e)}>
                        {t(`err_${e}` as TKey)}
                      </button>
                      {open === e && (
                        <p className="tc-rownote">
                          {t(`note_${e}` as TKey)}
                          {extra && pick(extra, lang) ? ` ${pick(extra, lang)}` : ''}
                        </p>
                      )}
                    </th>
                    {SCHEMA_LIST.map((sc) => (
                      <Cell key={sc} n={s.heat[e][sc]} max={s.heatMax} title={`${t(`err_${e}` as TKey)} · ${pick(schemaMeta(sc).name, lang)}: ${s.heat[e][sc]}`} />
                    ))}
                    <td className="tc-total" data-numeric="true">
                      {total}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function Confusion({ s, t, lang }: { s: TeacherSummary; t: TT; lang: Lang }) {
  let max = 0;
  SCHEMA_LIST.forEach((a) => SCHEMA_LIST.forEach((b) => a !== b && (max = Math.max(max, s.conf[a][b]))));
  const name = (x: SchemaId) => pick(schemaMeta(x).name, lang);
  return (
    <section className="tc-card">
      <h3>{t('conf_title')}</h3>
      <p className="tc-muted">{t('conf_desc')}</p>
      {s.confN === 0 ? (
        <p className="tc-empty">{t('conf_empty')}</p>
      ) : (
        <div className="tc-tablewrap">
          <table className="tc-heat tc-conf">
            <thead>
              <tr>
                <th scope="col" className="tc-conf__corner">
                  {t('conf_row')}
                </th>
                {SCHEMA_LIST.map((sc) => (
                  <th key={sc} scope="col">
                    {name(sc)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCHEMA_LIST.map((a) => (
                <tr key={a}>
                  <th scope="row">{name(a)}</th>
                  {SCHEMA_LIST.map((b) =>
                    a === b ? (
                      <td key={b} className="tc-cell is-diag" title={`${name(a)} → ${name(b)}: ${s.conf[a][b]}`} data-numeric="true">
                        {s.conf[a][b] > 0 ? `✓ ${s.conf[a][b]}` : <span className="tc-zero">·</span>}
                      </td>
                    ) : (
                      <Cell key={b} n={s.conf[a][b]} max={max} title={`${name(a)} → ${name(b)}: ${s.conf[a][b]}`} />
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
