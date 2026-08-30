<?php
/**
 * Tek seferlik birlesik deploy:
 *  1) dk-content.php icine yatay-scroll fix CSS ekler (Edumall mobil menu)
 *  2) Tum DokunSay app JS bundle'larinda "Menuye Don" linkini /araclar/ yapar
 *  3) DokunSayKesir index.html'inde bozuk base path'i duzeltir
 *  4) Cache + OPcache temizler
 *
 * Yer: /home/diskalkuli/public_html/_dk_deploy.php
 * Calistir: https://diskalkuli.com/_dk_deploy.php?s=dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme
 * Sonra dosyayi sil.
 *
 * Idempotent: birden fazla calisirsa zarar vermez (yedek alir, kontrol eder).
 */
$SECRET = "dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme";
if (($_GET["s"] ?? "") !== $SECRET) die("F");
header("Content-Type: text/plain; charset=utf-8");

echo "=== DokunSay deploy " . date("Y-m-d H:i:s") . " ===\n\n";

// =================================================================
// 1) dk-content.php — yatay scroll fix
// =================================================================
echo "[1] dk-content.php icine mobil-menu/overflow CSS ekleniyor\n";
$dkc = "/home/diskalkuli/public_html/wp-content/mu-plugins/dk-content.php";
if (!file_exists($dkc)) {
  echo "  HATA: $dkc yok!\n\n";
} else {
  $c = file_get_contents($dkc);
  $marker = "/* Fix Edumall mobil menu";
  if (strpos($c, $marker) !== false) {
    echo "  ZATEN UYGULI - skip\n\n";
  } else {
    $needle = "/* Ensure our footer is visible */\n#dk-site-footer,\n#dk-site-footer.dk-footer {\n  display: block !important;\n  visibility: visible !important;\n  height: auto !important;\n  overflow: visible !important;\n  width: 100% !important;\n}\n</style>";

    $replacement = "/* Ensure our footer is visible */\n#dk-site-footer,\n#dk-site-footer.dk-footer {\n  display: block !important;\n  visibility: visible !important;\n  height: auto !important;\n  overflow: visible !important;\n  width: 100% !important;\n}\n/* Fix Edumall mobil menu desktop'ta gorunup 360px tasiyor - yatay scroll yaratiyor */\n@media (min-width: 992px) {\n  #page-mobile-main-menu,\n  .page-mobile-popup,\n  .page-mobile-menu-header { display: none !important; }\n}\nhtml { overflow-x: hidden; }\n</style>";

    if (strpos($c, $needle) === false) {
      echo "  HATA: needle bulunamadi - dk-content.php farkli versiyonda\n\n";
    } else {
      $c2 = str_replace($needle, $replacement, $c);
      copy($dkc, $dkc . ".bak-deploy-" . date("Ymd-His"));
      file_put_contents($dkc, $c2);
      echo "  OK: " . strlen($c2) . " bytes (was " . strlen($c) . ")\n\n";
    }
  }
}

// =================================================================
// 2) DokunSay app JS bundle'larinda back-link patch
// =================================================================
echo "[2] DokunSay app JS bundle'larinda back-link /araclar/ yapiliyor\n";
$root = "/home/diskalkuli/public_html/dokunsay";
$old = 'new URL("..",window.location.href).pathname';
$new = '"/araclar/"';

if (!is_dir($root)) {
  echo "  HATA: $root yok!\n\n";
} else {
  $changed = 0; $totalJs = 0; $skipped = 0;
  $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, RecursiveDirectoryIterator::SKIP_DOTS));
  foreach ($it as $f) {
    if (!$f->isFile()) continue;
    $path = $f->getPathname();
    if (substr($path, -3) !== ".js") continue;
    $totalJs++;
    $c = file_get_contents($path);
    if (strpos($c, $old) === false) { $skipped++; continue; }
    $c2 = str_replace($old, $new, $c);
    copy($path, $path . ".bak-deploy-" . date("Ymd-His"));
    file_put_contents($path, $c2);
    $rel = str_replace($root . "/", "", $path);
    echo "  OK: $rel\n";
    $changed++;
  }
  echo "  TOPLAM: $totalJs .js, $changed degisti, $skipped temiz/eslesme yok\n\n";
}

// =================================================================
// 3) DokunSayKesir index.html bozuk base path
// =================================================================
echo "[3] DokunSayKesir index.html base path duzeltme\n";
$kesirHtml = "$root/DokunSayKesir/index.html";
if (file_exists($kesirHtml)) {
  $kh = file_get_contents($kesirHtml);
  $kh2 = str_replace('"/DokunSayKesir/', '"/dokunsay/DokunSayKesir/', $kh);
  if ($kh !== $kh2) {
    copy($kesirHtml, $kesirHtml . ".bak-deploy-" . date("Ymd-His"));
    file_put_contents($kesirHtml, $kh2);
    $diff = substr_count($kh, '"/DokunSayKesir/');
    echo "  OK: $diff path duzeltildi\n\n";
  } else {
    echo "  zaten temiz\n\n";
  }
} else {
  echo "  HATA: $kesirHtml yok\n\n";
}

// =================================================================
// 4) Cache flush
// =================================================================
echo "[4] Cache flush\n";
require "/home/diskalkuli/public_html/wp-load.php";
do_action("litespeed_purge_all");
wp_cache_flush();
if (function_exists("opcache_reset")) opcache_reset();
echo "  Litespeed + WP + OPcache purged\n\n";

// =================================================================
// 5) Verify
// =================================================================
echo "[5] Verify\n";
$c2 = file_get_contents($dkc);
echo "  dk-content.php overflow marker: " . (strpos($c2, "/* Fix Edumall mobil menu") !== false ? "PRESENT" : "MISSING") . "\n";

$apps = ["DokunSayBar","DokunSayBasamak","DokunSayClock","DokunSayKesir","DokunSayTam","Dokunsay-geo","Dokunsay-veri-app"];
foreach ($apps as $app) {
  $jsFiles = glob("$root/$app/assets/index-*.js");
  if (!$jsFiles) { echo "  $app: bundle YOK\n"; continue; }
  $jc = file_get_contents($jsFiles[0]);
  $hasOld = strpos($jc, $old) !== false;
  $hasNew = substr_count($jc, '"/araclar/"');
  echo "  $app: " . ($hasOld ? "ESKI-PATTERN-VAR" : "patched") . " | /araclar/ x$hasNew\n";
}

// Kesir HTML check
$kh3 = @file_get_contents($kesirHtml);
if ($kh3 !== false) {
  $brokenPath = substr_count($kh3, '"/DokunSayKesir/');
  $fixedPath = substr_count($kh3, '"/dokunsay/DokunSayKesir/');
  echo "  Kesir HTML: bozuk path x$brokenPath, fixed path x$fixedPath\n";
}

echo "\nTAMAM - tarayicida Ctrl+Shift+R ile yenile\n";
echo "ONEMLI: Bu dosyayi simdi cPanel'den sil!\n";
