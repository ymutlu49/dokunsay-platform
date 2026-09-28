/**
 * 11 · Problem Kurucu (03 §C7; resmî MAT.3.2.7 → 3. sınıf+). Boşluklu kalıp (açılır
 * seçimler: ad, sayı, nesne) + soru cümlesi seçimi → çözülebilirlik denetimi (soru var mı?
 * sayılar tam mı? ilişki olası mı? soru hikâyeden cevaplanır mı?) → "Kendin çöz" ya da
 * "Arkadaşına ver" (metin panoya; içerik spec döndürürse #p= paylaşım bağlantısı da).
 * 1–2. sınıfta PoserSimple ("resimden soru") açılır. Puanlama yok: yaratıcı durak.
 */
import { useMemo, useState } from 'react';
import { SpeakButton } from '@shared/SpeakButton.jsx';
import { pick } from '../i18n';
import { schemaMeta } from '../lib/contentAdapter';
import { shareUrl } from '../lib/share';
import { NumPad } from '../components/NumPad';
import { copyText } from './clipboard';
import { Choices, FeedbackLine, type ModuleProps, type RoundApi } from './common';
import { checkPose, frameText, framesFor, NAMES, numberRange, OBJECTS, type PoseCheck, type PoseValues, type SlotId } from './poserFrames';
import { PoserSimple } from './PoserSimple';
import { recordItem } from './record';

export function ProblemPoser(props: ModuleProps) {
  if (props.grade < 3) return <PoserSimple {...props} />;
  return <PoserFull {...props} />;
}

