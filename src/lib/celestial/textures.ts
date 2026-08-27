import * as THREE from "three";

function hash(ix: number, iy: number, seed: number): number {
  let n = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function noise2(x: number, y: number, seed: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const a = hash(x0, y0, seed);
  const b = hash(x0 + 1, y0, seed);
  const c = hash(x0, y0 + 1, seed);
  const d = hash(x0 + 1, y0 + 1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

function fbm(x: number, y: number, seed: number, octaves = 5): number {
  let v = 0;
  let a = 0.5;
  let f = 1;
  let s = 0;
  for (let i = 0; i < octaves; i++) {
    v += a * noise2(x * f, y * f, seed + i * 19);
    s += a;
    a *= 0.5;
    f *= 2;
  }
  return v / s;
}

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

type RGB = [number, number, number];

function lerpColor(a: RGB, b: RGB, t: number): RGB {
  return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
}

function paintCanvas(
  width: number,
  height: number,
  paint: (u: number, v: number, x: number, y: number) => RGB | [number, number, number, number],
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return canvas;
  const img = ctx.createImageData(width, height);
  const data = img.data;
  for (let y = 0; y < height; y++) {
    const v = y / (height - 1);
    for (let x = 0; x < width; x++) {
      const u = x / (width - 1);
      const c = paint(u, v, x, y);
      const i = (y * width + x) * 4;
      data[i] = c[0];
      data[i + 1] = c[1];
      data[i + 2] = c[2];
      data[i + 3] = c[3] ?? 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function toTexture(canvas: HTMLCanvasElement, srgb = true): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

function cratered(u: number, v: number, seed: number, base: RGB, high: RGB): RGB {
  const n = fbm(u * 8, v * 4, seed, 6);
  const crater = Math.pow(clamp01(1 - Math.abs(fbm(u * 14, v * 7, seed + 3, 3) - 0.55) * 8), 2);
  const t = clamp01(n * 0.75 + crater * 0.35);
  return lerpColor(base, high, t);
}

function banded(u: number, v: number, seed: number, colors: RGB[]): RGB {
  const swirl = fbm(u * 6, v * 10, seed, 4) * 0.08;
  const band = (v + swirl + fbm(u * 2, v * 18, seed + 2, 3) * 0.04) * colors.length;
  const i = Math.min(colors.length - 2, Math.max(0, Math.floor(band)));
  const t = band - i;
  return lerpColor(colors[i]!, colors[i + 1]!, t * t * (3 - 2 * t));
}

export function createPlanetTexture(name: string, size = 512): THREE.CanvasTexture {
  const w = size;
  const h = Math.floor(size / 2);
  const key = name.toLowerCase();

  const canvas = paintCanvas(w, h, (u, v) => {
    if (key === "mercury") return cratered(u, v, 11, [90, 82, 74], [168, 156, 142]);
    if (key === "venus") {
      const n = fbm(u * 5, v * 4, 21, 6);
      return lerpColor([168, 126, 72], [214, 186, 132], n);
    }
    if (key === "earth") {
      const n = fbm(u * 6, v * 3.2, 7, 6);
      const ice = v < 0.08 || v > 0.92 || (v < 0.14 && n > 0.55) || (v > 0.86 && n > 0.55);
      if (ice) return lerpColor([210, 224, 232], [244, 248, 252], n);
      if (n > 0.54) {
        const desert = fbm(u * 9, v * 5, 9, 4) > 0.62;
        return desert
          ? lerpColor([176, 150, 92], [140, 122, 72], n)
          : lerpColor([46, 102, 62], [92, 140, 78], n);
      }
      return lerpColor([18, 54, 96], [42, 108, 148], n);
    }
    if (key === "moon") return cratered(u, v, 33, [92, 92, 94], [188, 186, 180]);
    if (key === "mars") {
      const n = fbm(u * 7, v * 4, 44, 6);
      const cap = v < 0.07 || v > 0.93;
      if (cap) return [228, 232, 236];
      return lerpColor([128, 52, 32], [196, 110, 64], n);
    }
    if (key === "jupiter") {
      return banded(u, v, 55, [
        [168, 124, 82],
        [214, 178, 128],
        [156, 108, 74],
        [228, 204, 164],
        [176, 132, 90],
        [210, 168, 120],
      ]);
    }
    if (key === "saturn") {
      return banded(u, v, 66, [
        [196, 176, 128],
        [220, 204, 156],
        [186, 164, 116],
        [232, 218, 176],
      ]);
    }
    if (key === "uranus") {
      const n = fbm(u * 4, v * 3, 77, 4);
      return lerpColor([126, 196, 198], [168, 220, 214], n);
    }
    if (key === "neptune") {
      const n = fbm(u * 5, v * 3, 88, 5);
      return lerpColor([32, 72, 148], [72, 126, 196], n);
    }
    return cratered(u, v, 1, [80, 80, 80], [160, 160, 160]);
  });

  return toTexture(canvas);
}

export function createSunTexture(size = 512): THREE.CanvasTexture {
  const canvas = paintCanvas(size, Math.floor(size / 2), (u, v) => {
    const n = fbm(u * 8, v * 5, 99, 6);
    const gran = fbm(u * 22, v * 14, 101, 3);
    const t = clamp01(n * 0.7 + gran * 0.3);
    return lerpColor([232, 140, 48], [255, 228, 168], t);
  });
  return toTexture(canvas);
}

export function createRingTexture(size = 512): THREE.CanvasTexture {
  const canvas = paintCanvas(size, 64, (u) => {
    const r = Math.abs(u - 0.5) * 2;
    const gap = Math.abs(r - 0.42) < 0.03 || Math.abs(r - 0.7) < 0.015;
    const bands = 0.35 + 0.65 * Math.abs(Math.sin(u * Math.PI * 48));
    const n = fbm(u * 40, 0.5, 12, 3);
    const a = gap ? 0 : clamp01(0.15 + bands * 0.75 * n) * 255;
    const col = lerpColor([210, 196, 160], [168, 154, 122], n);
    return [col[0], col[1], col[2], a];
  });
  const texture = toTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  return texture;
}

export function createSkyTexture(kind: "stars" | "milkyway", size = 1024): THREE.CanvasTexture {
  const w = size;
  const h = Math.floor(size / 2);
  const canvas = paintCanvas(w, h, (u, v) => {
    let r = 5;
    let g = 6;
    let b = 10;
    if (kind === "milkyway") {
      const band = Math.exp(-Math.pow((v - 0.48) * 5.2, 2));
      const neb = fbm(u * 3.5, v * 2.2, 4, 5);
      const dust = fbm(u * 8, v * 4, 8, 4);
      r += (18 + neb * 42) * band;
      g += (22 + neb * 48) * band;
      b += (28 + dust * 36) * band;
    }
    const star = hash(Math.floor(u * w), Math.floor(v * h), 17);
    if (star > 0.996) {
      const br = 180 + (star - 0.996) * 18000;
      r = Math.min(255, r + br);
      g = Math.min(255, g + br);
      b = Math.min(255, b + br * 0.92);
    }
    return [r, g, b];
  });
  const texture = toTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createGlowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
    g.addColorStop(0, "rgba(255, 236, 190, 1)");
    g.addColorStop(0.25, "rgba(255, 180, 80, 0.55)");
    g.addColorStop(0.6, "rgba(232, 120, 40, 0.12)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
