$SECRET = "dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme";
if (($_GET["s"] ?? "") !== $SECRET) die("F");
header("Content-Type: text/plain; charset=utf-8");

// === 1. dk-content.php footer "20 yıllık" → "15 yıllık" ===
echo "[1] dk-content.php footer replace\n";
$dkc = "/home/diskalkuli/public_html/wp-content/mu-plugins/dk-content.php";
$c = file_get_contents($dkc);
$o = $c;

$rules = [
  // Footer brand desc (kullanıcı screenshot'ından)
  "Prof. Dr. Yılmaz Mutlu'nun 20 yıllık akademik araştırmasına dayalı" => "Prof. Dr. Yılmaz Mutlu'nun 15 yıllık akademik araştırmasına dayalı",
  // Diğer "20 yıl" varyantları
  "20 yıllık akademik araştırma" => "15 yıllık akademik araştırma",
  "20+ yıl akademik" => "15+ yıl akademik",
];

foreach ($rules as $old => $new) {
  $n = substr_count($c, $old);
  if ($n > 0) {
    $c = str_replace($old, $new, $c);
    echo "  OK x$n: " . mb_substr($old, 0, 60) . "\n";
  } else {
    echo "  MISS: " . mb_substr($old, 0, 60) . "\n";
  }
}

if ($c !== $o) {
  copy($dkc, $dkc . ".bak-final-" . date("Ymd-His"));
  file_put_contents($dkc, $c);
  echo "  dk-content.php updated: " . strlen($c) . " bytes\n";
} else {
  echo "  no change in dk-content.php\n";
}
echo "\n";

// === 2. araclar template same-tab ===
echo "[2] dk-page-araclar-index.php same-tab versiyonu\n";
$tpl = "/home/diskalkuli/public_html/wp-content/mu-plugins/dk-templates/dk-page-araclar-index.php";
$tc = file_get_contents($tpl);
// target="_blank" rel="noopener" kaldır
$nc = str_replace(' target="_blank" rel="noopener"', '', $tc);
$nc = str_replace(' target="_blank"', '', $nc);
if ($nc !== $tc) {
  copy($tpl, $tpl . ".bak-final-" . date("Ymd-His"));
  file_put_contents($tpl, $nc);
  echo "  template updated: " . strlen($nc) . " bytes (was " . strlen($tc) . ")\n";
} else {
  echo "  template already same-tab\n";
}
echo "\n";

// === 3. Cache flush ===
require "/home/diskalkuli/public_html/wp-load.php";
do_action("litespeed_purge_all");
wp_cache_flush();
if (function_exists("opcache_reset")) opcache_reset();
echo "[3] Cache+OPcache purged\n\n";

// === 4. Verify ===
echo "[4] Verify:\n";
$c2 = file_get_contents($dkc);
echo "  '15 yıllık akademik araştırma' geçişi: " . substr_count($c2, "15 yıllık akademik araştırma") . "\n";
echo "  '20 yıllık akademik araştırma' kalanı: " . substr_count($c2, "20 yıllık akademik araştırma") . "\n";
$tc2 = file_get_contents($tpl);
echo "  araclar target='_blank' kalanı: " . substr_count($tc2, 'target="_blank"') . "\n";
echo "  araclar /dokunsay/ link sayısı: " . substr_count($tc2, '/dokunsay/') . "\n";

echo "\nTAMAM\n";
