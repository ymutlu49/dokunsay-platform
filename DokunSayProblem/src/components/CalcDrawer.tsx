/**
 * Hesap çekmecesi (DESIGN §2 ilke 6: hesap yapıdan ayrılır). İki basit görsel araç:
 *  - Sayı doğrusu: işaretçi konur (dokun) — sıçramaları çocuk kendi sayar.
 *  - Onluk çerçeve(ler): hücreye dokun → dolar/boşalır (≤ 40 için).
 * Puanlanmaz, kayıt tutmaz.
 */
import { useState } from 'react';
import { useT } from '../i18n';

export function CalcDrawer({ max }: { max: number }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'line' | 'frame'>('line');
  return (
    <div className={`calc${open ? ' is-open' : ''}`}>
      <button type="button" className="calc__toggle" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {t('btn_calc')} {open ? '▴' : '▾'}
      </button>
      {open && (
        <div className="calc__body">
          <div className="calc__tabs" role="group">
            <button type="button" className={`pill${tab === 'line' ? ' is-on' : ''}`} aria-pressed={tab === 'line'} onClick={() => setTab('line')}>
              {t('calc_numberline')}
            </button>
            {max <= 40 && (
              <button type="button" className={`pill${tab === 'frame' ? ' is-on' : ''}`} aria-pressed={tab === 'frame'} onClick={() => setTab('frame')}>
                {t('calc_tenframe')}
              </button>
            )}
          </div>
          {tab === 'line' || max > 40 ? <NumberLine max={max} /> : <TenFrames max={max} />}
        </div>
      )}
    </div>
  );
}

function NumberLine({ max }: { max: number }) {
  const t = useT();
  const top = max <= 20 ? 20 : max <= 50 ? 50 : max <= 100 ? 100 : Math.ceil(max / 100) * 100;
  const step = top <= 20 ? 1 : top <= 50 ? 5 : top <= 100 ? 10 : top / 10;
  const [marks, setMarks] = useState<number[]>([]);
  const ticks: number[] = [];
  for (let v = 0; v <= top; v += step) ticks.push(v);
  return (
    <div className="nline">
      <svg viewBox="0 0 1000 70" className="nline__svg" role="img" aria-label={t('calc_numberline')}>
        <line x1="20" y1="35" x2="980" y2="35" stroke="currentColor" strokeWidth="3" />
        {ticks.map((v) => {
          const x = 20 + (v / top) * 960;
          const on = marks.includes(v);
          return (
            <g key={v} className="nline__tick" onClick={() => setMarks((m) => (on ? m.filter((x2) => x2 !== v) : [...m, v]))}>
              <rect x={x - 18} y="0" width="36" height="70" fill="transparent" />
              <line x1={x} y1="25" x2={x} y2="45" stroke="currentColor" strokeWidth={v % (step * 5) === 0 ? 3 : 1.5} />
              {(top <= 20 || v % (step * 2) === 0) && (
                <text x={x} y="66" textAnchor="middle" fontSize="18" fill="currentColor">
                  {v}
                </text>
              )}
              {on && <circle cx={x} cy="35" r="10" className="nline__mark" />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function TenFrames({ max }: { max: number }) {
  const frames = Math.max(1, Math.ceil(max / 10));
  const [on, setOn] = useState<Set<number>>(new Set());
  const t = useT();
  return (
    <div className="tenframes" aria-label={t('calc_tenframe')}>
      {Array.from({ length: frames }, (_, f) => (
        <div key={f} className="tenframe">
          {Array.from({ length: 10 }, (_, c) => {
            const id = f * 10 + c;
            const filled = on.has(id);
            return (
              <span
                key={c}
                className={`tenframe__cell${filled ? ' is-on' : ''}`}
                onClick={() =>
                  setOn((s) => {
                    const n = new Set(s);
                    if (n.has(id)) n.delete(id);
                    else n.add(id);
                    return n;
                  })
                }
              />
            );
          })}
        </div>
      ))}
      <span className="tenframes__count" data-numeric="true">
        {on.size}
      </span>
    </div>
  );
}
