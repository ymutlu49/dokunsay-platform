<?php
/**
 * Plugin Name: Diskalkuli Content & Routing
 * Description: Virtual pages (/diskalkuli-nedir/, /araclar/, /ebeveynler/, /ogretmenler/), menu items, homepage sections, SEO.
 * Version: 2.0
 * Author: Diskalkuli Akademi
 */

if (!defined('ABSPATH')) exit;

class DK_Content_Routing {

    /* ========== DOKUNSAY TOOLS META ========== */
    public static function tools() {
        return [
            'sayi-cubuklari' => ['folder'=>'DokunSayBar',      'title'=>'Sayı Çubukları',    'desc'=>'Çubuklar ve pullarla somut sayı deneyimi',     'age'=>'5–10 yaş', 'emoji'=>'🧮',  'color'=>'#F59E0B', 'pedagogy'=>'CRA + Bruner'],
            'basamak-degeri' => ['folder'=>'DokunSayBasamak',  'title'=>'Basamak Değeri',    'desc'=>'Birler, onlar, yüzler görselleştirme',         'age'=>'6–10 yaş', 'emoji'=>'🔢',  'color'=>'#8B5CF6', 'pedagogy'=>'Bloom + Dienes'],
            'saat'           => ['folder'=>'DokunSayClock',    'title'=>'Saat',              'desc'=>'Analog saat okuma ve zaman kavramı',           'age'=>'6–9 yaş',  'emoji'=>'🕐',  'color'=>'#3B82F6', 'pedagogy'=>'Piaget'],
            'kesirler'       => ['folder'=>'DokunSayKesir',    'title'=>'Kesirler',          'desc'=>'Pizza dilimleriyle kesir öğrenimi',            'age'=>'6–10 yaş', 'emoji'=>'🍕',  'color'=>'#EC4899', 'pedagogy'=>'CRA + MEB'],
            'tam-sayilar'    => ['folder'=>'DokunSayTam',      'title'=>'Tam Sayılar',       'desc'=>'Pozitif, negatif, sıfır çifti ile işlemler',   'age'=>'10–13 yaş','emoji'=>'➕➖','color'=>'#10B981', 'pedagogy'=>'Sıfır Çifti'],
            'geometri'       => ['folder'=>'Dokunsay-geo',     'title'=>'Geometri',          'desc'=>'Van Hiele düzeylerine göre şekiller',          'age'=>'5–14 yaş', 'emoji'=>'🔺',  'color'=>'#EF4444', 'pedagogy'=>'Van Hiele'],
            'istatistik'     => ['folder'=>'Dokunsay-veri-app','title'=>'İstatistik ve Veri','desc'=>'Grafik okuma, veri analizi, olasılık',         'age'=>'7–15 yaş', 'emoji'=>'📊',  'color'=>'#06B6D4', 'pedagogy'=>'Curcio + GAISE'],
        ];
    }

    public function __construct() {
        // Rewrites
        add_action('init',                 [$this, 'register_rewrites']);
        add_filter('query_vars',           [$this, 'register_query_vars']);
        add_action('template_redirect',    [$this, 'handle_virtual_pages']);
        add_action('template_redirect',    [$this, 'handle_redirects'], 1);

        // Menu
        add_filter('wp_nav_menu_items',    [$this, 'modify_menu'], 999, 2);

        // Homepage sections (server-side inject)
        add_filter('the_content',          [$this, 'inject_homepage_content']);
        add_action('wp_footer',            [$this, 'homepage_fallback']);

        // Replace theme footer with our clean one
        add_action('wp_footer',            [$this, 'inject_dk_footer'], 5);
        add_action('wp_head',              [$this, 'inject_footer_hide_css'], 100);

        // Shop hero banner + SEO (via JS injection to avoid theme template conflicts)
        add_action('wp_footer',            [$this, 'inject_shop_hero_js'], 6);
        add_action('wp_head',              [$this, 'shop_seo_tags'], 100);

        // SEO for virtual pages
        add_filter('pre_get_document_title',[$this, 'fix_title'], 100);
        add_filter('wpseo_title',          [$this, 'fix_title'], 100);
        add_filter('wpseo_canonical',      [$this, 'fix_canonical'], 100);
        add_filter('wpseo_metadesc',       [$this, 'fix_metadesc'], 100);
        add_filter('wpseo_schema_graph',   [$this, 'clean_schema'], 100, 2);

        // Enqueue dequeue on virtual pages
        add_action('wp_enqueue_scripts',   [$this, 'dequeue_heavy'], 9999);
    }

    /* ========== REWRITES ========== */
    public function register_rewrites() {
        add_rewrite_rule('^diskalkuli-nedir/?$', 'index.php?dk_page=nedir', 'top');
        add_rewrite_rule('^ebeveynler/?$',        'index.php?dk_page=ebeveyn', 'top');
        add_rewrite_rule('^ogretmenler/?$',       'index.php?dk_page=ogretmen', 'top');
        add_rewrite_rule('^araclar/?$',           'index.php?dk_page=araclar', 'top');
        add_rewrite_rule('^araclar/([^/]+)/?$',   'index.php?dk_page=tool&dk_slug=$matches[1]', 'top');

        $ver = get_option('dk_content_v', 0);
        if ($ver < 200) { flush_rewrite_rules(false); update_option('dk_content_v', 200); }
    }

    public function register_query_vars($vars) {
        $vars[] = 'dk_page';
        $vars[] = 'dk_slug';
        return $vars;
    }

