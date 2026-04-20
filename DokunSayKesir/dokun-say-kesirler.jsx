import { useState, useRef, useEffect } from "react";

var FC=["#f59e0b","#3b82f6","#ef4444","#22c55e","#8b5cf6","#ec4899","#06b6d4","#f97316","#14b8a6"];
var FB=["#b45309","#1d4ed8","#b91c1c","#15803d","#6d28d9","#be185d","#0891b2","#c2410c","#0d9488"];
var VERBAL={1:"bir tam",2:"yarım",3:"üçte bir",4:"çeyrek",5:"beşte bir",6:"altıda bir",8:"sekizde bir",10:"onda bir",12:"on ikide bir"};
var BAR_PARTS=[1,2,3,4,5,6,8,10,12];

var ACT=[
  {n:"Serbest Keşif",i:"🎨",cat:"keşif",diff:1,d:"Modeller ekle, çubukları sürükle, işaretlere tıkla. Kendi kesir ifadeni oluştur!",k:"",
    s:null},

  /* 1. Sınıf — M.1.1.4.1 */
  {n:"Bütün Nedir?",i:"🟡",cat:"kavram",diff:1,d:"Soldan 1/4 çubuğunu sürükle ve modele 4 kez bırak. Bütün = parçalara ayrılmamış tam hal! Sayı doğrusunda 1'e ulaştığını gör.",k:"M.1.1.4.1",
    s:{m:[{w:1,p:[]}],o:{}}},
  {n:"Yarımı Bul",i:"🌓",cat:"kavram",diff:1,d:"Bir bütünü iki eş parçaya böldüğümüzde her biri yarımdır. Soldan 1/2 çubuğunu sürükle. İkinci 1/2'yi de koyarak bütünü tamamla!",k:"M.1.1.4.1",
    s:{m:[{w:1,p:[]}],o:{}}},
  {n:"Kaç Yarım = 1 Bütün?",i:"🔢",cat:"kavram",diff:1,d:"1/2 çubuklarıyla modeli doldur. Bir bütünde kaç yarım var? Cevabı bulduktan sonra + tuşuyla 2 tama genişlet ve 4 yarım dene!",k:"M.1.1.4.1",
    s:{m:[{w:1,p:[]}],o:{}}},

  /* 2. Sınıf — M.2.1.6.1 */
  {n:"Çeyrek Keşfi",i:"🔲",cat:"kavram",diff:1,d:"Soldan 1/4 çubuğunu sürükle ve modele 4 kez bırak. Her parça bir çeyrek! 4 çeyrek = 1 bütün.",k:"M.2.1.6.1",
    s:{m:[{w:1,p:[]}],o:{}}},
  {n:"Yarımda Kaç Çeyrek?",i:"🧩",cat:"kavram",diff:2,d:"Sol modele 1/2 çubuğu koy. Sağ modele 1/4 çubukları koyarak yarıma denk kesri bul. = işaretine tıklayarak doğrula!",k:"M.2.1.6.1",
    s:{m:[{w:1,p:[{n:2}]},{w:1,p:[]}],o:{0:"="}}},
  {n:"Bütün-Yarım-Çeyrek İlişkisi",i:"📊",cat:"kavram",diff:2,d:"Sol model 1/2 + 1/2 ile dolu. Orta modele 1/4 çubukları koyarak denk yap. = işaretleri ile doğrula!",k:"M.2.1.6.1",
    s:{m:[{w:1,p:[{n:2},{n:2}]},{w:1,p:[]},{w:1,p:[]}],o:{0:"=",1:"="}}},

  /* 3. Sınıf — M.3.1.6.x */
  {n:"Kesir Nedir? Pay ve Payda",i:"📝",cat:"kavram",diff:2,d:"Payda: bütün kaç eş parçaya bölündü. Pay: kaç parça alındı. 1/4 çubuğunu 3 kez modele koy → 3/4 oluşur. Pay=3, Payda=4!",k:"M.3.1.6.1",
    s:{m:[{w:1,p:[]}],o:{}}},
  {n:"Birim Kesir",i:"1️⃣",cat:"kavram",diff:2,d:"Her bir eş parça birim kesirdir. Sol model 1/6 ile gösterilmiş. Diğer modellere farklı birim kesirler koy ve karşılaştır!",k:"M.3.1.6.2",
    s:{m:[{w:1,p:[{n:6}]},{w:1,p:[]},{w:1,p:[]}],o:{}}},
  {n:"Basit Kesir Oluştur",i:"✂️",cat:"kavram",diff:2,d:"Payı paydasından küçük olan kesirler basit kesirdir. 1/5 çubuğunu 3 kez koy → 3/5. Sayı doğrusunda 0 ile 1 arasında olduğunu gör!",k:"M.3.1.6.6",
    s:{m:[{w:1,p:[]}],o:{}}},

  /* 4. Sınıf — M.4.1.6.x */
  {n:"Basit, Bileşik, Tam Sayılı",i:"📐",cat:"kavram",diff:3,d:"Sol: basit kesir (3/5). Sağ: modeli 2 tama genişlet ve 7 tane 1/5 koy → 7/5 bileşik kesir! Sayı doğrusunda 1'i geçtiğini gör.",k:"M.4.1.6.1",
    s:{m:[{w:1,p:[{n:5},{n:5},{n:5}]},{w:2,p:[]}],o:{}}},
  {n:"Birim Kesirleri Karşılaştır",i:"⚖️",cat:"karşılaştır",diff:2,d:"Sol modele 1/3, sağ modele 1/5 koy. Hangisinin sayı doğrusu çubuğu daha uzun? Payda büyüdükçe dilim küçülür!",k:"M.4.1.6.2",
    s:{m:[{w:1,p:[{n:3}]},{w:1,p:[{n:5}]}],o:{}}},
  {n:"Paydaları Eşit Kesirler",i:"📏",cat:"karşılaştır",diff:2,d:"Sol modelde 1/4 var. Sağ modele üç tane 1/4 koy. 1/4 < 3/4. Paydalar eşit olduğunda payı büyük olan kesir büyüktür!",k:"M.4.1.6.4",
    s:{m:[{w:1,p:[{n:4}]},{w:1,p:[{n:4},{n:4},{n:4}]}],o:{}}},

  /* İşlemler */
  {n:"Kesir Toplama",i:"➕",cat:"işlem",diff:3,d:"Sol model: 1/3. Orta model: 2/3. + ve = işaretleri hazır. Sağ modele toplamı oluştur! 1/3 + 2/3 = ?",k:"M.4.1.7.1",
    s:{m:[{w:1,p:[{n:3}]},{w:1,p:[{n:3},{n:3}]},{w:1,p:[]}],o:{0:"+",1:"="}}},
  {n:"Kesir Çıkarma",i:"➖",cat:"işlem",diff:3,d:"Sol model: 5/6. Orta model: 2/6. − ve = işaretleri hazır. Sağ modele farkı oluştur! 5/6 − 2/6 = ?",k:"M.4.1.7.1",
    s:{m:[{w:1,p:[{n:6},{n:6},{n:6},{n:6},{n:6}]},{w:1,p:[{n:6},{n:6}]},{w:1,p:[]}],o:{0:"−",1:"="}}},
  {n:"Günlük Hayat Problemi",i:"🛒",cat:"işlem",diff:3,d:"Kader parasının 2/8'ini ekmeğe, 3/8'ini süte harcadı. Toplamda kaçta kaçını harcadı? + ve = hazır, cevabı sağ modele koy!",k:"M.4.1.7.2",
    s:{m:[{w:1,p:[{n:8},{n:8}]},{w:1,p:[{n:8},{n:8},{n:8}]},{w:1,p:[]}],o:{0:"+",1:"="}}},

  /* Çarpma İşlemleri */
  {n:"Kesrin Yarısı",i:"✖️",cat:"işlem",diff:2,d:"1/2 × 1/2 = ? İlk modele 1/2 koy. Yarısının yarısı ne kadar? Sağ modelde 1/4 oluştur! Çarpma her zaman büyütmez.",k:"M.4.1.7.1",
    s:{m:[{w:1,p:[{n:2}]},{w:1,p:[{n:2}]},{w:1,p:[]}],o:{0:"×",1:"="}}},
  {n:"Kesir × Kesir",i:"✖️",cat:"işlem",diff:3,d:"1/3 × 1/2 = ? Bir bütünün üçte birinin yarısı ne kadar? Cevap 1/6! Sağ modele bir 1/6 koy ve doğrula.",k:"M.4.1.7.1",
    s:{m:[{w:1,p:[{n:3}]},{w:1,p:[{n:2}]},{w:1,p:[]}],o:{0:"×",1:"="}}},
  {n:"Tam Sayı × Kesir",i:"✖️",cat:"işlem",diff:3,d:"3 × 1/4 = ? Üç tane çeyrek ne eder? Sol model 3/4 ile dolu (3 tane 1/4). Sağ modelde aynısını oluştur!",k:"M.4.1.7.1",
    s:{m:[{w:1,p:[{n:4},{n:4},{n:4}]},{w:1,p:[]}],o:{0:"="}}},

  /* Bölme İşlemleri */
  {n:"Bütünde Kaç Yarım?",i:"➗",cat:"işlem",diff:2,d:"1 ÷ 1/2 = ? Bir bütünün içinde kaç tane yarım var? Modeli 1/2 çubuklarıyla doldur. Cevap 2! Bölme küçültmeyebilir.",k:"M.4.1.7.1",
    s:{m:[{w:1,p:[]}],o:{}}},
  {n:"Yarımda Kaç Çeyrek?",i:"➗",cat:"işlem",diff:2,d:"1/2 ÷ 1/4 = ? Sol model 1/2 dolu. 1/2'nin içinde kaç tane 1/4 var? ✂️ makasla 1/2'yi kes ve say!",k:"M.4.1.7.1",
    s:{m:[{w:1,p:[{n:2}]},{w:1,p:[{n:4}]},{w:1,p:[]}],o:{0:"÷",1:"="}}},
  {n:"Kesir ÷ Kesir",i:"➗",cat:"işlem",diff:3,d:"3/4 ÷ 1/4 = ? Sol model: 3/4 (üç tane 1/4). Bir 1/4'ün içinde kaç 1/4 var? → 3! Modeli 2 tama genişlet ve cevabı oluştur.",k:"M.4.1.7.1",
    s:{m:[{w:1,p:[{n:4},{n:4},{n:4}]},{w:1,p:[{n:4}]},{w:2,p:[]}],o:{0:"÷",1:"="}}},
  {n:"Bölme Problemi",i:"🍕",cat:"işlem",diff:3,d:"3 dilim pizza var, her biri 1/6. Toplam ne kadar pizza yenmiş? 3 × 1/6 = 3/6 = 1/2. İki yoldan da doğrula!",k:"M.4.1.7.2",
    s:{m:[{w:1,p:[{n:6},{n:6},{n:6}]},{w:1,p:[{n:2}]}],o:{0:"="}}},

  /* Kavram Yanılgıları */
  {n:"Y1: Bütün aynı mı?",i:"🔍",cat:"yanılgı",diff:2,d:"Kesirlerde miktar referans alınan bütüne bağlıdır. İki modeldeki 1/2'lere bak — bütünler aynı olduğunda yarımlar da eşittir.",k:"KY",
    s:{m:[{w:1,p:[{n:2}]},{w:1,p:[{n:2}]}],o:{0:"="}}},
  {n:"Y2: Payda büyük = büyük mü?",i:"🔍",cat:"yanılgı",diff:2,d:"1/6 mı 1/4 mü büyük? Modellerdeki çubuk uzunluklarını karşılaştır. Payda büyükse parça KÜÇÜK olur!",k:"KY",
    s:{m:[{w:1,p:[{n:6}]},{w:1,p:[{n:4}]}],o:{}}},
  {n:"Y3: Eş parçalar şartı",i:"🔍",cat:"yanılgı",diff:2,d:"Kesirde bütün EŞİT parçalara bölünür. Modele farklı boyutlu çubuklar koy — her parça paydadaki sayı kadar çoğaltıldığında aynı bütünü vermeli!",k:"KY",
    s:{m:[{w:1,p:[]}],o:{}}},
  {n:"Y4: Sayı doğrusunda konum",i:"🔍",cat:"yanılgı",diff:3,d:"Kesirler sayı doğrusunda birer konumdur. İki modele farklı kesirler koy. Sayı doğrusundaki okların yerini karşılaştır!",k:"KY",
    s:{m:[{w:1,p:[{n:4},{n:4},{n:4}]},{w:1,p:[{n:3},{n:3}]}],o:{}}},
  {n:"Y5: Payda toplanır mı?",i:"🔍",cat:"yanılgı",diff:3,d:"1/4 + 1/4 = 2/8 mi? HAYIR! Sol modelde 2/4 var, sağ modele 2/8 koy. = işareti ile kontrol et — aynı yer mi?",k:"KY",
    s:{m:[{w:1,p:[{n:4},{n:4}]},{w:1,p:[{n:8},{n:8}]}],o:{0:"="}}},
  {n:"Y6: Çarpma büyütür mü?",i:"🔍",cat:"yanılgı",diff:3,d:"Tam sayılarda çarpma büyütür ama kesirlerde her zaman değil! 1/2 ve 1/4'ü karşılaştır. 1/2 × 1/2 = 1/4 → sonuç küçüldü!",k:"KY",
    s:{m:[{w:1,p:[{n:2}]},{w:1,p:[{n:4}]}],o:{}}},
  {n:"Y7: Bölme küçültür mü?",i:"🔍",cat:"yanılgı",diff:3,d:"1 ÷ 1/2 = 2! Model 2 tama genişletilmiş. 1/2 çubuklarıyla 2'ye kadar doldur — 1'in içinde kaç yarım var?",k:"KY",
    s:{m:[{w:2,p:[]}],o:{}}},

  /* Yeni Kavram Yanılgıları — Literatür Taramasından */
  {n:"Y8: Kesir iki ayrı sayı mı?",i:"🔬",cat:"yanılgı",diff:2,d:"3/4 iki ayrı sayı (3 ve 4) değil, TEK bir değerdir! Modele üç tane 1/4 koy. Sayı doğrusunda 3/4'ün TEK bir noktada olduğunu gör. (Stafylidou & Vosniadou, 2004; Hwang & Riccomini, 2021)",k:"KY",
    s:{m:[{w:1,p:[{n:4},{n:4},{n:4}]}],o:{}}},
  {n:"Y9: 0 ile 1 arası boş mu?",i:"🔬",cat:"yanılgı",diff:2,d:"0 ile 1 arasında sonsuz kesir vardır! İlk modele 1/2, ikinciye 1/3, üçüncüye 1/4 koy. Sayı doğrularında hepsinin 0-1 arasında ama farklı yerlerde olduğunu gör. (Ni & Zhou, 2005)",k:"KY",
    s:{m:[{w:1,p:[{n:2}]},{w:1,p:[{n:3}]},{w:1,p:[{n:4}]}],o:{}}},
  {n:"Y10: Pay arttıkça ne olur?",i:"🔬",cat:"yanılgı",diff:2,d:"Payda sabitken pay arttıkça kesir BÜYÜR. İlk modele 1/6, ikinciye 3/6, üçüncüye 5/6 koy. Sayı doğrusunda kırmızı okların nasıl ilerlediğini karşılaştır! (Aksoy & Yazlık, 2017)",k:"KY",
    s:{m:[{w:1,p:[{n:6}]},{w:1,p:[{n:6},{n:6},{n:6}]},{w:1,p:[{n:6},{n:6},{n:6},{n:6},{n:6}]}],o:{}}},
  {n:"Y11: 5/4 = 1 tam 1/4 mü?",i:"🔬",cat:"yanılgı",diff:3,d:"Bileşik kesir ↔ tam sayılı kesir dönüşümü. Sol model 2 tama genişletilmiş, beş 1/4 koy → 5/4. Sağ modele 1 tam + bir 1/4 koy. Aynı mı? = ile kontrol! (Pesen, 2007)",k:"KY",
    s:{m:[{w:2,p:[{n:4},{n:4},{n:4},{n:4},{n:4}]},{w:2,p:[]}],o:{0:"="}}},
  {n:"Y12: Çıkarmada terslik",i:"🔬",cat:"yanılgı",diff:3,d:"3/5 − 1/5 hesaplarken bazı öğrenciler büyükten küçüğü (5−3=2, 5−1=4 → 2/4) çıkarır. Modelle göster: 3/5'ten bir 1/5 çıkar, kalan 2/5! (Biber, Tuna & Aktaş, 2013)",k:"KY",
    s:{m:[{w:1,p:[{n:5},{n:5},{n:5}]},{w:1,p:[{n:5}]},{w:1,p:[]}],o:{0:"−",1:"="}}},
  {n:"Y13: Toplama mı çarpma mı?",i:"🔬",cat:"yanılgı",diff:3,d:"Kesir çarpma kuralını (pay×pay, payda×payda) toplama/çıkarmaya uygulama hatası! 1/3+1/3 = 1/9 DEĞİL, 2/3'tür. Modelle doğrula! (Soylu & Soylu, 2005; Alkhateeb, 2019)",k:"KY",
    s:{m:[{w:1,p:[{n:3}]},{w:1,p:[{n:3}]},{w:1,p:[]}],o:{0:"+",1:"="}}},
  {n:"Y14: Denk kesir nasıl bulunur?",i:"🔬",cat:"yanılgı",diff:2,d:"1/2 = 2/4 = 3/6. Denk kesir bulmak için pay VE payda aynı sayıyla çarpılır/bölünür. Sol modele iki 1/4, sağ modele bir 1/2 koy. = ile denk olduğunu gör! ✂️ ile 1/2'yi iki 1/4'e bölebilirsin! (Pesen, 2008)",k:"KY",
    s:{m:[{w:1,p:[{n:4},{n:4}]},{w:1,p:[{n:2}]}],o:{0:"="}}},
];

