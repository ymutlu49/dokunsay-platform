/** Adım ekranlarının ortak sözleşmesi. Her adım `guided` iken Rehber'in çözümünü gösterir. */
import type { Dispatch } from 'react';
import type { ErrorClass, L10n, Lang } from '../../content/types';
import { useT } from '../../i18n';
import type { SolveAction, SolveState } from '../../state/solveReducer';

export interface StepProps {
  s: SolveState;
  dispatch: Dispatch<SolveAction>;
  link: number;
  guided: boolean;
  lang: Lang;
  next: () => void;
  /** Doğru: kısa sesli kutlama + (varsa) içerik geri bildirimi. */
  ok: (text?: L10n) => void;
  /** Yanlış: nazik sallanma + hata sınıfı kaydı + ipucu teklifi. */
  wrong: (error?: ErrorClass, text?: L10n) => void;
  /** Bu adımda kaçıncı ipucu kademesi (H3 seçenek daraltma vb. için). */
  hint: number;
}

export function NextBtn({ onClick, label }: { onClick: () => void; label?: string }) {
  const t = useT();
  return (
    <div className="step-actions">
      <button type="button" className="btn btn--primary" onClick={onClick} autoFocus>
        {label ?? t('btn_continue')} →
      </button>
    </div>
  );
}
