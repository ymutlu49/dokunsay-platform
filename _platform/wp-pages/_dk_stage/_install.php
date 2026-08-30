<?php
/**
 * Diskalkuli kurulum betiği — tek seferlik.
 * URL: https://diskalkuli.com/_dk_updates/_install.php?s=dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme
 *
 * İşlevler:
 *  1) dk-override.php → wp-content/mu-plugins/  (virtual sayfalar render)
 *  2) hakkimizda-fixed.html → WP page 1326 update
 *  3) yilmaz-mutlu.jpg → medya kütüphanesi + URL replace
 *  4) static/platform/* → /platform/  (statik HTML+locale yedekleme ile)
 *  5) static/dokunsay/DokunSayKesir/* → /dokunsay/DokunSayKesir/
 *  6) WP rewrite rules flush
 */

$SECRET = "dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme";
if (($_GET["s"] ?? "") !== $SECRET) { http_response_code(403); die("Forbidden"); }

require "/home/diskalkuli/public_html/wp-load.php";
$admins = get_users(["role" => "administrator", "number" => 1]);
if (!empty($admins)) wp_set_current_user($admins[0]->ID);

header("Content-Type: text/plain; charset=utf-8");
echo "=== Diskalkuli kurulum — " . date("Y-m-d H:i:s") . " ===\n\n";
$dir = __DIR__;

/* === 1. mu-plugin === */
echo "[1] mu-plugin yerleştirme\n";
$mu_dst = "/home/diskalkuli/public_html/wp-content/mu-plugins/dk-override.php";
if (copy("$dir/dk-override.php", $mu_dst)) {
  echo "  OK: $mu_dst (" . filesize($mu_dst) . " bytes)\n";
} else {
  echo "  ERR: copy failed\n";
}
echo "\n";

/* === 2. Hakkımızda WP page === */
echo "[2] Hakkımızda (page 1326) güncelleme\n";
$html = file_get_contents("$dir/hakkimizda-fixed.html");
$html = preg_replace('/^<!--[\s\S]*?-->\s*/', '', $html);
$r = wp_update_post(["ID" => 1326, "post_content" => $html], true);
echo is_wp_error($r) ? "  ERR: " . $r->get_error_message() . "\n" : "  OK: ID 1326, len=" . strlen($html) . "\n";
echo "\n";

/* === 3. Foto medya === */
echo "[3] Foto yükleme (yilmaz-mutlu.jpg)\n";
$upload = wp_upload_dir();
$img_dst = $upload["path"] . "/yilmaz-mutlu.jpg";
copy("$dir/yilmaz-mutlu.jpg", $img_dst);
echo "  Dosya: $img_dst\n";

$existing = get_posts(["post_type" => "attachment", "name" => "yilmaz-mutlu", "posts_per_page" => 1]);
if (!empty($existing)) {
  $attach_id = $existing[0]->ID;
  echo "  Attachment zaten var: ID $attach_id\n";
} else {
  $attach_id = wp_insert_attachment([
    "guid" => $upload["url"] . "/yilmaz-mutlu.jpg", "post_mime_type" => "image/jpeg",
    "post_title" => "Yilmaz Mutlu", "post_content" => "",
    "post_status" => "inherit", "post_name" => "yilmaz-mutlu",
  ], $img_dst);
  require_once ABSPATH . "wp-admin/includes/image.php";
  wp_update_attachment_metadata($attach_id, wp_generate_attachment_metadata($attach_id, $img_dst));
  echo "  Attachment yaratıldı: ID $attach_id\n";
}
$real_url = wp_get_attachment_url($attach_id);
$real_path = str_replace(get_site_url(), "", $real_url);
echo "  URL: $real_url\n";

