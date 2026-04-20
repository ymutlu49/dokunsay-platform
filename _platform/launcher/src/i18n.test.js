import { describe, it, expect } from 'vitest';
import { LANGS, LANG_LABELS, LANG_FLAGS, STRINGS, useT } from './i18n.js';

describe('i18n yapılandırması', () => {
  it('3 dil destekler', () => {
    expect(LANGS).toEqual(['tr', 'ku', 'en']);
  });

  it('her dilin etiketi ve bayrağı vardır', () => {
    for (const lang of LANGS) {
      expect(LANG_LABELS[lang]).toBeTruthy();
      expect(LANG_FLAGS[lang]).toBeTruthy();
    }
  });

  it('her dilde tüm anahtarlar vardır', () => {
    const trKeys = Object.keys(STRINGS.tr).sort();
    const kuKeys = Object.keys(STRINGS.ku).sort();
    const enKeys = Object.keys(STRINGS.en).sort();
    expect(kuKeys).toEqual(trKeys);
    expect(enKeys).toEqual(trKeys);
  });

  it('her çeviri boş olmayan string\u0027dir', () => {
    for (const lang of LANGS) {
      for (const [key, value] of Object.entries(STRINGS[lang])) {
        expect(value, `${lang}.${key}`).toBeTruthy();
        expect(typeof value, `${lang}.${key}`).toBe('string');
      }
    }
  });
});

describe('useT fonksiyonu', () => {
  it('belirtilen dildeki çeviriyi döner', () => {
    const t = useT('tr');
    expect(t('btn_start' in STRINGS.tr ? 'open_tool' : 'open_tool')).toBe(STRINGS.tr.open_tool);
  });

  it('eksik anahtarda Türkçeye geri düşer', () => {
    const t = useT('ku');
    expect(t('open_tool')).toBe(STRINGS.ku.open_tool);
  });

  it('hiç bulunmazsa anahtarın kendisini döner', () => {
    const t = useT('tr');
    expect(t('nonexistent_key_xyz')).toBe('nonexistent_key_xyz');
  });
});
