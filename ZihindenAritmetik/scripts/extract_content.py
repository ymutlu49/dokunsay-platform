# -*- coding: utf-8 -*-
"""
Kitap kaynaklarindan (.docx) uygulama icerigini uretir.

Kullanim:  python scripts/extract_content.py
Ciktilar:  src/content/tr/activities.json
           src/content/tr/strings.json
           public/figures/etkinlik/*.webp

Kaynak .docx dosyalari degistiginde bu betik yeniden calistirilir.
Uretilen JSON dosyalari elle duzenlenmez.
"""
import zipfile, json, re, os, sys
from xml.etree import ElementTree as ET

W  = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
A  = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
R  = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
RS = '{http://schemas.openxmlformats.org/package/2006/relationships}'

HERE = os.path.dirname(os.path.abspath(__file__))
APP  = os.path.dirname(HERE)


def kitap_klasoru():
    """
    Kitabin .docx dosyalarinin bulundugu klasor.

    Uygulama DokunSay deposuna tasindigi icin kitap artik komsu klasor degil.
    Sirayla: ZA_KITAP ortam degiskeni, komsu 'Kitap' klasoru (eski duzen),
    sonra bilinen mutlak yol. Uretilen JSON ve WebP depoya islendiginden bu
    betik yalnizca icerik yenilenirken gerekir; CI'da calismaz.
    """
    adaylar = [
        os.environ.get('ZA_KITAP'),
        os.path.normpath(os.path.join(APP, '..', 'Kitap')),
        os.path.expanduser(r'~\Documents\Zihinden Aritmetik\Kitap'),
    ]
    for yol in adaylar:
        if yol and os.path.isdir(yol) and os.path.exists(
            os.path.join(yol, 'Etkinlik_Kitabi.docx')
        ):
            return yol
    sys.exit(
        'Kitap klasoru bulunamadi. ZA_KITAP ortam degiskenini ayarlayin, ornek:\n'
        r'  ZA_KITAP="C:\Users\...\Zihinden Aritmetik\Kitap" '
        'python scripts/extract_content.py'
    )


BOOK = kitap_klasoru()


# ---------------------------------------------------------------- docx okuma

def _rels(z):
    root = ET.fromstring(z.read('word/_rels/document.xml.rels'))
    return {r.get('Id'): r.get('Target') for r in root.iter(RS + 'Relationship')}


def _ptext(p):
    out = []
    for n in p.iter():
        if n.tag == W + 't':
            out.append(n.text or '')
        elif n.tag == W + 'tab':
            out.append('\t')
        elif n.tag == W + 'br':
            out.append('\n')
    return ''.join(out)


def _pimgs(p, rl):
    return [rl[b.get(R + 'embed')].split('/')[-1]
            for b in p.iter(A + 'blip')
            if b.get(R + 'embed') in rl]


def tokenize(path):
    """Belgeyi sirali {p | img | tbl} akisina cevirir."""
    z    = zipfile.ZipFile(path)
    rl   = _rels(z)
    body = ET.fromstring(z.read('word/document.xml')).find(W + 'body')
    out  = []
    for el in body:
        if el.tag == W + 'p':
            for im in _pimgs(el, rl):
                out.append({'k': 'img', 'src': im})
            t = _ptext(el).strip()
            if t:
                out.append({'k': 'p', 't': t})
        elif el.tag == W + 'tbl':
            rows = []
            for tr in el.findall(W + 'tr'):
                cells = []
                for tc in tr.findall(W + 'tc'):
                    for p in tc.findall(W + 'p'):
                        for im in _pimgs(p, rl):
                            out.append({'k': 'img', 'src': im})
                    cells.append('\n'.join(
                        x for x in (_ptext(p).strip() for p in tc.findall(W + 'p')) if x))
                rows.append(cells)
            out.append({'k': 'tbl', 'rows': rows})
    return out, z


# ------------------------------------------------------------ etkinlik kartlari

