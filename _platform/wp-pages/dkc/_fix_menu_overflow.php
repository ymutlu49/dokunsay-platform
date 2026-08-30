<?php
/**
 * dk-content.php: top menu (desktop) "Giris/Kayit Ol" overflow fix
 * Edumall theme has high-specificity padding rule at @media(min-width:1400px)
 * that beats our shorthand padding override. We add a higher-specificity longhand
 * rule that activates 1200-1500px to make 9 menu items fit on common laptop screens.
 *
 * Idempotent: marker check skips reapply.
 */
$SECRET = "dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme";
if (($_GET["s"] ?? "") !== $SECRET) { http_response_code(403); die("F"); }
header("Content-Type: text/plain; charset=utf-8");

$dkc = "/home/diskalkuli/public_html/wp-content/mu-plugins/dk-content.php";
echo "[1] dk-content.php top-menu overflow fix\n";
if (!file_exists($dkc)) { echo "  HATA: $dkc yok\n"; exit; }
$c = file_get_contents($dkc);
$o = $c;

$marker = "/* Fix top menu overflow on 1366";
if (strpos($c, $marker) !== false) {
  echo "  ZATEN UYGULI - skip\n";
} else {
  $needle = "html { overflow-x: hidden; }\n</style>";
  $new_block = "html { overflow-x: hidden; }\n"
    . "/* Fix top menu overflow on 1366-1500px screens - Edumall theme has padding-left/right:17px !important rule\n"
    . "   inside @media(min-width:1400px) which beats our shorthand padding rule. We need same-or-higher specificity\n"
    . "   with longhand padding props to win the cascade. */\n"
    . "@media (min-width: 1200px) and (max-width: 1500px) {\n"
    . "  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-home > a,\n"
    . "  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-nedir > a,\n"
    . "  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-ebeveyn > a,\n"
    . "  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-ogretmen > a,\n"
    . "  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-araclar > a,\n"
    . "  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-magaza > a,\n"
    . "  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-platform > a,\n"
    . "  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-giris > a,\n"
    . "  .desktop-menu .header-08 .menu--primary > ul > li.menu-item-dk-kayit > a {\n"
    . "    padding-left: 10px !important;\n"
    . "    padding-right: 10px !important;\n"
    . "    font-size: 12px !important;\n"
    . "  }\n"
    . "}\n"
    . "</style>";

  if (strpos($c, $needle) === false) {
    echo "  HATA: needle bulunamadi - dk-content.php farkli versiyonda\n";
  } else {
    $c = str_replace($needle, $new_block, $c);
    copy($dkc, $dkc . ".bak-menufix-" . date("Ymd-His"));
    file_put_contents($dkc, $c);
    echo "  OK: " . strlen($c) . " bytes (was " . strlen($o) . ")\n";
  }
}

echo "\n[1b] Edumall #page-breadcrumb global gizleme\n";
$c = file_get_contents($dkc);
$bc_marker = "#page-breadcrumb { display: none !important; }";
if (strpos($c, $bc_marker) !== false) {
  echo "  ZATEN UYGULI - skip\n";
} else {
  $bc_needle = "  }\n}\n</style>";
  $bc_new    = "  }\n}\n/* Edumall page-breadcrumb (Home / Sayfa) tum sayfalarda gizle */\n#page-breadcrumb { display: none !important; }\n</style>";
  if (substr_count($c, $bc_needle) === 0) {
    echo "  HATA: breadcrumb needle bulunamadi\n";
  } else {
    // Replace only LAST occurrence so we hit the inject_footer_hide_css block, not earlier @media closes
    $pos = strrpos($c, $bc_needle);
    $c2 = substr($c, 0, $pos) . $bc_new . substr($c, $pos + strlen($bc_needle));
    file_put_contents($dkc, $c2);
    echo "  OK\n";
  }
}

echo "\n[2] Cache + OPcache temizleniyor\n";
require "/home/diskalkuli/public_html/wp-load.php";
do_action("litespeed_purge_all");
wp_cache_flush();
if (function_exists("opcache_reset")) opcache_reset();
echo "  OK\n";

$c2 = file_get_contents($dkc);
echo "\n[3] Verify:\n";
echo "  marker: " . (strpos($c2, $marker) !== false ? "PRESENT" : "MISSING") . "\n";
echo "  longhand padding-left:10px count: " . substr_count($c2, "padding-left: 10px !important") . "\n";

echo "\nTAMAM - sayfayi yenile (Ctrl+F5), Giris/Kayit Ol gorunmeli.\n";
echo "Bu dosyayi cPanel File Manager'dan SIL.\n";
