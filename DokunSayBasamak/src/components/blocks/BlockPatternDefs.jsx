export default function BlockPatternDefs() {
  return (
    <defs>
      <pattern id="pat-ones" patternUnits="userSpaceOnUse" width="4" height="4">
        <rect width="4" height="4" fill="#fde047"/>
        <circle cx="2" cy="2" r="1" fill="#a16207" opacity="0.6"/>
      </pattern>
      <pattern id="pat-tens" patternUnits="userSpaceOnUse" width="4" height="4">
        <rect width="4" height="4" fill="#fb923c"/>
        <line x1="0" y1="0" x2="4" y2="4" stroke="#c2410c" strokeWidth="1" opacity="0.5"/>
      </pattern>
      <pattern id="pat-huns" patternUnits="userSpaceOnUse" width="5" height="5">
        <rect width="5" height="5" fill="#60a5fa"/>
        <line x1="0" y1="2.5" x2="5" y2="2.5" stroke="#1d4ed8" strokeWidth="0.7" opacity="0.5"/>
        <line x1="2.5" y1="0" x2="2.5" y2="5" stroke="#1d4ed8" strokeWidth="0.7" opacity="0.5"/>
      </pattern>
      <pattern id="pat-ths" patternUnits="userSpaceOnUse" width="6" height="6">
        <rect width="6" height="6" fill="#a78bfa"/>
        <line x1="0" y1="0" x2="6" y2="6" stroke="#4c1d95" strokeWidth="1" opacity="0.5"/>
        <line x1="6" y1="0" x2="0" y2="6" stroke="#4c1d95" strokeWidth="1" opacity="0.5"/>
      </pattern>
    </defs>
  );
}
