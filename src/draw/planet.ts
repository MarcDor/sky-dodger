import type { Crater } from "../sim/game";

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

export function paintPlanet(canvas: HTMLCanvasElement, r: number, craters: Crater[]): void {
  const pad = 8;
  const size = Math.max(64, Math.ceil(r * 2 + pad * 2));
  if (canvas.width !== size) {
    canvas.width = size;
    canvas.height = size;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, size, size);
  const c = size / 2;

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

  ctx.fillStyle = "rgba(27, 36, 55, 0.16)";
  ctx.beginPath();
  ctx.ellipse(c + r * 0.34, c + r * 0.04, r * 0.7, r * 0.88, 0, 0, Math.PI * 2);
  ctx.fill();

  for (const crater of craters) {
    const x = c + crater.x;
    const y = c + crater.y;
    ctx.beginPath();
    ctx.arc(x, y, crater.r + 4, 0, Math.PI * 2);
    ctx.fillStyle = "#1b2437";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, crater.r + 2, 0, Math.PI * 2);
    ctx.fillStyle = "#6a3a22";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, crater.r * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = crater.heat > 0.15 ? "#ff8a2a" : "#241814";
    ctx.fill();
  }
  ctx.restore();

  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.strokeStyle = "#1b2437";
  ctx.lineWidth = Math.max(8, r * 0.05);
  ctx.stroke();
}
