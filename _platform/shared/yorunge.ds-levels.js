// ════════════════════════════════════════════════════════════════════════
// DOKUNSAY YAPRAKLARI — DÜZEYE ÖZGÜ alıştırma ve örnek üreticileri
// ────────────────────────────────────────────────────────────────────────
// NEDEN AYRI MODÜL: worksheet-dokunsay.js'teki builder'lar yörüngeyi birkaç
// "bant"a bölüyordu ve bant içinde yalnız SAYI büyüyordu. Ölçüm sonucu:
// 224 yaprağın 125'i bir öncekiyle BİREBİR aynı alıştırma setini taşıyordu,
// örnek kutusu ise yörünge boyunca tekti (comp'ta 20 yaprak aynı örnek).
// Düzey adı ilerliyor, çocuğun yaptığı iş ilerlemiyordu.
//
// TEK KURAL — SAHTE ZORLUK YASAK:
// Bir düzeyi ötekinden ayıran şey sayının BÜYÜMESİ değil, görevin BİÇİMİDİR.
// "3 yerine 7 yaz" ayrım sayılmaz; "tanı" → "süreli tanı" → "dağınık dizilimde
// tanı" → "parçalardan bütünü söyle" sayılır. (SayKent'te aynı sınıf sorun
// bu kuralla kapatılmıştı.)
//
// MATERYAL SADAKATİ: görseller gerçek DokunSay setine karşılık gelmeli —
// 1–10 delikli çubuk (uzunluk = sayı, delik = sayılabilir çokluk), 4 renk pul
// (mavi/kırmızı/yeşil/sarı), 5'lik ve 10'luk çerçeve. Basamak blokları, Kesir
// ve Geo yalnız yörünge gerçekten onları gerektiriyorsa.
//
// KAYITLI OLMAYAN YÖRÜNGE SORUN DEĞİL: DS_EX/DS_EG'de anahtarı olmayan yörünge
// eski builder'a düşer (worksheet-dokunsay.js). Kademeli geçişe izin verir.
//
// A4 SINIRI: yapraklar sabit 297mm ve milimetrik dolu; taşan içerik SESSİZCE
// kırpılır. Düzey başına en çok 3 alıştırma, görselsiz madde serbest — çocuğun
// gerçek materyalle yapacağı iş için çizim zaten gereksizdir.
// ════════════════════════════════════════════════════════════════════════
import {
  dsRod, dsRodPair, dsFrame, dsChips, dsChipsTwo, dsChip, dsDotCard, dsBaseten,
  dsFractionBar, dsFractionCircle, dsShape, dsShapeRow, dsAngle, dsAnglePair,
  dsCubeGrid, dsCubeGridPair, dsCubeStack, dsNumberLine, dsEqChips, dsGeoboard,
  dsRuler, dsMeasureOnRuler,
} from './yorunge.dokunsay-viz.js'

// ── Yardımcılar (worksheet-dokunsay.js ile aynı sınıflar) ─────────────────
export const wbox = () => '<span class="wbox"></span>'
export const wboxBig = () => '<span class="wbox wbox-lg"></span>'
export const eqRow = (h) => `<div class="eqrow">${h}</div>`
export const hint = (t) => `<p class="ans-hint">○ ${t}</p>`
export const item = (q, vis, ans) => ({ q, vis: vis || '', ans: ans || '' })
export const shown = (t) => `<b class="ans-shown">${t}</b>`
export const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
export const chipRow = (cols) => `<div class="pat-row">${cols.map((c) => c === '?' ? '<span class="pat-q">?</span>' : `<span class="pat-c">${dsChip(c, null, 30)}</span>`).join('')}</div>`

// ════════════════════════════════════════════════════════════════════════
// DS_EX — alıştırmalar.  DS_EX[yörünge](i, lv, en) → [item, …]
// DS_EG — örnek kutusu.  DS_EG[yörünge](i, lv, en) → item
// i = düzey indeksi (0 tabanlı). Oyun düzeyleri buraya hiç düşmez.
// ════════════════════════════════════════════════════════════════════════
export const DS_EX = {}
export const DS_EG = {}

// ────────────────────────────────────────────────────────────────────────
// sub — SANBİL (saymadan anlık bilme) · 12 düzey · REFERANS UYGULAMA
// Ayrım ekseni düzeyden düzeye: adlandırma → süre baskısı → dizilim
// düzensizliği → parçadan bütüne → 5 çıpası → 10'a tümleme → onluk yapı →
// birim-üstü-birim → çarpımsal yapı.
// ────────────────────────────────────────────────────────────────────────
DS_EX.sub = (i) => {
  if (i <= 3) return [ // ADLANDIRMA — süre baskısı yok, çokluk sabit dursun
    item('Kaç pul var? Acele etme, bak ve yaz.', dsDotCard(3), wbox()),
    item('Bu kartta kaç pul? Yaz.', dsDotCard(2), wbox()),
    item('Boş karta tam 3 pul çiz.', dsDotCard(0), hint('tam 3 pul')),
  ]
  if (i === 4) return [ // SÜRE — aynı çokluk, artık "bak-kapat"
    item('Kartı 2 saniye göster, KAPAT. Kaç puldu?', dsDotCard(4), wbox()),
    item('Yine kapat: kaç pul gördün?', dsDotCard(3), wbox()),
    item('Çubuğu bir bakışta oku: kaç delik?', dsRod(4, { fill: 4 }), wbox()),
  ]
  if (i === 5) return [ // DİZİLİM — dağınık yerleşim; zar deseni ezberi işlemez
    item('Pullar dağınık duruyor. Bir bakışta kaç?', dsChips(5, 'red', 3), wbox()),
    item('Bu sefer düzenli. Kaç pul?', dsFrame(1, 5, 5), wbox()),
    item('İkisi de 5 miydi? Dizilim değişince sayı değişir mi?', '', hint('değişmez — aynı 5')),
  ]
  if (i === 6) return [ // PARÇADAN BÜTÜNE — iki renk; ayrıştır sonra birleştir
    item('İki renk pul. Önce parçaları gör, sonra hepsini söyle.', dsChipsTwo(2, 3), eqRow(`${wbox()} ile ${wbox()} → ${wboxBig()}`)),
    item('Beşlik çerçevede kaç pul dolu, kaç delik boş?', dsFrame(1, 5, 4, 'red'), eqRow(`${wbox()} dolu · ${wbox()} boş`)),
    item('5 pulu iki renge böl: kaç türlü olur?', dsFrame(1, 5, 0), hint('1 ve 4 · 2 ve 3 …')),
  ]
  if (i === 7) return [ // 5 ÇIPASI — dolu beşlik + artan
    item('Beşlik çerçeve DOLU, yanında fazladan pul var. Hepsi kaç?', dsChipsTwo(5, 2), eqRow(`5 ve ${wbox()} → ${wboxBig()}`)),
    item('7 pul: beşliği doldur, kalanı yaz.', dsFrame(1, 5, 5), eqRow(`5 + ${wbox()} = 7`)),
    item("Hangi çubuk 5'ten uzun? Yanına koyup bak.", dsRodPair(5, 7), hint('uzun olanı yuvarla')),
  ]
  if (i === 8) return [ // 10'A TÜMLEME — BOŞ delik sorulur, eksik toplanan
    item('Onluk çerçevede kaç pul dolu? Kaç delik BOŞ?', dsFrame(2, 5, 7), eqRow(`${wbox()} dolu · ${wbox()} boş`)),
    item('10 olması için kaç pul daha gerek?', dsFrame(2, 5, 6), eqRow(`6 + ${wbox()} = 10`)),
    item('Onluk çerçeveyi 5+5 olarak gör: üst sıra kaç?', dsFrame(2, 5, 10), hint('üstte 5, altta 5')),
  ]
  if (i === 9) return [ // ONLUK YAPI — iki çerçeve; "bir tam onluk ve kaç"
    item('Bir çerçeve TAM, ötekinde birkaç pul. Hepsi kaç?', dsFrame(2, 5, 10) + dsFrame(2, 5, 4), eqRow(`10 ve ${wbox()} → ${wboxBig()}`)),
    item('16 kur: kaç tam onluk, kaç tek pul?', dsFrame(2, 5, 10) + dsFrame(2, 5, 6), eqRow(`${wbox()} onluk ${wbox()} birlik`)),
    item('"On altı" derken hangi onluğu duyuyorsun?', '', hint('on + altı')),
  ]
  if (i === 10) return [ // BİRİM-ÜSTÜ-BİRİM — onluk çubuk tek bir "şey" sayılır
    item('Onluk çubukları TEK TEK değil, ONLUK olarak say.', dsBaseten(3, 4), eqRow(`${wbox()} onluk ${wbox()} birlik = ${wboxBig()}`)),
    item('27 pulu daha az parçayla göster: 2 onluk 7 birlik. Sayı yine kaç?', dsBaseten(2, 7), wboxBig()),
    item('Masaya 27 pul say. Kaç onluk çubuk dolar, kaç pul artar?', '', eqRow(`${wbox()} onluk · ${wbox()} artan`)),
  ]
  return [ // ÇARPIMSAL YAPI — eşit sıralar, tek tek sayma yok
    item('Sıralar EŞİT. Tek tek sayma: kaç sıra, her sırada kaç?', dsFrame(3, 4, 12), eqRow(`${wbox()} × ${wbox()} = ${wboxBig()}`)),
    item("2 sıra 5'er pul mu, 5 sıra 2'şer pul mu? İkisi de kaç?", dsFrame(2, 5, 10), eqRow(`2 × 5 = ${wboxBig()}`)),
    item('12 pulu eşit sıralara diz: kaç türlü olur?', '', hint('3×4 · 4×3 · 2×6 …')),
  ]
}

// Örnek kutusu o düzeyin GÖREV BİÇİMİNİ modellemeli — tek örnek tüm yörüngeye
// yetmez (eski hâlinde 4-12. yaprakların hepsi "gördüm: 3" diyordu).
DS_EG.sub = (i) => {
  if (i <= 3) return item('Baktım ve söyledim: 3 pul. Acele etmedim.', dsDotCard(3), shown('3'))
  if (i === 4) return item('Kartı kapattım, sonra söyledim: 4. Saymadım.', dsDotCard(4), shown('4'))
  if (i === 5) return item('Pullar dağınıktı ama yine 5 — dizilim sayıyı değiştirmez.', dsChips(5, 'red', 3), shown('5'))
  if (i === 6) return item('2 mavi ile 3 kırmızı gördüm — parçalardan bütün: 5.', dsChipsTwo(2, 3), shown('2 ve 3 → 5'))
  if (i === 7) return item('Beşlik doluydu, yanında 2 vardı: 5 ve 2 → 7.', dsChipsTwo(5, 2), shown('5 ve 2 → 7'))
  if (i === 8) return item("7 dolu, 3 delik boş — 10'a 3 kalmış.", dsFrame(2, 5, 7), shown("7 dolu · 10'a 3"))
  if (i === 9) return item('Bir çerçeve tam, ötekinde 6: on ve altı → 16.', dsFrame(2, 5, 10) + dsFrame(2, 5, 6), shown('10 ve 6 → 16'))
  if (i === 10) return item('Çubukları onluk saydım: 3 onluk 4 birlik → 34.', dsBaseten(3, 4), shown('3 onluk 4 birlik = 34'))
  return item('3 sıra, her sırada 4 — tek tek saymadım: 3 × 4 → 12.', dsFrame(3, 4, 12), shown('3 × 4 = 12'))
}

// ── ajan A ──────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────
// count — SAYMA · 19 düzey
// Ayrım ekseni: sözcüğü tanıma → ezbere dizi → dizideki boşluk → birebir
// eşleme → kardinal değer → rakam eşleme → istenen sayıyı ÜRETME → dizilimden
// bağımsız üretme → geriye sayma → herhangi bir sayıdan/komşuluk → onar ritmik
// → onluk geçişi → üzerine sayarken iz tutma → beşer/ikişer → sayısal iz (çift
// sayma) → basamak değeri → 100 ötesi örüntü → korunum → iki yönde akıcılık.
// ────────────────────────────────────────────────────────────────────────
DS_EX.count = (i) => {
  if (i === 0) return [ // SÖZCÜĞÜ TANIMA — henüz sayma yok, sesle eşleme
    item('Yetişkin "bir" dedi. Sen de söyle ve TEK pula dokun.', dsChips(1, 'blue', 1), hint('bir')),
    item('"İki" derken kaç pula dokundun? Boya.', dsChips(2, 'red', 2), hint('iki pul')),
    item('Sayı sözcüğü duyduğunda elini kaldır: bir · iki · üç.', '', hint('dinle ve tekrarla')),
  ]
  if (i === 1) return [ // EZBERE DİZİ — nesnesiz, sıra ezberi
    item('Yüksek sesle say: bir, iki, üç… Nerede durdun?', '', wbox()),
    item("Sıra doğru mu? \"bir, iki, dört, üç\" — yanlışı çiz.", '', hint('dört ile üç yer değişmiş')),
    item('Sen söyle, yetişkin çubuğu uzatsın. Beşe kadar dene.', dsRod(5), hint('bir-iki-üç-dört-beş')),
  ]
  if (i === 2) return [ // DİZİDEKİ BOŞLUK — 10'a kadar, eksik sözcük
    item('Dizide bir sayı kayıp: 1, 2, 3, __, 5. Hangisi?', '', wbox()),
    item("10'a kadar say. Sonra 7'den sonra ne gelir?", '', wbox()),
    item('Boş kutulara kaçırdığın sayıları yaz.', dsNumberLine(10, { missing: [4, 8] }), hint('4 ve 8')),
  ]
  if (i === 3) return [ // BİREBİR EŞLEME — her deliğe tek pul, atlama yok
    item('Her deliğe TEK pul koy. Atlama, iki kez sayma.', dsRod(6, { fill: 6 }), hint('parmağını kaydırarak say')),
    item('Bu çubukta pul konulmamış kaç delik kaldı?', dsRod(7, { fill: 4 }), wbox()),
    item('Yanlışı bul: Ali bir pulu iki kez saydı. Ne olur?', '', hint('sayı fazla çıkar')),
  ]
  if (i === 4) return [ // KARDİNAL DEĞER — say, KAPAT, "hepsi kaç?"
    item('Say, sonra çubuğu KAPAT. Hepsi kaç? Yeniden sayma.', dsRod(4, { fill: 4 }), wbox()),
    item('Saydın: bir-iki-üç-dört-beş. Öyleyse hepsi kaç?', dsChips(5, 'green', 5), wbox()),
    item('Saydıktan sonra 1 pul ekledim. Baştan saymadan söyle.', '', hint('son sayının bir sonrası')),
  ]
  if (i === 5) return [ // RAKAM EŞLEME — çokluk ↔ sembol
    item('Kaç delik dolu? Rakamla yaz.', dsRod(8, { fill: 8 }), wbox()),
    item('Bu rakam kadar pulu boş çubuğa yerleştir: 6', dsRod(10), hint('6 pul')),
    item('9 rakamını yaz. Yazarken yüksek sesle "dokuz" de.', '', wbox()),
  ]
  if (i === 6) return [ // ÜRETME — "bana 4 ver": say ve AYIR
    item('Kutuda çok pul var. Bana tam 4 tane AYIR.', dsChips(9, 'yellow', 5), hint('sayarak ayır, sonra dur')),
    item('Çubuğa tam 3 pul koy, fazlasını geri koy.', dsRod(5), hint('3 pul')),
    item('Yetişkin "5 ver" dedi. Verirken nerede duracaksın?', '', hint("\"beş\" deyince dur")),
  ]
  if (i === 7) return [ // DİZİLİMDEN BAĞIMSIZ ÜRETME — 10 ve ötesi
    item('Aynı 8 pulu ÜÇ ayrı dizilişte diz. Sayı değişti mi?', dsChips(8, 'blue', 4), hint('değişmez')),
    item('Dağınık duran kutudan 12 pul say ve ayır.', '', wbox()),
    item('Çubuk dolu değil; kaç pul daha istersin ki 10 olsun?', dsRod(10, { fill: 6 }), eqRow(`6 + ${wbox()} = 10`)),
  ]
  if (i === 8) return [ // GERİYE SAYMA — tek tek eksilterek
    item("10'dan geriye say. Her sayıda bir pul çıkar.", dsRod(10, { fill: 10 }), hint('10-9-8-…-1')),
    item('7 puldan 3 tanesini aldım. Geriye sayarak söyle.', dsChips(7, 'red', 7), wbox()),
    item('Geriye sayarken 6’dan sonra hangi sayı gelir?', '', wbox()),
  ]
  if (i === 9) return [ // HERHANGİ BİR SAYIDAN + KOMŞULUK
    item("4'ten başlayarak say — 1'den değil. Nereye kadar?", '', hint('4-5-6-7…')),
    item('Bu sayının hemen ÖNCESİ ve hemen SONRASI ne?', dsNumberLine(10, { at: [6] }), eqRow(`${wbox()} · 6 · ${wbox()}`)),
    item('Yetişkin bir sayı söylesin; sen ondan devam et.', '', hint('baştan başlamadan')),
  ]
  if (i === 10) return [ // ONAR RİTMİK — onluk grupları görme
    item('Pulları onar onar grupla, sonra onar say.', dsFrame(2, 5, 10), hint('10-20-30…')),
    item('Onluk çubuklar var. Tek tek değil, ONAR say.', dsBaseten(4, 0), wboxBig()),
    item("Onar sayarak 100'e git. Kaç adımda vardın?", '', wbox()),
  ]
  if (i === 11) return [ // ONLUK GEÇİŞİ — 29 → 30 kırılması
    item('29’dan sonra ne gelir? Yaz, sonra sesli say.', '', wbox()),
    item('Zor geçişleri işaretle: 39 → __ , 59 → __ , 79 → __', '', hint('40 · 60 · 80')),
    item('Boş kutuları doldur.', dsNumberLine(100, { missing: [30, 70] }), hint('30 ve 70')),
  ]
  if (i === 12) return [ // İZ TUTMA — üzerine sayarken vuruş/parmak
    item('6 var. Üzerine 3 SAY. Her sayıda parmak kaldır.', dsRod(6, { fill: 6 }), eqRow(`6 → yedi, sekiz, dokuz = ${wboxBig()}`)),
    item('Vuruş yap: masaya 3 kez vur, sayarak takip et.', '', hint('kaç vuruş yaptığını bil')),
    item('8’in üzerine 2 saydın. Nerede durman gerekirdi?', '', wbox()),
  ]
  if (i === 13) return [ // RİTMİK — beşer / ikişer
    item("Beşlik çerçeveleri beşer say: 5-10-15…", dsFrame(2, 5, 10), hint('5, 10')),
    item('Pulları İKİŞER grupla ve ikişer say.', dsChips(8, 'green', 2), wboxBig()),
    item('İkişer saymak birer saymaktan neden hızlıdır?', '', hint('her adımda iki atlıyorsun')),
  ]
  if (i === 14) return [ // SAYISAL İZ — kaç ADIM attığını da say (çift sayma)
    item('7’den ileri say ve KAÇ ADIM attığını da say.', dsNumberLine(20, { jump: { from: 7, to: 12 } }), eqRow(`${wbox()} adım`)),
    item('12’den geri saydım, 9’da durdum. Kaç adım?', '', wbox()),
    item('Sayarken hem sayıyı hem adımı tutmak zor mu? Dene.', '', hint('parmakla adımları tut')),
  ]
  if (i === 15) return [ // BASAMAK DEĞERİ — onluk bozma/kurma
    item('Bu sayıda kaç onluk, kaç birlik var?', dsBaseten(3, 5), eqRow(`${wbox()} onluk ${wbox()} birlik = ${wboxBig()}`)),
    item('Bir onluğu BOZ: 4 onluk 2 birlik → kaç onluk kaç birlik?', dsBaseten(4, 2), hint('3 onluk 12 birlik')),
    item('47’yi yalnız birliklerle kurmak kaç blok ister?', '', wbox()),
  ]
  if (i === 16) return [ // 100 ÖTESİ — birlik/onluk/yüzlük örüntüsü
    item('98, 99, __ , __ — sonrasını yaz.', '', hint('100 · 101')),
    item('109’dan sonra ne gelir? Örüntüyü kullan.', '', wbox()),
    item('120’yi kur: kaç yüzlük, kaç onluk?', dsBaseten(2, 0), eqRow(`1 yüzlük ${wbox()} onluk`)),
  ]
  if (i === 17) return [ // KORUNUM — aralık açılınca sayı değişmez
    item('Aynı 6 pul: sıkışık ve yayılmış. Hangisi çok?', dsChipsTwo(6, 6), hint('ikisi de 6')),
    item('Pulları yaydım. Yeniden saymadan söyle: kaç?', dsChips(7, 'red', 7), wbox()),
    item('Yer kaplamak sayıyı değiştirir mi? Neden?', '', hint('nesne eklenmedi, sayı aynı')),
  ]
  return [ // İLERİ-GERİ AKICILIK — iki yön + onluk dizisi birlik dizisini yansıtır
    item('23’ten ileri, sonra AYNI yerden geri say — duraksama yok.', dsNumberLine(30, { at: [23] }), hint('iki yön de akıcı')),
    item("Birlik dizisi: 1-2-3… Onluk dizisi: 10-20-30… Benziyor mu?", '', hint('aynı sıra, on katı')),
    item('Yetişkin sayı ve yön söylesin; 10 sayı say.', '', hint('süre tut')),
  ]
}

