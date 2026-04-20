import { describe, it, expect } from 'vitest';
import { TOOLS, TOOL_CATEGORIES } from './tools.js';

describe('TOOLS kataloğu', () => {
  it('tam olarak 7 araç içerir', () => {
    expect(TOOLS).toHaveLength(7);
  });

  it('beklenen tüm araçları kapsar', () => {
    const ids = TOOLS.map((t) => t.id).sort();
    expect(ids).toEqual(['bar', 'basamak', 'clock', 'geo', 'kesir', 'tam', 'veri']);
  });

  it('her araç 5 dili sağlar (tr, ku, en, ar, fa)', () => {
    const LANGS = ['tr', 'ku', 'en', 'ar', 'fa'];
    for (const tool of TOOLS) {
      for (const l of LANGS) {
        expect(tool.name[l], `${tool.id}.name.${l}`).toBeTruthy();
        expect(tool.subtitle[l], `${tool.id}.subtitle.${l}`).toBeTruthy();
        expect(tool.description[l], `${tool.id}.description.${l}`).toBeTruthy();
        expect(tool.topics[l], `${tool.id}.topics.${l}`).toBeInstanceOf(Array);
        expect(tool.topics[l].length).toBeGreaterThan(0);
      }
    }
  });

  it('her araç zorunlu alanları sağlar', () => {
    for (const tool of TOOLS) {
      expect(tool.id).toMatch(/^[a-z]+$/);
      expect(tool.icon).toBeTruthy();
      expect(tool.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(tool.ageRange).toMatch(/^\d+-\d+$/);
      expect(tool.framework).toBeTruthy();
      expect(tool.devUrl).toMatch(/^http:\/\/localhost:\d+$/);
      expect(tool.prodPath).toMatch(/^\/[A-Za-z-]+\/$/);
      expect(tool.folder).toBeTruthy();
      expect(tool.status).toMatch(/^(stable|beta|alpha|experimental)$/);
    }
  });

  it('dev portları benzersizdir ve 3001-3007 aralığında', () => {
    const ports = TOOLS.map((t) => parseInt(t.devUrl.split(':').pop(), 10));
    const unique = new Set(ports);
    expect(unique.size).toBe(ports.length);
    for (const p of ports) {
      expect(p).toBeGreaterThanOrEqual(3001);
      expect(p).toBeLessThanOrEqual(3007);
    }
  });

  it('launcher ile port çakışması yoktur (3000 yalnızca launcher\u0027da)', () => {
    const ports = TOOLS.map((t) => parseInt(t.devUrl.split(':').pop(), 10));
    expect(ports).not.toContain(3000);
  });
});

describe('TOOL_CATEGORIES', () => {
  it('her dilde aynı kategori yapısı vardır', () => {
    const trIds = TOOL_CATEGORIES.tr.map((c) => c.id).sort();
    for (const lang of ['ku', 'en', 'ar', 'fa']) {
      const ids = TOOL_CATEGORIES[lang].map((c) => c.id).sort();
      expect(ids, `${lang} kategori id'leri`).toEqual(trIds);
    }
  });

  it('her kategoride en az 1 araç vardır', () => {
    for (const cat of TOOL_CATEGORIES.tr) {
      expect(cat.tools.length).toBeGreaterThan(0);
    }
  });

  it('kategorilerde referans edilen tüm araç id\u0027leri gerçekten var', () => {
    const validIds = new Set(TOOLS.map((t) => t.id));
    for (const cat of TOOL_CATEGORIES.tr) {
      for (const toolId of cat.tools) {
        expect(validIds.has(toolId)).toBe(true);
      }
    }
  });

  it('her araç en az bir kategoride listelenmiş', () => {
    const allListed = new Set();
    for (const cat of TOOL_CATEGORIES.tr) {
      for (const id of cat.tools) allListed.add(id);
    }
    for (const tool of TOOLS) {
      expect(allListed.has(tool.id)).toBe(true);
    }
  });
});
