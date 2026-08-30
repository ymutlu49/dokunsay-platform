<?php
$SECRET = "dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme";
if (($_GET["s"] ?? "") !== $SECRET) die("F");
header("Content-Type: text/plain; charset=utf-8");

// Edumall mobil menü desktop'ta görünüp 360px taşıyor → tüm sayfalarda yatay scroll
// Çözüm: dk-content.php inject_footer_hide_css içine media query ekle
echo "[1] dk-content.php yatay-scroll fix\n";
$dkc = "/home/diskalkuli/public_html/wp-content/mu-plugins/dk-content.php";
$c = file_get_contents($dkc);
$o = $c;

$marker = "/* Fix Edumall mobil menü";
if (strpos($c, $marker) !== false) {
  echo "  ALREADY APPLIED — skip\n";
} else {
  $needle = "/* Ensure our footer is visible */\n#dk-site-footer,\n#dk-site-footer.dk-footer {\n  display: block !important;\n  visibility: visible !important;\n  height: auto !important;\n  overflow: visible !important;\n  width: 100% !important;\n}\n</style>";

  $replacement = "/* Ensure our footer is visible */\n#dk-site-footer,\n#dk-site-footer.dk-footer {\n  display: block !important;\n  visibility: visible !important;\n  height: auto !important;\n  overflow: visible !important;\n  width: 100% !important;\n}\n/* Fix Edumall mobil menü desktop'ta görünür kalıp 360px sağa tasiyor — yatay scroll yaratiyor */\n@media (min-width: 992px) {\n  #page-mobile-main-menu,\n  .page-mobile-popup,\n  .page-mobile-menu-header { display: none !important; }\n}\nhtml { overflow-x: hidden; }\n</style>";

  if (strpos($c, $needle) === false) {
    echo "  NEEDLE NOT FOUND — manuel mudahale gerek\n";
    echo "  Aranan ilk 80 char: " . substr($needle, 0, 80) . "...\n";
  } else {
    $c = str_replace($needle, $replacement, $c);
    copy($dkc, $dkc . ".bak-overflow-" . date("Ymd-His"));
    file_put_contents($dkc, $c);
    echo "  OK: " . strlen($c) . " bytes (was " . strlen($o) . ")\n";
  }
}

// Cache flush
require "/home/diskalkuli/public_html/wp-load.php";
do_action("litespeed_purge_all");
wp_cache_flush();
if (function_exists("opcache_reset")) opcache_reset();
echo "[2] Cache+OPcache purged\n";

// Verify
$c2 = file_get_contents($dkc);
echo "[3] Verify:\n";
echo "  marker: " . (strpos($c2, $marker) !== false ? "PRESENT" : "MISSING") . "\n";
echo "  page-mobile-main-menu rule: " . substr_count($c2, "page-mobile-main-menu") . "\n";

echo "\nTAMAM — sayfayi yenile, yatay scroll bitmeli\n";
