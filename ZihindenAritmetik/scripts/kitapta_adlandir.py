# -*- coding: utf-8 -*-
"""
Etkinlik adlarini kitabin .docx dosyalarinda degistirir.

Adlar scripts/adlandirma.json'dan okunur. Degisiklik KORLEMESINE yapilmaz:
bir ad ancak etkinlik basligi baglaminda gecerse degistirilir, ciplak metinde
gecerse birakilir. "Tumleyen" gibi adlar kitapta siradan sozcuk olarak da
gecer; onlara dokunmak metni bozar.

Baglam kurallari (paragraf metnine gore):
  · '2.2  Tumleyen'                    -> kart basligi          [degisir]
  · '2.2' ile ayni satirdaki hucre     -> bolum listesi/dizin   [degisir]
  · '... tumleyenleri kurar ...'       -> duz metin             [durur]

Kullanim:
  python scripts/kitapta_adlandir.py            # yalnizca tarar, rapor verir
  python scripts/kitapta_adlandir.py --uygula   # yedekler ve degistirir
"""
import json, os, re, shutil, sys, zipfile
from xml.etree import ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from extract_content import kitap_klasoru  # noqa: E402

BOOK = kitap_klasoru()
YEDEK = os.path.join(BOOK, '_yedek_adlandirma')


def hedefler():
    """adlandirma.json'dan (kart no, eski ad, yeni ad) uclulerini uretir."""
    with open(os.path.join(HERE, 'adlandirma.json'), encoding='utf-8') as f:
        ad = json.load(f)
    with open(os.path.join(APP, 'src', 'content', 'tr', 'activities.json'), encoding='utf-8') as f:
        icerik = json.load(f)
    kartlar = {k['id']: k for k in icerik['cards']}
    out = []
    for kid, yeni in (ad.get('cards') or {}).items():
        if not yeni.get('title'):
            continue
        kart = kartlar.get(kid)
        if not kart:
            continue
        eski = kart.get('bookTitle') or kart['title']
        if eski != yeni['title']:
            out.append((kid, eski, yeni['title']))
    return out


def docx_yollari():
    yollar = []
    for kok, _, dosyalar in os.walk(BOOK):
        if '_yedek' in kok or '_eski' in kok:
            continue
        for d in sorted(dosyalar):
            if d.endswith('.docx') and not d.startswith('~$'):
                yollar.append(os.path.join(kok, d))
    return yollar


def par_metni(p):
    return ''.join(t.text or '' for t in p.iter(W + 't'))


def hucre_metni(tc):
    return '\n'.join(par_metni(p) for p in tc.findall(W + 'p'))


def numarali_baslik(metin, kart_no, eski):
    """
    '1.1  Simsek kart' bicimi: ad, kendi kart numarasinin hemen ardinda.
    Kart basliklari, icindekiler ve dizin satirlari bu bicimdedir.
    """
    # Son sinir icin \b kullanilamaz: 'Kaci gizli?' gibi noktalama ile biten
    # adlarda \b, ardindan bir harf gelmesini bekler ve eslesme kacar.
    return re.match(
        rf'^{re.escape(kart_no)}\s+{re.escape(eski)}(?!\w)', metin.strip()
    ) is not None


def numara_gecer(metin, kart_no):
    """Satirda kart numarasi ayri bir oge olarak geciyor mu? ('1.1' | '2.2')"""
    return re.search(rf'(?<![\d.]){re.escape(kart_no)}(?![\d])', metin) is not None


XML_SPACE = '{http://www.w3.org/XML/1998/namespace}space'


def paragraf_degistir(p, eski, yeni):
    """
    Paragraftaki adi degistirir; BICIMLENDIRMEYI KORUR.

    Word bir paragrafi birden cok <w:r> parcasina boler ve her parcanin kendi
    bicimi olur. Kart basliginda numara kalin ve mavi, ad normal ve koyudur:
      <w:r b=1 color=62929E><w:t>1.1  </w:t></w:r>
      <w:r b=0 color=1A1A1A><w:t>Simsek kart</w:t></w:r>

    Butun metni ilk parcaya yazmak bu ayrimi yok eder. Bunun yerine adin
    hangi parcalara denk geldigi bulunur, yeni metin adin BASLADIGI parcaya
    yazilir (adin kendi bicimi orasidir), tastigi parcalardan yalnizca ortulen
    bolum silinir. Parcalarin disinda kalan metin oldugu gibi kalir.
    """
    tler = list(p.iter(W + 't'))
    if not tler:
        return False

    # her parcanin birlesik metindeki [bas, son) araligi
    araliklar = []
    konum = 0
    for t in tler:
        metin = t.text or ''
        araliklar.append((konum, konum + len(metin)))
        konum += len(metin)
    birlesik = ''.join(t.text or '' for t in tler)

    degisti = False
    ara = birlesik.find(eski)
    while ara != -1:
        bas, son = ara, ara + len(eski)
        ilk = True
        for t, (tb, ts) in zip(tler, araliklar):
            if ts <= bas or tb >= son:
                continue  # bu parca adin disinda
            metin = t.text or ''
            yerel_bas = max(bas, tb) - tb
            yerel_son = min(son, ts) - tb
            if ilk:
                t.text = metin[:yerel_bas] + yeni + metin[yerel_son:]
                ilk = False
            else:
                t.text = metin[:yerel_bas] + metin[yerel_son:]
            if t.text != t.text.strip():
                t.set(XML_SPACE, 'preserve')
        degisti = True

        # metin degistigi icin araliklar yeniden kurulur
        konum = 0
        araliklar = []
        for t in tler:
            metin = t.text or ''
            araliklar.append((konum, konum + len(metin)))
            konum += len(metin)
        birlesik = ''.join(t.text or '' for t in tler)
        ara = birlesik.find(eski)

    return degisti


