// SVG fare koordinatı dönüşümü — getScreenCTM().inverse() ile
// viewBox'a göre doğru mesafe ölçümü. Zoom/viewport ne olursa olsun tutarlı.
export function svgPointFromEvent(svg, clientX, clientY) {
  if (!svg) return { x: 0, y: 0 };
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const m = svg.getScreenCTM();
  if (!m) return { x: 0, y: 0 };
  const r = pt.matrixTransform(m.inverse());
  return { x: r.x, y: r.y };
}