function fracLabel(val){
  if(val===0)return "0";
  if(Math.abs(val-Math.round(val))<0.001)return String(Math.round(val));
  var ds=[2,3,4,5,6,8,10,12,15,16,20,24];
  for(var i=0;i<ds.length;i++){var n=Math.round(val*ds[i]);if(Math.abs(val-n/ds[i])<0.001)return n+"/"+ds[i];}
  return val.toFixed(2);
}
function trackVal(tk){var v=0;if(tk.pieces)for(var i=0;i<tk.pieces.length;i++)v+=1/tk.pieces[i].n;return v;}

function speak(text){
  if(!window.speechSynthesis||!text)return;
  window.speechSynthesis.cancel();
  var u=new SpeechSynthesisUtterance(text);
  u.lang="tr-TR";u.rate=0.85;u.pitch=1.1;
  /* Türkçe ses tercih et */
  var voices=window.speechSynthesis.getVoices();
  for(var i=0;i<voices.length;i++){if(voices[i].lang&&voices[i].lang.indexOf("tr")===0){u.voice=voices[i];break;}}
  window.speechSynthesis.speak(u);
}

function fracSpeech(val,pieces){
  if(val===0)return "";
  if(Math.abs(val-1)<0.001)return "bir tam";
  if(Math.abs(val-2)<0.001)return "iki tam";
  /* Basit kesirler */
  var ds=[2,3,4,5,6,8,10,12];
  for(var i=0;i<ds.length;i++){
    var num=Math.round(val*ds[i]);
    if(Math.abs(val-num/ds[i])<0.001){
      var payda=ds[i],pay=num;
      var paydaAd={2:"ikide",3:"üçte",4:"dörtte",5:"beşte",6:"altıda",8:"sekizde",10:"onda",12:"on ikide"};
      var payAd={1:"bir",2:"iki",3:"üç",4:"dört",5:"beş",6:"altı",7:"yedi",8:"sekiz",9:"dokuz",10:"on",11:"on bir",12:"on iki"};
      if(pay>=payda)return pay===payda?"bir tam":Math.floor(pay/payda)+" tam "+(pay%payda>0?(paydaAd[payda]||payda+"de")+" "+(payAd[pay%payda]||(pay%payda)):"");
      return (paydaAd[payda]||payda+"de")+" "+(payAd[pay]||pay);
    }
  }
  return val.toFixed(2);
}

function Logo(props){
  var s=props.size||60,sc=s/60;
  return(
    <svg width={s} height={Math.round(s*1.1)} viewBox="0 0 60 66" style={props.style}>
      <line x1="18" y1="18" x2="30" y2="48" stroke="#bbb" strokeWidth="1.5" strokeDasharray="3,3"/>
      <line x1="42" y1="18" x2="30" y2="48" stroke="#bbb" strokeWidth="1.5" strokeDasharray="3,3"/>
      <circle cx="18" cy="14" r="12" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5"/>
      <circle cx="11" cy="14" r="2.2" fill="#fff"/><circle cx="18" cy="14" r="2.2" fill="#fff"/><circle cx="25" cy="14" r="2.2" fill="#fff"/>
      <circle cx="42" cy="14" r="12" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5"/>
      <text x="42" y="18" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff">{"üç"}</text>
      <circle cx="30" cy="52" r="12" fill="#22c55e" stroke="#15803d" strokeWidth="1.5"/>
      <text x="30" y="57" textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff">{"3"}</text>
    </svg>
  );
}

