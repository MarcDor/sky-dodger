import * as THREE from "three";

export const MAP_W = 2048;
export const MAP_H = 1024;

export interface StylePack {
  albedo: THREE.CanvasTexture;
  style: THREE.DataTexture;
  clouds: THREE.CanvasTexture;
  land: Float32Array;
  landCoverage: number;
}

interface Blob {
  u: number;
  v: number;
  rx: number;
  ry: number;
  k: number;
}

/**
 * Designed continents — not fbm mold. Positions are equirectangular
 * with v=0 at the north pole (canvas top). Soft ellipses + a tiny warp
 * so they read as toy-Earth, not a photo and not camouflage noise.
 */
const LAND: Blob[] = [
  { u: 0.35, v: 0.13, rx: 0.045, ry: 0.05, k: 1.15 },
  { u: 0.22, v: 0.3, rx: 0.13, ry: 0.11, k: 1.4 },
  { u: 0.155, v: 0.36, rx: 0.07, ry: 0.085, k: 1.2 },
  { u: 0.26, v: 0.4, rx: 0.055, ry: 0.06, k: 1.05 },
  { u: 0.285, v: 0.56, rx: 0.06, ry: 0.11, k: 1.3 },
  { u: 0.27, v: 0.7, rx: 0.04, ry: 0.09, k: 1.15 },
  { u: 0.5, v: 0.28, rx: 0.07, ry: 0.055, k: 1.15 },
  { u: 0.47, v: 0.255, rx: 0.028, ry: 0.024, k: 0.95 },
  { u: 0.52, v: 0.48, rx: 0.095, ry: 0.13, k: 1.35 },
  { u: 0.545, v: 0.62, rx: 0.05, ry: 0.085, k: 1.15 },
  { u: 0.585, v: 0.64, rx: 0.02, ry: 0.04, k: 1.0 },
  { u: 0.66, v: 0.3, rx: 0.16, ry: 0.11, k: 1.35 },
  { u: 0.76, v: 0.32, rx: 0.09, ry: 0.085, k: 1.2 },
  { u: 0.7, v: 0.42, rx: 0.07, ry: 0.075, k: 1.15 },
  { u: 0.78, v: 0.5, rx: 0.065, ry: 0.05, k: 1.05 },
  { u: 0.84, v: 0.36, rx: 0.03, ry: 0.038, k: 0.95 },
  { u: 0.82, v: 0.67, rx: 0.07, ry: 0.048, k: 1.2 },
  { u: 0.9, v: 0.75, rx: 0.028, ry: 0.028, k: 0.9 },
  { u: 0.5, v: 0.935, rx: 0.48, ry: 0.07, k: 1.25 },
];

const LAKES: Blob[] = [
  { u: 0.23, v: 0.3, rx: 0.02, ry: 0.012, k: 0.85 },
  { u: 0.54, v: 0.5, rx: 0.012, ry: 0.01, k: 0.7 },
];

const CLOUD_PUFFS: { u: number; v: number; rx: number; ry: number }[] = [
  { u: 0.18, v: 0.38, rx: 0.07, ry: 0.03 },
  { u: 0.32, v: 0.44, rx: 0.05, ry: 0.022 },
  { u: 0.48, v: 0.36, rx: 0.06, ry: 0.025 },
  { u: 0.62, v: 0.42, rx: 0.08, ry: 0.03 },
  { u: 0.74, v: 0.5, rx: 0.045, ry: 0.02 },
  { u: 0.88, v: 0.4, rx: 0.055, ry: 0.024 },
  { u: 0.4, v: 0.58, rx: 0.04, ry: 0.018 },
  { u: 0.12, v: 0.52, rx: 0.05, ry: 0.02 },
  { u: 0.55, v: 0.24, rx: 0.035, ry: 0.016 },
];

function wrap(u: number): number {
  return u - Math.floor(u);
}

function blobField(u: number, v: number, blobs: Blob[]): number {
  let s = 0;
  for (const b of blobs) {
    let du = u - b.u;
    du -= Math.round(du);
    const dv = v - b.v;
    const e = (du * du) / (b.rx * b.rx) + (dv * dv) / (b.ry * b.ry);
    s += b.k * Math.exp(-e * 2.15);
  }
  return s;
}

function fieldAt(u: number, v: number): number {
  const wu = u + 0.01 * Math.sin(v * 16.0 + 0.7);
  const wv = v + 0.007 * Math.sin(u * 14.0 + 1.1);
  return blobField(wu, wv, LAND) - blobField(wu, wv, LAKES);
}

