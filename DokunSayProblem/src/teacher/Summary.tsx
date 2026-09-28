/**
 * Özet: şema bazında iskele düzeyi (S3→S0 merdiveni), ipucu kullanımı (H0–H4 dağılımı),
 * adım bazlı ortalama süre, Hata Dedektifi kilidi. Kütüphanesiz HTML çubuklar; tek seri →
 * açıklama kutusu yok, başlık adlandırır; her çubukta sayı metin olarak (renk tek başına
 * anlam taşımaz). Boş durumda nazik açıklama.
 */
import { useState } from 'react';
import type { Lang } from '../content/types';
import { pick } from '../i18n';
import { schemaMeta } from '../lib/contentAdapter';
import { saveDevice } from '../lib/storage';
import { teacherUnlocked } from '../modules/record';
import type { TeacherSummary } from './data';
import { Heatmap, Confusion } from './Heatmap';
import type { TKey, TT } from './i18n';

export function Summary({ s, t, lang }: { s: TeacherSummary; t: TT; lang: Lang }) {
  const [unlock, setUnlock] = useState(teacherUnlocked);
  const empty = s.attempts.length === 0 && s.mods.length === 0;
  const hintMax = Math.max(1, ...s.hints);
  const timeMax = Math.max(1, ...s.stepTimes.map((x) => x.avgSec));

  return (
    <div className="tc-stack">
      <p className="tc-muted">{t('sum_counts', { a: s.attempts.length, m: s.mods.length })}</p>
      {empty && <p className="tc-empty">{t('sum_empty')}</p>}

      <section className="tc-card">
        <h3>{t('sum_mastery')}</h3>
        <p className="tc-muted">{t('sum_mastery_desc')}</p>
        <ul className="tc-mastery">
          {s.mastery.map((m) => {
            const meta = schemaMeta(m.schema);
            const label = m.level == null ? t('level_none') : t(`level_${m.level}` as TKey);
            return (
              <li key={m.schema} className="tc-mastery__row">
                <span className="tc-mastery__name">
                  <span className="tc-swatch" style={{ background: meta.color }} aria-hidden="true" />
                  {pick(meta.name, lang)}
                </span>
                <span className="tc-ladder" role="img" aria-label={`${pick(meta.name, lang)}: ${label}`}>
                  {[3, 2, 1, 0].map((lv) => (
                    <span key={lv} className={`tc-ladder__step${m.level != null && m.level <= lv ? ' is-on' : ''}${m.level === lv ? ' is-now' : ''}`}>
                      S{lv}
                    </span>
                  ))}
                </span>
                <span className="tc-mastery__lvl">{label}</span>
                <span className="tc-muted">{t('sum_solved', { n: m.solved })}</span>
              </li>
            );
          })}
        </ul>
        <p className="tc-note">{t('thresholds_note')}</p>
        <label className="tc-check">
          <input
            type="checkbox"
            checked={unlock}
            onChange={(e) => {
              setUnlock(e.target.checked);
              saveDevice('modulesUnlock', e.target.checked);
            }}
          />
          <span>{t('unlock_label')}</span>
        </label>
        <p className="tc-note">{t('unlock_note')}</p>
      </section>

      <Heatmap s={s} t={t} lang={lang} />
      <Confusion s={s} t={t} lang={lang} />

      <section className="tc-card">
        <h3>{t('sum_hints')}</h3>
        {s.attempts.length === 0 ? (
          <p className="tc-muted">{t('sum_empty')}</p>
        ) : (
          <ul className="tc-bars">
            {s.hints.map((n, h) => (
              <li key={h} className="tc-bars__row" title={`${h === 0 ? t('hint_0') : `H${h}`}: ${n}`}>
                <span className="tc-bars__lbl">{h === 0 ? t('hint_0') : `H${h}`}</span>
                <span className="tc-bars__track">
                  <span className="tc-bars__fill" style={{ width: `${(n / hintMax) * 100}%` }} />
                </span>
                <span className="tc-bars__val" data-numeric="true">
                  {n}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="tc-card">
        <h3>{t('sum_times')}</h3>
        <p className="tc-note">{t('sum_times_note')}</p>
        {s.stepTimes.length === 0 ? (
          <p className="tc-muted">{t('sum_empty')}</p>
        ) : (
          <ul className="tc-bars">
            {s.stepTimes.map((x) => (
              <li key={x.step} className="tc-bars__row" title={`${t(`step_${x.step}` as TKey)}: ${t('sec', { n: x.avgSec })} (n=${x.n})`}>
                <span className="tc-bars__lbl">{t(`step_${x.step}` as TKey)}</span>
                <span className="tc-bars__track">
                  <span className="tc-bars__fill tc-bars__fill--alt" style={{ width: `${(x.avgSec / timeMax) * 100}%` }} />
                </span>
                <span className="tc-bars__val" data-numeric="true">
                  {t('sec', { n: x.avgSec })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
