import { Graphics } from "pixi.js";
import { ufoPos, type Boom, type Chip, type Crack, type Game, type Shot, type View } from "../sim/game";
import { C } from "../style";

export function drawBackdrop(g: Graphics, w: number, h: number, stars: { x: number; y: number; s: number }[]): void {
  g.clear();
  g.rect(0, 0, w, h);
  g.fill(C.bg);
  for (const s of stars) {
    g.circle(s.x * w, s.y * h, s.s);
    g.fill(C.star);
  }
  g.circle(w * 0.12, h * 0.16, 18);
  g.fill(C.sun);
  g.circle(w * 0.12, h * 0.16, 18);
  g.stroke({ width: 6, color: C.ink, alignment: 0.5 });
}

export function drawPlanetHalo(g: Graphics, view: View): void {
  g.clear();
  const { cx, cy, r } = view;
  g.circle(cx, cy, r + 26);
  g.fill({ color: C.atmo, alpha: 0.28 });
  g.ellipse(cx + 8, cy + r + 14, r * 0.72, r * 0.16);
  g.fill({ color: C.ink, alpha: 0.18 });
}

export function drawVfx(g: Graphics, shots: Shot[], booms: Boom[], chips: Chip[], cracks: Crack[]): void {
  g.clear();
  for (const crack of cracks) {
    const fade = Math.min(1, crack.life * 5);
    for (const ray of crack.rays) {
      g.moveTo(crack.x, crack.y);
      g.lineTo(crack.x + Math.cos(ray.angle) * ray.len, crack.y + Math.sin(ray.angle) * ray.len);
      g.stroke({ width: 4, color: C.ink, cap: "round", alpha: fade });
    }
  }
  for (const s of shots) {
    const fade = Math.max(0.25, s.life / 0.16);
    g.moveTo(s.x0, s.y0);
    g.lineTo(s.x1, s.y1);
    g.stroke({ width: 14, color: C.laser, cap: "round", alpha: fade });
    g.moveTo(s.x0, s.y0);
    g.lineTo(s.x1, s.y1);
    g.stroke({ width: 5, color: C.laserCore, cap: "round", alpha: fade });
  }
  for (const b of booms) {
    const t = b.age / b.life;
    const rad = b.size * (0.45 + t * 1.35);
    g.circle(b.x, b.y, rad);
    g.fill({ color: C.boom, alpha: 0.85 * (1 - t) });
    g.circle(b.x, b.y, rad * 0.55);
    g.fill({ color: C.boomHot, alpha: 0.95 * (1 - t) });
    g.circle(b.x, b.y, rad);
    g.stroke({ width: 5, color: C.ink, alpha: 1 - t });
    g.circle(b.x, b.y, rad * (1.25 + t * 0.4));
    g.stroke({ width: 3, color: C.laser, alpha: 0.55 * (1 - t) });
  }
  drawChips(g, chips);
}

function drawChips(g: Graphics, chips: Chip[]): void {
  for (const chip of chips) {
    const fade = Math.min(1, chip.life * 3);
    const c = Math.cos(chip.rot);
    const s = Math.sin(chip.rot);
    const hx = 5 * c;
    const hy = 5 * s;
    const vx = -4 * s;
    const vy = 4 * c;
    g.moveTo(chip.x - hx - vx, chip.y - hy - vy);
    g.lineTo(chip.x + hx - vx, chip.y + hy - vy);
    g.lineTo(chip.x + hx + vx, chip.y + hy + vy);
    g.lineTo(chip.x - hx + vx, chip.y - hy + vy);
    g.lineTo(chip.x - hx - vx, chip.y - hy - vy);
    g.fill({ color: 0xc48a52, alpha: fade });
    g.stroke({ width: 2, color: C.ink, alpha: fade });
  }
}

export function drawUfos(g: Graphics, game: Game, view: View): void {
  g.clear();
  for (const ufo of game.ufos) {
    const p = ufoPos(ufo, view, game.time);
    drawUfo(g, p.x, p.y);
  }
}

export function drawUfo(g: Graphics, x: number, y: number): void {
  const s = 1.45;
  g.ellipse(x + 3, y + 7, 22 * s, 8 * s);
  g.fill({ color: C.ink, alpha: 0.25 });
  g.ellipse(x, y, 24 * s, 9 * s);
  g.fill(C.ink);
  g.ellipse(x, y, 21 * s, 7 * s);
  g.fill(C.ufo);
  g.ellipse(x - 6, y - 1, 10 * s, 4 * s);
  g.fill(C.ufoShade);
  for (let i = -1; i <= 1; i += 1) {
    g.circle(x + i * 12 * s, y + 1, 2.4);
    g.fill(C.dome);
  }
  g.ellipse(x, y - 10 * s, 11 * s, 8 * s);
  g.fill(C.ink);
  g.ellipse(x, y - 10 * s, 9 * s, 6.5 * s);
  g.fill(C.dome);
  g.ellipse(x - 3, y - 13 * s, 4 * s, 2.5 * s);
  g.fill(C.domeShade);
}
