import { Graphics } from "pixi.js";
import type { StationType } from "../core";
import { COLORS } from "./theme";

export function drawStationGlyph(g: Graphics, type: StationType, color: number): void {
  switch (type) {
    case "punch":
      g.circle(0, 0, 9);
      g.stroke({ width: 3, color });
      g.circle(0, 0, 2.5);
      g.fill({ color });
      break;
    case "drill":
      g.moveTo(0, -10);
      g.lineTo(8, 10);
      g.lineTo(-8, 10);
      g.closePath();
      g.stroke({ width: 2.5, color });
      g.moveTo(0, -4);
      g.lineTo(0, 8);
      g.stroke({ width: 2, color });
      break;
    case "rivet":
      g.circle(-7, 0, 4);
      g.circle(7, 0, 4);
      g.stroke({ width: 2.4, color });
      g.moveTo(-3, 0);
      g.lineTo(3, 0);
      g.stroke({ width: 2.4, color });
      break;
    case "stamp":
      g.roundRect(-9, -9, 18, 18, 3);
      g.stroke({ width: 2.6, color });
      g.roundRect(-5, -5, 10, 10, 2);
      g.fill({ color, alpha: 0.85 });
      break;
  }
}

export function drawSparks(g: Graphics, seed: number): void {
  g.clear();
  const lines = [
    [10, -6, 22, -16],
    [-4, -12, -8, -24],
    [8, 8, 20, 14],
  ];
  for (const [x1, y1, x2, y2] of lines) {
    g.moveTo(x1, y1);
    g.lineTo(x2 + (seed % 3), y2);
    g.stroke({ width: 1.6, color: COLORS.amberHi, alpha: 0.9 });
  }
}
