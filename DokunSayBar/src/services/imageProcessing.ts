/**
 * Image Processing Service
 * Lightweight pixel-level analysis for rod detection.
 * Runs in a Web Worker for performance.
 */

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s * 100, l * 100];
}

export interface DetectedRegion {
  x: number; y: number;
  width: number; height: number;
  pixelCount: number;
}

export function createRodMask(
  data: Uint8ClampedArray,
  width: number,
  height: number
): Uint8Array {
  const mask = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
    const [h, s, l] = rgbToHsl(r, g, b);
    // DokunSay rod colors: amber/yellow/brown (H: 25-55, S: 50-100%, L: 30-80%)
    if (h >= 25 && h <= 55 && s >= 50 && l >= 30 && l <= 80) {
      mask[i] = 1;
    }
  }
  return mask;
}

export function findConnectedComponents(
  mask: Uint8Array,
  width: number,
  height: number,
  minPixels = 200
): DetectedRegion[] {
  const visited = new Uint8Array(width * height);
  const regions: DetectedRegion[] = [];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      if (mask[idx] === 0 || visited[idx]) continue;

      // BFS flood fill
      let minX = x, maxX = x, minY = y, maxY = y, count = 0;
      const queue = [idx];
      visited[idx] = 1;

      while (queue.length > 0) {
        const ci = queue.pop()!;
        const cx = ci % width, cy = Math.floor(ci / width);
        count++;
        if (cx < minX) minX = cx;
        if (cx > maxX) maxX = cx;
        if (cy < minY) minY = cy;
        if (cy > maxY) maxY = cy;

        // 4-connected neighbors
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = cx + dx, ny = cy + dy;
          if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue;
          const ni = ny * width + nx;
          if (mask[ni] && !visited[ni]) {
            visited[ni] = 1;
            queue.push(ni);
          }
        }
      }

      if (count >= minPixels) {
        regions.push({
          x: minX, y: minY,
          width: maxX - minX + 1,
          height: maxY - minY + 1,
          pixelCount: count,
        });
      }
    }
  }

  return regions;
}

export function countDarkHoles(
  data: Uint8ClampedArray,
  fullWidth: number,
  region: DetectedRegion
): number {
  // Count distinct dark circular areas within the rod region
  // Dark = L < 20%
  const darkMask = new Uint8Array(region.width * region.height);
  for (let ry = 0; ry < region.height; ry++) {
    for (let rx = 0; rx < region.width; rx++) {
      const px = region.x + rx, py = region.y + ry;
      const i = (py * fullWidth + px) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const [, , l] = rgbToHsl(r, g, b);
      if (l < 20) darkMask[ry * region.width + rx] = 1;
    }
  }

  // Find connected dark regions
  const darkRegions = findConnectedComponents(darkMask, region.width, region.height, 15);

  // Filter by approximate circularity (aspect ratio close to 1)
  return darkRegions.filter((dr) => {
    const ratio = dr.width / Math.max(dr.height, 1);
    return ratio > 0.5 && ratio < 2.0;
  }).length;
}

export interface DetectedRod {
  x: number;
  y: number;
  width: number;
  height: number;
  holeCount: number;
  confidence: number;
}

export function detectRods(
  data: Uint8ClampedArray,
  width: number,
  height: number
): DetectedRod[] {
  const mask = createRodMask(data, width, height);
  const regions = findConnectedComponents(mask, width, height, 200);

  return regions
    .filter((r) => {
      const ratio = r.width / Math.max(r.height, 1);
      // Rods are rectangular: aspect ratio > 1.5 (horizontal) or < 0.66 (vertical)
      return (ratio > 1.5 || ratio < 0.66) && r.pixelCount > 300;
    })
    .map((r) => {
      const holeCount = countDarkHoles(data, width, r);
      const confidence = Math.min(holeCount > 0 ? 0.5 + holeCount * 0.05 : 0.3, 0.95);
      return {
        x: r.x, y: r.y,
        width: r.width, height: r.height,
        holeCount: Math.max(holeCount, 1),
        confidence,
      };
    })
    .filter((r) => r.holeCount >= 1 && r.holeCount <= 10);
}