function hash(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function mix(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smooth01(e0: number, e1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

function rgb(hex: number): [number, number, number] {
  return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
}

/** Land fraction of a designed globe. Used by tests so we do not need a DOM canvas. */
export function measureLandCoverage(w = 256, h = 128): number {
  let landPixels = 0;
  for (let y = 0; y < h; y += 1) {
    const v = (y + 0.5) / h;
    for (let x = 0; x < w; x += 1) {
      const u = (x + 0.5) / w;
      if (smooth01(0.32, 0.46, fieldAt(u, v)) > 0.5) landPixels += 1;
    }
  }
  return landPixels / (w * h);
}

export function buildStylePack(): StylePack {
  const w = MAP_W;
  const h = MAP_H;
  const land = new Float32Array(w * h);
  const styleData = new Uint8Array(w * h * 4);
  const albedo = document.createElement("canvas");
  albedo.width = w;
  albedo.height = h;
  const ctx = albedo.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2d canvas fehlt");
  const img = ctx.createImageData(w, h);
  const px = img.data;

  const oceanDeep = rgb(0x0a6f78);
  const ocean = rgb(0x14c4b6);
  const oceanLite = rgb(0x7ee8d8);
  const landCol = rgb(0x4db85a);
  const landHi = rgb(0x73d46a);
  const landLip = rgb(0x1f5c38);
  const ice = rgb(0xe8f6f8);
  const tree = rgb(0x1f7a3a);

  let landPixels = 0;
  for (let y = 0; y < h; y += 1) {
    const v = (y + 0.5) / h;
    for (let x = 0; x < w; x += 1) {
      const u = (x + 0.5) / w;
      const f = fieldAt(u, v);
      const mask = smooth01(0.32, 0.46, f);
      const inland = smooth01(0.4, 0.9, f);
      land[y * w + x] = mask;
      if (mask > 0.5) landPixels += 1;

      const i = (y * w + x) * 4;
      styleData[i] = Math.round(mask * 255);
      styleData[i + 1] = Math.round(inland * 255);
      styleData[i + 2] = 0;
      styleData[i + 3] = 255;

      const polarN = smooth01(0.14, 0.07, v);
      const polarS = smooth01(0.86, 0.93, v);
      const iceAmt = Math.max(polarN, polarS) * Math.max(mask, polarS * 0.85);

      const deep = 1 - smooth01(0.0, 0.38, f);
      let r = mix(mix(ocean[0], oceanDeep[0], deep * 0.75), oceanLite[0], (1 - deep) * 0.25);
      let g = mix(mix(ocean[1], oceanDeep[1], deep * 0.75), oceanLite[1], (1 - deep) * 0.25);
      let b = mix(mix(ocean[2], oceanDeep[2], deep * 0.75), oceanLite[2], (1 - deep) * 0.2);

      const coast = mask * (1 - inland);
      const grass = mix(landCol[0], landHi[0], inland * 0.55 + hash(x, y) * 0.15);
      const grassG = mix(landCol[1], landHi[1], inland * 0.45);
      const grassB = mix(landCol[2], landHi[2], inland * 0.25);
      r = mix(r, mix(landLip[0], grass, inland), mask);
      g = mix(g, mix(landLip[1], grassG, inland), mask);
      b = mix(b, mix(landLip[2], grassB, inland), mask);
      r = mix(r, landLip[0], coast * 0.65);
      g = mix(g, landLip[1], coast * 0.65);
      b = mix(b, landLip[2], coast * 0.65);

      if (inland > 0.62 && hash(x * 0.37, y * 0.41) > 0.82 && v > 0.16 && v < 0.78) {
        r = mix(r, tree[0], 0.85);
        g = mix(g, tree[1], 0.85);
        b = mix(b, tree[2], 0.85);
      }

      r = mix(r, ice[0], iceAmt);
      g = mix(g, ice[1], iceAmt);
      b = mix(b, ice[2], iceAmt);

      px[i] = r;
      px[i + 1] = g;
      px[i + 2] = b;
      px[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  const albedoTex = new THREE.CanvasTexture(albedo);
  albedoTex.colorSpace = THREE.SRGBColorSpace;
  albedoTex.wrapS = THREE.RepeatWrapping;
  albedoTex.wrapT = THREE.ClampToEdgeWrapping;
  albedoTex.anisotropy = 8;

  const style = new THREE.DataTexture(styleData, w, h, THREE.RGBAFormat);
  style.flipY = true;
  style.wrapS = THREE.RepeatWrapping;
  style.wrapT = THREE.ClampToEdgeWrapping;
  style.magFilter = THREE.LinearFilter;
  style.minFilter = THREE.LinearFilter;
  style.needsUpdate = true;
  style.colorSpace = THREE.NoColorSpace;

  const clouds = paintClouds(w, h);
  return {
    albedo: albedoTex,
    style,
    clouds,
    land,
    landCoverage: landPixels / (w * h),
  };
}

function paintClouds(w: number, h: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d canvas fehlt");
  ctx.clearRect(0, 0, w, h);
  for (const puff of CLOUD_PUFFS) {
    drawPuff(ctx, w, h, puff.u, puff.v, puff.rx, puff.ry);
    if (puff.u < 0.12) drawPuff(ctx, w, h, puff.u + 1, puff.v, puff.rx, puff.ry);
    if (puff.u > 0.88) drawPuff(ctx, w, h, puff.u - 1, puff.v, puff.rx, puff.ry);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

function drawPuff(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  u: number,
  v: number,
  rx: number,
  ry: number,
): void {
  const cx = u * w;
  const cy = v * h;
  const gx = rx * w;
  const gy = ry * h;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(gx, gy));
  g.addColorStop(0, "rgba(255,255,255,0.92)");
  g.addColorStop(0.45, "rgba(255,255,255,0.5)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.save();
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(cx, cy, gx, gy, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Three.js SphereGeometry UV (v=1 north) → unit position. */
export function uvToSphere(u: number, v: number): { x: number; y: number; z: number } {
  const phi = wrap(u) * Math.PI * 2;
  const theta = (1 - Math.min(1, Math.max(0, v))) * Math.PI;
  const st = Math.sin(theta);
  return {
    x: -Math.cos(phi) * st,
    y: Math.cos(theta),
    z: Math.sin(phi) * st,
  };
}

export function sampleLand(pack: StylePack, u: number, v: number): number {
  const x = Math.min(MAP_W - 1, Math.max(0, Math.round(wrap(u) * MAP_W)));
  const y = Math.min(MAP_H - 1, Math.max(0, Math.round((1 - Math.min(1, Math.max(0, v))) * (MAP_H - 1))));
  return pack.land[y * MAP_W + x];
}
