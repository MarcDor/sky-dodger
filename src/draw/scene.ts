import { Graphics } from "pixi.js";
import type { Boom, Game, Shot, View } from "../sim/game";
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
  const s = 1.45;
  g.ellipse(x + 3, y + 7, 22 * s, 8 * s);
  g.fill({ color: C.ink, alpha: 0.25 });
  g.ellipse(x, y, 24 * s, 9 * s);
  g.fill(C.ink);
  g.ellipse(x, y, 21 * s, 7 * s);
  g.fill(C.ufo);
  g.ellipse(x - 6, y - 1, 10 * s, 4 * s);
  g.fill(C.ufoShade);
  g.ellipse(x, y - 10 * s, 11 * s, 8 * s);
  g.fill(C.ink);
  g.ellipse(x, y - 10 * s, 9 * s, 6.5 * s);
  g.fill(C.dome);
  g.ellipse(x - 3, y - 13 * s, 4 * s, 2.5 * s);
  g.fill(C.domeShade);
}