DS_EG.count = (i) => {
  if (i === 0) return item('"Bir" dedim ve tek pula dokundum.', dsChips(1, 'blue', 1), shown('bir'))
  if (i === 1) return item('Ezbere söyledim: bir, iki, üç, dört, beş.', dsRod(5), shown('1-2-3-4-5'))
  if (i === 2) return item('Kayıp sayıyı buldum: 1, 2, 3, 4, 5.', dsNumberLine(10, { missing: [4] }), shown('4'))
  if (i === 3) return item('Her deliğe bir pul: atlamadım, iki kez saymadım.', dsRod(6, { fill: 6 }), shown('6'))
  if (i === 4) return item('Kapattım ve yeniden saymadım: hepsi 4.', dsRod(4, { fill: 4 }), shown('hepsi 4'))
  if (i === 5) return item('8 delik dolu; rakamla yazdım.', dsRod(8, { fill: 8 }), shown('8'))
  if (i === 6) return item('"4 ver" dedi; sayarak ayırdım, dörtte durdum.', dsChips(4, 'yellow', 4), shown('tam 4'))
  if (i === 7) return item('Dizilişi değiştirdim, yine 8 — sayı dizilime bağlı değil.', dsChips(8, 'blue', 4), shown('yine 8'))
  if (i === 8) return item("10'dan geriye saydım, her sayıda bir pul aldım.", dsRod(10, { fill: 10 }), shown('10-9-8-…-1'))
  if (i === 9) return item("6'nın öncesi 5, sonrası 7 — baştan saymadım.", dsNumberLine(10, { at: [6] }), shown('5 · 6 · 7'))
  if (i === 10) return item('Tek tek değil onar saydım: 10-20-30-40.', dsBaseten(4, 0), shown('40'))
  if (i === 11) return item("29'dan sonra 30 — onluk değişti.", '', shown('29 → 30'))
  if (i === 12) return item('6 vardı; yedi-sekiz-dokuz dedim, 3 parmak kaldırdım.', dsRod(6, { fill: 6 }), shown('9'))
  if (i === 13) return item('İkişer saydım: 2-4-6-8. Birer saymaktan hızlı.', dsChips(8, 'green', 2), shown('8'))
  if (i === 14) return item("7'den 12'ye gittim; 5 adım attığımı da saydım.", dsNumberLine(20, { jump: { from: 7, to: 12 } }), shown('5 adım'))
  if (i === 15) return item('3 onluk 5 birlik = 35. Bir onluğu bozarsam 2 onluk 15 birlik.', dsBaseten(3, 5), shown('35'))
  if (i === 16) return item('99’dan sonra 100, sonra 101 — örüntü sürüyor.', '', shown('100 · 101'))
  if (i === 17) return item('Pulları yaydım ama eklemedim: yine 6.', dsChipsTwo(6, 6), shown('ikisi de 6'))
  return item('23’ten ileri de geri de duraksamadan saydım.', dsNumberLine(30, { at: [23] }), shown('iki yönde akıcı'))
}

// ────────────────────────────────────────────────────────────────────────
// comp — KARŞILAŞTIRMA ve SIRALAMA · 23 düzey
// Ayrım ekseni her düzeyde BAŞKA: değişim duyarlılığı → sezgisel eşleme →
// algısal (2 kat) kıyas → birinci/ikinci → sanbil ile kıyas → FARKLI tür
// eşleme → artakalan çıkarımı → sayarak kıyas → yer kaplama tahmini → algısal
// çeldiriciye direnç → sayı doğrusu (5) → sıralama (5) → sıra sayıları →
// FARK ("kaç fazla") → yakınlık → sıralama (6+ ve uzunluk) → tahmin
// kategorileri → basamak değeriyle kıyas → sayı doğrusu (100) → göz atma →
// sayı doğrusu (1000) → bölüm sayıp dayanak → öbekleyip birleştirme.
// ────────────────────────────────────────────────────────────────────────
DS_EX.comp = (i) => {
  if (i === 0) return [ // DEĞİŞİM DUYARLILIĞI — "bir mi, çok mu"
    item('Hangisinde TEK pul var? Onu göster.', dsChipsTwo(1, 4), hint('tek olan')),
    item('Bir pul ekledim. Bir şey değişti mi? Göster.', dsChips(2, 'red', 2), hint('çoğaldı')),
    item('Az mı çok mu? Elinle "çok" olanı göster.', '', hint('sayı yok, sezgi yeter')),
  ]
  if (i === 1) return [ // SEZGİSEL ÖĞE-ÖĞE EŞLEME — "aynı sayıda mı"
    item('Her mavi pulun karşısına bir kırmızı koy. Denk mi?', dsChipsTwo(3, 3), hint('denk')),
    item('Bu iki grup aynı sayıda mı? Eşleyerek bak.', dsChipsTwo(2, 3), hint('değil')),
    item('Her çocuğa bir bardak: yeter mi? Eşleyerek dene.', '', hint('artan varsa yetmez')),
  ]
  if (i === 2) return [ // ALGISAL KIYAS — biri ötekinin en az 2 katı, saymadan
    item('Saymadan bak: hangisinde çok daha fazla pul var?', dsChipsTwo(2, 6), hint('kırmızı')),
    item('Bu iki çubuk: hangisi belirgin şekilde uzun?', dsRodPair(2, 8), hint('alttaki')),
    item('İki avuç pul. Saymadan hangisi çok? Neden emin oldun?', '', hint('fark çok belirgin')),
  ]
  if (i === 3) return [ // SIRA — dizideki "birinci" ve "ikinci"
    item('Sıradaki BİRİNCİ pulu boya.', dsChips(5, 'blue', 5), hint('baştaki')),
    item('İKİNCİ pul hangisi? Üstüne parmağını koy.', dsChips(5, 'green', 5), hint('baştan ikinci')),
    item('Sıraya gir: sen kaçıncısın? Birinci mi, ikinci mi?', '', hint('sıra sözcüğü')),
  ]
  if (i === 4) return [ // SANBİL KIYASI — 1-4 ÖZDEŞ nesne, saymadan
    item('Bir bakışta: hangi kartta çok pul var? Sayma.', dsChipsTwo(3, 4), hint('kırmızı')),
    item('Kaç puldu her grup? Bakışla söyle.', dsChipsTwo(2, 4), eqRow(`${wbox()} ve ${wbox()}`)),
    item('Nesneler aynı türden. Sayınca fikrin değişti mi?', '', hint('değişmemeli')),
  ]
  if (i === 5) return [ // FARKLI TÜR — eşleme, benzerlik yardımı yok
    item('Pullar ve delikler farklı şeyler. Sayıca denk mi?', dsRod(4, { fill: 4 }), hint('her deliğe bir pul → denk')),
    item('3 pul ve 3 kalem. Tür farklı, sayı aynı mı?', dsChips(3, 'yellow', 3), hint('aynı')),
    item('Farklı nesneleri karşılaştırırken neye bakarsın?', '', hint('göze değil, eşlemeye')),
  ]
  if (i === 6) return [ // BİREBİR EŞLEME + ARTAKALAN ÇIKARIMI (1-6)
    item('Eşle. Eşleşmeden ARTAN var mı? Hangisi çok?', dsChipsTwo(6, 4), hint('mavi çok, 2 artıyor')),
    item('Çubukları uç uca hizala: hangisinde fazla delik kaldı?', dsRodPair(5, 3), hint('üstteki')),
    item('Artan olması ne anlama gelir?', '', hint('o grup daha çok')),
  ]
  if (i === 7) return [ // SAYARAK KIYAS — eş boy nesneler, ≤5
    item('İki grubu SAY ve karşılaştır.', dsChipsTwo(4, 5), eqRow(`${wbox()} < ${wbox()}`)),
    item('Kaç delik dolu? Hangi çubukta çok?', dsRodPair(3, 5, { fillA: 3, fillB: 5 }), wbox()),
    item('Eşlemeden, yalnız sayarak karar ver. Sayılar ne?', '', hint('büyük sayı = çok')),
  ]
  if (i === 8) return [ // YER KAPLAMA TAHMİNİ — az/çok, sayı yok
    item('Hangi grup daha çok YER kaplıyor? Az mı çok mu?', dsChipsTwo(2, 8), hint('kırmızı çok')),
    item('Az yer kaplıyor: küçük bir sayı mı olur, büyük mü?', dsChips(3, 'blue', 3), hint('küçük — 1-4 arası')),
    item('Odaya bak: çok yer kaplayan bir küme söyle.', '', hint('tahmin, sayma değil')),
  ]
  if (i === 9) return [ // ALGISAL ÇELDİRİCİ — çok olanın nesneleri KÜÇÜK/sıkışık
    item('Kırmızılar sıkışık ama daha çok. Sayarak doğrula.', dsChipsTwo(3, 5), hint('5 çok')),
    item('Uzun görünen çubukta az pul var. Say ve karar ver.', dsRodPair(6, 4, { fillA: 2, fillB: 4 }), hint('alttaki çok dolu')),
    item('Göz yanıltırsa ne yaparsın?', '', hint('sayarım')),
  ]
  if (i === 10) return [ // ZİHİNSEL SAYI DOĞRUSU (5) — konum
    item('3 bu doğruda nereye gelir? İşaretle.', dsNumberLine(5, { missing: [3] }), hint('ortanın biraz sağı')),
    item('4, 2’den büyük ve 5’ten küçük. Doğruda göster.', dsNumberLine(5, { at: [4] }), hint('4')),
    item('Sayılar doğruda neden eşit aralıklı durur?', '', hint('her adım bir sayı')),
  ]
  if (i === 11) return [ // SIRALAMA (≤5) — üç kümeyi küçükten büyüğe
    item('Üç çubuğu küçükten büyüğe sırala: 4 · 2 · 3', dsRod(4) + dsRod(2) + dsRod(3), hint('2 · 3 · 4')),
    item('Kartları sırala. Hangisi en küçük?', dsChipsTwo(1, 3), wbox()),
    item('3, 5, 1, 4 rakamlarını küçükten büyüğe yaz.', '', hint('1 · 3 · 4 · 5')),
  ]
  if (i === 12) return [ // SIRA SAYILARI — 1.–10.
    item('Soldan BEŞİNCİ pulu boya.', dsChips(8, 'green', 8), hint('beşinci')),
    item('Sıradaki SON pul kaçıncı? Say ve sıra sayısıyla yaz.', dsChips(7, 'red', 7), wbox()),
    item("\"Yedinci\" ile \"yedi\" arasında ne fark var?", '', hint('biri sıra, öteki miktar')),
  ]
  if (i === 13) return [ // FARK — "kaç fazla / kaç eksik" (10'a kadar)
    item('Hangisi kaç FAZLA? Eşleyip artanı say.', dsChipsTwo(7, 4), eqRow(`${wbox()} fazla`)),
    item('Bu çubukta kaç delik eksik kaldı?', dsRodPair(9, 6), eqRow(`9 - 6 = ${wbox()}`)),
    item('"Çok" demek yetmez; kaç fazla olduğunu söyle.', '', hint('farkı sayıyla ver')),
  ]
  if (i === 14) return [ // YAKINLIK — hangisi X'e daha yakın (10'a kadar)
    item('Hangisi 6’ya daha yakın: 4 mü 8 mi?', dsNumberLine(10, { at: [4, 6, 8] }), hint('ikisi de 2 uzak')),
    item('7 hangisine daha yakın: 5’e mi 10’a mı?', dsNumberLine(10, { at: [7] }), wbox()),
    item('Yakınlığa karar verirken kafanda neyi görüyorsun?', '', hint('sayı doğrusu')),
  ]
  if (i === 15) return [ // SIRALAMA 6+ ve BİRİMLİ UZUNLUK
    item('Nesnenin uzunluğu kaç birim? Say ve yaz.', dsMeasureOnRuler(6, 8), eqRow(`${wbox()} birim`)),
    item('Dört kümeyi büyükten küçüğe diz: 8 · 6 · 9 · 7', '', hint('9 · 8 · 7 · 6')),
    item('Uzunluk sıralaması sayı sıralamasına benzer mi?', '', hint('birim sayısı sıralar')),
  ]
  if (i === 16) return [ // TAHMİN KATEGORİLERİ — küçük / orta / büyük
    item('Bu küme küçük mü (1-4), orta mı (10-20), büyük mü?', dsChips(14, 'blue', 7), hint('orta')),
    item('Aynı sayı dağınık dizildi. Kategorin değişti mi?', dsChips(14, 'red', 5), hint('değişmemeli')),
    item('"Orta" dediğin bir çokluk örneği ver.', '', hint('10-20 arası')),
  ]
  if (i === 17) return [ // BASAMAK DEĞERİYLE KIYAS — 63 > 59
    item('Hangisi büyük? Önce ONLUKLARA bak.', dsBaseten(6, 3), hint('6 onluk > 5 onluk')),
    item('59 mu 63 mü büyük? Gerekçeni yaz.', dsBaseten(5, 9), hint('onluk sayısı belirler')),
    item('Birlikler büyük olsa da onluk azsa ne olur?', '', hint('sayı yine küçüktür')),
  ]
  if (i === 18) return [ // ZİHİNSEL SAYI DOĞRUSU (100) — onluk içinde birlik
    item('47 bu doğruda yaklaşık nereye gelir?', dsNumberLine(100, { missing: [45] }), hint('ortanın biraz altı')),
    item('Hangisi 50’ye daha yakın: 38 mi 62 mi?', dsNumberLine(100, { at: [38, 50, 62] }), wbox()),
    item('47’yi bulurken önce hangi onluğa gidersin?', '', hint('önce 40, sonra 7')),
  ]
  if (i === 19) return [ // GÖZ ATARAK TAHMİN — tara, sonra doğruya bağla
    item('Gruba 3 saniye göz at. Kaç? Tahminini yaz.', dsChips(23, 'green', 8), wbox()),
    item('Şimdi say. Tahminin ne kadar yakındı?', '', eqRow(`tahmin ${wbox()} · gerçek ${wbox()}`)),
    item('Tahminin "küçük-orta-büyük"ten hangisine düştü?', '', hint('doğruya yerleştir')),
  ]
  if (i === 20) return [ // ZİHİNSEL SAYI DOĞRUSU (1000)
    item('380 bu doğruda yaklaşık nereye gelir?', dsNumberLine(1000, { missing: [400] }), hint('350 ile 400 arası, 400’e yakın')),
    item('Hangisi 500’e daha yakın: 420 mi 610 mu?', dsNumberLine(1000, { at: [420, 500, 610] }), wbox()),
    item('750’yi bulmak için hangi yüzlükler arasına bakarsın?', '', hint('700 ile 800')),
  ]
  if (i === 21) return [ // BÖLÜMÜ SAYIP DAYANAK — benchmark tahmini
    item('Yalnız bir sırayı say, sonra tüm kümeyi tahmin et.', dsFrame(3, 5, 15), eqRow(`1 sıra ${wbox()} → tahmin ${wboxBig()}`)),
    item('10 pulu avucuna al, bak. Kavanoz kaç avuç eder?', '', hint('10 bir dayanak')),
    item('Dayanak kullanmak tahmini neden iyileştirir?', '', hint('ölçüsü olan bir birim verir')),
  ]
  return [ // ÖBEKLERE AYIRIP BİRLEŞTİRME — alt kümeleri topla
    item('Yetişkin masaya 26 pul koysun. Onarlı öbeklere ayır, öbekleri topla.', '', eqRow(`10 + 10 + ${wbox()} = ${wboxBig()}`)),
    item('Dağınık pulları 5’erli öbeklere it, sonra beşer say.', dsChips(18, 'yellow', 6), wbox()),
    item('Neden tek tek saymak yerine öbekliyoruz?', '', hint('daha hızlı ve daha az hata')),
  ]
}

DS_EG.comp = (i) => {
  if (i === 0) return item('Birinde tek pul, ötekinde çok — farkı gördüm.', dsChipsTwo(1, 4), shown('çok olan: kırmızı'))
  if (i === 1) return item('Her maviye bir kırmızı denk geldi: aynı sayıda.', dsChipsTwo(3, 3), shown('denk'))
  if (i === 2) return item('Saymadım; kırmızı çok daha fazlaydı.', dsChipsTwo(2, 6), shown('kırmızı çok'))
  if (i === 3) return item('Baştaki birinci, ondan sonraki ikinci.', dsChips(5, 'blue', 5), shown('1. ve 2.'))
  if (i === 4) return item('Bir bakışta gördüm: 3 ve 4 — çok olan 4.', dsChipsTwo(3, 4), shown('4 > 3'))
  if (i === 5) return item('Pul ve delik farklı şeyler ama eşleşti: denk.', dsRod(4, { fill: 4 }), shown('4 = 4'))
  if (i === 6) return item('Eşledim; mavide 2 pul arttı, demek mavi çok.', dsChipsTwo(6, 4), shown('mavi 2 fazla'))
  if (i === 7) return item('Saydım: 4 ve 5. Sayı büyük olan çok.', dsChipsTwo(4, 5), shown('4 < 5'))
  if (i === 8) return item('Çok yer kaplıyordu; "büyük sayı" dedim.', dsChipsTwo(2, 8), shown('az · çok'))
  if (i === 9) return item('Kırmızılar sıkışıktı ama saydım: 5 > 3.', dsChipsTwo(3, 5), shown('5 > 3'))
  if (i === 10) return item('3’ü ortanın biraz sağına koydum.', dsNumberLine(5, { at: [3] }), shown('3 burada'))
  if (i === 11) return item('Küçükten büyüğe dizdim: 2 · 4 · 5.', dsRod(2) + dsRod(4) + dsRod(5), shown('2 · 4 · 5'))
  if (i === 12) return item('Soldan tek tek saydım: en sondaki pul sekizinci sırada.', dsChips(8, 'green', 8), shown('8.'))
  if (i === 13) return item('Eşledim, 3 pul arttı: 7, 4’ten 3 fazla.', dsChipsTwo(7, 4), shown('3 fazla'))
  if (i === 14) return item('4 de 8 de 6’ya 2 uzak — eşit yakın.', dsNumberLine(10, { at: [4, 6, 8] }), shown('eşit yakın'))
  if (i === 15) return item('Birimleri saydım: nesne 4 birim uzunluğunda.', dsMeasureOnRuler(4, 8), shown('4 birim'))
  if (i === 16) return item('Ne küçük ne büyük — 14 için "orta" dedim.', dsChips(14, 'blue', 7), shown('orta (10-20)'))
  if (i === 17) return item('6 onluk 5 onluktan fazla: 63 > 59.', dsBaseten(6, 3), shown('63 > 59'))
  if (i === 18) return item('Önce 40 onluğuna gittim, 7 ileri: 47.', dsNumberLine(100, { at: [45] }), shown('47 ≈ burada'))
  if (i === 19) return item('Göz attım "yirmi kadar" dedim; saydım 23 çıktı.', dsChips(23, 'green', 8), shown('tahmin 20 · gerçek 23'))
  if (i === 20) return item('380’i 300 ile 400 arasına, 400’e yakın koydum.', dsNumberLine(1000, { at: [400] }), shown('380 ≈ burada'))
  if (i === 21) return item('Bir sırayı saydım: 5. Üç sıra var → yaklaşık 15.', dsFrame(3, 5, 15), shown('5 × 3 ≈ 15'))
  return item('Onarlı öbekledim: 10 + 10 + 3 → 23.', dsFrame(2, 5, 10) + dsFrame(2, 5, 10) + dsChips(3, 'blue', 3), shown('10 + 10 + 3 = 23'))
}

