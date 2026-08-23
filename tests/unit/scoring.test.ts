import { describe, expect, it } from "vitest";
import { isBetterScore, occupiedPositions, scoresFrom } from "../../src/core";

describe("scoring axes", () => {
  it("counts unique occupied ring slots", () => {
    expect(
      occupiedPositions({
        tape: [true, true, false],
        stations: [
          { type: "punch", position: 0 },
          { type: "drill", position: 2 },
        ],
      }),
    ).toBe(2);
  });

  it("prefers fewer cycles, then area, then tape length", () => {
    const base = scoresFrom({ tape: [false, false], stations: [] }, 16);
    expect(isBetterScore({ ...base, cycles: 15 }, base)).toBe(true);
    expect(isBetterScore({ ...base, cycles: 16, area: 0 }, { ...base, area: 1 })).toBe(true);
  });
});
