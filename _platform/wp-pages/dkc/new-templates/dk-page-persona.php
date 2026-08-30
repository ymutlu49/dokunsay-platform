<?php
/** Template: /ebeveynler/ or /ogretmenler/ — included by dk-content.php only (updated 2026-05-03) */
if (!defined('ABSPATH')) exit;
if (!class_exists('DK_Content_Routing')) return;
$_dkp = get_query_var('dk_page');
if ($_dkp !== 'ebeveyn' && $_dkp !== 'ogretmen') return;
$type = $GLOBALS['dk_persona_type'] ?? 'ebeveyn';
$is_parent = $type === 'ebeveyn';
?>
<?php if ($is_parent): ?>
<style>
.dk-p-hero{background:linear-gradient(180deg,#fff 0%,#fdf2f8 100%);padding:56px 20px;text-align:center;border-bottom:1px solid rgba(0,0,0,.06);font-family:'Inter',sans-serif}
.dk-p-hero .wrap{max-width:800px;margin:0 auto}
.dk-p-eyebrow{display:inline-block;background:#ec489922;color:#ec4899;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:14px;border:1px solid #ec489944}
.dk-p-hero h1{font-size:clamp(26px,3.6vw,38px);font-weight:800;color:#031f42;margin:0 0 14px;letter-spacing:-.02em;line-height:1.2}
.dk-p-hero p{font-size:clamp(15px,1.2vw,17px);color:#4a5568;margin:0 auto;max-width:680px;line-height:1.7}
.dk-p-section{padding:48px 20px;font-family:'Inter',sans-serif}
.dk-p-section .wrap{max-width:1100px;margin:0 auto}
.dk-p-section h2{font-size:clamp(22px,2.3vw,28px);font-weight:800;color:#031f42;margin:0 0 14px;letter-spacing:-.01em;text-align:center;display:flex;align-items:center;justify-content:center;gap:10px}
.dk-p-section h2::before{content:"";width:4px;height:24px;background:#ec4899;border-radius:3px}
.dk-p-section .sub{text-align:center;color:#6a7390;max-width:680px;margin:0 auto 32px;font-size:15px;line-height:1.65}
.dk-p-section p{color:#4a5568;font-size:15px;line-height:1.75;margin:0 0 14px}

.dk-p-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
.dk-p-step{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:14px;padding:26px 24px;transition:all .3s cubic-bezier(0.16,1,0.3,1);position:relative;overflow:hidden}
.dk-p-step:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(3,31,66,.08);border-color:#ec4899}
.dk-p-step-num{width:42px;height:42px;border-radius:50%;background:#ec4899;color:#fff;display:inline-grid;place-items:center;font-weight:800;font-size:18px;margin-bottom:14px}
.dk-p-step h3{font-size:18px;font-weight:800;margin:0 0 8px;color:#031f42}
.dk-p-step p{font-size:14px;color:#6a7390;line-height:1.65;margin:0 0 14px}
.dk-p-step a{font-size:13px;font-weight:700;color:#ec4899;text-decoration:none;display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:8px;background:#ec489910;transition:all .2s}
.dk-p-step a:hover{background:#ec4899;color:#fff}

.dk-p-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:6px}
.dk-p-card{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:12px;padding:20px 22px}
.dk-p-card h4{font-size:15px;font-weight:700;margin:0 0 8px;color:#031f42}
.dk-p-card p{font-size:13.5px;color:#4a5568;margin:0;line-height:1.6}

.dk-p-prose{max-width:780px;margin:0 auto}
.dk-p-prose p{font-size:15px;color:#4a5568;line-height:1.78;margin:0 0 16px}
.dk-p-prose h3{font-size:18px;font-weight:700;color:#031f42;margin:24px 0 8px}
.dk-p-prose ul{padding-left:22px;margin:8px 0 16px}
.dk-p-prose li{font-size:15px;color:#4a5568;line-height:1.7;margin-bottom:8px}
.dk-p-cite{display:inline-block;background:rgba(236,72,153,.1);color:#be185d;font-size:12px;padding:1px 7px;border-radius:6px;font-weight:600;margin:0 2px;white-space:nowrap}

.dk-p-cta{background:linear-gradient(135deg,#ec4899 0%,#be185d 100%);color:#fff;padding:46px 32px;border-radius:16px;text-align:center;margin:28px 0;position:relative;overflow:hidden}
.dk-p-cta::before{content:"";position:absolute;top:-50%;right:-10%;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.15),transparent 70%)}
.dk-p-cta h2{color:#fff !important;margin:0 0 10px;position:relative;text-align:center;justify-content:center}
.dk-p-cta h2::before{display:none}
.dk-p-cta p{color:rgba(255,255,255,.92);margin:0 0 22px;max-width:580px;margin-left:auto;margin-right:auto;position:relative;font-size:15px;line-height:1.65}
.dk-p-cta-btns{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;position:relative}

.dk-p-callout{background:#fefbe9;border:1px solid #ffc221;border-left:4px solid #ffc221;border-radius:12px;padding:20px 24px;margin:22px auto;max-width:780px}
.dk-p-callout strong{color:#92400e;display:block;margin-bottom:6px;font-size:14px;letter-spacing:.04em}
.dk-p-callout p{margin:0;color:#374151;font-size:14px;line-height:1.65}
</style>

<header class="dk-p-hero">
  <div class="wrap">
    <span class="dk-p-eyebrow">Ebeveynler için akademik rehber</span>
    <h1>Çocuğunuzun matematikteki güçlüğü neyle ilgili olabilir?</h1>
    <p>Okul çağı çocuklarının yaklaşık %3–7'sinde matematik öğrenme güçlüğü (diskalkuli) gözlenir <span class="dk-p-cite">Kucian &amp; von Aster, 2015</span>. Belirtiler çoğu zaman "yetersiz çalışma" olarak yorumlansa da, alanyazın bu güçlüklerin sayı işleme devrelerindeki nörobilişsel farklılıklarla ilişkili olduğunu göstermektedir <span class="dk-p-cite">Butterworth ve ark., 2011</span>. Bu rehber, ebeveynlere bilimsel temelli gözlem, değerlendirme ve destek yolları sunar.</p>
  </div>
</header>

<section class="dk-p-section" style="background:#fff">
  <div class="wrap">
    <h2>Üç adımlık aile yolculuğu</h2>
    <p class="sub">Alanyazın temelli bir çerçeve: önce anlama, sonra bilimsel değerlendirme, ardından sistematik destek. Aile-okul iş birliği bu sürecin kritik bileşenidir <span class="dk-p-cite">Mazzocco &amp; Thompson, 2005</span>.</p>
    <div class="dk-p-steps">
      <div class="dk-p-step">
        <div class="dk-p-step-num">1</div>
        <h3>Önce anlayın</h3>
        <p>Diskalkulinin tanımı, gelişimsel işaretleri ve eşgörü durumlarını içeren akademik rehberi inceleyin. Doğru bilgi, ailelerin yaşadığı belirsizliği ve kaygıyı önemli ölçüde azaltır.</p>
        <a href="/diskalkuli-nedir/">Diskalkuli Nedir? rehberini oku →</a>
      </div>
      <div class="dk-p-step">
        <div class="dk-p-step-num">2</div>
        <h3>Bilimsel değerlendirme yapın</h3>
        <p>Numap dijital değerlendirme platformu, A1–A11 alt-test bataryası üzerinden okul öncesinden ilkokul 4. sınıfa kadar (48–119 ay / 4–10 yaş) Türkiye normlarına göre risk düzeyi tahmini sunar.</p>
        <a href="/platform/numap.html">Numap ile değerlendir →</a>
      </div>
      <div class="dk-p-step">
        <div class="dk-p-step-num">3</div>
        <h3>Sistematik destek sağlayın</h3>
        <p>Müdahale aşamasında oyunlaştırılmış Galaksay modülleri ve sınıf/ev içi DokunSay araçları kısa süreli, düzenli ve aşamalı pratik için tasarlanmıştır.</p>
        <a href="/araclar/">DokunSay araçlarını keşfet →</a>
      </div>
    </div>
  </div>
</section>

<section class="dk-p-section" style="background:#f9fafb">
  <div class="wrap">
    <h2>Aile rolü: gözlemden destek vermeye</h2>
    <div class="dk-p-prose">
      <p>Diskalkulili çocuklarda aile çevresinin niteliği, akademik gelişimi anlamlı ölçüde etkileyen değişkenlerden biridir <span class="dk-p-cite">Shalev, 2004</span>. Düşük sosyoekonomik koşullar veya sınırlı eğitim materyallerine erişim, klinik tablonun maskelenmesine ya da derinleşmesine yol açabilir <span class="dk-p-cite">Price &amp; Ansari, 2013</span>. Tersine, bilinçli aile katılımı ve okul-ev iş birliği, çocuğun matematikle kurduğu ilişkiyi olumlu yönde dönüştürmektedir <span class="dk-p-cite">Mazzocco &amp; Thompson, 2005</span>.</p>

      <h3>Gözlem temelli yaklaşım</h3>
      <p>Erken işaretler genellikle ev ortamında, oyun ve günlük yaşam etkinlikleri sırasında belirir. Ailelerin sistematik gözlem yapması — bir günlük tutması veya kontrol listeleri kullanması — tanılama sürecini hızlandırır <span class="dk-p-cite">Kaufmann ve ark., 2013</span>. Aşağıdaki sorular gözleme rehber olabilir:</p>
      <ul>
        <li>Çocuk küçük kümeleri (1–4 nesne) anında tanıyabiliyor mu?</li>
        <li>"Daha çok / daha az" karşılaştırmalarında tutarlı yanıt veriyor mu?</li>
        <li>Sayma işleminde nesneleri atlama veya tekrar sayma sıklığı nedir?</li>
        <li>Saat, para, ölçü gibi günlük nicelik kavramlarında zorluk yaşıyor mu?</li>
        <li>Matematik içeren etkinlik öncesi/sırasında fizyolojik kaygı tepkileri (karın ağrısı, ağlama) gösteriyor mu? <span class="dk-p-cite">Mammarella ve ark., 2015</span></li>
      </ul>

      <h3>Damgalamadan kaçınma</h3>
      <p>Alanyazın, çocuğun kapasitesinin "tembellik" veya "ilgisizlik" olarak yorumlanmasının matematik kaygısını derinleştirdiğini ortaya koymaktadır <span class="dk-p-cite">Rubinsten &amp; Tannock, 2010</span>. Diskalkuli, zekâ düzeyinden bağımsız, sayı işleme süreçlerine özgü bir farklılıktır <span class="dk-p-cite">Butterworth ve ark., 2011</span>. Ailenin tutumu — başarısızlığı kişisel bir eksiklik olarak değil, üzerine çalışılabilir bir alan olarak çerçevelemesi — çocuğun öğrenmeye yönelik motivasyonunu korur <span class="dk-p-cite">Beilock &amp; Maloney, 2015</span>.</p>

      <h3>Evde günlük matematik pratikleri</h3>
      <p>Kısa süreli ve düzenli ev içi matematik etkinlikleri, sınıf desteğinin etkisini güçlendirir <span class="dk-p-cite">Geary ve ark., 2004</span>. Önerilen ilkeler:</p>
      <ul>
        <li><strong>Süre yerine düzenlilik.</strong> Günlük 10–20 dakika, haftada birkaç saatlik tek seferlik çalışmadan daha etkilidir.</li>
        <li><strong>Somut materyalden başlama.</strong> Sayı çubukları, pullar, ölçü kapları gibi nesneler kavramı bedenleştirir; bu, somut–yarı somut–soyut (CRA) öğretim yaklaşımının temelidir <span class="dk-p-cite">Powell ve ark., 2020</span>.</li>
        <li><strong>Hata kabulü.</strong> Hatayı düzeltici bir yorum yerine birlikte keşfedilecek bir bilgi olarak ele almak, kaygı düzeyini düşürür <span class="dk-p-cite">Beilock &amp; Maloney, 2015</span>.</li>
        <li><strong>Günlük yaşam bağlamı.</strong> Alışverişte para üstü, mutfakta ölçü, oyunda zaman gibi otantik bağlamlar matematiksel düşünmenin transferini destekler.</li>
      </ul>
    </div>
  </div>
</section>

<section class="dk-p-section" style="background:#fff">
  <div class="wrap">
    <h2>Aile-okul iş birliği</h2>
    <div class="dk-p-cards">
      <div class="dk-p-card">
        <h4>Düzenli iletişim</h4>
        <p>Sınıf öğretmeni ve rehber öğretmenle haftalık ya da iki haftalık görüşmeler; gözlemlerin karşılıklı paylaşılması.</p>
      </div>
      <div class="dk-p-card">
        <h4>Ortak hedefler</h4>
        <p>Okuldaki destek planı ile ev pratikleri aynı kazanımları hedeflemeli; çelişen yöntemler çocuğu zorlar.</p>
      </div>
      <div class="dk-p-card">
        <h4>Veri temelli izleme</h4>
        <p>Numap raporları aile ve öğretmenle paylaşılarak gelişim verisi üzerinden ortak karar verilebilir.</p>
      </div>
      <div class="dk-p-card">
        <h4>Uzman desteği</h4>
        <p>Şüphe sürdüğünde rehberlik araştırma merkezleri (RAM), eğitim psikoloğu veya çocuk gelişim uzmanı ile yönlendirme alın.</p>
      </div>
      <div class="dk-p-card">
        <h4>Kardeş ve aile dinamiği</h4>
        <p>Diskalkulili çocuğun kardeşleriyle karşılaştırılması, kaygıyı derinleştirir. Bireysel ilerleme ön plana alınmalıdır.</p>
      </div>
      <div class="dk-p-card">
        <h4>Sürekli gelişim</h4>
        <p>Tek seferlik müdahale yerine 6–12 aylık sistematik destek, kalıcı dönüşüm için zemin oluşturur <span class="dk-p-cite">Kaufmann ve ark., 2013</span>.</p>
      </div>
    </div>
  </div>
</section>

<section class="dk-p-section" style="background:#f9fafb">
  <div class="wrap">
    <h2>Sıkça karşılaşılan sorular</h2>
    <div class="dk-p-cards">
      <div class="dk-p-card">
        <h4>Çocuğum sadece matematikten korkuyor olabilir mi?</h4>
        <p>Matematik kaygısı ile diskalkuli farklı kavramlardır ancak birbirini besler. Bilimsel değerlendirme, kaygı odaklı bir tabloyla nörogelişimsel bir farklılığı ayırt edebilir <span class="dk-p-cite">Mammarella ve ark., 2015</span>.</p>
      </div>
      <div class="dk-p-card">
        <h4>Ne zaman uzman desteği almalıyım?</h4>
        <p>Belirtiler en az 6 ay süreyle ve yaşıt ortalamasının belirgin altında kalıyorsa, kapsamlı bir değerlendirme önerilir <span class="dk-p-cite">APA, 2013</span>.</p>
      </div>
      <div class="dk-p-card">
        <h4>Numap'ı evde mi kullanmalıyım?</h4>
        <p>Numap, sessiz ve dikkat dağıtmayan bir ortamda, bir yetişkin gözetiminde uygulanmalıdır. Sonuç raporu okul rehberlik servisi veya çocuk gelişim uzmanıyla birlikte yorumlanmalıdır.</p>
      </div>
      <div class="dk-p-card">
        <h4>Çocuğumun zekâsında bir sorun mu var?</h4>
        <p>Hayır. Diskalkuli, zekâ düzeyinden bağımsız bir öğrenme güçlüğüdür. Ortalama veya üzeri zekâ düzeyine sahip çocuklarda da görülebilir <span class="dk-p-cite">APA, 2013</span>.</p>
      </div>
    </div>

    <div class="dk-p-callout">
      <strong>Önemli not</strong>
      <p>Bu sayfadaki tüm bilgiler eğitim ve farkındalık amaçlıdır. Klinik tanı için her zaman bir uzmana (çocuk ve ergen ruh sağlığı, çocuk gelişim, eğitim psikolojisi) başvurulmalıdır.</p>
    </div>
  </div>
</section>

<section class="dk-p-section" style="background:#fff">
  <div class="wrap">
    <div class="dk-p-cta">
      <h2>Şüpheyi bilime dönüştürün</h2>
      <p>Çocuğunuzu okul öncesinden ilkokul 4. sınıfa kadar (48–119 ay / 4–10 yaş) Numap A1–A11 bataryası ile yaklaşık 15 dakikada bilimsel olarak değerlendirin.</p>
      <div class="dk-p-cta-btns">
        <a class="dk-btn dk-btn--secondary dk-btn--lg" href="/platform/numap.html">Numap ile Değerlendir →</a>
        <a class="dk-btn dk-btn--ghost dk-btn--lg" href="/diskalkuli-nedir/" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.4)">Önce Bilgi Edinmek İstiyorum</a>
      </div>
    </div>
  </div>
</section>

<?php else: ?>
<style>
.dk-p-hero{background:linear-gradient(180deg,#fff 0%,#e8f2fc 100%);padding:56px 20px;text-align:center;border-bottom:1px solid rgba(0,0,0,.06);font-family:'Inter',sans-serif}
.dk-p-hero .wrap{max-width:840px;margin:0 auto}
.dk-p-eyebrow{display:inline-block;background:#0071dc22;color:#0071dc;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:14px;border:1px solid #0071dc44}
.dk-p-hero h1{font-size:clamp(26px,3.6vw,38px);font-weight:800;color:#031f42;margin:0 0 14px;letter-spacing:-.02em;line-height:1.2}
.dk-p-hero p{font-size:clamp(15px,1.2vw,17px);color:#4a5568;margin:0 auto;max-width:720px;line-height:1.7}
.dk-p-section{padding:48px 20px;font-family:'Inter',sans-serif}
.dk-p-section .wrap{max-width:1100px;margin:0 auto}
.dk-p-section h2{font-size:clamp(22px,2.3vw,28px);font-weight:800;color:#031f42;margin:0 0 14px;letter-spacing:-.01em;text-align:center;display:flex;align-items:center;justify-content:center;gap:10px}
.dk-p-section h2::before{content:"";width:4px;height:24px;background:#0071dc;border-radius:3px}
.dk-p-section .sub{text-align:center;color:#6a7390;max-width:680px;margin:0 auto 32px;font-size:15px;line-height:1.65}
.dk-p-section p{color:#4a5568;font-size:15px;line-height:1.75;margin:0 0 14px}

.dk-p-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
.dk-p-step{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:14px;padding:26px 24px;transition:all .3s cubic-bezier(0.16,1,0.3,1);position:relative;overflow:hidden}
.dk-p-step:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(3,31,66,.08);border-color:#0071dc}
.dk-p-step-num{width:42px;height:42px;border-radius:50%;background:#0071dc;color:#fff;display:inline-grid;place-items:center;font-weight:800;font-size:18px;margin-bottom:14px}
.dk-p-step h3{font-size:18px;font-weight:800;margin:0 0 8px;color:#031f42}
.dk-p-step p{font-size:14px;color:#6a7390;line-height:1.65;margin:0 0 14px}
.dk-p-step a{font-size:13px;font-weight:700;color:#0071dc;text-decoration:none;display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:8px;background:#0071dc10;transition:all .2s}
.dk-p-step a:hover{background:#0071dc;color:#fff}

.dk-p-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:6px}
.dk-p-card{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:12px;padding:20px 22px}
.dk-p-card h4{font-size:15px;font-weight:700;margin:0 0 8px;color:#031f42}
.dk-p-card p{font-size:13.5px;color:#4a5568;margin:0;line-height:1.6}

.dk-p-prose{max-width:820px;margin:0 auto}
.dk-p-prose p{font-size:15px;color:#4a5568;line-height:1.78;margin:0 0 16px}
.dk-p-prose h3{font-size:18px;font-weight:700;color:#031f42;margin:24px 0 8px}
.dk-p-prose ul,.dk-p-prose ol{padding-left:22px;margin:8px 0 16px}
.dk-p-prose li{font-size:15px;color:#4a5568;line-height:1.7;margin-bottom:8px}
.dk-p-cite{display:inline-block;background:rgba(0,113,220,.1);color:#005bb3;font-size:12px;padding:1px 7px;border-radius:6px;font-weight:600;margin:0 2px;white-space:nowrap}

.dk-p-tier{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;margin:14px 0}
.dk-p-tier-card{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:12px;padding:20px;border-top:4px solid #0071dc}
.dk-p-tier-card.t2{border-top-color:#f59e0b}
.dk-p-tier-card.t3{border-top-color:#ef4444}
.dk-p-tier-card .tier-num{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#0071dc;margin-bottom:6px;display:block}
.dk-p-tier-card.t2 .tier-num{color:#f59e0b}
.dk-p-tier-card.t3 .tier-num{color:#ef4444}
.dk-p-tier-card h4{font-size:15px;font-weight:700;margin:0 0 8px;color:#031f42}
.dk-p-tier-card p{font-size:13.5px;color:#4a5568;margin:0 0 8px;line-height:1.6}
.dk-p-tier-card .pop{font-size:12px;color:#6a7390;font-style:italic}

.dk-p-cta{background:linear-gradient(135deg,#0071dc 0%,#005bb3 100%);color:#fff;padding:46px 32px;border-radius:16px;text-align:center;margin:28px 0;position:relative;overflow:hidden}
.dk-p-cta::before{content:"";position:absolute;top:-50%;right:-10%;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.15),transparent 70%)}
.dk-p-cta h2{color:#fff !important;margin:0 0 10px;position:relative;text-align:center;justify-content:center}
.dk-p-cta h2::before{display:none}
.dk-p-cta p{color:rgba(255,255,255,.92);margin:0 0 22px;max-width:580px;margin-left:auto;margin-right:auto;position:relative;font-size:15px;line-height:1.65}
.dk-p-cta-btns{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;position:relative}

.dk-p-callout{background:#f0f7ff;border:1px solid #0071dc44;border-left:4px solid #0071dc;border-radius:12px;padding:20px 24px;margin:22px auto;max-width:820px}
.dk-p-callout strong{color:#005bb3;display:block;margin-bottom:6px;font-size:14px;letter-spacing:.04em}
.dk-p-callout p{margin:0;color:#374151;font-size:14px;line-height:1.65}
</style>

<header class="dk-p-hero">
  <div class="wrap">
    <span class="dk-p-eyebrow">Öğretmenler için akademik rehber</span>
    <h1>Sınıfta diskalkuli risklerini fark etmek ve yönetmek</h1>
    <p>Okul çağı çocuklarının yaklaşık %3–7'sinde matematik öğrenme güçlüğü gözlenir <span class="dk-p-cite">Kucian &amp; von Aster, 2015</span>. Sınıf içinde belirginleşen örüntüler — yaşıtlarına göre uzun süreli parmak sayma, basamak değerinin yerleşmemesi, çarpım tablosunun otomatikleşmemesi — rastlantı değil, taranabilir bilişsel işaretlerdir <span class="dk-p-cite">Geary, 2010</span>. Bu rehber öğretmenler için sınıf içi tarama, farklılaştırılmış öğretim ve müdahaleye yanıt (RTI) yaklaşımlarını derler.</p>
  </div>
</header>

<section class="dk-p-section" style="background:#fff">
  <div class="wrap">
    <h2>Sınıfınız için üç katmanlı pratik akış</h2>
    <p class="sub">Müfredat içi uygulanabilir, kanıt temelli ve MEB kazanımlarıyla uyumlu bir akış. Tarama → farklılaştırma → hedefli müdahale.</p>
    <div class="dk-p-steps">
      <div class="dk-p-step">
        <div class="dk-p-step-num">1</div>
        <h3>Sistematik tarama</h3>
        <p>Numap dijital değerlendirme platformu ile sınıfınızı A1–A11 bataryası üzerinden topluca tarayın. Türkiye normlarına göre risk haritası otomatik üretilir; bireysel test yükü ortadan kalkar.</p>
        <a href="/platform/numap.html">Numap kurumsal panel →</a>
      </div>
      <div class="dk-p-step">
        <div class="dk-p-step-num">2</div>
        <h3>Sınıf içi farklılaştırma</h3>
        <p>DokunSay'ın 7 ücretsiz interaktif aracı (sayı çubukları, basamak değeri, kesir, saat, tam sayılar, geometri, istatistik) somut–yarı somut–soyut (CRA) öğretim için tasarlanmıştır. Kurulum gerektirmez, tarayıcıda çalışır.</p>
        <a href="/araclar/">DokunSay araçlarına git →</a>
      </div>
      <div class="dk-p-step">
        <div class="dk-p-step-num">3</div>
        <h3>Hedefli müdahale</h3>
        <p>Galaksay, risk altındaki öğrenciler için haftalık 3×15 dakikalık bireyselleştirilmiş, oyunlaştırılmış modüller sağlar. Uyarlanabilir zorluk + beş seviye ipucu + üçlü kodlama ilkesiyle tasarlanmıştır.</p>
        <a href="/platform/galaksay.html">Galaksay modülleri →</a>
      </div>
    </div>
  </div>
</section>

<section class="dk-p-section" style="background:#f9fafb">
  <div class="wrap">
    <h2>Sınıf içi gözlem örüntüleri</h2>
    <div class="dk-p-prose">
      <p>Diskalkuli alanyazını, sınıf ortamında belirginleşen ve birden çok kez gözlemlendiğinde anlamlı hâle gelen tipik örüntüler tanımlar <span class="dk-p-cite">Geary, 2010</span><span class="dk-p-cite">Butterworth ve ark., 2011</span>. Aşağıdaki davranışlardan birden fazlası, en az 3–6 ay süreyle ve yaşıt ortalamasının belirgin altında gözlemleniyorsa, kapsamlı değerlendirme önerilir <span class="dk-p-cite">APA, 2013</span>.</p>

      <h3>İlkokul 1.–2. sınıf düzeyinde dikkat çeken örüntüler</h3>
      <ul>
        <li>Basit toplama/çıkarmanın akıcılaşmaması; her işlem için yeniden parmak sayma.</li>
        <li>Onluk-birlik kavrayışında belirsizlik; basamak değerinin hesaba katılmaması (örn. 23 + 14 → 37 yerine 37 hatasının nedenini açıklayamama).</li>
        <li>Sayı doğrusu üzerinde miktar yerleştirmede belirgin sapma <span class="dk-p-cite">Mazzocco ve ark., 2011</span>.</li>
        <li>Saat okumada uzun süreli güçlük; saat-dakika ayrımının yerleşmemesi.</li>
        <li>Sayı sembollerini ve sözcüklerini eşleştirmede tutarsızlık (rakam–sözcük transkodlama hataları).</li>
      </ul>

      <h3>İlkokul 3.–4. sınıf düzeyinde dikkat çeken örüntüler</h3>
      <ul>
        <li>Çarpım tablosunda otomatikleşme yok; her sorguya yeniden hesaplama veya parmak desteği.</li>
        <li>Yazılı işlemde basamak hizalaması, "elde var" ara değerlerinin tutulamaması <span class="dk-p-cite">Geary ve ark., 2004</span>.</li>
        <li>Sözel problemlerde hangi işlemin gerekli olduğunu seçememe (problem temsil güçlüğü).</li>
        <li>Çalışma belleği yükü artan görevlerde belirgin performans düşüşü <span class="dk-p-cite">Passolunghi &amp; Mammarella, 2012</span>.</li>
        <li>Matematik etkinliği öncesi/esnasında yoğun kaygı; kaçınma davranışları, dikkati başka noktaya çekme <span class="dk-p-cite">Mammarella ve ark., 2015</span>.</li>
      </ul>

      <h3>Ayırt edici nokta: motivasyon mu, kapasite mi?</h3>
      <p>Düşük matematik performansı pek çok nedenden kaynaklanabilir: dil güçlükleri, dikkat sorunları, okul devamsızlığı, kaygı, motivasyon ya da diskalkuli. Sınıf içi gözlem tek başına ayırt edici değildir; bu nedenle norm temelli bir tarama aracı (örn. Numap A1–A11 bataryası) ve uzman değerlendirmesi önerilir <span class="dk-p-cite">Mutlu &amp; Akgün, 2017</span>.</p>
    </div>
  </div>
</section>

<section class="dk-p-section" style="background:#fff">
  <div class="wrap">
    <h2>Müdahaleye Yanıt (RTI) modeli — üç katmanlı destek</h2>
    <p class="sub">Müdahaleye Yanıt (Response to Intervention), öğrencinin desteğe verdiği yanıta göre yoğunluğu kademeli artıran bir okul-temelli destek modelidir. Sınıf öğretmeni ilk iki katmanın aktif uygulayıcısıdır.</p>
    <div class="dk-p-tier">
      <div class="dk-p-tier-card">
        <span class="tier-num">Katman 1</span>
        <h4>Genel sınıf öğretimi</h4>
        <p>Tüm öğrenciler için CRA temelli, somut materyalle desteklenmiş, çoklu temsil içeren öğretim. Düzenli izleme ile yanıt vermeyenler tespit edilir.</p>
        <p class="pop">≈ %80 öğrenci</p>
      </div>
      <div class="dk-p-tier-card t2">
        <span class="tier-num">Katman 2</span>
        <h4>Küçük grup hedefli destek</h4>
        <p>Risk altındaki öğrenciler için haftada 3–4 oturum, 20–30 dakikalık küçük grup çalışması. DokunSay araçları ve adımlı problem rehberleri bu katmanda etkilidir.</p>
        <p class="pop">≈ %15 öğrenci</p>
      </div>
      <div class="dk-p-tier-card t3">
        <span class="tier-num">Katman 3</span>
        <h4>Bireysel yoğun müdahale</h4>
        <p>Üst katmanlara yanıt vermeyen öğrenciler için bireyselleştirilmiş eğitim programı (BEP) çerçevesinde çocuk gelişim uzmanı, RAM ve aile iş birliği.</p>
        <p class="pop">≈ %3–5 öğrenci</p>
      </div>
    </div>
    <div class="dk-p-callout">
      <strong>Önemli</strong>
      <p>RTI bir tanılama aracı değildir; ancak diskalkuli tanısının okul-temelli kanıtlarla desteklenmesinde önemli bir bileşendir. Tanısal karar her zaman çok kaynaklı bir değerlendirme gerektirir <span class="dk-p-cite">Kaufmann ve ark., 2013</span>.</p>
    </div>
  </div>
</section>

<section class="dk-p-section" style="background:#f9fafb">
  <div class="wrap">
    <h2>Farklılaştırılmış öğretim ilkeleri</h2>
    <div class="dk-p-prose">
      <p>Diskalkulili öğrencilerle çalışırken etkili olduğu kanıtlanmış pedagojik ilkeler şu başlıklar altında derlenebilir <span class="dk-p-cite">Powell ve ark., 2020</span><span class="dk-p-cite">Kucian &amp; von Aster, 2015</span>:</p>

      <h3>1. Somut–Yarı Somut–Soyut (CRA) öğretim</h3>
      <p>Bruner'in temsil kuramı temelinde her kavramı önce nesneyle, ardından görsel temsille, son olarak sembolle sunma. Geçişler aceleye getirilmemeli; öğrencinin somut aşamada güvende hissetmesi soyutlama eşiğine geçişin koşuludur.</p>

      <h3>2. Çoklu duyusal kodlama ve üçlü temsil</h3>
      <p>Bir matematiksel kavramın aynı anda nesne, görsel ve sembol katmanlarında sunulması; öğrencinin farklı temsiller arasında bağ kurmasını destekler <span class="dk-p-cite">Powell ve ark., 2020</span>. DokunSay araçları bu üçlü kodlama ilkesi üzerine inşa edilmiştir.</p>

      <h3>3. Çalışma belleği yükünü hafifletme</h3>
      <p>Çok adımlı işlemler için adım adım rehberler, görsel ipuçları, yapışkan notlarla ara değerlerin kaydedilmesi gibi "dış bellek" stratejileri öğrenciyi destekler <span class="dk-p-cite">Geary ve ark., 2004</span><span class="dk-p-cite">Swanson, 2006</span>.</p>

      <h3>4. Aşamalı zorluk ve sık geri bildirim</h3>
      <p>Öğrencinin yapabileceği görevlerden başlayıp aşamalı olarak zorluk arttırılmalı; her adımda doğrulayıcı ve düzeltici geri bildirim verilmelidir. Kısa, hedefe yönelik etkinlikler, dikkat süresi sınırlı öğrenciler için uygundur <span class="dk-p-cite">Ashkenazi ve ark., 2009</span>.</p>

      <h3>5. Kaygı duyarlı pedagoji</h3>
      <p>Hata yapma korkusunu düşüren, deneme-yanılma kültürünü besleyen geri bildirim; ceza yerine süreç odaklı yaklaşım, matematik kaygısının pekişmesini engeller <span class="dk-p-cite">Beilock &amp; Maloney, 2015</span>.</p>

      <h3>6. Eşgörü farkındalığı</h3>
      <p>Diskalkuli sıklıkla disleksi, DEHB veya dil güçlükleriyle birlikte görülür <span class="dk-p-cite">Willcutt ve ark., 2013</span>. Sözel yönergelerin kısaltılması, görsel destek, dikkat sürdürme egzersizleri bu eşgörü durumlarda kritik öneme sahiptir.</p>
    </div>
  </div>
</section>

<section class="dk-p-section" style="background:#fff">
  <div class="wrap">
    <h2>Sınıf içi pratik kaynaklar</h2>
    <div class="dk-p-cards">
      <div class="dk-p-card">
        <h4>Numap (Tanılama)</h4>
        <p>A1–A11 bataryası ile okul öncesinden ilkokul 4. sınıfa kadar (48–119 ay / 4–10 yaş) Türkiye normlarına göre risk taraması.</p>
      </div>
      <div class="dk-p-card">
        <h4>Galaksay (Müdahale)</h4>
        <p>59+ oyunlaştırılmış modül, uyarlanabilir zorluk, üçlü kodlama. Risk altındaki öğrenciler için yapılandırılmış destek.</p>
      </div>
      <div class="dk-p-card">
        <h4>DokunSay araçları (Sınıf içi)</h4>
        <p>7 ücretsiz interaktif web aracı: sayı çubukları, basamak değeri, kesir, saat, tam sayılar, geometri, istatistik.</p>
      </div>
      <div class="dk-p-card">
        <h4>Bilgi rehberleri</h4>
        <p>Diskalkuli temel kavramları, gelişimsel işaretler ve eşgörü durumları için akademik kaynaklı rehber.</p>
      </div>
      <div class="dk-p-card">
        <h4>Aile iletişim materyalleri</h4>
        <p>Aile-okul iş birliği için ev içi gözlem rehberi ve günlük matematik pratikleri kılavuzu.</p>
      </div>
      <div class="dk-p-card">
        <h4>Kurumsal kullanım</h4>
        <p>Okul, RAM, klinik ve özel eğitim merkezleri için çoklu lisans ve uygulayıcı paneli mevcuttur.</p>
      </div>
    </div>
  </div>
</section>

<section class="dk-p-section" style="background:#f9fafb">
  <div class="wrap">
    <h2>Sıkça karşılaşılan sorular</h2>
    <div class="dk-p-cards">
      <div class="dk-p-card">
        <h4>Tanı koyma yetkim var mı?</h4>
        <p>Sınıf öğretmeni tanı koymaz; gözlemleyen ve yönlendirendir. Tanı süreci uzman değerlendirmesi (RAM, çocuk gelişim, eğitim psikolojisi) gerektirir.</p>
      </div>
      <div class="dk-p-card">
        <h4>Numap'ı ders saatinde mi kullanmalıyım?</h4>
        <p>Sınıfça tarama için ayrı bir oturum (örn. rehberlik saati) önerilir. Ortam sessiz ve dikkat dağıtmayan olmalıdır.</p>
      </div>
      <div class="dk-p-card">
        <h4>Risk altındaki öğrenciye nasıl yaklaşmalıyım?</h4>
        <p>Damgalama yapmadan, görev paylaşımı ve aşamalı destek ile yaklaşın. Aileyi sürece dahil edin; ortak bir destek planı oluşturun.</p>
      </div>
      <div class="dk-p-card">
        <h4>Müdahale ne zaman sonuç verir?</h4>
        <p>Hedefli ve sistematik müdahalede 4–6 hafta içinde ilk anlamlı değişimler gözlenebilir; kalıcı dönüşüm 6–12 aylık çalışma gerektirir <span class="dk-p-cite">Kaufmann ve ark., 2013</span>.</p>
      </div>
      <div class="dk-p-card">
        <h4>Diğer bozukluklarla nasıl ayırırım?</h4>
        <p>Eşgörü olasılığı yüksek olduğundan kesin ayrım için kapsamlı değerlendirme şarttır <span class="dk-p-cite">Willcutt ve ark., 2013</span>. Sınıf içi gözlem destekleyici bir veridir.</p>
      </div>
      <div class="dk-p-card">
        <h4>Veli ile nasıl iletişim kurmalıyım?</h4>
        <p>Gözlemlerinizi etiketleme yapmadan, somut örneklerle paylaşın. Aileyi suçlayıcı dilden kaçının; iş birliğine açık bir çerçeve oluşturun.</p>
      </div>
    </div>
  </div>
</section>

<section class="dk-p-section" style="background:#fff">
  <div class="wrap">
    <div class="dk-p-cta">
      <h2>Sınıfınızı bilimsel temelle destekleyin</h2>
      <p>Numap ile sınıfınızı 10 dakikada toplu tarayın, risk haritası alın; DokunSay araçları ve Galaksay ile farklılaştırılmış destek planlayın.</p>
      <div class="dk-p-cta-btns">
        <a class="dk-btn dk-btn--secondary dk-btn--lg" href="/platform/numap.html">Numap Panel →</a>
        <a class="dk-btn dk-btn--ghost dk-btn--lg" href="/araclar/" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.4)">DokunSay Araçları</a>
        <a class="dk-btn dk-btn--ghost dk-btn--lg" href="/iletisim/" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.4)">Kurumsal Teklif</a>
      </div>
    </div>
  </div>
</section>

<?php endif; ?>
