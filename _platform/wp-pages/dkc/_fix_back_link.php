<?php
$SECRET = "dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme";
if (($_GET["s"] ?? "") !== $SECRET) die("F");
header("Content-Type: text/plain; charset=utf-8");

// Tum DokunSay app bundle'larinda "Menuye Don" linkini /araclar/'a yonlendir.
// Live build'lerde su pattern var:
//   try{return new URL("..",window.location.href).pathname}catch{return"../"}
// Bu /dokunsay/<App>/ -> /dokunsay/ veriyor (launcher). Biz /araclar/ istiyoruz.

$root = "/home/diskalkuli/public_html/dokunsay";
if (!is_dir($root)) die("dokunsay root yok: $root\n");

$old = 'new URL("..",window.location.href).pathname';
$new = '"/araclar/"';

$total_files = 0;
$changed = 0;
$skipped = 0;

$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, RecursiveDirectoryIterator::SKIP_DOTS));
foreach ($it as $f) {
  if (!$f->isFile()) continue;
  $path = $f->getPathname();
  if (substr($path, -3) !== ".js") continue;
  $total_files++;

  $c = file_get_contents($path);
  $n = substr_count($c, $old);
  if ($n === 0) { $skipped++; continue; }

  $rel = str_replace($root . "/", "", $path);
  $c2 = str_replace($old, $new, $c);
  copy($path, $path . ".bak-back-" . date("Ymd-His"));
  file_put_contents($path, $c2);
  echo "  OK x$n: $rel\n";
  $changed++;
}

echo "\nTOPLAM: $total_files .js dosyasi, $changed degisti, $skipped temiz/eslesme yok\n";

// === EK: Kesir index.html bozuk base path ===
echo "\n[Kesir HTML base path duzeltme]\n";
$kesirHtml = "$root/DokunSayKesir/index.html";
if (file_exists($kesirHtml)) {
  $kh = file_get_contents($kesirHtml);
  $kh2 = str_replace('"/DokunSayKesir/', '"/dokunsay/DokunSayKesir/', $kh);
  if ($kh !== $kh2) {
    copy($kesirHtml, $kesirHtml . ".bak-back-" . date("Ymd-His"));
    file_put_contents($kesirHtml, $kh2);
    echo "  OK: Kesir index.html fixed\n";
  } else {
    echo "  zaten temiz\n";
  }
} else {
  echo "  Kesir index.html yok\n";
}

// Cache flush
require "/home/diskalkuli/public_html/wp-load.php";
do_action("litespeed_purge_all");
wp_cache_flush();
if (function_exists("opcache_reset")) opcache_reset();
echo "\nCache+OPcache purged\n";

// Verify across apps
echo "\nVerify (her app'in ana JS bundle'inda /araclar/ var mi):\n";
$apps = glob("$root/*", GLOB_ONLYDIR);
foreach ($apps as $appDir) {
  $appName = basename($appDir);
  $jsFiles = glob("$appDir/assets/index-*.js");
  if (!$jsFiles) { echo "  $appName: bundle yok\n"; continue; }
  foreach ($jsFiles as $jf) {
    $jc = file_get_contents($jf);
    $hasOld = strpos($jc, $old) !== false ? "OLD-PATTERN-VAR" : "ok";
    $hasNew = substr_count($jc, '"/araclar/"');
    echo "  $appName/" . basename($jf) . ": $hasOld | /araclar/ x$hasNew\n";
  }
}

echo "\nTAMAM\n";
