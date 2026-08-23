import { createRun, runUntilSolved, type LevelDefinition } from "../../src/core";
import { layoutFromSequence, shortestOpSequence } from "../../src/core/planner";

export interface SolvabilityReport {
  id: string;
  solvable: boolean;
  minStations: number | null;
  minS: number | null;
  verified: boolean;
}

export function checkLevel(level: LevelDefinition): SolvabilityReport {
  const ops = shortestOpSequence(level);
  if (!ops) {
    return { id: level.id, solvable: false, minStations: null, minS: null, verified: false };
  }
  if (ops.length > level.S) {
    return {
      id: level.id,
      solvable: false,
      minStations: ops.length,
      minS: ops.length,
      verified: false,
    };
  }

  const layout = layoutFromSequence(level.S, ops);
  const maxBeats = level.successStreak * level.S + level.S;
  const result = runUntilSolved(createRun(level, layout), maxBeats);

  return {
    id: level.id,
    solvable: true,
    minStations: ops.length,
    minS: ops.length,
    verified: result.solved,
  };
}
