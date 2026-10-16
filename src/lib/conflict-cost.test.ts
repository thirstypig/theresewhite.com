import { describe, it, expect } from "vitest";
import {
  calculateConflictCost,
  clampField,
  usd,
  DEFAULTS,
  type ConflictInputs,
} from "./conflict-cost";

/**
 * The figures this module produces must match Therese's own calculator
 * exactly, because she may quote them. Every expected value in the golden
 * tests below was read off the original page's script, run unmodified
 * against these inputs on 2026-10-16. The script is in
 * workplace-conflict-calculator-v2.html in the repo root.
 *
 * If one of these fails after a change to conflict-cost.ts, the change is
 * wrong, not the test — unless Therese has changed her calculator.
 */

function shown(inputs: ConflictInputs) {
  const r = calculateConflictCost(inputs);
  return {
    pair: usd(r.lines.pair),
    ripple: usd(r.lines.ripple),
    outOfPocket: usd(r.lines.outOfPocket),
    lostBusiness: usd(r.lines.lostBusiness),
    total: usd(r.total),
    rate: usd(r.monthlyRate),
    p3: usd(r.projections[3].total),
    a3: usd(r.projections[3].more),
    p6: usd(r.projections[6].total),
    a6: usd(r.projections[6].more),
    p12: usd(r.projections[12].total),
    a12: usd(r.projections[12].more),
  };
}

describe("calculateConflictCost — matches the original page", () => {
  it("reproduces the example values a visitor sees on arrival", () => {
    expect(shown(DEFAULTS)).toEqual({
      pair: "$12,708",
      ripple: "$9,749",
      outOfPocket: "$0",
      lostBusiness: "$0",
      total: "$22,457",
      rate: "$5,614",
      p3: "$39,299",
      a3: "$16,842",
      p6: "$56,142",
      a6: "$33,685",
      p12: "$89,826",
      a12: "$67,369",
    });
  });

  it("reproduces the figures with the benefits toggle on", () => {
    expect(shown({ ...DEFAULTS, loaded: true })).toEqual({
      pair: "$16,520",
      ripple: "$12,674",
      outOfPocket: "$0",
      lostBusiness: "$0",
      total: "$29,194",
      rate: "$7,298",
      p3: "$51,089",
      a3: "$21,895",
      p6: "$72,984",
      a6: "$43,790",
      p12: "$116,774",
      a12: "$87,580",
    });
  });

  it("reproduces the figures with money spent, lost business, and no ripple", () => {
    expect(
      shown({
        ...DEFAULTS,
        outOfPocket: 12_500,
        lostBusiness: 40_000,
        months: 7,
        rippleCount: 0,
      }),
    ).toEqual({
      pair: "$22,238",
      ripple: "$0",
      outOfPocket: "$12,500",
      lostBusiness: "$40,000",
      total: "$74,738",
      rate: "$3,177",
      p3: "$84,268",
      a3: "$9,530",
      p6: "$93,799",
      a6: "$19,061",
      p12: "$112,860",
      a12: "$38,122",
    });
  });

  it("reproduces the figures when entries are out of range", () => {
    // 40 hours counts as 25, $9,999,999 as $2,000,000, 3.6 people as 4,
    // and -2 months as 0 — so nothing has accrued yet, but the monthly
    // rate and the projections still reflect the clamped values.
    expect(
      shown({
        ...DEFAULTS,
        person1Hours: 40,
        rippleCount: 3.6,
        months: -2,
        person1Salary: 9_999_999,
      }),
    ).toEqual({
      pair: "$0",
      ripple: "$0",
      outOfPocket: "$0",
      lostBusiness: "$0",
      total: "$0",
      rate: "$108,919",
      p3: "$326,756",
      a3: "$326,756",
      p6: "$653,512",
      a6: "$653,512",
      p12: "$1,307,024",
      a12: "$1,307,024",
    });
  });
});

describe("calculateConflictCost — properties", () => {
  it("makes the four lines add up to the total exactly", () => {
    // Regression guarded: rounding each line on its own leaves the column a
    // dollar or two off the headline, which a careful reader will notice.
    for (let months = 0; months <= 24; months++) {
      for (const loaded of [false, true]) {
        const r = calculateConflictCost({
          ...DEFAULTS,
          months,
          loaded,
          outOfPocket: 1_234,
          lostBusiness: 5_678,
        });
        const sum =
          r.lines.pair +
          r.lines.ripple +
          r.lines.outOfPocket +
          r.lines.lostBusiness;
        expect(sum).toBe(r.total);
      }
    }
  });

  it("applies the benefits toggle to salary time only, never to money spent or lost", () => {
    const off = calculateConflictCost({
      ...DEFAULTS,
      months: 0,
      outOfPocket: 10_000,
      lostBusiness: 20_000,
    });
    const on = calculateConflictCost({
      ...DEFAULTS,
      months: 0,
      outOfPocket: 10_000,
      lostBusiness: 20_000,
      loaded: true,
    });

    expect(on.total).toBe(off.total);
    expect(on.lines.outOfPocket).toBe(10_000);
    expect(on.lines.lostBusiness).toBe(20_000);
  });

  it("does not carry money already spent or lost into the monthly rate", () => {
    // Regression guarded: if C or D leaked into the rate, a bigger legal bill
    // would make every future month look more expensive.
    const plain = calculateConflictCost(DEFAULTS);
    const withCosts = calculateConflictCost({
      ...DEFAULTS,
      outOfPocket: 50_000,
      lostBusiness: 80_000,
    });

    expect(withCosts.monthlyRate).toBe(plain.monthlyRate);
    expect(withCosts.projections[12].more).toBe(plain.projections[12].more);
  });

  it("returns zero salary time when every salary is zero", () => {
    const r = calculateConflictCost({
      ...DEFAULTS,
      person1Salary: 0,
      person2Salary: 0,
      rippleSalary: 0,
    });

    expect(r.total).toBe(0);
    expect(r.monthlyRate).toBe(0);
    expect(r.projections[12].total).toBe(0);
  });
});

describe("clampField", () => {
  it("counts a blank or unreadable entry as the field's minimum", () => {
    expect(clampField("person1Salary", Number.NaN)).toBe(0);
    expect(clampField("person1Hours", Number.NaN)).toBe(1);
  });

  it("keeps each field inside the range the original allows", () => {
    expect(clampField("person2Hours", 0)).toBe(1);
    expect(clampField("person2Hours", 30)).toBe(25);
    expect(clampField("rippleHours", 16)).toBe(15);
    expect(clampField("months", 121)).toBe(120);
    expect(clampField("lostBusiness", 2e8)).toBe(100_000_000);
  });

  it("rounds headcount to whole people, and nothing else", () => {
    expect(clampField("rippleCount", 2.5)).toBe(3);
    expect(clampField("months", 2.5)).toBe(2.5);
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
