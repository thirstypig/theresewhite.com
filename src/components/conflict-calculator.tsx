"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  calculateConflictCost,
  clampField,
  usd,
  DEFAULTS,
  LIMITS,
  type ConflictInputs,
  type NumericField,
} from "@/lib/conflict-cost";
import { calculator as copy, contact } from "@/content/site";

/**
 * The Workplace Conflict Cost Calculator, rebuilt from Therese's second
 * version (workplace-conflict-calculator-v2.html) in the site's own design.
 *
 * Behaves like the original:
 *  - Results update on every keystroke. There is no Calculate button and no
 *    email gate; the copy promises "Nothing you enter is stored or sent
 *    anywhere", and this component keeps that promise — it makes no requests.
 *  - Money fields put commas in as you type, without moving the cursor.
 *  - An entry outside a field's range is counted as the nearest allowed
 *    value, and the field says so. Leaving the field rewrites it to that value.
 *  - "Example values" shows until the visitor changes anything.
 *  - On a phone, a bar pinned to the bottom shows the two headline figures
 *    whenever the results themselves are scrolled out of view.
 *  - Screen readers hear a short summary 0.8 seconds after typing stops,
 *    rather than every intermediate figure.
 */

type Texts = Record<NumericField, string>;

function commas(n: number): string {
  return n.toLocaleString("en-US");
}

function initialTexts(): Texts {
  const texts = {} as Texts;
  for (const field of Object.keys(LIMITS) as NumericField[]) {
    const value = DEFAULTS[field];
    texts[field] = LIMITS[field].money ? commas(value) : String(value);
  }
  return texts;
}

/** What the visitor typed, read as a number. Blank or unreadable is NaN. */
function readNumber(field: NumericField, text: string): number {
  if (LIMITS[field].money) {
    const digits = text.replace(/\D/g, "");
    return digits === "" ? Number.NaN : parseInt(digits, 10);
  }
  return parseFloat(text);
}

function formatted(field: NumericField, n: number): string {
  return LIMITS[field].money ? usd(n) : String(n);
}

/** "Counted as $2,000,000. Allowed range is $0 to $2,000,000." or nothing. */
function rangeMessage(field: NumericField, text: string): string {
  const raw = readNumber(field, text);
  const counted = clampField(field, raw);
  if (text === "" || !Number.isFinite(raw) || raw === counted) return "";
  const { min, max, whole } = LIMITS[field];
  return `Counted as ${formatted(field, counted)}. Allowed range is ${formatted(field, min)} to ${formatted(field, max)}${whole ? ", whole numbers" : ""}.`;
}

// Panels use rounded-[0.25rem], the same size as rounded-sm, on purpose:
// landing page B's theme turns every rounded-sm into a pill, which is right
// for its buttons and wrong for a tall card of form fields.
const inputClass =
  "w-full rounded-sm border border-rule bg-paper px-3.5 py-2.5 text-base text-charcoal tabular-nums outline-none transition-colors focus:border-btn";

function Help({ children }: { children: React.ReactNode }) {
  return (
    <span className="mt-1.5 block text-sm leading-relaxed text-muted">
      {children}
    </span>
  );
}

function RangeNote({ message }: { message: string }) {
  return (
    <span role="status" className="mt-1.5 block text-sm text-heading">
      {message}
    </span>
  );
}

