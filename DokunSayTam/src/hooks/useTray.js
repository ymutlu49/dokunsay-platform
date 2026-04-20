import { useState } from 'react';

/**
 * İşlem tepsisi (Sol / Sağ tepsi + operatör) mantığını yöneten hook.
 */
export const useTray = (animateNumberLine) => {
  const [trayA, setTrayA] = useState([]);
  const [trayB, setTrayB] = useState([]);
  const [operator, setOperator] = useState('+');
  const [showTray, setShowTray] = useState(false);
  const [result, setResult] = useState(null);
  const [animation, setAnimation] = useState(null);

  const valueA = trayA.filter((c) => c === 'pos').length - trayA.filter((c) => c === 'neg').length;
  const valueB = trayB.filter((c) => c === 'pos').length - trayB.filter((c) => c === 'neg').length;

  const calculate = () => {
    let r;
    let nlAdd = 0;

    if (operator === '+') { r = valueA + valueB; nlAdd = valueB; }
    else if (operator === '−') { r = valueA - valueB; nlAdd = -valueB; }
    else if (operator === '×') { r = valueA * valueB; nlAdd = r - valueA; }
    else { r = valueB !== 0 ? Math.round(valueA / valueB) : 0; nlAdd = r - valueA; }

    setAnimation('solving');

    if (operator === '+' || operator === '−') {
      animateNumberLine(valueA, nlAdd);
    }

    setTimeout(() => {
      setResult(r);
      setAnimation('done');
    }, 1200);
  };

  const reset = () => {
    setTrayA([]);
    setTrayB([]);
    setResult(null);
    setAnimation(null);
  };

  return {
    trayA, setTrayA,
    trayB, setTrayB,
    operator, setOperator,
    showTray, setShowTray,
    result, setResult,
    animation, setAnimation,
    valueA, valueB,
    calculate, reset,
  };
};
