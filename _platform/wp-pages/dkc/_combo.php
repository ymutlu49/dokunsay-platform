$SECRET = "dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme";
if (($_GET["s"] ?? "") !== $SECRET) die("F");
require "/home/diskalkuli/public_html/wp-load.php";
$admins = get_users(["role" => "administrator", "number" => 1]);
if (!empty($admins)) wp_set_current_user($admins[0]->ID);

header("Content-Type: text/plain; charset=utf-8");
echo "=== Combo: Hakkımızda + Yılmaz Mutlu + Anasayfa Elementor ===\n\n";

// === 1. Hakkımızda Elementor data sil + post_content yeni ===
echo "[1] Hakkımızda (1326)\n";
$pid = 1326;
$elem = get_post_meta($pid, "_elementor_data", true);
if ($elem) {
  update_post_meta($pid, "_elementor_data_bak2", $elem);
  update_post_meta($pid, "_elementor_edit_mode_bak2", get_post_meta($pid, "_elementor_edit_mode", true));
  delete_post_meta($pid, "_elementor_data");
  delete_post_meta($pid, "_elementor_edit_mode");
  delete_post_meta($pid, "_elementor_template_type");
  delete_post_meta($pid, "_elementor_version");
  delete_post_meta($pid, "_elementor_pro_version");
  delete_post_meta($pid, "_elementor_page_assets");
  delete_post_meta($pid, "_elementor_css");
  delete_post_meta($pid, "_elementor_controls_usage");
  echo "  Elementor data yedeklendi (" . strlen($elem) . " bytes) ve silindi\n";
}

// Yeni post_content (b64 encoded — POST'tan gelecek)
$hk_b64 = $_POST["hk_b64"] ?? "";
$hk_html = base64_decode($hk_b64);
if ($hk_html === false) die("ERR hk_b64");

// Yer tutucu yolu gerçek URL ile değiştir
$attach_url = "/wp-content/uploads/2026/05/yilmaz-mutlu.jpg";
$hk_html = str_replace("/wp-content/uploads/yilmaz-mutlu.jpg", $attach_url, $hk_html);

$r = wp_update_post(["ID" => $pid, "post_content" => $hk_html], true);
clean_post_cache($pid);
echo "  post_content: " . (is_wp_error($r) ? "ERR " . $r->get_error_message() : "OK len=" . strlen($hk_html)) . "\n\n";

// === 2. Yılmaz Mutlu yeni page ===
echo "[2] /yilmaz-mutlu/ page\n";
$ym_b64 = $_POST["ym_b64"] ?? "";
$ym_html = base64_decode($ym_b64);
if ($ym_html === false) die("ERR ym_b64");
$ym_html = str_replace("/wp-content/uploads/yilmaz-mutlu.jpg", $attach_url, $ym_html);

$existing = get_page_by_path("yilmaz-mutlu");
if ($existing) {
  // Update + Elementor data sil
  delete_post_meta($existing->ID, "_elementor_data");
  delete_post_meta($existing->ID, "_elementor_edit_mode");
  wp_update_post(["ID" => $existing->ID, "post_content" => $ym_html]);
  echo "  Mevcut sayfa güncellendi (ID " . $existing->ID . ")\n";
} else {
  $new_id = wp_insert_post([
    "post_title" => "Prof. Dr. Yılmaz Mutlu",
    "post_name" => "yilmaz-mutlu",
    "post_content" => $ym_html,
    "post_status" => "publish",
    "post_type" => "page",
  ], true);
  if (is_wp_error($new_id)) {
    echo "  ERR: " . $new_id->get_error_message() . "\n";
  } else {
    echo "  Yeni sayfa: ID $new_id\n";
  }
}
echo "\n";

// === 3. Anasayfa (6294) Elementor data sil — bizim hero görünsün diye ===
echo "[3] Anasayfa (6294) Elementor data sil\n";
$pid2 = 6294;
$elem2 = get_post_meta($pid2, "_elementor_data", true);
if ($elem2) {
  update_post_meta($pid2, "_elementor_data_bak2", $elem2);
  update_post_meta($pid2, "_elementor_edit_mode_bak2", get_post_meta($pid2, "_elementor_edit_mode", true));
  delete_post_meta($pid2, "_elementor_data");
  delete_post_meta($pid2, "_elementor_edit_mode");
  delete_post_meta($pid2, "_elementor_template_type");
  delete_post_meta($pid2, "_elementor_version");
  delete_post_meta($pid2, "_elementor_pro_version");
  delete_post_meta($pid2, "_elementor_page_assets");
  delete_post_meta($pid2, "_elementor_css");
  delete_post_meta($pid2, "_elementor_controls_usage");
  // post_content boş yap → dk-content.php'nin homepage_sections_html() inject etsin
  wp_update_post(["ID" => $pid2, "post_content" => ""]);
  clean_post_cache($pid2);
  echo "  Elementor yedeklendi+silindi (" . strlen($elem2) . " bytes), post_content boşlatıldı (dk-content.php'nin homepage filter'ı çalışacak)\n";
}

flush_rewrite_rules(false);
do_action("litespeed_purge_all");
wp_cache_flush();
if (function_exists("opcache_reset")) opcache_reset();
echo "\nCache+rewrite flushed. TAMAM.\n";