function MoneyField({
  id,
  label,
  help,
  text,
  onText,
  onCommit,
}: {
  id: NumericField;
  label: string;
  help?: string;
  text: string;
  onText: (t: string) => void;
  onCommit: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);

  // Reformatting adds or removes commas, which would throw the cursor to the
  // end of the field. Put it back after the same number of digits it was
  // after before, which is where the visitor expects it.
  useLayoutEffect(() => {
    if (caret.current === null || !ref.current) return;
    try {
      ref.current.setSelectionRange(caret.current, caret.current);
    } catch {
      // Some input types refuse selection; this one is text, but be safe.
    }
    caret.current = null;
  }, [text]);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const el = e.target;
    const pos = el.selectionStart ?? 0;
    const digitsBefore = el.value.slice(0, pos).replace(/\D/g, "").length;
    const digits = el.value
      .replace(/\D/g, "")
      .replace(/^0+(?=\d)/, "")
      .slice(0, 12);
    const out = digits === "" ? "" : commas(parseInt(digits, 10));
    let next = 0;
    let seen = 0;
    while (next < out.length && seen < digitsBefore) {
      if (/\d/.test(out.charAt(next))) seen++;
      next++;
    }
    caret.current = next;
    onText(out);
  }

  const message = rangeMessage(id, text);
  return (
    <div>
      <label htmlFor={id} className="block text-base font-medium text-heading">
        {label}
      </label>
      <span className="relative mt-2 block">
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-base text-muted">
          $
        </span>
        <input
          ref={ref}
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={text}
          onChange={onChange}
          onBlur={onCommit}
          className={`${inputClass} pl-7`}
        />
      </span>
      {help ? <Help>{help}</Help> : null}
      {message ? <RangeNote message={message} /> : null}
    </div>
  );
}

function CountField({
  id,
  label,
  unit,
  text,
  onText,
  onCommit,
}: {
  id: NumericField;
  label: string;
  unit: string;
  text: string;
  onText: (t: string) => void;
  onCommit: () => void;
}) {
  const { min, max, whole } = LIMITS[id];
  const message = rangeMessage(id, text);
  return (
    <div>
      <label htmlFor={id} className="block text-base font-medium text-heading">
        {label}
      </label>
      <span className="mt-2 flex items-center gap-3">
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          step={whole || id === "months" ? 1 : undefined}
          value={text}
          onChange={(e) => onText(e.target.value)}
          onBlur={onCommit}
          className={`${inputClass} max-w-28`}
        />
        <span className="text-sm text-muted">{unit}</span>
      </span>
      {message ? <RangeNote message={message} /> : null}
    </div>
  );
}

function HoursField({
  id,
  label,
  sliderLabel,
  numberLabel,
  text,
  onText,
  onCommit,
}: {
  id: NumericField;
  label: string;
  sliderLabel: string;
  numberLabel: string;
  text: string;
  onText: (t: string) => void;
  onCommit: () => void;
}) {
  const { min, max } = LIMITS[id];
  const message = rangeMessage(id, text);
  return (
    <div>
      <span className="block text-base font-medium text-heading">{label}</span>
      <Help>{copy.hoursHelp}</Help>
      <span className="mt-3 flex items-center gap-4">
        <input
          type="range"
          min={min}
          max={max}
          value={clampField(id, readNumber(id, text))}
          onChange={(e) => onText(e.target.value)}
          aria-label={sliderLabel}
          className="min-w-0 flex-1 accent-[var(--btn)]"
        />
        <input
          id={id}
          type="number"
          min={min}
          max={max}
          value={text}
          onChange={(e) => onText(e.target.value)}
          onBlur={onCommit}
          aria-label={numberLabel}
          className={`${inputClass} max-w-20`}
        />
        <span className="shrink-0 text-sm text-muted">{copy.units.hours}</span>
      </span>
      {message ? <RangeNote message={message} /> : null}
    </div>
  );
}

function Card({
  title,
  fontClass,
  children,
}: {
  title: string;
  fontClass: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[0.25rem] border border-rule bg-cream p-6 sm:p-8">
      <h2 className={`${fontClass} text-2xl text-heading`}>{title}</h2>
      <div className="mt-6 space-y-7">{children}</div>
    </section>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-rule py-2.5 last:border-b-0">
      <span className="text-sm text-charcoal">{label}</span>
      <span className="font-mono text-sm tabular-nums text-heading">
        {value}
      </span>
    </div>
  );
}

