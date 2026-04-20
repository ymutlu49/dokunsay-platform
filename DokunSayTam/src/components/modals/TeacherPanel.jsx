import { ACTIVITIES, LESSONS } from '../../constants/activities';
import { THEME } from '../../constants/theme';

const TeacherPanel = ({
  onClose, studentName, setStudentName, studentClass, setStudentClass,
  notes, setNotes, completed, setCompleted, game,
}) => (
  <div onClick={onClose} style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div onClick={(e) => e.stopPropagation()} style={{
      background: '#fff', borderRadius: 24, padding: '28px 32px', maxWidth: 580,
      width: '92%', maxHeight: '90vh', overflowY: 'auto', animation: 'popIn .3s',
    }}>
      <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>{'👨‍🏫 Öğretmen Paneli'}</div>

      {/* Öğrenci bilgileri */}
      <div style={{ background: THEME.accentL, borderRadius: 14, padding: '14px', marginBottom: 14, border: '1.5px solid rgba(245,158,11,.12)' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: THEME.accentD, marginBottom: 8 }}>{'👤 Öğrenci'}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Ad..." style={{
            flex: 2, padding: '7px 10px', borderRadius: 8, border: '1.5px solid #ddd',
            fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
          }} />
          <input value={studentClass} onChange={(e) => setStudentClass(e.target.value)} placeholder="Sınıf..." style={{
            flex: 1, padding: '7px 10px', borderRadius: 8, border: '1.5px solid #ddd',
            fontSize: 12, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
          }} />
        </div>
      </div>

      {/* İlerleme */}
      <div style={{ background: 'rgba(34,197,94,.04)', borderRadius: 14, padding: '14px', marginBottom: 14, border: '1.5px solid rgba(34,197,94,.12)' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: THEME.green, marginBottom: 8 }}>
          {'\✅ İlerleme \— ' + Object.keys(completed).length + '/' + ACTIVITIES.length}
        </div>
        <div style={{ width: '100%', height: 6, borderRadius: 3, background: '#eee', marginBottom: 8 }}>
          <div style={{ height: 6, borderRadius: 3, background: THEME.green, width: (Object.keys(completed).length / ACTIVITIES.length * 100) + '%' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {ACTIVITIES.map((a, ai) => {
            const done = !!completed[a.name];
            return (
              <div key={ai} onClick={() => {
                const nc = { ...completed };
                if (done) delete nc[a.name]; else nc[a.name] = true;
                setCompleted(nc);
              }} style={{
                padding: '3px 8px', borderRadius: 6,
                background: done ? 'rgba(34,197,94,.1)' : '#f5f5f5',
                border: done ? '1.5px solid rgba(34,197,94,.3)' : '1px solid #e5e5e5',
                cursor: 'pointer', fontSize: 9, fontWeight: done ? 700 : 500,
                color: done ? THEME.green : '#888',
              }}>{done ? '\✅ ' : ''}{a.name}</div>
            );
          })}
        </div>
      </div>

      {/* Ders planları */}
      <div style={{ background: 'rgba(139,92,246,.04)', borderRadius: 14, padding: '14px', marginBottom: 14, border: '1.5px solid rgba(139,92,246,.12)' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#6d28d9', marginBottom: 8 }}>{'📚 Ders Planları'}</div>
        {LESSONS.map((ls, li) => {
          const indices = ls.activityIndices || [];
          const doneCount = indices.filter((ai) => completed[ACTIVITIES[ai]?.name]).length;
          return (
            <div key={li} style={{ padding: '6px 8px', marginBottom: 3, borderRadius: 6, background: '#fff', border: '1px solid rgba(0,0,0,.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 10, fontWeight: 800 }}>{ls.name}</span>
                <span style={{ fontSize: 9, fontWeight: 700, color: doneCount === indices.length && indices.length > 0 ? THEME.green : '#aaa' }}>
                  {doneCount + '/' + indices.length}
                </span>
              </div>
              <div style={{ fontSize: 8, color: '#888' }}>{ls.description}</div>
            </div>
          );
        })}
      </div>

      {/* Notlar */}
      <div style={{ background: THEME.accentL, borderRadius: 14, padding: '14px', marginBottom: 14, border: '1.5px solid rgba(245,158,11,.12)' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: THEME.accentD, marginBottom: 8 }}>{'📝 Notlar'}</div>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Gözlemler..." rows={3} style={{
          width: '100%', padding: '8px', borderRadius: 8, border: '1.5px solid #ddd',
          fontSize: 12, fontFamily: 'inherit', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
        }} />
      </div>

      {/* Butonlar */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button onClick={() => { setCompleted({}); setStudentName(''); setStudentClass(''); setNotes(''); }} style={{
          padding: '8px 20px', borderRadius: 10, border: '1.5px solid ' + THEME.red,
          background: 'rgba(239,68,68,.04)', cursor: 'pointer', fontSize: 12, fontWeight: 700,
          color: THEME.red, fontFamily: 'inherit',
        }}>{'\↺ Sıfırla'}</button>
        <button onClick={() => {
          const data = {
            student: studentName, class: studentClass, notes,
            completed: Object.keys(completed), total: ACTIVITIES.length,
            gameScore: game ? game.score : 0, date: new Date().toLocaleDateString('tr-TR'),
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          const link = document.createElement('a');
          link.download = (studentName || 'ogrenci') + '_tamsayilar.json';
          link.href = URL.createObjectURL(blob);
          link.click();
        }} style={{
          padding: '8px 20px', borderRadius: 10, border: '1.5px solid ' + THEME.blue,
          background: 'rgba(59,130,246,.04)', cursor: 'pointer', fontSize: 12, fontWeight: 700,
          color: THEME.blue, fontFamily: 'inherit',
        }}>{'📥 Rapor'}</button>
        <button onClick={onClose} style={{
          padding: '8px 24px', borderRadius: 10, border: 'none',
          background: 'linear-gradient(135deg,' + THEME.accent + ',' + THEME.accentD + ')',
          color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
        }}>Kapat</button>
      </div>
    </div>
  </div>
);

export default TeacherPanel;
