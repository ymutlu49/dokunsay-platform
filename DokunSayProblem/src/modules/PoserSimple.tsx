/**
 * Problem Kurucu — 1–2. sınıf basit sürümü: "resimden soru" (03 §C7a; 05 §D6).
 * Resimde iki grup nesne; çocuk resimden CEVAPLANABİLEN bir soru seçer (cevaplanamayan
 * sorular da seçeneklerde: gerçekçilik), sonra kendi sorusunu çözer. Yedek sahneler yerel.
 * // KU-DENETİM: sahne soruları.
 */
import { useMemo, useState } from 'react';
import type { L10n } from '../content/types';
import { pick } from '../i18n';
import { shuffleSeeded } from '../lib/problemUtil';
import { NumPad } from '../components/NumPad';
import { Choices, ModuleShell, useRound, type ModuleProps } from './common';

interface SceneQ {
  id: string;
  text: L10n;
  answer: number | null;
}
interface Scene {
  a: { emoji: string; n: number };
  b: { emoji: string; n: number };
  qs: SceneQ[];
}

const L = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });

const KINDS = [
  {
    a: '🍎', b: '🍐',
    total: L('Toplam kaç meyve var?', 'Bi giştî çend fêkî hene?', 'How many fruits are there in all?'),
    diff: L('Elmalar armutlardan kaç tane fazla?', 'Çend sêv ji hirmiyan zêdetir in?', 'How many more apples than pears are there?'),
    bad1: L('Elmalar kaç yaşında?', 'Sêv çend salî ne?', 'How old are the apples?'),
    bad2: L('Armutları kim aldı?', 'Hirmî kê kirîn?', 'Who bought the pears?'),
  },
  {
    a: '🐑', b: '🐐',
    total: L('Toplam kaç hayvan var?', 'Bi giştî çend heywan hene?', 'How many animals are there in all?'),
    diff: L('Koyunlar keçilerden kaç tane fazla?', 'Çend pez ji bizinan zêdetir in?', 'How many more sheep than goats are there?'),
    bad1: L('Koyunların adı ne?', 'Navê pezan çi ye?', "What are the sheep's names?"),
    bad2: L('Keçiler nereden geldi?', 'Bizin ji ku hatin?', 'Where did the goats come from?'),
  },
];

function makeScenes(seed: number, grade: number): Scene[] {
  const max = grade <= 1 ? 9 : 15;
  return Array.from({ length: 4 }, (_, i) => {
    const k = KINDS[(seed + i) % KINDS.length];
    const r = (m: number, o: number) => 2 + ((seed * 31 + i * 17 + o) % (m - 2));
    let na = r(max, 3);
    let nb = r(Math.min(max, 9), 7);
    if (na === nb) na += 1;
    if (na < nb) [na, nb] = [nb, na];
    return {
      a: { emoji: k.a, n: na },
      b: { emoji: k.b, n: nb },
      qs: shuffleSeeded(
        [
          { id: 'total', text: k.total, answer: na + nb },
          { id: 'diff', text: k.diff, answer: na - nb },
          { id: 'bad1', text: k.bad1, answer: null },
          { id: 'bad2', text: k.bad2, answer: null },
        ],
        seed + i,
      ),
    };
  });
}

export function PoserSimple({ lang, grade, seed, t, onExit, onDone }: ModuleProps) {
  const scenes = useMemo(() => makeScenes(seed, grade), [seed, grade]);
  const round = useRound('poser', grade, scenes.length, onDone);
  const [qState, setQState] = useState<Record<string, 'ok' | 'bad' | undefined>>({});
  const [chosen, setChosen] = useState<SceneQ | null>(null);
  const [firstQ, setFirstQ] = useState(true);
  const [ans, setAns] = useState('');
  const sc = scenes[round.index];

  const pickQ = (id: string) => {
    if (chosen || round.solved) return;
    const q = sc.qs.find((x) => x.id === id);
    if (!q) return;
    if (q.answer == null) {
      setFirstQ(false);
      setQState((s) => ({ ...s, [id]: 'bad' }));
      round.info(t('pose_not_answerable'), 'try');
      return;
    }
    setQState((s) => ({ ...s, [id]: 'ok' }));
    setChosen(q);
    round.info(t('pose_answerable'));
  };

  const submit = () => {
    if (!chosen || chosen.answer == null) return;
    const ok = Number(ans) === chosen.answer;
    if (ok) {
      round.finish(firstQ, t('ok_generic'), { schema: chosen.id === 'total' ? 'combine' : 'compare' });
    } else round.info(t('try_again'), 'try');
  };

  const pic = (g: { emoji: string; n: number }) => (
    <span className="md-scene__grp" aria-label={`${g.n}`}>
      {Array.from({ length: g.n }, (_, i) => (
        <span key={i} aria-hidden="true">
          {g.emoji}
        </span>
      ))}
    </span>
  );

  return (
    <ModuleShell
      title={t('m_pose')}
      t={t}
      lang={lang}
      onExit={onExit}
      round={{
        ...round,
        next: () => {
          setQState({});
          setChosen(null);
          setFirstQ(true);
          setAns('');
          round.next();
        },
      }}
    >
      <div className="md-scene" role="img" aria-label={`${sc.a.emoji} ${sc.a.n}, ${sc.b.emoji} ${sc.b.n}`}>
        {pic(sc.a)}
        {pic(sc.b)}
      </div>
      <h3 className="md-q">{t('pose_scene_q')}</h3>
      <Choices
        opts={sc.qs.map((q) => ({ id: q.id, text: pick(q.text, lang) }))}
        state={qState}
        onPick={pickQ}
        disabled={!!chosen || round.solved}
        lang={lang}
        label={t('pose_scene_q')}
      />
      {chosen && !round.solved && <NumPad value={ans} onChange={setAns} onSubmit={submit} label={t('pose_your_answer')} />}
    </ModuleShell>
  );
}