/* ===== WholeBarTrack ===== */
function WholeBarTrack(props) {
  var wholes=props.wholes||1,pieces=props.pieces||[],showLabel=props.showLabel;
  var onPieceClick=props.onPieceClick,isEquiv=props.isEquiv,isDropTarget=props.isDropTarget;
  var onSetWholes=props.onSetWholes,showPie=props.showPie!==false,isScissors=props.isScissors;
  var W=props.barWidth||380;
  var W1=W/wholes,BH=Math.max(34,Math.min(48,W*0.12));
  var PR=Math.min(44,W*0.11),pd=PR*2+4,pcx=pd/2,pcy=pd/2;
  var NLH=44,NL_Y=16;
  var totalVal=0;for(var p=0;p<pieces.length;p++)totalVal+=1/pieces[p].n;

  var barEls=[],cx=0;
  for(var i=0;i<pieces.length;i++){
    var pw=Math.round(W1/pieces[i].n);var ci=BAR_PARTS.indexOf(pieces[i].n);if(ci<0)ci=0;
    barEls.push(<div key={"pc"+i} data-pidx={i}
      onPointerDown={isScissors?undefined:(function(idx,pn,pci){return function(e){e.stopPropagation();e.preventDefault();if(props.onPieceDrag)props.onPieceDrag(idx,pn,pci,e);};})(i,pieces[i].n,ci)}
      onClick={isScissors?(function(idx){return function(e){e.stopPropagation();onPieceClick(idx);};})(i):undefined}
      style={{position:"absolute",left:cx,top:2,width:pw-1,height:BH-4,borderRadius:4,background:"linear-gradient(180deg,"+FC[ci%FC.length]+","+FB[ci%FB.length]+")",border:"2px solid "+FB[ci%FB.length],display:"flex",alignItems:"center",justifyContent:"center",cursor:isScissors?"crosshair":"grab",boxShadow:"0 1px 4px rgba(0,0,0,.2)",overflow:"hidden",touchAction:"none"}}>
      {isScissors&&pw>12?(<div style={{position:"absolute",left:"50%",top:0,width:0,height:"100%",borderLeft:"2px dashed rgba(255,255,255,.6)"}}/>):null}
      {showLabel&&pw>18?(pieces[i].n===1?(<span style={{fontSize:Math.min(16,pw*.35),fontWeight:900,color:"#fff"}}>{"1"}</span>):(<div style={{textAlign:"center"}}><div style={{fontSize:Math.min(13,pw*.28),fontWeight:900,color:"#fff",lineHeight:1}}>1</div><div style={{width:Math.min(pw*.35,14),height:1.5,background:"rgba(255,255,255,.7)",margin:"1px auto"}}/><div style={{fontSize:Math.min(13,pw*.28),fontWeight:900,color:"#fff",lineHeight:1}}>{pieces[i].n}</div></div>)):null}
      {isScissors?(<div style={{position:"absolute",bottom:1,right:1,fontSize:8,opacity:.7}}>{"✂"}</div>):null}
    </div>);cx+=pw;
  }
  if(cx<W)barEls.push(<div key="empty" style={{position:"absolute",left:cx,top:2,width:W-cx-2,height:BH-4,borderRadius:4,border:"2px dashed rgba(0,0,0,.1)",display:"flex",alignItems:"center",justifyContent:"center"}}>{W-cx>40&&pieces.length===0?(<span style={{fontSize:7,color:"rgba(0,0,0,.12)",fontWeight:700}}>{"↕ çubuk bırak"}</span>):null}</div>);

  var fillAngle=Math.min(totalVal/wholes,1)*Math.PI*2;
  var pieEnd={x:pcx+PR*Math.cos(fillAngle-Math.PI/2),y:pcy+PR*Math.sin(fillAngle-Math.PI/2)};
  var piePath=totalVal>0?"M"+pcx+","+pcy+" L"+pcx+","+(pcy-PR)+" A"+PR+","+PR+" 0 "+(fillAngle>Math.PI?1:0)+" 1 "+pieEnd.x.toFixed(1)+","+pieEnd.y.toFixed(1)+" Z":"";

  var nl=[],filledX=Math.min(Math.round(totalVal*W1),W);
  nl.push(<rect key="bg" x={0} y={NL_Y-4} width={W} height={8} rx={3} fill="#fde68a" stroke="#c99a06" strokeWidth={1}/>);
  if(totalVal>0)nl.push(<rect key="fl" x={0} y={NL_Y-4} width={filledX} height={8} rx={3} fill="rgba(220,38,38,.3)"/>);
  nl.push(<line key="ax" x1={0} y1={NL_Y} x2={W} y2={NL_Y} stroke="#444" strokeWidth={2}/>);
  if(totalVal>0)nl.push(<line key="fax" x1={0} y1={NL_Y} x2={filledX} y2={NL_Y} stroke="#dc2626" strokeWidth={3}/>);
  for(var w=0;w<=wholes;w++){var wx=Math.round(w*W1);nl.push(<line key={"wt"+w} x1={wx} y1={NL_Y-9} x2={wx} y2={NL_Y+9} stroke="#222" strokeWidth={2.5}/>);nl.push(<text key={"wl"+w} x={wx} y={NL_Y+22} textAnchor="middle" fontSize={11} fontWeight={900} fill="#222">{w}</text>);}
  var cx2=0;for(var j=0;j<pieces.length;j++){cx2+=Math.round(W1/pieces[j].n);if(cx2<W-2&&cx2>2)nl.push(<line key={"pt"+j} x1={cx2} y1={NL_Y-5} x2={cx2} y2={NL_Y+5} stroke="#dc2626" strokeWidth={1}/>);}
  if(totalVal>0&&filledX>8&&filledX<W-8){
    nl.push(<polygon key="arr" points={(filledX-5)+","+(NL_Y-11)+" "+(filledX+5)+","+(NL_Y-11)+" "+filledX+","+(NL_Y-5)} fill="#555"/>);
    if(showLabel){var lt=fracLabel(totalVal);nl.push(<text key="ltx" x={filledX} y={NL_Y-14} textAnchor="middle" fontSize={8} fontWeight={700} fill="#666">{lt}</text>);}
  }

  var brd=isDropTarget?"3px solid #3b82f6":isEquiv?"3px solid #22c55e":props.compact?"none":"1px solid rgba(0,0,0,.08)";
  var bg=isDropTarget?"rgba(59,130,246,.08)":isEquiv?"rgba(34,197,94,.06)":props.compact?"transparent":"rgba(255,255,255,.15)";

  /* Kesir pay/payda hesapla */
  var fracNum=0,fracDen=1;
  if(totalVal>0){
    var ds2=[2,3,4,5,6,8,10,12,15,16,20,24];
    for(var fi=0;fi<ds2.length;fi++){var fn=Math.round(totalVal*ds2[fi]);if(Math.abs(totalVal-fn/ds2[fi])<0.001){fracNum=fn;fracDen=ds2[fi];break;}}
    if(fracNum===0){fracNum=Math.round(totalVal*100);fracDen=100;}
    if(fracNum===fracDen){fracNum=1;fracDen=1;}
  }
  var verbalTxt="";
  if(totalVal>0){
    if(fracDen===1)verbalTxt="bir tam";
    else if(fracNum===1)verbalTxt=VERBAL[fracDen]||"";
    else verbalTxt=fracNum+" tane "+(VERBAL[fracDen]||"");
  }

  return (
    <div data-trackid={props.trackId} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,userSelect:"none",padding:"10px 12px 8px",background:bg,borderRadius:12,border:brd,width:W+24}}>
      <div style={{display:"flex",alignItems:"center",gap:5}}>
        <button onClick={function(){if(wholes>1)onSetWholes(wholes-1);}} style={{width:18,height:18,borderRadius:"50%",border:"1px solid #bbb",background:wholes>1?"#fff":"#eee",cursor:wholes>1?"pointer":"default",fontSize:11,fontWeight:900,color:"#777",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit",opacity:wholes>1?1:.3}}>{"−"}</button>
        <span style={{fontSize:9,fontWeight:800,color:"#777"}}>{wholes+" tam"}</span>
        <button onClick={function(){onSetWholes(wholes+1);}} style={{width:18,height:18,borderRadius:"50%",border:"1px solid #bbb",background:"#fff",cursor:"pointer",fontSize:11,fontWeight:900,color:"#777",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>{"+"}</button>
      </div>
      {showPie?(<svg width={pd} height={pd}><circle cx={pcx} cy={pcy} r={PR} fill="#facc15" stroke="#222" strokeWidth={2}/>{totalVal>0&&totalVal<wholes?(<path d={piePath} fill="#dc2626" stroke="#222" strokeWidth={1.5}/>):null}{totalVal>=wholes?(<circle cx={pcx} cy={pcy} r={PR} fill="#dc2626" stroke="#222" strokeWidth={2}/>):null}</svg>):null}
      <div style={{background:"#3a3a3a",borderRadius:8,padding:"5px 7px",boxShadow:"0 3px 10px rgba(0,0,0,.3)"}}>
        <div style={{position:"relative",width:W,height:BH,background:"#facc15",borderRadius:5,border:"2px solid #a16207",overflow:"hidden"}}>{wholes>1&&Array.from({length:wholes-1},function(_,wi){return <div key={"wd"+wi} style={{position:"absolute",left:Math.round((wi+1)*W1)-1,top:0,width:2,height:BH,background:"#a16207",zIndex:5}}/>;})}{barEls}</div>
      </div>
      <svg width={W} height={NLH} style={{display:"block",overflow:"visible"}}>{nl}</svg>
      {/* KESİR: sözel + dikey pay/payda — SABİT YÜKSEKLİK */}
      <div style={{height:110,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,position:"relative"}}>
        {verbalTxt?(<div style={{display:"flex",alignItems:"center",gap:4}}>
          <span style={{fontSize:Math.min(15,W*0.04),fontWeight:700,color:"#888",fontStyle:"italic"}}>{verbalTxt}</span>
          <span onClick={function(e){e.stopPropagation();speak(fracSpeech(totalVal,pieces));}} style={{cursor:"pointer",fontSize:12,opacity:.5,transition:"opacity .2s"}} onMouseEnter={function(e){e.currentTarget.style.opacity="1";}} onMouseLeave={function(e){e.currentTarget.style.opacity=".5";}}>{"🔊"}</span>
        </div>):null}
        {totalVal>0&&fracDen>1?(
          props.labelMode==="dec"?(
            <span style={{fontSize:Math.min(38,W*0.1),fontWeight:900,color:isEquiv?"#16a34a":"#2563eb",lineHeight:1}}>{totalVal===Math.round(totalVal)?totalVal.toString():totalVal.toFixed(totalVal*100%1<0.01?2:3)}</span>
          ):props.labelMode==="pct"?(
            <span style={{fontSize:Math.min(36,W*0.09),fontWeight:900,color:isEquiv?"#16a34a":"#9333ea",lineHeight:1}}>{"% "+Math.round(totalVal*100)}</span>
          ):(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <span style={{fontSize:Math.min(42,W*0.11),fontWeight:900,color:isEquiv?"#16a34a":"#dc2626",lineHeight:1}}>{fracNum}</span>
              <div style={{width:Math.min(46,W*0.12),height:3.5,background:isEquiv?"#16a34a":"#dc2626",borderRadius:1,margin:"3px 0"}}/>
              <span style={{fontSize:Math.min(42,W*0.11),fontWeight:900,color:isEquiv?"#16a34a":"#dc2626",lineHeight:1}}>{fracDen}</span>
            </div>
          )
        ):totalVal>0&&fracDen===1?(
          <span style={{fontSize:Math.min(42,W*0.11),fontWeight:900,color:isEquiv?"#16a34a":"#dc2626",lineHeight:1}}>{props.labelMode==="pct"?"% 100":props.labelMode==="dec"?"1.0":"1"}</span>
        ):(
          <span style={{fontSize:32,fontWeight:900,color:"#ddd",lineHeight:1}}>{"?"}</span>
        )}
      </div>
    </div>
  );
}

/* ===== MAIN APP ===== */
export default function App() {
  var _items=useState([]),items=_items[0],setItems=_items[1];
  var _ops=useState({}),ops=_ops[0],setOps=_ops[1]; /* {trackId: "+"|"−"|"="} operator after this track */
  var _barDrag=useState(null),barDrag=_barDrag[0],setBarDrag=_barDrag[1];
  var _barDragPos=useState({x:0,y:0}),barDragPos=_barDragPos[0],setBarDragPos=_barDragPos[1];
  var _dropTarget=useState(null),dropTarget=_dropTarget[0],setDropTarget=_dropTarget[1];
  var _trkDrag=useState(null),trkDrag=_trkDrag[0],setTrkDrag=_trkDrag[1];
  var _trkDP=useState({x:0,y:0}),trkDP=_trkDP[0],setTrkDP=_trkDP[1];
  var _trkOff=useState({x:0,y:0}),trkOff=_trkOff[0],setTrkOff=_trkOff[1];
  var _tool=useState("select"),tool=_tool[0],setTool=_tool[1];
  var _penClr=useState("#dc2626"),penClr=_penClr[0],setPenClr=_penClr[1];
  var _penW=useState(3),penW=_penW[0],setPenW=_penW[1];
  var _lines=useState([]),drawLines=_lines[0],setDrawLines=_lines[1];
  var _curLine=useState(null),curLine=_curLine[0],setCurLine=_curLine[1];
  var _txtIn=useState(null),txtIn=_txtIn[0],setTxtIn=_txtIn[1];
  var _txtVal=useState(""),txtVal=_txtVal[0],setTxtVal=_txtVal[1];
  /* Sayfa sistemi */
  var _pages=useState([{id:1,name:"Sayfa 1"}]),pages=_pages[0],setPages=_pages[1];
  var _pageId=useState(1),pageId=_pageId[0],setPageId=_pageId[1];
  var _pageData=useState({}),pageData=_pageData[0],setPageData=_pageData[1];
  var _bgType=useState("plain"),bgType=_bgType[0],setBgType=_bgType[1];
  var _bgColor=useState("#f0ead6"),bgColor=_bgColor[0],setBgColor=_bgColor[1];
  var _zoom=useState(1),zoom=_zoom[0],setZoom=_zoom[1];
  var _pan=useState({x:0,y:0}),pan=_pan[0],setPan=_pan[1];
  var _panning=useState(false),panning=_panning[0],setPanning=_panning[1];
  var _panStart=useState({x:0,y:0}),panStart=_panStart[0],setPanStart=_panStart[1]; /* {pageId: {items,lines,ops}} */
  var _showLabels=useState(true),showLabels=_showLabels[0],setLabels=_showLabels[1];
  var _labelMode=useState("frac"),labelMode=_labelMode[0],setLabelMode=_labelMode[1];
  var _transp=useState(false),transpMode=_transp[0],setTransp=_transp[1];
  var _sideTab=useState("mat"),sideTab=_sideTab[0],setSideTab=_sideTab[1];
  var _collapsed=useState(false),collapsed=_collapsed[0],setCollapsed=_collapsed[1];
  var _activeTpl=useState(null),activeTpl=_activeTpl[0],setActiveTpl=_activeTpl[1];
  var _instrState=useState(null),instrState=_instrState[0],setInstrState=_instrState[1];
  var _help=useState(false),helpOpen=_help[0],setHelp=_help[1];
  var _selTrack=useState(null),selTrack=_selTrack[0],setSelTrack=_selTrack[1];
  var _about=useState(false),aboutOpen=_about[0],setAbout=_about[1];
  var _teacherPanel=useState(false),teacherOpen=_teacherPanel[0],setTeacherOpen=_teacherPanel[1];
  var _completed=useState({}),completed=_completed[0],setCompleted=_completed[1]; /* {actName:true} */
  var _teacherNotes=useState(""),teacherNotes=_teacherNotes[0],setTeacherNotes=_teacherNotes[1];
  var _studentName=useState(""),studentName=_studentName[0],setStudentName=_studentName[1];

  var cvRef=useRef(null),idRef=useRef(100);
  var irRef=useRef(items);irRef.current=items;
  var panRef=useRef(pan);panRef.current=pan;
  var zoomRef=useRef(zoom);zoomRef.current=zoom;
  var pastRef=useRef([]),futRef=useRef([]);
  var _frc=useState(0),frc=_frc[1];
  function nid(){idRef.current++;return idRef.current;}
  var PB="#c8cfbe",PBD="#a0aa94",PT="#3d4a35",PS="#6b7a60",BB="#b8c0ae";

  function hPush(){pastRef.current=pastRef.current.slice(-30).concat([JSON.parse(JSON.stringify(irRef.current))]);futRef.current=[];frc(function(v){return v+1;});}
  function doUndo(){if(!pastRef.current.length)return;futRef.current.push(JSON.parse(JSON.stringify(irRef.current)));setItems(pastRef.current.pop());frc(function(v){return v+1;});}
  function doRedo(){if(!futRef.current.length)return;pastRef.current.push(JSON.parse(JSON.stringify(irRef.current)));setItems(futRef.current.pop());frc(function(v){return v+1;});}
  function bs(active,extra){var s={padding:"4px 8px",borderRadius:5,cursor:"pointer",fontFamily:"inherit",fontSize:9,fontWeight:700,background:active?"#f59e0b":BB,border:active?"2px solid #78350f":"1px solid "+PBD,color:active?"#fff":PT};if(extra)for(var k in extra)s[k]=extra[k];return s;}

  function savePage(){var d=Object.assign({},pageData);d[pageId]={items:JSON.parse(JSON.stringify(items)),lines:drawLines.slice(),ops:Object.assign({},ops)};setPageData(d);}
  function switchPage(pid){savePage();var d=pageData[pid];if(d){setItems(d.items||[]);setDrawLines(d.lines||[]);setOps(d.ops||{});}else{setItems([]);setDrawLines([]);setOps({});}setPageId(pid);setSelTrack(null);setActiveTpl(null);}
  function addPage(){savePage();var nxId=pages.length>0?Math.max.apply(null,pages.map(function(p){return p.id;}))+1:1;var np=pages.concat([{id:nxId,name:"Sayfa "+(pages.length+1)}]);setPages(np);setItems([]);setDrawLines([]);setOps({});setPageId(nxId);setSelTrack(null);}
  function removePage(pid){if(pages.length<=1)return;var np=pages.filter(function(p){return p.id!==pid;});setPages(np);var nd=Object.assign({},pageData);delete nd[pid];setPageData(nd);if(pid===pageId){var next=np[0];switchPage(next.id);}}

  var tracks=items.filter(function(it){return it.type==="track";});
  var trackCount=tracks.length;
  var canvasW=800;if(cvRef.current)canvasW=cvRef.current.getBoundingClientRect().width;
  var barWidth=trackCount<=1?Math.min(380,canvasW-80):trackCount===2?Math.min(300,(canvasW-120)/2):Math.min(220,(canvasW-80-trackCount*60)/trackCount);
  barWidth=Math.max(140,barWidth);

  function autoLayout(itemList){
    var el=cvRef.current;if(!el)return itemList;
    var cw=el.getBoundingClientRect().width,ch=el.getBoundingClientRect().height;
    var tks=itemList.filter(function(it){return it.type==="track";});
    var tc=tks.length;
    var bw=tc<=1?Math.min(380,cw-80):tc===2?Math.min(300,(cw-120)/2):Math.min(220,(cw-80-tc*60)/tc);
    bw=Math.max(140,bw);
    var opW=58;
    var totalW=tc*(bw+24)+(tc>1?(tc-1)*opW:0);
    var startX=Math.max(10,Math.round((cw-totalW)/2));
    var midY=Math.max(10,Math.round(ch/2-140));
    var cx=startX;
    var result=itemList.slice();
    tks.forEach(function(tk,idx){
      for(var k=0;k<result.length;k++){if(result[k].id===tk.id){result[k]=Object.assign({},result[k],{x:cx,y:midY});break;}}
      cx+=bw+24;
      if(idx<tc-1)cx+=opW;
    });
    return result;
  }

  function placeTrack(){hPush();var n=irRef.current.concat([{type:"track",wholes:1,pieces:[],id:nid(),x:0,y:0}]);setItems(autoLayout(n));}
  function removeTrack(id){hPush();var n2=irRef.current.filter(function(it){return it.id!==id;});var newOps=Object.assign({},ops);delete newOps[id];setOps(newOps);setItems(autoLayout(n2));}
  function removePiece(tid){hPush();setItems(irRef.current.map(function(it){if(it.id===tid&&it.pieces&&it.pieces.length>0)return Object.assign({},it,{pieces:it.pieces.slice(0,-1)});return it;}));}
  function handlePieceClick(tid,pieceIdx){
    if(tool==="scissors"){
      /* Makas: parçayı ikiye böl */
      hPush();
      setItems(irRef.current.map(function(it){
        if(it.id!==tid||!it.pieces||pieceIdx>=it.pieces.length)return it;
        var p=it.pieces[pieceIdx];
        var newN=p.n*2;
        if(newN>24)return it; /* çok küçük parçalara bölme */
        var newPieces=it.pieces.slice();
        newPieces.splice(pieceIdx,1,{n:newN},{n:newN});
        /* Toplam taşma kontrolü */
        var total=0;for(var k=0;k<newPieces.length;k++)total+=1/newPieces[k].n;
        if(total>(it.wholes||1)+0.001)return it;
        return Object.assign({},it,{pieces:newPieces});
      }));
    } else {
      /* Normal: son parçayı kaldır */
      removePiece(tid);
    }
  }
  function setWholes(tid,w){hPush();setItems(irRef.current.map(function(it){if(it.id===tid)return Object.assign({},it,{wholes:w});return it;}));}
  function commitTxt(){if(txtVal.trim()&&txtIn){hPush();setItems(irRef.current.concat([{id:nid(),type:"text",x:txtIn.x,y:txtIn.y,label:txtVal.trim(),color:penClr}]));}setTxtIn(null);setTxtVal("");}

  function exportCanvas(){
    var el=cvRef.current;if(!el)return;
    var w=el.offsetWidth,h=el.offsetHeight;
    var c=document.createElement("canvas");c.width=w*2;c.height=h*2;
    var ctx=c.getContext("2d");ctx.scale(2,2);
    ctx.fillStyle=bgColor;ctx.fillRect(0,0,w,h);
    /* Grid/dot pattern */
    ctx.strokeStyle="rgba(0,0,0,.08)";ctx.lineWidth=0.5;
    if(bgType==="grid"){for(var gx=0;gx<w;gx+=24){ctx.beginPath();ctx.moveTo(gx,0);ctx.lineTo(gx,h);ctx.stroke();}for(var gy=0;gy<h;gy+=24){ctx.beginPath();ctx.moveTo(0,gy);ctx.lineTo(w,gy);ctx.stroke();}}
    if(bgType==="dot"){ctx.fillStyle="rgba(0,0,0,.12)";for(var dx=0;dx<w;dx+=20)for(var dy=0;dy<h;dy+=20){ctx.beginPath();ctx.arc(dx,dy,1,0,Math.PI*2);ctx.fill();}}
    /* Items as serialized SVG via foreignObject */
    var clone=el.cloneNode(true);
    clone.querySelectorAll("[style]").forEach(function(n){n.removeAttribute("class");});
    var html=new XMLSerializer().serializeToString(clone);
    var svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'"><foreignObject width="100%" height="100%">'+html+"</foreignObject></svg>";
    var img=new Image();
    var blob=new Blob([svg],{type:"image/svg+xml;charset=utf-8"});
    var url=URL.createObjectURL(blob);
    img.onload=function(){
      ctx.drawImage(img,0,0);URL.revokeObjectURL(url);
      c.toBlob(function(b){if(!b)return;var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="dokun-say-kesirler.png";a.click();});
    };
    img.onerror=function(){
      /* Fallback: yeni pencerede aç */
      URL.revokeObjectURL(url);
      var dataUrl=c.toDataURL("image/png");
      var win=window.open("");if(win){win.document.write('<img src="'+dataUrl+'" style="max-width:100%"/>');win.document.title="DokunSay Kesirler";}
    };
    img.src=url;
  }

  function shareCanvas(){
    try{
      var state={i:items,l:drawLines,o:ops,bg:bgType,bc:bgColor};
      var json=JSON.stringify(state);
      var b64=btoa(unescape(encodeURIComponent(json)));
      var shareUrl=window.location.origin+window.location.pathname+"#state="+b64;
      if(navigator.clipboard){
        navigator.clipboard.writeText(shareUrl).then(function(){alert("📋 Paylaşım linki panoya kopyalandı!");});
      } else {
        prompt("Paylaşım linki:",shareUrl);
      }
    }catch(e2){alert("Paylaşım oluşturulamadı.");}
  }

  /* Hash'ten state yükle */
  useEffect(function(){
    try{
      var h=window.location.hash;
      if(h.indexOf("#state=")===0){
        var b=h.substring(7);
        var json2=decodeURIComponent(escape(atob(b)));
        var s=JSON.parse(json2);
        if(s.i)setItems(s.i);if(s.l)setDrawLines(s.l);if(s.o)setOps(s.o);
        if(s.bg)setBgType(s.bg);if(s.bc)setBgColor(s.bc);
        window.location.hash="";
      }
    }catch(e3){}
  },[]);

  function loadActivity(tp){
    hPush();setDrawLines([]);setActiveTpl(tp);setInstrState(tp);
    if(!tp.s){setItems([]);setOps({});return;}
    var newItems=[];var newOps={};
    tp.s.m.forEach(function(m){
      var trackId=nid();
      newItems.push({type:"track",wholes:m.w||1,pieces:m.p||[],id:trackId,x:0,y:0});
    });
    /* Map index-based ops to track id-based ops */
    var trackIds=newItems.map(function(it){return it.id;});
    Object.keys(tp.s.o).forEach(function(k){
      var idx=parseInt(k);
      if(idx<trackIds.length)newOps[trackIds[idx]]=tp.s.o[k];
    });
    setOps(newOps);
    setItems(autoLayout(newItems));
  }

  function cycleOp(trackId){
    var cur=ops[trackId]||"";
    var cycle=["","+","−","×","÷","="];
    var idx=(cycle.indexOf(cur)+1)%cycle.length;
    var newOps=Object.assign({},ops);
    if(cycle[idx]==="")delete newOps[trackId];else newOps[trackId]=cycle[idx];
    setOps(newOps);
  }

  function startTrkDrag(e,tid){e.preventDefault();e.stopPropagation();if(!cvRef.current)return;var r=cvRef.current.getBoundingClientRect();var tk=null;for(var k=0;k<irRef.current.length;k++){if(irRef.current[k].id===tid)tk=irRef.current[k];}if(!tk)return;setTrkOff({x:e.clientX-r.left-(tk.x||0),y:e.clientY-r.top-(tk.y||0)});setTrkDP({x:tk.x||0,y:tk.y||0});setTrkDrag(tid);}

  function findTrackAt(sx,sy){var els=document.querySelectorAll("[data-trackid]");for(var i=0;i<els.length;i++){var r=els[i].getBoundingClientRect();if(sx>=r.left&&sx<=r.right&&sy>=r.top&&sy<=r.bottom)return parseInt(els[i].getAttribute("data-trackid"));}return null;}
  function startBarDrag(e,parts,ci){e.preventDefault();setBarDrag({parts:parts,ci:ci,src:null,sx:e.clientX,sy:e.clientY});setBarDragPos({x:e.clientX,y:e.clientY});}

  function addPieceToTarget(parts){
    /* Tıklama: çalışma alanına bağımsız kesir çubuğu ekle */
    var el=cvRef.current;if(!el)return;
    var cw=el.getBoundingClientRect().width,ch=el.getBoundingClientRect().height;
    var x=Math.round(cw/2-60),y=Math.round(ch/2-15);
    hPush();
    setItems(irRef.current.concat([{type:"bar",n:parts,id:nid(),x:x,y:y}]));
  }

  function startPieceDrag(trackId,pieceIdx,parts,ci,e){
    e.preventDefault();
    hPush();
    /* Parçayı kaynaktan kaldır */
    setItems(irRef.current.map(function(it){
      if(it.id!==trackId)return it;
      var np=it.pieces.slice();np.splice(pieceIdx,1);
      return Object.assign({},it,{pieces:np});
    }));
    setBarDrag({parts:parts,ci:ci,src:trackId});
    setBarDragPos({x:e.clientX,y:e.clientY});
  }

  /* Snap sistemi: yakın öğelere yapışma */
  function snapPos(x,y,w,h,skipId){
    var THRESH=18;var best={x:x,y:y,snapped:false};var minD=THRESH;
    irRef.current.forEach(function(it){
      if(it.id===skipId||!it.x)return;
      var iw=0,ih=0;
      if(it.type==="bar"){iw=Math.round(240/it.n);ih=32;}
      else if(it.type==="pie"){iw=104;ih=104;}
      else return;
      /* Sağ kenar yapışma: bu öğenin solu → hedefin sağı */
      var rx=it.x+iw,d1=Math.abs(x-rx);
      if(d1<minD&&Math.abs(y-it.y)<THRESH*2){best={x:rx,y:it.y,snapped:true};minD=d1;}
      /* Sol kenar yapışma: bu öğenin sağı → hedefin solu */
      var lx=it.x-w,d2=Math.abs(x-lx);
      if(d2<minD&&Math.abs(y-it.y)<THRESH*2){best={x:lx,y:it.y,snapped:true};minD=d2;}
      /* Alt yapışma: bu öğenin üstü → hedefin altı */
      var by2=it.y+ih+2,d3=Math.abs(y-by2);
      if(d3<minD&&Math.abs(x-it.x)<THRESH*2){best={x:it.x,y:by2,snapped:true};minD=d3;}
      /* Yatay hiza: aynı y */
      if(Math.abs(y-it.y)<THRESH&&Math.abs(x-it.x)>w){best.y=it.y;best.snapped=true;}
    });
    return best;
  }

  useEffect(function(){if(!barDrag)return;
    function onMove(e){
      /* Güvenlik: fare düğmesi bırakılmış ama pointerup gelmemişse temizle */
      if(e.buttons===0){setBarDrag(null);setDropTarget(null);return;}
      setBarDragPos({x:e.clientX,y:e.clientY});setDropTarget(findTrackAt(e.clientX,e.clientY));
    }
    function onUp(e){
      var dx=e.clientX-(barDrag.sx||0),dy=e.clientY-(barDrag.sy||0);
      var dist=Math.sqrt(dx*dx+dy*dy);
      /* Kısa mesafe = tıklama */
      if(dist<8&&!barDrag.src){
        addPieceToTarget(barDrag.parts);
        setBarDrag(null);setDropTarget(null);return;
      }
      if(dist<8&&barDrag.src==="standalone"){
        /* Standalone bar tıklandı — geri koy */
        var el2=cvRef.current;var r2=el2?el2.getBoundingClientRect():{left:0,top:0};
        hPush();setItems(irRef.current.concat([{type:"bar",n:barDrag.parts,id:nid(),x:e.clientX-r2.left-40,y:e.clientY-r2.top-16}]));
        setBarDrag(null);setDropTarget(null);return;
      }
      var tid=findTrackAt(e.clientX,e.clientY);
      if(tid!=null){
        var tk=null;for(var k=0;k<irRef.current.length;k++){if(irRef.current[k].id===tid)tk=irRef.current[k];}
        if(tk&&tk.type==="track"){
          var ct=trackVal(tk);
          if(ct+1/barDrag.parts<=(tk.wholes||1)+0.001){
            hPush();setItems(irRef.current.map(function(it){return it.id===tid?Object.assign({},it,{pieces:it.pieces.concat([{n:barDrag.parts}])}):it;}));
          } else if(barDrag.src==="standalone"){
            /* Sığmadı — standalone olarak geri koy */
            var el4=cvRef.current;var r4=el4?el4.getBoundingClientRect():{left:0,top:0};
            hPush();setItems(irRef.current.concat([{type:"bar",n:barDrag.parts,id:nid(),x:e.clientX-r4.left-40,y:e.clientY-r4.top-16}]));
          } else if(barDrag.src){
            /* Sığmadı — kaynağa geri koy */
            hPush();setItems(irRef.current.map(function(it){return it.id===barDrag.src?Object.assign({},it,{pieces:it.pieces.concat([{n:barDrag.parts}])}):it;}));
          }
        }
      } else if(barDrag.src==="standalone"){
        /* Standalone boşa bırakıldı — snap ile yeni konuma taşı */
        var el5=cvRef.current;var r5=el5?el5.getBoundingClientRect():{left:0,top:0};
        var bw5=Math.round(240/barDrag.parts);
        var rawX5=e.clientX-r5.left-bw5/2,rawY5=e.clientY-r5.top-16;
        var sn5=snapPos(rawX5,rawY5,bw5,32,null);
        hPush();setItems(irRef.current.concat([{type:"bar",n:barDrag.parts,id:nid(),x:sn5.x,y:sn5.y}]));
      } else if(!barDrag.src){
        /* Sidebar'dan boşa sürüklendi — bağımsız çubuk oluştur (snap ile) */
        var el6=cvRef.current;var r6=el6?el6.getBoundingClientRect():{left:0,top:0};
        var bw6=Math.round(240/barDrag.parts);
        var rawX6=e.clientX-r6.left-bw6/2,rawY6=e.clientY-r6.top-16;
        var sn6=snapPos(rawX6,rawY6,bw6,32,null);
        hPush();setItems(irRef.current.concat([{type:"bar",n:barDrag.parts,id:nid(),x:sn6.x,y:sn6.y}]));
      }
      setBarDrag(null);setDropTarget(null);
    }
    function onCancel(){setBarDrag(null);setDropTarget(null);}
    window.addEventListener("pointermove",onMove);
    window.addEventListener("pointerup",onUp);
    window.addEventListener("pointercancel",onCancel);
    window.addEventListener("blur",onCancel);
    return function(){
      window.removeEventListener("pointermove",onMove);
      window.removeEventListener("pointerup",onUp);
      window.removeEventListener("pointercancel",onCancel);
      window.removeEventListener("blur",onCancel);
    };
  });
  useEffect(function(){if(trkDrag==null)return;
    function onMove(e){
      if(e.buttons===0){setTrkDrag(null);return;}
      if(!cvRef.current)return;var r=cvRef.current.getBoundingClientRect();setTrkDP({x:e.clientX-r.left-trkOff.x,y:e.clientY-r.top-trkOff.y});
    }
    function onUp(){
      var it2=null;for(var k2=0;k2<irRef.current.length;k2++){if(irRef.current[k2].id===trkDrag)it2=irRef.current[k2];}
      var fx=trkDP.x,fy=trkDP.y;
      if(it2&&(it2.type==="bar"||it2.type==="pie")){
        var sw=it2.type==="bar"?Math.round(240/it2.n):104;
        var sh=it2.type==="bar"?32:104;
        var sn2=snapPos(trkDP.x,trkDP.y,sw,sh,trkDrag);
        fx=sn2.x;fy=sn2.y;
      }
      hPush();setItems(irRef.current.map(function(it){return it.id===trkDrag?Object.assign({},it,{x:fx,y:fy}):it;}));setTrkDrag(null);
    }
    function onCancel(){setTrkDrag(null);}
    window.addEventListener("pointermove",onMove);window.addEventListener("pointerup",onUp);window.addEventListener("pointercancel",onCancel);window.addEventListener("blur",onCancel);
    return function(){window.removeEventListener("pointermove",onMove);window.removeEventListener("pointerup",onUp);window.removeEventListener("pointercancel",onCancel);window.removeEventListener("blur",onCancel);};
  });
  useEffect(function(){if(!curLine)return;
    function onMove(e){if(!cvRef.current)return;var r=cvRef.current.getBoundingClientRect();setCurLine(Object.assign({},curLine,{pts:curLine.pts.concat([{x:e.clientX-r.left,y:e.clientY-r.top}])}));}
    function onUp(){setDrawLines(drawLines.concat([curLine]));setCurLine(null);}
    window.addEventListener("pointermove",onMove);window.addEventListener("pointerup",onUp);return function(){window.removeEventListener("pointermove",onMove);window.removeEventListener("pointerup",onUp);};
  });
  useEffect(function(){function onKey(e){if(txtIn)return;if((e.ctrlKey||e.metaKey)&&e.key==="z"){e.preventDefault();doUndo();}if((e.ctrlKey||e.metaKey)&&e.key==="y"){e.preventDefault();doRedo();}if((e.key==="Delete"||e.key==="Backspace")&&selTrack!=null){e.preventDefault();removeTrack(selTrack);setSelTrack(null);}if(e.key==="n"||e.key==="N")placeTrack();if(e.key==="l"||e.key==="L")setLabels(function(v){return !v;});if(e.key==="Escape")setSelTrack(null);if(e.key==="?")setHelp(function(v){return !v;});}window.addEventListener("keydown",onKey);return function(){window.removeEventListener("keydown",onKey);};});
  useEffect(function(){if(window.innerWidth<768)setCollapsed(true);},[]);

  /* Ekran → kanvas koordinat dönüşümü */
  function toCanvas(clientX,clientY){
    if(!cvRef.current)return{x:clientX,y:clientY};
    var r=cvRef.current.getBoundingClientRect();
    return{x:(clientX-r.left-panRef.current.x)/zoomRef.current,y:(clientY-r.top-panRef.current.y)/zoomRef.current};
  }

  /* Zoom: mouse wheel */
  useEffect(function(){
    var el=cvRef.current;if(!el)return;
    function onWheel(e){
      if(!e.ctrlKey&&!e.metaKey)return;
      e.preventDefault();
      var delta=e.deltaY>0?-0.1:0.1;
      setZoom(function(z){return Math.max(0.3,Math.min(3,z+delta));});
    }
    el.addEventListener("wheel",onWheel,{passive:false});
    return function(){el.removeEventListener("wheel",onWheel);};
  });

  /* Pan: middle mouse veya space+drag */
  useEffect(function(){
    if(!panning)return;
    function onMove(e){
      setPan({x:pan.x+(e.clientX-panStart.x),y:pan.y+(e.clientY-panStart.y)});
      setPanStart({x:e.clientX,y:e.clientY});
    }
    function onUp(){setPanning(false);}
    window.addEventListener("pointermove",onMove);window.addEventListener("pointerup",onUp);
    return function(){window.removeEventListener("pointermove",onMove);window.removeEventListener("pointerup",onUp);};
  });

  /* Denk kesir - placeholder, exprCorrect sonrası doldurulur */
  var equivIds={};

  /* İfade kontrolü */
  var sortedTracks=tracks.slice().sort(function(a,b){return (a.x||0)-(b.x||0);});
  var exprCorrect=null; /* null | true | false */
  var exprHint="";
  if(sortedTracks.length>=2){
    var eqIdx2=-1;
    for(var ei=0;ei<sortedTracks.length-1;ei++){if(ops[sortedTracks[ei].id]==="="){eqIdx2=ei;break;}}
    if(eqIdx2>=0){
      var leftVal2=0;
      for(var li=0;li<=eqIdx2;li++){
        var v2=trackVal(sortedTracks[li]);
        if(li===0){leftVal2=v2;}
        else{var prevOp=ops[sortedTracks[li-1].id]||"+";
          if(prevOp==="−")leftVal2-=v2;
          else if(prevOp==="×")leftVal2*=v2;
          else if(prevOp==="÷"&&v2>0)leftVal2/=v2;
          else leftVal2+=v2;
        }
      }
      var rightVal2=0;
      for(var ri=eqIdx2+1;ri<sortedTracks.length;ri++){
        var v3=trackVal(sortedTracks[ri]);
        if(ri===eqIdx2+1){rightVal2=v3;}
        else{var prevOp2=ops[sortedTracks[ri-1].id]||"+";
          if(prevOp2==="−")rightVal2-=v3;
          else if(prevOp2==="×")rightVal2*=v3;
          else if(prevOp2==="÷"&&v3>0)rightVal2/=v3;
          else rightVal2+=v3;
        }
      }
      var hasPcs=sortedTracks.every(function(t){return t.pieces&&t.pieces.length>0;});
      if(hasPcs)exprCorrect=Math.abs(leftVal2-rightVal2)<0.001;

      /* Akıllı geri bildirim: kavram yanılgısı tespiti */
      if(exprCorrect===false&&hasPcs){
        var leftTracks=sortedTracks.slice(0,eqIdx2+1);
        var rightTracks=sortedTracks.slice(eqIdx2+1);
        var activeOp="";
        for(var oi=0;oi<leftTracks.length-1;oi++){var o3=ops[leftTracks[oi].id];if(o3&&o3!=="=")activeOp=o3;}

        /* Y5: Payda toplama yanılgısı — örn: 1/4+1/4 sonucu 2/8 girilmiş mi? */
        if(activeOp==="+"&&leftTracks.length>=2){
          var leftPieces=[];leftTracks.forEach(function(t){t.pieces.forEach(function(p){leftPieces.push(p.n);});});
          var rightPieces=[];rightTracks.forEach(function(t){t.pieces.forEach(function(p){rightPieces.push(p.n);});});
          var leftDens={};leftPieces.forEach(function(n){leftDens[n]=true;});
          var rightDens={};rightPieces.forEach(function(n){rightDens[n]=true;});
          var lkeys=Object.keys(leftDens),rkeys=Object.keys(rightDens);
          if(lkeys.length===1&&rkeys.length===1){
            var ld=parseInt(lkeys[0]),rd=parseInt(rkeys[0]);
            /* Y5: Payda toplama: a/n + b/n → (a+b)/(2n) */
            if(rd===ld*leftTracks.length){
              exprHint="💡 Payda toplama yanılgısı! Kesir toplarken paydalar toplanmaz. Paydalar aynıysa sadece paylar toplanır: "+leftPieces.length+"/"+ld+" olmalı.";
            }
            /* Y13: Çarpma kuralını toplama: a/n + b/n → (a×b)/(n×n) */
            if(!exprHint&&rd===ld*ld){
              exprHint="💡 Çarpma kuralını toplamaya uyguladın! Toplama/çıkarmada pay×pay ve payda×payda yapılmaz. Paylar toplanır, payda aynı kalır.";
            }
          }
        }

        /* Y2: Payda büyük = kesir büyük yanılgısı */
        if(!exprHint&&leftTracks.length===1&&rightTracks.length===1){
          var lp=leftTracks[0].pieces,rp=rightTracks[0].pieces;
          if(lp.length===1&&rp.length===1&&lp[0].n!==rp[0].n){
            if(lp[0].n>rp[0].n&&leftVal2<rightVal2){
              exprHint="💡 Payda büyüdükçe dilim küçülür! 1/"+lp[0].n+" < 1/"+rp[0].n+" çünkü "+lp[0].n+" parçaya bölünen her dilim daha küçüktür.";
            } else if(!activeOp||activeOp==="="){
              exprHint="💡 Bu iki kesir denk değil. Sayı doğrusundaki konumlarını karşılaştır!";
            }
          }
        }

        /* Y6: Çarpma her zaman büyütmez */
        if(!exprHint&&activeOp==="×"){
          exprHint="💡 Kesirlerde çarpma sonucu her zaman çarpanlardan büyük değildir. Çarpım: "+fracLabel(leftVal2)+", beklenen: "+fracLabel(rightVal2);
        }

        /* Y7: Bölme her zaman küçültmez */
        if(!exprHint&&activeOp==="÷"){
          exprHint="💡 Kesirlerde bölme sonucu her zaman bölünenden küçük değildir. Sonuç: "+fracLabel(leftVal2)+", girilen: "+fracLabel(rightVal2);
        }

        /* Genel ipucu */
        if(!exprHint){
          exprHint="💡 Sol taraf: "+fracLabel(leftVal2)+" ≠ Sağ taraf: "+fracLabel(rightVal2)+". Sayı doğrularını karşılaştır!";
        }
      }
    }
  }
  /* Denk vurgulama — sadece = doğruysa */
  if(exprCorrect===true){
    tracks.forEach(function(t){equivIds[t.id]=true;});
    /* Etkinlik tamamlandı olarak işaretle */
    if(activeTpl&&!completed[activeTpl.n]){
      var nc=Object.assign({},completed);nc[activeTpl.n]=true;setCompleted(nc);
    }
  }

  var CATS=["keşif","kavram","karşılaştır","işlem","yanılgı"];

  var canvasBg={background:bgColor};
  if(bgType==="grid")canvasBg={background:bgColor,backgroundImage:"linear-gradient(rgba(0,0,0,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.08) 1px, transparent 1px)",backgroundSize:"24px 24px"};
  else if(bgType==="dot")canvasBg={background:bgColor,backgroundImage:"radial-gradient(circle, rgba(0,0,0,.12) 1px, transparent 1px)",backgroundSize:"20px 20px"};
  else if(bgType==="line")canvasBg={background:bgColor,backgroundImage:"linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px)",backgroundSize:"24px 24px"};
  else if(bgType==="isometric")canvasBg={background:bgColor,backgroundImage:"linear-gradient(30deg, rgba(0,0,0,.05) 12%, transparent 12.5%, transparent 87%, rgba(0,0,0,.05) 87.5%), linear-gradient(150deg, rgba(0,0,0,.05) 12%, transparent 12.5%, transparent 87%, rgba(0,0,0,.05) 87.5%)",backgroundSize:"40px 70px"};

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",overflow:"hidden",fontFamily:"system-ui,sans-serif"}}>
      <style>{"\
@keyframes popIn{0%{transform:scale(0) rotate(-10deg);opacity:0}60%{transform:scale(1.2) rotate(3deg)}100%{transform:scale(1) rotate(0);opacity:1}}\
@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-4px)}40%,80%{transform:translateX(4px)}}\
@keyframes confetti{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(120px) rotate(720deg);opacity:0}}\
@keyframes fadeIn{0%{opacity:0;transform:translateY(-8px)}100%{opacity:1;transform:translateY(0)}}\
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}\
@keyframes glow{0%,100%{box-shadow:0 0 8px rgba(34,197,94,.3)}50%{box-shadow:0 0 20px rgba(34,197,94,.6)}}\
      "}</style>
      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* SIDEBAR */}
        <div style={{width:collapsed?48:200,minWidth:collapsed?48:200,background:PB,borderRight:"2px solid "+PBD,display:"flex",flexDirection:"column"}}>
          <div style={{padding:collapsed?"8px 4px":"8px 10px",borderBottom:"1px solid "+PBD,display:"flex",alignItems:"center",justifyContent:collapsed?"center":"space-between"}}>
            {!collapsed?(<div style={{display:"flex",alignItems:"center",gap:6}}><Logo size={28}/><span style={{fontWeight:900,fontSize:12,color:"#3d3520",lineHeight:1.1}}>{"DokunSay"}<br/><span style={{fontSize:9,fontWeight:700,color:"#92400e"}}>{"Kesirler"}</span></span></div>):(<Logo size={32}/>)}
            <button onClick={function(){setCollapsed(!collapsed);}} style={bs(false,{fontSize:10,padding:"2px 6px"})}>{collapsed?"»":"«"}</button>
          </div>
          {!collapsed?(
            <div style={{display:"flex",flex:1,flexDirection:"column",overflow:"hidden"}}>
              <div style={{display:"flex",borderBottom:"1px solid "+PBD}}>
                <button onClick={function(){setSideTab("mat");}} style={{flex:1,padding:"6px 0",border:"none",borderBottom:sideTab==="mat"?"3px solid #f59e0b":"3px solid transparent",background:"transparent",cursor:"pointer",fontSize:10,fontWeight:800,color:sideTab==="mat"?PT:PS,fontFamily:"inherit"}}>{"📦 Materyal"}</button>
                <button onClick={function(){setSideTab("act");}} style={{flex:1,padding:"6px 0",border:"none",borderBottom:sideTab==="act"?"3px solid #f59e0b":"3px solid transparent",background:"transparent",cursor:"pointer",fontSize:10,fontWeight:800,color:sideTab==="act"?PT:PS,fontFamily:"inherit"}}>{"📋 Etkinlik"}</button>
              </div>
              {sideTab==="mat"?(
                <div style={{flex:1,overflowY:"scroll",padding:"6px 8px",scrollbarWidth:"none"}}>
                  <button onClick={placeTrack} style={{width:"100%",padding:"10px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",background:"linear-gradient(180deg,#facc15,#eab308)",border:"2.5px solid #a16207",display:"flex",alignItems:"center",gap:8,marginBottom:8,boxShadow:"0 2px 8px rgba(0,0,0,.15)"}}>
                    <div style={{width:36,height:16,background:"#facc15",borderRadius:4,border:"2px solid #a16207",flexShrink:0}}/>
                    <div style={{textAlign:"left"}}><div style={{fontSize:11,fontWeight:900,color:"#78350f"}}>{"+ Model Ekle"}</div><div style={{fontSize:7,color:"#92400e"}}>{"N tuşu"}</div></div>
                  </button>
                  <div style={{fontSize:7,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:PS,margin:"4px 0 3px"}}>{"Kesir Çubukları — Sürükle & Bırak"}</div>
                  {BAR_PARTS.map(function(n,fi){var ci=fi%FC.length;return(
                    <div key={"bar"+n} onPointerDown={function(e){startBarDrag(e,n,ci);}} style={{cursor:"grab",padding:"4px",display:"flex",alignItems:"center",gap:8,borderRadius:6,marginBottom:1,overflow:"hidden"}} onMouseEnter={function(e){e.currentTarget.style.background="rgba(0,0,0,.05)";}} onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
                      <div style={{width:Math.round(120/n),height:26,borderRadius:6,background:FC[ci],border:"2.5px solid "+FB[ci],display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 5px rgba(0,0,0,.15)",flexShrink:0}}><span style={{fontSize:n<=2?13:n<=4?11:n<=6?9:7,fontWeight:900,color:"#fff"}}>{n===1?"1":"1/"+n}</span></div>
                      <span style={{fontSize:11,fontWeight:700,color:"#555",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{VERBAL[n]||""}</span>
                    </div>);
                  })}
                  <div style={{fontSize:7,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:PS,margin:"8px 0 3px"}}>{"Daire Dilimleri — Tıkla"}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:2,justifyContent:"center"}}>
                    {[2,3,4,5,6,8,10,12].map(function(n,fi){
                      var ci=(fi+1)%FC.length;
                      var a=2*Math.PI/n;
                      var ex=20+17*Math.cos(a-Math.PI/2),ey=20+17*Math.sin(a-Math.PI/2);
                      var path="M20,20 L20,3 A17,17 0 "+(a>Math.PI?1:0)+" 1 "+ex.toFixed(1)+","+ey.toFixed(1)+" Z";
                      return(
                        <div key={"pie"+n} onClick={function(){
                          var el=cvRef.current;if(!el)return;
                          var cw=el.getBoundingClientRect().width,ch=el.getBoundingClientRect().height;
                          hPush();setItems(irRef.current.concat([{type:"pie",n:n,id:nid(),x:Math.round(cw/2-40),y:Math.round(ch/2-40)}]));
                        }} style={{cursor:"pointer",textAlign:"center",padding:2,borderRadius:6,width:42}}
                          onMouseEnter={function(e){e.currentTarget.style.background="rgba(0,0,0,.05)";}}
                          onMouseLeave={function(e){e.currentTarget.style.background="transparent";}}>
                          <svg width={40} height={40}>
                            <circle cx={20} cy={20} r={17} fill="#e8e0d0" stroke="#bbb" strokeWidth={1.5}/>
                            <path d={path} fill={FC[ci]} stroke={FB[ci]} strokeWidth={1.5}/>
                          </svg>
                          <div style={{fontSize:7,fontWeight:700,color:"#666"}}>{"1/"+n}</div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Sayı Doğrusu */}
                  <div style={{fontSize:7,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:PS,margin:"8px 0 3px"}}>{"Sayı Doğrusu — Tıkla"}</div>
                  <button onClick={function(){
                    var el=cvRef.current;if(!el)return;
                    var cw=el.getBoundingClientRect().width,ch=el.getBoundingClientRect().height;
                    hPush();setItems(irRef.current.concat([{type:"numline",range:1,divisions:4,marks:[],id:nid(),x:Math.round(cw/2-160),y:Math.round(ch/2-20)}]));
                  }} style={{width:"100%",padding:"6px 8px",borderRadius:6,cursor:"pointer",fontFamily:"inherit",background:BB,border:"1px solid "+PBD,display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                    <svg width={80} height={20}><line x1={2} y1={10} x2={78} y2={10} stroke="#444" strokeWidth={2}/><line x1={2} y1={4} x2={2} y2={16} stroke="#444" strokeWidth={2}/><line x1={78} y1={4} x2={78} y2={16} stroke="#444" strokeWidth={2}/><text x={2} y={20} fontSize={6} fill="#444">{"0"}</text><text x={76} y={20} fontSize={6} fill="#444">{"1"}</text></svg>
                    <span style={{fontSize:9,fontWeight:700,color:PT}}>{"0 — 1"}</span>
                  </button>
                  <button onClick={function(){
                    var el=cvRef.current;if(!el)return;
                    var cw=el.getBoundingClientRect().width,ch=el.getBoundingClientRect().height;
                    hPush();setItems(irRef.current.concat([{type:"numline",range:2,divisions:4,marks:[],id:nid(),x:Math.round(cw/2-160),y:Math.round(ch/2-20)}]));
                  }} style={{width:"100%",padding:"6px 8px",borderRadius:6,cursor:"pointer",fontFamily:"inherit",background:BB,border:"1px solid "+PBD,display:"flex",alignItems:"center",gap:6}}>
                    <svg width={80} height={20}><line x1={2} y1={10} x2={78} y2={10} stroke="#444" strokeWidth={2}/><line x1={2} y1={4} x2={2} y2={16} stroke="#444" strokeWidth={2}/><line x1={40} y1={4} x2={40} y2={16} stroke="#444" strokeWidth={2}/><line x1={78} y1={4} x2={78} y2={16} stroke="#444" strokeWidth={2}/><text x={2} y={20} fontSize={6} fill="#444">{"0"}</text><text x={38} y={20} fontSize={6} fill="#444">{"1"}</text><text x={76} y={20} fontSize={6} fill="#444">{"2"}</text></svg>
                    <span style={{fontSize:9,fontWeight:700,color:PT}}>{"0 — 2"}</span>
                  </button>
                  {/* Şablonlar */}
                  <div style={{fontSize:7,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:PS,margin:"8px 0 3px"}}>{"Şablonlar"}</div>
                  <button onClick={function(){
                    hPush();
                    var wall=[],startX=40,startY=20,W=320,rowH=34,gap=2;
                    var rows=[1,2,3,4,5,6,8,10,12];
                    rows.forEach(function(n,ri){
                      var ci=BAR_PARTS.indexOf(n);if(ci<0)ci=0;
                      for(var pi=0;pi<n;pi++){
                        wall.push({type:"bar",n:n,id:nid(),x:startX+Math.round(pi*W/n),y:startY+ri*(rowH+gap)});
                      }
                    });
                    setItems(wall);setDrawLines([]);setOps({});setActiveTpl(null);
                  }} style={{width:"100%",padding:"6px 8px",borderRadius:6,cursor:"pointer",fontFamily:"inherit",background:"linear-gradient(180deg,#fef3c7,#fde68a)",border:"1.5px solid #d97706",display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                    <div style={{display:"flex",flexDirection:"column",gap:1,flexShrink:0}}>
                      <div style={{width:36,height:4,background:"#f59e0b",borderRadius:2}}/>
                      <div style={{display:"flex",gap:1}}><div style={{width:17,height:4,background:"#3b82f6",borderRadius:2}}/><div style={{width:17,height:4,background:"#3b82f6",borderRadius:2}}/></div>
                      <div style={{display:"flex",gap:1}}><div style={{width:11,height:4,background:"#ef4444",borderRadius:2}}/><div style={{width:11,height:4,background:"#ef4444",borderRadius:2}}/><div style={{width:11,height:4,background:"#ef4444",borderRadius:2}}/></div>
                    </div>
                    <span style={{fontSize:9,fontWeight:800,color:"#92400e"}}>{"Kesir Duvarı"}</span>
                  </button>
                  <button onClick={function(){
                    hPush();
                    var cmp=[],startX=40,startY=30,W=280,rowH=36,gap=8;
                    [2,3,4,6].forEach(function(n,ri){
                      var ci=BAR_PARTS.indexOf(n);if(ci<0)ci=0;
                      cmp.push({type:"bar",n:n,id:nid(),x:startX,y:startY+ri*(rowH+gap)});
                    });
                    setItems(cmp);setDrawLines([]);setOps({});setActiveTpl(null);
                  }} style={{width:"100%",padding:"6px 8px",borderRadius:6,cursor:"pointer",fontFamily:"inherit",background:BB,border:"1px solid "+PBD,display:"flex",alignItems:"center",gap:6}}>
                    <div style={{display:"flex",flexDirection:"column",gap:2,flexShrink:0}}>
                      <div style={{width:20,height:4,background:"#3b82f6",borderRadius:2}}/>
                      <div style={{width:14,height:4,background:"#ef4444",borderRadius:2}}/>
                      <div style={{width:10,height:4,background:"#22c55e",borderRadius:2}}/>
                    </div>
                    <span style={{fontSize:9,fontWeight:700,color:PT}}>{"Birim Kesir Karşılaştırma"}</span>
                  </button>
                </div>
              ):(
                <div style={{flex:1,overflowY:"scroll",padding:"6px 8px",scrollbarWidth:"none"}}>
                  {CATS.map(function(cat){var acts=ACT.filter(function(a){return a.cat===cat;});if(!acts.length)return null;var isY=cat==="yanılgı";var catLabel=cat==="keşif"?"Serbest Keşif":cat==="kavram"?"Kavram Geliştirme":cat==="karşılaştır"?"Karşılaştırma":cat==="işlem"?"İşlemler":"🔍 Kavram Yanılgıları";return(<div key={cat}><div style={{fontSize:7,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:isY?"#ef4444":PS,margin:"6px 0 3px"}}>{catLabel}</div>{acts.map(function(tp,idx){var isAct=activeTpl&&activeTpl.n===tp.n;return(<button key={cat+idx} onClick={function(){loadActivity(tp);}} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 5px",width:"100%",background:isAct?"rgba(245,158,11,.15)":completed[tp.n]?"rgba(34,197,94,.06)":isY?"rgba(239,68,68,.04)":BB,border:isAct?"2px solid #f59e0b":completed[tp.n]?"1px solid rgba(34,197,94,.3)":"1px solid "+PBD,borderRadius:5,cursor:"pointer",fontFamily:"inherit",textAlign:"left",color:PT,marginBottom:2,fontSize:8,fontWeight:isAct?900:700,overflow:"hidden"}}><span style={{fontSize:11,flexShrink:0}}>{completed[tp.n]?"✅":tp.i}</span><span style={{flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tp.n}</span><span style={{fontSize:6,color:"#d97706",flexShrink:0}}>{"\u2605".repeat(tp.diff)}</span></button>);})}</div>);})}
                </div>
              )}
              <div style={{padding:"6px 8px",borderTop:"1px solid "+PBD,display:"flex",gap:3,flexWrap:"wrap"}}>
                <button onClick={doUndo} style={bs(false,{opacity:pastRef.current.length?1:.4})}>{"↩"}</button>
                <button onClick={doRedo} style={bs(false,{opacity:futRef.current.length?1:.4})}>{"↪"}</button>
                <button onClick={function(){setLabels(!showLabels);}} style={bs(showLabels,{fontSize:7})}>{"Aa"}</button>
                <button onClick={function(){setLabelMode(function(m){return m==="frac"?"dec":m==="dec"?"pct":"frac";});}} style={bs(labelMode!=="frac",{fontSize:7,minWidth:28})}>{labelMode==="frac"?"½":labelMode==="dec"?"0.5":"%"}</button>
                <button onClick={function(){setTransp(!transpMode);}} style={bs(transpMode,{fontSize:7})} title="Saydamlık">{"👁"}</button>
                <button onClick={function(){setItems(autoLayout(irRef.current));}} style={bs(false)}>{"⊞"}</button>
                <button onClick={function(){hPush();setItems([]);setDrawLines([]);setOps({});setActiveTpl(null);}} style={bs(false)}>{"🗑"}</button>
                <button onClick={function(){setHelp(!helpOpen);}} style={bs(helpOpen)}>{"?"}</button>
                <button onClick={function(){setAbout(true);}} style={bs(false,{fontSize:7})}>{"ℹ"}</button>
                <button onClick={exportCanvas} style={bs(false,{fontSize:7})} title="PNG olarak kaydet">{"📷"}</button>
                <button onClick={shareCanvas} style={bs(false,{fontSize:7})} title="Paylaşım linki">{"🔗"}</button>
                <button onClick={function(){setTeacherOpen(true);}} style={bs(false,{fontSize:7})} title="Öğretmen Paneli">{"👨‍🏫"}</button>
              </div>
            </div>
          ):(
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"10px 0"}}>
              <button onClick={function(){setCollapsed(false);setSideTab("mat");}} style={bs(false,{fontSize:16,padding:"6px 10px"})}>{"📦"}</button>
              <button onClick={function(){setCollapsed(false);setSideTab("act");}} style={bs(false,{fontSize:16,padding:"6px 10px"})}>{"📋"}</button>
            </div>
          )}
        </div>

        {/* CANVAS */}
        <div ref={cvRef} tabIndex={0} style={Object.assign({flex:1,position:"relative",overflow:"auto",cursor:panning?"grabbing":tool==="pen"?"crosshair":tool==="text"?"text":tool==="scissors"?"crosshair":"default",outline:"none"},canvasBg)}
          onPointerDown={function(e){if(!cvRef.current)return;
            if(e.button===1||(e.altKey&&e.button===0)){e.preventDefault();setPanning(true);setPanStart({x:e.clientX,y:e.clientY});return;}
            var r=cvRef.current.getBoundingClientRect();var x=(e.clientX-r.left)/zoom,y=(e.clientY-r.top)/zoom;
            setSelTrack(null);if(tool==="pen")setCurLine({pts:[{x:x,y:y}],color:penClr,w:penW});else if(tool==="text"){setTxtIn({x:x,y:y});setTxtVal("");}}}
          onDoubleClick={function(e){if(tool!=="pen"&&!txtIn){var r=cvRef.current.getBoundingClientRect();setTxtIn({x:(e.clientX-r.left)/zoom,y:(e.clientY-r.top)/zoom});setTxtVal("");}}}
          onWheel={function(e){if(e.ctrlKey||e.metaKey){e.preventDefault();setZoom(function(z){return Math.max(0.3,Math.min(3,z+(e.deltaY>0?-0.1:0.1)));});}}}
        >
          <div style={{transformOrigin:"0 0",transform:"scale("+zoom+")",minWidth:2000,minHeight:1500}}>
          <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:3}}>{drawLines.map(function(l,li){return <path key={li} d={l.pts.map(function(p,pi){return(pi===0?"M":"L")+p.x+","+p.y;}).join("")} fill="none" stroke={l.color} strokeWidth={l.w} strokeLinecap="round" strokeLinejoin="round"/>;})}</svg>
          {txtIn?(<div style={{position:"absolute",left:txtIn.x,top:txtIn.y,zIndex:20}}><input autoFocus value={txtVal} onChange={function(e){setTxtVal(e.target.value);}} onKeyDown={function(e){e.stopPropagation();if(e.key==="Enter")commitTxt();if(e.key==="Escape"){setTxtIn(null);setTxtVal("");}}} onBlur={commitTxt} style={{fontSize:18,fontWeight:800,color:penClr,background:"rgba(255,255,255,.9)",border:"2px solid #a0aa94",borderRadius:6,padding:"4px 8px",outline:"none",fontFamily:"inherit",minWidth:100}} placeholder="Yazın..."/></div>):null}
          {instrState?(<div onClick={function(){setInstrState(null);}} style={{position:"absolute",inset:0,zIndex:50,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .3s ease-out"}}><div onClick={function(e){e.stopPropagation();}} style={{background:"#fffdf7",borderRadius:16,padding:"24px 28px",maxWidth:460,boxShadow:"0 12px 40px rgba(0,0,0,.3)",textAlign:"center",animation:"popIn .4s ease-out"}}><div style={{fontSize:40,marginBottom:8}}>{instrState.i}</div><div style={{fontSize:18,fontWeight:900,marginBottom:6}}>{instrState.n}</div><div style={{fontSize:13,marginBottom:16,lineHeight:1.6,color:"#444"}}>{instrState.d}</div><button onClick={function(){setInstrState(null);}} style={{padding:"8px 28px",borderRadius:10,border:"none",background:"linear-gradient(135deg,#f59e0b,#78350f)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",animation:"pulse 2s infinite"}}>{"Başla ▸"}</button></div></div>):null}
          {tracks.length===0&&items.filter(function(it){return it.type==="bar"||it.type==="pie"||it.type==="numline";}).length===0&&!activeTpl?(<div style={{position:"absolute",top:"34%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}><Logo size={80}/><div style={{fontSize:15,fontWeight:800,color:"rgba(60,50,30,.3)",marginTop:8}}>{"Model ekle, çubukları sürükleyerek kesir oluştur"}</div></div>):null}
          {activeTpl&&!instrState?(<div style={{position:"absolute",top:8,left:8,zIndex:8,padding:"4px 12px",borderRadius:10,background:"rgba(255,255,255,.75)",border:"1px solid rgba(0,0,0,.1)",pointerEvents:"none"}}><span style={{fontSize:11,fontWeight:800,color:"#3d3520"}}>{activeTpl.i+" "+activeTpl.n}</span></div>):null}

          {/* İfade doğruysa/yanlışsa geri bildirim */}
          {exprCorrect===true?(<>
            <div style={{position:"absolute",top:8,right:8,zIndex:8,padding:"8px 18px",borderRadius:14,background:"rgba(34,197,94,.15)",border:"2px solid #22c55e",display:"flex",alignItems:"center",gap:8,maxWidth:400,animation:"popIn .4s ease-out,glow 2s infinite"}}><span style={{fontSize:22}}>{"✅"}</span><span style={{fontSize:14,fontWeight:900,color:"#16a34a"}}>{"Doğru!"}</span></div>
            {/* Konfeti */}
            <div style={{position:"absolute",top:0,left:0,right:0,height:200,pointerEvents:"none",zIndex:50,overflow:"hidden"}}>
              {Array.from({length:18},function(_,ci2){
                var clrs=["#f59e0b","#22c55e","#3b82f6","#ef4444","#8b5cf6","#ec4899"];
                return <div key={"cf"+ci2} style={{position:"absolute",left:(5+ci2*5.5)+"%",top:-10,width:8,height:8,borderRadius:ci2%2===0?"50%":"1px",background:clrs[ci2%clrs.length],animation:"confetti "+(0.8+ci2*0.15)+"s ease-out forwards",animationDelay:(ci2*0.05)+"s"}}/>;
              })}
            </div>
          </>):null}
          {exprCorrect===false?(<div style={{position:"absolute",top:8,right:8,zIndex:8,padding:"8px 16px",borderRadius:14,background:"rgba(239,68,68,.08)",border:"2px solid #ef4444",maxWidth:420,animation:"shake .4s ease-out,fadeIn .3s ease-out"}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:exprHint?4:0}}><span style={{fontSize:20}}>{"❌"}</span><span style={{fontSize:13,fontWeight:900,color:"#dc2626"}}>{"Tekrar dene!"}</span></div>{exprHint?(<div style={{fontSize:11,fontWeight:600,color:"#92400e",lineHeight:1.4,padding:"4px 0 0 28px",animation:"fadeIn .5s ease-out .2s both"}}>{exprHint}</div>):null}</div>):null}

          {/* MODELLER + ARALARINDA İŞLEM İŞARETLERİ */}
          {sortedTracks.map(function(tk,idx){
            var isDragging=trkDrag===tk.id;
            var posX=isDragging?trkDP.x:(tk.x||0);
            var posY=isDragging?trkDP.y:(tk.y||0);
            var opLabel=ops[tk.id]||"";
            var opColors={"+":"#22c55e","−":"#ef4444","×":"#8b5cf6","÷":"#f97316","=":"#3b82f6"};
            var isEqCorrect=opLabel==="="&&exprCorrect===true;
            var isEqWrong=opLabel==="="&&exprCorrect===false;

            /* fracDiv artık sabit 110px — merkezi: top + 55 */
            /* fracDiv top: 10+18+4+(BH+10)+4+44+4 = 94+BH */
            /* fracCenter: 94+BH+55 = 149+BH */
            var bh2=Math.max(34,Math.min(48,barWidth*0.12));
            var hasPie=trackCount<=1;
            var pr2=Math.min(44,barWidth*0.11);
            var fracCenterY=posY+149+bh2+(hasPie?(pr2*2+8):0);

            /* = işareti aktif operasyonun rengini alsın */
            var activeOpColor="";
            for(var oi2=0;oi2<sortedTracks.length;oi2++){var o2=ops[sortedTracks[oi2].id];if(o2&&o2!=="="){activeOpColor=o2;break;}}
            var eqColor=opColors[activeOpColor]||"#3b82f6";

            return(
              <div key={tk.id}>
                {/* Model */}
                <div style={{position:"absolute",left:posX,top:posY,zIndex:isDragging?100:2,opacity:isDragging?.8:1,touchAction:"none"}}
                  onClick={function(e){e.stopPropagation();setSelTrack(tk.id);}}>
                  <div onPointerDown={function(e){startTrkDrag(e,tk.id);}} style={{position:"absolute",top:-6,left:0,right:0,height:16,cursor:"grab",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:36,height:4,borderRadius:2,background:"rgba(0,0,0,.15)"}}/></div>
                  {selTrack===tk.id?(<div onClick={function(e){e.stopPropagation();removeTrack(tk.id);setSelTrack(null);}} style={{position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:"#ef4444",border:"2px solid #fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:10,color:"#fff",fontWeight:900,zIndex:12}}>{"✕"}</div>):null}
                  {selTrack===tk.id&&trackVal(tk)>0&&trackVal(tk)<1?(function(){
                    var tv=trackVal(tk);var eqs=[];
                    var denoms=[2,3,4,5,6,8,10,12];
                    for(var di2=0;di2<denoms.length;di2++){var dd=denoms[di2];var nn=Math.round(tv*dd);if(Math.abs(tv-nn/dd)<0.001&&nn>0&&nn<dd){eqs.push({n:nn,d:dd});}}
                    if(eqs.length<=1)return null;
                    return(<div style={{position:"absolute",top:-8,left:-8,display:"flex",gap:2,zIndex:13}}>
                      {eqs.slice(0,4).map(function(eq,ei2){
                        return(<button key={ei2} onClick={function(e2){
                          e2.stopPropagation();hPush();
                          var newP=[];for(var k2=0;k2<eq.n;k2++)newP.push({n:eq.d});
                          setItems(irRef.current.map(function(x){return x.id===tk.id?Object.assign({},x,{pieces:newP}):x;}));
                        }} style={{padding:"2px 5px",borderRadius:4,border:"1px solid #a78bfa",background:"#ede9fe",cursor:"pointer",fontSize:8,fontWeight:800,color:"#6d28d9",fontFamily:"inherit",lineHeight:1.2,textAlign:"center"}}>
                          <div>{eq.n}</div><div style={{borderTop:"1.5px solid #6d28d9",margin:"1px 0"}}></div><div>{eq.d}</div>
                        </button>);
                      })}
                    </div>);
                  })():null}
                  <WholeBarTrack trackId={tk.id} wholes={tk.wholes||1} pieces={tk.pieces||[]} showLabel={showLabels} labelMode={labelMode} showPie={trackCount<=1} barWidth={barWidth} isEquiv={!!equivIds[tk.id]} isDropTarget={dropTarget===tk.id} compact={trackCount>=2} isScissors={tool==="scissors"} onPieceClick={function(idx){handlePieceClick(tk.id,idx);}} onPieceDrag={function(idx,pn,pci,e){startPieceDrag(tk.id,idx,pn,pci,e);}} onSetWholes={function(w){setWholes(tk.id,w);}}/>
                </div>

                {/* İŞLEM İŞARETİ — kesir sayısıyla tam hizalı */}
                {idx<sortedTracks.length-1?(
                  <div onClick={function(){cycleOp(tk.id);}} style={{position:"absolute",left:(tk.x||0)+barWidth+30,top:fracCenterY-24,zIndex:8,cursor:"pointer"}}>
                    <div style={{width:48,height:48,borderRadius:"50%",background:opLabel==="="?eqColor:opLabel?opColors[opLabel]||"#888":"rgba(0,0,0,.06)",border:isEqCorrect?"3px solid #16a34a":isEqWrong?"3px solid #ef4444":opLabel?"2.5px solid rgba(255,255,255,.3)":"2px dashed rgba(0,0,0,.15)",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:isEqCorrect?"0 0 20px rgba(34,197,94,.5)":isEqWrong?"0 0 12px rgba(239,68,68,.3)":opLabel?"0 3px 10px rgba(0,0,0,.25)":"none",transition:"all .3s"}}>
                      <span style={{fontSize:isEqCorrect?26:opLabel?26:18,fontWeight:900,color:opLabel?"#fff":"rgba(0,0,0,.2)"}}>{isEqCorrect?"✓":opLabel||"?"}</span>
                    </div>
                  </div>
                ):null}
              </div>
            );
          })}

          {/* BAĞIMSIZ SAYI DOĞRULARI */}
          {items.filter(function(it){return it.type==="numline";}).map(function(it){
            var isDragging=trkDrag===it.id;
            var posX=isDragging?trkDP.x:(it.x||0);
            var posY=isDragging?trkDP.y:(it.y||0);
            var NW=320,NH=60,range=it.range||1,div=it.divisions||4;
            var W1=NW/range;
            return(
              <div key={it.id} style={{position:"absolute",left:posX,top:posY,zIndex:isDragging?100:3,touchAction:"none"}}>
                {/* Sürükleme tutamacı */}
                <div onPointerDown={function(e){e.preventDefault();e.stopPropagation();startTrkDrag(e,it.id);}} style={{position:"absolute",top:-8,left:0,right:0,height:14,cursor:"grab",zIndex:10,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:30,height:3,borderRadius:2,background:"rgba(0,0,0,.15)"}}/></div>
                {/* Bölüm kontrolleri */}
                <div style={{position:"absolute",top:-8,right:0,display:"flex",gap:2,zIndex:10}}>
                  <button onClick={function(){if(div>2){hPush();setItems(irRef.current.map(function(x){return x.id===it.id?Object.assign({},x,{divisions:div-1}):x;}));}}} style={{width:16,height:16,borderRadius:"50%",border:"1px solid #bbb",background:"#fff",cursor:"pointer",fontSize:10,fontWeight:900,color:"#777",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>{"−"}</button>
                  <span style={{fontSize:8,fontWeight:800,color:"#888",lineHeight:"16px"}}>{div}</span>
                  <button onClick={function(){if(div<12){hPush();setItems(irRef.current.map(function(x){return x.id===it.id?Object.assign({},x,{divisions:div+1}):x;}));}}} style={{width:16,height:16,borderRadius:"50%",border:"1px solid #bbb",background:"#fff",cursor:"pointer",fontSize:10,fontWeight:900,color:"#777",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"}}>{"+"}</button>
                </div>
                <svg width={NW+20} height={NH} style={{overflow:"visible",filter:"drop-shadow(0 1px 4px rgba(0,0,0,.1))"}}>
                  {/* Arka plan çubuğu */}
                  <rect x={10} y={18} width={NW} height={6} rx={3} fill="#fde68a" stroke="#c99a06" strokeWidth={1}/>
                  {/* Ana çizgi */}
                  <line x1={10} y1={21} x2={NW+10} y2={21} stroke="#333" strokeWidth={2.5}/>
                  {/* Tam sayı çizgileri */}
                  {Array.from({length:range+1},function(_,w){
                    var wx=10+Math.round(w*W1);
                    return(<g key={"w"+w}><line x1={wx} y1={10} x2={wx} y2={32} stroke="#222" strokeWidth={2.5}/><text x={wx} y={46} textAnchor="middle" fontSize={13} fontWeight={900} fill="#222">{w}</text></g>);
                  })}
                  {/* Bölüm çizgileri */}
                  {Array.from({length:range*div-1},function(_,di){
                    var dx=10+Math.round((di+1)*W1/div);
                    var isMajor=(di+1)%div===0;
                    if(isMajor)return null;
                    return(<line key={"d"+di} x1={dx} y1={15} x2={dx} y2={27} stroke="#888" strokeWidth={1}/>);
                  })}
                  {/* İşaretler (marks) */}
                  {(it.marks||[]).map(function(m,mi){
                    var mx=10+Math.round(m.val*W1);
                    return(<g key={"m"+mi}><polygon points={(mx-5)+",8 "+(mx+5)+",8 "+mx+",14"} fill="#dc2626"/><text x={mx} y={4} textAnchor="middle" fontSize={9} fontWeight={800} fill="#dc2626">{labelMode==="dec"?m.val.toFixed(2):labelMode==="pct"?Math.round(m.val*100)+"%":fracLabel(m.val)}</text></g>);
                  })}
                </svg>
                {/* Sayı doğrusuna tıklayarak işaret ekle */}
                <div onClick={function(e2){
                  var rect=e2.currentTarget.getBoundingClientRect();
                  var cx=(e2.clientX-rect.left-10)/NW*range;
                  /* En yakın bölüm çizgisine snap */
                  var step=1/div;
                  var snapped=Math.round(cx/step)*step;
                  snapped=Math.max(0,Math.min(range,snapped));
                  /* Toggle: zaten varsa kaldır */
                  var existing=(it.marks||[]).filter(function(m){return Math.abs(m.val-snapped)>0.001;});
                  if(existing.length<(it.marks||[]).length){
                    hPush();setItems(irRef.current.map(function(x){return x.id===it.id?Object.assign({},x,{marks:existing}):x;}));
                  } else {
                    hPush();setItems(irRef.current.map(function(x){return x.id===it.id?Object.assign({},x,{marks:(it.marks||[]).concat([{val:snapped}])}):x;}));
                  }
                }} style={{position:"absolute",left:10,top:8,width:NW,height:30,cursor:"crosshair"}}/>
              </div>
            );
          })}

          {/* BAĞIMSIZ DAİRE DİLİMLERİ */}
          {items.filter(function(it){return it.type==="pie";}).map(function(it){
            var isDragging=trkDrag===it.id;
            var posX=isDragging?trkDP.x:(it.x||0);
            var posY=isDragging?trkDP.y:(it.y||0);
            var ci=BAR_PARTS.indexOf(it.n);if(ci<0)ci=0;
            var R=48,S=R*2+8,cx2=S/2,cy2=S/2;
            var rot=it.rot||0;
            var a=2*Math.PI/it.n;
            var ex=cx2+R*Math.cos(a-Math.PI/2),ey=cy2+R*Math.sin(a-Math.PI/2);
            var path="M"+cx2+","+cy2+" L"+cx2+","+(cy2-R)+" A"+R+","+R+" 0 "+(a>Math.PI?1:0)+" 1 "+ex.toFixed(1)+","+ey.toFixed(1)+" Z";
            var label=it.n===1?"1":"1/"+it.n;
            return(
              <div key={it.id} style={{position:"absolute",left:posX,top:posY,zIndex:isDragging?100:3,touchAction:"none"}}
                onPointerDown={function(e){e.preventDefault();e.stopPropagation();startTrkDrag(e,it.id);}}>
                <svg width={S} height={S} style={{cursor:"grab",filter:"drop-shadow(0 3px 8px rgba(0,0,0,.2))",opacity:transpMode?.55:1,transform:"rotate("+rot+"deg)",transition:"transform .3s ease"}}>
                  <circle cx={cx2} cy={cy2} r={R} fill="#e8e0d0" stroke="#aaa" strokeWidth={2.5}/>
                  <path d={path} fill={FC[ci%FC.length]} stroke={FB[ci%FB.length]} strokeWidth={2.5}/>
                  <text x={cx2} y={cy2+5} textAnchor="middle" fontSize={16} fontWeight={900} fill="#fff" style={{textShadow:"0 1px 3px rgba(0,0,0,.5)"}}>{label}</text>
                </svg>
                {/* Döndürme butonu */}
                <div onClick={function(e){e.stopPropagation();hPush();setItems(irRef.current.map(function(x){return x.id===it.id?Object.assign({},x,{rot:(x.rot||0)+45}):x;}));}} style={{position:"absolute",top:-6,right:-6,width:18,height:18,borderRadius:"50%",background:"#fff",border:"1.5px solid #aaa",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:9,zIndex:5}}>{"↻"}</div>
              </div>
            );
          })}

          {/* BAĞIMSIZ KESİR ÇUBUKLARI */}
          {items.filter(function(it){return it.type==="bar";}).map(function(it){
            var isDragging=trkDrag===it.id;
            var posX=isDragging?trkDP.x:(it.x||0);
            var posY=isDragging?trkDP.y:(it.y||0);
            var ci=BAR_PARTS.indexOf(it.n);if(ci<0)ci=0;
            var bw=Math.round(240/it.n);
            var label=it.n===1?"1":"1/"+it.n;
            var verbal=VERBAL[it.n]||"";
            return(
              <div key={it.id} style={{position:"absolute",left:posX,top:posY,zIndex:isDragging?100:3,touchAction:"none"}}
                onPointerDown={function(e){
                  e.preventDefault();e.stopPropagation();
                  /* Sürükleme başlat — modele bırakılabilir */
                  hPush();
                  setItems(irRef.current.filter(function(x){return x.id!==it.id;}));
                  setBarDrag({parts:it.n,ci:ci,src:"standalone",sx:e.clientX,sy:e.clientY});
                  setBarDragPos({x:e.clientX,y:e.clientY});
                }}>
                <div style={{width:bw,height:32,borderRadius:6,background:"linear-gradient(180deg,"+FC[ci%FC.length]+","+FB[ci%FB.length]+")",border:"2.5px solid "+FB[ci%FB.length],display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 8px rgba(0,0,0,.25)",cursor:"grab",opacity:transpMode?.55:1}}>
                    <span style={{fontSize:it.n<=2?16:it.n<=4?14:it.n<=6?12:10,fontWeight:900,color:"#fff"}}>{labelMode==="dec"?(1/it.n).toFixed(it.n<=4?1:2):labelMode==="pct"?Math.round(100/it.n)+"%":label}</span>
                  </div>
                  {/* Payda değiştirme tutamacı */}
                  <div style={{position:"absolute",top:-7,right:-4,display:"flex",gap:1,zIndex:5}}>
                    <div onClick={function(e){e.stopPropagation();var idx=BAR_PARTS.indexOf(it.n);if(idx>0){hPush();setItems(irRef.current.map(function(x){return x.id===it.id?Object.assign({},x,{n:BAR_PARTS[idx-1]}):x;}));}}} style={{width:14,height:14,borderRadius:"50%",background:"#fff",border:"1px solid #bbb",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:9,fontWeight:900,color:"#666"}}>{"−"}</div>
                    <div onClick={function(e){e.stopPropagation();var idx=BAR_PARTS.indexOf(it.n);if(idx<BAR_PARTS.length-1){hPush();setItems(irRef.current.map(function(x){return x.id===it.id?Object.assign({},x,{n:BAR_PARTS[idx+1]}):x;}));}}} style={{width:14,height:14,borderRadius:"50%",background:"#fff",border:"1px solid #bbb",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:9,fontWeight:900,color:"#666"}}>{"+"}</div>
                  </div>
              </div>
            );
          })}

          {items.filter(function(it){return it.type==="text";}).map(function(it){return <div key={it.id} style={{position:"absolute",left:it.x,top:it.y,zIndex:4,fontSize:18,fontWeight:800,color:it.color||"#1a1a1a"}}>{it.label}</div>;})}
          <div style={{position:"absolute",bottom:6,right:10,fontSize:9,fontWeight:700,color:"rgba(60,60,40,.12)",pointerEvents:"none"}}>{"Prof. Dr. Yılmaz Mutlu • Edanur Güven"}</div>
          </div>{/* zoom wrapper close */}
          {/* Zoom indicator */}
          {zoom!==1?(<div style={{position:"absolute",bottom:8,left:8,padding:"3px 8px",borderRadius:6,background:"rgba(0,0,0,.5)",color:"#fff",fontSize:10,fontWeight:700,pointerEvents:"none",zIndex:20}}>{Math.round(zoom*100)+"%"}</div>):null}
        </div>
      </div>

      {barDrag?(<div style={{position:"fixed",left:barDragPos.x-40,top:barDragPos.y-14,zIndex:9999,pointerEvents:"none",opacity:.85}}><div style={{width:Math.round(120/barDrag.parts),height:28,borderRadius:6,background:FC[barDrag.ci],border:"2.5px solid "+FB[barDrag.ci],display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(0,0,0,.3)"}}><span style={{fontSize:13,fontWeight:900,color:"#fff"}}>{barDrag.parts===1?"1":"1/"+barDrag.parts}</span></div></div>):null}

      {/* SAYFA SEKMELERİ */}
      <div style={{height:30,minHeight:30,background:"#ddd5c5",borderTop:"1px solid "+PBD,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 8px",gap:2,overflowX:"auto",scrollbarWidth:"none"}}>
        {pages.map(function(pg){return(
          <div key={pg.id} onClick={function(){if(pg.id!==pageId)switchPage(pg.id);}} style={{display:"flex",alignItems:"center",gap:2,padding:"3px 10px",borderRadius:"6px 6px 0 0",background:pg.id===pageId?"#f0ead6":"rgba(0,0,0,.05)",border:pg.id===pageId?"1px solid "+PBD:"1px solid transparent",borderBottom:"none",cursor:"pointer",fontSize:9,fontWeight:pg.id===pageId?800:600,color:pg.id===pageId?PT:"#888",whiteSpace:"nowrap"}}>
            {pg.name}
            {pages.length>1?(<span onClick={function(e2){e2.stopPropagation();removePage(pg.id);}} style={{marginLeft:4,fontSize:8,color:"#bbb",cursor:"pointer"}}>{"✕"}</span>):null}
          </div>
        );})}
        <button onClick={addPage} style={{padding:"2px 8px",borderRadius:4,border:"1px dashed #bbb",background:"transparent",cursor:"pointer",fontSize:10,color:"#999",fontFamily:"inherit"}}>{"+"}</button>
        <div style={{width:1,height:18,background:"#bbb",margin:"0 6px"}}/>
        {[{t:"plain",l:"Düz"},{t:"grid",l:"▦"},{t:"dot",l:"⠿"},{t:"line",l:"☰"}].map(function(b){return <button key={b.t} onClick={function(){setBgType(b.t);}} style={{padding:"2px 6px",borderRadius:4,border:bgType===b.t?"2px solid #78350f":"1px solid #ccc",background:bgType===b.t?"#f59e0b":"transparent",cursor:"pointer",fontSize:8,fontWeight:700,color:bgType===b.t?"#fff":"#888",fontFamily:"inherit"}}>{b.l}</button>;})}
        <div style={{width:1,height:18,background:"#bbb",margin:"0 2px"}}/>
        {["#f0ead6","#ffffff","#e8f4f8","#f0f0f0","#2d2d2d"].map(function(c){return <div key={c} onClick={function(){setBgColor(c);}} style={{width:14,height:14,borderRadius:"50%",background:c,cursor:"pointer",border:bgColor===c?"2px solid #78350f":c==="#ffffff"?"1px solid #ccc":"1px solid transparent"}}/>;})}
      </div>

      {/* ARAÇ ÇUBUĞU */}
      <div style={{height:36,minHeight:36,background:PB,borderTop:"1px solid "+PBD,display:"flex",alignItems:"center",padding:"0 10px",gap:3}}>
        <div style={{display:"flex",gap:2}}>
          <button onClick={function(){setTool("select");}} style={bs(tool==="select",{fontSize:11,padding:"3px 7px"})}>{"👆"}</button>
          <button onClick={function(){setTool("scissors");}} style={bs(tool==="scissors",{fontSize:11,padding:"3px 7px"})}>{"✂️"}</button>
          <button onClick={function(){setTool("pen");}} style={bs(tool==="pen",{fontSize:11,padding:"3px 7px"})}>{"✏️"}</button>
          <button onClick={function(){setTool("text");}} style={bs(tool==="text",{fontSize:11,padding:"3px 7px"})}>{"T"}</button>
        </div>
        {(tool==="pen"||tool==="text")?(<>
          <div style={{width:1,height:20,background:PBD}}/>
          <div style={{display:"flex",gap:2}}>{["#1a1a1a","#dc2626","#2563eb","#16a34a","#d97706","#fff"].map(function(c){return <div key={c} onClick={function(){setPenClr(c);}} style={{width:15,height:15,borderRadius:"50%",background:c,cursor:"pointer",border:penClr===c?"2px solid #78350f":c==="#fff"?"2px solid #ccc":"2px solid transparent"}}/>;})}</div>
        </>):null}
        {tool==="pen"?(<>
          <div style={{width:1,height:20,background:PBD}}/>
          <div style={{display:"flex",gap:2,alignItems:"center"}}>
            {[2,4,8].map(function(w){return <div key={w} onClick={function(){setPenW(w);}} style={{width:w+10,height:w+10,borderRadius:"50%",background:penW===w?"#555":"#bbb",cursor:"pointer",border:penW===w?"2px solid #333":"2px solid transparent"}}/>;})}</div>
        </>):null}
        <div style={{flex:1}}/>
        <div style={{display:"flex",gap:2,alignItems:"center"}}>
          <button onClick={function(){setZoom(function(z){return Math.max(0.3,z-0.1);});}} style={bs(false,{fontSize:10,padding:"2px 6px"})}>{"−"}</button>
          <span style={{fontSize:8,fontWeight:700,color:PS,minWidth:30,textAlign:"center"}}>{Math.round(zoom*100)+"%"}</span>
          <button onClick={function(){setZoom(function(z){return Math.min(3,z+0.1);});}} style={bs(false,{fontSize:10,padding:"2px 6px"})}>{"+"}</button>
          {zoom!==1?(<button onClick={function(){setZoom(1);setPan({x:0,y:0});}} style={bs(false,{fontSize:7,padding:"2px 5px"})}>{"↺"}</button>):null}
        </div>
      </div>

      {helpOpen?(<div onClick={function(){setHelp(false);}} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center"}}><div onClick={function(e){e.stopPropagation();}} style={{background:"#fffdf7",borderRadius:20,padding:"28px 36px",maxWidth:460,boxShadow:"0 16px 48px rgba(0,0,0,.3)",maxHeight:"80vh",overflowY:"auto"}}>
        <div style={{fontSize:20,fontWeight:900,marginBottom:16}}>{"Kullanım"}</div>
        <div style={{fontSize:12,color:"#555",lineHeight:1.8}}>{"• Soldan çubukları modelin üzerine sürükle-bırak"}<br/>{"• Parçaya tıkla → son parça silinir"}<br/>{"• −/+ ile tam sayı genişlet"}<br/>{"• Modeller arası ○ işarete tıklayarak + − = değiştir"}<br/>{"• = koyduğunda doğruysa yeşil ✓, yanlışsa kırmızı ✗"}<br/>{"• N: model • Ctrl+Z/Y • ⊞: yeniden diz • L: etiket"}</div>
        <div style={{fontSize:11,color:"#9ca3af",marginTop:12}}>{"Kapatmak için tıklayın"}</div>
      </div></div>):null}

      {/* HAKKINDA */}
      {aboutOpen?(<div onClick={function(){setAbout(false);}} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div onClick={function(e){e.stopPropagation();}} style={{background:"#fffdf7",borderRadius:24,padding:"32px 40px",maxWidth:480,boxShadow:"0 20px 60px rgba(0,0,0,.3)",textAlign:"center",maxHeight:"90vh",overflowY:"auto"}}>
          {/* Logo */}
          <div style={{margin:"0 auto 12px"}}><Logo size={80}/></div>
          <div style={{fontSize:28,fontWeight:900,color:"#3d3520",marginBottom:4}}>{"DokunSay"}</div>
          <div style={{fontSize:15,fontWeight:800,color:"#d97706",marginBottom:6}}>{"Kesirler Öğretim Materyali"}</div>
          <div style={{width:40,height:3,background:"#d97706",borderRadius:2,margin:"0 auto 16px"}}/>
          <div style={{fontSize:13,color:"#666",lineHeight:1.7,marginBottom:20,textAlign:"left"}}>
            {"DokunSay Kesirler, kesir kavramının somut manipülatiflerle keşfedilerek öğrenilmesini sağlayan interaktif bir dijital öğretim materyalidir. Birleşik model (daire + çubuk + sayı doğrusu + sembolik gösterim) ile üçlü kodlama yaklaşımını temel alır."}
          </div>
          {/* Geliştiriciler */}
          <div style={{background:"rgba(245,158,11,.06)",border:"1.5px solid rgba(245,158,11,.15)",borderRadius:16,padding:"16px 20px",marginBottom:20,textAlign:"left"}}>
            <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:2,color:"#d97706",marginBottom:12}}>{"GELİŞTİRİCİLER"}</div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#f59e0b,#b45309)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:20}}>{"🎓"}</span></div>
              <div><div style={{fontSize:15,fontWeight:900,color:"#3d3520"}}>{"Prof. Dr. Yılmaz Mutlu"}</div></div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,#f59e0b,#b45309)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:20}}>{"📐"}</span></div>
              <div><div style={{fontSize:15,fontWeight:900,color:"#3d3520"}}>{"Edanur Güven"}</div></div>
            </div>
          </div>
          <div style={{fontSize:11,color:"#999",fontStyle:"italic",marginBottom:12}}>
            {"Diskalkuli ve matematik öğrenme güçlüğü yaşayan öğrenciler başta olmak üzere, tüm öğrencilerin kesir kavramını somut deneyimlerle keşfetmesini amaçlar."}
          </div>
          <div style={{fontSize:10,color:"#ccc",marginBottom:16}}>{"v1.0.0"}</div>
          <button onClick={function(){setAbout(false);}} style={{padding:"10px 32px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#f59e0b,#92400e)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit",boxShadow:"0 4px 16px rgba(245,158,11,.3)"}}>{"Kapat"}</button>
        </div>
      </div>):null}

      {/* ÖĞRETMEN PANELİ */}
      {teacherOpen?(<div onClick={function(){setTeacherOpen(false);}} style={{position:"fixed",inset:0,zIndex:9999,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .2s ease-out"}}>
        <div onClick={function(e){e.stopPropagation();}} style={{background:"#fffdf7",borderRadius:20,padding:"24px 30px",maxWidth:560,width:"90%",boxShadow:"0 16px 48px rgba(0,0,0,.3)",maxHeight:"85vh",overflowY:"auto",animation:"popIn .3s ease-out"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{fontSize:20,fontWeight:900,color:"#3d3520"}}>{"👨‍🏫 Öğretmen Paneli"}</div>
            <button onClick={function(){setTeacherOpen(false);}} style={{padding:"4px 12px",borderRadius:8,border:"none",background:"#eee",cursor:"pointer",fontFamily:"inherit",fontSize:12}}>{"✕"}</button>
          </div>

          {/* Öğrenci Bilgisi */}
          <div style={{background:"rgba(59,130,246,.05)",border:"1px solid rgba(59,130,246,.12)",borderRadius:12,padding:"12px 16px",marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:"#3b82f6",marginBottom:8}}>{"Öğrenci Bilgisi"}</div>
            <input value={studentName} onChange={function(e){setStudentName(e.target.value);}} placeholder="Öğrenci adı..." style={{width:"100%",padding:"6px 10px",borderRadius:6,border:"1px solid #ddd",fontSize:12,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}/>
          </div>

          {/* Etkinlik Takibi */}
          <div style={{background:"rgba(34,197,94,.05)",border:"1px solid rgba(34,197,94,.12)",borderRadius:12,padding:"12px 16px",marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:"#16a34a",marginBottom:8}}>
              {"Etkinlik Takibi — "+Object.keys(completed).length+"/"+ACT.filter(function(a){return a.s;}).length+" tamamlandı"}
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
              {ACT.filter(function(a){return a.s;}).map(function(a,ai){
                var done=!!completed[a.n];
                return(<div key={ai} onClick={function(){var nc=Object.assign({},completed);if(done)delete nc[a.n];else nc[a.n]=true;setCompleted(nc);}}
                  title={a.n} style={{width:28,height:28,borderRadius:6,background:done?"#22c55e":"#f0f0f0",border:done?"2px solid #15803d":"1px solid #ddd",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:done?12:9,color:done?"#fff":"#bbb",fontWeight:800,transition:"all .2s"}}>
                  {done?"✓":(ai+1)}
                </div>);
              })}
            </div>
            <div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:4}}>
              {["kavram","karşılaştır","işlem","yanılgı"].map(function(cat){
                var catActs=ACT.filter(function(a){return a.cat===cat&&a.s;});
                var catDone=catActs.filter(function(a){return completed[a.n];}).length;
                var pct=catActs.length>0?Math.round(catDone/catActs.length*100):0;
                return(<div key={cat} style={{flex:1,minWidth:100,padding:"6px 8px",borderRadius:6,background:"#fff",border:"1px solid #eee",textAlign:"center"}}>
                  <div style={{fontSize:8,fontWeight:700,color:"#888",textTransform:"uppercase"}}>{cat}</div>
                  <div style={{fontSize:16,fontWeight:900,color:pct===100?"#16a34a":pct>0?"#d97706":"#ddd"}}>{pct+"%"}</div>
                  <div style={{height:4,borderRadius:2,background:"#eee",marginTop:2}}><div style={{height:4,borderRadius:2,background:pct===100?"#22c55e":"#f59e0b",width:pct+"%",transition:"width .3s"}}/></div>
                </div>);
              })}
            </div>
          </div>

          {/* Ders Planı Önerileri */}
          <div style={{background:"rgba(245,158,11,.05)",border:"1px solid rgba(245,158,11,.15)",borderRadius:12,padding:"12px 16px",marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:"#d97706",marginBottom:8}}>{"Hazır Ders Planları"}</div>
            {[
              {n:"1. Sınıf: Bütün ve Yarım",acts:["Bütün Nedir?","Yarımı Bul","Kaç Yarım = 1 Bütün?"]},
              {n:"2. Sınıf: Çeyrek ve İlişkiler",acts:["Çeyrek Keşfi","Yarımda Kaç Çeyrek?","Bütün-Yarım-Çeyrek İlişkisi"]},
              {n:"4. Sınıf: Toplama ve Çıkarma",acts:["Kesir Toplama","Kesir Çıkarma","Günlük Hayat Problemi"]},
              {n:"4. Sınıf: Çarpma ve Bölme",acts:["Kesrin Yarısı","Kesir × Kesir","Bütünde Kaç Yarım?","Kesir ÷ Kesir"]},
              {n:"Kavram Yanılgısı Tespiti (Temel)",acts:["Y1: Bütün aynı mı?","Y2: Payda büyük = büyük mü?","Y3: Eş parçalar şartı","Y5: Payda toplanır mı?"]},
              {n:"Kavram Yanılgısı (İleri)",acts:["Y6: Çarpma büyütür mü?","Y7: Bölme küçültür mü?","Y11: 5/4 = 1 tam 1/4 mü?","Y13: Toplama mı çarpma mı?"]},
              {n:"Kesir Anlam Derinleştirme",acts:["Y8: Kesir iki ayrı sayı mı?","Y9: 0 ile 1 arası boş mu?","Y10: Pay arttıkça ne olur?","Y14: Denk kesir nasıl bulunur?"]},
            ].map(function(plan,pi){
              var planDone=plan.acts.filter(function(a){return completed[a];}).length;
              return(<button key={pi} onClick={function(){
                /* Ders planı yükle: ilk tamamlanmamış etkinliği aç */
                var next=null;
                for(var j=0;j<plan.acts.length;j++){if(!completed[plan.acts[j]]){var found=ACT.filter(function(a){return a.n===plan.acts[j];});if(found.length)next=found[0];break;}}
                if(next){setTeacherOpen(false);loadActivity(next);}
              }} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",width:"100%",background:"#fff",border:"1px solid #eee",borderRadius:8,cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:3}}>
                <div style={{fontSize:11,fontWeight:800,color:"#3d3520",flex:1}}>{plan.n}</div>
                <div style={{fontSize:9,fontWeight:700,color:planDone===plan.acts.length?"#16a34a":"#888"}}>{planDone+"/"+plan.acts.length}</div>
              </button>);
            })}
          </div>

          {/* Öğretmen Notları */}
          <div style={{background:"rgba(139,92,246,.05)",border:"1px solid rgba(139,92,246,.12)",borderRadius:12,padding:"12px 16px",marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:1,color:"#8b5cf6",marginBottom:8}}>{"Öğretmen Notları"}</div>
            <textarea value={teacherNotes} onChange={function(e){setTeacherNotes(e.target.value);}} placeholder="Bu öğrenci hakkında notlar..." rows={3} style={{width:"100%",padding:"8px 10px",borderRadius:6,border:"1px solid #ddd",fontSize:11,fontFamily:"inherit",outline:"none",resize:"vertical",boxSizing:"border-box"}}/>
          </div>

          {/* Sıfırla */}
          <div style={{display:"flex",gap:8,justifyContent:"center"}}>
            <button onClick={function(){setCompleted({});}} style={{padding:"6px 16px",borderRadius:8,border:"1px solid #ef4444",background:"rgba(239,68,68,.05)",cursor:"pointer",fontSize:11,fontWeight:700,color:"#ef4444",fontFamily:"inherit"}}>{"İlerlemeyi Sıfırla"}</button>
            <button onClick={function(){setTeacherOpen(false);}} style={{padding:"6px 20px",borderRadius:8,border:"none",background:"linear-gradient(135deg,#f59e0b,#92400e)",color:"#fff",fontSize:11,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{"Kapat"}</button>
          </div>
        </div>
      </div>):null}
    </div>
  );
}
