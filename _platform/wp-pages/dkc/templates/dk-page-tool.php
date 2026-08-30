<?php
/** Template: /araclar/{slug}/ — included by dk-content.php only */
if (!defined('ABSPATH')) exit;
if (!class_exists('DK_Content_Routing')) return;
if (get_query_var('dk_page') !== 'tool') return;
$slug = $GLOBALS['dk_tool_slug'] ?? '';
$t = $GLOBALS['dk_tool'] ?? [];
$all = $GLOBALS['dk_tools'] ?? [];
if (!$t) return;
?>
<style>
.dk-t-hero{background:linear-gradient(180deg,#fff 0%,#e8f2fc 100%);padding:32px 20px 28px;border-bottom:1px solid rgba(0,0,0,.06);font-family:'Inter',sans-serif}
.dk-t-hero .wrap{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1.3fr .7fr;gap:32px;align-items:center}
.dk-t-crumb{font-size:12px;color:#6a7390;margin-bottom:10px}
.dk-t-crumb a{color:#0071dc;text-decoration:none;font-weight:500}
.dk-t-crumb a:hover{text-decoration:underline}
.dk-t-crumb .sep{margin:0 6px;color:#c5cbd4}
.dk-t-tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px;border-radius:12px;margin-bottom:10px}
.dk-t-hero h1{font-size:clamp(22px,2.6vw,30px);font-weight:800;color:#031f42;margin:0 0 10px;letter-spacing:-.02em;line-height:1.2;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.dk-t-hero h1 .ic{font-size:1em}
.dk-t-hero p{font-size:clamp(13px,1.1vw,15px);color:#4a5568;margin:0 0 16px;line-height:1.6}
.dk-t-actions{display:flex;gap:10px;flex-wrap:wrap}
.dk-t-preview{aspect-ratio:16/11;background:<?php echo $t['color']; ?>08;border:1px solid rgba(0,0,0,.05);border-radius:14px;display:grid;place-items:center;font-size:64px;color:<?php echo $t['color']; ?>;box-shadow:0 8px 24px rgba(3,31,66,.06)}
@media(max-width:860px){.dk-t-hero .wrap{grid-template-columns:1fr}.dk-t-preview{aspect-ratio:auto;height:180px}}

.dk-t-embed{background:#fff;padding:32px 20px;font-family:'Inter',sans-serif}
.dk-t-embed h2{font-size:20px;font-weight:800;color:#031f42;margin:0 0 16px;text-align:center}
.dk-t-frame{max-width:1400px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid rgba(0,0,0,.08);box-shadow:0 12px 40px rgba(3,31,66,.08);background:#f9fafb;position:relative}
.dk-t-bar{height:40px;background:#f1f4f9;display:flex;align-items:center;padding:0 14px;gap:12px;border-bottom:1px solid rgba(0,0,0,.06)}
.dk-t-dots{display:flex;gap:5px}
.dk-t-dots span{width:10px;height:10px;border-radius:50%}
.dk-t-dots span:nth-child(1){background:#FF5F57} .dk-t-dots span:nth-child(2){background:#FEBC2E} .dk-t-dots span:nth-child(3){background:#28C840}
.dk-t-url{flex:1;background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:6px;padding:5px 12px;font-size:11px;color:#7a8290;font-family:'SF Mono',Monaco,monospace}
.dk-t-fs{background:rgba(3,31,66,.8);color:#fff;border:none;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer}
.dk-t-fs:hover{background:#0071dc}
.dk-t-frame iframe{display:block;width:100%;height:calc(100vh - 260px);min-height:540px;border:0;background:#fff}

.dk-t-related{padding:40px 20px;background:#f9fafb;font-family:'Inter',sans-serif}
.dk-t-related .wrap{max-width:1200px;margin:0 auto}
.dk-t-related h2{font-size:20px;font-weight:800;color:#031f42;margin:0 0 18px;text-align:center}
.dk-t-related-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}
.dk-t-related-card{background:#fff;border:1px solid rgba(0,0,0,.08);border-radius:10px;padding:16px;text-decoration:none;color:#031f42;transition:all .2s;display:flex;align-items:center;gap:12px}
.dk-t-related-card:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(0,113,220,.1);border-color:var(--a,#0071dc)}
.dk-t-related-card .ic{width:40px;height:40px;border-radius:10px;display:grid;place-items:center;font-size:20px;flex-shrink:0}
.dk-t-related-card .meta{flex:1;min-width:0}
.dk-t-related-card h4{font-size:14px;font-weight:800;margin:0;color:#031f42}
.dk-t-related-card p{font-size:11px;color:#6a7390;margin:2px 0 0}
.dk-t-related-card .go{color:var(--a,#0071dc);font-weight:700;font-size:14px}
</style>

<header class="dk-t-hero">
  <div class="wrap">
    <div>
      <div class="dk-t-crumb">
        <a href="/">Ana Sayfa</a><span class="sep">›</span>
        <a href="/araclar/">DokunSay Araçları</a><span class="sep">›</span>
        <span><?php echo esc_html($t['title']); ?></span>
      </div>
      <span class="dk-t-tag" style="background:<?php echo $t['color']; ?>14;color:<?php echo $t['color']; ?>"><?php echo esc_html($t['pedagogy']); ?> · <?php echo esc_html($t['age']); ?></span>
      <h1><span class="ic" style="color:<?php echo $t['color']; ?>"><?php echo $t['emoji']; ?></span> DokunSay — <?php echo esc_html($t['title']); ?></h1>
      <p><?php echo esc_html($t['desc']); ?>. Tarayıcıda çalışır, kurulum gerektirmez. <strong>Türkçe, İngilizce, Kürtçe</strong> desteği.</p>
      <div class="dk-t-actions">
        <a class="dk-btn dk-btn--primary" href="#embed">Aracı Başlat ↓</a>
        <a class="dk-btn dk-btn--ghost" href="/dokunsay/<?php echo esc_attr($t['folder']); ?>/" target="_blank" rel="noopener">Tam Ekran ↗</a>
      </div>
    </div>
    <div class="dk-t-preview"><?php echo $t['emoji']; ?></div>
  </div>
</header>

<section id="embed" class="dk-t-embed">
  <div class="dk-t-frame">
    <div class="dk-t-bar">
      <div class="dk-t-dots"><span></span><span></span><span></span></div>
      <div class="dk-t-url">diskalkuli.com/dokunsay/<?php echo esc_html($t['folder']); ?>/</div>
      <button class="dk-t-fs" onclick="(function(b){var f=b.closest('.dk-t-frame').querySelector('iframe');if(f.requestFullscreen)f.requestFullscreen();})(this)">⛶ Tam Ekran</button>
    </div>
    <iframe src="/dokunsay/<?php echo esc_attr($t['folder']); ?>/?embed=1" title="DokunSay — <?php echo esc_attr($t['title']); ?>"
            allow="fullscreen; clipboard-read; clipboard-write; camera; microphone" allowfullscreen loading="lazy"></iframe>
  </div>
</section>

<section class="dk-t-related">
  <div class="wrap">
    <h2>Diğer Araçlar</h2>
    <div class="dk-t-related-grid">
      <?php $n=0; foreach ($all as $s => $ot): if ($s === $slug) continue; if ($n++ >= 6) break; ?>
        <a href="/araclar/<?php echo esc_attr($s); ?>/" class="dk-t-related-card" style="--a:<?php echo $ot['color']; ?>">
          <div class="ic" style="background:<?php echo $ot['color']; ?>15;color:<?php echo $ot['color']; ?>"><?php echo $ot['emoji']; ?></div>
          <div class="meta">
            <h4><?php echo esc_html($ot['title']); ?></h4>
            <p><?php echo esc_html($ot['age']); ?></p>
          </div>
          <span class="go">→</span>
        </a>
      <?php endforeach; ?>
    </div>
  </div>
</section>
