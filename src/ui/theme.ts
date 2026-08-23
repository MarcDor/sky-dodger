import type { StationType } from "../core";

export const COLORS = {
  bg: 0x060910,
  bgLift: 0x101826,
  floor: 0x0a1018,
  floorRing: 0x1a2433,
  floorPlate: 0x141c28,
  floorPlateHi: 0x1c2736,
  panel: 0x121a28,
  panelInset: 0x0b111a,
  panelEdge: 0x3a4658,
  text: 0xf4f1ea,
  textDim: 0x9aa3b5,
  brassHi: 0xe8c97a,
  brass: 0xc4a46a,
  brassMid: 0x8a6d3d,
  brassLo: 0x4a3820,
  slate: 0x7b8899,
  slateMid: 0x5d6b7d,
  slateLo: 0x3a4554,
  amber: 0xf0b429,
  amberHi: 0xffe29a,
  fail: 0xe85d4c,
  groove: 0x0c1018,
  tapeOn: 0xf3e1b0,
  tapeOnLo: 0xc4a86a,
  tapeOff: 0x232a36,
  workpiece: 0xe4ddd0,
  workpieceLo: 0xb8b0a2,
};

export const STATION_META: Record<
  StationType,
  { label: string; short: string }
> = {
  punch: { label: "Stanze", short: "P" },
  drill: { label: "Bohrer", short: "B" },
  rivet: { label: "Niete", short: "N" },
  stamp: { label: "Stempel", short: "S" },
};

export const FONT = "Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif";
export const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
