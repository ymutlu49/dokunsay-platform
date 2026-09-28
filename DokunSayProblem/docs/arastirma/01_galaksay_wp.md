# 01 — Galaksay Sözel Problem Çözme Yaklaşımı (salt-okuma çıkarımı)

> Kaynak depo: `C:\Users\yilma\Desktop\Jimaro\Diskalkuli_Platform\Diskalkuli Tanılama_Müdahale\Galaksay`
> Amaç: DokunSay'da müstakil "Problem Çözme" aracına dönüştürülecek yaklaşımı belgelemek. Kod değiştirilmedi.
> Kısaltma: `GS` = `GalakSay.jsx`, `WPT` = `src/data/wordProblemTemplates.js`, `NW` = `src/data/numWords.js`.

---

## 0. Mimari özet (tek bakışta)

| Katman | Yer | Not |
|---|---|---|
| Mod kimlikleri | `wpAdd`, `wpSub`, `wpCompare`, `wpMul`, `wpDiv` (5 adım akışlı) + `wpSchema` (tek soru, şema tanıma) | Mod meta: GS:2173 civarı (`wpAdd: { n:"Görev Çöz!", i:"📡", ... }`); kategori grupları GS:20336-20337 |
| Gezegen/durak | GS:2244 (`s7` Görev Çöz!: wpAdd,wpSub,wpSchema), GS:2266 (`s9`), GS:2285 (`s8` Görev Merkezi: 6 mod) | Kilit: `gamesMin 3-4, accMin 60` |
| Taksonomi | `CGI_TYPE_INFO` GS:503-519 (kopyası WPT:186-202) | 15 CGI türü → op/find/diff/sınıf/MEB kodu |
| TR şablonlar (CANLI) | `WORD_PROBLEM_TEMPLATES` GS:343-496 | WPT:18-183'teki TR kopya **ÖLÜ KOD** (WPT:12-17 uyarısı) ve canlıdan farklı (bkz. §5) |
| KU / EN şablonlar | `WORD_PROBLEM_TEMPLATES_KU` WPT:255-336, `WORD_PROBLEM_TEMPLATES_EN` WPT:493-602 | |
| Üreteçler | TR `generateWordProblem` GS:523-631; KU `generateWordProblemKu` WPT:339-443; EN `generateWordProblemEn` WPT:606-710 | Üçü aynı sayı mantığı (kopya-yapıştır parite) |
| Mod → tür kilidi | GS:8130-8171 (`case "wpAdd"...`) | Seviyeye bağlı `allowedCgiTypes` |
| wpSchema üreteci | GS:8697-8722 | Satır içi 3-dilli şablon |
| 5 adımlı çözüm UI | GS:12493-13296 (`case "wordProblem"` render) | React.createElement ile yazılmış, tek büyük blok |
| wpSchema UI | GS:15731-15736 | Şık seçmeli standart soru |
| Çok-temsilli ipucu | GS:9677-9745 (`multiRep`: Somut/Görsel/Sembolik) | |
| Geri-bildirim öğretim ipucu | GS:11617-11637 (`cgiTips`) | Yalnız TR |
| TTS metni | GS:9402 (wpSchema), GS:9420 (`wordProblem: q.text`) | |
| Durum | GS:6130-6140 (`wpStep`, `wpAnlaStep`, `wpBuildPhase`, ...) ; reset GS:7466 ve GS:9445 | |

---

## 1. Problem TÜRLERİ taksonomisi

### 1.1 CGI tür tablosu (`CGI_TYPE_INFO`, GS:503-519)

Dayanak yorumu GS:333-336: *Carpenter, Fennema, Franke, Levi & Empson (2015); MEB 2024 MAT.1.2.1, MAT.2.2.1, MAT.3.2.6, MAT.3.2.7*.

| cgiType | Aile | op | find | diff | sınıf | MEB kodu | TR etiket (GS:634-650) | TR şablon adedi (canlı) | KU | EN |
|---|---|---|---|---|---|---|---|---|---|---|
| joinResultUnknown | Birleştirme | + | result | 1 | 1-3 | MAT.1.2.1 | Birleştirme — Sonuç Bilinmiyor | 6 | 5 | 3 |
| joinChangeUnknown | Birleştirme | + | change | 2 | 1-3 | MAT.1.2.1 | Birleştirme — Değişim Bilinmiyor | 4 | 2 | 3 |
| joinStartUnknown | Birleştirme | + | start | 3 | 2-3 | MAT.2.2.1 | Birleştirme — Başlangıç Bilinmiyor | 3 | 2 | 2 |
| separateResultUnknown | Ayırma | − | result | 1 | 1-3 | MAT.1.2.1 | Ayırma — Sonuç Bilinmiyor | 5 | 3 | 3 |
| separateChangeUnknown | Ayırma | − | change | 2 | 1-3 | MAT.1.2.1 | Ayırma — Değişim Bilinmiyor | 3 | 1 | 2 |
| separateStartUnknown | Ayırma | − | start | 3 | 2-3 | MAT.2.2.1 | Ayırma — Başlangıç Bilinmiyor | 2 | 1 | 2 |
| ppwWholeUnknown | Parça-Bütün | + | whole | 1 | 1-3 | MAT.1.2.3 | Parça-Bütün — Bütün Bilinmiyor | 5 | 2 | 3 |
| ppwPartUnknown | Parça-Bütün | − | part | 2 | 1-3 | MAT.1.2.3 | Parça-Bütün — Parça Bilinmiyor | 3 | 1 | 2 |
| compareDiffUnknown | Karşılaştırma | − | diff | 2 | 1-3 | MAT.1.2.4 | Karşılaştırma — Fark Bilinmiyor | 3 | 1 | 3 |
| compareQuantityUnknown | Karşılaştırma | + | bigger | 2 | 1-3 | MAT.1.2.4 | Karşılaştırma — Çokluk Bilinmiyor | 2 | 1 | 3 |
| compareReferentUnknown | Karşılaştırma | − | smaller | 3 | 2-3 | MAT.2.2.1 | Karşılaştırma — Referans Bilinmiyor | 2 | 1 | 2 |
| multiplyProductUnknown | Eşit gruplar | × | product | 1 | 2-3 | MAT.2.2.4 | Eşit Gruplar — Çarpım Bilinmiyor | 3 | 2 | 3 |
| multiplyGroupSizeUnknown | Paylaştırma (partitive ÷) | ÷ | size | 2 | 2-3 | MAT.2.2.4 | Eşit Paylaşma — Grup Büyüklüğü Bilinmiyor | 2 | 1 | 3 |
| multiplyNumGroupsUnknown | Gruplama / ölçme bölmesi (quotitive ÷) | ÷ | groups | 3 | 2-3 | MAT.2.2.4 | Ölçme Bölmesi — Grup Sayısı Bilinmiyor | 2 | 1 | 3 |
| multCompareProductUnknown | Çarpımsal karşılaştırma | × | product | 2 | 3 | MAT.3.2.6 | Çarpımsal Karşılaştırma — Çarpım Bilinmiyor | 2 | 1 | 2 |

Toplam canlı TR şablon: **47**; KU: **25**; EN: **42**.

