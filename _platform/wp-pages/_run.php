<?php
/**
 * Geçici sayfa güncelleyici — diskalkuli.com için tek seferlik script.
 *
 * Yüklenecek yer: /home/diskalkuli/public_html/_dk_updates/_run.php
 * Aynı dizinde HTML dosyaları olmalı (anasayfa-fixed.html, ebeveynler-fixed.html, vb.)
 * + assets/yilmaz-mutlu.jpg
 *
 * Tarayıcıdan çağrı: https://diskalkuli.com/_dk_updates/_run.php?go=1&secret=KOY-BURAYA
 *
 * Çalıştıktan sonra dizini elle silin (cPanel File Manager).
 *
 * KORUMA: Belirsiz bir secret olmadan çalışmaz; query string'de ?go=1&secret=... gerekir.
 * IP guard yok (sahip cPanel sahibi olarak çalışacak), ama secret yeterli güvenlik.
 */

// === KORUMA ===
$SECRET = 'dk-update-2026-05-02-yilmaz-mutlu-sayfa-guncelleme'; // tahmin edilemeyecek bir string
if (!isset($_GET['go']) || $_GET['go'] !== '1') {
  http_response_code(403);
  die('Forbidden — go param required.');
}
if (!isset($_GET['secret']) || !hash_equals($SECRET, $_GET['secret'])) {
  http_response_code(403);
  die('Forbidden — invalid secret.');
}

// === BOOTSTRAP WORDPRESS ===
$wp_load = '/home/diskalkuli/public_html/wp-load.php';
if (!file_exists($wp_load)) die('wp-load.php bulunamadı: ' . $wp_load);
require $wp_load;

// CLI bypass nedeniyle bazı plugins admin context bekleyebilir
if (function_exists('wp_set_current_user')) {
  // İlk admin user'ı bul ve current user yap (post update için kapability kontrolü)
  $admins = get_users(['role' => 'administrator', 'number' => 1]);
  if (!empty($admins)) {
    wp_set_current_user($admins[0]->ID);
  }
}

header('Content-Type: text/plain; charset=utf-8');

echo "=== Diskalkuli.com güncelleme scripti ===\n";
echo "Tarih: " . date('Y-m-d H:i:s') . "\n";
echo "WordPress: " . get_bloginfo('version') . "\n";
echo "Site URL: " . get_site_url() . "\n\n";

// === ADMIN USER INFO ===
$admins = get_users(['role' => 'administrator']);
echo "Admin kullanıcı sayısı: " . count($admins) . "\n";
foreach ($admins as $a) {
  echo "  - {$a->user_login} (ID: {$a->ID}, email: {$a->user_email})\n";
}
echo "\n";

// === SAYFA GÜNCELLEMELERİ ===
$dir = __DIR__;

// slug => [dosya adı, başlık (yeni sayfa için)]
$pages_to_update = [
  'diskalkuli-nedir'    => ['diskalkuli-nedir-fixed.html', 'Diskalkuli Nedir?'],
  'ebeveynler'          => ['ebeveynler-fixed.html', 'Ebeveynler'],
  'ogretmenler'         => ['ogretmenler-fixed.html', 'Öğretmenler'],
  'araclar'             => ['araclar-fixed.html', 'DokunSay Araçları'],
  'hakkimizda'          => ['hakkimizda-fixed.html', 'Hakkımızda'],
];

// === ÖZEL: Anasayfa (slug yok, front_page olarak ayarlı) ===
$front_page_id = (int) get_option('page_on_front');
if ($front_page_id > 0) {
  echo "🏠 ANASAYFA (ID: $front_page_id)\n";
  $f = $dir . '/anasayfa-fixed.html';
  if (file_exists($f)) {
    $html = file_get_contents($f);
    // <!-- yorum --> bloklarını kaldır (üstteki açıklama yorumu)
    $html = preg_replace('/^<!--[\s\S]*?-->\s*/', '', $html);

    $result = wp_update_post([
      'ID' => $front_page_id,
      'post_content' => $html,
    ], true);

    if (is_wp_error($result)) {
      echo "  ❌ HATA: " . $result->get_error_message() . "\n";
    } else {
      echo "  ✅ Güncellendi (post ID: $result, içerik: " . strlen($html) . " karakter)\n";
    }
  } else {
    echo "  ⚠ Dosya bulunamadı: $f\n";
  }
  echo "\n";
}

// === STANDART SAYFALAR ===
foreach ($pages_to_update as $slug => $info) {
  list($filename, $title) = $info;
  echo "📄 $slug\n";

  $file_path = $dir . '/' . $filename;
  if (!file_exists($file_path)) {
    echo "  ⚠ Dosya bulunamadı: $file_path\n\n";
    continue;
  }
  $html = file_get_contents($file_path);
  // Üstteki <!-- yorum --> bloğunu kaldır
  $html = preg_replace('/^<!--[\s\S]*?-->\s*/', '', $html);

  $page = get_page_by_path($slug);
  if (!$page) {
    echo "  ⚠ Sayfa bulunamadı, oluşturulacak…\n";
    $new_id = wp_insert_post([
      'post_title' => $title,
      'post_name' => $slug,
      'post_content' => $html,
      'post_status' => 'publish',
      'post_type' => 'page',
    ], true);
    if (is_wp_error($new_id)) {
      echo "  ❌ Oluşturma hatası: " . $new_id->get_error_message() . "\n";
    } else {
      echo "  ✅ Yeni sayfa oluşturuldu (ID: $new_id)\n";
    }
  } else {
    $result = wp_update_post([
      'ID' => $page->ID,
      'post_content' => $html,
    ], true);
    if (is_wp_error($result)) {
      echo "  ❌ HATA: " . $result->get_error_message() . "\n";
    } else {
      echo "  ✅ Güncellendi (ID: {$page->ID}, içerik: " . strlen($html) . " karakter)\n";
    }
  }
  echo "\n";
}

