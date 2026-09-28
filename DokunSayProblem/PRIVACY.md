# Gizlilik Politikası — DokunSay Problem

**Son Güncelleme:** 2026-09-27

## Kısaca

DokunSay Problem, kullanıcılarından kişisel veri toplamaz, sunucuya göndermez ve üçüncü taraflarla
paylaşmaz. Aracın kendi hesap sistemi yoktur; tüm veriler cihazda kalır.

## Yerel Depolama

Araç, öğrenme ilerlemesini hatırlamak için tarayıcının localStorage alanına yalnız
`dokunsay:problem:*` önekli anahtarlarla şu verileri kaydeder:

- Çözülen problemlerin ve antrenman duraklarının sonuçları (şema bazında doğruluk, hata sınıfları,
  kullanılan ipucu düzeyi, destek düzeyi)
- Öğretmenin yazdığı problemler
- (İsteğe bağlı) Öğrenci rumuzu — yalnız cihazda, sunucuya gitmez

Platform genelindeki ortak tercihler (dil `dk_lang`, erişilebilirlik ayarları `dokunsay:a11y:prefs`)
de aynı cihazda tutulur.

Bu veriler yalnız sizin tarayıcınızda/cihazınızda kalır. Öğretmen panelinden JSON olarak dışa
aktarılabilir; tarayıcı verilerini temizleyerek ya da uygulama içinden sıfırlayarak silebilirsiniz.

## Paylaşım Kodu

Öğretmenin yazdığı bir problem, bağlantıdaki `#p=<kod>` bölümüyle paylaşılır. Kod yalnız problemin
kendisini (şema, sayılar, bağlam, metin) taşır; öğrenci bilgisi içermez. Bağlantının `#` sonrası
kısmı sunucuya gönderilmez.

## Giriş (dokunsay.com)

dokunsay.com'da içerik, platformun ortak NuMap giriş kapısının arkasındadır. Giriş, DokunSay
Problem'in değil platformun işidir; araç giriş bilgisini yalnız ekranda ad göstermek için okuyabilir
ve öğrenci verisini sunucuya göndermez.

## Çerezler

Araç çerez kullanmaz.

## Üçüncü Taraf Hizmetler

- **Web Speech API** (tarayıcı) — sesli okuma; ses tarayıcı ve işletim sisteminin konuşma motoruyla
  cihazda üretilir, araç ağa istek yapmaz.
- **Google Fonts** — Nunito yazı tipi sayfa açılışında Google sunucularından yüklenir (yazı tipi
  isteği; araç Google'a kişisel veri göndermez).

Başka hiçbir üçüncü taraf hizmeti kullanılmaz; analitik ya da reklam yoktur.

## KVKK / GDPR

Araç kişisel veri işlemez; ilerleme verisi yalnız cihazda tutulur.

## İletişim

- **Yazar:** Prof. Dr. Yılmaz Mutlu
- **Platform:** DokunSay Matematik Öğretim Araçları

## Değişiklikler

Bu politika değiştiğinde sürüm tarihi güncellenir. Büyük değişiklikler kullanıcıya uygulama içinde bildirilir.