// ── ajan B ──────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────
// add — TOPLAMA/ÇIKARMA · 12 düzey
// Ayrım ekseni: nicelik-öncesi sezgi → örtülene tepki → sözel küçük olgu →
// hepsini-say → 10'a tamamla → bilinmeyen değişim → üzerine/geri say →
// 10 köprüsü → gömülü olgu → türetme → çok adımlı problem → basamak/elde.
// ────────────────────────────────────────────────────────────────────────
DS_EX.add = (i) => {
  if (i === 0) return [ // NİCELİK YOK — yalnız "arttı mı, azaldı mı"
    item('Çubuğa pul EKLEDİM. Çokluk arttı mı, azaldı mı?', dsRod(4, { fill: 3 }), hint('arttı / azaldı')),
    item('Şimdi avucumdan pul ALDIM. Ne oldu?', '', hint('azaldı — daha az')),
    item('Hiç dokunmadım. Değişti mi?', dsChips(3, 'blue', 3), hint('değişmedi')),
  ]
  if (i === 1) return [ // ÖRTME — sayı yok, "bir tane daha vardı" tepkisi
    item('2 pul vardı, elimle birini örttüm. Örtülen duruyor mu?', dsChipsTwo(1, 1), hint('duruyor — kayboldu sanma')),
    item('Örtüyü kaldırdım, 1 pul göründü. Şaşırdın mı?', dsChips(1, 'blue', 3), hint('bir tane daha aranmalı')),
    item('1 pul koydum, 1 pul daha koydum. Elini masaya koy, göster.', '', hint('iki ayrı pul')),
  ]
  if (i === 2) return [ // KÜÇÜK SAYILAR — nesneler GÖRÜNÜR; tümünü baştan say (toplam ≤ 5)
    item('Masada 2 pul var; 1 pul daha koydum. HEPSİNİ baştan say: kaç?', dsChipsTwo(2, 1), eqRow(`2 + 1 = ${wboxBig()}`)),
    item('3 pul vardı, 1 tanesini aldım. Kalanları say: kaç kaldı?', dsChips(3, 'blue', 3), eqRow(`3 − 1 = ${wboxBig()}`)),
    item('Çubukta 2 dolu; 2 pul daha tak, tümünü baştan say.', dsRod(4, { fill: 2 }), eqRow(`2 + 2 = ${wboxBig()}`)),
  ]
  if (i === 3) return [ // HEPSİNİ SAY — iki çubuk uç uca, baştan sayarak
    item('İki çubuğu UÇ UCA koy, delikleri baştan say.', dsRodPair(3, 2, { fillA: 3, fillB: 2 }), eqRow(`3 + 2 = ${wboxBig()}`)),
    item('Mavileri say, kırmızıları say, sonra HEPSİNİ baştan say.', dsChipsTwo(4, 2), eqRow(`4 + 2 = ${wboxBig()}`)),
    item('4 ve 3 için hangi iki çubuğu seçersin? Uç uca koy.', '', hint('4 çubuğu + 3 çubuğu → 7')),
  ]
  if (i === 4) return [ // İSTENEN SAYIYA TAMAMLA — pul ekle; kaç eklediğini söylemek yok
    item("Çubukta 4 dolu. Çubuğu 6 YAP: boş deliklere pul çiz.", dsRod(6, { fill: 4 }), hint('6 olunca dur — kaç eklediğini söylemen gerekmez')),
    item("Çerçevede 7 dolu. Çerçeveyi 10 YAP: boşlara pul çiz.", dsFrame(2, 5, 7), hint("doluları 1'den sayma — üstüne pul ekle")),
    item("Masada 3 pul var; 5 YAP. Bitince yalnız 'oldu' de.", '', hint('ekle ve dur — sayı söylemek yok')),
  ]
  if (i === 5) return [ // BİLİNMEYEN DEĞİŞİM — ortadaki eksik
    item('5 pulum vardı, ekledim, 8 oldu. Kaç ekledim?', dsFrame(2, 5, 5), eqRow(`5 + ${wbox()} = 8`)),
    item('9 pulum vardı, verdim, 6 kaldı. Kaç verdim?', '', eqRow(`9 − ${wbox()} = 6`)),
    item('Çubukta 3 dolu, hedef 7. Aradaki farkı pulla doldur.', dsRod(7, { fill: 3 }), eqRow(`3 + ${wbox()} = 7`)),
  ]
  if (i === 6) return [ // ÜZERİNE SAY / GERİ SAY — baştan sayma YASAK
    item('Baştan SAYMA. "Beeeş" de, üstüne devam et.', dsNumberLine(10, { jump: { from: 5, to: 8 } }), eqRow(`5 + 3 = ${wboxBig()}`)),
    item('Büyük olanı önce söyle, küçüğü üstüne say.', '', eqRow(`2 + 6 = ${wboxBig()}`)),
    item("9'dan GERİ say: sekiz, yedi… nerede durursun?", '', eqRow(`9 − 3 = ${wboxBig()}`)),
  ]
  if (i === 7) return [ // PARÇA-BÜTÜN BAŞLANGICI — ezber çift, esnek yol, deneme-yanılma
    item('Saymadan söyle: 5 + 5 kaç? Ezbere biliyor musun?', dsFrame(2, 5, 10), eqRow(`5 + 5 = ${wboxBig()}`)),
    // Görselsiz: dsChipsTwo(7,2) 322px → exWide eşiğini (250) aşıp maddeyi tam
    // genişliğe düşürüyor, sayfa +87px taşıyordu. Strateji-seçme işi zaten görsel istemez.
    item('7 + 2 için yolunu SEN seç: say, parçala ya da ezberden söyle.', '', eqRow(`7 + 2 = ${wboxBig()}`)),
    item('Başta kaç vardı? Bir sayı SEÇ, 3 ekle, DENE: 8 etti mi?', '', eqRow(`${wbox()} + 3 = 8`)),
  ]
  if (i === 8) return [ // GÖMÜLÜ OLGU — büyük işlemin içindeki tanıdık küçük olgu
    item("6 + 8 içinde saklı ikizi bul: 6 + 6 kaçtı?", dsChipsTwo(6, 8), eqRow(`6 + 6 = ${wbox()} · 6 + 8 = ${wboxBig()}`)),
    item("8'in içinde hangi iki tanıdık parça var?", dsFrame(2, 5, 8), eqRow(`8 = 5 + ${wbox()}`)),
    item("7 + 6'nın içinde hangi olguyu görüyorsun? Yaz.", '', hint('6+6 ikizi · ya da 5+5')),
  ]
  if (i === 9) return [ // TÜRETME + 10'A TAMAMLAYIP BOZMA — bilinen çıpadan
    item('6 + 6 = 12 biliyorsun. Öyleyse 6 + 7 kaç?', '', eqRow(`6 + 7 = ${wboxBig()}`)),
    item("7 + 5: önce 10'a tamamla, sonra kalanı ekle.", dsFrame(2, 5, 7), eqRow(`7 + 3 + ${wbox()} = ${wboxBig()}`)),
    item("Bir fazla mı, bir eksik mi oldu? Çubukta göster.", dsRodPair(6, 7), hint('bir delik fazla → bir fazla')),
  ]
  if (i === 10) return [ // ÇOK ADIMLI PROBLEM — işlemin yönüne çocuk karar verir
    item('12 bilyem vardı, 5 verdim, 4 buldum. Kaç oldu?', '', eqRow(`${wbox()} → ${wbox()} → ${wboxBig()}`)),
    item('Bu problemde toplama mı, çıkarma mı var? İkisi de mi?', '', hint('önce çıkarma, sonra toplama')),
    item('Kendi problemini yaz: cevabı 7 olsun.', '', hint('iki adımlı olsun')),
  ]
  return [ // BASAMAK — elde tut / onluk boz
    item('47 + 38: önce birlikleri topla. Onluğa elde var mı?', dsBaseten(4, 7), eqRow(`47 + 38 = ${wboxBig()}`)),
    item('52 − 27: birlikler yetmiyor. Bir onluğu BOZ.', dsBaseten(5, 2), eqRow(`52 − 27 = ${wboxBig()}`)),
    item('Eldeyi unutursan sonuç ne kadar eksik çıkar?', '', hint('tam 10 eksik çıkar')),
  ]
}

DS_EG.add = (i) => {
  if (i === 0) return item('Pul ekledim: arttı. Saymadım, gördüm.', dsRod(4, { fill: 3 }), shown('arttı'))
  if (i === 1) return item('Örttüm ama pul duruyordu — kaybolmadı.', dsChipsTwo(1, 1), shown('hâlâ orada'))
  if (i === 2) return item('Pulları gördüm, hepsini baştan saydım: bir-iki-üç. 2 ve 1 → 3.', dsChipsTwo(2, 1), shown('2 + 1 = 3'))
  if (i === 3) return item('Çubukları uç uca koydum, baştan saydım: 5.', dsRodPair(3, 2, { fillA: 3, fillB: 2 }), shown('3 + 2 = 5'))
  if (i === 4) return item("4'ü 6 yaptım: boş deliklere pul ekledim, kaç eklediğimi söylemedim.", dsRod(6, { fill: 4 }), shown("4'ü 6 yaptım"))
  if (i === 5) return item("5 vardı, 8 oldu; aradaki değişimi buldum: 3.", dsFrame(2, 5, 5), shown('5 + 3 = 8'))
  if (i === 6) return item('Baştan saymadım: "beeeş" dedim, altı-yedi-sekiz.', dsNumberLine(10, { jump: { from: 5, to: 8 } }), shown('5 + 3 = 8'))
  if (i === 7) return item("5 + 5'i saymadan söyledim — ezbere biliyorum: 10.", dsFrame(2, 5, 10), shown('5 + 5 = 10'))
  if (i === 8) return item("6+8'in içinde 6+6=12 saklıydı, 2 fazla → 14.", dsChipsTwo(6, 8), shown('6 + 8 = 14'))
  if (i === 9) return item('6+6=12 biliyordum, 6+7 bir fazla → 13.', '', shown('6 + 7 = 13'))
  if (i === 10) return item('Önce 12−5=7, sonra 7+4=11. İki adım.', '', shown('11'))
  return item('7 ve 8 on beş: 5 yazdım, 1 elde; 4+3+1 → 85.', dsBaseten(4, 7), shown('47 + 38 = 85'))
}

// ────────────────────────────────────────────────────────────────────────
// compose — OLUŞTURMA/AYRIŞTIRMA · 11 düzey
// Ayrım ekseni: dök-topla eylemi → iki parçayı birleştir → örtüleni koru →
// tüm ayrımları üret → eksik parçayı 5 çıpasıyla söyle → 10 dostları →
// onluğu çıpa yap → sembolde onluk → komşu türetme → problem → onluğu boz.
// ────────────────────────────────────────────────────────────────────────
DS_EX.compose = (i) => {
  if (i === 0) return [ // EYLEM — sayı yok: ayır ve topla
    item('Pulları iki kümeye AYIR, sonra hepsini geri topla.', dsChips(6, 'blue', 6), hint('ayırdım · topladım')),
    item('Çubuktan pulları boşalt, sonra hepsini geri tak.', dsRod(5, { fill: 5 }), hint('boşalttım · doldurdum')),
    item('İki avucunu birleştir. Tek küme mi oldu?', '', hint('tek küme oldu')),
  ]
  if (i === 1) return [ // BİRLEŞTİRME — iki parça tek bütün
    item('Bir elde 2, öbüründe 1. Birleştir: tek küme kaç?', dsChipsTwo(2, 1), wboxBig()),
    item('Mavi ile yeşili aynı çubuğa tak. Hepsi kaç?', dsRod(5, { fill: 3 }), wboxBig()),
    item('İki küçük kümeni birleştir, tek sayıyla söyle.', '', hint('tek sayı söyle')),
  ]
  if (i === 2) return [ // ÖRT VE SOR — görünmeyen parça bütüne aittir
    item('4 pul vardı, 2 tanesini örttüm. Hepsi kaç?', dsChipsTwo(2, 2), hint('yine 4 — örtülen de var')),
    item('Örtünün altında kaç pul kaldı?', dsFrame(1, 5, 5), eqRow(`5 var · ${wbox()} görünüyor · ${wbox()} örtülü`)),
    item('Elini kaldırmadan söyle: örtülenler yok mu oldu?', '', hint('yok olmadı')),
  ]
  if (i === 3) return [ // TÜM AYRIMLAR — aynı bütün, kaç türlü
    item("4'ü iki kutuya kaç FARKLI şekilde ayırırsın?", dsFrame(1, 5, 4), hint('3-1 · 2-2 · 1-3')),
    item('Parçalar değişti. Bütün yine 4 mü?', dsChipsTwo(1, 3), hint('yine 4')),
    item("5 için tüm ayrımları yaz.", '', eqRow(`4-1 · ${wbox()}-${wbox()} · ${wbox()}-${wbox()} · ${wbox()}-${wbox()}`)),
  ]
  if (i === 4) return [ // EKSİK PARÇA — 5 çıpasıyla, SAYMADAN
    item('7 pulun 3 tanesi burada. Öteki kutuda kaç? Sayma.', dsChipsTwo(3, 4), wboxBig()),
    item("6'yı beşlik yapıyla gör: 5 ve kaç?", dsFrame(2, 5, 6), eqRow(`6 = 5 + ${wbox()}`)),
    item("7 = 5 + ? diyebiliyor musun? Saymadan söyle.", '', eqRow(`7 = 5 + ${wbox()}`)),
  ]
  if (i === 5) return [ // 10 DOSTLARI — akıcı ve TAM liste
    item("10'un tüm dost ikililerini sırayla yaz.", dsFrame(2, 5, 0), hint('9-1 · 8-2 · 7-3 · 6-4 · 5-5')),
    item('7 varsa dostu kim? Bir bakışta söyle.', dsFrame(2, 5, 7), eqRow(`7 ve ${wbox()}`)),
    item('Sana 4 diyorum, sen ne dersin?', '', hint('altı — dostunu hemen söyle')),
  ]
  if (i === 6) return [ // ONLUK ÇIPASI — 14 = 10 ve 4
    item('Bir çerçeve TAM dolu, ötekinde 4. Toplam kaç?', dsFrame(2, 5, 10) + dsFrame(2, 5, 4), eqRow(`10 ve 4 → ${wboxBig()}`)),
    item("18'i ikiye ayır: biri tam onluk olsun.", dsBaseten(1, 8), eqRow(`18 = 10 + ${wbox()}`)),
    item('12 ve 15 için onluğu çıpa al, kalanı söyle.', '', hint('10 ve 2 · 10 ve 5')),
  ]
  if (i === 7) return [ // SEMBOL + ÇİFTLER — yazılı 17'deki 1 bir ONLUK'tur; çiftler 18'e dek
    item('"17" yazıyor. Buradaki 1 kaç tane demek?', dsBaseten(1, 7), hint('bir ONLUK — bir tane değil')),
    item('Bu bloklarla hangi sayı yazılır?', dsBaseten(2, 3), wboxBig()),
    item('Çiftleri biliyorsun: 8 + 8 = 16. Yakın çift 8 + 9 kaç?', '', eqRow(`8 + 9 = ${wboxBig()}`)),
  ]
  if (i === 8) return [ // KOMŞU TÜRETME — bilinen bileşimden
    item('6 + 4 = 10 biliyorsun. 6 + 5 kaç? Sayma.', '', eqRow(`6 + 5 = ${wboxBig()}`)),
    item('8 + 2 = 10 ise 8 + 3 kaç? Neyi çıpa aldın?', dsFrame(2, 5, 8), eqRow(`8 + 3 = ${wboxBig()}`)),
    item('Hangi bileşimi çıpa olarak kullandın? Anlat.', '', hint("10 dostunu çıpa aldım")),
  ]
  if (i === 9) return [ // PROBLEM — çok adım, strateji seçimi
    item('Kutuda 8 vardı, 5 ekledim, 4 verdim. Şimdi kaç?', '', eqRow(`${wbox()} → ${wbox()} → ${wboxBig()}`)),
    item("Önce 10'a mı tamamladın, yoksa geri mi saydın?", '', hint('kolayına geleni seç')),
    item('İki kutuda toplam 13 var, birinde 8. Ötekinde?', dsFrame(2, 5, 8), eqRow(`8 + ${wbox()} = 13`)),
  ]
  return [ // ONLUĞU BOZ — aynı sayı, iki farklı kuruluş
    item('23 kur: kaç onluk, kaç birlik?', dsBaseten(2, 3), eqRow(`23 = ${wbox()} onluk ${wbox()} birlik`)),
    item('Bir onluğu BOZ. 23 şimdi nasıl yazılır?', dsBaseten(1, 13), eqRow(`23 = 10 + ${wboxBig()}`)),
    item('Bozunca sayı değişti mi? Neden değişmedi?', '', hint('aynı 23 — yalnız kuruluş değişti')),
  ]
}

DS_EG.compose = (i) => {
  if (i === 0) return item('Pulları ayırdım, sonra hepsini geri topladım.', dsChips(6, 'blue', 6), shown('ayır · topla'))
  if (i === 1) return item('2 ile 1 birleşti, tek küme oldu: 3.', dsChipsTwo(2, 1), shown('2 ve 1 → 3'))
  if (i === 2) return item('2 tanesini örttüm ama hepsi yine 4 — örtülen de var.', dsChipsTwo(2, 2), shown('yine 4'))
  if (i === 3) return item("4'ü üç farklı yoldan ayırdım; bütün hep 4 kaldı.", dsChipsTwo(1, 3), shown('3-1 · 2-2 · 1-3'))
  if (i === 4) return item('3 buradaysa öteki 4 — saymadım, 7 = 3 ve 4.', dsChipsTwo(3, 4), shown('7 = 3 ve 4'))
  if (i === 5) return item("7 dolu, dostu 3 — 10 dostlarını ezbere biliyorum.", dsFrame(2, 5, 7), shown('7 ve 3 → 10'))
  if (i === 6) return item('Bir çerçeve tam, ötekinde 4: on ve dört → 14.', dsFrame(2, 5, 10) + dsFrame(2, 5, 4), shown('10 + 4 = 14'))
  if (i === 7) return item('"17"deki 1, bir ONLUK demek: 1 onluk 7 birlik.', dsBaseten(1, 7), shown('17 = 1 onluk 7 birlik'))
  if (i === 8) return item('6+4=10 biliyordum; 6+5 bir fazla → 11.', '', shown('6 + 5 = 11'))
  if (i === 9) return item("8+5=13, sonra 13−4=9. Önce 10'a tamamladım.", '', shown('9'))
  return item("23'ü bozdum: 1 onluk 13 birlik — sayı yine 23.", dsBaseten(1, 13), shown('23 = 10 + 13'))
}

// ────────────────────────────────────────────────────────────────────────
// multdiv — ÇARPMA/BÖLME · 9 düzey
// Ayrım ekseni: adalet sezgisi → birer birer dağıt → eşitliği denetle →
// grupları kurup hepsini say → ters ilişki (kişi ↑ pay ↓) → ritmik sayma →
// komşu çarpımı türet → dizi/değişme → paylaştırma-gruplama ayrımı.
// ────────────────────────────────────────────────────────────────────────
DS_EX.multdiv = (i) => {
  if (i === 0) return [ // ADALET — sayı yok, "eşit mi" bakışı
    item('İki tabak. Sence adil mi? Bakarak söyle.', dsChipsTwo(2, 5), hint('adil değil')),
    item('Bu iki tabak nasıl? Saymadan bak.', dsChipsTwo(3, 3), hint('adil')),
    item('Pulları arkadaşınla paylaş. Kimse kırılmasın.', '', hint('herkese bir şey düşsün')),
  ]
  if (i === 1) return [ // BİRER BİRER DAĞIT — plan yok, sıra var
    item('6 pulu iki tabağa BİRER BİRER dağıt: bir sana, bir bana.', dsChips(6, 'blue', 6), hint('sırayla dağıt')),
    item('Dağıtırken hangi tabağa sıra geldi? Parmakla izle.', '', hint('dönüşümlü — sıra bozulmasın')),
    item('Elindeki bitince dur. Tabaklarda pul kaldı mı?', dsChipsTwo(3, 3), hint('hepsi dağıldı')),
  ]
  if (i === 2) return [ // EŞİTLİĞİ DENETLE — say ve karşılaştır
    item('8 pulu iki tepsiye dağıttım. Say: eşit mi?', dsChipsTwo(4, 4), eqRow(`${wbox()} ve ${wbox()} — eşit mi?`)),
    item('Bu dağıtım eşit mi? Kaç pul yer değiştirmeli?', dsChipsTwo(5, 3), hint('1 pul geçmeli')),
    item('Her tepsiye kaçar düştü? Tek sayıyla söyle.', '', eqRow(`her tepside ${wboxBig()}`)),
  ]
  if (i === 3) return [ // GRUPLARI KUR, HEPSİNİ SAY
    item("3 tabağa 2'şer pul koy, sonra hepsini baştan say.", dsFrame(3, 2, 6), eqRow(`3 kez 2 → ${wboxBig()}`)),
    item('Çubuklarla kur: 2 çubuk, her birinde 4 pul.', dsRodPair(4, 4, { fillA: 4, fillB: 4 }), eqRow(`2 kez 4 → ${wboxBig()}`)),
    item('Kurmadan söyleyebilir misin? Önce kur, sonra dene.', '', hint('önce somut kur')),
  ]
  if (i === 4) return [ // TERS İLİŞKİ — aynı bütün, kişi artınca pay azalır
    item('12 pul, 2 kişi. Kişi başı kaç?', dsFrame(2, 6, 12), eqRow(`12 ÷ 2 = ${wboxBig()}`)),
    item('Aynı 12 pul, şimdi 4 kişi. Pay arttı mı, azaldı mı?', dsFrame(4, 3, 12), eqRow(`12 ÷ 4 = ${wboxBig()}`)),
    item('Kişi çoğalınca paya ne olur? Kuralı yaz.', '', hint('kişi artar → pay azalır')),
  ]
  if (i === 5) return [ // RİTMİK SAYMA — grupları atlayarak
    item("4'er 4'er say: sıçramalar nerede duruyor?", dsNumberLine(20, { at: [4, 8, 12], jump: { from: 8, to: 12 } }), eqRow(`4 · 8 · ${wbox()}`)),
    item('Kaç sıçrama yaptın? Her sıçrama neyi gösteriyor?', '', hint('sıçrama sayısı = grup sayısı')),
    item("5'er 5'er sayarak 4 grubu bul.", '', eqRow(`5 · 10 · ${wbox()} · ${wboxBig()}`)),
  ]
  if (i === 6) return [ // TÜRETME — bilinen çarpımdan komşusu
    item('5 × 4 = 20 biliyorsun. 6 × 4 kaç? Baştan sayma.', '', eqRow(`6 × 4 = ${wboxBig()}`)),
    item('Kaç grup EKLEDİN? O grupta kaç vardı?', dsFrame(1, 4, 4), hint('bir grup 4 ekledim')),
    item('3 × 5 = 15 ise 4 × 5 kaç? Ne kadar arttı?', '', eqRow(`4 × 5 = ${wboxBig()}`)),
  ]
  if (i === 7) return [ // DİZİ — satır × sütun, değişme özelliği
    item('Tek tek sayma: kaç satır, her satırda kaç?', dsFrame(3, 4, 12), eqRow(`${wbox()} × ${wbox()} = ${wboxBig()}`)),
    item('Diziyi çevirdim. Toplam değişti mi?', dsFrame(4, 3, 12), eqRow(`4 × 3 = ${wboxBig()}`)),
    item('"5 kutuda 6\'şar kalem" için diziyi anlat.', '', hint('5 satır, her satırda 6')),
  ]
  return [ // İKİ BÖLME ANLAMI + tersinir aile
    item('12 pul, 3 KİŞİYE paylaştır. Herkese kaç?', dsFrame(3, 4, 12), eqRow(`12 ÷ 3 = ${wboxBig()}`)),
    item("Aynı 12 pulu 3'ERLİ grupla. Kaç GRUP oldu?", dsFrame(4, 3, 12), eqRow(`12 ÷ 3 = ${wboxBig()} grup`)),
    item('12 ÷ 3 = 4 ise 12 ÷ 4 kaç? Aileyi yaz.', '', eqRow(`3 × 4 = 12 · 12 ÷ 4 = ${wbox()}`)),
  ]
}

