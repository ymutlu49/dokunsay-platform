/** Kısa sınıf içi kullanım rehberi (03 §E) + dürüst not (DESIGN §11). Anahtar sözcük öğüdü YOK. */
import type { TKey, TT } from './i18n';

const ITEMS: TKey[] = ['gd_1', 'gd_2', 'gd_3', 'gd_4', 'gd_5', 'gd_6', 'gd_7'];

export function HonestNote({ t }: { t: TT }) {
  return (
    <aside className="tc-honest" role="note">
      <b>{t('honest_title')}:</b> {t('honest')}
    </aside>
  );
}

export function Guide({ t }: { t: TT }) {
  return (
    <div className="tc-stack">
      <section className="tc-card">
        <h3>{t('gd_title')}</h3>
        <ul className="tc-guide">
          {ITEMS.map((k) => (
            <li key={k}>{t(k)}</li>
          ))}
        </ul>
      </section>
      <HonestNote t={t} />
    </div>
  );
}