// === YİLMAZ MUTLU SAYFASI (yeni — slug: yilmaz-mutlu) ===
echo "👤 yilmaz-mutlu (yeni sayfa)\n";
$f = $dir . '/yilmaz-mutlu.html';
if (file_exists($f)) {
  $html = file_get_contents($f);
  $html = preg_replace('/^<!--[\s\S]*?-->\s*/', '', $html);

  $existing = get_page_by_path('yilmaz-mutlu');
  if ($existing) {
    $result = wp_update_post([
      'ID' => $existing->ID,
      'post_content' => $html,
    ], true);
    echo "  ✅ Mevcut sayfa güncellendi (ID: {$existing->ID})\n";
  } else {
    $new_id = wp_insert_post([
      'post_title' => 'Prof. Dr. Yılmaz Mutlu',
      'post_name' => 'yilmaz-mutlu',
      'post_content' => $html,
      'post_status' => 'publish',
      'post_type' => 'page',
    ], true);
    if (is_wp_error($new_id)) {
      echo "  ❌ Oluşturma hatası: " . $new_id->get_error_message() . "\n";
    } else {
      echo "  ✅ Yeni sayfa oluşturuldu (ID: $new_id, slug: yilmaz-mutlu)\n";
    }
  }
} else {
  echo "  ⚠ Dosya bulunamadı: $f\n";
}
echo "\n";

// === RESİM YÜKLEME — yilmaz-mutlu.jpg ===
echo "🖼  yilmaz-mutlu.jpg medya kütüphanesine yükleniyor…\n";
$img_src = $dir . '/assets/yilmaz-mutlu.jpg';
if (file_exists($img_src)) {
  $upload_dir = wp_upload_dir();
  $target_filename = 'yilmaz-mutlu.jpg';
  $target_path = $upload_dir['path'] . '/' . $target_filename;
  $target_url = $upload_dir['url'] . '/' . $target_filename;

  // Dosyayı kopyala
  if (copy($img_src, $target_path)) {
    echo "  ✅ Dosya kopyalandı: $target_path\n";

    // Attachment kaydı zaten var mı kontrol et
    $existing_attach = get_page_by_title('yilmaz-mutlu', OBJECT, 'attachment');

    if (!$existing_attach) {
      // Yeni attachment kaydet
      $attachment = [
        'guid'           => $target_url,
        'post_mime_type' => 'image/jpeg',
        'post_title'     => 'Yılmaz Mutlu',
        'post_content'   => '',
        'post_status'    => 'inherit',
      ];
      $attach_id = wp_insert_attachment($attachment, $target_path);
      require_once ABSPATH . 'wp-admin/includes/image.php';
      $attach_data = wp_generate_attachment_metadata($attach_id, $target_path);
      wp_update_attachment_metadata($attach_id, $attach_data);
      echo "  ✅ Attachment oluşturuldu (ID: $attach_id)\n";
      echo "  🔗 URL: $target_url\n";
    } else {
      echo "  ℹ Attachment zaten var: ID {$existing_attach->ID}\n";
      $target_url = wp_get_attachment_url($existing_attach->ID);
      echo "  🔗 URL: $target_url\n";
    }

    // Sayfa içeriklerinde /wp-content/uploads/yilmaz-mutlu.jpg yer tutucusunu gerçek URL ile değiştir
    echo "\n  🔁 Sayfalardaki foto yolu güncelleniyor…\n";
    $placeholder = '/wp-content/uploads/yilmaz-mutlu.jpg';
    $real_url_relative = str_replace(get_site_url(), '', $target_url);

    if ($placeholder !== $real_url_relative) {
      $pages_with_photo = ['hakkimizda', 'yilmaz-mutlu'];
      foreach ($pages_with_photo as $slug) {
        $p = get_page_by_path($slug);
        if ($p && strpos($p->post_content, $placeholder) !== false) {
          $new_content = str_replace($placeholder, $real_url_relative, $p->post_content);
          wp_update_post(['ID' => $p->ID, 'post_content' => $new_content]);
          echo "    ✅ $slug → '$placeholder' → '$real_url_relative'\n";
        } else {
          echo "    ℹ $slug → yer tutucu bulunamadı (zaten güncel?)\n";
        }
      }
    } else {
      echo "  ℹ Yer tutucu zaten doğru (değişiklik yok)\n";
    }
  } else {
    echo "  ❌ Dosya kopyalanamadı (yetki sorunu olabilir)\n";
  }
} else {
  echo "  ⚠ Resim bulunamadı: $img_src\n";
}

echo "\n=== TAMAMLANDI ===\n";
echo "ÖNEMLİ: Bu script'i ve _dk_updates/ dizinini cPanel'den şimdi silin.\n";