DS_EG.multdiv = (i) => {
  if (i === 0) return item('Baktım: bir tabakta çok, birinde az — adil değil.', dsChipsTwo(2, 5), shown('adil değil'))
  if (i === 1) return item('Birer birer dağıttım: bir sana, bir bana… bitti.', dsChipsTwo(3, 3), shown('sırayla dağıttım'))
  if (i === 2) return item('Saydım: 4 ve 4 — denetledim, eşitmiş.', dsChipsTwo(4, 4), shown('her tepside 4'))
  if (i === 3) return item("3 tabağa 2'şer koydum, hepsini baştan saydım: 6.", dsFrame(3, 2, 6), shown('3 kez 2 → 6'))
  if (i === 4) return item("12'yi önce 2, sonra 4 kişiye böldüm: pay 6'dan 3'e düştü.", dsFrame(4, 3, 12), shown('kişi ↑ · pay ↓'))
  if (i === 5) return item("Tek tek saymadım, 4'er sıçradım: 4, 8, 12 — 3 sıçrama.", dsNumberLine(20, { at: [4, 8, 12] }), shown('3 × 4 = 12'))
  if (i === 6) return item('5×4=20 biliyordum, bir grup 4 ekledim → 24.', '', shown('6 × 4 = 24'))
  if (i === 7) return item('3 satır, her satırda 4 — çevirsem de 12.', dsFrame(3, 4, 12), shown('3 × 4 = 4 × 3 = 12'))
  return item("3 kişiye paylaştırdım: 4'er. 3'erli grupladım: 4 grup.", dsFrame(3, 4, 12), shown('12 ÷ 3 = 4'))
}

// ────────────────────────────────────────────────────────────────────────
// frac — KESİRLER · 11 düzey
// Ayrım ekseni: adil-pay sezgisi → eş parçalama → yarım adlandırma →
// birim kesir okuma → pay>1 okuma → birim kesirle kurma → serbest kurma →
// tekrarlayıp bütünü aşma → eş paydalı işlem → kesrin kesri → sıralama.
// ────────────────────────────────────────────────────────────────────────
DS_EX.frac = (i) => {
  if (i === 0) return [ // SEZGİ — sayı yok, "aynı kadar mı"
    item('Bu iki pay aynı kadar mı? Bakarak söyle.', dsFractionBar(1, 2), hint('aynı kadar')),
    item('Kurabiyeyi arkadaşınla bölüşeceksin. Nasıl olmalı?', '', hint('aynı kadar olmalı')),
    item('Biri daha büyük pay aldı. Ne dersin?', dsFractionBar(3, 4), hint('haksızlık — eşit değil')),
  ]
  if (i === 1) return [ // EŞ PARÇALAMA — çakışma testi
    item('Çubuğu iki kişiye böl. Parçalar ÇAKIŞIYOR mu?', dsFractionBar(0, 2), hint('üst üste koy, çakışmalı')),
    item('Bu bölme eş mi? Parçaları karşılaştır.', dsFractionBar(0, 3), hint('üçü de eş olmalı')),
    item('Kâğıdı katla, sonra aç: parçalar eş çıktı mı?', '', hint('katlayıp denetle')),
  ]
  if (i === 2) return [ // YARIM — adlandırma + iki yarım = bütün
    item('Boyalı parçanın adı ne?', dsFractionCircle(1, 2), hint('yarım')),
    item('İki yarım birleşince ne olur?', dsFractionCircle(2, 2), hint('bir bütün')),
    item('Bir elmanın yarısını göster. Kaç eş parçadan biri?', '', hint("2 eş parçadan 1'i")),
  ]
  if (i === 3) return [ // BİRİM KESİR — payda ne söyler
    item('Bütün kaça bölündü? Bir parçanın adı ne?', dsFractionCircle(1, 4), eqRow(`${wbox()}/${wbox()}`)),
    item('Buradaki alt sayı (payda) neyi gösteriyor?', dsFractionBar(1, 3), hint('bütün kaça bölündü')),
    item("1/5'i kendin çiz. Kaç eş parça yapmalısın?", '', hint('5 eş parça, birini boya')),
  ]
  if (i === 4) return [ // PAY > 1 — okuma
    item('Kaç parça dolu, bütün kaça bölünmüş? Kesri yaz.', dsFractionBar(3, 4), eqRow(`${wbox()}/${wbox()}`)),
    item('Bu daireyi kesirle oku.', dsFractionCircle(2, 3), eqRow(`${wbox()}/${wbox()}`)),
    item("2/5'te üstteki 2 neyi söylüyor?", '', hint('kaç parça alındığını')),
  ]
  if (i === 5) return [ // KURMA — birim kesirleri topla
    item("1/4'lerden 3/4 KUR: kaç tane 1/4 gerekli?", dsFractionBar(1, 4), eqRow(`1/4 + 1/4 + 1/4 = ${wboxBig()}`)),
    item('2/3 kurmak için kaç tane 1/3 alırsın?', dsFractionCircle(1, 3), eqRow(`${wbox()} tane 1/3`)),
    item('Kaç tane alacağını hangi sayıdan okudun?', '', hint('paydan — üstteki sayı')),
  ]
  if (i === 6) return [ // SERBEST KURMA — paydayı sen seç
    item('Bütünü sen böl ve 5/6 oluştur.', dsFractionBar(5, 6), hint("6 eş parça, 5'ini boya")),
    item('Bu kesir bütüne ne kadar yakın? Ne eksik?', dsFractionCircle(5, 6), hint('bir parça eksik')),
    item('Bir kesir seç ve arkadaşına kurdur.', '', hint('paydayı ve payı sen söyle')),
  ]
  if (i === 7) return [ // TEKRARLAMA — bütünü tamamla ve AŞ
    item('Kaç tane 1/4 bir bütün eder?', dsFractionBar(1, 4), eqRow(`${wbox()} tane → 4/4 = 1`)),
    item('Bir bütünden fazlası: 5/4 ne demek?', dsFractionCircle(4, 4), hint('bir bütün ve bir 1/4 daha')),
    item("1/3'ü tekrarla: 4 tane olursa bütünü aştın mı?", '', hint('aştım — 4/3 > 1')),
  ]
  if (i === 8) return [ // EŞ PAYDALI İŞLEM — payda sabit, payları işle
    item("1/4 ile 2/4'yi yan yana diz. Kaç parça oldu?", dsFractionBar(3, 4), eqRow(`1/4 + 2/4 = ${wboxBig()}`)),
    item("5/6'dan 2/6 al. Kaç parça kalır?", dsFractionBar(5, 6), eqRow(`5/6 − 2/6 = ${wboxBig()}`)),
    item('Payda neden değişmedi? Anlat.', '', hint('parçaların boyu aynı kaldı')),
  ]
  if (i === 9) return [ // KESRİN KESRİ — parçanın parçası
    item("Yarımı üçe böl. Küçük parça bütünün kaçta kaçı?", dsFractionCircle(1, 6), eqRow(`1/2'nin 1/3'ü = ${wboxBig()}`)),
    item('Gerçek parçalarla dene: 1/2’yi ikiye böl. Ne elde ettin?', '', eqRow(`= ${wboxBig()}`)),
    item('Parçayı böldükçe payda büyüyor mu, küçülüyor mu?', '', hint('payda büyür, parça küçülür')),
  ]
  return [ // SIRALAMA — sayı doğrusunda büyüklük
    item("1/2, 3/4 ve 1'i doğruya yerleştir.", dsNumberLine(2, { at: [1] }), hint('1/2 · 3/4 · 1')),
    item('3/4 yarımdan büyük mü? Gerekçeni yaz.', dsFractionBar(3, 4), hint("büyük — 2/4'ten fazla")),
    item("2/3 ile 1/3'ten hangisi büyük? Neden?", '', hint('aynı parçadan daha çok var')),
  ]
}

DS_EG.frac = (i) => {
  if (i === 0) return item('Baktım: paylar aynı kadar — adil.', dsFractionBar(1, 2), shown('aynı kadar'))
  if (i === 1) return item('İkiye böldüm, üst üste koydum: çakıştı — eş parça.', dsFractionBar(0, 2), shown('eş parça'))
  if (i === 2) return item('İki eş parçadan biri: yarım. İkisi birleşince bütün.', dsFractionCircle(1, 2), shown('yarım'))
  if (i === 3) return item('Bütün 4 eşe bölündü, ben birini aldım: 1/4.', dsFractionCircle(1, 4), shown('1/4'))
  if (i === 4) return item("4 eş parçanın 3'ü dolu: pay 3, payda 4 → 3/4.", dsFractionBar(3, 4), shown('3/4'))
  if (i === 5) return item('Üç tane 1/4 yan yana koydum, 3/4 oldu.', dsFractionBar(3, 4), shown('1/4 + 1/4 + 1/4 = 3/4'))
  if (i === 6) return item("Bütünü 6'ya böldüm, 5'ini aldım: 5/6 — bir parça eksik.", dsFractionBar(5, 6), shown('5/6'))
  if (i === 7) return item("1/4'ü dört kez yerleştirdim: 4/4, tam bir bütün.", dsFractionCircle(4, 4), shown('4/4 = 1'))
  if (i === 8) return item('Bir parça ve iki parça — üç parça: payda 4 sabit.', dsFractionBar(3, 4), shown('1/4 + 2/4 = 3/4'))
  if (i === 9) return item("Yarımı üçe böldüm; minik parça bütünün 1/6'sı.", dsFractionCircle(1, 6), shown("1/2'nin 1/3'ü = 1/6"))
  return item("4 parçadan 3'ü dolu: 3/4 — yarımdan çok, 1'den az.", dsFractionBar(3, 4), shown('1/2 < 3/4 < 1'))
}

// ── ajan C ──────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────
// shape2d — 2B ŞEKİLLER · 22 düzey
// Ayrım ekseni (van Hiele): bütünsel aynı/farklı → eşleme → adlandırma →
// bileşim eşleme → karşı örnek → parçadan kaba kurma → sınıf taraması →
// KENAR nesnesi (çubukla ölç) → çok ölçütlü karşılaştırma → KÖŞE nesnesi
// (pulla işaretle) → adlandırma kuralı → ayırt edici sınama (dik açı) →
// bağlam avı (açı) → tanım üretme → eşlik (üst üste) → tam kurma →
// açıyı temsil (dönme, değişmez) → eşliği dönüşümle açıklama → aile ayırma →
// özellik dili + değişmez → hiyerarşi → açı anlamlarını bütünleme.
// Malzeme: çubuklar KENAR, pullar KÖŞE olarak kullanılır.
// ────────────────────────────────────────────────────────────────────────
DS_EX.shape2d = (i) => {
  if (i === 0) return [ // BÜTÜNSEL AYNI/FARKLI — henüz şekil adı yok
    item('İki çubuk. Aynı mı, farklı mı? Yan yana koy, bak.', dsRodPair(4, 4), hint('aynı')),
    item('Bunlar aynı mı? Üst üste koyup dene.', dsRodPair(3, 6), hint('farklı')),
    item('Masadaki iki nesneden "aynı şey" olanları bir kutuya koy.', '', hint('bütününe bakarak karar ver')),
  ]
  if (i === 1) return [ // EŞLEME — yönelim ve boyut değişse de aynı şekil
    item('Aynı şekli bul. Kartı elinle döndürebilirsin.', dsShapeRow(['square', 'diamond', 'circle']), hint('kare ile baklava aynı kare')),
    item('4 pulu köşe yap. Şimdi kâğıdı çevir: yine aynı şekil mi?', dsChips(4, 'blue', 2), hint('aynı — dönünce değişmez')),
    item('Küçük ve büyük iki kare kur: 4 kısa çubuk, sonra 4 uzun çubuk.', '', hint('boyut değişti, şekil aynı')),
  ]
  if (i === 2) return [ // ADLANDIRMA — tipik daire, kare, üçgen
    item('Bu şeklin adı ne? Yaz.', dsShape('circle'), wbox()),
    item('3 çubuğu uç uca birleştir. Kurduğun şeklin adı ne?', dsRod(3), wbox()),
    item('Masadan bir kare bul, adını yüksek sesle söyle.', '', hint('kare')),
  ]
  if (i === 3) return [ // BİLEŞİM EŞLEME — iki şekilden yapılmış bütünü eşle
    item('İki şekil birleşmiş. Aynı ikiliyi bir daha kur.', dsShapeRow(['triangle', 'square']), hint('üçgen ve kare')),
    item('4 çubukla kare, yanına 3 çubukla üçgen: "ev" oldu mu?', '', hint('kare + üçgen')),
    item('Bu ikiliyi çubuk ve pullarla bir daha kur.', dsShapeRow(['circle', 'rect']), hint('daire ve dikdörtgen')),
  ]
  if (i === 4) return [ // KARŞI ÖRNEK — "değil" olanı bul, nedenini söyle
    item('Hangisi üçgen DEĞİL? Üstünü çiz.', dsShapeRow(['triangle', 'circle', 'triangle']), hint('daire')),
    item('3 çubuğu kapatmadan bırak. Bu üçgen mi? Neden?', dsRod(3), hint('kapalı değil — üçgen değil')),
    item('Çok ince, yatık bir üçgen kur. Hâlâ üçgen mi?', '', hint('evet — 3 kenarı var')),
  ]
  if (i === 5) return [ // PARÇADAN KABA KURMA — benzesin yeter
    item('3 çubuk al, üçgene BENZEYEN bir şekil kur.', dsRod(3), hint('köşeler tam kapanmasa da olur')),
    item('Köşeleri birer pulla işaretle. Kaç pul koydun?', dsChips(3, 'red', 3), wbox()),
    item('4 çubukla dörtgene benzeyen bir şekil kur, çiz.', '', hint('4 kenar')),
  ]
  if (i === 6) return [ // SINIF TARAMASI — dikdörtgen sınıfını genişlet
    item('Hangileri dikdörtgen? Hepsini işaretle.', dsShapeRow(['rect', 'square', 'triangle', 'rect']), hint('dikdörtgen ve kare')),
    item('2 uzun 2 kısa çubukla dörtgen kur. Dikdörtgen mi?', dsRodPair(6, 2), hint('evet — uzun-ince de dikdörtgen')),
    item('Dikdörtgeni EĞİK duracak biçimde kur. Adı değişti mi?', '', hint('değişmez')),
  ]
  if (i === 7) return [ // KENAR NESNESİ — çubukla ölç, kenarları karşılaştır
    item('Şeklin her kenarını bir çubukla ölç. Kaç delik çıktı?', dsMeasureOnRuler(4, 7), wbox()),
    item('Karşılıklı kenarları eşit mi? Çubukları yan yana koy.', dsRodPair(5, 5), hint('eşit')),
    item('Kenarları eşit olan üçgen kur: 3 tane aynı çubuk.', '', hint('eşkenar')),
  ]
  if (i === 8) return [ // ÇOK ÖLÇÜTLÜ KARŞILAŞTIRMA — kenar, köşe, uzunluk
    item('Kenarları çubukla ölç, köşeleri pulla say: fark nerede?', dsShapeRow(['triangle', 'pentagon']), eqRow(`kenar ${wbox()} / ${wbox()}`)),
    item('Çubuklarla iki dörtgen kur. Farkları nerede?', dsRodPair(4, 7), hint('kenar uzunlukları')),
    item('"İkisi de dörtgen ama aynı değil." Bir fark söyle.', '', hint('kenar oranı ya da köşe açıklığı')),
  ]
  if (i === 9) return [ // KÖŞE NESNESİ — pulla köşe işaretle ve say
    item('Her köşeye bir pul koy. Kaç pul gerekti?', dsShape('pentagon'), wbox()),
    item('4 pul koyup aralarını çubukla bağla. Kaç köşe var?', dsChips(4, 'yellow', 2), wbox()),
    item('Köşe sayısı ile kenar sayısı aynı mı? Say ve karşılaştır.', '', hint('aynı')),
  ]
  if (i === 10) return [ // ADLANDIRMA KURALI — kenar sayısı → ad
    item('Kenarları say, adını kurala göre yaz.', dsShape('hexagon'), wbox()),
    item('5 çubukla bir şekil kur. Adı ne olur?', dsRod(3), wbox()),
    item('Baklava (eşkenar dörtgen) kaç kenarlı? Adı neden dörtgen?', '', hint('4 kenar')),
  ]
  if (i === 11) return [ // AYIRT EDİCİ SINAMA — dik açı testi, oval ≠ daire
    item('Köşeye kart köşesini tut: dik açı mı? İşaretle.', dsShape('rect'), hint('dört köşesi de dik')),
    item('İki çubuğu köşe yap, kart köşesiyle sına. Dik mi?', dsAngle(45), hint('dik değil — daha dar')),
    item('Oval ile daireyi ayır: hangisi her yönde eşit?', '', hint('daire')),
  ]
  if (i === 12) return [ // BAĞLAM AVI — açı yalnız köşede değil
    item('İki çubuğu makas gibi kesiştir. Kesişme yerinde açı var mı?', '', hint('kesişmede de açı var')),
    item('Çubuğu eğ: rampa yaptın. Bu eğimde açı var mı?', dsAngle(20), hint('var')),
    item('Çubuğu tutup odada üç açı bul: köşe, kesişme, eğim.', '', hint('kapı köşesi, makas, merdiven')),
  ]
  if (i === 13) return [ // TANIM ÜRETME — parçalarla tarif et
    item('Bu şekli parçalarıyla tarif et: kaç kenar, kaç köşe?', dsShape('pentagon'), eqRow(`${wbox()} kenar · ${wbox()} köşe`)),
    item('"3 kenarı, 3 köşesi olan kapalı şekil" — çubukla kur.', '', hint('üçgen')),
    item('Arkadaşına şekli SÖYLEYEREK kurdur; sen bakma.', dsRod(4), hint('yalnız kenar-köşe dili')),
  ]
  if (i === 14) return [ // EŞLİK — üst üste koyarak sına
    item('İki şekli üst üste koy. Tıpatıp aynı mı?', dsShapeRow(['square', 'square']), hint('eş')),
    item('İki çubuk kareyi üst üste koy: taşan yer var mı?', dsRodPair(4, 4), hint('yok — eş')),
    item('Bir kenarı 1 delik uzat. Hâlâ eş mi?', '', hint('değil')),
  ]
  if (i === 15) return [ // TAM KURMA — eşit kenar, kapanan köşe
    item('4 EŞİT çubukla kare kur: köşeler tam kapansın.', dsRod(4), hint('4 eşit kenar')),
    item('Köşelere pul koy, hiç boşluk kalmasın.', dsChips(4, 'green', 4), hint('kapalı şekil')),
    item('İkizkenar üçgen kur: 2 eşit, 1 farklı çubuk.', dsRodPair(5, 5), hint('taban farklı')),
  ]
  if (i === 16) return [ // AÇIYI TEMSİL — dönme; kenar uzunluğu açıyı değiştirmez
    item('İki çubuğu köşeden birleştir, birini döndür. Açı büyüdü mü?', dsAnglePair(30, 80), hint('döndükçe büyür')),
    item('Aynı açıklık, ama kollar UZUN. Açı büyüdü mü?', dsAngle(45, 34) + dsAngle(45, 78), hint('hayır — uzunluk açıyı değiştirmez')),
    item('Açıyı çiz: bir sabit çizgi, bir dönen çizgi.', '', hint('iki ışın + dönme')),
  ]
  if (i === 17) return [ // EŞLİĞİ AÇIKLAMA — dönüşümle, üst üste koymadan
    item('Üst üste koymadan söyle: eş mi? Nasıl anladın?', dsShapeRow(['triangle', 'triangle']), hint('döndürünce çakışır')),
    item('Çubuklardan kurduğun şekle aynada bak: yansıması eş mi?', dsRodPair(3, 3), hint('eş — yansıma')),
    item('"Kaydırdım, döndürdüm, üst üste geldi." Hangi dönüşüm?', '', hint('kaydırma + döndürme')),
  ]
  if (i === 18) return [ // AİLE AYIRMA — grupla (gerekçe henüz istenmiyor)
    item('Bu şekilleri iki aileye ayır.', dsShapeRow(['square', 'triangle', 'rect', 'triangle']), hint('dörtgenler · üçgenler')),
    item('Çubuk sayısına göre kur ve ayır: 3 çubuk / 4 çubuk.', '', hint('üçgen ailesi · dörtgen ailesi')),
    item('Kurduğun şekli hangi aileye koyarsın?', dsRod(4), hint('dörtgen')),
  ]
  if (i === 19) return [ // ÖZELLİK DİLİ + DEĞİŞMEZ
    item('Bu şeklin özelliğini yaz: kenarlar ve açılar nasıl?', dsShape('square'), hint('4 eşit kenar, 4 dik açı')),
    item('Kareyi döndür. Hangi özellik DEĞİŞMEDİ?', dsShape('diamond'), hint('kenarlar hâlâ eşit')),
    item('Çubukla ölçüp doğrula: karşılıklı kenarlar eşit mi?', dsRodPair(6, 6), hint('eşit')),
  ]
  if (i === 20) return [ // HİYERARŞİ — sınıf içinde sınıf
    item('Kare de dikdörtgen midir? Özelliklerini yaz, karar ver.', dsShapeRow(['square', 'rect']), hint('evet — 4 dik açısı var')),
    item('4 eşit çubukla kur. Bu hem kare hem dikdörtgen mi?', dsRod(4), hint('ikisi de')),
    item('Her dikdörtgen kare midir? Çubukla karşı örnek kur.', '', hint('hayır — 2 uzun 2 kısa')),
  ]
  return [ // AÇIYI BÜTÜNLEME — dönme + köşe + eğim tek kavram, ölçü ile
    item('Çubuklarla üç açı kur: köşe, kesişme, eğim. Ortak yanı ne?', '', hint('hepsi iki çizgi arası dönme')),
    item('Çubuk kolu çeyrek tur döndür. Kaç derece oldu?', dsAngle(90), wbox()),
    item('Dik açının yarısı kaç derece? Çubukla göster.', '', hint('45')),
  ]
}

