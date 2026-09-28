/**
 * Serbest Masa (Canlandırma Durağı alt modu; DESIGN §12) — problem yok: iki bölge + yedek + çöp,
 * birim seçici (tek sayaç / onluk / yüzlük), isteğe bağlı "sayıları gizle". Öğretmen ya da çocuk
 * keşif için kullanır (ör. "7'yi iki bölgeye kaç türlü ayırırız?"). Kayıt yazılmaz (değerlendirme
 * yok). Birim değişince miktarlar yeni birimlere çözülür; tek sayaçta 100'ü aşan masa temizlenir.
 */
import { useState } from 'react';
import type { ActUnit, Lang } from '../content/types';
import { MatBoard } from '../components/mat/MatBoard';
import { decompose, zoneTotal, type MatState, type MatZone } from '../components/mat/matState';
import type { MKey, MT } from './i18n';

type UnitMode = 'one' | 'ten' | 'hundred';
const UNITS: Record<UnitMode, ActUnit[]> = { one: ['one'], ten: ['ten', 'one'], hundred: ['hundred', 'ten', 'one'] };
const UNIT_LABEL: Record<UnitMode, MKey> = { one: 'act_free_one', ten: 'act_free_ten', hundred: 'act_free_hundred' };

function convert(s: MatState, units: ActUnit[]): MatState {
  const out: MatState = {};
  for (const [id, z] of Object.entries(s)) {
    const n = zoneTotal(z);
    out[id] = units.length === 1 && n > 100 ? { h: 0, t: 0, o: 0 } : decompose(n, units);
  }
  return out;
}

export function FreeTable({ t, lang, onBack, onExit }: { t: MT; lang: Lang; onBack: () => void; onExit: () => void }) {
  const [unit, setUnit] = useState<UnitMode>('one');
  const [state, setState] = useState<MatState>({});
  const [hide, setHide] = useState(false);
  const zones: MatZone[] = [
    { id: 'z1', label: t('act_free_zone1'), kind: 'pile', tone: 1 },
    { id: 'z2', label: t('act_free_zone2'), kind: 'pile', tone: 2 },
  ];
  const total = zones.reduce((a, z) => a + zoneTotal(state[z.id]), 0);

  return (
    <section className="md-shell md-free" aria-label={t('act_free_title')} lang={lang}>
      <header className="md-shell__head">
        <button type="button" className="md-btn md-btn--ghost" onClick={onExit}>
          ← {t('back_cards')}
        </button>
        <h2 className="md-shell__title">🧺 {t('act_free_title')}</h2>
      </header>
      <p className="md-sub">{t('act_free_desc')}</p>
      <div className="md-free__tools">
        <div className="md-seg" role="radiogroup" aria-label={t('act_free_units')}>
          {(Object.keys(UNITS) as UnitMode[]).map((u) => (
            <button
              key={u}
              type="button"
              role="radio"
              aria-checked={unit === u}
              className={`md-seg__btn${unit === u ? ' is-on' : ''}`}
              onClick={() => {
                setUnit(u);
                setState((s) => convert(s, UNITS[u]));
              }}
            >
              {t(UNIT_LABEL[u])}
            </button>
          ))}
        </div>
        <label className="md-check">
          <input type="checkbox" checked={hide} onChange={(e) => setHide(e.target.checked)} />
          <span>{t('act_free_hide')}</span>
        </label>
        <button type="button" className="md-btn md-btn--ghost" onClick={() => setState({})}>
          {t('btn_clear')}
        </button>
      </div>
      <MatBoard zones={zones} state={state} onChange={setState} units={UNITS[unit]} showCounts={!hide} />
      <p className="md-free__total" aria-live="polite" data-numeric="true">
        {hide ? ' ' : t('act_free_total', { n: total })}
      </p>
      <div className="md-actions">
        <button type="button" className="md-btn md-btn--primary" onClick={onBack}>
          ← {t('act_free_back')}
        </button>
      </div>
    </section>
  );
}
