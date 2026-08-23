import { describe, expect, it } from "vitest";
import { createRun, emptyWorkpiece, runBeats, step, type LevelDefinition } from "../../src/core";

const baseLevel: LevelDefinition = {
  id: "test",
  name: "test",
  brief: "",
  S: 8,
  start: emptyWorkpiece(),
  target: { holes: 1, rivets: 0, stamped: false },
  availableStations: ["punch"],
  successStreak: 2,
};

describe("tick order", () => {
  it("fires punch at slot 0 when tape[0] is open, then advances", () => {
    const run = createRun(baseLevel, {
      tape: [true, false, false, false, false, false, false, false],
      stations: [{ type: "punch", position: 0 }],
    });
    const after = step(run);
    expect(after.workpiece?.holes).toEqual([{ size: 1 }]);
    expect(after.workpieceAge).toBe(1);
    expect(after.t).toBe(1);
    expect(after.lastEvents[0]?.outcome).toBe("fired");
  });

  it("does not transform when the pulse is missing", () => {
    const run = createRun(baseLevel, {
      tape: [false, false, false, false, false, false, false, false],
      stations: [{ type: "punch", position: 0 }],
    });
    const after = step(run);
    expect(after.workpiece?.holes).toEqual([]);
    expect(after.lastEvents[0]?.outcome).toBe("idle");
  });

  it("records a fail flash when a prerequisite is missing", () => {
    const level: LevelDefinition = {
      ...baseLevel,
      target: { holes: 0, rivets: 0, stamped: false },
    };
    const run = createRun(level, {
      tape: [true, false, false, false, false, false, false, false],
      stations: [{ type: "rivet", position: 0 }],
    });
    const after = step(run);
    expect(after.workpiece?.rivets).toBe(0);
    expect(after.lastEvents[0]?.outcome).toBe("failed");
  });
});

describe("output and streak", () => {
  it("accepts a workpiece after exactly S beats and resets the streak on a miss", () => {
    const good = createRun(baseLevel, {
      tape: [true, false, false, false, false, false, false, false],
      stations: [{ type: "punch", position: 0 }],
    });
    const first = runBeats(good, 8);
    expect(first.consecutiveSuccesses).toBe(1);
    expect(first.lastOutputMatched).toBe(true);
    expect(first.workpiece).toBeNull();

    const missLayout = {
      tape: [false, false, false, false, false, false, false, false],
      stations: [{ type: "punch" as const, position: 0 }],
    };
    const missed = runBeats(createRun(baseLevel, missLayout), 8);
    expect(missed.consecutiveSuccesses).toBe(0);
    expect(missed.lastOutputMatched).toBe(false);
  });

  it("solves after N consecutive successes and reports cycle score", () => {
    const run = createRun(baseLevel, {
      tape: [true, false, false, false, false, false, false, false],
      stations: [{ type: "punch", position: 0 }],
    });
    const done = runBeats(run, 16);
    expect(done.solved).toBe(true);
    expect(done.consecutiveSuccesses).toBe(2);
    expect(done.scores.cycles).toBe(16);
    expect(done.scores.area).toBe(1);
    expect(done.scores.tapeLength).toBe(8);
  });
});

describe("no-softlock", () => {
  it("never throws on illegal station order", () => {
    const level: LevelDefinition = {
      ...baseLevel,
      availableStations: ["punch", "drill", "rivet", "stamp"],
      target: { holes: 0, rivets: 0, stamped: false },
    };
    const run = createRun(level, {
      tape: Array.from({ length: 8 }, () => true),
      stations: [
        { type: "rivet", position: 0 },
        { type: "drill", position: 3 },
        { type: "stamp", position: 5 },
      ],
    });
    expect(() => runBeats(run, 40)).not.toThrow();
  });
});
