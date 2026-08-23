import { FillGradient, Graphics } from "pixi.js";
import { COLORS } from "./theme";

let brassDisk: FillGradient | null = null;
let floorSpot: FillGradient | null = null;
let wellShade: FillGradient | null = null;

function brassDiskFill(): FillGradient {
  if (!brassDisk) {
    brassDisk = new FillGradient({
      type: "radial",
      center: { x: 0.32, y: 0.28 },
      innerRadius: 0,
      outerCenter: { x: 0.5, y: 0.55 },
      outerRadius: 0.72,
      colorStops: [
        { offset: 0, color: COLORS.brassHi },
        { offset: 0.4, color: COLORS.brass },
        { offset: 1, color: COLORS.brassLo },
      ],
      textureSpace: "local",
    });
  }
  return brassDisk;
}

function floorSpotFill(): FillGradient {
  if (!floorSpot) {
    floorSpot = new FillGradient({
      type: "radial",
      center: { x: 0.5, y: 0.42 },
      innerRadius: 0,
      outerCenter: { x: 0.5, y: 0.5 },
      outerRadius: 0.6,
      colorStops: [
        { offset: 0, color: 0x1a2438 },
        { offset: 1, color: COLORS.bg },
      ],
      textureSpace: "local",
    });
  }
  return floorSpot;
}

function wellFill(): FillGradient {
  if (!wellShade) {
    wellShade = new FillGradient({
      type: "radial",
      center: { x: 0.45, y: 0.4 },
      innerRadius: 0,
      outerCenter: { x: 0.5, y: 0.5 },
      outerRadius: 0.55,
      colorStops: [
        { offset: 0, color: 0x243044 },
        { offset: 1, color: COLORS.groove },
      ],
      textureSpace: "local",
    });
  }
  return wellShade;
}

export function slotAngle(slot: number, S: number): number {
  return -Math.PI / 2 + (slot / S) * Math.PI * 2;
}

export function drawWorkshopFloor(
  g: Graphics,
  w: number,
  h: number,
  cx: number,
  cy: number,
  r: number,
  mood: number,
): void {
  g.rect(0, 0, w, h);
  g.fill(floorSpotFill());

  for (let i = 5; i >= 1; i -= 1) {
    g.circle(cx, cy, r + 48 + i * 42);
    g.stroke({ width: 1, color: COLORS.floorRing, alpha: 0.18 + i * 0.02 });
  }

  g.ellipse(cx, cy + r * 0.12, r * 2.15, r * 1.55);
  g.fill({ color: COLORS.bgLift, alpha: 0.55 });

  const spotX = cx - r * 0.35 + Math.cos(mood / 2400) * r * 0.08;
  const spotY = cy - r * 0.4 + Math.sin(mood / 2600) * r * 0.05;
  g.ellipse(spotX, spotY, r * 1.15, r * 0.55);
  g.fill({ color: COLORS.brassHi, alpha: 0.05 });

  g.ellipse(cx + 8, cy + 28, r + 100, r * 0.46);
  g.fill({ color: 0x000000, alpha: 0.45 });

  g.circle(cx, cy, r + 96);
  g.fill({ color: COLORS.brassLo, alpha: 0.55 });
  g.circle(cx, cy, r + 92);
  g.fill({ color: COLORS.floorPlate });
  g.circle(cx, cy, r + 88);
  g.fill({ color: COLORS.floorPlateHi });
  g.circle(cx, cy, r + 76);
  g.fill({ color: COLORS.floorPlate });
  g.circle(cx, cy, r + 74);
  g.stroke({ width: 3, color: COLORS.brassMid, alpha: 0.65 });
}

export function drawInstrument(g: Graphics, x: number, y: number, w: number, h: number): void {
  g.roundRect(x, y, w, h, 12);
  g.fill({ color: COLORS.brassLo });
  g.roundRect(x + 1.5, y + 1.5, w - 3, h - 3, 11);
  g.fill({ color: COLORS.panel });
  g.roundRect(x + 8, y + 3, w - 16, 2, 1);
  g.fill({ color: COLORS.brass, alpha: 0.4 });
  g.roundRect(x + 6, y + 10, w - 12, h - 16, 8);
  g.fill({ color: COLORS.panelInset, alpha: 0.5 });
}

export function drawGauge(g: Graphics, x: number, y: number, w: number, h: number): void {
  g.roundRect(x, y, w, h, 8);
  g.fill({ color: COLORS.panelInset });
  g.roundRect(x, y, w, h, 8);
  g.stroke({ width: 1, color: COLORS.brassMid, alpha: 0.7 });
  g.roundRect(x + 6, y + 3, w - 12, 1.5, 1);
  g.fill({ color: COLORS.brass, alpha: 0.28 });
}