CARD_HEAD = re.compile(r'^(\d)\.(\d{1,2})\s{2,}(\S.*)$')
SEC_HEAD  = re.compile(r'^BOLUM\s+(\d)$'.replace('BOLUM', 'BÖLÜM'))
BULLET    = re.compile(r'^\s*(?:[•·▪]|\d+\.)\s*')

FIELD_OF = {
    'HAZIRLIK':                 'prep',
    'YÖNERGE':             'steps',
    'NE SORULUR':               'ask',
    'TAKILAN ÖĞRENCİYE': 'support',
    'UZATMA':                   'extension',
    'DÖRT PROFİL':    None,
}
MARKERS = tuple(FIELD_OF.keys())
WHY     = 'NEDEN BU ETKİNLİK'
CRIT    = 'ÖLÇÜT'
FIGURE  = 'Şekil '


def _clean(s):
    return BULLET.sub('', s).strip()


def parse_meta(line):
    """'3-5 dk  .  Kitap Bolum 4, S4.9  .  Materyal: Ek A.1 nokta kartlari'"""
    parts = [p.strip() for p in line.split('·') if p.strip()]
    meta = {'duration': '', 'minMinutes': None, 'maxMinutes': None,
            'bookRef': '', 'bookChapter': None, 'material': ''}
    for p in parts:
        if p.startswith('Kitap'):
            pass
        elif p.startswith('Materyal'):
            pass
        elif not meta['duration']:
            # sure alani: '3-5 dk', '10 dk' ya da 9.3'teki gibi 'planlama'
            meta['duration'] = p
            nums = [int(n) for n in re.findall(r'\d+', p)]
            if nums and 'dk' in p:
                meta['minMinutes'] = nums[0]
                meta['maxMinutes'] = nums[-1]
            continue
        if p.startswith('Kitap'):
            meta['bookRef'] = p
            m = re.search(r'Bölüm\s+(\d+)', p)
            if m:
                meta['bookChapter'] = int(m.group(1))
        elif p.startswith('Materyal'):
            meta['material'] = p.split(':', 1)[1].strip() if ':' in p else p
    return meta


def _single_cell(tk):
    if tk['k'] != 'tbl' or len(tk['rows']) != 1 or len(tk['rows'][0]) != 1:
        return None
    return [l.strip() for l in tk['rows'][0][0].split('\n') if l.strip()]


def parse_activities(toks):
    sections, cards = [], []
    i, n = 0, len(toks)

    while i < n:
        lines = _single_cell(toks[i])

        if lines:
            m = SEC_HEAD.match(lines[0])
            if m and len(lines) >= 2:
                chapter = None
                if len(lines) > 2:
                    dm = re.search(r'\d+', lines[2])
                    if dm:
                        chapter = int(dm.group())
                intro = toks[i + 1]['t'] if i + 1 < n and toks[i + 1]['k'] == 'p' else ''
                sections.append({'id': int(m.group(1)), 'title': lines[1],
                                 'bookChapter': chapter, 'intro': intro})
                i += 1
                continue

            m = CARD_HEAD.match(lines[0])
            if m and len(lines) >= 2 and '·' in lines[1]:
                card = {'id': '%s.%s' % (m.group(1), m.group(2)),
                        'section': int(m.group(1)),
                        'order': int(m.group(2)),
                        'title': m.group(3).strip()}
                card.update(parse_meta(lines[1]))
                card.update({'why': '', 'figure': None, 'figureCaption': '',
                             'prep': [], 'steps': [], 'ask': [], 'support': [],
                             'extension': [], 'profiles': {}, 'criterion': ''})
                i += 1
                field = None

                while i < n:
                    t2 = toks[i]
                    inner = _single_cell(t2)
                    if inner:
                        first = inner[0]
                        if CARD_HEAD.match(first) or SEC_HEAD.match(first):
                            break
                        if first.startswith(CRIT):
                            card['criterion'] = first[len(CRIT):].strip()
                            i += 1
                            continue
                    if t2['k'] == 'img' and card['figure'] is None:
                        card['figure'] = t2['src']
                        i += 1
                        continue
                    if t2['k'] == 'tbl' and len(t2['rows']) == 1 and len(t2['rows'][0]) == 4:
                        for cell in t2['rows'][0]:
                            cl = [l.strip() for l in cell.split('\n') if l.strip()]
                            if cl:
                                card['profiles'][cl[0]] = ' '.join(cl[1:])
                        i += 1
                        continue
                    if t2['k'] == 'p':
                        s = t2['t']
                        if s.startswith(WHY):
                            card['why'] = re.sub(r'^%s\?\s*' % WHY, '', s).strip()
                            field = None
                            i += 1
                            continue
                        if s.startswith(FIGURE):
                            card['figureCaption'] = s
                            i += 1
                            continue
                        hit = next((mk for mk in MARKERS if s.startswith(mk)), None)
                        if hit:
                            field = FIELD_OF[hit]
                            i += 1
                            continue
                        if field:
                            card[field].append(_clean(s))
                        i += 1
                        continue
                    i += 1

                cards.append(card)
                continue
        i += 1

    return sections, cards


