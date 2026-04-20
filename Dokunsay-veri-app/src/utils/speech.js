// ═══════════════════════════════════════════════════════════════════
// WEB SPEECH API — gerçek TTS
// ═══════════════════════════════════════════════════════════════════
export function speak(text, lang) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang === "en" ? "en-US" : lang === "ku" ? "tr-TR" : "tr-TR";
    utt.rate = 0.92;
    utt.pitch = 1.0;
    utt.volume = 1.0;
    window.speechSynthesis.speak(utt);
  } catch (e) {
    // sessizce geç
  }
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
}
