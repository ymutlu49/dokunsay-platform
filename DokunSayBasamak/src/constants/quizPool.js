export const QUIZ_POOL = [
  /* Hatırlama (L1) */
  { q: "1 onluk kaç birliktir?",                o: ["1","10","100","1000"],   a: 1, bloom: 1 },
  { q: "1 yüzlük kaç onluktur?",                o: ["1","10","100","1000"],   a: 1, bloom: 1 },
  { q: "1 binlik kaç yüzlüktür?",               o: ["10","100","1000","1"],   a: 0, bloom: 1 },
  { q: "324'teki 2'nin basamak değeri?",         o: ["2","20","200","2000"],   a: 1, bloom: 1 },
  { q: "407'de kaç onluk var?",                  o: ["4","0","7","40"],        a: 1, bloom: 1 },
  /* Anlama (L2) */
  { q: "5 onluk + 3 birlik = ?",                o: ["53","35","503","8"],     a: 0, bloom: 2 },
  { q: "100 = ? onluk",                          o: ["1","10","100","1000"],   a: 1, bloom: 2 },
  { q: "'İki yüz altı' = ?",                    o: ["260","206","2006","26"], a: 1, bloom: 2 },
  { q: "999'dan sonra gelen sayı?",              o: ["9910","1000","9100","9991"], a: 1, bloom: 2 },
  { q: "300+40+7 = ?",                           o: ["3047","3470","347","30047"], a: 2, bloom: 2 },
  /* Uygulama (L3) */
  { q: "45+28 = ?",                             o: ["63","73","613","6013"],  a: 1, bloom: 3 },
  { q: "6 yüzlük + 15 onluk + 3 birlik = ?",    o: ["6153","753","618","615"], a: 1, bloom: 3 },
  { q: "Hangisi en büyük?",                      o: ["98","203","197","89"],   a: 1, bloom: 3 },
  { q: "12 onluk + 5 birlik = ?",                o: ["125","175","1205","215"], a: 0, bloom: 3 },
  /* Analiz (L4) */
  { q: "Hangi iki sayı toplamı 1000 yapar?",     o: ["400+500","600+400","300+800","200+900"], a: 1, bloom: 4 },
  { q: "875'te yüzler basamağındaki rakamın değeri?", o: ["8","80","800","8000"], a: 2, bloom: 4 },
  { q: "Aşağıdakilerden hangisi 304'ü gösterir?", o: ["3 yüzlük 4 onluk","3 yüzlük 4 birlik","30 onluk 4 birlik","3 binlik 4 birlik"], a: 1, bloom: 4 },
  /* Değerlendirme (L5) */
  { q: "13 onluk = kaç yüzlük + kaç onluk?",    o: ["1 yüzlük 3 onluk","13 yüzlük","1 yüzlük 13 onluk","0 yüzlük 13 onluk"], a: 0, bloom: 5 },
  { q: "1000 hangi gruba eşittir?",              o: ["100 onluk","100 yüzlük","10 yüzlük","1000 birlik"], a: 2, bloom: 5 },
  { q: "Hangi sayı 5 yüzlük + 17 onluktur?",    o: ["517","5170","670","657"], a: 2, bloom: 5 },
];
