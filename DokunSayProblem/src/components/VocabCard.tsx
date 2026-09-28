/** Sözcük kartı (ilişki sözcüğü + kısa açıklama + ses). Esc / dışına dokun ile kapanır. */
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useT } from '../i18n';
import type { VocabUI } from '../lib/contentAdapter';
import { Say } from './Talk';

export function VocabCard({ entry, onClose }: { entry: VocabUI; onClose: () => void }) {
  const t = useT();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return createPortal(
    <div className="modal-back" onClick={onClose}>
      <div className="modal vocab" role="dialog" aria-modal="true" aria-labelledby="vocab-title" onClick={(e) => e.stopPropagation()}>
        <h3 id="vocab-title" className="vocab__word">
          {entry.word}
        </h3>
        <p className="vocab__meaning">{entry.meaning}</p>
        <div className="vocab__actions">
          <Say text={`${entry.word}. ${entry.meaning}`} />
          <button ref={closeRef} type="button" className="btn btn--ghost" onClick={onClose}>
            {t('btn_close')}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