**Eksik CGI hücreleri** (Carpenter 2015'in tam tablosuna göre): "karşılaştırma — daha az" ifadeli tutarsız dil varyantları (bkz. §3), çarpımsal karşılaştırmanın *grup-büyüklüğü/çarpan bilinmeyen* biçimleri, kartezyen çarpım/alan (dizi) problemleri, bölmede kalanlı problemler hiç yok.

### 1.2 Mod → tür kilidi ve seviye (L1-L5) eşlemesi (GS:8130-8171)

Seviye `maxNum` (`LEVELS`, GS:1182-1188): L1=5, L2=10, L3=15, L4=20, L5=20. Okul öncesi (`isPreReader`) tavanı 10 (GS:7479); ayrıca ön-okur için `wpAdd/wpSub/wpMul/wpDiv/wpCompare` menüde gizlenir (GS:17789).

| Mod | L1-L2 | L3-L4 | L5 | Sayı parametresi |
|---|---|---|---|---|
| wpAdd | joinResult, ppwWhole | + joinChange | + joinStart | `mx` |
| wpSub | separateResult | + separateChange, ppwPart | + separateStart | `mx` |
| wpCompare | compareDiff, compareQuantity (sayılar ≤6) | aynı iki tür, `mx`'e açılır | + compareReferent | L≤2: `min(mx,6)` |
| wpMul | (efektif L3: `Math.max(level,3)`) → diff≤maxDiff olan × türleri: L3-4 multiplyProduct + multCompareProduct; L5 aynı | — | — | `max(mx,20)` |
| wpDiv | (efektif L3) multiplyGroupSize; L4-5 + multiplyNumGroups | — | — | `max(mx,20)` |

`allowedCgiTypes` verildiğinde diff tavanı ATLANIR (GS:534); wpMul/wpDiv'de verilmez, diff tavanı işler: `maxDiff = lp(level,[1,1,2,2,3])`, ÷ için `lp(level,[2,2,2,3,3])` (GS:526-528).
Üretilemezse tür-doğru yedek madde (GS:8137, 8148, 8156, 8163, 8169).

### 1.3 Sayı aralıkları (GS:546-585)

`lp(level, arr)` = 5-elemanlı seviye dizisinden seçer (GS:4047).

**+/− türleri** — iç tavanlar: `aCap=[6,8,10,12,12]`, `cCap=[8,10,12,15,15]`, `bCap=[4,5,6,8,8]`.

| find | Üretim | Denklem | Cevap |
|---|---|---|---|
| result/whole/bigger/diff | `a∈[2, min(maxNum(-1 if +), aCap)]`, `b∈[1, min(a-1, maxNum-a, bCap)]` | `a+b=c` veya `a−b=c` | c |
| change (+) | `c∈[4,min(maxNum,cCap)]`, `a∈[1,c-1]`, `b=c-a` | `a + ? = c` | b |
| change (−) | `a∈[4,..cCap]`, `c∈[1,a-1]`, `b=a-c` | `a − ? = c` | b |
| part | `c∈[4,..cCap]`, `a∈[1,c-1]`, `b=c-a` | `c − ? = a` | b |
| start (+) | `c∈[4,..]`, `b∈[1,c-1]`, `a=c-b` | `? + b = c` | a |
| start (−) | `c∈[2,min(maxNum-1,aCap)]`, `b∈[1,min(maxNum-c,bCap)]`, `a=c+b` | `? − b = c` | a |
| smaller | `c∈[4,..]`, `b∈[1,c-1]`, `a=c-b` | `c − b = ?` | a |

Sonuç: sözel problemlerde en büyük sayı pratikte **≤15** (L4-5), onluk bozma/geçme kontrollü değil (rastgele).

**×/÷ türleri** — `mulCap=[3,4,4,5,6]`; `groups∈[2,min(mulCap,⌊maxNum/2⌋)]`, `perGroup∈[2,min(mulCap,⌊maxNum/groups⌋)]`; `a=groups, b=perGroup, c=a·b`. Çarpım en fazla 6×6=36 değil, maxNum=20 sınırıyla ~20.

**Çeldiriciler** (GS:587-615): L≥3'te 4 şık, altında 3. Havuz: ±1, ±2, ±3; cevap ≥10 ise ±10 (basamak hatası); **tanısal işlem-karışıklığı** çeldiricileri: change/part→`a+c`; start→ters yönde işlem; smaller→`c+b` ("fazla"yı görüp toplama = anahtar-kelime yanılgısı); result(+)→`a−b`; result/diff(−)→`a+b`; ×→`a+b`, `(a+1)·b`; ÷→`c`, bölen, `c−bölen`. Filtre `0 < x ≤ maxNum+10`. Not: 5-adımlı akışta şıklar **gösterilmez** (cevap numpad ile girilir); `options` yalnız yedek/retry/analitik için üretilir.

### 1.4 wpSchema — "Hangi şema?" (GS:8697-8722, UI GS:15731-15736)

- SBI (Schema-Based Instruction) ikinci katmanı: problemi ÇÖZMEDEN şemayı adlandır.
- Şemalar: `join` (Birleştir ➕), `separate` (Ayır ➖), `compare` (Karşılaştır ⚖️). L1-2: yalnız join/separate; L3+: üçü.
- Sayılar: `wsMax = min(mx, L≤2 ? 10 : 20)`, `a∈[2,wsMax-1]`, `b∈[1,min(a, wsMax-a)]`.
- Ad havuzu satır içi: TR `["Ada","Ali","Ela","Kerem"]`, KU `["Ada","Baran","Rojîn","Kerem"]`, EN `["Ada","Ali","Mia","Kerem"]`.
- Her şema × dil için 3 uzay temalı şablon (yıldız taşı, kapsül/kristal, gezegen/roket).
- Cevap = etiket metni; şıklar daima 3 şema (şans %33; yorum GS:8720 "ölçüm yapısı Y11").
- TTS: `"${q.text} Bu hangi şema: birleştir, ayır, yoksa karşılaştır?"` (GS:9402).
- Yönerge (GS:15735): "Çözme — sadece söyle: gruplar birleşiyor mu, ayrılıyor mu, karşılaştırılıyor mu?"
- ⚠️ TR ek hatası: şablonlar `${n1}'nın`, `${n2}'ya` sabit eki kullanır (GS:8705-8707) → "Ali'nın", "Kerem'nın", "Kerem'ya" gibi yanlış biçimler üretir; `trG/trD` kullanılmamış.
- Parça-bütün ve eşit-grup şemaları wpSchema'da YOK.

### 1.5 Dil yapıları (TR / KU / EN) ve ek uyumu

**TR** — şablon fonksiyonu imzası `text(a, b, c, names, nw)`; `nw = numWord` → sayılar **sözcükle** yazılır ("on iki elma"). Ek uyumu `NW` yardımcılarıyla çözülmüş:
- İsim ekleri (özel ad + kesme): `trG` tamlayan (Elif'in/Ali'nin/Ada'nın) NW:46; `trD` yönelme (Elif'e/Ali'ye) NW:48; `trK` karşılaştırma ablatifi (Elif'inkinden) NW:50; `trDA` de/da bağlacı NW:52.
- Sayı ekleri (sayının OKUNUŞUNA göre ünlü uyumu + ünsüz benzeşmesi): `trAbl` (5'ten, 6'dan) NW:58-64; `trGen` (2'nin, 5'in) NW:68-74; `trDat` (10'a, 5'e) NW:78-84; `trAcc` (8'i, 2'yi) NW:88-94.
- `numDist` üleştirme sayısı (üçer, dörder, beşer) NW:99-100; `capFirst` Türkçe yerel büyük harf NW:96.
- Şablon kuralı: sayı sözcüğünden hemen sonra virgül/nokta konmaz (Anla adımındaki öbek regex'i "sayı + boşluk + kelime" bekler) — GS:441-442, WPT:116-117.
- Yön sözcüğü op ile tutarlı olmalı (compareQuantity yalnız "daha fazla/çok") — WPT:16-17, GS:451-452.

**KU (Kurmancî)** — `numWordKu` (NW:110-142, "bîst û sê"); ad havuzu `WP_NAMES_KU` (NW:151). Ek sorunu **cinsiyet-nötr "wî/wê"** ve ezafe kalıplarıyla atlatılmış ("Di selika ${n[0]} de…", "yên wî/wê"); `kuEzafe/kuPlural` (NW:146-148) tanımlı ama şablonlarda kullanılmıyor. Terminoloji FerMat: zêdekirin/kemkirin/carkirin/parkirin (WPT:226-230). KU etiketleri iki ayrı sürümde: WPT:231-247 ve GS:651-667 (farklı sözcükler: "Yekbûn…Nediyar" vs "Hevgirtin…nayê zanîn") — UI GS sürümünü kullanır (GS:12529).

**EN** — `numWordEn` (WPT:475 ve NW:159 — iki kopya), `_plEn(n, sing, plur)` sayıya göre çoğul (WPT:489), `_capEn`, özne tekrarları ("${n[0]} … ${n[0]}") ile zamir sorunundan kaçınılmış; `was/were` sayıya göre (WPT:505, 507). Ad havuzu `WP_NAMES_EN` (WPT:483). EN tema anahtarları farklı (`school`, `fruit`, `space`...) — renk eşlemesi GS:12516-12525.

**Seçim**: `(lang === "ku" ? generateWordProblemKu : lang === "en" ? generateWordProblemEn : generateWordProblem)(...)` (GS:8136 vb.).

---

## 2. ÇÖZÜM ADIMLARI akışı (durum makinesi)

### 2.1 Durum değişkenleri (GS:6130-6140)

| Durum | Değerler | Anlam |
|---|---|---|
| `wpStep` | 0 Oku · 1 Anla · 2 İşlem · 3 Çöz (modelle+hesapla) · 4 Özet | Ana adım |
| `wpAnlaStep` | 0 Verilenleri bul · 1 İstenen ne? · 2 Hangi tür (şema)? | Anla alt-fazı (sıra 0→1→2) |
| `wpFoundNums` | bulunan öbek indeksleri | Anla-0 ilerlemesi |
| `wpBuildPhase` | 0 çubukları yerleştir · 1 sonucu gir · 2 doğru · 3 cevap gösterildi (birlikte çözüm) | Adım 3 alt-fazı |
| `wpBuildA`, `wpBuildB` | yerleştirilen değer (>0 = yerleşti) | Model kurulumu |
| `wpModelCount` | numpad girdisi | Cevap |
| `wpStepErrorsRef` (ref) | kümülatif hata sayısı | İpucu eşikleri + yıldız + "zorlandı" kaydı |
| `wpReviewStep` | set edilir ama **hiçbir yerde okunmaz** (ölü durum) | — |

Sıfırlama: yeni soru (GS:9445) ve retry (GS:7466) — hepsi 0/[] ve ref 0.
Genel şık alanı sözel problemde tamamen kapalı: `renderOpts` → `if (question.type === "wordProblem") return null` (GS:16853). Genel "Doğru/Yanlış" dönüt katmanı da gizli (GS:18801).

### 2.2 Adım adım (render: GS:12493-13296)

Başlıkta "5 ADIMLI PROBLEM ÇÖZME — Şema Temelli (Bar Model)" yazar (GS:12535-12538). Adım puanları `stepPts = [5, 10, 15, 20, 0]` (GS:12540).

```
wpStep 0  OKU --[Anladım, Devam Et]--> wpStep 1 ANLA
                                          |- wpAnlaStep 0: sayı öbeklerine + işlem sözcüğüne (⚡) dokun (hepsi bulununca [Devam])
                                          |- wpAnlaStep 1: "Problemde bizden ne isteniyor?" 3 şık
                                          '- wpAnlaStep 2: "Bu problem hangi TÜRDE?" 3 şema kartı
                                                              v
                                        wpStep 2 İŞLEM: 4 işlem düğmesi (+ − × ÷)
                                                              v
                                        wpStep 3 ÇÖZ: buildPhase 0 -> çubuklara dokunarak modeli kur -> [Sonucu Hesapla]
                                                      buildPhase 1 -> NumPad ile cevap -> onay
                                                      (doğru -> 2 | 3. kümülatif hata -> 3 = cevap gösterilir)
                                                              v [Çözümü Gör] -> handleAnswer(...)
                                        wpStep 4 ÖZET: yıldız + puan + denklem + cevap -> [Devam Et] -> sonraki soru
```

**Adım 0 — OKU** (GS:12651-12673)
- Kart: tema emojisi (36px) + problem metni (18px, satır aralığı 1.8). Tema rengi `WP_COLORS[q.theme]` (GS:12494-12527; TR/KU/EN anahtarları).
- "🔊 Tekrar dinle": `TTS.speak(wpText, wpTTSLang, 0.8)` — **0.8 hız** (GS:12661). İlerletmez.
- "Anladım, Devam Et →": +5 puan, `wpAnlaStep=0`, problemi TTS ile yeniden okur, `wpStep=1`.
- Soru başında metin `q.ttsText = q.text` ile otomatik okunur (GS:9420; KU tts.js:768, EN tts.js:846).

**Adım 1 / Faz 0 — VERİLENLERİ BUL** (GS:12683-12845)
- Yönerge: "Sayılara ve işlemi gösteren kelimeye (⚡) dokun." Satır içi "🔊 Dinle".
- Algoritma: problemdeki `a, b, (c)` değerleri için aktif dilde sayı sözcüğü (`numWordLang`) + TR/EN'de `numDist` (üçer…) anahtarları üretilir (GS:12684-12696). Metinde regex öncelik listesiyle "anlamlı öbek" aranır: `X tane daha`, `X tanesi`, `X tane`, `X kişi daha`, `X kişi`, `X dilim`, `X + herhangi kelime`, yalın `X` (GS:12701-12725). Çakışma engellenir. Regex'lerde **başta sözcük sınırı yok** (ör. "on" = 10, "balon kaldı" içinde de eşleşebilir; ilk eşleşme alınır).
- İşlem sözcüğü listesi (op'a göre) GS:12727-12729: TR `+`: topladı, ekledi, getirdi, dikti, bindi, geldi, katıldı, koydu, verince, oldu…; `−`: yedi, verdi, çıktı, patladı, gitti, kaldı, kalan…; `×`: her, katı; `÷`: paylaş, böl, dağıt, eşit. EN listesi ayrı; **KU listesi yok** (KU'da TR listesi aranır → pratikte ⚡ öbeği bulunmaz). "yedi" hem sayı (7) hem fiil.
- Metin kelimelere bölünür; her kelime dokunulabilir `span`. Doğru öbek → `pop` sesi + öbek TTS (0.9) + yeşil "✅" (sayı) / amber "⚡" (işlem) vurgu. Yanlış kelime → `wrong` sesi + satır sarsıntısı. **Yanlış dokunuş hata sayacına eklenmez.**
- Sayaç "k / N verilen bulundu"; hepsi bulununca "Devam Et" (GS:12839-12841) → `wpAnlaStep=1`.

**Adım 1 / Faz 1 — İSTENEN NE?** (GS:12890-12929)
- "VERİLENLER" kutusu: `verilenA • verilenB` (find'a göre doğal dil, GS:12595-12629; TR/KU/EN).
- 3 şık: doğru `istenenTR` + 2 çeldirici ("Aralarındaki farkın kaç olduğu", "Toplamda kaç X olduğu", "Baştaki X sayısının kaç olduğu", "Kaç tane değiştiği") — find'a göre dışlamalı (GS:12891-12897). Sıralama deterministik tohumla (`a*11+b*7`).
- Doğru → +10 → `wpAnlaStep=2`. Yanlış → `wrongRef++`; kümülatif ≥2 ise maskot (sesli): "Problemi tekrar oku — senden ne isteniyor?".
- ⚠️ Çeldiriciler KU'ya çevrilmemiş (yalnız TR/EN ternary, GS:12893-12896) → KU arayüzde doğru şık KU, çeldiriciler TR görünür (şık dilinden cevap tahmin edilebilir).

**Adım 1 / Faz 2 — HANGİ TÜR? (SBI şema tanıma)** (GS:12847-12888)
- Yorum: "Fuchs 2008 d=1.80, Jitendra RCT; WWC 2021 … yüzeysel anahtar-kelime avcılığının önüne geçer."
- 4 şema kataloğu: 🧩 Birleştirme "Parçalar bir araya gelir" · 🍃 Ayrılma "Bütünden eksilir" · ⚖️ Karşılaştırma "İki miktarın farkı" · 📦 Eşit Gruplar "Eşit paylar ya da gruplar". Ekranda doğru + 2 diğer (3 kart).
- Doğru şema anahtarı: `find==="diff" → compare; ×/÷ → groups; − → separate; aksi → join` (GS:12851).
- Doğru → +5 → `wpStep=2`. Yanlış → `wrongRef++`; ≥2 ise maskot "İpucu: <doğru şemanın açıklaması>!".
- ⚠️ Eşleme hatası: `compareQuantityUnknown` ("daha fazla", op +) **Birleştirme**, `compareReferentUnknown` (op −) **Ayrılma** olarak beklenir; `multCompareProductUnknown` "Eşit Gruplar"; `ppwWhole/ppwPart` ayrı bir parça-bütün şeması yerine join/separate'e düşer. Karşılaştırma problemlerinin 2/3'ünde çocuktan pedagojik olarak yanlış şemayı seçmesi istenir (bkz. §3).

**Adım 2 — İŞLEM SEÇ** (GS:12932-12966)
- Üstte "✅ Verilen … • …" ve "🎯 Aranan: …" özeti; 2×2 ızgara: ➕ Toplama, ➖ Çıkarma, ✖️ Çarpma, ➗ Bölme.
- Kabul: `find ∈ {change, start}` ise hem + hem − (CGI: iki çözüm yolu da geçerli); aksi hâlde yalnız `cgiInfo.op` (GS:12954). Ters işlem seçilirse maskot: "Evet — tersinden de çözülür: toplama ile çıkarma birbirinin kardeşi!".
- Doğru → +15 → `wpStep=3`. Yanlış → `wrongRef++`; ≥2 ise maskot: "Problemi tekrar dinle — **işlemi gösteren kelimeye dikkat et!**" (anahtar-kelime yönlendirmesi).
- `wpStep>=2` iken sağ altta kalıcı yuvarlak 🔊 (44px) problemi yeniden okur (GS:12551-12558).

**Adım 3 / Faz 0 — ÇUBUKLA MODELLE** (GS:12980-13184)
- Başlık "🧮 Çubukla Modelle"; kartta denklem `eqStr` (GS:12632-12646) + şema.
- Yapı taşları: `rodRow(count, placed, color, label, onPlace)` — yerleşmemişken kesikli "Dokun" kutusu; dokununca `NumberRod` (DokunSay kapsülü, GS:3675; ayrıca `src/components/math/NumberRod.jsx`) mavi/kırmızı dolar; `unknownRow` — daima kapalı taralı "?" kutusu (cevap sızıntısı önlemi, GS:13030); `opSym`. Kapsül en çok 15 yuva gösterir.
- Sıralı yerleştirme: ikinci çubuk ancak ilki yerleşince aktif.
- find'a göre şema düzenleri:

| Tür (find) | Düzen | Görsel |
|---|---|---|
| result/whole/bigger (+) | `[a mavi] + [b kırmızı] = [? Toplam / Diğeri]` | yatay denklem |
| result (−) | `[a] − [b] = [? Kalan]` | yatay |
| diff | `a` çubuğu üstte, `b` altta **sola hizalı** + `[? Fark]` | gerçek karşılaştırma modeli (taşan kısım = fark) |
| change | `[a] ± [? Eklenen/Çıkan] = [c]` | orta-bilinmeyen |
| part | `[c Bütün] − [? Parça] = [a]` | |
| start | `[? Başta] ± [b] = [c]` | baş-bilinmeyen |
| smaller | `[c] − [b] = [?]` (etiketsiz) | |
| × (product) | `a` satır × satır başına `b` boş kapsül (en çok 6 satır); tek dokunuşla hepsi dolar; alt yazı "üç grup × dört = ?" | eşit gruplar dizisi |
| ÷ (size/groups) | `[c Toplam] ÷ [bölen: Grup / Her grup] = [?]` | yatay (dağıtma/gruplama animasyonu yok) |

- İpucu satırı: "☝️ İlk değeri yerleştirmek için çubuğa dokun" → "İkinci değeri de yerleştir". İkisi yerleşince "Sonucu Hesapla →".
- Not: Bu bir Singapur tipi **bar model değildir**; DokunSay kapsül çubuklarının denklem sırasına dizilmesidir. Yalnız `diff` hizalı karşılaştırma çubuğu, `×` eşit-grup dizisidir. Parça-bütün için "bütün üstte, parçalar altta" modeli yoktur. Çubuk uzunluğunu çocuk kurmaz — dokununca doğru uzunlukta hazır gelir (yapılandırma değil onaylama).

**Adım 3 / Faz 1 — SONUCU HESAPLA** (GS:13187-13249)
- Denklem kutusu + 120×60 cevap kutusu + ortak `NumPadGrid` (GS:3776; 0-9, sil, onayla). En çok 3 hane.
- Onay YALNIZ onay düğmesiyle (canlı yeşillenme kaldırıldı → "cezasız cevap avı" engeli, GS:13189-13192).
- Doğru → +20, `buildPhase=2`, "🎉 Doğru! 3 + 4 = 7". Yanlış → `wrongRef++`, girdi silinir; kümülatif ≥2 → maskot "Şemadaki yıldız taşlarını tek tek say!" (ama "?" kutusu kapalı olduğu için sayılacak taş cevabı göstermez); **kümülatif ≥3 → cevap gösterilir** (`buildPhase=3`, 🤝 "Birlikte çözdük! Cevap: N").
- "Çözümü Gör →": `handleAnswer(correctAnswer, wpStruggled ? {countAsWrong:true, silent:true} : undefined)`; `wpStruggled = cevap gösterildi || wrongRef ≥ 2` (GS:13240-13241; meta açıklaması GS:11124-11127). Soru istatistiğe burada doğru/yanlış olarak yazılır; ardından `wpStep=4`.

**Adım 4 — ÖZET** (GS:13252-13294)
- 5-8 yaş için sadeleştirilmiş: yalnız "Denklem" (`3 + 4 = 7`) ve "Cevap" (`7 elma`) satırları, sıralı fadeIn.
- Puan: `totalPts = max(10, 5+10+15+20+10 − wrongRef×8)` → 0 hata=60 (⭐⭐⭐), 1-2 hata=52/44 (⭐⭐), 3+ hata ≤36 (⭐). Eşikler ≥55 / ≥40.
- "Devam Et" 3.5 sn gecikmeyle görünür; oturum tavanı ve tur sonu kontrolü burada (GS:13285-13290).
- Gerçek bir "Kontrol et / cevap mantıklı mı?" (Polya 4. adım) etkileşimi **yok**; özet pasif. (Kullanıcı isteğindeki "Anla-Planla-Çöz-Kontrol" adları kodda bu biçimde yok; adlar Oku/Anla/İşlem/Çöz/Özet.)

### 2.3 Alt ilerleme çubuğu (GS:12559-12583)
Yapışkan alt şerit: 5 daire (📖 🧠 🔍 🧮 ⭐), tamamlanan ✓ yeşil, aktif olan genişleyip "ikon + ad" gösterir (TR Oku/Anla/İşlem/Çöz/Özet; KU Bixwîne/Fêhm bike/Kiryar/Çareser/Kurte; EN Read/Understand/Operation/Solve/Summary).

### 2.4 Hata sayacı ve iskele
- `wpStepErrorsRef` **soru boyunca kümülatiftir**, adım başına sıfırlanmaz. Sonuç: Faz1/Faz2/İşlem'de 2 hata yapan çocuk, numpad'deki **ilk** yanlışında cevabı görür (eşik 3). Mekanizma "destek artırma"dır; *iskele azaltma (fading)* yoktur — adım sayısı, model adımı ve yönergeler usta çocuk için de aynı kalır (seviye yalnız türü ve sayıları değiştirir).
- Anla-0 yanlış dokunuşları sayılmaz; Adım 0 ve model kurma adımında hata olasılığı yoktur.
- Genel çerçeve iskelesi (bir çeldiriciyi eleme, GS:9441) wp akışında şık gösterilmediği için etkisiz.

### 2.5 İpuçları (K1-K5, genel "İpucu" düğmesi)
Genel ipucu düğmesi (`canHint`, GS:18183; düğme GS:19107-19110) wp akışında da görünür. `useHint` (GS:9894) mod anahtarını `gameMode` (wpAdd…) olarak kullanır (GS:9906-9908).
- **K1 — Yönlendirici soru** (`src/systems/hintManager.js` GUIDING_QUESTIONS): wpAdd "Problemde ne birleşiyor?" / "Toplam kaç olur?" (:80); wpSub "Problemde ne ayrılıyor?" / "Kaç tane çıkarılıyor?" (:81); wpCompare "İkisi arasındaki fark ne?" / "Hangisi daha çok ve ne kadar?" (:82); wpMul "Eşit gruplar kaç kere?" (:90); wpDiv "Eşit paylaşınca herkes kaç alır?" / "Toplam ÷ kişi sayısı!" (:103); wpSchema (:97). KU :163-184; EN :247-269. TTS ile okunur.
- **K2** — hedefli vurgu yalnız 3 modda kablolu; wp'de K2 → zengin ipucuya düşer (GS:9940-9961). `hintManager.js:340-354`'teki wp görsel vurgu tanımları (frame/enlarge/blink/arrow) wp akışında **çizilmez**.
- **K2-K5 — Çok temsilli ipucu** `multiRep` (GS:9677-9745): her CGI türü için üç satır — 🧱 **Somut** ("DokunSay yıldız taşlarından üç mavi ve dört kırmızı yıldız taşı al. Hepsini bir arada say."), 📊 **Görsel** (kapsül dili), ✏️ **Sembolik** (`? + 4 = 9 → 9 − 4 = ?`). 15 tür için TR+EN; **KU yok** (TR'ye düşer). K4-5 TripleCode panelini açar ve o cevap `scored=false` olur (GS:11146-11148).
- **Yanlış-sonrası öğretim ipucu** `cgiTips` (GS:11617-11637): 15 tür için tek cümle (ör. "Sonucu ve eklenen miktarı biliyorsun — başlangıcı bulmak için çıkar! 🧩"). Yalnız TR; 5-adımlı akışta genel dönüt katmanı gizli olduğundan pratikte görünmesi şüpheli.
- **Telafi K1**: önceki oturumdaki yanılgıdan `applyRemed` ile MISC_COACH metni K1 olarak otomatik açılır (GS:7363-7373).
- **Maskot adım ipuçları** (ikinci kümülatif hatadan sonra, sesli): Faz1 "Problemi tekrar oku — senden ne isteniyor?", Faz2 "İpucu: <şema açıklaması>!", İşlem "işlemi gösteren kelimeye dikkat et!", NumPad "Şemadaki yıldız taşlarını tek tek say!".

### 2.6 Sesli okuma (TTS)
- Problem metni: soru başında otomatik (`q.ttsText=q.text`), Adım 0/1 satır içi "Dinle", Adım 2+ yüzen 🔊; hız 0.8, dil `en-US` ya da `tr-TR` — **KU için de `tr-TR` motoru** (`wpTTSLang`, GS:12543); KU gerçek-ses klip hattı (`kuAudio.js`) wp metinleri için kullanılmıyor.
- Anla-0'da bulunan her öbek 0.9 hızla okunur. Maskot ipuçları `showMascot(msg, ms, true)` ile sesli.
- tts.js yedek metinleri: tts.js:592-596, 684-688 ("Problemi dinle ve toplayarak çöz!").

### 2.7 Dokunuş sayısı (asgari, hatasız)
Oku 1 · Anla-0 N öbek (2-3 sayı + 0-1 işlem sözcüğü ≈ 3-4) + Devam 1 · Anla-1 1 · Anla-2 1 · İşlem 1 · Model 2 (× için 1) + Hesapla 1 · NumPad 1-2 hane + onay 1 · Çözümü Gör 1 · Özet Devam 1 → **≈ 15-17 dokunuş / problem**. Basit bir `3+4` problemi için yüksek; usta çocukta "hızlı yol" yok.

---

## 3. Anahtar-kelime tuzağı, tutarsız dil, gereksiz bilgi, çok adımlılık, yanılgı kimlikleri

### 3.1 Tutarsız dil (inconsistent language) — YOK
- `compareQuantityUnknown` yalnız "daha fazla/çok" ile yazılır; tek "daha az" şablonu, üreteç cevabı `a+b` işaretlediği için metin "daha fazla"ya çevrilmiş (GS:451-452; kural WPT:16-17). Yani "Ali'nin 8 bilyesi var, bu Ece'ninkinden 3 **az**; Ece'nin kaç bilyesi var?" (az → topla) türü **klasik tutarsız dil maddesi bilinçli olarak dışlanmış**.
- Tek "ters yön" maddesi `compareReferentUnknown`: "…Bu, Ece'ninkinden 3 tane daha **fazla**. Ece'nin kaç…?" → çıkarma (GS:456-461). Yalnız wpCompare L5'te açılır; 2 TR, 1 KU, 2 EN şablon.
- Doğal anahtar-kelime çatışmaları başlangıç-bilinmeyen türlerde var: `separateStartUnknown` ("…3 tane **verdi** … Başta kaç?" → toplamayla çözülür), `joinStartUnknown` ("… 4 ceviz daha **verince** toplam 9 oldu. Başta kaç?" → çıkarmayla çözülür). Adım 2 bu türlerde iki işlemi de kabul ettiği için (GS:12954) çatışma ölçülmüyor.
- wpSchema'da "verdi" fiili hem birleştir ("Ali 3 tane daha **verdi**" — alıcı bakışı) hem ayır ("3 tanesini Ali'ye **verdi**") şablonlarında geçer (GS:8705-8706) → uygulamadaki tek gerçek "aynı sözcük, farklı şema" karşı-örneği.

### 3.2 Anahtar-kelime stratejisinin kodda kendi kendisiyle çelişmesi
SBI adımının yorumu (GS:12847-12849) anahtar-kelime avcılığını "yaygın yanılgı kaynağı" diye niteliyor; fakat aynı akış ve metinler anahtar-kelime stratejisini açıkça öğretiyor:
- Anla-0: "işlemi gösteren kelimeye (⚡) dokun" + işlem sözcüğü listeleri (GS:12727-12729).
- İşlem adımı maskotu: "işlemi gösteren kelimeye dikkat et!" (GS:12956).
- `modeStories.js` strategyTip: wpAdd "'Toplam', 'hepsi', 'birlikte' gibi kelimeler toplama işareti." (:22), wpSub (:23), wpMul (:24), wpDiv (:25), wpCompare (:26); ek öğüt dizileri (:1015-1123, ör. "'Kalan', 'eksildi', 'kaçı gitti' gibi kelimeler çıkarma işaretidir!"); KU (:123-146, :1443-1447) ve EN (:1602-1606) karşılıkları.
- MATH_INSIGHTS yanlış-dönütü: "Problemi oku: 'toplam', 'hep birlikte', 'birleştir' = toplama!" (GS:5125-5131; KU GS:5227; EN GS:5351).
- wpSchema: briefing "Anahtar sözcüğü bul!" (modeStories.js:52, KU :136, EN :1630); K1 ikinci ipucu "'Daha verdi' birleştir; 'gitti' ayır; 'kaç fazla' karşılaştır!" (hintManager.js:97; KU :178; EN :263); K2 tanımı "Problemdeki anahtar sözcük vurgulanır" (hintManager.js:348).
→ DokunSay aracında bu metinler **aynen taşınmamalı**; yerine yapı/eylem dili ("Bir şey ekleniyor mu? Kim daha fazla ve ne kadar?") kullanılmalı.

### 3.3 Şema eşleme hatası (Anla-2)
`wpSchemaKey` (GS:12851) işlem işaretinden türetildiği için:
| cgiType | Beklenen şema (kod) | Doğru SBI şeması |
|---|---|---|
| compareQuantityUnknown | join 🧩 | compare ⚖️ |
| compareReferentUnknown | separate 🍃 | compare ⚖️ |
| ppwWholeUnknown / ppwPartUnknown | join / separate | parça-bütün (grup/total) |
| multCompareProductUnknown | groups 📦 | çarpımsal karşılaştırma |
Doğru eşleme `find`/`cgiType` üzerinden yapılmalı (ör. `cgiType.startsWith("compare") → compare`).

### 3.4 Gereksiz (fazla) bilgi — YOK
Her şablonda yalnız gerekli sayılar bulunur; Anla-0 "tüm sayıları bul" diye tasarlandığından "hangisi gerekmez?" ayrımı öğretilemez.

### 3.5 İki / çok adımlı problemler — YOK
Tüm maddeler tek işlemlidir (15 tür × tek denklem). "Önce … sonra …" iki adımlı, ara sonuçlu veya karışık (+ ve ×) problem üretimi bulunmuyor.

### 3.6 Yanılgı kimlikleri (`src/data/misconceptions.js`)
- İlgili kimlikler mevcut: `islem_karistirma` (:9), `buyugu_soyleme` (:17, "Kaç fazla?" → büyük sayıyı söyleme; ref Riley, Greeno & Heller 1983), `parca_yerine_butun` (:26; Riley 1983 değişim şeması), `esittir_sonuc` (:21, bilinenleri toplama), `carpma_yerine_toplama` (:22), `bolme_grup_karistirma` (:24), `yon_karistirma` (:14, az/çok yönü). Koç metinleri MISC_COACH :34-57, literatür MISC_META :60-82.
- **"anahtar_kelime" (keyword) diye bir kimlik yok.**
- ⚠️ Sözel problemlerde yanılgı fiilen **hiç kaydedilmiyor**: (1) `inferMisconception` `q.type` ile dallanır; wp sorularının tipi `"wordProblem"` → `ADD_TYPES_MISC/SUB_TYPES_MISC` içindeki `"wpAdd"/"wpSub"` (:86-87) hiç eşleşmez, ayrıca wp nesnesinde `num1/num2` yok (`a/b/c` var). (2) 5-adım akışı `handleAnswer(correctAnswer, …)` ile **daima doğru değeri** gönderir (GS:13241) → `chosen === ans` → `null`. (3) Çocuğun numpad'deki yanlış değerleri ve adım-bazlı hataları hiçbir yere loglanmaz; yalnız `countAsWrong` bayrağı gider.
- Üreteçteki tanısal çeldiriciler (GS:594-607: `a+c`, ters işlem, "fazla"yı görüp `c+b`, × için `a+b`, ÷ için bölen/toplam) doğru kurgulanmış ama 5-adım akışında şık gösterilmediği için **kullanılmıyor** (yalnız yedek/retry yolunda).
- Hata sınıflandırıcı: `src/utils/errorClassifier.js:2` `wpCompare`'ı karşılaştırma modu sayar (kaba kategori).

---

## 4. Güçlü yanlar ve eksikler

### 4.1 Güçlü yanlar
1. **Tam CGI toplama/çıkarma tablosu** (11 tür) + 4 çarpma/bölme türü, her biri MEB kodu ve sınıf düzeyiyle etiketli (GS:503-519); Carpenter ve ark. 2015 dayanağı.
2. **Seviyeye bağlı tür merdiveni** (sonuç → değişim → başlangıç bilinmeyen; GS:8130-8155) ve seviye-ölçekli sayı tavanları (`lp`), L3=L4 çöküşlerinin giderilmiş olması.
3. **Üç dil**, Türkçede gerçek ek uyumu (özel ad ve sayı ekleri, üleştirme sayısı), İngilizcede çoğul uyumu, Kürtçede FerMat terminolojisi.
4. **Üçlü kod**: sayılar metinde sözcükle, modelde çokluk (kapsül), denklemde rakam — Dehaene modeliyle uyumlu (NW:1-3).
5. **Yapılandırılmış süreç**: oku → verilen/istenen → tür → işlem → model → hesapla → özet; her adım görünür ilerleme çubuğuyla.
6. **SBI şema tanıma adımı** ve ayrık **wpSchema** modu (çözmeden şemayı tanı) — kanıt tablosunda gerekçelendirilmiş (site/kanit.html:40: Jitendra; Fuchs 2008; IES 2021 Öneri 5).
7. **Sızıntı önlemleri**: bilinmeyen daima kapalı "?" kutusu, onay yalnız düğmeyle, şıklar gizli (üretim — tanıma değil).
8. **CGI-doğru esneklik**: değişim/başlangıç bilinmeyende hem + hem − kabul (GS:12954).
9. **Çok temsilli K2-K5 ipucu** (Somut/Görsel/Sembolik, 15 tür, DokunSay nesne diliyle; GS:9677-9745).
10. **İstatistik dürüstlüğü**: zorlanan / cevabı gösterilen soru yanlış sayılır (GS:13240), ipucu K4+ puanlanmaz.
11. **Sesli destek**: otomatik okuma, her adımda yeniden dinleme, yavaş hız.
12. Ekosistem bağları: MEB (mebKazanim.js:41-45, 72), öğrenme yörüngesi (ltTrajectories.js:67-69, 99, 107-108), analitik kategori (AnalyticsBridge.js:47-58), önkoşul ağı (adaptiveEngine.js:82-86, 107), animasyon şablonları (animationTemplates.js:536-538), rapor taslakları (reportDrafts.js:36, 52).

### 4.2 Eksikler / riskler
**Pedagojik kapsam**
- Problem **kurma** (problem posing: denklemden/görselden hikâye yazma, eksik soruyu tamamlama) yok.
- **Çok adımlı** ve **gereksiz bilgili** problem yok; **tutarsız dil** maddesi bilinçli olarak yok.
- **Bağlam çeşitliliği dar**: ölçme (uzunluk, kütle, sıvı), **zaman** (süre, takvim) problemleri yok; para yalnız 1 ppwWhole şablonu ("lira", GS:423-424) — ayrı `coinCount` modu sözel değil.
- **Çarpımsal karşılaştırma** yalnız "kaç katı → çarpım" (product-unknown); "kaç katı?" (çarpan) ve "…'nin 3 katı 12 ise" (referans) yok. Kartezyen/dizi-alan problemleri yok.
- **Kesir**, **kalanlı bölme**, iki basamaklı eldeli/onluk bozmalı bağlamlar yok (sayılar ≤15, çarpım ≤~20).
- **Gerçek bar/şerit model yok**; parça-bütün şeması yok; çocuk modeli **kurmuyor** (dokununca hazır çubuk gelir, uzunluk tahmini/karşılaştırması yok). Bölmede dağıtma/gruplama canlandırması yok.
- **Kontrol/gözden geçirme** adımı pasif (Polya "geriye bak" yok; cevabın makullüğü sorulmuyor).
- **İskele azaltma (fading) yok**; usta çocuk da 15+ dokunuşlu tam akışı yapar. Anahtar-kelime öğretimiyle SBI ilkesi çelişiyor (§3.2); Anla-2 şema eşlemesi karşılaştırmada yanlış (§3.3).

**Teknik / veri**
- Adım-düzeyi hata/süre verisi kaydedilmiyor; yanılgı kimliği wp'de hiç üretilmiyor (§3.6).
- `wpStepErrorsRef` kümülatif → erken adım hataları numpad'de erken cevap ifşasına yol açar.
- Anla-0 öbek bulucu kırılgan: regex'te sözcük sınırı yok, TR-özgü "tane/kişi/dilim" kalıpları, KU işlem sözcüğü listesi yok, şablon yazım kuralına bağımlı (virgül yasağı).
- **KU eksikleri**: TTS `tr-TR` motoruyla okunuyor; Faz1 çeldiricileri, `multiRep` ipuçları, `cgiTips` TR; KU şablon sayısı 25 (TR 47); iki farklı KU etiket seti (GS:651-667 vs WPT:231-247).
- **TR kopya kayması**: WPT:18-183'teki ölü TR kopya canlıdan farklı ve daha zengin (compareDiff 5 vs 3, compareQuantity 4 vs 2, compareReferent 3 vs 2, multiplyGroupSize 3 vs 2, multiplyNumGroups 3 vs 2; compareDiff şablon-1 metni de farklı). Canlı kaynak GS'deki kopyadır.
- wpSchema TR ek hatası (`'nın`, `'ya` sabit; GS:8705-8707).
- `wpReviewStep` ölü durum; 5-adım bloğu 800 satırlık tek `React.createElement` gövdesi (bileşenlere ayrılmamış), `var` ve fonksiyon kapanışlarıyla yazılmış — taşımada yeniden yazım gerekir.
- Ön-okurlara wp modları kapalı (GS:17789) — TTS altyapısına rağmen dinleyerek çözme yolu yok.

---

## 5. Yeniden kullanılabilir varlıklar (dosya:satır)

### 5.1 Doğrudan kopyalanabilir SAF fonksiyonlar
| Varlık | Yer | Not |
|---|---|---|
| `numWord`, `NUM_WORDS` (TR 0-999) | NW:4-35 | saf |
| `numWordKu`, `NUM_WORDS_KU` | NW:110-142 | saf, FerMat |
| `numWordEn` | NW:159-172 (WPT:475-480 ikinci kopya, yalnız 0-99) | NW sürümünü kullan |
| `numWordLang(n, lang)` | NW:175 | dil seçici |
| `trG` / `trD` / `trK` / `trDA` (özel ad ekleri) | NW:39-52 | saf, test var: `src/data/numWords.test.js` |
| `trAbl(Suf)` / `trGen(Suf)` / `trDat(Suf)` / `trAcc(Suf)` (sayı ekleri) | NW:54-94 | okunuşa göre uyum |
| `capFirst`, `numDist` + `_DIST` | NW:96-100 | üleştirme sayısı |
| `WP_NAMES`, `WP_pick`, `WP_name`, `WP_pair` | NW:103-106 | 25 TR ad |
| `WP_NAMES_KU`, `WP_pairKu`, `WP_nameLang`, `WP_pairLang` | NW:151-153, 176-177 | 25 KU ad |
| `WP_NAMES_EN`, `WP_pairEn`, `_plEn`, `_capEn` | WPT:483-489 | 20 EN ad, çoğul |
| `kuEzafe`, `kuPlural` | NW:146-148 | şu an kullanılmıyor |
| `lp(level, arr)` | GS:4047 / WPT:253 | 5-kademe seçici |
| `CGI_TYPE_INFO` | GS:503-519 (= WPT:186-202) | taksonomi çekirdeği |
| `CGI_LABELS_TR/KU/EN` | GS:634-667; WPT:208-247, 450-466 | KU için tek set seçilmeli |
| `generateWordProblemKu` / `generateWordProblemEn` | WPT:339-443 / 606-710 | `Math.random` dışında saf; export'lu |
| `generateWordProblem` (TR, canlı) | GS:523-631 | GS içinde, export yok; bağımlılıkları NW + `lp` |
| `inferMisconception` deseni | misconceptions.js:90-153 | wp dalı eklenmeli (`q.cgiType`, `a/b/c`) |

### 5.2 Kodun içinden çıkarılabilecek (saf fonksiyona dönüştürülebilir) mantık
| Mantık | Yer | Önerilen imza |
|---|---|---|
| Verilen/İstenen doğal dil üretimi (find × dil) | GS:12595-12629 | `describeGivens(q, lang) → {givenA, givenB, asked}` |
| Denklem dizesi (bilinmeyen konumlu) | GS:12632-12646 | `equationFor(q) → "? + 4 = 9"` |
| Şema anahtarı (düzeltilerek) + şema kataloğu | GS:12851-12857 | `schemaOf(cgiType)` |
| "İstenen" çeldiricileri | GS:12891-12897 | `askedDistractors(find, obj, lang)` |
| Metin öbek bulucu + kelime bölütleme | GS:12684-12769 | `segmentProblem(text, nums, op, lang) → words[]` |
| İşlem sözcüğü listeleri (TR/EN) | GS:12727-12729 | yalnız analiz için; öğretimde kullanmayın |
| Kabul edilen işlemler | GS:12954 | `acceptedOps(find, op)` |
| Model düzeni (rod/unknown sırası) | GS:13059-13158 | `modelLayout(q) → [{kind:'rod'|'op'|'unknown', value, label}]` |
| Yıldız/puan formülü | GS:12540, 13261-13262 | `wpScore(errors)` |
| Tema renkleri (TR/KU/EN anahtar) | GS:12494-12526 | `WP_COLORS` |
| Tanısal çeldirici üretimi | GS:587-615 | `diagnosticDistractors(info, a, b, c, answer, maxNum)` |

### 5.3 Metin varlıkları
- **Şablon metinleri**: TR canlı GS:343-496 (47 şablon; örnek joinResult "`${trG(n[0])} sepetinde ${nw(a)} elma vardı. Ağaçtan ${nw(b)} tane daha topladı. Şimdi sepetinde kaç elma var?`" GS:349); TR ölü ama daha zengin kopya WPT:18-183 (birleştirilip tekilleştirilmeli); KU WPT:255-336; EN WPT:493-602. Her şablon `{text(a,b,c,names,nw), icon, theme, obj}`.
- **wpSchema şablonları** (uzay temalı, 3 şema × 3 dil × 3): GS:8704-8714; etiketler GS:8717.
- **Çok temsilli ipucu metinleri** (Somut/Görsel/Sembolik, 15 tür, TR+EN): GS:9682-9739.
- **CGI öğretim ipuçları** (TR, 15 tür): GS:11619-11635.
- **Adım yönergeleri ve maskot metinleri** (TR/KU/EN): Oku GS:12654-12665; Anla-0 GS:12776-12778, 12837; Anla-1 GS:12904, 12917; Anla-2 GS:12853-12866, 12872; İşlem GS:12936-12956; Model GS:13162, 13177; Hesapla GS:13198, 13226-13229; Özet GS:13258-13267.
- **K1 yönlendirici sorular**: hintManager.js:80-103 (TR), 163-184 (KU), 247-269 (EN) — wpSchema satırları (:97/:178/:263) anahtar-kelime içerdiği için ayıklanmalı.
- **Övgü/dönüt**: MATH_INSIGHTS GS:5125-5135 (TR), 5227 (KU), 5351 (EN); görev mesajları GS:11258 (EN), 11323 (TR), 5278 (KU).
- **Hikâye çerçevesi** (mission/story/alienEncounter): modeStories.js:22-26, 52 (TR); 123-146 (KU); 1443-1447 (KU v2); 1602-1606, 1630 (EN). strategyTip alanları anahtar-kelimeci — ayıklanmalı.
- **Yanılgı etiket/koç/literatür**: misconceptions.js:8-82.
- **Kanıt satırı**: site/kanit.html:40 (SBI: Jitendra; Fuchs ve ark. 2008; IES 2021 Öneri 5).
- **MEB/LT eşleme**: mebKazanim.js:41-45 (wpAdd/wpSub MAT.1.2.1, wpCompare MAT.1.2.4, wpMul/wpDiv MAT.2.2.4), :72 (wpSchema MAT.2.2.2); ltTrajectories.js:67-69 (Y04), :99 (Y05), :107-108 (Y06).

### 5.4 Bileşenler
- `NumberRod` (kapsül çubuğu): `src/components/math/NumberRod.jsx:6` (GS:3675'te iç kopya) — DokunSay'ın kendi kapsül bileşeniyle aynı görsel dil.
- `NumPadGrid`: GS:3776 (GS içinde; ayrıştırılmalı).

---

## 6. DokunSay "Problem Çözme" aracına aktarım için kısa notlar
1. Çekirdek olarak **`CGI_TYPE_INFO` + tekilleştirilmiş şablon havuzu (TR canlı ∪ TR ölü kopya, KU, EN) + NW ek fonksiyonları** alınmalı; üreteç üç dilde tek fonksiyona indirilebilir (sayı mantığı üçünde birebir aynı).
2. Akış korunabilir ama **şema adımı `cgiType`'tan** beslenmeli (karşılaştırma ve parça-bütün ayrı şema), **işlem sözcüğü (⚡) avı ve anahtar-kelime metinleri çıkarılmalı**.
3. Model adımı DokunSay'da **gerçek şerit/bar model**e (parça-bütün: bütün üstte/parçalar altta; karşılaştırma: hizalı iki şerit; eşit gruplar: tekrar eden şerit) ve **çocuğun uzunluğu kendisinin kurduğu** etkileşime yükseltilmeli.
4. Adım-düzeyi olay kaydı + wp yanılgı dalı (`islem_karistirma`, `buyugu_soyleme`, `parca_yerine_butun`, yeni `anahtar_kelime`) eklenmeli; hata sayacı adım başına tutulmalı; ustalıkta adımlar solmalı (fading).
5. Eklenecek kapsam: problem kurma, iki adımlı, gereksiz bilgili, tutarsız dilli, ölçme/para/zaman bağlamlı, çarpımsal karşılaştırmanın diğer iki biçimi, kalanlı bölme, kesir (birim kesir paylaşımı).

