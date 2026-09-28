/**
 * Paylaşım kodu ve hash yönlendirme (router YOK — 06 §1.7).
 *
 * Desteklenen hash parametreleri (birlikte kullanılabilir):
 *   #tab=solve|train|teacher|help          → sekme
 *   #p=<kod>                                → paylaşılan problem (spec + tohum, base64url JSON)
 *   #sema=<SchemaId>&bilinmeyen=<Role>      → platform derin bağlantısı (yörünge rozetleri, rehber)
 *   #mod=karisik                            → karışık set
 * Geçersiz değerler SESSİZCE yok sayılır; araç normal açılır.
 */
import { SCHEMA_ROLES, type Grade, type ProblemSpec, type Role, type SchemaId } from '../content/types';

export type TabId = 'solve' | 'train' | 'teacher' | 'help';
export const TAB_IDS: readonly TabId[] = ['solve', 'train', 'teacher', 'help'];

const SCHEMA_IDS = Object.keys(SCHEMA_ROLES) as SchemaId[];

function b64urlEncode(s: string): string {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(s: string): string {
  const pad = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(pad);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function isGrade(n: unknown): n is Grade {
  return typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= 6;
}

export function isSchemaId(v: unknown): v is SchemaId {
  return typeof v === 'string' && (SCHEMA_IDS as string[]).includes(v);
}

export function isRoleOf(schema: SchemaId, v: unknown): v is Role {
  return typeof v === 'string' && (SCHEMA_ROLES[schema] as readonly string[]).includes(v);
}

/** Problem isteğini (tohum dahil) kısa, URL-güvenli bir koda çevirir. */
export function encodeShare(spec: ProblemSpec): string {
  const compact: Record<string, unknown> = { g: spec.grade, s: spec.seed ?? 1 };
  if (spec.schema) compact.sc = spec.schema;
  if (spec.variant) compact.v = spec.variant;
  if (spec.unknown) compact.u = spec.unknown;
  if (spec.axes && Object.keys(spec.axes).length) compact.ax = spec.axes;
  if (spec.context) compact.c = spec.context;
  return b64urlEncode(JSON.stringify(compact));
}

/** Kodu çözer; bozuk/geçersizse null (sessizce). */
export function decodeShare(code: string): ProblemSpec | null {
  try {
    const o = JSON.parse(b64urlDecode(code)) as Record<string, unknown>;
    if (!isGrade(o.g)) return null;
    const spec: ProblemSpec = { grade: o.g, seed: typeof o.s === 'number' ? o.s : 1 };
    if (isSchemaId(o.sc)) {
      spec.schema = o.sc;
      if (isRoleOf(o.sc, o.u)) spec.unknown = o.u;
    }
    if (typeof o.v === 'string') spec.variant = o.v as ProblemSpec['variant'];
    if (o.ax && typeof o.ax === 'object') spec.axes = o.ax as ProblemSpec['axes'];
    if (typeof o.c === 'string') spec.context = o.c;
    return spec;
  } catch {
    return null;
  }
}

export interface HashRoute {
  tab?: TabId;
  share?: ProblemSpec;
  deep?: { schema: SchemaId; unknown?: Role };
  mixed?: boolean;
}

export function readHash(hash: string = typeof location !== 'undefined' ? location.hash : ''): HashRoute {
  const params = new URLSearchParams(hash.replace(/^#\/?/, ''));
  const route: HashRoute = {};
  const tab = params.get('tab');
  if (tab && (TAB_IDS as readonly string[]).includes(tab)) route.tab = tab as TabId;
  const p = params.get('p');
  if (p) {
    const spec = decodeShare(p);
    if (spec) route.share = spec;
  }
  const sema = params.get('sema');
  if (isSchemaId(sema)) {
    const b = params.get('bilinmeyen');
    route.deep = isRoleOf(sema, b) ? { schema: sema, unknown: b } : { schema: sema };
  }
  if (params.get('mod') === 'karisik') route.mixed = true;
  return route;
}

export function writeHash(parts: Record<string, string | undefined>): void {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(parts)) if (v) p.set(k, v);
  const next = '#' + p.toString();
  if (location.hash !== next) history.replaceState(null, '', next === '#' ? location.pathname + location.search : next);
}

export function shareUrl(spec: ProblemSpec): string {
  const base = location.href.split('#')[0];
  return `${base}#tab=solve&p=${encodeShare(spec)}`;
}

/** Şemaya uygun en düşük sınıf (DESIGN §3 tablosu; bilinmeyen de hesaba katılır). */
export function minGradeFor(schema: SchemaId, unknown?: Role): Grade {
  switch (schema) {
    case 'change':
      return unknown === 'start' ? 2 : 1;
    case 'combine':
      return 1;
    case 'compare':
      return unknown === 'difference' || !unknown ? 1 : 2;
    case 'equalGroups':
      return 2;
    case 'multCompare':
      return 3;
  }
}
