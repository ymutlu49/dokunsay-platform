import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useT } from '../i18n';
import { diziBul } from '../content';
import { bosKayit, kayitOku, kayitSil, kayitYaz, kendiDizileriOku } from '../lib/store';
import { onerilenStratejiler, stratejiBul } from '../lib/stratejiler';
import { aracBul } from '../tools/kayit';
import { Bos } from '../ui/Parcalar';
import { IkonArti, IkonBasparmak, IkonGoz, IkonKapat, IkonKilit, IkonOk } from '../ui/Ikonlar';
import type { Asama, NumberString, ProblemKaydi, TalkRecord } from '../lib/types';

const ASAMALAR: Asama[] = ['dusunme', 'cevaplar', 'yollar', 'uzlasma'];

function bosProblem(): ProblemKaydi {
  return { cevaplar: [], yollar: [], hazir: 0, ikinciYol: 0 };
}

function sure(sn: number) {
  const d = Math.floor(sn / 60);
  const s = sn % 60;
  return `${d}:${String(s).padStart(2, '0')}`;
}

/**
 * Sayı konuşması tahtası.
 *
 * Ekran, tekniğin kendi sırasını izler (Bölüm 12): sessiz düşünme → bütün
 * cevapların yazılması → yolların paylaşılması → sınıfın uzlaşması. Aşamalar
 * ayrı ayrı durur çünkü tekniğin bozulduğu yer tam da bunların birbirine
 * karışmasıdır: cevap gelir gelmez doğrusunu söylemek, ya da yol anlatılmadan
 * stratejiyi adlandırmak.
 *
 * Kitabın üç kuralı arayüze gömülüdür:
 *  1. Son işlem kilitlidir; açmak için bilinçli bir hamle gerekir.
 *  2. Strateji adı yol yazılmadan seçilemez.
 *  3. Gelen her cevap yazılır; doğru işareti ancak uzlaşma aşamasında konur.
 */
export default function DiziTahta() {
  const t = useT();
  const { id } = useParams();

  const dizi: NumberString | undefined = useMemo(() => {
    if (!id) return undefined;
    const cozulmus = decodeURIComponent(id);
    return diziBul(cozulmus) ?? kendiDizileriOku().find((d) => d.id === cozulmus);
  }, [id]);

  if (!dizi) return <Bos metin={t('etkinlikSonucYok')} />;

  // key: başka bir diziye geçildiğinde bütün oturum durumu sıfırlanmalı,
  // yoksa yeni dizinin kayıtları eskisinin altına yazılır.
  return <Tahta key={dizi.id} dizi={dizi} />;
}

