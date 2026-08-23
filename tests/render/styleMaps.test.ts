import { measureLandCoverage, uvToSphere } from "../../src/render/styleMaps";
import { describe, expect, it } from "vitest";

describe("styleMaps", () => {
  it("keeps land coverage in a readable toy-earth range", () => {
    const cover = measureLandCoverage(320, 160);
    expect(cover).toBeGreaterThan(0.18);
    expect(cover).toBeLessThan(0.42);
  });

  it("maps north-pole UV onto +Y", () => {
    const p = uvToSphere(0.25, 1);
    expect(p.y).toBeCloseTo(1, 5);
    expect(p.x).toBeCloseTo(0, 5);
    expect(p.z).toBeCloseTo(0, 5);
  });
});
