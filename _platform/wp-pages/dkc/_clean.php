$SECRET = "dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme";
if (($_GET["s"] ?? "") !== $SECRET) die("F");
header("Content-Type: text/plain; charset=utf-8");
$files = ["_dkh.php", "_dk_tmpl.php", "_dkt.php", "_dk_eval.php"];
$dir = "/home/diskalkuli/public_html";
$count = 0;
foreach ($files as $f) {
  $p = "$dir/$f";
  if (file_exists($p) && unlink($p)) { echo "rm: $f\n"; $count++; }
}
echo "\nTotal removed: $count\n";
echo "Note: dk-content.php.bak-* files kept in mu-plugins/ for safety\n";