export function drawMetalButton(
  g: Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
  lit: boolean,
): void {
  g.roundRect(x, y + 2, w, h, 8);
  g.fill({ color: 0x000000, alpha: 0.28 });
  g.roundRect(x, y, w, h, 8);
  g.fill({ color: lit ? COLORS.amber : COLORS.slateLo });
  if (!lit) {
    g.roundRect(x + 4, y + 3, w - 8, 3, 1);
    g.fill({ color: 0xffffff, alpha: 0.08 });
  } else {
    g.roundRect(x + 4, y + 3, w - 8, 4, 1);
    g.fill({ color: COLORS.amberHi, alpha: 0.35 });
  }
}

export function drawMachineRing(
  g: Graphics,
  cx: number,
  cy: number,
  r: number,
  S: number,
  tape: boolean[],
  t: number,
  mood: number,
  live: boolean,
): void {
  for (let i = 0; i < S; i += 1) {
    const a = slotAngle(i, S);
    g.moveTo(cx + Math.cos(a) * 30, cy + Math.sin(a) * 30);
    g.lineTo(cx + Math.cos(a) * (r + 68), cy + Math.sin(a) * (r + 68));
    g.stroke({ width: 1, color: COLORS.brassLo, alpha: 0.22 });
  }

  g.circle(cx, cy, r + 28);
  g.fill({ color: COLORS.brassLo });
  g.circle(cx, cy, r + 24);
  g.fill(brassDiskFill());
  g.circle(cx, cy, r - 8);
  g.fill({ color: COLORS.brassLo });
  g.circle(cx, cy, r - 16);
  g.fill({ color: COLORS.workpieceLo, alpha: 0.4 });
  g.circle(cx, cy, r - 38);
  g.fill(wellFill());
  g.circle(cx, cy, r - 40);
  g.stroke({ width: 2, color: COLORS.brassMid, alpha: 0.8 });

  const hx = cx - r * 0.18 + Math.cos(mood / 1800) * r * 0.06;
  const hy = cy - r * 0.22 + Math.sin(mood / 2000) * r * 0.04;
  g.ellipse(hx, hy, r * 0.7, r * 0.24);
  g.fill({ color: COLORS.brassHi, alpha: 0.2 });

  for (let i = 0; i < S; i += 1) {
    const a0 = slotAngle(i - 0.46, S);
    const a1 = slotAngle(i + 0.46, S);
    const mid = slotAngle(i, S);
    const on = tape[i];
    const inner = r - 6;
    const outer = on ? r + 16 : r + 10;
    g.moveTo(cx + Math.cos(a0) * inner, cy + Math.sin(a0) * inner);
    g.arc(cx, cy, inner, a0, a1, false);
    g.lineTo(cx + Math.cos(a1) * outer, cy + Math.sin(a1) * outer);
    g.arc(cx, cy, outer, a1, a0, true);
    g.closePath();
    g.fill({ color: on ? COLORS.tapeOn : COLORS.tapeOff, alpha: on ? 0.96 : 0.7 });
    if (on) {
      const hi = r + 13;
      g.moveTo(cx + Math.cos(a0) * (r + 6), cy + Math.sin(a0) * (r + 6));
      g.arc(cx, cy, r + 6, a0, a1, false);
      g.lineTo(cx + Math.cos(a1) * hi, cy + Math.sin(a1) * hi);
      g.arc(cx, cy, hi, a1, a0, true);
      g.closePath();
      g.fill({ color: COLORS.brassHi, alpha: 0.32 });
    }

    const bx = cx + Math.cos(mid) * (r + 22);
    const by = cy + Math.sin(mid) * (r + 22);
    g.circle(bx, by, 3.4);
    g.fill({ color: COLORS.brass });
    g.circle(bx, by, 1.6);
    g.fill({ color: COLORS.brassLo });

    const play = t % S === i && live;
    if (play) {
      const px = cx + Math.cos(mid) * (r + 3);
      const py = cy + Math.sin(mid) * (r + 3);
      g.circle(px, py, 6);
      g.fill({ color: COLORS.amber, alpha: 0.95 });
      g.circle(px, py, 2.5);
      g.fill({ color: COLORS.amberHi });
      g.moveTo(cx + Math.cos(mid) * (r + 24), cy + Math.sin(mid) * (r + 24));
      g.lineTo(cx + Math.cos(mid - 0.08) * (r + 34), cy + Math.sin(mid - 0.08) * (r + 34));
      g.lineTo(cx + Math.cos(mid + 0.08) * (r + 34), cy + Math.sin(mid + 0.08) * (r + 34));
      g.closePath();
      g.fill({ color: COLORS.amber, alpha: 0.9 });
    }
  }

  g.circle(cx, cy, 40);
  g.fill({ color: COLORS.brassLo });
  g.circle(cx, cy, 36);
  g.fill({ color: COLORS.brassMid });
  g.circle(cx, cy, 22);
  g.fill({ color: COLORS.groove });
  for (let j = 0; j < 3; j += 1) {
    const a = mood / 4000 + (j * Math.PI * 2) / 3;
    const jx = cx + Math.cos(a) * 14;
    const jy = cy + Math.sin(a) * 14;
    g.roundRect(jx - 6, jy - 5, 12, 10, 2);
    g.fill({ color: COLORS.brass });
  }
  g.circle(cx, cy, 8);
  g.fill({ color: COLORS.brassHi, alpha: 0.35 });
  g.ellipse(cx - 5, cy - 7, 11, 5);
  g.fill({ color: COLORS.brassHi, alpha: 0.28 });
}

