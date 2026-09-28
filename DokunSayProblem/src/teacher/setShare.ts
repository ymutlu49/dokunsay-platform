/**
 * SET paylaşımı — share.ts yalnız tek problem (#p=) destekliyor; set için kendi kodlamamız:
 *   #tab=solve&set=<base64url(JSON {v:1, g, sc:[...], n, m:0|1, s, ax?})>
 * App'in okuması için: `readSetHash(location.hash)` → SetSpec | null, sonra
 * `problemsOfSet(spec)` → Problem[] (aynı spec → aynı problemler; tohumlu).
 * Bozuk/geçersiz kod SESSİZCE null döner.
 */
import type { Axes, Grade, Problem, SchemaId } from '../content/types';
import { makeProblem } from '../lib/contentAdapter';
import { isSchemaId } from '../lib/share';
import { shuffleSeeded } from '../lib/problemUtil';

export interface SetSpec {
  grade: Grade;
  schemas: SchemaId[];
  count: number;
  mixed: boolean;
  seed: number;
  axes?: Partial<Axes>;
}

function b64e(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64d(s: string): string {
  const pad = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  return new TextDecoder().decode(Uint8Array.from(atob(pad), (c) => c.charCodeAt(0)));
}

export function encodeSet(spec: SetSpec): string {
  const o: Record<string, unknown> = { v: 1, g: spec.grade, sc: spec.schemas, n: spec.count, m: spec.mixed ? 1 : 0, s: spec.seed };
  if (spec.axes && Object.keys(spec.axes).length) o.ax = spec.axes;
  return b64e(JSON.stringify(o));
}

export function decodeSet(code: string): SetSpec | null {
  try {
    const o = JSON.parse(b64d(code)) as Record<string, unknown>;
    const g = o.g;
    if (typeof g !== 'number' || !Number.isInteger(g) || g < 1 || g > 6) return null;
    const schemas = Array.isArray(o.sc) ? (o.sc.filter(isSchemaId) as SchemaId[]) : [];
    if (!schemas.length) return null;
    const count = typeof o.n === 'number' ? Math.max(1, Math.min(20, Math.round(o.n))) : 6;
    return {
      grade: g as Grade,
      schemas,
      count,
      mixed: o.m === 1,
      seed: typeof o.s === 'number' ? o.s : 1,
      axes: o.ax && typeof o.ax === 'object' ? (o.ax as Partial<Axes>) : undefined,
    };
  } catch {
    return null;
  }
}

export function setUrl(spec: SetSpec): string {
  const base = location.href.split('#')[0];
  return `${base}#tab=solve&set=${encodeSet(spec)}`;
}

export function readSetHash(hash: string = typeof location !== 'undefined' ? location.hash : ''): SetSpec | null {
  const code = new URLSearchParams(hash.replace(/^#\/?/, '')).get('set');
  return code ? decodeSet(code) : null;
}

/** Bloklu: şemalar sırayla, her şema ardışık blok; karışık: tohumlu karıştırma. */
export function problemsOfSet(spec: SetSpec): Problem[] {
  const per = Math.ceil(spec.count / spec.schemas.length);
  const out: Problem[] = [];
  spec.schemas.forEach((schema, si) => {
    for (let i = 0; i < per && out.length < spec.count; i++) {
      const p = makeProblem({ grade: spec.grade, schema, axes: spec.axes, seed: spec.seed + si * 101 + i * 7 });
      if (p) out.push(p);
    }
  });
  return spec.mixed ? shuffleSeeded(out, spec.seed) : out;
}
