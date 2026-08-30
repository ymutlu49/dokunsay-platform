import { THEME } from '../../constants/theme';
import { actName, actDesc, DIFFICULTY_KEYS } from '../../constants/activities';
import { t } from '../../i18n/index.js';
import { SpeakButton } from '@shared/SpeakButton.jsx';

const ActivityModal = ({ activity, onClose, lang = 'tr' }) => {
  const title = actName(activity, lang);
  const body = actDesc(activity, lang);

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={(e) => e.stopPropagation()} data-activity-modal={activity.id} style={{
        background: '#fffdf7', borderRadius: 20, padding: '28px 32px', maxWidth: 480,
        boxShadow: '0 16px 48px rgba(0,0,0,.25)', textAlign: 'center', animation: 'popIn .35s',
      }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>{activity.icon}</div>

        <div data-activity-title style={{ fontSize: 20, fontWeight: 900, marginBottom: 4 }}>{title}</div>

        {/* Zorluk basamağı — STANDARDS §1.6 */}
        <div style={{ fontSize: 10, fontWeight: 700, color: '#d97706', marginBottom: 8 }}>
          {'★'.repeat(activity.difficulty) + ' · ' + t(lang, DIFFICULTY_KEYS[activity.difficulty])}
        </div>

        <div data-activity-desc style={{ fontSize: 14, marginBottom: 14, color: '#555', lineHeight: 1.6 }}>{body}</div>

        {/* Seslendirme — @shared/SpeakButton, ku sesi yoksa kendini çizmez */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <SpeakButton text={() => title + '. ' + body} lang={lang} size={34} />
        </div>

        {/* Kavram yanılgısı etiketi + literatür atfı — STANDARDS §1.5 */}
        {activity.mis && (
          <div data-activity-citation style={{
            textAlign: 'left', background: 'rgba(239,68,68,.05)', border: '1px solid rgba(239,68,68,.18)',
            borderRadius: 12, padding: '10px 12px', marginBottom: 16,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#b91c1c', marginBottom: 4 }}>
              {t(lang, 'act_misconception') + ': ' + t(lang, activity.mis)}
            </div>
            {activity.src && (
              <div style={{ fontSize: 9, color: '#777', lineHeight: 1.5 }}>
                {t(lang, 'act_source') + ': ' + activity.src}
              </div>
            )}
          </div>
        )}

        <button onClick={onClose} style={{
          padding: '10px 32px', borderRadius: 12, border: 'none',
          background: 'linear-gradient(135deg,' + THEME.accent + ',' + THEME.accentD + ')',
          color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer',
        }}>{t(lang, 'btn_start') + ' ▸'}</button>
      </div>
    </div>
  );
};

export default ActivityModal;
