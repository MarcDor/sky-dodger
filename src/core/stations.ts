import type { StationType, Workpiece } from "./types";

export function canApply(type: StationType, wp: Workpiece): boolean {
  switch (type) {
    case "punch":
    case "stamp":
      return true;
    case "drill":
      return wp.holes.length >= 1;
    case "rivet":
      return wp.holes.length >= 2;
  }
}

export function applyStation(type: StationType, wp: Workpiece): Workpiece {
  if (!canApply(type, wp)) return wp;

  const next: Workpiece = {
    holes: wp.holes.map((h) => ({ size: h.size })),
    rivets: wp.rivets,
    stamped: wp.stamped,
  };

  switch (type) {
    case "punch":
      next.holes.push({ size: 1 });
      break;
    case "drill": {
      const last = next.holes[next.holes.length - 1];
      last.size += 1;
      break;
    }
    case "rivet":
      next.rivets += 1;
      break;
    case "stamp":
      next.stamped = true;
      break;
  }

  return next;
}
