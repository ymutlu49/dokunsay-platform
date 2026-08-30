# -*- coding: utf-8 -*-
"""
Uygulama simgelerini uretir (public/simge-*.png).

Simge, kitabin imza sekli olan onluk cerceveden turetilmistir: yedi dolu,
uc bos - "kac kutu bos kaldi?" sorusunun gorsel karsiligi.

Kullanim: python scripts/make_icons.py
"""
import os
from PIL import Image, ImageDraw

HERE   = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(os.path.dirname(HERE), 'public')

LACIVERT = (27, 73, 101, 255)
MAVI_GRI = (98, 146, 158, 255)
KAGIT    = (255, 255, 255, 255)

DOLU = 7  # onluk cercevede dolu kutu sayisi


def ciz(boy, maskable=False):
    """Tek bir simgeyi olusturur. maskable=True ise guvenli alan icin ic pay birakir."""
    ss = 4  # kenar yumusatma icin buyuk cizip kucultme
    b = boy * ss
    img = Image.new('RGBA', (b, b), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    if maskable:
        d.rectangle([0, 0, b, b], fill=LACIVERT)
        ic = b * 0.20           # maskable simgelerde %20 guvenli pay
    else:
        d.rounded_rectangle([0, 0, b - 1, b - 1], radius=int(b * 0.22), fill=LACIVERT)
        ic = b * 0.14

    # onluk cerceve: 5 sutun x 2 satir
    gen = b - 2 * ic
    hucre = gen / 5
    yuk = hucre * 2
    ust = (b - yuk) / 2

    d.rectangle([ic, ust, ic + gen, ust + yuk], fill=KAGIT)

    cizgi = max(1, int(b * 0.011))
    for k in range(1, 5):
        x = ic + k * hucre
        d.line([x, ust, x, ust + yuk], fill=LACIVERT, width=cizgi)
    d.line([ic, ust + hucre, ic + gen, ust + hucre], fill=LACIVERT, width=cizgi)
    # besli yapiyi gosteren kalin orta cizgi
    orta = ic + gen / 2
    d.line([orta, ust, orta, ust + yuk], fill=LACIVERT, width=cizgi * 3)
    d.rectangle([ic, ust, ic + gen, ust + yuk], outline=LACIVERT, width=cizgi * 2)

    r = hucre * 0.29
    for n in range(10):
        satir, sutun = divmod(n, 5)
        cx = ic + sutun * hucre + hucre / 2
        cy = ust + satir * hucre + hucre / 2
        if n < DOLU:
            renk = LACIVERT if n < 5 else MAVI_GRI
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=renk)

    return img.resize((boy, boy), Image.LANCZOS)


def main():
    os.makedirs(PUBLIC, exist_ok=True)
    isler = [
        ('simge-180.png', 180, False),
        ('simge-192.png', 192, False),
        ('simge-512.png', 512, False),
        ('simge-512-maskable.png', 512, True),
    ]
    for ad, boy, mask in isler:
        ciz(boy, mask).save(os.path.join(PUBLIC, ad))
        print('%-26s %dx%d' % (ad, boy, boy))


if __name__ == '__main__':
    main()
