import type { ComponentType } from 'react';
import type { Sozluk } from '../i18n';
import OnlukCerceve from './OnlukCerceve';
import NoktaKart from './NoktaKart';
import Rekenrek from './Rekenrek';
import SayiDogrusu from './SayiDogrusu';
import YuzlukTablo from './YuzlukTablo';
import ParcaButun from './ParcaButun';
import DiziModeli from './DiziModeli';
import BasamakBloklari from './BasamakBloklari';

export interface AracTanimi {
  id: string;
  ad: keyof Sozluk;
  alt: keyof Sozluk;
  /** Aracın doğrudan desteklediği etkinlik kartları. */
  kartlar: string[];
  /** styles.css içindeki .renk-N sınıfı; araç kartına ve denetimlere uygulanır. */
  renk: number;
  bilesen: ComponentType;
}

/**
 * Kitabın sekiz tekrar eden şekil ailesi, sırasıyla.
 * Sıra kitaptaki öğretim sırasını izler: sanbil → beşli yapı → basamak →
 * yol gösterimi → örüntü → parça-bütün → çarpımsal bakış.
 */
export const ARACLAR: AracTanimi[] = [
  {
    id: 'nokta',
    renk: 1,
    ad: 'aracNoktaKart',
    alt: 'aracNoktaKartAlt',
    kartlar: ['1.1', '1.2', '1.5', '1.6', '1.7'],
    bilesen: NoktaKart,
  },
  {
    id: 'onluk',
    renk: 1,
    ad: 'aracOnlukCerceve',
    alt: 'aracOnlukCerceveAlt',
    kartlar: ['1.3', '1.4', '2.5', '3.1'],
    bilesen: OnlukCerceve,
  },
  {
    id: 'rekenrek',
    renk: 2,
    ad: 'aracRekenrek',
    alt: 'aracRekenrekAlt',
    kartlar: ['2.1', '2.2', '2.4'],
    bilesen: Rekenrek,
  },
  {
    id: 'basamak',
    renk: 3,
    ad: 'aracBasamak',
    alt: 'aracBasamakAlt',
    kartlar: ['3.1', '3.3'],
    bilesen: BasamakBloklari,
  },
  {
    id: 'yuzluk',
    renk: 3,
    ad: 'aracYuzlukTablo',
    alt: 'aracYuzlukTabloAlt',
    kartlar: ['3.2', '6.6'],
    bilesen: YuzlukTablo,
  },
  {
    id: 'sayidogrusu',
    renk: 5,
    ad: 'aracSayiDogrusu',
    alt: 'aracSayiDogrusuAlt',
    kartlar: ['4.1', '5.6', '8.4'],
    bilesen: SayiDogrusu,
  },
  {
    id: 'parcabutun',
    renk: 4,
    ad: 'aracParcaButun',
    alt: 'aracParcaButunAlt',
    kartlar: ['1.4', '5.1', '7.2'],
    bilesen: ParcaButun,
  },
  {
    id: 'dizi',
    renk: 6,
    ad: 'aracDizi',
    alt: 'aracDiziAlt',
    kartlar: ['6.1', '6.2', '6.3'],
    bilesen: DiziModeli,
  },
];

export function aracBul(id: string) {
  return ARACLAR.find((a) => a.id === id);
}

/** Bir etkinlik kartını doğrudan destekleyen araç (varsa). */
export function kartinAraci(kartId: string) {
  return ARACLAR.find((a) => a.kartlar.includes(kartId));
}
