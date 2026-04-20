// ══════════════════════════════════════════════════════════════
// 3B CİSİMLER (SHAPE_3D)
// Her cisim iki temsile sahiptir:
//   iso(cx,cy,s,yaw) → izometrik projeksiyon (derinlik sıralı yüzler)
//   net(cx,cy,s)     → 2B açınım (yüzlerin düzlemde açılması)
// Pedagoji: Meng (2009) — 3B↔açınım geçişi Van Hiele L0→L1 için etkili.
// ══════════════════════════════════════════════════════════════
import { project3D } from '../utils/geometry.js';

export const SHAPE_3D={
  cube:{
    label:"Küp", labelKu:"Kûb", labelEn:"Cube",
    icon:"🎲",
    iconSvg:(c)=>(
      /* Küp — izometrik tel kafes. Üst paralelkenar + sol yüz + sağ yüz */
      <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill="none" stroke={c||"currentColor"} strokeWidth="1.5" strokeLinejoin="round">
        <path d="M 12 3 L 22 8 L 22 18 L 12 23 L 2 18 L 2 8 Z"/>
        <path d="M 12 3 L 12 13 M 2 8 L 12 13 M 22 8 L 12 13"/>
      </svg>
    ),
    faces:6, edges:12, vertices:8,
    /* yaw derece cinsinden, varsayılan -45° (klasik izometrik görünüm) */
    iso:(cx,cy,s,yaw)=>{
      const u=s*0.5;
      const yawVal=yaw===undefined?-45:yaw;
      /* 3B→2B projeksiyon + merkeze kaydır */
      const proj=(x,y,z)=>{
        const p=project3D(x,y,z,yawVal);
        return [cx+p.x*u, cy+p.y*u];
      };
      /* 8 köşe (3B koordinatları) */
      const verts3D={
        FDL:[-0.5,-0.5, 0.5],  FDR:[ 0.5,-0.5, 0.5],
        FUL:[-0.5, 0.5, 0.5],  FUR:[ 0.5, 0.5, 0.5],
        BDL:[-0.5,-0.5,-0.5],  BDR:[ 0.5,-0.5,-0.5],
        BUL:[-0.5, 0.5,-0.5],  BUR:[ 0.5, 0.5,-0.5],
      };
      /* Her yüzün 4 köşesi + yüz merkezinin rotasyon sonrası z değeri (derinlik) */
      const yawRad=yawVal*Math.PI/180;
      /* z-derinliği: rotasyon sonrası z koordinatı. Büyük = uzakta (arkada), küçük = yakında (önde) */
      const depth=(x,y,z)=>x*Math.sin(yawRad)+z*Math.cos(yawRad);
      const faceMidDepth=(names)=>{
        const avg=[0,0,0];
        names.forEach(n=>{avg[0]+=verts3D[n][0];avg[1]+=verts3D[n][1];avg[2]+=verts3D[n][2];});
        return depth(avg[0]/names.length, avg[1]/names.length, avg[2]/names.length);
      };
      /* 6 yüz — köşe listeleri */
      const faces=[
        {name:"top",    verts:["FUL","FUR","BUR","BUL"]}, // y=+0.5
        {name:"bottom", verts:["FDL","BDL","BDR","FDR"]}, // y=-0.5
        {name:"front",  verts:["FDL","FDR","FUR","FUL"]}, // z=+0.5
        {name:"back",   verts:["BDR","BDL","BUL","BUR"]}, // z=-0.5
        {name:"right",  verts:["FDR","BDR","BUR","FUR"]}, // x=+0.5
        {name:"left",   verts:["BDL","FDL","FUL","BUL"]}, // x=-0.5
      ];
      /* z-sort: derinlik küçük olan (önde) SON çizilmeli (üstte görünsün).
         SVG'de son çizilen üstte → descending sort (büyük depth önce) */
      faces.sort((a,b)=>faceMidDepth(b.verts)-faceMidDepth(a.verts));
      /* Tüm yüzleri projeksiyonla ve döndür */
      const result={};
      faces.forEach(f=>{
        /* Sadece görünen yüzleri dahil et: backface culling.
           Normal x-ekseni rotasyonunda y-yukarı kamera → sadece yüz normali kameraya dönükse görünür.
           Basitleştirme: sort sonrası ilk 3 yüz arkadadır, son 3 yüz öndedir.
           Render sırasında hepsini çiziyoruz, önündekiler arkadakileri örter. */
        result[f.name]=f.verts.map(n=>{
          const [x,y,z]=verts3D[n];
          return proj(x,y,z);
        });
      });
      return result;
    },
    /* Açınım: haç şeklinde 6 yüz */
    net:(cx,cy,s)=>{
      const u=s*0.42;
      /* Merkez karenin sol-üst köşesi */
      const x0=cx-u/2, y0=cy-u/2;
      /* 6 yüz — haç düzeni:
            [ top  ]
         [lf][frn][rt][bk]
            [ btm ]
      */
      return [
        {name:"top",    pts:[[x0,y0-u],[x0+u,y0-u],[x0+u,y0],[x0,y0]]},
        {name:"left",   pts:[[x0-u,y0],[x0,y0],[x0,y0+u],[x0-u,y0+u]]},
        {name:"front",  pts:[[x0,y0],[x0+u,y0],[x0+u,y0+u],[x0,y0+u]]},
        {name:"right",  pts:[[x0+u,y0],[x0+2*u,y0],[x0+2*u,y0+u],[x0+u,y0+u]]},
        {name:"back",   pts:[[x0+2*u,y0],[x0+3*u,y0],[x0+3*u,y0+u],[x0+2*u,y0+u]]},
        {name:"bottom", pts:[[x0,y0+u],[x0+u,y0+u],[x0+u,y0+2*u],[x0,y0+2*u]]},
      ];
    },
  },
  rect_prism:{
    label:"Dikdörtgenler Prizması", labelKu:"Prîzma Çarhêl", labelEn:"Rectangular Prism",
    icon:"📦",
    iconSvg:(c)=>(
      /* Dikdörtgenler prizması — daha uzun, basık küp */
      <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill="none" stroke={c||"currentColor"} strokeWidth="1.5" strokeLinejoin="round">
        <path d="M 12 5 L 22 9 L 22 17 L 12 21 L 2 17 L 2 9 Z"/>
        <path d="M 12 5 L 12 13 M 2 9 L 12 13 M 22 9 L 12 13"/>
      </svg>
    ),
    faces:6, edges:12, vertices:8,
    iso:(cx,cy,s,yaw)=>{
      const u=s*0.45;
      const yawVal=yaw===undefined?-45:yaw;
      const w=0.65, h=0.35, d=0.45;
      const proj=(x,y,z)=>{
        const p=project3D(x,y,z,yawVal);
        return [cx+p.x*u, cy+p.y*u];
      };
      const verts3D={
        FDL:[-w,-h, d],  FDR:[ w,-h, d],
        FUL:[-w, h, d],  FUR:[ w, h, d],
        BDL:[-w,-h,-d],  BDR:[ w,-h,-d],
        BUL:[-w, h,-d],  BUR:[ w, h,-d],
      };
      const yawRad=yawVal*Math.PI/180;
      const depth=(x,y,z)=>x*Math.sin(yawRad)+z*Math.cos(yawRad);
      const faceMidDepth=names=>{
        const avg=[0,0,0];
        names.forEach(n=>{avg[0]+=verts3D[n][0];avg[1]+=verts3D[n][1];avg[2]+=verts3D[n][2];});
        return depth(avg[0]/names.length, avg[1]/names.length, avg[2]/names.length);
      };
      const faces=[
        {name:"top",    verts:["FUL","FUR","BUR","BUL"]},
        {name:"bottom", verts:["FDL","BDL","BDR","FDR"]},
        {name:"front",  verts:["FDL","FDR","FUR","FUL"]},
        {name:"back",   verts:["BDR","BDL","BUL","BUR"]},
        {name:"right",  verts:["FDR","BDR","BUR","FUR"]},
        {name:"left",   verts:["BDL","FDL","FUL","BUL"]},
      ];
      faces.sort((a,b)=>faceMidDepth(b.verts)-faceMidDepth(a.verts));
      const result={};
      faces.forEach(f=>{
        result[f.name]=f.verts.map(n=>{
          const [x,y,z]=verts3D[n];
          return proj(x,y,z);
        });
      });
      return result;
    },
    net:(cx,cy,s)=>{
      const u=s*0.32;
      const w=u*1.4, h=u*0.8, d=u*1.0;
      const x0=cx-w/2, y0=cy-h/2;
      return [
        {name:"top",    pts:[[x0,y0-d],[x0+w,y0-d],[x0+w,y0],[x0,y0]]},
        {name:"left",   pts:[[x0-d,y0],[x0,y0],[x0,y0+h],[x0-d,y0+h]]},
        {name:"front",  pts:[[x0,y0],[x0+w,y0],[x0+w,y0+h],[x0,y0+h]]},
        {name:"right",  pts:[[x0+w,y0],[x0+w+d,y0],[x0+w+d,y0+h],[x0+w,y0+h]]},
        {name:"back",   pts:[[x0+w+d,y0],[x0+2*w+d,y0],[x0+2*w+d,y0+h],[x0+w+d,y0+h]]},
        {name:"bottom", pts:[[x0,y0+h],[x0+w,y0+h],[x0+w,y0+h+d],[x0,y0+h+d]]},
      ];
    },
  },
  sq_pyramid:{
    label:"Kare Piramit", labelKu:"Pîrameda Çaryalî", labelEn:"Square Pyramid",
    icon:"🔺",
    iconSvg:(c)=>(
      /* Kare piramit — üstte tepe, altta kare taban */
      <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill="none" stroke={c||"currentColor"} strokeWidth="1.5" strokeLinejoin="round">
        <path d="M 12 3 L 22 17 L 12 21 L 2 17 Z"/>
        <path d="M 12 3 L 12 21"/>
        <path d="M 2 17 L 12 13 L 22 17" strokeDasharray="2,1.5"/>
      </svg>
    ),
    faces:5, edges:8, vertices:5,
    iso:(cx,cy,s,yaw)=>{
      const u=s*0.55;
      const yawVal=yaw===undefined?-45:yaw;
      const proj=(x,y,z)=>{
        const p=project3D(x,y,z,yawVal);
        return [cx+p.x*u, cy+p.y*u];
      };
      const verts3D={
        BDL:[-0.5,-0.3,-0.5],  BDR:[ 0.5,-0.3,-0.5],
        FDR:[ 0.5,-0.3, 0.5],  FDL:[-0.5,-0.3, 0.5],
        APX:[ 0,    0.7, 0   ],
      };
      const yawRad=yawVal*Math.PI/180;
      const depth=(x,y,z)=>x*Math.sin(yawRad)+z*Math.cos(yawRad);
      const faceMidDepth=names=>{
        const avg=[0,0,0];
        names.forEach(n=>{avg[0]+=verts3D[n][0];avg[1]+=verts3D[n][1];avg[2]+=verts3D[n][2];});
        return depth(avg[0]/names.length, avg[1]/names.length, avg[2]/names.length);
      };
      /* 5 yüz: taban (dörtgen) + 4 üçgen yüz */
      const faces=[
        {name:"base",   verts:["FDL","BDL","BDR","FDR"]}, // taban
        {name:"front",  verts:["FDL","FDR","APX"]},
        {name:"right",  verts:["FDR","BDR","APX"]},
        {name:"back",   verts:["BDR","BDL","APX"]},
        {name:"left",   verts:["BDL","FDL","APX"]},
      ];
      faces.sort((a,b)=>faceMidDepth(b.verts)-faceMidDepth(a.verts));
      const result={};
      faces.forEach(f=>{
        result[f.name]=f.verts.map(n=>{
          const [x,y,z]=verts3D[n];
          return proj(x,y,z);
        });
      });
      return result;
    },
    net:(cx,cy,s)=>{
      const u=s*0.4;
      /* Merkezde kare taban (uxu), 4 kenarda üçgen kanat.
         Piramit yüksekliği y=0.7, taban yarısı 0.5, dolayısıyla
         üçgen yüz yüksekliği (apex→taban kenarı ortası) = sqrt(0.7²+0.5²) ≈ 0.86u */
      const x0=cx-u/2, y0=cy-u/2;
      const th=u*0.86; // üçgen yüz yüksekliği
      return [
        /* merkez kare = taban */
        {name:"base",   pts:[[x0,y0],[x0+u,y0],[x0+u,y0+u],[x0,y0+u]]},
        /* üst üçgen (karenin üst kenarına oturur) */
        {name:"top",    pts:[[x0,y0],[x0+u,y0],[x0+u/2,y0-th]]},
        /* sağ üçgen (karenin sağ kenarına oturur) */
        {name:"right",  pts:[[x0+u,y0],[x0+u,y0+u],[x0+u+th,y0+u/2]]},
        /* alt üçgen (karenin alt kenarına oturur) */
        {name:"bottom", pts:[[x0+u,y0+u],[x0,y0+u],[x0+u/2,y0+u+th]]},
        /* sol üçgen (karenin sol kenarına oturur) */
        {name:"left",   pts:[[x0,y0+u],[x0,y0],[x0-th,y0+u/2]]},
      ];
    },
  },
  tri_prism:{
    label:"Üçgen Prizma", labelKu:"Prîzma Sêgoşe", labelEn:"Triangular Prism",
    icon:"🔻",
    iconSvg:(c)=>(
      /* Üçgen prizma — yatan toblerone */
      <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill="none" stroke={c||"currentColor"} strokeWidth="1.5" strokeLinejoin="round">
        <path d="M 4 8 L 20 8 L 12 20 Z"/>
        <path d="M 4 8 L 8 4 L 24 4 L 20 8"/>
        <path d="M 20 8 L 16 20 L 12 20" strokeDasharray="2,1.5"/>
        <path d="M 24 4 L 16 20" strokeDasharray="2,1.5"/>
      </svg>
    ),
    faces:5, edges:9, vertices:6,
    iso:(cx,cy,s,yaw)=>{
      const u=s*0.5;
      const yawVal=yaw===undefined?-45:yaw;
      const proj=(x,y,z)=>{
        const p=project3D(x,y,z,yawVal);
        return [cx+p.x*u, cy+p.y*u];
      };
      const verts3D={
        F_L:[-0.5,-0.4, 0.5],  F_R:[ 0.5,-0.4, 0.5],  F_T:[0, 0.5, 0.5],
        B_L:[-0.5,-0.4,-0.5],  B_R:[ 0.5,-0.4,-0.5],  B_T:[0, 0.5,-0.5],
      };
      const yawRad=yawVal*Math.PI/180;
      const depth=(x,y,z)=>x*Math.sin(yawRad)+z*Math.cos(yawRad);
      const faceMidDepth=names=>{
        const avg=[0,0,0];
        names.forEach(n=>{avg[0]+=verts3D[n][0];avg[1]+=verts3D[n][1];avg[2]+=verts3D[n][2];});
        return depth(avg[0]/names.length, avg[1]/names.length, avg[2]/names.length);
      };
      /* 5 yüz: ön üçgen, arka üçgen, taban, sol eğik, sağ eğik */
      const faces=[
        {name:"front",       verts:["F_L","F_R","F_T"]},
        {name:"back",        verts:["B_R","B_L","B_T"]},
        {name:"bottom",      verts:["F_L","B_L","B_R","F_R"]},
        {name:"slant_right", verts:["F_R","B_R","B_T","F_T"]},
        {name:"slant_left",  verts:["B_L","F_L","F_T","B_T"]},
      ];
      faces.sort((a,b)=>faceMidDepth(b.verts)-faceMidDepth(a.verts));
      const result={};
      faces.forEach(f=>{
        result[f.name]=f.verts.map(n=>{
          const [x,y,z]=verts3D[n];
          return proj(x,y,z);
        });
      });
      return result;
    },
    net:(cx,cy,s)=>{
      const u=s*0.36;
      /* Prizma taban üçgeninin köşeleri (-0.5,-0.4), (0.5,-0.4), (0,0.5)
         Taban kenarı = 1u, yan kenar (eğik) = sqrt(0.5² + 0.9²) ≈ 1.03u */
      const slant=u*1.03;
      const triH=u*0.9;  // üçgenin yüksekliği (apex y=0.5 - taban y=-0.4)
      /* Merkez dikdörtgen (taban — prizmanın ayak dikdörtgeni): uxu
         Yan eğik dikdörtgenler: slantxu */
      const cX=cx-u/2, cY=cy-u/2;
      return [
        /* 3 dikdörtgen yan yana (derinlik u) */
        {name:"slant_left", pts:[[cX-slant,cY],[cX,cY],[cX,cY+u],[cX-slant,cY+u]]},
        {name:"base",       pts:[[cX,cY],[cX+u,cY],[cX+u,cY+u],[cX,cY+u]]},
        {name:"slant_right",pts:[[cX+u,cY],[cX+u+slant,cY],[cX+u+slant,cY+u],[cX+u,cY+u]]},
        /* Ön üçgen (merkez dikdörtgenin üstünde) */
        {name:"front",      pts:[[cX,cY],[cX+u,cY],[cX+u/2,cY-triH]]},
        /* Arka üçgen (merkez dikdörtgenin altında) */
        {name:"back",       pts:[[cX+u,cY+u],[cX,cY+u],[cX+u/2,cY+u+triH]]},
      ];
    },
  },
  /* ═══ ÜÇGEN PİRAMİT (TETRAHEDRON) ═══
     Eşkenar tabanlı düzgün tetrahedron. 4 eşkenar üçgen yüzü var. */
  tri_pyramid:{
    label:"Üçgen Piramit", labelKu:"Pîrameda Sêgoşe", labelEn:"Triangular Pyramid",
    icon:"🔺",
    iconSvg:(c)=>(
      /* Tetrahedron — 3 kenar apex'ten tabana */
      <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill="none" stroke={c||"currentColor"} strokeWidth="1.5" strokeLinejoin="round">
        <path d="M 12 3 L 21 19 L 3 19 Z"/>
        <path d="M 12 3 L 12 19"/>
        <path d="M 3 19 L 12 15 L 21 19" strokeDasharray="2,1.5"/>
      </svg>
    ),
    faces:4, edges:6, vertices:4,
    iso:(cx,cy,s,yaw)=>{
      const u=s*0.55;
      const yawVal=yaw===undefined?-45:yaw;
      const proj=(x,y,z)=>{
        const p=project3D(x,y,z,yawVal);
        return [cx+p.x*u, cy+p.y*u];
      };
      /* Düzgün tetrahedron: 4 eşit üçgen yüzü.
         Taban eşkenar üçgen: köşeler (y=-0.3 düzleminde).
         r=0.5 çember yarıçapı; 3 köşe 120° aralık.
         Apex: taban merkezinin üzerinde, yükseklik 0.8 */
      const rR=0.5;
      const tA=proj( rR*Math.cos(-Math.PI/2), -0.3, rR*Math.sin(-Math.PI/2)); // ön
      const tB=proj( rR*Math.cos(Math.PI/6),  -0.3, rR*Math.sin(Math.PI/6));  // sağ-arka
      const tC=proj( rR*Math.cos(5*Math.PI/6),-0.3, rR*Math.sin(5*Math.PI/6));// sol-arka
      const AP=proj(0, 0.8, 0);
      const verts3D={
        tA:[ rR*Math.cos(-Math.PI/2), -0.3, rR*Math.sin(-Math.PI/2)],
        tB:[ rR*Math.cos(Math.PI/6),  -0.3, rR*Math.sin(Math.PI/6)],
        tC:[ rR*Math.cos(5*Math.PI/6),-0.3, rR*Math.sin(5*Math.PI/6)],
        AP:[0, 0.8, 0],
      };
      const yawRad=yawVal*Math.PI/180;
      const depth=(x,y,z)=>x*Math.sin(yawRad)+z*Math.cos(yawRad);
      const faceMidDepth=names=>{
        const avg=[0,0,0];
        names.forEach(n=>{avg[0]+=verts3D[n][0];avg[1]+=verts3D[n][1];avg[2]+=verts3D[n][2];});
        return depth(avg[0]/names.length, avg[1]/names.length, avg[2]/names.length);
      };
      const faces=[
        {name:"base",  verts:["tA","tC","tB"]},     // taban
        {name:"front", verts:["tA","tB","AP"]},
        {name:"right", verts:["tB","tC","AP"]},
        {name:"left",  verts:["tC","tA","AP"]},
      ];
      faces.sort((a,b)=>faceMidDepth(b.verts)-faceMidDepth(a.verts));
      const result={};
      faces.forEach(f=>{
        result[f.name]=f.verts.map(n=>{
          const [x,y,z]=verts3D[n];
          return proj(x,y,z);
        });
      });
      return result;
    },
    net:(cx,cy,s)=>{
      /* Düzgün tetrahedron açınımı: merkezde bir eşkenar üçgen,
         3 kenarına yapışık birer eşkenar üçgen daha. */
      const u=s*0.38;
      const h=u*Math.sqrt(3)/2; // eşkenar üçgen yüksekliği
      /* Merkez üçgen köşeleri */
      const m1=[cx, cy-h*2/3];     // üst
      const m2=[cx+u/2, cy+h/3];   // sağ alt
      const m3=[cx-u/2, cy+h/3];   // sol alt
      /* m1-m2 kenarına yapışan dış üçgen: m1 ve m2 + aynadaki 3. köşe */
      /* m1-m2 orta noktası: ((cx+cx+u/2)/2, (cy-h*2/3+cy+h/3)/2) = (cx+u/4, cy-h/6) */
      /* Normal yön (dışa doğru) — kenarın merkez üçgen merkezine uzağı yönünde */
      const ext=(p1,p2,cm)=>{
        const mx=(p1[0]+p2[0])/2, my=(p1[1]+p2[1])/2;
        const dx=mx-cm[0], dy=my-cm[1];
        const len=Math.hypot(dx,dy)||1;
        /* kenar uzunluğu u, yükseklik h. Dış apex = orta nokta + normal*h */
        return [mx+dx/len*h, my+dy/len*h];
      };
      const cm=[cx,cy]; // merkez
      const e1=ext(m1,m2,cm); // m1-m2 dış apex
      const e2=ext(m2,m3,cm); // m2-m3 dış apex
      const e3=ext(m3,m1,cm); // m3-m1 dış apex
      return [
        {name:"base",  pts:[m1,m2,m3]},
        {name:"front", pts:[m1,m2,e1]},
        {name:"right", pts:[m2,m3,e2]},
        {name:"left",  pts:[m3,m1,e3]},
      ];
    },
  },
  /* ═══ ALTIGEN PRİZMA ═══
     İki altıgen taban + 6 dikdörtgen yan yüz. */
  hex_prism:{
    label:"Altıgen Prizma", labelKu:"Prîzma Şeşgoşe", labelEn:"Hexagonal Prism",
    icon:"⬢",
    iconSvg:(c)=>(
      /* Altıgen prizma — üstte altıgen, yan dikey çizgiler, altta altıgen yay */
      <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill="none" stroke={c||"currentColor"} strokeWidth="1.5" strokeLinejoin="round">
        {/* Üst altıgen */}
        <path d="M 6 5 L 12 3 L 18 5 L 18 9 L 12 11 L 6 9 Z"/>
        {/* Yan dikey çizgiler */}
        <line x1="6" y1="9" x2="6" y2="17"/>
        <line x1="12" y1="11" x2="12" y2="19"/>
        <line x1="18" y1="9" x2="18" y2="17"/>
        {/* Alt altıgenin görünen kısmı */}
        <path d="M 6 17 L 12 19 L 18 17"/>
      </svg>
    ),
    faces:8, edges:18, vertices:12,
    iso:(cx,cy,s,yaw)=>{
      const u=s*0.4;
      const yawVal=yaw===undefined?-45:yaw;
      const proj=(x,y,z)=>{
        const p=project3D(x,y,z,yawVal);
        return [cx+p.x*u, cy+p.y*u];
      };
      /* Düzgün altıgen: 6 köşe, yarıçap 0.5. Üst ve alt, yükseklik ±0.4 */
      const r=0.5;
      const verts3D={};
      for(let i=0;i<6;i++){
        const a=i*Math.PI/3;
        verts3D[`top${i}`]=[r*Math.cos(a), 0.4, r*Math.sin(a)];
        verts3D[`bot${i}`]=[r*Math.cos(a),-0.4, r*Math.sin(a)];
      }
      const yawRad=yawVal*Math.PI/180;
      const depth=(x,y,z)=>x*Math.sin(yawRad)+z*Math.cos(yawRad);
      const faceMidDepth=names=>{
        const avg=[0,0,0];
        names.forEach(n=>{avg[0]+=verts3D[n][0];avg[1]+=verts3D[n][1];avg[2]+=verts3D[n][2];});
        return depth(avg[0]/names.length, avg[1]/names.length, avg[2]/names.length);
      };
      /* Yüzler: üst altıgen, alt altıgen, 6 yan dikdörtgen */
      const topVerts=[0,1,2,3,4,5].map(i=>`top${i}`);
      const botVerts=[5,4,3,2,1,0].map(i=>`bot${i}`); // ters yön
      const faces=[
        {name:"top",    verts:topVerts},
        {name:"bottom", verts:botVerts},
      ];
      /* Yan yüzler */
      for(let i=0;i<6;i++){
        const ni=(i+1)%6;
        faces.push({name:`side${i}`, verts:[`top${i}`,`top${ni}`,`bot${ni}`,`bot${i}`]});
      }
      faces.sort((a,b)=>faceMidDepth(b.verts)-faceMidDepth(a.verts));
      const result={};
      faces.forEach(f=>{
        result[f.name]=f.verts.map(n=>{
          const [x,y,z]=verts3D[n];
          return proj(x,y,z);
        });
      });
      return result;
    },
    net:(cx,cy,s)=>{
      const u=s*0.22;
      /* 6 dikdörtgen yan yana, yukarıda ve aşağıda birer altıgen.
         Altıgen kenarı u, dikdörtgen genişliği u, yüksekliği h (prizma yüksekliği) = 0.8 */
      const rectH=u*1.6; // yan dikdörtgen yüksekliği
      /* Merkez altıgeni çiz — rectH yüksekliği ile hizalı */
      const startX=cx-3*u;
      const cY=cy-rectH/2;
      const faces=[];
      /* 6 yan dikdörtgen yan yana */
      for(let i=0;i<6;i++){
        faces.push({
          name:`side${i}`,
          pts:[
            [startX+i*u, cY],
            [startX+(i+1)*u, cY],
            [startX+(i+1)*u, cY+rectH],
            [startX+i*u, cY+rectH],
          ]
        });
      }
      /* Üst altıgen — ilk dikdörtgenin üst kenarına yapışık */
      const hx=startX+u/2; // altıgen merkez x
      const hy=cY-u*Math.sqrt(3)/2; // altıgen merkez y
      const hexPts=(mx,my,r)=>{
        const pts=[];
        for(let i=0;i<6;i++){
          const a=-Math.PI/2+i*Math.PI/3;
          pts.push([mx+r*Math.cos(a), my+r*Math.sin(a)]);
        }
        return pts;
      };
      faces.push({name:"top", pts:hexPts(hx+u, hy, u*0.9)});
      /* Alt altıgen */
      faces.push({name:"bottom", pts:hexPts(hx+u, cY+rectH+u*Math.sqrt(3)/2, u*0.9)});
      return faces;
    },
  },
  /* ═══ SİLİNDİR ═══
     Eğri yüzey — SVG'de ellips + dikdörtgen. Açınım: dikdörtgen + 2 daire. */
  cylinder:{
    label:"Silindir", labelKu:"Silinder", labelEn:"Cylinder",
    icon:"🥫",
    iconSvg:(c)=>(
      /* Silindir — üst ellips, iki yan çizgi, alt ellips */
      <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill="none" stroke={c||"currentColor"} strokeWidth="1.5">
        <ellipse cx="12" cy="5" rx="7" ry="2.5"/>
        <line x1="5" y1="5" x2="5" y2="19"/>
        <line x1="19" y1="5" x2="19" y2="19"/>
        <path d="M 5 19 A 7 2.5 0 0 0 19 19"/>
        <path d="M 5 19 A 7 2.5 0 0 1 19 19" strokeDasharray="2,1.5"/>
      </svg>
    ),
    faces:3, edges:2, vertices:0, // matematik: 3 yüz (2 daire + 1 eğri), 2 çembersel kenar, 0 köşe
    curved:true, // render için özel durum
    iso:(cx,cy,s,yaw)=>{
      /* Silindir: yarıçap 0.5, yükseklik 1 (y=-0.5 ile +0.5 arası).
         Yaw ile y-ekseninde dönmesi silindiri etkilemez (simetrik). */
      const u=s*0.45;
      const yawVal=yaw===undefined?-45:yaw;
      /* İki çember (üst ve alt) — ellips olarak çizilir (tilt nedeniyle) */
      /* Tilt 30° → çemberin x yarıçapı = 0.5u, y yarıçapı = 0.5u * sin(30°) = 0.25u */
      const rx=0.5*u;
      const ry=0.25*u; // tilt'den kaynaklanan sıkışma
      /* Üst çember merkezi: (0, +0.5) — tilt sonrası y ekseninde düşer */
      const topProj=project3D(0, 0.5, 0, yawVal);
      const botProj=project3D(0,-0.5, 0, yawVal);
      const topY=cy+topProj.y*u;
      const botY=cy+botProj.y*u;
      return {
        isCurved:true,
        topCenter:[cx, topY],
        botCenter:[cx, botY],
        rx, ry,
        /* Yan yüzey: iki dikey çizgi + alt ve üst ellips */
      };
    },
    net:(cx,cy,s)=>{
      const u=s*0.35;
      /* Açınım: dikdörtgen (yan yüzey açılmış) + 2 daire (üst ve alt).
         Dikdörtgen genişliği = 2πr ≈ 3.14u, yüksekliği = 1u */
      const w=Math.PI*u; // çevre
      const h=u; // silindir yüksekliği
      const x0=cx-w/2;
      const y0=cy-h/2;
      return [
        {name:"side",  pts:[[x0,y0],[x0+w,y0],[x0+w,y0+h],[x0,y0+h]], isRect:true},
        {name:"top",   pts:[[x0+w/2,y0-u*0.55],[x0+w/2-u*0.5,y0-u*0.55],[x0+w/2+u*0.5,y0-u*0.55]], isCircle:true, cx:x0+w/2, cy:y0-u*0.5, r:u*0.5},
        {name:"bottom",pts:[[x0+w/2,y0+h+u*0.55],[x0+w/2-u*0.5,y0+h+u*0.55],[x0+w/2+u*0.5,y0+h+u*0.55]], isCircle:true, cx:x0+w/2, cy:y0+h+u*0.5, r:u*0.5},
      ];
    },
  },
  /* ═══ KONİ ═══
     Eğri yüzey. 2 yüz (1 daire taban + 1 eğri yan), 1 çembersel kenar, 1 köşe (apex). */
  cone:{
    label:"Koni", labelKu:"Konî", labelEn:"Cone",
    icon:"🍦",
    iconSvg:(c)=>(
      /* Koni — apex + ellips taban + yan çizgiler */
      <svg viewBox="0 0 24 24" width="1em" height="1em" style={{display:"block"}} fill="none" stroke={c||"currentColor"} strokeWidth="1.5" strokeLinejoin="round">
        <line x1="12" y1="3" x2="5" y2="19"/>
        <line x1="12" y1="3" x2="19" y2="19"/>
        <path d="M 5 19 A 7 2.5 0 0 0 19 19"/>
        <path d="M 5 19 A 7 2.5 0 0 1 19 19" strokeDasharray="2,1.5"/>
      </svg>
    ),
    faces:2, edges:1, vertices:1,
    curved:true,
    iso:(cx,cy,s,yaw)=>{
      const u=s*0.45;
      const yawVal=yaw===undefined?-45:yaw;
      const rx=0.5*u, ry=0.25*u;
      /* Taban merkezi y=-0.4, apex y=+0.6 */
      const botProj=project3D(0,-0.4, 0, yawVal);
      const apexProj=project3D(0, 0.6, 0, yawVal);
      const botY=cy+botProj.y*u;
      const apexY=cy+apexProj.y*u;
      return {
        isCurved:true,
        isCone:true,
        botCenter:[cx, botY],
        apex:[cx, apexY],
        rx, ry,
      };
    },
    net:(cx,cy,s)=>{
      /* Koni açınımı: daire (taban) + daire dilimi (yan yüzey).
         Slant height = sqrt(r² + h²) = sqrt(0.25 + 1) ≈ 1.118.
         Dilim yarıçapı = slant height, dilim yayı = taban çevresi = 2πr.
         Dilim açısı = 2π * r/slant = 2π * 0.5/1.118 ≈ 2.81 rad ≈ 161° */
      const u=s*0.35;
      const r=u*0.5;
      const slant=u*1.118;
      const theta=2*Math.PI*r/slant; // dilim açısı (radyan)
      /* Dilim merkezi: (cx, cy-u). Dilim -theta/2 ile +theta/2 arasında */
      const sliceCx=cx, sliceCy=cy-u*0.2;
      const p1=[sliceCx+slant*Math.sin(-theta/2), sliceCy+slant*Math.cos(-theta/2)];
      const p2=[sliceCx+slant*Math.sin( theta/2), sliceCy+slant*Math.cos( theta/2)];
      return [
        {name:"side", pts:[[sliceCx,sliceCy],p1,p2], isSlice:true,
         sliceCx, sliceCy, slant, theta},
        {name:"base", pts:[[cx,cy+slant+r*1.5],[cx-r,cy+slant+r*1.5],[cx+r,cy+slant+r*1.5]],
         isCircle:true, cx:cx, cy:cy+slant+r*0.5, r:r},
      ];
    },
  },
};
