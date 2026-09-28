/**
 * Şema kataloğu meta verisi (DESIGN §3) ve diyagram kutu başlıkları.
 * Renkler Okabe-Ito (renk körü dostu) paletinden; emoji YOK — `icon` SVG yol anahtarıdır.
 * Kurmancî: FerMat terimleri (berhevdan, gişt, kemok, carkirin, parkirin…) yönerge dilinde.
 */
import type { L10n, Role, SchemaId } from './types';

export interface SchemaMeta {
  name: L10n;
  short: L10n;
  story: L10n;
  /** H2 ipucu: şema kuralı (yapıya dayanır; anahtar sözcüğe DEĞİL). */
  rule: L10n;
  equation: L10n;
  color: string;
  icon: string;
}

// KU-DENETİM: şema adları ve kural cümleleri (FerMat terimleri sabit, cümle kuruluşu denetlenmeli).
export const SCHEMA_META: Record<SchemaId, SchemaMeta> = {
  change: {
    name: { tr: 'Değişim', ku: 'Guherîn', en: 'Change' },
    short: { tr: 'Bir şey gelir ya da gider.', ku: 'Tiştek tê an diçe.', en: 'Something comes or goes.' },
    story: {
      tr: 'Başta bir miktar var. Sonra bir şey olur: gelen ya da giden olur. Sonunda yeni bir miktar olur.',
      ku: 'Di destpêkê de hejmarek heye. Paşê tiştek diqewime: tiştek tê an diçe. Di dawiyê de hejmareke nû heye.',
      en: 'There is an amount at the start. Then something happens: some come or some go. At the end there is a new amount.',
    },
    rule: {
      tr: 'Bir şey geldiyse "sonra" bütündür; bir şey gittiyse "başta" bütündür. Bütün bilinmiyorsa parçaları birleştiririz; parça bilinmiyorsa bütünden ayırırız.',
      ku: 'Heke tiştek hatibe, "paşê" gişt e; heke tiştek çûbe, "destpêk" gişt e. Heke gişt nayê zanîn, em parçeyan dikin yek; heke parçeyek nayê zanîn, em wê ji giştê vediqetînin.',
      en: 'If something came, "after" is the whole; if something went, "start" is the whole. If the whole is unknown, we put the parts together; if a part is unknown, we take it away from the whole.',
    },
    equation: { tr: 'Başta ± Değişim = Sonra', ku: 'Destpêk ± Guherîn = Paşê', en: 'Start ± Change = After' },
    color: '#0072B2',
    icon: 'change',
  },
  combine: {
    name: { tr: 'Parça-Bütün', ku: 'Parçe û Gişt', en: 'Part-Part-Whole' },
    short: { tr: 'İki parça birlikte bir bütün yapar.', ku: 'Du parçe bi hev re giştekê çêdikin.', en: 'Two parts make a whole together.' },
    story: {
      tr: 'Hiçbir şey gelip gitmez. İki grup vardır; ikisi birlikte bütünü oluşturur.',
      ku: 'Tu tişt nayê û naçe. Du kom hene; her du bi hev re giştê çêdikin.',
      en: 'Nothing comes or goes. There are two groups; together they make the whole.',
    },
    rule: {
      tr: 'Bütün bilinmiyorsa parçaları birleştiririz; parça bilinmiyorsa bütünden öbür parçayı ayırırız.',
      ku: 'Heke gişt nayê zanîn, em parçeyan dikin yek; heke parçeyek nayê zanîn, em parçeya din ji giştê vediqetînin.',
      en: 'If the whole is unknown, we put the parts together; if a part is unknown, we take the other part away from the whole.',
    },
    equation: { tr: 'Parça + Parça = Bütün', ku: 'Parçe + Parçe = Gişt', en: 'Part + Part = Whole' },
    color: '#009E73',
    icon: 'combine',
  },
  compare: {
    name: { tr: 'Karşılaştırma', ku: 'Berhevdan', en: 'Compare' },
    short: { tr: 'İki miktar yan yana konur.', ku: 'Du hejmar li kêleka hev tên danîn.', en: 'Two amounts are set side by side.' },
    story: {
      tr: 'İki ayrı miktar vardır. Biri daha çok, biri daha azdır. Aradaki fark da bir miktardır.',
      ku: 'Du hejmarên cuda hene. Yek zêdetir e, yek kêmtir e. Kemoka di navbera wan de jî hejmarek e.',
      en: 'There are two separate amounts. One is more, one is less. The difference between them is an amount too.',
    },
    rule: {
      tr: 'Önce kimin daha çok olduğunu bul. Büyük miktar bütündür: küçük miktar ile fark onu oluşturur. Büyük bilinmiyorsa küçük ile farkı birleştiririz; küçük ya da fark bilinmiyorsa büyükten ayırırız.',
      ku: 'Pêşî bibîne kê zêdetir heye. Hejmara mezin gişt e: hejmara biçûk û kemok wê çêdikin. Heke ya mezin nayê zanîn, em ya biçûk û kemokê dikin yek; heke ya biçûk an kemok nayê zanîn, em ji ya mezin vediqetînin.',
      en: 'First find who has more. The larger amount is the whole: the smaller amount and the difference make it. If the larger is unknown, we put the smaller and the difference together; if the smaller or the difference is unknown, we take away from the larger.',
    },
    equation: { tr: 'Büyük − Küçük = Fark', ku: 'Mezin − Biçûk = Kemok', en: 'Larger − Smaller = Difference' },
    color: '#D55E00',
    icon: 'compare',
  },
  equalGroups: {
    name: { tr: 'Eşit Gruplar', ku: 'Komên Wekhev', en: 'Equal Groups' },
    short: { tr: 'Her grupta aynı sayıda şey vardır.', ku: 'Di her komê de heman hejmar tişt hene.', en: 'Each group has the same number of things.' },
    story: {
      tr: 'Birkaç grup vardır ve her grupta eşit sayıda nesne bulunur. Hepsi birlikte toplamı yapar.',
      ku: 'Çend kom hene û di her komê de hejmareke wekhev tişt heye. Hemû bi hev re giştê çêdikin.',
      en: 'There are some groups, and each group has the same number of things. All together they make the total.',
    },
    rule: {
      tr: 'Grup sayısı × her gruptaki = toplam. Toplam bilinmiyorsa eşit grupları birleştiririz (çarparız); grup sayısı ya da her gruptaki bilinmiyorsa toplamı eşit gruplara ayırırız (böleriz).',
      ku: 'Hejmara koman × ya di her komê de = bi giştî. Heke bi giştî nayê zanîn, em komên wekhev dikin yek (carkirin); heke hejmara koman an ya di her komê de nayê zanîn, em giştê li komên wekhev par dikin (parkirin).',
      en: 'Number of groups × number in each group = total. If the total is unknown, we put the equal groups together (multiply); if the number of groups or the number in each group is unknown, we split the total into equal groups (divide).',
    },
    equation: { tr: 'Grup sayısı × Her grupta = Toplam', ku: 'Hejmara koman × Di her komê de = Bi giştî', en: 'Groups × In each group = Total' },
    color: '#CC79A7',
    icon: 'equalGroups',
  },
  multCompare: {
    name: { tr: 'Kat Karşılaştırması', ku: 'Berhevdana Carî', en: 'Times Comparison' },
    short: { tr: 'Bir miktar ötekinin birkaç katıdır.', ku: 'Hejmarek çend carê ya din e.', en: 'One amount is a number of times another.' },
    story: {
      tr: 'Bir miktar ölçü şeridi gibidir. Öbür miktar bu şeridin birkaç tanesi kadardır ya da onun bir parçasıdır.',
      ku: 'Hejmarek wek şerîdeke pîvanê ye. Hejmara din çend caran qasî vê şerîdê ye an jî parçeyek ji wê ye.',
      en: 'One amount is like a measuring strip. The other amount is several of these strips, or one part of it.',
    },
    rule: {
      tr: 'Referans 1 şerittir; karşılaştırılan aynı şeritten "kat" tanedir. Karşılaştırılan bilinmiyorsa şeridi kat kadar tekrarlarız; referans bilinmiyorsa büyük miktarı kat kadar eşit parçaya ayırırız. "4 fazla" ile "4 katı" aynı şey değildir.',
      ku: 'Referans şerîdek e; ya tê berhevdan "car" qasî heman şerîdê ye. Heke ya tê berhevdan nayê zanîn, em şerîdê car qasî dubare dikin; heke referans nayê zanîn, em hejmara mezin li parçeyên wekhev par dikin. "4 zêdetir" û "4 carî" ne heman tişt in.',
      en: 'The reference is 1 strip; the compared amount is that many strips. If the compared amount is unknown, we repeat the strip that many times; if the reference is unknown, we split the larger amount into that many equal parts. "4 more" and "4 times" are not the same.',
    },
    equation: { tr: 'Kat × Referans = Karşılaştırılan', ku: 'Car × Referans = Ya tê berhevdan', en: 'Times × Reference = Compared' },
    color: '#E69F00',
    icon: 'multCompare',
  },
};

