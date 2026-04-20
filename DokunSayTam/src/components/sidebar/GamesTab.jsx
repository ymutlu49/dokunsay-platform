import { THEME } from '../../constants/theme';
import { QUIZ_QUESTIONS, SCENARIO_QUESTIONS } from '../../constants/quizData';
import { speak } from '../../utils/speech';

const GamesTab = ({ game, setGame, posCount, negCount, netValue, animateNumberLine, setNlJumps, setNlPos }) => {
  const startQuiz = () => {
    const qi = Math.floor(Math.random() * QUIZ_QUESTIONS.length);
    setGame({ mode: 'quiz', score: 0, total: 0, feedback: null, rqi: qi });
  };

  const pickQuiz = (idx) => {
    if (!game || game.feedback) return;
    const ok = idx === QUIZ_QUESTIONS[game.rqi].answer;
    speak(ok ? 'Doğru!' : 'Tekrar dene.');
    setGame({ ...game, feedback: ok ? 'correct' : 'wrong', score: game.score + (ok ? 1 : 0), total: game.total + 1 });
    if (ok) setTimeout(() => {
      const qi2 = Math.floor(Math.random() * QUIZ_QUESTIONS.length);
      setGame({ ...game, rqi: qi2, feedback: null, score: game.score + 1, total: game.total + 1 });
    }, 1200);
  };

  const startCompare = () => {
    let a = Math.floor(Math.random() * 11) - 5;
    let b;
    do { b = Math.floor(Math.random() * 11) - 5; } while (b === a);
    setGame({ mode: 'compare', score: 0, total: 0, feedback: null, a, b });
  };

  const pickCompare = (op) => {
    if (!game || game.feedback) return;
    const ok = (op === '<' && game.a < game.b) || (op === '>' && game.a > game.b) || (op === '=' && game.a === game.b);
    speak(ok ? 'Doğru!' : 'Tekrar dene.');
    setGame({ ...game, feedback: ok ? 'correct' : 'wrong', score: game.score + (ok ? 1 : 0), total: game.total + 1 });
    if (ok) setTimeout(() => {
      let a2 = Math.floor(Math.random() * 11) - 5;
      let b2;
      do { b2 = Math.floor(Math.random() * 11) - 5; } while (b2 === a2);
      setGame({ ...game, a: a2, b: b2, feedback: null, score: game.score + 1, total: game.total + 1 });
    }, 1200);
  };

  const startScenario = () => {
    const qi = Math.floor(Math.random() * SCENARIO_QUESTIONS.length);
    setGame({ mode: 'scenario', score: 0, total: 0, feedback: null, rqi: qi });
  };

  const pickScenario = (idx) => {
    if (!game || game.feedback) return;
    const ok = idx === SCENARIO_QUESTIONS[game.rqi].answer;
    speak(ok ? 'Doğru! ' + SCENARIO_QUESTIONS[game.rqi].explanation : 'Tekrar dene.');
    setGame({ ...game, feedback: ok ? 'correct' : 'wrong', score: game.score + (ok ? 1 : 0), total: game.total + 1 });
    if (ok) setTimeout(() => {
      const qi2 = Math.floor(Math.random() * SCENARIO_QUESTIONS.length);
      setGame({ ...game, rqi: qi2, feedback: null, score: game.score + 1, total: game.total + 1 });
    }, 2000);
  };

  const startNumline = () => {
    const a = Math.floor(Math.random() * 7) - 3;
    const b = [-3, -2, -1, 1, 2, 3][Math.floor(Math.random() * 6)];
    setGame({ mode: 'numline', score: 0, total: 0, feedback: null, start: a, add: b, answer: a + b });
  };

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
      <div style={{
        background: game ? 'rgba(245,158,11,.04)' : '#fff',
        borderRadius: 14, padding: '12px',
        border: game ? '1.5px solid rgba(245,158,11,.2)' : '1px solid rgba(0,0,0,.05)',
      }}>
        {!game ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: THEME.accentD, marginBottom: 4 }}>{'🎮 Oyunlar'}</div>
            <button onClick={startQuiz} style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid rgba(245,158,11,.15)', background: THEME.accentL, cursor: 'pointer', fontSize: 11, fontWeight: 700, color: THEME.accentD, fontFamily: 'inherit', textAlign: 'left' }}>{'🧮 İşlem Quiz (15 Soru)'}</button>
            <button onClick={startCompare} style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid rgba(59,130,246,.15)', background: 'rgba(59,130,246,.04)', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: THEME.blue, fontFamily: 'inherit', textAlign: 'left' }}>{'\⚖\️ Karşılaştır'}</button>
            <button onClick={() => setGame({ mode: 'zero', score: 0, total: 0, feedback: null, target: Math.floor(Math.random() * 5) + 1 })} style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid rgba(139,92,246,.15)', background: 'rgba(139,92,246,.04)', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: '#6d28d9', fontFamily: 'inherit', textAlign: 'left' }}>{'🟣 Sıfır Çifti Avı'}</button>
            <button onClick={startNumline} style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid rgba(34,197,94,.15)', background: 'rgba(34,197,94,.04)', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: THEME.posB, fontFamily: 'inherit', textAlign: 'left' }}>{'📏 Sayı Doğrusunda Topla'}</button>
            <div style={{ height: 1, background: 'rgba(0,0,0,.06)', margin: '4px 0' }} />
            <div style={{ fontSize: 10, fontWeight: 800, color: THEME.blue, marginBottom: 4 }}>{'🌍 Gerçek Hayat'}</div>
            <button onClick={startScenario} style={{ padding: '8px 12px', borderRadius: 8, border: '1.5px solid rgba(59,130,246,.15)', background: 'rgba(59,130,246,.04)', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: THEME.blue, fontFamily: 'inherit', textAlign: 'left' }}>{'🔍 Senaryo Soruları'}</button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: THEME.accentD }}>{'🏆 ' + game.score + '/' + game.total}</span>
              <button onClick={() => setGame(null)} style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 9, fontWeight: 700, color: '#888', fontFamily: 'inherit' }}>{'\✕ Bitir'}</button>
            </div>

            {/* Quiz */}
            {game.mode === 'quiz' && (
              <div>
                <div style={{ padding: '10px', borderRadius: 10, background: '#fff', border: '1.5px solid rgba(245,158,11,.15)', textAlign: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: THEME.text }}>{QUIZ_QUESTIONS[game.rqi].question}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {QUIZ_QUESTIONS[game.rqi].options.map((c, ci) => {
                    const isCorrect = game.feedback && ci === QUIZ_QUESTIONS[game.rqi].answer;
                    return (
                      <button key={ci} onClick={() => pickQuiz(ci)} disabled={!!game.feedback} style={{
                        padding: '8px 12px', borderRadius: 8,
                        border: isCorrect ? '2px solid ' + THEME.green : '1.5px solid rgba(0,0,0,.06)',
                        background: isCorrect ? 'rgba(34,197,94,.08)' : '#fff',
                        cursor: game.feedback ? 'default' : 'pointer',
                        fontSize: 14, fontWeight: 700, color: isCorrect ? THEME.green : THEME.text, fontFamily: 'inherit',
                      }}>{c}{isCorrect ? ' \✅' : ''}</button>
                    );
                  })}
                </div>
                {game.feedback === 'wrong' && <div style={{ marginTop: 6, fontSize: 11, color: THEME.red, textAlign: 'center', fontWeight: 700 }}>{'\❌ Tekrar dene!'}</div>}
              </div>
            )}

            {/* Compare */}
            {game.mode === 'compare' && (
              <div>
                <div style={{ padding: '12px', borderRadius: 10, background: '#fff', border: '1.5px solid rgba(0,0,0,.06)', textAlign: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: THEME.text }}>
                    {(game.a >= 0 ? '+' : '') + game.a + ' ? ' + (game.b >= 0 ? '+' : '') + game.b}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['<', '=', '>'].map((op) => (
                    <button key={op} onClick={() => pickCompare(op)} disabled={!!game.feedback} style={{
                      flex: 1, padding: '12px 0', borderRadius: 10, border: '2px solid ' + THEME.sideB,
                      background: '#fff', cursor: game.feedback ? 'default' : 'pointer',
                      fontSize: 24, fontWeight: 900, color: THEME.accent, fontFamily: 'inherit',
                    }}>{op}</button>
                  ))}
                </div>
                {game.feedback && (
                  <div style={{
                    marginTop: 6, padding: '6px', borderRadius: 8,
                    background: game.feedback === 'correct' ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.06)',
                    textAlign: 'center', fontSize: 13, fontWeight: 900,
                    color: game.feedback === 'correct' ? THEME.green : THEME.red,
                  }}>{game.feedback === 'correct' ? '\✅ Doğru!' : '\❌ Tekrar dene!'}</div>
                )}
              </div>
            )}

            {/* Zero pair */}
            {game.mode === 'zero' && (
              <div>
                <div style={{ padding: '10px', borderRadius: 10, background: '#fff', textAlign: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 12, color: '#888' }}>{'Kanvasa ' + game.target + ' sıfır çifti ekle'}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: '#6d28d9' }}>{game.target + '\× (\⊕\⊖)'}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                    {'Şu an: \⊕' + posCount + ' \⊖' + negCount + ' net=' + netValue}
                  </div>
                </div>
                {netValue === 0 && posCount === game.target && (
                  <div style={{ padding: '8px', borderRadius: 8, background: 'rgba(34,197,94,.1)', textAlign: 'center', fontSize: 14, fontWeight: 900, color: THEME.green }}>{'\✅ Harika!'}</div>
                )}
              </div>
            )}

            {/* Numline */}
            {game.mode === 'numline' && (
              <div>
                <div style={{ padding: '10px', borderRadius: 10, background: '#fff', textAlign: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: THEME.text }}>
                    {'(' + (game.start >= 0 ? '+' : '') + game.start + ') + (' + (game.add >= 0 ? '+' : '') + game.add + ') = ?'}
                  </div>
                  <div style={{ fontSize: 10, color: '#888', marginTop: 4 }}>{'Sayı doğrusunda animasyonu izle!'}</div>
                </div>
                <button onClick={() => animateNumberLine(game.start, game.add)} style={{
                  width: '100%', padding: '8px 0', borderRadius: 8, border: 'none',
                  background: 'linear-gradient(135deg,' + THEME.accent + ',' + THEME.accentD + ')',
                  color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 6,
                }}>{'\▶ Animasyonu Başlat'}</button>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[game.answer - 1, game.answer, game.answer + 1, game.answer + 2].sort(() => Math.random() - 0.5).map((v, vi) => (
                    <button key={vi} onClick={() => {
                      if (game.feedback) return;
                      const ok = v === game.answer;
                      speak(ok ? 'Doğru!' : 'Yanlış.');
                      setGame({ ...game, feedback: ok ? 'correct' : 'wrong', score: game.score + (ok ? 1 : 0), total: game.total + 1 });
                      if (ok) setTimeout(() => {
                        const a2 = Math.floor(Math.random() * 7) - 3;
                        const b2 = [-3, -2, -1, 1, 2, 3][Math.floor(Math.random() * 6)];
                        setGame({ ...game, start: a2, add: b2, answer: a2 + b2, feedback: null, score: game.score + 1, total: game.total + 1 });
                        setNlJumps([]);
                        setNlPos(null);
                      }, 1500);
                    }} disabled={!!game.feedback} style={{
                      flex: 1, padding: '8px 0', borderRadius: 8,
                      border: game.feedback && v === game.answer ? '2px solid ' + THEME.green : '1.5px solid rgba(0,0,0,.06)',
                      background: game.feedback && v === game.answer ? 'rgba(34,197,94,.08)' : '#fff',
                      cursor: game.feedback ? 'default' : 'pointer',
                      fontSize: 14, fontWeight: 800, color: THEME.text, fontFamily: 'inherit',
                    }}>{v >= 0 ? '+' + v : '' + v}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Scenario */}
            {game.mode === 'scenario' && (
              <div>
                <div style={{ padding: '10px', borderRadius: 10, background: '#fff', border: '1.5px solid rgba(59,130,246,.15)', textAlign: 'center', marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: THEME.text, lineHeight: 1.5 }}>{SCENARIO_QUESTIONS[game.rqi].question}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {SCENARIO_QUESTIONS[game.rqi].options.map((c, ci) => {
                    const isCorrect = game.feedback && ci === SCENARIO_QUESTIONS[game.rqi].answer;
                    return (
                      <button key={ci} onClick={() => pickScenario(ci)} disabled={!!game.feedback} style={{
                        padding: '8px 12px', borderRadius: 8,
                        border: isCorrect ? '2px solid ' + THEME.green : '1.5px solid rgba(0,0,0,.06)',
                        background: isCorrect ? 'rgba(34,197,94,.08)' : '#fff',
                        cursor: game.feedback ? 'default' : 'pointer',
                        fontSize: 14, fontWeight: 700, color: isCorrect ? THEME.green : THEME.text, fontFamily: 'inherit',
                      }}>{c}{isCorrect ? ' \✅' : ''}</button>
                    );
                  })}
                </div>
                {game.feedback === 'correct' && <div style={{ marginTop: 6, padding: '6px 8px', borderRadius: 8, background: 'rgba(59,130,246,.06)', fontSize: 10, color: THEME.blue, fontWeight: 700, textAlign: 'center' }}>{SCENARIO_QUESTIONS[game.rqi].explanation}</div>}
                {game.feedback === 'wrong' && <div style={{ marginTop: 6, fontSize: 11, color: THEME.red, textAlign: 'center', fontWeight: 700 }}>{'\❌ Tekrar dene!'}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesTab;
