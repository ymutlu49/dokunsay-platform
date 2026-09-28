/**
 * Seslendirme — YALNIZ `@shared/tts.js` (STANDARDS §1.4.1). Bu dosya yerel
 * SpeechSynthesisUtterance OLUŞTURMAZ; yalnız ortak API'yi yeniden ihraç eder ve
 * "cümle cümle okuma" için okuma durumunu SORGULAR (speechSynthesis.speaking).
 */
import { speak as sharedSpeak, cancel, canSpeak, toSpeech, isTTSEnabled } from '@shared/tts.js';
import type { Lang } from '../content/types';

export { cancel, canSpeak, toSpeech };

export function speak(text: string, lang: Lang): void {
  if (!text) return;
  sharedSpeak(text, lang);
}

/** Konuşma sürüyor mu? (ortak motorun başlattığı konuşmayı yalnız okur). */
export function isSpeaking(): boolean {
  try {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking;
  } catch {
    return false;
  }
}

/** Seslendirme bu dilde yapılabilir ve açık mı? (🔊 düğmelerini gizlemek için) */
export function voiceOn(lang: Lang): boolean {
  return canSpeak(lang) && isTTSEnabled();
}

/**
 * Cümleleri SIRAYLA okur; her cümle başlarken `onIndex(i)` çağrılır (vurgulama için).
 * Dönen işlev okumayı durdurur. Ortak `speak` her çağrıda önce `cancel()` ettiği için
 * bir cümle bitmeden ötekine geçilmez: bitişi `speechSynthesis.speaking` ile yoklarız.
 */
export function speakSequence(
  parts: string[],
  lang: Lang,
  onIndex: (i: number) => void,
  onDone: () => void,
): () => void {
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const run = (i: number) => {
    if (stopped) return;
    if (i >= parts.length) {
      onDone();
      return;
    }
    onIndex(i);
    speak(parts[i], lang);
    const started = Date.now();
    const poll = () => {
      if (stopped) return;
      // İlk 400 ms motorun başlaması için beklenir; sonra konuşma bitince sıradakine.
      if (Date.now() - started < 400 || isSpeaking()) {
        timer = setTimeout(poll, 150);
      } else {
        timer = setTimeout(() => run(i + 1), 250);
      }
    };
    timer = setTimeout(poll, 150);
  };
  run(0);
  return () => {
    stopped = true;
    if (timer) clearTimeout(timer);
    cancel();
    onDone();
  };
}
