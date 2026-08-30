/**
 * DokunSay Platform — Ortak Seslendirme Düğmesi (SpeakButton)
 *
 * NEDEN VAR (2026-07-19 platform denetimi): 🔊 düğmeleri altı uygulamada 18 ayrı yerde
 * elle yazılmıştı; her biri kendi `onClick`'inde kendi speak çağrısını yapıyordu. Bu yüzden
 * seslendirme politikası değiştiğinde 18 yeri tek tek düzeltmek gerekiyordu.
 *
 * DÜĞMENİN GİZLENMESİ ÖNEMLİ: Kurmancî'de gerçek ku/kmr sesi yoksa artık SESSİZ kalınıyor
 * (Türkçe sesle Kurmancî okumak yanlış telaffuz modeli öğretir). Böyle bir durumda düğmeyi
 * EKRANDA BIRAKMAK daha kötüdür: basıldığında hiçbir şey olmayan düğme, çocuğa/öğretmene
 * "sesim kapalı" değil "uygulama bozuk" dedirtir. Bu bileşen dili kendi denetler ve
 * okuma yapılamıyorsa kendini hiç çizmez.
 *
 * Kullanım:
 *   import { SpeakButton } from '@shared/SpeakButton.jsx';
 *   <SpeakButton text={okunus} lang={lang} />
 *   <SpeakButton text={() => hesaplaMetin()} lang={lang} size={38} />   // tembel metin
 */

import { speak, canSpeak } from './tts.js';

export function SpeakButton({
  text,
  lang = 'tr',
  size = 30,
  title,
  className = '',
  style,
  onSpoken,
}) {
  // Bu dilde okuma yapılamıyorsa düğme HİÇ ÇİZİLMEZ (yukarıdaki gerekçe).
  if (!canSpeak(lang)) return null;

  const etiket = title ?? ({ tr: 'Seslendir', en: 'Read aloud', ku: 'Bi deng bixwîne' }[lang] ?? 'Seslendir');

  return (
    <button
      type="button"
      className={className}
      aria-label={etiket}
      title={etiket}
      onClick={(e) => {
        e.stopPropagation();
        const t = typeof text === 'function' ? text() : text;
        if (!t) return;
        speak(t, lang);
        onSpoken?.(t);
      }}
      style={{
        // Dokunmatik hedef standardı (STANDARDS.md §1.3): en az 44×44 px.
        // `size` yalnız görsel çapı belirler; tıklama alanı her hâlükârda 44'ün altına inmez.
        width: Math.max(size, 44),
        height: Math.max(size, 44),
        minWidth: 44,
        minHeight: 44,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.round(size * 0.5),
        border: 'none',
        borderRadius: '50%',
        background: 'transparent',
        cursor: 'pointer',
        lineHeight: 1,
        ...style,
      }}
    >
      <span aria-hidden="true">🔊</span>
    </button>
  );
}
