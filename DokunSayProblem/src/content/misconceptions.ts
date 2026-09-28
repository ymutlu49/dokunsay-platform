/**
 * Sözel problem yanılgıları — öğretmen notları ve kaynaklar (02 §A4–A5, 03 §A7, 04 §F.2).
 * `Problem.targets` bu kimliklere başvurur; `errorClass` ayrık puanlamadaki sınıftır.
 */
import type { ErrorClass, L10n } from './types';

export interface Misconception {
  id: string;
  name: L10n;
  teacherNote: L10n;
  errorClass: ErrorClass;
  source: string;
}

const M = (id: string, errorClass: ErrorClass, name: L10n, teacherNote: L10n, source: string): Misconception => ({ id, name, teacherNote, errorClass, source });
const T = (tr: string, ku: string, en: string): L10n => ({ tr, ku, en });

// KU-DENETİM: öğretmen notlarının Kurmancî metinleri.
export const MISCONCEPTIONS: Record<string, Misconception> = {
  keywordReversal: M('keywordReversal', 'reversal',
    T('Anahtar sözcükle ters işlem', 'Kirariya berevajî bi peyva sereke', 'Keyword reversal'),
    T('"Fazla" görünce toplama, "az" görünce çıkarma yapıyor; tutarsız dilde (bilinmeyen = referans) ters işlem çıkıyor. Anahtar sözcük öğretmeyin; iki şeridi kurup "Kimde daha çok? Kimden?" diye sorun.', 'Dema "zêdetir" dibîne zêde dike; di zimanê nelihevhatî de kirariya berevajî derdikeve. Peyvên sereke fêr nekin; du şerîdan çêkin û bipirsin "Kê zêdetir heye? Ji kê?"', 'Adds on seeing "more", subtracts on seeing "fewer"; with inconsistent language (unknown = referent) this reverses the operation. Do not teach keywords; build the two strips and ask "Who has more? Than whom?"'),
    'Hegarty, Mayer & Monk (1995); Lewis & Mayer (1987); Karp, Bush & Dougherty (2014); Yıldız & Can (2020)'),
  textOrder: M('textOrder', 'textOrderOp',
    T('Metin sırasıyla işlem', 'Kirarî li gorî rêza nivîsê', 'Operating in text order'),
    T('Başlangıç bilinmeyen değişim problemlerinde öyküdeki eylemin işlemini sayılara sırayla uyguluyor (8 − 3 yerine 5 − 3). Modelde "?" bütünde mi parçada mı, sorun.', 'Di pirsgirêkên guherînê de ku destpêk nayê zanîn, kirariya çalakiyê li ser hejmaran bi rêz dike. Bipirsin: "?" di giştê de ye an di parçeyê de?', 'In start-unknown change problems, applies the action\'s operation to the numbers in order (5 − 3 instead of 5 + 3). Ask whether the "?" is the whole or a part.'),
    'Riley, Greeno & Heller (1983); Carpenter & Moser (1984); Powell & Fuchs (2010)'),
  irrelevantInfo: M('irrelevantInfo', 'irrelevantUsed',
    T('Gereksiz sayıyı kullanma', 'Bikaranîna hejmara ne pêwîst', 'Using irrelevant numbers'),
    T('Soruyla ilgisi olmayan sayıyı işleme katıyor. Önce "İşime yarar / Gerek yok" ayrımı yaptırın; soru cümlesini yüksek sesle okutun.', 'Hejmara ku bi pirsê re ne têkildar e dixe nav hesêb. Pêşî bidin cudakirin: "Bi kêr tê / Ne pêwîst e".', 'Brings a number unrelated to the question into the calculation. Have the child sort "useful / not needed" first; read the question aloud.'),
    'Passolunghi, Cornoldi & De Liberto (1999); Muth (1992); Fuchs vd. (2008)'),
  addAllNumbers: M('addAllNumbers', 'operation',
    T('Tüm sayıları toplama', 'Hemû hejmaran zêde kirin', 'Adding all the numbers'),
    T('Hangi yapı olursa olsun görünen bütün sayıları topluyor (ör. fark sorusunda 9 + 5). Şema kartını seçtirin ve bilinmeyeni diyagramda işaretletin.', 'Çi avahî be jî, hemû hejmarên xuya zêde dike. Bidin hilbijartina karta şemayê û nîşankirina ya nayê zanîn.', 'Adds every visible number whatever the structure (e.g. 9 + 5 for a difference question). Have the child choose the schema card and mark the unknown.'),
    'Verschaffel, Greer & De Corte (2000); Stern (1993)'),
  unitOmission: M('unitOmission', 'unitOrRemainder',
    T('Birimi unutma', 'Ji bîr kirina yekeyê', 'Omitting the unit'),
    T('Sayıyı doğru buluyor ama neyin sayısı olduğunu söylemiyor (TL, dakika, litre). Cevabı tam cümleyle söyletin.', 'Hejmarê rast dibîne lê nabêje hejmara çi ye. Bidin gotina bersivê bi hevokeke temam.', 'Finds the right number but not what it counts (lira, minutes, litres). Ask for the answer as a full sentence.'),
    'Fuchs vd. (2021, WWC Öneri 5); 04 §D.3 kural 16'),
  ignoreRemainder: M('ignoreRemainder', 'unitOrRemainder',
    T('Kalanı yok sayma', 'Paşguhkirina jêmayê', 'Ignoring the remainder'),
    T('Kalanlı bölmede bağlamı düşünmeden bölümü yazıyor ("6 kalan 3" ya da 6 minibüs). Aynı bölmeyi dört bağlamda yorumlatın (yukarı yuvarla, aşağı yuvarla, kalan cevaptır).', 'Di parkirina bi jêma de bêyî fikirîna li ser rewşê paranê dinivîse. Heman parkirinê di çar rewşan de bidin şîrovekirin.', 'In division with remainder writes the quotient without thinking about the context ("6 r 3", or 6 minibuses). Interpret the same division in four contexts.'),
    'Silver, Shapiro & Deutsch (1993); Verschaffel vd. (2000)'),
  moreVsTimes: M('moreVsTimes', 'operation',
    T('"4 fazla"yı "4 katı" sanma', 'Tevlihevkirina "4 zêdetir" û "4 car"', 'Confusing "4 more" with "4 times"'),
    T('Kat karşılaştırmasında toplamsal düşünüyor (4 + 3 yerine 4 × 3 ya da tersi). "4 fazla" ve "4 katı" şeritlerini yan yana gösterin.', 'Di berhevdana carî de bi awayê zêdekirinê difikire. Şerîdên "4 zêdetir" û "4 car" li kêleka hev nîşan bidin.', 'Thinks additively in times comparisons. Show the "4 more" and "4 times" strips side by side.'),
    'Xin (2011, COMPS); Mulligan & Mitchelmore (1997); 02 §C8'),
  unsolvableAnswered: M('unsolvableAnswered', 'unsolvableMissed',
    T('Çözülemezi çözme', 'Çareserkirina ya ku nayê çareserkirin', 'Answering unsolvable problems'),
    T('"Kaptanın yaşı" türü anlamsız ya da eksik bilgili sorulara da sayılarla işlem yaparak cevap veriyor. "Bu soru çözülemez" seçeneğini her maddede tutun; fark edişi övün.', 'Bersiva pirsên bêwate an bi agahiya kêm jî bi hejmaran dide. Vebijarka "Ev pirs nayê çareserkirin" di her pirsê de bihêlin.', 'Also answers "captain\'s age" style nonsense or missing-information questions by combining the numbers. Keep the "cannot be solved" option on every item; praise noticing.'),
    'Verschaffel, Greer & De Corte (2000); Reusser (1988); Baruk (1985)'),
  partWhole: M('partWhole', 'modelPlacement',
    T('Parça-bütün karışıklığı', 'Tevlihevkirina parçe û giştê', 'Part–whole confusion'),
    T('Bütünü bir parça gibi yerleştiriyor; "toplam" sözcüğünü görünce toplamayı seçiyor (parça bilinmeyende 10 + 4). Bütünün her parçadan büyük olduğunu şeritle gösterin.', 'Giştê wek parçeyekê bi cih dike. Bi şerîdê nîşan bidin ku gişt ji her parçeyê mezintir e.', 'Places the whole as if it were a part; adds on seeing "total" (10 + 4 when a part is unknown). Show with strips that the whole is bigger than each part.'),
    'Xin (2019); Ng & Lee (2009); 02 §B1.2'),
  equalsAsAnswer: M('equalsAsAnswer', 'unknownPlacement',
    T('Eşittiri "cevap buraya" sanma', 'Wekhevî wek "bersiv li vir"', 'Equals sign as "answer goes here"'),
    T('Bilinmeyen başta ya da ortadayken (? + 3 = 8) denklemi kuramıyor; "?"yi hep sona koyuyor. Terazi modeliyle eşittirin ilişki olduğunu vurgulayın.', 'Dema ya nayê zanîn li destpêk an navîn be hevkêşeyê ava nake. Bi modela terazûyê nîşan bidin ku wekhevî têkilî ye.', 'Cannot build the equation when the unknown is first or in the middle (? + 3 = 8); always puts "?" last. Stress with a balance model that equals is a relation.'),
    'Powell & Fuchs (2010); Fuchs vd. (2010)'),
  skipStep: M('skipStep', 'operation',
    T('Ara adımı atlama', 'Gava navîn berdan', 'Skipping the middle step'),
    T('İki adımlı problemde ara sonucu bulmadan metindeki iki sayıyla tek işlem yapıyor. İki diyagramı yan yana kurdurun; ilk cevabı ikinci diyagrama taşıtın.', 'Di pirsgirêka du gavan de bêyî dîtina encama navîn kirariyekê dike. Du diyagraman li kêleka hev çêkin.', 'In two-step problems does a single operation on two numbers without finding the middle result. Build the two diagrams side by side and carry the first answer across.'),
    'Powell vd. (2022); Doğmaz Tunalı & Karabey (2024)'),
  schemaConfusion: M('schemaConfusion', 'schemaId',
    T('Şema karışıklığı', 'Tevlihevkirina şemayan', 'Schema confusion'),
    T('Problem türünü yüzey özelliklerine (bağlam, sözcük) bakarak seçiyor; değişimle karşılaştırmayı karıştırıyor. "Bir şey değişti mi, yoksa iki şey mi karşılaştırılıyor?" sorusunu sorun; aynı bağlamda farklı şemaları eşleştirtin.', 'Cureyê pirsgirêkê li gorî taybetiyên rûvî hildibijêre. Bipirsin: "Tiştek guherî an du tişt tên berhevdan?"', 'Chooses the problem type from surface features (context, words); mixes up change and compare. Ask "Did something change, or are two things compared?"; match different schemas in the same context.'),
    'Fuchs vd. (2003, 2021 WWC Öneri 5.1); Jitendra vd. (2015)'),
};