DS_EG.shape2d = (i) => {
  if (i === 0) return item('İki çubuğu yan yana koydum: boyları aynı — aynı şey.', dsRodPair(4, 4), shown('aynı'))
  if (i === 1) return item('Kartı döndürdüm, yine kare — dönmek şekli değiştirmiyor.', dsShape('diamond'), shown('aynı kare'))
  if (i === 2) return item('Baktım ve adını söyledim: daire.', dsShape('circle'), shown('daire'))
  if (i === 3) return item('İkiliyi eşledim: üçgen ile kare, aynı sırayla.', dsShapeRow(['triangle', 'square']), shown('üçgen + kare'))
  if (i === 4) return item('Bu üçgen değil: kenarı yok, yuvarlak.', dsShape('circle'), shown('üçgen değil'))
  if (i === 5) return item('3 çubuğu birleştirdim, üçgene benzedi. Köşeler biraz açık.', dsRod(3), shown('üçgene benzer'))
  if (i === 6) return item('Uzun-ince olan da dikdörtgen — sınıfa girer.', dsShape('rect'), shown('dikdörtgen'))
  if (i === 7) return item('Kenarı çubukla ölçtüm: 4 delik uzunluğunda.', dsMeasureOnRuler(4, 7), shown('4 birim'))
  if (i === 8) return item('Üçgenin 3, beşgenin 5 kenarı var — kenar sayısı farklı.', dsShapeRow(['triangle', 'pentagon']), shown('3 kenar / 5 kenar'))
  if (i === 9) return item('Her köşeye bir pul koydum: 5 pul, demek 5 köşe.', dsChips(5, 'yellow', 5), shown('5 köşe'))
  if (i === 10) return item('Kenarları saydım: 6 — adı altıgen.', dsShape('hexagon'), shown('altıgen'))
  if (i === 11) return item('Kart köşesini tuttum: tam oturdu, dik açı.', dsShape('rect'), shown('dik açı'))
  if (i === 12) return item('Çubukları makas gibi kesiştirdim: kesişme yerinde de açı var.', '', shown('kesişmede açı'))
  if (i === 13) return item('Parçalarıyla tarif ettim: 5 kenar, 5 köşe, kapalı.', dsShape('pentagon'), shown('5 kenar · 5 köşe'))
  if (i === 14) return item('İkisini üst üste koydum, taşan yer yok: eş.', dsShapeRow(['square', 'square']), shown('eş'))
  if (i === 15) return item('4 eşit çubuk, köşeler tam kapandı: doğru kare.', dsRod(4), shown('4 eşit kenar'))
  if (i === 16) return item('Kollar uzun ama açıklık aynı — açı değişmedi.', dsAngle(45, 36) + dsAngle(45, 74), shown('açı aynı'))
  if (i === 17) return item('Üst üste koymadım: döndürünce çakışacağını gördüm.', dsShapeRow(['triangle', 'triangle']), shown('döndürme ile eş'))
  if (i === 18) return item('İki aileye ayırdım: dörtgenler ve üçgenler.', dsShapeRow(['square', 'triangle', 'rect']), shown('dörtgen · üçgen'))
  if (i === 19) return item('Özelliğini yazdım: 4 eşit kenar, 4 dik açı. Döndürünce değişmedi.', dsShape('square'), shown('4 eşit kenar · 4 dik açı'))
  if (i === 20) return item('Karenin 4 dik açısı var, o yüzden kare de bir dikdörtgendir.', dsShapeRow(['square', 'rect']), shown('kare ⊂ dikdörtgen'))
  return item('Çeyrek tur döndürdüm: 90 derece. Köşe de eğim de aynı şey.', dsAngle(90), shown('90°'))
}

// ────────────────────────────────────────────────────────────────────────
// comp2d — ŞEKİL BİRLEŞTİRME (2B) · 11 düzey
// Ayrım ekseni: tek tek kullanma → değdirme (deneme-yanılma) → resim ögesi →
// ipuçlu ayrıştırma → ÖNGÖRÜ ile oluşturma → ikame → destekli ayrıştırma →
// birimi tekrarlama → imgelemle (çizgisiz) ayrıştırma → birim-üstü birim →
// katmanlı (parçanın parçası) ayrıştırma.
// ────────────────────────────────────────────────────────────────────────
DS_EX.comp2d = (i) => {
  if (i === 0) return [ // TEK TEK — birleştirme yok
    item('Çubukları tek tek al, her birini ayrı yere koy.', dsRod(3), hint('birleştirme yok')),
    item('Kaç ayrı parça var? Say ve yaz.', dsChips(4, 'blue', 4), wbox()),
    item('Her pulu ayrı bir kutuya koy. Kaç kutu doldu?', '', wbox()),
  ]
  if (i === 1) return [ // DEĞDİRME — parçalar birbirine dokunuyor
    item('İki çubuğu uç uca DEĞDİR. Uzunluk kaç oldu?', dsRodPair(3, 4), wbox()),
    item('Pulları birbirine değdirerek bir sıra yap.', dsChips(5, 'red', 5), hint('boşluk kalmasın')),
    item('Çizgili yapbozu dene-yanıl ile doldur.', dsGeoboard(3, 4), hint('her parça bir yere')),
  ]
  if (i === 2) return [ // RESİM ÖGESİ — birkaç parça bir "şey" olur
    item('Çubuklarla bir "ev" yap: gövde ve çatı.', '', hint('kare + üçgen')),
    item('İki şekli birleştirip bir kol yap.', dsShapeRow(['rect', 'rect']), hint('iki parça = bir kol')),
    item('Çubuk ve pullarla bir insan resmi kur, çiz.', '', hint('pullar baş ve eller')),
  ]
  if (i === 3) return [ // İPUÇLU AYRIŞTIRMA — çizgi zaten gösteriyor
    item('Çizgi nereden geçiyor? Şekli oradan ikiye ayır.', dsGeoboard(3, 3, [[0, 0], [0, 2], [1, 1], [0, 2], [2, 2]]), hint('iki üçgen')),
    item('6 delikli çubuğu tam ortadan ayır. Her parça kaç?', dsRod(6, { fill: 3 }), eqRow(`${wbox()} ve ${wbox()}`)),
    item('Kareyi bir çizgiyle iki dikdörtgene ayır.', dsShape('square'), hint('ortadan')),
  ]
  if (i === 4) return [ // ÖNGÖRÜ — koymadan ÖNCE söyle
    item('Koymadan ÖNCE söyle: buraya hangi çubuk tam oturur?', dsRodPair(7, 4), hint('3 delikli')),
    item('Altıgeni üçgenlerle doldur. Kaç üçgen gerekir? Önce tahmin et.', dsShape('hexagon'), wbox()),
    item('Çubuğu döndürerek yerleştir: hangi yön uyar?', '', hint('döndürme amaçlı')),
  ]
  if (i === 5) return [ // İKAME — aynı bütün, farklı parça takımı
    item('7 delikli çubuğun yerine hangi ikili konur?', dsRod(7), eqRow(`${wbox()} + ${wbox()} = 7`)),
    item('Aynı kareyi başka parçalarla kur: 2 üçgen yerine ne?', dsShape('square'), hint('4 küçük üçgen')),
    item('Aynı uzunluğu üç ayrı çubuk takımıyla yap.', '', hint('6 = 5+1 = 4+2 = 3+3')),
  ]
  if (i === 6) return [ // DESTEKLİ AYRIŞTIRMA — kısmi ipucu var
    item('Tek bir çizgi verildi. Kalan ayrımı sen bul.', dsGeoboard(3, 4, [[0, 0], [0, 3], [2, 3], [2, 0], [0, 0], [0, 2], [2, 2], [0, 2]]), hint('ikiye böl, sonra yine')),
    item('İpucu: pullu bölüm 4 delikli. Çubuğu buradan böl.', dsRod(8, { fill: 4 }), eqRow(`${wbox()} + ${wbox()}`)),
    item('Sana kaç parça olduğunu söylüyorum: 3. Nerelerden ayırırsın?', '', hint('3 parça')),
  ]
  if (i === 7) return [ // BİRİMİ TEKRARLAMA — kurduğun birimi çoğalt
    item('2 üçgenle bir birim kurdun. Aynısından 3 tane daha yap.', dsShapeRow(['triangle', 'triangle']), hint('birim × 4')),
    item('3 delikli çubuk + 3 pul bir birim. Bu birimi yan yana tekrarla.', dsRod(3, { fill: 3 }), hint('birimi çoğalt')),
    item('Kurduğun birim aynı anda kaç küçük şekil, kaç büyük şekil?', '', hint('2 küçük · 1 büyük')),
  ]
  if (i === 8) return [ // İMGELEMLE AYRIŞTIRMA — çizgi yok, zihinde
    item('Çizgi yok. Bu şekli zihninde ikiye ayır, sonra çiz.', dsShape('hexagon'), hint('iki yamuk')),
    item('9 delikli çubuğu bakmadan üçe ayır: her parça kaç?', dsRod(9), eqRow(`${wbox()} · ${wbox()} · ${wbox()}`)),
    item('Aynı şekli İKİ ayrı yoldan ayır. İkisini de anlat.', '', hint('esnek ayrıştırma')),
  ]
  if (i === 9) return [ // BİRİM-ÜSTÜ BİRİM — bileşik birimle döşeme
    item('Bileşik birimi (3 delikli çubuk) bir bütün say, 4 kez döşe.', dsRod(3, { fill: 3 }), eqRow(`4 × 3 = ${wboxBig()}`)),
    item('Pul birimini tekrarlayarak yüzeyi boşluksuz kapla.', dsFrame(2, 5, 10), hint('döşeme')),
    item('Kaç birim kullandın, her birimde kaç parça var?', '', eqRow(`${wbox()} birim × ${wbox()} parça`)),
  ]
  return [ // KATMANLI AYRIŞTIRMA — parçanın parçası
    item('Önce ikiye ayır, sonra her parçayı yine ikiye ayır.', dsGeoboard(3, 5, [[0, 0], [0, 4], [2, 4], [2, 0]]), hint('4 parça')),
    item('10 delikli çubuğu 2 parçaya, her parçayı yine 2 parçaya böl.', '', eqRow(`10 → ${wbox()}+${wbox()} → 4 parça`)),
    item('Ayrımını planla, sonra uygula: kaç katman indin?', '', wbox()),
  ]
}

DS_EG.comp2d = (i) => {
  if (i === 0) return item('Çubukları birleştirmedim, her birini ayrı tuttum: 3 parça.', dsRod(3), shown('3 ayrı parça'))
  if (i === 1) return item('İki çubuğu uç uca değdirdim: 3 ile 4, boyu 7 oldu.', dsRodPair(3, 4), shown('7'))
  if (i === 2) return item('Kare gövde, üçgen çatı — ikisi birlikte bir ev oldu.', dsShapeRow(['square', 'triangle']), shown('ev'))
  if (i === 3) return item('Çizgi ortadaydı: 6 delikli çubuk 3 ve 3 oldu.', dsRod(6, { fill: 3 }), shown('3 + 3'))
  if (i === 4) return item('Koymadan önce söyledim: buraya 3 delikli çubuk oturur. Oturdu.', dsRodPair(7, 4), shown('3 delikli'))
  if (i === 5) return item('7 yerine 5 ve 2 koydum — aynı uzunluk, başka parçalar.', dsRod(7), shown('5 + 2 = 7'))
  if (i === 6) return item('İpucu bir çizgiydi; kalan ayrımı ben buldum: 4 parça.', dsGeoboard(3, 4, [[0, 0], [0, 3], [2, 3], [2, 0], [0, 0], [1, 0], [1, 3], [1, 0]]), shown('4 parça'))
  if (i === 7) return item('2 üçgenlik birimi kurdum, aynısından 4 tane yaptım.', dsShapeRow(['triangle', 'triangle']), shown('birim × 4'))
  if (i === 8) return item('Çizgi yoktu; 9 çubuğu zihnimde üçe ayırdım: 3-3-3.', dsRod(9), shown('3 · 3 · 3'))
  if (i === 9) return item('3 delikli çubuk birimini bir bütün saydım, 4 kez döşedim: 12.', dsRod(3, { fill: 3 }), shown('4 × 3 = 12'))
  return item('Önce 5 ve 5, sonra her birini 2 ve 3 yaptım: iki katman.', dsRod(10, { fill: 5 }), shown('10 → 5+5 → 4 parça'))
}

// ────────────────────────────────────────────────────────────────────────
// disembed — GÖMÜLÜ ŞEKİLLERİ AYIRT ETME · 5 düzey
// Ayrım ekseni: ayrık şekli hatırla/yeniden üret → örtüşenleri ayır (dış
// çerçeve) → içine gömülüyü bul → birincil yapıyla örtüşmeyeni bul →
// tümünü bul ve kanıtla (sayım + izleme).
// ────────────────────────────────────────────────────────────────────────
DS_EX.disembed = (i) => {
  if (i === 0) return [ // AYRIK — üst üste binme yok, hatırla ve yeniden üret
    item('Ayrı duran üç şekle bak, kapat, aynısını çubukla kur.', dsShapeRow(['triangle', 'square', 'circle']), hint('üçgen · kare · daire')),
    item('İki ayrı çubuk gördün. Kapat: hangileriydi?', dsRodPair(3, 5), eqRow(`${wbox()} ve ${wbox()}`)),
    item('Masaya 4 pul ayrı ayrı diz, kapat, aynısını yap.', '', hint('4 ayrı pul')),
  ]
  if (i === 1) return [ // ÖRTÜŞEN — dış çerçeveyi belirle, örtüşenleri ayır
    item('Önce DIŞ çerçeveyi parmakla izle, sonra çiz.', dsGeoboard(4, 4, [[0, 0], [0, 3], [3, 3], [3, 0]]), hint('dış sınır')),
    item('İki çubuğu çapraz koy: biri ötekinin üstünden geçsin. Kaç ayrı çubuk var?', '', wbox()),
    item('Kare ile baklava kartını üst üste bindir, sonra ikisini ayrı ayrı göster.', '', hint('kare · baklava')),
  ]
  if (i === 2) return [ // İÇİNE GÖMÜLÜ — şekil içinde şekil
    item('Karenin İÇİNDE hangi şekil saklı? Parmakla izle.', dsGeoboard(4, 4, [[0, 1], [1, 3], [3, 2], [2, 0]]), hint('içteki dörtgen')),
    item('Çubukla kurduğun karenin içine üçgen kur. Kaç şekil oldu?', dsRod(4), wbox()),
    item('İç içe iki şekil çiz, sonra yalnız içtekini boya.', '', hint('içteki')),
  ]
  if (i === 3) return [ // ÖRTÜŞMEYEN GÖMÜLÜ — parçaları ana şekillere dağılmış
    item('Aradığın üçgenin parçaları iki ayrı şekle dağılmış. Bul.', dsGeoboard(4, 5, [[0, 0], [0, 2], [3, 2], [0, 2], [3, 0], [0, 2], [3, 4], [0, 2], [0, 4], [3, 4], [3, 0]]), hint('parçaları birleştir')),
    item('Ana çubuğa değil, ARADAKİ boşluğa bak. Orada şekil var mı?', dsRodPair(7, 4), hint('aradaki fark 3')),
    item('Bulduğun şeklin köşelerine pul koy, kanıtla.', dsChips(3, 'green', 2), hint('3 köşe')),
  ]
  return [ // TÜMÜNÜ BUL — sayım + izleyerek kanıt
    item('Bu çizimdeki TÜM üçgenleri bul. Kaç tane?', dsGeoboard(4, 5, [[0, 0], [0, 4], [3, 4], [3, 0], [0, 0], [3, 4], [0, 0], [0, 4], [3, 0], [0, 4]]), wbox()),
    item('Bulduğun her şekli farklı renk pulla işaretle: kaç renk?', dsChips(4, 'yellow', 4), wbox()),
    item('Bir şekli atladın mı? Listeni çubukla teker teker kur, sına.', '', hint('hepsini kur, karşılaştır')),
  ]
}

DS_EG.disembed = (i) => {
  if (i === 0) return item('Üç şekil ayrı duruyordu; kapattım, aynısını kurdum.', dsShapeRow(['triangle', 'square', 'circle']), shown('3 ayrı şekil'))
  if (i === 1) return item('Önce dış çerçeveyi izledim, sonra iki çubuğu ayrı gördüm.', dsRodPair(6, 4), shown('2 çubuk'))
  if (i === 2) return item('Karenin içindeki dörtgeni parmakla izleyip buldum.', dsGeoboard(4, 4, [[0, 1], [1, 3], [3, 2], [2, 0]]), shown('içte 1 dörtgen'))
  if (i === 3) return item('Üçgenin parçaları iki şekle dağılmıştı; köşelerine pul koydum.', dsChips(3, 'green', 2), shown('3 köşe → 1 üçgen'))
  return item('Hepsini saydım ve tek tek kurup sınadım: 8 üçgen.', dsGeoboard(4, 5, [[0, 0], [0, 4], [3, 4], [3, 0], [0, 0], [3, 4], [0, 0], [0, 4], [3, 0], [0, 4]]), shown('8 üçgen'))
}

// ── ajan D ──────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────
// shape3d — 3B ŞEKİLLER · 7 düzey
// Ayrım ekseni: elleyip keşfetme → prototip tanıma → yüzü 2B görme →
// yüz/ayrıt/köşe SAYMA → çubuk-ayrıtla KURMA → özellik listeleyip açınım
// kestirme → aileye göre SINIFLAMA.
// ────────────────────────────────────────────────────────────────────────
DS_EX.shape3d = (i) => {
  if (i <= 0) return [ // KEŞİF — cismin davranışı; ad değil, iş
    item('Elindeki cismi masada it. Yuvarlandı mı, kaydı mı?', '', hint('yuvarlandı / kaydı')),
    item('Bir pulu masada yuvarlamayı dene. Neden olmuyor?', dsChip('blue', null, 34), hint('pul yassı, top değil')),
    item('Cismi üstüne kutu koyacak gibi tut: duruyor mu?', '', hint('duruyor / devriliyor')),
  ]
  if (i === 1) return [ // TANIMA — günlük ad, prototip
    item('Kutuyu göster, sonra topu göster. Adlarını söyle.', '', hint('kutu · top')),
    item('Çubuğu masaya dik tut: uç kısmı sivri mi, düz mü?', dsRod(4), hint('düz — çubuk kutu gibi')),
    item('Odada top gibi olan bir şey bul, söyle.', '', wbox()),
  ]
  if (i === 2) return [ // YÜZÜ 2B OLARAK GÖRME — cisim → yüz şekli
    item("Kutunun bir yüzüne parmağını bas. O yüz hangi şekil?", dsShapeRow(['square', 'rect']), wbox()),
    item('Çubuğun üstündeki yüz düz mü? Elini gezdirip söyle.', dsRod(5), hint('düz yüz')),
    item('Konide düz yüz kaç tane? Elle yokla.', '', wbox()),
  ]
  if (i === 3) return [ // SAYMA — atlamadan, yineleyemeden; pul = işaretleyici
    item('Kutunun her yüzüne bir pul koy. Kaç pul harcadın?', dsChips(6, 'blue', 6), wbox()),
    item('Aynı kutunun köşelerine pul koy: kaç köşe?', '', eqRow(`${wbox()} yüz · ${wbox()} köşe`)),
    item('Saydığın yüzü ikinci kez saymamak için ne yaptın?', '', hint('pul koydum, işaretledim')),
  ]
  if (i === 4) return [ // KURMA — çubuk = AYRIT; iskelet
    item('Çubukları ayrıt yapıp bir kutu iskeleti kur. Kaç çubuk?', dsRod(3, { fill: 3 }), wbox()),
    item('Alt kare için 4, üst kare için 4 çubuk. Dikeyler kaç?', '', eqRow(`4 + 4 + ${wbox()} = ${wboxBig()}`)),
    item('Bir ayrıt eksik kalırsa yapı kapanır mı? Dene.', '', hint('kapanmaz — açık kalır')),
  ]
  if (i === 5) return [ // ÖZELLİK + AÇINIM — say değil, TANIMLA
    item('Küpü anlat: kaç yüz, kaç ayrıt, kaç köşe?', '', eqRow(`${wbox()} yüz ${wbox()} ayrıt ${wbox()} köşe`)),
    item('Bu 6 kare 2×3 blok dizili. Katlayınca küp olur mu? Dene.', dsCubeGrid(2, 3), hint('olmaz — yüzler çakışır')),
    item('Çubukla en, boy, yükseklik ölç. Üçü de eşit mi?', dsRodPair(4, 4), hint('eşitse küp')),
  ]
  return [ // AİLE — prototipe değil özelliğe göre sınıfla
    item('İki ucu aynı, yanları dikdörtgen olanları ayır. Adı ne?', '', hint('prizma')),
    item('Hiç düz yüzü olmayan cismi bul. Neden o?', '', wbox()),
    item('Çubuklarla üçgen tabanlı bir prizma kur: kaç çubuk?', dsRod(3), wbox()),
  ]
}

