/**
 * Uygulama gövdesi: AppTabs sekmeleri + hash eşlemesi (router YOK — 06 §1.7).
 *
 * SEKME YUVALARI (sonraki ajan dolduracak):
 *   - Antrenman → `src/modules/index.tsx`  (default export: React bileşeni, props `{ lang: Lang }`)
 *   - Öğretmen  → `src/teacher/index.tsx`  (default export: React bileşeni, props `{ lang: Lang }`)
 * Dosya yoksa "Yakında" boş durumu gösterilir. Varlık denetimi derleme anında
 * `import.meta.glob` ile yapılır (dosya eklenince ek bağlama GEREKMEZ).
 */
import { lazy, Suspense, useEffect, useMemo, useState, type ComponentType } from 'react';
import { AppTabs } from '@shared/AppTabs.jsx';
import type { Grade, Lang } from './content/types';
import { loadProgress } from './lib/progress';
import { readSetHash } from './teacher/setShare';
import { useT } from './i18n';
import { readHash, writeHash, type HashRoute, type TabId } from './lib/share';
import { SolvePage } from './flow/SolvePage';
import { HelpTab } from './flow/HelpTab';

type SlotComp = ComponentType<{ lang: Lang; grade?: Grade }>;
const SLOT_FILES = import.meta.glob<{ default: SlotComp }>(['./modules/index.tsx', './teacher/index.tsx']);

function slot(path: string) {
  const loader = SLOT_FILES[path];
  return loader ? lazy(loader) : null;
}

function Soon({ text }: { text: string }) {
  const t = useT();
  return (
    <div className="soon">
      <h2>{t('slot_soon')}</h2>
      <p>{text}</p>
    </div>
  );
}

export default function App({ lang }: { lang: Lang }) {
  const t = useT();
  const initial = useMemo<HashRoute>(() => readHash(), []);
  const [tab, setTab] = useState<TabId>(() => (initial.share || initial.deep || initial.mixed || readSetHash() ? 'solve' : initial.tab ?? 'solve'));
  const Train = useMemo(() => slot('./modules/index.tsx'), []);
  const Teacher = useMemo(() => slot('./teacher/index.tsx'), []);

  useEffect(() => {
    const onHash = () => {
      const r = readHash();
      if (r.tab) setTab(r.tab);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const change = (id: string) => {
    const next = id as TabId;
    setTab(next);
    if (next !== 'solve') writeHash({ tab: next });
    else writeHash({ tab: 'solve' });
  };

  return (
    <div className="app">
      <nav className="app__tabs">
        <AppTabs
          tabs={[
            { id: 'solve', label: t('tab_solve'), icon: '🧩' },
            { id: 'train', label: t('tab_train'), icon: '🎯' },
            { id: 'teacher', label: t('tab_teacher'), icon: '👩‍🏫' },
            { id: 'help', label: t('tab_help'), icon: '❓' },
          ]}
          active={tab}
          onChange={change}
          ariaLabel={t('tabs_aria')}
        />
      </nav>
      <div className="app__scroll" role="tabpanel">
        <div hidden={tab !== 'solve'} className="app__panel">
          <SolvePage initial={initial} />
        </div>
        {tab === 'train' && (
          <div className="app__panel">
            {Train ? (
              <Suspense fallback={null}>
                <Train lang={lang} grade={loadProgress().grade ?? undefined} />
              </Suspense>
            ) : (
              <Soon text={t('slot_train')} />
            )}
          </div>
        )}
        {tab === 'teacher' && (
          <div className="app__panel">
            {Teacher ? (
              <Suspense fallback={null}>
                <Teacher lang={lang} grade={loadProgress().grade ?? undefined} />
              </Suspense>
            ) : (
              <Soon text={t('slot_teacher')} />
            )}
          </div>
        )}
        {tab === 'help' && (
          <div className="app__panel">
            <HelpTab />
          </div>
        )}
      </div>
    </div>
  );
}
