/**
 * Cost-of-conflict model.
 *
 * Ported verbatim from workplace-conflict-calculator-COMPLETE.html so the
 * numbers this page produces match the ones Therese has already been quoting.
 * Do not "improve" the arithmetic without checking with her — the figures may
 * appear in proposals.
 *
 * Everything is weekly. A working year is 52 weeks for salary division, and a
 * working year for hourly cost is 50 weeks x 40 hours = 2,000 hours.
 */

export type ConflictInputs = {
  /** Weeks the conflict has been running. */
  durationWeeks: number;
  /** Money already spent: investigations, legal, temp cover. */
  sunkLosses: number;
  person1Salary: number;
  person2Salary: number;
  /** Headcount affected beyond the two principals. */
  affectedTeam: number;
  avgTeamSalary: number;
  /** 0–100, productivity lost by the two principals. */
  mainProductivityLossPct: number;
  /** 0–100, productivity lost by the wider team. */
  teamProductivityLossPct: number;
  /** Hours per week you personally spend managing this. */
  managementHours: number;
  /** Your salary, used to price your time. Zero opts out. */
  userSalary: number;
};

export type ConflictResult = {
  past: {
    mainProductivity: number;
    teamProductivity: number;
    managementTime: number;
    sunkLosses: number;
    total: number;
  };
  /** Projections if nothing changes, keyed by month horizon. */
  future: Record<
    3 | 6 | 12,
    {
      mainProductivity: number;
      teamProductivity: number;
      managementTime: number;
      total: number;
      /** Past losses plus this horizon. */
      grandTotal: number;
    }
  >;
};

const WEEKS_PER_YEAR = 52;
const WORKING_HOURS_PER_YEAR = 50 * 40;
const HORIZONS = { 3: 13, 6: 26, 12: 52 } as const;

export function calculateConflictCost(i: ConflictInputs): ConflictResult {
  const mainLoss = i.mainProductivityLossPct / 100;
  const teamLoss = i.teamProductivityLossPct / 100;

  const weeklyMain =
    ((i.person1Salary + i.person2Salary) / WEEKS_PER_YEAR) * mainLoss;
  const weeklyTeam =
    ((i.affectedTeam * i.avgTeamSalary) / WEEKS_PER_YEAR) * teamLoss;

  // Zero salary means "don't price my time", not "my time is free".
  const weeklyManagement =
    i.userSalary > 0
      ? i.managementHours * (i.userSalary / WORKING_HOURS_PER_YEAR)
      : 0;

  const past = {
    mainProductivity: weeklyMain * i.durationWeeks,
    teamProductivity: weeklyTeam * i.durationWeeks,
    managementTime: weeklyManagement * i.durationWeeks,
    sunkLosses: i.sunkLosses,
    total: 0,
  };
  past.total =
    past.mainProductivity +
    past.teamProductivity +
    past.managementTime +
    past.sunkLosses;

  const future = {} as ConflictResult["future"];
  for (const [months, weeks] of Object.entries(HORIZONS)) {
    const m = Number(months) as 3 | 6 | 12;
    const mainProductivity = weeklyMain * weeks;
    const teamProductivity = weeklyTeam * weeks;
    const managementTime = weeklyManagement * weeks;
    const total = mainProductivity + teamProductivity + managementTime;
    future[m] = {
      mainProductivity,
      teamProductivity,
      managementTime,
      total,
      grandTotal: past.total + total,
    };
  }

  return { past, future };
}

export function usd(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
