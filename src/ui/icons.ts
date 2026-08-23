import { Graphics } from "pixi.js";
import type { StationType } from "../core";
import { COLORS } from "./theme";

export interface StationLook {
  body: number;
  edge: number;
  fired: boolean;
  failed: boolean;
  muted: boolean;
}

export function drawStationMachine(g: Graphics, type: StationType, look: StationLook): void {
  const { body, edge, fired, failed, muted } = look;
  g.roundRect(-24, 22, 48, 12, 3);
  g.fill({ color: COLORS.brassLo });
  g.roundRect(-18, 24, 36, 6, 2);
  g.fill({ color: COLORS.brass });

  g.roundRect(-30, -26, 60, 50, 8);
  g.fill({ color: COLORS.brassLo });
  g.roundRect(-27, -28, 54, 48, 8);
  g.fill({ color: body });
  g.roundRect(-27, -28, 54, 48, 8);
  g.stroke({ width: failed ? 3 : 2, color: edge });

  if (!fired) {
    g.ellipse(-7, -14, 14, 6);
    g.fill({ color: 0xffffff, alpha: muted ? 0.04 : 0.12 });
  } else {
    g.ellipse(-4, -12, 12, 5);
    g.fill({ color: COLORS.amberHi, alpha: 0.35 });
  }

  const ink = fired ? COLORS.groove : COLORS.text;
  drawTool(g, type, ink, fired);
}

function drawTool(g: Graphics, type: StationType, ink: number, fired: boolean): void {
  switch (type) {
    case "punch":
      g.roundRect(-7, -16, 14, 10, 2);
      g.fill({ color: COLORS.brassMid });
      g.roundRect(-4, -8, 8, 18, 1);
      g.fill({ color: ink });
      g.circle(0, 12, fired ? 5 : 3.5);
      g.fill({ color: ink });
      break;
    case "drill":
      g.roundRect(-8, -14, 16, 8, 2);
      g.fill({ color: COLORS.brassMid });
      g.moveTo(0, -4);
      g.lineTo(6, 8);
      g.lineTo(0, 16);
      g.lineTo(-6, 8);
      g.closePath();
      g.fill({ color: ink });
      break;
    case "rivet":
      g.circle(-9, 2, 6);
      g.circle(9, 2, 6);
      g.stroke({ width: 2.4, color: ink });
      g.roundRect(-10, -2, 20, 4, 1);
      g.fill({ color: COLORS.brass });
      g.circle(-9, 2, 2);
      g.circle(9, 2, 2);
      g.fill({ color: ink });
      break;
    case "stamp":
      g.roundRect(-11, -8, 22, 16, 3);
      g.stroke({ width: 2.2, color: ink });
      g.roundRect(-7, -4, 14, 10, 2);
      g.fill({ color: ink, alpha: 0.85 });
      g.roundRect(-10, -16, 20, 6, 1);
      g.fill({ color: COLORS.brassMid });
      break;
  }
}

export function drawStationGlyph(g: Graphics, type: StationType, color: number): void {
  drawTool(g, type, color, false);
}

export function drawSparks(g: Graphics, seed: number): void {
  g.clear();
  const lines = [
    [10, 8, 22, 18],
    [-6, 10, -14, 22],
    [4, 14, 12, 26],
    [-12, 0, -22, 8],
  ];
  for (const [x1, y1, x2, y2] of lines) {
    g.moveTo(x1, y1);
    g.lineTo(x2 + (seed % 3), y2);
    g.stroke({ width: 1.6, color: COLORS.amberHi, alpha: 0.88 });
  }
}
