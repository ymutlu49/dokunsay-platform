header("Content-Type: text/plain; charset=utf-8");
$dir = "/home/diskalkuli/public_html";
foreach (["_dk_eval.php"] as $f) {
  $p = "$dir/$f";
  if (file_exists($p) && unlink($p)) echo "rm: $f\n";
}
echo "OK\n";