export function drawEmptyMount(g: Graphics, x: number, y: number): void {
  g.circle(x, y, 9);
  g.fill({ color: COLORS.brassLo, alpha: 0.8 });
  g.circle(x, y, 6.5);
  g.fill({ color: COLORS.slateLo });
  g.circle(x, y, 2.4);
  g.fill({ color: COLORS.groove });
}

export function drawWorkpiecePlate(
  g: Graphics,
  x: number,
  y: number,
  holes: { size: number }[],
  rivets: number,
  stamped: boolean,
): void {
  g.roundRect(x - 17, y - 15, 38, 36, 6);
  g.fill({ color: 0x000000, alpha: 0.28 });
  g.roundRect(x - 20, y - 20, 40, 40, 7);
  g.fill({ color: COLORS.workpieceLo });
  g.roundRect(x - 18, y - 18, 36, 36, 6);
  g.fill({ color: COLORS.workpiece });
  g.roundRect(x - 18, y - 18, 36, 36, 6);
  g.stroke({ width: 1.6, color: COLORS.brassLo });
  g.ellipse(x - 5, y - 8, 12, 5);
  g.fill({ color: 0xffffff, alpha: 0.22 });

  holes.forEach((hole, i) => {
    const hx = x - 10 + i * 11;
    const hy = y + 4;
    const rad = 2.2 + hole.size;
    g.circle(hx, hy, rad + 1.4);
    g.fill({ color: COLORS.workpieceLo });
    g.circle(hx, hy, rad);
    g.fill({ color: COLORS.groove });
    g.ellipse(hx - 0.8, hy - 1, rad * 0.45, rad * 0.25);
    g.fill({ color: 0xffffff, alpha: 0.12 });
  });

  for (let i = 0; i < rivets; i += 1) {
    const rx = x - 4 + i * 9;
    g.circle(rx, y - 2, 3.4);
    g.fill({ color: COLORS.brass });
    g.circle(rx - 0.6, y - 3, 1.2);
    g.fill({ color: COLORS.brassHi, alpha: 0.7 });
  }

  if (stamped) {
    g.roundRect(x + 6, y - 12, 9, 9, 1);
    g.fill({ color: COLORS.amber });
    g.roundRect(x + 8, y - 10, 5, 5, 1);
    g.fill({ color: COLORS.amberHi, alpha: 0.6 });
  }
}

export function drawCamWave(
  g: Graphics,
  x0: number,
  y0: number,
  bw: number,
  S: number,
  tape: boolean[],
  playhead: number,
): void {
  const width = S * (bw + 4) - 4;
  g.roundRect(x0 - 8, y0 - 8, width + 16, 50, 8);
  g.fill({ color: COLORS.panelInset });
  g.roundRect(x0 - 8, y0 - 8, width + 16, 50, 8);
  g.stroke({ width: 1, color: COLORS.brassMid, alpha: 0.55 });

  for (let i = 0; i < S; i += 1) {
    const x = x0 + i * (bw + 4);
    const on = tape[i];
    const h = on ? 32 : 14;
    const y = y0 + (36 - h);
    g.roundRect(x, y + 2, bw, h, 3);
    g.fill({ color: 0x000000, alpha: 0.25 });
    g.roundRect(x, y, bw, h, 3);
    g.fill({ color: on ? COLORS.tapeOn : COLORS.tapeOff });
    if (on) {
      g.roundRect(x + 2, y + 2, bw - 4, 4, 1);
      g.fill({ color: COLORS.brassHi, alpha: 0.35 });
    }
    if (playhead === i) {
      g.roundRect(x - 2, y0 - 6, bw + 4, 44, 4);
      g.stroke({ width: 2, color: COLORS.amber });
      g.moveTo(x + bw / 2, y0 - 10);
      g.lineTo(x + bw / 2 - 5, y0 - 16);
      g.lineTo(x + bw / 2 + 5, y0 - 16);
      g.closePath();
      g.fill({ color: COLORS.amber });
    }
  }
}
