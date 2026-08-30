$SECRET = "dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme";
if (($_GET["s"] ?? "") !== $SECRET) die("F");
require "/home/diskalkuli/public_html/wp-load.php";
$admins = get_users(["role" => "administrator", "number" => 1]);
if (!empty($admins)) wp_set_current_user($admins[0]->ID);

header("Content-Type: text/plain; charset=utf-8");

// 1. Attachment'ı bul (önceki "yilmaz-mutlu" slug)
global $wpdb;
$attach = $wpdb->get_row("SELECT ID, post_name, post_type FROM {$wpdb->posts} WHERE post_name = 'yilmaz-mutlu' LIMIT 1");
echo "Bulunan: ID={$attach->ID} type={$attach->post_type} name={$attach->post_name}\n";

if ($attach && $attach->post_type === 'attachment') {
  // Attachment slug'ını değiştir
  $wpdb->update($wpdb->posts, ['post_name' => 'yilmaz-mutlu-foto'], ['ID' => $attach->ID]);
  echo "Attachment slug → yilmaz-mutlu-foto (ID {$attach->ID})\n";
} elseif ($attach && $attach->post_type === 'page') {
  // Önceden yanlış güncellenen page — Hakkımızda HTML değil ama yilmaz-mutlu içeriği olmalı
  // Bunu attachment'a tekrar dönüştürmeyelim — page olarak doğru olabilir
  echo "Zaten page — devam edilebilir\n";
}

// 2. Yeni page yarat (attachment slug serbest kaldı şimdi)
$ym_b64 = $_POST["ym_b64"] ?? "";
$ym = base64_decode($ym_b64);
if ($ym === false) die("ERR ym_b64");
$ym = str_replace("/wp-content/uploads/yilmaz-mutlu.jpg", "/wp-content/uploads/2026/05/yilmaz-mutlu.jpg", $ym);

// Önce var mı kontrol (page tipinde)
$page = $wpdb->get_row("SELECT ID FROM {$wpdb->posts} WHERE post_name = 'yilmaz-mutlu' AND post_type = 'page' LIMIT 1");
if ($page) {
  wp_update_post(["ID" => $page->ID, "post_content" => $ym]);
  // Elementor data sil
  delete_post_meta($page->ID, "_elementor_data");
  delete_post_meta($page->ID, "_elementor_edit_mode");
  echo "Page güncellendi: ID {$page->ID}\n";
} else {
  $new_id = wp_insert_post([
    "post_title" => "Prof. Dr. Yılmaz Mutlu",
    "post_name" => "yilmaz-mutlu",
    "post_content" => $ym,
    "post_status" => "publish",
    "post_type" => "page",
  ], true);
  echo is_wp_error($new_id) ? "ERR: " . $new_id->get_error_message() : "Yeni page: ID $new_id\n";
}

flush_rewrite_rules(false);
do_action("litespeed_purge_all");
wp_cache_flush();
if (function_exists("opcache_reset")) opcache_reset();
echo "\nTAMAM\n";