    /* ========== LEGACY URL REDIRECTS ========== */
    public function handle_redirects() {
        $path = rtrim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH), '/');
        $redirects = [
            '/dokunsay-noktali-sayi-cubuklari' => '/product/dokunsay-noktali-sayi-cubuklari/',
            '/testler' => '/araclar/',
            '/testlerim' => '/araclar/',
            '/kilavuz' => '/diskalkuli-nedir/',
            '/geobellek' => '/araclar/',
        ];
        if (isset($redirects[$path])) {
            wp_safe_redirect(home_url($redirects[$path]), 301);
            exit;
        }
    }

    /* ========== VIRTUAL PAGE HANDLER ========== */
    public function handle_virtual_pages() {
        $page = get_query_var('dk_page');
        $auth = get_query_var('dk_auth');

        // Auth pages (handled by DK_Membership templates)
        if ($auth) {
            status_header(200);
            switch ($auth) {
                case 'login':    $this->render_auth_page('giris'); break;
                case 'register': $this->render_auth_page('kayit'); break;
                case 'account':  $this->render_auth_page('hesabim'); break;
                case 'plans':    $this->render_auth_page('planlar'); break;
                case 'reset':    $this->render_auth_page('sifre-sifirla'); break;
                case 'checkout': $this->render_auth_page('odeme'); break;
                case 'success':  $this->render_auth_page('odeme-basarili'); break;
                case 'cancel':   $this->render_auth_page('odeme-iptal'); break;
                case 'logout':   wp_logout(); wp_safe_redirect(home_url('/')); exit;
                default: return;
            }
            exit;
        }

        if (!$page) return;
        status_header(200);

        switch ($page) {
            case 'nedir':    $this->render_nedir(); break;
            case 'ebeveyn':  $this->render_persona('ebeveyn'); break;
            case 'ogretmen': $this->render_persona('ogretmen'); break;
            case 'araclar':  $this->render_araclar_index(); break;
            case 'tool':     $this->render_tool(get_query_var('dk_slug')); break;
            default: return;
        }
        exit;
    }

    public function render_auth_page($slug) {
        $this->header_cleaned();
        $this->main_open();
        $template = __DIR__ . '/dk-templates/dk-page-' . $slug . '.php';
        if (file_exists($template)) {
            include $template;
        } else {
            echo '<section style="min-height:50vh;display:grid;place-items:center;padding:60px"><h1>Sayfa bulunamadı</h1></section>';
        }
        $this->main_close();
        get_footer();
    }

    public function dequeue_heavy() {
        if (!get_query_var('dk_page')) return;
        foreach (['elementor-frontend','elementor-post','elementor-common','elementor-icons','revslider','wc-block-style','dashicons'] as $h) {
            wp_dequeue_style($h); wp_deregister_style($h);
        }
        foreach (['elementor-frontend','elementor-pro-frontend','revslider','wc-add-to-cart','wc-cart-fragments'] as $h) {
            wp_dequeue_script($h); wp_deregister_script($h);
        }
    }

    /* ========== SEO FILTERS ========== */
    private function page_meta() {
        $p = get_query_var('dk_page'); $s = get_query_var('dk_slug');
        $a = get_query_var('dk_auth');
        switch ($a) {
            case 'login':    return ['title'=>'Giriş Yap | Diskalkuli Akademi','canonical'=>home_url('/giris/'),'desc'=>'Diskalkuli Akademi hesabınıza giriş yapın.'];
            case 'register': return ['title'=>'Ücretsiz Kayıt Ol | Diskalkuli Akademi','canonical'=>home_url('/kayit/'),'desc'=>'Ücretsiz hesap oluşturun; Numap ve DokunSay\'a erişin.'];
            case 'account':  return ['title'=>'Hesabım | Diskalkuli Akademi','canonical'=>home_url('/hesabim/'),'desc'=>'Aboneliğiniz, çocuklarınız, raporlarınız.'];
            case 'plans':    return ['title'=>'Planlar ve Fiyatlar | Diskalkuli Akademi','canonical'=>home_url('/planlar/'),'desc'=>'Bireysel, Aile, Öğretmen ve Kurumsal planlar — şeffaf fiyat, kolay iptal.'];
            case 'reset':    return ['title'=>'Şifre Sıfırla | Diskalkuli Akademi','canonical'=>home_url('/sifre-sifirla/'),'desc'=>'Şifrenizi sıfırlayın.'];
            case 'checkout': return ['title'=>'Ödeme | Diskalkuli Akademi','canonical'=>home_url('/odeme/'),'desc'=>'Güvenli ödeme ile aboneliğinizi başlatın.'];
            case 'success':  return ['title'=>'Ödeme Başarılı | Diskalkuli Akademi','canonical'=>home_url('/odeme/basarili/'),'desc'=>'Ödemeniz alındı.'];
            case 'cancel':   return ['title'=>'Ödeme İptal | Diskalkuli Akademi','canonical'=>home_url('/odeme/iptal/'),'desc'=>'Ödeme iptal edildi.'];
        }
        switch ($p) {
            case 'nedir':
                return ['title'=>'Diskalkuli Nedir? — Belirtiler, Yaş İşaretleri ve Yapılabilecekler | Diskalkuli Akademi', 'canonical'=>'https://diskalkuli.com/diskalkuli-nedir/', 'desc'=>'Diskalkuli nedir? Çocukta matematik öğrenme güçlüğünün belirtileri, yaşlara göre işaretler, kontrol listesi ve bilimsel değerlendirme yolu.'];
            case 'ebeveyn':
                return ['title'=>'Ebeveynler İçin | Çocuğumda Diskalkuli Olabilir mi? — Diskalkuli Akademi', 'canonical'=>'https://diskalkuli.com/ebeveynler/', 'desc'=>'Çocuğunuzda diskalkuli şüphesi varsa nereden başlamalı? Bilimsel tarama, destekleyici öğrenme ve fiziksel materyaller için kapsamlı ebeveyn rehberi.'];
            case 'ogretmen':
                return ['title'=>'Öğretmenler İçin | Sınıfta Diskalkuli Öğrencisi — Diskalkuli Akademi', 'canonical'=>'https://diskalkuli.com/ogretmenler/', 'desc'=>'Sınıfınızdaki diskalkuli şüpheli öğrenciler için araştırmaya dayalı araçlar, değerlendirme bataryaları ve sınıf materyalleri.'];
            case 'araclar':
                return ['title'=>'DokunSay Araçları — 7 İnteraktif Matematik Öğretim Aracı | Diskalkuli Akademi', 'canonical'=>'https://diskalkuli.com/araclar/', 'desc'=>'DokunSay\'ın 7 ücretsiz, tarayıcıda çalışan matematik öğretim aracı: Sayı Çubukları, Basamak Değeri, Saat, Kesirler, Tam Sayılar, Geometri, İstatistik.'];
            case 'tool':
                $tools = self::tools();
                if (isset($tools[$s])) {
                    return ['title'=>'DokunSay — ' . $tools[$s]['title'] . ' | Diskalkuli Akademi', 'canonical'=>'https://diskalkuli.com/araclar/' . $s . '/', 'desc'=>$tools[$s]['desc'] . '. ' . $tools[$s]['age'] . ' · ' . $tools[$s]['pedagogy'] . ' pedagojik çerçeve.'];
                }
        }
        return null;
    }
    public function fix_title($t) { $m = $this->page_meta(); return $m ? $m['title'] : $t; }
    public function fix_canonical($c) { $m = $this->page_meta(); return $m ? $m['canonical'] : $c; }
    public function fix_metadesc($d) { $m = $this->page_meta(); return $m ? $m['desc'] : $d; }
    public function clean_schema($g, $ctx) {
        $m = $this->page_meta(); if (!$m) return $g;
        $json = wp_json_encode($g);
        if ($json) {
            $json = str_replace('https://diskalkuli.com/blog/', $m['canonical'], $json);
            $d = json_decode($json, true);
            if (is_array($d)) return $d;
        }
        return $g;
    }

    /* ========== MENU ========== */
    public function modify_menu($items, $args) {
        $loc = strtolower($args->theme_location ?? '');
        $name = strtolower(is_object($args->menu ?? null) ? $args->menu->name : '');
        $primary = false;
        foreach (['primary','main','header','top','ana','başlık'] as $t) {
            if (strpos($loc, $t) !== false || strpos($name, $t) !== false) { $primary = true; break; }
        }
        if (!$primary) return $items;

        // 1) Remove duplicates our plugin may have added previously
        $items = preg_replace('/<li[^>]*menu-item-dk-[a-z-]+[^>]*>.*?<\/li>/s', '', $items);

        // 2) Remove LEGACY menu items by ID — Sayı Hissi, Dijital Oyunlar, Testler, Üye Giriş/Kayıt, Kılavuz, GeoBellek, old DokunSay, Mağaza (keep only focused items)
        $legacy_ids = [6481, 4769, 6174, 6175, 6187, 6194, 6196, 5192, 5198, 5205];
        foreach ($legacy_ids as $id) {
            // Strip whole <li> (including nested children/dropdowns) with balanced matching on depth
            $items = $this->strip_li_by_id($items, $id);
        }

        // 3) Remove by URL path — any legacy links we can't catch by ID
        $legacy_paths = ['/testler', '/testlerim', '/geobellek', '/kilavuz', '/dokunsay-noktali'];
        foreach ($legacy_paths as $p) {
            $items = preg_replace('#<li[^>]*>[^<]*<a[^>]*href="[^"]*' . preg_quote($p, '#') . '[^"]*"[^>]*>.*?</li>#s', '', $items);
        }

        // 4) Prepend new 7 items (Anasayfa FIRST, Mağaza LAST)
        $new = '';
        $new .= '<li class="menu-item menu-item-dk-home"><a href="/">Anasayfa</a></li>';
        $new .= '<li class="menu-item menu-item-dk-nedir"><a href="/diskalkuli-nedir/">Diskalkuli Nedir?</a></li>';
        $new .= '<li class="menu-item menu-item-dk-ebeveyn"><a href="/ebeveynler/">Ebeveynler</a></li>';
        $new .= '<li class="menu-item menu-item-dk-ogretmen"><a href="/ogretmenler/">Öğretmenler</a></li>';
        $new .= '<li class="menu-item menu-item-dk-araclar"><a href="/araclar/">DokunSay Araçları</a></li>';
        $new .= '<li class="menu-item menu-item-dk-platform"><a href="/platform/">Tanıla &amp; Müdahale</a></li>';
        $new .= '<li class="menu-item menu-item-dk-magaza"><a href="/shop/">Mağaza</a></li>';

        return $new . $items;
    }

    /** Strip a <li class="... menu-item-{id} ..."> element including any nested <ul> children */
    private function strip_li_by_id($html, $id) {
        // Find the <li ... menu-item-{$id} ... > opener
        $pattern = '/<li\b[^>]*menu-item-' . intval($id) . '\b[^>]*>/';
        $offset = 0;
        while (preg_match($pattern, $html, $m, PREG_OFFSET_CAPTURE, $offset)) {
            $open_pos = $m[0][1];
            $open_end = $open_pos + strlen($m[0][0]);
            // Walk forward counting <li> depth until matching close
            $depth = 1;
            $pos = $open_end;
            $len = strlen($html);
            while ($pos < $len && $depth > 0) {
                $next_open  = stripos($html, '<li',   $pos);
                $next_close = stripos($html, '</li>', $pos);
                if ($next_close === false) break;
                if ($next_open !== false && $next_open < $next_close) {
                    // Skip self-closing and non-tag matches
                    $depth++;
                    $pos = $next_open + 3;
                } else {
                    $depth--;
                    $pos = $next_close + 5;
                }
            }
            // Remove the slice
            $html = substr($html, 0, $open_pos) . substr($html, $pos);
            $offset = $open_pos; // restart scan from the removal point
        }
        return $html;
    }

    /* ========== HOMEPAGE SECTIONS ========== */
    public function inject_homepage_content($content) {
        if (get_query_var('dk_page') || get_query_var('dk_auth')) return $content; // skip on our virtual pages
        if (!(is_front_page() || is_home()) || is_admin()) return $content;
        if (in_the_loop() && !is_main_query()) return $content;
        static $injected = false;
        if ($injected) return $content;
        $injected = true;
        // REPLACE old content with our new homepage
        return $this->homepage_sections_html();
    }

    public function homepage_fallback() {
        if (get_query_var('dk_page') || get_query_var('dk_auth')) return; // skip on virtual/auth pages
        if (!(is_front_page() || is_home())) return;
        ?>
<style id="dk-home-hide-old">
/* Hide OLD Elementor/theme homepage content, keep only our new design */
body.home .entry-content,
body.home [data-elementor-type="wp-page"],
body.home .elementor-section-wrap,
body.home article.page .entry-content,
body.home .page-title-bar { display: none !important; }
/* Ensure our section always shows */
#dk-home-sections{display:block !important}
#dk-home-sections *:not(style):not(script){visibility:visible}
/* Force content-wrapper to accommodate our content */
body.home .content-wrapper{padding:0 !important;max-width:none !important;display:block !important;min-height:auto !important;height:auto !important;overflow:visible !important}
/* Keep site header + footer, hide only middle content (old Elementor) */
body.home .content-wrapper > *:not(#dk-home-sections):not(header):not(.site-header):not(#masthead):not(.main-header):not(.header):not(.footer-area):not(footer):not(#colophon){display:none !important}
</style>
<script id="dk-home-inject">
(function(){
  if (document.getElementById('dk-home-sections')) return;
  var html = <?php echo json_encode($this->homepage_sections_html()); ?>;
  var wrap = document.createElement('div');
  wrap.innerHTML = html;
  var frag = wrap.firstElementChild;
  // Insert AFTER the theme header (keeping top menu visible above our content)
  var header = document.querySelector('#page-header, header.page-header, .site-header, #masthead, .main-header');
  if (header && header.parentNode) {
    // Insert after header: before next sibling
    if (header.nextSibling) {
      header.parentNode.insertBefore(frag, header.nextSibling);
    } else {
      header.parentNode.appendChild(frag);
    }
  } else {
    var target = document.querySelector('.content-wrapper') || document.querySelector('.site') || document.body;
    target.appendChild(frag);
  }
})();
</script>
        <?php
    }

    private function homepage_sections_html() {
        ob_start();
        ?>
<div id="dk-home-sections">
<style>
/* === Tema logo renkleri === */
:root {
  --dkl-pink: #ec4899; --dkl-pink-d: #be185d;
  --dkl-orange: #f97316; --dkl-orange-d: #c2410c;
  --dkl-yellow: #ffc221; --dkl-yellow-d: #e6a800;
  --dkl-blue: #0071dc; --dkl-blue-d: #005bb3;
  --dkl-navy: #031f42;
}
#dk-home-sections{font-family:'Inter',system-ui,-apple-system,sans-serif;color:var(--dkl-navy)}
#dk-home-sections *{box-sizing:border-box}
.dkh-wrap{max-width:1200px;margin:0 auto;padding:0 20px}

/* === HERO — 4 işlem ikonu animasyonlu === */
.dkh-hero{position:relative;background:linear-gradient(180deg,#f9fbff 0%,#e8f2fc 100%);padding:68px 0 60px;overflow:hidden;border-bottom:1px solid rgba(0,0,0,.05)}
.dkh-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(1200px 600px at 10% 10%, rgba(236,72,153,.08), transparent 50%), radial-gradient(1000px 600px at 90% 90%, rgba(0,113,220,.08), transparent 50%);pointer-events:none}
.dkh-hero-grid{display:grid;grid-template-columns:1.25fr 1fr;gap:48px;align-items:center;position:relative;z-index:1}
@media(max-width:900px){.dkh-hero-grid{grid-template-columns:1fr;gap:24px}}
.dkh-hero-eyebrow{display:inline-flex;align-items:center;gap:8px;background:#fff;border:1px solid rgba(0,113,220,.2);padding:6px 14px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--dkl-blue);margin-bottom:16px;box-shadow:0 2px 10px rgba(3,31,66,.04)}
.dkh-hero-eyebrow .dot{width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 0 4px rgba(16,185,129,.15);animation:dkh-pulse 2s infinite}
@keyframes dkh-pulse{0%,100%{opacity:1}50%{opacity:.5}}
.dkh-hero h1{font-size:clamp(32px,4.5vw,56px);font-weight:800;line-height:1.08;letter-spacing:-.025em;margin:0 0 18px;color:var(--dkl-navy)}
.dkh-hero h1 .pink{background:linear-gradient(135deg,var(--dkl-pink),var(--dkl-pink-d));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.dkh-hero h1 .orange{background:linear-gradient(135deg,var(--dkl-orange),var(--dkl-orange-d));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.dkh-hero h1 .yellow{background:linear-gradient(135deg,var(--dkl-yellow),var(--dkl-yellow-d));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.dkh-hero h1 .blue{background:linear-gradient(135deg,var(--dkl-blue),var(--dkl-blue-d));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
.dkh-hero p.lead{font-size:clamp(15px,1.3vw,18px);line-height:1.65;color:#4a5568;margin:0 0 24px;max-width:600px}
.dkh-hero-ctas{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px}
.dkh-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 24px;border-radius:999px;font-weight:700;font-size:15px;text-decoration:none;transition:all .22s cubic-bezier(.16,1,.3,1);border:2px solid transparent}
.dkh-btn-primary{background:var(--dkl-blue);color:#fff;box-shadow:0 8px 20px rgba(0,113,220,.28)}
.dkh-btn-primary:hover{background:var(--dkl-blue-d);transform:translateY(-2px);box-shadow:0 14px 30px rgba(0,113,220,.38);color:#fff}
.dkh-btn-ghost{background:#fff;color:var(--dkl-navy);border-color:rgba(3,31,66,.12)}
.dkh-btn-ghost:hover{border-color:var(--dkl-pink);color:var(--dkl-pink);transform:translateY(-2px)}
.dkh-hero-meta{display:flex;gap:18px;flex-wrap:wrap;font-size:13px;color:#6a7390}
.dkh-hero-meta span{display:inline-flex;align-items:center;gap:6px}
.dkh-hero-meta strong{color:var(--dkl-navy);font-weight:700}

/* 4-op dekoratif görsel */
.dkh-hero-visual{position:relative;aspect-ratio:1/1;max-width:460px;justify-self:center;width:100%}
.dkh-op{position:absolute;display:grid;place-items:center;border-radius:24px;color:#fff;font-weight:800;font-size:64px;box-shadow:0 20px 50px rgba(0,0,0,.15);animation:dkh-float 6s ease-in-out infinite}
.dkh-op-plus{top:0;left:0;width:44%;height:44%;background:linear-gradient(135deg,var(--dkl-pink),var(--dkl-pink-d));animation-delay:0s}
.dkh-op-minus{top:0;right:0;width:44%;height:44%;background:linear-gradient(135deg,var(--dkl-orange),var(--dkl-orange-d));animation-delay:1.5s}
.dkh-op-times{bottom:0;left:0;width:44%;height:44%;background:linear-gradient(135deg,var(--dkl-yellow),var(--dkl-yellow-d));color:var(--dkl-navy);animation-delay:3s}
.dkh-op-div{bottom:0;right:0;width:44%;height:44%;background:linear-gradient(135deg,var(--dkl-blue),var(--dkl-blue-d));animation-delay:4.5s}
@keyframes dkh-float{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-10px) rotate(1deg)}}

/* === 4-ADIM YOLCULUK (logo renkli) === */
.dkh-journey{background:#fff;padding:72px 0 68px;position:relative}
.dkh-journey::after{content:"";position:absolute;bottom:0;left:0;right:0;height:6px;background:var(--dk-logo-gradient,linear-gradient(90deg,var(--dkl-pink),var(--dkl-orange),var(--dkl-yellow),var(--dkl-blue)))}
.dkh-section-head{text-align:center;margin:0 auto 40px;max-width:700px}
.dkh-section-eyebrow{display:inline-block;padding:5px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:12px}
.dkh-section-eyebrow.ey-pink{background:rgba(236,72,153,.1);color:var(--dkl-pink-d);border:1px solid rgba(236,72,153,.25)}
.dkh-section-eyebrow.ey-orange{background:rgba(249,115,22,.1);color:var(--dkl-orange-d);border:1px solid rgba(249,115,22,.25)}
.dkh-section-eyebrow.ey-yellow{background:rgba(255,194,33,.15);color:#b8860b;border:1px solid rgba(255,194,33,.35)}
.dkh-section-eyebrow.ey-blue{background:rgba(0,113,220,.1);color:var(--dkl-blue);border:1px solid rgba(0,113,220,.2)}
.dkh-section-head h2{font-size:clamp(26px,3vw,36px);font-weight:800;letter-spacing:-.02em;margin:0 0 12px}
.dkh-section-head p.lead{font-size:16px;color:#6a7390;line-height:1.65;margin:0 auto;max-width:620px}
.dkh-journey-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:40px}
@media(max-width:900px){.dkh-journey-steps{grid-template-columns:repeat(2,1fr)}}
@media(max-width:500px){.dkh-journey-steps{grid-template-columns:1fr}}
.dkh-js{background:#fff;border:1px solid rgba(0,0,0,.06);border-radius:18px;padding:28px 22px;text-align:center;transition:all .35s cubic-bezier(.16,1,.3,1);position:relative;overflow:hidden}
.dkh-js::before{content:"";position:absolute;top:0;left:0;right:0;height:4px;opacity:0;transition:opacity .25s}
.dkh-js:hover{transform:translateY(-6px);box-shadow:0 24px 48px rgba(3,31,66,.10)}
.dkh-js:hover::before{opacity:1}
.dkh-js-1:hover{border-color:var(--dkl-pink)}
.dkh-js-1:hover::before{background:var(--dkl-pink)}
.dkh-js-2:hover{border-color:var(--dkl-orange)}
.dkh-js-2:hover::before{background:var(--dkl-orange)}
.dkh-js-3:hover{border-color:var(--dkl-yellow)}
.dkh-js-3:hover::before{background:var(--dkl-yellow)}
.dkh-js-4:hover{border-color:var(--dkl-blue)}
.dkh-js-4:hover::before{background:var(--dkl-blue)}
.dkh-js-icon{width:62px;height:62px;border-radius:18px;display:inline-grid;place-items:center;font-size:30px;margin-bottom:14px;color:#fff;font-weight:800}
.dkh-js-1 .dkh-js-icon{background:linear-gradient(135deg,var(--dkl-pink),var(--dkl-pink-d));box-shadow:0 8px 20px rgba(236,72,153,.3)}
.dkh-js-2 .dkh-js-icon{background:linear-gradient(135deg,var(--dkl-orange),var(--dkl-orange-d));box-shadow:0 8px 20px rgba(249,115,22,.3)}
.dkh-js-3 .dkh-js-icon{background:linear-gradient(135deg,var(--dkl-yellow),var(--dkl-yellow-d));color:var(--dkl-navy);box-shadow:0 8px 20px rgba(255,194,33,.3)}
.dkh-js-4 .dkh-js-icon{background:linear-gradient(135deg,var(--dkl-blue),var(--dkl-blue-d));box-shadow:0 8px 20px rgba(0,113,220,.3)}
.dkh-js-step{font-size:11px;font-weight:700;color:#94a3b8;letter-spacing:.14em;text-transform:uppercase;margin-bottom:4px}
.dkh-js h3{font-size:19px;font-weight:800;margin:0 0 8px;color:var(--dkl-navy)}
.dkh-js p{font-size:14px;color:#64748b;line-height:1.6;margin:0 0 14px}
.dkh-js a{display:inline-flex;align-items:center;gap:4px;font-size:13px;font-weight:700;text-decoration:none;padding:7px 14px;border-radius:8px;transition:all .2s}
.dkh-js-1 a{color:var(--dkl-pink);background:rgba(236,72,153,.08)}
.dkh-js-1 a:hover{background:var(--dkl-pink);color:#fff}
.dkh-js-2 a{color:var(--dkl-orange);background:rgba(249,115,22,.08)}
.dkh-js-2 a:hover{background:var(--dkl-orange);color:#fff}
.dkh-js-3 a{color:#b8860b;background:rgba(255,194,33,.12)}
.dkh-js-3 a:hover{background:var(--dkl-yellow);color:var(--dkl-navy)}
.dkh-js-4 a{color:var(--dkl-blue);background:rgba(0,113,220,.08)}
.dkh-js-4 a:hover{background:var(--dkl-blue);color:#fff}

/* === TRUST STRIP === */
.dkh-trust{background:linear-gradient(135deg,var(--dkl-navy),#0a2e5c);color:#fff;padding:48px 0;position:relative;overflow:hidden}
.dkh-trust::before{content:"";position:absolute;top:-50%;right:-10%;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(255,194,33,.15),transparent 70%)}
.dkh-trust .dkh-wrap{position:relative;z-index:1;display:grid;grid-template-columns:1fr 2fr;gap:40px;align-items:center}
@media(max-width:860px){.dkh-trust .dkh-wrap{grid-template-columns:1fr}}
.dkh-trust-author{display:flex;align-items:center;gap:16px}
.dkh-trust-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--dkl-yellow),var(--dkl-orange));color:var(--dkl-navy);display:grid;place-items:center;font-weight:800;font-size:24px;flex-shrink:0;box-shadow:0 8px 20px rgba(255,194,33,.25)}
.dkh-trust-name{font-weight:800;font-size:17px;color:#fff}
.dkh-trust-title{color:rgba(255,255,255,.75);font-size:13px;margin-top:2px}
.dkh-trust-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
@media(max-width:600px){.dkh-trust-stats{grid-template-columns:repeat(2,1fr)}}
.dkh-trust-stat{text-align:center}
.dkh-trust-num{font-size:clamp(22px,2.5vw,30px);font-weight:800;line-height:1;color:var(--dkl-yellow)}
.dkh-trust-lbl{font-size:11px;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:.1em;margin-top:6px;font-weight:500}

/* === PROBLEM/ÇÖZÜM === */
.dkh-problem{background:#f9fafb;padding:72px 0}
.dkh-problem-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center}
@media(max-width:900px){.dkh-problem-grid{grid-template-columns:1fr}}
.dkh-problem-facts{display:flex;flex-direction:column;gap:14px;margin:20px 0}
.dkh-problem-fact{background:#fff;border-left:4px solid var(--dkl-pink);padding:16px 20px;border-radius:0 12px 12px 0;box-shadow:0 2px 10px rgba(3,31,66,.04)}
.dkh-problem-fact:nth-child(2){border-left-color:var(--dkl-orange)}
.dkh-problem-fact:nth-child(3){border-left-color:var(--dkl-yellow)}
.dkh-problem-fact:nth-child(4){border-left-color:var(--dkl-blue)}
.dkh-problem-fact strong{display:block;font-size:22px;color:var(--dkl-navy);font-weight:800;margin-bottom:4px}
.dkh-problem-fact span{font-size:14px;color:#6a7390;line-height:1.55}
.dkh-problem-note{background:#fff;border-radius:16px;padding:32px;box-shadow:0 4px 24px rgba(3,31,66,.06);position:relative;overflow:hidden}
.dkh-problem-note::before{content:"";position:absolute;top:0;left:0;width:100%;height:4px;background:var(--dk-logo-gradient,linear-gradient(90deg,#ec4899,#f97316,#ffc221,#0071dc))}
.dkh-problem-note h3{font-size:20px;font-weight:800;margin:12px 0 10px;color:var(--dkl-navy)}
.dkh-problem-note p{font-size:14px;color:#64748b;line-height:1.7;margin:0 0 16px}
.dkh-problem-note .badge{display:inline-block;padding:5px 12px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;background:rgba(0,113,220,.08);color:var(--dkl-blue);border:1px solid rgba(0,113,220,.2)}

/* === PERSONA CARDS === */
.dkh-persona{background:#fff;padding:72px 0}
.dkh-persona-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:22px;margin-top:36px}
.dkh-pcard{position:relative;background:#fff;border:1.5px solid rgba(0,0,0,.06);border-radius:20px;padding:32px 28px;text-decoration:none;color:inherit;transition:all .3s cubic-bezier(.16,1,.3,1);overflow:hidden}
.dkh-pcard::before{content:"";position:absolute;top:0;left:0;right:0;height:5px;opacity:0;transition:opacity .25s}
.dkh-pcard:hover{transform:translateY(-4px);box-shadow:0 24px 48px rgba(3,31,66,.1)}
.dkh-pcard:hover::before{opacity:1}
.dkh-pcard.is-parent:hover{border-color:var(--dkl-pink)}
.dkh-pcard.is-parent:hover::before{background:var(--dkl-pink)}
.dkh-pcard.is-teacher:hover{border-color:var(--dkl-orange)}
.dkh-pcard.is-teacher:hover::before{background:var(--dkl-orange)}
.dkh-pcard.is-inst:hover{border-color:var(--dkl-blue)}
.dkh-pcard.is-inst:hover::before{background:var(--dkl-blue)}
.dkh-pcard-icon{width:60px;height:60px;border-radius:16px;display:grid;place-items:center;font-size:30px;margin-bottom:16px}
.dkh-pcard.is-parent .dkh-pcard-icon{background:rgba(236,72,153,.12);color:var(--dkl-pink)}
.dkh-pcard.is-teacher .dkh-pcard-icon{background:rgba(249,115,22,.12);color:var(--dkl-orange)}
.dkh-pcard.is-inst .dkh-pcard-icon{background:rgba(0,113,220,.1);color:var(--dkl-blue)}
.dkh-pcard h3{font-size:21px;font-weight:800;margin:0 0 8px;color:var(--dkl-navy)}
.dkh-pcard p{font-size:14px;color:#64748b;line-height:1.6;margin:0 0 18px}
.dkh-pcard-cta{display:inline-flex;align-items:center;gap:4px;font-size:14px;font-weight:700;transition:gap .2s}
.dkh-pcard:hover .dkh-pcard-cta{gap:10px}
.dkh-pcard.is-parent .dkh-pcard-cta{color:var(--dkl-pink)}
.dkh-pcard.is-teacher .dkh-pcard-cta{color:var(--dkl-orange)}
.dkh-pcard.is-inst .dkh-pcard-cta{color:var(--dkl-blue)}

/* === TOOLS SHOWCASE === */
.dkh-tools{background:#f9fafb;padding:72px 0}
.dkh-tools-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-top:36px}
.dkh-tool{background:#fff;border-radius:14px;padding:20px 18px;text-decoration:none;color:inherit;border:1.5px solid rgba(0,0,0,.05);transition:all .25s;display:flex;flex-direction:column;gap:8px}
.dkh-tool:hover{transform:translateY(-3px);border-color:var(--_c,var(--dkl-blue));box-shadow:0 18px 36px rgba(3,31,66,.08)}
.dkh-tool-ic{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;font-size:22px;background:var(--_cbg,rgba(0,113,220,.1));color:var(--_c,var(--dkl-blue))}
.dkh-tool h4{font-size:15px;font-weight:800;margin:4px 0 2px;color:var(--dkl-navy)}
.dkh-tool span{font-size:12px;color:#64748b}
.dkh-tools-more{display:flex;justify-content:center;margin-top:28px}
.dkh-tools-more a{color:var(--dkl-blue);font-weight:700;font-size:15px;padding:12px 28px;border-radius:999px;background:#fff;border:1.5px solid var(--dkl-blue);text-decoration:none;transition:all .2s}
.dkh-tools-more a:hover{background:var(--dkl-blue);color:#fff;transform:translateY(-2px);box-shadow:0 8px 20px rgba(0,113,220,.25)}

/* === CTA === */
.dkh-cta{background:linear-gradient(135deg,var(--dkl-blue) 0%,#005bb3 50%,var(--dkl-navy) 100%);color:#fff;padding:72px 0;position:relative;overflow:hidden}
.dkh-cta::before{content:"";position:absolute;top:-120px;right:-80px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(255,194,33,.20),transparent 70%)}
.dkh-cta::after{content:"";position:absolute;bottom:-120px;left:-80px;width:340px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(236,72,153,.18),transparent 70%)}
.dkh-cta .dkh-wrap{position:relative;z-index:1;text-align:center}
.dkh-cta h2{font-size:clamp(28px,3.4vw,42px);font-weight:800;line-height:1.15;letter-spacing:-.02em;margin:0 0 14px;color:#fff}
.dkh-cta p{font-size:clamp(15px,1.2vw,17px);color:rgba(255,255,255,.9);max-width:620px;margin:0 auto 26px;line-height:1.65}
.dkh-cta-btns{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}
.dkh-cta-primary{background:var(--dkl-yellow);color:var(--dkl-navy);padding:14px 30px;border-radius:999px;font-weight:800;font-size:16px;text-decoration:none;transition:all .22s;display:inline-flex;align-items:center;gap:8px;box-shadow:0 10px 24px rgba(255,194,33,.35)}
.dkh-cta-primary:hover{background:#fff;color:var(--dkl-navy);transform:translateY(-2px);box-shadow:0 16px 32px rgba(255,255,255,.25)}
.dkh-cta-ghost{background:rgba(255,255,255,.1);color:#fff;padding:14px 30px;border-radius:999px;font-weight:700;font-size:16px;text-decoration:none;border:1.5px solid rgba(255,255,255,.3);transition:all .22s;display:inline-flex;align-items:center;gap:8px}
.dkh-cta-ghost:hover{background:rgba(255,255,255,.2);border-color:#fff;transform:translateY(-2px)}
</style>

<!-- HERO -->
<section class="dkh-hero">
  <div class="dkh-wrap">
    <div class="dkh-hero-grid">
      <div>
        <span class="dkh-hero-eyebrow"><span class="dot"></span>Türkiye normlarına göre standardize</span>
        <h1>
          <span class="pink">Toplayın</span>, <span class="orange">ayırın</span>,<br>
          <span class="yellow">çoğaltın</span>, <span class="blue">çözümleyin</span>
        </h1>
        <p class="lead">Prof. Dr. Yılmaz Mutlu'nun 20 yıllık akademik çalışmasına dayalı bütüncül diskalkuli tanılama ve müdahale platformu. <strong>4 dilde</strong> · <strong>bilimsel</strong> · <strong>kurulum gerektirmez</strong>.</p>
        <div class="dkh-hero-ctas">
          <a class="dkh-btn dkh-btn-primary" href="/platform/numap.html">15 dk'da Numap ile tara →</a>
          <a class="dkh-btn dkh-btn-ghost" href="/diskalkuli-nedir/">Önce öğreneyim</a>
        </div>
        <div class="dkh-hero-meta">
          <span>✓ <strong>Ücretsiz temel batarya</strong></span>
          <span>✓ <strong>Kayıt gerektirmez</strong></span>
          <span>✓ <strong>Tarayıcıda çalışır</strong></span>
        </div>
      </div>
      <div class="dkh-hero-visual" aria-hidden="true">
        <div class="dkh-op dkh-op-plus">+</div>
        <div class="dkh-op dkh-op-minus">−</div>
        <div class="dkh-op dkh-op-times">×</div>
        <div class="dkh-op dkh-op-div">÷</div>
      </div>
    </div>
  </div>
</section>

<!-- TRUST STRIP -->
<section class="dkh-trust">
  <div class="dkh-wrap">
    <div class="dkh-trust-author">
      <div class="dkh-trust-avatar">YM</div>
      <div>
        <div class="dkh-trust-name">Prof. Dr. Yılmaz Mutlu</div>
        <div class="dkh-trust-title">Diskalkuli alanında 20+ yıl akademik araştırma · Muş Alparslan Üniversitesi</div>
      </div>
    </div>
    <div class="dkh-trust-stats">
      <div class="dkh-trust-stat"><div class="dkh-trust-num">4.000+</div><div class="dkh-trust-lbl">Saha denemesi</div></div>
      <div class="dkh-trust-stat"><div class="dkh-trust-num">A1–A11</div><div class="dkh-trust-lbl">Tanılama bataryası</div></div>
      <div class="dkh-trust-stat"><div class="dkh-trust-num">59+</div><div class="dkh-trust-lbl">Müdahale modülü</div></div>
      <div class="dkh-trust-stat"><div class="dkh-trust-num">TR·EN·KU</div><div class="dkh-trust-lbl">Çok dilli destek</div></div>
    </div>
  </div>
</section>

<!-- PROBLEM / SCIENTIFIC CONTEXT -->
<section class="dkh-problem">
  <div class="dkh-wrap">
    <div class="dkh-section-head">
      <span class="dkh-section-eyebrow ey-orange">Neden Önemli?</span>
      <h2>Diskalkuli <span style="color:var(--dkl-orange)">görünmez</span>, ama gerçek.</h2>
      <p class="lead">Matematikle zorlanan bir çocuk "tembel" değil. Diskalkuli, beynin sayıyı işleyiş farklılığıdır — erken tespit ile büyük ölçüde telafi edilebilir.</p>
    </div>
    <div class="dkh-problem-grid">
      <div class="dkh-problem-facts">
        <div class="dkh-problem-fact"><strong>%5–7</strong><span>Türkiye'de ilkokul çağı çocuklarında diskalkuli görülme oranı</span></div>
        <div class="dkh-problem-fact"><strong>~20'de 1</strong><span>Her sınıfta en az bir diskalkuli şüpheli öğrenci bulunur</span></div>
        <div class="dkh-problem-fact"><strong>4–6 yıl</strong><span>Tanısız kalan çocuk akranlarından bu kadar geri kalabilir</span></div>
        <div class="dkh-problem-fact"><strong>6–12 ay</strong><span>Hedefli müdahalede kalıcı dönüşüm için yeterli süre</span></div>
      </div>
      <div class="dkh-problem-note">
        <span class="badge">Bilimsel Temel</span>
        <h3>Van Hiele · Bruner · Piaget · CRA · GAISE</h3>
        <p>Tüm araçlar uluslararası kabul görmüş pedagojik çerçevelere dayalıdır: somut-yarısomut-soyut (CRA), düzeyli geometri (Van Hiele), işlem-görsel-sembol (Bruner), istatistiksel anlayış (GAISE). DSM-5 "Özel Öğrenme Bozukluğu" sınıflamasıyla uyumlu değerlendirme.</p>
        <a href="/diskalkuli-nedir/" style="color:var(--dkl-blue);font-weight:700;text-decoration:none;font-size:14px">Bilimsel rehberi oku →</a>
      </div>
    </div>
  </div>
</section>

<!-- 4-STEP JOURNEY with logo colors -->
<section class="dkh-journey">
  <div class="dkh-wrap">
    <div class="dkh-section-head">
      <span class="dkh-section-eyebrow ey-yellow">Bilimsel Yolculuk · 4 Adım</span>
      <h2>Bilgilen → Tara → Müdahale Et → Pekiştir</h2>
      <p class="lead">Her adım, logo'muzdaki dört işlem gibi, bir önceki üzerine inşa edilir. Amacımız: çocuğun matematikle barışması.</p>
    </div>
    <div class="dkh-journey-steps">
      <div class="dkh-js dkh-js-1">
        <div class="dkh-js-icon">+</div>
        <div class="dkh-js-step">Adım 1</div>
        <h3>Bilgilen</h3>
        <p>Diskalkuli nedir, yaşlara göre belirtileri, kontrol listesi ve yapılabilecekler.</p>
        <a href="/diskalkuli-nedir/">Rehberi oku →</a>
      </div>
      <div class="dkh-js dkh-js-2">
        <div class="dkh-js-icon">−</div>
        <div class="dkh-js-step">Adım 2</div>
        <h3>Tara</h3>
        <p>Numap ile 48–96 ay yaş grubuna A1–A11 bataryasıyla bilimsel değerlendirme.</p>
        <a href="/platform/numap.html">Numap'ı aç →</a>
      </div>
      <div class="dkh-js dkh-js-3">
        <div class="dkh-js-icon">×</div>
        <div class="dkh-js-step">Adım 3</div>
        <h3>Müdahale Et</h3>
        <p>Galaksay 59+ oyunlaştırılmış modül + DokunSay 7 öğretim aracı.</p>
        <a href="/platform/galaksay.html">Galaksay'ı aç →</a>
      </div>
      <div class="dkh-js dkh-js-4">
        <div class="dkh-js-icon">÷</div>
        <div class="dkh-js-step">Adım 4</div>
        <h3>Pekiştir</h3>
        <p>Fiziksel DokunSay setleri ve kaynak kitaplarla sınıfta/evde tekrar.</p>
        <a href="/shop/">Mağazaya git →</a>
      </div>
    </div>
  </div>
</section>

<!-- PERSONAS -->
<section class="dkh-persona">
  <div class="dkh-wrap">
    <div class="dkh-section-head">
      <span class="dkh-section-eyebrow ey-pink">Buraya Hangi Soruyla Geldiniz?</span>
      <h2>Size özel hazırlanmış rehber</h2>
      <p class="lead">Hangisisiniz? Persona'nıza uygun yolculuk sayfasına gidin.</p>
    </div>
    <div class="dkh-persona-grid">
      <a class="dkh-pcard is-parent" href="/ebeveynler/">
        <div class="dkh-pcard-icon">👨‍👩‍👧</div>
        <h3>Ebeveynim</h3>
        <p>Çocuğumda diskalkuli şüphesi var. Bilimsel taramayla değerlendirip, uygun materyallerle destek olmak istiyorum.</p>
        <span class="dkh-pcard-cta">Ebeveyn rehberine git <span aria-hidden="true">→</span></span>
      </a>
      <a class="dkh-pcard is-teacher" href="/ogretmenler/">
        <div class="dkh-pcard-icon">🧑‍🏫</div>
        <h3>Öğretmenim</h3>
        <p>Sınıfımda parmakla sayan, 10'u geçince tutulan, problemi okuyunca donan öğrenciler var. Pratik, bilimsel çözümler arıyorum.</p>
        <span class="dkh-pcard-cta">Öğretmen rehberine git <span aria-hidden="true">→</span></span>
      </a>
      <a class="dkh-pcard is-inst" href="/iletisim/">
        <div class="dkh-pcard-icon">🏫</div>
        <h3>Kurum / Uzmanım</h3>
        <p>Rehberlik merkezi, özel eğitim kurumu veya klinik için kurumsal lisans, öğretmen eğitimi ve özel raporlama arıyorum.</p>
        <span class="dkh-pcard-cta">Kurumsal teklif al <span aria-hidden="true">→</span></span>
      </a>
    </div>
  </div>
</section>

<!-- TOOLS SHOWCASE -->
<section class="dkh-tools">
  <div class="dkh-wrap">
    <div class="dkh-section-head">
      <span class="dkh-section-eyebrow ey-orange">7 DokunSay Aracı</span>
      <h2>Tarayıcıda çalışan, kurulum gerektirmeyen araçlar</h2>
      <p class="lead">Her araç farklı bir matematiksel konuya ve pedagojik çerçeveye dayalı.</p>
    </div>
    <div class="dkh-tools-grid">
      <a class="dkh-tool" href="/araclar/sayi-cubuklari/" style="--_c:#F59E0B;--_cbg:rgba(245,158,11,.12)"><div class="dkh-tool-ic">🧮</div><h4>Sayı Çubukları</h4><span>5–10 yaş · CRA + Bruner</span></a>
      <a class="dkh-tool" href="/araclar/basamak-degeri/" style="--_c:#8B5CF6;--_cbg:rgba(139,92,246,.12)"><div class="dkh-tool-ic">🔢</div><h4>Basamak Değeri</h4><span>6–10 yaş · Bloom + Dienes</span></a>
      <a class="dkh-tool" href="/araclar/saat/" style="--_c:#3B82F6;--_cbg:rgba(59,130,246,.12)"><div class="dkh-tool-ic">🕐</div><h4>Saat</h4><span>6–9 yaş · Piaget</span></a>
      <a class="dkh-tool" href="/araclar/kesirler/" style="--_c:#EC4899;--_cbg:rgba(236,72,153,.12)"><div class="dkh-tool-ic">🍕</div><h4>Kesirler</h4><span>6–10 yaş · CRA + MEB</span></a>
      <a class="dkh-tool" href="/araclar/tam-sayilar/" style="--_c:#10B981;--_cbg:rgba(16,185,129,.12)"><div class="dkh-tool-ic">±</div><h4>Tam Sayılar</h4><span>10–13 yaş · Sıfır Çifti</span></a>
      <a class="dkh-tool" href="/araclar/geometri/" style="--_c:#EF4444;--_cbg:rgba(239,68,68,.12)"><div class="dkh-tool-ic">🔺</div><h4>Geometri</h4><span>5–14 yaş · Van Hiele</span></a>
      <a class="dkh-tool" href="/araclar/istatistik/" style="--_c:#06B6D4;--_cbg:rgba(6,182,212,.12)"><div class="dkh-tool-ic">📊</div><h4>İstatistik & Veri</h4><span>7–15 yaş · Curcio + GAISE</span></a>
    </div>
    <div class="dkh-tools-more"><a href="/araclar/">Tüm araçları keşfet →</a></div>
  </div>
</section>

<!-- FINAL CTA -->
<section class="dkh-cta">
  <div class="dkh-wrap">
    <h2>Çocuğunuzu ya da öğrencinizi 15 dakikada bilimsel olarak tarayın</h2>
    <p>Numap ile A1–A11 bataryası, Türkiye normlarına göre standardize edilmiş otomatik risk etiketi. Hiçbir kayıt zorunluluğu olmadan, tarayıcınızda başlayın.</p>
    <div class="dkh-cta-btns">
      <a class="dkh-cta-primary" href="/platform/numap.html">Numap ile Tara →</a>
      <a class="dkh-cta-ghost" href="/diskalkuli-nedir/">Önce Öğrenmek İstiyorum</a>
    </div>
  </div>
</section>

</div>
        <?php
        return ob_get_clean();
    }

    /* ========== HEADER CLEANED (removes theme's default page banner) ========== */
    private function header_cleaned() {
        ob_start();
        get_header();
        $h = ob_get_clean();
        // Strip Edumall's page-title-bar with balanced depth counting
        $h = $this->strip_element_by_id($h, 'div', 'page-title-bar');
        // Legacy inner-banner (just in case)
        $h = preg_replace('/<section[^>]*class="[^"]*inner-banner-area[^"]*"[^>]*>.*?<\/section>/is', '', $h);
        echo $h;
    }

    /** Strip a specific element by id, with proper depth tracking (no extra close tags). */
    private function strip_element_by_id($html, $tag, $id) {
        $tag_lc = strtolower($tag);
        // Find opening tag with this id
        $pattern = '/<' . $tag_lc . '\b[^>]*\bid=["\']' . preg_quote($id, '/') . '["\'][^>]*>/i';
        if (!preg_match($pattern, $html, $m, PREG_OFFSET_CAPTURE)) return $html;
        $open_pos = $m[0][1];
        $open_end = $open_pos + strlen($m[0][0]);
        $depth = 1;
        $pos = $open_end;
        $len = strlen($html);
        $open_re = '<' . $tag_lc;
        $close_re = '</' . $tag_lc . '>';
        while ($pos < $len && $depth > 0) {
            $next_open  = stripos($html, $open_re,  $pos);
            $next_close = stripos($html, $close_re, $pos);
            if ($next_close === false) break;
            if ($next_open !== false && $next_open < $next_close) {
                $depth++;
                $pos = $next_open + strlen($open_re);
            } else {
                $depth--;
                $pos = $next_close + strlen($close_re);
            }
        }
        return substr($html, 0, $open_pos) . substr($html, $pos);
    }

    /** Open the main content wrapper that the theme's index.php would normally provide */
    private function main_open() {
        echo '<main id="main-content" class="dk-main-content site-main" style="display:block;width:100%;min-height:60vh;">';
    }
    private function main_close() {
        echo '</main>';
    }

    /* ========== PAGE RENDERERS ========== */
    public function render_nedir() {
        $this->header_cleaned();
        $this->main_open();
        include __DIR__ . '/dk-templates/dk-page-nedir.php';
        $this->main_close();
        get_footer();
    }

    public function render_persona($type) {
        $this->header_cleaned();
        $this->main_open();
        $GLOBALS['dk_persona_type'] = $type;
        include __DIR__ . '/dk-templates/dk-page-persona.php';
        $this->main_close();
        get_footer();
    }

    public function render_araclar_index() {
        $this->header_cleaned();
        $this->main_open();
        $GLOBALS['dk_tools'] = self::tools();
        include __DIR__ . '/dk-templates/dk-page-araclar-index.php';
        $this->main_close();
        get_footer();
    }

    public function render_tool($slug) {
        $tools = self::tools();
        if (!isset($tools[$slug])) {
            status_header(404);
            $this->header_cleaned();
            $this->main_open();
            echo '<section style="min-height:50vh;display:grid;place-items:center;padding:60px;"><div style="text-align:center"><h1>Araç bulunamadı</h1><a href="/araclar/" class="dk-btn dk-btn--primary">← Tüm araçlar</a></div></section>';
            $this->main_close();
            get_footer();
            return;
        }
        $GLOBALS['dk_tool_slug'] = $slug;
        $GLOBALS['dk_tool'] = $tools[$slug];
        $GLOBALS['dk_tools'] = $tools;
        $this->header_cleaned();
        $this->main_open();
        include __DIR__ . '/dk-templates/dk-page-tool.php';
        $this->main_close();
        get_footer();
    }

    /* ========== FOOTER REPLACEMENT ========== */
    public function inject_footer_hide_css() {
        if (is_admin()) return;
        ?>
<style id="dk-footer-hide">
/* Hide Edumall/Elementor default footer — but NOT our own #dk-site-footer */
#colophon:not(#dk-site-footer),
.site-footer:not(#dk-site-footer):not(.dk-footer),
body > footer:not(#dk-site-footer):not(.dk-footer),
.elementor-location-footer,
.footer-area:not(.dk-footer),
#footer:not(#dk-site-footer),
.main-footer:not(.dk-footer),
.elementor-kit-footer,
div[data-elementor-type="footer"],
.footer-widgets, .footer-top, .footer-copyright {
  display: none !important;
  visibility: hidden !important;
  height: 0 !important;
  overflow: hidden !important;
}
/* Ensure our footer is visible */
#dk-site-footer,
#dk-site-footer.dk-footer {
  display: block !important;
  visibility: visible !important;
  height: auto !important;
  overflow: visible !important;
  width: 100% !important;
}
/* Fix Edumall mobil menü desktop'ta görünür kalıp 360px sağa taşıyor — yatay scroll yaratıyor */
@media (min-width: 992px) {
  #page-mobile-main-menu,
  .page-mobile-popup,
  .page-mobile-menu-header { display: none !important; }
}
html { overflow-x: hidden; }
/* Fix top menu overflow on 1366–1500px screens — Edumall theme has padding-left/right:17px !important rule
   inside @media(min-width:1400px) which beats our shorthand padding rule. We need same-or-higher specificity
   with longhand padding props to win the cascade. */
@media (min-width: 1200px) and (max-width: 1500px) {
  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-home > a,
  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-nedir > a,
  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-ebeveyn > a,
  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-ogretmen > a,
  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-araclar > a,
  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-magaza > a,
  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-platform > a,
  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-giris > a,
  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-kayit > a {
    padding-left: 10px !important;
    padding-right: 10px !important;
    font-size: 12px !important;
  }
}
/* Edumall page-breadcrumb (Home / Sayfa) tüm sayfalarda gizle — minimal/temiz görünüm */
#page-breadcrumb { display: none !important; }
</style>
        <?php
    }

    public function inject_dk_footer() {
        if (is_admin()) return;
        // avoid double-inject
        static $done = false;
        if ($done) return;
        $done = true;
        ?>
<footer id="dk-site-footer" class="dk-footer" role="contentinfo">
  <style>
  .dk-footer{background:linear-gradient(180deg,#031f42 0%,#0a2e5c 100%);color:#cbd5e1;font-family:'Inter',system-ui,sans-serif;padding:56px 20px 0;margin-top:64px;position:relative;overflow:hidden}
  .dk-footer::before{content:"";position:absolute;top:-80px;right:-120px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,rgba(0,113,220,.18),transparent 70%);pointer-events:none}
  .dk-footer::after{content:"";position:absolute;bottom:0;left:-120px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,194,33,.10),transparent 70%);pointer-events:none}
  .dk-footer .dk-wrap{max-width:1200px;margin:0 auto;position:relative;z-index:1}
  .dk-footer-grid{display:grid;grid-template-columns:1.3fr 1fr 1fr 1fr;gap:40px;padding-bottom:42px;border-bottom:1px solid rgba(255,255,255,.08)}
  @media(max-width:960px){.dk-footer-grid{grid-template-columns:1fr 1fr;gap:32px}}
  @media(max-width:520px){.dk-footer-grid{grid-template-columns:1fr;gap:28px}}
  .dk-footer-brand h4{color:#fff;font-size:20px;font-weight:800;margin:0 0 10px;letter-spacing:-.01em}
  .dk-footer-brand .dk-footer-sub{color:#fff;font-weight:600;font-size:13px;letter-spacing:.02em;margin:0 0 14px}
  .dk-footer-brand p{font-size:14px;color:#9aa8bb;line-height:1.65;margin:0 0 18px;max-width:320px}
  .dk-footer-contact{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
  .dk-footer-contact a{color:#cbd5e1;font-size:14px;text-decoration:none;display:inline-flex;align-items:center;gap:8px;transition:color .2s}
  .dk-footer-contact a:hover{color:#ffc221}
  .dk-footer-contact .ic{width:18px;height:18px;display:inline-grid;place-items:center;opacity:.8}
  .dk-footer-social{display:flex;gap:10px;margin-top:4px}
  .dk-footer-social a{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.08);display:grid;place-items:center;color:#cbd5e1;text-decoration:none;transition:all .2s;border:1px solid rgba(255,255,255,.1)}
  .dk-footer-social a:hover{background:#ffc221;color:#031f42;border-color:#ffc221;transform:translateY(-2px)}
  .dk-footer-social svg{width:18px;height:18px;fill:currentColor}
  .dk-footer-col h4{color:#fff;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:.14em;margin:0 0 16px;position:relative;padding-bottom:10px}
  .dk-footer-col h4::after{content:"";position:absolute;bottom:0;left:0;width:24px;height:2px;background:#ffc221;border-radius:2px}
  .dk-footer-col ul{list-style:none;padding:0;margin:0}
  .dk-footer-col li{margin-bottom:9px}
  .dk-footer-col a{color:#9aa8bb;text-decoration:none;font-size:14px;transition:all .2s;display:inline-flex;align-items:center;gap:6px}
  .dk-footer-col a:hover{color:#ffc221;padding-left:4px}
  .dk-footer-col a::before{content:"→";opacity:0;margin-right:-10px;transition:all .2s;color:#ffc221}
  .dk-footer-col a:hover::before{opacity:1;margin-right:2px}
  .dk-footer-bottom{display:flex;justify-content:space-between;align-items:center;padding:22px 0;gap:16px;flex-wrap:wrap}
  .dk-footer-copyright{font-size:13px;color:#8592a8}
  .dk-footer-copyright strong{color:#cbd5e1;font-weight:600}
  .dk-footer-legal{display:flex;gap:22px;flex-wrap:wrap}
  .dk-footer-legal a{font-size:13px;color:#8592a8;text-decoration:none;transition:color .2s}
  .dk-footer-legal a:hover{color:#ffc221}
  .dk-footer-trust{display:flex;align-items:center;gap:10px;font-size:12px;color:#8592a8}
  .dk-footer-trust-dot{width:8px;height:8px;border-radius:50%;background:#10b981;box-shadow:0 0 0 4px rgba(16,185,129,.15);animation:dk-pulse 2s infinite}
  @keyframes dk-pulse{0%,100%{opacity:1}50%{opacity:.6}}
  </style>
  <div class="dk-wrap">
    <div class="dk-footer-grid">
      <!-- Brand -->
      <div class="dk-footer-brand">
        <h4>Diskalkuli Akademi</h4>
        <div class="dk-footer-sub">"Her şey sayma ile başladı"</div>
        <p>Prof. Dr. Yılmaz Mutlu'nun 20 yıllık akademik araştırmasına dayalı diskalkuli tanılama, müdahale ve öğretim ekosistemi.</p>
        <div class="dk-footer-contact">
          <a href="mailto:bilgi@diskalkuli.com"><span class="ic">✉</span> bilgi@diskalkuli.com</a>
          <a href="/iletisim/"><span class="ic">📍</span> İletişim formu</a>
        </div>
        <div class="dk-footer-social" aria-label="Sosyal medya">
          <a href="https://facebook.com/diskalkuli" target="_blank" rel="noopener" aria-label="Facebook">
            <svg viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.6 9.9v-7H8V12h2.4V9.8c0-2.4 1.4-3.7 3.5-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5V12h2.6l-.4 2.9h-2.2v7A10 10 0 0022 12z"/></svg>
          </a>
          <a href="https://instagram.com/diskalkuli" target="_blank" rel="noopener" aria-label="Instagram">
            <svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2 0 1.8.2 2.2.4.6.2 1 .5 1.4 1 .5.4.8.9 1 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c0 1.2-.2 1.8-.4 2.2-.2.6-.5 1-1 1.4-.4.5-.9.8-1.4 1-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2 0-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-1-.5-.4-.8-.9-1-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c0-1.2.2-1.8.4-2.2.2-.6.5-1 1-1.4.4-.5.9-.8 1.4-1 .4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 2c-3.1 0-3.5 0-4.7.1-.9 0-1.5.2-1.9.4-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.1.4-.3 1-.4 1.9C3.2 9.5 3.2 9.9 3.2 12s0 2.5.1 3.6c0 .9.2 1.5.4 1.9.2.5.4.8.7 1.1.3.3.6.5 1.1.7.4.1 1 .3 1.9.4 1.1.1 1.5.1 4.6.1s3.5 0 4.6-.1c.9 0 1.5-.2 1.9-.4.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.1-.4.3-1 .4-1.9.1-1.1.1-1.5.1-4.6s0-3.5-.1-4.6c0-.9-.2-1.5-.4-1.9-.2-.5-.4-.8-.7-1.1-.3-.3-.6-.5-1.1-.7-.4-.1-1-.3-1.9-.4-1.1-.1-1.5-.1-4.6-.1zm0 3.4a4.4 4.4 0 110 8.8 4.4 4.4 0 010-8.8zm0 2a2.4 2.4 0 100 4.8 2.4 2.4 0 000-4.8zm5.5-2.3a1 1 0 11-2 0 1 1 0 012 0z"/></svg>
          </a>
        </div>
      </div>

      <!-- Keşfet -->
      <div class="dk-footer-col">
        <h4>Keşfet</h4>
        <ul>
          <li><a href="/diskalkuli-nedir/">Diskalkuli Nedir?</a></li>
          <li><a href="/ebeveynler/">Ebeveynler İçin</a></li>
          <li><a href="/ogretmenler/">Öğretmenler İçin</a></li>
          <li><a href="/hakkimizda/">Hakkımızda</a></li>
          <li><a href="/iletisim/">İletişim</a></li>
        </ul>
      </div>

      <!-- DokunSay Araçları -->
      <div class="dk-footer-col">
        <h4>DokunSay Araçları</h4>
        <ul>
          <li><a href="/araclar/sayi-cubuklari/">Sayı Çubukları</a></li>
          <li><a href="/araclar/basamak-degeri/">Basamak Değeri</a></li>
          <li><a href="/araclar/saat/">Saat</a></li>
          <li><a href="/araclar/kesirler/">Kesirler</a></li>
          <li><a href="/araclar/geometri/">Geometri</a></li>
          <li><a href="/araclar/">Tüm araçlar →</a></li>
        </ul>
      </div>

      <!-- Platform -->
      <div class="dk-footer-col">
        <h4>Tanıla &amp; Mağaza</h4>
        <ul>
          <li><a href="/platform/numap.html">Numap (Tanılama)</a></li>
          <li><a href="/platform/galaksay.html">Galaksay (Müdahale)</a></li>
          <li><a href="/platform/">Platform ana sayfa</a></li>
          <li><a href="/shop/">Mağaza (Materyaller)</a></li>
          <li><a href="/blog/">Blog</a></li>
        </ul>
      </div>
    </div>

    <div class="dk-footer-bottom">
      <div class="dk-footer-copyright">
        &copy; <?php echo date('Y'); ?> <strong>Diskalkuli Akademi</strong>. Tüm hakları saklıdır.
      </div>
      <div class="dk-footer-trust">
        <span class="dk-footer-trust-dot"></span> Türkiye normlarına göre standardize
      </div>
      <div class="dk-footer-legal">
        <a href="/gizlilik-politikasi/">Gizlilik</a>
        <a href="/kullanim-kosullari/">Kullanım Koşulları</a>
        <a href="/kvkk/">KVKK</a>
      </div>
    </div>
  </div>
</footer>
        <?php
    }

    /* ========== SHOP HERO + SEO ========== */
    public function shop_seo_tags() {
        if (!function_exists('is_shop') || !is_shop()) return;
        ?>
<style id="dk-shop-hero-css">
/* Hide theme's default page-title-bar on shop */
body.woocommerce-shop #page-title-bar,
body.post-type-archive-product #page-title-bar { display:none !important; }

.dk-shop-hero{background:linear-gradient(135deg,#06b6d4 0%,#0891b2 55%,#0e7490 100%);color:#fff;padding:48px 24px 52px;margin:0 0 28px;position:relative;overflow:hidden;font-family:'Inter',sans-serif}
.dk-shop-hero::before{content:"";position:absolute;top:-80px;right:-100px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.18),transparent 70%);pointer-events:none}
.dk-shop-hero::after{content:"";position:absolute;bottom:-120px;left:-80px;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(255,194,33,.20),transparent 70%);pointer-events:none}
.dk-shop-hero .dk-wrap{max-width:1200px;margin:0 auto;position:relative;z-index:1}
.dk-shop-hero-crumb{font-size:12px;color:rgba(255,255,255,.8);margin-bottom:12px;font-weight:500}
.dk-shop-hero-crumb a{color:#fff;text-decoration:none;opacity:.92;transition:opacity .2s}
.dk-shop-hero-crumb a:hover{opacity:1;text-decoration:underline}
.dk-shop-hero-crumb .sep{margin:0 6px;opacity:.6}
.dk-shop-hero-eyebrow{display:inline-block;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.28);padding:5px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:12px}
.dk-shop-hero h1{font-size:clamp(26px,3.2vw,40px);font-weight:800;margin:0 0 12px;letter-spacing:-.02em;line-height:1.15;color:#fff}
.dk-shop-hero h1 .dk-highlight{background:#ffc221;color:#031f42;padding:0 12px;border-radius:8px;margin-right:4px;display:inline-block}
.dk-shop-hero p.lead{font-size:clamp(14px,1.15vw,16px);color:rgba(255,255,255,.94);max-width:760px;margin:0 0 20px;line-height:1.65}
.dk-shop-hero-stats{display:flex;gap:28px;flex-wrap:wrap;margin-top:8px;padding-top:20px;border-top:1px solid rgba(255,255,255,.18)}
.dk-shop-hero-stats > div{display:flex;align-items:center;gap:11px}
.dk-shop-hero-stats .ic{width:42px;height:42px;border-radius:11px;background:rgba(255,255,255,.15);display:grid;place-items:center;font-size:20px;flex-shrink:0;border:1px solid rgba(255,255,255,.22)}
.dk-shop-hero-stats .txt strong{display:block;color:#fff;font-weight:800;font-size:14px;line-height:1.2;margin-bottom:2px}
.dk-shop-hero-stats .txt span{font-size:12px;color:rgba(255,255,255,.82)}
@media(max-width:640px){
  .dk-shop-hero{padding:36px 18px 40px}
  .dk-shop-hero-stats{gap:16px}
  .dk-shop-hero-stats > div{flex:1 1 100%}
}
</style>
        <?php
    }

    public function inject_shop_hero_js() {
        if (!function_exists('is_shop') || !is_shop()) return;
        $html  = '<section class="dk-shop-hero" id="dk-shop-hero">';
        $html .= '<div class="dk-wrap">';
        $html .= '<span class="dk-shop-hero-eyebrow">Pekiştirme Adımı · Fiziksel Materyaller</span>';
        $html .= '<h1><span class="dk-highlight">Mağaza</span> — Diskalkuli Destek Materyalleri</h1>';
        $html .= '<p class="lead">Dijital araçlarla öğrendiklerini elle tutup gözle görerek pekiştirin. Prof. Dr. Yılmaz Mutlu\'nun akademik çalışmalarına dayalı <strong>DokunSay setleri</strong>, <strong>etkinlik kitapları</strong> ve <strong>kaynak kitaplar</strong>. Her ürün sınıf veya ev ortamında 15 dakikalık oturumlar için tasarlandı.</p>';
        $html .= '<div class="dk-shop-hero-stats">';
        $html .= '<div><div class="ic">📦</div><div class="txt"><strong>Orijinal DokunSay setleri</strong><span>Somut öğrenme için 7 araç</span></div></div>';
        $html .= '<div><div class="ic">📘</div><div class="txt"><strong>Etkinlik kitapları</strong><span>Yaşa göre aşamalı içerik</span></div></div>';
        $html .= '<div><div class="ic">🚚</div><div class="txt"><strong>Türkiye geneli kargo</strong><span>Güvenli ödeme, hızlı teslimat</span></div></div>';
        $html .= '</div></div></section>';
        ?>
<script id="dk-shop-hero-inject">
(function(){
  if (document.getElementById('dk-shop-hero')) return;
  var html = <?php echo wp_json_encode($html); ?>;
  var wrap = document.createElement('div');
  wrap.innerHTML = html;
  var hero = wrap.firstElementChild;

  // Place hero immediately before the products grid (after site header, before products)
  var grid = document.querySelector('.edumall-grid-wrapper') ||
             document.querySelector('.woocommerce-notices-wrapper') ||
             document.querySelector('ul.products') ||
             document.querySelector('.woocommerce');
  if (grid && grid.parentNode) {
    grid.parentNode.insertBefore(hero, grid);
  } else {
    document.body.insertBefore(hero, document.body.firstChild);
  }

  // Trigger isotope/masonry reflow — theme uses isotope for product grid
  setTimeout(function(){
    if (window.jQuery) {
      try {
        window.jQuery('.edumall-grid').each(function(){
          var $g = window.jQuery(this);
          if ($g.data('isotope')) $g.isotope('layout');
        });
      } catch(e) {}
    }
    window.dispatchEvent(new Event('resize'));
  }, 250);
})();
</script>
        <?php
    }
}

new DK_Content_Routing();