# --------------------------------------------------------------- sayi dizileri

def split_problems(text):
    return [p.strip() for p in re.split(r'\s*·\s*', text) if p.strip()]


def parse_ready_strings(toks):
    """Etkinlik Kitabi Tablo 2 - strateji ailelerine gore hazir diziler."""
    out = []
    for tk in toks:
        if tk['k'] != 'tbl' or len(tk['rows']) < 10:
            continue
        head = [c.strip() for c in tk['rows'][0]]
        if len(head) == 3 and head[0].startswith('Hedef strateji'):
            for r in tk['rows'][1:]:
                if len(r) < 3 or not r[1].strip():
                    continue
                probs = split_problems(r[1])
                if len(probs) < 2:
                    continue
                cm = re.search(r'\d+', r[2])
                out.append({'id': 'hd%02d' % (len(out) + 1),
                            'source': 'hazir',
                            'strategy': r[0].strip(),
                            'problems': probs,
                            'bookChapter': int(cm.group()) if cm else None})
    return out


def parse_calendar(toks):
    """Ek C Tablo C.2 - 10 hafta x 3 oturum."""
    out = []
    for tk in toks:
        if tk['k'] != 'tbl' or len(tk['rows']) < 10:
            continue
        head = [c.strip() for c in tk['rows'][0]]
        if not (len(head) >= 4 and head[0].startswith('Hafta') and head[1].startswith('Odak')):
            continue
        week = focus = None
        for r in tk['rows'][1:]:
            cells = [c.strip() for c in r]
            if len(cells) >= 4 and cells[0]:
                week, focus = cells[0], cells[1]
                sess, dizi = cells[2], cells[3]
            elif len(cells) >= 2:
                sess, dizi = cells[-2], cells[-1]
            else:
                continue
            probs = split_problems(dizi)
            if len(probs) < 2 or week is None:
                continue
            sm = re.search(r'\d+', sess)
            out.append({'id': 'c%s-%s' % (week.replace('–', '-'), sm.group() if sm else len(out) + 1),
                        'source': 'takvim',
                        'week': int(re.search(r'\d+', week).group()),
                        'session': int(sm.group()) if sm else None,
                        'strategy': focus,
                        'problems': probs})
    return out


# -------------------------------------------------------------- adlandirma

def apply_naming(sections, cards):
    """
    scripts/adlandirma.json'daki uygulama adlarini uygular.

    Kitaptaki ozgun ad silinmez, bookTitle alaninda saklanir; uygulama kart
    ekraninda "Kitapta: ..." satiriyla gosterir. Boylece kitabi elinde tutan
    ogretmen aradigi karti kaybetmez. Kitap metni guncellenip ad kitapta da
    degisirse adlandirma.json'daki satir silinir.
    """
    yol = os.path.join(HERE, 'adlandirma.json')
    if not os.path.exists(yol):
        return 0
    with open(yol, encoding='utf-8') as f:
        ad = json.load(f)

    degisen = 0
    for grup, kayitlar in (('cards', cards), ('sections', sections)):
        eslesme = ad.get(grup) or {}
        for kayit in kayitlar:
            yeni = eslesme.get(str(kayit['id']))
            if not yeni or not yeni.get('title'):
                continue
            if yeni['title'] != kayit['title']:
                kayit['bookTitle'] = kayit['title']
                kayit['title'] = yeni['title']
                degisen += 1
    return degisen


