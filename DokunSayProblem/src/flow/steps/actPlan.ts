/**
 * Canlandırma betiği (ActScript) → MatBoard yapılandırması. SAF: vuruş indeksine göre görünen
 * bölgeler, o vuruşa özgü kolaylıklar (dağıt / grup yap / kopyala / topla / taşı), gizli kutunun
 * hedef çizgisi ve Rehber için hedef mat durumu.
 */
import type { ActBeat, ActScript, ActZone, Lang, Problem, Role } from '../../content/types';
import { pick } from '../../i18n';
import { toneOf } from '../../components/diagram/common';
import { actExpected, actExpectedGroups } from '../../lib/contentAdapter';
import { decompose, emptyZone, spread, type MatState, type MatZone } from '../../components/mat/matState';

export function beatZoneIds(b: ActBeat): string[] {
  switch (b.kind) {
    case 'place': case 'add': return [b.zone];
    case 'remove': return b.to ? [b.zone, b.to] : [b.zone];
    case 'combine': return [...b.from, b.to];
    case 'match': return [...b.zones];
    case 'deal': case 'makeGroups': case 'copy': return [b.from, b.to];
    case 'mystery': return b.from ? [b.zone, b.from] : [b.zone];
    case 'ask': return b.zone ? [b.zone] : [];
  }
}

/** Bu vuruşta sayısı gizlenecek bölgeler (çocuk sayarak okusun). */
export function askHidden(script: ActScript, b: ActBeat): string[] {
  if (b.kind !== 'ask') return [];
  if (b.read === 'difference') {
    const m = script.beats.find((x) => x.kind === 'match');
    return m && m.kind === 'match' ? [...m.zones] : b.zone ? [b.zone] : [];
  }
  if (b.read === 'groupSize' || b.read === 'groupCount') {
    const g = script.zones.find((z) => z.kind === 'group');
    return g ? [g.id] : [];
  }
  return b.zone ? [b.zone] : [];
}

function counterUnit(problem: Problem, script: ActScript, z: ActZone): Role | undefined {
  const st = problem.steps[script.step];
  if (z.kind === 'group') return st.schema === 'equalGroups' ? 'total' : 'reference';
  return z.role;
}

function toneFor(problem: Problem, script: ActScript, z: ActZone): 1 | 2 | 3 | 4 {
  const st = problem.steps[script.step];
  if (z.kind === 'group') return st.schema === 'equalGroups' ? toneOf(st.schema, 'perGroup') : toneOf(st.schema, 'reference');
  return z.role ? toneOf(st.schema, z.role) : 1;
}

/** Gizli kutunun hedef çizgisi (DESIGN §12.1 ilke 5; types.ts mystery.target açıklaması). */
function targetFor(script: ActScript, problem: Problem, z: ActZone, upto: number): MatZone['target'] | undefined {
  const m = script.beats.slice(0, upto + 1).find((b) => b.kind === 'mystery' && b.zone === z.id);
  if (!m || m.kind !== 'mystery' || m.target == null) return undefined;
  const st = problem.steps[script.step];
  if (m.from) return { mode: 'rest', value: m.target, with: [m.from] };
  const others = script.zones.filter((x) => x.id !== z.id && x.kind !== 'group' && x.kind !== 'box').map((x) => x.id);
  if (st.schema === 'compare') return { mode: z.role === 'smaller' ? 'less' : 'more', value: m.target, with: others.slice(0, 1) };
  if (st.schema === 'change' && st.variant === 'separate') {
    const outs = script.beats.filter((b) => b.kind === 'remove' && b.zone === z.id && b.to).map((b) => (b as { to: string }).to);
    return { mode: 'more', label: 'rest', value: m.target, with: outs.length ? outs : others };
  }
  return { mode: 'sum', value: m.target, with: others };
}

export function matZonesFor(
  script: ActScript,
  idx: number,
  problem: Problem,
  lang: Lang,
  opts: { revealed?: boolean } = {},
): MatZone[] {
  const st = problem.steps[script.step];
  const seen = new Set<string>();
  script.beats.slice(0, idx + 1).forEach((b) => beatZoneIds(b).forEach((id) => seen.add(id)));
  const b = script.beats[Math.min(idx, script.beats.length - 1)];
  const cur = new Set(b ? beatZoneIds(b) : []);
  const hidden = opts.revealed || !b ? [] : askHidden(script, b);
  return script.zones
    .filter((z) => seen.has(z.id))
    .map((z) => {
      const role = counterUnit(problem, script, z);
      const unit = role ? st.quantities.find((q) => q.role === role)?.unit : undefined;
      const mz: MatZone = {
        id: z.id,
        label: pick(z.label, lang),
        kind: z.kind,
        count: z.count,
        tone: toneFor(problem, script, z),
        unitLabel: unit ? pick(unit, lang) : undefined,
        active: cur.has(z.id),
        hideCount: hidden.includes(z.id),
      };
      if (z.kind === 'box') mz.target = targetFor(script, problem, z, idx);
      if (!b) return mz;
      if (b.kind === 'remove' && b.to === z.id) mz.fillFrom = b.zone;
      if (b.kind === 'combine' && b.to === z.id) mz.gatherFrom = b.from;
      if (b.kind === 'deal' && b.to === z.id) mz.dealFrom = b.from;
      if (b.kind === 'makeGroups' && b.to === z.id) {
        mz.groupFrom = b.from;
        mz.groupSize = b.size;
      }
      if (b.kind === 'copy' && b.to === z.id) mz.copyFrom = b.from;
      if (z.kind === 'box' && mz.target?.mode === 'rest' && (b.kind === 'mystery' || (b.kind === 'ask' && b.read === 'box'))) mz.fillFrom = mz.target.with?.[0];
      return mz;
    });
}

/** Rehber / izleme: vuruş SONRASI beklenen mat durumu (kutu açıklığı ayrıca verilir). */
export function targetState(script: ActScript, idx: number, prev: MatState): MatState {
  const counts = actExpected(script, idx);
  const groups = actExpectedGroups(script, idx);
  const next: MatState = { ...prev };
  for (const z of script.zones) {
    const p = prev[z.id] ?? emptyZone();
    const n = counts[z.id] ?? 0;
    if (z.kind === 'group') next[z.id] = { ...p, h: 0, t: 0, o: 0, groups: groups[z.id] ?? spread(n, z.count ?? 0) };
    else next[z.id] = { ...p, ...decompose(n, script.units) };
  }
  return next;
}
