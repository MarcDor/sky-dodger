import { scoresFrom } from "./scoring";
import { applyStation, canApply } from "./stations";
import {
  cloneWorkpiece,
  type FireEvent,
  type Layout,
  type LevelDefinition,
  type RunState,
  type Station,
} from "./types";
import { matchesTarget } from "./workpiece";

export function assertLayout(level: LevelDefinition, layout: Layout): void {
  if (layout.tape.length !== level.S) {
    throw new Error(`Tape-Länge ${layout.tape.length} passt nicht zu S=${level.S}`);
  }
  for (const station of layout.stations) {
    if (station.position < 0 || station.position >= level.S) {
      throw new Error(`Station außerhalb des Rings: ${station.position}`);
    }
  }
}

export function stationAt(stations: Station[], position: number): Station | undefined {
  return stations.find((s) => s.position === position);
}

export function createRun(level: LevelDefinition, layout: Layout): RunState {
  assertLayout(level, layout);
  return {
    t: 0,
    S: level.S,
    tape: [...layout.tape],
    stations: layout.stations.map((s) => ({ ...s })),
    start: cloneWorkpiece(level.start),
    target: { ...level.target, holeSizes: level.target.holeSizes?.slice() },
    successStreakNeeded: level.successStreak,
    workpiece: null,
    workpieceAge: 0,
    consecutiveSuccesses: 0,
    solved: false,
    lastEvents: [],
    lastOutputMatched: null,
    scores: scoresFrom(layout, 0),
  };
}

export function step(state: RunState): RunState {
  if (state.solved) {
    return { ...state, lastEvents: [], lastOutputMatched: null };
  }

  const next: RunState = {
    ...state,
    tape: [...state.tape],
    stations: state.stations.map((s) => ({ ...s })),
    start: cloneWorkpiece(state.start),
    target: { ...state.target, holeSizes: state.target.holeSizes?.slice() },
    lastEvents: [],
    lastOutputMatched: null,
    workpiece: state.workpiece ? cloneWorkpiece(state.workpiece) : null,
  };

  if (!next.workpiece) {
    next.workpiece = cloneWorkpiece(next.start);
    next.workpieceAge = 0;
  }

  const position = next.workpieceAge;
  const pulse = next.tape[next.t % next.S] === true;
  const station = stationAt(next.stations, position);
  const events: FireEvent[] = [];

  if (station && pulse) {
    if (canApply(station.type, next.workpiece)) {
      next.workpiece = applyStation(station.type, next.workpiece);
      events.push({ position, type: station.type, outcome: "fired", t: next.t });
    } else {
      events.push({ position, type: station.type, outcome: "failed", t: next.t });
    }
  } else if (station) {
    events.push({ position, type: station.type, outcome: "idle", t: next.t });
  }

  next.lastEvents = events;
  next.workpieceAge += 1;

  if (next.workpieceAge >= next.S) {
    const matched = matchesTarget(next.workpiece, next.target);
    next.lastOutputMatched = matched;
    next.consecutiveSuccesses = matched ? next.consecutiveSuccesses + 1 : 0;
    next.workpiece = null;
    next.workpieceAge = 0;
    if (next.consecutiveSuccesses >= next.successStreakNeeded) {
      next.solved = true;
    }
  }

  next.t += 1;
  next.scores = {
    cycles: next.t,
    area: new Set(next.stations.map((s) => s.position)).size,
    tapeLength: next.S,
  };

  return next;
}

export function runBeats(state: RunState, beats: number): RunState {
  let current = state;
  for (let i = 0; i < beats && !current.solved; i += 1) {
    current = step(current);
  }
  return current;
}

export function runUntilSolved(state: RunState, maxBeats: number): RunState {
  return runBeats(state, maxBeats);
}
