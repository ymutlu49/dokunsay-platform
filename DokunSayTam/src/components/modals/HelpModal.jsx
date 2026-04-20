import { THEME } from '../../constants/theme';

const HELP_ITEMS = [
  '\• \⊕ Pozitif ve \⊖ Negatif pulları kanvasa sürükle',
  '\• Bir \⊕ + bir \⊖ = sıfır çifti (birbirini yok eder)',
  '\• 🧮 İşlem Tepsisi \→ iki tarafta pul yerleştir, işlem seç, hesapla',
  '\• 🏭 Tam-Say Fabrikası \→ \⊕ ve \⊖ butonlarıyla pul üret',
  '\• 📏 Sayı doğrusunda yürüyen insan \→ \◀ Sola / Sağa \▶ butonlarıyla yürüt',
  '\• 🏢 Asansör ve 🌡️ Termometre \→ \⚙\️ sekmesinde',
  '\• 🎮 Oyunlar \→ Quiz, karşılaştır, sayı doğrusu, senaryo soruları',
  '\• \✏\️ Kalem ile çizim yap, 🧹 silgi ile sil',
];

const HelpModal = ({ onClose }) => (
  <div onClick={onClose} style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div onClick={(e) => e.stopPropagation()} style={{
      background: '#fff', borderRadius: 20, padding: '24px 28px', maxWidth: 480,
      fontSize: 13, lineHeight: 2, color: '#444',
    }}>
      <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 10 }}>Kullanım Kılavuzu</div>
      {HELP_ITEMS.map((item, i) => <div key={i}>{item}</div>)}
      <button onClick={onClose} style={{
        marginTop: 14, padding: '8px 24px', borderRadius: 10, border: 'none',
        background: 'linear-gradient(135deg,' + THEME.accent + ',' + THEME.accentD + ')',
        color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer',
      }}>Kapat</button>
    </div>
  </div>
);

export default HelpModal;
