/**
 * Cost-of-conflict model, second version.
 *
 * Ported verbatim from Therese's Workplace Conflict Cost Calculator
 * (workplace-conflict-calculator-v2.html in the repo root), which replaced
 * the first version on 2026-10-16. The figures this produces must match that
 * page exactly; conflict-cost.test.ts pins them to values read off the
 * original script. Do not "improve" the arithmetic without checking with her.
 *
 * The model in one sentence: every hour of productive time lost is valued at
 * base salary divided by 2,080 working hours a year, a month is 4.333 weeks,
 * and the projections add the current monthly cost on top of the total so far.
 *
 * The first version (percent-of-salary sliders, weeks, your own time) gave
 * different numbers for the same situation. It is in git history and in
 * workplace-conflict-calculator-COMPLETE.html.
 */

export type ConflictInputs = {
  person1Salary: number;
  person2Salary: number;
  /** Productive hours each of the two loses per week. */
  person1Hours: number;
  person2Hours: number;
  /** How long the conflict has run so far. */
  months: number;
  /** Colleagues and bosses pulled in, beyond the two. */
  rippleCount: number;
  rippleSalary: number;
  /** Productive hours each of those colleagues loses per week. */
  rippleHours: number;
  /** C — money already spent: legal, coaches, settlements, temp staff. */
  outOfPocket: number;
  /** D — the visitor's own estimate of lost or delayed profit. */
  lostBusiness: number;
  /** The benefits toggle: adds 30% to the salary-based figures only. */
  loaded: boolean;
};

export type NumericField = Exclude<keyof ConflictInputs, "loaded">;

export const HOURS_PER_YEAR = 2080;
export const WEEKS_PER_MONTH = 4.333;
export const LOADED_MULTIPLIER = 1.3;

/**
 * What each field accepts. Anything outside the range is counted as the
 * nearest end of it, and the page says so under the field. A blank or
 * unreadable entry counts as the minimum. These match the original exactly,
 * including the odd ones: each of the two people loses at least one hour a
 * week, because the tool assumes a conflict is actually happening.
 */
export const LIMITS: Record<
  NumericField,
  { min: number; max: number; money: boolean; whole?: boolean }
> = {
  person1Salary: { min: 0, max: 2_000_000, money: true },
  person2Salary: { min: 0, max: 2_000_000, money: true },
  rippleSalary: { min: 0, max: 2_000_000, money: true },
  outOfPocket: { min: 0, max: 50_000_000, money: true },
  lostBusiness: { min: 0, max: 100_000_000, money: true },
  months: { min: 0, max: 120, money: false },
  rippleCount: { min: 0, max: 50, money: false, whole: true },
  person1Hours: { min: 1, max: 25, money: false },
  person2Hours: { min: 1, max: 25, money: false },
  rippleHours: { min: 0, max: 15, money: false },
};

/** The starting values. The page labels them "Example values". */
export const DEFAULTS: ConflictInputs = {
  person1Salary: 160_000,
  person2Salary: 145_000,
  person1Hours: 5,
  person2Hours: 5,
  months: 4,
  rippleCount: 3,
  rippleSalary: 130_000,
  rippleHours: 3,
  outOfPocket: 0,
  lostBusiness: 0,
  loaded: false,
};

/** Pulls a value into its field's allowed range. NaN counts as the minimum. */
export function clampField(field: NumericField, value: number): number {
  const { min, max, whole } = LIMITS[field];
  let v = Number.isFinite(value) ? value : min;
  if (whole) v = Math.round(v);
  return Math.min(max, Math.max(min, v));
}

export type ConflictResult = {
  /**
   * A, B, C and D in whole dollars. Rounded so the four always add up to
   * `total` exactly — see the comment where they are computed.
   */
  lines: { pair: number; ripple: number; outOfPocket: number; lostBusiness: number };
  /** Total so far, rounded to the dollar. */
  total: number;
  /** What A and B together cost per month from here, rounded. */
  monthlyRate: number;
  /** Total cost after 3, 6 and 12 more months, and how much of that is new. */
  projections: Record<3 | 6 | 12, { total: number; more: number }>;
};

export function calculateConflictCost(raw: ConflictInputs): ConflictResult {
  const v = (field: NumericField) => clampField(field, raw[field]);
  const factor = raw.loaded ? LOADED_MULTIPLIER : 1;

  const hourly = (salary: number) => salary / HOURS_PER_YEAR;
  const monthlyPair =
    factor *
    (hourly(v("person1Salary")) * (v("person1Hours") * WEEKS_PER_MONTH) +
      hourly(v("person2Salary")) * (v("person2Hours") * WEEKS_PER_MONTH));
  const monthlyRipple =
    factor *
    v("rippleCount") *
    hourly(v("rippleSalary")) *
    (v("rippleHours") * WEEKS_PER_MONTH);
  const monthly = monthlyPair + monthlyRipple;

  const months = v("months");
  const parts = [
    monthlyPair * months,
    monthlyRipple * months,
    v("outOfPocket"),
    v("lostBusiness"),
  ];
  const exact = parts.reduce((a, b) => a + b, 0);
  const total = Math.round(exact);

  // Rounding each line on its own can leave the four lines a dollar or two
  // off the total shown above them. So: round every line down, then hand the
  // leftover dollars to the lines with the largest fractions. The original
  // does exactly this, and a visitor adding up the column should get the
  // headline figure.
  const lines = parts.map(Math.floor);
  const left = total - lines.reduce((a, b) => a + b, 0);
  parts
    .map((x, k) => [x - Math.floor(x), k] as const)
    .sort((a, b) => b[0] - a[0])
    .slice(0, Math.max(0, left))
    .forEach(([, k]) => {
      lines[k] += 1;
    });

  const projections = {} as ConflictResult["projections"];
  for (const n of [3, 6, 12] as const) {
    const projected = Math.round(exact + monthly * n);
    projections[n] = { total: projected, more: projected - total };
  }

  return {
    lines: {
      pair: lines[0],
      ripple: lines[1],
      outOfPocket: lines[2],
      lostBusiness: lines[3],
    },
    total,
    monthlyRate: Math.round(monthly),
    projections,
  };
}

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** "$1,234". Whole dollars, as the original shows them. */
export function usd(n: number): string {
  return USD.format(n);
}
