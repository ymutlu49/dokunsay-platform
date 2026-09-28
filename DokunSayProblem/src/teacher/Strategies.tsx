/**
 * Özet → Canlandırma stratejileri kartı (DESIGN §12.1 ilke 10; CGI — Carpenter vd. 1999).
 * Şema bazında gelişim yolu ("Hepsini sayıyor → Üstüne sayıyor → Onluk kullanıyor"; çarpımsal:
 * "Birer birer dağıtıyor → Grup grup koyuyor"), her basamakta SAYI + küçük yatay çubuk (yüzde
 * yok), son 10 gözlemde eğilim oku, S1/S0'da "Nesnelerle dene" sayısı (destek gereksinimi).
 * Baskın strateji hâlâ ilk basamaksa kısa öğretmen notu. Değerlendirme dili: gelişim.
 */
import { useMemo } from 'react';
import type { ActStrategy, Lang } from '../content/types';
import { pick } from '../i18n';
import { schemaMeta } from '../lib/contentAdapter';
import type { TeacherSummary } from './data';
import type { TKey, TT } from './i18n';
import { buildStrategySummary, type SchemaStrategyRow, type Trend } from './strategyData';

const TREND_KEY: Record<Trend, TKey> = { up: 'st_trend_up', down: 'st_trend_down', flat: 'st_trend_flat' };
const sKey = (s: ActStrategy) => `st_${s}` as TKey;

function Row({ r, t, lang, max }: { r: SchemaStrategyRow; t: TT; lang: Lang; max: number }) {
  const meta = schemaMeta(r.schema);
  const name = pick(meta.name, lang);
  const steps = [...r.path, ...r.extra];
  return (
    <li className="tc-strat__schema">
      <div className="tc-strat__head">
        <span className="tc-mastery__name">
          <span className="tc-swatch" style={{ background: meta.color }} aria-hidden="true" />
          {name}
        </span>
        <span className="tc-muted" data-numeric="true">
          {t('st_obs', { n: r.obs })}
        </span>
        {r.obs > 0 && (
          <span className={`tc-strat__trend${r.trend ? ` is-${r.trend}` : ''}`}>{r.trend ? t(TREND_KEY[r.trend]) : t('st_trend_none')}</span>
        )}
      </div>
      {r.obs > 0 && (
        <ol className="tc-bars tc-bars--wide tc-strat__path" aria-label={t('st_path_aria', { schema: name })}>
          {steps.map((s, i) => {
            const offPath = !r.path.includes(s);
            return (
              <li key={s} className={`tc-bars__row${r.dominant === s ? ' is-now' : ''}${offPath ? ' is-off' : ''}`} title={`${t(sKey(s))}: ${r.counts[s]}`}>
                <span className="tc-bars__lbl">
                  <span className="tc-strat__arrow" aria-hidden="true">
                    {offPath ? '·' : i === 0 ? '' : '→'}
                  </span>
                  {t(sKey(s))}
                </span>
                <span className="tc-bars__track">
                  <span className={`tc-bars__fill${offPath ? ' tc-bars__fill--alt' : ''}`} style={{ width: `${(r.counts[s] / max) * 100}%` }} />
                </span>
                <span className="tc-bars__val" data-numeric="true">
                  {r.counts[s]}
                </span>
              </li>
            );
          })}
        </ol>
      )}
      {r.lowAttempts > 0 && (
        <p className={`tc-strat__support${r.actUsed > 0 ? ' is-on' : ''}`} data-numeric="true">
          {t('st_support', { n: r.actUsed, m: r.lowAttempts })}
        </p>
      )}
    </li>
  );
}

export function Strategies({ s, t, lang }: { s: TeacherSummary; t: TT; lang: Lang }) {
  const st = useMemo(() => buildStrategySummary(s.attempts, s.mods), [s.attempts, s.mods]);
  const max = Math.max(1, ...st.rows.flatMap((r) => Object.values(r.counts)));
  const names = (ids: typeof st.stillCountAll) => ids.map((id) => pick(schemaMeta(id).name, lang)).join(', ');

  return (
    <section className="tc-card tc-strat" aria-labelledby="tc-strat-title">
      <h3 id="tc-strat-title">🧮 {t('st_title')}</h3>
      <p className="tc-muted">{t('st_desc')}</p>
      {st.rows.length === 0 ? (
        <p className="tc-empty">{t('st_empty')}</p>
      ) : (
        <ul className="tc-strat__list">
          {st.rows.map((r) => (
            <Row key={r.schema} r={r} t={t} lang={lang} max={max} />
          ))}
        </ul>
      )}
      {st.lowAttempts > 0 && (
        <p className="tc-note" data-numeric="true">
          {t('st_support_all', { n: st.actUsed, m: st.lowAttempts })}
        </p>
      )}
      {st.stillCountAll.length > 0 && (
        <p className="tc-note tc-note--act">
          <b>{t('st_now', { list: names(st.stillCountAll) })}.</b> {t('st_note_countall')}
        </p>
      )}
      {st.stillDealing.length > 0 && (
        <p className="tc-note tc-note--act">
          <b>{t('st_now', { list: names(st.stillDealing) })}.</b> {t('st_note_deal')}
        </p>
      )}
      {st.stillCountAll.length === 0 && <p className="tc-note">{t('st_note_countall')}</p>}
      <p className="tc-note">{t('st_dev_note')}</p>
    </section>
  );
}
