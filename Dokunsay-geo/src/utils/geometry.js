// ══════════════════════════════════════════════════════════════
// 3B → 2B izometrik projeksiyon + SVG yardımcıları.
// project3D: y-ekseni rotasyonu (yaw) + x-ekseni tilt (30°).
// ══════════════════════════════════════════════════════════════
// İlkokul 3-4. sınıf müfredatı temel konusu.
// ══════════════════════════════════════════════════════════════
// 3B projeksiyon: y-ekseni rotasyonu (yaw) + sabit x-ekseni tilt.
//
// Standart izometrikte: yaw=45°, tilt=arctan(1/√2)≈35.26°.
// Klasik çizimlerde basitleştirilmiş: yaw=45°, tilt=30° (bizim eski formülümüz buydu).
// Önceki isoProject için: x'=(x-z)*cos30°, y'=(x+z)*sin30°-y
// Bunu yaw=45°+tilt=30° ile ifade etmek için:
//   - yaw 45° → x1 = (x-z)/√2, z1=(x+z)/√2  (eski x eksenini 45° döndürür)
//   - tilt 30° → y2 = y*cos30° - z1*sin30°
// Bu, ekran x = x1 = (x-z)/√2, ekran y = -(y2) olur.
// Ama eski formül (x-z)*0.866 = (x-z)*cos30° kullanıyordu.
// Yani eski formül aslında yaw=45°+tilt ile EŞDEĞER değil — daha "zorlanmış" bir izometrik.
// Yeni implementasyonda: eski formülü korumak için özel bir yol izleyeceğiz.
//
// Pragmatik yaklaşım: yaw=-45 varsayılan için ekranda yumuşak bir "standart izometrik" görünüm üretsin:
//   x1 = x*cos(yaw) - z*sin(yaw)
//   z1 = x*sin(yaw) + z*cos(yaw)
//   y2 = y*cos(tilt) - z1*sin(tilt)
export function project3D(x,y,z,yawDeg){
  const yaw=(yawDeg||0)*Math.PI/180;
  // y-ekseni rotasyonu
  const x1 = x*Math.cos(yaw) - z*Math.sin(yaw);
  const z1 = x*Math.sin(yaw) + z*Math.cos(yaw);
  const y1 = y;
  // x-ekseni tilt: 30° (klasik izometrik için standart)
  const tiltCos=Math.cos(Math.PI/6), tiltSin=Math.sin(Math.PI/6);
  const x2 = x1;
  const y2 = y1*tiltCos - z1*tiltSin;
  // SVG'de y aşağı olduğu için ters çevir
  return { x: x2, y: -y2 };
}

// Eski sabit izometrik — orijinal formülü koru (küp sonlarıyla uyumlu)
export function isoProject(x,y,z){
  return {
    x: (x-z)*0.866,
    y: (x+z)*0.5 - y,
  };
}

export function symmCount(type){
  return {circle:Infinity,disk:Infinity,square:4,rectangle:2,rhombus:2,eq_tri:3,iso_tri:1,kite:1,pentagon:5,hexagon:6,octagon:8}[type]||0;
}
export const toPoints=vs=>vs.map(([x,y])=>`${x},${y}`).join(" ");