DS_EG.shape3d = (i) => {
  if (i <= 0) return item('Topu ittim: yuvarlandı. Kutuyu ittim: kaydı, durdu.', '', shown('top yuvarlanır'))
  if (i === 1) return item('Bunun adı kutu, şunun adı top. Kutunun yüzleri düz.', '', shown('kutu · top'))
  if (i === 2) return item('Kutunun yüzüne bastım: o yüz bir kare. Yüz 2B şekildir.', dsShape('square'), shown('yüzü = kare'))
  if (i === 3) return item('Her yüze bir pul koydum, 6 pul bitti: kutunun 6 yüzü var.', dsChips(6, 'blue', 6), shown('6 yüz'))
  if (i === 4) return item('Ayrıt olarak 12 çubuk kullandım: alt 4, üst 4, dikey 4.', dsRod(4, { fill: 4 }), shown('4 + 4 + 4 = 12 çubuk'))
  if (i === 5) return item('Küp: 6 yüz, 12 ayrıt, 8 köşe. Açınımı 6 kareden oluşur.', '', shown('6 yüz · 12 ayrıt · 8 köşe'))
  return item('İki ucu aynı, yanları dikdörtgen — bu yüzden prizma dedim.', '', shown('prizma çünkü iki uç aynı'))
}

// ────────────────────────────────────────────────────────────────────────
// comp3d — YAPI KURMA (3B) · 9 düzey
// Ayrım ekseni: tek tek taşıma → üst üste → yan yana → EŞ parça seçme →
// zemin+duvar birlikte → kemer/kapalı alan → önceden planlama →
// eşdeğer parça değiştirme → kat = BİRİM (birimlerin birimi).
// ────────────────────────────────────────────────────────────────────────
DS_EX.comp3d = (i) => {
  if (i <= 0) return [ // TEK TEK — henüz birleştirme yok; temsil var
    item('Bir çubuğu al, masanın öbür ucuna taşı. Kaç çubuk taşıdın?', dsRod(3), wbox()),
    item('Bir pul "araba" olsun. Onu garaja götür.', dsChip('red', null, 34), hint('tek parça bir şeyi temsil eder')),
    item('Çubukları bir kutuya topla. Hepsi içeride mi?', '', hint('evet / hayır')),
  ]
  if (i === 1) return [ // ÜST ÜSTE — dikey; "üstüne"
    item('Küpleri üst üste koy. Kaç kat oldu?', dsCubeStack(3), wbox()),
    item('Bir kat daha ekle. Şimdi kaç kat?', '', eqRow(`3 + 1 = ${wbox()}`)),
    item('Kule yıkılınca en alta hangi parçayı koyarsın?', '', hint('en geniş olanı')),
  ]
  if (i === 2) return [ // YAN YANA — yatay sıra; "yanına"
    item('Çubukları uç uca diz, bir yol yap. Kaç çubuk uzunluk?', dsRod(6), wbox()),
    item('Yolun yanına ikinci sıra diz. İki sıra eşit mi?', dsRodPair(5, 5), hint('eşit / değil')),
    item('Kule dikey, yol yatay. İkisi arasındaki fark ne?', '', hint('üstüne · yanına')),
  ]
  if (i === 3) return [ // EŞ PARÇA SEÇME — seçim sistemli
    item('Aynı uzunlukta iki çubuk seç. Üst üste koyup denetle.', dsRodPair(4, 4), hint('tam örtüşmeli')),
    item('Eş küplerden hizalı bir kule yap. Kaç eş parça?', dsCubeStack(4), wbox()),
    item('Farklı bir parça karışırsa kule nasıl olur?', '', hint('eğrilir, yıkılır')),
  ]
  if (i === 4) return [ // ZEMİN + DUVAR — yatay ve dikey AYNI yapıda
    item('Önce 3×3 zemin ser. Kaç parça gitti?', dsCubeGrid(3, 3), wbox()),
    item('Zeminin bir kenarına duvar dik: kaç çubuk gerekti?', dsRod(3, { fill: 3 }), wbox()),
    item('Zemin yatay, duvar dikey. İkisi nerede birleşti?', '', hint('kenarda')),
  ]
  if (i === 5) return [ // KEMER / KAPALI ALAN — deneme-yanılma ile açıklık
    item('İki kule dik, aralarına çubuk uzat. Köprü tuttu mu?', dsRodPair(3, 3), hint('tuttu / düştü')),
    item('Kuleleri uzaklaştır: köprü çubuğu hâlâ yetiyor mu?', dsRod(6), hint('yetiyor / kısa')),
    item('Dört duvarla içi boş bir garaj kur. İçeri pul sığdı mı?', '', hint('kapalı alan')),
  ]
  if (i === 6) return [ // PLANLAMA — kurmadan ÖNCE söyle
    item('Kurmadan önce söyle: kaç parça gerekecek? Sonra kur.', '', eqRow(`kestirdim ${wbox()} · gerçek ${wbox()}`)),
    item('Modele bak, aynısını kur. Kaç kat, her kat kaç parça?', dsCubeGrid(2, 4), eqRow(`${wbox()} kat × ${wbox()}`)),
    item('Kestirdiğin sayı tuttu mu? Farkı yaz.', '', wbox()),
  ]
  if (i === 7) return [ // EŞDEĞERLİK — parçayı bileşikle değiştir
    item('1 uzun çubuğun yerine kaç kısa çubuk koyabilirsin?', dsRodPair(6, 3), wbox()),
    item('Uzun çubuğu çıkar, aynı boşluğu kısalarla doldur.', dsRod(6, { fill: 6 }), eqRow(`3 + 3 = ${wbox()}`)),
    item('Yapı aynı kaldı mı? Yüksekliği çubukla ölç.', '', hint('aynı — parça sayısı değişti')),
  ]
  return [ // BİRİMLERİN BİRİMİ — kat tek bir "şey"
    item('Bir katı kur: kaç parça? Sonra 3 kat üst üste koy.', dsCubeGrid(2, 3), eqRow(`${wbox()} × 3 = ${wboxBig()}`)),
    item('Katları TEK TEK değil, KAT olarak say. Kaç kat?', dsCubeStack(3), wbox()),
    item('Her katın tavanı oturuyor mu? Üst kat kaymıyor mu?', '', hint('tavan tam oturmalı')),
  ]
}

DS_EG.comp3d = (i) => {
  if (i <= 0) return item('Çubukları tek tek taşıdım; henüz bir şey kurmadım.', dsRod(3), shown('3 çubuk taşıdım'))
  if (i === 1) return item('Küpleri üst üste koydum: 3 kat oldu. "Üstüne" dedim.', dsCubeStack(3), shown('3 kat'))
  if (i === 2) return item('Çubukları uç uca dizdim, yol oldu: 6 birim uzun.', dsRod(6), shown('6 birim yol'))
  if (i === 3) return item('Eş çubukları seçtim; üst üste koyunca tam örtüştüler.', dsRodPair(4, 4), shown('ikisi de 4'))
  if (i === 4) return item('9 parçayla zemin serdim, kenarına duvar diktim.', dsCubeGrid(3, 3), shown('zemin 9 · duvar dik'))
  if (i === 5) return item('İki kule dikip aralarına çubuk uzattım: kemer tuttu.', '', shown('köprü kuruldu'))
  if (i === 6) return item('Önce "8 parça gerekir" dedim, kurdum: tam 8 çıktı.', dsCubeGrid(2, 4), shown('kestirdim 8 · gerçek 8'))
  if (i === 7) return item('Ölçtüm: kısa çubuk uzunun yarısı — uzunun yerine iki kısa gerekir.', dsRodPair(6, 3), shown('1 uzun = 2 kısa'))
  return item('Bir kat 6 parça. 3 katı KAT olarak saydım: 6 × 3 → 18.', dsCubeGrid(2, 3), shown('6 × 3 = 18'))
}

// ────────────────────────────────────────────────────────────────────────
// spviz — UZAMSAL GÖRSELLEŞTİRME · 7 düzey
// Ayrım ekseni: sığar mı diye deneme → fiziksel deneme-yanılma yerleştirme
// → kaydır+az döndür → hareketi ADLANDIR (yön şaşabilir) → zihinde kestirip
// SONRA dene (90°/180°) → çapraz eksen (45°) → hiç ellemeden yordama.
// Çoğu madde görselsiz: iş çocuğun elinde, kâğıtta değil.
// ────────────────────────────────────────────────────────────────────────
DS_EX.spviz = (i) => {
  if (i <= 0) return [ // SIĞAR MI — boyut keşfi
    item('Bu çubuk kutuya sığar mı? Önce bak, sonra dene.', dsRod(7), hint('sığar / sığmaz')),
    item('Sığmadıysa hangisini denersin? Kısasını al.', dsRodPair(7, 4), hint('kısa olanı')),
    item('Pulu deliğe koy: yassı yüzü mü, yan yüzü mü girer?', '', hint('yassı yüzü')),
  ]
  if (i === 1) return [ // FİZİKSEL DENEME-YANILMA — elle taşı, çevir, oturt
    item('Çubuğu çerçevedeki boşluğa oturtmayı dene.', dsFrame(1, 5, 0), hint('elinle çevirerek dene')),
    item('Olmadıysa çubuğu çevir, tekrar dene. Kaçıncıda oldu?', '', wbox()),
    item('Yatay dururken olmadı, dikey dururken oldu mu?', '', hint('yatay / dikey')),
  ]
  if (i === 2) return [ // KAYDIR + AZ DÖNDÜR — kolay görev, anlık ayar
    item('Pulu sola KAYDIR, sonra çubuğu biraz döndür.', dsChip('blue', null, 34), hint('kaydırma = yer değişir')),
    item('Çubuğu yatay yatır. Kaç delik görünüyor?', dsRod(5), wbox()),
    item('Kaydırmakla döndürmek aynı şey mi? Elinle göster.', '', hint('değil — biri yer, biri yön')),
  ]
  if (i === 3) return [ // HAREKETİ ADLANDIR — tür doğru, yön şaşabilir
    item('Çubuğu dikeyden yataya getirdim. Bu hangi hareket?', dsRod(4), hint('döndürme')),
    item('Pulu ayna gibi ters çevirdim. Bunun adı ne?', dsChip('red', null, 34), hint('yansıtma / çevirme')),
    item('Doğru hareketi seçtin ama ters yöne döndün. Düzelt.', '', hint('öbür yöne dön')),
  ]
  if (i === 4) return [ // ZİHİNDE 90°/180° — ÖNCE söyle, SONRA dene
    item('Çubuğu çeyrek tur döndürsen ne olur? Söyle, sonra dene.', dsRod(6), hint('yatay → dikey')),
    item('4 pullu dizi yarım tur dönerse ilk pul nereye gider?', dsChips(4, 'blue', 4), hint('en sona')),
    item('Kestirmen tuttu mu? Ellemeden bilebildin mi?', '', hint('tuttu / tutmadı')),
  ]
  if (i === 5) return [ // ÇAPRAZ EKSEN — 45°, köşegen
    item('Çubuğu köşeden köşeye, çapraz yerleştir.', dsGeoboard(4, 4, [[0, 0], [3, 3], [3, 0]]), hint('köşegen')),
    item('Pulu bir sağa BİR yukarı taşı. Bu çapraz mı?', dsFrame(3, 3, 0), hint('evet — çapraz kaydırma')),
    item('Eğik bir eksene göre çevirince şekil nereye düşer?', '', hint('eğik yönde')),
  ]
  return [ // TAMAMEN ZİHİNDEN — dokunma yok
    item('Ellemeden söyle: bu çubuk yarım tur dönerse nasıl durur?', dsRod(5, { fill: 3 }), hint('dolu uç öbür tarafa geçer')),
    item('Ellemeden söyle: 3 pullu L şekli çeyrek tur dönse?', '', wbox()),
    item('Söylediğini şimdi ellerinle dene. Zihnin doğru muydu?', '', hint('doğru / yanlış')),
  ]
}

DS_EG.spviz = (i) => {
  if (i <= 0) return item('Uzun çubuk sığmadı; kısasını aldım, sığdı.', dsRodPair(7, 4), shown('kısa olan sığdı'))
  if (i === 1) return item('Çevire çevire denedim, üçüncü denemede oturdu.', dsFrame(1, 5, 0), shown('3. denemede'))
  if (i === 2) return item('Pulu sola kaydırdım, çubuğu biraz döndürdüm: oturdu.', dsRod(5, { fill: 5 }), shown('kaydır + döndür'))
  if (i === 3) return item('Dikeyden yataya getirdim — bu döndürmedir, kaydırma değil.', dsRod(4), shown('döndürme'))
  if (i === 4) return item('Ellemeden "çeyrek tur dönerse dikey olur" dedim; tuttu.', dsRod(6), shown('çeyrek tur → dikey'))
  if (i === 5) return item('Pulu bir sağa bir yukarı taşıdım: çapraz kaydırma.', '', shown('çapraz kaydırma'))
  return item('Hiç dokunmadım: "yarım tur dönerse dolu uç sağa geçer" dedim.', dsRod(5, { fill: 3 }), shown('zihinden yordadım'))
}

// ────────────────────────────────────────────────────────────────────────
// sporient — UZAMSAL YÖNELİM · 10 düzey
// Ayrım ekseni: bedenle yöne dönme → kendi yolunu yineleme → yer imiyle
// saklama-bulma → KENDİNE göre yön (sağ/sol) → NESNELER arası konum →
// SABİT çerçeve (kendi dönse de) → haritayı mekâna eşleme → koordinat
// okuyup işaretleme → rotayı adım adım izleme → DÖNDÜRÜLMÜŞ harita + kendi
// haritanı çizme.
// ────────────────────────────────────────────────────────────────────────
DS_EX.sporient = (i) => {
  if (i <= 0) return [ // BEDENLE YÖN — ad yok, hareket var
    item('Sesin geldiği yöne dön. Hangi tarafa döndün?', '', hint('o tarafa')),
    item('Masaya bir pul koy, ona doğru uzan. Yakaladın mı?', dsChip('blue', null, 34), hint('uzandım')),
    item('Şimdi arkanı dön, aynı pula yeniden uzan.', '', hint('yön değişti')),
  ]
  if (i === 1) return [ // KENDİ YOLU — yolu hatırla, geri dön
    item('Kapıya kadar yürü, sonra hiç bakmadan geri gel.', '', hint('aynı yolu izle')),
    item('Kaç adım gittin? Yolu çubukla say: her adım bir delik.', dsRod(6), wbox()),
    item('Dönüşte kaç kez döndün? Sağa mı sola mı?', '', wbox()),
  ]
  if (i === 2) return [ // YER İMİ — sakla, sonra bul
    item('Pulu bir çubuğun altına sakla. Sonra yerini bul.', dsRod(5), hint('çubuk = yer imi')),
    item('Neye bakarak buldun? Yakındaki neyi kullandın?', '', wbox()),
    item('Yer imini kaldırırsam yine bulabilir misin? Dene.', '', hint('zorlaşır')),
  ]
  if (i === 3) return [ // KENDİNE GÖRE — sağ/sol/ön/arka
    item('Sağına mavi pul, soluna kırmızı pul koy.', dsChip('blue', null, 30) + dsChip('red', null, 30), hint('sağ · sol')),
    item('Çubuğu önüne koy. Şimdi arkana koy. Fark ne?', dsRod(4), hint('ön · arka')),
    item('Arkanı dön. Mavi pul hâlâ sağında mı? Pencereye bakarak pulu yeniden bul.', '', hint('hayır, solunda — pencere yer imi şaşmaz')),
  ]
  if (i === 4) return [ // NESNELER ARASI — kendine değil, nesneye göre
    item('Pulu iki çubuğun ARASINA koy. Neyin arasında?', dsRodPair(4, 4), hint('iki çubuğun arasında')),
    item('Mavi pulun YANINDAKİ deliğe sarı pul koy.', dsFrame(1, 5, 1), hint('yanına')),
    item('Konumu bana anlat ama "benim sağım" deme.', '', hint('nesneye göre söyle')),
  ]
  if (i === 5) return [ // SABİT ÇERÇEVE — sen dönsen de yer değişmez
    item('Çubuğu kapıya bakan kenara koy. Şimdi sen dön: yeri değişti mi?', dsRod(5), hint('değişmedi')),
    item('İki pulun tam ORTASINA üçüncü pulu koy.', dsChips(3, 'green', 3), hint('tam ortası')),
    item('Odada yerin neresi? Duvara göre söyle, kendine göre değil.', '', wbox()),
  ]
  if (i === 6) return [ // HARİTA — kuş bakışı eşleme
    item('Masanın kuş bakışı krokisini çiz. Çubuk nerede?', dsFrame(3, 3, 0), hint('krokiye işaretle')),
    item('Krokide işaretlediğin yere gerçekte pul koy.', dsChip('yellow', null, 34), hint('harita → gerçek')),
    item('Krokideki yer ile gerçek yer uyuştu mu?', '', hint('uydu / kaydı')),
  ]
  if (i === 7) return [ // KOORDİNAT — sütun sonra sıra
    item('2. sütun, 3. sıradaki deliğe pul koy.', dsFrame(3, 4, 0), hint('önce sütun, sonra sıra')),
    item('İkinci sıradaki dolu deliğin koordinatı ne? Sütun ve sırayı yaz.', dsFrame(3, 4, 5), eqRow(`sütun ${wbox()} · sıra ${wbox()}`)),
    item('Sütunu ve sırayı karıştırırsan hangi deliğe düşersin?', '', hint('başka bir deliğe')),
  ]
  if (i === 8) return [ // ROTA — adım adım yön + uzaklık
    item('Rotayı izle: 3 delik ilerle, sağa dön, 2 delik ilerle.', dsRod(6, { fill: 3 }), hint('adım adım')),
    item('Bittiğin yeri pulla işaretle. Doğru yerde misin?', dsFrame(3, 4, 0), hint('hedefi işaretle')),
    item('Aynı rotayı bir arkadaşına sözle anlat.', '', hint('düz git · dön · dur')),
  ]
  return [ // DÖNDÜRÜLMÜŞ HARİTA + KENDİ HARİTAN
    item('Krokiyi yarım tur çevir. Çubuk şimdi krokinin neresinde?', dsFrame(3, 3, 0), hint('yeri aynı, kroki döndü')),
    item('Kroki ters dururken pulu doğru deliğe koyabildin mi?', dsChip('red', null, 34), hint('döndüğünü hesaba kat')),
    item('Şimdi kendin bir kroki çiz: yer imlerini de koy.', '', hint('kendi haritan')),
  ]
}

DS_EG.sporient = (i) => {
  if (i <= 0) return item('Ses sağdan geldi, o yöne döndüm ve pula uzandım.', dsChip('blue', null, 34), shown('yöne döndüm'))
  if (i === 1) return item('Kapıya 6 adım gittim, aynı yoldan 6 adım geri geldim.', dsRod(6, { fill: 6 }), shown('6 adım gidiş-dönüş'))
  if (i === 2) return item('Pulu çubuğun altına sakladım; çubuğa bakıp buldum.', dsRod(5), shown('yer imi = çubuk'))
  if (i === 3) return item('Mavi pul solumda, kırmızı sağımda. Dönünce yer değiştirdiler.', dsChip('blue', null, 30) + dsChip('red', null, 30), shown('dönünce: sağ mavi · sol kırmızı'))
  if (i === 4) return item('Pulu iki çubuğun arasına koydum — kendime göre değil.', dsRodPair(4, 4), shown('ikisinin arasında'))
  if (i === 5) return item('Ben döndüm ama çubuk hâlâ kapıya bakan kenardaydı.', dsRod(5), shown('yer sabit kaldı'))
  if (i === 6) return item('Krokide çubuğu işaretledim, gerçekte de oraya koydum.', dsFrame(3, 3, 1), shown('kroki = gerçek'))
  if (i === 7) return item('Önce 2 sütun saydım, sonra 3 sıra: kesiştiği deliğe pul.', '', shown('2. sütun · 3. sıra'))
  if (i === 8) return item('3 delik ilerledim, sağa döndüm, 2 delik daha: hedefteyim.', '', shown('3 ilerle · sağa · 2 ilerle'))
  return item('Kroki ters döndü ama çubuğun gerçek yeri değişmedi; ben çevirip okudum.', dsFrame(3, 3, 0), shown('döndürülmüş krokiyi okudum'))
}