// KU-DENETİM: kutu başlıkları (Paşê, Referans, Ya tê berhevdan).
export const ROLE_LABEL: Record<Role, L10n> = {
  start: { tr: 'Başta', ku: 'Destpêk', en: 'Start' },
  change: { tr: 'Değişim', ku: 'Guherîn', en: 'Change' },
  result: { tr: 'Sonra', ku: 'Paşê', en: 'After' },
  part1: { tr: 'Parça', ku: 'Parçe', en: 'Part' },
  part2: { tr: 'Parça', ku: 'Parçe', en: 'Part' },
  whole: { tr: 'Bütün', ku: 'Gişt', en: 'Whole' },
  larger: { tr: 'Büyük', ku: 'Mezin', en: 'Larger' },
  smaller: { tr: 'Küçük', ku: 'Biçûk', en: 'Smaller' },
  difference: { tr: 'Fark', ku: 'Kemok', en: 'Difference' },
  groups: { tr: 'Grup sayısı', ku: 'Hejmara koman', en: 'Number of groups' },
  perGroup: { tr: 'Her grupta', ku: 'Di her komê de', en: 'In each group' },
  total: { tr: 'Toplam', ku: 'Bi giştî', en: 'Total' },
  reference: { tr: 'Referans', ku: 'Referans', en: 'Reference' },
  factor: { tr: 'Kat', ku: 'Car', en: 'Times' },
  compared: { tr: 'Karşılaştırılan', ku: 'Ya tê berhevdan', en: 'Compared' },
};
