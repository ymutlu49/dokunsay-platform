import { useState } from 'react';

/**
 * Sayı doğrusu animasyonu ve yürüyen insan mantığını yöneten hook.
 */
export const useNumberLine = () => {
  const [jumps, setJumps] = useState([]);
  const [position, setPosition] = useState(null);
  const [walkDirection, setWalkDirection] = useState('idle');

  const animateNumberLine = (start, add) => {
    if (add === 0) {
      setPosition(start);
      setWalkDirection('idle');
      return;
    }

    setJumps([]);
    setPosition(start);
    setWalkDirection(add > 0 ? 'right' : 'left');

    const newJumps = [];
    const direction = add > 0 ? 1 : -1;
    for (let i = 0; i < Math.abs(add); i++) {
      newJumps.push({
        from: start + i * direction,
        to: start + (i + 1) * direction,
        step: i + 1,
      });
    }

    let idx = 0;
    const next = () => {
      if (idx >= newJumps.length) {
        setWalkDirection('idle');
        return;
      }
      setJumps((prev) => [...prev, newJumps[idx]]);
      setPosition(newJumps[idx].to);
      idx++;
      setTimeout(next, 600);
    };
    next();
  };

  const walkStep = (dir) => {
    const delta = dir === 'right' ? 1 : -1;
    setWalkDirection(dir);
    setPosition((prev) => {
      const current = prev === null ? 0 : prev;
      const next = Math.max(-10, Math.min(10, current + delta));
      setJumps((j) => [...j, { from: current, to: next, step: j.length + 1 }]);
      return next;
    });
    setTimeout(() => setWalkDirection('idle'), 500);
  };

  const walkTo = (target) => {
    setPosition((current) => {
      const cur = current === null ? 0 : current;
      if (target === cur) return cur;

      const direction = target > cur ? 1 : -1;
      setWalkDirection(direction > 0 ? 'right' : 'left');
      setJumps([]);

      const newJumps = [];
      for (let i = 0; i < Math.abs(target - cur); i++) {
        newJumps.push({
          from: cur + i * direction,
          to: cur + (i + 1) * direction,
          step: i + 1,
        });
      }

      let idx = 0;
      const next = () => {
        if (idx >= newJumps.length) {
          setWalkDirection('idle');
          return;
        }
        setJumps((prev) => [...prev, newJumps[idx]]);
        setPosition(newJumps[idx].to);
        idx++;
        setTimeout(next, 500);
      };
      next();
      return cur;
    });
  };

  const resetNumberLine = () => {
    setJumps([]);
    setPosition(null);
    setWalkDirection('idle');
  };

  return {
    jumps, setJumps,
    position, setPosition,
    walkDirection, setWalkDirection,
    animateNumberLine, walkStep, walkTo, resetNumberLine,
  };
};
