import {
  ACTIVITIES, CATEGORY_ORDER, CATEGORY_KEYS, CATEGORY_COLORS,
  DIFFICULTY_KEYS, actName,
} from '../../constants/activities';
import { THEME } from '../../constants/theme';
import { t } from '../../i18n/index.js';

const ActivitiesTab = ({ activeTemplate, setActiveTemplate, setInstructionScreen, lang = 'tr' }) => (
  <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
    {CATEGORY_ORDER.map((cat) => {
      const acts = ACTIVITIES.filter((a) => a.category === cat);
      if (!acts.length) return null;

      return (
        <div key={cat}>
          <div style={{
            fontSize: 8, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: 1.5, color: CATEGORY_COLORS[cat] || '#999',
            margin: '8px 0 4px',
          }}>
            {t(lang, CATEGORY_KEYS[cat] || cat)}
          </div>
          {acts.map((activity) => {
            const isActive = activeTemplate && activeTemplate.id === activity.id;
            return (
              <button
                key={activity.id}
                data-activity-id={activity.id}
                data-difficulty={activity.difficulty}
                onClick={() => { setActiveTemplate(activity); setInstructionScreen(activity); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 8px', width: '100%',
                  background: isActive ? THEME.accentL : THEME.card,
                  border: isActive ? '2px solid ' + THEME.accent : '1px solid ' + THEME.sideB,
                  borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                  textAlign: 'left', color: THEME.text, marginBottom: 3,
                  fontSize: 10, fontWeight: isActive ? 900 : 600,
                }}
              >
                <span style={{ fontSize: 14 }}>{activity.icon}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {actName(activity, lang)}
                </span>
                <span
                  style={{ fontSize: 7, color: '#d97706' }}
                  title={t(lang, DIFFICULTY_KEYS[activity.difficulty])}
                >
                  {'★'.repeat(activity.difficulty)}
                </span>
              </button>
            );
          })}
        </div>
      );
    })}
  </div>
);

export default ActivitiesTab;
