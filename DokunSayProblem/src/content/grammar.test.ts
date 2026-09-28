import { describe, expect, it } from 'vitest';
import * as tr from './grammar/tr';
import { numWordKu, kuOblique } from './grammar/ku';
import { numWordEn } from './grammar/en';
import { NOUNS } from './lexicon';

describe('Türkçe özel ad ekleri', () => {
  it('tamlayan', () => {
    expect(['Ela', 'Ali', 'Kerem', 'Mîr', 'Yusuf', 'Duru', 'Can', 'Ömer'].map(tr.nameGen))
      .toEqual(["Ela'nın", "Ali'nin", "Kerem'in", "Mîr'in", "Yusuf'un", "Duru'nun", "Can'ın", "Ömer'in"]);
  });
  it('yönelme / belirtme / ayrılma / bulunma', () => {
    expect(tr.nameDat('Kerem')).toBe("Kerem'e");
    expect(tr.nameDat('Ela')).toBe("Ela'ya");
    expect(tr.nameDat('Ali')).toBe("Ali'ye");
    expect(tr.nameAcc('Ela')).toBe("Ela'yı");
    expect(tr.nameAbl('Yusuf')).toBe("Yusuf'tan");
    expect(tr.nameAbl('Kerem')).toBe("Kerem'den");
    expect(tr.nameAbl('Serhat')).toBe("Serhat'tan");
    expect(tr.nameLoc('Ela')).toBe("Ela'da");
    expect(tr.nameKiAbl('Ela')).toBe("Ela'nınkinden");
    expect(tr.nameKiGen('Mert')).toBe("Mert'inkinin");
  });
});

describe('Türkçe sayı ekleri (okunuşa göre)', () => {
  it('ayrılma', () => expect([1, 3, 4, 5, 6, 9, 10, 20, 40, 100].map(tr.numAbl)).toEqual(["1'den", "3'ten", "4'ten", "5'ten", "6'dan", "9'dan", "10'dan", "20'den", "40'tan", "100'den"]));
  it('yönelme / belirtme / tamlayan', () => {
    expect([2, 5, 6, 10].map(tr.numDat)).toEqual(["2'ye", "5'e", "6'ya", "10'a"]);
    expect([2, 5, 6, 9].map(tr.numAcc)).toEqual(["2'yi", "5'i", "6'yı", "9'u"]);
    expect([2, 3, 5, 6].map(tr.numGen)).toEqual(["2'nin", "3'ün", "5'in", "6'nın"]);
  });
  it('iyelik ve üleştirme', () => {
    expect([2, 3, 4, 6, 10].map(tr.numPoss3)).toEqual(["2'si", "3'ü", "4'ü", "6'sı", "10'u"]);
    expect([2, 4, 6].map(tr.numPoss3Acc)).toEqual(["2'sini", "4'ünü", "6'sını"]);
    expect([2, 3, 4, 6, 9, 10].map(tr.numDist)).toEqual(["2'şer", "3'er", "4'er", "6'şar", "9'ar", "10'ar"]);
  });
  it('okunuş ve binlik ayırıcı', () => {
    expect(tr.numWord(1250)).toBe('bin iki yüz elli');
    expect(tr.numWord(99)).toBe('doksan dokuz');
    expect(tr.fmtTr(1250)).toBe('1.250');
    expect(tr.numAbl(1250)).toBe("1.250'den");
  });
});

describe('Türkçe cins ad çekimi (yumuşama sözlükten)', () => {
  it('iyelik / belirtme / yönelme', () => {
    expect(tr.poss3(NOUNS.kalem.tr)).toBe('kalemi');
    expect(tr.poss3(NOUNS.elma.tr)).toBe('elması');
    expect(tr.poss3(NOUNS.kitap.tr)).toBe('kitabı');
    expect(tr.poss3(NOUNS.cicek.tr)).toBe('çiçeği');
    expect(tr.poss3(NOUNS.tl.tr)).toBe("TL'si");
    expect(tr.poss3Pl(NOUNS.kalem.tr)).toBe('kalemleri');
    expect(tr.poss3Acc(NOUNS.kalem.tr)).toBe('kalemini');
    expect(tr.acc(NOUNS.kurabiye.tr)).toBe('kurabiyeyi');
    expect(tr.dat(NOUNS.tabak.tr)).toBe('tabağa');
    expect(tr.loc(NOUNS.sepet.tr)).toBe('sepette');
    expect(tr.gen(NOUNS.simit.tr)).toBe('simidin');
    expect(tr.plDat(NOUNS.tabak.tr)).toBe('tabaklara');
  });
});

describe('Kurmancî ve İngilizce', () => {
  it('FerMat sayı adları', () => {
    expect(numWordKu(90)).toBe('not');
    expect(numWordKu(23)).toBe('bîst û sê');
    expect(numWordKu(1000)).toBe('hezar');
    expect(numWordKu(250)).toBe('du sed û pêncî');
  });
  it('oblik', () => {
    expect(kuOblique('Rojda', 'f')).toBe('Rojdayê');
    expect(kuOblique('Berfîn', 'f')).toBe('Berfînê');
    expect(kuOblique('Baran', 'm')).toBe('Baranî');
  });
  it('EN sayı', () => expect(numWordEn(342)).toBe('three hundred and forty-two'));
});
