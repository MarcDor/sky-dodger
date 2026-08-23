import { cloneWorkpiece, type TargetShape, type Workpiece } from "./types";

export function matchesTarget(wp: Workpiece, target: TargetShape): boolean {
  if (wp.holes.length !== target.holes) return false;
  if (wp.rivets !== target.rivets) return false;
  if (wp.stamped !== target.stamped) return false;
  if (target.holeSizes) {
    if (wp.holes.length !== target.holeSizes.length) return false;
    return wp.holes.every((hole, i) => hole.size === target.holeSizes![i]);
  }
  return true;
}

export function describeWorkpiece(wp: Workpiece): string {
  const sizes = wp.holes.map((h) => h.size).join(",") || "–";
  return `Löcher ${wp.holes.length} [${sizes}] · Nieten ${wp.rivets} · Stempel ${wp.stamped ? "ja" : "nein"}`;
}

export function describeTarget(target: TargetShape): string {
  const sizes = target.holeSizes ? ` [${target.holeSizes.join(",")}]` : "";
  return `Löcher ${target.holes}${sizes} · Nieten ${target.rivets} · Stempel ${target.stamped ? "ja" : "nein"}`;
}

export function resetWorkpiece(start: Workpiece): Workpiece {
  return cloneWorkpiece(start);
}
