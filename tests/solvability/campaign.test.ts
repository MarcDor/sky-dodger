import { describe, expect, it } from "vitest";
import { CAMPAIGN } from "../../src/levels/campaign";
import { checkLevel } from "./solver";

describe("campaign solvability", () => {
  it("proves every prototype level is solvable and verifies a constructed layout", () => {
    const reports = CAMPAIGN.map(checkLevel);
    for (const report of reports) {
      expect(report.solvable, `${report.id} has no op sequence`).toBe(true);
      expect(report.verified, `${report.id} constructed layout did not solve`).toBe(true);
    }
  });

  it("keeps minimum solution complexity from collapsing late levels below early ones", () => {
    const reports = CAMPAIGN.map(checkLevel);
    const intro = reports[0];
    const late = reports[reports.length - 2];
    expect(intro.minStations).toBe(1);
    expect(late.minStations).toBeGreaterThanOrEqual(4);
  });
});
