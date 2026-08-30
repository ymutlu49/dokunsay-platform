<?php
/** Template: /araclar/ — included by dk-content.php only */
if (!defined('ABSPATH')) exit;
if (!class_exists('DK_Content_Routing')) return;
if (get_query_var('dk_page') !== 'araclar') return;
$tools = $GLOBALS['dk_tools'] ?? [];
?>
<style>
.dk-a-hero{background:linear-gradient(180deg,#fff 0%,#e8f2fc 100%);padding:48px 20px 36px;text-align:center;border-bottom:1px solid rgba(0,0,0,.06);font-family:'Inter',sans-serif}
.dk-a-hero .wrap{max-width:820px;margin:0 auto}
.dk-a-hero-eyebrow{display:inline-block;background:rgba(0,113,220,.1);color:#0071dc;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:12px;border:1px solid rgba(0,113,220,.25)}
.dk-a-hero h1{font-size:clamp(26px,3.4vw,40px);font-weight:800;color:#031f42;margin:0 0 12px;letter-spacing:-.02em;line-height:1.2}
.dk-a-hero h1 .grad{background:linear-gradient(135deg,#0071dc,#005bb3);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent}
.dk-a-hero p{font-size:clamp(14px,1.2vw,16px);color:#4a5568;max-width:680px;margin:0 auto;line-height:1.65}
.dk-a-section{padding:48px 20px;font-family:'Inter',sans-serif}
.dk-a-section .wrap{max-width:1200px;margin:0 auto}
.dk-a-section h2{font-size:clamp(22px,2.3vw,28px);font-weight:800;color:#031f42;margin:0 0 10px;letter-spacing:-.01em;text-align:center}
.dk-a-section .sub{color:#6a7390;max-width:620px;margin:0 auto 28px;font-size:15px;line-height:1.65;text-align:center}

.dk-a-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:18px;margin-top:8px}
.dk-a-tool{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:16px;padding:24px;text-decoration:none;color:#031f42;transition:all .3s cubic-bezier(0.16,1,0.3,1);display:flex;flex-direction:column;position:relative;overflow:hidden}
.dk-a-tool::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;background:var(--a,#0071dc);opacity:0;transition:opacity .2s}
.dk-a-tool:hover{transform:translateY(-3px);box-shadow:0 18px 42px rgba(3,31,66,.08);border-color:var(--a,#0071dc)}
.dk-a-tool:hover::before{opacity:1}
.dk-a-tool-head{display:flex;align-items:flex-start;gap:14px;margin-bottom:12px}
.dk-a-tool-icon{width:54px;height:54px;border-radius:13px;display:grid;place-items:center;font-size:26px;flex-shrink:0;line-height:1}
.dk-a-tool-meta{flex:1}
.dk-a-tool-tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:3px 8px;border-radius:10px;margin-bottom:5px}
.dk-a-tool h3{font-size:17px;font-weight:800;margin:0 0 3px;color:#031f42;line-height:1.3}
.dk-a-tool-age{font-size:12px;color:#6a7390;font-weight:600}
.dk-a-tool-desc{font-size:13px;color:#4a5568;margin:0 0 14px;line-height:1.55;flex:1}
.dk-a-tool-cta{display:flex;align-items:center;justify-content:space-between;padding-top:12px;border-top:1px solid rgba(0,0,0,.05)}
.dk-a-tool-cta-ped{font-size:12px;color:#6a7390}
.dk-a-tool-cta-go{font-size:13px;font-weight:700;color:var(--a,#0071dc);display:inline-flex;align-items:center;gap:4px;transition:gap .2s}
.dk-a-tool:hover .dk-a-tool-cta-go{gap:8px}

.dk-a-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;max-width:900px;margin:24px auto 0}
.dk-a-stat{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:12px;padding:18px 16px;text-align:center}
.dk-a-stat-val{font-size:22px;font-weight:800;color:#0071dc;line-height:1;margin-bottom:4px}
.dk-a-stat-lbl{font-size:11px;color:#6a7390;text-transform:uppercase;letter-spacing:.08em;font-weight:600}

.dk-a-cta{background:linear-gradient(135deg,#0071dc 0%,#005bb3 100%);color:#fff;padding:44px 32px;border-radius:16px;text-align:center;margin:36px auto;max-width:1200px;position:relative;overflow:hidden}
.dk-a-cta::before{content:"";position:absolute;top:-50%;right:-10%;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(255,194,33,.2),transparent 70%)}
.dk-a-cta h2{color:#fff !important;margin:0 0 10px;position:relative}
.dk-a-cta p{color:rgba(255,255,255,.92);margin:0 0 22px;max-width:540px;margin-left:auto;margin-right:auto;position:relative;line-height:1.6}
.dk-a-cta-btns{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;position:relative}
</style>

<header class="dk-a-hero">
  <div class="wrap">
    <span class="dk-a-hero-eyebrow">Ücretsiz · Tarayıcıda Çalışır · TR/EN/KU</span>
    <h1>DokunSay — <span class="grad">7 interaktif matematik öğretim aracı</span></h1>
    <p>Somut, görsel ve sezgisel öğretim. Van Hiele, Bruner, Bloom, Piaget, CRA, GAISE gibi bilimsel çerçevelere dayalı 7 araç. Kurulum yok, kayıt yok, bekleyiş yok.</p>
    <div class="dk-a-stats">
      <div class="dk-a-stat"><div class="dk-a-stat-val">7</div><div class="dk-a-stat-lbl">Öğretim Aracı</div></div>
      <div class="dk-a-stat"><div class="dk-a-stat-val">5</div><div class="dk-a-stat-lbl">Dil</div></div>
      <div class="dk-a-stat"><div class="dk-a-stat-val">200+</div><div class="dk-a-stat-lbl">Etkinlik</div></div>
      <div class="dk-a-stat"><div class="dk-a-stat-val">5</div><div class="dk-a-stat-lbl">Pedagoji</div></div>
    </div>
  </div>
</header>

<section class="dk-a-section" style="background:#f9fafb">
  <div class="wrap">
    <h2>Araçları keşfedin</h2>
    <p class="sub">Her araç farklı bir matematiksel konuya ve pedagojik çerçeveye dayalı.</p>
    <div class="dk-a-grid">
      <?php foreach ($tools as $slug => $t): ?>
        <a href="/araclar/<?php echo esc_attr($slug); ?>/" class="dk-a-tool" style="--a:<?php echo esc_attr($t['color']); ?>">
          <div class="dk-a-tool-head">
            <div class="dk-a-tool-icon" style="background:<?php echo $t['color']; ?>18;color:<?php echo $t['color']; ?>"><?php echo $t['emoji']; ?></div>
            <div class="dk-a-tool-meta">
              <span class="dk-a-tool-tag" style="background:<?php echo $t['color']; ?>14;color:<?php echo $t['color']; ?>"><?php echo esc_html($t['pedagogy']); ?></span>
              <h3>DokunSay — <?php echo esc_html($t['title']); ?></h3>
              <div class="dk-a-tool-age"><?php echo esc_html($t['age']); ?></div>
            </div>
          </div>
          <p class="dk-a-tool-desc"><?php echo esc_html($t['desc']); ?>.</p>
          <div class="dk-a-tool-cta">
            <span class="dk-a-tool-cta-ped"><?php echo esc_html($t['age']); ?></span>
            <span class="dk-a-tool-cta-go">Aracı Aç →</span>
          </div>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="dk-a-section" style="background:#fff">
  <div class="dk-a-cta">
    <h2>Tanılama mı arıyorsunuz?</h2>
    <p>Numap ile çocuğunuzu / öğrencinizi 48–96 ay yaş grubuna Türkiye normlarına göre bilimsel olarak değerlendirin.</p>
    <div class="dk-a-cta-btns">
      <a class="dk-btn dk-btn--secondary dk-btn--lg" href="/platform/numap.html">Numap ile Tara →</a>
      <a class="dk-btn dk-btn--ghost dk-btn--lg" href="/diskalkuli-nedir/" style="background:rgba(255,255,255,.15);color:#fff;border-color:rgba(255,255,255,.4)">Diskalkuli Nedir?</a>
    </div>
  </div>
</section>