function Tahta({ dizi }: { dizi: NumberString }) {
  const t = useT();
  const nav = useNavigate();

  const [kayit, setKayit] = useState<TalkRecord>(
    () => kayitOku(dizi.id) ?? bosKayit(dizi.id),
  );
  const [i, setI] = useState(0);
  const [asama, setAsama] = useState<Asama>('dusunme');
  const [sonAcik, setSonAcik] = useState(false);
  const [gecen, setGecen] = useState(0);
  const [sayacCalisiyor, setSayacCalisiyor] = useState(true);
  const [cevapGirdi, setCevapGirdi] = useState('');
  const [yolGirdi, setYolGirdi] = useState('');
  const [temsilArac, setTemsilArac] = useState<string | null>(null);
  const [ozet, setOzet] = useState(false);
  const [kopyalandi, setKopyalandi] = useState(false);
  const cevapRef = useRef<HTMLInputElement>(null);

  const problem = dizi.problems[i];
  const son = dizi.problems.length - 1;
  const sonuncuda = i === son;
  const kilitli = sonuncuda && !sonAcik;
  const kayitli: ProblemKaydi = kayit.problems[i] ?? bosProblem();

  useEffect(() => {
    kayitYaz(kayit);
  }, [kayit]);

  // Sessiz düşünme sayacı: geri sayım değil, geçen süre. Amaç baskı kurmak
  // değil, öğretmenin bekleme süresini görmesi (Bölüm 12, 17).
  useEffect(() => {
    if (asama !== 'dusunme' || !sayacCalisiyor || kilitli) return;
    const z = window.setInterval(() => setGecen((v) => v + 1), 1000);
    return () => window.clearInterval(z);
  }, [asama, sayacCalisiyor, kilitli]);

  /**
   * Problemin kaydını günceller. Yama bir işlev de olabilir; başparmak sayacı
   * gibi art arda dokunulan denetimlerde her dokunuş bir öncekinin sonucunu
   * görmelidir — sabit nesne verilirse hızlı dokunuşlar birbirini ezer.
   */
  const guncelle = useCallback(
    (yama: Partial<ProblemKaydi> | ((onceki: ProblemKaydi) => Partial<ProblemKaydi>)) => {
      setKayit((k) => {
        const onceki = k.problems[i] ?? bosProblem();
        const parca = typeof yama === 'function' ? yama(onceki) : yama;
        return { ...k, problems: { ...k.problems, [i]: { ...onceki, ...parca } } };
      });
    },
    [i],
  );

  function asamaGec(yon: 1 | -1) {
    const k = ASAMALAR.indexOf(asama) + yon;
    if (k < 0) return;
    if (k >= ASAMALAR.length) return;
    if (asama === 'dusunme' && yon === 1) {
      guncelle({ dusunmeSn: gecen });
      setSayacCalisiyor(false);
    }
    setAsama(ASAMALAR[k]);
  }

  function problemGec(yon: 1 | -1) {
    const k = i + yon;
    if (k < 0 || k > son) return;
    setI(k);
    setAsama('dusunme');
    setGecen(0);
    setSayacCalisiyor(true);
    setCevapGirdi('');
    setYolGirdi('');
    setTemsilArac(null);
  }

  function cevapEkle() {
    const v = cevapGirdi.trim();
    if (!v) return;
    guncelle((o) => ({ cevaplar: [...o.cevaplar, v] }));
    setCevapGirdi('');
    cevapRef.current?.focus();
  }

  function yolEkle() {
    const v = yolGirdi.trim();
    if (!v) return;
    guncelle((o) => ({ yollar: [...o.yollar, { metin: v }] }));
    setYolGirdi('');
  }

  function yolaStrateji(k: number, ad: string) {
    guncelle((o) => ({
      yollar: o.yollar.map((y, x) =>
        x === k ? { ...y, strateji: y.strateji === ad ? undefined : ad } : y,
      ),
    }));
  }

  function ozetMetni() {
    const satirlar = [
      `${dizi.strategy} — ${new Date(kayit.startedAt).toLocaleDateString('tr-TR')}`,
      '',
    ];
    dizi.problems.forEach((p, k) => {
      const kk = kayit.problems[k];
      if (!kk) {
        satirlar.push(`${k + 1}. ${p}   (çalışılmadı)`);
        return;
      }
      satirlar.push(`${k + 1}. ${p}`);
      satirlar.push(
        `     cevaplar: ${kk.cevaplar.join(', ') || '—'}${kk.uzlasma ? `   · uzlaşma: ${kk.uzlasma}` : ''}`,
      );
      if (kk.dusunmeSn) satirlar.push(`     düşünme: ${sure(kk.dusunmeSn)} · hazır: ${kk.hazir ?? 0}`);
      kk.yollar.forEach((y) =>
        satirlar.push(`     yol: ${y.metin}${y.strateji ? `   [${y.strateji}]` : ''}`),
      );
    });
    const stratejiler = [
      ...new Set(
        Object.values(kayit.problems)
          .flatMap((p) => p.yollar.map((y) => y.strateji))
          .filter(Boolean) as string[],
      ),
    ];
    if (stratejiler.length) {
      satirlar.push('', `Çıkan stratejiler: ${stratejiler.join(', ')}`);
    }
    return satirlar.join('\n');
  }

  // ------------------------------------------------------------- özet ekranı
  if (ozet) {
    return (
      <div className="tahta renk-9">
        <div className="tahta-ust">
          <strong style={{ flex: 1, color: 'var(--lacivert)' }}>{t('tahtaOzet')}</strong>
          <button className="dugme-sade" onClick={() => nav('/dizi')} aria-label={t('kapat')}>
            <IkonKapat />
          </button>
        </div>
        <div className="tahta-govde">
          <p className="kucuk">{t('tahtaOzetAciklama')}</p>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
              background: 'var(--sayfa)',
              padding: 16,
              borderRadius: 'var(--r-m)',
              lineHeight: 1.7,
              fontSize: '0.92rem',
            }}
          >
            {ozetMetni()}
          </pre>
          <button
            className="dugme-sade kucuk"
            style={{ alignSelf: 'flex-start' }}
            onClick={() => {
              kayitSil(dizi.id);
              setKayit(bosKayit(dizi.id));
              setI(0);
              setAsama('dusunme');
              setGecen(0);
              setOzet(false);
            }}
          >
            {t('tahtaOturumuSil')}
          </button>
        </div>
        <div className="tahta-alt">
          <button className="dugme dugme-ikincil" onClick={() => setOzet(false)}>
            {t('geri')}
          </button>
          <span className="bosluk" />
          <button
            className="dugme"
            onClick={() => {
              navigator.clipboard?.writeText(ozetMetni());
              setKopyalandi(true);
              window.setTimeout(() => setKopyalandi(false), 1800);
            }}
          >
            {kopyalandi ? t('tahtaKopyalandi') : t('tahtaKopyala')}
          </button>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------ temsil (araç) modu
  const temsil = temsilArac ? aracBul(temsilArac) : undefined;
  if (temsil) {
    const Bilesen = temsil.bilesen;
    return (
      <div className={`tahta renk-${temsil.renk}`}>
        <div className="tahta-ust">
          <span className="rozet rozet-dolu">{problem}</span>
          <strong style={{ flex: 1, minWidth: 0, color: 'var(--lacivert)' }}>{t(temsil.ad)}</strong>
          <button className="dugme dugme-ikincil" onClick={() => setTemsilArac(null)}>
            {t('tahtaTemsilBitir')}
          </button>
        </div>
        <div className="tahta-govde">
          <p className="kucuk">{t('tahtaTemsilAciklama')}</p>
          <Bilesen />
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------- tahta modu
  const asamaNo = ASAMALAR.indexOf(asama);
  const oneriler = onerilenStratejiler(problem);

  return (
    <div className="tahta renk-9">
      <div className="tahta-ust">
        <span className="rozet rozet-notr">
          {t('tahtaProblemNo', { no: i + 1, toplam: dizi.problems.length })}
        </span>

        {/* aşama şeridi — tekniğin sırası görünür durur */}
        <div className="asama-serit bosluk" role="tablist" aria-label={t('tahtaAsamalar')}>
          {ASAMALAR.map((a, k) => (
            <button
              key={a}
              role="tab"
              aria-selected={a === asama}
              className={a === asama ? 'etkin' : k < asamaNo ? 'gecildi' : undefined}
              onClick={() => !kilitli && setAsama(a)}
              disabled={kilitli}
            >
              {t(`asama_${a}` as 'asama_dusunme')}
            </button>
          ))}
        </div>

        {kayit.named ? (
          <span className="rozet rozet-dolu">{t('diziStratejiAd', { ad: dizi.strategy })}</span>
        ) : (
          <button
            className="dugme-sade satir kucuk"
            onClick={() => setKayit((k) => ({ ...k, named: true }))}
            title={t('diziAdUyari')}
          >
            <IkonGoz size={17} />
            {t('diziStratejiGoster')}
          </button>
        )}
        <button className="dugme-sade" onClick={() => nav('/dizi')} aria-label={t('kapat')}>
          <IkonKapat />
        </button>
      </div>

      <div className="tahta-govde">
        {/* --- problem */}
        <div style={{ padding: '10px 0 18px' }}>
          {kilitli ? (
            <div className="ortala">
              <div
                className="dev-problem"
                style={{ color: 'var(--gri-acik)', userSelect: 'none' }}
                aria-hidden="true"
              >
                ?
              </div>
              <div
                className="kart"
                style={{
                  padding: 18,
                  marginTop: 18,
                  background: 'var(--zemin-kirmizi)',
                  borderColor: 'var(--r5)',
                  textAlign: 'left',
                  maxWidth: 460,
                  marginInline: 'auto',
                }}
              >
                <div className="satir" style={{ color: 'var(--r5)', fontWeight: 750, marginBottom: 6 }}>
                  <IkonKilit size={18} />
                  {t('tahtaSonKilit')}
                </div>
                <p className="kucuk" style={{ margin: '0 0 12px' }}>
                  {t('tahtaSonKilitAciklama')}
                </p>
                <button className="dugme dugme-ikincil" onClick={() => setSonAcik(true)}>
                  {t('tahtaSonAc')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="dev-problem">{problem}</div>
              {/* önceki problemler görünür kalır: dizi birbirine yaslanır */}
              {i > 0 && (
                <div className="ortala kucuk" style={{ marginTop: 10 }}>
                  {dizi.problems.slice(0, i).map((p, k) => (
                    <span key={k} style={{ marginRight: 14 }}>
                      {p}
                      {kayit.problems[k]?.uzlasma ? ` = ${kayit.problems[k]?.uzlasma}` : ''}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {!kilitli && asama === 'dusunme' && (
          <section className="ortala">
            <div
              style={{
                fontSize: 'clamp(2rem, 8vw, 3.4rem)',
                fontWeight: 750,
                color: 'var(--lacivert)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {sure(gecen)}
            </div>
            <p className="kucuk" style={{ maxWidth: '40ch', margin: '4px auto 18px' }}>
              {t('tahtaDusunmeAciklama')}
            </p>

            <div className="satir" style={{ justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="basparmak"
                onClick={() => guncelle((o) => ({ hazir: (o.hazir ?? 0) + 1 }))}
              >
                <IkonBasparmak size={30} />
                <span>{kayitli.hazir ?? 0}</span>
                <small>{t('tahtaHazir')}</small>
              </button>
              <button
                className="basparmak ikincil"
                onClick={() => guncelle((o) => ({ ikinciYol: (o.ikinciYol ?? 0) + 1 }))}
              >
                <span>{kayitli.ikinciYol ?? 0}</span>
                <small>{t('tahtaIkinciYol')}</small>
              </button>
            </div>

            <div className="satir" style={{ justifyContent: 'center', gap: 8, marginTop: 14 }}>
              <button className="secim" onClick={() => setSayacCalisiyor((v) => !v)}>
                {sayacCalisiyor ? t('tahtaDurdur') : t('tahtaDevam')}
              </button>
              <button
                className="secim"
                onClick={() => {
                  setGecen(0);
                  guncelle({ hazir: 0, ikinciYol: 0 });
                }}
              >
                {t('sifirla')}
              </button>
            </div>
          </section>
        )}

        {!kilitli && asama === 'cevaplar' && (
          <section>
            <h3 className="alan-basligi">{t('tahtaCevapBaslik')}</h3>
            <p className="kucuk" style={{ marginTop: 0 }}>
              {t('tahtaCevapAciklama')}
            </p>
            <div className="sarmal" style={{ margin: '10px 0 14px' }}>
              {kayitli.cevaplar.map((c, k) => (
                <span key={k} className="cevap-cipi">
                  {c}
                  <button
                    onClick={() =>
                      guncelle((o) => ({ cevaplar: o.cevaplar.filter((_, x) => x !== k) }))
                    }
                    aria-label={t('sil')}
                  >
                    ×
                  </button>
                </span>
              ))}
              {kayitli.cevaplar.length === 0 && <span className="kucuk">{t('tahtaCevapBos')}</span>}
            </div>
            <div className="satir">
              <input
                ref={cevapRef}
                className="girdi"
                value={cevapGirdi}
                onChange={(e) => setCevapGirdi(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && cevapEkle()}
                placeholder={t('tahtaCevapIpucu')}
                inputMode="numeric"
                aria-label={t('tahtaCevapEkle')}
              />
              <button className="dugme" onClick={cevapEkle} aria-label={t('tahtaCevapEkle')}>
                <IkonArti />
              </button>
            </div>
          </section>
        )}

        {!kilitli && asama === 'yollar' && (
          <section>
            <h3 className="alan-basligi">{t('tahtaYolBaslik')}</h3>
            <p className="kucuk" style={{ marginTop: 0 }}>
              {t('tahtaYolAciklama')}
            </p>

            <ul className="liste-sade" style={{ margin: '10px 0 14px' }}>
              {kayitli.yollar.map((y, k) => {
                const st = y.strateji ? stratejiBul(y.strateji) : undefined;
                return (
                  <li key={k} className="kart" style={{ padding: 12, marginBottom: 10 }}>
                    <div className="satir" style={{ alignItems: 'flex-start' }}>
                      <span className="adim-no">{k + 1}</span>
                      <span style={{ flex: 1 }}>{y.metin}</span>
                      <button
                        className="dugme-sade kucuk"
                        onClick={() =>
                          guncelle((o) => ({ yollar: o.yollar.filter((_, x) => x !== k) }))
                        }
                        aria-label={t('sil')}
                      >
                        ×
                      </button>
                    </div>
                    {/* Ad, yol yazıldıktan sonra konur — kitabın kuralı. */}
                    <div className="secim-serit" style={{ marginTop: 8 }}>
                      {oneriler.map((s) => (
                        <button
                          key={s.ad}
                          className={y.strateji === s.ad ? 'secim etkin' : 'secim'}
                          onClick={() => yolaStrateji(k, s.ad)}
                        >
                          {s.ad}
                        </button>
                      ))}
                    </div>
                    {st?.arac && (
                      <button
                        className="dugme dugme-ikincil"
                        style={{ marginTop: 10 }}
                        onClick={() => setTemsilArac(st.arac!)}
                      >
                        {t('tahtaTemsilEt')}
                      </button>
                    )}
                  </li>
                );
              })}
              {kayitli.yollar.length === 0 && <li className="kucuk">{t('tahtaYolBos')}</li>}
            </ul>

            <div className="satir">
              <input
                className="girdi"
                value={yolGirdi}
                onChange={(e) => setYolGirdi(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && yolEkle()}
                placeholder={t('tahtaYolIpucu')}
                aria-label={t('tahtaYolEkle')}
              />
              <button className="dugme" onClick={yolEkle} aria-label={t('tahtaYolEkle')}>
                <IkonArti />
              </button>
            </div>
          </section>
        )}

        {!kilitli && asama === 'uzlasma' && (
          <section>
            <h3 className="alan-basligi">{t('tahtaUzlasmaBaslik')}</h3>
            <p className="kucuk" style={{ marginTop: 0 }}>
              {t('tahtaUzlasmaAciklama')}
            </p>
            <div className="sarmal" style={{ margin: '12px 0' }}>
              {kayitli.cevaplar.map((c, k) => (
                <button
                  key={k}
                  className={kayitli.uzlasma === c ? 'cevap-cipi secili' : 'cevap-cipi'}
                  onClick={() => guncelle((o) => ({ uzlasma: o.uzlasma === c ? undefined : c }))}
                >
                  {kayitli.uzlasma === c ? '✓ ' : ''}
                  {c}
                </button>
              ))}
              {kayitli.cevaplar.length === 0 && <span className="kucuk">{t('tahtaCevapBos')}</span>}
            </div>
          </section>
        )}
      </div>

      <div className="tahta-alt">
        <button
          className="dugme dugme-ikincil"
          onClick={() => (asamaNo === 0 ? problemGec(-1) : asamaGec(-1))}
          disabled={i === 0 && asamaNo === 0}
        >
          <IkonOk yon="sol" />
        </button>
        <div className="bosluk nokta-serit" aria-hidden="true">
          {dizi.problems.map((_, k) => (
            <span key={k} className={k === i ? 'etkin' : undefined} />
          ))}
        </div>
        {asamaNo < ASAMALAR.length - 1 ? (
          <button className="dugme" onClick={() => asamaGec(1)} disabled={kilitli}>
            {t(`asama_${ASAMALAR[asamaNo + 1]}` as 'asama_dusunme')}
            <IkonOk />
          </button>
        ) : sonuncuda ? (
          <button className="dugme" onClick={() => setOzet(true)}>
            {t('bitir')}
          </button>
        ) : (
          <button className="dugme" onClick={() => problemGec(1)}>
            {t('tahtaSonrakiProblem')}
            <IkonOk />
          </button>
        )}
      </div>
    </div>
  );
}
