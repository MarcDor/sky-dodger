import { describe, expect, it } from "vitest";
import { applyStation, canApply, emptyWorkpiece, matchesTarget } from "../../src/core";

describe("station transforms", () => {
  it("punches a size-1 hole", () => {
    const next = applyStation("punch", emptyWorkpiece());
    expect(next.holes).toEqual([{ size: 1 }]);
  });

  it("drills the last hole and refuses an empty plate", () => {
    expect(canApply("drill", emptyWorkpiece())).toBe(false);
    expect(applyStation("drill", emptyWorkpiece())).toEqual(emptyWorkpiece());
    const drilled = applyStation("drill", applyStation("punch", emptyWorkpiece()));
    expect(drilled.holes).toEqual([{ size: 2 }]);
  });

  it("rivets only with two holes and does not consume them", () => {
    const one = applyStation("punch", emptyWorkpiece());
    expect(canApply("rivet", one)).toBe(false);
    const two = applyStation("punch", one);
    const riveted = applyStation("rivet", two);
    expect(riveted.rivets).toBe(1);
    expect(riveted.holes).toHaveLength(2);
  });

  it("stamps without prerequisites", () => {
    const stamped = applyStation("stamp", emptyWorkpiece());
    expect(stamped.stamped).toBe(true);
  });
});

describe("target match", () => {
  it("requires exact counts", () => {
    const wp = applyStation("punch", applyStation("punch", emptyWorkpiece()));
    expect(matchesTarget(wp, { holes: 2, rivets: 0, stamped: false })).toBe(true);
    expect(matchesTarget(wp, { holes: 1, rivets: 0, stamped: false })).toBe(false);
  });

  it("matches optional hole sizes exactly", () => {
    const wp = applyStation("drill", applyStation("punch", emptyWorkpiece()));
    expect(matchesTarget(wp, { holes: 1, rivets: 0, stamped: false, holeSizes: [2] })).toBe(true);
    expect(matchesTarget(wp, { holes: 1, rivets: 0, stamped: false, holeSizes: [1] })).toBe(false);
  });
});
