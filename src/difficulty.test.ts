import { describe, expect, it } from "vitest";
import { rectsOverlap } from "./collision";
import {
  fallSpeed,
  nextSpawnDelay,
  scoreFromTime,
  spawnInterval,
} from "./difficulty";
import {
  BASE_FALL_SPEED,
  MAX_FALL_SPEED,
  MIN_SPAWN_MS,
  SCORE_TICK_MS,
} from "./config";

describe("rectsOverlap", () => {
  it("detects overlapping hitboxes", () => {
    expect(
      rectsOverlap(
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 5, y: 5, width: 10, height: 10 },
      ),
    ).toBe(true);
  });

  it("ignores separated and edge-touching boxes", () => {
    expect(
      rectsOverlap(
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 20, y: 0, width: 10, height: 10 },
      ),
    ).toBe(false);
    expect(
      rectsOverlap(
        { x: 0, y: 0, width: 10, height: 10 },
        { x: 10, y: 0, width: 10, height: 10 },
      ),
    ).toBe(false);
  });
});

describe("difficulty", () => {
  it("starts at the base fall speed and climbs until the cap", () => {
    expect(fallSpeed(0)).toBe(BASE_FALL_SPEED);
    expect(fallSpeed(10)).toBeGreaterThan(fallSpeed(0));
    expect(fallSpeed(999)).toBe(MAX_FALL_SPEED);
  });

  it("spawns more often over time, never below the floor", () => {
    expect(spawnInterval(20)).toBeLessThan(spawnInterval(0));
    expect(spawnInterval(999)).toBe(MIN_SPAWN_MS);
  });

  it("keeps jittered spawn delays around the current interval", () => {
    const mean = spawnInterval(5);
    expect(nextSpawnDelay(5, () => 0)).toBeCloseTo(mean * 0.65);
    expect(nextSpawnDelay(5, () => 1)).toBeCloseTo(mean * 1.35);
  });

  it("scores survival time in ticks", () => {
    expect(scoreFromTime(0)).toBe(0);
    expect(scoreFromTime(SCORE_TICK_MS * 12)).toBe(12);
    expect(scoreFromTime(-50)).toBe(0);
  });
});
