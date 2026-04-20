/** İşlem quiz soruları */
export const QUIZ_QUESTIONS = [
  { question: '(+3)+(+5)=?', options: ['+8', '+2', '−8', '−2'], answer: 0 },
  { question: '(−4)+(−3)=?', options: ['−1', '+7', '−7', '+1'], answer: 2 },
  { question: '(+6)+(−4)=?', options: ['+10', '+2', '−2', '−10'], answer: 1 },
  { question: '(−7)+(+7)=?', options: ['+14', '−14', '0', '+7'], answer: 2 },
  { question: '(+5)−(+8)=?', options: ['+3', '−3', '+13', '−13'], answer: 1 },
  { question: '(−3)−(−5)=?', options: ['−8', '+2', '−2', '+8'], answer: 1 },
  { question: '(+4)×(−2)=?', options: ['+8', '−8', '+6', '−6'], answer: 1 },
  { question: '(−3)×(−3)=?', options: ['−9', '+9', '−6', '+6'], answer: 1 },
  { question: '(−12)÷(+4)=?', options: ['+3', '−3', '+8', '−8'], answer: 1 },
  { question: '(+10)÷(−2)=?', options: ['+5', '−5', '+8', '−8'], answer: 1 },
  { question: '(−1)+(−1)+(−1)=?', options: ['−3', '+3', '0', '−1'], answer: 0 },
  { question: '(+8)+(−8)=?', options: ['+16', '−16', '0', '8'], answer: 2 },
  { question: '(−2)−(+3)=?', options: ['+1', '−1', '−5', '+5'], answer: 2 },
  { question: '0−(−4)=?', options: ['−4', '+4', '0', '4'], answer: 1 },
  { question: '(−5)×(+0)=?', options: ['−5', '+5', '0', '5'], answer: 2 },
];

/** Senaryo soruları */
export const SCENARIO_QUESTIONS = [
  { question: '🏢 Asansör: 2. kattan 5 kat aşağı inerseniz kaçıncı kattasınız?', options: ['+7', '−3', '+3', '−7'], answer: 1, explanation: '(+2)+(−5)=−3 → Bodrum 3. kat' },
  { question: '🌡️ Sabah +3°C. Gece 7°C düştü. Sıcaklık kaç?', options: ['−4', '−10', '+4', '+10'], answer: 0, explanation: '(+3)+(−7)=−4°C' },
  { question: '💰 50₺ var, 80₺ harcadın. Durumun nedir?', options: ['−30', '−130', '+30', '+130'], answer: 0, explanation: '(+50)+(−80)=−30₺ borç' },
  { question: '🐟 Balık −3m, kuş +5m. Aralarında kaç m?', options: ['2', '8', '−2', '−8'], answer: 1, explanation: '|+5−(−3)|=|+5+3|=8 birim' },
  { question: '🏢 Bodrum 2\'den (+4) kat çıktın. Kaçıncı kat?', options: ['+6', '+2', '−6', '−2'], answer: 1, explanation: '(−2)+(+4)=+2 → 2. kat' },
  { question: '🌡️ −5°C. Güneş 12°C ısıttı. Kaç derece?', options: ['+7', '−17', '−7', '+17'], answer: 0, explanation: '(−5)+(+12)=+7°C' },
];