# ---------------------------------------------------------------- gorseller

# Kaynak PNG'ler baski icin 3034 piksel genisligindedir. Uygulamada bir kart
# gorseli en fazla ~900 CSS pikseli kaplar; 1400 piksel retina ekranda da
# yeterlidir ve dosyayi onda birine indirir.
FIG_GENISLIK = 1400
FIG_KALITE = 82


def save_figure(figdir, taban, ham):
    """Gorseli kucultup WebP olarak yazar; Pillow yoksa PNG'yi oldugu gibi birakir."""
    try:
        from PIL import Image
    except ImportError:
        ad = taban + '.png'
        with open(os.path.join(figdir, ad), 'wb') as f:
            f.write(ham)
        return ad

    import io
    im = Image.open(io.BytesIO(ham))
    if im.mode in ('RGBA', 'LA', 'P'):
        # kart gorselleri beyaz zeminlidir; saydamlik gereksiz agirliktir
        zemin = Image.new('RGB', im.size, (255, 255, 255))
        im = im.convert('RGBA')
        zemin.paste(im, mask=im.split()[-1])
        im = zemin
    else:
        im = im.convert('RGB')

    if im.width > FIG_GENISLIK:
        oran = FIG_GENISLIK / im.width
        im = im.resize((FIG_GENISLIK, round(im.height * oran)), Image.LANCZOS)

    ad = taban + '.webp'
    im.save(os.path.join(figdir, ad), 'WEBP', quality=FIG_KALITE, method=6)
    return ad


# ------------------------------------------------------------------------ ana

def main():
    etk_path = os.path.join(BOOK, 'Etkinlik_Kitabi.docx')
    ekc_path = os.path.join(BOOK, 'Ekler', 'EkC_On_Haftalik_Takvim.docx')
    for p in (etk_path, ekc_path):
        if not os.path.exists(p):
            sys.exit('Kaynak bulunamadi: ' + p)

    etk_toks, etk_zip = tokenize(etk_path)
    ekc_toks, _       = tokenize(ekc_path)

    sections, cards = parse_activities(etk_toks)
    ready           = parse_ready_strings(etk_toks)
    calendar        = parse_calendar(ekc_toks)
    yeniden_adlanan = apply_naming(sections, cards)

    figdir = os.path.join(APP, 'public', 'figures', 'etkinlik')
    os.makedirs(figdir, exist_ok=True)
    written, bayt = 0, 0
    for c in cards:
        if not c['figure']:
            continue
        ham = etk_zip.read('word/media/' + c['figure'])
        taban = 'kart-%s' % c['id'].replace('.', '-')
        yol = save_figure(figdir, taban, ham)
        c['figure'] = 'figures/etkinlik/' + yol
        bayt += os.path.getsize(os.path.join(figdir, yol))
        written += 1

    outdir = os.path.join(APP, 'src', 'content', 'tr')
    os.makedirs(outdir, exist_ok=True)
    with open(os.path.join(outdir, 'activities.json'), 'w', encoding='utf-8') as f:
        json.dump({'sections': sections, 'cards': cards}, f, ensure_ascii=False, indent=1)
    with open(os.path.join(outdir, 'strings.json'), 'w', encoding='utf-8') as f:
        json.dump({'ready': ready, 'calendar': calendar}, f, ensure_ascii=False, indent=1)

    print('bolum       : %d' % len(sections))
    print('etkinlik    : %d' % len(cards))
    print('gorsel      : %d  (%.1f MB)' % (written, bayt / 1048576))
    print('hazir dizi  : %d' % len(ready))
    print('takvim dizi : %d' % len(calendar))
    print('yeni ad     : %d' % yeniden_adlanan)


if __name__ == '__main__':
    main()
