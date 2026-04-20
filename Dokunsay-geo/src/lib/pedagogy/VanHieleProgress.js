// ══════════════════════════════════════════════════════════════
// VanHieleProgress — öğrenci ilerleme izleyicisi.
// Her seviye için {correct, attempted, acts} kaydı tutar; geçiş kriterini
// passCriteria.minCorrect ve minActivities üzerinden değerlendirir.
// ══════════════════════════════════════════════════════════════
import { VH_LEVELS } from "../../constants/vhLevels.js";

export const EMPTY_PROGRESS = () => ({
  0: { correct: 0, attempted: 0, acts: [] },
  1: { correct: 0, attempted: 0, acts: [] },
  2: { correct: 0, attempted: 0, acts: [] },
});

export class VanHieleProgress {
  constructor(progress = EMPTY_PROGRESS()) {
    this.progress = progress;
  }

  isLevelUnlocked(level) {
    if (level === 0) return true;
    const prev = this.progress[level - 1];
    if (!prev) return false;
    const crit = VH_LEVELS[level - 1].passCriteria;
    return prev.correct >= crit.minCorrect && prev.acts.length >= crit.minActivities;
  }

  isLevelCompleted(level) {
    const p = this.progress[level];
    if (!p) return false;
    const crit = VH_LEVELS[level].passCriteria;
    return p.correct >= crit.minCorrect && p.acts.length >= crit.minActivities;
  }

  recordAnswer(level, activityId, isCorrect) {
    const cur = this.progress[level] || { correct: 0, attempted: 0, acts: [] };
    const acts = cur.acts.includes(activityId) ? cur.acts : [...cur.acts, activityId];
    const next = {
      ...this.progress,
      [level]: {
        correct: cur.correct + (isCorrect ? 1 : 0),
        attempted: cur.attempted + 1,
        acts,
      },
    };
    return new VanHieleProgress(next);
  }

  toJSON() {
    return this.progress;
  }
}
