/**
 * 💡 İpucu düğmesi: H1→H4 kademeleri, kademeler arası 3 sn bekleme (ipucu istismarını
 * sınırlar — 03 §D2). Kullanılan kademe ceza olarak GÖSTERİLMEZ; yalnız "İpucu n/4".
 */
import { useEffect, useState } from 'react';
import type { L10n } from '../content/types';
import { pick, useLang, useT } from '../i18n';
import { BulbIcon } from './icons';
import { Say } from './Talk';

const WAIT_MS = 3000;

export function HintButton({ level, at, onHint, disabled }: { level: number; at: number; onHint: () => void; disabled?: boolean }) {
  const t = useT();
  const [now, setNow] = useState(Date.now());
  const remain = level > 0 ? Math.max(0, WAIT_MS - (now - at)) : 0;
  useEffect(() => {
    if (remain <= 0) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [remain, at]);
  const maxed = level >= 4;
  return (
    <button
      type="button"
      className="hint-btn"
      onClick={() => {
        setNow(Date.now());
        onHint();
      }}
      disabled={disabled || maxed || remain > 0}
      aria-label={remain > 0 ? t('hint_wait', { s: Math.ceil(remain / 1000) }) : t('btn_hint')}
    >
      <BulbIcon size={22} />
      <span>{remain > 0 ? t('hint_wait', { s: Math.ceil(remain / 1000) }) : t('btn_hint')}</span>
    </button>
  );
}

export function HintBubble({ level, text }: { level: number; text: L10n | null }) {
  const t = useT();
  const lang = useLang();
  if (!text || level === 0) return null;
  const s = pick(text, lang);
  return (
    <div className="hint-bubble" role="status" aria-live="polite">
      <span className="hint-bubble__lvl">{t('hint_title', { n: level })}</span>
      <p>{s}</p>
      <Say text={s} size={30} />
    </div>
  );
}
