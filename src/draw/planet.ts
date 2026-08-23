const LAND: { x: number; y: number; r: number }[] = [
  { x: -0.34, y: -0.16, r: 0.27 },
  { x: -0.18, y: 0.0, r: 0.16 },
  { x: -0.3, y: 0.26, r: 0.2 },
  { x: -0.24, y: 0.46, r: 0.13 },
  { x: 0.06, y: 0.02, r: 0.25 },
  { x: 0.16, y: 0.26, r: 0.17 },
  { x: 0.4, y: -0.18, r: 0.3 },
  { x: 0.56, y: -0.04, r: 0.15 },
  { x: 0.22, y: -0.34, r: 0.15 },
  { x: 0.5, y: 0.34, r: 0.12 },
  { x: -0.02, y: -0.54, r: 0.1 },
  { x: 0.72, y: 0.08, r: 0.07 },
];

export function paintIntact(ctx: CanvasRenderingContext2D, r: number, size: number): void {
  const c = size / 2;
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = "#3dcec5";
  ctx.fillRect(0, 0, size, size);
  for (const b of LAND) {
    ctx.beginPath();
    ctx.arc(c + b.x * r, c + b.y * r, b.r * r + 5, 0, Math.PI * 2);
    ctx.fillStyle = "#1b2437";
    ctx.fill();
  }
  for (const b of LAND) {
    ctx.beginPath();
    ctx.arc(c + b.x * r, c + b.y * r, b.r * r, 0, Math.PI * 2);
    ctx.fillStyle = "#8be05a";
    ctx.fill();
  }
  ctx.fillStyle = "rgba(27, 36, 55, 0.1)";
  ctx.beginPath();
  ctx.ellipse(c + r * 0.28, c + r * 0.08, r * 0.55, r * 0.7, 0.2, 0, Math.PI * 2);
  ctx.fill();
  cloud(ctx, c - r * 0.22, c - r * 0.38, r * 0.09);
  cloud(ctx, c + r * 0.32, c - r * 0.18, r * 0.07);
  ctx.restore();
  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.strokeStyle = "#1b2437";
  ctx.lineWidth = Math.max(8, r * 0.05);
  ctx.stroke();
}

function cloud(ctx: CanvasRenderingContext2D, x: number, y: number, r: number): void {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x + r * 0.9, y + r * 0.15, r * 0.75, 0, Math.PI * 2);
  ctx.arc(x - r * 0.7, y + r * 0.2, r * 0.62, 0, Math.PI * 2);
  ctx.fillStyle = "#1b2437";
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x, y, r * 0.78, 0, Math.PI * 2);
  ctx.arc(x + r * 0.82, y + r * 0.12, r * 0.58, 0, Math.PI * 2);
  ctx.arc(x - r * 0.62, y + r * 0.16, r * 0.48, 0, Math.PI * 2);
  ctx.fillStyle = "#f4f7ff";
  ctx.fill();
}

export interface ChunkStamp {
  canvas: HTMLCanvasElement;
  localX: number;
  localY: number;
  radius: number;
}

/** Persistent disc. Carve copies pixels, then punches a hole. That is the Worms trick. */
export class PlanetSurface {
  readonly canvas = document.createElement("canvas");
  private ctx: CanvasRenderingContext2D | null = null;
  radius = 0;

  rebuild(r: number): void {
    this.radius = r;
    const size = Math.max(64, Math.ceil(r * 2 + 16));
    this.canvas.width = size;
    this.canvas.height = size;
    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) return;
    paintIntact(this.ctx, r, size);
  }

  /** `x,y` are planet-local. Returns flying stamps (empty if the spot was already gone). */
  carve(x: number, y: number, radius: number): ChunkStamp[] {
    const ctx = this.ctx;
    if (!ctx || this.radius <= 0) return [];
    const c = this.canvas.width / 2;
    const px = c + x;
    const py = c + y;
    const holes = [
      { x: px, y: py, r: radius },
      { x: px + radius * 0.28, y: py - radius * 0.18, r: radius * 0.48 },
      { x: px - radius * 0.22, y: py + radius * 0.24, r: radius * 0.4 },
    ];
    const stamps: ChunkStamp[] = [];
    for (const h of holes) {
      const bit = extractChunk(this.canvas, h.x, h.y, h.r);
      if (!bit) continue;
      stamps.push({ canvas: bit, localX: h.x - c, localY: h.y - c, radius: h.r });
    }
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    for (const h of holes) {
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.strokeStyle = "#1b2437";
    ctx.lineWidth = 5;
    for (const h of holes) {
      ctx.beginPath();
      ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
    return stamps;
  }
}

function extractChunk(src: HTMLCanvasElement, cx: number, cy: number, r: number): HTMLCanvasElement | null {
  const s = Math.max(8, Math.ceil(r * 2 + 4));
  const out = document.createElement("canvas");
  out.width = s;
  out.height = s;
  const ctx = out.getContext("2d");
  if (!ctx) return null;
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, r, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(src, cx - r, cy - r, s, s, 0, 0, s, s);
  const data = ctx.getImageData(0, 0, s, s).data;
  let solid = 0;
  for (let i = 3; i < data.length; i += 16) {
    if (data[i] > 24) solid += 1;
  }
  if (solid < 6) return null;
  ctx.beginPath();
  ctx.arc(s / 2, s / 2, Math.max(2, r - 1.2), 0, Math.PI * 2);
  ctx.strokeStyle = "#1b2437";
  ctx.lineWidth = 3;
  ctx.stroke();
  return out;
}
