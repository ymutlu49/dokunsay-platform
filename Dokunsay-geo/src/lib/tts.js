// ══════════════════════════════════════════════════════════════
// Sesli anlatım (Web Speech API).
// Kurmancî için tarayıcı desteği olmadığından tr-TR fonetik setini kullanırız.
// ══════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════
// SESLİ ANLATIM (TTS) — Web Speech API
// Kaynaklar: Apostolidou (2025) — multisensör girdisi diskalküli için kritik;
//            TouchMath — işitsel kanal bilişsel yükü azaltır.
// Kurmancî için: tarayıcı TTS Kurmancî (ku/kmr) desteklemediğinden
// Türkçe fonetik seti (tr) ile yaklaştırıyoruz — mükemmel değil,
// ama Türkçe sesli harf + ünsüz seti Kurmancî'ye yakın.
// ══════════════════════════════════════════════════════════════
export const TTS={
  enabled:true,
  _currentUtter:null,
  speak(text,lang){
    if(!text||!this.enabled) return;
    if(typeof window==="undefined"||!window.speechSynthesis) return;
    /* Önceki okuma varsa iptal et (üst üste binmeyi önle) */
    window.speechSynthesis.cancel();
    const utter=new SpeechSynthesisUtterance(text);
    /* Dil eşlemesi: ku → tr (fonetik yakınlık), diğerleri doğrudan */
    const speechLang={tr:"tr-TR",ku:"tr-TR",en:"en-US"}[lang]||"tr-TR";
    utter.lang=speechLang;
    utter.rate=0.95;    // biraz yavaş, diskalküli için
    utter.pitch=1.0;
    utter.volume=1.0;
    this._currentUtter=utter;
    window.speechSynthesis.speak(utter);
  },
  stop(){
    if(typeof window!=="undefined"&&window.speechSynthesis){
      window.speechSynthesis.cancel();
      this._currentUtter=null;
    }
  },
  isAvailable(){
    return typeof window!=="undefined"&&!!window.speechSynthesis;
  },
};