def dosyayi_isle(yol, isler, uygula):
    """Tek bir .docx dosyasini tarar; uygula=True ise yerinde degistirir."""
    z = zipfile.ZipFile(yol)
    parcalar = [n for n in z.namelist()
                if n.startswith('word/') and n.endswith('.xml')
                and ('document' in n or 'header' in n or 'footer' in n)]
    bulgular = []
    yeni_icerik = {}

    for parca in parcalar:
        try:
            kok = ET.fromstring(z.read(parca))
        except ET.ParseError:
            continue
        degisti = False

        degisen_p = set()

        # Tablo hucreleri: bolum listeleri ve dizin satirlari.
        # Ad tek basina bir hucrede duruyorsa ancak AYNI SATIRDA kart numarasi
        # da varsa degistirilir. Bu kosul olmadan sozluk gibi terim listeleri
        # de eslesir ve kitabin metni bozulur.
        for tr in kok.iter(W + 'tr'):
            hucreler = tr.findall(W + 'tc')
            satir_metni = ' '.join(hucre_metni(tc) for tc in hucreler)
            for kid, eski, yeni in isler:
                if eski not in satir_metni or not numara_gecer(satir_metni, kid):
                    continue
                for tc in hucreler:
                    m = hucre_metni(tc)
                    if eski not in m:
                        continue
                    if not (m.strip() == eski or numarali_baslik(m, kid, eski)):
                        continue
                    for p in tc.iter(W + 'p'):
                        if paragraf_degistir(p, eski, yeni):
                            degisen_p.add(id(p))
                            bulgular.append((parca, kid, eski, yeni, m.strip()[:70]))
                            degisti = True

        # Duz paragraflar: kart basliklari ve icindekiler satirlari.
        # Yalnizca '1.1  Ad' bicimi kabul edilir; ciplak metinde gecen ad durur.
        for p in kok.iter(W + 'p'):
            if id(p) in degisen_p:
                continue
            metin = par_metni(p)
            for kid, eski, yeni in isler:
                if eski in metin and numarali_baslik(metin, kid, eski):
                    if paragraf_degistir(p, eski, yeni):
                        bulgular.append((parca, kid, eski, yeni, metin.strip()[:70]))
                        degisti = True

        if degisti:
            yeni_icerik[parca] = ET.tostring(kok, encoding='utf-8', xml_declaration=True)

    if uygula and yeni_icerik:
        os.makedirs(YEDEK, exist_ok=True)
        shutil.copy2(yol, os.path.join(YEDEK, os.path.basename(yol)))
        gecici = yol + '.yeni'
        with zipfile.ZipFile(gecici, 'w', zipfile.ZIP_DEFLATED) as cikti:
            for ogeler in z.infolist():
                veri = yeni_icerik.get(ogeler.filename) or z.read(ogeler.filename)
                cikti.writestr(ogeler, veri)
        z.close()
        os.replace(gecici, yol)
    else:
        z.close()

    return bulgular


def main():
    uygula = '--uygula' in sys.argv
    isler = hedefler()
    if not isler:
        sys.exit('adlandirma.json icinde uygulanacak ad degisikligi yok.')

    print('Degistirilecek adlar:')
    for kid, eski, yeni in isler:
        print('  %-5s %-38s -> %s' % (kid, eski, yeni))
    print()

    toplam = 0
    for yol in docx_yollari():
        bulgular = dosyayi_isle(yol, isler, uygula)
        if not bulgular:
            continue
        print(os.path.relpath(yol, BOOK))
        for _, kid, eski, yeni, baglam in bulgular:
            print('    %-5s %s' % (kid, baglam))
        toplam += len(bulgular)
        print()

    print('%d yerde %s' % (toplam, 'degistirildi' if uygula else 'degisiklik bulundu (deneme)'))
    if uygula:
        print('Yedekler: %s' % os.path.relpath(YEDEK, BOOK))
    else:
        print('Uygulamak icin: python scripts/kitapta_adlandir.py --uygula')


if __name__ == '__main__':
    main()
