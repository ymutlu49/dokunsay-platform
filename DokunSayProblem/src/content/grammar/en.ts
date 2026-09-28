/** İngiliz İngilizcesi yardımcıları. */

export interface EnNoun {
  sg: string;
  pl: string;
}

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

export function numWordEn(n: number): string {
  if (!Number.isInteger(n) || n < 0) return String(n);
  if (n < 20) return ONES[n];
  if (n < 100) return n % 10 ? `${TENS[Math.floor(n / 10)]}-${ONES[n % 10]}` : TENS[n / 10];
  if (n < 1000) {
    const r = n % 100;
    return `${ONES[Math.floor(n / 100)]} hundred${r ? ` and ${numWordEn(r)}` : ''}`;
  }
  if (n < 1_000_000) {
    const r = n % 1000;
    return `${numWordEn(Math.floor(n / 1000))} thousand${r ? (r < 100 ? ` and ${numWordEn(r)}` : ` ${numWordEn(r)}`) : ''}`;
  }
  return String(n);
}

export const fmtEn = (n: number): string =>
  Number.isInteger(n) && n >= 1000 ? n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : String(n);

export const plEn = (n: number, noun: EnNoun): string => (n === 1 ? noun.sg : noun.pl);
export const possEn = (name: string): string => `${name}'s`;
export const capEn = (s: string): string => (s.length ? s[0].toUpperCase() + s.slice(1) : s);