// ── ajan E ──────────────────────────────────────────
// ────────────────────────────────────────────────────────────────────────
// mlen — ÖLÇME: UZUNLUK · 12 düzey
// Ayrım ekseni: bedensel sezgi → adlandırma → uçları hizalayarak doğrudan
// kıyas → aracı nesneyle dolaylı kıyas → seriasyon(5) → uç uca döşeme →
// seriasyon(6+, araya yerleştirme/geçişlilik) → TEK birimi kaydırarak
// tekrarlama → cetvel + sıfır noktası → zihinsel birim (tahmin-doğrula) →
// eklemeli uzunluk (çevre) → birim dönüştürme.
// ────────────────────────────────────────────────────────────────────────
DS_EX.mlen = (i) => {
  if (i === 0) return [ // BEDENSEL — ölçme yok, uzunluğu elle yaşama
    item('Uzun çubuğu al, kısa çubuğu al. Hangisi elini aşar?', dsRodPair(2, 8), hint('uzun olanı göster')),
    item('İki çubuğu koluna daya. Hangisi dirseğini geçti?', '', hint('kolunla kıyasla')),
    item('Odada kolundan uzun bir şey bul ve dokun.', '', hint('kol boyu ölçün olsun')),
  ]
  if (i === 1) return [ // ADLANDIRMA — uzunluk artık bir sözcük
    item('Hangisi UZUN? Uzun olanı yuvarlak içine al.', dsRodPair(3, 7), hint('7 delikli olan')),
    item('Hangisi KISA? Önce söyle, sonra göster.', dsRodPair(9, 4), hint('4 delikli olan')),
    item('Çevrenden bir uzun bir kısa nesne söyle.', '', hint('sözcükle anlat')),
  ]
  if (i === 2) return [ // DOĞRUDAN KIYAS — asıl iş: UÇLARI HİZALAMAK
    item('İki çubuğu koy. SOL uçları aynı çizgide mi?', dsRodPair(5, 8), hint('önce uçları hizala')),
    item('Uçlar hizasız olursa karşılaştırma adil olur mu?', '', hint('olmaz — baştan hizala')),
    item('Kalemini çubukla hizala: hangisi taşıyor?', dsRod(6), hint('taşan olan uzun')),
  ]
  if (i === 3) return [ // DOLAYLI KIYAS — araya ARACI nesne girer
    item('Kapı ile pencere yan yana gelmez. Araya ne koyarsın?', '', hint('ip ya da çubuk')),
    item('Bu çubuğu kapıya, sonra pencereye götür. Hangisi geniş?', dsRod(7), hint('çubuk aracı olur')),
    item('İpi masaya göre işaretle, kesmeden dolaba götür.', '', hint('aynı ip, iki yer')),
  ]
  if (i === 4) return [ // SERİASYON (5) — merdiven kurma
    item('1-2-3-4-5 delikli çubuklarla merdiven kur.', '', hint('kısadan uzuna')),
    item('Önce en kısayı ayır, kalandan yine en kısayı bul.', dsRodPair(1, 2), hint('her turda en kısa')),
    item('Dizin basamak gibi mi? Elini üstünden geçir.', dsRodPair(2, 4), hint('düzgün merdiven')),
  ]
  if (i === 5) return [ // UÇ UCA DÖŞEME — boşluksuz, bindirmesiz
    item('Kalemi ölç: çubukları UÇ UCA, boşluksuz diz.', dsRod(3) + dsRod(4), eqRow(`3 ve 4 → ${wboxBig()} birim`)),
    item('Çubuklar üst üste binerse ölçü ne olur?', '', hint('yanlış çıkar — bindirme yok')),
    item('Masa kenarını çubuklarla döşe, sonra çubukları say.', '', wbox()),
  ]
  if (i === 6) return [ // SERİASYON (6+) — araya yerleştirme, geçişlilik
    item('Sırada boşluk var. Bu çubuk nereye girer?', dsRod(6, { fill: 6 }), hint('5 ile 7 arasına')),
    item('Elindeki 7 delikli çubuk üsttekinden uzun mu, alttakinden kısa mı?', dsRodPair(6, 8), hint('ikisine birden bak')),
    item('A, B den uzun; B, C den uzun. A ile C hangisi uzun?', '', hint('A — kıyaslamadan bilinir')),
  ]
  if (i === 7) return [ // BİRİM TEKRARI — TEK çubuk, kaydırarak
    item('TEK çubukla masayı ölç: koy, bittiği yeri tut, kaydır.', dsRod(3), hint('kaç kez koydun?')),
    item('Kaydırırken parmağını çekersen ne olur?', '', hint('yer kayar, ölçü bozulur')),
    item('Tek çubuğu 4 kez koydun. Uzunluk kaç birim?', '', eqRow(`4 × 1 birim = ${wboxBig()}`)),
  ]
  if (i === 8) return [ // CETVEL — sıfır noktası yanılgısı tam burada
    item('Nesne cetvelin başına hizalı mı? Kaç birim?', dsMeasureOnRuler(4, 7), wbox()),
    item('Nesneyi 1. çizgiden başlatırsan ölçü doğru olur mu?', dsRuler(6), hint('olmaz — baştan hizala')),
    item('Cetvel neyi sayar: çizgileri mi, aralıkları mı?', '', hint('aralıkları — birimleri')),
  ]
  if (i === 9) return [ // ZİHİNSEL BİRİM — önce tahmin, sonra doğrula
    item('Cetvele BAKMADAN tahmin et: kalem kaç birim?', '', eqRow(`tahmin ${wbox()} · ölçüm ${wbox()}`)),
    item('Şimdi ölç. Tahminin ne kadar yakın çıktı?', dsMeasureOnRuler(5, 8), wbox()),
    item('Bir birim ne kadardı? Parmaklarınla göster.', dsRod(1), hint('birimi zihninde taşı')),
  ]
  if (i === 10) return [ // EKLEMELİ UZUNLUK — parçalara böl, topla (çevre)
    item('Kenarlar 4 ve 2 birim. Çevre kaç birim?', dsRodPair(4, 2), eqRow(`4+2+4+2 = ${wboxBig()}`)),
    item('Köşeli yolu düz parçalara böl, sonra topla.', '', hint('parçaların toplamı')),
    item('2, 3 ve 4 delikli çubukları ekle. Yol kaç birim?', dsRod(3), eqRow(`2+3+4 = ${wboxBig()}`)),
  ]
  return [ // BİRİM DÖNÜŞTÜRME — birim küçülünce sayı büyür
    item('Masa 20 ataç. Bir ataç 3 cm ise masa kaç cm?', '', eqRow(`20 × 3 = ${wboxBig()}`)),
    item('Aynı masayı uzun çubukla ölçtün: sayı artar mı azalır?', dsRodPair(2, 6), hint('birim büyür, sayı küçülür')),
    item('Kapı 5 uzun çubuk. Kısa çubuk yarısıysa kaç kısa çubuk?', '', wbox()),
  ]
}

DS_EG.mlen = (i) => {
  if (i === 0) return item('Uzun çubuk kolumu aştı, kısa olan aşmadı.', dsRodPair(2, 8), shown('uzun olan'))
  if (i === 1) return item('"Bu uzun, bu kısa" dedim — daha ölçmedim.', dsRodPair(3, 7), shown('uzun: 7 delikli'))
  if (i === 2) return item('Sol uçları hizaladım, sağdan taşan uzun çıktı.', dsRodPair(5, 8), shown('8 delikli uzun'))
  if (i === 3) return item('Çubuğu kapıya göre işaretledim, pencereye götürdüm.', dsRod(7), shown('aracı çubuk karar verdi'))
  if (i === 4) return item('En kısayı ayırdım, kalandan yine en kısayı aldım.', dsRodPair(1, 2), shown('1-2-3-4-5 merdiveni'))
  if (i === 5) return item('3 ve 4 delikli çubuğu uç uca, boşluksuz dizdim.', dsRod(3) + dsRod(4), shown('3 ve 4 → 7 birim'))
  if (i === 6) return item('6 delikli çubuk 5 ile 7 arasına girdi.', dsRod(6, { fill: 6 }), shown('araya doğru yerleşti'))
  if (i === 7) return item('Tek çubuğu bittiği yere kaydırdım, 4 kez koydum.', dsRod(3), shown('4 birim'))
  if (i === 8) return item('Nesneyi cetvelin ta başına hizaladım, sonra okudum.', dsMeasureOnRuler(4, 7), shown('4 birim'))
  if (i === 9) return item('Bakmadan "5 birim" dedim; ölçtüm, 5 çıktı.', dsMeasureOnRuler(5, 8), shown('tahmin 5 · ölçüm 5'))
  if (i === 10) return item('Çevreyi kenar kenar ölçüp topladım.', dsRodPair(4, 2), shown('4+2+4+2 = 12'))
  return item('20 ataç, her ataç 3 cm — birimi çarpan gibi kullandım.', '', shown('20 × 3 = 60 cm'))
}

// ────────────────────────────────────────────────────────────────────────
// marea — ÖLÇME: ALAN (2B, birimi birim KARE) · 8 düzey
// Ayrım ekseni: bedensel kaplama → adlandırma → karolarla kaplayıp sayma →
// boşluksuz/örtüşmesiz kaplama → TEK karoyu tekrarlama → satırı birim görme
// → satır-sütun ızgarası → çarpımsal (görselsiz).
// ────────────────────────────────────────────────────────────────────────
DS_EX.marea = (i) => {
  if (i === 0) return [ // BEDENSEL — yüzeyi elle kaplama
    item('Avucunu masaya bas. Masa kaç avuç yer kaplar?', '', hint('elinle yokla')),
    item('Hangisi daha çok yer kaplar? Üst üste koy.', dsCubeGridPair({ r: 2, c: 3 }, { r: 3, c: 4 }), hint('taşan olan')),
    item('Pulları yüzeye yay: yüzeyin hepsi kapandı mı?', dsChips(6, 'blue', 3), hint('boş yer kaldı mı?')),
  ]
  if (i === 1) return [ // ADLANDIRMA — "geniş" bir nicelik adı olur
    item('Hangisi daha GENİŞ? Geniş olanı göster.', dsCubeGridPair({ r: 2, c: 2 }, { r: 2, c: 5 }), hint('sağdaki')),
    item('"Daha çok yer kaplıyor" derken neyi anlatırsın?', '', hint('yüzeyin büyüklüğünü')),
    item('Uzun olan hep daha mı geniştir?', dsCubeGridPair({ r: 1, c: 6 }, { r: 3, c: 3 }), hint('değil — 6 ve 9 kare')),
  ]
  if (i === 2) return [ // KAPLAYIP SAYMA — kaplama henüz düzensiz olabilir
    item('Yüzeyi birim KARELERLE kapla, sonra kareleri say.', dsCubeGrid(3, 4), wbox()),
    item('Pulları yüzeye diz: kaç pul sığdı?', dsChips(8, 'red', 4), wbox()),
    item('Sayarken bir kareyi iki kez saymamaya dikkat et.', '', hint('her kareyi bir kez')),
  ]
  if (i === 3) return [ // TAM KAPLAMA — boşluk ve örtüşme yok
    item('Kaplamada boşluk var. Kaç birim kare EKSİK?', dsCubeGrid(3, 4, 9), eqRow(`9 dolu · ${wbox()} boş`)),
    item('Kareler üst üste binerse alan doğru çıkar mı?', '', hint('çıkmaz — bindirme yok')),
    item('Çubukları YAN YANA sıkıca diz: yüzey tam doldu mu?', dsRod(4), hint('aralarında boşluk kalmasın')),
  ]
  if (i === 4) return [ // BİRİM TEKRARI — tek karo kaydırılır, izi tutulur
    item('TEK bir kareyi kaydırarak yüzeyi ölç: kaç kez sığdı?', dsCubeGrid(1, 1), wbox()),
    item('Koyduğun yeri işaretlemezsen ne olur?', '', hint('yer karışır, sayı yanlış')),
    item('Kareyi 3 aşağı, 4 yana kaydırdın. Kaç birim kare?', '', eqRow(`${wbox()} birim kare`)),
  ]
  if (i === 5) return [ // SATIR = BİRİM — sıra bütün olarak görülür
    item('BİR SIRADA kaç kare var? Yalnız o sırayı say.', dsCubeGrid(3, 5), wbox()),
    item('Bütün sıralarda aynı sayıda kare var mı?', '', hint('evet — sıralar eşit')),
    item('Bir sırayı çubukla göster: çubuk kaç kare uzunlukta?', dsRod(5), wbox()),
  ]
  if (i === 6) return [ // IZGARA — satır × sütun yapısı kurulur
    item('Kaç sıra var, her sırada kaç kare? Sonra topla.', dsCubeGrid(3, 4), eqRow(`4+4+4 = ${wboxBig()}`)),
    item('Kareleri 2 sıra 6 sütun dizdin. Kaç birim kare?', '', eqRow(`${wbox()} sıra × ${wbox()} sütun = ${wboxBig()}`)),
    item('4 delikli 3 çubuğu yan yana dizdin. Kaç birim kare?', dsRod(4), eqRow(`3 × 4 = ${wboxBig()}`)),
  ]
  return [ // ÇARPIMSAL — kare çizmeden, yalnız satır ve sütun sayısıyla
    item('5 sıra, her sırada 6 kare. Çizme — alan kaç?', '', eqRow(`5 × 6 = ${wboxBig()}`)),
    item('Alanı 12 birim kare olan kaç ayrı dikdörtgen kurulur?', '', hint('3×4 · 2×6 · 1×12')),
    item('Kenarlar 4 ve 3 birim. Alanın birimi nedir?', dsCubeGrid(3, 4), hint('birim KARE')),
  ]
}

DS_EG.marea = (i) => {
  if (i === 0) return item('Elimle yokladım: büyük olan daha çok yer kapladı.', dsCubeGridPair({ r: 2, c: 3 }, { r: 3, c: 4 }), shown('sağdaki geniş'))
  if (i === 1) return item('"Bu daha geniş" dedim — henüz saymadım.', dsCubeGridPair({ r: 2, c: 2 }, { r: 2, c: 5 }), shown('sağdaki'))
  if (i === 2) return item('Kareleri yüzeye dizdim ve saydım: 12.', dsCubeGrid(3, 4), shown('12 birim kare'))
  if (i === 3) return item('Boşluk kalmıştı; 3 kare ekleyince kaplama tam oldu.', dsCubeGrid(3, 4, 9), shown('9 + 3 = 12'))
  if (i === 4) return item('Tek kareyi kaydırdım, her yeri işaretledim: 12 kez.', dsCubeGrid(1, 1), shown('12 birim kare'))
  if (i === 5) return item('Bir sırayı bütün gördüm: 5. Sıralar eşitti.', dsCubeGrid(3, 5), shown('bir sırada 5'))
  if (i === 6) return item('3 sıra, her sırada 4: 4+4+4 dedim.', dsCubeGrid(3, 4), shown('4+4+4 = 12'))
  return item('Kareyi hiç görmeden: 5 sıra × 6 kare.', '', shown('5 × 6 = 30 birim kare'))
}

// ────────────────────────────────────────────────────────────────────────
// mvol — ÖLÇME: HACİM (3B, birimi birim KÜP) · 8 düzey
// Ayrım ekseni: doldur-boşalt → adlandırma → boşluksuz paketleme →
// sayma + görünmeyen küpler → TEK birim kabı tekrarlama → katman = birim →
// katman katman örgütleme → çarpımsal (en × boy × yükseklik).
// ────────────────────────────────────────────────────────────────────────
DS_EX.mvol = (i) => {
  if (i === 0) return [ // BEDENSEL — doldurmak ve boşaltmak
    item('Kabı doldur, sonra boşalt. Dolunca eline ne oluyor?', '', hint('ağırlaşıyor — dolu')),
    item('Küçük kabı büyüğün içine sok. Hangisi çok alır?', '', hint('büyük olan')),
    item('Kutuya küpleri doldur, hepsini boşalt, yine doldur.', dsCubeStack(4), hint('doldur-boşalt')),
  ]
  if (i === 1) return [ // ADLANDIRMA — kapasite karşılaştırılan bir nicelik
    item('Hangi kule daha çok küp tutar? Göster.', dsCubeGridPair({ r: 4, c: 2 }, { r: 2, c: 2 }), hint('soldaki')),
    item('"Doldu", "taştı", "boş" hangi durumu anlatır?', '', hint('kabın ne kadar aldığını')),
    item('Uzun ince kap mı, geniş alçak kap mı çok alır? Dene.', '', hint('dökerek dene')),
  ]
  if (i === 2) return [ // PAKETLEME — içi bir birimle doldurmak
    item('Küpleri kutuya BOŞLUKSUZ yerleştir. Boşluk kaldı mı?', dsCubeStack(5), hint('sıkı paketle')),
    item('Küçük bardakla büyük kabı kepçe kepçe doldur.', '', hint('hep aynı bardak')),
    item('Çubukları KAT olarak üst üste diz. Kaç kat oldu?', dsRod(4), wbox()),
  ]
  if (i === 3) return [ // SAYMA — görünmeyen alt/iç küpler unutulmasın
    item('Kutuda kaç küp var? Alttakileri de say.', dsCubeStack(6), wbox()),
    item('Yalnız üstten görünenleri sayarsan doğru olur mu?', '', hint('olmaz — iç küpler de var')),
    item('Taban dolu, üstü boş. Kutu doldu mu?', dsCubeGrid(2, 4), hint('dolmadı — kat eksik')),
  ]
  if (i === 4) return [ // BİRİM TEKRARI — tek kap, kaç kez
    item('TEK bardakla kovayı doldur: kaç kez doldurdun?', '', wbox()),
    item('Ortada bardağı değiştirirsen sayın ne olur?', '', hint('bozulur — birim aynı kalmalı')),
    item('3 delikli çubuğu 5 kez üst üste koydun. Kaç birim küp?', dsRod(3), eqRow(`5 × 3 = ${wboxBig()}`)),
  ]
  if (i === 5) return [ // KATMAN = BİRİM — bir kat bütün olarak görülür
    item('BİR KATTA kaç küp var? Yalnız o katı say.', dsCubeGrid(3, 4), wbox()),
    item('Her kat aynı sayıda küp mü tutar?', '', hint('evet — katlar eşit')),
    item('Bir katı çubuklarla kur: 3 çubuk, her biri 4 delik.', dsRod(4), eqRow(`${wbox()} küp bir katta`)),
  ]
  if (i === 6) return [ // KATMAN KATMAN — kat bulunur, kat sayısıyla yinelenir
    item('Her katta 6 küp, 3 kat var. Toplam kaç küp?', dsCubeStack(3), eqRow(`6+6+6 = ${wboxBig()}`)),
    item('İçte kalan, görünmeyen küpleri de saydın mı?', '', hint('kutunun içi de dolu')),
    item('Çubukları 4 KAT diz, her kat 5 delik. Kaç birim küp?', '', eqRow(`4 × 5 = ${wboxBig()}`)),
  ]
  return [ // ÇARPIMSAL — küp dizmeden, yalnız boyut sayılarıyla
    item('En 4, boy 3, yükseklik 2. Dizme — kaç küp sığar?', '', eqRow(`4 × 3 × 2 = ${wboxBig()}`)),
    item('Önce bir katı bul, sonra kat sayısıyla çarp.', '', eqRow(`(4 × 3) × 2 = ${wboxBig()}`)),
    item('Hacmin birimi nedir: birim kare mi, birim küp mü?', dsCubeGrid(2, 3), hint('birim KÜP')),
  ]
}

DS_EG.mvol = (i) => {
  if (i === 0) return item('Kutuyu küplerle doldurdum, sonra boşalttım.', dsCubeStack(4), shown('dolu · boş'))
  if (i === 1) return item('"Soldaki daha çok alır" dedim — henüz saymadım.', dsCubeGridPair({ r: 4, c: 2 }, { r: 2, c: 2 }), shown('soldaki'))
  if (i === 2) return item('Küpleri boşluk kalmayacak biçimde sıkıştırdım.', dsCubeStack(5), shown('boşluksuz paket'))
  if (i === 3) return item('Alttaki küpleri de saydım, yalnız görüneni değil: 6.', dsCubeStack(6), shown('6 birim küp'))
  if (i === 4) return item('Aynı çubuğu 5 kez üst üste koydum.', dsRod(3), shown('5 × 3 = 15 birim küp'))
  if (i === 5) return item('Bir katı bütün gördüm: 3 sıra × 4 = 12.', dsCubeGrid(3, 4), shown('bir katta 12'))
  if (i === 6) return item('Bir kat 6 küp, 3 kat var: katman katman saydım.', dsCubeStack(3), shown('6+6+6 = 18'))
  return item('Hiç küp dizmedim: 4 × 3 bir kat, sonra 2 kat.', '', shown('4 × 3 × 2 = 24 birim küp'))
}

