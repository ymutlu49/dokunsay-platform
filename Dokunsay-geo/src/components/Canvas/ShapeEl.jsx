import { SHAPE_DEF } from '../../constants/shapes2d.js';
import { P, CAT_META } from '../../constants/palette.js';
import { toPoints } from '../../utils/geometry.js';
import { AngleLabels } from './AngleLabels.jsx';

// ── ShapeEl: renk körü desteği ──
export function ShapeEl({item,selected,showSides,showAngles,zoom,colorBlind,onPointerDown,onRotateStart,onResizeStart,onEdgeResizeStart}){
  const def=SHAPE_DEF[item.type]; if(!def) return null;
  const cat=CAT_META[def.cat];
  const {x:cx,y:cy,size:s,rotation:rot,flippedH,flippedV,ax,ay}=item;
  /* Öğrenci özel bir renk seçmişse onu kullan, yoksa kategori rengi (veya renk körü palet) */
  const baseColor=item.color
    ?item.color
    :(colorBlind?({triangle:"#d55e00",quadrilateral:"#0072b2",polygon:"#cc79a7",circle:"#009e73"}[def.cat]||cat.color):cat.color);
  /* Dolgu %25 opaklık (20 → 40 hex), çizgi 1.8 → 3px.
     Belirginliği artırır ama kategori renklerini yine de yumuşak tutar. */
  const fill=baseColor+"40", stroke=selected?P.accent:baseColor, sw=selected?3.5:3;
  const cbPattern=colorBlind?`cb-${def.cat}`:null;
  return (
    <g role="img" aria-label={def.label}>
      {/* Şeklin kendisi — döndürülmüş */}
      <g transform={`rotate(${rot||0},${cx},${cy})`}
        onPointerDown={onPointerDown}
        style={{cursor:"pointer",filter:selected?`drop-shadow(0 0 8px ${P.accent}88)`:"none"}}>
        {colorBlind&&<defs>
          <pattern id={`cb-${def.cat}`} x={0} y={0} width={8} height={8} patternUnits="userSpaceOnUse">
            {def.cat==="triangle"&&<line x1={0} y1={0} x2={8} y2={8} stroke={baseColor} strokeWidth={1.5} opacity={0.4}/>}
            {def.cat==="quadrilateral"&&<line x1={0} y1={4} x2={8} y2={4} stroke={baseColor} strokeWidth={1.5} opacity={0.4}/>}
            {def.cat==="polygon"&&<><line x1={0} y1={0} x2={8} y2={8} stroke={baseColor} strokeWidth={1} opacity={0.4}/><line x1={8} y1={0} x2={0} y2={8} stroke={baseColor} strokeWidth={1} opacity={0.4}/></>}
            {def.cat==="circle"&&<circle cx={4} cy={4} r={2} fill={baseColor} opacity={0.3}/>}
          </pattern>
        </defs>}
        {item.type==="circle"
          ?<circle cx={cx} cy={cy} r={def.r(s)} fill="none" stroke={stroke} strokeWidth={sw}/>
          :item.type==="disk"
          ?<circle cx={cx} cy={cy} r={def.r(s)} fill={colorBlind?`url(#${cbPattern})`:fill} stroke={stroke} strokeWidth={sw}/>
          :<polygon points={toPoints(def.verts(cx,cy,s,ax,ay))} fill={colorBlind?`url(#${cbPattern})`:fill} stroke={stroke} strokeWidth={sw}/>}
        {showSides&&def.sides>0&&(
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle"
            style={{fontSize:11/zoom,fontWeight:800,fill:baseColor,pointerEvents:"none",fontFamily:"system-ui"}}>
            {def.sides}
          </text>
        )}
        {showAngles&&<AngleLabels item={{...item,rotation:0}} zoom={zoom}/>}
        {/* ═══ Kenar Uzunluğu Etiketleri ═══
            Seçili şekilde her kenarın ortasında "X.X birim" etiketi.
            Normalize: 10 birim = 100 piksel.
            Çember/daire için yarıçap (r) etiketi merkezden gösterilir. */}
        {selected&&def.sides>0&&(()=>{
          const verts=def.verts(cx,cy,s,ax,ay);
          return verts.map((v,i)=>{
            const next=verts[(i+1)%verts.length];
            const midX=(v[0]+next[0])/2;
            const midY=(v[1]+next[1])/2;
            /* Kenar uzunluğu piksel → birim (10px = 1 birim) */
            const lenPx=Math.hypot(next[0]-v[0], next[1]-v[1]);
            const lenUnit=(lenPx/10).toFixed(1);
            /* Etiket konumu kenardan biraz dışarı (normal vektör yönünde) */
            const dx=next[0]-v[0], dy=next[1]-v[1];
            const nlen=Math.hypot(dx,dy)||1;
            /* Dışa bakan normal: şeklin merkezinden uzaklaşan yön */
            const nx=-dy/nlen, ny=dx/nlen;
            /* Merkezden uzaklaşan yönü seç */
            const toCenterX=midX-cx, toCenterY=midY-cy;
            const dot=nx*toCenterX+ny*toCenterY;
            const sign=dot>0?1:-1;
            const offset=12/zoom;
            const labelX=midX+nx*offset*sign;
            const labelY=midY+ny*offset*sign;
            return (
              <g key={`edge-${i}`} style={{pointerEvents:"none"}}>
                <rect x={labelX-13/zoom} y={labelY-7/zoom}
                  width={26/zoom} height={14/zoom}
                  rx={3/zoom}
                  fill="#fff" stroke={P.accent} strokeWidth={1/zoom} opacity={0.92}/>
                <text x={labelX} y={labelY}
                  textAnchor="middle" dominantBaseline="central"
                  style={{fontSize:9/zoom,fontWeight:800,fill:P.accentD,fontFamily:"system-ui"}}>
                  {lenUnit}
                </text>
              </g>
            );
          });
        })()}
        {/* Çember/daire için yarıçap etiketi */}
        {selected&&(item.type==="circle"||item.type==="disk")&&(()=>{
          const rPx=def.r(s);
          const rUnit=(rPx/10).toFixed(1);
          return (
            <g style={{pointerEvents:"none"}}>
              {/* Yarıçap çizgisi */}
              <line x1={cx} y1={cy} x2={cx+rPx} y2={cy}
                stroke={P.accent} strokeWidth={1.2/zoom} strokeDasharray={`${3/zoom},${2/zoom}`} opacity={0.7}/>
              <rect x={cx+rPx/2-14/zoom} y={cy-8/zoom}
                width={28/zoom} height={16/zoom} rx={3/zoom}
                fill="#fff" stroke={P.accent} strokeWidth={1/zoom} opacity={0.92}/>
              <text x={cx+rPx/2} y={cy}
                textAnchor="middle" dominantBaseline="central"
                style={{fontSize:9/zoom,fontWeight:800,fill:P.accentD,fontFamily:"system-ui"}}>
                r={rUnit}
              </text>
            </g>
          );
        })()}
      </g>
      {/* ═══ Döndürme tutamacı ═══
          Şeklin 55px üstünde, döndürülmeyen koordinat sisteminde.
          Bu yüzden şekil döndükçe de her zaman "üstte" kalır gibi görünür.
          Kullanıcı tutamağı yakalar → fare hareketi ile atan2 açı hesaplanır. */}
      {selected&&(()=>{
        /* Tutamağın konumu: şeklin dönüş açısına göre üst-merkez */
        const handleDist=s*0.65;
        const rad=(rot||0)*Math.PI/180;
        const hx=cx+Math.sin(rad)*handleDist;
        const hy=cy-Math.cos(rad)*handleDist;
        return (
          <g style={{pointerEvents:"auto"}}>
            {/* Şekilden tutamağa bağlantı çizgisi */}
            <line x1={cx} y1={cy} x2={hx} y2={hy}
              stroke={P.accent} strokeWidth={1.2/zoom} strokeDasharray={`${3/zoom},${2/zoom}`}
              opacity={0.5} style={{pointerEvents:"none"}}/>
            {/* Döndürme tutamacı (büyük, belirgin) */}
            <circle cx={hx} cy={hy} r={9/zoom}
              fill="#fff" stroke={P.accent} strokeWidth={2.5/zoom}
              style={{cursor:"grab"}}
              onPointerDown={e=>{e.stopPropagation();onRotateStart&&onRotateStart(e,item.id);}}/>
            {/* İkon: dönme oku */}
            <text x={hx} y={hy} textAnchor="middle" dominantBaseline="central"
              style={{fontSize:11/zoom,fill:P.accent,fontWeight:800,pointerEvents:"none",fontFamily:"system-ui"}}>
              ↻
            </text>
            {/* Boyutlandırma tutamacı (sağ alt) */}
            {(()=>{
              const rx=cx+Math.cos(rad+Math.PI/4)*s*0.55;
              const ry=cy+Math.sin(rad+Math.PI/4)*s*0.55;
              return (
                <rect x={rx-6/zoom} y={ry-6/zoom} width={12/zoom} height={12/zoom}
                  fill="#fff" stroke={P.accentD} strokeWidth={2/zoom} rx={2/zoom}
                  style={{cursor:"nwse-resize"}}
                  onPointerDown={e=>{e.stopPropagation();onResizeStart&&onResizeStart(e,item.id);}}/>
              );
            })()}
            {/* ═══ Kenar Tutamaçları ═══
                Yalnız dikdörtgen/paralelkenar/eşkenar dörtgen için — 4 kenar ortasında.
                Yatay kenar (üst/alt) çekilince ay, dikey kenar (sol/sağ) çekilince ax değişir.
                Şekil tipine göre "rect" veya "rhombus" davranışı onEdgeResizeStart'a geçilir. */}
            {def.resizable&&(()=>{
              /* 4 kenar: 'top', 'right', 'bottom', 'left' */
              /* verts döndürülmemiş halde hesaplanır, sonra rotasyon uygulanır */
              const verts=def.verts(cx,cy,s,ax||1,ay||1);
              const edges=[
                {key:"top", mi:0, mj:1},    // üst
                {key:"right", mi:1, mj:2},  // sağ
                {key:"bottom", mi:2, mj:3}, // alt
                {key:"left", mi:3, mj:0},   // sol
              ];
              const cursorMap={top:"ns-resize",bottom:"ns-resize",left:"ew-resize",right:"ew-resize"};
              return edges.map(ed=>{
                const [x1,y1]=verts[ed.mi];
                const [x2,y2]=verts[ed.mj];
                /* Kenarın orta noktası (şekil dönüşü uygulanmamış) */
                const mx=(x1+x2)/2, my=(y1+y2)/2;
                /* Rotasyonu manuel uygula (tutamaç, g içinde değil, rotasyon dışı) */
                const dx=mx-cx, dy=my-cy;
                const rx=cx+dx*Math.cos(rad)-dy*Math.sin(rad);
                const ry=cy+dx*Math.sin(rad)+dy*Math.cos(rad);
                return (
                  <circle key={ed.key} cx={rx} cy={ry} r={6/zoom}
                    fill="#fff" stroke="#10b981" strokeWidth={2/zoom}
                    style={{cursor:cursorMap[ed.key]}}
                    onPointerDown={e=>{e.stopPropagation();
                      onEdgeResizeStart&&onEdgeResizeStart(e,item.id,ed.key);
                    }}/>
                );
              });
            })()}
          </g>
        );
      })()}
    </g>
  );
}
