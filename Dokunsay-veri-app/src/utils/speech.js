// ═══════════════════════════════════════════════════════════════════
// SESLİ OKUMA — platform ortak TTS'ine köprü
//
// Yerel SpeechSynthesisUtterance kopyası kaldırıldı (2026-07-19 platform denetimi).
// Üç kusuru vardı: (1) A11y panelindeki ses aç/kapa anahtarını YOK SAYIYORDU —
// sesi kapatmak bu uygulamada işe yaramıyordu; (2) Kurmancî'yi Türkçe sesle okuyordu
// (artık gerçek ku sesi yoksa sessiz kalınır); (3) hız 0.92 idi, standart 0.85.
// ═══════════════════════════════════════════════════════════════════
export { speak, cancel as stopSpeaking, canSpeak } from '@shared/tts.js';
