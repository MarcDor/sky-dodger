import { buyUfo, createGame, incomePerSecond, step, ufoCost, wound } from "../../src/sim/game";
import { describe, expect, it } from "vitest";

const view = { cx: 400, cy: 300, r: 160 };

describe("incremental swarm", () => {
  it("starts with one UFO and enough gold for the next", () => {
    const g = createGame();
    expect(g.ufos).toHaveLength(1);
    expect(g.gold).toBeGreaterThanOrEqual(ufoCost(1));
  });

  it("charges gold when buying a UFO", () => {
    const g = createGame();
    const before = g.gold;
    expect(buyUfo(g)).toBe(true);
    expect(g.ufos).toHaveLength(2);
    expect(g.gold).toBe(before - ufoCost(1));
  });

  it("refuses a buy you cannot afford", () => {
    const g = createGame();
    g.gold = 0;
    expect(buyUfo(g)).toBe(false);
    expect(g.ufos).toHaveLength(1);
  });

  it("income scales with fleet size", () => {
    const g = createGame();
    const one = incomePerSecond(g);
    buyUfo(g);
    expect(incomePerSecond(g)).toBeGreaterThan(one);
  });

  it("auto-fire queues breaks and raises wound", () => {
    const g = createGame();
    for (let i = 0; i < 80; i += 1) step(g, 0.05, view);
    expect(g.breaks.length).toBeGreaterThan(2);
    expect(g.shotsFired).toBeGreaterThan(2);
    expect(g.carved).toBeGreaterThan(0);
    expect(wound(g, view.r)).toBeGreaterThan(0);
  });

  it("gives each UFO its own orbit and spin", () => {
    const g = createGame();
    g.gold = 500;
    buyUfo(g);
    buyUfo(g);
    buyUfo(g);
    const omegas = new Set(g.ufos.map((u) => u.omega.toFixed(3)));
    const orbs = new Set(g.ufos.map((u) => u.orbitMul.toFixed(3)));
    expect(omegas.size).toBeGreaterThan(1);
    expect(orbs.size).toBeGreaterThan(1);
    expect(g.ufos.some((u) => u.omega < 0)).toBe(true);
    expect(g.ufos.some((u) => u.omega > 0)).toBe(true);
  });
});
