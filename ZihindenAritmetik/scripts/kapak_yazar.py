"""
Kitap kapaklarındaki yazar satırını üç yazara çevirir.

Kapaklar vektör PDF'tir; içindeki Carlito yazı tipi alt kümelenmiş olarak
gömülüdür, yani yeni adlarda geçen harflerin (İ, ö, v, z…) çoğu pakette
yoktur. Bu yüzden eski satır kaldırılıp yerine yeniden yazılır. Carlito
sistemde bulunmadığından ölçüleri birebir aynı olan Calibri kullanılır
(fsType=8, düzenlenebilir gömme izinli); genişlikler Carlito ile aynı
olduğundan hizalama kaymaz.

Yerleşim her konuma göre ayrı hesaplanır:

  ön kapak   67,3 pt tek satır ->  ene sığan puntoda tek satır, sağa yaslı
  arka kapak 44,3 pt tek satır ->  40 pt iki satır, sola yaslı
  sırt       44,3 pt dikey     ->  yalnızca soyadlar (üç tam ad sığmıyor:
                                   ~1100 pt gerekiyor, 505 pt yer var)

Ön kapakta taban çizgisi ve sağ kenar korunur, punto ene göre küçültülür;
böylece alt boşluk — baskının kesim payı — özgünüyle birebir aynı kalır.

Kullanım:
    python scripts/kapak_yazar.py            # önizleme, dosyaya yazmaz
    python scripts/kapak_yazar.py --yaz      # PDF ve PNG'leri günceller
"""

import sys
from pathlib import Path

import fitz

ADLAR = ['Prof. Dr. Yılmaz Mutlu', 'Dr. İhsan Söylemez', 'Dr. Yavuz Erdem']
SOYADLAR = ['Mutlu', 'Söylemez', 'Erdem']
AYRAC = ' · '

BOLD = Path('C:/Windows/Fonts/calibrib.ttf')
REG = Path('C:/Windows/Fonts/calibri.ttf')

ESKI = 'Prof. Dr. Yılmaz Mutlu'

SOL_KENAR = 186.0   # kapağın kendi sol hizası
GUVENLIK = 10.0     # metnin sol hizaya değmemesi için pay

# Calibri/Carlito'nun hhea ölçüleri (em oranı). Taban çizgisini eski yazının
# üst kenarından hesaplamak için gerekir.
YUKSELTI = 0.952
CIKINTI = 0.269


def kapak_klasoru() -> Path:
    """Kitap klasörü ZA_KITAP ile ya da bilinen konumlardan bulunur."""
    import os

    if (v := os.environ.get('ZA_KITAP')):
        return Path(v) / 'Kapak'
    for aday in (
        Path.home() / 'Documents' / 'Zihinden Aritmetik' / 'Kitap' / 'Kapak',
        Path(__file__).resolve().parents[3] / 'Kitap' / 'Kapak',
    ):
        if aday.is_dir():
            return aday
    raise SystemExit('Kapak klasörü bulunamadı. ZA_KITAP ortam değişkenini verin.')


def yazi_tipi(kalin: bool) -> fitz.Font:
    return fitz.Font(fontfile=str(BOLD if kalin else REG))


