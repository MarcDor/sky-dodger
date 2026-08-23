import type { StationType } from "../core";

export const COLORS = {
  bg: 0x070b12,
  bgLift: 0x101826,
  panel: 0x121a28,
  panelEdge: 0x2a3548,
  text: 0xf4f1ea,
  textDim: 0x9aa3b5,
  brassHi: 0xe0c27a,
  brass: 0xc4a46a,
  brassMid: 0x8a6d3d,
  brassLo: 0x4a3820,
  slate: 0x5d6b7d,
  slateLo: 0x3a4554,
  amber: 0xf0b429,
  amberHi: 0xffe29a,
  fail: 0xe85d4c,
  groove: 0x0c1018,
  tapeOn: 0xf3e1b0,
  tapeOff: 0x2b3342,
  workpiece: 0xd9d3c7,
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