function PoserFull({ lang, grade, t, onExit }: ModuleProps) {
  const frames = useMemo(() => framesFor(grade), [grade]);
  const [fid, setFid] = useState<string | null>(null);
  const [vals, setVals] = useState<PoseValues>({});
  const [qId, setQId] = useState<string | null>(null);
  const [res, setRes] = useState<PoseCheck | null>(null);
  const [checks, setChecks] = useState(0);
  const [mode, setMode] = useState<'edit' | 'solve'>('edit');
  const [ans, setAns] = useState('');
  const [fb, setFb] = useState<RoundApi['fb']>(null);
  const frame = frames.find((f) => f.id === fid) ?? null;

  const reset = () => {
    setFid(null);
    setVals({});
    setQId(null);
    setRes(null);
    setChecks(0);
    setMode('edit');
    setAns('');
    setFb(null);
  };
  const setV = (k: SlotId, v: string) => {
    setVals((o) => ({ ...o, [k]: v }));
    setRes(null);
    setFb(null);
  };

  const text = frame ? frameText(frame, vals, qId, lang) : null;
  const full = text ? `${text.story} ${text.question}`.trim() : '';

  const check = () => {
    if (!frame) return;
    const r = checkPose(frame, vals, qId, lang, grade);
    setRes(r);
    if (checks === 0) recordItem({ module: 'poser', grade, schema: frame.schema, correct: r.ok });
    setChecks((c) => c + 1);
    const msgs = [...r.issues.map((i) => t(i)), ...r.extra.map((m) => pick(m, lang))];
    setFb(r.ok ? { tone: 'ok', text: t('pose_ok') } : { tone: 'try', text: msgs.join(' ') || t('try_again') });
  };

  const give = async () => {
    const link = res?.spec ? `\n${shareUrl(res.spec)}` : '';
    const ok = await copyText(full + link);
    setFb({ tone: ok ? 'info' : 'try', text: ok ? t('pose_copied') : t('pose_copy_fail') });
  };

  const submit = () => {
    if (res?.answer == null) return;
    const ok = Number(ans) === res.answer;
    setFb(ok ? { tone: 'ok', text: t('ok_generic') } : { tone: 'try', text: t('try_again') });
  };

  const sel = (k: SlotId, label: string, options: { v: string; l: string }[]) => (
    <label className="md-field" key={k}>
      <span>{label}</span>
      <select value={vals[k] ?? ''} onChange={(e) => setV(k, e.target.value)} disabled={mode === 'solve'}>
        <option value="">—</option>
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <section className="md-shell" aria-label={t('m_pose')}>
      <header className="md-shell__head">
        <button type="button" className="md-btn md-btn--ghost" onClick={onExit}>
          ← {t('back_cards')}
        </button>
        <h2 className="md-shell__title">{t('m_pose')}</h2>
      </header>
      {!frame ? (
        <>
          <h3 className="md-q">{t('pose_frame')}</h3>
          <div className="md-frames">
            {frames.map((f) => (
              <button key={f.id} type="button" className="md-frame" style={{ ['--schema' as string]: schemaMeta(f.schema).color }} onClick={() => setFid(f.id)}>
                <span className="md-frame__tag">{pick(schemaMeta(f.schema).name, lang)}</span>
                <span className="md-frame__txt">{frameText(f, {}, null, lang).story}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h3 className="md-q">{t('pose_fill')}</h3>
          <div className="md-fields">
            {frame.slots.includes('name') && sel('name', t('pose_name'), NAMES.map((n) => ({ v: n.id, l: n[lang] })))}
            {frame.slots.includes('name2') && sel('name2', t('pose_name2'), NAMES.filter((n) => n.id !== vals.name).map((n) => ({ v: n.id, l: n[lang] })))}
            {frame.slots.includes('n1') && sel('n1', `${t('pose_num')} 1`, numberRange(grade, frame.schema).map((n) => ({ v: String(n), l: String(n) })))}
            {frame.slots.includes('n2') && sel('n2', `${t('pose_num')} 2`, numberRange(grade, frame.schema).map((n) => ({ v: String(n), l: String(n) })))}
            {frame.slots.includes('obj') && sel('obj', t('pose_obj'), OBJECTS.map((o) => ({ v: o.id, l: o[lang] })))}
          </div>
          <h3 className="md-q">{t('pose_question')}</h3>
          <Choices
            opts={frame.questions.map((q) => ({ id: q.id, text: frameText(frame, vals, q.id, lang).question || pick(q.text, lang) }))}
            state={qId ? { [qId]: 'ok' } : {}}
            onPick={(id) => {
              if (mode === 'solve') return;
              setQId(id);
              setRes(null);
              setFb(null);
            }}
            disabled={mode === 'solve'}
            lang={lang}
            label={t('pose_question')}
          />
          <div className="md-story">
            <div className="md-story__head">
              <span className="md-story__label">{t('pose_preview')}</span>
              <SpeakButton text={full} lang={lang} size={32} className="md-say" />
            </div>
            <p className="md-story__text">
              {text?.story} <b>{text?.question}</b>
            </p>
          </div>
          <FeedbackLine fb={fb} lang={lang} />
          {mode === 'edit' ? (
            <div className="md-actions">
              <button type="button" className="md-btn md-btn--ghost" onClick={reset}>
                {t('pose_new')}
              </button>
              <button type="button" className="md-btn md-btn--primary" onClick={check}>
                {t('pose_check')}
              </button>
              {res?.ok && (
                <>
                  <button type="button" className="md-btn md-btn--primary" onClick={() => (setMode('solve'), setFb(null))} disabled={res.answer == null}>
                    {t('pose_solve_self')}
                  </button>
                  <button type="button" className="md-btn md-btn--ghost" onClick={give}>
                    {t('pose_give_friend')}
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              <NumPad value={ans} onChange={setAns} onSubmit={submit} label={t('pose_your_answer')} />
              <div className="md-actions">
                <button type="button" className="md-btn md-btn--ghost" onClick={() => setMode('edit')}>
                  ← {t('pose_fill')}
                </button>
                <button type="button" className="md-btn md-btn--ghost" onClick={reset}>
                  {t('pose_new')}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
