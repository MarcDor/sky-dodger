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

  it("auto-fire adds craters and raises wound", () => {
    const g = createGame();
    for (let i = 0; i < 80; i += 1) step(g, 0.05, view);
    expect(g.craters.length).toBeGreaterThan(5);
    expect(g.shotsFired).toBeGreaterThan(5);
    expect(wound(g, view.r)).toBeGreaterThan(0);
  });
});