// ────────────────────────────────────────────────────────────────────────
// mang — ÖLÇME: AÇI ve DÖNME · 6 düzey
// Ayrım ekseni: açılma-kapanmayı sezme → açıyı KURMA → yapı içinde örtük
// kullanım → açı EŞLEME (kol uzunluğu ≠ açı) → karşılaştırma/sıralama →
// birimle ölçme (dik açı / çeyrek dönüş).
// İki çubuğu köşeden birleştir: açıklık değişir, kol uzunluğu değişmez.
// ────────────────────────────────────────────────────────────────────────
DS_EX.mang = (i) => {
  if (i === 0) return [ // BEDENSEL — açılıyor mu, kapanıyor mu
    item('Makası aç, kapa. Aradaki boşluk büyüdü mü küçüldü mü?', '', hint('elinle hisset')),
    item('İki çubuğu köşeden birleştir, yavaşça aç.', dsAngle(30), hint('açıklık büyür')),
    item('Kapı azıcık mı açık, ardına kadar mı? Elinle göster.', '', hint('az açık / çok açık')),
  ]
  if (i === 1) return [ // KURMA — açıyı çocuk kendisi oluşturur
    item('İki çubukla V kur. Şimdi açıklığı BÜYÜT.', dsAngle(45), hint('kolları uzaklaştır')),
    item('Aynı çubuklarla dar bir köşe kur.', dsAngle(20), hint('kolları yaklaştır')),
    item('Çatı gibi bir köşe kur, sonra yavaşça düzleştir.', '', hint('açıklık artar')),
  ]
  if (i === 2) return [ // ÖRTÜK KULLANIM — yapı kurarken açıyı gözetme
    item('Çubuklarla KARE köşesi kur: köşe dik oldu mu?', dsAngle(90), hint('dik köşe')),
    item('Parça boşluğa oturmadı. Çevir: hangi köşe uyuyor?', '', hint('köşeyi eşle')),
    item('İki çubuğu paralel diz. Aralarında köşe var mı?', '', hint('yok — hiç açılmamış')),
  ]
  if (i === 3) return [ // EŞLEME — yörüngenin darboğazı: kol uzunluğu tuzağı
    item('Kollar farklı uzun, açıklık aynı. Aynı açı mı?', dsAngle(40, 36) + dsAngle(40, 72), hint('evet — açıklık aynı')),
    item('Uzun kollu olan daha büyük açı mıdır?', '', hint('değil — kol açı değildir')),
    item('Kısa çubukla kurduğun köşeyi uzun çubukla eşle.', dsAngle(60), hint('üst üste getir')),
  ]
  if (i === 4) return [ // KARŞILAŞTIRMA — açıklığa göre sıralama
    item('Hangi açı daha GENİŞ? Kol uzunluğuna bakma.', dsAnglePair(25, 70), hint('sağdaki')),
    item('Üç köşeyi en sivriden en genişe sırala.', '', hint('ölçüt: açıklık')),
    item('Çubuklarla kurduğun açıyı buradakiyle kıyasla.', dsAngle(50), hint('daha geniş mi, dar mı?')),
  ]
  return [ // ÖLÇME — tekrarlanan birim (dik açı / çeyrek dönüş)
    item('Dik açıyı birim al: bu açı ondan büyük mü küçük mü?', dsAngle(120), hint('büyük')),
    item('Tam dönüş 4 dik açı. Yarım dönüş kaç dik açı?', '', eqRow(`${wbox()} dik açı`)),
    item('Çeyrek dönüşü kaç kez yaparsan başa dönersin?', '', wbox()),
  ]
}

DS_EG.mang = (i) => {
  if (i === 0) return item('Çubukları köşeden tutup açtım: boşluk büyüdü.', dsAngle(30), shown('açıldı'))
  if (i === 1) return item('Kolları uzaklaştırdım, açıklığı ben büyüttüm.', dsAngle(45), shown('daha açık'))
  if (i === 2) return item('Kare köşesini kurarken köşeyi dik tuttum.', dsAngle(90), shown('dik köşe'))
  if (i === 3) return item('Kollar farklı uzunluktaydı ama açıklık aynıydı.', dsAngle(55, 34) + dsAngle(55, 70), shown('aynı açı'))
  if (i === 4) return item('Kola değil açıklığa baktım: sağdaki daha geniş.', dsAnglePair(25, 70), shown('sağdaki geniş'))
  return item('Dik açıyı birim aldım: bu açı ondan büyük.', dsAngle(120), shown('1 dik açıdan büyük'))
}

// ────────────────────────────────────────────────────────────────────────
// classif — SINIFLAMA ve VERİ ANALİZİ · 11 düzey
// Ayrım ekseni: eşini buluşturma → kendi ölçütüyle kaba ayırma → tek ölçütte
// tutarlılık → VERİLEN ölçüt + çeldirici → ölçüt DEĞİŞTİRME (esneklik) →
// hazır veriyi okuma → sınıfla ve say → iki ölçüt kesişimi → veri TOPLAMA →
// kapsama/hiyerarşi → sütun grafiğiyle temsil.
// Pullar renge göre öbeklenir; çubuk uzunluğu sütun grafiğinin sütunudur.
// ────────────────────────────────────────────────────────────────────────
DS_EX.classif = (i) => {
  if (i === 0) return [ // SEZGİSEL EŞLEME — "bu da onun gibi"
    item('Aynı renk pulları yan yana koy. Hangileri eş?', dsChips(4, 'blue', 4), hint('aynı olanı buluştur')),
    item('Bu pulun eşini bul ve üstüne değdir.', dsChip('red', null, 34), hint('kırmızıyı kırmızıya')),
    item('Kutudan birbirine benzeyen iki nesne çıkar.', '', hint('benzerliği sez')),
  ]
  if (i === 1) return [ // KABA AYIRMA — ölçütü çocuk seçer
    item('Pulları BENZEYENLER bir arada olacak şekilde ayır.', dsChips(6, 'blue', 3), hint('ölçütünü kendin seç')),
    item('Neye göre ayırdın: renge mi, biçime mi? Söyle.', '', hint('ölçütünü adlandır')),
    item('Şekilleri iki öbeğe ayır.', dsShapeRow(['circle', 'triangle', 'circle', 'square']), hint('benzeyenler bir arada')),
  ]
  if (i === 2) return [ // TEK ÖLÇÜT — oyun boyunca ölçüt kaymaz
    item('Pulları RENGE göre ayır. Kaç renk öbeği oldu?', dsChips(4, 'red', 4) + dsChips(2, 'yellow', 2), wbox()),
    item('Ayırma bitene kadar ölçütünü değiştirdin mi?', '', hint('aynı ölçütte kal')),
    item('Mavileri bir çubuğa, kırmızıları ötekine diz.', dsChips(4, 'blue', 4) + dsChips(3, 'red', 3), hint('ölçüt: renk')),
  ]
  if (i === 3) return [ // VERİLEN ÖLÇÜT — çeldiriciler arasından tutarlı seçim
    item('Yalnız KIRMIZI olanları seç. Boya bakma.', dsChips(4, 'red', 4) + dsChip('red', null, 40) + dsChips(2, 'blue', 2), hint('ölçüt: renk')),
    item('Aralarında sevdiğin bir mavi var. Onu alır mısın?', '', hint('almazsın — ölçüt kırmızı')),
    item('Yalnız ÜÇGEN olanları işaretle.', dsShapeRow(['triangle', 'circle', 'triangle', 'square']), wbox()),
  ]
  if (i === 4) return [ // ESNEKLİK — aynı nesneler, YENİ ölçütle baştan
    item('Önce renge ayır. Şimdi AYNI nesneleri şekle göre ayır.', dsChip('blue', null, 34) + dsChip('red', null, 34) + dsShape('circle') + dsShape('square'), hint('yeni ölçüt, baştan')),
    item('Aynı nesneler kaç ayrı yolla sınıflanabilir?', '', hint('renk, biçim, boy…')),
    item('Eski gruplamana saplanmadan yeniden ayırabildin mi?', dsChips(6, 'green', 3), hint('nesne aynı, ölçüt başka')),
  ]
  if (i === 5) return [ // VERİYİ OKUMA — hazır düzenlenmiş öbekleri yorumlama
    item('En ÇOK hangi renkten var? Öbekleri karşılaştır.', dsChips(5, 'red', 5) + dsChips(3, 'blue', 3), hint('kırmızı — 5')),
    item('Bu iki öbek eşit mi, biri mi çok?', dsRodPair(4, 4, { fillA: 4, fillB: 4 }), hint('eşit')),
    item('"Daha çok" grafikte ne demek: uzun mu, kısa mı?', '', hint('uzun sütun = çok')),
  ]
  if (i === 6) return [ // SINIFLA ve SAY — öbek artık nicelenir
    item('Pulları renge ayır, sonra HER öbeği ayrı say.', dsChips(4, 'yellow', 4) + dsChips(2, 'blue', 2), eqRow(`sarı ${wbox()} · mavi ${wbox()}`)),
    item('Öbeklerin adını ve sayısını bir çizelgeye yaz.', '', eqRow(`${wbox()} · ${wbox()} · ${wbox()}`)),
    item('Kaç öbek kurdun, hepsinde toplam kaç pul var?', dsFrame(2, 5, 7), wbox()),
  ]
  if (i === 7) return [ // KESİŞİM — iki ölçüt aynı anda doğru olmalı
    item('Hem MAVİ hem YUVARLAK olanları seç.', dsChip('blue', null, 34) + dsChip('red', null, 34) + dsShape('square') + dsShape('circle'), hint('ikisi de doğru olmalı')),
    item('Mavi ama köşeli olanı alır mısın?', '', hint('almazsın — bir ölçüt eksik')),
    item('Hem MAVİ pullu hem 3 delikli çubuğu bul.', dsRod(3, { fill: 3 }), hint('iki ölçüt birden')),
  ]
  if (i === 8) return [ // VERİ TOPLAMA — soruyu sor, çeteleyi tut
    item('Arkadaşlarına en sevdikleri rengi sor, çetele tut.', '', eqRow(`mavi ${wbox()} · kırmızı ${wbox()}`)),
    item('Her yanıt için bir pul koy. Kaç pul birikti?', dsChips(6, 'blue', 6), wbox()),
    item('Soruyu herkese aynı biçimde sordun mu?', '', hint('aynı soru — adil veri')),
  ]
  if (i === 9) return [ // KAPSAMA — alt sınıf üst sınıfın içindedir
    item('Bütün kareler dikdörtgen midir? Neden?', dsShapeRow(['square', 'rect'], true), hint('evet — dördü de dik açı')),
    item('Bütün dikdörtgenler kare midir?', '', hint('değil — kare alt sınıf')),
    item('Mavi pullar "pul"un içinde mi, pul mavinin mi?', dsChip('blue', null, 34), hint('mavi, pulun içinde')),
  ]
  return [ // TEMSİL — çubuk uzunluğu sütundur; grafikten geri anlam çıkar
    item('Çeteleni sütuna çevir: çubuk uzunluğu = sayı.', dsRod(5, { fill: 5 }) + dsRod(2, { fill: 2, chip: 'red' }), hint('5 mavi · 2 kırmızı')),
    item('En uzun sütun hangisi? Grafik ne söylüyor?', dsRodPair(3, 7, { fillA: 3, fillB: 7 }), hint('alttaki en çok')),
    item('Sütunların altına ad yaz: hangi sütun neyi gösterir?', '', hint('eksen etiketi')),
  ]
}

DS_EG.classif = (i) => {
  if (i === 0) return item('Kırmızıyı kırmızının yanına koydum — eşini buldum.', dsChips(4, 'blue', 4), shown('eşler bir arada'))
  if (i === 1) return item('Benzeyenleri topladım; ölçütümü ben seçtim: renk.', dsChips(6, 'blue', 3), shown('ölçüt: renk'))
  if (i === 2) return item('Sonuna kadar hep renge göre ayırdım, şaşmadım.', dsChips(3, 'blue', 3) + dsChips(4, 'red', 4), shown('2 renk öbeği'))
  if (i === 3) return item('"Kırmızı" dendi; sevdiğim maviyi almadım.', dsChips(5, 'red', 5) + dsChip('blue', null, 30), shown('yalnız kırmızılar'))
  if (i === 4) return item('Rengi bıraktım, aynı nesneleri şekle göre baştan ayırdım.', dsChip('blue', null, 34) + dsChip('yellow', null, 34) + dsShape('square') + dsShape('circle'), shown('yeni ölçüt: şekil'))
  if (i === 5) return item('Öbekleri karşılaştırdım: en çok mavi var.', dsChips(6, 'blue', 6) + dsChips(3, 'red', 3), shown('en çok mavi (6)'))
  if (i === 6) return item('Ayırdım ve her öbeği saydım: 5 sarı, 3 mavi.', dsChips(5, 'yellow', 5) + dsChips(3, 'blue', 3), shown('sarı 5 · mavi 3'))
  if (i === 7) return item('Hem MAVİ hem yuvarlak olanı aldım: yalnız mavi pul.', dsChip('blue', null, 34) + dsChip('red', null, 34) + dsShape('square') + dsShape('circle'), shown('mavi ve yuvarlak'))
  if (i === 8) return item('Herkese sordum, her yanıta bir pul koydum.', dsChips(6, 'blue', 6), shown('mavi 6'))
  if (i === 9) return item('Kare de bir dikdörtgendir; ama her dikdörtgen kare değil.', dsShapeRow(['square', 'rect'], true), shown('kare ⊂ dikdörtgen'))
  return item('Çubuk uzunluğunu sütun yaptım: 5 mavi, 2 kırmızı.', dsRod(5, { fill: 5 }) + dsRod(2, { fill: 2, chip: 'red' }), shown('en uzun sütun: mavi'))
}

// ── pattern — ÖRÜNTÜ ve CEBİRSEL DÜŞÜNME · 11 düzey (0 oyun düzeyi) ────────
// Ayrım ekseni: fark etme → AB kurma → başka yapı (AAB/ABC) → aktarma + birim
// → sayı örüntüsü → eşitlik → ilişkisel düşünme → sembol → çarpımsal → genelleme.
// Materyal: iki-üç renk pul (örüntü şeridi), çubuk (büyüyen örüntü ve dizi).
DS_EX.pattern = (i) => {
  if (i <= 1) return [ // FARK ETME — örüntü var mı yok mu ayırt et
    item('Bu dizide bir örüntü var mı? Varsa parmağınla göster.', chipRow(['blue', 'red', 'blue', 'red']), hint('mavi-kırmızı yineleniyor')),
    item('Peki bunda? Örüntü var mı?', chipRow(['blue', 'blue', 'red', 'yellow']), hint('yok — yinelenmiyor')),
    item('Odanda yinelenen bir şey bul ve anlat.', '', hint('fayans, çizgili kazak…')),
  ]
  if (i === 2) return [ // AB KURMA — sürdür ve kendin kur
    item('Örüntüyü sürdür: sıradaki hangi renk?', chipRow(['blue', 'red', 'blue', 'red', '?']), wbox()),
    item('Pullarla kendin bir AB örüntüsü kur (çiz).', chipRow(['?', '?', '?', '?']), hint('iki renk, sırayla')),
    item('Örüntüyü sesle söyle: "mavi-kırmızı-mavi-kırmızı…"', '', hint('söyleyerek yinele')),
  ]
  if (i === 3) return [ // BAŞKA YAPI — AAB/ABC; AB'den ayırt et
    item('Bu AB değil. Sıradaki hangi renk?', chipRow(['blue', 'blue', 'red', 'blue', 'blue', '?']), wbox()),
    item('Üç renkli (ABC) bir örüntü kur (çiz).', chipRow(['?', '?', '?', '?', '?', '?']), hint('üç renk sırayla')),
    item('AB ile AAB’nin farkı ne? Anlat.', '', hint('AAB’de ilk renk iki kez')),
  ]
  if (i === 4) return [ // AKTARMA + BİRİM — aynı örüntü başka malzemede
    item('Bu örüntünün YİNELENEN BİRİMİNİ yuvarla.', chipRow(['blue', 'red', 'red', 'blue', 'red', 'red']), hint('mavi-kırmızı-kırmızı')),
    item('Aynı örüntüyü alkış–vur ile yap: nasıl olur?', '', hint('alkış-vur-vur…')),
    item('Aynı örüntüyü çubuk boylarıyla kur: kısa-uzun-uzun.', dsRodPair(2, 5), hint('boy örüntüsü')),
  ]
  if (i === 5) return [ // SAYI ÖRÜNTÜSÜ — çokluk büyür, renk değil
    item('Çubuklar 2, 4… Sıradaki kaç? Çiz.', dsRodPair(2, 4), wbox()),
    item('Pullar 1, 3, 5… Kural ne?', '', hint('ikişer artıyor')),
    item('Kendi sayı örüntünü kur ve kuralını söyle.', '', hint('örn. üçer artan')),
  ]
  if (i === 6) return [ // EŞİTLİK — "=" sonuç değil, denge
    item('3 + 4 ile 4 + 3 aynı mı? Pullarla bak.', dsChipsTwo(3, 4), hint('aynı — sıra değişti')),
    item('"=" ne demek: "cevap gelir" mi, "iki yan eşit" mi?', '', hint('iki yan eşit')),
    item('Boşluğu doldur: 5 + 2 = 2 + ⬚', '', eqRow(`5 + 2 = 2 + ${wbox()}`)),
  ]
  if (i === 7) return [ // İLİŞKİSEL — hesaplamadan, ilişkiye bakarak
    item('HESAPLAMADAN doldur: 8 + 5 = 7 + ⬚', '', eqRow(`8 + 5 = 7 + ${wbox()}`)),
    item('Biri 1 azaldıysa öteki ne olmalı? Anlat.', '', hint('1 artmalı')),
    item('Pullarla dene: 6 + 3 = 5 + ⬚', dsChipsTwo(6, 3), eqRow(`6 + 3 = 5 + ${wbox()}`)),
  ]
  if (i === 8) return [ // SEMBOL — harf sayıyı temsil eder, nesnenin baş harfi değil
    item('a + b = b + a doğru mu? Pullarla dene.', dsChipsTwo(2, 5), hint('doğru — sıra önemsiz')),
    item('"a" burada ne demek: bir SAYI mı, "armut" mu?', '', hint('bir sayı')),
    item('a = 4 ise a + 3 kaçtır?', '', eqRow(`a + 3 = ${wboxBig()}`)),
  ]
  if (i === 9) return [ // ÇARPIMSAL — dizi; satır-sütun değişince sonuç değişmez
    item('3 sıra 4’er pul ile 4 sıra 3’er pul: hangisi çok?', dsFrame(3, 4, 12), hint('ikisi de 12')),
    item('Diziyi çevirince toplam değişir mi? Neden?', '', hint('değişmez')),
    item('2 × 6 ile 6 × 2 için birer dizi çiz.', '', hint('ikisi de 12')),
  ]
  return [ // GENELLEME — girdi-çıktı, kuralı sözle ifade et
    item('1 masaya 4 sandalye. 2 masaya kaç? 3 masaya?', dsFrame(2, 5, 8), eqRow(`2 → ${wbox()} · 3 → ${wbox()}`)),
    item('Kuralı SÖZLE yaz: masa sayısını ne yapıyoruz?', '', hint('4 ile çarpıyoruz')),
    item('10 masa olsa kaç sandalye? Saymadan bul.', '', wboxBig()),
  ]
}

DS_EG.pattern = (i) => {
  if (i <= 1) return item('Mavi-kırmızı yineleniyor — burada bir örüntü var.', chipRow(['blue', 'red', 'blue', 'red']), shown('örüntü var'))
  if (i === 2) return item('Mavi-kırmızı-mavi-kırmızı… sıradaki mavi.', chipRow(['blue', 'red', 'blue', 'red', '?']), shown('→ mavi'))
  if (i === 3) return item('Mavi-mavi-kırmızı yineleniyor (AAB): sıradaki kırmızı.', chipRow(['blue', 'blue', 'red', 'blue', 'blue', '?']), shown('→ kırmızı'))
  if (i === 4) return item('Yinelenen birim: mavi-kırmızı-kırmızı. Alkış-vur-vur da aynı.', chipRow(['blue', 'red', 'red']), shown('birim = 3’lü'))
  if (i === 5) return item('Çubuklar 2, 4 — ikişer artıyor, sıradaki 6.', dsRodPair(2, 4), shown('+2 → 6'))
  if (i === 6) return item('3 + 4 ile 4 + 3 aynı: "=" iki yanın eşit olduğunu söyler.', dsChipsTwo(3, 4), shown('7 = 7'))
  if (i === 7) return item('8 + 5 = 7 + 6: biri 1 azaldı, öteki 1 arttı. Hesaplamadım.', '', shown('⬚ = 6'))
  if (i === 8) return item('a + b = b + a — harf bir SAYIYI temsil eder, nesneyi değil.', dsChipsTwo(2, 5), shown('doğru'))
  if (i === 9) return item('3 sıra 4’er = 4 sıra 3’er: dizi çevrilince toplam değişmez.', dsFrame(3, 4, 12), shown('12 = 12'))
  return item('Her masaya 4 sandalye: masa sayısını 4 ile çarpıyoruz.', dsFrame(2, 5, 8), shown('kural: ×4'))
}
