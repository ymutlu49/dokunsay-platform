<?php
/** Template: /diskalkuli-nedir/ — included by dk-content.php only */
if (!defined('ABSPATH')) exit;
if (!class_exists('DK_Content_Routing')) return;
if (get_query_var('dk_page') !== 'nedir') return;
?>
<style>
.dk-n-hero{background:linear-gradient(180deg,#fff 0%,#e8f2fc 100%);padding:56px 20px;text-align:center;border-bottom:1px solid rgba(0,0,0,.06);font-family:'Inter',sans-serif}
.dk-n-hero .wrap{max-width:800px;margin:0 auto}
.dk-n-eyebrow{display:inline-block;background:rgba(0,113,220,.1);color:#0071dc;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:14px;border:1px solid rgba(0,113,220,.25)}
.dk-n-hero h1{font-size:clamp(28px,4vw,46px);font-weight:800;color:#031f42;margin:0 0 16px;letter-spacing:-.02em;line-height:1.15}
.dk-n-hero h1 .grad{background:linear-gradient(135deg,#0071dc,#005bb3);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.dk-n-hero p{font-size:clamp(15px,1.3vw,18px);color:#4a5568;margin:0 auto;max-width:640px;line-height:1.7}
.dk-n-section{padding:48px 20px;font-family:'Inter',sans-serif}
.dk-n-section .wrap{max-width:860px;margin:0 auto}
.dk-n-section h2{font-size:clamp(22px,2.4vw,28px);font-weight:800;color:#031f42;margin:32px 0 14px;letter-spacing:-.01em}
.dk-n-section h3{font-size:18px;font-weight:700;color:#031f42;margin:20px 0 8px}
.dk-n-section p,.dk-n-section li{font-size:15px;color:#4a5568;line-height:1.75}
.dk-n-section ul{padding-left:22px;margin:8px 0}
.dk-n-section ul li{margin-bottom:6px}
.dk-n-toc{background:#f9fafb;border-left:4px solid #0071dc;padding:18px 22px;margin:16px 0 28px;border-radius:0 10px 10px 0}
.dk-n-toc strong{font-weight:700;color:#031f42}
.dk-n-toc ol{margin:8px 0 0;padding-left:22px}
.dk-n-toc li{font-size:14px;padding:2px 0}
.dk-n-toc a{color:#0071dc;text-decoration:none;font-weight:500}
.dk-n-toc a:hover{text-decoration:underline}
.dk-n-card{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:12px;padding:22px 24px;margin-bottom:14px;box-shadow:0 2px 6px rgba(3,31,66,.03)}
.dk-n-card strong{color:#031f42;display:inline-block;margin-bottom:4px;font-size:16px}
.dk-n-age{display:grid;grid-template-columns:130px 1fr;gap:22px;align-items:start}
.dk-n-age-badge{background:linear-gradient(135deg,#0071dc,#005bb3);color:#fff;padding:10px 14px;border-radius:10px;font-weight:700;text-align:center;font-size:13px;line-height:1.3}
.dk-n-checklist{background:#fefbe9;border:1px solid #ffc221;border-radius:14px;padding:24px;margin:26px 0}
.dk-n-checklist h3{margin-top:0;color:#031f42}
.dk-n-checklist p{font-size:14px;margin:6px 0 14px;color:#6a7390}
.dk-n-checklist ul{list-style:none;padding:0}
.dk-n-checklist li{padding-left:28px;position:relative;margin-bottom:10px;font-size:14px;color:#4a5568}
.dk-n-checklist li::before{content:"";position:absolute;left:0;top:3px;width:18px;height:18px;border-radius:4px;border:2px solid #ffc221;background:#fff}
.dk-n-next{background:linear-gradient(135deg,#0071dc 0%,#005bb3 100%);color:#fff;padding:44px 32px;border-radius:16px;text-align:center;margin:36px 0;position:relative;overflow:hidden}
.dk-n-next::before{content:"";position:absolute;top:-50%;right:-10%;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,194,33,.2),transparent 70%)}
.dk-n-next h2{color:#fff !important;margin:0 0 10px;position:relative;z-index:1}
.dk-n-next p{color:rgba(255,255,255,.92);margin:0 0 22px;max-width:560px;margin-left:auto;margin-right:auto;position:relative;z-index:1}
.dk-n-next-btns{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;position:relative;z-index:1}
@media(max-width:600px){.dk-n-age{grid-template-columns:1fr;gap:10px}}
</style>

<header class="dk-n-hero">
  <div class="wrap">
    <span class="dk-n-eyebrow">Rehber · 7 dakika okuma</span>
    <h1>Diskalkuli <span class="grad">Nedir?</span></h1>
    <p>Çocuğunuz matematiğe zorlanıyor mu? Bu bir "tembellik" değil, beynin sayıyı nasıl gördüğüyle ilgili bir farklılıktır. Prof. Dr. Yılmaz Mutlu'nun rehberi: belirtiler, yaşlara göre işaretler, kontrol listesi, yapılabilecekler.</p>
  </div>
</header>

<section class="dk-n-section" style="background:#fff">
  <div class="wrap">
    <div class="dk-n-toc">
      <strong>İçindekiler</strong>
      <ol>
        <li><a href="#tanim">Bilimsel Tanım</a></li>
        <li><a href="#belirtiler">Genel Belirtiler</a></li>
        <li><a href="#yaslara-gore">Yaşlara Göre İşaretler</a></li>
        <li><a href="#kontrol">Kendi Kendine Kontrol Listesi</a></li>
        <li><a href="#ne-yapmali">Ne Yapmalıyım?</a></li>
        <li><a href="#sss">Sıkça Sorulan Sorular</a></li>
      </ol>
    </div>

    <h2 id="tanim">1. Bilimsel Tanım</h2>
    <p><strong>Diskalkuli (dyscalculia)</strong>, zekâ seviyesi normal olan bir bireyin sayı kavramlarını, sayma işlemlerini, aritmetik hesaplamaları ve matematiksel akıl yürütmeyi edinmede yaşadığı <strong>nörogelişimsel öğrenme güçlüğüdür</strong>. DSM-5 sınıflamasında "Özel Öğrenme Bozukluğu" altında yer alır.</p>
    <p>Türkiye'de ilkokul çağı çocukların yaklaşık <strong>%5–7</strong>'sinde görülür. Erken tespit ve hedefli müdahale ile büyük ölçüde telafi edilebilir. Bu sayılarla ilgili özel bir zorluktur — <em>tembellik, ilgisizlik veya zekâ eksikliği değildir</em>.</p>

    <h2 id="belirtiler">2. Genel Belirtiler</h2>
    <div class="dk-n-card">
      <ul>
        <li>Sayıları karıştırır (6 ile 9, 2 ile 5, 12 ile 21).</li>
        <li>Parmak sayar, gözden kaçan sayı atlar.</li>
        <li>Basit toplama/çıkarmayı yapamaz veya çok uzun sürer.</li>
        <li>Zaman kavramını (saat, dakika, dün, yarın) kavramakta zorlanır.</li>
        <li>Para hesabı yapamaz; "çok mu, az mı?" tahmini zayıf.</li>
        <li>Çarpım tablosunu bir türlü ezberleyemez.</li>
        <li>Matematik dersi öncesi yoğun kaygı, karın ağrısı veya ağlama.</li>
        <li>Sayıyı geriye doğru saymak (10, 9, 8…) zordur.</li>
      </ul>
    </div>

    <h2 id="yaslara-gore">3. Yaşlara Göre İşaretler</h2>

    <div class="dk-n-card"><div class="dk-n-age">
      <div class="dk-n-age-badge">4–6 YAŞ<br>Okul Öncesi</div>
      <div>
        <strong>Erken işaretler:</strong>
        <ul>
          <li>Parmaklarını saymakta zorlanır.</li>
          <li>"Daha fazla / daha az" kavramlarını karıştırır.</li>
          <li>Nesneleri sayarken atlar.</li>
          <li>Sıra kavramı (1., 2., 3.) yerleşmez.</li>
        </ul>
      </div>
    </div></div>

    <div class="dk-n-card"><div class="dk-n-age">
      <div class="dk-n-age-badge">6–8 YAŞ<br>1.–2. Sınıf</div>
      <div>
        <strong>Belirginleşen zorluklar:</strong>
        <ul>
          <li>Basit toplama/çıkarma için hâlâ parmak sayar.</li>
          <li>Sayı sembollerini (rakamları) karıştırır.</li>
          <li>Onluk/birlik kavramı yerleşmez.</li>
          <li>Saat okumayı öğrenemez.</li>
        </ul>
      </div>
    </div></div>

    <div class="dk-n-card"><div class="dk-n-age">
      <div class="dk-n-age-badge">8–10 YAŞ<br>3.–4. Sınıf</div>
      <div>
        <strong>Arayı kapatmakta zorlanma:</strong>
        <ul>
          <li>Çarpım tablosunu ezberleyemez.</li>
          <li>Problem çözümünde hangi işlemi yapacağını bilemez.</li>
          <li>Yer ve yön karışır (sağ-sol).</li>
          <li>Para üstü hesaplayamaz.</li>
        </ul>
      </div>
    </div></div>

    <div class="dk-n-card"><div class="dk-n-age">
      <div class="dk-n-age-badge">10+ YAŞ<br>5. Sınıf ve üstü</div>
      <div>
        <strong>Ciddi performans düşüşü:</strong>
        <ul>
          <li>Kesirler ve ondalık sayılar bir bilmece gibidir.</li>
          <li>Oran, yüzde, grafik okuma zorluğu.</li>
          <li>Matematik kaygısı özgüven kaybına dönüşür.</li>
        </ul>
      </div>
    </div></div>

    <div class="dk-n-checklist" id="kontrol">
      <h3>4. Hızlı Kontrol Listesi</h3>
      <p>Çocuğunuzun son 3 aydaki davranışını düşünün. <strong>4 veya daha fazla madde</strong> işaretliyorsa, bilimsel değerlendirme önerilir.</p>
      <ul>
        <li>Sayı karışıklığı sık yaşanıyor (6/9, 12/21 gibi).</li>
        <li>Basit aritmetik işlemler yaşından beklenenden çok daha yavaş.</li>
        <li>Saat okumayı yaşıtlarından geç öğrendi.</li>
        <li>Matematik dersi öncesi fiziksel rahatsızlık (karın ağrısı, baş ağrısı).</li>
        <li>Parmak sayma alışkanlığı 8 yaşından sonra da sürüyor.</li>
        <li>Çarpım tablosu bir türlü yerleşmiyor.</li>
        <li>Zamanı yönetmekte zorluk ("10 dk sonra" kavramı karışıyor).</li>
        <li>Para ile ilgili hesaplar zor.</li>
      </ul>
    </div>

    <h2 id="ne-yapmali">5. Ne Yapmalıyım?</h2>
    <p>Şüphe varsa, <strong>beklemek değil harekete geçmek</strong> gerekir. Erken tespit, etkili destek demektir.</p>
    <h3>Önerilen 3 adım:</h3>
    <ol>
      <li><strong>Bilimsel değerlendirme.</strong> <a href="/platform/numap.html">Numap</a> ile A1–A11 test bataryası üzerinden 48–96 ay yaş grubuna göre ücretsiz tanılama yapın.</li>
      <li><strong>Destekleyici öğrenme.</strong> <a href="/araclar/">DokunSay dijital araçları</a> ve <a href="/platform/galaksay.html">Galaksay</a> ile günlük 20 dakikalık oyunlu çalışma.</li>
      <li><strong>Fiziksel pekiştirme.</strong> <a href="/shop/">DokunSay materyalleri</a> ve kaynak kitaplarla sınıfta/evde kullanın.</li>
    </ol>

    <h2 id="sss">6. Sıkça Sorulan Sorular</h2>
    <div class="dk-n-card"><strong>Diskalkuli "geçer" mi?</strong><br>Geçmez ama telafi edilir. Doğru stratejilerle çocuk matematikle barışık bir bireye dönüşür.</div>
    <div class="dk-n-card"><strong>Özel eğitim şart mı?</strong><br>Şiddetine bağlı. Hafif-orta durumlarda evde + okulda uygun destekle büyük ilerleme sağlanır.</div>
    <div class="dk-n-card"><strong>Numap testi ücretli mi?</strong><br>Temel batarya ücretsiz. Detaylı klinik rapor için kurumsal abonelik seçeneği mevcut.</div>
    <div class="dk-n-card"><strong>Ne kadar sürede sonuç alırım?</strong><br>Hedefli müdahalede 4–6 hafta içinde ilk anlamlı değişimler; kalıcı dönüşüm 6–12 ay.</div>
    <div class="dk-n-card"><strong>Öğretmenim, sınıfımda şüpheli öğrenci var.</strong><br>Önce <a href="/platform/numap.html">Numap</a> ile tarama yapın, sonra <a href="/araclar/">DokunSay araçları</a> ile sınıfta hedefli çalışın, aileyi bilgilendirin.</div>

    <div class="dk-n-next">
      <h2>Hazırsanız, ilk adımı atın</h2>
      <p>Çocuğunuzu Numap ile 15 dakikada bilimsel olarak değerlendirin. 48–96 ay yaş grubuna Türkiye normlarına göre standardize.</p>
      <div class="dk-n-next-btns">
        <a class="dk-btn dk-btn--secondary dk-btn--lg" href="/platform/numap.html">Numap ile Tara →</a>
        <a class="dk-btn dk-btn--ghost dk-btn--lg" href="/araclar/" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.4)">Araçları Keşfet</a>
      </div>
    </div>
  </div>
</section>
