import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ConflictCalculator } from "@/components/conflict-calculator";
import { AssessmentCta } from "@/components/assessment-cta";
import { calculator } from "@/content/site";

/**
 * Ad landing page, reached mainly from paid traffic. Linked from the footer
 * so it is reachable by browsing too, but kept out of the header nav, which
 * is the buying path.
 *
 * `noindex` for now: the page is built and styled ahead of the campaign, and
 * shouldn't be crawled until the ads actually run. Remove the robots block
 * below to launch it.
 *
 * Section backgrounds alternate cream/paper down the page. The header and the
 * calculator both have fixed backgrounds, so the explanatory sections are
 * split around them to keep the sequence intact — see the comments below.
 */
export const metadata: Metadata = {
  title: "The Workplace Conflict Calculator",
  description:
    "Put a number on what an unresolved workplace conflict has already cost you, and what it costs over the next twelve months if nothing changes.",
  alternates: { canonical: "/conflict-calculator" },
  robots: { index: false, follow: false },
};

export default function ConflictCalculatorPage() {
  return (
    <>
      {/* cream */}
      <PageHeader
        eyebrow="Cost of conflict"
        title="Your biggest expense is the conversation nobody knows how to have"
        intro="Two people who can't be in the same room is not a personality problem. It's a line item. This puts a number on it."
      />

      {/* paper */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {calculator.whatItDoes.title}
          </h2>
          <div className="mt-6 max-w-3xl space-y-5">
            {calculator.whatItDoes.body.map((para) => (
              <p key={para} className="text-base leading-relaxed text-charcoal">
                {para}
              </p>
            ))}
          </div>

          <h3 className="display mt-14 text-xl text-heading">
            {calculator.benefits.title}
          </h3>
          <dl className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-3">
            {calculator.benefits.items.map((item) => (
              <div key={item.name} className="border-t border-rule pt-5">
                <dt className="display text-lg text-heading">{item.name}</dt>
                <dd className="mt-2 text-base leading-relaxed text-charcoal">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* cream — sits directly above the tool, which is where "how to use"
          earns its place. These steps are a genuine sequence, so unlike the
          four options on /collaborate they keep their numbers. */}
      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {calculator.howToUse.title}
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {calculator.howToUse.steps.map((step, index) => (
              <li key={step.name} className="border-t border-rule pt-5">
                <p className="label text-muted">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="display mt-2 text-lg text-heading">
                  {step.name}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-charcoal">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* paper — the component supplies its own background */}
      <ConflictCalculator />

      {/* cream */}
      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {calculator.understanding.title}
          </h2>
          <div className="mt-6 max-w-3xl space-y-5">
            {calculator.understanding.body.map((para) => (
              <p key={para} className="text-base leading-relaxed text-charcoal">
                {para}
              </p>
            ))}
          </div>

          <h3 className="label mt-12 text-slate">
            {calculator.understanding.considerationsTitle}
          </h3>
          <ul className="mt-5 max-w-3xl space-y-3">
            {calculator.understanding.considerations.map((point) => (
              <li
                key={point}
                className="border-b border-rule pb-3 text-base leading-relaxed text-charcoal"
              >
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* paper */}
      <section className="border-b border-rule bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <h2 className="display text-3xl text-heading sm:text-4xl">
            {calculator.nextSteps.title}
          </h2>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-charcoal">
            {calculator.nextSteps.intro}
          </p>
          <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {calculator.nextSteps.items.map((item) => (
              <div key={item.name} className="border-t border-rule pt-5">
                <dt className="display text-lg text-heading">{item.name}</dt>
                <dd className="mt-2 text-base leading-relaxed text-charcoal">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-10 max-w-3xl border-l-2 border-rule-strong pl-5 text-base leading-relaxed text-charcoal">
            {calculator.nextSteps.outro}
          </p>
        </div>
      </section>

      {/* cream */}
      <section className="border-b border-rule bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="label text-muted">{calculator.disclaimer.title}</h2>
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted">
            {calculator.disclaimer.body}
          </p>
        </div>
      </section>

      <AssessmentCta />
    </>
  );
}
