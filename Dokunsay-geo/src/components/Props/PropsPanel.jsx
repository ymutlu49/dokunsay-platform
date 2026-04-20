import { SHAPE_DEF } from '../../constants/shapes2d.js';
import { P, CAT_META } from '../../constants/palette.js';
import { LANGS } from '../../constants/i18n.js';
import { symmCount } from '../../utils/geometry.js';

// ── Özellikler Paneli ──
export function PropsPanel({item,lang,dispatch}){
  const L=LANGS[lang]||LANGS.tr;
  if(!item) return (
    <div style={{padding:16,color:"rgba(30,27,75,.3)",fontSize:12,textAlign:"center",lineHeight:1.8}}>
      ← {lang==="ku"?"Teşeyekê hilbijêre":lang==="en"?"Click a shape":"Bir şekle tıkla"}
    </div>
  );
  const def=SHAPE_DEF[item.type]; if(!def) return null;
  const cat=CAT_META[def.cat];
  const sc=symmCount(item.type);
  // FIX14: normalize size — 100px = 10 birim
  const units=(item.size/10).toFixed(1);
  // Daire/çember ayrımı: çember (circle) yalnızca sınır — alanı yok
  const areaVal=def.area(item.size,item.ax||1,item.ay||1);
  const area=areaVal!==null?(areaVal/100).toFixed(1):null;
  const perim=(def.perim(item.size,item.ax||1,item.ay||1)/10).toFixed(1);
  // Çember için "çevre" yerine "çember uzunluğu" terminolojisi
  const perimLabel=item.type==="circle"
    ?(lang==="ku"?"Dirêjahiya xelekê":lang==="en"?"Circumference":"Çember Uzunluğu")
    :L.propPerim;
  const row=(lbl,val,c)=>(
    <div style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(99,102,241,.05)"}}>
      <span style={{fontSize:11,color:"rgba(30,27,75,.45)",fontWeight:600}}>{lbl}</span>
      <span style={{fontSize:12,fontWeight:800,color:c||P.text}}>{val}</span>
    </div>
  );
  const shLabel=lang==="ku"?def.labelKu:lang==="en"?def.labelEn:def.label;
  const catLabel=lang==="ku"?cat.labelKu:lang==="en"?cat.labelEn:cat.label;
  return (
    <div style={{padding:"8px 10px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,
        padding:"7px 9px",borderRadius:9,background:cat.color+"18",border:"1.5px solid "+cat.color+"30"}}>
        <span style={{fontSize:20}}>{def.icon}</span>
        <div>
          <div style={{fontSize:12,fontWeight:900,color:cat.colorB}}>{shLabel}</div>
          <div style={{fontSize:9,color:cat.color,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>{catLabel}</div>
        </div>
      </div>
      {row(L.propSides, def.sides>0?def.sides:"∞", cat.colorB)}
      {def.angles.length>0&&row(L.propAngles, [...new Set(def.angles)].map(a=>a+"°").join(", "))}
      {row(L.propParallel, def.parallel||L.propNo, def.parallel>0?"#059669":undefined)}
      {row(L.propRight, def.rightAngles||L.propNo, def.rightAngles>0?"#059669":undefined)}
      {row(L.propRegular, def.isRegular?L.propYes:L.propNo, def.isRegular?"#059669":"#dc2626")}
      {row(L.propSymm, sc===Infinity?"∞":sc, sc>0?"#059669":"#dc2626")}
      <div style={{height:3}}/>
      {area!==null
        ? row(L.propArea, `${area} ${L.unit}²`, P.accentD)
        : row(L.propArea, lang==="ku"?"Tune — tenê sînor":lang==="en"?"None — boundary only":"Yok — yalnızca sınır", "#999")}
      {row(perimLabel, `${perim} ${L.unit}`, P.accentD)}
      {def.angles.length>0&&(
        <div style={{marginTop:6,padding:"5px 7px",borderRadius:7,background:"rgba(99,102,241,.06)"}}>
          <div style={{fontSize:8,fontWeight:800,color:P.accentD,textTransform:"uppercase",letterSpacing:.5,marginBottom:3}}>{L.propAngles}</div>
          <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
            {def.angles.map((a,i)=>(
              <span key={i} style={{padding:"2px 6px",borderRadius:5,fontSize:10,fontWeight:800,
                background:a===90?"rgba(5,150,105,.15)":a>90?"rgba(99,102,241,.15)":"rgba(245,158,11,.15)",
                color:a===90?"#059669":a>90?P.accentD:"#b45309"}}>
                {a}°
              </span>
            ))}
          </div>
        </div>
      )}
      {/* ═══ Renk Seçici ═══
          Öğrenci şeklin rengini seçebilir. Kategoriyi koruyan palet:
          kategori rengi + renk körü dostu ek seçenekler (Okabe-Ito 2008 paleti).
          "Sıfırla" butonu kategori rengine döner. */}
      {dispatch&&(
        <div style={{marginTop:6,padding:"6px 7px",borderRadius:7,background:"rgba(99,102,241,.04)"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
            <div style={{fontSize:8,fontWeight:800,color:P.accentD,textTransform:"uppercase",letterSpacing:.5}}>
              🎨 {lang==="ku"?"Reng":lang==="en"?"Color":"Renk"}
            </div>
            {item.color&&(
              <button onClick={()=>dispatch({type:"COLOR",id:item.id,color:null})}
                style={{padding:"1px 6px",borderRadius:4,border:"1px solid rgba(99,102,241,.2)",
                  background:"rgba(255,255,255,.6)",cursor:"pointer",fontSize:8,
                  fontWeight:700,color:P.accentD,fontFamily:"inherit"}}>
                {lang==="ku"?"Vegerîne":lang==="en"?"Reset":"Sıfırla"}
              </button>
            )}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(8, 1fr)",gap:3}}>
            {[
              /* Okabe-Ito renk körü dostu palet + temel renkler */
              "#ef4444", "#f59e0b", "#eab308", "#10b981",
              "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
              /* Daha yumuşak tonlar */
              "#fca5a5", "#fcd34d", "#bef264", "#86efac",
              "#67e8f9", "#93c5fd", "#c4b5fd", "#f9a8d4",
            ].map(c=>{
              const isSel=item.color===c;
              return (
                <button key={c}
                  onClick={()=>dispatch({type:"COLOR",id:item.id,color:c})}
                  aria-label={`Renk: ${c}`}
                  aria-pressed={isSel}
                  style={{width:"100%",aspectRatio:"1",borderRadius:5,
                    border:isSel?"2.5px solid "+P.accent:"1px solid rgba(99,102,241,.15)",
                    background:c,cursor:"pointer",
                    boxShadow:isSel?"0 0 0 2px #fff inset":"none",
                    transition:"all .1s"}}/>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
