export const STATION_TYPES = ["punch", "drill", "rivet", "stamp"] as const;

export type StationType = (typeof STATION_TYPES)[number];

export interface Hole {
  size: number;
}

export interface Workpiece {
  holes: Hole[];
  rivets: number;
  stamped: boolean;
}

export interface TargetShape {
  holes: number;
  rivets: number;
  stamped: boolean;
  holeSizes?: number[];
}

export interface Station {
  type: StationType;
  position: number;
}

export interface LevelDefinition {
  id: string;
  name: string;
  brief: string;
  S: number;
  start: Workpiece;
  target: TargetShape;
  availableStations: StationType[];
  successStreak: number;
}

export interface Layout {
  tape: boolean[];
  stations: Station[];
}

export function emptyLayout(S: number): Layout {
  return {
    tape: Array.from({ length: S }, () => false),
    stations: [],
  };
}

export type FireOutcome = "fired" | "failed" | "idle";

export interface FireEvent {
  position: number;
  type: StationType;
  outcome: FireOutcome;
  t: number;
}

export interface Scores {
  cycles: number;
  area: number;
  tapeLength: number;
}

export interface RunState {
  t: number;
  S: number;
  tape: boolean[];
  stations: Station[];
  start: Workpiece;
  target: TargetShape;
  successStreakNeeded: number;
  workpiece: Workpiece | null;
  workpieceAge: number;
  consecutiveSuccesses: number;
  solved: boolean;
  lastEvents: FireEvent[];
  lastOutputMatched: boolean | null;
  scores: Scores;
}

export function emptyWorkpiece(): Workpiece {
  return { holes: [], rivets: 0, stamped: false };
}

export function cloneWorkpiece(wp: Workpiece): Workpiece {
  return {
    holes: wp.holes.map((h) => ({ size: h.size })),
    rivets: wp.rivets,
    stamped: wp.stamped,
  };
}
