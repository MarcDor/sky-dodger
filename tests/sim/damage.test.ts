import { DamageField, fract } from "../../src/sim/damageField";
import { raySphere, sphereUv } from "../../src/sim/sphere";
import { describe, expect, it } from "vitest";

describe("raySphere", () => {
  it("hits a unit sphere from +Z", () => {
    const t = raySphere({ x: 0, y: 0, z: 3 }, { x: 0, y: 0, z: -1 }, { x: 0, y: 0, z: 0 }, 1);
    expect(t).toBeCloseTo(2, 5);
  });

  it("misses when aimed past the limb", () => {
    const t = raySphere({ x: 0, y: 0, z: 3 }, { x: 1, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 1);
    expect(t).toBeNull();
  });
});

describe("sphereUv", () => {
  it("maps north pole near v=1", () => {
    const uv = sphereUv({ x: 0, y: 1, z: 0 });
    expect(uv.v).toBeCloseTo(1, 5);
  });
});

describe("DamageField", () => {
  it("wraps u across the dateline", () => {
    const field = new DamageField();
    field.splat(0.01, 0.5, 1.2);
    field.splat(0.99, 0.5, 1.2);
    const a = field.sample(0.005, 0.5);
    const b = field.sample(0.995, 0.5);
    expect(a.heat).toBeGreaterThan(0.05);
    expect(b.heat).toBeGreaterThan(0.05);
  });

  it("turns heat into crater depth after the vapor band", () => {
    const field = new DamageField();
    for (let i = 0; i < 40; i += 1) field.splat(0.4, 0.5, 1);
    const s = field.sample(0.4, 0.5);
    expect(s.heat).toBeGreaterThan(0.4);
    expect(s.damage).toBeGreaterThan(0.15);
  });

  it("cools heat but keeps crater", () => {
    const field = new DamageField();
    for (let i = 0; i < 20; i += 1) field.splat(0.2, 0.55, 1);
    const before = field.sample(0.2, 0.55);
    field.cool(2);
    const after = field.sample(0.2, 0.55);
    expect(after.heat).toBeLessThan(before.heat);
    expect(after.damage).toBe(before.damage);
  });

  it("fract is in [0,1)", () => {
    expect(fract(1.25)).toBeCloseTo(0.25, 8);
    expect(fract(-0.25)).toBeCloseTo(0.75, 8);
  });
});
