// ══════════════════════════════════════════════════════════════
// SESLİ ANLATIM (TTS) — platform ortak modülüne köprü
//
// Kaynaklar: Apostolidou (2025) — multisensör girdisi diskalkuli için kritik;
//            TouchMath — işitsel kanal bilişsel yükü azaltır.
//
// 2026-07-19 PLATFORM DENETİMİ — burada kapatılan üç kusur:
//  1) İKİNCİ, KOPUK SES ANAHTARI: bu modülün kendi `enabled` bayrağı vardı ve platformun
//     A11y panelindeki anahtardan bağımsızdı → iki şalter, tutarsız davranış. Artık
//     `enabled` doğrudan platform bayrağına yazıp okuyan bir vekildir (tek kaynak).
//  2) KURMANCÎ TÜRKÇE SESLE OKUNUYORDU ("fonetik yakınlık" gerekçesiyle). Karar
//     değişti (kullanıcı, 2026-07-19): gerçek ku/kmr sesi yoksa SESSİZ kalınır —
//     yaklaşık telaffuz, sistematik olarak yanlış bir model öğretiyor. SayKent'te de
//     aynı ilke geçerli; iki proje hizalandı.
//  3) HIZ 0.95 İDİ, standart 0.85 (STANDARDS.md §1.4).
// Ayrıca ortak modül matematik gösterimini sözcüğe açar ve emojiyi ayıklar.
// ══════════════════════════════════════════════════════════════
import {
  speak as platformSpeak,
  cancel as platformCancel,
  isSupported,
  isTTSEnabled,
  setTTSEnabled,
  canSpeak,
} from '@shared/tts.js';

export const TTS = {
  /** Platform ses anahtarının vekili — ayrı bir bayrak TUTULMAZ (tek kaynak). */
  get enabled() { return isTTSEnabled(); },
  set enabled(on) { setTTSEnabled(on); },

  speak(text, lang) {
    platformSpeak(text, lang);
  },
  stop() {
    platformCancel();
  },
  isAvailable() {
    return isSupported();
  },
  /** Bu dilde okuma yapılabilir mi? 🔊 düğmelerini buna göre gizle. */
  canSpeak,
};
