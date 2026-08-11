"use client";

import { useState } from "react";
import Link from "next/link";
import {
  calculateConflictCost,
  usd,
  type ConflictInputs,
} from "@/lib/conflict-cost";
import { contact, cta } from "@/content/site";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const DEFAULTS: ConflictInputs = {
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

const fieldClass =
  "mt-2 w-full rounded-sm border border-rule bg-paper px-3.5 py-2.5 text-base text-charcoal outline-none transition-colors focus:border-btn";

function NumberField({
  label,
  hint,
  value,
  onChange,
  prefix,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
}) {
  return (
    <p className="m-0">
      <label className="label text-muted">{label}</label>
      <span className="relative block">
        {prefix ? (
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 pt-1 text-base text-muted">
            {prefix}
          </span>
        ) : null}
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={`${fieldClass} ${prefix ? "pl-7" : ""}`}
        />
      </span>
      {hint ? (
        <span className="mt-1.5 block text-xs text-muted">{hint}</span>
      ) : null}
    </p>
  );
}

function SliderField({
  label,
  hint,
  value,
  onChange,
  max,
  suffix,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (n: number) => void;
  max: number;
  suffix: string;
}) {
  return (
    <p className="m-0">
      <span className="flex items-baseline justify-between gap-4">
        <label className="label text-muted">{label}</label>
        {/* Mono, not the display serif: globals.css assigns figures to the
            mono face, and a value that updates while you drag a slider needs
            fixed-width digits or it visibly jitters. */}
        <span className="font-mono text-lg tabular-nums text-heading">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--btn)]"
      />
      {hint ? (
        <span className="mt-1.5 block text-xs text-muted">{hint}</span>
      ) : null}
    </p>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-6 border-b border-rule py-2.5 ${
        strong ? "border-rule-strong" : ""
      }`}
    >
      <span
        className={strong ? "text-base text-heading" : "text-sm text-charcoal"}
      >
        {label}
      </span>
      <span
        className={`tabular-nums ${
          strong
            ? "display text-xl text-heading"
            : "text-sm text-charcoal"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function ConflictCalculator({
  ctaHref = cta.href,
  ctaLabel = cta.short,
  className = "border-b border-rule bg-paper",
  fontClass = "display",
}: {
  /**
   * Where the post-unlock button goes. The landing pages override this to an
   * on-page anchor — they have no nav, so sending someone to /contact would
   * drop them out of the page they arrived on and end the funnel.
   */
  ctaHref?: string;
  ctaLabel?: string;
  /** Outer section classes, so a host page can own its own surface. */
  className?: string;
  /**
   * Face for the headings inside the tool. Defaults to the site's display
   * serif. Landing page A sets the mono face instead — it builds its whole
   * argument in a ledger voice, and a serif appearing only once the reader
   * reaches the calculator reads as an inconsistency rather than a choice.
   */
  fontClass?: string;
} = {}) {
  const [inputs, setInputs] = useState<ConflictInputs>(DEFAULTS);
  const [calculated, setCalculated] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof ConflictInputs>(k: K, v: ConflictInputs[K]) =>
    setInputs((p) => ({ ...p, [k]: v }));

  const result = calculateConflictCost(inputs);

  async function unlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);

    // No key configured (local dev): don't pretend to capture the lead.
    if (!ACCESS_KEY) {
      setUnlocked(true);
      return;
    }

    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: "Conflict Calculator — new result request",
          from_name: "theresewhite.com calculator",
          name: form.get("name"),
          email: form.get("email"),
          organization: form.get("organization"),
          phone: form.get("phone"),
          botcheck: form.get("botcheck"),
          // The numbers matter more than the lead: they say how bad it is.
          conflict_duration_weeks: inputs.durationWeeks,
          already_lost: usd(result.past.total),
          projected_12_month: usd(result.future[12].grandTotal),
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message ?? "Submission failed");
      setUnlocked(true);
    } catch {
      setError(
        "That didn't send. Try again, or call (323) 291-4813 and we'll walk through it together.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <section className={className}>
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            {/* ---------------- Inputs ---------------- */}
            <div>
              <h2 className={`${fontClass} text-2xl text-heading`}>
                Your situation
              </h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-charcoal">
                Rough numbers are fine. The point isn&rsquo;t precision, it&rsquo;s
                order of magnitude — and the order of magnitude is usually the
                surprise.
              </p>

              <div className="mt-10 space-y-10">
                <fieldset className="border-0 p-0">
                  <legend className="label mb-4 p-0 text-slate">
                    The two people in conflict
                  </legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <NumberField
                      label="First person's salary"
                      value={inputs.person1Salary}
                      onChange={(v) => set("person1Salary", v)}
                      prefix="$"
                    />
                    <NumberField
                      label="Second person's salary"
                      value={inputs.person2Salary}
                      onChange={(v) => set("person2Salary", v)}
                      prefix="$"
                    />
                    <NumberField
                      label="Weeks it's been running"
                      value={inputs.durationWeeks}
                      onChange={(v) => set("durationWeeks", v)}
                    />
                    {/* The standalone calculator defines this field as direct
                        business losses, not internal spend. Keeping its
                        definition — the arithmetic is the same either way, but
                        the two readings produce very different numbers. */}
                    <NumberField
                      label="Already spent"
                      hint="Direct losses already incurred — lost client contracts, missed sales opportunities, failed deadlines, project delays, damaged business relationships."
                      value={inputs.sunkLosses}
                      onChange={(v) => set("sunkLosses", v)}
                      prefix="$"
                    />
                  </div>
                </fieldset>

                <fieldset className="border-0 p-0">
                  <legend className="label mb-4 p-0 text-slate">
                    The ripple effect
                  </legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <NumberField
                      label="Others affected"
                      hint="Teams, direct reports, and colleagues who work with both individuals."
                      value={inputs.affectedTeam}
                      onChange={(v) => set("affectedTeam", v)}
                    />
                    <NumberField
                      label="Their average salary"
                      value={inputs.avgTeamSalary}
                      onChange={(v) => set("avgTeamSalary", v)}
                      prefix="$"
                    />
                  </div>
                </fieldset>

                <fieldset className="border-0 p-0">
                  <legend className="label mb-4 p-0 text-slate">
                    The impact
                  </legend>
                  <div className="space-y-7">
                    <SliderField
                      label="Productivity lost by the two"
                      hint="Time spent in unproductive meetings, communication delays, and avoidance behaviors."
                      value={inputs.mainProductivityLossPct}
                      onChange={(v) => set("mainProductivityLossPct", v)}
                      max={100}
                      suffix="%"
                    />
                    <SliderField
                      label="Productivity lost by the team"
                      hint="Non-work distractions, workaround strategies, inefficiencies, and reduced performance of duties."
                      value={inputs.teamProductivityLossPct}
                      onChange={(v) => set("teamProductivityLossPct", v)}
                      max={100}
                      suffix="%"
                    />
                    <SliderField
                      label="Your hours on this per week"
                      value={inputs.managementHours}
                      onChange={(v) => set("managementHours", v)}
                      max={40}
                      suffix="h"
                    />
                    <NumberField
                      label="Your salary"
                      hint="Used only to price your time. Leave at zero to skip."
                      value={inputs.userSalary}
                      onChange={(v) => set("userSalary", v)}
                      prefix="$"
                    />
                  </div>
                </fieldset>
              </div>

              {!calculated ? (
                <button
                  type="button"
                  onClick={() => setCalculated(true)}
                  className="mt-10 rounded-sm bg-btn px-6 py-3.5 text-base font-medium text-btn-fg transition-colors hover:bg-btn-hover"
                >
                  Calculate the cost
                </button>
              ) : null}
            </div>

            {/* ---------------- Results ---------------- */}
            <div>
              {!calculated ? (
                <div className="rounded-sm border border-rule bg-cream p-8">
                  <p className="label text-muted">Your result</p>
                  <p className={`${fontClass} mt-4 text-2xl text-heading`}>
                    Fill in what you know, then calculate.
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-charcoal">
                    You&rsquo;ll get what the conflict has already cost, and what
                    it costs over the next three, six and twelve months if
                    nothing changes.
                  </p>
                </div>
              ) : (
                <div className="rounded-sm border border-rule bg-cream p-8">
                  <p className="label text-muted">
                    {inputs.durationWeeks} week
                    {inputs.durationWeeks === 1 ? "" : "s"} of unresolved
                    conflict
                  </p>

                  <h2 className={`${fontClass} mt-4 text-2xl text-heading`}>
                    What you&rsquo;ve already lost
                  </h2>
                  <div className="mt-5">
                    <Row
                      label="Lost productivity, the two people"
                      value={usd(result.past.mainProductivity)}
                    />
                    <Row
                      label="Lost productivity, the wider team"
                      value={usd(result.past.teamProductivity)}
                    />
                    <Row
                      label="Your time managing it"
                      value={usd(result.past.managementTime)}
                    />
                    {result.past.sunkLosses > 0 ? (
                      <Row
                        label="Already spent"
                        value={usd(result.past.sunkLosses)}
                      />
                    ) : null}
                    <Row
                      label="Total to date"
                      value={usd(result.past.total)}
                      strong
                    />
                  </div>

                  {/* The projections are the persuasive part, so they sit
                      behind the email gate; the sunk cost above is given
                      freely so the page proves its worth first. */}
                  <h2 className={`${fontClass} mt-10 text-2xl text-heading`}>
                    If nothing changes
                  </h2>

                  {unlocked ? (
                    <div className="mt-5">
                      {([3, 6, 12] as const).map((m) => (
                        <Row
                          key={m}
                          label={`Total cost at ${m} months`}
                          value={usd(result.future[m].grandTotal)}
                          strong={m === 12}
                        />
                      ))}
                      <p className="mt-6 text-sm leading-relaxed text-muted">
                        Mediation typically starts at $5,000. Compare that with
                        the twelve-month figure — that comparison is the whole
                        argument.
                      </p>
                      <Link
                        href={ctaHref}
                        className="mt-6 inline-block rounded-sm bg-btn px-6 py-3.5 text-base font-medium text-btn-fg transition-colors hover:bg-btn-hover"
                      >
                        {ctaLabel}
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={unlock} className="mt-5">
                      <p className="text-base leading-relaxed text-charcoal">
                        Tell us where to send the full projection and it appears
                        right here. No list, no drip campaign — Therese reads
                        these herself.
                      </p>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <p className="m-0">
                          <label htmlFor="calc-name" className="label text-muted">
                            Your name
                          </label>
                          <input
                            id="calc-name"
                            name="name"
                            required
                            autoComplete="name"
                            className={fieldClass}
                          />
                        </p>
                        <p className="m-0">
                          <label
                            htmlFor="calc-email"
                            className="label text-muted"
                          >
                            Email
                          </label>
                          <input
                            id="calc-email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            className={fieldClass}
                          />
                        </p>
                        <p className="m-0">
                          <label htmlFor="calc-org" className="label text-muted">
                            Organization
                          </label>
                          <input
                            id="calc-org"
                            name="organization"
                            required
                            autoComplete="organization"
                            className={fieldClass}
                          />
                        </p>
                        <p className="m-0">
                          <label
                            htmlFor="calc-phone"
                            className="label text-muted"
                          >
                            Phone (optional)
                          </label>
                          <input
                            id="calc-phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            className={fieldClass}
                          />
                        </p>
                      </div>

                      <input
                        type="checkbox"
                        name="botcheck"
                        tabIndex={-1}
                        aria-hidden="true"
                        className="hidden"
                      />

                      {error ? (
                        <p
                          role="alert"
                          className="mt-4 border-l-2 border-btn pl-4 text-sm text-charcoal"
                        >
                          {error}
                        </p>
                      ) : null}

                      <button
                        type="submit"
                        disabled={sending}
                        className="mt-5 rounded-sm bg-btn px-6 py-3.5 text-base font-medium text-btn-fg transition-colors hover:bg-btn-hover disabled:opacity-60"
                      >
                        {sending ? "Sending…" : "Show me the full projection"}
                      </button>

                      <p className="mt-4 text-xs leading-relaxed text-muted">
                        We&rsquo;ll only use this to reply. See the{" "}
                        <Link
                          href="/privacy"
                          className="text-heading underline decoration-accent-line underline-offset-4"
                        >
                          privacy policy
                        </Link>
                        . Prefer not to? Call {contact.phone}.
                      </p>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