def zemin_rengi(sayfa: fitz.Page, kutu: fitz.Rect) -> tuple:
    """Yazının hemen dışından zemin rengini örnekler."""
    ornek = fitz.Rect(kutu.x0, kutu.y1 + 6, kutu.x0 + 8, kutu.y1 + 14)
    pix = sayfa.get_pixmap(clip=ornek, dpi=72)
    r, g, b = pix.pixel(pix.width // 2, pix.height // 2)[:3]
    return (r / 255, g / 255, b / 255)


def bul(sayfa: fitz.Page):
    """Yazar satırının geçtiği her yeri (span) döndürür."""
    out = []
    for blok in sayfa.get_text('dict')['blocks']:
        for satir in blok.get('lines', []):
            for s in satir['spans']:
                if s['text'].strip() == ESKI:
                    out.append((s, satir['dir']))
    return out


def renk(kod: int) -> tuple:
    return ((kod >> 16 & 255) / 255, (kod >> 8 & 255) / 255, (kod & 255) / 255)


def islem_planla(s, yon):
    """Bir span için: silinecek kutu ve yazılacak satırlar."""
    x0, y0, x1, y1 = s['bbox']
    kalin = 'Bold' in s['font']
    f = yazi_tipi(kalin)
    dikey = yon == (0.0, 1.0)

    if dikey:
        # Sırt: üç tam ad sığmaz (~1100 pt gerekir, 505 pt yer var), soyadlar
        # yazılır. Sırt dar olduğu için yatay konum kritiktir: PyMuPDF
        # rotate=270 ile metni verilen noktanın 0,25·boyut solundan 0,75·boyut
        # sağına yerleştirir, yani nokta metnin ortası DEĞİLDİR. Ölçülen bu
        # sapma düşülerek blok eski yazının tam ortasına oturtulur; aksi hâlde
        # yazı sırttan taşıp ön kapağa girer.
        metin = AYRAC.join(SOYADLAR)
        merkez = (x0 + x1) / 2
        return {
            'sil': fitz.Rect(x0 - 4, y0 - 4, x1 + 4, y1 + 4),
            'satirlar': [(fitz.Point(merkez - s['size'] * 0.25, y0), metin)],
            'boyut': s['size'],
            'kalin': kalin,
            'dikey': True,
        }

    if kalin:
        # Ön kapak: üç ad TEK satırda, sağa yaslı.
        #
        # Punto ene göre hesaplanır: üç ad özgün 67,3 pt'de 1705 pt tutuyor,
        # oysa sol kenar (186) ile sağ kenar arasında 1408 pt var. Metin sol
        # kenar payına dokunmayacak biçimde küçültülür; böylece kapağın kendi
        # hizası bozulmaz.
        #
        # Taban çizgisi özgünüyle aynı bırakılır (tek satır olduğu için
        # bırakılabiliyor), dolayısıyla alt boşluk — yani baskının kesim payı —
        # değişmez.
        metin = AYRAC.join(ADLAR)
        kullanilabilir = (x1 - SOL_KENAR) - GUVENLIK
        boyut = s['size']
        if f.text_length(metin, boyut) > kullanilabilir:
            boyut = boyut * kullanilabilir / f.text_length(metin, boyut)
            boyut = round(boyut, 1)
        taban = y0 + YUKSELTI * s['size']
        g = f.text_length(metin, boyut)
        return {
            'sil': fitz.Rect(x0 - 6, y0 - 6, x1 + 6, y1 + 6),
            'satirlar': [(fitz.Point(x1 - g, taban), metin)],
            'boyut': boyut,
            'kalin': kalin,
            'dikey': False,
            'ust_sinir': taban - YUKSELTI * boyut,
        }

    # Arka kapak: iki satır, sol kenar korunur.
    #
    # Tek satırda üç ad 988 pt tutuyordu ve ISBN barkod kutusunun (x≈1173)
    # altına giriyordu. Ön kapakla aynı bölünme kullanılır; en uzun satır
    # 617 pt, kutuya 550 pt kalır.
    boyut = 40.0
    satir_aralik = 48.0
    metinler = [ADLAR[0], AYRAC.join(ADLAR[1:])]
    ilk_taban = y0 + s['size'] * 0.78
    satirlar = [
        (fitz.Point(x0, ilk_taban + i * satir_aralik), m) for i, m in enumerate(metinler)
    ]
    return {
        'sil': fitz.Rect(x0 - 6, y0 - 6, x1 + 6, y1 + 6),
        'satirlar': satirlar,
        'boyut': boyut,
        'kalin': kalin,
        'dikey': False,
    }


def isle(yol: Path, yaz: bool):
    d = fitz.open(yol)
    sayfa = d[0]
    isler = bul(sayfa)
    if not isler:
        print(f'  {yol.name}: yazar satırı bulunamadı, atlandı')
        d.close()
        return

    print(f'  {yol.name}: {len(isler)} yer')
    planlar = []
    for s, yon in isler:
        p = islem_planla(s, yon)
        p['renk'] = renk(s['color'])
        p['zemin'] = zemin_rengi(sayfa, fitz.Rect(s['bbox']))
        planlar.append(p)
        tur = 'sırt' if p['dikey'] else ('ön' if p['kalin'] else 'arka')
        for _, m in p['satirlar']:
            print(f"      [{tur}] {p['boyut']:.0f} pt  {m}")
        if 'ust_sinir' in p:
            son = p['satirlar'][-1][0].y + p['boyut'] * 0.25
            print(f"      [{tur}] üst {p['ust_sinir']:.0f} · alt boşluk "
                  f"{sayfa.rect.height - son:.0f} pt (özgün {sayfa.rect.height - s['bbox'][3]:.0f} pt)")

    if not yaz:
        d.close()
        return

    # 1) eski yazıyı kaldır (zemin rengiyle doldurarak)
    for p in planlar:
        sayfa.add_redact_annot(p['sil'], fill=p['zemin'])
    sayfa.apply_redactions()

    # 2) yeni satırları yaz
    for p in planlar:
        dosya = str(BOLD if p['kalin'] else REG)
        ad = 'cal-b' if p['kalin'] else 'cal-r'
        for nokta, metin in p['satirlar']:
            sayfa.insert_text(
                nokta,
                metin,
                fontname=ad,
                fontfile=dosya,
                fontsize=p['boyut'],
                color=p['renk'],
                rotate=270 if p['dikey'] else 0,
            )

    # PyMuPDF açık dosyanın üzerine tam kayıt yapamaz; geçiciye yazıp taşıyoruz.
    gecici = yol.with_suffix('.yeni.pdf')
    d.save(str(gecici), deflate=True, garbage=3)
    d.close()
    gecici.replace(yol)

    # 3) PNG'yi aynı piksel boyutunda yeniden üret
    png = yol.with_suffix('.png')
    if png.exists():
        from PIL import Image

        hedef_en, hedef_boy = Image.open(png).size
        d2 = fitz.open(yol)
        olcek = hedef_en / d2[0].rect.width
        pix = d2[0].get_pixmap(matrix=fitz.Matrix(olcek, olcek))
        d2.close()
        # Yuvarlama yüzünden bir piksel sapabilir; özgün boyuta kırparak
        # baskı şablonuyla birebir aynı kalmasını sağlıyoruz.
        im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
        if (pix.width, pix.height) != (hedef_en, hedef_boy):
            if abs(pix.width - hedef_en) > 2 or abs(pix.height - hedef_boy) > 2:
                raise SystemExit(f'{png.name}: beklenmeyen boyut {im.size} != {(hedef_en, hedef_boy)}')
            im = im.crop((0, 0, hedef_en, hedef_boy))
        im.save(str(png))
        print(f'      png yenilendi: {im.size}')


def main():
    yaz = '--yaz' in sys.argv
    kl = kapak_klasoru()
    print(f'Kapak klasörü: {kl}')
    print('YAZILIYOR' if yaz else 'ÖNİZLEME (yazmak için --yaz)')
    for ad in [
        'Kapak_Kitap_On.pdf',
        'Kapak_Kitap_Tam.pdf',
        'Kapak_Etkinlik_On.pdf',
        'Kapak_Etkinlik_Tam.pdf',
    ]:
        yol = kl / ad
        if yol.exists():
            isle(yol, yaz)


if __name__ == '__main__':
    main()
