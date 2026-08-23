import type { Layout, Scores } from "./types";

export function occupiedPositions(layout: Layout): number {
  const seen = new Set<number>();
  for (const station of layout.stations) seen.add(station.position);
  return seen.size;
}

export function scoresFrom(layout: Layout, cycles: number): Scores {
  return {
    cycles,
    area: occupiedPositions(layout),
    tapeLength: layout.tape.length,
  };
}

export function isBetterScore(next: Scores, prev: Scores | null): boolean {
  if (!prev) return true;
  if (next.cycles !== prev.cycles) return next.cycles < prev.cycles;
  if (next.area !== prev.area) return next.area < prev.area;
  return next.tapeLength < prev.tapeLength;
}
