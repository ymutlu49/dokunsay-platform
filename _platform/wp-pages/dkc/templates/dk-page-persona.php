<?php
/** Template: /ebeveynler/ or /ogretmenler/ — included by dk-content.php only */
if (!defined('ABSPATH')) exit;
if (!class_exists('DK_Content_Routing')) return;
$_dkp = get_query_var('dk_page');
if ($_dkp !== 'ebeveyn' && $_dkp !== 'ogretmen') return;
$type = $GLOBALS['dk_persona_type'] ?? 'ebeveyn';
$is_parent = $type === 'ebeveyn';

$title = $is_parent ? 'Çocuğum matematiği neden anlamıyor?' : 'Sınıfımda diskalkuli şüpheli öğrenciler var';
$subtitle = $is_parent
    ? 'Her 20 çocuktan 1\'inde diskalkuli var. Tembellik değil, beynin sayıları işleyiş farklılığı. Öncelik suçlamak değil, anlamak.'
    : 'Parmakla sayan, 10\'u geçince tutulan, problemi okuyunca donan öğrenci. Bu davranışlar tesadüfi değil, taranabilir örüntülerdir.';
$theme = $is_parent ? '#ec4899' : '#0071dc';
$theme_dark = $is_parent ? '#be185d' : '#005bb3';
?>
<style>
.dk-p-hero{background:linear-gradient(180deg,#fff 0%,<?php echo $is_parent ? '#fdf2f8' : '#e8f2fc'; ?> 100%);padding:56px 20px;text-align:center;border-bottom:1px solid rgba(0,0,0,.06);font-family:'Inter',sans-serif}
.dk-p-hero .wrap{max-width:800px;margin:0 auto}
.dk-p-eyebrow{display:inline-block;background:<?php echo $theme; ?>22;color:<?php echo $theme; ?>;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:14px;border:1px solid <?php echo $theme; ?>44}
.dk-p-hero h1{font-size:clamp(26px,3.8vw,42px);font-weight:800;color:#031f42;margin:0 0 14px;letter-spacing:-.02em;line-height:1.2}
.dk-p-hero p{font-size:clamp(15px,1.3vw,18px);color:#4a5568;margin:0 auto;max-width:640px;line-height:1.65}
.dk-p-section{padding:48px 20px;font-family:'Inter',sans-serif}
.dk-p-section .wrap{max-width:1100px;margin:0 auto}
.dk-p-section h2{font-size:clamp(22px,2.4vw,28px);font-weight:800;color:#031f42;margin:0 0 14px;letter-spacing:-.01em;text-align:center}
.dk-p-section .sub{text-align:center;color:#6a7390;max-width:600px;margin:0 auto 32px;font-size:15px;line-height:1.65}

.dk-p-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
.dk-p-step{background:#fff;border:1px solid rgba(0,0,0,.07);border-radius:14px;padding:26px 24px;transition:all .3s cubic-bezier(0.16,1,0.3,1);position:relative;overflow:hidden}
.dk-p-step:hover{transform:translateY(-3px);box-shadow:0 16px 40px rgba(3,31,66,.08);border-color:<?php echo $theme; ?>}
.dk-p-step-num{width:42px;height:42px;border-radius:50%;background:<?php echo $theme; ?>;color:#fff;display:inline-grid;place-items:center;font-weight:800;font-size:18px;margin-bottom:14px}
.dk-p-step h3{font-size:18px;font-weight:800;margin:0 0 8px;color:#031f42}
.dk-p-step p{font-size:14px;color:#6a7390;line-height:1.6;margin:0 0 14px}
.dk-p-step a{font-size:13px;font-weight:700;color:<?php echo $theme; ?>;text-decoration:none;display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:8px;background:<?php echo $theme; ?>10;transition:all .2s}
.dk-p-step a:hover{background:<?php echo $theme; ?>;color:#fff}

.dk-p-cta{background:linear-gradient(135deg,<?php echo $theme; ?> 0%,<?php echo $theme_dark; ?> 100%);color:#fff;padding:46px 32px;border-radius:16px;text-align:center;margin:28px 0;position:relative;overflow:hidden}
.dk-p-cta::before{content:"";position:absolute;top:-50%;right:-10%;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.15),transparent 70%)}
.dk-p-cta h2{color:#fff !important;margin:0 0 10px;position:relative;text-align:center}
.dk-p-cta p{color:rgba(255,255,255,.92);margin:0 0 22px;max-width:560px;margin-left:auto;margin-right:auto;position:relative;font-size:15px;line-height:1.65}
.dk-p-cta-btns{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;position:relative}

.dk-p-quote{background:#fff;border-left:4px solid <?php echo $theme; ?>;padding:24px 28px;border-radius:0 12px 12px 0;margin:28px auto;max-width:760px;box-shadow:0 2px 12px rgba(3,31,66,.05)}
.dk-p-quote p{margin:0;font-size:16px;color:#031f42;line-height:1.7;font-style:italic}
.dk-p-quote cite{display:block;margin-top:12px;color:#6a7390;font-size:13px;font-style:normal}
</style>

<header class="dk-p-hero">
  <div class="wrap">
    <span class="dk-p-eyebrow"><?php echo $is_parent ? 'Ebeveynler için' : 'Öğretmenler için'; ?></span>
    <h1><?php echo esc_html($title); ?></h1>
    <p><?php echo esc_html($subtitle); ?></p>
  </div>
</header>

<?php if ($is_parent): ?>
<!-- EBEVEYN -->
<section class="dk-p-section" style="background:#fff">
  <div class="wrap">
    <h2>3 adımda yolculuğunuz</h2>
    <p class="sub">Size özel hazırlanmış bilimsel ve uygulanabilir rehber.</p>
    <div class="dk-p-steps">
      <div class="dk-p-step">
        <div class="dk-p-step-num">1</div>
        <h3>Önce anlayın</h3>
        <p>Diskalkuli nedir, yaş grubuna göre hangi belirtileri vardır? Bilimsel kaynaklarla açıklanmış kapsamlı rehber.</p>
        <a href="/diskalkuli-nedir/">Diskalkuli Nedir? rehberini oku →</a>
      </div>
      <div class="dk-p-step">
        <div class="dk-p-step-num">2</div>
        <h3>Değerlendirin</h3>
        <p>Numap ile 48–96 ay (4–8 yaş) çocuğunuzu A1–A11 bataryasıyla bilimsel olarak tarayın. Türkiye normlarına göre standardize.</p>
        <a href="/platform/numap.html">Numap ile tara →</a>
      </div>
      <div class="dk-p-step">
        <div class="dk-p-step-num">3</div>
        <h3>Destekleyin</h3>
        <p>Galaksay'ın 59+ oyunlaştırılmış modülü ve DokunSay'ın 7 aracıyla günde 20 dakika; materyallerle pekiştirin.</p>
        <a href="/araclar/">Araçlara göz at →</a>
      </div>
    </div>
  </div>
</section>

<section class="dk-p-section" style="background:#f9fafb">
  <div class="wrap">
    <div class="dk-p-quote">
      <p>"Çocuğumun matematikten korktuğunu sanıyorduk. Numap taraması sayesinde bunun 'tembellik' değil, beyin gelişimi farklılığı olduğunu öğrendik. Şimdi Galaksay'da oynayarak öğreniyor."</p>
      <cite>— Ayşe K., 8 yaşında çocuğun annesi</cite>
    </div>
  </div>
</section>

<section class="dk-p-section" style="background:#fff">
  <div class="wrap">
    <div class="dk-p-cta">
      <h2>Şüphenizi bilime döndürün</h2>
      <p>15 dakikalık Numap taraması, çocuğunuzun sayı hissinde hangi alanlarda zorlandığını net olarak gösterir.</p>
      <div class="dk-p-cta-btns">
        <a class="dk-btn dk-btn--secondary dk-btn--lg" href="/platform/numap.html">Numap ile Tara →</a>
        <a class="dk-btn dk-btn--ghost dk-btn--lg" href="/diskalkuli-nedir/" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.4)">Önce Öğreneyim</a>
      </div>
    </div>
  </div>
</section>

<?php else: ?>
<!-- ÖĞRETMEN -->
<section class="dk-p-section" style="background:#fff">
  <div class="wrap">
    <h2>Sınıfınız için pratik araç setiniz</h2>
    <p class="sub">Ders saatinde uygulanabilir, MEB kazanımlarıyla uyumlu bilimsel çözümler.</p>
    <div class="dk-p-steps">
      <div class="dk-p-step">
        <div class="dk-p-step-num">1</div>
        <h3>Tarama yapın</h3>
        <p>Numap ile sınıfınızı 10 dakikada topluca tarayın. Risk haritasını hazır görün, tek tek test etme yükü yok.</p>
        <a href="/platform/numap.html">Numap panel →</a>
      </div>
      <div class="dk-p-step">
        <div class="dk-p-step-num">2</div>
        <h3>Sınıfta kullanın</h3>
        <p>DokunSay'ın 7 ücretsiz web aracı — Sayı Çubukları, Kesirler, Saat, Geometri. Kurulum gerektirmez, tarayıcıda çalışır.</p>
        <a href="/araclar/">DokunSay araçları →</a>
      </div>
      <div class="dk-p-step">
        <div class="dk-p-step-num">3</div>
        <h3>Hedefli çalışın</h3>
        <p>Galaksay, risk altındaki öğrenciler için haftalık 3×15 dakikalık bireyselleştirilmiş modüller sağlar.</p>
        <a href="/platform/galaksay.html">Galaksay →</a>
      </div>
    </div>
  </div>
</section>

<section class="dk-p-section" style="background:#f9fafb">
  <div class="wrap">
    <div class="dk-p-quote">
      <p>"Bir sınıfta 3 öğrencim Numap taraması sonrası risk altında çıktı. DokunSay Sayı Çubukları'nı 6 hafta kullandık — özellikle 2. sınıfta hayatta kalan öğrencim artık toplama yapabiliyor. Bunu görmek inanılmazdı."</p>
      <cite>— Mehmet A., İlkokul 2. Sınıf Öğretmeni</cite>
    </div>
  </div>
</section>

<section class="dk-p-section" style="background:#fff">
  <div class="wrap">
    <div class="dk-p-cta">
      <h2>Kurumsal abonelik ve öğretmen kaynağı</h2>
      <p>Okul veya rehberlik merkezinizle çalışıyorsanız, çoklu lisans ve öğretmen eğitim kaynakları mevcuttur.</p>
      <div class="dk-p-cta-btns">
        <a class="dk-btn dk-btn--secondary dk-btn--lg" href="/araclar/">Araçları İncele →</a>
        <a class="dk-btn dk-btn--ghost dk-btn--lg" href="/iletisim/" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.4)">Kurumsal Teklif Al</a>
      </div>
    </div>
  </div>
</section>

<?php endif; ?>
