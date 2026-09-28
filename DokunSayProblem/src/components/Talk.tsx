/**
 * Konuşan küçük yüzeyler: geri bildirim balonu, Rehber balonu, öz-sorgu kartı.
 * Hepsi seslendirilebilir (SpeakButton — KU'da gerçek ses yoksa 🔊 kendiliğinden gizlenir).
 */
import { useEffect, useState, type ReactNode } from 'react';
import { SpeakButton } from '@shared/SpeakButton.jsx';
import type { L10n } from '../content/types';
import { pick, useLang, useT } from '../i18n';
import { GuideIcon, LensIcon } from './icons';

export function Say({ text, size = 34 }: { text: string; size?: number }) {
  const lang = useLang();
  if (!text) return null;
  return <SpeakButton text={text} lang={lang} size={size} className="say-btn" />;
}

export function FeedbackBubble({ tone, text, n, action }: { tone: 'ok' | 'wrong' | 'info'; text: L10n; n: number; action?: ReactNode }) {
  const lang = useLang();
  const s = pick(text, lang);
  return (
    <div
      key={n}
      className={`feedback feedback--${tone}`}
      role="status"
      aria-live="polite"
      data-semantic={tone === 'ok' ? 'positive' : tone === 'wrong' ? 'negative' : undefined}
    >
      <p className="feedback__text">{s}</p>
      <Say text={s} size={30} />
      {action}
    </div>
  );
}

export function GuideBalloon({ text, children }: { text: string; children?: ReactNode }) {
  const t = useT();
  return (
    <div className="guide" role="note">
      <span className="guide__badge">
        <GuideIcon size={30} />
        <span className="guide__name">{t('guide_name')}</span>
      </span>
      <p className="guide__text">{text}</p>
      <Say text={text} size={30} />
      {children}
    </div>
  );
}

/** Öz-sorgu kartı (Söyle–Sor–Kontrol et). S2/S3 açık; S1 "Nasıl yapıyordum?" ile; H0'da parlar. */
export function SelfTalkCard({
  talk,
  open: openProp,
  glow,
}: {
  talk: { say: L10n; ask: L10n; check: L10n } | null;
  open: boolean;
  glow: boolean;
}) {
  const t = useT();
  const lang = useLang();
  const [open, setOpen] = useState(openProp);
  useEffect(() => setOpen(openProp), [openProp, talk]);
  useEffect(() => {
    if (glow) setOpen(true);
  }, [glow]);
  if (!talk) return null;
  const lines = [
    { k: t('self_say'), v: pick(talk.say, lang) },
    { k: t('self_ask'), v: pick(talk.ask, lang) },
    { k: t('self_check'), v: pick(talk.check, lang) },
  ];
  if (!open) {
    return (
      <button type="button" className="selftalk-toggle" onClick={() => setOpen(true)}>
        <LensIcon size={18} /> {t('btn_how_did_i')}
      </button>
    );
  }
  return (
    <aside className={`selftalk${glow ? ' is-glow' : ''}`} aria-label={t('selftalk_title')}>
      <span className="selftalk__icon" aria-hidden="true">
        <LensIcon size={18} />
      </span>
      <ul className="selftalk__list">
        {lines.map((l) => (
          <li key={l.k}>
            <b>{l.k}:</b> {l.v}
          </li>
        ))}
      </ul>
      <Say text={lines.map((l) => l.v).join(' ')} size={30} />
    </aside>
  );
}
