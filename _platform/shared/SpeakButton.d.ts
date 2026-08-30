/**
 * DokunSay Platform — shared/SpeakButton.jsx tip bildirimi
 *
 * Bildirim olmadan TypeScript, JSX kullanımından çıkarım yapıp TÜM prop'ları zorunlu
 * sanıyordu (DokunSayBar'da derleme hatası verdi). Zorunlu olan yalnız `text`.
 */
import type { CSSProperties, FC } from "react";

export interface SpeakButtonProps {
  /** Okunacak metin; fonksiyon verilirse tıklama anında hesaplanır (tembel). */
  text: string | (() => string);
  /** Dil kodu. `canSpeak(lang)` false ise düğme HİÇ ÇİZİLMEZ. */
  lang?: string;
  /** Görsel çap (px). Tıklama alanı her hâlükârda ≥44px kalır (STANDARDS §1.3). */
  size?: number;
  title?: string;
  className?: string;
  style?: CSSProperties;
  onSpoken?: (text: string) => void;
}

export const SpeakButton: FC<SpeakButtonProps>;
