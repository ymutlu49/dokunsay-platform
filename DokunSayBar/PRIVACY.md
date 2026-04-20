# Gizlilik Politikası — DokunSay Bar

**Son Güncelleme:** 2026-04-20

## Kısaca

DokunSay Bar, kullanıcılarının kişisel verilerini sunucuya göndermez veya üçüncü taraflarla paylaşmaz **varsayılan olarak**. Opsiyonel bulut senkronizasyonu (Firebase) yalnızca açıkça aktif edildiğinde çalışır.

## Yerel Depolama

Uygulama cihazınızın localStorage'ına aşağıdaki verileri kaydeder:

- Tamamladığınız etkinliklerin listesi
- Özel şablonlarınız
- Tercih ayarları (dil, diskalkuli modu, ses açık/kapalı, pen rengi)
- Son canvas durumu (undo/redo için)

Bu veriler sadece sizin cihazınızda kalır. **Ayarlar → Verileri Sıfırla** ile silebilirsiniz.

## İsteğe Bağlı Bulut Senkronizasyonu (Firebase)

Giriş yaparsanız (Firebase Auth — Google/e-posta):
- Kullanıcı hesap bilgileri Firebase Authentication'da saklanır
- Özel şablonlar ve ilerleme Firestore'a senkronize edilir
- Çıkış yaparak herhangi bir zamanda bu senkronizasyonu durdurabilirsiniz

**Giriş yapmadığınız sürece** hiçbir veri cihazınızdan ayrılmaz.

## Mobil İzinler (Capacitor Android/iOS)

Capacitor tabanlı mobil sürüm aşağıdaki izinleri isteyebilir:

- **Kamera** — AR (artırılmış gerçeklik) modu için. İzin verilmediğinde AR devre dışı kalır.
- **Depolama** — PNG export için (çalışmanızı resim olarak kaydetme).

İzinler kullanıcı onayı olmadan etkinleşmez ve Ayarlar'dan kapatılabilir.

## Üçüncü Taraf Hizmetler

- **Firebase** (Google) — yalnızca giriş yaparsanız: [Firebase Gizlilik Politikası](https://firebase.google.com/support/privacy)
- **Web Speech API** (tarayıcı) — sesli okuma; tarayıcı tarafından sağlanır, ağa istek yapmaz

## Çerezler

Uygulama çerez kullanmaz.

## KVKK / GDPR

Yerel kullanımda hiçbir kişisel veri toplanmaz. Firebase kullanımınız için Google'ın KVKK/GDPR uyumu geçerlidir.

## İletişim

- **Yazar:** Prof. Dr. Yılmaz Mutlu
- **Platform:** DokunSay Matematik Öğretim Araçları

## Değişiklikler

Bu politika değiştiğinde tarih güncellenir. Büyük değişiklikler uygulama içinde bildirilir.
