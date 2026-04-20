import { PALETTE } from './palette';

export const BLOCK_TYPES = [
  { t: "ones", label: "Birlik Küp",   val: 1,    color: PALETTE.ones, colorB: PALETTE.onesB, icon: "▪", w: 14,  h: 14,  ariaDesc: "Bir birlik küp, değeri 1" },
  { t: "tens", label: "Onluk Çubuk", val: 10,   color: PALETTE.tens, colorB: PALETTE.tensB, icon: "▐", w: 14,  h: 140, ariaDesc: "Bir onluk çubuk, değeri 10" },
  { t: "huns", label: "Yüzlük Kare", val: 100,  color: PALETTE.huns, colorB: PALETTE.hunsB, icon: "■", w: 140, h: 140, ariaDesc: "Bir yüzlük kare, değeri 100" },
  { t: "ths",  label: "Binlik Küp",  val: 1000, color: PALETTE.ths,  colorB: PALETTE.thsB,  icon: "▣", w: 160, h: 160, ariaDesc: "Bir binlik küp, değeri 1000" },
];

export const SUP = { ones: "tens", tens: "huns", huns: "ths" };
export const SUB = { ths: "huns", huns: "tens", tens: "ones" };
