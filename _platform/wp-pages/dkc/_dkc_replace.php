<?php
$SECRET = "dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme";
if (($_GET["s"] ?? "") !== $SECRET) { http_response_code(403); die("F"); }
header("Content-Type: text/plain; charset=utf-8");
$dkc = "/home/diskalkuli/public_html/wp-content/mu-plugins/dk-content.php";
$content = file_get_contents($dkc);
$orig = $content;

$replaces = [
  "20 yıllık akademik çalışmasına dayalı bütüncül diskalkuli tanılama ve müdahale platformu" => "15 yıllık akademik birikime dayalı, alanyazına temellenen bütüncül diskalkuli tanılama ve müdahale platformu",
  "<strong>4 dilde</strong>" => "<strong>5 dilde</strong>",
  "Diskalkuli alanında 20+ yıl akademik araştırma" => "Diskalkuli alanında 15+ yıl akademik araştırma",
  '<div class="dkh-trust-num">TR·EN·KU</div><div class="dkh-trust-lbl">Çok dilli destek</div>' => '<div class="dkh-trust-num">5</div><div class="dkh-trust-lbl">Dil · TR/KU/EN/AR/FA</div>',
  '<div class="dkh-trust-num">4.000+</div><div class="dkh-trust-lbl">Saha denemesi</div>' => '<div class="dkh-trust-num">7</div><div class="dkh-trust-lbl">DokunSay aracı</div>',
  "Numap ile 48–96 ay yaş grubuna A1–A11 bataryasıyla bilimsel değerlendirme" => "Numap ile okul öncesinden ilkokul 4. sınıfa (48–119 ay) A1–A11 bataryasıyla bilimsel değerlendirme",
  "48–96 ay yaş grubuna" => "okul öncesinden ilkokul 4. sınıfa kadar (48–119 ay / 4–10 yaş)",
];

$results = [];
foreach ($replaces as $old => $new) {
  $count = substr_count($content, $old);
  if ($count > 0) {
    $content = str_replace($old, $new, $content);
    $results[] = "  '" . mb_substr($old, 0, 60) . "...' → $count change(s)";
  } else {
    $results[] = "  NOT FOUND: '" . mb_substr($old, 0, 60) . "...'";
  }
}

echo "=== Replace results ===\n" . implode("\n", $results) . "\n\n";

if ($content === $orig) {
  echo "NO CHANGES\n";
} else {
  $bak = $dkc . ".bak-" . date("Ymd-His");
  copy($dkc, $bak);
  file_put_contents($dkc, $content);
  if (function_exists("opcache_reset")) opcache_reset();
  echo "OK: " . strlen($content) . " bytes (was " . strlen($orig) . ")\n";
  echo "Backup: " . basename($bak) . "\n";
}
