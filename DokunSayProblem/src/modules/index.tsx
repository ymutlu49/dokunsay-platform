/**
 * ANTRENMAN DURAKLARI sekmesi (DESIGN §7; 03 §C). Kart ızgarası → modül ekranı → sonuç.
 * Her modül 4–8 maddelik kısa tur; puan tablosu/süre YOK, sonuç sade: "6 maddenin 5'ini".
 * İçeriği henüz gelmeyen modül kartı "Hazırlanıyor" durumunda görünür (içerik geçidi korumalı).
 *
 * Props: { lang, grade?, teacherUnlock? } — grade verilmezse ilerlemedeki sınıf (currentGrade); — teacherUnlock verilirse Hata Dedektifi kilidi
 * açılır (verilmezse öğretmen panelinin yazdığı cihaz ayarı `modulesUnlock` okunur).
 */
import { useMemo, useState, type ComponentType, type ReactNode } from 'react';
import type { Grade, Lang } from '../content/types';
import { LangContext } from '../i18n';
import { ActStation } from './ActStation';
import { has } from './api';
import type { ModuleProps } from './common';
import { DetectiveQuestions } from './DetectiveQuestions';
import { ErrorDetective, detectiveSchemas } from './ErrorDetective';
import { mt, type MKey } from './i18n';
import { ModelToEquation } from './ModelToEquation';
import { ProblemPoser } from './ProblemPoser';
import { Reasonable } from './Reasonable';
import { currentGrade, teacherUnlocked, type ModuleId } from './record';
import { Remainder } from './Remainder';
import { SortRelevant } from './SortRelevant';
import { StoryRetell } from './StoryRetell';
import { StripWorkshop } from './StripWorkshop';
import { TypeHunter } from './TypeHunter';
import { WordTrap } from './WordTrap';
import './modules.css';

interface CardDef {
  id: ModuleId;
  icon: string;
  title: MKey;
  desc: MKey;
  items: number;
  minGrade: Grade;
  needs?: string;
  comp: ComponentType<ModuleProps>;
}

const CARDS: CardDef[] = [
  { id: 'act', icon: '🧮', title: 'm_act', desc: 'm_act_d', items: 5, minGrade: 1, needs: 'actScriptFor', comp: ActStation },
  { id: 'retell', icon: '👂', title: 'm_retell', desc: 'm_retell_d', items: 5, minGrade: 1, needs: 'paraphraseFor', comp: StoryRetell },
  { id: 'typeHunter', icon: '🧭', title: 'm_type', desc: 'm_type_d', items: 6, minGrade: 1, needs: 'generateProblem', comp: TypeHunter },
  { id: 'strip', icon: '🧩', title: 'm_strip', desc: 'm_strip_d', items: 5, minGrade: 1, needs: 'checkModel', comp: StripWorkshop },
  { id: 'modelEq', icon: '✏️', title: 'm_eq', desc: 'm_eq_d', items: 5, minGrade: 1, needs: 'checkEquation', comp: ModelToEquation },
  { id: 'sortRelevant', icon: '🗂️', title: 'm_sort', desc: 'm_sort_d', items: 5, minGrade: 1, needs: 'generateProblem', comp: SortRelevant },
  { id: 'reasonable', icon: '🤔', title: 'm_reason', desc: 'm_reason_d', items: 6, minGrade: 1, needs: 'reasonableItemsFor', comp: Reasonable },
  { id: 'wordTrap', icon: '🪤', title: 'm_trap', desc: 'm_trap_d', items: 6, minGrade: 2, needs: 'generateProblem', comp: WordTrap },
  { id: 'errorDetective', icon: '🤖', title: 'm_errdet', desc: 'm_errdet_d', items: 5, minGrade: 1, needs: 'erroneousSolutionFor', comp: ErrorDetective },
  { id: 'detective', icon: '🔎', title: 'm_detq', desc: 'm_detq_d', items: 6, minGrade: 1, needs: 'unsolvableFor', comp: DetectiveQuestions },
  { id: 'remainder', icon: '🍪', title: 'm_rem', desc: 'm_rem_d', items: 4, minGrade: 3, needs: 'remainderSetFor', comp: Remainder },
  { id: 'poser', icon: '🛠️', title: 'm_pose', desc: 'm_pose_d', items: 4, minGrade: 1, comp: ProblemPoser },
];

