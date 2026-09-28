/**
 * Yetişkin kapısı: iki basamaklı × tek basamaklı çarpma (şifre/hesap YOK). Açılış yalnız
 * bu sekme oturumunda hatırlanır (sessionStorage). Gerçek <input inputMode="numeric">
 * (platform kısayolları input dışında Backspace'i yutar — 06 R16).
 */
import { useState, type FormEvent } from 'react';
import type { TT } from './i18n';

const KEY = 'dokunsay:problem:teacherGate.v1';

export function gateOpen(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function setGate(open: boolean): void {
  try {
    if (open) sessionStorage.setItem(KEY, '1');
    else sessionStorage.removeItem(KEY);
  } catch {
    /* özel sekme */
  }
}

function newQ() {
  const a = 12 + Math.floor(Math.random() * 8);
  const b = 3 + Math.floor(Math.random() * 7);
  return { a, b };
}

export function AdultGate({ t, onOpen }: { t: TT; onOpen: () => void }) {
  const [q, setQ] = useState(newQ);
  const [v, setV] = useState('');
  const [wrong, setWrong] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (Number(v) === q.a * q.b) {
      setGate(true);
      onOpen();
    } else {
      setWrong(true);
      setQ(newQ());
      setV('');
    }
  };

  return (
    <section className="tc-gate" aria-labelledby="tc-gate-title">
      <h2 id="tc-gate-title">🔐 {t('gate_title')}</h2>
      <p>{t('gate_body')}</p>
      <form onSubmit={submit} className="tc-gate__form">
        <label htmlFor="tc-gate-in" className="tc-gate__q" data-numeric="true">
          {q.a} × {q.b} =
        </label>
        <input
          id="tc-gate-in"
          className="tc-input tc-gate__in"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={v}
          onChange={(e) => setV(e.target.value.replace(/\D/g, '').slice(0, 4))}
          aria-describedby="tc-gate-msg"
        />
        <button type="submit" className="tc-btn tc-btn--primary" disabled={!v}>
          {t('gate_btn')}
        </button>
      </form>
      <p id="tc-gate-msg" role="status" aria-live="polite" className="tc-gate__msg">
        {wrong ? t('gate_wrong') : ''}
      </p>
      <p className="tc-muted">{t('gate_note')}</p>
    </section>
  );
}
