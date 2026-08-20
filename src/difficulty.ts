import {
  BASE_FALL_SPEED,
  BASE_SPAWN_MS,
  FALL_SPEED_GAIN,
  MAX_FALL_SPEED,
  MIN_SPAWN_MS,
  SCORE_TICK_MS,
  SPAWN_REDUCTION_PER_SEC,
} from "./config";

/** Downward obstacle speed in pixels per second. Ramps up, then caps. */
export function fallSpeed(elapsedSec: number): number {
  return Math.min(MAX_FALL_SPEED, BASE_FALL_SPEED + FALL_SPEED_GAIN * elapsedSec);
}

/** Mean time between spawns. Shrinks as the round goes on. */
export function spawnInterval(elapsedSec: number): number {
  return Math.max(MIN_SPAWN_MS, BASE_SPAWN_MS - SPAWN_REDUCTION_PER_SEC * elapsedSec);
}

/**
 * Actual wait until the next obstacle. The interval itself is already shrinking
 * with time; this extra jitter makes gaps feel hand-placed rather than metronomic.
 */
export function nextSpawnDelay(elapsedSec: number, rng: () => number = Math.random): number {
  const mean = spawnInterval(elapsedSec);
  return mean * (0.65 + rng() * 0.7);
}

export function scoreFromTime(elapsedMs: number): number {
  return Math.floor(Math.max(0, elapsedMs) / SCORE_TICK_MS);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
