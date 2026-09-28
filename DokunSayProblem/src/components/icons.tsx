/**
 * Basit satır içi SVG simgeler (emoji yerine — anlam emojiye yüklenmez, TTS okumaz).
 * Hepsi `currentColor` kullanır; boyut `size` ile.
 */
import type { MainStep, SchemaId } from '../content/types';

interface P {
  size?: number;
  className?: string;
}

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
});

export function StepIcon({ step, size = 24, className }: P & { step: MainStep }) {
  const p = { ...base(size), className };
  switch (step) {
    case 'understand': // kulak
      return (
        <svg {...p}>
          <path d="M7 10a5 5 0 1 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 0" />
          <path d="M10 10a2 2 0 1 1 4 0c0 1.2-1 1.6-1.5 2.5" />
        </svg>
      );
    case 'show': // iki şerit + parça
      return (
        <svg {...p}>
          <rect x="3" y="5" width="18" height="5" rx="1.5" />
          <rect x="3" y="14" width="10" height="5" rx="1.5" />
          <rect x="15" y="14" width="6" height="5" rx="1.5" strokeDasharray="2 2" />
        </svg>
      );
    case 'estimate': // hedef
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="0.8" fill="currentColor" />
        </svg>
      );
    case 'solve': // kalem
      return (
        <svg {...p}>
          <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />
          <path d="M14 7l3 3" />
        </svg>
      );
    case 'check': // onay
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12.5l2.8 2.8L16.5 9.5" />
        </svg>
      );
  }
}

export function SchemaIcon({ schema, size = 40, className }: P & { schema: SchemaId }) {
  const p = { ...base(size), viewBox: '0 0 48 32', strokeWidth: 2.2, className };
  switch (schema) {
    case 'change':
      return (
        <svg {...p}>
          <rect x="2" y="10" width="12" height="12" rx="2" />
          <path d="M17 16h12m-4-4 4 4-4 4" />
          <rect x="32" y="8" width="14" height="16" rx="2" />
        </svg>
      );
    case 'combine':
      return (
        <svg {...p}>
          <rect x="2" y="3" width="44" height="9" rx="2" />
          <rect x="2" y="19" width="26" height="9" rx="2" />
          <rect x="30" y="19" width="16" height="9" rx="2" />
        </svg>
      );
    case 'compare':
      return (
        <svg {...p}>
          <rect x="2" y="4" width="44" height="9" rx="2" />
          <rect x="2" y="19" width="28" height="9" rx="2" />
          <rect x="32" y="19" width="14" height="9" rx="2" strokeDasharray="3 2" />
        </svg>
      );
    case 'equalGroups':
      return (
        <svg {...p}>
          <rect x="2" y="3" width="44" height="8" rx="2" />
          <rect x="2" y="18" width="13" height="10" rx="2" />
          <rect x="17.5" y="18" width="13" height="10" rx="2" />
          <rect x="33" y="18" width="13" height="10" rx="2" />
        </svg>
      );
    case 'multCompare':
      return (
        <svg {...p}>
          <rect x="2" y="4" width="12" height="9" rx="2" />
          <rect x="2" y="19" width="12" height="9" rx="2" />
          <rect x="16" y="19" width="12" height="9" rx="2" />
          <rect x="30" y="19" width="12" height="9" rx="2" />
        </svg>
      );
  }
}

export function BulbIcon({ size = 22 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" />
    </svg>
  );
}

export function LensIcon({ size = 20 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" />
    </svg>
  );
}

export function OkMark({ size = 16 }: P) {
  return (
    <svg {...base(size)} strokeWidth={3}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function BangMark({ size = 16 }: P) {
  return (
    <svg {...base(size)} strokeWidth={3}>
      <path d="M12 5v9" />
      <circle cx="12" cy="19" r="0.9" fill="currentColor" />
    </svg>
  );
}

export function ArrowIcon({ size = 20, dir = 'right' }: P & { dir?: 'right' | 'left' | 'up' | 'down' }) {
  const rot = { right: 0, down: 90, left: 180, up: 270 }[dir];
  return (
    <svg {...base(size)} style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M4 12h15m-5-5 5 5-5 5" />
    </svg>
  );
}

export function ShareIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.3 10.8l7.4-3.6M8.3 13.2l7.4 3.6" />
    </svg>
  );
}

export function HomeIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v10h12V10" />
    </svg>
  );
}

export function PlayIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <path d="M8 5l11 7-11 7z" fill="currentColor" />
    </svg>
  );
}

export function StopIcon({ size = 18 }: P) {
  return (
    <svg {...base(size)}>
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
    </svg>
  );
}

export function GuideIcon({ size = 30 }: P) {
  // Sade "Rehber" rozeti (maskot değil): konuşma balonu içinde yol işareti.
  return (
    <svg {...base(size)} viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="currentColor" stroke="none" opacity="0.14" />
      <path d="M10 22V10h9l3 3-3 3h-9" />
    </svg>
  );
}
