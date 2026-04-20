# Gizlilik Politikası — DokunSay Veri

**Son Güncelleme:** 2026-04-20

## Kısaca

DokunSay Veri, kullanıcılarından hiçbir kişisel veri toplamaz, sunucuya göndermez veya üçüncü taraflarla paylaşmaz. Uygulama tamamen çevrimdışı çalışır.

## Yerel Depolama

Uygulama cihazınızın localStorage'ına aşağıdaki verileri kaydeder:

- Öğrenci profili (ad, yaş — tamamen opsiyonel ve yalnızca cihazda)
- Tanılama testi (ön test / son test) sonuçları
- Curcio seviye ilerleme kaydı (L0-L3)
- Her etkinliğin tamamlanma durumu
- Tercih ayarları (dil, diskalkuli modu %35 font, renk körü, TTS, Notice-Wonder modu)

Bu veriler yalnızca sizin cihazınızda kalır.

## Sınıf Anketi (Collect Modülü)

"Collect" modülünde sınıf içi anket yaparken toplanan veriler yalnızca cihazınızda saklanır ve öğretmenin kontrolündedir. Herhangi bir sunucuya gönderilmez.

## Öğretmen Dashboard

Öğretmen modülü öğrenci raporlarını localStorage'dan okur. Dışa aktarma işlemi yerel bir JSON/CSV dosyası oluşturur.

## Üçüncü Taraf Hizmetler

- **Web Speech API** (tarayıcı) — sesli okuma; tarayıcı tarafından sağlanır, ağa istek yapmaz.
- **Görüntülenen gerçek veriler** (TÜİK, MGM, WHO) — uygulama içinde statik olarak bulunur, kullanım sırasında ağa istek yapılmaz.

Başka hiçbir üçüncü taraf hizmeti kullanılmaz.

## Çerezler

Uygulama çerez kullanmaz.

## KVKK / GDPR

Yerel kullanımda hiçbir kişisel veri toplanmaz. Öğrenci profili adı yalnızca ekranda gösterim için kullanılır, şifrelenmez (hassas değildir — genellikle sadece isim).

## İletişim

- **Yazar:** Prof. Dr. Yılmaz Mutlu
- **Platform:** DokunSay Matematik Öğretim Araçları
