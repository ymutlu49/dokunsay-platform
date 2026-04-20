export function createAudioContext() {
  try { return new (window.AudioContext || window.webkitAudioContext)(); }
  catch { return null; }
}

export function playTone(ctx, freq, type, duration, volume) {
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume || 0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch { /* ignore */ }
}

export function playGroup(ctx) {
  playTone(ctx, 523, "triangle", 0.1, 0.25);
  setTimeout(() => playTone(ctx, 784, "triangle", 0.15, 0.3), 80);
}

export function playBreak(ctx) {
  playTone(ctx, 392, "sawtooth", 0.08, 0.2);
  setTimeout(() => playTone(ctx, 261, "sawtooth", 0.12, 0.25), 70);
}

export function playAdd(ctx) { playTone(ctx, 440, "sine", 0.08, 0.2); }
export function playRemove(ctx) { playTone(ctx, 220, "triangle", 0.1, 0.15); }

export function playCorrect(ctx) {
  [523, 659, 784, 1046].forEach((f, i) =>
    setTimeout(() => playTone(ctx, f, "triangle", 0.12, 0.3), i * 80)
  );
}

export function playWrong(ctx) {
  playTone(ctx, 220, "square", 0.2, 0.25);
  setTimeout(() => playTone(ctx, 196, "square", 0.2, 0.3), 150);
}
