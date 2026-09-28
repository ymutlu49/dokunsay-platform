/**
 * Çalışma kâğıdı → "Canlandırma kutuları" (DESIGN §12, VRA: sanal → temsili → soyut; Bouck vd.
 * 2018). Canlandırılabilir problemde betiğin bölgeleri basılı boşluk olur; çocuk sayaç çizer ya
 * da gerçek sayaç koyar. Boyut betikten: bölgenin vuruşlar boyunca beklenen en büyük miktarı.
 *  ≤20 (birimler ['one']) → bölge başına 1–2 boş onluk çerçeve (5'li iki satır);
 *  >20 → onluk | birlik basamak kutusu; grup bölgesi → kap sayısı kadar daire (≤10).
 * Gizli kutu ("?") kesikli çerçeveyle. Sayı YAZILMAZ (çerçeve cevabı ele vermez).
 */
import type { ActScript, Lang, Problem } from '../content/types';
import { pick } from '../i18n';
import { actExpected, actExpectedGroups, actFeasible, actScript } from '../lib/contentAdapter';
import type { TT } from './i18n';

function zoneMax(script: ActScript, id: string): number {
  let m = 0;
  script.beats.forEach((_, i) => (m = Math.max(m, actExpected(script, i)[id] ?? 0)));
  return m;
}

function plateCount(script: ActScript, id: string, fixed?: number): number {
  if (fixed) return fixed;
  let m = 0;
  script.beats.forEach((_, i) => (m = Math.max(m, (actExpectedGroups(script, i)[id] ?? []).length)));
  return m;
}

function TenFrame() {
  return (
    <span className="ws-tf" aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => (
        <span key={i} className="ws-tf__cell" />
      ))}
    </span>
  );
}

export function ActBoxes({ problem, lang, t }: { problem: Problem; lang: Lang; t: TT }) {
  if (!actFeasible(problem, 0)) return null;
  const script = actScript(problem, lang, 0);
  if (!script) return null;
  const small = script.units.length === 1;
  return (
    <div className="ws-act">
      <p className="ws-act__title">{t('ws_act_title')}</p>
      <div className="ws-act__zones">
        {script.zones.map((z) => {
          const label = pick(z.label, lang);
          if (z.kind === 'group') {
            const n = Math.min(10, Math.max(2, plateCount(script, z.id, z.count)));
            return (
              <div key={z.id} className="ws-act__zone ws-act__zone--wide">
                <span className="ws-act__lbl">{label}</span>
                <span className="ws-plates">
                  {Array.from({ length: n }, (_, i) => (
                    <span key={i} className="ws-plate" title={t('ws_act_plate', { n: i + 1 })} />
                  ))}
                </span>
              </div>
            );
          }
          const box = z.kind === 'box';
          const frames = Math.min(2, Math.max(1, Math.ceil(zoneMax(script, z.id) / 10)));
          return (
            <div key={z.id} className={`ws-act__zone${box ? ' is-box' : ''}`}>
              <span className="ws-act__lbl">
                {label}
                {box ? ' ?' : ''}
              </span>
              {small ? (
                <span className="ws-tfs">
                  {Array.from({ length: frames }, (_, i) => (
                    <TenFrame key={i} />
                  ))}
                </span>
              ) : (
                <span className="ws-pv">
                  <span className="ws-pv__col">
                    <span className="ws-pv__head">{t('ws_act_tens')}</span>
                  </span>
                  <span className="ws-pv__col">
                    <span className="ws-pv__head">{t('ws_act_ones')}</span>
                  </span>
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
