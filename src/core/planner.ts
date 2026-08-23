import { applyStation, canApply } from "./stations";
import {
  cloneWorkpiece,
  type Layout,
  type LevelDefinition,
  type Station,
  type StationType,
  type Workpiece,
} from "./types";
import { matchesTarget } from "./workpiece";

const MAX_PLAN_DEPTH = 8;

export function shortestOpSequence(level: LevelDefinition): StationType[] | null {
  const start = cloneWorkpiece(level.start);
  const queue: { wp: Workpiece; ops: StationType[] }[] = [{ wp: start, ops: [] }];
  const seen = new Set<string>([stateKey(start)]);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    if (matchesTarget(current.wp, level.target)) return current.ops;
    if (current.ops.length >= MAX_PLAN_DEPTH) continue;

    for (const type of level.availableStations) {
      if (!canApply(type, current.wp)) continue;
      const nextWp = applyStation(type, current.wp);
      const key = stateKey(nextWp);
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push({ wp: nextWp, ops: [...current.ops, type] });
    }
  }

  return null;
}

export function layoutFromSequence(S: number, ops: StationType[]): Layout {
  if (ops.length > S) {
    throw new Error(`Sequenz der Länge ${ops.length} passt nicht auf S=${S}`);
  }
  const tape = Array.from({ length: S }, () => false);
  const stations: Station[] = [];
  for (let i = 0; i < ops.length; i += 1) {
    tape[i] = true;
    stations.push({ type: ops[i], position: i });
  }
  return { tape, stations };
}

function stateKey(wp: Workpiece): string {
  return `${wp.holes.map((h) => h.size).join(",")}|${wp.rivets}|${wp.stamped ? 1 : 0}`;
}