const newSeed = () => (Date.now() % 90000) + 1;

export default function ModulesTab({ lang, grade: gradeProp, teacherUnlock }: { lang: Lang; grade?: Grade; teacherUnlock?: boolean }) {
  const grade = useMemo<Grade>(() => gradeProp ?? currentGrade(), [gradeProp]);
  const t = useMemo(() => mt(lang), [lang]);
  const [active, setActive] = useState<ModuleId | null>(null);
  const [seed, setSeed] = useState(newSeed);
  const [result, setResult] = useState<{ k: number; n: number; reflection?: ReactNode } | null>(null);
  const unlocked = teacherUnlock ?? teacherUnlocked();
  const detLocked = !unlocked && detectiveSchemas(grade).length === 0;

  const start = (id: ModuleId) => {
    setSeed(newSeed());
    setResult(null);
    setActive(id);
  };
  const exit = () => {
    setActive(null);
    setResult(null);
  };
  const card = CARDS.find((c) => c.id === active);

  let body: ReactNode;
  if (card && result) {
    body = (
      <section className="md-shell md-result" aria-live="polite">
        <h2 className="md-shell__title">
          {card.icon} {t('result_title')}
        </h2>
        <p className="md-result__score" data-numeric="true">
          {t('result_score', { k: result.k, n: result.n })}
        </p>
        <p>{t('result_process')}</p>
        {result.reflection}
        <div className="md-actions">
          <button type="button" className="md-btn md-btn--ghost" onClick={exit}>
            ← {t('back_cards')}
          </button>
          <button type="button" className="md-btn md-btn--primary" onClick={() => start(card.id)} autoFocus>
            {t('btn_again')}
          </button>
        </div>
      </section>
    );
  } else if (card) {
    const Comp = card.comp;
    body = <Comp key={`${card.id}-${seed}`} lang={lang} grade={grade} seed={seed} t={t} onExit={exit} onDone={(k, n, reflection) => setResult({ k, n, reflection })} />;
  } else {
    body = (
      <section className="md-grid-wrap" aria-labelledby="md-tab-title">
        <header className="md-tabhead">
          <h2 id="md-tab-title">{t('tab_title')}</h2>
          <p>
            {t('tab_sub')} <span className="md-gradebadge">{t('grade_note', { g: grade })}</span>
          </p>
        </header>
        <ul className="md-grid">
          {CARDS.map((c) => {
            const tooLow = grade < c.minGrade;
            const preparing = !!c.needs && !has(c.needs);
            const locked = c.id === 'errorDetective' && detLocked;
            const off = tooLow || preparing;
            const status = tooLow
              ? t('card_grade_from', { g: c.minGrade })
              : preparing
                ? t('card_preparing')
                : locked
                  ? `🔒 ${t('card_locked')}`
                  : c.id === 'act'
                    ? `${t('card_items', { n: c.items })} · ${t('card_free_note')}`
                    : t('card_items', { n: c.items });
            const desc = c.id === 'poser' && grade < 3 ? t('m_pose_d_simple') : t(c.desc);
            return (
              <li key={c.id}>
                <button type="button" className={`md-card${off ? ' is-off' : ''}${locked ? ' is-locked' : ''}`} disabled={off} onClick={() => start(c.id)}>
                  <span className="md-card__icon" aria-hidden="true">
                    {c.icon}
                  </span>
                  <span className="md-card__title">{t(c.title)}</span>
                  <span className="md-card__desc">{desc}</span>
                  <span className="md-card__status">{status}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  return (
    <LangContext.Provider value={lang}>
      <div className="md-root" lang={lang === 'ku' ? 'ku' : lang}>
        {body}
      </div>
    </LangContext.Provider>
  );
}
