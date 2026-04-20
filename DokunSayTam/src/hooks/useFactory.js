import { useState } from 'react';

/**
 * Tam-Say Fabrikası: 3 aşamalı pedagojik pul üretim simülasyonu.
 */
export const useFactory = (addItem, animateNumberLine, showNumberLine, GRID) => {
  const [showFactory, setShowFactory] = useState(false);
  const [posCount, setPosCount] = useState(0);
  const [negCount, setNegCount] = useState(0);
  const [step, setStep] = useState(0);

  const pairs = Math.min(posCount, negCount);
  const result = posCount - negCount;

  const mix = () => {
    if (posCount === 0 && negCount === 0) return;
    setStep(1);
    setTimeout(() => setStep(2), 1200);
  };

  const solve = () => {
    for (let i = 0; i < posCount; i++) addItem('pos', 1, 100 + i * GRID, 200);
    for (let j = 0; j < negCount; j++) addItem('neg', 1, 100 + j * GRID, 260);
    if (showNumberLine && Math.abs(result) <= 10) animateNumberLine(0, result);
  };

  const reset = () => {
    setPosCount(0);
    setNegCount(0);
    setStep(0);
  };

  return {
    showFactory, setShowFactory,
    posCount, setPosCount,
    negCount, setNegCount,
    step, setStep,
    pairs, result,
    mix, solve, reset,
  };
};