/* Hakkımızda içinde yer tutucu replace */
$placeholder = "/wp-content/uploads/yilmaz-mutlu.jpg";
if ($placeholder !== $real_path) {
  $p = get_post(1326);
  if ($p && strpos($p->post_content, $placeholder) !== false) {
    wp_update_post(["ID" => 1326, "post_content" => str_replace($placeholder, $real_path, $p->post_content)]);
    echo "  hakkımızda: yer tutucu → $real_path\n";
  }
  /* mu-plugin runtime için ek seçenek: option olarak kaydet, mu-plugin oradan okur */
  update_option('dk_yilmaz_photo_url', $real_path, true);
  echo "  option dk_yilmaz_photo_url = $real_path (mu-plugin runtime kullanır)\n";
}
echo "\n";

/* === 4. Statik /platform/ === */
echo "[4] /platform/ statik dosyalar\n";
$pf_src = "$dir/static/platform";
$pf_dst = "/home/diskalkuli/public_html/platform";
$copied = 0;
foreach (["index.html", "numap.html"] as $f) {
  $s = "$pf_src/$f"; $d = "$pf_dst/$f";
  if (file_exists($s)) {
    if (file_exists($d)) @copy($d, "$d.bak");
    if (copy($s, $d)) { echo "  OK: $d\n"; $copied++; }
    else echo "  ERR: $d\n";
  }
}
foreach (["tr.json", "en.json", "ku.json"] as $f) {
  $s = "$pf_src/locales/$f"; $d = "$pf_dst/locales/$f";
  if (file_exists($s)) {
    if (file_exists($d)) @copy($d, "$d.bak");
    if (copy($s, $d)) { echo "  OK: $d\n"; $copied++; }
    else echo "  ERR: $d\n";
  }
}
echo "  toplam: $copied dosya\n\n";

/* === 5. Kesir dist === */
echo "[5] DokunSayKesir/dist/ kopyalama\n";
$kr_src = "$dir/static/dokunsay/DokunSayKesir";
$kr_dst = "/home/diskalkuli/public_html/dokunsay/DokunSayKesir";

function recurse_copy($src, $dst) {
  if (!is_dir($src)) return 0;
  if (!is_dir($dst)) @mkdir($dst, 0755, true);
  $count = 0;
  foreach (scandir($src) as $f) {
    if ($f === "." || $f === "..") continue;
    $s = "$src/$f"; $d = "$dst/$f";
    if (is_dir($s)) $count += recurse_copy($s, $d);
    else { if (copy($s, $d)) $count++; }
  }
  return $count;
}

if (is_dir($kr_src)) {
  $n = recurse_copy($kr_src, $kr_dst);
  echo "  OK: $n dosya kopyalandı → $kr_dst\n";
} else {
  echo "  WARN: $kr_src yok\n";
}
echo "\n";

/* === 6. Rewrite flush === */
echo "[6] Rewrite rules flush\n";
flush_rewrite_rules(false);
echo "  OK\n\n";

echo "=== TAMAM ===\n";
echo "Doğrulama URL'leri:\n";
echo "  https://diskalkuli.com/                  (Anasayfa — yeni hero, 15 yıl, 5 dilde)\n";
echo "  https://diskalkuli.com/diskalkuli-nedir/ (akademik rehber + kaynakça)\n";
echo "  https://diskalkuli.com/ebeveynler/       (gözlem temelli yaklaşım)\n";
echo "  https://diskalkuli.com/ogretmenler/      (RTI 3-katmanlı model)\n";
echo "  https://diskalkuli.com/araclar/          (pedagojik müfredat sırası)\n";
echo "  https://diskalkuli.com/hakkimizda/       (teal tema)\n";
echo "  https://diskalkuli.com/yilmaz-mutlu/     (akademik profil)\n";
echo "  https://diskalkuli.com/platform/         (indigo tema)\n";
echo "  https://diskalkuli.com/platform/numap.html (48-119 ay metni)\n";
echo "\n";
echo "Bu kurulum dizinini şimdi silin: $dir\n";
echo "(cPanel File Manager'dan public_html/_dk_updates/ → Sil)\n";