export function ConflictCalculator({
  ctaHref,
  ctaExternal = false,
  className = "border-b border-rule bg-paper",
  fontClass = "display",
  stickyTop = "lg:top-6",
}: {
  /**
   * Where "Schedule Your Free Confidential Assessment" goes. The main site
   * sends it to /contact; the landing pages to their own on-page form; the
   * standalone calculator site, which has no other pages, to Therese's
   * Calendly booking page.
   */
  ctaHref: string;
  /** Open the button in a new tab, as the original does for its link out. */
  ctaExternal?: boolean;
  /** Outer section classes, so a host page can own its own surface. */
  className?: string;
  /**
   * Face for the headings inside the tool. Defaults to the site's display
   * serif. Landing page B passes the live site's face instead, so the tool
   * matches the page around it.
   */
  fontClass?: string;
  /**
   * How far below the top of the window the results stop while scrolling.
   * A page with a header that stays pinned must clear it, or the headline
   * figure slides under the header.
   */
  stickyTop?: string;
}) {
  const [texts, setTexts] = useState<Texts>(initialTexts);
  const [loaded, setLoaded] = useState(false);
  const [edited, setEdited] = useState(false);

  const setText = (field: NumericField) => (t: string) => {
    setEdited(true);
    setTexts((prev) => ({ ...prev, [field]: t }));
  };

  // Leaving a field rewrites it to the value actually being counted.
  const commit = (field: NumericField) => () => {
    setTexts((prev) => {
      const counted = clampField(field, readNumber(field, prev[field]));
      const text = LIMITS[field].money ? commas(counted) : String(counted);
      return text === prev[field] ? prev : { ...prev, [field]: text };
    });
  };

  const inputs = { loaded } as ConflictInputs;
  for (const field of Object.keys(LIMITS) as NumericField[]) {
    inputs[field] = readNumber(field, texts[field]);
  }
  const result = calculateConflictCost(inputs);

  const field = (id: NumericField) => ({
    id,
    text: texts[id],
    onText: setText(id),
    onCommit: commit(id),
  });

  // Screen-reader summary, announced once typing pauses.
  const [announcement, setAnnouncement] = useState("");
  const summary = `Total to date ${usd(result.total)}. In 12 months ${usd(result.projections[12].total)}.`;
  useEffect(() => {
    const t = setTimeout(() => setAnnouncement(summary), 800);
    return () => clearTimeout(t);
  }, [summary]);

  // The phone bar is pointless while the results themselves are on screen.
  const resultsRef = useRef<HTMLDivElement>(null);
  const [resultsVisible, setResultsVisible] = useState(false);
  useEffect(() => {
    const el = resultsRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) =>
      setResultsVisible(entry.isIntersecting),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const r = copy.results;
  const close = copy.close;
  const externalProps = ctaExternal
    ? { target: "_blank", rel: "noopener" }
    : {};

  return (
    <section className={className}>
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-8 sm:pt-20 sm:pb-10">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-start">
          {/* ---------------- Inputs ---------------- */}
          <div className="space-y-6">
            <label
              htmlFor="loaded"
              className="flex cursor-pointer gap-4 rounded-[0.25rem] border border-rule-strong bg-paper p-5 sm:p-6"
            >
              <input
                id="loaded"
                type="checkbox"
                checked={loaded}
                onChange={(e) => {
                  setEdited(true);
                  setLoaded(e.target.checked);
                }}
                className="mt-1 size-4 shrink-0 accent-[var(--btn)]"
              />
              <span>
                <span className="block text-lg font-bold text-heading">
                  {copy.loaded.label}
                </span>
                <Help>{copy.loaded.help}</Help>
              </span>
            </label>

            <Card title={copy.pair.title} fontClass={fontClass}>
              <MoneyField
                {...field("person1Salary")}
                label={copy.pair.person1Salary}
                help={copy.baseSalaryOnly}
              />
              <MoneyField
                {...field("person2Salary")}
                label={copy.pair.person2Salary}
                help={copy.baseSalaryOnly}
              />
              <p className="border-l-2 border-rule-strong pl-4 text-sm leading-relaxed text-charcoal">
                <strong className="block font-medium text-heading">
                  {copy.pair.timeLost.title}
                </strong>
                {copy.pair.timeLost.body}
              </p>
              <HoursField
                {...field("person1Hours")}
                label={copy.pair.person1Hours}
                sliderLabel="Person 1 weekly hours of productive time lost, slider"
                numberLabel="Person 1 weekly hours"
              />
              <HoursField
                {...field("person2Hours")}
                label={copy.pair.person2Hours}
                sliderLabel="Person 2 weekly hours of productive time lost, slider"
                numberLabel="Person 2 weekly hours"
              />
              <CountField
                {...field("months")}
                label={copy.pair.months}
                unit={copy.units.months}
              />
            </Card>

            <Card title={copy.ripple.title} fontClass={fontClass}>
              <p className="text-base leading-relaxed text-charcoal">
                {copy.ripple.hint}
              </p>
              <CountField
                {...field("rippleCount")}
                label={copy.ripple.count}
                unit={copy.units.people}
              />
              <MoneyField
                {...field("rippleSalary")}
                label={copy.ripple.salary}
                help={copy.baseSalaryOnly}
              />
              <HoursField
                {...field("rippleHours")}
                label={copy.ripple.hours}
                sliderLabel="Ripple weekly hours slider"
                numberLabel="Ripple weekly hours"
              />
            </Card>

            <Card title={copy.outOfPocket.title} fontClass={fontClass}>
              <p className="text-base leading-relaxed text-charcoal">
                {copy.outOfPocket.hintBefore}
                <u className="decoration-rule-strong underline-offset-4">
                  {copy.outOfPocket.hintUnderlined}
                </u>
                {copy.outOfPocket.hintAfter}
              </p>
              <MoneyField
                {...field("outOfPocket")}
                label={copy.outOfPocket.label}
              />
            </Card>

            <Card title={copy.lostBusiness.title} fontClass={fontClass}>
              <p className="text-base leading-relaxed text-charcoal">
                {copy.lostBusiness.hint}
              </p>
              <MoneyField
                {...field("lostBusiness")}
                label={copy.lostBusiness.label}
              />
            </Card>
          </div>

          {/* ---------------- Results ---------------- */}
          {/*
              Sticky on wide screens, so the figures stay in view while the
              visitor drags a slider far below them. Not on short screens:
              the column is taller than the window there, and a sticky column
              taller than the window hides its own bottom half.
            */}
          <aside
            className={`space-y-6 lg:sticky ${stickyTop} [@media(max-height:900px)]:static`}
          >
            <div
              ref={resultsRef}
              className="overflow-hidden rounded-[0.25rem] border border-rule bg-paper"
            >
              <div className="on-dark bg-band p-6 text-band-fg sm:p-8">
                <p className="label flex flex-wrap items-center gap-2 text-band-muted">
                  {r.total}
                  {!edited ? (
                    <span className="rounded-full border border-band-rule px-2 py-0.5 text-band-fg">
                      {r.exampleBadge}
                    </span>
                  ) : null}
                  {loaded ? (
                    <span className="rounded-full border border-band-rule px-2 py-0.5 text-band-fg">
                      {r.loadedBadge}
                    </span>
                  ) : null}
                </p>
                <p className="mt-3 font-mono text-4xl tabular-nums text-band-fg sm:text-5xl">
                  {usd(result.total)}
                </p>
              </div>

              <div className="px-6 py-3 sm:px-8">
                <Line label={r.lines.pair} value={usd(result.lines.pair)} />
                <Line label={r.lines.ripple} value={usd(result.lines.ripple)} />
                <Line
                  label={r.lines.outOfPocket}
                  value={usd(result.lines.outOfPocket)}
                />
                <Line
                  label={r.lines.lostBusiness}
                  value={usd(result.lines.lostBusiness)}
                />
              </div>

              <div className="border-t border-rule bg-cream px-6 py-6 sm:px-8">
                <h3 className={`${fontClass} text-xl text-heading`}>
                  {r.projectionTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">
                  {r.rateBefore}
                  <span className="font-mono tabular-nums text-heading">
                    {usd(result.monthlyRate)}
                  </span>
                  {r.rateAfter}
                </p>
                <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
                  {([3, 6, 12] as const).map((n) => (
                    <div
                      key={n}
                      className={`rounded-[0.25rem] border p-3.5 ${
                        n === 12
                          ? "on-dark border-band bg-band text-band-fg"
                          : "border-rule bg-paper"
                      }`}
                    >
                      <small
                        className={`label block ${n === 12 ? "text-band-muted" : "text-muted"}`}
                      >
                        {r.horizon(n)}
                      </small>
                      <b
                        className={`mt-1.5 block font-mono text-lg font-normal tabular-nums ${n === 12 ? "text-band-fg" : "text-heading"}`}
                      >
                        {usd(result.projections[n].total)}
                      </b>
                      <em
                        className={`mt-0.5 block text-xs not-italic tabular-nums ${n === 12 ? "text-band-muted" : "text-muted"}`}
                      >
                        {usd(result.projections[n].more)}
                        {r.more}
                      </em>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted">{r.planningOnly}</p>
              </div>
            </div>

            <div className="rounded-[0.25rem] border border-rule bg-cream p-6 sm:p-8">
              <p className="text-base leading-relaxed text-charcoal">
                <b className="font-semibold text-heading">{close.noteLead}</b>
                {close.note}
              </p>
              <p className="mt-4 text-base leading-relaxed font-semibold text-heading">
                {close.caseload}
              </p>
              <p className="mt-4 text-base leading-relaxed text-charcoal">
                {close.ask}
              </p>
              <a
                href={ctaHref}
                {...externalProps}
                className="cta-button mt-6 block rounded-sm bg-btn px-6 py-3.5 text-center text-base font-medium text-btn-fg transition-colors hover:bg-btn-hover"
              >
                {close.button}
              </a>
              <div className="mt-6 border-t border-rule pt-5">
                <h3 className="text-lg font-bold text-heading">{close.urgentTitle}</h3>
                <p className="mt-3 text-sm leading-relaxed text-charcoal">
                  {close.urgentBefore}
                  <a
                    href={contact.phoneHref}
                    className="text-heading underline decoration-accent-line underline-offset-4 hover:decoration-heading"
                  >
                    {close.urgentPhone}
                  </a>
                  {close.urgentMiddle}
                  <a
                    href={contact.emailHref}
                    className="text-heading underline decoration-accent-line underline-offset-4 hover:decoration-heading"
                  >
                    {close.urgentEmail}
                  </a>
                  {close.urgentAfter}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">
                  {close.urgentPromise}
                </p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-8 max-w-3xl space-y-3 border-t border-rule pt-6 text-xs leading-relaxed text-muted">
          <p>
            {copy.method}{" "}
            <b className="font-semibold text-charcoal">{copy.privacy}</b>
          </p>
          <p>
            <b className="font-semibold text-charcoal">{copy.disclaimer.title}</b>
            {copy.disclaimer.body}
          </p>
        </div>
      </div>

      {/* Phones only, and only while the results are out of view. Hidden
          from screen readers: the live summary below says the same thing. */}
      <div
        aria-hidden="true"
        className={`on-dark fixed inset-x-0 bottom-0 z-40 justify-between gap-4 bg-band px-5 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom,0px))] text-band-fg lg:hidden ${
          resultsVisible ? "hidden" : "flex"
        }`}
      >
        <div>
          <small className="label block text-band-muted">{r.barToDate}</small>
          <b className="font-mono text-lg font-normal tabular-nums">
            {usd(result.total)}
          </b>
        </div>
        <div className="text-right">
          <small className="label block text-band-muted">{r.barTwelve}</small>
          <b className="font-mono text-lg font-normal tabular-nums">
            {usd(result.projections[12].total)}
          </b>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}
