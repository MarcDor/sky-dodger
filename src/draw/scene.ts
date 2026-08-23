import { Graphics } from "pixi.js";
import type { Boom, Crater, Game, Shot, View } from "../sim/game";
import { C } from "../style";

/** Overlapping circles, clipped to the disc — poster Earth, not a texture. */
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
  g.circle(cx, cy, r + 22);
  g.fill({ color: C.atmo, alpha: 0.24 });
  g.ellipse(cx + 12, cy + 18, r * 0.92, r * 0.28);
  g.fill({ color: C.ink, alpha: 0.2 });
}

export function drawPlanetBody(g: Graphics, view: View, craters: Crater[]): void {
  g.clear();
  const { cx, cy, r } = view;
  g.circle(cx, cy, r);
  g.fill(C.ocean);

  for (const b of LAND) {
    g.circle(cx + b.x * r, cy + b.y * r, b.r * r + 5);
    g.fill(C.ink);
  }
  for (const b of LAND) {
    g.circle(cx + b.x * r, cy + b.y * r, b.r * r);
    g.fill(C.land);
  }

  g.ellipse(cx + r * 0.38, cy + r * 0.04, r * 0.78, r * 0.96);
  g.fill({ color: C.ink, alpha: 0.12 });

  for (const c of craters) {
    const x = cx + c.x;
    const y = cy + c.y;
    g.circle(x, y, c.r + 4);
    g.fill(C.ink);
    g.circle(x, y, c.r + 2);
    g.fill(C.craterRim);
    g.circle(x, y, c.r * 0.72);
    g.fill(c.heat > 0.15 ? C.craterHot : C.crater);
  }
}

export function drawVfx(g: Graphics, shots: Shot[], booms: Boom[]): void {
  g.clear();
  for (const s of shots) {
    g.moveTo(s.x0, s.y0);
    g.lineTo(s.x1, s.y1);
    g.stroke({ width: 8, color: C.laser, cap: "round" });
    g.moveTo(s.x0, s.y0);
    g.lineTo(s.x1, s.y1);
    g.stroke({ width: 3, color: C.laserCore, cap: "round" });
  }
  for (const b of booms) {
    const t = b.age / 0.28;
    const rad = 8 + t * 22;
    g.circle(b.x, b.y, rad);
    g.fill({ color: C.boom, alpha: 1 - t });
    g.circle(b.x, b.y, rad * 0.45);
    g.fill({ color: C.boomHot, alpha: 1 - t });
    g.circle(b.x, b.y, rad);
    g.stroke({ width: 4, color: C.ink, alpha: 1 - t });
  }
}

export function drawUfos(g: Graphics, game: Game, view: View, time: number): void {
  g.clear();
  for (const ufo of game.ufos) {
    const orbit = view.r * (1.52 + ufo.ring * 0.16);
    const x = view.cx + Math.cos(ufo.angle) * orbit;
    const y = view.cy + Math.sin(ufo.angle) * orbit + Math.sin(time * 3 + ufo.id) * 3;
    drawUfo(g, x, y);
  }
}

export function drawUfo(g: Graphics, x: number, y: number): void {
  g.ellipse(x + 2, y + 5, 22, 8);
  g.fill({ color: C.ink, alpha: 0.25 });
  g.ellipse(x, y, 24, 9);
  g.fill(C.ink);
  g.ellipse(x, y, 21, 7);
  g.fill(C.ufo);
  g.ellipse(x - 4, y - 1, 10, 4);
  g.fill(C.ufoShade);
  g.ellipse(x, y - 7, 11, 8);
  g.fill(C.ink);
  g.ellipse(x, y - 7, 9, 6.5);
  g.fill(C.dome);
  g.ellipse(x - 2, y - 9, 4, 2.5);
  g.fill(C.domeShade);
}
