/**
 * Veri araçları (yalnız bu cihaz; `dokunsay:problem:*`): JSON dışa aktar (exportAll),
 * JSON içe aktar (yalnız bu ad alanındaki anahtarlar; onaylı), verileri sil (onaylı).
 * Oturum anahtarları (sessionStorage) dokunulmaz.
 */
import { useRef, useState } from 'react';
import { exportProblemData } from '../lib/storage';
import type { TT } from './i18n';

const PREFIX = 'dokunsay:problem:';

function keys(): string[] {
  const out: string[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) out.push(k);
    }
  } catch {
    /* depolama kapalı */
  }
  return out;
}

export function DataTools({ t, onChanged }: { t: TT; onChanged: () => void }) {
  const [n, setN] = useState(() => keys().length);
  const [msg, setMsg] = useState('');
  const [confirmDel, setConfirmDel] = useState(false);
  const [pending, setPending] = useState<Record<string, unknown> | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const refresh = () => {
    setN(keys().length);
    onChanged();
  };

  const doExport = () => {
    const data = exportProblemData();
    const blob = new Blob([JSON.stringify({ app: 'DokunSayProblem', exported: new Date().toISOString(), data }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `dokunsay-problem-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const onFile = async (f: File | undefined) => {
    setMsg('');
    if (!f) return;
    try {
      const o = JSON.parse(await f.text()) as Record<string, unknown>;
      const data = (o && typeof o.data === 'object' ? o.data : o) as Record<string, unknown>;
      const good = Object.fromEntries(Object.entries(data ?? {}).filter(([k]) => k.startsWith(PREFIX)));
      if (!Object.keys(good).length) throw new Error('empty');
      setPending(good);
    } catch {
      setMsg(t('dt_import_bad'));
    }
    if (file.current) file.current.value = '';
  };

  const doImport = () => {
    if (!pending) return;
    let c = 0;
    for (const [k, v] of Object.entries(pending)) {
      try {
        localStorage.setItem(k, JSON.stringify(v));
        c++;
      } catch {
        /* kota */
      }
    }
    setPending(null);
    setMsg(t('dt_imported', { n: c }));
    refresh();
  };

  const doDelete = () => {
    keys().forEach((k) => {
      try {
        localStorage.removeItem(k);
      } catch {
        /* geç */
      }
    });
    setConfirmDel(false);
    setMsg(t('dt_deleted'));
    refresh();
  };

  return (
    <div className="tc-stack">
      <section className="tc-card">
        <h3>{t('dt_title')}</h3>
        <p className="tc-muted">{t('dt_desc')}</p>
        <p data-numeric="true">{t('dt_keys', { n })}</p>
        <div className="tc-actions tc-actions--start">
          <button type="button" className="tc-btn tc-btn--primary" onClick={doExport}>
            ⬇ {t('btn_export')}
          </button>
          <label className="tc-btn">
            ⬆ {t('btn_import')}
            <input ref={file} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
          <button type="button" className="tc-btn tc-btn--danger" onClick={() => setConfirmDel(true)}>
            {t('btn_delete')}
          </button>
        </div>
        {pending && (
          <div className="tc-confirm" role="alertdialog" aria-label={t('btn_import')}>
            <p>{t('dt_import_confirm')}</p>
            <div className="tc-actions tc-actions--start">
              <button type="button" className="tc-btn tc-btn--primary" onClick={doImport}>
                {t('btn_yes')}
              </button>
              <button type="button" className="tc-btn" onClick={() => setPending(null)}>
                {t('btn_cancel')}
              </button>
            </div>
          </div>
        )}
        {confirmDel && (
          <div className="tc-confirm" role="alertdialog" aria-label={t('btn_delete')}>
            <p>{t('dt_delete_confirm')}</p>
            <div className="tc-actions tc-actions--start">
              <button type="button" className="tc-btn tc-btn--danger" onClick={doDelete}>
                {t('btn_yes_delete')}
              </button>
              <button type="button" className="tc-btn" onClick={() => setConfirmDel(false)} autoFocus>
                {t('btn_cancel')}
              </button>
            </div>
          </div>
        )}
        <p role="status" aria-live="polite">
          {msg}
        </p>
      </section>
    </div>
  );
}
