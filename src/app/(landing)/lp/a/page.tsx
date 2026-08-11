import type { Metadata } from "next";
import { ConflictCalculator } from "@/components/conflict-calculator";
import { LandingContactForm } from "@/components/landing-contact-form";
import { pageMetadata } from "@/lib/page-metadata";
import {
  calculator,
  contact,
  credentials,
  landing,
  proof,
} from "@/content/site";

/**
 * Variant A — "the statement of account".
 *
 * The design thesis: this page argues that a workplace conflict is a line
 * item, so the page is built as the invoice nobody sent. The hero is a
 * statement header with the amount left blank, and the calculator below is
 * what fills it in. There is no hero headline, deliberately — an unpaid bill
 * states the case faster than a sentence about it would.
 *
 * The type split from variant B is the point of difference. This page sets
 * figures and labels in the mono face (the ledger voice already in the
 * stack) and never uses Fraunces, which is variant B's whole character.
 * Palette is hers, pushed darker for the statement band.
 *
 * Copy is the same `calculator` export the /conflict-calculator page uses.
 */
export const metadata: Metadata = pageMetadata({
  title: "What is this conflict costing you?",
  description:
    "Two people who can't be in the same room is not a personality problem. It's a line item. Work out what it has cost so far, and what another year costs.",
  path: "/lp/a",
  noindex: true,
});

export default function LandingA() {
  return (
    <div className="bg-paper">
      {/* ---------- The statement ---------- */}
      <section className="on-dark bg-band text-sand">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
          <p className="label text-band-muted">{landing.statement.eyebrow}</p>

          <dl className="mt-10 space-y-0">
            {landing.statement.rows.map((row) => (
              <div
                key={row.label}
                className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 border-b border-band-rule py-3.5"
              >
                <dt className="label text-band-muted">{row.label}</dt>
                <dd className="font-mono text-sm text-band-fg sm:text-base">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          {/*
            The signature: an amount line left blank, drawn the way a paper
            form leaves one. A ruled space reads as waiting to be filled;
            dashes or a zero would read as an answer.
          */}
          <div className="mt-10 border-t-2 border-sand pt-7">
            <p className="label text-sand">{landing.statement.amountLabel}</p>
            <p
              aria-hidden
              className="mt-4 flex items-end gap-3 font-mono text-4xl leading-none text-band-muted sm:gap-4 sm:text-5xl"
            >
              <span className="pb-1">$</span>
              <span className="h-[1.15em] max-w-md flex-1 border-b-2 border-band-muted" />
            </p>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-band-muted">
              {landing.statement.amountHint}
            </p>
          </div>

          <p className="mt-12 max-w-2xl text-lg leading-relaxed text-band-fg">
            {landing.statement.lede}
          </p>

          <a
            href="#calculate"
            className="mt-10 inline-block rounded-sm bg-sand px-6 py-3.5 text-base font-medium text-deep transition-colors hover:bg-band-fg"
          >
            Work out the figure
          </a>
        </div>
      </section>

      {/* ---------- Proof, as a single quiet strip ---------- */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto flex max-w-4xl flex-wrap items-baseline gap-x-10 gap-y-3 px-6 py-6">
          {proof.map((p) => (
            <p key={p.label} className="font-mono text-sm text-heading">
              {p.figure}{" "}
              <span className="text-muted">{p.label.toLowerCase()}</span>
            </p>
          ))}
          <p className="font-mono text-sm text-muted">
            {credentials.panels.length} federal and state panels
          </p>
        </div>
      </section>

      {/* ---------- How to read it ---------- */}
      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-mono text-xl text-heading">
            {calculator.whatItDoes.title}
          </h2>
          <div className="mt-5 space-y-4">
            {calculator.whatItDoes.body.map((para) => (
              <p key={para} className="text-base leading-relaxed text-charcoal">
                {para}
              </p>
            ))}
          </div>

          <dl className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-3">
            {calculator.howToUse.steps.map((step) => (
              <div key={step.name} className="border-t border-rule pt-4">
                <dt className="font-mono text-sm text-heading">{step.name}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-charcoal">
                  {step.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- The itemization ---------- */}
      <div id="calculate" className="scroll-mt-4">
        <ConflictCalculator
          className="border-b border-rule bg-paper"
          fontClass="font-mono"
          ctaHref="#talk"
          ctaLabel="Talk to Therese"
        />
      </div>

      {/* ---------- What it means ---------- */}
      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="font-mono text-xl text-heading">
            {calculator.understanding.title}
          </h2>
          <div className="mt-5 space-y-4">
            {calculator.understanding.body.map((para) => (
              <p key={para} className="text-base leading-relaxed text-charcoal">
                {para}
              </p>
            ))}
          </div>
          <ul className="mt-8 space-y-2.5">
            {calculator.understanding.considerations.map((point) => (
              <li
                key={point}
                className="border-l-2 border-rule-strong pl-4 text-sm leading-relaxed text-charcoal"
              >
                {point}
              </li>
            ))}
          </ul>

          <h2 className="mt-16 font-mono text-xl text-heading">
            {calculator.nextSteps.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-charcoal">
            {calculator.nextSteps.intro}
          </p>
          <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {calculator.nextSteps.items.map((item) => (
              <div key={item.name} className="border-t border-rule pt-4">
                <dt className="font-mono text-sm text-heading">{item.name}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-charcoal">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 border-l-2 border-rule-strong pl-4 text-base leading-relaxed text-charcoal">
            {calculator.nextSteps.outro}
          </p>
        </div>
      </section>

      {/* ---------- Talk ---------- */}
      <section id="talk" className="border-b border-rule bg-paper scroll-mt-4">
        <div className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
          <h2 className="font-mono text-xl text-heading">
            {landing.talk.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-charcoal">
            {landing.talk.intro}
          </p>
          <div className="mt-10">
            <LandingContactForm source="lp-a" />
          </div>
        </div>
      </section>

      {/* ---------- Minimal foot: no nav, just who and how ---------- */}
      <footer className="on-dark bg-band text-sand">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <p className="font-mono text-base text-band-fg">{contact.name}</p>
          <p className="label mt-2 text-band-muted">
            {contact.roles.join(" · ")}
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <li>
              <a href={contact.phoneHref} className="hover:text-band-fg">
                {contact.phone}
              </a>
            </li>
            <li>
              <a href={contact.emailHref} className="hover:text-band-fg">
                {contact.email}
              </a>
            </li>
          </ul>
          <p className="mt-8 border-t border-band-rule pt-6 text-xs leading-relaxed text-band-muted">
            {calculator.disclaimer.body}
          </p>
          <p className="mt-4 text-xs text-band-muted">
            Copyright {contact.name} {new Date().getFullYear()}.{" "}
            {landing.foot.note}
          </p>
        </div>
      </footer>
    </div>
  );
}
