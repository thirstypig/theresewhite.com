import { describe, it, expect } from "vitest";
import { calculateConflictCost, usd, type ConflictInputs } from "./conflict-cost";

/**
 * These tests exist because the figures this module produces may already
 * appear in Therese's proposals. The arithmetic was ported verbatim from
 * workplace-conflict-calculator-COMPLETE.html; if someone "improves" it, the
 * site starts quoting different numbers than she has quoted in writing.
 *
 * The golden vector below was verified against the original HTML calculator
 * on 2026-08-05 with these exact inputs.
 */

const GOLDEN: ConflictInputs = {
  durationWeeks: 12,
  sunkLosses: 0,
  person1Salary: 95000,
  person2Salary: 85000,
  affectedTeam: 6,
  avgTeamSalary: 75000,
  mainProductivityLossPct: 30,
  teamProductivityLossPct: 15,
  managementHours: 3,
  userSalary: 150000,
};

describe("calculateConflictCost", () => {
  it("reproduces the original calculator's figures exactly", () => {
    const r = calculateConflictCost(GOLDEN);

    expect(usd(r.past.mainProductivity)).toBe("$12,462");
    expect(usd(r.past.teamProductivity)).toBe("$15,577");
    expect(usd(r.past.managementTime)).toBe("$2,700");
    expect(usd(r.past.total)).toBe("$30,738");
    expect(usd(r.future[12].grandTotal)).toBe("$163,938");
  });

  it("treats a zero salary as opting out of pricing your time, not as free labour", () => {
    // Guarding this explicitly matters: dropping the `userSalary > 0` check
    // and dividing anyway yields NaN, which formats as "$NaN" on the page.
    const r = calculateConflictCost({ ...GOLDEN, userSalary: 0 });

    expect(r.past.managementTime).toBe(0);
    expect(r.future[12].managementTime).toBe(0);
    expect(Number.isFinite(r.past.total)).toBe(true);
    expect(usd(r.past.total)).toBe("$28,038"); // golden total minus the $2,700
  });

  it("projects in whole weeks — 13, 26 and 52 — not calendar months", () => {
    // Regression guarded: switching to months * 4.33 changes every projection
    // by a few percent, which is invisible in review and wrong in a proposal.
    const r = calculateConflictCost(GOLDEN);

    expect(r.future[6].total).toBeCloseTo(r.future[3].total * 2, 6);
    expect(r.future[12].total).toBeCloseTo(r.future[3].total * 4, 6);
  });

  it("adds past losses to each horizon exactly once", () => {
    // Regression guarded: double-counting past losses inflates the headline
    // twelve-month figure, which is the number used to justify the engagement.
    const r = calculateConflictCost(GOLDEN);

    for (const months of [3, 6, 12] as const) {
      expect(r.future[months].grandTotal).toBeCloseTo(
        r.past.total + r.future[months].total,
        6,
      );
    }
  });

  it("counts money already spent once, in the past, and never in a projection", () => {
    // Regression guarded: leaking sunk costs into the forward projection makes
    // the 12-month number grow every time someone reports a bigger legal bill,
    // which reads as the model rewarding sunk cost.
    const withSunk = calculateConflictCost({ ...GOLDEN, sunkLosses: 40_000 });
    const withoutSunk = calculateConflictCost(GOLDEN);

    // toBeCloseTo, not toBe: these are floating-point sums, and exact equality
    // here asserts IEEE-754 behaviour rather than the property we care about.
    expect(withSunk.past.total - withoutSunk.past.total).toBeCloseTo(40_000, 6);
    expect(withSunk.future[12].total).toBe(withoutSunk.future[12].total);
    expect(
      withSunk.future[12].grandTotal - withoutSunk.future[12].grandTotal,
    ).toBeCloseTo(40_000, 6);
  });

  it("scales past losses linearly with how long the conflict has run", () => {
    const twelve = calculateConflictCost(GOLDEN);
    const twentyFour = calculateConflictCost({
      ...GOLDEN,
      durationWeeks: 24,
    });

    expect(twentyFour.past.total).toBeCloseTo(twelve.past.total * 2, 6);
    // Duration is history; it must not move the forward projection.
    expect(twentyFour.future[12].total).toBe(twelve.future[12].total);
  });

  it("returns zero across the board when every input is zero", () => {
    const empty = calculateConflictCost({
      durationWeeks: 0,
      sunkLosses: 0,
      person1Salary: 0,
      person2Salary: 0,
      affectedTeam: 0,
      avgTeamSalary: 0,
      mainProductivityLossPct: 0,
      teamProductivityLossPct: 0,
      managementHours: 0,
      userSalary: 0,
    });

    expect(empty.past.total).toBe(0);
    expect(empty.future[12].grandTotal).toBe(0);
    expect(usd(empty.past.total)).toBe("$0");
  });
});

describe("usd", () => {
  it("rounds to whole dollars and groups thousands", () => {
    expect(usd(0)).toBe("$0");
    expect(usd(1234.49)).toBe("$1,234");
    expect(usd(1234.5)).toBe("$1,235");
    expect(usd(1_234_567.89)).toBe("$1,234,568");
  });
});
